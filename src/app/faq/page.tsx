import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — The Longevity Agent",
  description:
    "Common questions about prescription longevity medicine, our provider review process, medications, and pricing.",
};

const FAQS = [
  {
    category: "Getting started",
    items: [
      {
        q: "Do I need to come in for an appointment?",
        a: "No. Everything is done online. Complete a 5-minute intake questionnaire, and a licensed provider reviews your profile within 24–48 hours. If approved, your prescription is sent directly to a licensed U.S. pharmacy.",
      },
      {
        q: "How long does the process take?",
        a: "Most patients receive their medications within one week of signing up: 24–48 hours for physician review, plus 3–5 business days for shipping.",
      },
      {
        q: "What states do you serve?",
        a: "All 50 states. Our provider network is licensed to prescribe in every U.S. state. Telemedicine prescribing is federally legal.",
      },
      {
        q: "Can I use this if I already have a primary care doctor?",
        a: "Yes. We can send your prescriptions and medical records to your primary care physician on request. Many patients use us as a dedicated longevity prescriber alongside their regular care.",
      },
    ],
  },
  {
    category: "Medications",
    items: [
      {
        q: "Are these real prescriptions?",
        a: "Yes. Every medication is prescribed by a licensed healthcare provider. You'll receive legitimate prescriptions filled by licensed U.S. pharmacies — the same medications any longevity clinic would prescribe.",
      },
      {
        q: "Are these FDA-approved medications?",
        a: "Yes. We prescribe FDA-approved generic medications. Some protocols (like LDN and rapamycin for longevity) are prescribed off-label, which is standard medical practice — legally and clinically.",
      },
      {
        q: "What does 'off-label' mean?",
        a: "Off-label means using an FDA-approved medication for a purpose other than its original approval. Approximately 20% of all prescriptions in the U.S. are off-label. Your physician will explain which medications apply.",
      },
      {
        q: "Do I need labs before starting?",
        a: "For most protocols, no labs are required to start. TRT, HRT, and GLP-1 benefit from baseline bloodwork — your physician will guide you. We'll never require labs we don't actually need.",
      },
      {
        q: "Can I get multiple medications at once?",
        a: "Yes. Many patients start with one protocol and add others. Your physician reviews combinations for safety.",
      },
    ],
  },
  {
    category: "Pricing & billing",
    items: [
      {
        q: "What does the price include?",
        a: "Everything: provider evaluation, the prescription, your medication supply, annual renewal, and provider messaging access. No hidden fees, no consultation charges, no membership tiers.",
      },
      {
        q: "Why is your price so much lower than other clinics?",
        a: "We're direct-to-patient. No brick-and-mortar clinic, no concierge membership, no upsells. We prescribe what the evidence supports, dispense generics at cost, and charge one flat monthly fee.",
      },
      {
        q: "Is there a subscription?",
        a: "Yes — monthly billing that includes your medication refill. Cancel anytime. We auto-ship your monthly supply unless you pause or cancel.",
      },
      {
        q: "Do you accept insurance?",
        a: "Not currently. Our prices are often lower than insurance copays for equivalent brand-name medications, and the cash-pay model keeps our provider fees and overhead low.",
      },
    ],
  },
  {
    category: "Providers & safety",
    items: [
      {
        q: "Who are your providers?",
        a: "Licensed healthcare providers with active state licenses and clinical longevity medicine experience. Our protocols are designed by an MD with 13 years of longevity medicine experience.",
      },
      {
        q: "How often do I see a provider?",
        a: "Once a year for your renewal. You can message your provider anytime through your dashboard for questions or dosing adjustments.",
      },
      {
        q: "What if my provider doesn't approve my request?",
        a: "Your provider may decline to prescribe a medication if it's contraindicated for you, or suggest a safer alternative. This is medicine, not a vending machine — that's the point.",
      },
      {
        q: "Is my health information private?",
        a: "Yes. HIPAA-compliant, encrypted at rest, stored in SOC-2 certified infrastructure. Your data is never sold or shared with third parties.",
      },
    ],
  },
  {
    category: "Cancellation & refunds",
    items: [
      {
        q: "Can I cancel anytime?",
        a: "Yes. Cancel from your dashboard in 30 seconds. No cancellation fees, no contracts, no questions asked.",
      },
      {
        q: "What's the refund policy?",
        a: "If you cancel before your medications have shipped, you'll receive a full refund. Once medications have shipped, we can't accept returns (it's regulated pharmaceutical product), but we'll work with you on a case-by-case basis.",
      },
      {
        q: "Can I pause my subscription?",
        a: "Yes. Pause for up to 3 months from your dashboard. Your physician's prescription stays active.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div>

      <section className="py-16 sm:py-20 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[var(--muted)]">
            Everything you need to know before you start.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            {FAQS.map((section) => (
              <div key={section.category}>
                <h2 className="text-xl font-bold mb-6 pb-3 border-b border-[var(--card-border)]">
                  {section.category}
                </h2>
                <div className="divide-y divide-[var(--card-border)]">
                  {section.items.map((faq) => (
                    <div key={faq.q} className="py-5">
                      <h3 className="font-semibold text-[var(--foreground)] mb-2">{faq.q}</h3>
                      <p className="text-[var(--muted)] text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-8 text-center">
            <h2 className="font-bold text-[var(--foreground)] mb-2">Still have questions?</h2>
            <p className="text-sm text-[var(--muted)] mb-4">
              Email us at{" "}
              <a href="mailto:hello@thelongevityagent.com" className="text-[var(--accent)] hover:underline">
                hello@thelongevityagent.com
              </a>
              . We respond within one business day.
            </p>
            <Link
              href="/intake"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
            >
              Get Started — from $19/mo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
