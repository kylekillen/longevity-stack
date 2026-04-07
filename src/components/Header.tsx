"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const MENS_STACKS = [
  { href: "/stacks/core-cardio", label: "Core Cardio", desc: "Rosuvastatin + Tadalafil" },
  { href: "/stacks/hair-men", label: "Hair", desc: "Finasteride + Oral Minoxidil" },
  { href: "/stacks/hair-pro-men", label: "Hair Pro", desc: "Dutasteride + Oral Minoxidil" },
  { href: "/stacks/skin", label: "Skin", desc: "Tretinoin" },
  { href: "/stacks/inflammation", label: "Inflammation", desc: "LDN" },
  { href: "/stacks/testosterone-enhancement", label: "Testosterone Enhancement", desc: "Enclomiphene" },
  { href: "/stacks/testosterone-replacement", label: "Testosterone Replacement", desc: "Testosterone cream" },
  { href: "/stacks/longevity-base", label: "Longevity Base", desc: "Rapamycin + Metformin + Acarbose" },
  { href: "/stacks/longevity-glp1", label: "Longevity GLP-1", desc: "Semaglutide + Ondansetron" },
  { href: "/stacks/longevity-sglt2", label: "Longevity SGLT2", desc: "Waitlist" },
];

const WOMENS_STACKS = [
  { href: "/stacks/core-cardio", label: "Core Cardio", desc: "Rosuvastatin + Tadalafil" },
  { href: "/stacks/hair-women", label: "Hair", desc: "Spironolactone + Oral Minoxidil" },
  { href: "/stacks/skin", label: "Skin", desc: "Tretinoin" },
  { href: "/stacks/inflammation", label: "Inflammation", desc: "LDN" },
  { href: "/stacks/womens-hrt", label: "Hormone Replacement", desc: "Estradiol + Progesterone" },
  { href: "/stacks/longevity-base", label: "Longevity Base", desc: "Rapamycin + Metformin + Acarbose" },
  { href: "/stacks/longevity-glp1", label: "Longevity GLP-1", desc: "Semaglutide + Ondansetron" },
  { href: "/stacks/longevity-sglt2", label: "Longevity SGLT2", desc: "Waitlist" },
];

interface DropdownItem {
  href: string;
  label: string;
  desc: string;
}

function NavDropdown({
  label,
  items,
  cta,
}: {
  label: string;
  items: DropdownItem[];
  cta: { href: string; label: string };
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[var(--surface)] border border-[var(--card-border)] rounded-xl shadow-xl overflow-hidden z-50">
          <div className="py-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex flex-col px-4 py-2.5 hover:bg-[var(--card)] transition-colors group"
              >
                <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {item.label}
                </span>
                <span className="text-xs text-[var(--muted-light)]">{item.desc}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-[var(--card-border)] p-3">
            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-[var(--accent)] text-[var(--background)] font-semibold py-2 rounded-lg text-sm hover:bg-[var(--accent-hover)] transition-colors"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"men" | "women" | null>(null);

  return (
    <header className="bg-[var(--surface)] border-b border-[var(--card-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-dim)] border border-[var(--accent)]/20 flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-all">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" stroke="#22d3ee" strokeWidth="1.5" />
                <path d="M7 4v3l2 2" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              The Longevity Agent
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavDropdown
              label="For Men"
              items={MENS_STACKS}
              cta={{ href: "/build-your-stack?gender=men", label: "Build Men's Protocol →" }}
            />
            <NavDropdown
              label="For Women"
              items={WOMENS_STACKS}
              cta={{ href: "/build-your-stack?gender=women", label: "Build Women's Protocol →" }}
            />
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              The Science
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5"
            >
              Log in
            </Link>
            <Link
              href="/build-your-stack"
              className="text-sm font-semibold bg-[var(--accent)] text-[var(--background)] px-4 py-1.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              Build Stack
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--card-border)] mt-1 pt-4">
            <div className="space-y-1">
              <button
                onClick={() => setMobileSection(mobileSection === "men" ? null : "men")}
                className="w-full flex justify-between items-center px-1 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                For Men
                <svg className={`w-4 h-4 transition-transform ${mobileSection === "men" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSection === "men" && (
                <div className="pl-3 space-y-1 pb-2">
                  {MENS_STACKS.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1.5 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                  <Link
                    href="/build-your-stack?gender=men"
                    onClick={() => setMobileOpen(false)}
                    className="block py-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    Build Men's Protocol →
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileSection(mobileSection === "women" ? null : "women")}
                className="w-full flex justify-between items-center px-1 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                For Women
                <svg className={`w-4 h-4 transition-transform ${mobileSection === "women" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSection === "women" && (
                <div className="pl-3 space-y-1 pb-2">
                  {WOMENS_STACKS.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1.5 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                  <Link
                    href="/build-your-stack?gender=women"
                    onClick={() => setMobileOpen(false)}
                    className="block py-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    Build Women's Protocol →
                  </Link>
                </div>
              )}

              {[
                { href: "/blog", label: "The Science" },
                { href: "/pricing", label: "Pricing" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/faq", label: "FAQ" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-1 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-[var(--card-border)] pt-4">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-center text-[var(--muted)] border border-[var(--card-border)] py-2 rounded-lg hover:text-[var(--foreground)] hover:border-[var(--accent)]/40 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/build-your-stack"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-center bg-[var(--accent)] text-[var(--background)] py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
              >
                Build Your Stack
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
