# BUILD-BIBLE.md — The Longevity Agent

**Last updated:** 2026-04-13
**Domain:** [thelongevityagent.com](https://thelongevityagent.com)
**Entity:** The Longevity Agent LLC (Utah)
**CMO:** Dr. Amy Killen, MD — board-certified, 13 years longevity/regenerative medicine, 1099 contractor
**Structure:** MSO (management services organization) / technology platform — not a medical practice

---

## 1. Project Overview

The Longevity Agent is a direct-to-consumer telehealth platform that prescribes physician-approved longevity and preventive health medications at the lowest prices in the market. The value proposition is simple: the same medications that longevity physicians prescribe to their wealthiest patients, at prices that undercut every major competitor (Hims, AgelessRx, Hone Health, Maximus, TRT Nation, Winona, Ro Body, etc.).

Patients select modular "stacks" (protocol bundles), complete a 5-minute intake questionnaire, get physician review within 24-48 hours, and receive medications from licensed U.S. pharmacies in 3-5 business days. Monthly subscription, cancel anytime, no membership fees.

Starting at $19/month (LDN). Most expensive stack is $129/month (GLP-1/semaglutide).

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.1.6 (App Router) | React 19.2.3, TypeScript 5 |
| Styling | Tailwind CSS 4 | PostCSS, dark-only theme |
| Database | Supabase (PostgreSQL) | Schema `la`, shared instance with "limen" project |
| Auth | Supabase Auth | Email-based, middleware gates `/dashboard` |
| Payments | Stripe | Subscriptions, Checkout Sessions, Webhooks |
| Email | Resend | Transactional email |
| Hosting | Vercel | Auto-deploy on push to `main` |
| Local DB | better-sqlite3 | Legacy price comparison data (`data/longevity-stack.db`) |
| Price Pipeline | Python + Playwright | Nightly cron via macOS launchd, commits to git |

---

## 3. Repository

| Field | Value |
|-------|-------|
| Remote | `https://github.com/kylekillen/longevity-stack.git` |
| Branch | `main` |
| Deploy | Vercel auto-deploys on push to `main` |
| Vercel project | `longevity-stack` (kyle-killens-projects) |
| Vercel project ID | `prj_eoQLNwZppQHNjuRwFcwF5NhVoL67` |

### Deployment Flow

1. Push to `main` on GitHub
2. Vercel detects push, runs `next build`
3. Static pages generated at build time (stacks, products, blog, etc.)
4. Deployed to `thelongevityagent.com` (production) + preview URLs for PRs

### Automated Price Pipeline

A nightly cron job (`scripts/run-price-update.sh`) runs at 2 AM MT via macOS launchd:
- Executes `scripts/update-prices.py` (Playwright-based price scraper)
- Updates `data/longevity-stack.db` (SQLite)
- If prices changed, commits and pushes with author "Mojo <mojobot@agentmail.to>"
- Vercel auto-deploys the new prices
- Logs in `scripts/logs/`, reports in `scripts/reports/`

---

## 4. File Structure

```
longevity-stack/
├── .env.local                          # All secrets (see §6)
├── BUILD-BIBLE.md                      # This file
├── GPT-CONFIG.md                       # GPT/LLM configuration notes
├── PRICE-PIPELINE-PLAN.md              # Price scraping architecture doc
├── RALPH-PROMPT.md                     # Prompt engineering notes
├── README.md                           # Basic project readme
├── STATUS.md                           # Legacy status doc (pre-pivot, supplement era)
├── data/
│   └── longevity-stack.db              # SQLite DB — legacy supplement price data
├── outputs/
│   └── legitscript-audit-2026-04-08.md # LegitScript compliance audit
├── next.config.ts                      # Next.js config (better-sqlite3 external pkg)
├── package.json                        # Dependencies — Next 16, React 19, Stripe 22, Supabase
├── postcss.config.mjs                  # PostCSS + Tailwind
├── tsconfig.json                       # TypeScript config
├── public/
│   ├── .well-known/agent.json          # AI agent discovery (legacy supplement API spec)
│   ├── llms.txt                        # LLM-readable catalog (updated April 2026)
│   ├── openapi.json                    # OpenAPI spec (legacy supplement API)
│   ├── robots.txt                      # SEO — allows all, points to sitemap
│   ├── og-product.png                  # Open Graph image (1200x630)
│   ├── 4ec6100a32029aaa46d64de05675744d.txt  # Domain verification file
│   └── *.svg                           # Next.js default SVGs
├── scripts/
│   ├── update-prices.py                # Playwright price scraper
│   ├── run-price-update.sh             # Nightly cron wrapper
│   ├── llm-test.py                     # LLM endpoint integration tests
│   ├── logs/                           # Daily price update logs
│   └── reports/                        # Daily price snapshots (JSON)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql      # Full schema: la.user_profiles, la.intake_records,
│                                       #   la.subscriptions, la.physician_queue + RLS + triggers
├── src/
│   ├── middleware.ts                    # Supabase auth — gates /dashboard to logged-in users
│   ├── app/
│   │   ├── layout.tsx                  # Root layout — Inter font, Header/Footer, JSON-LD MedicalOrganization
│   │   ├── globals.css                 # CSS variables for dark theme (see §10)
│   │   ├── page.tsx                    # Homepage — hero, price comparisons, stack builder, how-it-works
│   │   ├── sitemap.ts                  # Dynamic sitemap generation
│   │   ├── favicon.ico
│   │   ├── about/page.tsx              # About — CMO Dr. Amy Killen, MSO disclaimer, contact info
│   │   ├── blog/
│   │   │   ├── page.tsx                # Blog listing (14 posts)
│   │   │   └── [slug]/page.tsx         # Individual blog post pages
│   │   ├── build-your-stack/page.tsx   # Stack builder landing page
│   │   ├── dashboard/page.tsx          # Authenticated user dashboard
│   │   ├── faq/page.tsx                # FAQ page
│   │   ├── for-llms/page.tsx           # Human-readable LLM integration docs
│   │   ├── how-it-works/page.tsx       # 4-step process explanation
│   │   ├── intake/
│   │   │   ├── page.tsx                # Intake flow entry
│   │   │   └── IntakeForm.tsx          # Multi-step intake form component
│   │   ├── llm/page.tsx                # LLM documentation page
│   │   ├── llms.txt/route.ts           # Serves llms.txt dynamically
│   │   ├── login/page.tsx              # Auth login page
│   │   ├── men/
│   │   │   ├── page.tsx                # Men's stacks overview
│   │   │   └── build/page.tsx          # Men's stack builder
│   │   ├── women/
│   │   │   ├── page.tsx                # Women's stacks overview
│   │   │   └── build/page.tsx          # Women's stack builder
│   │   ├── pricing/page.tsx            # Pricing comparison page
│   │   ├── privacy/page.tsx            # Privacy Policy (HIPAA language)
│   │   ├── terms/page.tsx              # Terms of Service (MSO, Utah law)
│   │   ├── products/[slug]/page.tsx    # Individual product detail pages
│   │   ├── stacks/[slug]/page.tsx      # Individual stack detail pages
│   │   ├── success/page.tsx            # Post-checkout success page
│   │   └── api/
│   │       ├── intake/submit/route.ts  # Intake form submission endpoint
│   │       ├── products.json/route.ts  # Product JSON API
│   │       ├── llm/
│   │       │   ├── catalog/route.ts    # Full JSON catalog for LLM consumption
│   │       │   └── build-stack/route.ts # POST endpoint — build stack programmatically
│   │       └── stripe/
│   │           ├── checkout/route.ts   # Creates Stripe Checkout sessions
│   │           └── webhook/route.ts    # Handles Stripe webhook events
│   ├── components/
│   │   ├── Header.tsx                  # Site header with navigation
│   │   ├── Footer.tsx                  # Footer — legal entity, address, phone, disclaimers
│   │   ├── ComparisonTable.tsx         # Price comparison table component
│   │   └── StackBuilder.tsx            # Interactive stack selection component
│   ├── data/
│   │   └── competitor-pricing.ts       # Verified competitor prices (April 2026)
│   └── lib/
│       ├── products.ts                 # Product catalog (9 products)
│       ├── stacks.ts                   # Stack catalog (12 stacks) — the core data model
│       ├── blog.ts                     # Blog post content (14 posts)
│       ├── stripe/
│       │   ├── config.ts               # Stripe price IDs, getStripe() helper
│       │   └── seed-prices.ts          # Script to create Stripe prices
│       └── supabase/
│           ├── client.ts               # Browser Supabase client
│           └── server.ts               # Server-side Supabase client
```

---

## 5. Product Catalog

### 5a. Stacks (Modular Protocol System)

Stacks are the primary data model. Patients select stacks in the builder, and a physician reviews the combination. Defined in `src/lib/stacks.ts`.

| Stack ID | Name | Medications | Price/mo | Gender | Lowest Competitor | Status |
|----------|------|-------------|----------|--------|-------------------|--------|
| `core-cardio` | Core Cardio & ED Prevention | Atorvastatin 20mg, Tadalafil 5mg | $29 | Both | Hims $40 | **Stripe placeholder** |
| `hair-men` | Hair | Finasteride 1mg, Oral Minoxidil 2.5mg | $29 | Men | Keeps $48 | **Stripe placeholder** |
| `hair-pro-men` | Hair Pro | Dutasteride 0.5mg, Oral Minoxidil 2.5mg | $35 | Men | Keeps $85 | **Stripe placeholder** |
| `hair-women` | Hair | Spironolactone 50-100mg, Oral Minoxidil 1.25-2.5mg | $29 | Women | Wisp $55 | **Stripe placeholder** |
| `skin` | Skin | Tretinoin 0.025% cream | $19 | Both | Dermatica $20 | **Stripe placeholder** |
| `inflammation` | Inflammation | LDN 1.5-4.5mg nightly | $19 | Both | AgelessRx $25 | **Live** |
| `testosterone-enhancement` | Testosterone Enhancement | Enclomiphene 12.5-25mg | $59 | Men | Defy Medical $149 | **Live** |
| `testosterone-replacement` | Testosterone Replacement | Testosterone cream (daily) | $79 | Men | TRT Nation $99 | **Live** |
| `womens-hrt` | Hormone Replacement | Estradiol, Micronized progesterone, Testosterone cream | $79 | Women | Winona $89 | **Live** |
| `longevity-base` | Longevity Base | Rapamycin 2-6mg weekly, Metformin 500-1000mg, Acarbose 25-50mg | $89 | Both | Healthspan $100 | **Live** |
| `longevity-glp1` | Longevity GLP-1 | Compounded semaglutide (weekly), Ondansetron | $129 | Both | Ro Body $145 | **Live** |
| `longevity-sglt2` | Longevity SGLT2 | Dapagliflozin 10mg, Acarbose, Magnesium | null | Both | — | **Waitlist only** |

**Mutual exclusivities:**
- Hair ↔ Hair Pro (men) — choose one
- Testosterone Enhancement ↔ Testosterone Replacement — choose one

**Stripe status:** Stacks marked "Stripe placeholder" have placeholder price IDs in `src/lib/stripe/config.ts`. Need to run `bun run stripe:seed` and set env vars before they can be purchased. Live stacks have real test-mode price IDs.

### 5b. Products (Legacy Individual SKUs)

Defined in `src/lib/products.ts`. These are the older individual product pages (`/products/[slug]`), which coexist with the newer stack system.

| Slug | Name | Price/mo | Gender |
|------|------|----------|--------|
| `ldn` | Low Dose Naltrexone | $19 | Both |
| `mens-essentials` | Men's Essentials (4-drug bundle) | $25 | Men |
| `womens-essentials` | Women's Essentials | $29 | Women |
| `dutasteride` | Dutasteride | $35 | Men |
| `enclomiphene` | Enclomiphene | $59 | Men |
| `longevity-stack` | Longevity Stack (Rapamycin + Metformin) | $59 | Both |
| `trt` | TRT | $79 | Men |
| `womens-hrt` | Women's HRT | $79 | Women |
| `glp1` | GLP-1 (Semaglutide/Tirzepatide) | $129 | Both |

### 5c. Blog Posts (14)

Defined in `src/lib/blog.ts`. Each post is a hardcoded long-form article with science-backed content.

1. `why-rapamycin-is-the-most-interesting-longevity-drug`
2. `ldn-the-19-drug-nobody-knows-about`
3. `hrt-the-study-that-scared-a-generation`
4. `rosuvastatin-the-statin-worth-taking` — **KNOWN ISSUE: references rosuvastatin, which was replaced by atorvastatin site-wide**
5. `tadalafil-not-just-for-ed`
6. `finasteride-vs-dutasteride-for-hair-loss`
7. `oral-minoxidil-for-hair-loss`
8. `tretinoin-the-gold-standard`
9. `metformin-longevity-drug`
10. `acarbose-the-overlooked-longevity-drug`
11. `semaglutide-for-longevity`
12. `spironolactone-womens-hair-loss`
13. `sglt2-inhibitors-longevity`
14. `enclomiphene-vs-trt`

---

## 6. Environment Variables

All set in `.env.local` for local dev and in Vercel dashboard for production. **Never commit secrets.**

| Variable | Purpose | Status |
|----------|---------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Set |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-only) | Set |
| `STRIPE_SECRET_KEY` | Stripe secret key | **TEST MODE (`sk_test_...`)** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | **TEST MODE (`pk_test_...`)** |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Set |
| `RESEND_API_KEY` | Resend email API key | Set |
| `NEXT_PUBLIC_APP_URL` | App base URL | `http://localhost:3001` (local), set in Vercel for prod |
| `STRIPE_PRICE_LDN` | Stripe price ID — LDN $19/mo | Set |
| `STRIPE_PRICE_MENS_ESSENTIALS` | Stripe price ID — Men's Essentials $25/mo | Set |
| `STRIPE_PRICE_WOMENS_ESSENTIALS` | Stripe price ID — Women's Essentials $29/mo | Set |
| `STRIPE_PRICE_DUTASTERIDE` | Stripe price ID — Dutasteride $35/mo | Set |
| `STRIPE_PRICE_ENCLOMIPHENE` | Stripe price ID — Enclomiphene $59/mo | Set |
| `STRIPE_PRICE_LONGEVITY_STACK` | Stripe price ID — Longevity Stack $59/mo | Set |
| `STRIPE_PRICE_TRT` | Stripe price ID — TRT $79/mo | Set |
| `STRIPE_PRICE_WOMENS_HRT` | Stripe price ID — Women's HRT $79/mo | Set |
| `STRIPE_PRICE_GLP1` | Stripe price ID — GLP-1 $129/mo | Set |
| `STRIPE_PRICE_CORE_CARDIO` | Stripe price ID — Core Cardio | **NEEDS CREATION** |
| `STRIPE_PRICE_HAIR_MEN` | Stripe price ID — Hair (Men) | **NEEDS CREATION** |
| `STRIPE_PRICE_HAIR_PRO_MEN` | Stripe price ID — Hair Pro (Men) | **NEEDS CREATION** |
| `STRIPE_PRICE_HAIR_WOMEN` | Stripe price ID — Hair (Women) | **NEEDS CREATION** |
| `STRIPE_PRICE_SKIN` | Stripe price ID — Skin | **NEEDS CREATION** |
| `STRIPE_PRICE_LONGEVITY_BASE` | Stripe price ID — Longevity Base | **Needs alias/update** |

---

## 7. Supabase Schema

Database uses the `la` schema (to avoid conflicts with the "limen" project on the same Supabase instance). Migration at `supabase/migrations/001_initial_schema.sql`.

Supabase project URL: `https://rrxrfmywhaprjbusmqhv.supabase.co`

### Tables

**`la.user_profiles`** — User accounts (linked to `auth.users`)
- `id` (uuid, PK, FK to auth.users), `email`, `name`, `dob`, `state` (2-char), `gender` (men/women), `stripe_customer_id`, timestamps
- RLS: users can read/update only their own row
- Trigger: auto-creates on `auth.users` insert

**`la.intake_records`** — Medical intake questionnaire submissions
- `id` (uuid), `user_id` (FK), `product_slug`, `current_meds`, `conditions`, `allergies`, `goals`, `stripe_session_id`
- `status`: pending_review / approved / declined / needs_info
- `physician_notes`, `reviewed_at`, `reviewed_by`
- RLS: users can read their own records

**`la.subscriptions`** — Active medication subscriptions
- `id` (uuid), `user_id` (FK), `product_slug`, Stripe IDs (`stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`)
- `status`: active / paused / cancelled / past_due / pending
- Period tracking, cancel_at_period_end flag
- RLS: users can read their own subscriptions

**`la.physician_queue`** — Review queue for providers (service role only, no RLS)
- `id` (uuid), `intake_id` (FK), `user_id` (FK), `product_slug`, `priority`, `assigned_to`
- `status`: queued / in_review / completed

### Triggers
- `la.handle_updated_at()` — auto-updates `updated_at` on user_profiles and subscriptions
- `la.handle_new_user()` — creates `la.user_profiles` row on new auth user creation

---

## 8. Stripe Integration

### Flow
1. Patient selects stacks and completes intake
2. Frontend POSTs to `/api/stripe/checkout` with `productSlug` + `intakeData`
3. Server creates Stripe Checkout Session (subscription mode)
4. Patient redirected to Stripe Checkout
5. On success redirects to `/success?session_id=...&product=...`
6. Stripe webhook (`/api/stripe/webhook`) handles:
   - `checkout.session.completed` — creates user profile, subscription record, intake record, queues for physician review
   - `customer.subscription.deleted` — marks subscription cancelled
   - `customer.subscription.updated` — syncs status, period dates
   - `invoice.payment_failed` — marks subscription past_due

### Price Config
Defined in `src/lib/stripe/config.ts`:
- `STRIPE_PRICES` — legacy product-slug to price mapping
- `STACK_STRIPE_PRICES` — stack-id to price mapping (new system)
- API version: `2026-03-25.dahlia`

### Critical Note
**All Stripe keys are currently TEST MODE.** Before launch, swap `sk_test_` / `pk_test_` keys for production keys in Vercel env vars. The Stripe account was created under the name "limen" — may need to update or create a new Stripe account under "The Longevity Agent."

---

## 9. Vendor & Partner Status

All vendors have been contacted. Current status as of April 2026:

| Partner | Role | Status |
|---------|------|--------|
| **OpenLoop** | Provider network (telehealth physicians) | Contacted — PENDING contract |
| **Arora Health** | Provider network (alternative) | Contacted — PENDING contract |
| **The Pharmacy Hub** (Miami, FL) | Dispensing pharmacy — LegitScript certified, 503A + commercial generic | Contacted — PENDING contract |
| **PaymentCloud** | Payment processor (high-risk merchant account) | Contacted |
| **Corepay** | Payment processor (alternative) | Contacted |
| **Durango Merchant Services** | Payment processor (alternative) | Contacted |
| **Green Payment Solutions** | Payment processor | Contacted — needs LegitScript cert confirmation |

**Critical blocker:** No patients can be seen until a provider network contract is signed (OpenLoop or Arora Health).

---

## 10. Design System

Dark-only theme. All colors defined as CSS custom properties in `src/app/globals.css`.

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#050508` | Page background — near-black |
| `--foreground` | `#ededed` | Primary text — off-white |
| `--surface` | `#0c0c12` | Footer, elevated surfaces |
| `--card` | `#1a1a24` | Card backgrounds |
| `--card-border` | `#2a2a3a` | Card borders, dividers |
| `--muted` | `#b0b0c8` | Secondary text |
| `--muted-light` | `#8080a0` | Tertiary text, fine print |
| `--accent` | `#22d3ee` | **Cyan** — primary accent (links, CTAs, icons) |
| `--accent-hover` | `#06b6d4` | Accent hover state |
| `--accent-dim` | `rgba(34,211,238,0.1)` | Accent backgrounds |
| `--accent-glow` | `rgba(34,211,238,0.05)` | Subtle accent glow |
| `--green` | `#4ade80` | Prices, savings, positive indicators |
| `--green-dim` | `rgba(74,222,128,0.1)` | Green backgrounds |
| `--danger` | `#ef4444` | Errors, warnings |
| `--warning` | `#f59e0b` | Caution indicators |

### Typography
- Font: Inter (Google Fonts, loaded via `next/font`)
- Antialiased rendering
- Selection color: cyan with 30% opacity

### Stack Colors
Each stack has a unique `color` hex for the visual builder blocks (defined in `stacks.ts`):
- Core Cardio: `#3b82f6` (blue)
- Hair: `#22c55e` (green)
- Hair Pro: `#15803d` (dark green)
- Skin: `#fb923c` (orange)
- Inflammation: `#a855f7` (purple)
- Testosterone Enhancement: `#f97316` (orange)
- Testosterone Replacement: `#ef4444` (red)
- Women's HRT: `#e879f9` (pink)
- Longevity Base: `#eab308` (gold)
- Longevity GLP-1: `#14b8a6` (teal)
- Longevity SGLT2: `#ec4899` (hot pink)

---

## 11. SEO & LLM Discoverability

The site has a multi-layered approach to being discoverable by both search engines and AI agents.

### Standard SEO
- `robots.txt` allows all crawlers, points to sitemap
- Dynamic `sitemap.ts` generates sitemap.xml
- JSON-LD `MedicalOrganization` schema on every page (root layout)
- Open Graph + Twitter Card metadata on all pages
- Keyword-rich meta descriptions targeting "cheapest [medication] online" queries
- Canonical URLs set on all pages

### LLM-Specific Endpoints
- **`/llms.txt`** (also at `public/llms.txt`) — plain-text machine-readable catalog with full pricing, stack details, competitor comparisons, and API instructions
- **`/api/llm/catalog`** — full JSON catalog with all stacks, prices, competitor data, FAQs, and intake URLs. CORS-enabled, 1-hour cache.
- **`/api/llm/build-stack`** — POST endpoint to programmatically build a stack selection. Accepts `{ stacks: [...], gender: "male"|"female" }`, returns intake URL, monthly total, and medication list.
- **`/api/products.json`** — Product JSON API
- **`/for-llms`** — Human-readable page explaining LLM integration
- **`/llm`** — LLM documentation page
- **`/.well-known/agent.json`** — AI agent discovery spec (currently references legacy supplement API — needs update)

### Blog as SEO Content
14 long-form blog posts targeting medication-specific search queries (rapamycin, LDN, semaglutide, tretinoin, etc.). Each post includes science-backed content with study citations.

---

## 12. Compliance

### LegitScript Healthcare Merchant Certification
Full audit completed 2026-04-08 (see `outputs/legitscript-audit-2026-04-08.md`). Overall readiness: ~78%.

**Completed:**
- Privacy Policy page (`/privacy`) — HIPAA language, MSO structure
- Terms of Service page (`/terms`) — MSO, pharmacy disclosure, Utah governing law
- Dr. Amy Killen named CMO on About page with credentials
- MSO/technology platform disclaimer on About page
- Legal entity name in footer copyright
- Provider language updated to "licensed healthcare provider" (not "board-certified physician")
- All brand-name GLP-1 references removed from FAQs
- Rosuvastatin to Atorvastatin migration completed site-wide (stacks, products, intake)

**Contact Info Published:**
- Phone: (310) 439-9867
- Address: 3646 E Viewcrest Cir, Salt Lake City, UT 84124
- Email: hello@thelongevityagent.com

**Remaining before LegitScript submission:**
- [ ] Provider network contract signed (OpenLoop or Arora Health)
- [ ] Run `bun run stripe:seed` for new stack prices, set env vars
- [ ] Confirm payment processor LegitScript cert (Green Payment Solutions)
- [ ] Add product-specific disclaimers on GLP-1, TRT, HRT stack pages

---

## 13. Known Issues

### P0 — Stripe Test Keys
All Stripe keys are test mode (`sk_test_`, `pk_test_`). Must swap for production keys before accepting real payments. Stripe account may be under "limen" name.

### P0 — Stripe Price Placeholders
Five stacks have placeholder price IDs that will not work in checkout: `core-cardio`, `hair-men`, `hair-pro-men`, `hair-women`, `skin`. Run `bun run stripe:seed` and set env vars.

### P0 — No Provider Network Contract
Cannot see patients until OpenLoop or Arora Health contract is signed.

### P1 — Rosuvastatin Blog Post
`/blog/rosuvastatin-the-statin-worth-taking` discusses rosuvastatin extensively, but the site migrated to atorvastatin. Options: rewrite for atorvastatin, redirect to Core Cardio stack page, or unpublish.

### P1 — agent.json Stale
`public/.well-known/agent.json` still references the legacy supplement price comparison API (v1 endpoints). Needs update to reflect the current telehealth/prescription model.

### P2 — SGLT2 Stack
Waitlist-only stack with null price. Either build out launch plan or remove from navigation.

### P2 — llms.txt Pricing Drift
Some prices in `public/llms.txt` say "Price pending" for stacks that now have prices in `stacks.ts` (e.g., Core Cardio at $29). The llms.txt needs a sync pass.

### P2 — STATUS.md Stale
`STATUS.md` describes the old supplement price comparison engine (pre-pivot). Should be updated or removed.

---

## 14. Local Development

```bash
# Clone
git clone https://github.com/kylekillen/longevity-stack.git
cd longevity-stack

# Install
npm install

# Environment
# Copy .env.local from secure source (contains all API keys)

# Run dev server
npm run dev
# Runs at http://localhost:3001

# Build
npm run build

# Lint
npm run lint
```

### Stripe Local Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local dev server
stripe listen --forward-to localhost:3001/api/stripe/webhook

# Set the webhook signing secret output as STRIPE_WEBHOOK_SECRET in .env.local
```

### Seed Stripe Prices
```bash
# Creates all price objects in Stripe and outputs price IDs
bun run stripe:seed
# Then update STRIPE_PRICE_* env vars in .env.local and Vercel
```

---

## 15. Launch Priorities

### Must-have before launch (P0)
1. Sign provider network contract (OpenLoop or Arora Health)
2. Swap Stripe test keys for production keys
3. Create Stripe prices for remaining stacks (core-cardio, hair-men, hair-pro-men, hair-women, skin)
4. Confirm payment processor is LegitScript certified
5. Submit LegitScript Healthcare Merchant Certification application

### Should-have before launch (P1)
6. Fix or unpublish rosuvastatin blog post
7. Update `agent.json` for current telehealth model
8. Add product-specific disclaimers on GLP-1, TRT, HRT pages
9. Sync `llms.txt` prices with current `stacks.ts` data

### Post-launch polish (P2)
10. Build SGLT2 stack launch plan or remove from nav
11. Update STATUS.md for current project state
12. Add per-stack lab panel recommendations
13. Build physician review dashboard
14. Email notifications via Resend (intake confirmation, Rx approved, etc.)

---

## 16. Key Contacts

| Role | Name | Notes |
|------|------|-------|
| Founder | Kyle Killen | |
| CMO | Dr. Amy Killen, MD | 1099 contractor, 13 yrs longevity/regenerative medicine |
| Provider Network | OpenLoop / Arora Health | Pending contract |
| Pharmacy | The Pharmacy Hub (Miami, FL) | LegitScript certified, 503A |
| Payment | PaymentCloud / Corepay / Durango / Green Payment Solutions | All contacted, selecting |

---

*This document is the single source of truth for the longevity-stack project. Update it when the codebase changes.*
