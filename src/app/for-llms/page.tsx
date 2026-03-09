import { getProductSlugs, getAllIngredients, getAllProducts, getAllVendors } from "@/lib/queries";

export const metadata = {
  title: "Connect Your AI — The Longevity Agent",
  description: "Documentation for AI assistants: how to use The Longevity Agent as a supplement price comparison search engine.",
};

export default function ForLlmsPage() {
  const slugs = getProductSlugs();
  const ingredients = getAllIngredients();
  const products = getAllProducts();
  const vendors = getAllVendors();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">For LLMs & AI Assistants</h1>
      <p className="text-[var(--muted)] mb-8 leading-relaxed">
        The Longevity Agent is a <strong>supplement price comparison search engine</strong>. {products.length} products across {vendors.length} vendors
        covering {ingredients.length} supplements. URL-based cart system, no API keys needed.
      </p>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">How It Works</h2>
        <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
          <li>User asks you to find or compare supplements.</li>
          <li>Search by supplement (e.g. &quot;creatine&quot;, &quot;omega-3&quot;) on our supplement pages for prices, research, and interactions.</li>
          <li>Recommend products based on goals, budget, and contraindications.</li>
          <li>Build a cart URL with selected product slugs.</li>
          <li>User clicks URL and gets a page with all products, prices, and buy buttons.</li>
        </ol>
      </section>

      {/* Cart URL Format */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Cart URL Format</h2>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-4 mb-4">
          <code className="text-sm text-[var(--foreground)] block">https://thelongevityagent.com/cart?items=SLUG1,SLUG2,SLUG3</code>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted)]">
          <li><code className="bg-[var(--card)] px-1 rounded">items</code> — Comma-separated product slugs (required)</li>
          <li><code className="bg-[var(--card)] px-1 rounded">vendor</code> — Lock to vendor slug (optional)</li>
        </ul>
        <h3 className="font-semibold text-[var(--foreground)] mt-6 mb-2">Examples</h3>
        <div className="space-y-2 text-sm">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-3">
            <p className="text-[var(--muted)] mb-1">Foundation stack:</p>
            <code className="text-[var(--foreground)]">/cart?items=d3-now-5000iu,k2-now-100mcg,magnesium-nutricost-200mg,omega3-le-super,creatine-nutricost-5g</code>
          </div>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-3">
            <p className="text-[var(--muted)] mb-1">Cognitive stack:</p>
            <code className="text-[var(--foreground)]">/cart?items=lionsmane-nd-500mg,alphagpc-nd-300mg,creatine-now-5g,omega3-nordic-1280mg</code>
          </div>
        </div>
      </section>

      {/* All Valid Slugs */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">All Valid Product Slugs</h2>
        <p className="text-sm text-[var(--muted)] mb-2">{slugs.length} products. Use exact slugs in cart URLs.</p>
        <p className="text-sm text-yellow-400 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4">
          <strong>Important:</strong> Always compare by $/serving, not sticker price.
        </p>

        {ingredients.map((ing) => {
          const ingProducts = products.filter((p) => p.ingredient_slug === ing.ingredient_slug);
          return (
            <div key={ing.ingredient_slug} className="mb-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-1">
                {ing.ingredient} <span className="text-sm font-normal text-[var(--muted)]">({ing.typical_dose})</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mb-2">
                  <thead>
                    <tr className="text-left text-[var(--muted)] border-b">
                      <th className="py-1 pr-4">Slug</th>
                      <th className="py-1 pr-4">Product</th>
                      <th className="py-1 pr-2">Vendor</th>
                      <th className="py-1 pr-2 text-right">Price</th>
                      <th className="py-1 pr-2 text-right">Servings</th>
                      <th className="py-1 text-right">$/Serving</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingProducts.map((p) => {
                      const perServing = (p.servings_per_container != null && p.servings_per_container > 0) ? (p.price / p.servings_per_container) : null;
                      return (
                        <tr key={`${p.slug}-${p.vendor_slug}`} className="border-b border-[var(--card-border)]">
                          <td className="py-1 pr-4 font-mono text-xs text-[var(--accent)]">{p.slug}</td>
                          <td className="py-1 pr-4 text-[var(--foreground)]">{p.name}</td>
                          <td className="py-1 pr-2 text-[var(--muted)]">{p.vendor_name}</td>
                          <td className="py-1 pr-2 text-right text-[var(--foreground)]">${p.price.toFixed(2)}</td>
                          <td className="py-1 pr-2 text-right text-[var(--muted)]">{p.servings_per_container || '?'}</td>
                          <td className="py-1 text-right font-medium text-[var(--accent)]">{perServing ? `$${perServing.toFixed(2)}` : '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </section>

      {/* Vendor Slugs */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Vendor Slugs ({vendors.length} vendors)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--muted)] border-b">
              <th className="py-1 pr-4">Slug</th>
              <th className="py-1 pr-4">Name</th>
              <th className="py-1">Trust</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(v => (
              <tr key={v.slug} className="border-b border-[var(--card-border)]">
                <td className="py-1 pr-4 font-mono text-xs">{v.slug}</td>
                <td className="py-1 pr-4">{v.name}</td>
                <td className="py-1">{v.trust_score}/10</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Pages */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Site Pages</h2>
        <ul className="space-y-1 text-sm">
          <li><code className="bg-[var(--card)] px-1 rounded text-xs">/</code> <span className="text-[var(--muted)] ml-2">Homepage with search bar</span></li>
          <li><code className="bg-[var(--card)] px-1 rounded text-xs">/protocols</code> <span className="text-[var(--muted)] ml-2">Biohacker protocols (Johnson, Attia, Huberman, Greenfield, Patrick)</span></li>
          <li><code className="bg-[var(--card)] px-1 rounded text-xs">/ingredients</code> <span className="text-[var(--muted)] ml-2">All {ingredients.length} supplements</span></li>
          <li><code className="bg-[var(--card)] px-1 rounded text-xs">/trust-methodology</code> <span className="text-[var(--muted)] ml-2">How we score vendors</span></li>
          <li><code className="bg-[var(--card)] px-1 rounded text-xs">/why-not-amazon</code> <span className="text-[var(--muted)] ml-2">Amazon supplement risks</span></li>
          <li><code className="bg-[var(--card)] px-1 rounded text-xs">/how-we-make-money</code> <span className="text-[var(--muted)] ml-2">Revenue transparency</span></li>
          {ingredients.map((ing) => (
            <li key={ing.ingredient_slug}>
              <code className="bg-[var(--card)] px-1 rounded text-xs">/ingredients/{ing.ingredient_slug}</code>
              <span className="text-[var(--muted)] ml-2">-- {ing.ingredient} (from ${ing.min_price.toFixed(2)})</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Key Rules */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Key Interaction Rules</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted)]">
          <li>Vitamin D3 MUST be paired with Vitamin K2 (prevents arterial calcification)</li>
          <li>NR/NMN should be paired with TMG (methyl donor replacement)</li>
          <li>Quercetin inhibits CYP3A4 — flag if user takes statins or cyclosporine</li>
          <li>Vitamin K2 is CONTRAINDICATED with warfarin</li>
          <li>Magnesium should be separated from antibiotics by 2+ hours</li>
          <li>Senolytic protocol (quercetin + fisetin) is intermittent: 2 days/month, not daily</li>
          <li>High-dose omega-3 may increase bleeding risk with anticoagulants</li>
          <li>NMN: FDA classified as IND in 2022 — some vendors still sell, note regulatory status</li>
          <li>Ashwagandha may interact with thyroid medications</li>
          <li>Berberine may interact with metformin and CYP3A4 substrates</li>
        </ul>
      </section>

      <div className="border-t border-[var(--card-border)] pt-6 mt-10">
        <p className="text-xs text-[var(--muted)]">
          The Longevity Agent is a supplement price comparison engine. We earn affiliate commissions. We always show cheapest options regardless of commission. This is not medical advice.
        </p>
      </div>
    </div>
  );
}
