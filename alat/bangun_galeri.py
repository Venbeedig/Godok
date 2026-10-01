#!/usr/bin/env python3
"""Bangun ulang semua galeri di folder galeri/ LANGSUNG dari aset skill di folder skills/,
supaya yang dipamerkan selalu sama dengan yang dikirim di dalam skill.

Pakai (dari akar repo):
  python3 alat/bangun_galeri.py            # HTML saja
  python3 alat/bangun_galeri.py --pdf      # + PDF dek demo (butuh Playwright, Pillow, pypdf)
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
if '--pdf' in sys.argv:
    jalan(os.path.join(S, 'perakit-pdf-kaca', 'scripts', 'cetak_pdf.py'), os.path.join(G, 'galeri-demo-kaca-cair.html'),
          os.path.join(G, 'galeri-demo-kaca-cair.pdf'), '--mode', 'teks')
shutil.rmtree(aset)
