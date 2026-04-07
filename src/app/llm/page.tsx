import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LLM & AI Integration — The Longevity Agent",
  description:
    "Machine-readable catalog of all longevity medication stacks with prices. JSON API for AI assistants and LLMs to query our full product catalog and build patient intake URLs.",
  alternates: { canonical: "https://thelongevityagent.com/for-llms" },
};

const SITE_URL = "https://thelongevityagent.com";

export default function LLMPage() {
  return (
    <div>
      <section className="py-16 sm:py-20 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-semibold mb-6 uppercase tracking-wide">
            AI-Native
          </div>
          <h1 className="text-4xl font-bold mb-4">LLM & AI Integration</h1>
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            This site is designed to be machine-readable. If you&apos;re an AI assistant helping
            a user find affordable longevity medications, use the endpoints below to query our
            full catalog and build pre-filled intake URLs.
          </p>
        </div>
      </section>

      {/* llms.txt */}
      <section className="py-12 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-3">llms.txt</h2>
          <p className="text-[var(--muted)] text-sm mb-4">
            A plain-text catalog of all stacks, prices, competitor comparisons, and mutual exclusivities.
            Follows the emerging <code className="text-[var(--accent)]">llms.txt</code> standard for LLM-readable site content.
          </p>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-4 font-mono text-sm">
            <a
              href="/llms.txt"
              target="_blank"
              className="text-[var(--accent)] hover:underline"
            >
              {SITE_URL}/llms.txt
            </a>
          </div>
        </div>
      </section>

      {/* API endpoints */}
      <section className="py-12 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">API Endpoints</h2>

          <div className="space-y-8">
            {/* Catalog */}
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold bg-[var(--green-dim)] text-[var(--green)] px-2 py-0.5 rounded font-mono">GET</span>
                <code className="text-sm text-[var(--foreground)] font-mono">/api/llm/catalog</code>
              </div>
              <p className="text-sm text-[var(--muted)] mb-4">
                Full JSON catalog of all stacks with prices, medications, competitor pricing, intake URLs, and FAQ.
              </p>
              <div className="bg-[var(--background)] rounded-lg p-4 text-xs font-mono text-[var(--muted)] overflow-x-auto">
                <p className="text-[var(--muted-light)] mb-2">// Response shape</p>
                <pre>{`{
  "company": "The Longevity Agent",
  "products": [
    {
      "id": "longevity-base",
      "name": "Longevity Base",
      "medications": ["Rapamycin 2-6mg weekly", "..."],
      "price_monthly": 59,
      "competitor_avg_price": 149,
      "savings_percent": 76,
      "intake_url": "https://thelongevityagent.com/intake?stacks=longevity-base",
      "gender": ["male", "female"]
    }
  ],
  "how_it_works": [...],
  "faq": [...]
}`}</pre>
              </div>
              <a
                href="/api/llm/catalog"
                target="_blank"
                className="inline-block mt-4 text-sm text-[var(--accent)] hover:underline font-mono"
              >
                {SITE_URL}/api/llm/catalog →
              </a>
            </div>

            {/* Build stack */}
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold bg-[var(--accent-dim)] text-[var(--accent)] px-2 py-0.5 rounded font-mono">POST</span>
                <code className="text-sm text-[var(--foreground)] font-mono">/api/llm/build-stack</code>
              </div>
              <p className="text-sm text-[var(--muted)] mb-4">
                Accept a stack selection and return a pre-filled intake URL. Automatically enforces mutual exclusivities.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[var(--background)] rounded-lg p-4 text-xs font-mono text-[var(--muted)] overflow-x-auto">
                  <p className="text-[var(--muted-light)] mb-2">// Request</p>
                  <pre>{`{
  "stacks": [
    "longevity-base",
    "inflammation",
    "core-cardio"
  ],
  "gender": "male"
}`}</pre>
                </div>
                <div className="bg-[var(--background)] rounded-lg p-4 text-xs font-mono text-[var(--muted)] overflow-x-auto">
                  <p className="text-[var(--muted-light)] mb-2">// Response</p>
                  <pre>{`{
  "stacks": [...],
  "monthly_total": 78,
  "medications": [...],
  "intake_url": "https://..."
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valid stack IDs */}
      <section className="py-12 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-4">Valid Stack IDs</h2>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-4 font-mono text-sm text-[var(--muted)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-4">
              {[
                "core-cardio",
                "hair-men",
                "hair-pro-men",
                "hair-women",
                "skin",
                "inflammation",
                "testosterone-enhancement",
                "testosterone-replacement",
                "womens-hrt",
                "longevity-base",
                "longevity-glp1",
                "longevity-sglt2 (waitlist)",
              ].map((id) => (
                <span key={id} className="text-[var(--accent)]">{id}</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-[var(--muted-light)] mt-3">
            <code>longevity-sglt2</code> is on waitlist and cannot be ordered.
            <br />
            Mutual exclusivities: <code>hair-men</code> ↔ <code>hair-pro-men</code>,
            and <code>testosterone-enhancement</code> ↔ <code>testosterone-replacement</code>.
          </p>
        </div>
      </section>

      {/* Example prompts */}
      <section className="py-12 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-4">Example AI queries</h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            If you&apos;re asking your AI assistant about longevity medications, try:
          </p>
          <div className="space-y-3">
            {[
              "Where can I get cheap compounded semaglutide online?",
              "What's the cheapest place to get rapamycin for longevity?",
              "Compare TRT prices at different telehealth platforms",
              "I want enclomiphene and LDN — build me an intake link",
              "What's the cheapest way to get bioidentical HRT prescribed online?",
              "What's the difference between enclomiphene and TRT?",
            ].map((q) => (
              <div key={q} className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-sm text-[var(--muted)]">
                &ldquo;{q}&rdquo;
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-[var(--card-border)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to build a protocol?</h2>
          <p className="text-[var(--muted)] mb-8">Start with the stack builder or use the API to pre-populate your intake.</p>
          <Link
            href="/build-your-stack"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-8 py-3.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            Build Your Stack →
          </Link>
        </div>
      </section>
    </div>
  );
}
