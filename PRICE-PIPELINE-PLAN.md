# Price Update Pipeline — Implementation Plan

**Created**: 2026-03-09
**Status**: Planning

---

## Current State

The site uses **better-sqlite3** with a local file at `data/longevity-stack.db`. All data is seeded from `src/lib/seed.ts` on first run (idempotent — skips if vendors exist). The database contains:

- **16 vendors** (each with a `feed_type`: api/csv/manual)
- **135 products** across 43 ingredients
- **177 price records** with product URLs pointing to vendor product pages
- All `last_checked` timestamps are `2026-03-09 16:47:05` (seed time)
- No `price_history` column exists yet (the PLAN.md schema mentions it but the SQLite schema omits it)

Prices are currently **hardcoded in seed.ts** — there is no update mechanism.

---

## What Needs Updating

### Target Table: `prices`

| Column | Update Action |
|--------|--------------|
| `price` | Crawl vendor page, extract current price |
| `in_stock` | Check availability on page |
| `subscribe_price` | Extract subscribe-and-save price if visible |
| `last_checked` | Set to current timestamp on every crawl |
| `last_changed` | Set to current timestamp only when price differs |

### Schema Addition Needed

```sql
ALTER TABLE prices ADD COLUMN price_history TEXT DEFAULT '[]';
```

This stores a JSON array of `[{date, price}]` entries (last 90 days). Updated whenever `price` changes.

---

## URLs to Crawl

177 product URLs across 16 vendors. Breakdown by vendor:

| Vendor | URLs | Feed Type | Crawl Strategy |
|--------|------|-----------|---------------|
| iHerb | 37 | api | Firecrawl (no API access yet) |
| Life Extension | 25 | api | Firecrawl (no API access yet) |
| NOW Foods | 20 | csv | Firecrawl |
| Amazon | 19 | api | Firecrawl (PA-API requires approval + sales volume) |
| Thorne | 17 | api | Firecrawl |
| Nootropics Depot | 15 | manual | Firecrawl |
| Jarrow | 11 | csv | Firecrawl |
| Nutricost | 9 | csv | Firecrawl |
| Bulk Supplements | 7 | csv | Firecrawl |
| Momentous | 7 | csv | Firecrawl |
| Garden of Life | 3 | csv | Firecrawl |
| Pure Encapsulations | 3 | csv | Firecrawl |
| Others (4 vendors) | 4 | csv | Firecrawl |

**Reality check**: The `feed_type` values (api, csv) are aspirational from the seed data. No affiliate feeds are connected yet (programs are still in signup). **All 177 URLs will use Firecrawl for v1.**

---

## Proposed Architecture

### Option Analysis

| Approach | Pros | Cons |
|----------|------|------|
| **GitHub Actions cron** | Free (2000 min/mo), runs nightly, commits updated DB | DB committed to repo, build triggered automatically |
| **Local launchd cron** | Full control, no limits | Requires Kyle's machine running |
| **Vercel cron** | Integrated with deploy | Can't write to SQLite (read-only filesystem) |
| **Standalone script + Vercel rebuild** | Decoupled, flexible | Extra step to trigger rebuild |

### Recommended: GitHub Actions Cron

**Why**: The site uses SQLite bundled at build time (better-sqlite3 reads from `data/longevity-stack.db`). Vercel's filesystem is read-only at runtime. The database must be updated *before* build, then the build bakes it in. GitHub Actions is the natural fit:

1. Cron runs nightly at 2 AM MT (8 AM UTC)
2. Checks out repo
3. Runs Python price-crawl script (Firecrawl)
4. Updates `data/longevity-stack.db` in place
5. Commits + pushes if prices changed
6. Push triggers Vercel auto-deploy with fresh data

**Fallback**: If GitHub Actions minutes become a concern, the same script runs locally via `launchd` and pushes to the repo.

---

## Pipeline Design

### Components

```
scripts/
  update-prices.py          # Main orchestrator
  extractors/
    __init__.py
    base.py                 # Base extractor with Firecrawl + LLM parse
    iherb.py                # iHerb-specific selectors (optional overrides)
    amazon.py               # Amazon-specific handling
    thorne.py               # etc.
  requirements.txt          # firecrawl-py, better-sqlite3 (or sqlite3 stdlib)
.github/
  workflows/
    update-prices.yml       # Nightly cron
```

### Flow

```
1. Read all rows from `prices` table (with product name, vendor slug, URL)
2. Group by vendor (to batch requests, respect rate limits)
3. For each URL:
   a. Call Firecrawl scrape(url) → get markdown/HTML
   b. Extract price using LLM (Claude Haiku) or regex patterns
   c. Extract in_stock status
   d. Extract subscribe_price if present
4. Compare extracted price to stored price
5. If changed:
   - Update price, last_checked, last_changed
   - Append to price_history JSON
6. If unchanged:
   - Update last_checked only
7. Log results: updated/unchanged/failed/blocked
8. Write staleness report (any URL not checked in >48h)
```

### Price Extraction Strategy

**Primary: LLM extraction** (most reliable across different page layouts)
- Firecrawl returns clean markdown of the page
- Send markdown to Claude Haiku with prompt: "Extract the product price, stock status, and subscribe-and-save price from this page. Return JSON."
- Cost: ~$0.01 per page × 177 pages = ~$1.77/night

**Fallback: Regex patterns** (for known vendor formats)
- Each vendor can have optional regex overrides for when LLM is unavailable
- e.g., iHerb prices are in `$XX.XX` near specific HTML classes

**Amazon special handling**:
- Amazon pages are heavily JS-rendered; Firecrawl may struggle
- Consider skipping Amazon initially (it's the lowest-trust, lowest-commission vendor)
- Or use Firecrawl's `waitFor` parameter to let JS render

### Rate Limiting

- Firecrawl: 500 credits/mo on Starter ($19), 3000 on Standard ($49)
- 177 URLs × 30 nights = 5,310 crawls/month → **Standard plan needed**
- Batch by vendor with 2-second delays between requests
- If Firecrawl blocks: fall back to direct fetch + BeautifulSoup for simple sites

---

## SQLite-on-Vercel Limitation

This is the key architectural constraint. Vercel serverless functions have a **read-only filesystem**. The current setup works because:

1. `data/longevity-stack.db` is committed to the repo
2. `next build` runs `seed.ts` which creates/reads the DB at build time
3. At runtime, the DB file is baked into the deployment

**The price pipeline updates the DB file in the repo, then Vercel rebuilds with fresh data.**

This is fine for nightly updates. For real-time prices (Phase 2), you'd need to migrate to:
- Turso (SQLite-compatible, edge-hosted) — easiest migration path
- Supabase/Postgres — as originally planned in PLAN.md
- Vercel KV/Blob — for price data only

**For now, the GitHub Actions approach is correct.** The DB is small (~237KB) and nightly commits are perfectly reasonable.

---

## Staleness Handling

Add a simple staleness check to the site:

```typescript
// In queries.ts — add a function
export function getStalePrices(hoursThreshold: number = 48): Price[] {
  const db = getDb();
  return db.prepare(`
    SELECT pr.*, p.name as product_name, v.name as vendor_name
    FROM prices pr
    JOIN products p ON p.id = pr.product_id
    JOIN vendors v ON v.id = pr.vendor_id
    WHERE datetime(pr.last_checked) < datetime('now', '-' || ? || ' hours')
  `).all(hoursThreshold);
}
```

The nightly pipeline should also output a staleness report as a JSON artifact in GitHub Actions, so failures are visible.

---

## Error Handling

| Failure Mode | Response |
|-------------|----------|
| Firecrawl returns empty/blocked | Log as failed, keep existing price, retry next night |
| Price extracted is wildly different (>50% change) | Flag for manual review, don't auto-update |
| Vendor page restructured | LLM extraction usually handles this; log if extraction fails 3 nights in a row |
| Firecrawl quota exhausted | Stop crawling, send alert, existing prices remain |
| GitHub Actions fails | Vercel deployment uses last successful DB |

---

## Environment / Secrets

GitHub Actions secrets needed:
- `FIRECRAWL_API_KEY` — for web scraping
- `ANTHROPIC_API_KEY` — for LLM price extraction (Haiku, ~$1.77/night)

The Firecrawl SDK is already installed at `~/.claude/tools-venv/` for local testing.

---

## Implementation Steps (Estimated Effort)

| Step | Description | Effort |
|------|-------------|--------|
| 1 | Add `price_history` column to schema in `db.ts` + migration script | 30 min |
| 2 | Write base Firecrawl extractor with LLM price parsing | 2 hours |
| 3 | Write `update-prices.py` orchestrator (read DB, crawl, update) | 2 hours |
| 4 | Test against 5-10 URLs from different vendors, validate extraction | 1 hour |
| 5 | Write GitHub Actions workflow with cron schedule | 30 min |
| 6 | Add staleness query + optional UI indicator | 30 min |
| 7 | End-to-end test: run pipeline, verify DB updates, trigger Vercel build | 1 hour |

**Total estimated effort: ~8 hours**

---

## Open Questions

1. **Firecrawl plan**: Currently on what tier? The Standard plan ($49/mo, 3000 credits) covers 177 URLs nightly. Confirm this is budgeted.
2. **Amazon**: Worth crawling given low trust score and JS-heavy pages? Could skip initially and focus on the 158 non-Amazon URLs.
3. **LLM cost tolerance**: Haiku extraction at ~$1.77/night (~$53/month) is cheap but not free. Alternative: regex-only extraction for known vendors (saves money, less robust).
4. **Notification on failures**: Telegram alert when >10% of URLs fail extraction? Or just log to GitHub Actions?
5. **seed.ts relationship**: After the pipeline runs, the hardcoded prices in seed.ts become stale. Should seed.ts be regenerated from the DB, or should seeding be skipped entirely once the DB exists? (Current code already skips if vendors exist.)
