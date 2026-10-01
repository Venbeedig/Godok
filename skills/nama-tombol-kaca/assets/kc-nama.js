/* ==========================================================
   KC NAMA TOMBOL — nama anggota kelompok terbentuk jadi tombol kaca.
   12 efek pembawa: sesuatu (burung kaca, tetes air, kupu-kupu …) terbang
   ke tempat tiap kartu, lalu kaca tombol "terbentuk" dari titik itu
   dan nama + NIM muncul di dalamnya.
   Pakai (slide):
     <section class="slide" data-adegan="nama-tombol" data-efek-nama="burung">
       … <div class="grid-anggota" data-nt> <div class="kaca kartu-anggota">…</div> … </div>
   Atau dari JS: await KC.namaTombol(slide, 'kupu')
   Butuh kc-inti.js. Tanpa Math.random(): posisi asal memakai PRNG berbiji.
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  const prng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const kaca = 'fill:color-mix(in srgb,var(--kc-aksen) 34%,rgba(255,255,255,.62));stroke:rgba(255,255,255,.95);stroke-width:2.2;stroke-linejoin:round';
  const kaca2 = 'fill:color-mix(in srgb,var(--kc-aksen-2) 38%,rgba(255,255,255,.55));stroke:rgba(255,255,255,.95);stroke-width:2;stroke-linejoin:round';

  /* ---------- bentuk pembawa (menghadap ke kanan = arah terbang 0°) ---------- */
  const BENTUK = {
    burung: () => `<svg viewBox="0 0 120 80" class="nt-svg"><g class="nt-sayap-b"><path d="M58 40 C46 14 26 6 6 10 C24 20 34 32 44 44 Z" style="${kaca2}"/></g>
      <path d="M22 46 C40 34 74 30 96 38 C104 40 110 44 114 46 C106 48 100 52 92 54 C70 60 42 58 22 46 Z" style="${kaca}"/>
      <path d="M22 46 L4 36 L10 50 L2 60 Z" style="${kaca2}"/><circle cx="100" cy="42" r="2.6" fill="rgba(30,20,60,.55)"/>
      <g class="nt-sayap-a"><path d="M60 40 C52 10 36 -2 16 0 C30 14 40 28 46 44 Z" style="${kaca}"/></g></svg>`,
    kupu: () => `<svg viewBox="0 0 100 90" class="nt-svg"><g class="nt-kepak"><path d="M50 44 C36 10 6 6 6 30 C6 46 30 50 50 46 Z" style="${kaca}"/>
      <path d="M50 48 C32 50 14 64 22 78 C30 88 46 70 50 50 Z" style="${kaca2}"/></g>
      <g class="nt-kepak nt-kanan"><path d="M50 44 C64 10 94 6 94 30 C94 46 70 50 50 46 Z" style="${kaca}"/>
      <path d="M50 48 C68 50 86 64 78 78 C70 88 54 70 50 50 Z" style="${kaca2}"/></g>
      <ellipse cx="50" cy="48" rx="3.4" ry="18" fill="rgba(255,255,255,.95)"/></svg>`,
    ikan: () => `<svg viewBox="0 0 120 60" class="nt-svg"><g class="nt-ekor"><path d="M30 30 L4 10 C10 22 10 38 4 50 Z" style="${kaca2}"/></g>
      <path d="M28 30 C44 8 86 4 112 30 C86 56 44 52 28 30 Z" style="${kaca}"/>
      <path d="M62 14 C70 4 82 4 88 10 Z M60 46 C66 54 76 56 82 52 Z" style="${kaca2}"/><circle cx="98" cy="27" r="3" fill="rgba(30,20,60,.55)"/></svg>`,
    pesawat: () => `<svg viewBox="0 0 120 70" class="nt-svg"><path d="M4 30 L116 6 L44 46 Z" style="${kaca}"/><path d="M44 46 L116 6 L60 64 Z" style="${kaca2}"/><path d="M44 46 L52 66 L60 64 Z" style="${kaca}"/></svg>`,
    bintang: () => `<span class="nt-ekor-cahaya"></span><svg viewBox="0 0 80 80" class="nt-svg nt-kerlip"><path d="M40 2 C44 30 50 36 78 40 C50 44 44 50 40 78 C36 50 30 44 2 40 C30 36 36 30 40 2 Z" style="${kaca};fill:rgba(255,255,255,.85)"/></svg>`,
    ubur: () => `<svg viewBox="0 0 90 110" class="nt-svg nt-denyut"><path d="M8 46 C8 14 82 14 82 46 C70 40 58 50 45 44 C32 50 20 40 8 46 Z" style="${kaca}"/>
      <g class="nt-tentakel" style="fill:none;stroke:rgba(255,255,255,.85);stroke-width:2.4;stroke-linecap:round"><path d="M24 48 C18 66 30 80 22 102"/><path d="M38 48 C34 70 44 84 38 106"/><path d="M52 48 C56 70 46 84 52 106"/><path d="M66 48 C72 66 60 80 68 102"/></g></svg>`,
    kristal: () => `<svg viewBox="0 0 100 100" class="nt-svg"><path d="M50 4 L90 27 L90 73 L50 96 L10 73 L10 27 Z" style="${kaca}"/>
      <path d="M50 4 L50 96 M10 27 L90 73 M90 27 L10 73" style="fill:none;stroke:rgba(255,255,255,.9);stroke-width:2"/><path d="M50 26 L70 38 L70 62 L50 74 L30 62 L30 38 Z" style="${kaca2}"/></svg>`,
    tetes: () => '<i class="nt-tetes"></i>',
    kelopak: () => '<i class="nt-kelopak"></i>',
    gelembung: () => '<i class="nt-gelembung"></i>',
    kunang: () => '<i class="nt-kunang"></i>'
  };

  /* ---------- 12 efek ----------
     bentuk, ukuran [w,h], asal(kartu, i, n, r, kanvas) → titik awal,
     kendali(A, B, i, r) → dua titik kendali kurva kubik, arah: ikut garis singgung,
     goyang: simpangan tegak lurus (px) × jumlah gelombang, tiba: cara tombol terbentuk */
  const EFEK = {
    burung:   { kode: 'N1', nama: 'Burung kaca', bentuk: 'burung', ukuran: [134, 90], arah: true, dur: 1450, kurva: 'cubic-bezier(.35,.1,.25,1)',
      asal: (b, i, n, r) => ({ x: -180 - i * 40, y: 80 + r() * 260 }), kendali: (A, B, i) => [{ x: A.x + 520, y: A.y - 160 }, { x: B.x - 260, y: B.y - 240 }], tiba: 'mekar' },
    tetes:    { kode: 'N2', nama: 'Tetes air', bentuk: 'tetes', ukuran: [64, 81], arah: false, dur: 950, kurva: 'cubic-bezier(.55,0,.9,.45)',
      asal: b => ({ x: b.x, y: -260 }), kendali: (A, B) => [{ x: A.x, y: A.y + 200 }, { x: B.x, y: B.y - 100 }], tiba: 'percik' },
    kupu:     { kode: 'N3', nama: 'Kupu-kupu kaca', bentuk: 'kupu', ukuran: [118, 106], arah: false, dur: 1700, kurva: 'cubic-bezier(.3,.1,.3,1)', goyang: [46, 3],
      asal: (b, i) => ({ x: i % 2 ? 1720 : -120, y: 900 }), kendali: (A, B) => [{ x: (A.x + B.x) / 2, y: A.y - 380 }, { x: B.x + (A.x > B.x ? 200 : -200), y: B.y + 120 }], tiba: 'mekar' },
    ikan:     { kode: 'N4', nama: 'Ikan koi kaca', bentuk: 'ikan', ukuran: [154, 78], arah: true, dur: 1600, kurva: 'cubic-bezier(.4,.1,.3,1)', goyang: [30, 2],
      asal: (b, i) => ({ x: 1820, y: 200 + i * 90 }), kendali: (A, B) => [{ x: A.x - 500, y: A.y + 300 }, { x: B.x + 420, y: B.y - 260 }], tiba: 'riak' },
    kelopak:  { kode: 'N5', nama: 'Kelopak mawar gugur', bentuk: 'kelopak', ukuran: [76, 92], arah: false, putar: 400, dur: 1800, kurva: 'cubic-bezier(.3,.05,.35,1)', goyang: [70, 2.5],
      asal: (b, i, n, r) => ({ x: b.x + (r() - .5) * 500, y: -200 }), kendali: (A, B) => [{ x: A.x, y: A.y + 300 }, { x: B.x, y: B.y - 220 }], tiba: 'mekar' },
    gelembung:{ kode: 'N6', nama: 'Gelembung naik', bentuk: 'gelembung', ukuran: [134, 134], arah: false, dur: 1600, kurva: 'cubic-bezier(.3,.2,.3,1)', goyang: [36, 2],
      asal: (b, i, n, r) => ({ x: b.x + (r() - .5) * 300, y: 1060 }), kendali: (A, B) => [{ x: A.x, y: A.y - 300 }, { x: B.x, y: B.y + 200 }], tiba: 'letup' },
    bintang:  { kode: 'N7', nama: 'Bintang jatuh', bentuk: 'bintang', ukuran: [98, 98], arah: true, dur: 900, kurva: 'cubic-bezier(.5,0,.25,1)',
      asal: (b, i) => ({ x: 1900 + i * 60, y: -200 - i * 40 }), kendali: (A, B) => [{ x: A.x - 300, y: A.y + 180 }, { x: B.x + 200, y: B.y - 120 }], tiba: 'kilat' },
    ubur:     { kode: 'N8', nama: 'Ubur-ubur kaca', bentuk: 'ubur', ukuran: [101, 129], arah: false, dur: 1900, kurva: 'cubic-bezier(.25,.1,.3,1)', goyang: [26, 1.5],
      asal: (b, i, n, r) => ({ x: b.x + (r() - .5) * 200, y: 1140 }), kendali: (A, B) => [{ x: A.x + 60, y: A.y - 400 }, { x: B.x - 60, y: B.y + 260 }], tiba: 'mekar' },
    pesawat:  { kode: 'N9', nama: 'Pesawat kertas kaca', bentuk: 'pesawat', ukuran: [140, 84], arah: true, dur: 1600, kurva: 'cubic-bezier(.35,.1,.25,1)',
      asal: (b, i) => ({ x: -200, y: 700 - i * 60 }), kendali: (A, B, i) => [{ x: B.x + 260, y: A.y - 520 }, { x: B.x - 380, y: B.y - 340 }], tiba: 'buka' },
    riak:     { kode: 'N10', nama: 'Riak air', bentuk: null, tiba: 'riak-muncul' },
    kristal:  { kode: 'N11', nama: 'Kristal es mencair', bentuk: 'kristal', ukuran: [112, 112], arah: false, putar: 540, dur: 1400, kurva: 'cubic-bezier(.3,.1,.25,1)',
      asal: (b, i, n, r, K) => { const s = r() * Math.PI * 2; return { x: K.w / 2 + Math.cos(s) * 1200, y: K.h / 2 + Math.sin(s) * 760 }; },
      kendali: (A, B) => [{ x: (A.x * 2 + B.x) / 3, y: (A.y * 2 + B.y) / 3 }, { x: (A.x + B.x * 2) / 3, y: (A.y + B.y * 2) / 3 }], tiba: 'leleh' },
    kunang:   { kode: 'N12', nama: 'Kunang-kunang', bentuk: 'kunang', ukuran: [22, 22], arah: false, dur: 1500, kurva: 'cubic-bezier(.3,.1,.25,1)', goyang: [40, 2], kawanan: 7,
      asal: (b, i, n, r, K) => ({ x: r() * K.w, y: r() < .5 ? -80 : K.h + 80 }), kendali: (A, B, i, r) => [{ x: A.x + (r() - .5) * 600, y: (A.y + B.y) / 2 }, { x: B.x + (r() - .5) * 300, y: B.y + (r() - .5) * 300 }], tiba: 'kunang' }
  };

  /* ---------- kurva & lintasan ---------- */
  const kubik = (A, P, Q, B, t) => { const u = 1 - t; return {
    x: u * u * u * A.x + 3 * u * u * t * P.x + 3 * u * t * t * Q.x + t * t * t * B.x,
    y: u * u * u * A.y + 3 * u * u * t * P.y + 3 * u * t * t * Q.y + t * t * t * B.y }; };
  function lintasan(A, P, Q, B, e, w, h, N = 22) {
    const tit = Array.from({ length: N + 1 }, (_, j) => kubik(A, P, Q, B, j / N));
    if (e.goyang) { const [amp, gel] = e.goyang; tit.forEach((t, j) => { if (!j || j === N) return;
      const a = tit[j - 1], b = tit[j + 1], dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, s = Math.sin(j / N * Math.PI * 2 * gel) * amp * (1 - j / N);
      t.x += -dy / L * s; t.y += dx / L * s; }); }
    let sudutLalu = 0;
    return tit.map((t, j) => {
      let rot = 0;
      if (e.arah) { const a = tit[Math.max(0, j - 1)], b = tit[Math.min(N, j + 1)];
        rot = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        while (rot - sudutLalu > 180) rot -= 360; while (rot - sudutLalu < -180) rot += 360; sudutLalu = rot;
        if (j === N) rot = sudutLalu * .4; }
      if (e.putar) rot += e.putar * j / N;
      const sk = j === N ? .7 : 1;
      return { transform: `translate(${(t.x - w / 2).toFixed(1)}px,${(t.y - h / 2).toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${sk})`, offset: j / N };
    });
  }

  /* ---------- cara tombol terbentuk ---------- */
  const TIBA = {
    mekar:  [{ clipPath: 'circle(18px at 50% 50%)', opacity: 0 }, { clipPath: 'circle(70% at 50% 50%)', opacity: 1 }],
    percik: [{ clipPath: 'inset(46% 44% 46% 44% round 99px)', transform: 'scale(1.06,.9)', opacity: 0 }, { clipPath: 'inset(0 0 0 0 round 44px)', transform: 'none', opacity: 1 }],
    riak:   [{ clipPath: 'ellipse(10% 14% at 50% 50%)', opacity: 0 }, { clipPath: 'ellipse(80% 90% at 50% 50%)', opacity: 1 }],
    letup:  [{ clipPath: 'circle(46px at 50% 50%)', transform: 'scale(.92)', opacity: 0 }, { clipPath: 'circle(70% at 50% 50%)', transform: 'none', opacity: 1 }],
    kilat:  [{ clipPath: 'inset(0 100% 0 0 round 44px)', opacity: 0, filter: 'brightness(1.6)' }, { clipPath: 'inset(0 0 0 0 round 44px)', opacity: 1, filter: 'none' }],
    buka:   [{ clipPath: 'polygon(50% 50%,50% 50%,50% 50%,50% 50%)', opacity: 0 }, { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', opacity: 1 }],
    leleh:  [{ clipPath: 'polygon(50% 20%,58% 40%,58% 60%,50% 80%,42% 60%,42% 40%)', opacity: 0, filter: 'blur(6px)' },
             { clipPath: 'polygon(50% 0,100% 0,100% 100%,50% 100%,0 100%,0 0)', opacity: 1, filter: 'blur(0)' }],
    kunang: [{ clipPath: 'inset(48% 48% 48% 48% round 99px)', opacity: 0 }, { clipPath: 'inset(0 0 0 0 round 44px)', opacity: 1 }],
    'riak-muncul': [{ clipPath: 'circle(0 at 50% 50%)', transform: 'scale(.94)', opacity: 0 }, { clipPath: 'circle(70% at 50% 50%)', transform: 'none', opacity: 1 }]
  };

  const cincin = (lapis, x, y, besar, tunda, kelas = 'nt-cincin') => { const c = document.createElement('i'); c.className = kelas;
    c.style.cssText = `left:${x - besar / 2}px;top:${y - besar / 2}px;width:${besar}px;height:${besar}px`; lapis.append(c);
    return KC.anim(c, [{ transform: 'scale(.2)', opacity: .95 }, { transform: 'scale(1)', opacity: 0 }], { duration: 900, delay: tunda, easing: KC.kurva('keluar') }).then(() => c.remove()); };
  const percikan = (lapis, x, y, tunda) => Promise.all([-60, -25, 25, 60].map((dx, j) => { const t = document.createElement('i'); t.className = 'nt-percik';
    t.style.cssText = `left:${x - 6}px;top:${y - 6}px`; lapis.append(t);
    return KC.anim(t, [{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx * 1.6}px,${-40 - Math.abs(dx) * .4}px) scale(.8)`, opacity: 1, offset: .5 },
      { transform: `translate(${dx * 2.2}px,${10}px) scale(.3)`, opacity: 0 }], { duration: 650, delay: tunda + j * 20, easing: 'cubic-bezier(.2,.6,.4,1)' }).then(() => t.remove()); }));

  async function namaTombol(slide, nama) {
    const e = EFEK[nama] || EFEK.burung, isi = slide.querySelector(':scope > .isi') || slide;
    const kartu = [...slide.querySelectorAll('.grid-anggota .kartu-anggota, .nt-tombol')];
    if (!kartu.length) return;
    const r = prng(kartu.length * 977 + nama.length * 131);
    const isiAnak = k => [...k.children];
    if (KC.instan || KC.kurangGerak) { kartu.forEach(k => { k.style.opacity = 1; isiAnak(k).forEach(c => c.style.opacity = 1); }); return; }
    const lapis = document.createElement('div'); lapis.className = 'nt-lapis'; isi.append(lapis);
    const K = { w: isi.offsetWidth, h: isi.offsetHeight };
    const kotak = kartu.map(k => { const b = KC.rel(k, isi); return { ...b, x: b.x + b.w / 2, y: b.y + b.h / 2 }; });
    const jeda = kartu.length > 6 ? 170 : 240;
    const kerja = kartu.map(async (k, i) => {
      const b = kotak[i]; isiAnak(k).forEach(c => c.style.opacity = 0);
      let tiba;
      if (!e.bentuk) {               /* N10 riak: lingkaran merambat dari tengah, kartu muncul saat riak sampai */
        const pusat = { x: K.w / 2, y: K.h / 2 }, jarak = Math.hypot(b.x - pusat.x, b.y - pusat.y);
        if (!i) [0, 380, 760].forEach(t => cincin(lapis, pusat.x, pusat.y, 2400, t, 'nt-cincin nt-riak-besar'));
        tiba = 250 + jarak * 1.15;
      } else {
        const kawanan = e.kawanan || 1, [w, h] = e.ukuran, terbang = [];
        for (let m = 0; m < kawanan; m++) {
          const A = e.asal(b, i, kartu.length, r, K), tuju = kawanan > 1 ? { x: b.x + Math.cos(m / kawanan * 6.283) * b.w * .42, y: b.y + Math.sin(m / kawanan * 6.283) * b.h * .4 } : { x: b.x, y: b.y };
          const [P, Q] = e.kendali(A, tuju, i, r);
          const p = document.createElement('div'); p.className = 'nt-pembawa nt-' + e.bentuk; p.style.cssText = `width:${w}px;height:${h}px`;
          p.innerHTML = BENTUK[e.bentuk](); lapis.append(p);
          const tunda = i * jeda + m * 45;
          terbang.push(KC.anim(p, lintasan(A, P, Q, tuju, e, w, h), { duration: e.dur, delay: tunda, easing: e.kurva, fill: 'both' })
            .then(() => KC.anim(p, [{ opacity: 1 }, { opacity: 0, transform: getComputedStyle(p).transform + ' scale(.4)' }], { duration: 380, easing: KC.kurva('keluar') }))
            .then(() => p.remove()));
        }
        tiba = i * jeda + e.dur - 120;
        if (e.tiba === 'percik') { percikan(lapis, b.x, b.y + b.h * .1, tiba); cincin(lapis, b.x, b.y, b.w * 1.1, tiba); }
        if (e.tiba === 'riak' || e.tiba === 'letup') cincin(lapis, b.x, b.y, b.w * 1.25, tiba);
        if (e.tiba === 'kilat') cincin(lapis, b.x, b.y, 200, tiba, 'nt-cincin nt-kilat');
        Promise.all(terbang);
      }
      await Promise.all([KC.anim(k, TIBA[e.tiba] || TIBA.mekar, { duration: 720, delay: tiba, easing: KC.kurva('pegas-lembut') }),
        ...isiAnak(k).map((c, j) => KC.anim(c, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 460, delay: tiba + 260 + j * 60, easing: KC.kurva('keluar') }))]);
    });
    await Promise.all(kerja);
    kartu.forEach(k => { k.getAnimations().forEach(a => a.finish()); k.style.opacity = 1; isiAnak(k).forEach(c => c.style.opacity = 1); });
    setTimeout(() => lapis.remove(), 1200);
  }

  KC.namaTombol = namaTombol;
  KC.efekNama = Object.fromEntries(Object.entries(EFEK).map(([k, v]) => [k, { kode: v.kode, nama: v.nama }]));
  KC.adegan = KC.adegan || {};
  KC.adegan['nama-tombol'] = (s) => namaTombol(s, s.dataset.efekNama || 'burung');
  for (const k in EFEK) KC.adegan['nama-' + k] = (s) => namaTombol(s, k);
})(window.KC);
