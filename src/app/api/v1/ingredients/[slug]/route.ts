import { NextRequest } from 'next/server';
import { getAllProductsForIngredient } from '@/lib/queries';
import { apiResponse, apiError, handleOptions, formatProduct } from '@/lib/api-helpers';

export function OPTIONS() {
  return handleOptions();
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = getAllProductsForIngredient(slug);

  if (products.length === 0) {
    return apiError(`Ingredient '${slug}' not found`, 404);
  }

  const first = products[0];

  return apiResponse({
    ingredient: {
      name: first.ingredient,
      slug: first.ingredient_slug,
      scientific_name: first.scientific_name,
      typical_dose: first.typical_dose,
      mechanism: first.mechanism,
      pathways: JSON.parse(first.pathways || '[]'),
      research: JSON.parse(first.research || '[]'),
      interactions: JSON.parse(first.interactions || '[]'),
      synergies: JSON.parse(first.synergies || '[]'),
    },
    products: products.map(formatProduct),
    cart_example: `https://thelongevityagent.com/cart?items=${products[0].slug}`,
  });
}
