import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

export function apiResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: CORS_HEADERS });
}

export function handleOptions() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export function formatProduct(p: any) {
  const perServing = p.per_serving_price
    ?? (p.servings_per_container > 0 ? +(p.price / p.servings_per_container).toFixed(2) : null);
  return {
    slug: p.slug,
    name: p.name,
    ingredient: p.ingredient,
    ingredient_slug: p.ingredient_slug,
    brand: p.brand,
    dose: p.dose_mg ? `${p.dose_mg}${p.dose_unit}` : null,
    form: p.form,
    servings: p.servings_per_container,
    price: +p.price.toFixed(2),
    per_serving: perServing,
    vendor: {
      name: p.vendor_name,
      slug: p.vendor_slug,
      trust_score: p.vendor_trust_score,
      ships_direct: !!p.vendor_ships_direct,
    },
    urls: {
      buy: p.affiliate_url || p.product_url,
      detail: `https://thelongevityagent.com/ingredients/${p.ingredient_slug}`,
    },
  };
}
