import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — The Longevity Agent",
  description: "How The Longevity Agent collects, uses, and protects your health information. HIPAA-compliant.",
};

export default function PrivacyPage() {
  return (
    <div>
      <section className="py-16 sm:py-20 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-[var(--muted)]">
            Effective date: April 1, 2026 · The Longevity Agent LLC (Utah)
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-[var(--muted)] leading-relaxed text-sm">

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">1. Who We Are</h2>
            <p>
              The Longevity Agent LLC is a Utah limited liability company operating as a technology
              and managed services platform that facilitates access to telemedicine services. We are
              not a medical practice. We connect patients with independently licensed healthcare
              providers who provide clinical evaluations and prescriptions. Registered address:
              Utah, United States. EIN registered with the IRS.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">2. HIPAA Notice</h2>
            <p className="mb-3">
              We are a covered entity or business associate under the Health Insurance Portability
              and Accountability Act of 1996 (HIPAA). Your Protected Health Information (PHI) is
              handled in accordance with HIPAA Privacy and Security Rules.
            </p>
            <p>
              We maintain administrative, physical, and technical safeguards to protect the
              confidentiality, integrity, and availability of electronic PHI. Our infrastructure
              is SOC-2 certified. Health data is encrypted at rest and in transit.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">3. Information We Collect</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-[var(--foreground)]">Identity information:</strong> Name, date of birth, gender, state of residence</li>
              <li><strong className="text-[var(--foreground)]">Contact information:</strong> Email address, phone number, shipping address</li>
              <li><strong className="text-[var(--foreground)]">Health information:</strong> Medical history, current medications, symptoms, lab results — collected during your intake questionnaire</li>
              <li><strong className="text-[var(--foreground)]">Payment information:</strong> Processed by our payment processor; we do not store full card numbers</li>
              <li><strong className="text-[var(--foreground)]">Usage data:</strong> Pages visited, browser type, device type, IP address — collected via standard web analytics</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">4. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To facilitate your clinical evaluation by a licensed healthcare provider</li>
              <li>To process your prescription and coordinate dispensing by a licensed pharmacy</li>
              <li>To communicate with you about your orders, renewals, and health updates</li>
              <li>To maintain records required by applicable law</li>
              <li>To improve our platform and services (using de-identified or aggregated data only)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">5. How We Share Your Information</h2>
            <p className="mb-3">We do not sell your personal information or health data. We share your information only as follows:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-[var(--foreground)]">Healthcare providers:</strong> The licensed provider conducting your clinical evaluation receives your intake information to make prescribing decisions</li>
              <li><strong className="text-[var(--foreground)]">Pharmacy:</strong> Your prescription information is transmitted to our licensed pharmacy partner to fill your order</li>
              <li><strong className="text-[var(--foreground)]">Service providers:</strong> We use HIPAA Business Associates for infrastructure (hosting, email, payments) who are bound by BAAs</li>
              <li><strong className="text-[var(--foreground)]">Legal requirements:</strong> We disclose information when required by law, court order, or to protect patient or public safety</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">6. Your Rights</h2>
            <p className="mb-3">Under HIPAA and applicable state laws, you have the right to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Access your medical records and health information we hold</li>
              <li>Request corrections to inaccurate information</li>
              <li>Request restrictions on certain uses of your PHI</li>
              <li>Request an accounting of disclosures of your PHI</li>
              <li>Receive a copy of this Notice</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@thelongevityagent.com" className="text-[var(--accent)] hover:underline">
                privacy@thelongevityagent.com
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">7. Data Retention</h2>
            <p>
              We retain your health records for a minimum of seven (7) years from the date of
              service, or longer as required by applicable state law. Account and payment data
              is retained for the duration of your account and for seven years thereafter for
              legal and compliance purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">8. Cookies and Tracking</h2>
            <p>
              Our website uses cookies and similar technologies for session management,
              analytics, and basic functionality. We do not use tracking technologies for
              advertising targeting on pages where health information is collected.
              You may disable cookies in your browser settings; this may affect site functionality.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">9. Children</h2>
            <p>
              Our services are intended for adults 18 years of age or older. We do not
              knowingly collect information from individuals under 18.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              communicated by email or by a prominent notice on this page. Continued use of
              our services after changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">11. Contact</h2>
            <p>
              Privacy Officer, The Longevity Agent LLC<br />
              Email:{" "}
              <a href="mailto:privacy@thelongevityagent.com" className="text-[var(--accent)] hover:underline">
                privacy@thelongevityagent.com
              </a><br />
              General inquiries:{" "}
              <a href="mailto:hello@thelongevityagent.com" className="text-[var(--accent)] hover:underline">
                hello@thelongevityagent.com
              </a>
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--card-border)]">
            <p className="text-xs text-[var(--muted-light)]">
              This Privacy Policy was last updated April 1, 2026. For questions about our
              privacy practices, contact us at{" "}
              <a href="mailto:privacy@thelongevityagent.com" className="text-[var(--accent)] hover:underline">
                privacy@thelongevityagent.com
              </a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
