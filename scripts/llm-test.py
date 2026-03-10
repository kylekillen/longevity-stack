#!/usr/bin/env python3
"""
LLM Agent Test Harness for The Longevity Agent
Simulates real LLM users: fetches /prices, runs test prompts, evaluates responses.
Feeds failures back to an optimization loop.

Usage:
  python3 scripts/llm-test.py                    # Run all tests
  python3 scripts/llm-test.py --test 2           # Run single test
  python3 scripts/llm-test.py --fix              # Run tests + generate fix suggestions
  python3 scripts/llm-test.py --model sonnet     # Use specific model
  python3 scripts/llm-test.py --url http://localhost:3000  # Test local dev server
"""

import subprocess
import json
import re
import argparse
import sys
from datetime import datetime
from pathlib import Path

REPORT_DIR = Path(__file__).parent / "reports"
SITE_URL = "https://thelongevityagent.com"

# ── Test cases ────────────────────────────────────────────────────
# Each test simulates a real user prompt that an LLM would handle.
# `checks` are automated validators run against the LLM's response.

TESTS = [
    {
        "id": 1,
        "name": "NAD+ recommendation with trust filter",
        "prompt": "Best NAD+ supplement from a vendor with trust 7+?",
        "checks": [
            {"type": "contains_any", "values": ["nmn", "nad", "nr", "nicotinamide"], "label": "Mentions NAD+/NMN/NR products"},
            {"type": "contains_any", "values": ["/cart?items=", "cart?items="], "label": "Includes a cart URL"},
            {"type": "slug_valid", "label": "Cart URL uses valid product slugs"},
            {"type": "contains_any", "values": ["trust", "score", "7", "8", "9", "10"], "label": "References vendor trust scores"},
            {"type": "contains_any", "values": ["tmg", "methyl"], "label": "Mentions TMG pairing rule (NR/NMN should be paired with TMG)"},
            {"type": "contains_any", "values": ["$/serving", "per serving", "cost per", "/serving"], "label": "Compares by $/serving not sticker price"},
            {"type": "cart_url_works", "label": "Cart URL returns HTTP 200"},
        ],
    },
    {
        "id": 2,
        "name": "Foundation stack builder",
        "prompt": "Build me a basic longevity foundation stack under $80/month. I want the essentials.",
        "checks": [
            {"type": "contains_any", "values": ["/cart?items=", "cart?items="], "label": "Includes a cart URL"},
            {"type": "slug_valid", "label": "Cart URL uses valid product slugs"},
            {"type": "contains_all", "values": ["d3", "omega"], "label": "Includes D3 and Omega-3 (foundation essentials)"},
            {"type": "contains_any", "values": ["k2", "K2"], "label": "Pairs D3 with K2 (mandatory interaction rule)"},
            {"type": "contains_any", "values": ["$", "cost", "price", "total", "month"], "label": "Shows pricing or monthly cost estimate"},
            {"type": "cart_has_multiple", "min_items": 3, "label": "Cart has 3+ items (it's a stack)"},
            {"type": "cart_url_works", "label": "Cart URL returns HTTP 200"},
        ],
    },
    {
        "id": 3,
        "name": "Drug interaction awareness",
        "prompt": "I take warfarin and want to improve my energy and joint health. What supplements should I take?",
        "checks": [
            {"type": "contains_any", "values": ["/cart?items=", "cart?items="], "label": "Includes a cart URL"},
            {"type": "slug_valid", "label": "Cart URL uses valid product slugs"},
            {"type": "not_contains", "values": ["k2-"], "label": "Does NOT recommend K2 (contraindicated with warfarin)"},
            {"type": "contains_any", "values": ["warfarin", "contraindicated", "avoid", "caution", "blood thinner", "anticoagulant"], "label": "Warns about warfarin interactions"},
            {"type": "contains_any", "values": ["omega", "bleed", "risk"], "label": "Flags omega-3 bleeding risk with anticoagulants"},
            {"type": "contains_any", "values": ["doctor", "physician", "healthcare", "medical", "consult"], "label": "Recommends consulting a doctor"},
            {"type": "cart_url_works", "label": "Cart URL returns HTTP 200"},
        ],
    },
    {
        "id": 4,
        "name": "Cheapest creatine comparison",
        "prompt": "What's the cheapest creatine per serving across all your vendors?",
        "checks": [
            {"type": "contains_any", "values": ["creatine"], "label": "Discusses creatine products"},
            {"type": "contains_any", "values": ["$/serving", "per serving", "cost per", "per dose"], "label": "Compares by $/serving"},
            {"type": "contains_any", "values": ["/cart?items=", "cart?items="], "label": "Includes a cart URL"},
            {"type": "slug_valid", "label": "Cart URL uses valid product slugs"},
            {"type": "contains_any", "values": ["$0.", "$1."], "label": "Shows actual per-serving prices"},
            {"type": "mentions_multiple_vendors", "min_vendors": 2, "label": "Compares across 2+ vendors"},
            {"type": "cart_url_works", "label": "Cart URL returns HTTP 200"},
        ],
    },
    {
        "id": 5,
        "name": "Cognitive stack with protocol awareness",
        "prompt": "I want to optimize cognitive function. Build me a nootropic stack based on what you have.",
        "checks": [
            {"type": "contains_any", "values": ["/cart?items=", "cart?items="], "label": "Includes a cart URL"},
            {"type": "slug_valid", "label": "Cart URL uses valid product slugs"},
            {"type": "cart_has_multiple", "min_items": 2, "label": "Cart has 2+ items"},
            {"type": "contains_any", "values": ["lion", "alpha-gpc", "creatine", "omega", "bacopa", "phosphatidylserine"], "label": "Includes known nootropic supplements"},
            {"type": "contains_any", "values": ["$/serving", "per serving", "total", "month", "$"], "label": "Shows pricing"},
            {"type": "cart_url_works", "label": "Cart URL returns HTTP 200"},
        ],
    },
    {
        "id": 6,
        "name": "Senolytic protocol timing",
        "prompt": "I want to try a senolytic protocol. What should I take and how often?",
        "checks": [
            {"type": "contains_any", "values": ["quercetin", "fisetin"], "label": "Mentions quercetin or fisetin"},
            {"type": "contains_any", "values": ["intermittent", "2 days", "monthly", "not daily"], "label": "Specifies intermittent dosing (not daily)"},
            {"type": "contains_any", "values": ["/cart?items=", "cart?items="], "label": "Includes a cart URL"},
            {"type": "slug_valid", "label": "Cart URL uses valid product slugs"},
            {"type": "contains_any", "values": ["CYP3A4", "statin", "interaction", "caution"], "label": "Flags quercetin drug interactions"},
            {"type": "cart_url_works", "label": "Cart URL returns HTTP 200"},
        ],
    },
]

KNOWN_VENDORS = ["iherb", "thorne", "life-extension", "nootropics-depot", "now-foods",
                 "nutricost", "bulk-supplements", "nordic-naturals", "renue-by-science", "amazon"]


def fetch_for_llms_page(base_url: str) -> str:
    """Fetch the /prices page text using curl."""
    url = f"{base_url}/prices"
    try:
        result = subprocess.run(
            ["curl", "-s", "-L", "--max-time", "15", url],
            capture_output=True, text=True, timeout=20
        )
        if result.returncode == 0 and len(result.stdout) > 500:
            return result.stdout
        else:
            print(f"  WARNING: /prices returned {len(result.stdout)} chars")
            return result.stdout
    except Exception as e:
        print(f"  ERROR fetching {url}: {e}")
        return ""


def extract_slugs_from_page(html: str) -> set:
    """Extract valid product slugs from the /prices page HTML."""
    # Slugs appear in monospace <td> tags with text-[var(--accent)]
    # Also match plain text slugs in code blocks
    slugs = set()
    # Match slugs in table cells (font-mono class)
    for match in re.findall(r'class="[^"]*font-mono[^"]*"[^>]*>([a-z0-9][\w-]+)</td', html):
        slugs.add(match)
    # Also grab from cart URL examples
    for match in re.findall(r'items=([a-z0-9][\w,-]+)', html):
        for slug in match.split(','):
            slugs.add(slug)
    return slugs


def extract_cart_slugs(response: str) -> list[str]:
    """Extract product slugs from cart URLs in the LLM response."""
    cart_urls = re.findall(r'(?:cart\?items=|/cart\?items=)([\w,-]+)', response)
    slugs = []
    for match in cart_urls:
        slugs.extend(match.split(','))
    return slugs


def run_check(check: dict, response: str, valid_slugs: set) -> dict:
    """Run a single check against the LLM response. Returns {passed, label, detail}."""
    resp_lower = response.lower()
    ctype = check["type"]
    result = {"label": check["label"], "passed": False, "detail": ""}

    if ctype == "contains_any":
        found = [v for v in check["values"] if v.lower() in resp_lower]
        result["passed"] = len(found) > 0
        result["detail"] = f"Found: {found}" if found else f"None of {check['values']} found"

    elif ctype == "contains_all":
        missing = [v for v in check["values"] if v.lower() not in resp_lower]
        result["passed"] = len(missing) == 0
        result["detail"] = f"Missing: {missing}" if missing else "All found"

    elif ctype == "not_contains":
        found = [v for v in check["values"] if v.lower() in resp_lower]
        result["passed"] = len(found) == 0
        result["detail"] = f"FOUND (should be absent): {found}" if found else "Correctly absent"

    elif ctype == "slug_valid":
        cart_slugs = extract_cart_slugs(response)
        if not cart_slugs:
            result["detail"] = "No cart URL found to validate"
            result["passed"] = False
        else:
            invalid = [s for s in cart_slugs if s and s not in valid_slugs]
            result["passed"] = len(invalid) == 0
            if invalid:
                result["detail"] = f"Invalid slugs: {invalid}"
            else:
                result["detail"] = f"All {len(cart_slugs)} slugs valid"

    elif ctype == "cart_has_multiple":
        cart_slugs = extract_cart_slugs(response)
        min_items = check.get("min_items", 2)
        result["passed"] = len(cart_slugs) >= min_items
        result["detail"] = f"{len(cart_slugs)} items (need {min_items}+)"

    elif ctype == "mentions_multiple_vendors":
        min_v = check.get("min_vendors", 2)
        found_vendors = [v for v in KNOWN_VENDORS if v.lower().replace("-", " ") in resp_lower or v.lower() in resp_lower]
        result["passed"] = len(found_vendors) >= min_v
        result["detail"] = f"Vendors mentioned: {found_vendors}"

    elif ctype == "cart_url_works":
        cart_urls = re.findall(r'(?:https?://thelongevityagent\.com)?/cart\?items=[^\s\)\"]+', response)
        if not cart_urls:
            result["passed"] = False
            result["detail"] = "No cart URL found to test"
        else:
            url = cart_urls[0]
            if not url.startswith("http"):
                url = f"https://thelongevityagent.com{url}"
            try:
                http_result = subprocess.run(
                    ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-L", "--max-time", "10", url],
                    capture_output=True, text=True, timeout=15
                )
                status = http_result.stdout.strip()
                result["passed"] = status == "200"
                result["detail"] = f"HTTP {status} for {url[:80]}"
            except Exception as e:
                result["passed"] = False
                result["detail"] = f"Request failed: {e}"

    return result


def run_llm_test(test: dict, page_content: str, valid_slugs: set, model: str) -> dict:
    """Send the /prices page + test prompt to Claude, evaluate response."""
    print(f"\n{'='*60}")
    print(f"Test {test['id']}: {test['name']}")
    print(f"Prompt: \"{test['prompt']}\"")
    print(f"{'='*60}")

    # Build the system context — this simulates what a real user does:
    # paste the /prices URL into their AI chat
    system_prompt = (
        "You are an AI assistant helping a user find supplements. "
        "The user has shared the following page with you from The Longevity Agent "
        "(thelongevityagent.com), a supplement price comparison site. "
        "Use ONLY the data from this page to answer. "
        "Always include a cart URL (https://thelongevityagent.com/cart?items=SLUG1,SLUG2) "
        "using exact product slugs from the page.\n\n"
        "--- PAGE CONTENT ---\n"
    )

    # Strip HTML tags to get text content (simulates what an LLM sees when fetching a URL)
    text_content = re.sub(r'<script[^>]*>.*?</script>', '', page_content, flags=re.DOTALL)
    text_content = re.sub(r'<style[^>]*>.*?</style>', '', text_content, flags=re.DOTALL)
    text_content = re.sub(r'<[^>]+>', ' ', text_content)
    text_content = re.sub(r'\s+', ' ', text_content).strip()

    # Truncate if huge (LLMs have context limits)
    if len(text_content) > 80000:
        text_content = text_content[:80000] + "\n[TRUNCATED]"

    full_prompt = system_prompt + text_content + "\n\n--- USER QUESTION ---\n" + test["prompt"]

    # Call Claude CLI
    env = dict(__import__('os').environ)
    env.pop("CLAUDECODE", None)
    env.pop("CLAUDE_CODE_SESSION", None)

    try:
        result = subprocess.run(
            ["claude", "-p", full_prompt, "--output-format", "text", "--model", model],
            capture_output=True, text=True, timeout=120, env=env
        )
        if result.returncode != 0:
            print(f"  Claude failed: {result.stderr[:300]}")
            return {"test_id": test["id"], "name": test["name"], "error": result.stderr[:300],
                    "passed": 0, "failed": len(test["checks"]), "checks": []}

        response = result.stdout.strip()
    except subprocess.TimeoutExpired:
        print("  Claude timed out (120s)")
        return {"test_id": test["id"], "name": test["name"], "error": "timeout",
                "passed": 0, "failed": len(test["checks"]), "checks": []}
    except FileNotFoundError:
        print("  ERROR: 'claude' CLI not found. Install Claude Code first.")
        sys.exit(1)

    # Run all checks
    check_results = []
    for check in test["checks"]:
        cr = run_check(check, response, valid_slugs)
        status = "PASS" if cr["passed"] else "FAIL"
        print(f"  [{status}] {cr['label']}: {cr['detail']}")
        check_results.append(cr)

    passed = sum(1 for c in check_results if c["passed"])
    failed = sum(1 for c in check_results if not c["passed"])

    return {
        "test_id": test["id"],
        "name": test["name"],
        "passed": passed,
        "failed": failed,
        "total": len(check_results),
        "checks": check_results,
        "response_preview": response[:500],
        "response_full": response,
    }


def generate_fix_suggestions(results: list[dict], page_content: str, model: str) -> str:
    """Feed failures to an LLM and get suggestions for improving /prices page."""
    failures = []
    for r in results:
        for check in r.get("checks", []):
            if not check["passed"]:
                failures.append({
                    "test": r["name"],
                    "check": check["label"],
                    "detail": check["detail"],
                    "response_preview": r.get("response_preview", "")[:200],
                })

    if not failures:
        return "All tests passed! No fixes needed."

    prompt = (
        "You are an expert in LLM-optimized web content. "
        "The Longevity Agent (thelongevityagent.com) has a /prices page designed to help "
        "AI assistants recommend supplements and build cart URLs.\n\n"
        "The following automated tests FAILED when an LLM was given the page content and user prompts:\n\n"
    )

    for f in failures:
        prompt += f"- Test: {f['test']}\n  Failed check: {f['check']}\n  Detail: {f['detail']}\n  LLM said: {f['response_preview']}\n\n"

    prompt += (
        "Based on these failures, suggest SPECIFIC changes to the /prices page content "
        "that would help LLMs pass these tests. Focus on:\n"
        "1. What information is missing or unclear?\n"
        "2. What should be made more prominent?\n"
        "3. What instructions should be added or reworded?\n\n"
        "Be specific — reference exact sections, wording changes, or new content blocks. "
        "Keep suggestions concise and actionable."
    )

    env = dict(__import__('os').environ)
    env.pop("CLAUDECODE", None)
    env.pop("CLAUDE_CODE_SESSION", None)

    try:
        result = subprocess.run(
            ["claude", "-p", prompt, "--output-format", "text", "--model", model],
            capture_output=True, text=True, timeout=120, env=env
        )
        if result.returncode == 0:
            return result.stdout.strip()
        return f"Fix generation failed: {result.stderr[:300]}"
    except Exception as e:
        return f"Fix generation error: {e}"


def main():
    parser = argparse.ArgumentParser(description="LLM Agent Test Harness")
    parser.add_argument("--test", type=int, help="Run single test by ID")
    parser.add_argument("--fix", action="store_true", help="Generate fix suggestions for failures")
    parser.add_argument("--model", default="haiku", help="Claude model to use (default: haiku)")
    parser.add_argument("--url", default=SITE_URL, help="Base URL to test against")
    parser.add_argument("--loops", type=int, default=1, help="Number of test-fix-retest loops")
    args = parser.parse_args()

    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Fetching {args.url}/prices ...")
    page_html = fetch_for_llms_page(args.url)
    if not page_html:
        print("ERROR: Could not fetch /prices page")
        sys.exit(1)
    print(f"  Got {len(page_html)} chars")

    # Extract valid slugs from the page
    valid_slugs = extract_slugs_from_page(page_html)
    print(f"  Extracted {len(valid_slugs)} valid product slugs")

    if len(valid_slugs) < 10:
        print("  WARNING: Very few slugs extracted — page may not be rendering properly")

    # Select tests
    tests_to_run = TESTS
    if args.test:
        tests_to_run = [t for t in TESTS if t["id"] == args.test]
        if not tests_to_run:
            print(f"ERROR: No test with ID {args.test}")
            sys.exit(1)

    for loop_num in range(args.loops):
        if args.loops > 1:
            print(f"\n{'#'*60}")
            print(f"# LOOP {loop_num + 1}/{args.loops}")
            print(f"{'#'*60}")

        # Run tests
        results = []
        for test in tests_to_run:
            result = run_llm_test(test, page_html, valid_slugs, args.model)
            results.append(result)

        # Summary
        total_passed = sum(r["passed"] for r in results)
        total_failed = sum(r["failed"] for r in results)
        total_checks = total_passed + total_failed

        print(f"\n{'='*60}")
        print(f"SUMMARY: {total_passed}/{total_checks} checks passed ({total_failed} failed)")
        print(f"{'='*60}")

        for r in results:
            status = "PASS" if r["failed"] == 0 else "FAIL"
            print(f"  [{status}] Test {r['test_id']}: {r['name']} ({r['passed']}/{r['total']})")

        # Write report
        report = {
            "timestamp": datetime.now().isoformat(),
            "url": args.url,
            "model": args.model,
            "loop": loop_num + 1,
            "summary": {"passed": total_passed, "failed": total_failed, "total": total_checks},
            "results": [{k: v for k, v in r.items() if k != "response_full"} for r in results],
        }
        report_path = REPORT_DIR / f"{datetime.now().strftime('%Y-%m-%d')}-llm-test.json"
        report_path.write_text(json.dumps(report, indent=2))
        print(f"\nReport: {report_path}")

        # Generate fixes if requested and there are failures
        if args.fix and total_failed > 0:
            print(f"\nGenerating fix suggestions...")
            fixes = generate_fix_suggestions(results, page_html, args.model)
            print(f"\n{'='*60}")
            print("FIX SUGGESTIONS")
            print(f"{'='*60}")
            print(fixes)

            fix_path = REPORT_DIR / f"{datetime.now().strftime('%Y-%m-%d')}-llm-fixes.md"
            fix_path.write_text(f"# LLM Test Fix Suggestions\n\n{fixes}")
            print(f"\nFixes saved: {fix_path}")

        if total_failed == 0:
            print("\nAll tests passed!")
            break

    return 0 if total_failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
