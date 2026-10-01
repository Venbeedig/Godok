#!/usr/bin/env python3
"""Bedah file .pptx referensi: ukuran, warna & font tema, tiap slide beserta NAMA bentuknya.

Pakai:
  python3 bedah_referensi.py referensi.pptx --keluar bedah/ [--pratinjau]
Hasil di folder --keluar:
  profil.json      ukuran slide, warna tema (dk1, lt1, accent1..6), font judul/isi, dan per slide:
                   layout, latar, transisi, ada animasi?, daftar bentuk {nama, jenis, x, y, w, h (inci), teks, font}
  peta-bentuk.txt  ringkasan yang enak dibaca: "slide 3 · bentuk 'Judul' (teks, 40pt Poppins) → 'Unsur Bangun Ruang'"
  peta-awal.json   kerangka peta untuk rakit_pptx.py: satu entri per slide referensi, "pola" = nomornya,
                   "isi" = {nama bentuk teks: teks aslinya}. Salin entri, ganti teksnya, susun ulang.
  pratinjau/       (bila --pratinjau dan LibreOffice Impress terpasang) PNG tiap slide + lembar-kontak.png
Butuh: python-pptx; pratinjau butuh soffice (paket libreoffice-impress), pdftoppm, Pillow.
"""
import argparse, json, os, shutil, subprocess, sys
from pptx import Presentation
from pptx.util import Emu
from pptx.oxml.ns import qn
from pptx.opc.constants import RELATIONSHIP_TYPE as RT

ap = argparse.ArgumentParser()
ap.add_argument('referensi'); ap.add_argument('--keluar', default='bedah'); ap.add_argument('--pratinjau', action='store_true')
a = ap.parse_args()
os.makedirs(a.keluar, exist_ok=True)
prs = Presentation(a.referensi)
inci = lambda v: round(Emu(v or 0).inches, 2)
JENIS = {1: 'bentuk', 3: 'diagram', 6: 'grup', 7: 'tabel-lama', 13: 'gambar', 14: 'placeholder', 17: 'kotak-teks', 19: 'tabel', 24: 'smartart'}

def tema():
    try: t = prs.slide_master.part.part_related_by(RT.THEME)
    except KeyError: return {}, {}
    from lxml import etree
    x = etree.fromstring(t.blob); warna = {}; font = {}
    cs = x.find('.//' + qn('a:clrScheme'))
    if cs is not None:
        for el in cs:
            c = el[0] if len(el) else None
            if c is None: continue
            warna[el.tag.split('}')[1]] = '#' + (c.get('val') if c.tag == qn('a:srgbClr') else c.get('lastClr', '000000'))
    for k, tag in (('judul', 'a:majorFont'), ('isi', 'a:minorFont')):
        f = x.find('.//' + qn(tag))
        if f is not None and f.find(qn('a:latin')) is not None: font[k] = f.find(qn('a:latin')).get('typeface')
    return warna, font

def font_run(sh):
    if not sh.has_text_frame: return None
    for p in sh.text_frame.paragraphs:
        for r in p.runs:
            f = r.font; d = {}
            if f.name: d['nama'] = f.name
            if f.size: d['pt'] = round(f.size.pt)
            if f.bold: d['tebal'] = True
            try:
                if f.color and f.color.type is not None and f.color.rgb is not None: d['warna'] = '#' + str(f.color.rgb)
            except AttributeError: pass
            return d or None
    return None

def bentuk(shapes, induk=''):
    hasil = []
    for sh in shapes:
        d = {'nama': sh.name, 'jenis': JENIS.get(int(sh.shape_type or 0), str(sh.shape_type)),
             'x': inci(sh.left), 'y': inci(sh.top), 'w': inci(sh.width), 'h': inci(sh.height)}
        if induk: d['grup'] = induk
        if sh.is_placeholder: d['placeholder'] = str(sh.placeholder_format.type).split('.')[-1].split(' ')[0]
        if sh.has_text_frame and sh.text_frame.text.strip():
            d['teks'] = sh.text_frame.text.strip(); d['paragraf'] = len(sh.text_frame.paragraphs)
            f = font_run(sh)
            if f: d['font'] = f
        if sh.shape_type == 13:
            try: d['gambar'] = os.path.basename(sh.image.filename or '') or sh.image.ext; d['px'] = list(sh.image.size)
            except Exception: pass
        hasil.append(d)
        if sh.shape_type == 6: hasil += bentuk(sh.shapes, sh.name)
    return hasil

def latar(sl):
    bg = sl._element.cSld.bg
    if bg is None: return 'ikut layout/master'
    if bg.find('.//' + qn('a:blipFill')) is not None: return 'gambar'
    if bg.find('.//' + qn('a:gradFill')) is not None: return 'gradasi'
    if bg.find('.//' + qn('a:solidFill')) is not None: return 'warna polos'
    return 'lain'

def transisi(sl):
    t = sl._element.find(qn('p:transition'))
    if t is None:  # transisi bisa terbungkus mc:AlternateContent
        for el in sl._element.iter():
            if el.tag == qn('p:transition'): t = el; break
    if t is None: return None
    return (t[0].tag.split('}')[1] if len(t) else 'ada') + (f" ({t.get('spd')})" if t.get('spd') else '')

warna, font = tema()
profil = {'berkas': os.path.basename(a.referensi), 'ukuran_inci': [inci(prs.slide_width), inci(prs.slide_height)],
          'rasio': round(prs.slide_width / prs.slide_height, 3), 'warna_tema': warna, 'font_tema': font, 'slide': []}
for i, sl in enumerate(prs.slides, 1):
    profil['slide'].append({'no': i, 'layout': sl.slide_layout.name, 'latar': latar(sl), 'transisi': transisi(sl),
                            'animasi': sl._element.find(qn('p:timing')) is not None,
                            'catatan': sl.has_notes_slide and sl.notes_slide.notes_text_frame.text.strip()[:200] or '',
                            'bentuk': bentuk(sl.shapes)})
json.dump(profil, open(os.path.join(a.keluar, 'profil.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

with open(os.path.join(a.keluar, 'peta-bentuk.txt'), 'w', encoding='utf-8') as f:
    f.write(f"{profil['berkas']} · {profil['ukuran_inci'][0]}×{profil['ukuran_inci'][1]} inci · rasio {profil['rasio']}\n")
    f.write('warna tema: ' + ', '.join(f'{k} {v}' for k, v in warna.items()) + '\n')
    f.write('font tema: ' + ', '.join(f'{k} {v}' for k, v in font.items()) + '\n\n')
    for s in profil['slide']:
        f.write(f"── slide {s['no']} · layout '{s['layout']}' · latar {s['latar']} · transisi {s['transisi'] or '-'} · animasi {'ya' if s['animasi'] else 'tidak'}\n")
        for b in s['bentuk']:
            fn = b.get('font') or {}; ket = ' '.join(str(x) for x in (fn.get('pt') and f"{fn['pt']}pt", fn.get('nama'), fn.get('warna'), fn.get('tebal') and 'tebal') if x)
            teks = (b.get('teks') or '').replace('\n', ' ⏎ ')
            f.write(f"   {'  ' if b.get('grup') else ''}'{b['nama']}' [{b['jenis']}] @({b['x']},{b['y']}) {b['w']}×{b['h']}"
                    + (f" ({ket})" if ket else '') + (f" → {teks[:90]}" if teks else '') + (f" · gambar {b['gambar']} {b.get('px')}" if b.get('gambar') else '') + '\n')
        f.write('\n')

peta = {'catatan': 'Kerangka dari bedah_referensi.py. Tiap entri menyalin slide referensi nomor "pola"; ganti teks di "isi".',
        'slide': [{'pola': s['no'], 'tipe': 'sampul' if s['no'] == 1 else ('penutup' if s['no'] == len(profil['slide']) else 'isi'),
                   'isi': {b['nama']: (b['teks'].split('\n') if b.get('paragraf', 1) > 1 else b['teks']) for b in s['bentuk'] if b.get('teks')}}
                  for s in profil['slide']]}
json.dump(peta, open(os.path.join(a.keluar, 'peta-awal.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f"{len(profil['slide'])} slide · {profil['ukuran_inci']} inci → {a.keluar}/profil.json, peta-bentuk.txt, peta-awal.json")

if a.pratinjau:
    if not shutil.which('soffice') or not shutil.which('pdftoppm'): sys.exit('Pratinjau dilewati: soffice/pdftoppm tidak ada.')
    pd = os.path.join(a.keluar, 'pratinjau'); os.makedirs(pd, exist_ok=True)
    subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', pd, a.referensi], capture_output=True, timeout=300)
    pdf = os.path.join(pd, os.path.splitext(os.path.basename(a.referensi))[0] + '.pdf')
    if not os.path.exists(pdf): sys.exit('Pratinjau gagal: soffice tidak bisa membuka .pptx (pasang paket libreoffice-impress).')
    subprocess.run(['pdftoppm', '-r', '60', '-png', pdf, os.path.join(pd, 'slide')], check=True)
    try:
        from PIL import Image
        fs = sorted(x for x in os.listdir(pd) if x.startswith('slide') and x.endswith('.png')); ims = [Image.open(os.path.join(pd, x)) for x in fs]
        w, h = ims[0].size; k = 4; lb = Image.new('RGB', (k * (w + 8), ((len(ims) + k - 1) // k) * (h + 8)), 'white')
        for j, im in enumerate(ims): lb.paste(im, ((j % k) * (w + 8), (j // k) * (h + 8)))
        lb.save(os.path.join(pd, 'lembar-kontak.png')); print('pratinjau:', os.path.join(pd, 'lembar-kontak.png'))
    except ImportError: print('pratinjau:', pd, '(tanpa lembar kontak: Pillow tidak ada)')
