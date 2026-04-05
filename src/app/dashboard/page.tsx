import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — The Longevity Agent",
};

export default function DashboardPage() {
  // TODO: Supabase auth gate — redirect to /login if not authenticated

  return (
    <div className="bg-[var(--gray-bg)] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)]">Your Dashboard</h1>
            <p className="text-sm text-[var(--gray)] mt-0.5">Manage your prescriptions and health records.</p>
          </div>
          <Link
            href="/intake"
            className="text-sm bg-[var(--navy)] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[var(--navy-dark)] transition-colors"
          >
            + Add medication
          </Link>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Active prescriptions", value: "—", sub: "Complete intake to start" },
            { label: "Next shipment", value: "—", sub: "No active subscription" },
            { label: "Physician", value: "—", sub: "Pending intake" },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs text-[var(--gray)] uppercase tracking-wide mb-2">{card.label}</p>
              <p className="text-2xl font-bold text-[var(--navy)]">{card.value}</p>
              <p className="text-xs text-[var(--gray-light)] mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <div className="w-14 h-14 bg-[var(--gray-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[var(--gray)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="font-semibold text-[var(--navy)] mb-1">No active prescriptions</h2>
          <p className="text-sm text-[var(--gray)] mb-6 max-w-sm mx-auto">
            Complete your health intake to get started. A physician will review your profile within 24–48 hours.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center gap-2 bg-[var(--navy)] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--navy-dark)] transition-colors text-sm"
          >
            Start intake — from $19/mo
          </Link>
        </div>

        {/* Help */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-[var(--navy)] mb-4">Have questions?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="mailto:hello@thelongevityagent.com" className="flex items-center gap-2 text-sm text-[var(--navy)] hover:underline">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email support
            </a>
            <Link href="/faq" className="flex items-center gap-2 text-sm text-[var(--navy)] hover:underline">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              FAQ
            </Link>
            <Link href="/how-it-works" className="flex items-center gap-2 text-sm text-[var(--navy)] hover:underline">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How it works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
