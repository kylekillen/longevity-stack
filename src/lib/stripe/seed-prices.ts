/**
 * Run once to create Stripe products and prices.
 * Usage: bun run src/lib/stripe/seed-prices.ts
 *
 * After running, copy the printed STRIPE_PRICE_* values into .env.local
 * and Vercel environment variables.
 */

import Stripe from "stripe";
import { getAllProducts } from "../products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

async function main() {
  const products = getAllProducts();

  for (const product of products) {
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.tagline,
      metadata: { slug: product.slug },
    });

    const price = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: product.ourPrice * 100,
      currency: "usd",
      recurring: { interval: "month" },
      metadata: { slug: product.slug },
    });

    const envKey = `STRIPE_PRICE_${product.slug.replace(/-/g, "_").toUpperCase()}`;
    console.log(`${envKey}=${price.id}`);
  }

  console.log("\nDone. Add the above to .env.local and Vercel environment variables.");
}

main().catch(console.error);
