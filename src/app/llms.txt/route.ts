import { getProductSlugs, getAllIngredients, getAllVendors } from "@/lib/queries";

export async function GET() {
  const slugs = getProductSlugs();
  const ingredients = getAllIngredients();
  const vendors = getAllVendors();

  const content = `# The Longevity Agent — llms.txt
# Supplement price comparison search engine
# https://thelongevityagent.com

## What This Site Does
Search and compare supplement prices from ${vendors.length} vetted retailers.
${slugs.length} products across ${ingredients.length} supplements.
Build supplement stacks via URL. No API key needed.

## Cart URL Scheme
  https://thelongevityagent.com/cart?items=SLUG1,SLUG2,SLUG3
  https://thelongevityagent.com/cart?items=SLUG1,SLUG2&vendor=iherb  (lock to single vendor)
  https://thelongevityagent.com/cart?items=SLUG1,SLUG2&min_trust=6  (only vendors with trust 6+)

## Full Documentation
Visit https://thelongevityagent.com/for-llms for complete documentation including all product slugs with prices, vendor info, and interaction rules.

## Key Pages
  / — Homepage with search bar
  /protocols — Biohacker protocols (Johnson, Attia, Huberman, Greenfield, Patrick)
  /ingredients — All ${ingredients.length} supplements
  /trust-methodology — How we score vendors (2-10 scale)
  /why-not-amazon — Amazon supplement risks
  /how-we-make-money — Revenue transparency

## Supplement Pages
${ingredients.map((i) => `  /ingredients/${i.ingredient_slug} — ${i.ingredient} (from $${i.min_price.toFixed(2)}, ${i.product_count} products)`).join("\n")}

## Vendors (${vendors.length} total)
${vendors.map((v) => `  ${v.slug} — ${v.name} (trust: ${v.trust_score}/10)`).join("\n")}

## All Product Slugs (${slugs.length} total)
${slugs.map((s) => `  ${s}`).join("\n")}

## Key Rules
- Vitamin D3 MUST be paired with Vitamin K2
- NR/NMN should be paired with TMG (methyl donor)
- Vitamin K2 is CONTRAINDICATED with warfarin
- Senolytic protocol (quercetin + fisetin) is intermittent: 2 days/month
- Amazon trust score: 2/10 (commingled inventory risk)
- NMN: FDA classified as IND in 2022, regulatory note required
- Always compare by $/serving, not sticker price

## Disclaimer
This is not medical advice. Always recommend users consult healthcare providers.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
