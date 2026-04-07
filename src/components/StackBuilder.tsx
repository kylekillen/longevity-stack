"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllStacks, getStacksByGender, Stack, formatStackPrice } from "@/lib/stacks";
import { getStackCompetitorData } from "@/data/competitor-pricing";

type Gender = "men" | "women";

interface Props {
  defaultGender?: Gender;
  compact?: boolean; // used on homepage (compact=true) vs full /build-your-stack
  initialStacks?: string[]; // pre-populate from URL ?stacks= param
}

export default function StackBuilder({ defaultGender = "men", compact = false, initialStacks }: Props) {
  const [gender, setGender] = useState<Gender>(defaultGender);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialStacks ?? [])
  );

  const stacks = getStacksByGender(gender);

  function toggleStack(stack: Stack) {
    if (stack.waitlist) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(stack.id)) {
        next.delete(stack.id);
      } else {
        // Remove mutually exclusive stacks
        if (stack.exclusiveWith) {
          for (const id of stack.exclusiveWith) {
            next.delete(id);
          }
        }
        next.add(stack.id);
      }
      return next;
    });
  }

  const selectedStacks = stacks.filter((s) => selected.has(s.id));
  const knownPrice = selectedStacks.filter((s) => s.ourPrice !== null);
  const totalPrice = knownPrice.reduce((sum, s) => sum + (s.ourPrice ?? 0), 0);
  const totalCompetitor = selectedStacks.reduce((sum, s) => sum + (s.competitorPrice ?? 0), 0);
  const hasPending = selectedStacks.some((s) => s.ourPrice === null);

  // Compute competitor savings details for selected stacks
  const competitorDetails = selectedStacks.flatMap((s) => {
    const data = getStackCompetitorData(s.id);
    if (!data || data.competitors.length === 0) return [];
    const top = data.competitors.find((c) => c.price !== null);
    if (!top) return [];
    return [{ stack: s.name, vendor: top.vendor, price: top.price! }];
  });

  // Suggestions: stacks suggested by selected stacks, that aren't already selected
  const suggestions = stacks.filter(
    (s) =>
      !selected.has(s.id) &&
      !s.waitlist &&
      selectedStacks.some((sel) => sel.suggestsStacks?.includes(s.id))
  );

  const intakeUrl =
    selected.size > 0
      ? `/intake?stacks=${Array.from(selected).join(",")}`
      : "/intake";

  return (
    <div className={compact ? "" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"}>
      {/* Gender toggle */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-1 gap-1">
          {(["men", "women"] as const).map((g) => (
            <button
              key={g}
              onClick={() => {
                setGender(g);
                setSelected(new Set()); // clear on gender switch
              }}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                gender === g
                  ? "bg-[var(--accent)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {g === "men" ? "Men" : "Women"}
            </button>
          ))}
        </div>
        {selected.size > 0 && (
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors ml-2"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Stack Checklist ──────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-2">
          {stacks.map((stack) => {
            const isSelected = selected.has(stack.id);
            const isConflicted =
              !isSelected &&
              stack.exclusiveWith?.some((id) => selected.has(id));
            const isSuggested = suggestions.includes(stack);

            return (
              <button
                key={stack.id}
                onClick={() => toggleStack(stack)}
                disabled={!!isConflicted || stack.waitlist}
                className={`w-full text-left border-2 rounded-xl p-4 transition-all relative ${
                  isSelected
                    ? "border-current bg-[var(--card)]"
                    : isConflicted || stack.waitlist
                    ? "border-[var(--card-border)] bg-[var(--card)] opacity-40 cursor-not-allowed"
                    : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)]/40"
                }`}
                style={isSelected ? { borderColor: stack.color } : undefined}
              >
                {/* Suggestion indicator */}
                {isSuggested && (
                  <span
                    className="absolute -top-2 left-4 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: stack.color + "33", color: stack.accentText === "#fef08a" ? "#ca8a04" : stack.color }}
                  >
                    Suggested
                  </span>
                )}

                <div className="flex items-center gap-3">
                  {/* Color swatch */}
                  <div
                    className="w-3 h-12 rounded-full shrink-0"
                    style={{ background: stack.color }}
                  />

                  {/* Stack info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[var(--foreground)] text-sm">
                        {stack.name}
                      </span>
                      {stack.badge && (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            background: stack.color + "22",
                            color: stack.color,
                          }}
                        >
                          {stack.badge}
                        </span>
                      )}
                      {stack.waitlist && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)]">
                          Waitlist
                        </span>
                      )}
                      {isConflicted && (
                        <span className="text-xs text-[var(--muted-light)]">
                          (mutually exclusive)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {stack.medications.map((m) => m.name).join(" + ")}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0 mr-2">
                    {stack.waitlist ? (
                      <span className="text-xs text-[var(--muted)]">Waitlist</span>
                    ) : stack.ourPrice !== null ? (
                      <>
                        <span className="font-bold text-[var(--green)] text-sm">
                          ${stack.ourPrice}/mo
                        </span>
                        {stack.competitorPrice && (
                          <p className="text-xs text-[var(--muted-light)] line-through">
                            ${stack.competitorPrice}
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-[var(--muted-light)] font-mono">
                        {"{{PRICE}}"}
                      </span>
                    )}
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "border-current"
                        : "border-[var(--card-border)]"
                    }`}
                    style={isSelected ? { background: stack.color, borderColor: stack.color } : undefined}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Link to individual stack pages */}
          <p className="text-xs text-[var(--muted-light)] pt-1 pl-1">
            Click any stack to select it.{" "}
            <Link href={`/${gender}`} className="text-[var(--accent)] hover:underline">
              Learn more about each stack →
            </Link>
          </p>
        </div>

        {/* ── Visual Block Stack + Summary ─────────────────────── */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 space-y-4">
            {/* Protocol visualization */}
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--card-border)]">
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                  Your Protocol
                </p>
              </div>

              {selectedStacks.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    Select stacks to build your protocol
                  </p>
                  <p className="text-xs text-[var(--muted-light)] mt-1">
                    Mix and match for your goals
                  </p>
                </div>
              ) : (
                <div>
                  {selectedStacks.map((stack, i) => (
                    <div
                      key={stack.id}
                      className={`flex items-center gap-3 px-4 py-3.5 ${
                        i < selectedStacks.length - 1
                          ? "border-b border-[var(--background)]/30"
                          : ""
                      }`}
                      style={{
                        background: `${stack.color}18`,
                        borderLeft: `4px solid ${stack.color}`,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[var(--foreground)]">
                          {stack.name}
                        </p>
                        <p className="text-xs text-[var(--muted)] truncate">
                          {stack.medications.map((m) => m.name).join(", ")}
                        </p>
                      </div>
                      {stack.ourPrice !== null ? (
                        <span className="text-sm font-bold text-[var(--green)] shrink-0">
                          ${stack.ourPrice}/mo
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--muted-light)] font-mono shrink-0">
                          {"{{PRICE}}"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Running total */}
            {selectedStacks.length > 0 && (
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[var(--muted)]">
                    {hasPending ? "Known total" : "Your total"}
                  </span>
                  {totalPrice > 0 ? (
                    <span className="text-2xl font-bold text-[var(--green)]">
                      ${totalPrice}
                      <span className="text-sm font-normal text-[var(--muted)]">/mo</span>
                    </span>
                  ) : (
                    <span className="text-sm text-[var(--muted-light)]">Pricing pending</span>
                  )}
                </div>
                {totalCompetitor > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--muted-light)]">Elsewhere</span>
                    <span className="text-sm text-[var(--muted-light)] line-through">
                      ${totalCompetitor}/mo
                    </span>
                  </div>
                )}
                {competitorDetails.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[var(--card-border)] space-y-1">
                    {competitorDetails.map((d) => (
                      <div key={d.stack} className="flex items-center justify-between text-xs text-[var(--muted-light)]">
                        <span>{d.stack} @ {d.vendor}</span>
                        <span className="line-through">${d.price}/mo</span>
                      </div>
                    ))}
                  </div>
                )}
                {hasPending && (
                  <p className="text-xs text-[var(--muted-light)] mt-2 pt-2 border-t border-[var(--card-border)]">
                    * Some stack prices are pending pharmacy confirmation.
                  </p>
                )}
              </div>
            )}

            {/* CTA */}
            <Link
              href={intakeUrl}
              className="block w-full text-center bg-[var(--accent)] text-[var(--background)] font-bold py-3.5 rounded-xl hover:bg-[var(--accent-hover)] transition-colors text-sm"
            >
              {selected.size > 0
                ? `Start My Protocol — ${selectedStacks.length} stack${selectedStacks.length > 1 ? "s" : ""}`
                : "Start Intake →"}
            </Link>

            {selected.size > 0 && (
              <p className="text-center text-xs text-[var(--muted-light)]">
                A physician reviews your protocol within 24–48 hours.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
