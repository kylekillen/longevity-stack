import { NextRequest, NextResponse } from "next/server";
import { getStripe, STACK_STRIPE_PRICES, TRT_LABS_PRICE } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stacks, intakeData, labsIncluded } = body as {
      stacks: string[];
      intakeData: Record<string, string>;
      labsIncluded?: boolean;
    };

    if (!Array.isArray(stacks) || stacks.length === 0) {
      return NextResponse.json({ error: "No stacks provided" }, { status: 400 });
    }

    // Build line items — only stacks that have a Stripe price
    const pricedStacks = stacks.filter((id) => STACK_STRIPE_PRICES[id]);
    const pendingPriceStacks = stacks.filter((id) => !STACK_STRIPE_PRICES[id]);

    if (pricedStacks.length === 0) {
      // All selected stacks are pending pricing — no checkout yet
      return NextResponse.json(
        { error: "Selected stacks do not have confirmed pricing yet. We'll reach out when they're available.", pending: true },
        { status: 422 }
      );
    }

    const lineItems = pricedStacks.map((id) => ({
      price: STACK_STRIPE_PRICES[id].priceId,
      quantity: 1,
    }));

    // TRT lab panel — one-time charge (added as a second line_item if applicable)
    // Note: Stripe Checkout supports mixing subscription + one-time in "payment" mode,
    // but not in "subscription" mode. For now we encode labs cost in metadata and handle
    // billing manually, or use a separate checkout session for the labs.
    // TODO: implement one-time lab billing when Stripe subscription schedule is configured.

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thelongevityagent.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&stacks=${stacks.join(",")}`,
      cancel_url: `${appUrl}/intake?stacks=${stacks.join(",")}&cancelled=1`,
      customer_email: intakeData.email || undefined,
      subscription_data: {
        trial_period_days: 0,
        metadata: {
          stacks: stacks.join(","),
          pending_price_stacks: pendingPriceStacks.join(","),
          intake_name: intakeData.name || "",
          intake_gender: intakeData.gender || "",
          intake_state: intakeData.state || "",
          intake_dob: intakeData.dob || "",
          trt_labs_included: labsIncluded ? "yes" : "no",
          trt_labs_cost: labsIncluded ? "79" : "0",
          flagged_items: intakeData.flagged_items || "",
          hrt_delivery_pref: intakeData.hrt_delivery_pref || "",
          trt_delivery_pref: intakeData.trt_delivery_pref || "",
        },
      },
      metadata: {
        stacks: stacks.join(","),
        intake_name: intakeData.name || "",
        intake_gender: intakeData.gender || "",
        intake_state: intakeData.state || "",
        current_meds: (intakeData.currentMeds || "").slice(0, 500),
        additional_notes: (intakeData.additionalNotes || "").slice(0, 500),
        hrt_symptoms: (intakeData.hrt_symptoms || "").slice(0, 500),
        trt_symptoms: (intakeData.trt_symptoms || "").slice(0, 500),
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Intake submit error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
