import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/config";
import Stripe from "stripe";

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

async function getAdminClient() {
  if (!SUPABASE_CONFIGURED) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await getAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const productSlug = session.metadata?.product_slug;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const intakeName = session.metadata?.intake_name || "";
      const intakeGender = session.metadata?.intake_gender || "";
      const intakeState = session.metadata?.intake_state || "";

      console.log(`New subscription: ${productSlug} — ${customerEmail}`);

      if (supabase && customerEmail && productSlug) {
        // Find or create user
        const { data: existingUser } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("email", customerEmail)
          .single();

        let userId = existingUser?.id;

        if (!userId) {
          // Create auth user + profile
          const { data: newAuthUser } = await supabase.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
            user_metadata: { name: intakeName },
          });
          userId = newAuthUser?.user?.id;

          if (userId) {
            await supabase.from("user_profiles").upsert({
              id: userId,
              email: customerEmail,
              name: intakeName,
              gender: intakeGender || null,
              state: intakeState || null,
              stripe_customer_id: session.customer as string,
            });
          }
        }

        if (userId) {
          // Create subscription record
          await supabase.from("subscriptions").insert({
            user_id: userId,
            product_slug: productSlug,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: "active",
          });

          // Create intake record
          const { data: intake } = await supabase
            .from("intake_records")
            .insert({
              user_id: userId,
              product_slug: productSlug,
              stripe_session_id: session.id,
              status: "pending_review",
            })
            .select("id")
            .single();

          // Queue for physician review
          if (intake?.id) {
            await supabase.from("physician_queue").insert({
              intake_id: intake.id,
              user_id: userId,
              product_slug: productSlug,
              status: "queued",
            });
          }
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(`Subscription cancelled: ${sub.id}`);

      if (supabase) {
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", cancel_at_period_end: false })
          .eq("stripe_subscription_id", sub.id);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      if (supabase) {
        const subAny = sub as unknown as Record<string, unknown>;
        await supabase
          .from("subscriptions")
          .update({
            status: sub.status === "active" ? "active" : sub.status,
            cancel_at_period_end: sub.cancel_at_period_end,
            current_period_start: subAny["current_period_start"]
              ? new Date((subAny["current_period_start"] as number) * 1000).toISOString()
              : null,
            current_period_end: subAny["current_period_end"]
              ? new Date((subAny["current_period_end"] as number) * 1000).toISOString()
              : null,
          })
          .eq("stripe_subscription_id", sub.id);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
      console.log(`Payment failed for: ${invoice.customer_email}`);
      if (supabase && invoice.subscription) {
        await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", invoice.subscription);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
