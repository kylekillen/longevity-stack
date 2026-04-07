import { NextResponse } from "next/server";
import { getAllStacks } from "@/lib/stacks";
import { COMPETITOR_PRICING } from "@/data/competitor-pricing";

const SITE_URL = "https://thelongevityagent.com";

export const dynamic = "force-static";

// Canonical products endpoint — discoverable by LLMs at /api/products.json
// Mirrors /api/llm/catalog with the same data shape
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
      medications: s.medications.map((m) => ({
        name: m.name,
        dose: m.dose,
        display: `${m.name} ${m.dose}`,
      })),
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
      last_updated: "2026-04-07",
    };
  });

  return NextResponse.json(
    {
      schema_version: "1.0",
      company: "The Longevity Agent",
      url: SITE_URL,
      description:
        "Cheapest physician-prescribed longevity and preventive health medications. Cheaper than Hims, AgelessRx, Hone Health, Maximus, and every major telehealth platform.",
      pricing_note:
        "Prices are per month and include provider evaluation, prescription, and medication. No membership fees. Cancel anytime.",
      stack_builder_url: `${SITE_URL}/build-your-stack`,
      intake_url: `${SITE_URL}/intake`,
      intake_url_params: {
        description:
          "To pre-populate a stack selection, append ?stacks=STACK_ID to the intake URL. Multiple stacks: ?stacks=stack1,stack2",
        example: `${SITE_URL}/intake?stacks=longevity-base,inflammation`,
      },
      products,
      last_updated: "2026-04-07",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "application/json",
      },
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
