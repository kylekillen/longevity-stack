'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/men', label: "Men's Health" },
    { href: '/women', label: "Women's Health" },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="bg-[var(--surface)] border-b border-[var(--card-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-dim)] border border-[var(--accent)]/20 flex items-center justify-center group-hover:bg-[var(--accent)]/20 group-hover:border-[var(--accent)]/40 transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" stroke="#22d3ee" strokeWidth="1.5"/>
                <path d="M7 4v3l2 2" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors duration-300">
              The Longevity Agent
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="hover:text-[var(--foreground)] transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5">
              Log in
            </Link>
            <Link
              href="/intake"
              className="text-sm font-semibold bg-[var(--accent)] text-[var(--background)] px-4 py-1.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              Get Started
            </Link>
          </div>

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

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--card-border)] mt-1 pt-4">
            <nav className="flex flex-col gap-4 text-sm font-medium text-[var(--muted)]">
              {links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="hover:text-[var(--foreground)] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-[var(--card-border)] pt-4">
              <Link href="/login" className="text-sm text-center text-[var(--muted)] border border-[var(--card-border)] py-2 rounded-lg hover:text-[var(--foreground)] hover:border-[var(--accent)]/40 transition-colors">
                Log in
              </Link>
              <Link
                href="/intake"
                className="text-sm font-semibold text-center bg-[var(--accent)] text-[var(--background)] py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
