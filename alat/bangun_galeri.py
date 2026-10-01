#!/usr/bin/env python3
"""Bangun ulang semua galeri di folder galeri/ LANGSUNG dari aset skill di folder skills/,
supaya yang dipamerkan selalu sama dengan yang dikirim di dalam skill.

Pakai (dari akar repo):
  python3 alat/bangun_galeri.py            # HTML saja
  python3 alat/bangun_galeri.py --pdf      # + PDF dek demo (butuh Playwright, Pillow, pypdf)
  python3 alat/bangun_galeri.py --pptx     # + contoh .pptx mawar kaca mode mandiri (butuh Playwright, python-pptx)
"""
import glob, os, shutil, subprocess, sys, tempfile
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.join(AKAR, 'skills'); G = os.path.join(AKAR, 'galeri'); os.makedirs(G, exist_ok=True)
aset = tempfile.mkdtemp(prefix='kc-aset-')
for f in glob.glob(os.path.join(S, '*', 'assets', 'kc-*')): shutil.copy(f, aset)
rakit = os.path.join(S, 'dirigen-ppt-kaca-cair', 'scripts', 'rakit.py')
jalan = lambda *a: subprocess.run([sys.executable, *a], check=True)
jalan(rakit, '--aset', aset, '--isi', os.path.join(S, 'tata-letak-slide-kaca', 'assets', 'contoh-dek.html'),
      '--tambah', os.path.join(S, 'dirigen-ppt-kaca-cair', 'assets', 'contoh-adegan.js'),
      '--judul', 'Galeri Demo Kaca Cair', '--keluar', os.path.join(G, 'galeri-demo-kaca-cair.html'))
jalan(rakit, '--aset', aset, '--isi', os.path.join(AKAR, 'alat', 'uji-varian-isi.html'),
      '--tambah', os.path.join(AKAR, 'alat', 'uji-varian-adegan.js'),
      '--judul', 'Galeri Varian Kaca Cair', '--keluar', os.path.join(G, 'galeri-varian-kaca-cair.html'))
jalan(os.path.join(AKAR, 'alat', 'katalog.py'), aset, os.path.join(G, 'katalog-latar.html'))
# paket mawar kaca: dek demo, galeri varian (mawar, nama, judul), katalog latar holografik & aurora pagi
rakit_m = os.path.join(S, 'dirigen-ppt-mawar-kaca', 'scripts', 'rakit_mawar.py')
jalan(rakit_m, '--aset', aset, '--isi', os.path.join(S, 'dirigen-ppt-mawar-kaca', 'assets', 'contoh-isi-dek.html'),
      '--judul', 'Galeri Demo Mawar Kaca', '--keluar', os.path.join(G, 'galeri-mawar-kaca.html'))
jalan(rakit_m, '--aset', aset, '--isi', os.path.join(AKAR, 'alat', 'uji-mawar-varian-isi.html'),
      '--judul', 'Galeri Varian Mawar Kaca', '--keluar', os.path.join(G, 'galeri-varian-mawar.html'))
jalan(os.path.join(AKAR, 'alat', 'katalog.py'), aset, os.path.join(G, 'katalog-latar-holo-pagi.html'), 'holo,pagi')
if '--pdf' in sys.argv:
    cetak = os.path.join(S, 'perakit-pdf-kaca', 'scripts', 'cetak_pdf.py')
    jalan(cetak, os.path.join(G, 'galeri-demo-kaca-cair.html'), os.path.join(G, 'galeri-demo-kaca-cair.pdf'), '--mode', 'teks')
    jalan(cetak, os.path.join(G, 'galeri-mawar-kaca.html'), os.path.join(G, 'galeri-mawar-kaca.pdf'), '--mode', 'teks')
if '--pptx' in sys.argv:
    import json
    peta = os.path.join(S, 'ppt-referensi-mawar', 'assets', 'peta-contoh.json'); kerja = tempfile.mkdtemp(prefix='kc-pptx-')
    ids = ','.join(dict.fromkeys(x['latar'] for x in json.load(open(peta, encoding='utf-8'))['slide']))
    render = os.path.join(S, 'mawar-kaca-berlapis', 'scripts', 'render_png.py')
    jalan(render, '--aset', aset, '--mawar', os.path.join(kerja, 'mawar.png'), '--latar', ids, '--folder', os.path.join(kerja, 'latar'))
    jalan(os.path.join(S, 'ppt-referensi-mawar', 'scripts', 'rakit_pptx.py'), '--peta', peta, '--keluar', os.path.join(G, 'contoh-mawar-kaca.pptx'),
          '--mawar', os.path.join(kerja, 'mawar.png'), '--latar-folder', os.path.join(kerja, 'latar'), '--aset', aset, '--animasi')
    shutil.rmtree(kerja)
shutil.rmtree(aset)
