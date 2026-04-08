import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — The Longevity Agent",
  description: "Terms of service for The Longevity Agent LLC. Telemedicine platform for prescription longevity medications.",
};

export default function TermsPage() {
  return (
    <div>
      <section className="py-16 sm:py-20 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-[var(--muted)]">
            Effective date: April 1, 2026 · The Longevity Agent LLC (Utah)
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-[var(--muted)] leading-relaxed text-sm">

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">1. About The Longevity Agent LLC</h2>
            <p className="mb-3">
              The Longevity Agent LLC (&ldquo;TLA,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a Utah limited liability
              company operating a technology platform that facilitates access to telemedicine
              services. <strong className="text-[var(--foreground)]">The Longevity Agent LLC is not a medical practice, hospital,
              clinic, or healthcare facility.</strong> We do not provide medical services.
            </p>
            <p>
              We operate as a Managed Services Organization (MSO) and technology intermediary.
              Clinical services — including evaluation, diagnosis, and prescribing — are
              provided exclusively by independently licensed healthcare providers who use our
              platform. These providers exercise independent medical judgment and are not
              employees of The Longevity Agent LLC.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">2. Acceptance of Terms</h2>
            <p>
              By accessing or using the thelongevityagent.com website or any associated services,
              you agree to these Terms of Service and our Privacy Policy. If you do not agree,
              do not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">3. Eligibility</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>You must be 18 years of age or older to use our services</li>
              <li>You must be a resident of the United States</li>
              <li>You must provide accurate and complete health information during intake</li>
              <li>You must not use our services to obtain medications for resale or diversion</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">4. Telemedicine Services</h2>
            <p className="mb-3">
              Our platform connects you with licensed healthcare providers for telemedicine
              consultations. By submitting an intake questionnaire, you consent to a
              telemedicine evaluation. You understand that:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Telemedicine has limitations compared to in-person care</li>
              <li>The reviewing provider may decline to prescribe if clinically inappropriate</li>
              <li>Prescription approval is not guaranteed upon payment</li>
              <li>You should maintain a relationship with a primary care provider for comprehensive care</li>
              <li>This service is not for emergencies — call 911 for medical emergencies</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">5. Prescriptions and Medications</h2>
            <p className="mb-3">
              Medications are prescribed off-label in some cases, consistent with standard
              medical practice. Off-label prescribing is legal and common — approximately
              20% of all U.S. prescriptions are for off-label use. Your provider will
              discuss which medications in your protocol, if any, are prescribed off-label.
            </p>
            <p>
              Compounded medications are prepared by licensed 503A compounding pharmacies.
              Compounded medications are not FDA-approved drug products. They are produced
              in FDA-registered facilities under state pharmacy board oversight when
              FDA-approved alternatives are unavailable or clinically unsuitable.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">6. Subscriptions and Billing</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Subscriptions are billed monthly in advance</li>
              <li>Your first charge occurs at checkout after completing the intake questionnaire</li>
              <li>Subsequent charges occur monthly on the same day</li>
              <li>You may cancel anytime from your dashboard — cancellation takes effect at the end of the current billing period</li>
              <li>Refunds are issued if your prescription is not approved before medications ship</li>
              <li>We do not accept insurance</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">7. Pharmacy and Dispensing</h2>
            <p>
              Medications are dispensed by The Pharmacy Hub (Miami, FL), a licensed 503A
              compounding pharmacy. Dispensing is subject to the pharmacy&apos;s terms and
              applicable state and federal law. The Longevity Agent LLC is not the
              dispensing pharmacy and does not ship medications directly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">8. Medical Disclaimer</h2>
            <p>
              Content on this website is for informational purposes only and does not
              constitute medical advice. No physician-patient relationship is created by
              using this website without completing a clinical intake and receiving a
              prescription from a licensed provider. Seek emergency medical care for any
              urgent health condition.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">9. Not a Guarantee of Results</h2>
            <p>
              Medication efficacy varies by individual. Clinical trial outcomes cited on this
              site reflect population-level data from peer-reviewed studies. Individual results
              may differ. We make no guarantee of specific outcomes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, The Longevity Agent LLC shall not be
              liable for any indirect, incidental, special, or consequential damages arising
              from use of our platform or medications prescribed through it. Our liability
              is limited to the amount paid by you in the three months preceding the claim.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Utah. Any dispute shall
              be resolved by binding arbitration in Salt Lake County, Utah, except that
              either party may seek injunctive relief in any court of competent jurisdiction.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">12. Changes to These Terms</h2>
            <p>
              We may update these Terms at any time. Material changes will be communicated
              by email. Continued use of our services after changes constitutes acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">13. Contact</h2>
            <p>
              The Longevity Agent LLC<br />
              Utah, United States<br />
              Email:{" "}
              <a href="mailto:hello@thelongevityagent.com" className="text-[var(--accent)] hover:underline">
                hello@thelongevityagent.com
              </a>
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--card-border)]">
            <p className="text-xs text-[var(--muted-light)]">
              Last updated April 1, 2026. These Terms of Service constitute the entire agreement
              between you and The Longevity Agent LLC regarding your use of our services.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
