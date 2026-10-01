#!/usr/bin/env python3
"""Kemas tiap skill di skills/ jadi zip/<nama>.zip (berisi folder <nama>/ — format unggah Claude.ai),
plus zip/kaca-cair-semua.zip sebagai arsip gabungan. Jalankan dari akar repo."""
import os, zipfile
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S, Z = os.path.join(AKAR, 'skills'), os.path.join(AKAR, 'zip')
os.makedirs(Z, exist_ok=True)
semua = zipfile.ZipFile(os.path.join(Z, 'kaca-cair-semua.zip'), 'w', zipfile.ZIP_DEFLATED)
for nama in sorted(os.listdir(S)):
    akar = os.path.join(S, nama)
    if not os.path.isfile(os.path.join(akar, 'SKILL.md')): continue
    with zipfile.ZipFile(os.path.join(Z, nama + '.zip'), 'w', zipfile.ZIP_DEFLATED) as z:
        for d, _, fs in os.walk(akar):
            for f in sorted(fs):
                if f.endswith('.pyc') or f == '.DS_Store': continue
                p = os.path.join(d, f); arc = os.path.relpath(p, S)
                z.write(p, arc); semua.write(p, arc)
    print(f'{nama}.zip  {os.path.getsize(os.path.join(Z, nama + ".zip")) // 1024} KB')
semua.close(); print('kaca-cair-semua.zip', os.path.getsize(os.path.join(Z, 'kaca-cair-semua.zip')) // 1024, 'KB')
