import Link from "next/link";

const PRODUCTS = [
  {
    name: "Low Dose Naltrexone",
    slug: "ldn",
    category: "Immune / Inflammation",
    ourPrice: 19,
    competitorPrice: 89,
    tag: "Most Popular",
  },
  {
    name: "Men's Essentials",
    slug: "mens-essentials",
    category: "Cardiovascular + Metabolic",
    ourPrice: 25,
    competitorPrice: 149,
    tag: "Best Value",
  },
  {
    name: "Women's Essentials",
    slug: "womens-essentials",
    category: "Cardiovascular + Metabolic",
    ourPrice: 29,
    competitorPrice: 149,
    tag: null,
  },
  {
    name: "Dutasteride",
    slug: "dutasteride",
    category: "Hair Preservation",
    ourPrice: 35,
    competitorPrice: 120,
    tag: null,
  },
  {
    name: "Enclomiphene",
    slug: "enclomiphene",
    category: "Testosterone Optimization",
    ourPrice: 59,
    competitorPrice: 199,
    tag: null,
  },
  {
    name: "Longevity Stack",
    slug: "longevity-stack",
    category: "Rapamycin + Metformin",
    ourPrice: 59,
    competitorPrice: 249,
    tag: null,
  },
  {
    name: "TRT",
    slug: "trt",
    category: "Testosterone Replacement",
    ourPrice: 79,
    competitorPrice: 299,
    tag: null,
  },
  {
    name: "Women's HRT",
    slug: "womens-hrt",
    category: "Hormone Replacement",
    ourPrice: 79,
    competitorPrice: 299,
    tag: null,
  },
  {
    name: "GLP-1",
    slug: "glp1",
    category: "Weight Management",
    ourPrice: 129,
    competitorPrice: 699,
    tag: "Biggest Savings",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us about yourself",
    desc: "A 5-minute health questionnaire. No office visit, no waiting room.",
  },
  {
    step: "02",
    title: "Physician reviews your profile",
    desc: "Board-certified doctors review within 24–48 hours. They approve, adjust, or follow up.",
  },
  {
    step: "03",
    title: "Medications ship to your door",
    desc: "FDA-approved generics from licensed U.S. pharmacies. Delivered in 3–5 business days.",
  },
  {
    step: "04",
    title: "Annual check-in",
    desc: "Once a year renewal. No monthly appointments, no ongoing fees.",
  },
];

const TRUST_ITEMS = [
  "Prescribed by licensed, board-certified physicians",
  "Clinical protocols designed by an MD with 13 years longevity experience",
  "FDA-approved generics from licensed U.S. pharmacies",
  "Cancel anytime — no contracts, no cancellation fees",
  "Serving patients in all 50 states",
  "HIPAA-compliant. Your health data stays private.",
];

const FAQS = [
  {
    q: "Are these real prescriptions?",
    a: "Yes. Every medication is prescribed by a licensed, board-certified physician who reviews your intake form. You'll receive real prescriptions filled by licensed U.S. pharmacies.",
  },
  {
    q: "Are these FDA-approved medications?",
    a: "Yes. We prescribe FDA-approved generic medications. Some protocols (like LDN and rapamycin for longevity) are prescribed off-label — a standard, legal, and common medical practice.",
  },
  {
    q: "Do I need labs before starting?",
    a: "For most protocols, no labs required. For TRT, HRT, and GLP-1, we'll guide you through optional bloodwork that helps your physician optimize dosing.",
  },
  {
    q: "How often do I need to see a doctor?",
    a: "Once a year for renewal. No required monthly check-ins. If you need a dosage adjustment, you can message your physician anytime.",
  },
  {
    q: "Why is your price so much lower?",
    a: "No brick-and-mortar clinic, no concierge memberships, no upsells. We prescribe what the evidence supports, use generic medications, and charge a flat monthly fee.",
  },
  {
    q: "Can I cancel?",
    a: "Yes, anytime. No contracts, no cancellation fees. Cancel from your dashboard in 30 seconds.",
  },
];

function savingsPercent(our: number, competitor: number) {
  return Math.round(((competitor - our) / competitor) * 100);
}

export default function Home() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b border-[var(--card-border)] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-semibold mb-8 uppercase tracking-wide">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Starting at $19/month
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            The Same Medications.<br />
            The Lowest Price.<br />
            <span className="text-[var(--accent)]">Prescribed by a Real Doctor.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--muted)] leading-relaxed mb-10 max-w-2xl mx-auto">
            The medications longevity physicians prescribe to themselves cost pennies to manufacture.
            We prescribe them at cost, with a real physician review, starting at{" "}
            <strong className="text-[var(--foreground)] font-semibold">$19/month</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/men"
              className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-semibold px-7 py-3.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
            >
              Men&apos;s Health — from $19/mo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/women"
              className="inline-flex items-center justify-center gap-2 border border-[var(--card-border)] text-[var(--foreground)] font-semibold px-7 py-3.5 rounded-lg hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors text-base"
            >
              Women&apos;s Health — from $29/mo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICE COMPARISON GRID ─────────────────────────────── */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              We checked what everyone else charges.
            </h2>
            <p className="text-lg text-[var(--muted)]">Then we charged less.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map((p) => {
              const savings = savingsPercent(p.ourPrice, p.competitorPrice);
              return (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--accent)]/40 transition-all group relative"
                >
                  {p.tag && (
                    <span className="absolute top-4 right-4 text-xs font-semibold bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--accent)]/20 px-2 py-0.5 rounded-full">
                      {p.tag}
                    </span>
                  )}
                  <p className="text-xs text-[var(--muted-light)] font-medium uppercase tracking-wide mb-1">{p.category}</p>
                  <h3 className="font-semibold text-[var(--foreground)] text-base mb-4 group-hover:text-[var(--accent)] transition-colors pr-20">
                    {p.name}
                  </h3>
                  <div className="flex items-end gap-3">
                    <div>
                      <span className="text-3xl font-bold text-[var(--green)]">${p.ourPrice}</span>
                      <span className="text-sm text-[var(--muted)] ml-1">/mo</span>
                    </div>
                    <div className="mb-1">
                      <span className="text-sm text-[var(--muted-light)] line-through">${p.competitorPrice}</span>
                      <span className="ml-1.5 text-xs font-semibold text-[var(--green)]">−{savings}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted-light)] mt-1.5">vs. typical clinic price</p>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold hover:underline underline-offset-2"
            >
              See full pricing breakdown
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-20 border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-lg text-[var(--muted)]">From signup to doorstep in under a week.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--accent)]/30 transition-colors">
                <div className="text-[var(--accent)] text-lg font-mono font-bold mb-3">{item.step}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ────────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Built on medical-grade trust.
            </h2>
            <p className="text-[var(--muted)] text-lg">Not a subscription box. Real medicine.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                <svg className="w-5 h-5 text-[var(--green)] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Common Questions</h2>
          </div>

          <div className="divide-y divide-[var(--card-border)]">
            {FAQS.map((faq, i) => (
              <div key={i} className="py-6">
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{faq.q}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/faq" className="text-[var(--accent)] font-semibold hover:underline underline-offset-2">
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start for as low as <span className="text-[var(--accent)]">$19/month</span>.
          </h2>
          <p className="text-[var(--muted)] text-lg mb-8">
            No office visit. No waiting room. A real prescription from a real doctor,
            shipped to your door.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-10 py-4 rounded-lg text-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            Get Started — $19/mo
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-[var(--muted-light)]">
            Cancel anytime. No contracts.
          </p>
        </div>
      </section>

    </div>
  );
}
