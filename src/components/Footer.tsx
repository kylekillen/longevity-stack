import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Longevity Stack</h3>
            <p className="text-sm text-gray-500">Supplement price comparison engine. Search, compare, buy from vetted retailers.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/ingredients" className="hover:text-gray-700">All Ingredients</Link></li>
              <li><Link href="/protocols" className="hover:text-gray-700">Biohacker Protocols</Link></li>
              <li><Link href="/cart" className="hover:text-gray-700">Cart Builder</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">About</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/why-not-amazon" className="hover:text-gray-700">Why Not Amazon</Link></li>
              <li><Link href="/trust-methodology" className="hover:text-gray-700">Trust Score Methodology</Link></li>
              <li><Link href="/how-we-make-money" className="hover:text-gray-700">How We Make Money</Link></li>
              <li><Link href="/for-llms" className="hover:text-gray-700">For LLMs / Developers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Legal</h4>
            <p className="text-xs text-gray-400">We earn affiliate commissions on purchases made through our links. We always show the cheapest option regardless of commission rate.</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            <strong>Medical Disclaimer:</strong> The information on this site is for educational and informational purposes only. It is not intended as medical advice. Always consult with a qualified healthcare provider before starting any supplement regimen. Statements about supplements have not been evaluated by the FDA.
          </p>
        </div>
      </div>
    </footer>
  );
}
