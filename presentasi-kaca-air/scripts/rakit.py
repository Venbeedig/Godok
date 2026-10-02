#!/usr/bin/env python3
"""rakit.py — gabungkan src/ menjadi SATU file HTML offline (CSS, JS, font, logo disematkan).
Pakai: python3 scripts/rakit.py [src/index.html] [dist/presentasi-kaca-air.html]"""
import base64, re, sys, pathlib

src = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'src/index.html')
out = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'dist/presentasi-kaca-air.html')
d = src.parent

def data_uri(path, mime):
    return f'data:{mime};base64,' + base64.b64encode((d / path).read_bytes()).decode()

html = src.read_text(encoding='utf-8')

def css_inline(m):
    css = (d / m.group(1)).read_text(encoding='utf-8')
    css = re.sub(r'url\((font/[^)]+\.woff2)\)', lambda f: 'url(' + data_uri(f.group(1), 'font/woff2') + ')', css)
    return '<style>\n' + css + '\n</style>'
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css_inline, html)

def js_inline(m):
    js = (d / m.group(1)).read_text(encoding='utf-8')
    assert '</script' not in js
    return '<script>\n' + js + '\n</script>'
html = re.sub(r'<script src="([^"]+)"></script>', js_inline, html)

logo = data_uri('logo-ut.png', 'image/png')
html = html.replace('src="logo-ut.png"', f'src="{logo}"')

for pola in ('src="http', "url(http", 'href="http'):
    assert pola not in html, 'aset eksternal: ' + pola
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html, encoding='utf-8')
print(f'{out}  ({out.stat().st_size/1024:.0f} KB)')
