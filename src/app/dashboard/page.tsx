import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard — The Longevity Agent",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch subscriptions and intake records
  const { data: subscriptions } = await supabase
    .schema("la")
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: intakeRecords } = await supabase
    .schema("la")
    .from("intake_records")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const activeCount = subscriptions?.filter((s) => s.status === "active").length ?? 0;
  const latestIntake = intakeRecords?.[0];
  const intakeStatus = latestIntake?.status ?? null;

  const statusLabel: Record<string, string> = {
    pending_review: "Pending review",
    approved: "Approved",
    declined: "Declined",
    needs_info: "Needs info",
  };

  return (
    <div className="bg-[var(--surface)] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">Your Dashboard</h1>
            <p className="text-sm text-[var(--muted)] mt-0.5">{user.email}</p>
          </div>
          <Link
            href="/intake"
            className="text-sm bg-[var(--accent)] text-[var(--background)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            + Add medication
          </Link>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-2">Active prescriptions</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">{activeCount || "—"}</p>
            <p className="text-xs text-[var(--muted-light)] mt-0.5">
              {activeCount > 0 ? `${activeCount} active subscription${activeCount > 1 ? "s" : ""}` : "Complete intake to start"}
            </p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-2">Physician review</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {intakeStatus ? statusLabel[intakeStatus] ?? intakeStatus : "—"}
            </p>
            <p className="text-xs text-[var(--muted-light)] mt-0.5">
              {intakeStatus === "pending_review" ? "Within 24–48 hours" : intakeStatus ? "" : "No intake submitted"}
            </p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-2">Account</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">Active</p>
            <p className="text-xs text-[var(--muted-light)] mt-0.5">Member since {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
          </div>
        </div>

        {/* Subscriptions list */}
        {subscriptions && subscriptions.length > 0 ? (
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-[var(--card-border)]">
              <h2 className="font-semibold text-[var(--foreground)]">Your subscriptions</h2>
            </div>
            <div className="divide-y divide-[var(--card-border)]">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--foreground)] capitalize">{sub.product_slug.replace(/-/g, " ")}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {sub.current_period_end
                        ? `Renews ${new Date(sub.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                        : "Active subscription"}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    sub.status === "active"
                      ? "bg-[var(--green-dim)] text-[var(--green)]"
                      : sub.status === "past_due"
                      ? "bg-amber-900/30 text-amber-400"
                      : "bg-[var(--surface)] text-[var(--muted)]"
                  }`}>
                    {sub.status === "active" ? "Active" : sub.status === "past_due" ? "Past due" : sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-10 text-center mb-6">
            <div className="w-14 h-14 bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="font-semibold text-[var(--foreground)] mb-1">No active prescriptions</h2>
            <p className="text-sm text-[var(--muted)] mb-6 max-w-sm mx-auto">
              Complete your health intake to get started. A physician will review your profile within 24–48 hours.
            </p>
            <Link
              href="/intake"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
            >
              Start intake — from $19/mo
            </Link>
          </div>
        )}

        {/* Help */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-4">Have questions?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="mailto:hello@thelongevityagent.com" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email support
            </a>
            <Link href="/faq" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              FAQ
            </Link>
            <Link href="/how-it-works" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
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
