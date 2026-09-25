#!/usr/bin/env bash
# Copies the approved CarePulse brand kit from the application repository into
# the places this site serves it from. The kit in the app repo is the source of
# truth — never edit the copies here; change the kit and re-run this script.
#
#   scripts/sync-brand-kit.sh [path-to-pharmacy-management-repo]
set -euo pipefail

APP_REPO="${1:-../pharmacy-management}"
KIT="$APP_REPO/apps/web/src/assets/carepulse-brand-kit"
HERE="$(cd "$(dirname "$0")/.." && pwd)"

[ -d "$KIT" ] || { echo "Brand kit not found at $KIT" >&2; exit 1; }

# Route-level icons and share image (Next.js file conventions in src/app).
cp "$KIT/favicon.ico"          "$HERE/src/app/favicon.ico"
cp "$APP_REPO/apps/web/public/favicon.svg" "$HERE/src/app/icon.svg"   # the kit's favicon.svg, as published in the app
cp "$KIT/apple-touch-icon.png" "$HERE/src/app/apple-icon.png"
cp "$KIT/og-image.png"         "$HERE/src/app/opengraph-image.png"

# Manifest icons need stable public URLs.
cp "$KIT/android-chrome-192x192.png" "$KIT/android-chrome-512x512.png" "$KIT/maskable-icon-512x512.png" "$HERE/public/"

# Marks and lockups rendered in the page (imported, so they get hashed, cacheable URLs).
cp "$KIT/carepulse-logo.svg" "$KIT/carepulse-mark.svg" "$KIT/carepulse-icon.svg" "$HERE/src/assets/brand/"

echo "Brand kit synced from $KIT"
