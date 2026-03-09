import Link from "next/link";
import { getAllIngredients } from "@/lib/queries";

export const metadata = {
  title: "All Supplements — Longevity Stack",
  description: "Browse 40+ research-backed supplements with real-time pricing from 16 vetted retailers.",
};

export default function IngredientsPage() {
  const ingredients = getAllIngredients();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Supplements</h1>
        <p className="text-gray-500">
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
              className="flex flex-col p-5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-gray-900">{ing.ingredient}</h2>
                <span className="text-sm font-medium text-emerald-600">from ${ing.min_price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{ing.scientific_name}</p>
              <p className="text-xs text-gray-400 mb-3">Typical dose: {ing.typical_dose}</p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ing.mechanism}</p>
              <div className="flex flex-wrap gap-1 mt-auto">
                {pathways.slice(0, 4).map((p: string) => (
                  <span
                    key={p}
                    className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {ing.product_count} product{ing.product_count !== 1 ? "s" : ""} compared
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
