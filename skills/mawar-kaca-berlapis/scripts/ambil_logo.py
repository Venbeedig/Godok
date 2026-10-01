#!/usr/bin/env python3
"""Ambil logo kampus dari file kiriman LO, simpan sebagai PNG/SVG siap disematkan.

Sumber yang dikenali:
  .html  — mis. galeri-logo-mekar-pastel.html: mencari --logo:url("data:…") lebih dulu,
           lalu gambar data URI terbesar di file
  .pptx  — mendaftar semua gambar di ppt/media; pilih dengan --nomor (bawaan: yang terbesar)
  .png/.jpg/.svg — disalin apa adanya
Pakai:  python3 ambil_logo.py <sumber> <keluar-tanpa-ekstensi> [--nomor N]
Mencetak: nama file hasil, ukuran piksel, dan warna terbanyak (untuk palet).
Logo TIDAK pernah digambar ulang: yang diambil hanya gambar yang memang ada di file LO.
"""
import base64, io, os, re, sys, zipfile
from collections import Counter
src, out = sys.argv[1], sys.argv[2]
nomor = int(sys.argv[sys.argv.index('--nomor') + 1]) if '--nomor' in sys.argv else None
ext = os.path.splitext(src)[1].lower()
EXT = {'image/png': '.png', 'image/jpeg': '.jpg', 'image/svg+xml': '.svg', 'image/webp': '.webp'}

def simpan(data, e):
    p = out + e; open(p, 'wb').write(data); return p

if ext in ('.html', '.htm', '.css'):
    t = open(src, encoding='utf-8', errors='ignore').read()
    m = re.search(r'--logo\s*:\s*url\(\s*["\']?data:(image/[\w+.-]+);base64,([A-Za-z0-9+/=\s]+)', t)
    if m:
        mime, b = m.group(1), m.group(2); print('sumber: variabel --logo')
    else:
        semua = re.findall(r'data:(image/(?:png|jpeg|webp|svg\+xml));base64,([A-Za-z0-9+/=]+)', t)
        if not semua: sys.exit('Tidak ada gambar data URI di ' + src + '. Minta LO mengirim file logonya (PNG transparan).')
        mime, b = max(semua, key=lambda x: len(x[1])); print(f'sumber: data URI terbesar dari {len(semua)} gambar')
    p = simpan(base64.b64decode(re.sub(r'\s', '', b)), EXT.get(mime, '.png'))
elif ext == '.pptx':
    z = zipfile.ZipFile(src); media = sorted([n for n in z.namelist() if n.startswith('ppt/media/')], key=lambda n: -z.getinfo(n).file_size)
    for i, n in enumerate(media): print(f'  [{i}] {n}  {z.getinfo(n).file_size // 1024} KB')
    if not media: sys.exit('Tidak ada gambar di pptx.')
    n = media[nomor or 0]; p = simpan(z.read(n), os.path.splitext(n)[1].lower()); print('dipilih:', n)
elif ext in ('.png', '.jpg', '.jpeg', '.svg', '.webp'):
    p = simpan(open(src, 'rb').read(), ext)
else:
    sys.exit('Format sumber tidak dikenal: ' + ext)
print('logo:', p)
try:
    from PIL import Image
    if not p.endswith('.svg'):
        im = Image.open(p).convert('RGBA'); print('ukuran:', im.size)
        px = [c[:3] for c in im.resize((min(200, im.width), min(200, im.height))).getdata() if c[3] > 200 and sum(c[:3]) < 690]
        if px: print('warna terbanyak:', '#%02x%02x%02x' % Counter(px).most_common(1)[0][0])
        if im.getextrema()[3][0] == 255: print('PERHATIAN: logo tidak transparan (latar putih ikut). Tatakan putih mawar tetap rapi, tapi PNG transparan lebih bagus.')
except ImportError:
    pass
