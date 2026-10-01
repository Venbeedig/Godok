/* ==========================================================
   KC LENSA — lensa kaca pembias (klon diperbesar + pegas + regang)
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  /* ---------- LENSA PEMBIAS ---------- */
  let nomor = 0;
  KC.lensa = (panggung, o = {}) => {
    const opsi = Object.assign({ w: 220, h: 220, zoom: 1.38, x: 0, y: 0, prisma: false, balik: false, peregang: .00009 }, o);
    panggung.querySelectorAll('*').forEach(e => { if (!e.dataset.kcid) e.dataset.kcid = 'k' + (++nomor); });
    const lensa = document.createElement('div'); lensa.className = 'kc-lensa kaca' + (opsi.balik ? ' gelap' : '');
    const isi = document.createElement('div'); isi.className = 'kc-lensa-isi';
    if (opsi.prisma) isi.classList.add('prisma'); if (opsi.balik) isi.classList.add('balik');
    const klon = document.createElement('div'); klon.className = 'kc-lensa-klon';
    const W = panggung.offsetWidth, H = panggung.offsetHeight;
    klon.style.cssText = `width:${W}px;height:${H}px`;
    const cs = getComputedStyle(panggung);
    ['display', 'placeItems', 'alignItems', 'justifyContent', 'flexDirection', 'gap', 'padding', 'textAlign'].forEach(p => klon.style[p] = cs[p]);
    [...panggung.children].forEach(c => { if (!c.classList.contains('kc-lensa')) klon.append(c.cloneNode(true)); });
    isi.append(klon); lensa.append(isi); panggung.append(lensa);
    const pasang = (s, v) => {
      const sp = Math.hypot(v.x || 0, v.y || 0), t = Math.min(.42, sp * opsi.peregang * 60);
      const sud = Math.atan2(v.y || 0, v.x || 0) * 180 / Math.PI;
      lensa.style.width = s.w + 'px'; lensa.style.height = s.h + 'px';
      lensa.style.transform = `translate(${s.x - s.w / 2}px,${s.y - s.h / 2}px) rotate(${sud}deg) scale(${1 + t},${1 / (1 + t)}) rotate(${-sud}deg)`;
      lensa.style.opacity = s.o;
      isi.style.transform = `translate(${s.w / 2 - s.z * s.x}px,${s.h / 2 - s.z * s.y}px) scale(${s.z})`;
    };
    const p = KC.pegas({ x: opsi.x, y: opsi.y, w: opsi.w, h: opsi.h, z: opsi.zoom, o: o.o ?? 1 }, { kaku: o.kaku || 120, redam: o.redam || 16, ubah: pasang });
    return {
      el: lensa, pegas: p,
      ke: t => p.ke(t), loncat: t => p.loncat(t),
      kembar: el => klon.querySelector(`[data-kcid="${el.dataset.kcid}"]`),
      segarkan() { klon.textContent = ''; [...panggung.children].forEach(c => { if (c !== lensa) klon.append(c.cloneNode(true)); }); },
      hapus() { p.henti(); lensa.remove(); }
    };
  };


  /* ---------- 10 RESEP LENSA: KC.resepLensa.L1(panggung, c, opsi) ----------
     panggung = .lensa-panggung (position:relative) berisi teks.
     c.aktif() dipakai untuk berhenti bila slide sudah ditinggal. */
  const pusat = (el, w) => { const r = KC.rel(el, w); return { x: r.x + r.w / 2, y: r.y + r.h / 2, w: r.w, h: r.h }; };
  const sasaran = pg => pg.querySelector('.lensa-sasaran') || pg.querySelector('.titik-akhir') || pg.firstElementChild;
  const jalan = c => !c || !c.aktif || c.aktif();
  const R = KC.resepLensa = {};
  /* L1 lintas-titik: masuk dari kiri, melintas, berhenti di sasaran (".titik-akhir") */
  R.L1 = async (pg, c, o = {}) => {
    const H = pg.offsetHeight, t = pusat(sasaran(pg), pg);
    const L = KC.lensa(pg, Object.assign({ w: 150, h: 150, zoom: 1.4, x: -160, y: H * .55, o: 0 }, o));
    L.ke({ o: 1 }); await L.ke({ x: pg.offsetWidth * .35, y: H * .5, w: 230, h: 150 }); if (!jalan(c)) return L;
    await KC.tunggu(KC.ms(.5)); await L.ke({ x: t.x + 4, y: t.y - 10, w: 132, h: 132, z: 1.5 }); return L;
  };
  /* L2 titik-mekar: tanda titik membesar jadi lensa di tempatnya */
  R.L2 = async (pg, c, o = {}) => {
    const t = pusat(sasaran(pg), pg);
    const L = KC.lensa(pg, Object.assign({ w: 24, h: 24, zoom: 1.6, x: t.x, y: t.y + t.h * .25, o: 1, kaku: 160, redam: 11 }, o));
    await KC.tunggu(KC.ms(.5)); await L.ke({ w: 150, h: 150, y: t.y }); return L;
  };
  /* L3 sapu-pil: pil memanjang menyapu sebaris dari kiri ke kanan lalu memudar */
  R.L3 = async (pg, c, o = {}) => {
    const H = pg.offsetHeight, W = pg.offsetWidth;
    const L = KC.lensa(pg, Object.assign({ w: 300, h: H * .62, zoom: 1.25, x: -200, y: H / 2, o: 1, kaku: 40, redam: 11 }, o));
    await L.ke({ x: W + 200 }); if (o.tinggal) await L.ke({ x: W - 150 }); else L.ke({ o: 0 }); return L;
  };
  /* L4 baca-kata: lensa melompat dari kata ke kata (bungkus tiap kata dengan <span class="kata">) */
  R.L4 = async (pg, c, o = {}) => {
    const kata = [...pg.querySelectorAll('.kata')]; if (!kata.length) return null;
    const a = pusat(kata[0], pg);
    const z = o.zoom || 1.22, L = KC.lensa(pg, Object.assign({ w: a.w * z + 40, h: a.h * z + 16, zoom: z, x: a.x, y: a.y, o: 0 }, o));
    await L.ke({ o: 1 });
    for (const k of kata.slice(1)) { await KC.tunggu(KC.ms(o.ketuk || 1)); if (!jalan(c)) return L; const b = pusat(k, pg); await L.ke({ x: b.x, y: b.y, w: b.w * z + 40, h: b.h * z + 16 }); }
    return L;
  };
  /* L5 ikuti: lensa mengikuti penunjuk/sentuhan (interaktif, untuk tanya jawab) */
  R.L5 = async (pg, c, o = {}) => {
    const L = KC.lensa(pg, Object.assign({ w: 200, h: 200, zoom: 1.45, x: pg.offsetWidth / 2, y: pg.offsetHeight / 2, o: 0 }, o));
    L.ke({ o: 1 });
    pg.parentElement.addEventListener('pointermove', e => { const r = pg.getBoundingClientRect(); L.ke({ x: (e.clientX - r.left) / KC.skala, y: (e.clientY - r.top) / KC.skala }); });
    return L;
  };
  /* L6 kembar: dua lensa datang dari kiri & kanan, bertemu, melebur jadi satu pil */
  R.L6 = async (pg, c, o = {}) => {
    const W = pg.offsetWidth, H = pg.offsetHeight, d = Math.min(170, H * .9);
    const A = KC.lensa(pg, Object.assign({ w: d, h: d, zoom: 1.35, x: -d, y: H / 2, o: 1 }, o));
    const B = KC.lensa(pg, Object.assign({ w: d, h: d, zoom: 1.35, x: W + d, y: H / 2, o: 1 }, o));
    await Promise.all([A.ke({ x: W / 2 - d * .45 }), B.ke({ x: W / 2 + d * .45 })]); if (!jalan(c)) return A;
    B.ke({ o: 0, x: W / 2 }); await A.ke({ x: W / 2, w: d * 2.1, h: d * 1.02 }); B.hapus(); return A;
  };
  /* L7 prisma: seperti L1 tetapi tepi huruf di dalam lensa berpendar merah-biru */
  R.L7 = (pg, c, o = {}) => R.L1(pg, c, Object.assign({ prisma: true }, o));
  /* L8 balik: lensa membalik warna isi, berhenti di kata kunci (".lensa-sasaran") */
  R.L8 = async (pg, c, o = {}) => {
    const t = pusat(sasaran(pg), pg);
    const z = o.zoom || 1.12, L = KC.lensa(pg, Object.assign({ w: t.w * z + 90, h: t.h * z + 24, zoom: z, x: t.x, y: -t.h, o: 0, balik: true }, o));
    L.ke({ o: 1 }); await L.ke({ y: t.y }); return L;
  };
  /* L9 tetes: tetes kaca jatuh ke sasaran, gepeng saat mendarat, lalu jadi lensa bulat */
  R.L9 = async (pg, c, o = {}) => {
    const t = pusat(sasaran(pg), pg);
    const L = KC.lensa(pg, Object.assign({ w: 70, h: 96, zoom: 1.5, x: t.x, y: -260, o: 1, kaku: 260, redam: 22 }, o));
    L.ke({ y: t.y }); await KC.tunggu(420);
    L.ke({ w: 220, h: 86 }); await KC.tunggu(150); await L.ke({ w: 150, h: 150 }); return L;
  };
  /* L10 cincin: tanpa perbesaran, hanya pembiasan tepi (tingkat penuh, Chromium) */
  R.L10 = async (pg, c, o = {}) => {
    const t = pusat(sasaran(pg), pg), d = o.d || 230;
    const L = KC.lensa(pg, Object.assign({ w: d, h: d, zoom: 1, x: t.x, y: t.y, o: 0 }, o));
    if (document.documentElement.dataset.bias === 'ya') { // pembiasan asli lewat backdrop-filter; klon disembunyikan
      L.el.classList.add('cincin'); L.el.style.setProperty('--kc-bias', `url(#${KC.filterBias(d, d, d / 2, { skala: 110, bezel: d * .34 })})`);
    }
    await L.ke({ o: 1 }); return L;
  };
})(window.KC);
