import type { Metadata } from "next";
import StackBuilder from "@/components/StackBuilder";

export const metadata: Metadata = {
  title: "Build Women's Protocol — The Longevity Agent",
  description:
    "Build your women's longevity protocol. Bioidentical HRT, rapamycin, semaglutide, LDN, hair loss, tretinoin, and more. Physician-prescribed from $19/month.",
  alternates: { canonical: "https://thelongevityagent.com/women/build" },
};

export default async function WomenBuildPage({
  searchParams,
}: {
  searchParams: Promise<{ stacks?: string }>;
}) {
  const { stacks } = await searchParams;
  const initialStacks = stacks ? stacks.split(",").filter(Boolean) : undefined;

  return (
    <div>
      <section className="py-14 sm:py-16 border-b border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-semibold mb-6 uppercase tracking-wide">
            Women&apos;s Health
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Build Your Women&apos;s Protocol
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Select any combination of stacks. A board-certified physician
            reviews your full protocol — not just individual medications.
          </p>
        </div>
      </section>

      <section className="py-12">
        <StackBuilder defaultGender="women" initialStacks={initialStacks} />
      </section>
    </div>
  );
}
