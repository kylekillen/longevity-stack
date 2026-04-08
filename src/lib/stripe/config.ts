import Stripe from "stripe";

// Each product has a monthly subscription price.
// These price IDs must exist in your Stripe dashboard.
// Run `bun run stripe:seed` to create them, or set manually.
export const STRIPE_PRICES: Record<string, { priceId: string; amount: number }> = {
  ldn: { priceId: process.env.STRIPE_PRICE_LDN || "price_1TIzCwQ3RMXFjEVjnsfD3VGL", amount: 1900 },
  "mens-essentials": { priceId: process.env.STRIPE_PRICE_MENS_ESSENTIALS || "price_1TIzCwQ3RMXFjEVjidVBX92S", amount: 2500 },
  "womens-essentials": { priceId: process.env.STRIPE_PRICE_WOMENS_ESSENTIALS || "price_1TIzCwQ3RMXFjEVjUufdxOfi", amount: 2900 },
  dutasteride: { priceId: process.env.STRIPE_PRICE_DUTASTERIDE || "price_1TIzCxQ3RMXFjEVjIUAS6C2r", amount: 3500 },
  enclomiphene: { priceId: process.env.STRIPE_PRICE_ENCLOMIPHENE || "price_1TIzCxQ3RMXFjEVjPoyhbQ8K", amount: 5900 },
  "longevity-stack": { priceId: process.env.STRIPE_PRICE_LONGEVITY_STACK || "price_1TIzCxQ3RMXFjEVjirD0veHy", amount: 5900 },
  trt: { priceId: process.env.STRIPE_PRICE_TRT || "price_1TIzCyQ3RMXFjEVjZZO2URB0", amount: 7900 },
  "womens-hrt": { priceId: process.env.STRIPE_PRICE_WOMENS_HRT || "price_1TIzCyQ3RMXFjEVjlup6OYk6", amount: 7900 },
  glp1: { priceId: process.env.STRIPE_PRICE_GLP1 || "price_1TIzCyQ3RMXFjEVjIkD6pjXc", amount: 12900 },
};

// Stack ID → Stripe price mapping (new modular stack system)
// Keys match Stack.id values from src/lib/stacks.ts
export const STACK_STRIPE_PRICES: Record<string, { priceId: string; amount: number }> = {
  "inflammation":               { priceId: process.env.STRIPE_PRICE_LDN || "price_1TIzCwQ3RMXFjEVjnsfD3VGL", amount: 1900 },
  "testosterone-enhancement":   { priceId: process.env.STRIPE_PRICE_ENCLOMIPHENE || "price_1TIzCxQ3RMXFjEVjPoyhbQ8K", amount: 5900 },
  "longevity-base":             { priceId: process.env.STRIPE_PRICE_LONGEVITY_BASE || "price_1TIzCxQ3RMXFjEVjirD0veHy", amount: 8900 },
  "testosterone-replacement":   { priceId: process.env.STRIPE_PRICE_TRT || "price_1TIzCyQ3RMXFjEVjZZO2URB0", amount: 7900 },
  "womens-hrt":                 { priceId: process.env.STRIPE_PRICE_WOMENS_HRT || "price_1TIzCyQ3RMXFjEVjlup6OYk6", amount: 7900 },
  "longevity-glp1":             { priceId: process.env.STRIPE_PRICE_GLP1 || "price_1TIzCyQ3RMXFjEVjIkD6pjXc", amount: 12900 },
  // Newly priced — run `bun run stripe:seed` to get real price IDs, then set env vars
  "core-cardio":                { priceId: process.env.STRIPE_PRICE_CORE_CARDIO || "price_core_cardio_placeholder", amount: 2900 },
  "hair-men":                   { priceId: process.env.STRIPE_PRICE_HAIR_MEN || "price_hair_men_placeholder", amount: 2900 },
  "hair-pro-men":               { priceId: process.env.STRIPE_PRICE_HAIR_PRO_MEN || "price_hair_pro_men_placeholder", amount: 3500 },
  "hair-women":                 { priceId: process.env.STRIPE_PRICE_HAIR_WOMEN || "price_hair_women_placeholder", amount: 2900 },
  "skin":                       { priceId: process.env.STRIPE_PRICE_SKIN || "price_skin_placeholder", amount: 1900 },
};

// TRT lab panel add-on (annual, billed once)
export const TRT_LABS_PRICE = {
  priceId: process.env.STRIPE_PRICE_TRT_LABS || "price_trt_labs_placeholder",
  amount: 7900,
};

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2025-01-27.acacia" });
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}
