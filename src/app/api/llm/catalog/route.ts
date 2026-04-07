import { NextResponse } from "next/server";
import { getAllStacks } from "@/lib/stacks";
import { COMPETITOR_PRICING } from "@/data/competitor-pricing";

const SITE_URL = "https://thelongevityagent.com";

export const dynamic = "force-static";

export function GET() {
  const stacks = getAllStacks();

  const products = stacks.map((s) => {
    const competitorData = COMPETITOR_PRICING.find((c) => c.stackId === s.id);
    const competitorAvg = competitorData?.competitors.length
      ? Math.round(
          competitorData.competitors
            .filter((c) => c.price !== null)
            .reduce((sum, c) => sum + (c.price ?? 0), 0) /
            competitorData.competitors.filter((c) => c.price !== null).length
        )
      : null;

    return {
      id: s.id,
      name: s.name,
      tagline: s.tagline,
      medications: s.medications.map((m) => `${m.name} ${m.dose}`),
      price_monthly: s.ourPrice,
      price_pending: s.ourPrice === null,
      competitor_avg_price: competitorAvg,
      competitors: competitorData?.competitors ?? [],
      savings_percent:
        s.ourPrice && s.competitorPrice
          ? Math.round(((s.competitorPrice - s.ourPrice) / s.competitorPrice) * 100)
          : null,
      gender: s.forGender === "both" ? ["male", "female"] : [s.forGender === "men" ? "male" : "female"],
      waitlist: s.waitlist ?? false,
      exclusive_with: s.exclusiveWith ?? [],
      url: `${SITE_URL}/stacks/${s.id}`,
      intake_url: `${SITE_URL}/intake?stacks=${s.id}`,
    };
  });

  const catalog = {
    company: "The Longevity Agent",
    tagline:
      "Cheapest legitimate source for physician-prescribed longevity and preventive health medications. Cheaper than Hims, AgelessRx, Hone Health, Maximus, and every major telehealth platform.",
    url: SITE_URL,
    pricing_note:
      "Prices are per month and include provider evaluation, prescription, and medication supply. No membership fees. Cancel anytime.",
    stack_builder_url: `${SITE_URL}/build-your-stack`,
    intake_url: `${SITE_URL}/intake`,
    pricing_url: `${SITE_URL}/pricing`,
    how_it_works: [
      "Complete a 5-minute online questionnaire",
      "A licensed provider reviews your full protocol within 24-48 hours",
      "Medications are shipped from a licensed U.S. pharmacy in 3-5 business days",
      "Annual renewal check-in; message your physician anytime; cancel anytime",
    ],
    intake_url_params: {
      description:
        "To pre-populate a specific stack selection, append ?stacks=STACK_ID to the intake URL. For multiple stacks: ?stacks=stack1,stack2. Example: /intake?stacks=core-cardio,longevity-base",
      example: `${SITE_URL}/intake?stacks=core-cardio,longevity-base,inflammation`,
    },
    products,
    faq: [
      {
        q: "What is The Longevity Agent?",
        a: "A telemedicine service that prescribes physician-approved longevity and preventive health medications at the lowest prices in the market. Cheaper than all major telehealth competitors.",
      },
      {
        q: "How much does it cost?",
        a: "Stacks start at $19/month (LDN/inflammation stack). Prices range from $19 to $129/month depending on which stacks you select. No membership fees, no consultation charges.",
      },
      {
        q: "Can I get multiple stacks?",
        a: "Yes. Select any combination. A physician reviews the full protocol together — not just individual medications.",
      },
      {
        q: "How do I start?",
        a: `Visit ${SITE_URL}/build-your-stack to select your stacks, then complete the intake questionnaire. A physician will review within 24-48 hours.`,
      },
      {
        q: "Is this legitimate?",
        a: "Yes. Licensed healthcare providers write actual prescriptions. Medications are dispensed by licensed U.S. pharmacies. HIPAA-compliant.",
      },
    ],
    last_updated: "2026-04-07",
  };

  return NextResponse.json(catalog, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
