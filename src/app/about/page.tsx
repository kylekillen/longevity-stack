import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — The Longevity Agent",
  description:
    "Why we built The Longevity Agent — prescription longevity medicine at the lowest price, without the clinic markup.",
};

export default function AboutPage() {
  return (
    <div>

      <section className="py-16 sm:py-20 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Why we built this.
          </h1>
          <p className="text-xl text-[var(--muted)] leading-relaxed">
            The medications that longevity physicians prescribe to themselves and
            their wealthiest patients cost pennies to manufacture. The markup
            is the product. We removed the markup.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-[var(--muted)] leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">The problem</h2>
            <p className="mb-4">
              Low dose naltrexone costs about $0.30 to compound. Telehealth clinics
              charge $89/month. Rapamycin, metformin, dutasteride — all cheap generic
              medications with decades of safety data. All priced like luxury products
              by the clinics that prescribe them.
            </p>
            <p>
              The markup pays for the brand, the concierge positioning, the celebrity
              physicians, the podcast sponsorships. None of that makes the medication
              more effective. It just makes it more expensive.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">What we do differently</h2>
            <p className="mb-4">
              We&apos;re a direct-to-patient platform. No brick-and-mortar clinic. No
              concierge membership. No upsells. We connect patients with licensed healthcare providers, facilitate the prescription, and coordinate dispensing from
              licensed U.S. pharmacies.
            </p>
            <p>
              We prescribe what the evidence supports. We dispense generics at cost.
              We charge one flat monthly fee that covers everything — provider evaluation,
              medication, and annual renewal.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">What we are not</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Not a supplement company. We prescribe real medications.</li>
              <li>Not a wellness brand. We don&apos;t sell lifestyle, we prescribe medicine.</li>
              <li>Not a concierge service. No membership tiers, no VIP programs.</li>
              <li>Not trying to be your primary care doctor. Annual check-in, not ongoing management.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Our provider network</h2>
            <p className="mb-4">
              All prescriptions are written by licensed healthcare providers with active
              state licenses. Our clinical protocols were developed by an MD with 13
              years of longevity medicine experience — the same physician who helped
              design the protocols used by leading longevity clinics.
            </p>
            <p>
              Your physician reviews your intake questionnaire, approves your protocol,
              and is available for questions year-round. This is real medicine, not a
              checkbox algorithm.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">The simple version</h2>
            <p className="text-xl font-semibold text-[var(--foreground)]">
              We checked what everyone else charges. Then we charged less.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Start at $19/month.
          </h2>
          <p className="text-[var(--muted)] mb-8">
            Real prescriptions. Licensed providers. No clinic markup.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-10 py-4 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
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
