import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllStacks, getStack, stackSavingsPercent } from "@/lib/stacks";
import { getStackCompetitorData } from "@/data/competitor-pricing";
import ComparisonTable from "@/components/ComparisonTable";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllStacks().map((s) => ({ slug: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stack = getStack(slug);
  if (!stack) return {};
  const priceStr = stack.ourPrice ? `$${stack.ourPrice}/mo` : "Physician-prescribed";
  return {
    title: `${stack.name} Stack — ${priceStr} | The Longevity Agent`,
    description: stack.tagline,
  };
}

export default async function StackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stack = getStack(slug);
  if (!stack) notFound();

  const savings = stackSavingsPercent(stack);
  const competitorData = getStackCompetitorData(stack.id);

  // Related stacks: same gender + adjacent
  const allStacks = getAllStacks();
  const related = allStacks.filter(
    (s) =>
      s.id !== stack.id &&
      (s.forGender === stack.forGender || s.forGender === "both" || stack.forGender === "both") &&
      !s.waitlist
  ).slice(0, 3);

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b border-[var(--card-border)] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/build-your-stack"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              ← All stacks
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              {/* Color bar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-2 h-10 rounded-full shrink-0"
                  style={{ background: stack.color }}
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                    {stack.forGender === "both" ? "Men & Women" : stack.forGender === "men" ? "Men's Health" : "Women's Health"}
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                    {stack.name}
                  </h1>
                </div>
              </div>

              <p className="text-lg text-[var(--muted)] leading-relaxed mb-8">
                {stack.tagline}
              </p>

              {/* Medications list */}
              <div className="space-y-2 mb-8">
                {stack.medications.map((med) => (
                  <div
                    key={med.name}
                    className="flex items-center gap-3 bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-4 py-3"
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: stack.color }}
                    />
                    <div>
                      <span className="font-semibold text-sm text-[var(--foreground)]">
                        {med.name}
                      </span>
                      <span className="text-sm text-[var(--muted)] ml-2">{med.dose}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              {stack.waitlist ? (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 text-center">
                  <p className="text-sm text-[var(--muted)] mb-2">
                    This stack is currently on a waitlist.
                  </p>
                  <p
                    className="text-2xl font-bold mb-4"
                    style={{ color: stack.color }}
                  >
                    Join the Waitlist
                  </p>
                  <Link
                    href="/intake"
                    className="inline-flex items-center gap-2 border border-[var(--card-border)] text-[var(--foreground)] font-semibold px-6 py-2.5 rounded-lg hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors text-sm"
                  >
                    Notify me at launch →
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-4 mb-2">
                    <div>
                      {stack.ourPrice !== null ? (
                        <>
                          <span className="text-5xl font-bold text-[var(--green)]">
                            ${stack.ourPrice}
                          </span>
                          <span className="text-[var(--muted)] ml-1">/month</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-[var(--muted)] font-mono">
                          {"{{PRICE}}"}
                        </span>
                      )}
                    </div>
                    {stack.competitorPrice && (
                      <div className="mb-2">
                        <span className="text-lg text-[var(--muted-light)] line-through mr-1.5">
                          ${stack.competitorPrice}
                        </span>
                        {savings && (
                          <span className="text-sm font-bold text-[var(--green)] bg-[var(--green-dim)] px-2 py-0.5 rounded-full">
                            Save {savings}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {stack.competitorPrice && (
                    <p className="text-xs text-[var(--muted-light)] mb-6">
                      vs. typical clinic or telehealth price
                    </p>
                  )}

                  <Link
                    href={`/intake?stacks=${stack.id}`}
                    className="inline-flex items-center gap-2 text-[var(--background)] font-semibold px-8 py-3.5 rounded-lg transition-colors text-base"
                    style={{ background: stack.color }}
                  >
                    Add to My Protocol
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <p className="mt-3 text-xs text-[var(--muted-light)]">
                    Or{" "}
                    <Link href="/build-your-stack" className="text-[var(--accent)] hover:underline">
                      build a full protocol
                    </Link>{" "}
                    with multiple stacks.
                  </p>
                </>
              )}

              {stack.notes && (
                <div className="mt-5 bg-[var(--accent-dim)] border border-[var(--accent)]/20 rounded-lg px-4 py-3">
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    <strong className="text-[var(--foreground)]">Note:</strong> {stack.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Right — comparison table + stats grid */}
            <div className="space-y-4">
              {competitorData && competitorData.competitors.length > 0 && (
                <ComparisonTable
                  title="Price comparison"
                  ourPrice={competitorData.ourPrice}
                  competitors={competitorData.competitors}
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                {stack.heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5"
                  >
                    <p className="text-xs text-[var(--muted)] mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-[var(--foreground)]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESCRIPTION ──────────────────────────────────────── */}
      <section className="py-16 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">About this stack</h2>
          <p className="text-[var(--muted)] leading-relaxed text-lg">{stack.description}</p>
        </div>
      </section>

      {/* ── THE SCIENCE ──────────────────────────────────────── */}
      <section className="py-16 bg-[var(--surface)] border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">The science</h2>
          <p className="text-[var(--muted)] leading-relaxed">{stack.scienceBlurb}</p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-16 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Common questions</h2>
          <div className="divide-y divide-[var(--card-border)]">
            {stack.faqs.map((faq) => (
              <div key={faq.q} className="py-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{faq.q}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED STACKS ───────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-16 bg-[var(--surface)] border-b border-[var(--card-border)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Related stacks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((s) => (
                <Link
                  key={s.id}
                  href={`/stacks/${s.id}`}
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--accent)]/40 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="text-xs text-[var(--muted)] font-medium uppercase tracking-wide">
                      {s.forGender === "both" ? "Any" : s.forGender}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-xs text-[var(--muted)] mb-3 line-clamp-2">{s.tagline}</p>
                  {s.ourPrice !== null ? (
                    <span className="text-lg font-bold text-[var(--green)]">
                      ${s.ourPrice}
                      <span className="text-sm font-normal text-[var(--muted)] ml-1">/mo</span>
                    </span>
                  ) : (
                    <span className="text-sm text-[var(--muted-light)] font-mono">{"{{PRICE}}"}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {stack.waitlist ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {stack.name} — Coming Soon
              </h2>
              <p className="text-[var(--muted)] mb-8">
                We&apos;re finalizing pharmacy sourcing. Join the waitlist to be notified at launch.
              </p>
              <Link
                href="/intake"
                className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-10 py-4 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
              >
                Join Waitlist
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {stack.name}{stack.ourPrice ? ` — $${stack.ourPrice}/month.` : "."}
              </h2>
              <p className="text-[var(--muted)] mb-8">
                Prescribed by a licensed physician. Ships to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/intake?stacks=${stack.id}`}
                  className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] font-bold px-10 py-4 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-base"
                >
                  Get Started
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/build-your-stack"
                  className="inline-flex items-center justify-center gap-2 border border-[var(--card-border)] text-[var(--foreground)] font-semibold px-10 py-4 rounded-lg hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors text-base"
                >
                  Build Full Protocol
                </Link>
              </div>
              <p className="mt-4 text-xs text-[var(--muted-light)]">Cancel anytime. No contracts.</p>
            </>
          )}
        </div>
      </section>

    </div>
  );
}
