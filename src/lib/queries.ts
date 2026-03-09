import { getDb, type Product, type Vendor, type Price, type Stack, type ProductWithPrice } from './db';
import { seedDatabase } from './seed';

function ensureSeeded() {
  seedDatabase();
}

export function getProductBySlug(slug: string): ProductWithPrice | null {
  ensureSeeded();
  const db = getDb();
  const row = db.prepare(`
    SELECT p.*, pr.price, pr.url as product_url, pr.affiliate_url,
           v.name as vendor_name, v.slug as vendor_slug, v.trust_score as vendor_trust_score,
           v.trust_notes as vendor_trust_notes, v.ships_direct as vendor_ships_direct
    FROM products p
    JOIN prices pr ON pr.product_id = p.id
    JOIN vendors v ON v.id = pr.vendor_id
    WHERE p.slug = ?
    ORDER BY pr.price ASC
    LIMIT 1
  `).get(slug) as ProductWithPrice | undefined;
  return row || null;
}

export function getProductBySlugAndVendor(slug: string, vendorSlug: string): ProductWithPrice | null {
  ensureSeeded();
  const db = getDb();
  const row = db.prepare(`
    SELECT p.*, pr.price, pr.url as product_url, pr.affiliate_url,
           v.name as vendor_name, v.slug as vendor_slug, v.trust_score as vendor_trust_score,
           v.trust_notes as vendor_trust_notes, v.ships_direct as vendor_ships_direct
    FROM products p
    JOIN prices pr ON pr.product_id = p.id
    JOIN vendors v ON v.id = pr.vendor_id
    WHERE p.slug = ? AND v.slug = ?
    LIMIT 1
  `).get(slug, vendorSlug) as ProductWithPrice | undefined;
  return row || null;
}

export function getAllProductsForIngredient(ingredientSlug: string): ProductWithPrice[] {
  ensureSeeded();
  const db = getDb();
  return db.prepare(`
    SELECT p.*, pr.price, pr.url as product_url, pr.affiliate_url,
           v.name as vendor_name, v.slug as vendor_slug, v.trust_score as vendor_trust_score,
           v.trust_notes as vendor_trust_notes, v.ships_direct as vendor_ships_direct,
           CASE WHEN p.servings_per_container > 0 THEN ROUND(pr.price / p.servings_per_container, 2) ELSE NULL END as per_serving_price
    FROM products p
    JOIN prices pr ON pr.product_id = p.id
    JOIN vendors v ON v.id = pr.vendor_id
    WHERE p.ingredient_slug = ?
    ORDER BY per_serving_price ASC, pr.price ASC
  `).all(ingredientSlug) as ProductWithPrice[];
}

export function getAllIngredients(): { ingredient: string; ingredient_slug: string; subcategory: string | null; pathways: string; typical_dose: string | null; mechanism: string | null; scientific_name: string | null; research: string; interactions: string; synergies: string; min_price: number; product_count: number }[] {
  ensureSeeded();
  const db = getDb();
  return db.prepare(`
    SELECT p.ingredient, p.ingredient_slug, p.subcategory, p.pathways, p.typical_dose,
           p.mechanism, p.scientific_name, p.research, p.interactions, p.synergies,
           MIN(pr.price) as min_price,
           COUNT(DISTINCT p.id) as product_count
    FROM products p
    JOIN prices pr ON pr.product_id = p.id
    GROUP BY p.ingredient_slug
    ORDER BY p.ingredient ASC
  `).all() as any[];
}

export function getAllProducts(): ProductWithPrice[] {
  ensureSeeded();
  const db = getDb();
  return db.prepare(`
    SELECT p.*, pr.price, pr.url as product_url, pr.affiliate_url,
           v.name as vendor_name, v.slug as vendor_slug, v.trust_score as vendor_trust_score,
           v.trust_notes as vendor_trust_notes, v.ships_direct as vendor_ships_direct,
           CASE WHEN p.servings_per_container > 0 THEN ROUND(pr.price / p.servings_per_container, 2) ELSE NULL END as per_serving_price
    FROM products p
    JOIN prices pr ON pr.product_id = p.id
    JOIN vendors v ON v.id = pr.vendor_id
    ORDER BY p.ingredient ASC, per_serving_price ASC
  `).all() as ProductWithPrice[];
}

export function getAllStacks(): Stack[] {
  ensureSeeded();
  const db = getDb();
  return db.prepare('SELECT * FROM stacks WHERE is_featured = 1 ORDER BY name ASC').all() as Stack[];
}

export function getStackBySlug(slug: string): Stack | null {
  ensureSeeded();
  const db = getDb();
  return db.prepare('SELECT * FROM stacks WHERE slug = ?').get(slug) as Stack | undefined || null;
}

export function getAllVendors(): Vendor[] {
  ensureSeeded();
  const db = getDb();
  return db.prepare('SELECT * FROM vendors WHERE active = 1 ORDER BY trust_score DESC').all() as Vendor[];
}

export function getInteractionsBetween(ingredientSlugs: string[]): { ingredient: string; interactions: any[] }[] {
  ensureSeeded();
  const db = getDb();
  const results: { ingredient: string; interactions: any[] }[] = [];
  for (const slug of ingredientSlugs) {
    const product = db.prepare(`
      SELECT ingredient, interactions FROM products WHERE ingredient_slug = ? LIMIT 1
    `).get(slug) as { ingredient: string; interactions: string } | undefined;
    if (product) {
      const interactions = JSON.parse(product.interactions || '[]');
      if (interactions.length > 0) {
        results.push({ ingredient: product.ingredient, interactions });
      }
    }
  }
  return results;
}

export function getProductSlugs(): string[] {
  ensureSeeded();
  const db = getDb();
  return (db.prepare('SELECT slug FROM products ORDER BY slug').all() as { slug: string }[]).map(r => r.slug);
}

export function searchProducts(query: string): ProductWithPrice[] {
  ensureSeeded();
  const db = getDb();
  const pattern = `%${query}%`;
  return db.prepare(`
    SELECT p.*, pr.price, pr.url as product_url, pr.affiliate_url,
           v.name as vendor_name, v.slug as vendor_slug, v.trust_score as vendor_trust_score,
           v.trust_notes as vendor_trust_notes, v.ships_direct as vendor_ships_direct,
           CASE WHEN p.servings_per_container > 0 THEN ROUND(pr.price / p.servings_per_container, 2) ELSE NULL END as per_serving_price
    FROM products p
    JOIN prices pr ON pr.product_id = p.id
    JOIN vendors v ON v.id = pr.vendor_id
    WHERE p.name LIKE ? OR p.ingredient LIKE ? OR p.brand LIKE ? OR p.ingredient_slug LIKE ?
    ORDER BY per_serving_price ASC, pr.price ASC
  `).all(pattern, pattern, pattern, pattern) as ProductWithPrice[];
}

export function getSearchData(): { products: ProductWithPrice[]; vendors: { slug: string; name: string; trust_score: number }[] } {
  ensureSeeded();
  const db = getDb();
  const products = db.prepare(`
    SELECT p.*, pr.price, pr.url as product_url, pr.affiliate_url,
           v.name as vendor_name, v.slug as vendor_slug, v.trust_score as vendor_trust_score,
           v.trust_notes as vendor_trust_notes, v.ships_direct as vendor_ships_direct,
           CASE WHEN p.servings_per_container > 0 THEN ROUND(pr.price / p.servings_per_container, 2) ELSE NULL END as per_serving_price
    FROM products p
    JOIN prices pr ON pr.product_id = p.id
    JOIN vendors v ON v.id = pr.vendor_id
    ORDER BY per_serving_price ASC, pr.price ASC
  `).all() as ProductWithPrice[];
  const vendors = db.prepare(`SELECT slug, name, trust_score FROM vendors WHERE active = 1 ORDER BY name`).all() as any[];
  return { products, vendors };
}
