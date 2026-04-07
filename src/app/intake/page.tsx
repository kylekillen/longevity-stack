import type { Metadata } from "next";
import IntakeForm from "./IntakeForm";

export const metadata: Metadata = {
  title: "Start Your Intake — The Longevity Agent",
  description:
    "5-minute health intake. A licensed physician reviews your protocol within 24–48 hours.",
};

export default async function IntakePage({
  searchParams,
}: {
  searchParams: Promise<{ stacks?: string; gender?: string }>;
}) {
  const { stacks, gender } = await searchParams;
  const initialStacks = stacks ? stacks.split(",").filter(Boolean) : [];
  const initialGender = gender === "women" ? "women" : gender === "men" ? "men" : undefined;

  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--card-border)] py-4">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">
              <span className="font-semibold text-[var(--foreground)]">The Longevity Agent</span>
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <svg className="w-3.5 h-3.5 text-[var(--green)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              HIPAA-compliant
            </div>
          </div>
        </div>
      </div>

      <IntakeForm initialStacks={initialStacks} initialGender={initialGender} />
    </div>
  );
}
