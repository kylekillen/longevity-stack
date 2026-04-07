import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllStacks, getStack, stackSavingsPercent } from "@/lib/stacks";
import { getStackCompetitorData } from "@/data/competitor-pricing";
import ComparisonTable from "@/components/ComparisonTable";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllStacks().map((s) => ({ slug: s.id }));
}

const SITE_URL = "https://thelongevityagent.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stack = getStack(slug);
  if (!stack) return {};
  const priceStr = stack.ourPrice ? `$${stack.ourPrice}/mo` : "Physician-prescribed";
  const medList = stack.medications.map((m) => m.name).join(", ");
  const title = `${stack.name} — ${priceStr} | Physician-Prescribed`;
  const description = `${stack.name}: ${medList}. ${priceStr}. ${stack.tagline} Prescribed by licensed healthcare providers. Ships to your door.`;
  const url = `${SITE_URL}/stacks/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: "/og-product.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
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

  const stackUrl = `${SITE_URL}/stacks/${stack.id}`;

  // JSON-LD: Product + Drug + FAQPage + BreadcrumbList
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: stack.name,
    description: stack.description,
    url: stackUrl,
    brand: { "@type": "Brand", name: "The Longevity Agent" },
    category: "Prescription Medication",
    ...(stack.ourPrice !== null && !stack.waitlist
      ? {
          offers: {
            "@type": "Offer",
            price: stack.ourPrice,
            priceCurrency: "USD",
            priceValidUntil: "2026-12-31",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: stack.ourPrice,
              priceCurrency: "USD",
              unitText: "MON",
              billingIncrement: 1,
            },
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/intake?stacks=${stack.id}`,
            seller: { "@type": "Organization", name: "The Longevity Agent" },
          },
        }
      : {}),
  };

  // Drug schema — one per medication in the stack
  const drugSchemas = stack.medications.map((med) => ({
    "@context": "https://schema.org",
    "@type": "Drug",
    name: med.name,
    dosageForm: med.dose,
    activeIngredient: med.name,
    administrationRoute: med.dose.toLowerCase().includes("topical") || med.dose.toLowerCase().includes("cream") || med.dose.toLowerCase().includes("transdermal") || med.dose.toLowerCase().includes("patch") || med.dose.toLowerCase().includes("gel")
      ? "Topical"
      : med.dose.toLowerCase().includes("inject")
      ? "Injection"
      : "Oral",
    isProprietary: false,
    legalStatus: "PrescriptionOnly",
    prescribingInfo: `${SITE_URL}/stacks/${stack.id}`,
    relatedDrug: stack.medications.filter((m) => m.name !== med.name).map((m) => ({ "@type": "Drug", name: m.name })),
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: stack.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Stacks", item: `${SITE_URL}/build-your-stack` },
      { "@type": "ListItem", position: 3, name: stack.name, item: stackUrl },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      {drugSchemas.map((ds, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ds) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
                      vs. {stack.lowestCompetitor ?? "cheapest competitor"} ${stack.competitorPrice}/mo
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

      {/* ── TRT: Lab requirements ────────────────────────────── */}
      {stack.id === "testosterone-replacement" && (
        <section className="py-16 border-b border-[var(--card-border)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Lab requirements & pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-2">Monthly</p>
                <p className="text-4xl font-bold text-[var(--green)] mb-1">$79</p>
                <p className="text-sm text-[var(--muted)]">Testosterone cream + physician management</p>
              </div>
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-2">Annual lab panel</p>
                <p className="text-4xl font-bold text-[var(--foreground)] mb-1">$79</p>
                <p className="text-sm text-[var(--muted)]">Required before first Rx, then annually. Waived if you have recent labs.</p>
              </div>
            </div>
            <div className="bg-[var(--surface)] rounded-xl px-5 py-5 mb-2 text-sm text-[var(--muted)] leading-relaxed space-y-3">
              <p>
                <strong className="text-[var(--foreground)]">Why TRT requires labs — and why other stacks don&apos;t.</strong>
              </p>
              <p>
                Testosterone replacement therapy is the only product on The Longevity Agent that requires lab work before your first prescription. Here&apos;s the medical reason: TRT doses are titrated to blood values, not symptoms. Total testosterone, free testosterone, estradiol, hematocrit, PSA, and LH/FSH must be established at baseline so your physician can determine the correct starting dose, set a monitoring baseline, and detect if your hematocrit is rising (a known TRT side effect that increases clotting risk).
              </p>
              <p>
                Every other stack — LDN, rapamycin, semaglutide, HRT — is prescribed based on symptom profile or contraindication screening. They don&apos;t require titration to a specific blood value, so baseline labs aren&apos;t clinically necessary.
              </p>
              <p>
                <strong className="text-[var(--foreground)]">Already have labs?</strong> If you&apos;ve had a comprehensive testosterone panel in the last 6 months, you can skip the lab order — just upload your results during intake and save the $79.
              </p>
            </div>
            <p className="text-xs text-[var(--muted-light)] mt-3">
              First month total: $158 (includes lab panel). Then $79/month + $79 once per year at renewal.
            </p>
          </div>
        </section>
      )}

      {/* ── HRT: Symptom-based approach ──────────────────────── */}
      {stack.id === "womens-hrt" && (
        <section className="py-16 border-b border-[var(--card-border)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-5">Why HRT doesn&apos;t require labs upfront</h2>
            <div className="text-sm text-[var(--muted)] leading-relaxed space-y-4">
              <p>
                You may have heard that hormone replacement therapy requires extensive blood work before starting. The current best practice from the Menopause Society (formerly NAMS) and the British Menopause Society says otherwise: <strong className="text-[var(--foreground)]">HRT should be initiated based on symptoms, not lab values.</strong>
              </p>
              <p>
                Estrogen levels fluctuate dramatically hour-to-hour during perimenopause. A single estradiol reading can be normal at 9am and low at 2pm. Waiting for a lab confirmation before prescribing means waiting for a measurement that doesn&apos;t accurately represent your hormonal state. Your symptoms — hot flashes, sleep disruption, mood changes, brain fog — are a more reliable signal than any single blood draw.
              </p>
              <p>
                This is why our HRT intake is built around your symptom profile and medical history, not a lab panel. Your physician uses the Menopause Rating Scale and clinical history to determine the right starting protocol. You&apos;ll have a 30-day symptom check-in and a 90-day review to adjust dosing based on your response.
              </p>
              <p>
                <strong className="text-[var(--foreground)]">When labs are ordered:</strong> If your physician wants to rule out other causes (thyroid, adrenal), or if you&apos;re a candidate for testosterone supplementation, they may request specific labs as part of your initial review. This is guided by clinical judgment, not a blanket requirement.
              </p>
            </div>
          </div>
        </section>
      )}

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
                Prescribed by a licensed provider. Ships to your door.
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
