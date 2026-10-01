#!/usr/bin/env python3
"""Perakit dek Mawar Kaca: isi dek + aset kaca cair + aset mawar/latar holo-pagi/nama/judul
jadi SATU file HTML tanpa aset eksternal (offline, klik dua kali).

Pakai:
  python3 rakit_mawar.py --aset <folder-aset> --isi isi-dek.html --keluar presentasi.html \
                         [--logo logo.png] [--judul "Judul tab"] [--tambah adegan.js gaya.css ...]

<folder-aset> berisi semua file kc-* dari paket kaca cair DAN dari skill
bank-latar-holo-pagi, mawar-kaca-berlapis, nama-tombol-kaca, gerak-judul-kaca, dirigen-ppt-mawar-kaca.
--logo: PNG/JPG/SVG logo kampus dari LO (hasil ambil_logo.py). Tanpa --logo, tatakan berisi inisial.
"""
import argparse, base64, os, sys
CSS = ['kc-material.css', 'kc-latar.css', 'kc-latar-hp.css', 'kc-lensa.css', 'kc-teks.css', 'kc-morph.css', 'kc-komponen.css',
       'kc-transisi.css', 'kc-dek.css', 'kc-tata-letak.css', 'kc-identitas.css', 'kc-mawar.css', 'kc-nama.css', 'kc-judul.css', 'kc-tata-mawar.css']
JS = ['kc-inti.js', 'kc-latar.js', 'kc-latar-hp.js', 'kc-lensa.js', 'kc-teks.js', 'kc-morph.js', 'kc-komponen.js',
      'kc-transisi.js', 'kc-mesin.js', 'kc-identitas.js', 'kc-mawar.js', 'kc-nama.js', 'kc-judul.js']
WAJIB = ['kc-material.css', 'kc-latar.css', 'kc-dek.css', 'kc-transisi.css', 'kc-inti.js', 'kc-latar.js', 'kc-komponen.js',
         'kc-transisi.js', 'kc-mesin.js', 'kc-filter.html', 'kc-latar-hp.js', 'kc-latar-hp.css', 'kc-mawar.js', 'kc-mawar.css',
         'kc-nama.js', 'kc-nama.css', 'kc-judul.js', 'kc-judul.css', 'kc-tata-mawar.css']
MIME = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp'}

ap = argparse.ArgumentParser()
ap.add_argument('--aset', required=True); ap.add_argument('--isi', required=True); ap.add_argument('--keluar', required=True)
ap.add_argument('--logo'); ap.add_argument('--judul', default='Presentasi Mawar Kaca'); ap.add_argument('--tambah', nargs='*', default=[])
a = ap.parse_args()
baca = lambda p: open(p, encoding='utf-8').read()
ada = lambda f: os.path.exists(os.path.join(a.aset, f))
hilang = [f for f in WAJIB if not ada(f)]
if hilang: sys.exit('Aset wajib tidak ditemukan di ' + a.aset + ': ' + ', '.join(hilang))
css = '\n'.join(baca(os.path.join(a.aset, f)) for f in CSS if ada(f))
js = '\n'.join(baca(os.path.join(a.aset, f)) for f in JS if ada(f))
css += '\n' + '\n'.join(baca(f) for f in a.tambah if f.endswith('.css'))
js += '\n' + '\n'.join(baca(f) for f in a.tambah if f.endswith('.js'))
if a.logo:
    ext = os.path.splitext(a.logo)[1].lower()
    if ext not in MIME: sys.exit('Format logo tidak dikenal: ' + ext)
    uri = f'data:{MIME[ext]};base64,' + base64.b64encode(open(a.logo, 'rb').read()).decode()
    css = f':root{{--logo:url("{uri}")}}\n' + css
else:
    print('Catatan: tanpa --logo, tatakan mawar berisi inisial (data-inisial). Sebutkan ke LO.', file=sys.stderr)
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
