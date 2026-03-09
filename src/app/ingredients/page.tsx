import Link from "next/link";
import { getAllIngredients } from "@/lib/queries";

export const metadata = {
  title: "All Supplements — The Longevity Agent",
  description: "Browse 40+ research-backed supplements with real-time pricing from 16 vetted retailers.",
};

export default function IngredientsPage() {
  const ingredients = getAllIngredients();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">All Supplements</h1>
        <p className="text-[var(--muted)]">
          {ingredients.length} research-backed longevity supplements. Click any supplement for price comparisons, research citations, and dosing info.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ingredients.map((ing) => {
          const pathways = JSON.parse(ing.pathways || "[]");
          return (
            <Link
              key={ing.ingredient_slug}
              href={`/ingredients/${ing.ingredient_slug}`}
              className="flex flex-col p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-xl hover:border-[var(--accent)] hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-[var(--foreground)]">{ing.ingredient}</h2>
                <span className="text-sm font-medium text-[var(--accent)]">from ${ing.min_price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-[var(--muted)] mb-1">{ing.scientific_name}</p>
              <p className="text-xs text-[var(--muted)] mb-3">Typical dose: {ing.typical_dose}</p>
              <p className="text-sm text-[var(--muted)] mb-3 line-clamp-2">{ing.mechanism}</p>
              <div className="flex flex-wrap gap-1 mt-auto">
                {pathways.slice(0, 4).map((p: string) => (
                  <span
                    key={p}
                    className="text-xs bg-[var(--accent-dim)] text-[var(--accent)] px-2 py-0.5 rounded-full"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">
                {ing.product_count} product{ing.product_count !== 1 ? "s" : ""} compared
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
