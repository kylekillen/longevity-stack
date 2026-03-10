/**
 * Generates static product data at build time for the cart page.
 * This avoids needing better-sqlite3 at Vercel serverless runtime.
 */
import { getAllProducts, getInteractionsBetween } from "@/lib/queries";
import type { ProductWithPrice } from "@/lib/db";

export interface CartProduct {
  slug: string;
  name: string;
  ingredient: string;
  ingredient_slug: string;
  dose_mg: number | null;
  dose_unit: string;
  form: string | null;
  servings_per_container: number | null;
  price: number;
  product_url: string;
  affiliate_url: string | null;
  vendor_name: string;
  vendor_slug: string;
  vendor_trust_score: number;
  vendor_trust_notes: string | null;
  vendor_ships_direct: number;
  synergies: string;
  interactions: string;
}

export interface CartData {
  /** slug -> cheapest product */
  products: Record<string, CartProduct>;
  /** slug -> vendor_slug -> product */
  productsByVendor: Record<string, Record<string, CartProduct>>;
  /** ingredient_slug -> interactions array */
  interactions: Record<string, { ingredient: string; interactions: any[] }>;
}

export function generateCartData(): CartData {
  const allProducts = getAllProducts();
  const products: Record<string, CartProduct> = {};
  const productsByVendor: Record<string, Record<string, CartProduct>> = {};

  for (const p of allProducts) {
    const cp: CartProduct = {
      slug: p.slug,
      name: p.name,
      ingredient: p.ingredient,
      ingredient_slug: p.ingredient_slug,
      dose_mg: p.dose_mg,
      dose_unit: p.dose_unit,
      form: p.form,
      servings_per_container: p.servings_per_container,
      price: p.price,
      product_url: p.product_url,
      affiliate_url: p.affiliate_url,
      vendor_name: p.vendor_name,
      vendor_slug: p.vendor_slug,
      vendor_trust_score: p.vendor_trust_score,
      vendor_trust_notes: p.vendor_trust_notes,
      vendor_ships_direct: p.vendor_ships_direct,
      synergies: p.synergies,
      interactions: p.interactions,
    };

    // Keep cheapest per slug
    if (!products[p.slug] || p.price < products[p.slug].price) {
      products[p.slug] = cp;
    }

    // Index by slug + vendor
    if (!productsByVendor[p.slug]) productsByVendor[p.slug] = {};
    productsByVendor[p.slug][p.vendor_slug] = cp;
  }

  // Pre-compute interactions for all ingredients
  const ingredientSlugs = [...new Set(allProducts.map(p => p.ingredient_slug))];
  const interactionsData = getInteractionsBetween(ingredientSlugs);
  const interactions: Record<string, { ingredient: string; interactions: any[] }> = {};
  for (const item of interactionsData) {
    const slug = allProducts.find(p => p.ingredient === item.ingredient)?.ingredient_slug;
    if (slug) interactions[slug] = item;
  }

  return { products, productsByVendor, interactions };
}
