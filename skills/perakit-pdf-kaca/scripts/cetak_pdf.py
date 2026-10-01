#!/usr/bin/env python3
"""Cetak dek Kaca Cair (HTML) jadi PDF, satu halaman 16:9 per slide, pada keadaan AKHIR tiap slide.

Mode:
  gambar (bawaan) : tiap slide dipotret persis seperti di layar (kaca, blur, latar) lalu disusun jadi PDF.
                    Ringan (~150 KB/halaman). Teks tidak bisa disalin. Cocok untuk dibagikan ke grup.
  teks            : sama dengan gambar + LAPISAN TEKS TAK TERLIHAT di posisi yang tepat, sehingga teks
                    bisa dipilih, disalin, dan dicari (Ctrl+F) — cocok untuk disetor ke dosen.
                    (Mencetak langsung dengan Chromium menghasilkan ~2 MB/halaman karena tiap blur
                    dirasterisasi ulang; cara hibrida ini menjaga ukuran tetap kecil.)
  keduanya        : <nama>.pdf (gambar) + <nama>-teks.pdf.

Pakai:
  python3 cetak_pdf.py presentasi.html presentasi.pdf [--mode gambar|teks|keduanya] [--hd] [--tunggu 900]

Butuh: playwright (Chromium terpasang — jangan "playwright install" bila PLAYWRIGHT_BROWSERS_PATH ada),
Pillow, dan pypdf (mode teks).
"""
import argparse, io, os, sys

ap = argparse.ArgumentParser()
ap.add_argument('html'); ap.add_argument('pdf')
ap.add_argument('--mode', choices=['gambar', 'teks', 'keduanya'], default='gambar')
ap.add_argument('--hd', action='store_true', help='potret 2x (3840x2160); file kira-kira 3x lebih besar')
ap.add_argument('--tunggu', type=int, default=900, help='ms menunggu tiap slide sebelum dipotret')
a = ap.parse_args()

from playwright.sync_api import sync_playwright
from PIL import Image

CETAK_CSS = """
@page { size: 1920px 1080px; margin: 0 }
[data-cetak] *, [data-cetak] *::before, [data-cetak] *::after { transition: none !important }
.kc-ketik::after { display: none !important }
"""
# lapisan teks: semua selain huruf dibuat tak terlihat TANPA mengubah tata letak
TEKS_CSS = """
.latar, .kc-fx, .kc-nav, .kc-lensa, .kc-goo, svg, img, canvas { visibility: hidden !important }
html, body, .panggung, .dek, .slide, * { background: transparent !important; box-shadow: none !important;
  -webkit-backdrop-filter: none !important; backdrop-filter: none !important; filter: none !important;
  text-shadow: none !important; border-color: transparent !important; outline: none !important;
  -webkit-mask: none !important; mask: none !important }
* { color: rgba(0, 0, 0, .012) !important; -webkit-text-fill-color: rgba(0, 0, 0, .012) !important; caret-color: transparent !important }
"""

def potret_semua(p, teks):
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=2 if a.hd else 1)
    galat = []
    pg.on('pageerror', lambda e: galat.append(str(e)))
    pg.goto('file://' + os.path.abspath(a.html) + '?cetak=1&tingkat=penuh')
    pg.wait_for_function('window.KC && KC.jumlah > 0')
    pg.add_style_tag(content=CETAK_CSS)
    pg.emulate_media(media='screen')
    n = pg.evaluate('KC.jumlah'); gambar, lapis = [], []
    for i in range(n):
        pg.evaluate(f'KC.ke({i}, {{ instan: true, paksa: true }})')
        pg.wait_for_timeout(a.tunggu)
        pg.evaluate('document.fonts.ready')
        gambar.append(Image.open(io.BytesIO(pg.screenshot(type='png'))).convert('RGB'))
        if teks:
            pg.evaluate("t => { const s = document.createElement('style'); s.id = 'kc-lapis-teks'; s.textContent = t; document.head.append(s); }", TEKS_CSS)
            lapis.append(pg.pdf(width='1920px', height='1080px', print_background=False, page_ranges='1',
                                margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'}))
            pg.evaluate("document.getElementById('kc-lapis-teks').remove()")
        print(f'  slide {i + 1}/{n}')
    b.close()
    return gambar, lapis, galat

def simpan_gambar(gambar, tujuan):
    dpi = 192 if a.hd else 96          # 1920px / 96 dpi = 20 inci → halaman 16:9 (1440×810 pt)
    gambar[0].save(tujuan, format='PDF', save_all=True, append_images=gambar[1:], resolution=dpi, quality=90)

def simpan_teks(gambar, lapis, keluar):
    from pypdf import PdfReader, PdfWriter
    buf = io.BytesIO(); simpan_gambar(gambar, buf); buf.seek(0)
    dasar, w = PdfReader(buf), PdfWriter()
    for i, hal in enumerate(dasar.pages):
        atas = PdfReader(io.BytesIO(lapis[i])).pages[0]
        sx, sy = float(hal.mediabox.width) / float(atas.mediabox.width), float(hal.mediabox.height) / float(atas.mediabox.height)
        if abs(sx - 1) > .001 or abs(sy - 1) > .001:
            from pypdf import Transformation
            atas.add_transformation(Transformation().scale(sx, sy))
        hal.merge_page(atas); w.add_page(hal)
    w.compress_identical_objects() if hasattr(w, 'compress_identical_objects') else None
    with open(keluar, 'wb') as f: w.write(f)

with sync_playwright() as p:
    gambar, lapis, galat = potret_semua(p, a.mode in ('teks', 'keduanya'))
hasil = []
if a.mode in ('gambar', 'keduanya'):
    simpan_gambar(gambar, a.pdf); hasil.append(a.pdf)
if a.mode in ('teks', 'keduanya'):
    t = a.pdf if a.mode == 'teks' else a.pdf[:-4] + '-teks.pdf'
    simpan_teks(gambar, lapis, t); hasil.append(t)
for f in hasil: print(f'{f}: {len(gambar)} halaman, {os.path.getsize(f) // 1024} KB')
for g in galat: print('  GALAT HALAMAN:', g, file=sys.stderr)
