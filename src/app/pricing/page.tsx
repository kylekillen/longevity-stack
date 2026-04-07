import Link from "next/link";
import { getAllStacks, getMensStacks, getWomensStacks, stackSavingsPercent } from "@/lib/stacks";
import { COMPETITOR_PRICING } from "@/data/competitor-pricing";
import ComparisonTable from "@/components/ComparisonTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — The Longevity Agent",
  description:
    "We're cheaper than every major longevity telehealth platform. Full price comparison: GLP-1, TRT, HRT, rapamycin, LDN, hair loss, skin. Starting at $19/month.",
};

const CATEGORIES = [
  {
    id: "hair",
    label: "Hair",
    stackIds: ["hair-men", "hair-pro-men", "hair-women"],
    desc: "Male and female pattern hair loss.",
  },
  {
    id: "skin",
    label: "Skin",
    stackIds: ["skin"],
    desc: "Prescription-grade anti-aging topicals.",
  },
  {
    id: "cardiovascular",
    label: "Cardiovascular",
    stackIds: ["core-cardio"],
    desc: "Statin + PDE5 inhibitor combination.",
  },
  {
    id: "hormones",
    label: "Hormones",
    stackIds: ["testosterone-enhancement", "testosterone-replacement", "womens-hrt"],
    desc: "TRT, enclomiphene, and women's HRT.",
  },
  {
    id: "longevity",
    label: "Longevity",
    stackIds: ["longevity-base", "longevity-sglt2"],
    desc: "mTOR, AMPK, and glucose pathways.",
  },
  {
    id: "weight",
    label: "Weight / Metabolic",
    stackIds: ["longevity-glp1"],
    desc: "Compounded GLP-1 with cardiovascular evidence.",
  },
  {
    id: "inflammation",
    label: "Inflammation",
    stackIds: ["inflammation"],
    desc: "Low-dose naltrexone for immune modulation.",
  },
];

export default function PricingPage() {
  const allStacks = getAllStacks();
  const mensStacks = getMensStacks().filter((s) => !s.waitlist);
  const womensStacks = getWomensStacks().filter((s) => !s.waitlist);

  return (
    <div>

      {/* Hero */}
      <section className="py-16 sm:py-20 border-b border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            We&apos;re cheaper than everyone.<br />
            <span className="text-[var(--accent)]">Here&apos;s the proof.</span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            No membership fees. No consultation charges. One flat monthly rate per stack
            that includes physician review, prescription, and medication.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build-your-stack"
              className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-8 py-3.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              Build Your Stack
            </Link>
            <a
              href="#comparison"
              className="inline-flex items-center justify-center gap-2 border border-[var(--card-border)] text-[var(--foreground)] font-semibold px-8 py-3.5 rounded-lg hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors"
            >
              See Full Comparison ↓
            </a>
          </div>
        </div>
      </section>

      {/* Master table — all stacks */}
      <section className="py-16 border-b border-[var(--card-border)]" id="comparison">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">All stacks</h2>
          <p className="text-sm text-[var(--muted)] mb-8">Our price vs. typical telehealth clinic or competitor platform.</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[var(--card-border)]">
                  <th className="text-left py-3 pr-6 text-sm font-semibold text-[var(--foreground)]">Stack</th>
                  <th className="text-left py-3 pr-6 text-sm font-semibold text-[var(--muted)] hidden sm:table-cell">Medications</th>
                  <th className="text-right py-3 pr-6 text-sm font-semibold text-[var(--green)]">Our Price</th>
                  <th className="text-right py-3 pr-6 text-sm font-semibold text-[var(--muted)] hidden md:table-cell">Elsewhere</th>
                  <th className="text-right py-3 text-sm font-semibold text-[var(--muted)] hidden md:table-cell">You Save</th>
                  <th className="py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]">
                {allStacks.map((stack) => {
                  const savings = stackSavingsPercent(stack);
                  return (
                    <tr key={stack.id} className="hover:bg-[var(--surface)] transition-colors">
                      <td className="py-4 pr-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stack.color }} />
                          <Link
                            href={`/stacks/${stack.id}`}
                            className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                          >
                            {stack.name}
                          </Link>
                          {stack.waitlist && (
                            <span className="text-xs text-[var(--muted)] bg-[var(--surface)] border border-[var(--card-border)] px-1.5 py-0.5 rounded-full">Waitlist</span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--muted)] sm:hidden mt-0.5 ml-5">
                          {stack.medications.map((m) => m.name).join(" + ")}
                        </p>
                      </td>
                      <td className="py-4 pr-6 text-sm text-[var(--muted)] hidden sm:table-cell">
                        {stack.medications.map((m) => m.name).join(" + ")}
                      </td>
                      <td className="py-4 pr-6 text-right">
                        {stack.waitlist ? (
                          <span className="text-sm text-[var(--muted)]">—</span>
                        ) : stack.ourPrice !== null ? (
                          <>
                            <span className="text-xl font-bold text-[var(--green)]">${stack.ourPrice}</span>
                            <span className="text-xs text-[var(--muted)] ml-1">/mo</span>
                          </>
                        ) : (
                          <span className="text-sm text-[var(--muted-light)] font-mono">{"{{PRICE}}"}</span>
                        )}
                      </td>
                      <td className="py-4 pr-6 text-right text-sm text-[var(--muted-light)] line-through hidden md:table-cell">
                        {stack.competitorPrice ? `$${stack.competitorPrice}` : "—"}
                      </td>
                      <td className="py-4 text-right hidden md:table-cell">
                        {savings ? (
                          <span className="text-sm font-semibold text-[var(--green)] bg-[var(--green-dim)] px-2 py-0.5 rounded-full">−{savings}%</span>
                        ) : (
                          <span className="text-sm text-[var(--muted-light)]">—</span>
                        )}
                      </td>
                      <td className="py-4 pl-4">
                        <Link href={`/stacks/${stack.id}`} className="text-sm text-[var(--accent)] font-medium hover:underline whitespace-nowrap">
                          Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Category sections */}
      <section className="py-16 bg-[var(--surface)] border-b border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">Competitor comparisons by category</h2>
          <p className="text-sm text-[var(--muted)] mb-10">
            Every major competitor, every stack. Our row is highlighted.
          </p>

          <div className="space-y-12">
            {CATEGORIES.map((cat) => {
              const catStacks = allStacks.filter((s) => cat.stackIds.includes(s.id));
              const catCompetitorData = COMPETITOR_PRICING.filter((c) => cat.stackIds.includes(c.stackId));
              if (catStacks.length === 0 || catCompetitorData.length === 0) return null;

              return (
                <div key={cat.id}>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold">{cat.label}</h3>
                    <p className="text-sm text-[var(--muted)]">{cat.desc}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catStacks.map((stack) => {
                      const data = catCompetitorData.find((c) => c.stackId === stack.id);
                      if (!data) return null;
                      return (
                        <div key={stack.id}>
                          <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full inline-block" style={{ background: stack.color }} />
                            {stack.name}
                            {stack.waitlist && <span className="text-[var(--muted-light)]">(Waitlist)</span>}
                          </p>
                          <ComparisonTable
                            ourPrice={data.ourPrice}
                            competitors={data.competitors}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Every stack includes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Physician evaluation", desc: "Board-certified MD reviews your full protocol within 24–48 hours." },
              { title: "Your prescription", desc: "Written by a licensed physician, dispensed by a licensed U.S. pharmacy." },
              { title: "Monthly medication supply", desc: "30-day supply shipped directly to your door in 3–5 business days." },
              { title: "Annual renewal", desc: "Once-a-year check-in. No required monthly appointments." },
              { title: "Physician messaging", desc: "Reach your physician with questions or dosing concerns anytime." },
              { title: "Cancel anytime", desc: "No contracts, no cancellation fees. Cancel in 30 seconds from your dashboard." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--green)] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-[var(--foreground)] text-sm">{item.title}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-10 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-semibold text-[var(--foreground)] mb-2 text-sm">Methodology</h3>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Competitor prices sourced from publicly listed rates at Hone Health, Maximus Tribe, Marek Health,
            TRT Nation, Defy Medical, AgelessRx, Healthspan, Hims, Keeps, Roman, Nurx, Wisp, Pandia,
            Ro Body, Henry Meds, Mochi, Sequence, Eden, Winona, Alloy, Evernow, Midi, Apostrophe,
            Curology, Musely, and Dermatica. Combination prices are the sum of their separately listed
            individual medications. Prices verified April 2026. Competitor prices change frequently —
            we update this page quarterly.
          </p>
        </div>
      </section>

      {/* Gender split */}
      <section className="py-16 border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-8">
              <h2 className="text-xl font-bold mb-2">Men&apos;s Stacks</h2>
              <p className="text-sm text-[var(--muted)] mb-6">
                {mensStacks.length} stacks available, from $
                {Math.min(...mensStacks.filter((s) => s.ourPrice !== null).map((s) => s.ourPrice as number))}/mo
              </p>
              <ul className="space-y-2 mb-6">
                {mensStacks.map((stack) => (
                  <li key={stack.id} className="flex justify-between text-sm">
                    <Link href={`/stacks/${stack.id}`} className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
                      {stack.name}
                    </Link>
                    <span className="font-semibold text-[var(--green)]">
                      {stack.ourPrice !== null ? `$${stack.ourPrice}/mo` : <span className="text-[var(--muted-light)] font-mono text-xs">{"{{PRICE}}"}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/build-your-stack?gender=men" className="block text-center bg-[var(--accent)] text-[var(--background)] font-semibold py-2.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm">
                Build Men&apos;s Protocol →
              </Link>
            </div>

            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-8">
              <h2 className="text-xl font-bold mb-2">Women&apos;s Stacks</h2>
              <p className="text-sm text-[var(--muted)] mb-6">
                {womensStacks.length} stacks available, from $
                {Math.min(...womensStacks.filter((s) => s.ourPrice !== null).map((s) => s.ourPrice as number))}/mo
              </p>
              <ul className="space-y-2 mb-6">
                {womensStacks.map((stack) => (
                  <li key={stack.id} className="flex justify-between text-sm">
                    <Link href={`/stacks/${stack.id}`} className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
                      {stack.name}
                    </Link>
                    <span className="font-semibold text-[var(--green)]">
                      {stack.ourPrice !== null ? `$${stack.ourPrice}/mo` : <span className="text-[var(--muted-light)] font-mono text-xs">{"{{PRICE}}"}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/build-your-stack?gender=women" className="block text-center bg-[var(--accent)] text-[var(--background)] font-semibold py-2.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm">
                Build Women&apos;s Protocol →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Start at $19/month.</h2>
          <p className="text-[var(--muted)] mb-8">A licensed physician reviews your full protocol within 24–48 hours.</p>
          <Link
            href="/build-your-stack"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-8 py-3.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            Build Your Stack
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-3 text-sm text-[var(--muted-light)]">Cancel anytime. No contracts.</p>
        </div>
      </section>

    </div>
  );
}
