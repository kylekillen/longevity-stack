import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — The Longevity Agent",
  description:
    "Complete a 5-minute intake, get reviewed by a licensed provider, receive your medications by mail. Start at $19/month.",
};

export default function HowItWorksPage() {
  return (
    <div>

      {/* Hero */}
      <section className="py-16 sm:py-20 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            From signup to doorstep<br />in under a week.
          </h1>
          <p className="text-xl text-[var(--muted)]">
            No office visit. No waiting room. A licensed provider reviews your
            profile and your medications ship directly to you.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            {[
              {
                n: "01",
                t: "Tell us about yourself",
                sub: "5 minutes. No office visit.",
                body: [
                  "Complete a brief health questionnaire covering your current medications, health history, and treatment goals.",
                  "We ask only what your physician needs to prescribe safely. Nothing more.",
                  "Your information is HIPAA-compliant and encrypted at rest.",
                ],
                aside: "Most patients complete intake in under 5 minutes.",
              },
              {
                n: "02",
                t: "A licensed provider reviews your profile",
                sub: "Within 24–48 hours.",
                body: [
                  "A licensed provider reviews your intake. They approve your protocol, adjust dosing based on your history, or follow up with a question.",
                  "All our providers have clinical longevity experience.",
                  "If your physician has concerns, they'll reach out directly through the secure messaging system.",
                ],
                aside: "Most approvals happen same-day.",
              },
              {
                n: "03",
                t: "Your medications ship to your door",
                sub: "3–5 business days.",
                body: [
                  "FDA-approved generic medications, dispensed by licensed U.S. pharmacies.",
                  "Discreet packaging. No pharmacy counter, no pharmacist consultation you didn't ask for.",
                  "Refills ship automatically each month until you cancel.",
                ],
                aside: "Delivered anywhere in all 50 states.",
              },
              {
                n: "04",
                t: "Annual check-in",
                sub: "Once a year.",
                body: [
                  "Your physician reviews your protocol annually and renews your prescription.",
                  "No required monthly appointments. No ongoing consultation fees.",
                  "If you have a question or want a dosage adjustment, message your physician anytime through your dashboard.",
                ],
                aside: "Cancel anytime from your dashboard.",
              },
            ].map((step) => (
              <div key={step.n} className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-10">
                <div className="w-14 h-14 rounded-full bg-[var(--accent-dim)] border border-[var(--accent)]/20 text-[var(--accent)] font-bold text-xl flex items-center justify-center shrink-0 font-mono">
                  {step.n}
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">{step.t}</h2>
                  <p className="text-sm font-semibold text-[var(--green)] mb-4">{step.sub}</p>
                  <div className="space-y-2 mb-4">
                    {step.body.map((line) => (
                      <p key={line} className="text-[var(--muted)] leading-relaxed">{line}</p>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--muted-light)] italic">{step.aside}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Medical-grade trust standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                t: "Licensed healthcare providers",
                d: "Every prescription is written by a licensed healthcare provider with clinical longevity experience.",
              },
              {
                t: "FDA-approved generics",
                d: "We dispense FDA-approved generic medications from licensed U.S. pharmacies. No grey-market sourcing.",
              },
              {
                t: "HIPAA-compliant",
                d: "Your health information is encrypted, stored in SOC-2 compliant infrastructure, and never sold.",
              },
              {
                t: "All 50 states",
                d: "Our provider network is licensed to prescribe in all 50 states. Telemedicine is legal nationwide.",
              },
              {
                t: "Evidence-based protocols",
                d: "Clinical protocols are designed by an MD with 13 years of longevity medicine experience. Not trend-driven.",
              },
              {
                t: "Cancel anytime",
                d: "No contracts, no cancellation fees. Cancel from your dashboard. Refunds available pre-shipment.",
              },
            ].map((item) => (
              <div key={item.t} className="flex items-start gap-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                <svg className="w-5 h-5 text-[var(--green)] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-[var(--foreground)] text-sm">{item.t}</p>
                  <p className="text-sm text-[var(--muted)] mt-0.5 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to start?</h2>
          <p className="text-[var(--muted)] mb-8">
            5-minute intake. Physician review within 48 hours. Medications at
            your door within a week.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-10 py-4 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
          >
            Begin Intake
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-3 text-sm text-[var(--muted-light)]">Starting at $19/month.</p>
        </div>
      </section>

    </div>
  );
}
