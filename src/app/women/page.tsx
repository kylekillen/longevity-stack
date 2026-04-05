import Link from "next/link";
import { getProductsByGender, savingsPercent } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Health — The Longevity Agent",
  description:
    "Prescription longevity medicine for women. HRT, LDN, GLP-1, cardiovascular protection. Starting at $29/month.",
};

const BENEFITS = [
  { label: "Cardiovascular protection", product: "Women's Essentials" },
  { label: "Hormone replacement", product: "Bioidentical HRT" },
  { label: "Immune modulation", product: "Low Dose Naltrexone" },
  { label: "Weight management", product: "GLP-1" },
  { label: "Longevity protocols", product: "Rapamycin + Metformin" },
];

export default function WomenPage() {
  const products = getProductsByGender("women");

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="py-16 sm:py-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--green-light)] text-[var(--green-dark)] text-xs font-semibold mb-6 uppercase tracking-wide">
              Women&apos;s Health
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--navy)] leading-tight mb-6">
              Evidence-based women&apos;s longevity medicine.<br />
              <span className="text-[var(--green)]">Starting at $29/month.</span>
            </h1>
            <p className="text-xl text-[var(--gray)] max-w-2xl mx-auto">
              Bioidentical HRT, cardiovascular protection, immune optimization, and
              weight management — prescribed by board-certified physicians, shipped to
              your door.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-10">
            {BENEFITS.map((b) => (
              <div
                key={b.label}
                className="bg-[var(--gray-bg)] border border-gray-200 rounded-lg px-4 py-3 text-center"
              >
                <p className="text-xs font-semibold text-[var(--navy)]">{b.label}</p>
                <p className="text-xs text-[var(--gray)] mt-0.5">{b.product}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center gap-2 bg-[var(--navy)] text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-[var(--navy-dark)] transition-colors"
            >
              Start Your Intake — $29/mo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-[var(--navy)] font-semibold px-8 py-3.5 rounded-lg hover:border-[var(--navy)] transition-colors"
            >
              See all pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-8">
            Women&apos;s medications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => {
              const savings = savingsPercent(p.ourPrice, p.competitorPrice);
              return (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="border border-gray-200 rounded-xl p-6 hover:border-[var(--navy)] hover:shadow-md transition-all group"
                >
                  <p className="text-xs text-[var(--gray)] font-medium uppercase tracking-wide mb-1">
                    {p.category}
                  </p>
                  <h3 className="font-semibold text-[var(--navy)] mb-2 group-hover:text-[var(--navy-light)] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-[var(--gray)] mb-4 line-clamp-2">{p.tagline}</p>
                  <div className="flex items-end gap-3 mt-auto">
                    <span className="text-2xl font-bold text-[var(--green)]">${p.ourPrice}</span>
                    <span className="text-sm text-[var(--gray)] mb-0.5">/mo</span>
                    <span className="text-sm text-[var(--gray-light)] line-through mb-0.5">
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

      {/* HRT explainer */}
      <section className="py-16 bg-[var(--gray-bg)] border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[var(--navy)] mb-4">
                Bioidentical HRT — the evidence has caught up.
              </h2>
              <p className="text-[var(--gray)] leading-relaxed mb-4">
                The 2002 WHI study that frightened women off HRT used synthetic
                progestins and conjugated equine estrogens — not the
                body-identical hormones we prescribe. The current evidence
                clearly supports bioidentical estradiol and micronized
                progesterone as safe and effective for most women under 60.
              </p>
              <p className="text-[var(--gray)] leading-relaxed">
                The British Menopause Society, the Menopause Society, and the
                NICE guidelines all support HRT as first-line treatment for
                menopausal symptoms — and as a longevity intervention in its
                own right.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { q: "Is HRT right for me?", a: "Your physician will evaluate your symptoms, hormone levels, and personal and family history during intake." },
                { q: "When should I start?", a: "Evidence is strongest for starting within 10 years of menopause onset. Earlier intervention has better long-term outcomes." },
                { q: "What about cancer risk?", a: "Current evidence shows no increased risk with estrogen-only HRT, and minimal increase with combined therapy in the first 5 years." },
              ].map((item) => (
                <div key={item.q} className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="font-semibold text-[var(--navy)] text-sm mb-1">{item.q}</p>
                  <p className="text-sm text-[var(--gray)]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--navy)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Start your women&apos;s health protocol today.
          </h2>
          <p className="text-blue-200 mb-8">From $29/month. No office visit required.</p>
          <Link
            href="/intake"
            className="inline-flex items-center justify-center gap-2 bg-white text-[var(--navy)] font-bold px-10 py-4 rounded-lg hover:bg-gray-50 transition-colors text-base"
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
