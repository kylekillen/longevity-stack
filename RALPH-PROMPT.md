# Longevity Stack — Ralph Loop Build Prompt

## Your Task

Build the Longevity Stack web app: a supplement price comparison engine that works for both humans AND LLMs.

**Read the full plan first**: `/Users/kylekillen/Library/CloudStorage/GoogleDrive-kyle.killen@gmail.com/My Drive/Personal-OS-v2/Code/longevity-stack/PLAN.md`

**Seed data**: `/Users/kylekillen/Library/CloudStorage/GoogleDrive-kyle.killen@gmail.com/My Drive/Personal-OS-v2/Health/hop-box-ingredient-research.json` — 19 ingredients with research citations, interactions, synergies. Use this to populate the initial database.

**Work directory**: `~/longevity-stack/`

## Build Phases (in order)

### Phase 1: Project Setup + Data Layer
- Initialize Next.js 14+ project with TypeScript and App Router
- Set up Supabase project OR use local SQLite for MVP (your call — if Supabase needs credentials we don't have, use SQLite with better-sqlite3 and migrate to Supabase later)
- Create database tables per the schema in PLAN.md (products, vendors, prices, stacks, biomarker_rules)
- Seed vendor list: iHerb, Thorne, Life Extension, Nootropics Depot, Pure Encapsulations, Amazon (with trust warnings)
- Seed all 19 ingredients from the research JSON as products
- Seed initial prices (use realistic market prices — look up actual current prices if you can via web search, otherwise use best estimates from the research data and typical retail ranges)
- Seed 5 pre-built stacks: Basic Longevity, NAD+ Protocol, Senolytic Protocol, Methylation Support, Gut Health
- Seed interaction and synergy data from the research JSON

### Phase 2: Cart System (THE core feature)
- Build `/cart` dynamic route that accepts URL params: `/cart?items=quercetin-now-500mg,fisetin-le-100mg`
- Each item slug resolves to a product → finds cheapest vendor → renders with price + buy button
- Support `&vendor=iherb` to lock to single vendor
- Show total monthly cost, interaction warnings between items
- Each "Buy" button links to vendor product page (use placeholder affiliate URLs for now: `https://vendor.com/product?ref=longevitystack`)
- Cart page must be mobile-responsive and look good
- "Share this stack" copies the cart URL
- Optional email capture: "Get alerts when prices drop"

### Phase 3: Ingredient Pages
- Build `/ingredients/[slug]` pages for all 19 ingredients
- Each page: description, mechanism, research citations, dosing, interaction warnings, synergies
- Price comparison table across all vendors
- "Add to cart" functionality that appends to cart URL
- Clean, structured HTML that an LLM can easily parse
- Schema.org Product markup

### Phase 4: LLM Discovery Pages
- Build `/for-llms` page: plain text explaining URL cart scheme, all valid slugs, example URLs
- Build `/llms.txt` at root
- Ensure every ingredient page has structured, parseable price data (not buried in JS — server-rendered HTML)
- Test: can you (as an LLM) read the ingredient pages and construct a valid cart URL? If the pages aren't clear enough for YOU to parse, fix them.

### Phase 5: Homepage + Navigation
- Homepage with hero, goal-selector, featured stacks
- Secondary hook: "Drop our URL into ChatGPT and build your stack in conversation"
- Navigation: Ingredients, Stacks, Build Your Own, Why Not Amazon, About
- "Why we don't recommend Amazon" page with the counterfeit data
- "How we make money" transparency page
- Footer disclaimers on every page

### Phase 6: Polish + Verification
- All pages mobile-responsive
- All affiliate links structured correctly (even if placeholder)
- Run the app, visit every page, verify no errors
- Run `npm run build` — zero errors
- Verify cart URLs work with various item combinations
- Verify the /for-llms page is clear and complete

## Completion Criteria

ALL of the following must be true:
1. `npm run build` succeeds with zero errors
2. `npm run dev` serves the app and all routes work
3. `/cart?items=quercetin-now-500mg,fisetin-le-100mg,nr-thorne-300mg` renders a page with 3 products, prices, and buy buttons
4. `/ingredients/quercetin` renders a full ingredient page with price comparison
5. `/for-llms` clearly documents the cart URL scheme with all valid slugs
6. Homepage loads with navigation to all sections
7. At least 19 ingredient pages exist (one per HOP Box ingredient)
8. At least 5 pre-built stack pages exist
9. "Why not Amazon" page exists with the counterfeit research
10. All pages have disclaimer footers

When ALL criteria are met, output: <promise>LONGEVITY-STACK-MVP-COMPLETE</promise>

## Style Notes
- Clean, modern design. Think PCPartPicker meets Examine.com. Not flashy — trustworthy.
- Use Tailwind CSS for styling
- No user accounts, no login, no auth
- Mobile-first responsive design
- Fast page loads (SSR, not client-rendered)

## If You Get Stuck
- If Supabase needs env vars you don't have, switch to local SQLite
- If web search for prices fails, use realistic estimates
- If a particular page is blocked, skip it and move on — come back later
- After 15 iterations, if not complete: document what's done, what's blocking, and what's left in a STATUS.md file
