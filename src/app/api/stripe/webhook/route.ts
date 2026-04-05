import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/config";
import Stripe from "stripe";

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const productSlug = session.metadata?.product_slug;
      const customerEmail = session.customer_email || session.customer_details?.email;

      console.log(`New subscription: ${productSlug} — ${customerEmail}`);

      // TODO: When Supabase is configured:
      // 1. Create or find user by email
      // 2. Insert intake record with health questionnaire data
      // 3. Queue physician review notification
      // 4. Send confirmation email via Resend
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(`Subscription cancelled: ${sub.id}`);
      // TODO: Update subscription status in DB, send cancellation email
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`Payment failed for: ${invoice.customer_email}`);
      // TODO: Send payment failed email, pause shipment
      break;
    }
  }

  return NextResponse.json({ received: true });
}
