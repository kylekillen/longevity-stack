import { NextRequest } from 'next/server';
import { getProductBySlug, getProductBySlugAndVendor } from '@/lib/queries';
import { apiResponse, apiError, handleOptions, formatProduct } from '@/lib/api-helpers';

export function OPTIONS() {
  return handleOptions();
}

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slugsParam = searchParams.get('slugs');
  const vendor = searchParams.get('vendor') || undefined;

  if (!slugsParam) {
    return apiError('Missing required parameter: slugs (comma-separated product slugs)', 400);
  }

  const slugs = slugsParam.split(',').filter(Boolean);
  if (slugs.length === 0) {
    return apiError('No valid slugs provided', 400);
  }
  if (slugs.length > 20) {
    return apiError('Maximum 20 products per comparison', 400);
  }

  const results: { slug: string; found: boolean; product?: ReturnType<typeof formatProduct> }[] = [];
  let totalPrice = 0;
  let totalMonthly = 0;

  for (const slug of slugs) {
    const product = vendor
      ? getProductBySlugAndVendor(slug, vendor) || getProductBySlug(slug)
      : getProductBySlug(slug);

    if (product) {
      const formatted = formatProduct(product);
      results.push({ slug, found: true, product: formatted });
      totalPrice += product.price;
      if (product.servings_per_container && product.servings_per_container > 0) {
        totalMonthly += (product.price / product.servings_per_container) * 30;
      } else {
        totalMonthly += (product.price / 45) * 30;
      }
    } else {
      results.push({ slug, found: false });
    }
  }

  const found = results.filter(r => r.found);
  const missing = results.filter(r => !r.found).map(r => r.slug);

  return apiResponse({
    total_products: found.length,
    total_price: +totalPrice.toFixed(2),
    estimated_monthly: +totalMonthly.toFixed(2),
    cart_url: `https://thelongevityagent.com/cart?items=${slugs.join(',')}${vendor ? `&vendor=${vendor}` : ''}`,
    products: found.map(r => r.product),
    ...(missing.length > 0 && { missing }),
  });
}
