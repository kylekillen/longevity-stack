# The Longevity Agent — BUILD BIBLE
**Last updated:** 2026-04-13  
**Commit:** 0c36820  
**Purpose:** Complete handoff document. A new Claude Code instance with zero prior context should be able to pick up the project from here.

---

## 1. PROJECT OVERVIEW

**The Longevity Agent** is a direct-to-consumer (DTC) telemedicine platform that prescribes longevity and preventive medicine protocols at the lowest prices on the market. Think "Hims for longevity medicine" — modular prescription stacks, no clinic markup.

**Core positioning:** "We checked what everyone else charges. Then we charged less."

### Business Identity
| Field | Value |
|-------|-------|
| Legal entity | The Longevity Agent LLC (Utah, filed 2026-04-08) |
| EIN | Obtained |
| Domain | thelongevityagent.com |
| Contact | hello@thelongevityagent.com |
| Phone | (310) 439-9867 |
| Address | 3646 E Viewcrest Cir, Salt Lake City, UT 84124 |
| CMO | Dr. Amy Killen, MD — board-certified, 13 yrs longevity/regenerative medicine, 1099 contractor |
| Owner | Kyle Killen (100%) |

### Legal Structure
TLA is an **MSO (Managed Services Organization) and technology platform** — NOT a medical practice. Clinical services are provided by independently licensed healthcare providers who exercise independent medical judgment. This language is critical for compliance and appears on:
- `/terms` — Section 1
- `/about` — "Medical oversight" section
- `/privacy` — Throughout

### Compliance Status
See full audit at `outputs/legitscript-audit-2026-04-08.md`

**LegitScript readiness: ~85%**. Phone number and address added (P0 resolved). Remaining blockers:
- Provider network contract (Arora Health or OpenLoop) — must sign before accepting patients
- Green Payment Solutions LegitScript certification — confirm with them
- Stripe price seeding for 5 new stacks (see Section 6)
- Product-specific disclaimers on GLP-1/TRT/HRT pages (P2)

---

## 2. TECH STACK

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js App Router | 16.1.6 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4 (PostCSS plugin) |
| UI | React | 19.2.3 |
| Database | Supabase (PostgreSQL) | @supabase/ssr ^0.10.0 |
| Payments | Stripe | ^22.0.0 |
| Email | Resend | (configured, not heavily used yet) |
| Hosting | Vercel | Hobby plan |
| Runtime | Bun | (local dev + builds) |
| SQLite | better-sqlite3 | ^12.6.2 (legacy — from supplement era) |

### Important: Use `bun`, not `npm/npx`
```bash
bun run dev       # dev server
bun run build     # production build
bun run start     # start production server
```
`npx` and `npm` are not on PATH on Kyle's machine. If a command fails with "command not found", prefix with `export PATH="$HOME/.bun/bin:$PATH"`.

---

## 3. REPOSITORY

| Field | Value |
|-------|-------|
| Remote | https://github.com/kylekillen/longevity-stack.git |
| Primary branch | `main` (= production) |
| Branch strategy | Push to main → Vercel auto-deploys |
| Active worktrees | None |
| Vercel project | `longevity-stack` under team `kyle-killens-projects` |

### Deploy workflow
```bash
git add <files>
git commit -m "message"
git push origin main
# Vercel deploys automatically in ~40s
```

### Check deployment status
```bash
bunx vercel ls longevity-stack
```

### Known deployment gotcha
**Vercel runs full TypeScript type-checking; local Turbopack dev does not.** Type errors that pass locally will fail on Vercel. Always run `bun run build` before pushing for anything non-trivial. The Stripe API version issue (2025-01-27.acacia → 2026-03-25.dahlia, fixed in commit 2048269) is the canonical example of this.

---

## 4. FILE STRUCTURE

```
~/longevity-stack/
├── public/
│   ├── .well-known/agent.json      # AI agent discovery
│   ├── openapi.json                # OpenAPI spec for /api
│   ├── robots.txt                  # SEO
│   └── og-product.png              # Open Graph image
├── scripts/
│   ├── update-prices.py            # Daily price update script (cron)
│   ├── run-price-update.sh         # Shell wrapper for price update
│   ├── llm-test.py                 # Tests LLM API endpoints
│   ├── logs/                       # Daily price update logs (2026-04-07+)
│   └── reports/                    # Price update JSON reports
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # FULL schema — la.* tables
├── outputs/
│   └── legitscript-audit-2026-04-08.md  # LegitScript readiness audit
├── src/
│   ├── app/
│   │   ├── page.tsx                # Homepage — hero + competitor callouts + stack builder CTA
│   │   ├── layout.tsx              # Root layout — Header, Footer, metadata, fonts
│   │   ├── globals.css             # CSS variables (color system), Tailwind import
│   │   ├── sitemap.ts              # Auto-generated sitemap
│   │   ├── llms.txt/route.ts       # Machine-readable site map for LLMs
│   │   ├── about/page.tsx          # About page — includes Dr. Amy Killen CMO, address, phone
│   │   ├── faq/page.tsx            # FAQ
│   │   ├── pricing/page.tsx        # Full pricing table
│   │   ├── how-it-works/page.tsx   # Process walkthrough
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog index
│   │   │   └── [slug]/page.tsx     # Blog post pages
│   │   ├── stacks/[slug]/page.tsx  # Stack detail page (canonical product pages)
│   │   ├── products/[slug]/page.tsx # Product detail page (legacy — products.ts)
│   │   ├── men/
│   │   │   ├── page.tsx            # Men's landing page
│   │   │   └── build/page.tsx      # Men's stack builder
│   │   ├── women/
│   │   │   ├── page.tsx            # Women's landing page
│   │   │   └── build/page.tsx      # Women's stack builder
│   │   ├── build-your-stack/page.tsx # Generic stack builder
│   │   ├── intake/
│   │   │   ├── page.tsx            # Intake wrapper
│   │   │   └── IntakeForm.tsx      # Full multi-step intake form + contra screening
│   │   ├── success/page.tsx        # Post-checkout success page
│   │   ├── dashboard/page.tsx      # User dashboard (auth-gated, shows subscriptions)
│   │   ├── login/page.tsx          # Supabase auth login
│   │   ├── privacy/page.tsx        # HIPAA privacy policy (created 2026-04-08)
│   │   ├── terms/page.tsx          # Terms of Service + MSO disclaimer (created 2026-04-08)
│   │   ├── for-llms/page.tsx       # Human-readable LLM interface docs
│   │   ├── llm/page.tsx            # LLM info page
│   │   └── api/
│   │       ├── intake/submit/route.ts        # POST — creates Stripe checkout session
│   │       ├── stripe/checkout/route.ts      # Stripe checkout (alternate/legacy)
│   │       ├── stripe/webhook/route.ts       # Stripe webhook handler
│   │       ├── llm/catalog/route.ts          # GET — returns full product catalog as JSON
│   │       ├── llm/build-stack/route.ts      # POST — AI stack recommendation endpoint
│   │       └── products.json/route.ts        # GET — products.json machine-readable feed
│   ├── components/
│   │   ├── Header.tsx              # Nav with MENS_STACKS + WOMENS_STACKS dropdown arrays
│   │   ├── Footer.tsx              # Footer with legal entity, address, phone, privacy/terms links
│   │   ├── ComparisonTable.tsx     # Competitor price comparison table component
│   │   └── StackBuilder.tsx        # Interactive stack builder widget
│   ├── data/
│   │   └── competitor-pricing.ts   # Full competitor price data by stack — source of truth for competitor prices
│   └── lib/
│       ├── stacks.ts               # PRIMARY DATA — all 12 stacks with medications, prices, copy
│       ├── products.ts             # SECONDARY DATA — 9 products (legacy format, still used)
│       ├── blog.ts                 # All 14 blog posts (full content stored inline)
│       ├── stripe/
│       │   ├── config.ts           # Stripe price IDs, STACK_STRIPE_PRICES map, getStripe()
│       │   └── seed-prices.ts      # One-time script to create Stripe products/prices
│       └── supabase/
│           ├── client.ts           # Browser Supabase client
│           └── server.ts           # Server Supabase client (SSR-safe)
├── BUILD-BIBLE.md                  # This file
├── STATUS.md                       # STALE — describes old supplement comparison version
├── PLAN.md                         # Original MVP plan (supplement comparison era)
├── PRICE-PIPELINE-PLAN.md          # Price scraping pipeline plan (supplement era)
├── GPT-CONFIG.md                   # GPT system prompt config
├── RALPH-PROMPT.md                 # Ralph (price monitoring bot) prompt
├── next.config.ts                  # serverExternalPackages: ['better-sqlite3']
├── package.json                    # bun lockfile present (bun.lock)
├── tsconfig.json                   # strict: true, paths @/* → src/*
└── .env.local                      # All secrets (see Section 6)
```

> **Note:** `STATUS.md` and `PLAN.md` describe the OLD supplement price comparison version of this project. The project has pivoted to DTC telehealth. Ignore their content for current development.

---

## 5. PRODUCT CATALOG

### Canonical data source: `src/lib/stacks.ts`
This is the primary product definition file. `src/lib/products.ts` is a legacy parallel system still used on `/products/[slug]` routes.

### Complete Stack Catalog

| Stack ID | Name | Medications | Price | Gender | Status |
|----------|------|-------------|-------|--------|--------|
| `core-cardio` | Core Cardio & ED Prevention | Atorvastatin 20mg + Tadalafil 5mg | $29/mo | both | **Active** |
| `hair-men` | Hair | Finasteride 1mg + Oral Minoxidil 2.5mg | $29/mo | men | **Active** |
| `hair-pro-men` | Hair Pro | Dutasteride 0.5mg + Oral Minoxidil 5mg | $35/mo | men | **Active** |
| `hair-women` | Hair | Spironolactone 50mg + Oral Minoxidil 2.5mg | $29/mo | women | **Active** |
| `skin` | Skin | Tretinoin 0.025% | $19/mo | both | **Active** |
| `inflammation` | Inflammation | LDN 1.5–4.5mg | null (pending) | both | **Pending** |
| `testosterone-enhancement` | Testosterone Enhancement | Enclomiphene 12.5mg | $59/mo | men | **Active** |
| `testosterone-replacement` | Testosterone Replacement | Testosterone cream (50–100mg) | $79/mo | men | **Active** |
| `womens-hrt` | Hormone Replacement | Estradiol + Progesterone | $79/mo | women | **Active** |
| `longevity-base` | Longevity Base | Rapamycin 6mg/wk + Metformin 500mg + Acarbose 25mg | $89/mo | both | **Active** |
| `longevity-glp1` | Longevity GLP-1 | Semaglutide 0.25–2.4mg/wk + Ondansetron 4mg | $129/mo | both | **Active** |
| `longevity-sglt2` | Longevity SGLT2 | Empagliflozin (TBD) | null | both | **Waitlist** |

### Medication note
**Statin = Atorvastatin 20mg** throughout the entire codebase. An earlier version used rosuvastatin 5mg — this was migrated in commit 7b91e9e. One blog post (`rosuvastatin-the-statin-worth-taking`) still references rosuvastatin — it should be rewritten, redirected to Core Cardio, or unpublished.

### Competitor pricing source of truth
`src/data/competitor-pricing.ts` — contains full competitor price data by stack with named vendors and notes. This file also drives the `HERO_COMPARISONS` export used on the homepage.

The stack builder hero page uses these named competitors:
- LDN: AgelessRx $25/mo (Save 24%)
- TRT: TRT Nation $99/mo (Save 20%)
- Longevity Base: Healthspan $100/mo (Save 41%)
- GLP-1: Ro Body $145/mo (Save 11%)

---

## 6. KEY CONFIGURATION

### Environment Variables

All set in `.env.local` (local) and Vercel environment variables (production). **Never commit actual key values.**

| Variable | Purpose | Status |
|----------|---------|--------|
| `VERCEL_OIDC_TOKEN` | Vercel auth (auto-generated) | Set |
| `STRIPE_SECRET_KEY` | Stripe API — **TEST MODE** | Set (test key `sk_test_51T6bLD...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client-side — **TEST MODE** | Set |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | Set (`whsec_Md7457...`) |
| `RESEND_API_KEY` | Transactional email | Set (`re_RQwJAP...`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Set (`https://rrxrfmywhaprjbusmqhv.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) | Set |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin (server-only) | Set |
| `NEXT_PUBLIC_APP_URL` | Base URL (`http://localhost:3001` dev, `https://thelongevityagent.com` prod) | Set |
| `STRIPE_PRICE_LDN` | `price_1TIzCwQ3RMXFjEVjnsfD3VGL` | Set |
| `STRIPE_PRICE_MENS_ESSENTIALS` | `price_1TIzCwQ3RMXFjEVjidVBX92S` | Set |
| `STRIPE_PRICE_WOMENS_ESSENTIALS` | `price_1TIzCwQ3RMXFjEVjUufdxOfi` | Set |
| `STRIPE_PRICE_DUTASTERIDE` | `price_1TIzCxQ3RMXFjEVjIUAS6C2r` | Set |
| `STRIPE_PRICE_ENCLOMIPHENE` | `price_1TIzCxQ3RMXFjEVjPoyhbQ8K` | Set |
| `STRIPE_PRICE_LONGEVITY_STACK` | `price_1TIzCxQ3RMXFjEVjirD0veHy` | Set (longevity-base, old key name) |
| `STRIPE_PRICE_TRT` | `price_1TIzCyQ3RMXFjEVjZZO2URB0` | Set |
| `STRIPE_PRICE_WOMENS_HRT` | `price_1TIzCyQ3RMXFjEVjlup6OYk6` | Set |
| `STRIPE_PRICE_GLP1` | `price_1TIzCyQ3RMXFjEVjIkD6pjXc` | Set |
| `STRIPE_PRICE_CORE_CARDIO` | Pending — placeholder in code | **NOT SET** |
| `STRIPE_PRICE_HAIR_MEN` | Pending — placeholder in code | **NOT SET** |
| `STRIPE_PRICE_HAIR_PRO_MEN` | Pending — placeholder in code | **NOT SET** |
| `STRIPE_PRICE_HAIR_WOMEN` | Pending — placeholder in code | **NOT SET** |
| `STRIPE_PRICE_SKIN` | Pending — placeholder in code | **NOT SET** |
| `STRIPE_PRICE_LONGEVITY_BASE` | Pending — old key `STRIPE_PRICE_LONGEVITY_STACK` still in use | **NOT SET** |

### Stripe Status: TEST MODE
All Stripe keys are test-mode keys from the Limen project (`sk_test_51T6bLD...`). **No live Stripe keys are configured.** The site cannot accept real payments until:
1. New Stripe account created for The Longevity Agent LLC
2. Live keys obtained and set in Vercel
3. New price IDs seeded with `bun run stripe:seed`
4. All `STRIPE_PRICE_*` env vars updated

### To seed new Stripe prices
```bash
cd ~/longevity-stack
export STRIPE_SECRET_KEY=sk_live_...  # set live key temporarily
bun run src/lib/stripe/seed-prices.ts
# Copy printed STRIPE_PRICE_* values to .env.local and Vercel
```

### Supabase
- **Project:** `rrxrfmywhaprjbusmqhv` (shared with Limen project)
- **Schema:** `la` (all tables prefixed `la.*` to avoid conflicts with Limen's `public.*` schema)
- **Tables:** `la.user_profiles`, `la.intake_records`, `la.subscriptions`, `la.physician_queue`
- **RLS:** Enabled on user-facing tables; `physician_queue` is service-role only
- **Auth:** Supabase email/password + Google OAuth
- **Trigger:** `la_on_auth_user_created` — creates `la.user_profiles` row on new auth.users insert
- **Dashboard:** https://supabase.com/dashboard/project/rrxrfmywhaprjbusmqhv

### Stripe API Version
Currently `2026-03-25.dahlia` (in `src/lib/stripe/config.ts` and `src/lib/stripe/seed-prices.ts`). If Stripe SDK is upgraded and breaks with a type error on `apiVersion`, update this string to match what the new SDK requires.

---

## 7. DEPLOYMENT

### Vercel
| Field | Value |
|-------|-------|
| Team | `kyle-killens-projects` |
| Project | `longevity-stack` |
| Production URL | thelongevityagent.com |
| Build command | `npm run build` (Vercel uses npm; local uses bun — both work) |
| Build time | ~35–45s |
| Plan | Hobby |

### Deploy commands
```bash
# Push to deploy
git push origin main

# Check status
bunx vercel ls longevity-stack

# Get full build logs for a failed deploy
bunx vercel inspect <deployment-url> --logs
```

### Known deployment issues

**Issue:** Stripe SDK API version mismatch  
**Symptom:** `Type '"old-version"' is not assignable to type '"current-version"'` TypeScript error  
**Cause:** Vercel does full type-checking; local Turbopack does not  
**Fix:** Update `apiVersion` string in `src/lib/stripe/config.ts` and `src/lib/stripe/seed-prices.ts`

**Issue:** Transient Vercel build failures  
**Fix:** Push an empty commit to retrigger: `git commit --allow-empty -m "retrigger deploy" && git push`

---

## 8. VENDOR STATUS

### Provider Network (CRITICAL — no patients without this)
| Vendor | Status |
|--------|--------|
| Arora Health | Contacted — contract pending |
| OpenLoop | Contacted — contract pending |

Must sign with one before accepting patients. This is the single largest operational blocker.

### Pharmacy
| Vendor | Status |
|--------|--------|
| The Pharmacy Hub (Miami, FL) | Identified — 503A compounding + commercial generic, LegitScript certified, REST API available |

Pharmacy partnership needs formal agreement. Referenced in Terms of Service.

### Payment Processing
| Vendor | Status |
|--------|--------|
| Green Payment Solutions | Contacted — awaiting LegitScript certification confirmation |

LegitScript requires the payment processor to also be LegitScript certified.

### LegitScript Certification
- **Application:** Not yet submitted
- **Full audit:** `outputs/legitscript-audit-2026-04-08.md`
- **Readiness:** ~85%
- **Submission blockers:** Provider network contract, payment processor cert confirmation

---

## 9. COMPLIANCE

### Legal Pages (all live on site)
| Page | URL | Status |
|------|-----|--------|
| Privacy Policy | /privacy | Live — HIPAA, MSO structure, legal entity name |
| Terms of Service | /terms | Live — MSO disclaimer, pharmacy disclosure, Utah law |
| Medical disclaimer | Footer (global) | Live — every page |

### Key compliance language implemented
- **MSO structure:** "The Longevity Agent LLC is not a medical practice... We operate as a Managed Services Organization (MSO) and technology intermediary." — in /terms, /about, /privacy
- **Provider language:** All copy uses "licensed healthcare provider" or "your provider" — NOT "physician" or "doctor" — to cover NPs/PAs
- **Brand names:** No Ozempic/Wegovy/Mounjaro/Zepbound in copy (replaced with "brand-name semaglutide")
- **Legal entity:** "The Longevity Agent LLC (Utah)" in footer copyright, privacy, terms
- **Named CMO:** Dr. Amy Killen, MD on About page
- **Address + phone:** Footer, about, privacy, terms

### Remaining compliance gaps
- No product-specific disclaimers on GLP-1/TRT/HRT stack pages (global footer disclaimer only)
- Blog post `rosuvastatin-the-statin-worth-taking` references a medication no longer in catalog
- SGLT2 stack is "Waitlist" in nav but not built out — should be removed or completed

---

## 10. KNOWN ISSUES & TECH DEBT

| Issue | Severity | Notes |
|-------|----------|-------|
| Stripe keys are TEST mode | **Critical** | No live payments until new account + live keys |
| 5 stacks have placeholder Stripe price IDs | **Critical** | core-cardio, hair-men, hair-pro-men, hair-women, skin all have `price_*_placeholder` — checkout will fail for these |
| `STRIPE_PRICE_LONGEVITY_STACK` key name mismatch | High | Code uses `STRIPE_PRICE_LONGEVITY_BASE` env var; .env.local has `STRIPE_PRICE_LONGEVITY_STACK` — add alias or update |
| Provider network contract not signed | **Critical** | Can't see patients |
| Blog post `rosuvastatin-the-statin-worth-taking` | Medium | Entire post about rosuvastatin; Core Cardio now uses atorvastatin. Rewrite, redirect, or unpublish. |
| `STATUS.md` is stale | Low | Describes old supplement comparison site — ignore |
| `PLAN.md` is stale | Low | Describes original supplement site MVP plan — ignore |
| `better-sqlite3` dependency | Low | Leftover from supplement price comparison era; not actively used in current telehealth site |
| Dashboard is minimal | Medium | Shows subscription count + intake status; no medication management, no messaging |
| TRT lab billing | Medium | `TODO` comment in `src/app/api/intake/submit/route.ts` — one-time lab charge not implemented |
| Physician review queue | Medium | `la.physician_queue` table exists; no admin UI to process the queue |
| Build warning: deprecated `middleware` convention | Low | `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.` — rename `src/middleware.ts` to `src/proxy.ts` when ready |
| SGLT2 stack | Low | "Waitlist" only, shows in nav — remove or build |

---

## 11. DESIGN SYSTEM

### Color Palette (CSS variables in `src/app/globals.css`)
| Variable | Hex | Usage |
|----------|-----|-------|
| `--background` | `#050508` | Page background (near-black with blue tint) |
| `--foreground` | `#ededed` | Primary text |
| `--surface` | `#0c0c12` | Card backgrounds, footer |
| `--card` | `#1a1a24` | Card elements |
| `--card-border` | `#2a2a3a` | Borders, dividers |
| `--muted` | `#b0b0c8` | Secondary text |
| `--muted-light` | `#8080a0` | Tertiary text, fine print |
| `--accent` | `#22d3ee` | Cyan — primary brand color, CTAs, links |
| `--accent-hover` | `#06b6d4` | Accent hover state |
| `--accent-dim` | `rgba(34,211,238,0.1)` | Accent backgrounds (icon containers, etc.) |
| `--accent-glow` | `rgba(34,211,238,0.05)` | Subtle accent glow |
| `--green` | `#4ade80` | Success, savings badges |
| `--green-dim` | `rgba(74,222,128,0.1)` | Green backgrounds |
| `--danger` | `#ef4444` | Errors, HARD_STOP screens |
| `--warning` | `#f59e0b` | Warning states |

### Typography
- System font stack (Tailwind default `sans`)
- Headings: bold, `--foreground`
- Body: `--muted`
- Fine print: `--muted-light`

### Component patterns
- Cards: `bg-[var(--card)] border border-[var(--card-border)] rounded-xl`
- CTAs: `bg-[var(--accent)] text-[var(--background)] font-bold px-10 py-4 rounded-lg hover:bg-[var(--accent-hover)]`
- Section separators: `border-t border-[var(--card-border)]`
- Surface sections: `bg-[var(--surface)]`

---

## 12. SEO & LLM INTERFACE

### LLM-native architecture
This site is intentionally designed for LLM discovery:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/llm/catalog` | GET | Full product catalog as JSON |
| `/api/llm/build-stack` | POST | AI recommendation engine — accepts symptoms/goals, returns stack suggestions |
| `/api/products.json` | GET | Machine-readable products feed |
| `/llms.txt` | GET | Auto-generated site map (dynamic route) |
| `/for-llms` | GET | Human-readable LLM interface documentation |
| `/public/openapi.json` | GET | OpenAPI spec |
| `/public/.well-known/agent.json` | GET | AI agent discovery manifest |

### SEO
- Metadata defined per-page with Next.js `Metadata` type
- `src/app/sitemap.ts` generates XML sitemap automatically
- Schema markup: not yet implemented (P2 item)

---

## 13. CONTENT STATUS

### Blog Posts (14 total, in `src/lib/blog.ts`)

| Slug | Title | Status |
|------|-------|--------|
| `why-rapamycin-is-the-most-interesting-longevity-drug` | Why Rapamycin Is the Most Interesting Drug | ✅ Current |
| `ldn-the-19-drug-nobody-knows-about` | LDN: The $19 Drug Nobody Knows About | ✅ Current |
| `hrt-the-study-that-scared-a-generation` | HRT: The Study That Scared a Generation | ✅ Current |
| `rosuvastatin-the-statin-worth-taking` | Rosuvastatin: The Statin Worth Taking | ⚠️ **CONFLICTS** — Core Cardio uses atorvastatin now |
| `tadalafil-not-just-for-ed` | Tadalafil: Not Just for ED | ✅ Current |
| `finasteride-vs-dutasteride-for-hair-loss` | Finasteride vs Dutasteride | ✅ Current |
| `oral-minoxidil-for-hair-loss` | Oral Minoxidil for Hair Loss | ✅ Current |
| `tretinoin-the-gold-standard` | Tretinoin: The Gold Standard | ✅ Current |
| `metformin-longevity-drug` | Metformin as a Longevity Drug | ✅ Current |
| `acarbose-the-overlooked-longevity-drug` | Acarbose: The Overlooked Drug | ✅ Current |
| `semaglutide-for-longevity` | Semaglutide for Longevity | ✅ Current |
| `spironolactone-womens-hair-loss` | Spironolactone for Women's Hair Loss | ✅ Current |
| `sglt2-inhibitors-longevity` | SGLT2 Inhibitors and Longevity | ✅ Current |
| `enclomiphene-vs-trt` | Enclomiphene vs TRT | ✅ Current |

### Blog action needed
`rosuvastatin-the-statin-worth-taking` — rewrite for atorvastatin 20mg, redirect to `/stacks/core-cardio`, or unpublish. Currently live and indexed.

---

## 14. INTAKE FLOW

The intake form (`src/app/intake/IntakeForm.tsx`) is a multi-step React component:

1. **Gender selection** — routes to men's or women's stack set
2. **Stack selection** — multi-select from available stacks
3. **Contraindication screening** — per-stack questions defined in `STACK_CONTRAS` map
   - `HARD_STOP`: blocks checkout, shows red screen with medical referral message
   - `FLAG`: notes concern in metadata but allows checkout
4. **TRT/HRT-specific steps** — additional clinical questions for hormone stacks
5. **Personal info** — name, email, DOB, state
6. **Checkout** — calls `/api/intake/submit` → Stripe Checkout session

### Contraindication map (`STACK_CONTRAS` in IntakeForm.tsx)
- `core-cardio`: nitrates interaction (HARD_STOP), liver disease (HARD_STOP), pregnancy (HARD_STOP), low BP (FLAG), alpha-blockers (FLAG), recent stroke/MI (FLAG)
- Other stacks: similar pattern — read the file for full list

---

## 15. WEBHOOK & DATA FLOW

On successful Stripe checkout:
1. `checkout.session.completed` webhook fires → `/api/stripe/webhook`
2. Webhook finds or creates `auth.users` + `la.user_profiles` record
3. Creates `la.subscriptions` record (status: `active`)
4. Creates `la.intake_records` record (status: `pending_review`)
5. Creates `la.physician_queue` entry for provider review

Webhook also handles: `customer.subscription.deleted`, `customer.subscription.updated`, `invoice.payment_failed`

**Current gap:** No admin UI or notification system to alert a physician when `la.physician_queue` has new entries. This needs to be built before going live.

---

## 16. IMMEDIATE PRIORITIES FOR LAUNCH

### P0 — Cannot launch without these
1. **Sign provider network contract** (Arora Health or OpenLoop)
2. **Obtain live Stripe account** for The Longevity Agent LLC, seed price IDs, update Vercel env vars
3. **Physician queue notification** — build admin view or email alert when new patient submits intake
4. **Payment processor cert** — confirm Green Payment Solutions has LegitScript cert

### P1 — Should do before first patient
5. **LegitScript submission** — submit application once P0 items are complete
6. **Fix blog post conflict** — `rosuvastatin-the-statin-worth-taking`
7. **Product-specific disclaimers** — GLP-1, TRT, Women's HRT pages
8. **Pharmacy Hub agreement** — formal partnership + API integration

### P2 — Post-launch polish
9. **Schema markup** — use `/schema-markup` skill
10. **SGLT2 stack** — remove from nav or build
11. **Rename middleware.ts → proxy.ts** — fix build warning
12. **TRT lab billing** — implement one-time charge for lab panel add-on
13. **Admin dashboard** — physician review queue UI
14. **Email sequences** — Resend is configured but no sequences exist yet

---

## QUICK REFERENCE

```bash
# Dev
cd ~/longevity-stack && bun run dev

# Build check
export PATH="$HOME/.bun/bin:$PATH" && bun run build

# Deploy
git push origin main

# Check Vercel deploy status
bunx vercel ls longevity-stack

# Get failed deploy logs
bunx vercel inspect <deployment-url> --logs

# Supabase dashboard
# https://supabase.com/dashboard/project/rrxrfmywhaprjbusmqhv

# Key data files
src/lib/stacks.ts          # Primary product catalog
src/data/competitor-pricing.ts  # Competitor prices
src/lib/stripe/config.ts   # Stripe price IDs
supabase/migrations/001_initial_schema.sql  # Full DB schema
outputs/legitscript-audit-2026-04-08.md    # Compliance status
```
