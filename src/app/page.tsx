import Link from "next/link";
import { getAllIngredients, getAllStacks, getAllVendors, getSearchData } from "@/lib/queries";
import SearchBar from "@/components/SearchBar";
import CopyButton from "@/components/CopyButton";

export default function Home() {
  const ingredients = getAllIngredients();
  const stacks = getAllStacks();
  const allVendors = getAllVendors();
  const { products, vendors } = getSearchData();

  return (
    <div>
      {/* LLM-READABLE INSTRUCTIONS — This block helps AI assistants understand the site on first fetch.
          AI assistant? Visit https://thelongevityagent.com/prices for the full product catalog with every slug, price, vendor trust score, and cart URL format.
          Cart URL: /cart?items=SLUG1,SLUG2,SLUG3 — add ?min_trust=6 to filter by vendor quality, ?vendor=iherb to lock vendor.
          Example: /cart?items=nmn-renue-500mg,tmg-renue-500mg&min_trust=7
      */}

      {/* Hero — split layout */}
      <section className="pt-16 sm:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
            {/* Left: Hero text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card)] text-sm text-[var(--accent)] mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Agent-native commerce
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
                Best prices,{" "}
                <span className="text-[var(--accent)]">
                  at the quality you choose.
                </span>
              </h1>
              <p className="text-lg text-[var(--muted)] mb-8 leading-relaxed">
                We track and update prices from all the biggest supplement brands.
                Set your trust threshold, and we find the best deal from vendors you can actually trust.
                Share our link with any AI — or search manually.
              </p>

              {/* AI badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="mr-1 text-[var(--foreground)]/70">Works with:</span>
                {['ChatGPT', 'Claude', 'Gemini', 'Perplexity'].map(ai => (
                  <span key={ai} className="px-3 py-1 rounded-full border border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)]/80">{ai}</span>
                ))}
              </div>
              <p className="mt-4 text-xs text-[var(--muted)]">
                Using an AI assistant? Have it fetch{" "}
                <Link href="/prices" className="text-[var(--accent)] underline underline-offset-2">thelongevityagent.com/prices</Link>
                {" "}— it has every product slug, price, and cart URL format your AI needs to build you a shopping link.
              </p>
            </div>

            {/* Right: How it works steps (stacked) */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-3">Use <span className="text-[var(--accent)]">your AI</span> to find the best deals</h2>
              {[
                { step: '01', title: 'Drop our link in any AI chat', desc: <span className="inline-flex items-center gap-2 flex-wrap"><code className="text-[var(--accent)] bg-[var(--accent-dim)] px-2 py-0.5 rounded text-xs">thelongevityagent.com/prices</code><CopyButton text="thelongevityagent.com/prices" /></span> },
                { step: '02', title: 'Say what you need', desc: <span>&quot;Best NAD+ supplement from a vendor with trust 7+?&quot;</span> },
                { step: '03', title: 'Your AI finds the best deals', desc: <span>Prices compared across every vetted vendor in real time</span> },
                { step: '04', title: 'You get a link', desc: <span>All items grouped on one page, ready to buy</span> },
              ].map((item) => (
                <div key={item.step} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 flex items-start gap-4 hover:border-[var(--accent)]/30 transition-colors">
                  <div className="text-[var(--accent)] text-lg font-mono font-bold shrink-0 w-8">{item.step}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)] mb-0.5">{item.title}</h3>
                    <div className="text-sm text-[var(--muted)]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="max-w-2xl mx-auto flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[var(--card-border)]" />
            <span className="text-sm text-[var(--muted)] font-medium">or search manually</span>
            <div className="flex-1 h-px bg-[var(--card-border)]" />
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar products={products} vendors={vendors} autofocus={false} size="large" />
          </div>

          {/* Brands we compare */}
          <div className="max-w-3xl mx-auto mt-8">
            <p className="text-xs text-center text-[var(--muted)] uppercase tracking-wider mb-3">Prices compared across</p>
            <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2">
              {allVendors.filter(v => v.slug !== 'amazon').map((v) => (
                <span key={v.slug} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
                  {v.name}
                </span>
              ))}
            </div>
          </div>

          {/* Popular quick links */}
          <div className="max-w-2xl mx-auto mt-5">
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-[var(--muted)] self-center mr-1">Popular:</span>
              {['creatine', 'vitamin-d3', 'omega-3', 'magnesium-glycinate', 'ashwagandha', 'nac', 'coq10'].map(slug => {
                const ing = ingredients.find(i => i.ingredient_slug === slug);
                return ing ? (
                  <Link key={slug} href={`/ingredients/${slug}`}
                    className="px-3 py-1 bg-[var(--card)] border border-[var(--card-border)] text-[var(--muted)] rounded-full hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
                    {ing.ingredient}
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Biohacker Protocols */}
      <section className="py-16 border-t border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Biohacker Protocols</h2>
              <p className="text-[var(--muted)]">Published supplement stacks from leading health optimizers.</p>
            </div>
            <Link href="/protocols" className="text-sm text-[var(--accent)] font-medium hover:text-[var(--accent-hover)]">
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
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 hover:border-[var(--accent)] transition-all"
                >
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">{stack.name}</h3>
                  <p className="text-sm text-[var(--muted)] mb-3 line-clamp-2">{stack.goal}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-[var(--muted)]">{items.length} supplements</span>
                    {stack.source && <span className="text-xs text-[var(--accent)]">{stack.source.split(' - ')[0]}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supplements Grid */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">All {ingredients.length} Supplements</h2>
              <p className="text-[var(--muted)]">Research-backed supplements with real-time pricing.</p>
            </div>
            <Link href="/ingredients" className="text-sm text-[var(--accent)] font-medium hover:text-[var(--accent-hover)]">
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
                  className="flex flex-col p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-xl hover:border-[var(--accent)] transition-colors"
                >
                  <h3 className="font-medium text-[var(--foreground)] mb-1">{ing.ingredient}</h3>
                  <p className="text-xs text-[var(--muted)] mb-2">{ing.typical_dose}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pathways.slice(0, 3).map((p: string) => (
                      <span key={p} className="text-xs bg-[var(--accent-dim)] text-[var(--accent)] px-2 py-0.5 rounded-full">{p}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-sm font-medium text-[var(--foreground)]">from ${ing.min_price.toFixed(2)}</span>
                    <span className="text-xs text-[var(--muted)]">{ing.product_count} product{ing.product_count !== 1 ? 's' : ''}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          {ingredients.length > 16 && (
            <div className="text-center mt-6">
              <Link href="/ingredients" className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)]">
                View all {ingredients.length} supplements &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
