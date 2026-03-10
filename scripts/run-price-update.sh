#!/bin/bash
# Nightly price update for The Longevity Agent
# Run via launchd at 2 AM MT (9 AM UTC)
# Fetches prices, updates DB, commits + pushes if changed

set -uo pipefail

# Ensure Homebrew binaries are on PATH (launchd has minimal PATH)
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d)-price-update.log"

# Trap to always log completion status
cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo "=== FAILED with exit code $exit_code at $(date) ===" >> "$LOG_FILE"
    fi
    echo "=== Price update finished $(date) ===" >> "$LOG_FILE"
}
trap cleanup EXIT

echo "=== Price update starting $(date) ===" >> "$LOG_FILE"

cd "$PROJECT_DIR"

# Push any unpushed commits from previous failed runs
if [ "$(git rev-list --count @{u}..HEAD 2>/dev/null)" -gt 0 ]; then
    echo "Pushing previously unpushed commits..." >> "$LOG_FILE"
    git push >> "$LOG_FILE" 2>&1
fi

# Run the price updater
if ! python3 scripts/update-prices.py >> "$LOG_FILE" 2>&1; then
    echo "ERROR: price update script failed" >> "$LOG_FILE"
    exit 1
fi

# Check if DB changed
if git diff --quiet data/longevity-stack.db; then
    echo "No price changes detected, skipping commit" >> "$LOG_FILE"
else
    echo "Prices changed, committing and pushing..." >> "$LOG_FILE"
    git add data/longevity-stack.db
    git -c user.name="Mojo" -c user.email="mojobot@agentmail.to" \
        commit -m "Update prices $(date +%Y-%m-%d)

Automated nightly price update via Playwright + regex extraction.
See scripts/reports/ for details.

Co-Authored-By: Mojo <mojobot@agentmail.to>" >> "$LOG_FILE" 2>&1

    git push >> "$LOG_FILE" 2>&1
    echo "Pushed to remote, Vercel will auto-deploy" >> "$LOG_FILE"
fi

# Clean up logs older than 30 days
find "$LOG_DIR" -name "*-price-update.log" -mtime +30 -delete
