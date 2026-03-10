import { NextRequest } from 'next/server';
import { getAllProductsForIngredient, getProductBySlug } from '@/lib/queries';
import { apiResponse, apiError, handleOptions, formatProduct } from '@/lib/api-helpers';

export function OPTIONS() {
  return handleOptions();
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return apiError(`Product '${slug}' not found`, 404);
  }

  // Also get all products for this ingredient to show alternatives
  const alternatives = getAllProductsForIngredient(product.ingredient_slug)
    .filter(p => p.slug !== slug)
    .map(formatProduct);

  return apiResponse({
    product: formatProduct(product),
    alternatives,
  });
}
