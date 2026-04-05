import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-blue-100 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" stroke="white" strokeWidth="1.5"/>
                  <path d="M7 4v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-semibold text-white text-sm">The Longevity Agent</span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              Prescription longevity medicine. The lowest price. Real doctors. No frills.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Men&apos;s Health</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link href="/products/mens-essentials" className="hover:text-white transition-colors">Men&apos;s Essentials</Link></li>
              <li><Link href="/products/trt" className="hover:text-white transition-colors">TRT</Link></li>
              <li><Link href="/products/enclomiphene" className="hover:text-white transition-colors">Enclomiphene</Link></li>
              <li><Link href="/products/dutasteride" className="hover:text-white transition-colors">Dutasteride</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Women&apos;s Health</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link href="/products/womens-essentials" className="hover:text-white transition-colors">Women&apos;s Essentials</Link></li>
              <li><Link href="/products/womens-hrt" className="hover:text-white transition-colors">Women&apos;s HRT</Link></li>
              <li><Link href="/products/glp1" className="hover:text-white transition-colors">GLP-1</Link></li>
              <li><Link href="/products/longevity-stack" className="hover:text-white transition-colors">Longevity Stack</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-xs text-blue-300 leading-relaxed max-w-3xl">
            <strong className="text-blue-200">Medical Disclaimer:</strong> The Longevity Agent is a telemedicine platform. All prescriptions require evaluation by a licensed physician. This site does not provide medical advice. Medications are prescribed off-label where noted, consistent with standard medical practice. Results vary. Not a substitute for in-person medical care.
          </p>
          <p className="mt-4 text-xs text-blue-400">
            © {new Date().getFullYear()} The Longevity Agent. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
