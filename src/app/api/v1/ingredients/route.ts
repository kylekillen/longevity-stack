import { getAllIngredients } from '@/lib/queries';
import { apiResponse, handleOptions } from '@/lib/api-helpers';

export function OPTIONS() {
  return handleOptions();
}

export function GET() {
  const ingredients = getAllIngredients();

  return apiResponse({
    total: ingredients.length,
    ingredients: ingredients.map(ing => ({
      name: ing.ingredient,
      slug: ing.ingredient_slug,
      scientific_name: ing.scientific_name,
      typical_dose: ing.typical_dose,
      mechanism: ing.mechanism,
      pathways: JSON.parse(ing.pathways || '[]'),
      product_count: ing.product_count,
      min_price: +ing.min_price.toFixed(2),
      interactions: JSON.parse(ing.interactions || '[]'),
      synergies: JSON.parse(ing.synergies || '[]'),
      url: `https://thelongevityagent.com/ingredients/${ing.ingredient_slug}`,
    })),
  });
}
