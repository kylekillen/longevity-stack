import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--card-border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-[var(--foreground)] mb-3">The Longevity Agent</h3>
            <p className="text-sm text-[var(--muted)]">Supplement price comparison engine. Best prices at the quality level you choose.</p>
          </div>
          <div>
            <h4 className="font-medium text-[var(--foreground)] mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/ingredients" className="hover:text-[var(--foreground)] transition-colors">All Supplements</Link></li>
              <li><Link href="/protocols" className="hover:text-[var(--foreground)] transition-colors">Biohacker Protocols</Link></li>
              <li><Link href="/cart" className="hover:text-[var(--foreground)] transition-colors">Cart Builder</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-[var(--foreground)] mb-3 text-sm">About</h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/why-not-amazon" className="hover:text-[var(--foreground)] transition-colors">Why Not Amazon</Link></li>
              <li><Link href="/trust-methodology" className="hover:text-[var(--foreground)] transition-colors">Trust Score Methodology</Link></li>
              <li><Link href="/how-we-make-money" className="hover:text-[var(--foreground)] transition-colors">How We Make Money</Link></li>
              <li><Link href="/for-llms" className="hover:text-[var(--foreground)] transition-colors">For LLMs / Developers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-[var(--foreground)] mb-3 text-sm">Legal</h4>
            <p className="text-xs text-[var(--muted)]">We earn affiliate commissions on purchases. We always show the cheapest option regardless of commission rate.</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[var(--card-border)]">
          <p className="text-xs text-[var(--muted)] text-center">
            <strong>Medical Disclaimer:</strong> The information on this site is for educational and informational purposes only. It is not intended as medical advice. Always consult with a qualified healthcare provider before starting any supplement regimen.
          </p>
        </div>
      </div>
    </footer>
  );
}
