#!/usr/bin/env python3
"""Perakit dek Kaca Cair: menggabungkan isi dek + semua aset kc-*.css/js jadi SATU file HTML
tanpa aset eksternal (bisa dibuka offline, cukup klik dua kali).

Pakai:
  python3 rakit.py --aset <folder-aset> --isi isi-dek.html --keluar presentasi.html \
                   [--judul "Judul tab"] [--tambah adegan.js gaya.css ...]

<folder-aset> berisi file aset dari skill pecahan (kc-material.css, kc-latar.js, dst).
File yang tidak ada dilewati, jadi dek tanpa identitas/lensa tetap bisa dirakit.
"""
import argparse, os, sys
CSS = ['kc-material.css', 'kc-latar.css', 'kc-lensa.css', 'kc-teks.css', 'kc-morph.css', 'kc-komponen.css',
       'kc-transisi.css', 'kc-dek.css', 'kc-tata-letak.css', 'kc-identitas.css']
JS = ['kc-inti.js', 'kc-latar.js', 'kc-lensa.js', 'kc-teks.js', 'kc-morph.js', 'kc-komponen.js',
      'kc-transisi.js', 'kc-mesin.js', 'kc-identitas.js']
WAJIB = ['kc-material.css', 'kc-latar.css', 'kc-dek.css', 'kc-transisi.css', 'kc-inti.js', 'kc-latar.js',
         'kc-komponen.js', 'kc-transisi.js', 'kc-mesin.js', 'kc-filter.html']

ap = argparse.ArgumentParser()
ap.add_argument('--aset', default=os.path.dirname(os.path.abspath(__file__)))
ap.add_argument('--isi', required=True); ap.add_argument('--keluar', required=True)
ap.add_argument('--judul', default='Presentasi Kaca Cair'); ap.add_argument('--tambah', nargs='*', default=[])
a = ap.parse_args()
baca = lambda p: open(p, encoding='utf-8').read()
hilang = [f for f in WAJIB if not os.path.exists(os.path.join(a.aset, f))]
if hilang: sys.exit('Aset wajib tidak ditemukan di ' + a.aset + ': ' + ', '.join(hilang))
css = '\n'.join(baca(os.path.join(a.aset, f)) for f in CSS if os.path.exists(os.path.join(a.aset, f)))
js = '\n'.join(baca(os.path.join(a.aset, f)) for f in JS if os.path.exists(os.path.join(a.aset, f)))
css += '\n' + '\n'.join(baca(f) for f in a.tambah if f.endswith('.css'))
js += '\n' + '\n'.join(baca(f) for f in a.tambah if f.endswith('.js'))
isi = baca(a.isi)
if '<script src' in isi or 'http://' in isi.replace('http://www.w3.org', '') or 'https://' in isi:
    print('PERINGATAN: isi dek memuat tautan eksternal — dek harus bisa jalan offline.', file=sys.stderr)
html = f"""<!doctype html>
<html lang="id" data-tingkat="penuh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{a.judul}</title>
<style>
{css}
</style>
</head>
<body>
{baca(os.path.join(a.aset, 'kc-filter.html'))}
<div class="panggung">
{isi}
</div>
<script>
{js}
const q = new URLSearchParams(location.search);
KC.mulai({{ cetak: q.has('cetak'), tingkat: q.get('tingkat') }});
</script>
</body>
</html>
"""
open(a.keluar, 'w', encoding='utf-8').write(html)
print(f'{a.keluar}: {len(html) // 1024} KB')
