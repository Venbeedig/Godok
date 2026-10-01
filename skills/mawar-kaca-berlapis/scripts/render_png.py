#!/usr/bin/env python3
"""Render mawar kaca + logo (dan/atau latar holo-pagi) jadi PNG untuk .pptx dan PDF.

Pakai:
  python3 render_png.py --aset <folder-aset> --mawar mawar.png [--logo logo.png] [--varian embun] [--palet sakura] [--inisial UT] [--latar-mawar holo-klasik]
  python3 render_png.py --aset <folder-aset> --latar holo-klasik,pagi-fajar --folder latar/ [--format jpg|png]
<folder-aset> berisi kc-material.css, kc-latar*.css/js, kc-inti.js, kc-mawar.css/js, kc-filter.html.
Mawar dirender pada keadaan akhir (mekar penuh) 1800×1800 px, latar TRANSPARAN kecuali --latar-mawar diberi
(dengan latar, kaca kelopak ikut membiaskan warna latar — lebih mirip versi HTML).
Latar dirender 1920×1080 pada detik ke-0 (tanpa teks), satu berkas per id: JPG mutu 90 (bawaan, ±150 KB,
membuat .pptx ringan) atau PNG bila --format png.
Butuh: playwright (Chromium).
"""
import argparse, base64, os, sys
from playwright.sync_api import sync_playwright
ap = argparse.ArgumentParser()
ap.add_argument('--aset', required=True); ap.add_argument('--mawar'); ap.add_argument('--logo')
ap.add_argument('--varian', default='embun'); ap.add_argument('--palet', default='sakura'); ap.add_argument('--inisial', default='UT')
ap.add_argument('--latar-mawar'); ap.add_argument('--latar'); ap.add_argument('--folder', default='.')
ap.add_argument('--format', choices=['jpg', 'png'], default='jpg', help='format gambar latar')
a = ap.parse_args()
if not a.mawar and not a.latar: sys.exit('Beri --mawar dan/atau --latar.')
baca = lambda f: open(os.path.join(a.aset, f), encoding='utf-8').read() if os.path.exists(os.path.join(a.aset, f)) else ''
css = ''.join(baca(f) for f in ['kc-material.css', 'kc-latar.css', 'kc-latar-hp.css', 'kc-mawar.css'])
js = ''.join(baca(f) for f in ['kc-inti.js', 'kc-latar.js', 'kc-latar-hp.js', 'kc-mawar.js'])
logo = ''
if a.logo:
    mime = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp'}[os.path.splitext(a.logo)[1].lower()]
    logo = f':root{{--logo:url("data:{mime};base64,{base64.b64encode(open(a.logo, "rb").read()).decode()}")}}'
html = f"""<!doctype html><html data-tingkat="penuh"><head><meta charset="utf-8"><style>{logo}{css}
html,body{{margin:0;background:transparent!important;overflow:hidden}} .dek{{transform:none;background:transparent}}
#m{{left:0;top:0}} .mw-tatakan{{--kc-kaca-isi:rgba(255,255,255,.97)!important}} .mw-hidup .mw-lapis,.mw-hidup .mw-tatakan,.mw-k::before{{animation:none!important}}</style></head>
<body>{baca('kc-filter.html')}<div class="dek" id="d"></div><script>{js}
KC.instan = true;
window.latar = id => {{ const d = document.getElementById('d'); d.innerHTML = ''; d.style.width = '1920px'; d.style.height = '1080px';
  const l = document.createElement('div'); d.append(l); const t = KC.latar.pasang(l, id); for (const k in t) d.style.setProperty(k, t[k]);
  d.querySelectorAll('.latar *').forEach(e => e.style.animationPlayState = 'paused'); }};
window.mawar = (o, lt) => {{ const d = document.getElementById('d'); d.innerHTML = ''; d.style.width = '900px'; d.style.height = '900px';
  if (lt) {{ const l = document.createElement('div'); d.append(l); const t = KC.latar.pasang(l, lt); for (const k in t) d.style.setProperty(k, t[k]);
    d.querySelectorAll('.latar *').forEach(e => e.style.animationPlayState = 'paused'); }}
  const h = document.createElement('div'); h.id = 'm'; d.append(h); KC.mawar.buat(h, o).diam(); }};
</script></body></html>"""
with sync_playwright() as p:
    b = p.chromium.launch()
    if a.mawar:
        pg = b.new_page(viewport={'width': 900, 'height': 900}, device_scale_factor=2)
        pg.set_content(html); pg.evaluate('([o, l]) => mawar(o, l)', [{'varian': a.varian, 'palet': a.palet, 'inisial': a.inisial}, a.latar_mawar])
        pg.wait_for_timeout(400)
        pg.screenshot(path=a.mawar, omit_background=not a.latar_mawar, clip={'x': 0, 'y': 0, 'width': 900, 'height': 900})
        print('mawar:', a.mawar, '(1800×1800, ' + ('latar ' + a.latar_mawar if a.latar_mawar else 'transparan') + ')')
    if a.latar:
        os.makedirs(a.folder, exist_ok=True)
        pg = b.new_page(viewport={'width': 1920, 'height': 1080})
        pg.set_content(html)
        for id in a.latar.split(','):
            pg.evaluate('id => latar(id)', id); pg.wait_for_timeout(250)
            f = os.path.join(a.folder, id + '.' + a.format)
            pg.screenshot(path=f, **({'type': 'jpeg', 'quality': 90} if a.format == 'jpg' else {})); print('latar:', f)
    b.close()
