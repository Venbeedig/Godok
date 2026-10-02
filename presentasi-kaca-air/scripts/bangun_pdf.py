#!/usr/bin/env python3
"""bangun_pdf.py — gabungkan potret keadaan akhir tiap slide menjadi satu PDF (identik layar).
Pakai: python3 scripts/bangun_pdf.py <folder-ekspor> <keluaran.pdf>"""
import json
import pathlib
import sys

from PIL import Image

src = pathlib.Path(sys.argv[1])
out = pathlib.Path(sys.argv[2])
tata = json.loads((src / 'tata.json').read_text(encoding='utf-8'))
hal = [Image.open(src / s['penuh']).convert('RGB') for s in tata['slides']]
out.parent.mkdir(parents=True, exist_ok=True)
hal[0].save(out, save_all=True, append_images=hal[1:], resolution=144, quality=90)
print(f'{out}  ({out.stat().st_size / 1024 / 1024:.1f} MB, {len(hal)} halaman)')
