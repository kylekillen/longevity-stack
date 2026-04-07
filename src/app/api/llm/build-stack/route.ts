import { NextRequest, NextResponse } from "next/server";
import { getAllStacks } from "@/lib/stacks";

const SITE_URL = "https://thelongevityagent.com";

export async function POST(req: NextRequest) {
  let body: { stacks?: string[]; gender?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { stacks: requestedIds = [], gender } = body;

  if (!Array.isArray(requestedIds) || requestedIds.length === 0) {
    return NextResponse.json({ error: "Provide at least one stack ID in 'stacks' array" }, { status: 400 });
  }

  const allStacks = getAllStacks();
  const resolved = requestedIds
    .map((id) => allStacks.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s && !s.waitlist);

  if (resolved.length === 0) {
    return NextResponse.json(
      {
        error: "No valid stacks found. Valid stack IDs: " + allStacks.filter((s) => !s.waitlist).map((s) => s.id).join(", "),
      },
      { status: 400 }
    );
  }

  // Enforce mutual exclusivity: last write wins
  const selected: typeof allStacks = [];
  for (const stack of resolved) {
    const conflicts = stack.exclusiveWith ?? [];
    const filtered = selected.filter((s) => !conflicts.includes(s.id));
    filtered.push(stack);
    selected.length = 0;
    selected.push(...filtered);
  }

  const monthlyTotal = selected
    .filter((s) => s.ourPrice !== null)
    .reduce((sum, s) => sum + (s.ourPrice ?? 0), 0);

  const medications = selected.flatMap((s) =>
    s.medications.map((m) => ({ stack: s.name, medication: m.name, dose: m.dose }))
  );

  const params = new URLSearchParams();
  params.set("stacks", selected.map((s) => s.id).join(","));
  if (gender) params.set("gender", gender);

  return NextResponse.json(
    {
      stacks: selected.map((s) => ({
        id: s.id,
        name: s.name,
        price_monthly: s.ourPrice,
        url: `${SITE_URL}/stacks/${s.id}`,
      })),
      monthly_total: monthlyTotal,
      has_pending_prices: selected.some((s) => s.ourPrice === null),
      medications,
      intake_url: `${SITE_URL}/intake?${params.toString()}`,
      stack_builder_url: `${SITE_URL}/build-your-stack?${gender ? `gender=${gender}` : ""}`,
    },
    {
      headers: { "Access-Control-Allow-Origin": "*" },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
