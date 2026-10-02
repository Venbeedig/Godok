#!/usr/bin/env bash
# bangun.sh — rakit HTML offline, uji, lalu ekspor PDF & PPTX ke dist/
# Butuh: python3 (python-pptx, Pillow), node + playwright (Chromium).
set -euo pipefail
cd "$(dirname "$0")"
NAMA=${NAMA:-presentasi-kaca-air}
KERJA=${KERJA:-.kerja}
export NODE_PATH=${NODE_PATH:-$(npm root -g 2>/dev/null || true)}

python3 scripts/rakit.py src/index.html "dist/$NAMA.html"
node scripts/uji.cjs "dist/$NAMA.html" "$KERJA/uji"
rm -rf "$KERJA/ekspor"
node scripts/ekspor.cjs "dist/$NAMA.html" "$KERJA/ekspor"
python3 scripts/bangun_pptx.py "$KERJA/ekspor" "dist/$NAMA.pptx"
python3 scripts/bangun_pdf.py "$KERJA/ekspor" "dist/$NAMA.pdf"
cp "$KERJA/uji/lembar.jpg" "dist/pratinjau-slide.jpg"
echo "selesai → dist/"
