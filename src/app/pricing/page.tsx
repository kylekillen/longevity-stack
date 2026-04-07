import Link from "next/link";
import { getAllProducts, savingsPercent } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — The Longevity Agent",
  description:
    "Full pricing for all 9 prescription longevity medications. Starting at $19/month.",
};

export default function PricingPage() {
  const products = getAllProducts();
  const menProducts = products.filter(
    (p) => p.forGender === "men" || p.forGender === "both"
  );
  const womenProducts = products.filter(
    (p) => p.forGender === "women" || p.forGender === "both"
  );

  return (
    <div>

      {/* Hero */}
      <section className="py-16 sm:py-20 border-b border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Transparent Pricing
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            No membership fees. No consultation charges. One flat monthly rate
            that includes your prescription, your physician review, and your
            medication.
          </p>
        </div>
      </section>

      {/* Full comparison table */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[var(--card-border)]">
                  <th className="text-left py-3 pr-6 text-sm font-semibold text-[var(--foreground)]">
                    Medication
                  </th>
                  <th className="text-left py-3 pr-6 text-sm font-semibold text-[var(--muted)] hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-right py-3 pr-6 text-sm font-semibold text-[var(--green)]">
                    Our Price
                  </th>
                  <th className="text-right py-3 pr-6 text-sm font-semibold text-[var(--muted)] hidden md:table-cell">
                    Typical Clinic
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-[var(--muted)] hidden md:table-cell">
                    You Save
                  </th>
                  <th className="py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]">
                {products.map((p) => {
                  const savings = savingsPercent(p.ourPrice, p.competitorPrice);
                  return (
                    <tr key={p.slug} className="hover:bg-[var(--surface)] transition-colors">
                      <td className="py-4 pr-6">
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors underline-offset-2"
                        >
                          {p.name}
                        </Link>
                        <p className="text-xs text-[var(--muted)] sm:hidden mt-0.5">
                          {p.category}
                        </p>
                      </td>
                      <td className="py-4 pr-6 text-sm text-[var(--muted)] hidden sm:table-cell">
                        {p.category}
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <span className="text-xl font-bold text-[var(--green)]">
                          ${p.ourPrice}
                        </span>
                        <span className="text-xs text-[var(--muted)] ml-1">/mo</span>
                      </td>
                      <td className="py-4 pr-6 text-right text-sm text-[var(--muted-light)] line-through hidden md:table-cell">
                        ${p.competitorPrice}
                      </td>
                      <td className="py-4 text-right hidden md:table-cell">
                        <span className="text-sm font-semibold text-[var(--green)] bg-[var(--green-dim)] px-2 py-0.5 rounded-full">
                          −{savings}%
                        </span>
                      </td>
                      <td className="py-4 pl-4">
                        <Link
                          href={`/products/${p.slug}`}
                          className="text-sm text-[var(--accent)] font-medium hover:underline whitespace-nowrap"
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-[var(--muted-light)]">
            Competitor prices sourced from publicly listed rates at Hone Health,
            Maximus, Defy Medical, and similar telehealth platforms. Prices as of
            Q1 2026.
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Every plan includes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "Physician evaluation",
                desc: "Board-certified MD reviews your intake questionnaire within 24–48 hours.",
              },
              {
                title: "Your prescription",
                desc: "Written by a licensed physician, dispensed by a licensed U.S. pharmacy.",
              },
              {
                title: "Monthly medication supply",
                desc: "30-day supply shipped directly to your door, 3–5 business days.",
              },
              {
                title: "Annual renewal",
                desc: "Once-a-year check-in. No required monthly appointments.",
              },
              {
                title: "Physician messaging",
                desc: "Reach your physician with questions or dosing concerns anytime.",
              },
              {
                title: "Cancel anytime",
                desc: "No contracts, no cancellation fees. Cancel in 30 seconds from your dashboard.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
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
                <div>
                  <p className="font-semibold text-[var(--foreground)] text-sm">{item.title}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gender split links */}
      <section className="py-16 border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-8">
              <h2 className="text-xl font-bold mb-2">Men&apos;s Health</h2>
              <p className="text-sm text-[var(--muted)] mb-6">
                {menProducts.length} medications starting at $
                {Math.min(...menProducts.map((p) => p.ourPrice))}/mo
              </p>
              <ul className="space-y-2 mb-6">
                {menProducts.map((p) => (
                  <li key={p.slug} className="flex justify-between text-sm">
                    <Link
                      href={`/products/${p.slug}`}
                      className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                    >
                      {p.name}
                    </Link>
                    <span className="font-semibold text-[var(--green)]">
                      ${p.ourPrice}/mo
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/men"
                className="block text-center bg-[var(--accent)] text-[var(--background)] font-semibold py-2.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
              >
                Men&apos;s Health →
              </Link>
            </div>

            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-8">
              <h2 className="text-xl font-bold mb-2">Women&apos;s Health</h2>
              <p className="text-sm text-[var(--muted)] mb-6">
                {womenProducts.length} medications starting at $
                {Math.min(...womenProducts.map((p) => p.ourPrice))}/mo
              </p>
              <ul className="space-y-2 mb-6">
                {womenProducts.map((p) => (
                  <li key={p.slug} className="flex justify-between text-sm">
                    <Link
                      href={`/products/${p.slug}`}
                      className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                    >
                      {p.name}
                    </Link>
                    <span className="font-semibold text-[var(--green)]">
                      ${p.ourPrice}/mo
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/women"
                className="block text-center bg-[var(--accent)] text-[var(--background)] font-semibold py-2.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
              >
                Women&apos;s Health →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Start at $19/month.
          </h2>
          <p className="text-[var(--muted)] mb-8">
            A licensed physician reviews your profile within 24–48 hours.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-8 py-3.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
