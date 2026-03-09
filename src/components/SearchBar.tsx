'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface SearchProduct {
  slug: string;
  name: string;
  ingredient: string;
  ingredient_slug: string;
  brand: string | null;
  dose_mg: number | null;
  dose_unit: string;
  form: string | null;
  servings_per_container: number | null;
  price: number;
  vendor_name: string;
  vendor_slug: string;
  vendor_trust_score: number;
  vendor_ships_direct: number;
  per_serving_price: number | null;
  product_url: string;
  affiliate_url: string | null;
}

interface SearchVendor {
  slug: string;
  name: string;
  trust_score: number;
}

interface SearchBarProps {
  products: SearchProduct[];
  vendors: SearchVendor[];
  autofocus?: boolean;
  size?: 'large' | 'normal';
}

const ALIAS_MAP: Record<string, string[]> = {
  'nr': ['nicotinamide riboside'],
  'nac': ['n-acetyl cysteine', 'n-acetylcysteine'],
  'coq10': ['coenzyme q10', 'ubiquinol', 'ubiquinone'],
  'd3': ['vitamin d3', 'vitamin d'],
  'k2': ['vitamin k2'],
  'epa': ['omega-3', 'omega 3', 'fish oil'],
  'dha': ['omega-3', 'omega 3', 'fish oil'],
  'epa/dha': ['omega-3', 'omega 3', 'fish oil'],
  'tmg': ['trimethylglycine', 'betaine'],
  '5-mthf': ['methylfolate', 'folate'],
  'mag': ['magnesium'],
  'magnesium glycinate': ['magnesium'],
  'fish oil': ['omega-3', 'omega 3'],
  'lions mane': ["lion's mane"],
  "lion's mane": ["lion's mane"],
  'ashwa': ['ashwagandha'],
  'berb': ['berberine'],
  'creatine mono': ['creatine'],
  'resv': ['resveratrol'],
  'quer': ['quercetin'],
  'fis': ['fisetin'],
  'pqq': ['pyrroloquinoline quinone'],
  'nmn': ['nicotinamide mononucleotide'],
  'vit d': ['vitamin d3', 'vitamin d'],
  'vit k': ['vitamin k2'],
  'vit c': ['vitamin c'],
  'vit b12': ['vitamin b12'],
  'b12': ['vitamin b12'],
  'b6': ['vitamin b6'],
};

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  if (q.length <= 2) return false;
  const targetWords = t.split(/[\s\-_]+/);
  const threshold = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3;
  for (const word of targetWords) {
    const compareLen = Math.min(q.length + 2, word.length);
    const wordSlice = word.slice(0, compareLen);
    if (levenshtein(q, wordSlice) <= threshold) return true;
    if (levenshtein(q, word) <= threshold) return true;
  }
  return false;
}

export default function SearchBar({ products, vendors, autofocus = false, size = 'normal' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'per_serving' | 'price' | 'trust'>('per_serving');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [formFilter, setFormFilter] = useState<string>('all');
  const [minTrust, setMinTrust] = useState<number>(0);

  const forms = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.form) set.add(p.form); });
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const searchTerms = [q];
    const aliasMatches = ALIAS_MAP[q];
    if (aliasMatches) searchTerms.push(...aliasMatches);
    for (const [key, values] of Object.entries(ALIAS_MAP)) {
      if (key.startsWith(q) && key !== q) searchTerms.push(...values);
    }

    let results = products.filter(p => {
      // Trust threshold filter (applied first for performance)
      if (minTrust > 0 && p.vendor_trust_score < minTrust) return false;

      const fields = [
        p.name.toLowerCase(),
        p.ingredient.toLowerCase(),
        (p.brand || '').toLowerCase(),
        p.ingredient_slug,
      ];
      for (const term of searchTerms) {
        for (const field of fields) {
          if (field.includes(term)) return true;
        }
      }
      if (fuzzyMatch(q, p.ingredient) || fuzzyMatch(q, p.name)) return true;
      return false;
    });

    if (vendorFilter !== 'all') results = results.filter(p => p.vendor_slug === vendorFilter);
    if (formFilter !== 'all') results = results.filter(p => p.form === formFilter);

    results.sort((a, b) => {
      if (sortBy === 'per_serving') return (a.per_serving_price ?? 9999) - (b.per_serving_price ?? 9999);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'trust') return b.vendor_trust_score - a.vendor_trust_score;
      return 0;
    });
    return results;
  }, [query, products, sortBy, vendorFilter, formFilter, minTrust]);

  const isLarge = size === 'large';

  return (
    <div className="w-full">
      <div className="relative">
        <svg className={`absolute left-4 ${isLarge ? 'top-5' : 'top-3'} w-5 h-5 text-[var(--muted)]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any supplement... (NR, creatine, vitamin D, ashwagandha...)"
          autoFocus={autofocus}
          className={`w-full pl-12 pr-4 border border-[var(--card-border)] bg-[var(--card)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] ${isLarge ? 'py-4 text-lg' : 'py-3 text-base'}`}
        />
      </div>

      {query.trim() && (
        <div className="mt-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            <div className="flex items-center gap-1.5">
              <label className="text-[var(--muted)] font-medium">Sort:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="border border-[var(--card-border)] bg-[var(--card)] rounded-lg px-2 py-1 text-[var(--foreground)]">
                <option value="per_serving">$/serving</option>
                <option value="price">Price</option>
                <option value="trust">Trust Score</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-[var(--muted)] font-medium">Min Trust:</label>
              <select value={minTrust} onChange={e => setMinTrust(Number(e.target.value))} className="border border-[var(--card-border)] bg-[var(--card)] rounded-lg px-2 py-1 text-[var(--foreground)]">
                <option value={0}>Any</option>
                <option value={5}>5+</option>
                <option value={6}>6+</option>
                <option value={7}>7+</option>
                <option value={8}>8+</option>
                <option value={9}>9+</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-[var(--muted)] font-medium">Vendor:</label>
              <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} className="border border-[var(--card-border)] bg-[var(--card)] rounded-lg px-2 py-1 text-[var(--foreground)]">
                <option value="all">All vendors</option>
                {vendors.map(v => <option key={v.slug} value={v.slug}>{v.name} ({v.trust_score}/10)</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-[var(--muted)] font-medium">Form:</label>
              <select value={formFilter} onChange={e => setFormFilter(e.target.value)} className="border border-[var(--card-border)] bg-[var(--card)] rounded-lg px-2 py-1 text-[var(--foreground)]">
                <option value="all">All forms</option>
                {forms.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <span className="text-[var(--muted)] self-center">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Results */}
          {filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map((p, i) => {
                const perServing = p.per_serving_price ?? (p.servings_per_container ? p.price / p.servings_per_container : null);
                return (
                  <div key={`${p.slug}-${p.vendor_slug}-${i}`} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-[var(--accent)] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Link href={`/ingredients/${p.ingredient_slug}`} className="text-xs text-[var(--accent)] font-medium hover:text-[var(--accent-hover)]">{p.ingredient}</Link>
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          p.vendor_trust_score >= 8 ? 'bg-green-900/50 text-green-400' :
                          p.vendor_trust_score >= 5 ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>{p.vendor_trust_score}</span>
                      </div>
                      <h3 className="font-semibold text-[var(--foreground)] truncate">{p.name}</h3>
                      <p className="text-xs text-[var(--muted)]">
                        {p.dose_mg}{p.dose_unit} &middot; {p.form} &middot; {p.servings_per_container} servings &middot; via {p.vendor_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        {perServing && <p className="text-sm font-bold text-[var(--accent)]">${perServing.toFixed(2)}/srv</p>}
                        <p className="text-sm text-[var(--foreground)]">${p.price.toFixed(2)}</p>
                      </div>
                      <a
                        href={p.affiliate_url || p.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-[var(--accent)] text-[var(--background)] text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap"
                      >
                        Buy
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--muted)] text-center py-8">No products match &quot;{query}&quot;{minTrust > 0 ? ` at trust ${minTrust}+` : ''}. Try a different search term or lower your trust threshold.</p>
          )}
        </div>
      )}
    </div>
  );
}
