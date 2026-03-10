import { NextRequest } from 'next/server';
import { getAllProducts, searchProducts, getAllProductsForIngredient } from '@/lib/queries';
import { apiResponse, apiError, handleOptions, formatProduct } from '@/lib/api-helpers';

export function OPTIONS() {
  return handleOptions();
}

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q');
  const ingredient = searchParams.get('ingredient');
  const vendor = searchParams.get('vendor');
  const minTrust = searchParams.get('min_trust');
  const sortBy = searchParams.get('sort') || 'per_serving';
  const limit = Math.min(parseInt(searchParams.get('limit') || '500'), 500);
  const offset = parseInt(searchParams.get('offset') || '0');

  let products;

  if (query) {
    products = searchProducts(query);
  } else if (ingredient) {
    products = getAllProductsForIngredient(ingredient);
  } else {
    products = getAllProducts();
  }

  // Filter by vendor
  if (vendor) {
    products = products.filter(p => p.vendor_slug === vendor);
  }

  // Filter by min trust
  if (minTrust) {
    const threshold = parseInt(minTrust);
    products = products.filter(p => p.vendor_trust_score >= threshold);
  }

  // Sort
  if (sortBy === 'price') {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'trust') {
    products.sort((a, b) => b.vendor_trust_score - a.vendor_trust_score);
  }
  // default: per_serving (already sorted from query)

  const total = products.length;
  const paginated = products.slice(offset, offset + limit);

  return apiResponse({
    total,
    limit,
    offset,
    products: paginated.map(formatProduct),
  });
}
