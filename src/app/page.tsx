import Link from "next/link";
import { getAllIngredients, getAllStacks, getAllVendors, getSearchData } from "@/lib/queries";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const ingredients = getAllIngredients();
  const stacks = getAllStacks();
  const allVendors = getAllVendors();
  const { products, vendors } = getSearchData();

  return (
    <div>
      {/* Hero — AI-First, Above the Fold */}
      <section className="bg-gradient-to-b from-emerald-50 to-white pt-12 sm:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-3">
              Tell Your AI What You Need.
              <br />
              <span className="text-emerald-600">Get a Shopping Cart.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We index {products.length} products across {allVendors.length} brands. Share our link with ChatGPT, Claude, or any AI — it finds the best deals and builds you a one-click checkout.
            </p>
          </div>

          {/* How it works — compact 4-step row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-6">
            {[
              { step: '1', title: 'Share our link', desc: 'Paste into any AI you already use' },
              { step: '2', title: 'Say what you need', desc: '"Best deals on NAD and CoQ10?"' },
              { step: '3', title: 'AI finds the deals', desc: 'Compares prices across every vendor' },
              { step: '4', title: 'One-click checkout', desc: 'All items grouped, ready to buy' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-2">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* AI badges */}
          <div className="flex justify-center items-center gap-2 mb-8">
            <span className="text-xs text-gray-400">Works with:</span>
            {['ChatGPT', 'Claude', 'Gemini', 'Perplexity'].map(ai => (
              <span key={ai} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full">{ai}</span>
            ))}
          </div>

          {/* Divider with "or" */}
          <div className="max-w-2xl mx-auto flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">or search manually</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar products={products} vendors={vendors} autofocus={false} size="large" />
          </div>

          {/* Brands we compare */}
          <div className="max-w-3xl mx-auto mt-6">
            <p className="text-xs text-center text-gray-400 uppercase tracking-wider mb-3">Prices compared across all major brands</p>
            <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2">
              {allVendors.filter(v => v.slug !== 'amazon').map((v) => (
                <span key={v.slug} className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap">
                  {v.name}
                </span>
              ))}
              <span className="text-xs text-gray-300">+ more</span>
            </div>
          </div>

          {/* Popular quick links */}
          <div className="max-w-2xl mx-auto mt-5">
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-gray-400 self-center mr-1">Popular:</span>
              {['creatine', 'vitamin-d3', 'omega-3', 'magnesium-glycinate', 'ashwagandha', 'nac', 'coq10'].map(slug => {
                const ing = ingredients.find(i => i.ingredient_slug === slug);
                return ing ? (
                  <Link key={slug} href={`/ingredients/${slug}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                    {ing.ingredient}
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Biohacker Protocols */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Biohacker Protocols</h2>
              <p className="text-gray-500">Shop published supplement stacks from leading health optimizers.</p>
            </div>
            <Link href="/protocols" className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stacks.map((stack) => {
              const items = JSON.parse(stack.ingredients);
              return (
                <Link
                  key={stack.slug}
                  href={`/protocols/${stack.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-emerald-200 transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{stack.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{stack.goal}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">{items.length} supplements</span>
                    {stack.source && <span className="text-xs text-emerald-600">{stack.source.split(' - ')[0]}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supplements Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All {ingredients.length} Supplements</h2>
              <p className="text-gray-500">Research-backed supplements with real-time pricing.</p>
            </div>
            <Link href="/ingredients" className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ingredients.slice(0, 16).map((ing) => {
              const pathways = JSON.parse(ing.pathways || '[]');
              return (
                <Link
                  key={ing.ingredient_slug}
                  href={`/ingredients/${ing.ingredient_slug}`}
                  className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{ing.ingredient}</h3>
                  <p className="text-xs text-gray-400 mb-2">{ing.typical_dose}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pathways.slice(0, 3).map((p: string) => (
                      <span key={p} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{p}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">from ${ing.min_price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">{ing.product_count} product{ing.product_count !== 1 ? 's' : ''}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          {ingredients.length > 16 && (
            <div className="text-center mt-6">
              <Link href="/ingredients" className="text-emerald-600 font-medium hover:text-emerald-700">
                View all {ingredients.length} supplements &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
