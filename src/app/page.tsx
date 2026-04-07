import Link from "next/link";
import StackBuilder from "@/components/StackBuilder";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Build your protocol",
    desc: "Select the stacks that match your goals. Mix and match — your physician will review the combination.",
  },
  {
    step: "02",
    title: "Physician reviews within 48 hours",
    desc: "Board-certified doctors review your intake. They approve, adjust dosing, or follow up with a question.",
  },
  {
    step: "03",
    title: "Medications ship to your door",
    desc: "FDA-approved generics from licensed U.S. pharmacies. Delivered in 3–5 business days.",
  },
  {
    step: "04",
    title: "Annual check-in, cancel anytime",
    desc: "One renewal per year. No monthly appointments. Message your physician anytime.",
  },
];

const TRUST_ITEMS = [
  "Prescribed by board-certified physicians — not NPs or PAs",
  "Clinical protocols designed by an MD with 13 years longevity experience",
  "FDA-approved generics and compounded medications from licensed U.S. pharmacies",
  "Cancel anytime — no contracts, no cancellation fees",
  "Serving patients in all 50 states via telemedicine",
  "HIPAA-compliant. SOC-2 infrastructure. Your health data stays private.",
];

export default function Home() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b border-[var(--card-border)] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-semibold mb-6 uppercase tracking-wide">
            From $19/month
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
            Build your longevity protocol.<br />
            <span className="text-[var(--accent)]">A physician prescribes it.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
            10 modular stacks covering cardiovascular protection, hormones, hair, skin, and
            aging biology. Mix and match. A board-certified physician reviews your combination.
          </p>
        </div>

        {/* Stack Builder embedded in hero */}
        <StackBuilder compact defaultGender="men" />
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-20 border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-lg text-[var(--muted)]">From protocol to doorstep in under a week.</p>
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
              Medical-grade trust standards.
            </h2>
            <p className="text-[var(--muted)] text-lg">Real prescriptions. Not a wellness subscription.</p>
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

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-20 border-t border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start for as low as <span className="text-[var(--accent)]">$19/month</span>.
          </h2>
          <p className="text-[var(--muted)] text-lg mb-8">
            No office visit. A real prescription from a real physician, shipped to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build-your-stack"
              className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-8 py-3.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
            >
              Build Your Stack
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 border border-[var(--card-border)] text-[var(--foreground)] font-semibold px-8 py-3.5 rounded-lg hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors text-base"
            >
              Compare Prices
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--muted-light)]">
            Cancel anytime. No contracts.
          </p>
        </div>
      </section>

    </div>
  );
}
