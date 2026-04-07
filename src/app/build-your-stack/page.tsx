import type { Metadata } from "next";
import StackBuilder from "@/components/StackBuilder";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Build Your Stack — The Longevity Agent",
  description:
    "Build your personal longevity protocol. 10 modular prescription stacks covering cardiovascular, hormones, hair, skin, and aging biology. Physician-prescribed from $19/month.",
};

export default async function BuildYourStackPage({
  searchParams,
}: {
  searchParams: Promise<{ stacks?: string; gender?: string }>;
}) {
  const { stacks, gender } = await searchParams;
  const initialStacks = stacks ? stacks.split(",").filter(Boolean) : undefined;
  const defaultGender = gender === "women" ? "women" : "men";
  return (
    <div>
      <section className="py-14 sm:py-16 border-b border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Build Your Protocol
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Select any combination of stacks. A licensed provider
            reviews your full protocol — not just individual medications.
          </p>
        </div>
      </section>

      <section className="py-12">
        <StackBuilder defaultGender={defaultGender} initialStacks={initialStacks} />
      </section>

      {/* How protocols work */}
      <section className="py-14 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            How protocol review works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: "📋",
                title: "Select your stacks",
                desc: "Choose any combination. Mutual exclusivities are enforced automatically (e.g., Hair and Hair Pro can't both be selected).",
              },
              {
                icon: "🔬",
                title: "Provider reviews the whole protocol",
                desc: "A licensed provider reviews your entire protocol for drug interactions, contraindications, and appropriateness for your health history.",
              },
              {
                icon: "📦",
                title: "One shipment, one bill",
                desc: "All approved stacks ship together. Your monthly charge is the sum of your selected stacks. Add or remove stacks from your dashboard anytime.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2 text-sm">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack index links */}
      <section className="py-14 border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Explore individual stacks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Men&apos;s Stacks</h3>
              <ul className="space-y-2">
                {[
                  { href: "/stacks/core-cardio", name: "Core Cardio & ED Prevention" },
                  { href: "/stacks/hair-men", name: "Hair" },
                  { href: "/stacks/hair-pro-men", name: "Hair Pro" },
                  { href: "/stacks/skin", name: "Skin" },
                  { href: "/stacks/inflammation", name: "Inflammation" },
                  { href: "/stacks/testosterone-enhancement", name: "Testosterone Enhancement" },
                  { href: "/stacks/testosterone-replacement", name: "Testosterone Replacement" },
                  { href: "/stacks/longevity-base", name: "Longevity Base" },
                  { href: "/stacks/longevity-glp1", name: "Longevity GLP-1" },
                  { href: "/stacks/longevity-sglt2", name: "Longevity SGLT2 (Waitlist)" },
                ].map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      {s.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Women&apos;s Stacks</h3>
              <ul className="space-y-2">
                {[
                  { href: "/stacks/core-cardio", name: "Core Cardio & ED Prevention" },
                  { href: "/stacks/hair-women", name: "Hair" },
                  { href: "/stacks/skin", name: "Skin" },
                  { href: "/stacks/inflammation", name: "Inflammation" },
                  { href: "/stacks/womens-hrt", name: "Hormone Replacement (HRT)" },
                  { href: "/stacks/longevity-base", name: "Longevity Base" },
                  { href: "/stacks/longevity-glp1", name: "Longevity GLP-1" },
                  { href: "/stacks/longevity-sglt2", name: "Longevity SGLT2 (Waitlist)" },
                ].map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      {s.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
