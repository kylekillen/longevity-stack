import Link from "next/link";
import { getProductsByGender, savingsPercent } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Health — The Longevity Agent",
  description:
    "Prescription longevity medicine for men. TRT, enclomiphene, LDN, dutasteride, statins, GLP-1. Starting at $19/month.",
};

const BENEFITS = [
  { label: "Cardiovascular protection", product: "Men's Essentials" },
  { label: "Testosterone optimization", product: "TRT or Enclomiphene" },
  { label: "Hair preservation", product: "Dutasteride" },
  { label: "Immune modulation", product: "Low Dose Naltrexone" },
  { label: "Weight management", product: "GLP-1" },
  { label: "Longevity protocols", product: "Rapamycin + Metformin" },
];

export default function MenPage() {
  const products = getProductsByGender("men");

  return (
    <div>

      {/* Hero */}
      <section className="py-16 sm:py-24 border-b border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-semibold mb-6 uppercase tracking-wide">
              Men&apos;s Health
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Every medication your longevity doctor would prescribe.<br />
              <span className="text-[var(--accent)]">Starting at $19/month.</span>
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Board-certified physicians. FDA-approved generics. No office
              visit, no concierge fee, no waiting room.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
            {BENEFITS.map((b) => (
              <div
                key={b.label}
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-center"
              >
                <p className="text-xs font-semibold text-[var(--foreground)]">{b.label}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{b.product}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-semibold px-8 py-3.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              Start Your Intake — $19/mo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 border border-[var(--card-border)] text-[var(--foreground)] font-semibold px-8 py-3.5 rounded-lg hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors"
            >
              See all pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Men&apos;s medications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => {
              const savings = savingsPercent(p.ourPrice, p.competitorPrice);
              return (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 hover:border-[var(--accent)]/40 transition-all group"
                >
                  <p className="text-xs text-[var(--muted-light)] font-medium uppercase tracking-wide mb-1">
                    {p.category}
                  </p>
                  <h3 className="font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mb-4 line-clamp-2">{p.tagline}</p>
                  <div className="flex items-end gap-3 mt-auto">
                    <span className="text-2xl font-bold text-[var(--green)]">${p.ourPrice}</span>
                    <span className="text-sm text-[var(--muted)] mb-0.5">/mo</span>
                    <span className="text-sm text-[var(--muted-light)] line-through mb-0.5">
                      ${p.competitorPrice}
                    </span>
                    <span className="text-xs font-semibold text-[var(--green)] mb-0.5">
                      −{savings}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">How it works</h2>
          <p className="text-[var(--muted)] mb-10">Signup to doorstep in under a week.</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-left">
            {[
              { n: "01", t: "5-minute intake", d: "Tell us about your health goals, current medications, and history." },
              { n: "02", t: "Physician review", d: "A board-certified doctor reviews within 24–48 hours. Approves or follows up." },
              { n: "03", t: "Rx shipped", d: "FDA-approved generics from licensed U.S. pharmacies. Arrives in 3–5 days." },
              { n: "04", t: "Annual check-in", d: "One renewal per year. Message your physician anytime." },
            ].map((s) => (
              <div key={s.n} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--accent)]/30 transition-colors">
                <div className="text-[var(--accent)] text-lg font-mono font-bold mb-3">{s.n}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 text-sm">{s.t}</h3>
                <p className="text-sm text-[var(--muted)]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Start your men&apos;s health protocol today.
          </h2>
          <p className="text-[var(--muted)] mb-8">From $19/month. No office visit required.</p>
          <Link
            href="/intake"
            className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-10 py-4 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
          >
            Begin Intake
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
