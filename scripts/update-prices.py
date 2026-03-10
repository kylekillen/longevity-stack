#!/usr/bin/env python3
"""
Longevity Stack Price Updater
Fetches current prices using Playwright (headless browser) + Claude CLI for extraction.
Designed to run as a nightly cron job via launchd.

Usage:
  python3 scripts/update-prices.py                    # Full run
  python3 scripts/update-prices.py --vendor iherb     # Single vendor
  python3 scripts/update-prices.py --dry-run          # Don't write to DB
  python3 scripts/update-prices.py --limit 5          # Test with 5 URLs
"""

import sqlite3
import json
import time
import re
import argparse
import subprocess
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "longevity-stack.db"
REPORT_DIR = Path(__file__).parent.parent / "scripts" / "reports"

# Vendors to skip entirely
SKIP_VENDORS = {"amazon"}

# Seconds between page loads per vendor
VENDOR_DELAYS = {
    "iherb": 2.5,
    "thorne": 2.0,
    "life-extension": 2.0,
    "nootropics-depot": 2.0,
    "now-foods": 1.5,
    "default": 1.5,
}

# Max price change allowed without flagging (50%)
MAX_PRICE_CHANGE = 0.50

# Commit to DB every N updates (crash safety)
COMMIT_INTERVAL = 20


def fetch_pages_playwright(urls_with_meta: list[dict]) -> dict[str, dict]:
    """
    Fetch multiple URLs using Playwright + stealth (bypasses Cloudflare).
    Returns {url: {"text": ..., "html": ...}}.
    Backs off on blocks per vendor.
    """
    from playwright.sync_api import sync_playwright
    from playwright_stealth import Stealth

    results = {}
    stealth = Stealth()
    vendor_block_count: dict[str, int] = {}

    try:
        with stealth.use_sync(sync_playwright()) as pw:
            browser = pw.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={"width": 1920, "height": 1080},
                locale="en-US",
            )

            for item in urls_with_meta:
                url = item["url"]
                vendor_slug = item.get("vendor_slug", "")
                base_delay = VENDOR_DELAYS.get(vendor_slug, VENDOR_DELAYS["default"])

                # Exponential backoff if vendor is blocking us
                blocks = vendor_block_count.get(vendor_slug, 0)
                delay = base_delay * (2 ** min(blocks, 3))  # Max 8x delay

                page = context.new_page()
                try:
                    page.goto(url, wait_until="domcontentloaded", timeout=15000)
                    page.wait_for_timeout(3000)
                    text = page.evaluate("() => document.body.innerText")
                    html = page.content()
                    results[url] = {"text": text, "html": html[:30000]}
                    blocked = len(text) < 500
                    if blocked:
                        vendor_block_count[vendor_slug] = blocks + 1
                        print(f"    BLOCKED: {url[:70]}... ({len(text)} chars, backoff {delay:.1f}s)")
                    else:
                        print(f"    OK: {url[:70]}... ({len(text)} chars)")
                except Exception as e:
                    results[url] = {"text": "", "html": "", "error": str(e)}
                    print(f"    FAIL: {url[:70]}... ({e})")
                finally:
                    page.close()

                time.sleep(delay)

            browser.close()
    except Exception as e:
        print(f"  Playwright failed to start: {e}")

    return results


def extract_price_from_text(text: str) -> dict | None:
    """
    Extract price from rendered page text using patterns.
    Fast path that doesn't need Claude.
    """
    if not text or len(text) < 100:
        return None

    result = {"price": None, "in_stock": True, "subscribe_price": None}

    # Check stock status
    text_lower = text.lower()
    for phrase in ["out of stock", "sold out", "unavailable", "discontinued"]:
        if phrase in text_lower:
            result["in_stock"] = False
            break

    # Find all dollar amounts with context (to filter shipping thresholds)
    raw_prices = re.findall(r'\$(\d+(?:\.\d{1,2})?)', text)
    prices = [float(p) for p in raw_prices if 0.50 < float(p) < 500]

    if not prices:
        return None

    # Filter out prices that appear in "free shipping" context
    # Instead of hardcoded thresholds, check context around each price
    lines = text.split('\n')
    shipping_prices = set()
    for line in lines:
        line_lower = line.lower()
        if any(kw in line_lower for kw in ['shipping', 'free ship', 'delivery']):
            line_prices = re.findall(r'\$(\d+(?:\.\d{1,2})?)', line)
            for p in line_prices:
                shipping_prices.add(float(p))

    main_prices = [p for p in prices if p not in shipping_prices]
    result["price"] = main_prices[0] if main_prices else prices[0]

    # Look for subscribe/autoship price
    sub_match = re.search(
        r'(?:subscribe|autoship|auto.?ship)[^\$]*\$(\d+(?:\.\d{1,2})?)',
        text, re.IGNORECASE
    )
    if sub_match:
        sub_price = float(sub_match.group(1))
        if 0.50 < sub_price < result["price"]:
            result["subscribe_price"] = sub_price

    return result


def extract_prices_with_claude(pages: list[dict]) -> list[dict]:
    """
    Use Claude CLI (Haiku) to extract prices from page text in batches.
    Returns list of {url, price, in_stock, subscribe_price}.
    Only works when NOT inside a Claude Code session.
    """
    BATCH_SIZE = 10
    all_results = []

    for i in range(0, len(pages), BATCH_SIZE):
        batch = pages[i:i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        total_batches = (len(pages) + BATCH_SIZE - 1) // BATCH_SIZE
        print(f"    Claude batch {batch_num}/{total_batches} ({len(batch)} pages)")

        # Build prompt
        prompt_parts = [
            "Extract the current retail price from each product page below.",
            "Return ONLY a JSON array (no explanation, no markdown fences).",
            'Each element: {"url": "...", "price": 29.99, "in_stock": true, "subscribe_price": null}',
            "Rules:",
            "- price: current selling price in USD as a number",
            "- in_stock: false only if page explicitly says out of stock/sold out/unavailable",
            "- subscribe_price: subscribe-and-save price if visible, else null",
            "- If you cannot determine the price, set price to null",
            ""
        ]

        for j, page in enumerate(batch):
            text = page.get("text", "")[:3000]
            prompt_parts.append(f"--- PAGE {j+1}: {page['product_name']} ({page['url']}) ---")
            prompt_parts.append(text)
            prompt_parts.append("")

        prompt = "\n".join(prompt_parts)

        try:
            # Read prompt via stdin to avoid argument length limits
            # Unset CLAUDECODE env var to allow nested invocation from cron
            env = dict(__import__('os').environ)
            env.pop("CLAUDECODE", None)
            env.pop("CLAUDE_CODE_SESSION", None)

            result = subprocess.run(
                ["claude", "-p", prompt, "--output-format", "text", "--model", "haiku"],
                capture_output=True, text=True, timeout=60,
                env=env
            )

            if result.returncode == 0 and result.stdout.strip():
                output = result.stdout.strip()
                json_match = re.search(r'\[.*\]', output, re.DOTALL)
                if json_match:
                    batch_results = json.loads(json_match.group())
                    all_results.extend(batch_results)
                else:
                    print(f"      No JSON array found in Claude output")
            else:
                print(f"      Claude failed: {result.stderr[:200]}")
        except json.JSONDecodeError as e:
            print(f"      JSON parse error: {e}")
        except Exception as e:
            print(f"      Claude error: {e}")

        time.sleep(1)

    return all_results


def run_update(args):
    """Main update loop."""
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    db = sqlite3.connect(str(DB_PATH))
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA journal_mode = WAL")

    try:
        # Get all prices with product and vendor info
        query = """
            SELECT pr.id as price_id, pr.price as old_price, pr.url,
                   p.name as product_name, p.slug as product_slug,
                   v.slug as vendor_slug, v.name as vendor_name
            FROM prices pr
            JOIN products p ON p.id = pr.product_id
            JOIN vendors v ON v.id = pr.vendor_id
            WHERE v.active = 1
        """
        params = []
        if args.vendor:
            query += " AND v.slug = ?"
            params.append(args.vendor)

        query += " ORDER BY v.slug, p.name"
        rows = db.execute(query, params).fetchall()

        # Filter out skipped vendors
        if not args.vendor:
            rows = [r for r in rows if r["vendor_slug"] not in SKIP_VENDORS]

        if args.limit:
            rows = rows[:args.limit]

        total = len(rows)
        print(f"[{datetime.now().isoformat()}] Starting price update: {total} URLs")

        # Phase 1: Fetch all pages with Playwright
        print(f"\n  Phase 1: Fetching {total} pages with Playwright...")
        # Deduplicate URLs (multiple products may share a URL)
        seen_urls = set()
        unique_urls_meta = []
        for r in rows:
            if r["url"] not in seen_urls:
                seen_urls.add(r["url"])
                unique_urls_meta.append({"url": r["url"], "vendor_slug": r["vendor_slug"]})

        fetched = fetch_pages_playwright(unique_urls_meta)
        fetched_count = sum(1 for v in fetched.values() if v.get("text") and len(v["text"]) > 100)
        print(f"  Fetched: {fetched_count}/{len(unique_urls_meta)} unique pages")

        # Phase 2: Extract prices — regex first, Claude fallback
        price_by_url = {}
        pages_needing_claude = []

        for url, data in fetched.items():
            text = data.get("text", "")
            if not text or len(text) < 100:
                continue

            extracted = extract_price_from_text(text)
            if extracted and extracted["price"] is not None:
                price_by_url[url] = {
                    "url": url, "price": extracted["price"],
                    "in_stock": extracted["in_stock"],
                    "subscribe_price": extracted["subscribe_price"],
                    "method": "regex",
                }
            else:
                # Find any row that matches this URL for the product name
                row = next((r for r in rows if r["url"] == url), None)
                if row:
                    pages_needing_claude.append({
                        "url": url,
                        "product_name": row["product_name"],
                        "text": text,
                    })

        regex_count = len(price_by_url)
        print(f"\n  Phase 2a: Regex extracted {regex_count} prices")

        if pages_needing_claude:
            print(f"  Phase 2b: Claude fallback for {len(pages_needing_claude)} pages...")
            claude_results = extract_prices_with_claude(pages_needing_claude)
            for item in claude_results:
                if item.get("url") and item.get("price") is not None:
                    item["method"] = "claude"
                    price_by_url[item["url"]] = item

        print(f"  Total extracted: {len(price_by_url)}/{fetched_count} prices ({regex_count} regex, {len(price_by_url) - regex_count} claude)")

        # Phase 3: Update database
        print(f"\n  Phase 3: Updating database...")
        results = {"updated": 0, "unchanged": 0, "failed": 0, "skipped": 0, "oos": 0}
        changes = []
        failures = []
        updates_since_commit = 0

        for row in rows:
            url = row["url"]
            product_name = row["product_name"]
            old_price = row["old_price"]

            if url not in fetched or not fetched[url].get("text") or len(fetched[url].get("text", "")) < 100:
                results["failed"] += 1
                failures.append({"product": product_name, "vendor": row["vendor_slug"], "url": url, "reason": "fetch_failed"})
                continue

            if url not in price_by_url:
                results["failed"] += 1
                failures.append({"product": product_name, "vendor": row["vendor_slug"], "url": url, "reason": "extraction_failed"})
                continue

            extracted_data = price_by_url[url]
            new_price = float(extracted_data["price"])
            in_stock = 1 if extracted_data.get("in_stock", True) else 0
            sub_price = extracted_data.get("subscribe_price")

            if not in_stock:
                results["oos"] += 1

            # Sanity: reject wild price swings
            if old_price and old_price > 0 and abs(new_price - old_price) / old_price > MAX_PRICE_CHANGE:
                results["skipped"] += 1
                failures.append({
                    "product": product_name, "vendor": row["vendor_slug"],
                    "old_price": old_price, "new_price": new_price,
                    "reason": "wild_swing"
                })
                old_str = f"${old_price:.2f}" if old_price else "N/A"
                print(f"    SKIP: {product_name} {old_str} -> ${new_price:.2f} (>50% change)")
                continue

            now = datetime.now(timezone.utc).isoformat()
            price_changed = old_price is None or abs(new_price - old_price) > 0.005
            old_str = f"${old_price:.2f}" if old_price else "N/A"

            if price_changed:
                changes.append({
                    "product": product_name, "vendor": row["vendor_slug"],
                    "old": old_price, "new": new_price
                })

            if not args.dry_run:
                if price_changed:
                    db.execute("""
                        UPDATE prices SET price = ?, in_stock = ?, subscribe_price = ?,
                            last_checked = ?, last_changed = ?
                        WHERE id = ?
                    """, (new_price, in_stock, sub_price, now, now, row["price_id"]))
                    results["updated"] += 1
                    print(f"    UPDATE: {product_name} {old_str} -> ${new_price:.2f}")
                else:
                    db.execute("""
                        UPDATE prices SET in_stock = ?, last_checked = ?
                        WHERE id = ?
                    """, (in_stock, now, row["price_id"]))
                    results["unchanged"] += 1

                updates_since_commit += 1
                if updates_since_commit >= COMMIT_INTERVAL:
                    db.commit()
                    updates_since_commit = 0
            else:
                status = "WOULD UPDATE" if price_changed else "UNCHANGED"
                print(f"    {status}: {product_name} {old_str} -> ${new_price:.2f}")
                if price_changed:
                    results["updated"] += 1
                else:
                    results["unchanged"] += 1

        if not args.dry_run:
            db.commit()

    finally:
        db.close()

    # Write report
    report = {
        "timestamp": datetime.now().isoformat(),
        "total_urls": total,
        "fetched": fetched_count,
        "extracted": len(price_by_url),
        "results": results,
        "changes": changes,
        "failures": failures[:50],
    }

    report_path = REPORT_DIR / f"{datetime.now().strftime('%Y-%m-%d')}-prices.json"
    report_path.write_text(json.dumps(report, indent=2))

    print(f"\n{'='*50}")
    print(f"Results: {json.dumps(results, indent=2)}")
    print(f"Report: {report_path}")

    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update supplement prices")
    parser.add_argument("--vendor", help="Only update one vendor")
    parser.add_argument("--limit", type=int, help="Limit number of URLs to process")
    parser.add_argument("--dry-run", action="store_true", help="Don't write to DB")
    args = parser.parse_args()

    run_update(args)
