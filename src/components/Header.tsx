'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/protocols', label: 'Protocols' },
    { href: '/ingredients', label: 'Supplements' },
    { href: '/trust-methodology', label: 'How We Score' },
    { href: '/how-we-make-money', label: 'About' },
  ];

  return (
    <header className="bg-[var(--surface)] border-b border-[var(--card-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-dim)] border border-[var(--accent)]/20 flex items-center justify-center group-hover:bg-[var(--accent)]/20 group-hover:border-[var(--accent)]/40 transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2L8 14M4 5L8 2L12 5M4 8H12M4 11L8 14L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]" />
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-tight group-hover:text-[var(--accent)] transition-colors duration-300">The Longevity Agent</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={"hover:text-[var(--foreground)] transition-colors"}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/ingredients"
              className="p-2 hover:text-[var(--foreground)] transition-colors"
              aria-label="Search supplements"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-[var(--muted)]"
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
          <nav className="md:hidden pb-4 flex flex-col gap-3 text-sm font-medium text-[var(--muted)]">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={"hover:text-[var(--foreground)]"}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
