import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started — The Longevity Agent",
  description: "Start your longevity medicine intake. 5 minutes. A physician reviews within 48 hours.",
};

export default function IntakePage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[var(--navy)] mb-3">
            Start your health intake
          </h1>
          <p className="text-[var(--gray)]">
            5 minutes. A licensed physician reviews within 24–48 hours.
          </p>
        </div>

        <div className="bg-[var(--gray-bg)] border border-gray-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-[var(--navy)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--navy)] mb-2">Intake form coming soon</h2>
          <p className="text-[var(--gray)] text-sm leading-relaxed mb-6">
            We&apos;re finalizing our intake flow. Enter your email and we&apos;ll notify you the moment
            it&apos;s live — plus early access pricing.
          </p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)]"
            />
            <button
              type="submit"
              className="w-full bg-[var(--navy)] text-white font-semibold py-3 rounded-lg hover:bg-[var(--navy-dark)] transition-colors text-sm"
            >
              Notify me when it&apos;s ready
            </button>
          </form>
          <p className="mt-4 text-xs text-[var(--gray-light)]">No spam. One email when we launch.</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { v: "24–48 hrs", l: "Physician review" },
            { v: "3–5 days", l: "Medication delivery" },
            { v: "$19/mo", l: "Starting price" },
          ].map((s) => (
            <div key={s.l} className="bg-[var(--gray-bg)] rounded-lg p-4">
              <p className="text-lg font-bold text-[var(--navy)]">{s.v}</p>
              <p className="text-xs text-[var(--gray)] mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
