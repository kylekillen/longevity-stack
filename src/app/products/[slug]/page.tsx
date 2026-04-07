import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProducts, getProduct, savingsPercent } from "@/lib/products";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — $${product.ourPrice}/mo | The Longevity Agent`,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const savings = savingsPercent(product.ourPrice, product.competitorPrice);
  const related = getAllProducts().filter((p) =>
    product.relatedSlugs.includes(p.slug)
  );

  return (
    <div>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="border-b border-[var(--card-border)] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link
              href="/pricing"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              ← All medications
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-[var(--muted)] leading-relaxed mb-8">
                {product.tagline}
              </p>

              <div className="flex items-end gap-4 mb-6">
                <div>
                  <span className="text-5xl font-bold text-[var(--green)]">
                    ${product.ourPrice}
                  </span>
                  <span className="text-[var(--muted)] ml-1">/{product.billing}</span>
                </div>
                <div className="mb-2">
                  <span className="text-lg text-[var(--muted-light)] line-through mr-1.5">
                    ${product.competitorPrice}
                  </span>
                  <span className="text-sm font-bold text-[var(--green)] bg-[var(--green-dim)] px-2 py-0.5 rounded-full">
                    Save {savings}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--muted-light)] mb-8">
                vs. {product.lowestCompetitor} ${product.competitorPrice}/mo
              </p>

              <Link
                href="/intake"
                className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] font-semibold px-8 py-3.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
              >
                Get Started — ${product.ourPrice}/mo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="mt-3 text-xs text-[var(--muted-light)]">Cancel anytime. No contracts.</p>
            </div>

            {/* Right — stats */}
            <div className="grid grid-cols-2 gap-4">
              {product.heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5"
                >
                  <p className="text-xs text-[var(--muted)] mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ──────────────────────────────── */}
      <section className="py-16 bg-[var(--surface)] border-b border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">What you get</h2>
              <ul className="space-y-3">
                {product.whatYouGet.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[var(--green)] shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-[var(--muted)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">How to take it</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-8">{product.howItWorks}</p>

              <h2 className="text-2xl font-bold mb-4">The science</h2>
              <p className="text-[var(--muted)] leading-relaxed">{product.scienceBlurb}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESCRIPTION ───────────────────────────────── */}
      <section className="py-16 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">About {product.name}</h2>
          <p className="text-[var(--muted)] leading-relaxed text-lg">{product.description}</p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section className="py-16 bg-[var(--surface)] border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Common questions</h2>
          <div className="divide-y divide-[var(--card-border)]">
            {product.faqs.map((faq) => (
              <div key={faq.q} className="py-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{faq.q}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED ───────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Related medications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--accent)]/40 transition-all"
                >
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">
                    {p.category}
                  </p>
                  <h3 className="font-semibold text-[var(--foreground)] mb-3">{p.name}</h3>
                  <p className="text-2xl font-bold text-[var(--green)]">
                    ${p.ourPrice}
                    <span className="text-sm font-normal text-[var(--muted)] ml-1">/mo</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {product.name} — ${product.ourPrice}/month.
          </h2>
          <p className="text-[var(--muted)] mb-8">
            Prescribed by a licensed physician. Ships to your door.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-8 py-3.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-3 text-xs text-[var(--muted-light)]">Cancel anytime. No contracts.</p>
        </div>
      </section>

    </div>
  );
}
