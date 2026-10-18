#!/usr/bin/env bash
# Downloads the demo app binaries listed in apps/manifest.json into apps/ and verifies
# their SHA-256. Idempotent: existing files with a matching checksum are kept.
# Usage: scripts/download-apps.sh [android|ios|all]   (default: all)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPS_DIR="$ROOT/apps"
MANIFEST="$APPS_DIR/manifest.json"
WANT="${1:-all}"

need() { command -v "$1" >/dev/null 2>&1 || { echo "missing dependency: $1" >&2; exit 1; }; }
need curl; need node

sha256() {
  if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | awk '{print $1}';
  else shasum -a 256 "$1" | awk '{print $1}'; fi
}

node -e '
  const m = require(process.argv[1]);
  for (const a of m.apps) console.log([a.platform, a.file, a.url, a.sha256, a.unzipTo ?? ""].join("\t"));
' "$MANIFEST" | while IFS=$'\t' read -r platform file url sum unzipTo; do
  [[ "$WANT" == "all" || "$WANT" == "$platform" ]] || continue
  target="$APPS_DIR/$file"
  if [[ -f "$target" && "$(sha256 "$target")" == "$sum" ]]; then
    echo "✔ $file already present (checksum ok)"
  else
    echo "⬇ $file"
    curl --fail --location --silent --show-error --retry 3 --output "$target.part" "$url"
    actual="$(sha256 "$target.part")"
    if [[ "$actual" != "$sum" ]]; then
      echo "✖ checksum mismatch for $file: expected $sum got $actual" >&2
      rm -f "$target.part"; exit 1
    fi
    mv "$target.part" "$target"
    echo "✔ $file verified"
  fi
  if [[ -n "$unzipTo" && ! -d "$APPS_DIR/$unzipTo" ]]; then
    need unzip
    unzip -qo "$target" -d "$APPS_DIR"
    echo "✔ extracted $unzipTo"
  fi
done
echo "apps ready in $APPS_DIR"
