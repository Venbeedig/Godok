/* ==========================================================
   KC LATAR HOLO-PAGI — bank 24 latar tambahan untuk mesin kaca cair:
   12 Holografik (keluarga "holo") + 12 Aurora Pagi (keluarga "pagi").
   Dimuat SESUDAH kc-latar.js. Latar didaftarkan ke KC.latar.daftar,
   lalu KC.latar.pasang dibungkus supaya lapisan baru (ekstra) ikut dibangun.
   Pakai seperti latar biasa: <section class="slide" data-latar="holo-foil">
   Semua acakan memakai PRNG berbiji dari id latar (tanpa Math.random).
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  if (!KC.latar) { console.error('kc-latar-hp.js harus dimuat sesudah kc-latar.js'); return; }
  const NS = 'http://www.w3.org/2000/svg';
  const benih = s => { let h = 1779033703 ^ s.length; for (const c of s) { h = Math.imul(h ^ c.charCodeAt(0), 3432918353); h = h << 13 | h >>> 19; } return h >>> 0; };
  const prng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const svgUri = s => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
  const el = (tag, cls, css) => { const e = document.createElement(tag); if (cls) e.className = cls; if (css) e.style.cssText = css; return e; };

  const PELANGI = ['#ffd1f0', '#c7d2fe', '#a5f3fc', '#bbf7d0', '#fef08a', '#fecaca', '#f5d0fe'];

  /* ---------- 24 latar ----------
     lapis : jenis lapisan bawaan kc-latar.js (pita, ombak, tekstur, bokeh, bintang, gel …)
     ekstra: jenis lapisan baru di file ini (lihat LAPIS di bawah) */
  const D = {
  /* ===== A. HOLOGRAFIK — kilau pelangi seperti stiker hologram, kaca bening ===== */
  'holo-klasik':{nama:'Holo Klasik',kel:'holo',mode:'terang',kaca:'bening',aksen:'#7c3aed',aksen2:'#0891b2',
    dasar:'linear-gradient(135deg,#fdf4ff,#ecfeff)',gumpal:[],lapis:[],
    ekstra:[['kerucut',{warna:PELANGI,o:.85,d:50,b:70}],['kilap',{o:.5,d:9}],['butir',{o:.1}]]},
  'holo-foil':{nama:'Foil Hologram',kel:'holo',mode:'terang',kaca:'bening',aksen:'#6d28d9',aksen2:'#db2777',
    dasar:'linear-gradient(120deg,#f5f3ff,#fdf2f8 50%,#ecfeff)',
    gumpal:[[-8,-14,900,600,'#f0abfc',.45],[62,50,900,600,'#99f6e4',.45]],lapis:[],
    ekstra:[['foil',{o:.55,d:16,sudut:115,warna:['#ffc8ee','#c9c3ff','#a8ecff','#c4f7d0','#fff2a8','#ffc8ee']}],['kilap',{o:.55,d:7,sudut:120}],['butir',{o:.12}]]},
  'holo-prisma':{nama:'Berkas Prisma',kel:'holo',mode:'terang',kaca:'bening',aksen:'#4338ca',aksen2:'#0e7490',
    dasar:'linear-gradient(160deg,#ffffff 0%,#f4f6ff 55%,#eef9ff 100%)',
    gumpal:[[60,-10,900,560,'#e0e7ff',.7],[-10,60,900,560,'#fae8ff',.6]],lapis:[],
    ekstra:[['berkas',{n:6,o:.55,d:26,warna:['#ff9ad5','#ffd36e','#8ef0c0','#86c5ff','#c39bff','#ff9a9a']}],['kilap',{o:.35,d:11}],['butir',{o:.08}]]},
  'holo-opal':{nama:'Opal Susu',kel:'holo',mode:'terang',kaca:'susu',aksen:'#0f766e',aksen2:'#9333ea',
    dasar:'linear-gradient(180deg,#fbfaff 0%,#f3f6fb 60%,#eef3f8 100%)',
    gumpal:[[-10,-14,1000,620,'#e9e3ff',.75],[58,40,1000,600,'#dcfce7',.6]],lapis:[],
    ekstra:[['opal',{n:26,o:.6,warna:['#a5f3fc','#f9a8d4','#c4b5fd','#86efac','#fde68a']}],['butir',{o:.12}]]},
  'holo-mutiara':{nama:'Mutiara',kel:'holo',mode:'terang',kaca:'susu',aksen:'#9d174d',aksen2:'#1d4ed8',teks:'#1d1a22',
    dasar:'linear-gradient(170deg,#fffdfb 0%,#f7f2f6 50%,#eef1f8 100%)',
    gumpal:[[-10,-16,1000,620,'#fde4ef',.8],[60,-10,950,600,'#e0ecff',.8],[20,56,1100,520,'#fff4e0',.6]],
    lapis:[['pita',{y:420,a:120,t:150,c:'rgba(255,214,236,.7)',o:.45,d:95}],['pita',{y:690,a:100,t:130,c:'rgba(206,224,255,.75)',o:.4,d:120,dl:-40}]],
    ekstra:[['kilap',{o:.4,d:12,sudut:100}],['butir',{o:.1}]]},
  'holo-kristal':{nama:'Kristal Faset',kel:'holo',mode:'terang',kaca:'bening',aksen:'#5b21b6',aksen2:'#0369a1',
    dasar:'linear-gradient(140deg,#f8fafc,#f5f3ff 50%,#ecfeff)',
    gumpal:[[-10,-14,900,600,'#ddd6fe',.7],[60,46,950,620,'#bae6fd',.7],[30,10,700,500,'#fbcfe8',.5]],lapis:[],
    ekstra:[['faset',{o:.55,d:18}],['kilap',{o:.45,d:8,sudut:135}],['butir',{o:.08}]]},
  'holo-cakram':{nama:'Cakram Pelangi',kel:'holo',mode:'terang',kaca:'bening',aksen:'#7e22ce',aksen2:'#0f766e',
    dasar:'linear-gradient(135deg,#f8fafc,#f1f5f9)',gumpal:[[-10,-10,900,600,'#e9d5ff',.6]],lapis:[],
    ekstra:[['cakram',{o:.6,d:60,x:'78%',y:'82%'}],['kerucut',{warna:PELANGI,o:.35,d:80,b:90,arah:-1}],['butir',{o:.08}]]},
  'holo-sabun':{nama:'Lapisan Sabun',kel:'holo',mode:'terang',kaca:'bening',aksen:'#be185d',aksen2:'#1d4ed8',
    dasar:'linear-gradient(160deg,#eef8ff 0%,#f7f0ff 50%,#fff0f8 100%)',
    gumpal:[[-10,-16,1000,600,'#c7ecff',.7],[60,-8,950,600,'#f5d0fe',.6]],lapis:[['gel',{n:7}]],
    ekstra:[['marmer',{o:.32,d:40}],['butir',{o:.08}]]},
  'holo-krom':{nama:'Krom Cair',kel:'holo',mode:'terang',kaca:'es',aksen:'#1e40af',aksen2:'#9d174d',teks:'#0f1626',teks2:'rgba(15,22,38,.66)',bayang:'30,40,70',
    dasar:'linear-gradient(180deg,#f1f4f8 0%,#dfe4ec 45%,#f4f6f9 60%,#cfd6e1 100%)',gumpal:[],lapis:[],
    ekstra:[['krom',{o:.7,d:22}],['kerucut',{warna:PELANGI,o:.28,d:60,b:110}],['kilap',{o:.6,d:6,sudut:110}],['butir',{o:.08}]]},
  'holo-senja':{nama:'Holo Senja',kel:'holo',mode:'terang',kaca:'susu',aksen:'#c2410c',aksen2:'#be185d',teks:'#24130f',teks2:'rgba(36,19,15,.64)',bayang:'90,40,30',
    dasar:'linear-gradient(150deg,#fff1e6,#ffe4ef 55%,#fff5d6)',gumpal:[[-10,-12,950,600,'#ffc9a9',.7],[62,50,950,600,'#ffc2dc',.6]],lapis:[],
    ekstra:[['kerucut',{warna:['#ffd6b8','#ffc2dc','#ffe7a3','#ffd0f0','#fbbf9a','#ffd6b8'],o:.75,d:55,b:70}],['foil',{o:.25,d:20,sudut:100,warna:['#ffd6b8','#ffc2dc','#fff1b0','#ffd6b8']}],['butir',{o:.1}]]},
  'holo-malam':{nama:'Holo Malam',kel:'holo',mode:'gelap',kaca:'asap',aksen:'#f0abfc',aksen2:'#67e8f9',
    dasar:'radial-gradient(120% 90% at 50% 40%,#1c1a3f 0%,#0e0d26 60%,#06060f 100%)',
    gumpal:[[-10,-10,900,600,'#7c3aed',.35],[60,50,900,600,'#0e7490',.35]],lapis:[['bintang',{n:90}]],
    ekstra:[['kerucut',{warna:['#f0abfc','#a5b4fc','#67e8f9','#86efac','#fde68a','#fda4af','#f0abfc'],o:.32,d:60,b:90,mb:'screen'}],['foil',{o:.14,d:18,sudut:120,warna:['#f0abfc','#67e8f9','#86efac','#f0abfc'],mb:'screen'}],['butir',{o:.12}]]},
  'holo-mint':{nama:'Holo Mint',kel:'holo',mode:'terang',kaca:'bening',aksen:'#047857',aksen2:'#6d28d9',teks:'#0f1f1a',teks2:'rgba(15,31,26,.64)',bayang:'20,60,50',
    dasar:'linear-gradient(140deg,#effdf7,#f3f0ff 55%,#ecfeff)',gumpal:[[-10,-14,950,600,'#a7f3d0',.6],[62,48,950,600,'#ddd6fe',.6]],lapis:[],
    ekstra:[['kerucut',{warna:['#a7f3d0','#bae6fd','#ddd6fe','#bbf7d0','#cffafe','#a7f3d0'],o:.8,d:48,b:70}],['kilap',{o:.45,d:10}],['butir',{o:.09}]]},

  /* ===== B. AURORA PAGI — hangat, terang, matahari baru terbit, kaca susu ===== */
  'pagi-fajar':{nama:'Fajar',kel:'pagi',mode:'terang',kaca:'susu',aksen:'#c2410c',aksen2:'#1d4ed8',teks:'#1f1410',teks2:'rgba(31,20,16,.64)',bayang:'90,50,30',
    dasar:'linear-gradient(180deg,#cfe3ff 0%,#e8eefc 35%,#ffe9da 70%,#ffd2b3 100%)',
    gumpal:[[-10,-18,1000,600,'#b9d8ff',.7],[60,-14,950,600,'#dcd2ff',.6],[24,60,1100,520,'#ffc79e',.7]],
    lapis:[['pita',{y:430,a:110,t:150,c:'rgba(255,255,255,.75)',o:.45,d:90}]],
    ekstra:[['mentari',{x:'50%',y:'104%',s:900,c:'#fff3c4',c2:'#ffb07a',d:30}],['butir',{o:.09}]]},
  'pagi-mentari':{nama:'Sinar Mentari',kel:'pagi',mode:'terang',kaca:'susu',aksen:'#b45309',aksen2:'#2563eb',teks:'#1f160b',teks2:'rgba(31,22,11,.64)',bayang:'90,60,20',
    dasar:'linear-gradient(170deg,#fff6e0 0%,#fff0e6 45%,#e6f0ff 100%)',
    gumpal:[[-8,-18,950,600,'#ffd9a0',.75],[62,40,950,600,'#bcd9ff',.6]],lapis:[],
    ekstra:[['sinar',{x:'12%',y:'8%',o:.45,d:120,c:'rgba(255,236,170,.9)'}],['mentari',{x:'12%',y:'8%',s:620,c:'#fffbe8',c2:'#ffd27a',d:24}],['butir',{o:.08}]]},
  'pagi-embun':{nama:'Embun Pagi',kel:'pagi',mode:'terang',kaca:'embun',aksen:'#15803d',aksen2:'#0369a1',teks:'#132019',teks2:'rgba(19,32,25,.64)',bayang:'30,60,45',
    dasar:'linear-gradient(180deg,#eef6f3 0%,#e6f0ee 50%,#fdf3e7 100%)',
    gumpal:[[-10,-14,1000,600,'#ffffff',.85],[60,44,1000,600,'#cde8d8',.6],[10,70,900,500,'#ffe4cc',.55]],
    lapis:[['tekstur',{jenis:'kabut',o:.6,d:70,tx:'7%',ty:'2%'}]],
    ekstra:[['debu',{n:26,c:'rgba(255,255,255,.95)',besar:1}],['butir',{o:.1}]]},
  'pagi-langit':{nama:'Langit Pagi',kel:'pagi',mode:'terang',kaca:'susu',aksen:'#1d4ed8',aksen2:'#e11d48',teks:'#0b1a33',teks2:'rgba(11,26,51,.66)',bayang:'20,40,90',
    dasar:'linear-gradient(180deg,#9ccbff 0%,#c4e0ff 40%,#eef6ff 75%,#fff2e2 100%)',
    gumpal:[[-10,-18,1000,600,'#a7c8ff',.7],[62,-10,950,600,'#d8ccff',.55],[20,60,1100,500,'#ffe2c4',.55]],
    lapis:[['pita',{y:360,a:140,t:170,c:'rgba(255,255,255,.85)',o:.5,d:80}],['pita',{y:640,a:110,t:140,c:'rgba(255,226,200,.85)',o:.45,d:110,dl:-35}],['butir',{o:.07}]],ekstra:[]},
  'pagi-sakura':{nama:'Sakura Pagi',kel:'pagi',mode:'terang',kaca:'susu',aksen:'#be185d',aksen2:'#7c3aed',teks:'#24111b',teks2:'rgba(36,17,27,.64)',bayang:'100,40,70',
    dasar:'linear-gradient(170deg,#fff0f5 0%,#fff6f1 45%,#f1ecff 100%)',
    gumpal:[[-8,-16,1000,600,'#ffc6da',.75],[60,-12,950,600,'#e7d6ff',.65],[24,58,1100,520,'#ffe3cf',.6]],
    lapis:[['pita',{y:520,a:110,t:150,c:'rgba(255,255,255,.8)',o:.45,d:90}]],
    ekstra:[['kelopak',{n:16,warna:['#ffc1d6','#ffd6e5','#ffb3cb','#fbcfe8']}],['butir',{o:.08}]]},
  'pagi-jeruk':{nama:'Jeruk Pagi',kel:'pagi',mode:'terang',kaca:'susu',aksen:'#c2410c',aksen2:'#047857',teks:'#22160a',teks2:'rgba(34,22,10,.64)',bayang:'100,60,20',
    dasar:'linear-gradient(160deg,#fff4dc 0%,#ffeede 45%,#fff9e6 100%)',
    gumpal:[[-10,-16,1000,620,'#ffc26b',.65],[58,-10,950,600,'#ffe27a',.6],[22,56,1100,520,'#b8f0c4',.45],[68,62,900,520,'#ffb39a',.55]],
    lapis:[['pita',{y:480,a:120,t:160,c:'rgba(255,255,255,.75)',o:.45,d:85}]],ekstra:[['kilap',{o:.35,d:12}],['butir',{o:.09}]]},
  'pagi-lavender':{nama:'Ladang Lavender',kel:'pagi',mode:'terang',kaca:'susu',aksen:'#6d28d9',aksen2:'#c2410c',teks:'#1b1430',teks2:'rgba(27,20,48,.64)',bayang:'60,40,110',
    dasar:'linear-gradient(180deg,#ffe8d9 0%,#f3e8ff 40%,#e2d9ff 100%)',
    gumpal:[[-10,-16,1000,600,'#ffd2b8',.65],[60,40,1000,600,'#c9b6ff',.7],[-10,66,1100,540,'#d8c8ff',.7]],
    lapis:[['tekstur',{jenis:'kabut',o:.4,d:80,tx:'6%',ty:'1%'}]],ekstra:[['gunung',{warna:['rgba(200,180,255,.55)','rgba(170,145,240,.6)','rgba(140,110,220,.55)'],tinggi:.3}],['butir',{o:.08}]]},
  'pagi-pantai':{nama:'Pantai Pagi',kel:'pagi',mode:'terang',kaca:'susu',aksen:'#0369a1',aksen2:'#c2410c',teks:'#0a1d2c',teks2:'rgba(10,29,44,.64)',bayang:'10,50,80',
    dasar:'linear-gradient(180deg,#ffe3cc 0%,#fff1e2 34%,#dff1ff 60%,#bfe6ff 100%)',
    gumpal:[[-10,-16,1000,600,'#ffc9a6',.7],[60,-12,950,560,'#ffe6a8',.55]],
    lapis:[['ombak',{h:30,a:34,c:'rgba(150,215,250,.55)',d:30}],['ombak',{h:22,a:28,c:'rgba(90,185,240,.5)',d:22,dl:-8}],['ombak',{h:14,a:22,c:'rgba(255,255,255,.55)',d:16,dl:-4}]],
    ekstra:[['mentari',{x:'72%',y:'66%',s:520,c:'#fff8e0',c2:'#ffc58a',d:28}],['butir',{o:.07}]]},
  'pagi-gunung':{nama:'Gunung Berkabut',kel:'pagi',mode:'terang',kaca:'embun',aksen:'#0f766e',aksen2:'#b45309',teks:'#10201e',teks2:'rgba(16,32,30,.64)',bayang:'30,60,60',
    dasar:'linear-gradient(180deg,#ffe6d2 0%,#fdf0e6 35%,#e3eef0 70%,#d5e6e6 100%)',
    gumpal:[[-10,-18,1000,600,'#ffd0b0',.65],[60,-14,950,600,'#fff0c8',.6]],lapis:[],
    ekstra:[['mentari',{x:'30%',y:'52%',s:420,c:'#fffaf0',c2:'#ffd2a8',d:30}],['gunung',{warna:['rgba(175,205,205,.75)','rgba(140,180,180,.75)','rgba(110,155,155,.7)'],tinggi:.42}],['kabut',{o:.65}],['butir',{o:.08}]]},
  'pagi-jendela':{nama:'Cahaya Jendela',kel:'pagi',mode:'terang',kaca:'susu',aksen:'#a16207',aksen2:'#1d4ed8',teks:'#1d170c',teks2:'rgba(29,23,12,.64)',bayang:'80,60,20',
    dasar:'linear-gradient(150deg,#fff8ec 0%,#fbefe2 55%,#efe7dd 100%)',
    gumpal:[[-10,-16,1000,600,'#ffe2b0',.7],[60,46,950,600,'#e8dcff',.45]],lapis:[],
    ekstra:[['cahaya',{o:.55,d:14,sudut:-24}],['debu',{n:34,c:'rgba(255,240,200,.95)'}],['butir',{o:.1}]]},
  'pagi-madu':{nama:'Madu Pagi',kel:'pagi',mode:'terang',kaca:'susu',aksen:'#b45309',aksen2:'#9d174d',teks:'#21170a',teks2:'rgba(33,23,10,.64)',bayang:'100,70,20',
    dasar:'linear-gradient(170deg,#fff7df 0%,#ffefcc 45%,#ffe6d6 100%)',
    gumpal:[[-10,-16,1000,620,'#ffd77a',.7],[60,-10,950,600,'#ffc3a0',.6],[22,56,1100,520,'#fff0b8',.7]],
    lapis:[['pita',{y:500,a:130,t:170,c:'rgba(255,250,235,.85)',o:.5,d:95}]],ekstra:[['opal',{n:14,o:.35,warna:['#ffe7a3','#ffd2a8','#fff6d6']}],['butir',{o:.1}]]},
  'pagi-pelangi':{nama:'Pelangi Pagi',kel:'pagi',mode:'terang',kaca:'susu',aksen:'#1d4ed8',aksen2:'#be185d',teks:'#0f172a',teks2:'rgba(15,23,42,.64)',bayang:'30,40,80',
    dasar:'linear-gradient(180deg,#d8ebff 0%,#eef5ff 45%,#fff3e8 100%)',
    gumpal:[[-10,-16,1000,600,'#c7dfff',.7],[60,46,950,600,'#ffe1cc',.6]],lapis:[['tekstur',{jenis:'awan',o:.55,d:110,tx:'8%',ty:'1%'}]],
    ekstra:[['pelangi',{x:'50%',y:'118%',s:2300,o:.55}],['butir',{o:.07}]]}
  };

  /* ---------- lapisan baru ---------- */
  const tumpuk = w => w.join(',');
  const LAPIS = {
    /* kerucut warna berputar (inti holografik) */
    kerucut(L, o) { L.append(el('i', 'hp-kerucut', `background:conic-gradient(from 0deg,${tumpuk(o.warna)});--o:${o.o};--d:${o.d}s;--b:${o.b || 70}px;--arah:${o.arah === -1 ? 'reverse' : 'normal'};mix-blend-mode:${o.mb || 'normal'}`)); },
    /* foil: pita pelangi diagonal yang bergeser seperti stiker hologram dimiringkan */
    foil(L, o) { const w = o.warna, st = w.map((c, i) => `${c} ${(i * 100 / (w.length - 1)).toFixed(1)}%`).join(',');
      L.append(el('i', 'hp-foil', `background:linear-gradient(${o.sudut || 115}deg,${st});background-size:300% 300%;--o:${o.o};--d:${o.d}s;mix-blend-mode:${o.mb || 'soft-light'}`)); },
    /* kilap: satu sapuan cahaya putih lewat berkala */
    kilap(L, o) { L.append(el('i', 'hp-kilap', `--o:${o.o};--d:${o.d}s;--sudut:${o.sudut || 115}deg`)); },
    /* berkas prisma: balok cahaya pelangi miring yang bergeser pelan */
    berkas(L, o, r) { for (let i = 0; i < o.n; i++) { const c = o.warna[i % o.warna.length];
      L.append(el('i', 'hp-berkas', `left:${(-10 + i * (110 / o.n) + r() * 6).toFixed(1)}%;width:${(140 + r() * 160) | 0}px;--c:${c};--o:${(o.o * (.6 + r() * .5)).toFixed(2)};--rot:${(22 + r() * 10).toFixed(1)}deg;--d:${(o.d * (.8 + r() * .5)).toFixed(1)}s;--dl:${(-r() * o.d).toFixed(1)}s;--tx:${(40 + r() * 80) | 0}px`)); } },
    /* opal: serpih warna lembut yang berganti rona */
    opal(L, o, r) { const w = el('i', 'hp-opal', `--o:${o.o}`); for (let i = 0; i < o.n; i++) { const s = (60 + r() * 220) | 0;
      w.append(el('i', '', `width:${s}px;height:${(s * (.5 + r() * .6)) | 0}px;left:${(r() * 1920 - s / 2) | 0}px;top:${(r() * 1080 - s / 2) | 0}px;background:${o.warna[i % o.warna.length]};--rot:${(r() * 180) | 0}deg;--d:${(10 + r() * 14).toFixed(1)}s;--dl:${(-r() * 20).toFixed(1)}s`)); } L.append(w); },
    /* faset kristal: segitiga SVG berbiji, ronanya berputar */
    faset(L, o, r) { const p = []; const K = 9, B = 6, w = 1920 / K, h = 1080 / B, titik = [];
      for (let y = 0; y <= B; y++) for (let x = 0; x <= K; x++) titik.push([x * w + (x && x < K ? (r() - .5) * w * .7 : 0), y * h + (y && y < B ? (r() - .5) * h * .7 : 0)]);
      const T = (x, y) => titik[y * (K + 1) + x];
      for (let y = 0; y < B; y++) for (let x = 0; x < K; x++) { const a = T(x, y), b = T(x + 1, y), c = T(x, y + 1), d = T(x + 1, y + 1);
        for (const [u, v, z] of [[a, b, d], [a, d, c]]) { const l = (30 + r() * 70) | 0;
          p.push(`<path d="M${u[0] | 0} ${u[1] | 0}L${v[0] | 0} ${v[1] | 0}L${z[0] | 0} ${z[1] | 0}Z" fill="hsl(${(r() * 360) | 0} 90% ${70 + l * .25}%)" fill-opacity="${(.25 + r() * .5).toFixed(2)}" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>`); } }
      L.append(el('i', 'hp-faset', `background-image:${svgUri(`<svg xmlns="${NS}" viewBox="0 0 1920 1080" width="1920" height="1080">${p.join('')}</svg>`)};--o:${o.o};--d:${o.d}s`)); },
    /* cakram: cincin pelangi seperti permukaan CD */
    cakram(L, o) { L.append(el('i', 'hp-cakram', `--o:${o.o};--d:${o.d}s;--x:${o.x || '50%'};--y:${o.y || '50%'}`)); },
    /* marmer: pusaran warna seperti lapisan sabun */
    marmer(L, o) { L.append(el('i', 'hp-marmer', `background-image:${svgUri(`<svg xmlns="${NS}" width="1000" height="1000"><filter id="f" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency=".0028 .0042" numOctaves="2" seed="5" stitchTiles="stitch"/><feColorMatrix type="saturate" values="2.4"/><feComponentTransfer><feFuncA type="linear" slope="0" intercept="1"/></feComponentTransfer></filter><rect width="1000" height="1000" filter="url(#f)"/></svg>`)};--o:${o.o};--d:${o.d}s`)); },
    /* krom: pita perak cair */
    krom(L, o) { L.append(el('i', 'hp-krom', `--o:${o.o};--d:${o.d}s`)); },
    /* mentari: bola cahaya terbit pelan */
    mentari(L, o) { L.append(el('i', 'hp-mentari', `left:${o.x};top:${o.y};--s:${o.s}px;--c:${o.c};--c2:${o.c2};--d:${o.d}s`)); },
    /* sinar: jari-jari cahaya berputar sangat pelan */
    sinar(L, o) { L.append(el('i', 'hp-sinar', `left:${o.x};top:${o.y};--o:${o.o};--d:${o.d}s;--c:${o.c}`)); },
    /* kelopak: kelopak bunga gugur melayang */
    kelopak(L, o, r) { for (let i = 0; i < o.n; i++) { const s = (22 + r() * 30) | 0;
      L.append(el('i', 'hp-kelopak', `--s:${s}px;left:${(r() * 1880) | 0}px;--c:${o.warna[i % o.warna.length]};--d:${(16 + r() * 14).toFixed(1)}s;--dl:${(-r() * 30).toFixed(1)}s;--sw:${(60 + r() * 120) | 0}px;--rot:${(r() * 360) | 0}deg`)); } },
    /* gunung: siluet berlapis (SVG berbiji) */
    gunung(L, o, r) { const n = o.warna.length, H = 1080, lapis = [];
      for (let k = 0; k < n; k++) { const dasar = H * (1 - o.tinggi + k * o.tinggi * .28), pts = [];
        for (let x = 0; x <= 1920; x += 120) pts.push(`${x} ${(dasar - (Math.sin(x / (260 + k * 70) + k * 2) * .5 + .5) * (120 - k * 22) - r() * 50).toFixed(0)}`);
        lapis.push(`<path d="M0 ${H}L${pts.join('L')}L1920 ${H}Z" fill="${o.warna[k]}"/>`); }
      L.append(el('i', 'hp-gunung', `background-image:${svgUri(`<svg xmlns="${NS}" viewBox="0 0 1920 1080" width="1920" height="1080" preserveAspectRatio="none">${lapis.join('')}</svg>`)}`)); },
    /* kabut tipis di kaki gunung */
    kabut(L, o) { L.append(el('i', 'hp-kabut', `--o:${o.o}`)); },
    /* cahaya: berkas sinar jendela miring yang berdenyut */
    cahaya(L, o) { L.append(el('i', 'hp-cahaya', `--o:${o.o};--d:${o.d}s;--sudut:${o.sudut || -24}deg`)); },
    /* debu: titik cahaya kecil yang melayang naik */
    debu(L, o, r) { for (let i = 0; i < o.n; i++) { const s = (o.besar ? 6 : 3) + r() * (o.besar ? 10 : 5);
      L.append(el('i', 'hp-debu', `--s:${s.toFixed(1)}px;left:${(r() * 1920) | 0}px;top:${(r() * 1080) | 0}px;--c:${o.c};--d:${(14 + r() * 16).toFixed(1)}s;--dl:${(-r() * 20).toFixed(1)}s;--tx:${((r() - .5) * 160) | 0}px;--ty:${(-80 - r() * 160) | 0}px`)); } },
    /* pelangi: busur lembut */
    pelangi(L, o) { L.append(el('i', 'hp-pelangi', `left:${o.x};top:${o.y};--s:${o.s}px;--o:${o.o}`)); },
    butir(L, o) { L.append(el('i', 'lt-butir', `--o:${o.o}`)); }
  };

  /* ---------- daftarkan & bungkus pembangun ---------- */
  Object.assign(KC.latar.daftar, D);
  const asli = KC.latar.pasang;
  KC.latar.pasang = (wadah, id) => {
    const tok = asli(wadah, id), c = D[id];
    if (c && c.ekstra) { const r = prng(benih(id + '+hp')); for (const [jenis, o] of c.ekstra) LAPIS[jenis](wadah, o, r); }
    return tok;
  };
  KC.latarHP = { daftar: D, holo: Object.keys(D).filter(k => D[k].kel === 'holo'), pagi: Object.keys(D).filter(k => D[k].kel === 'pagi') };
})(window.KC);
