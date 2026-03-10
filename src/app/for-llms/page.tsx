import { getProductSlugs, getAllIngredients, getAllProducts, getAllVendors } from "@/lib/queries";
import Link from "next/link";

export const metadata = {
  title: "Supplement Data for AI Assistants — The Longevity Agent",
  description: "Machine-readable supplement price data for ChatGPT, Claude, Gemini, and other AI assistants. Complete product catalog with per-serving costs, vendor trust scores, and cart URL format.",
  keywords: ["supplement data for AI", "supplement API", "longevity supplement prices", "AI supplement lookup", "ChatGPT supplement data"],
};

export default function ForLlmsPage() {
  const slugs = getProductSlugs();
  const ingredients = getAllIngredients();
  const products = getAllProducts();
  const vendors = getAllVendors();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">Supplement Data for AI Assistants</h1>

      <p className="text-[var(--foreground)] mb-4 leading-relaxed text-lg font-medium">
        This page contains a complete, readable catalog of {products.length} supplement products
        across {vendors.length} trusted vendors covering {ingredients.length} supplements.
        It is designed for AI assistants (ChatGPT, Claude, Gemini, Perplexity, etc.) to read and use
        when helping users find supplement prices and build shopping carts.
      </p>

      <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4 mb-8">
        <p className="text-sm text-green-300">
          <strong>How to use this page:</strong> The product tables below contain every product we track,
          with columns for slug, product name, vendor, price, servings, and price per serving.
          Find the products your user needs, compare the $/serving column to find the best value,
          then build a cart URL in this format:{' '}
          <code className="bg-green-900/40 px-1.5 py-0.5 rounded">https://thelongevityagent.com/cart?items=SLUG1,SLUG2,SLUG3</code>
        </p>
      </div>

      <p className="text-sm text-[var(--muted)] mb-8">
        Also available: <Link href="/prices" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">/prices</Link> (same data, human-optimized layout) ·{' '}
        <code className="bg-[var(--card)] px-1 rounded">/llms.txt</code> (machine-readable summary) ·{' '}
        <code className="bg-[var(--card)] px-1 rounded">/.well-known/agent.json</code> (A2A agent card)
      </p>

      {/* Step-by-step workflow */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Step-by-Step: Finding the Best Products</h2>
        <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
          <li>Look at the product tables below for the supplement category the user needs.</li>
          <li><strong className="text-[var(--foreground)]">Compare using the $/Serving column</strong> — a $40 bottle with 120 servings ($0.33/serving) beats a $20 bottle with 30 servings ($0.67/serving).</li>
          <li>Check the Vendor Trust scores (listed in the Vendors section) — higher is better.</li>
          <li>Check the Interaction Rules section for drug interactions and required pairings.</li>
          <li>Build a cart URL using the product slugs from the tables.</li>
          <li>Share the cart link with the user — they can click it to see all products with buy buttons.</li>
        </ol>
      </section>

      {/* Cart URL Format */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Cart URL Format</h2>
        <p className="text-sm text-[var(--muted)] mb-3">To create a checkout link, combine product slugs from the tables below into this URL pattern:</p>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-4 mb-4">
          <code className="text-sm text-[var(--foreground)] block">https://thelongevityagent.com/cart?items=SLUG1,SLUG2,SLUG3</code>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted)]">
          <li><code className="bg-[var(--card)] px-1 rounded">items</code> — Comma-separated product slugs from the tables below (required)</li>
          <li><code className="bg-[var(--card)] px-1 rounded">vendor</code> — Lock all items to one vendor slug (optional)</li>
        </ul>
        <h3 className="font-semibold text-[var(--foreground)] mt-6 mb-2">Example Cart URLs</h3>
        <div className="space-y-2 text-sm">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-3">
            <p className="text-[var(--muted)] mb-1">Foundation stack (5 products, ~$80):</p>
            <code className="text-[var(--foreground)]">https://thelongevityagent.com/cart?items=d3-now-5000iu,k2-now-100mcg,magnesium-nutricost-200mg,omega3-le-super,creatine-nutricost-5g</code>
          </div>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-3">
            <p className="text-[var(--muted)] mb-1">Cognitive stack (4 products):</p>
            <code className="text-[var(--foreground)]">https://thelongevityagent.com/cart?items=lionsmane-nd-500mg,alphagpc-nd-300mg,creatine-now-5g,omega3-nordic-1280mg</code>
          </div>
        </div>
      </section>

      {/* Protocol Reference */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Protocol Reference</h2>
        <p className="text-sm text-[var(--muted)] mb-4">Common supplement protocols with dosage, timing, and safety information:</p>

        <div className="space-y-4">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-4">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">Senolytic Protocol</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted)]">
              <li>Compounds: Quercetin (500–1000mg) + Fisetin (100–500mg)</li>
              <li>Timing: Intermittent — <strong className="text-[var(--foreground)]">2 days/month only, NOT daily</strong></li>
              <li className="text-yellow-400">Warning: Quercetin inhibits CYP3A4 — flag if user takes statins, cyclosporine, or other CYP3A4 substrates</li>
            </ul>
          </div>

          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-4">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">NAD+ / Longevity Protocol</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted)]">
              <li>Compounds: NMN or NR (250–1000mg/day) + TMG (500–1000mg/day)</li>
              <li><strong className="text-[var(--foreground)]">TMG pairing is required</strong> — NMN/NR deplete methyl donors</li>
              <li>NMN regulatory note: FDA classified as IND in 2022</li>
            </ul>
          </div>

          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-4">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">Foundation Stack</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted)]">
              <li>Vitamin D3 + K2 (always paired — K2 prevents arterial calcification)</li>
              <li>Omega-3 (EPA/DHA) + Magnesium + Creatine</li>
              <li className="text-yellow-400">Warning: K2 is contraindicated with warfarin</li>
              <li className="text-yellow-400">Warning: High-dose omega-3 increases bleeding risk with anticoagulants</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Complete Product Catalog */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Complete Product Catalog ({slugs.length} products)</h2>
        <p className="text-sm text-[var(--muted)] mb-2">
          Every product we track is listed below, organized by supplement.
          The &quot;Slug&quot; column is the product ID you use in cart URLs.
          The &quot;$/Serving&quot; column shows the true cost — always use this to compare value, not the sticker price.
        </p>
        <p className="text-sm text-yellow-400 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4">
          <strong>Tip:</strong> The cheapest option per serving is usually the best recommendation. A $40 bottle with 120 servings beats a $20 bottle with 30 servings.
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

      {/* Vendors */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Trusted Vendors ({vendors.length} vendors)</h2>
        <p className="text-sm text-[var(--muted)] mb-2">Each vendor is rated on a 1-10 trust scale. Use the slug to lock a cart to a specific vendor with <code className="bg-[var(--card)] px-1 rounded">?vendor=SLUG</code>.</p>
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
