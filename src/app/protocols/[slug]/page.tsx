import Link from "next/link";
import { getStackBySlug, getProductBySlug, getAllStacks, getInteractionsBetween } from "@/lib/queries";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const stacks = getAllStacks();
  return stacks.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stack = getStackBySlug(slug);
  if (!stack) return {};
  return {
    title: `${stack.name} — Longevity Stack`,
    description: stack.description,
  };
}

export default async function ProtocolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stack = getStackBySlug(slug);
  if (!stack) notFound();

  const itemSlugs = JSON.parse(stack.ingredients);
  const products = itemSlugs.map((s: string) => getProductBySlug(s)).filter(Boolean);
  const totalPrice = products.reduce((sum: number, p: any) => sum + (p?.price || 0), 0);
  const cartUrl = `/cart?items=${itemSlugs.join(",")}`;

  const ingredientSlugs = [...new Set(products.map((p: any) => p.ingredient_slug))] as string[];
  const allInteractions = getInteractionsBetween(ingredientSlugs);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/protocols" className="hover:text-gray-600">Protocols</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{stack.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stack.name}</h1>
        {stack.goal && <p className="text-emerald-600 font-medium mb-3">{stack.goal}</p>}
        <p className="text-gray-600 leading-relaxed">{stack.description}</p>
        {stack.source && (
          <p className="text-sm text-gray-400 mt-2">
            Source: {stack.source_url ? (
              <a href={stack.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">{stack.source}</a>
            ) : stack.source}
          </p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-blue-900 mb-1">Not affiliated</h3>
        <p className="text-sm text-blue-800">
          This is {stack.name.split("'")[0]}&apos;s published protocol. We are not affiliated with them.
          We just make it easy to shop their stack at the best prices.
        </p>
      </div>

      {stack.dosing_notes && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
          <h3 className="font-semibold text-gray-900 mb-1">Dosing Notes</h3>
          <p className="text-sm text-gray-700">{stack.dosing_notes}</p>
        </div>
      )}

      {/* Products */}
      <div className="space-y-4 mb-8">
        {products.map((product: any) => {
          const perServing = product.servings_per_container
            ? (product.price / product.servings_per_container).toFixed(2)
            : null;
          return (
            <div
              key={product.slug}
              className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex-1">
                <Link href={`/ingredients/${product.ingredient_slug}`} className="text-xs text-emerald-600 font-medium hover:text-emerald-700">{product.ingredient}</Link>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.dose_mg}{product.dose_unit} &middot; {product.form} &middot; {product.servings_per_container} servings</p>
                <span className="text-xs text-gray-400">via {product.vendor_name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                  {perServing && <p className="text-xs text-gray-400">${perServing}/serving</p>}
                </div>
                <a
                  href={product.affiliate_url || product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
                >
                  Buy
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total & CTA */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">Total stack cost (cheapest per product)</p>
            <p className="text-3xl font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
          </div>
          <Link
            href={cartUrl}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700"
          >
            Open in Cart &rarr;
          </Link>
        </div>
      </div>

      {/* Interactions */}
      {allInteractions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-amber-900 mb-2">Interaction Warnings</h3>
          {allInteractions.map((item) => (
            <div key={item.ingredient} className="mb-2 last:mb-0">
              <p className="text-sm font-medium text-amber-800">{item.ingredient}</p>
              <ul className="ml-4">
                {item.interactions.map((int: any, i: number) => (
                  <li key={i} className="text-sm text-amber-700">&bull; {int.substance}: {int.mechanism}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-8">
        This is not medical advice. Consult your healthcare provider before starting any supplement regimen.
      </p>
    </div>
  );
}
