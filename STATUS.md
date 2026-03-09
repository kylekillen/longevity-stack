# Longevity Stack — Status

**Last updated:** 2026-03-09
**Status:** Major UX + Data Overhaul Complete

## Site Orientation
**Supplement price comparison search engine.** Primary UX is a search bar on the homepage. Think Google Shopping for supplements.

## Catalog Stats
- **135 products** in database
- **177 price entries** (products x vendors)
- **43 ingredients** covered
- **16 vendors** with trust scores (2-9 scale)
- **5 biohacker protocols** (Johnson, Attia, Huberman, Greenfield, Patrick)

## Vendors (16)
| Vendor | Slug | Trust |
|--------|------|-------|
| Thorne | thorne | 9/10 |
| Life Extension | life-extension | 9/10 |
| Nootropics Depot | nootropics-depot | 9/10 |
| Pure Encapsulations | pure-encapsulations | 9/10 |
| iHerb | iherb | 8/10 |
| Jarrow Formulas | jarrow | 8/10 |
| Nordic Naturals | nordic-naturals | 8/10 |
| Momentous | momentous | 8/10 |
| NOW Foods | now-foods | 7/10 |
| Swanson Vitamins | swanson | 7/10 |
| Vital Proteins | vital-proteins | 7/10 |
| Garden of Life | garden-of-life | 7/10 |
| Nature's Way | natures-way | 7/10 |
| Bulk Supplements | bulk-supplements | 6/10 |
| Nutricost | nutricost | 6/10 |
| Amazon | amazon | 2/10 |

## Working Routes (60 pages generated)
- `/` — Homepage with search bar (primary UX)
- `/protocols` — Biohacker protocols listing
- `/protocols/[slug]` — Individual protocol pages (5)
- `/ingredients` — All 43 ingredients grid
- `/ingredients/[slug]` — Individual ingredient pages (43)
- `/cart` — Cart builder (URL-based, unchanged)
- `/trust-methodology` — Trust score methodology (NEW)
- `/why-not-amazon` — Amazon risks (unchanged)
- `/how-we-make-money` — Revenue transparency (updated)
- `/for-llms` — LLM documentation (updated with all new slugs/vendors)
- `/llms.txt` — Machine-readable site map (updated)
- `/stacks` — Redirects to /protocols
- `/stacks/[slug]` — Redirects to /protocols/[slug]

## Ingredients Covered (43)
Quercetin, Fisetin, Apigenin, Nicotinamide Riboside, Vitamin D3, Vitamin K2, Magnesium Glycinate, Omega-3, Creatine Monohydrate, Ashwagandha, NAC, Collagen Peptides, L-Theanine, Glycine, CoQ10/Ubiquinol, Lion's Mane, Rhodiola Rosea, Berberine, Alpha-GPC, Citicoline, Taurine, Zinc, Selenium, Boron, Vitamin C, Niacinamide, Melatonin, Astaxanthin, TMG, Vitamin B12, 5-MTHF, Vitamin B6, Prebiotics, Glucosamine, MSM, PQQ, NMN (with regulatory note), Spermidine, Calcium Alpha-Ketoglutarate, Tetrahydrocurcumin, Hyaluronic Acid, Tributyrin, Ergothioneine

## Protocols
1. **Bryan Johnson's Blueprint** — 13 supplements
2. **Peter Attia's Core Stack** — 7 supplements
3. **Andrew Huberman's Stack** — 10 supplements
4. **Ben Greenfield's Stack** — 11 supplements
5. **Rhonda Patrick's Stack** — 7 supplements

## What Changed (v2 Overhaul)
1. **Search bar as primary UX** — client-side filtering on homepage, instant results with sort/filter
2. **Catalog expanded** from 19 to 43 ingredients, 47 to 135 products
3. **Vendors expanded** from 6 to 16 (added NOW Foods, Jarrow, Swanson, Vital Proteins, Nordic Naturals, Momentous, Garden of Life, Bulk Supplements, Nutricost, Nature's Way)
4. **Trust score methodology page** — transparent scoring criteria at /trust-methodology
5. **Biohacker protocols** replaced curated stacks — Johnson, Attia, Huberman, Greenfield, Patrick
6. **Navigation restructured** — Search, Protocols, Browse, Why Not Amazon, How We Score, For LLMs
7. **Old /stacks routes redirect** to /protocols for backward compatibility
8. **For LLMs page and llms.txt** updated with all new data

## Build
- `npm run build` passes with zero errors
- 60 static pages generated
- Cart system unchanged and working

## Known Issues / TODOs
- Some protocol product slugs reference products not in catalog (garlic-le, sulforaphane-nd) — gracefully excluded from display. Should add those products.
- Prices are illustrative/realistic but not live — needs price scraping pipeline.
- Subscribe-and-save pricing not tracked.
- Stock availability not tracked in real-time.
- Compare page (side-by-side) not yet built — search + ingredient pages cover this well.
- Dihydroberberine (DHB) not added separately — only standard berberine included.
- Could add per-product COA tracking.
