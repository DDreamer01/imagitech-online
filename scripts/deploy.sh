#!/usr/bin/env bash
# ==============================================================================
# imagitech.online — Production Pull & Build Script
# 
# Usage:
#   ./deploy.sh          # Pull latest main, install deps if needed, build
#   ./deploy.sh --clean  # Remove node_modules and out/, clean install, build
# ==============================================================================

set -euo pipefail

# Text formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

info()    { echo -e "${CYAN}${BOLD}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $*"; }
warn()    { echo -e "${YELLOW}${BOLD}[WARN]${NC} $*"; }
error()   { echo -e "${RED}${BOLD}[ERROR]${NC} $*" >&2; }

# 1. Environment & Path
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

# 2. Locate project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -d "/var/www/imagitech-online" ]; then
    PROJECT_DIR="/var/www/imagitech-online"
elif [ -f "$SCRIPT_DIR/package.json" ]; then
    PROJECT_DIR="$SCRIPT_DIR"
elif [ -f "$SCRIPT_DIR/../package.json" ]; then
    PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
else
    error "Could not locate imagitech-online directory."
    exit 1
fi

cd "$PROJECT_DIR"
echo -e "${BOLD}======================================================${NC}"
echo -e "${BOLD}       🚀 imagitech.online Production Deployment       ${NC}"
echo -e "${BOLD}======================================================${NC}"
info "Working directory: $PROJECT_DIR"

# 3. Verify toolchain
for tool in git node npm; do
    if ! command -v "$tool" &>/dev/null; then
        error "Required command '$tool' is not installed or not in PATH."
        exit 1
    fi
done
info "Node: $(node -v) | NPM: $(npm -v) | Git: $(git --version | awk '{print $3}')"

# 4. Record current commit for comparison
PREV_COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"

# 5. Fetch and sync from GitHub main
info "Fetching latest commits from origin/main..."
git fetch origin main

# Check if package-lock.json changed between current HEAD and origin/main
DEPS_CHANGED=false
if ! git diff --quiet HEAD origin/main -- package-lock.json package.json 2>/dev/null; then
    DEPS_CHANGED=true
fi

info "Resetting working tree to match origin/main exactly..."
# Discard any local drift (e.g. locally regenerated feed.xml)
git reset --hard origin/main

CURRENT_COMMIT="$(git rev-parse --short HEAD)"
COMMIT_MSG="$(git log -1 --pretty=%B | head -n 1)"
COMMIT_AUTHOR="$(git log -1 --pretty="%an <%ae>")"
COMMIT_DATE="$(git log -1 --pretty=%cd --date=relative)"

info "Target commit: ${BOLD}${CURRENT_COMMIT}${NC} ($COMMIT_DATE)"
echo -e "      Author: $COMMIT_AUTHOR"
echo -e "      Message: \"$COMMIT_MSG\""

# 6. Install dependencies if requested or needed
if [[ "${1:-}" == "--clean" ]]; then
    warn "Clean flag passed: purging node_modules and .next..."
    rm -rf node_modules .next out
    info "Performing fresh clean install (npm ci)..."
    npm ci --no-audit
elif [ "$DEPS_CHANGED" = true ] || [ ! -d "node_modules" ]; then
    info "Dependencies changed or missing. Installing packages (npm ci)..."
    npm ci --prefer-offline --no-audit
else
    info "Dependencies are up-to-date. Skipping npm ci."
fi

# 7. Execute production static export & search indexing
info "Running static compilation & search indexing (npm run build)..."
npm run build

# 8. Sanity check output
if [ ! -f "out/index.html" ]; then
    error "Build finished but 'out/index.html' was not found!"
    exit 1
fi

TOTAL_HTML="$(find out/ -name '*.html' | wc -l)"
TOTAL_FILES="$(find out/ -type f | wc -l)"

echo -e "${BOLD}======================================================${NC}"
success "imagitech.online successfully deployed!"
echo -e "  • Commit:     ${BOLD}${CURRENT_COMMIT}${NC} (was ${PREV_COMMIT})"
echo -e "  • Artifacts:  ${TOTAL_HTML} HTML pages (${TOTAL_FILES} total assets in out/)"
echo -e "  • Timestamp:  $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo -e "  • Live URL:   ${CYAN}${BOLD}https://imagitech.online${NC}"
echo -e "${BOLD}======================================================${NC}"
