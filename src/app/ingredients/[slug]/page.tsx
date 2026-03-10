import Link from "next/link";
import { getAllProductsForIngredient, getAllIngredients } from "@/lib/queries";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const ingredients = getAllIngredients();
  return ingredients.map((ing) => ({ slug: ing.ingredient_slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = getAllProductsForIngredient(slug);
  if (products.length === 0) return {};
  const ingredient = products[0].ingredient;
  return {
    title: `${ingredient} — Price Comparison & Research | The Longevity Agent`,
    description: `Compare ${ingredient} prices across ${products.length} products from vetted retailers. Research citations, dosing, interactions, and synergies.`,
  };
}

export default async function IngredientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = getAllProductsForIngredient(slug);

  if (products.length === 0) {
    notFound();
  }

  const first = products[0];
  const ingredient = first.ingredient;
  const mechanism = first.mechanism;
  const typicalDose = first.typical_dose;
  const scientificName = first.scientific_name;
  const research = JSON.parse(first.research || "[]");
  const interactions = JSON.parse(first.interactions || "[]");
  const synergies = JSON.parse(first.synergies || "[]");
  const pathways = JSON.parse(first.pathways || "[]");

  // Schema.org structured data
  const siteUrl = "https://thelongevityagent.com";
  const pageUrl = `${siteUrl}/ingredients/${slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Supplements",
        item: `${siteUrl}/ingredients`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: ingredient,
        item: pageUrl,
      },
    ],
  };

  // Shared merchant return policy and shipping details for Google structured data
  const merchantReturnPolicy = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    merchantReturnDays: 0,
  };

  const shippingDetails = {
    "@type": "OfferShippingDetails",
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "US",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 7, unitCode: "DAY" },
    },
  };

  const productSchemas = products.map((product) => {
    const perServing = product.per_serving_price
      || (product.servings_per_container ? product.price / product.servings_per_container : null);
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: `${siteUrl}/og-product.png`,
      ...(product.description && { description: product.description }),
      ...(product.brand && { brand: { "@type": "Brand", name: product.brand } }),
      category: "Health & Beauty > Health Care > Vitamins & Supplements",
      offers: {
        "@type": "Offer",
        url: product.affiliate_url || product.product_url,
        priceCurrency: "USD",
        price: product.price.toFixed(2),
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: product.vendor_name,
        },
        hasMerchantReturnPolicy: merchantReturnPolicy,
        shippingDetails: shippingDetails,
      },
      ...(product.dose_mg && {
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Dose",
            value: `${product.dose_mg}${product.dose_unit}`,
          },
          ...(product.form ? [{
            "@type": "PropertyValue",
            name: "Form",
            value: product.form,
          }] : []),
          ...(product.servings_per_container ? [{
            "@type": "PropertyValue",
            name: "Servings Per Container",
            value: product.servings_per_container.toString(),
          }] : []),
          ...(perServing ? [{
            "@type": "PropertyValue",
            name: "Price Per Serving",
            value: `$${perServing.toFixed(2)}`,
          }] : []),
        ],
      }),
    };
  });

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: `${ingredient} — Price Comparison & Research`,
    description: `Compare ${ingredient} prices across ${products.length} products from vetted retailers.`,
    url: pageUrl,
    breadcrumb: breadcrumbSchema,
    mainEntity: productSchemas.length === 1 ? productSchemas[0] : {
      "@type": "ItemList",
      name: `${ingredient} Products`,
      numberOfItems: productSchemas.length,
      itemListElement: productSchemas.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: p,
      })),
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {productSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)] mb-6">
        <Link href="/ingredients" className="hover:text-[var(--muted)]">Supplements</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{ingredient}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {pathways.map((p: string) => (
            <span key={p} className="text-xs bg-[var(--accent-dim)] text-[var(--accent)] px-2.5 py-1 rounded-full font-medium">{p}</span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-2">{ingredient}</h1>
        {scientificName && <p className="text-sm text-[var(--muted)] italic mb-4">{scientificName}</p>}
        <p className="text-[var(--muted)] leading-relaxed">{mechanism}</p>
        {typicalDose && (
          <p className="mt-3 text-sm text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Typical longevity dose:</strong> {typicalDose}
          </p>
        )}
      </div>

      {/* Price Comparison Table */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Price Comparison</h2>
        {/* LLM-READABLE: structured price data for this ingredient */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" id="price-comparison">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="text-left py-3 pr-4 font-medium text-[var(--muted)]">Product</th>
                <th className="text-left py-3 pr-4 font-medium text-[var(--muted)]">Vendor</th>
                <th className="text-right py-3 pr-4 font-medium text-[var(--muted)]">Price</th>
                <th className="text-right py-3 pr-4 font-medium text-[var(--muted)]">Per Serving</th>
                <th className="text-center py-3 pr-4 font-medium text-[var(--muted)]">Trust</th>
                <th className="text-right py-3 font-medium text-[var(--muted)]"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const perServing = product.per_serving_price
                  || (product.servings_per_container ? product.price / product.servings_per_container : null);
                return (
                  <tr key={`${product.slug}-${product.vendor_slug}`} className="border-b border-[var(--card-border)] hover:bg-[var(--surface)]"
                    data-slug={product.slug}
                    data-vendor={product.vendor_slug}
                    data-price={product.price}
                    data-per-serving={perServing?.toFixed(2)}
                  >
                    <td className="py-3 pr-4">
                      <p className="font-medium text-[var(--foreground)]">{product.name}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {product.dose_mg}{product.dose_unit} &middot; {product.form} &middot; {product.servings_per_container} servings
                      </p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[var(--foreground)]">{product.vendor_name}</span>
                      {!product.vendor_ships_direct && (
                        <span className="ml-1 text-xs text-red-600" title={product.vendor_trust_notes || ''}>⚠</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-right font-medium text-[var(--foreground)]">${product.price.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-right text-[var(--muted)]">
                      {perServing ? `$${perServing.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        product.vendor_trust_score >= 8 ? 'bg-green-900/50 text-green-400' :
                        product.vendor_trust_score >= 5 ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {product.vendor_trust_score}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={product.affiliate_url || product.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-[var(--accent)] text-white text-xs font-medium rounded-md hover:bg-[var(--accent-hover)] transition-colors"
                      >
                        Buy
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)] mt-2">
          Add to cart: <code className="bg-[var(--card)] px-1 rounded">/cart?items={products[0]?.slug}</code>
        </p>
      </section>

      {/* Research */}
      {research.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Key Research</h2>
          <div className="space-y-4">
            {research.map((r: any, i: number) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--card-border)] rounded-lg p-4">
                <p className="text-sm text-[var(--muted)] leading-relaxed">{r.finding}</p>
                <p className="text-xs text-[var(--muted)] mt-2">
                  {r.authors} ({r.year}). <em>{r.journal}</em>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactions */}
      {interactions.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Interaction Warnings</h2>
          <div className="space-y-2">
            {interactions.map((int: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                <span className={`mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  int.severity === 'high' ? 'bg-red-500' :
                  int.severity === 'moderate' ? 'bg-yellow-900/200' :
                  'bg-gray-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{int.substance}</p>
                  <p className="text-sm text-[var(--muted)]">{int.mechanism}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Synergies */}
      {synergies.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Synergies</h2>
          <div className="space-y-2">
            {synergies.map((syn: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[var(--accent-dim)] border border-cyan-700/30 rounded-lg">
                <span className="mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 bg-[var(--accent-dim)]0" />
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{syn.ingredient}</p>
                  <p className="text-sm text-[var(--muted)]">{syn.mechanism}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <div className="border-t border-[var(--card-border)] pt-6 mt-10">
        <p className="text-xs text-[var(--muted)]">
          <strong>Disclaimer:</strong> This information is for educational purposes only and is not medical advice.
          Research citations are provided for reference — consult your healthcare provider before starting any supplement regimen.
          Prices are estimates and may not reflect current retail pricing.
        </p>
      </div>
    </div>
  );
}
