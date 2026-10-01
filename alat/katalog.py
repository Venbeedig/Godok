#!/usr/bin/env python3
"""Buat katalog-latar.html: 24 latar kaca cair dalam satu halaman (pratinjau diam, klik = layar penuh bergerak).
Pakai: python3 katalog.py <folder-aset> <keluaran.html>"""
import os, sys
D = sys.argv[1]; baca = lambda f: open(os.path.join(D, f), encoding='utf-8').read()
keluar = sys.argv[2]
css = baca('kc-material.css') + baca('kc-latar.css')
js = baca('kc-inti.js') + baca('kc-latar.js')
html = f"""<!doctype html><html lang="id" data-tingkat="penuh"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Katalog Latar Kaca Cair</title>
<style>{css}
html,body{{overflow:auto;height:auto;background:#101018;color:#eee;font-family:var(--kc-font)}}
main{{max-width:1500px;margin:0 auto;padding:40px 24px 80px}}
h1{{font-size:44px;letter-spacing:-.03em;margin:0 0 6px}} p.k{{color:#aab;margin:0 0 30px;font-size:17px}}
h2{{font-size:15px;letter-spacing:.24em;text-transform:uppercase;color:#99a;margin:34px 0 14px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}}
.ubin{{cursor:pointer;border-radius:18px;overflow:hidden;background:#1b1b26;border:1px solid #2a2a38;transition:transform .3s}}
.ubin:hover{{transform:translateY(-3px)}}
.mini{{position:relative;aspect-ratio:16/9;overflow:hidden}}
.mini .dek{{position:absolute;left:0;top:0;transform-origin:0 0}}
.mini .dek *{{animation-play-state:paused!important}}
.mini .kaca{{position:absolute;left:560px;top:330px;width:800px;height:420px;display:grid;place-items:center}}
.ket{{display:flex;justify-content:space-between;padding:12px 16px;font-size:15px}} .ket code{{color:#8fa;font-size:13px}}
#layar{{position:fixed;inset:0;display:none;background:#000;z-index:9}} #layar.buka{{display:block}}
#layar .dek{{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(var(--s))}}
#layar .kaca{{position:absolute;left:510px;top:330px;width:900px;height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}}
#tutup{{position:fixed;right:20px;top:16px;z-index:10;display:none;font:600 16px var(--kc-font);padding:10px 18px;border-radius:99px;border:0;cursor:pointer}}
#layar.buka + #tutup{{display:block}}
</style></head><body>{baca('kc-filter.html')}
<main><h1>Katalog Latar Kaca Cair</h1><p class="k">24 latar · 4 keluarga · semua murni CSS/SVG. Klik untuk melihat bergerak di layar penuh (Esc untuk menutup). Pakai id-nya di <code>data-latar</code>.</p><div id="isi"></div></main>
<div id="layar"></div><button id="tutup">Tutup ✕</button>
<script>{js}
const KEL={{aurora:'A · Aurora pastel',neon:'B · Malam / neon',air:'C · Alam & air',mesh:'D · Abstrak & mesh'}};
const kartu=(id,dek)=>{{const t=KC.latar.pasang(dek.firstChild,id);for(const k in t)dek.style.setProperty(k,t[k]);dek.dataset.kaca=KC.latar.kaca(id);}};
const buatDek=(id,teks)=>{{const d=document.createElement('div');d.className='dek';d.append(document.createElement('div'));kartu(id,d);
  d.insertAdjacentHTML('beforeend',`<div class="kaca"><div class="t-label">${{KC.latar.daftar[id].nama}}</div><div class="t-judul">${{teks}}</div></div>`);return d;}};
for(const k in KEL){{const h=document.createElement('h2');h.textContent=KEL[k];isi.append(h);const g=document.createElement('div');g.className='grid';isi.append(g);
  for(const id of KC.latar.keluarga(k)){{const u=document.createElement('div');u.className='ubin';const m=document.createElement('div');m.className='mini';
    const d=buatDek(id,'Kaca Cair.');m.append(d);u.append(m);u.insertAdjacentHTML('beforeend',`<div class="ket"><b>${{KC.latar.daftar[id].nama}}</b><code>${{id}}</code></div>`);g.append(u);
    new ResizeObserver(()=>d.style.transform=`scale(${{m.clientWidth/1920}})`).observe(m);
    u.onclick=()=>{{layar.textContent='';const b=buatDek(id,'Kaca Cair.');layar.append(b);layar.style.setProperty('--s',Math.min(innerWidth/1920,innerHeight/1080));layar.classList.add('buka');}};}}}}
const tutupLayar=()=>{{layar.classList.remove('buka');layar.textContent='';}};tutup.onclick=tutupLayar;addEventListener('keydown',e=>{{if(e.key==='Escape')tutupLayar();}});
</script></body></html>"""
open(keluar, 'w', encoding='utf-8').write(html); print(keluar, len(html)//1024, 'KB')
