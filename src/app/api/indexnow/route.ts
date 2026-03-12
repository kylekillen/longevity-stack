import { getAllIngredients, getAllStacks } from '@/lib/queries';
import { NextRequest } from 'next/server';

const INDEXNOW_KEY = '4ec6100a32029aaa46d64de05675744d';
const HOST = 'thelongevityagent.com';
const BASE_URL = `https://${HOST}`;

function getAllUrls(): string[] {
  const ingredients = getAllIngredients();
  const stacks = getAllStacks();

  const urls = [
    BASE_URL,
    `${BASE_URL}/ingredients`,
    `${BASE_URL}/protocols`,
    `${BASE_URL}/prices`,
    `${BASE_URL}/for-llms`,
    `${BASE_URL}/trust-methodology`,
    `${BASE_URL}/why-not-amazon`,
    `${BASE_URL}/how-we-make-money`,
    `${BASE_URL}/cart`,
    ...ingredients.map((i) => `${BASE_URL}/ingredients/${i.ingredient_slug}`),
    ...stacks.map((s) => `${BASE_URL}/protocols/${s.slug}`),
  ];

  return urls;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');

  if (secret !== 'longevity-indexnow-2026') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const urls = getAllUrls();

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  return Response.json({
    status: res.status,
    statusText: res.statusText,
    urlCount: urls.length,
    urls,
  });
}
