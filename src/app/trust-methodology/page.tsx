import { getAllVendors } from "@/lib/queries";

export const metadata = {
  title: "Trust Score Methodology — Longevity Stack",
  description: "How we score supplement vendors from 1-10. Our transparent methodology for evaluating retailer trustworthiness.",
};

export default function TrustMethodologyPage() {
  const vendors = getAllVendors();

  const tiers = [
    { score: '10/10', label: 'Gold Standard', criteria: 'Manufacturer-direct sales, publishes batch COAs (Certificates of Analysis), NSF/USP certified, zero FDA warning letters, extensive third-party testing program.', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { score: '9/10', label: 'Excellent', criteria: 'Manufacturer-direct OR specialized retailer with extensive third-party testing, strong quality track record, transparent sourcing, science-focused formulations.', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { score: '8/10', label: 'Very Good', criteria: 'Direct-ship retailer with good testing practices, climate-controlled warehouses, established reputation, OR manufacturer with solid but not industry-leading testing.', color: 'bg-green-50 text-green-700 border-green-200' },
    { score: '7/10', label: 'Good', criteria: 'Established retailer or brand with standard quality controls, GMP certified, no major quality issues or FDA warnings. Mass-market brands with long track records.', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { score: '6/10', label: 'Acceptable', criteria: 'Budget brand with limited testing transparency but no known quality issues. GMP certified, third-party tested but with less documentation available publicly.', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { score: '5/10', label: 'Mixed', criteria: 'Mixed track record or limited quality data available. May be newer brands without established history, or brands with minor quality concerns.', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { score: '2/10', label: 'Caution', criteria: 'Commingled inventory risk (Amazon marketplace model), known counterfeit issues, or documented quality failures. Products may not be what the label claims.', color: 'bg-red-50 text-red-700 border-red-200' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Trust Score Methodology</h1>

      <p className="text-lg text-gray-600 mb-8">
        Every vendor on Longevity Stack receives a trust score from 1-10. Here is exactly how we determine those scores,
        what each tier means, and what earned each vendor their rating.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scoring Tiers</h2>
        <div className="space-y-3">
          {tiers.map(t => (
            <div key={t.score} className={`border rounded-xl p-4 ${t.color}`}>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-lg">{t.score}</span>
                <span className="font-semibold">{t.label}</span>
              </div>
              <p className="text-sm">{t.criteria}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Evaluate</h2>
        <div className="space-y-4">
          {[
            { title: 'Third-Party Testing', desc: 'Does the vendor/brand test products through independent labs? Do they publish Certificates of Analysis (COAs)?'},
            { title: 'Certifications', desc: 'NSF Certified for Sport, USP Verified, GMP certified, USDA Organic, Non-GMO Project Verified, etc.'},
            { title: 'Supply Chain Control', desc: 'Does the company control their supply chain from sourcing to shipping? Or can third-party sellers introduce counterfeit product (commingled inventory)?'},
            { title: 'FDA Compliance', desc: 'Any FDA warning letters, recalls, or regulatory actions? Clean regulatory history?'},
            { title: 'Storage & Shipping', desc: 'Climate-controlled warehouses? Proper cold chain for sensitive products? Direct-ship vs marketplace model?'},
            { title: 'Transparency', desc: 'Does the company openly share sourcing, testing results, and manufacturing practices?'},
            { title: 'Track Record', desc: 'How long has the company been operating? Any documented quality incidents?'},
          ].map(item => (
            <div key={item.title} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendor Scores</h2>
        <div className="space-y-4">
          {vendors.map(v => (
            <div key={v.slug} className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  v.trust_score >= 8 ? 'bg-green-100 text-green-700' :
                  v.trust_score >= 5 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>{v.trust_score}</span>
                <h3 className="text-lg font-semibold text-gray-900">{v.name}</h3>
                {v.ships_direct ? (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">Direct Ship</span>
                ) : (
                  <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">Marketplace</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{v.trust_notes}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-200 pt-6 mt-10">
        <p className="text-xs text-gray-400">
          Trust scores are our editorial assessment based on publicly available information. We earn affiliate commissions from all vendors listed.
          Scores are not influenced by commission rates. We recommend against Amazon for supplements despite earning commissions from them.
        </p>
      </div>
    </div>
  );
}
