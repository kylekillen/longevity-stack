import Link from "next/link";
import { getWomensStacks } from "@/lib/stacks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Longevity Protocol — The Longevity Agent",
  description:
    "8 modular prescription stacks for women. Cardiovascular protection, HRT, hair, skin, inflammation, and longevity biology. From $19/month.",
};

export default function WomenPage() {
  const stacks = getWomensStacks();

  return (
    <div>

      {/* Hero */}
      <section className="py-16 sm:py-20 border-b border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-semibold mb-6 uppercase tracking-wide">
            Women&apos;s Health
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Build your women&apos;s longevity protocol.<br />
            <span className="text-[var(--accent)]">Mix and match 8 stacks.</span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-8">
            Each stack targets a specific health goal. Select any combination —
            a board-certified physician reviews your full protocol, not just individual medications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build-your-stack?gender=women"
              className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-8 py-3.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
            >
              Build Women&apos;s Protocol
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
        </div>
      </section>

      {/* Stacks grid */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Women&apos;s stacks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stacks.map((stack) => (
              <Link
                key={stack.id}
                href={`/stacks/${stack.id}`}
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--accent)]/40 transition-all group"
                style={{ borderLeftColor: stack.color, borderLeftWidth: "3px" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: stack.color }} />
                  {stack.badge && (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: stack.color + "22", color: stack.color }}
                    >
                      {stack.badge}
                    </span>
                  )}
                  {stack.waitlist && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)]">
                      Waitlist
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {stack.name}
                </h3>
                <p className="text-xs text-[var(--muted)] mb-3 line-clamp-2">{stack.tagline}</p>
                <p className="text-xs text-[var(--muted-light)] mb-4">
                  {stack.medications.map((m) => m.name).join(" + ")}
                </p>
                <div>
                  {stack.waitlist ? (
                    <span className="text-xs text-[var(--muted)]">Joining waitlist</span>
                  ) : stack.ourPrice !== null ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[var(--green)]">
                        ${stack.ourPrice}
                        <span className="text-sm font-normal text-[var(--muted)] ml-1">/mo</span>
                      </span>
                      {stack.competitorPrice && (
                        <span className="text-sm text-[var(--muted-light)] line-through">
                          ${stack.competitorPrice}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-[var(--muted-light)] font-mono">{"{{PRICE}}"}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HRT explainer */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Bioidentical HRT — the evidence has caught up.
              </h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                The 2002 WHI study that frightened women off HRT used synthetic
                progestins and conjugated equine estrogens — not the
                body-identical hormones we prescribe. Current evidence clearly
                supports bioidentical estradiol and micronized progesterone as
                safe and effective for most women under 60.
              </p>
              <p className="text-[var(--muted)] leading-relaxed mb-6">
                The British Menopause Society, the Menopause Society, and the
                NICE guidelines all support HRT as first-line treatment for
                menopausal symptoms — and as a longevity intervention in its
                own right.
              </p>
              <Link
                href="/blog/hrt-the-study-that-scared-a-generation"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                Read the full evidence breakdown →
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { q: "Is HRT right for me?", a: "Your physician will evaluate your symptoms, hormone levels, and personal and family history during intake." },
                { q: "When should I start?", a: "Evidence is strongest for starting within 10 years of menopause onset. Earlier intervention tends to have better long-term outcomes." },
                { q: "What about cancer risk?", a: "Current evidence shows no increased risk with estrogen-only HRT, and minimal increase with combined therapy in the first 5 years." },
              ].map((item) => (
                <div key={item.q} className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-4">
                  <p className="font-semibold text-[var(--foreground)] text-sm mb-1">{item.q}</p>
                  <p className="text-sm text-[var(--muted)]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">How it works</h2>
          <p className="text-[var(--muted)] mb-10">Protocol to doorstep in under a week.</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 text-left">
            {[
              { n: "01", t: "Build your protocol", d: "Select any stacks that match your goals. Mutual exclusivities are enforced automatically." },
              { n: "02", t: "Physician reviews within 48h", d: "A board-certified doctor reviews your full protocol for interactions and contraindications." },
              { n: "03", t: "Rx ships to your door", d: "FDA-approved generics from licensed U.S. pharmacies. Arrives in 3–5 business days." },
              { n: "04", t: "Annual check-in", d: "One renewal per year. Message your physician anytime. Cancel anytime." },
            ].map((s) => (
              <div key={s.n} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--accent)]/30 transition-colors">
                <div className="text-[var(--accent)] text-lg font-mono font-bold mb-3">{s.n}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 text-sm">{s.t}</h3>
                <p className="text-sm text-[var(--muted)]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Start your women&apos;s protocol today.
          </h2>
          <p className="text-[var(--muted)] mb-8">From $19/month. No office visit required.</p>
          <Link
            href="/build-your-stack?gender=women"
            className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-10 py-4 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
          >
            Build Women&apos;s Protocol
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-3 text-sm text-[var(--muted-light)]">Cancel anytime. No contracts.</p>
        </div>
      </section>

    </div>
  );
}
