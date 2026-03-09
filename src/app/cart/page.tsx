import Link from "next/link";
import { getProductBySlug, getProductBySlugAndVendor, getInteractionsBetween } from "@/lib/queries";
import type { ProductWithPrice } from "@/lib/db";
import CartActions from "./CartActions";

export const dynamic = "force-dynamic";

interface CartPageProps {
  searchParams: Promise<{ items?: string; vendor?: string }>;
}

interface VendorGroup {
  vendorName: string;
  vendorSlug: string;
  vendorTrustScore: number;
  products: ProductWithPrice[];
  subtotal: number;
}

export default async function CartPage({ searchParams }: CartPageProps) {
  const params = await searchParams;
  const itemSlugs = params.items?.split(",").filter(Boolean) || [];
  const vendorLock = params.vendor;

  if (itemSlugs.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">Your Custom Checkout</h1>
        <p className="text-[var(--muted)] mb-6">No items in your stack yet.</p>
        <p className="text-sm text-[var(--muted)] mb-4">
          Add items via URL: <code className="bg-[var(--card)] px-2 py-1 rounded">/cart?items=quercetin-now-500mg,fisetin-le-100mg</code>
        </p>
        <Link href="/ingredients" className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)]">
          Browse supplements &rarr;
        </Link>
      </div>
    );
  }

  const products: (ProductWithPrice | null)[] = itemSlugs.map((slug) =>
    vendorLock
      ? getProductBySlugAndVendor(slug, vendorLock) || getProductBySlug(slug)
      : getProductBySlug(slug)
  );

  const validProducts = products.filter((p): p is ProductWithPrice => p !== null);
  const missingItems = itemSlugs.filter((_, i) => products[i] === null);
  const totalPrice = validProducts.reduce((sum, p) => sum + p.price, 0);

  // Calculate actual monthly cost based on servings (1 serving/day assumed)
  const monthlyEstimate = validProducts.reduce((sum, p) => {
    if (p.servings_per_container && p.servings_per_container > 0) {
      const daysSupply = p.servings_per_container;
      return sum + (p.price / daysSupply) * 30;
    }
    return sum + (p.price / 45) * 30;
  }, 0);

  // Group products by vendor
  const vendorGroupMap = new Map<string, VendorGroup>();
  for (const product of validProducts) {
    const key = product.vendor_slug;
    if (!vendorGroupMap.has(key)) {
      vendorGroupMap.set(key, {
        vendorName: product.vendor_name,
        vendorSlug: product.vendor_slug,
        vendorTrustScore: product.vendor_trust_score,
        products: [],
        subtotal: 0,
      });
    }
    const group = vendorGroupMap.get(key)!;
    group.products.push(product);
    group.subtotal += product.price;
  }
  const vendorGroups = Array.from(vendorGroupMap.values()).sort(
    (a, b) => b.products.length - a.products.length
  );

  // Build buy URLs for CartActions
  const buyUrls = validProducts.map(p => ({
    vendor: p.vendor_name,
    url: p.affiliate_url || p.product_url,
    productName: p.name,
  }));

  // Get interaction warnings
  const ingredientSlugs = [...new Set(validProducts.map((p) => p.ingredient_slug))];
  const allInteractions = getInteractionsBetween(ingredientSlugs);

  // Find cross-ingredient warnings (synergies between selected items)
  const crossInteractions: string[] = [];
  for (let i = 0; i < validProducts.length; i++) {
    const synergies = JSON.parse(validProducts[i].synergies || "[]");
    for (const syn of synergies) {
      const otherProduct = validProducts.find(
        (p, j) => j !== i && p.ingredient.toLowerCase().includes(syn.ingredient.toLowerCase())
      );
      if (otherProduct) {
        crossInteractions.push(
          `${validProducts[i].ingredient} + ${otherProduct.ingredient}: ${syn.mechanism}`
        );
      }
    }
  }

  const cartUrl = `/cart?items=${itemSlugs.join(",")}${vendorLock ? `&vendor=${vendorLock}` : ""}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-1">Your Custom Checkout</h1>
          <p className="text-[var(--muted)]">
            {validProducts.length} supplement{validProducts.length !== 1 ? "s" : ""} from {vendorGroups.length} vendor{vendorGroups.length !== 1 ? "s" : ""}
            {vendorLock && ` (${vendorLock} preferred)`}
          </p>
        </div>
        <CartActions cartUrl={cartUrl} buyUrls={buyUrls} />
      </div>

      {/* Explainer banner */}
      <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-cyan-300">
              We found the best prices for your stack across multiple vendors.
            </p>
            <p className="text-sm text-[var(--accent)] mt-1">
              Since items come from different stores, click each vendor&apos;s buy button to purchase from that retailer. Use <strong>&quot;Open all vendor tabs&quot;</strong> above to open every vendor at once.
            </p>
          </div>
        </div>
      </div>

      {missingItems.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-400">
            <strong>Not found:</strong> {missingItems.join(", ")}. Check{" "}
            <Link href="/for-llms" className="underline">valid slugs</Link>.
          </p>
        </div>
      )}

      {/* Products grouped by vendor */}
      <div className="space-y-6 mb-8">
        {vendorGroups.map((group) => (
          <div key={group.vendorSlug} className="border border-[var(--card-border)] rounded-xl overflow-hidden">
            {/* Vendor header */}
            <div className="bg-[var(--surface)] px-5 py-3 flex items-center justify-between border-b border-[var(--card-border)]">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-[var(--foreground)]">{group.vendorName}</h2>
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  group.vendorTrustScore >= 8 ? 'bg-green-900/50 text-green-400' :
                  group.vendorTrustScore >= 5 ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-red-900/50 text-red-400'
                }`}>{group.vendorTrustScore}</span>
                <span className="text-xs text-[var(--muted)]">
                  {group.products.length} item{group.products.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-[var(--foreground)]">${group.subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Products in this vendor group */}
            <div className="divide-y divide-[var(--card-border)]">
              {group.products.map((product) => {
                const perServing = (product.servings_per_container != null && product.servings_per_container > 0)
                  ? (product.price / product.servings_per_container).toFixed(2)
                  : null;

                return (
                  <div
                    key={product.slug}
                    className="bg-[var(--card)] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex-1">
                      <Link
                        href={`/ingredients/${product.ingredient_slug}`}
                        className="text-xs text-[var(--accent)] font-medium hover:text-[var(--accent-hover)]"
                      >
                        {product.ingredient}
                      </Link>
                      <h3 className="font-semibold text-[var(--foreground)]">{product.name}</h3>
                      <p className="text-sm text-[var(--muted)]">
                        {product.dose_mg}
                        {product.dose_unit} &middot; {product.form} &middot;{" "}
                        {product.servings_per_container} servings
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {product.vendor_ships_direct ? (
                          <span className="text-xs bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded">
                            Direct Ship
                          </span>
                        ) : (
                          <span className="text-xs bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded">
                            Third-party sellers
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--foreground)]">${product.price.toFixed(2)}</p>
                        {perServing && (
                          <p className="text-xs text-[var(--muted)]">${perServing}/serving</p>
                        )}
                      </div>
                      <a
                        href={product.affiliate_url || product.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap"
                      >
                        Buy &rarr;
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="bg-[var(--surface)] border border-[var(--card-border)] rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[var(--muted)]">Estimated total (one-time)</p>
            <p className="text-3xl font-bold text-[var(--foreground)]">${totalPrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--muted)]">Est. monthly cost</p>
            <p className="text-lg font-semibold text-[var(--foreground)]">
              ~${monthlyEstimate.toFixed(2)}/mo
            </p>
            <p className="text-xs text-[var(--muted)]">Based on 1 serving/day per product</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
          <p className="text-xs text-[var(--muted)]">
            <strong>Across {vendorGroups.length} vendor{vendorGroups.length !== 1 ? 's' : ''}:</strong>{' '}
            {vendorGroups.map((g, i) => (
              <span key={g.vendorSlug}>
                {g.vendorName} (${g.subtotal.toFixed(2)}){i < vendorGroups.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Synergies */}
      {crossInteractions.length > 0 && (
        <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-cyan-300 mb-2">Synergies in your stack</h3>
          <ul className="space-y-1">
            {[...new Set(crossInteractions)].map((msg, i) => (
              <li key={i} className="text-sm text-cyan-400">{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Interaction Warnings */}
      {allInteractions.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-yellow-400 mb-2">Interaction Warnings</h3>
          {allInteractions.map((item) => (
            <div key={item.ingredient} className="mb-3 last:mb-0">
              <p className="text-sm font-medium text-yellow-400">{item.ingredient}</p>
              <ul className="ml-4 space-y-0.5">
                {item.interactions.map((int: any, i: number) => (
                  <li key={i} className="text-sm text-yellow-400">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                      int.severity === 'high' ? 'bg-red-500' :
                      int.severity === 'moderate' ? 'bg-amber-500' :
                      'bg-gray-400'
                    }`} />
                    {int.substance}: {int.mechanism}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-[var(--muted)] text-center">
        Prices are estimates and may not reflect current retail pricing. Always verify prices at the vendor before purchasing.
        This is not medical advice. Consult your healthcare provider before starting any supplement regimen.
      </p>
    </div>
  );
}
