#!/usr/bin/env python3
"""Uji otomatis dek Kaca Cair sebelum diserahkan.

Menekan "maju" dari slide pertama sampai terakhir dengan transisi asli, memotret keadaan akhir
tiap slide, lalu melaporkan:
  - galat JavaScript / konsol
  - slide yang macet (indeks tidak berpindah)
  - teks yang keluar kanvas atau masuk zona navigasi/krom
  - penanda ⟨ISI SENDIRI⟩ yang masih tersisa
dan membuat lembar kontak <folder>/lembar.jpg untuk diperiksa mata.

Pakai:  python3 uji_dek.py presentasi.html folder-uji [--tunggu 4500] [--tingkat penuh]
Butuh: playwright (Chromium terpasang), Pillow.
"""
import argparse, os, json
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('html'); ap.add_argument('folder')
ap.add_argument('--tunggu', type=int, default=4500, help='ms menunggu tiap slide (koreografi selesai)')
ap.add_argument('--tingkat', default='penuh')
a = ap.parse_args()
os.makedirs(a.folder, exist_ok=True)

PERIKSA = """() => {
  const s = document.querySelector('.slide.aktif'), hasil = [], k = KC.skala;
  s.querySelectorAll('.isi h1,.isi h2,.isi h3,.isi p,.isi b,.isi small,.isi span,.isi li').forEach(e => {
    if (!e.textContent.trim() || e.closest('.kc-lensa')) return;
    const r = e.getBoundingClientRect(); if (!r.width) return;
    const x = r.left / k, y = r.top / k, x2 = r.right / k, y2 = r.bottom / k;
    if (x < 0 || x2 > 1920 || y < 0 || y2 > 1080) hasil.push('keluar kanvas: ' + e.textContent.trim().slice(0, 40));
    else if (y2 > 975 || y < 70) hasil.push('masuk zona navigasi/krom: ' + e.textContent.trim().slice(0, 40));
  });
  const isi = s.querySelector('.isi').textContent;
  const sisa = (isi.match(/⟨ISI SENDIRI/g) || []).length;
  return { label: s.dataset.label || '', masalah: [...new Set(hasil)].slice(0, 6), isiSendiri: sisa };
}"""

laporan, galat = [], []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    pg.on('console', lambda m: galat.append(f'[{m.type}] {m.text}') if m.type == 'error' else None)
    pg.on('pageerror', lambda e: galat.append(f'GALAT JS: {e}'))
    pg.goto('file://' + os.path.abspath(a.html) + f'?tingkat={a.tingkat}#1')
    pg.wait_for_function('window.KC && KC.jumlah > 0')
    n = pg.evaluate('KC.jumlah')
    for i in range(n):
        if i: pg.evaluate('KC.maju()')
        pg.wait_for_timeout(a.tunggu)
        idx = pg.evaluate('KC.indeks()')
        if idx != i: galat.append(f'slide {i + 1}: macet, indeks masih {idx + 1}')
        pg.screenshot(path=f'{a.folder}/{i + 1:02d}.png')
        r = pg.evaluate(PERIKSA); r['slide'] = i + 1; laporan.append(r)
        print(f'slide {i + 1:2d}/{n} {r["label"]:<18} ' + ('OK' if not r['masalah'] else '; '.join(r['masalah'])))
    b.close()

try:
    from PIL import Image
    W, H, kol = 640, 360, 3
    baris = (n + kol - 1) // kol
    lem = Image.new('RGB', (W * kol, H * baris), 'black')
    for i in range(n):
        lem.paste(Image.open(f'{a.folder}/{i + 1:02d}.png').convert('RGB').resize((W, H)), ((i % kol) * W, (i // kol) * H))
    lem.save(f'{a.folder}/lembar.jpg', quality=85)
    print(f'lembar kontak: {a.folder}/lembar.jpg')
except ImportError:
    print('Pillow tidak ada — lembar kontak dilewati')

isi_sendiri = sum(r['isiSendiri'] for r in laporan)
if isi_sendiri: print(f'PENGINGAT: {isi_sendiri} penanda ⟨ISI SENDIRI⟩ masih ada (sebutkan ke LO).')
print('\n'.join(galat) if galat else 'Tanpa galat JavaScript.')
json.dump({'slide': laporan, 'galat': galat}, open(f'{a.folder}/laporan.json', 'w'), ensure_ascii=False, indent=1)
