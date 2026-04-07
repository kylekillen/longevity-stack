import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're in — The Longevity Agent",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; session_id?: string }>;
}) {
  const { product: productSlug } = await searchParams;
  const product = getAllProducts().find((p) => p.slug === productSlug);

  return (
    <div className="min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">

        <div className="w-16 h-16 bg-[var(--green-dim)] border border-[var(--green)]/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[var(--green)]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-3">
          You&apos;re in. What happens next.
        </h1>

        {product && (
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 mb-8 text-left">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Your order</p>
            <p className="font-semibold text-[var(--foreground)]">{product.name}</p>
            <p className="text-sm text-[var(--muted)]">
              ${product.ourPrice}/month · Billed monthly · Cancel anytime
            </p>
          </div>
        )}

        <div className="space-y-4 mb-10 text-left">
          {[
            {
              icon: "🕐",
              title: "Physician review — 24 to 48 hours",
              desc: "A board-certified physician will review your intake questionnaire. They'll approve your protocol or reach out if they have questions.",
            },
            {
              icon: "📦",
              title: "Medications ship — 3 to 5 business days",
              desc: "Once approved, your prescription is sent to a licensed U.S. pharmacy. Your medications ship directly to your door.",
            },
            {
              icon: "📧",
              title: "Check your email",
              desc: "You'll receive a confirmation with tracking information and a link to your patient dashboard.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-4 bg-[var(--card)] rounded-xl border border-[var(--card-border)]">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-[var(--foreground)] text-sm mb-0.5">{item.title}</p>
                <p className="text-sm text-[var(--muted)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-semibold px-6 py-3 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
          >
            Go to your dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-[var(--card-border)] text-[var(--foreground)] font-medium px-6 py-3 rounded-lg hover:border-[var(--accent)]/40 transition-colors text-sm"
          >
            Back to home
          </Link>
        </div>

        <p className="mt-8 text-xs text-[var(--muted-light)]">
          Questions? Email{" "}
          <a href="mailto:hello@thelongevityagent.com" className="text-[var(--accent)] hover:underline">
            hello@thelongevityagent.com
          </a>
        </p>
      </div>
    </div>
  );
}
