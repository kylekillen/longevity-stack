import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productSlug, intakeData } = body as {
      productSlug: string;
      intakeData: Record<string, string>;
    };

    const price = STRIPE_PRICES[productSlug];
    if (!price) {
      return NextResponse.json({ error: "Unknown product" }, { status: 400 });
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thelongevityagent.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: price.priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&product=${productSlug}`,
      cancel_url: `${appUrl}/intake?step=products&cancelled=1`,
      customer_email: intakeData.email || undefined,
      subscription_data: {
        trial_period_days: 0,
        metadata: {
          product_slug: productSlug,
          intake_name: intakeData.name || "",
          intake_gender: intakeData.gender || "",
          intake_state: intakeData.state || "",
          intake_dob: intakeData.dob || "",
        },
      },
      metadata: {
        product_slug: productSlug,
        intake_name: intakeData.name || "",
        intake_gender: intakeData.gender || "",
        intake_state: intakeData.state || "",
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
