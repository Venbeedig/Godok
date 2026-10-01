/* ==========================================================
   KC LATAR — pembangun 24 latar + token warna per latar
   Pakai: const token = KC.latar.pasang(elemen, 'aurora-lavender')
   Semua acakan memakai PRNG berbiji: tampilan sama tiap dibuka.
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  const NS='http://www.w3.org/2000/svg';
  const benih=s=>{let h=1779033703^s.length;for(const c of s){h=Math.imul(h^c.charCodeAt(0),3432918353);h=h<<13|h>>>19}return h>>>0};
  const prng=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const svgUri=s=>`url("data:image/svg+xml,${encodeURIComponent(s)}")`;

  /* ---------- tekstur turbulensi (dirender browser sekali, lalu digeser) ---------- */
  const TEKSTUR={
    kaustik:(c='255,255,255')=>svgUri(`<svg xmlns="${NS}" width="900" height="900"><filter id="f" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency=".0065 .009" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${c.split(',')[0]/255} 0 0 0 0 ${c.split(',')[1]/255} 0 0 0 0 ${c.split(',')[2]/255} -7 0 0 0 1.55"/></filter><rect width="900" height="900" filter="url(#f)"/></svg>`),
    awan:()=>svgUri(`<svg xmlns="${NS}" width="1200" height="1200"><filter id="f" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".0032" numOctaves="5" seed="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2.6 0 0 0 -1.05"/></filter><rect width="1200" height="1200" filter="url(#f)"/></svg>`),
    kabut:()=>svgUri(`<svg xmlns="${NS}" width="1200" height="1200"><filter id="f" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".0018 .0034" numOctaves="3" seed="11" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.9 0 0 0 -.62"/></filter><rect width="1200" height="1200" filter="url(#f)"/></svg>`)
  };

  /* ---------- 24 latar ---------- */
  // gumpal: [x%, y%, lebar px, tinggi px, warna, opacity]
  const D={
  /* ===== AURORA PASTEL (terang, kaca susu) ===== */
  'aurora-lavender':{nama:'Aurora Lavender',kel:'aurora',mode:'terang',kaca:'susu',aksen:'#2f7bff',aksen2:'#7c6cf0',
    dasar:'linear-gradient(180deg,#b6acff 0%,#d8d4f6 30%,#e9e6f4 54%,#d3d9ee 78%,#b3bfe4 100%)',
    gumpal:[[-10,-22,1150,640,'#9786ff',.85],[58,-18,1000,620,'#9fd6ee',.8],[18,30,1250,520,'#f3e3f2',.75],[-12,68,1150,560,'#a7b1ea',.8],[68,58,950,560,'#a6dde3',.65]],
    lapis:[['pita',{y:430,a:130,t:180,c:'rgba(255,255,255,.75)',o:.5,d:80}],['pita',{y:700,a:110,t:140,c:'rgba(200,190,255,.8)',o:.45,d:110,dl:-30}],['butir',{o:.1}]]},
  'aurora-pagi':{nama:'Aurora Pagi',kel:'aurora',mode:'terang',kaca:'susu',aksen:'#ff6a3d',aksen2:'#2f8cff',
    dasar:'linear-gradient(170deg,#ffe3d3 0%,#fff1e6 38%,#e3efff 70%,#cfe3ff 100%)',
    gumpal:[[-8,-20,1000,620,'#ffc3a0',.8],[60,-16,950,600,'#a9d6ff',.8],[24,40,1100,500,'#fff0b8',.7],[70,64,900,520,'#d9c8ff',.65],[-14,70,1000,520,'#ffd6e2',.6]],
    lapis:[['pita',{y:520,a:120,t:160,c:'rgba(255,255,255,.8)',o:.5,d:90}],['butir',{o:.09}]]},
  'aurora-senja':{nama:'Aurora Senja',kel:'aurora',mode:'terang',kaca:'susu',aksen:'#e23d78',aksen2:'#6d3bea',teks:'#1d1230',
    dasar:'linear-gradient(180deg,#ffc6d6 0%,#f6c9ee 30%,#d2bdff 62%,#9fb0ee 100%)',
    gumpal:[[-10,-18,1050,620,'#ff9a8b',.8],[62,-10,950,600,'#f59ad6',.75],[30,36,1150,520,'#ffd3a8',.6],[-12,66,1100,560,'#a78bfa',.7],[66,62,950,560,'#8ea6f0',.7]],
    lapis:[['pita',{y:480,a:140,t:170,c:'rgba(255,236,246,.85)',o:.45,d:85}],['butir',{o:.1}]]},
  'aurora-mint':{nama:'Aurora Mint',kel:'aurora',mode:'terang',kaca:'susu',aksen:'#0ea371',aksen2:'#5b5ff0',
    dasar:'linear-gradient(175deg,#d9f7ec 0%,#e8f8f6 36%,#e6e9ff 72%,#d6dcff 100%)',
    gumpal:[[-10,-18,1050,620,'#97e6c6',.8],[60,-14,1000,600,'#8fd9ea',.75],[24,36,1150,520,'#d9f6a8',.55],[-10,66,1050,540,'#c9b8ff',.7],[68,60,950,540,'#a8e8d8',.7]],
    lapis:[['pita',{y:560,a:120,t:150,c:'rgba(255,255,255,.8)',o:.45,d:95}],['butir',{o:.09}]]},
  'aurora-susu':{nama:'Aurora Susu',kel:'aurora',mode:'terang',kaca:'susu',aksen:'#c8553d',aksen2:'#7a5c48',teks:'#2a211c',teks2:'rgba(42,33,28,.62)',bayang:'90,60,40',
    dasar:'linear-gradient(175deg,#fbf6ef 0%,#f6ece6 45%,#efe4e6 100%)',
    gumpal:[[-10,-18,1000,600,'#f6cdd6',.7],[62,-12,950,580,'#fbe3c0',.75],[22,40,1100,500,'#d6e6d0',.6],[66,62,950,540,'#e2d8f3',.6]],
    lapis:[['butir',{o:.16}]]},
  'aurora-es':{nama:'Aurora Es',kel:'aurora',mode:'terang',kaca:'bening',aksen:'#0477bf',aksen2:'#5b7cff',teks:'#0b1a2b',teks2:'rgba(11,26,43,.62)',bayang:'20,50,90',
    dasar:'linear-gradient(180deg,#e9f4ff 0%,#f6fbff 40%,#dceaf8 100%)',
    gumpal:[[-10,-20,1050,620,'#bfe2ff',.85],[60,-14,1000,600,'#c8f1f5',.8],[22,38,1150,520,'#ffffff',.9],[-10,66,1050,540,'#c9d3ff',.75],[68,60,950,540,'#b8e6ff',.7]],
    lapis:[['pita',{y:500,a:120,t:150,c:'rgba(255,255,255,.95)',o:.6,d:100}],['butir',{o:.07}]]},

  /* ===== MALAM / NEON (gelap, kaca asap/es) ===== */
  'neon-kota':{nama:'Neon Kota',kel:'neon',mode:'gelap',kaca:'asap',aksen:'#ff4fd8',aksen2:'#22d3ee',
    dasar:'radial-gradient(120% 90% at 50% 110%,#1b1450 0%,#0b0b25 55%,#05060f 100%)',
    gumpal:[[-12,-16,900,620,'#ff2fb3',.5],[64,-12,900,600,'#00d9ff',.42],[30,50,1000,560,'#6d28d9',.55],[70,70,800,520,'#1d4ed8',.5]],
    lapis:[['bokeh',{n:16,warna:['#ff4fd8','#22d3ee','#a78bfa','#fbbf24'],o:.35}],['butir',{o:.12}]]},
  'neon-ungu':{nama:'Nebula Ungu',kel:'neon',mode:'gelap',kaca:'es',aksen:'#c084fc',aksen2:'#f472b6',
    dasar:'radial-gradient(110% 80% at 40% 40%,#2a0a55 0%,#12052b 55%,#06020f 100%)',
    gumpal:[[-6,-10,1000,700,'#8b5cf6',.55],[56,6,900,640,'#c026d3',.45],[20,58,1100,560,'#4338ca',.55],[72,-8,600,480,'#f472b6',.35]],
    lapis:[['bintang',{n:140}],['butir',{o:.12}]]},
  'neon-sian':{nama:'Sian Laut Malam',kel:'neon',mode:'gelap',kaca:'es',aksen:'#2dd4bf',aksen2:'#38bdf8',
    dasar:'linear-gradient(180deg,#03161a 0%,#021015 60%,#010a0d 100%)',
    gumpal:[[-10,-14,1000,640,'#06b6d4',.45],[60,-6,950,620,'#14b8a6',.42],[22,56,1100,540,'#0ea5e9',.38],[70,64,800,520,'#22c55e',.25]],
    lapis:[['tekstur',{jenis:'kaustik',o:.16,mb:'screen',d:46}],['butir',{o:.12}]]},
  'neon-hujan':{nama:'Hujan Neon',kel:'neon',mode:'gelap',kaca:'asap',aksen:'#ff5c93',aksen2:'#5b7cff',
    dasar:'linear-gradient(180deg,#0b0d17 0%,#121429 60%,#0a0b14 100%)',
    gumpal:[[-10,-10,950,620,'#ff3d7f',.42],[62,-6,950,620,'#3d5afe',.45],[30,60,1000,520,'#00e0ff',.3]],
    lapis:[['hujan',{c:'rgba(170,200,255,.55)',o:.3,d:1.4}],['hujan',{c:'rgba(255,140,190,.45)',o:.2,d:2.1,dl:-.7}],['butir',{o:.12}]]},
  'neon-grid':{nama:'Grid Synthwave',kel:'neon',mode:'gelap',kaca:'asap',aksen:'#ff3864',aksen2:'#2de2e6',
    dasar:'linear-gradient(180deg,#0d0221 0%,#261447 52%,#3c1361 62%,#0d0221 63%,#0d0221 100%)',
    gumpal:[[30,30,1000,360,'#ff3864',.35],[-10,-10,900,500,'#2de2e6',.18]],
    lapis:[['matahari',{y:'14%',s:520}],['kisi',{c:'rgba(255,56,100,.85)',d:2.6}],['bintang',{n:70}],['butir',{o:.1}]]},
  'neon-galaksi':{nama:'Galaksi',kel:'neon',mode:'gelap',kaca:'es',aksen:'#a5b4fc',aksen2:'#f0abfc',
    dasar:'radial-gradient(140% 100% at 70% 30%,#14112e 0%,#07061a 50%,#030208 100%)',
    gumpal:[[50,-6,1100,520,'#7c3aed',.4],[64,24,800,380,'#db2777',.28],[-8,50,900,480,'#0ea5e9',.25]],
    lapis:[['bintang',{n:260}],['butir',{o:.1}]]},

  /* ===== AIR & ALAM ===== */
  'air-kaustik':{nama:'Kolam Kaustik',kel:'air',mode:'terang',kaca:'bening',aksen:'#005f86',aksen2:'#00a3a3',teks:'#04202e',teks2:'rgba(4,32,46,.66)',bayang:'0,60,90',
    dasar:'linear-gradient(180deg,#a6ecf5 0%,#7fdbea 45%,#62c9df 100%)',
    gumpal:[[-10,-14,1000,620,'#c8f6fb',.7],[60,50,1000,600,'#4fbfd8',.55]],
    lapis:[['tekstur',{jenis:'kaustik',o:.55,mb:'soft-light',d:38,tx:'5%',ty:'4%'}],['tekstur',{jenis:'kaustik',o:.35,mb:'overlay',d:52,dl:-20,tx:'-6%',ty:'-3%'}]]},
  'air-ombak':{nama:'Ombak Pagi',kel:'air',mode:'terang',kaca:'susu',aksen:'#0369a1',aksen2:'#0ea5e9',teks:'#062033',teks2:'rgba(6,32,51,.64)',bayang:'10,50,90',
    dasar:'linear-gradient(180deg,#e7f5ff 0%,#d6efff 45%,#bfe6ff 100%)',
    gumpal:[[-10,-16,1000,600,'#fff4d6',.75],[62,-12,950,600,'#c6e8ff',.8]],
    lapis:[['ombak',{h:38,a:40,c:'rgba(125,211,252,.55)',d:30}],['ombak',{h:30,a:34,c:'rgba(56,189,248,.5)',d:22,dl:-8}],['ombak',{h:21,a:28,c:'rgba(14,165,233,.55)',d:16,dl:-4}],['butir',{o:.07}]]},
  'air-hujan-jendela':{nama:'Hujan di Jendela',kel:'air',mode:'gelap',kaca:'asap',aksen:'#fbbf24',aksen2:'#2dd4bf',
    dasar:'linear-gradient(180deg,#1b2433 0%,#16202c 55%,#0f151d 100%)',
    gumpal:[[-6,40,700,420,'#f59e0b',.35],[60,30,700,420,'#f97316',.3],[30,64,800,380,'#2dd4bf',.22],[78,-8,600,400,'#60a5fa',.25]],
    lapis:[['bokeh',{n:22,warna:['#fbbf24','#fb923c','#5eead4','#93c5fd'],o:.4}],['tetes',{n:90}],['butir',{o:.14}]]},
  'air-gelembung':{nama:'Gelembung Sabun',kel:'air',mode:'terang',kaca:'bening',aksen:'#d6338a',aksen2:'#3b82f6',
    dasar:'linear-gradient(160deg,#e3f7ff 0%,#f3ecff 50%,#ffe6f6 100%)',
    gumpal:[[-10,-16,1000,600,'#bfe9ff',.8],[60,-8,950,600,'#f4cbff',.7],[24,52,1100,520,'#fff3c4',.6]],
    lapis:[['gel',{n:18}],['butir',{o:.08}]]},
  'air-embun':{nama:'Kabut Embun',kel:'air',mode:'terang',kaca:'embun',aksen:'#2f7d5b',aksen2:'#4f7da0',teks:'#16231d',teks2:'rgba(22,35,29,.64)',bayang:'30,50,45',
    dasar:'linear-gradient(180deg,#e9eff0 0%,#dbe5e4 50%,#c9d7d6 100%)',
    gumpal:[[-10,-14,1000,600,'#ffffff',.85],[60,40,1000,600,'#b9d4cc',.6],[10,70,1000,500,'#cfdde8',.6]],
    lapis:[['tekstur',{jenis:'kabut',o:.75,d:60,tx:'8%',ty:'2%'}],['tekstur',{jenis:'kabut',o:.45,d:80,dl:-30,tx:'-7%',ty:'-2%'}],['butir',{o:.12}]]},
  'air-awan':{nama:'Langit Awan',kel:'air',mode:'terang',kaca:'susu',aksen:'#1d4ed8',aksen2:'#f59e0b',teks:'#0b1b3a',teks2:'rgba(11,27,58,.66)',bayang:'20,40,90',
    dasar:'linear-gradient(180deg,#6fb8ff 0%,#a9d4ff 45%,#e1f0ff 100%)',
    gumpal:[[60,-16,800,500,'#fff3cf',.6]],
    lapis:[['tekstur',{jenis:'awan',o:.95,d:90,tx:'10%',ty:'1%'}],['tekstur',{jenis:'awan',o:.5,d:120,dl:-40,tx:'-8%',ty:'0%'}]]},

  /* ===== ABSTRAK & MESH ===== */
  'mesh-pelangi':{nama:'Mesh Pelangi',kel:'mesh',mode:'terang',kaca:'susu',aksen:'#5b3df5',aksen2:'#ff4d6d',
    dasar:'linear-gradient(135deg,#fff7f0,#f4f0ff)',
    gumpal:[[-10,-16,900,620,'#ff8a8a',.7],[40,-20,800,560,'#ffd36e',.7],[72,10,800,600,'#7be0a0',.6],[-6,56,900,560,'#6aa8ff',.7],[52,60,900,560,'#c88dff',.7]],
    lapis:[['butir',{o:.1}]]},
  'mesh-lava':{nama:'Lampu Lava',kel:'mesh',mode:'gelap',kaca:'asap',aksen:'#ff8a3d',aksen2:'#ff4d8d',
    dasar:'linear-gradient(180deg,#2b0a3d 0%,#470e55 55%,#5b1060 100%)',
    gumpal:[[30,30,900,600,'#ff4d8d',.25]],
    lapis:[['lava',{n:7,c:'#ff4d6d',c2:'#ffb347',o:.62}],['butir',{o:.12}]]},
  'mesh-holo':{nama:'Holografik',kel:'mesh',mode:'terang',kaca:'bening',aksen:'#7c3aed',aksen2:'#0891b2',
    dasar:'linear-gradient(135deg,#fdf4ff,#ecfeff)',gumpal:[],
    lapis:[['holo',{o:.8}],['butir',{o:.1}]]},
  'mesh-grain':{nama:'Risograf Grain',kel:'mesh',mode:'terang',kaca:'susu',aksen:'#ef476f',aksen2:'#118ab2',teks:'#1f1a17',teks2:'rgba(31,26,23,.64)',bayang:'60,40,30',
    dasar:'#f3efe6',
    gumpal:[[-8,-14,900,600,'#ffb4a2',.8],[62,-6,850,560,'#b5e2fa',.8],[24,56,1000,520,'#f9e79f',.75]],
    lapis:[['butir',{o:.32}]]},
  'mesh-kisi':{nama:'Kisi Pastel',kel:'mesh',mode:'terang',kaca:'susu',aksen:'#4f46e5',aksen2:'#db2777',
    dasar:'linear-gradient(180deg,#eef2ff 0%,#f5f3ff 50%,#fdf2f8 100%)',
    gumpal:[[-10,-14,950,600,'#c7d2fe',.75],[62,-8,900,600,'#fbcfe8',.7]],
    lapis:[['kisi',{c:'rgba(99,102,241,.32)',d:5,hz:'58%'}],['butir',{o:.08}]]},
  'mesh-bokeh':{nama:'Bokeh Malam',kel:'mesh',mode:'gelap',kaca:'asap',aksen:'#fbbf24',aksen2:'#f472b6',
    dasar:'radial-gradient(120% 90% at 50% 50%,#1e293b 0%,#0f172a 60%,#070b14 100%)',
    gumpal:[[20,30,1000,600,'#334155',.6]],
    lapis:[['bokeh',{n:34,warna:['#fbbf24','#f472b6','#60a5fa','#34d399','#f87171'],o:.5,besar:1}],['butir',{o:.12}]]}
  };

  /* ---------- pembuat lapisan ---------- */
  const el=(tag,cls,css)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(css)e.style.cssText=css;return e};
  const pitaPath=(y,a,t)=>`M0 ${y} C480 ${y-a} 1440 ${y+a} 1920 ${y} C2400 ${y-a} 3360 ${y+a} 3840 ${y} L3840 ${y+t} C3360 ${y+t+a*.8} 2400 ${y+t-a*.8} 1920 ${y+t} C1440 ${y+t+a*.8} 480 ${y+t-a*.8} 0 ${y+t} Z`;
  const ombakPath=a=>`M0 ${a+20} C480 ${20-a*.2} 1440 ${2*a+20} 1920 ${a+20} C2400 ${20-a*.2} 3360 ${2*a+20} 3840 ${a+20} L3840 400 L0 400 Z`;
  const LAPIS={
    pita(L,o){const s=document.createElementNS(NS,'svg');s.setAttribute('class','lt-pita');s.setAttribute('viewBox','0 0 3840 1080');s.setAttribute('preserveAspectRatio','none');
      s.innerHTML=`<path d="${pitaPath(o.y,o.a,o.t)}" fill="${o.c}"/>`;s.style.cssText=`--o:${o.o};--d:${o.d}s;--dl:${o.dl||0}s`;L.append(s)},
    ombak(L,o){const s=document.createElementNS(NS,'svg');s.setAttribute('class','lt-ombak');s.setAttribute('viewBox','0 0 3840 400');s.setAttribute('preserveAspectRatio','none');
      s.innerHTML=`<path d="${ombakPath(o.a)}" fill="${o.c}"/>`;s.style.cssText=`--h:${o.h}%;--d:${o.d}s;--dl:${o.dl||0}s`;L.append(s)},
    tekstur(L,o){L.append(el('i','lt-tekstur',`background-image:${TEKSTUR[o.jenis](o.c)};--o:${o.o};--mb:${o.mb||'normal'};--d:${o.d}s;--dl:${o.dl||0}s;--tx:${o.tx||'6%'};--ty:${o.ty||'4%'}`))},
    butir(L,o){L.append(el('i','lt-butir',`--o:${o.o}`))},
    bintang(L,o,r){for(let k=0;k<2;k++){const sh=[];for(let i=0;i<o.n/2;i++){const a=(.25+r()*.75).toFixed(2),z=r()<.12?2:1;sh.push(`${(r()*1920)|0}px ${(r()*1080)|0}px 0 ${z-1}px rgba(255,255,255,${a})`)}
      L.append(el('i','lt-bintang',`box-shadow:${sh.join(',')};--d:${3+k*2.4}s;--dl:${-k*1.7}s`))}},
    tetes(L,o,r){for(let i=0;i<o.n;i++){const s=(6+Math.pow(r(),2.2)*34)|0,j=r()<.14;
      L.append(el('i','lt-tetes'+(j?' jatuh':''),`--s:${s}px;left:${(r()*1920)|0}px;top:${(r()*1080-(j?200:0))|0}px;--o:${(.55+r()*.4).toFixed(2)};--d:${(7+r()*8).toFixed(1)}s;--dl:${(-r()*10).toFixed(1)}s`))}},
    hujan(L,o){L.append(el('i','lt-hujan',`--c:${o.c};--o:${o.o};--d:${o.d}s;--dl:${o.dl||0}s`))},
    gel(L,o,r){for(let i=0;i<o.n;i++){const s=(50+r()*170)|0;
      L.append(el('i','lt-gel',`--s:${s}px;left:${(r()*1860)|0}px;--d:${(16+r()*16).toFixed(1)}s;--dl:${(-r()*30).toFixed(1)}s;--sw:${(20+r()*50)|0}px`))}},
    bokeh(L,o,r){for(let i=0;i<o.n;i++){const s=(o.besar?60:30)+(r()*(o.besar?220:120))|0;
      L.append(el('i','lt-bokeh',`--s:${s}px;left:${(r()*1920-s/2)|0}px;top:${(r()*1080-s/2)|0}px;--c:${o.warna[i%o.warna.length]};--b:${(2+r()*10).toFixed(1)}px;--o:${(o.o*(.5+r()*.6)).toFixed(2)};--d:${(24+r()*20)|0}s;--dl:${(-r()*20).toFixed(1)}s;--tx:${((r()-.5)*60)|0}%;--ty:${((r()-.5)*60)|0}%`))}},
    kisi(L,o){const k=el('i','lt-kisi',`--hz:${o.hz||'62%'}`);k.append(el('i','',`--c:${o.c};--d:${o.d}s`));L.append(k)},
    matahari(L,o){L.append(el('i','lt-matahari',`--y:${o.y};--s:${o.s}px`))},
    lava(L,o,r){const w=el('i','lt-lava',`opacity:${o.o||1}`);for(let i=0;i<o.n;i++){const s=(160+r()*240)|0;
      w.append(el('i','',`--s:${s}px;--x:${(80+r()*1600)|0}px;--c:${o.c};--c2:${o.c2};--y0:${(1100-r()*200)|0}px;--y1:${(-200+r()*400)|0}px;--d:${(18+r()*16)|0}s;--dl:${(-r()*30).toFixed(1)}s`))}
      L.append(w)},
    holo(L,o){L.append(el('i','lt-holo',`--o:${o.o}`))}
  };

  /* ---------- token warna dari latar ---------- */
  function token(id){
    const c=D[id]||D['aurora-lavender'],g=c.mode==='gelap';
    return {
      '--kc-teks':c.teks||(g?'#f6f4ff':'#15121e'),
      '--kc-teks-2':c.teks2||(g?'rgba(236,233,255,.68)':'rgba(21,18,30,.62)'),
      '--kc-aksen':c.aksen,'--kc-aksen-2':c.aksen2,
      '--kc-bayang':c.bayang||(g?'0,0,0':'44,32,96'),
      '--kc-kaca-padat':g?'rgba(24,22,44,.88)':'rgba(248,246,252,.88)'
    };
  }

  /* ---------- pasang: bangun latar di dalam el, kembalikan token ---------- */
  function pasang(wadah,id){
    const c=D[id]||D['aurora-lavender'],r=prng(benih(id));
    wadah.textContent='';wadah.classList.add('latar');wadah.dataset.latarId=id;
    wadah.style.setProperty('--lt-fase',`${(-performance.now()/1000).toFixed(2)}s`);
    wadah.append(el('i','lt-dasar',`background:${c.dasar}`));
    for(const [x,y,w,h,warna,o] of c.gumpal){
      wadah.append(el('i','lt-g',`left:${x}%;top:${y}%;width:${w}px;height:${h}px;background:${warna};--o:${o};--b:${Math.round(Math.min(w,h)*.2)}px;--d:${(22+r()*18)|0}s;--dl:${(-r()*20).toFixed(1)}s;--tx:${((r()-.5)*24)|0}%;--ty:${((r()-.5)*22)|0}%;--sk:${(1.05+r()*.18).toFixed(2)}`));
    }
    for(const [jenis,o] of c.lapis) LAPIS[jenis](wadah,o,r);
    return token(id);
  }

  KC.latar={daftar:D,pasang,token,
    keluarga:k=>Object.keys(D).filter(id=>D[id].kel===k),
    kaca:id=>(D[id]||D['aurora-lavender']).kaca,
    mode:id=>(D[id]||D['aurora-lavender']).mode};
})(window.KC);
