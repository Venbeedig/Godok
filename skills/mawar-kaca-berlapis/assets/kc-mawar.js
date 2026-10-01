/* ==========================================================
   KC MAWAR — logo kampus di tengah mawar kaca cair berlapis
   Panggung 900×900. Lima lapis kelopak kaca (bening, membiaskan latar),
   mekar lapis demi lapis, lalu logo muncul di tatakan kaca.
   Pakai:
     const m = KC.mawar.buat(host, { varian:'embun', palet:'sakura', mekar:'tengah' });
     await m.mainkan();      // mekar; mengembalikan janji yang selesai saat logo tampil
     m.diam();               // keadaan akhir tanpa gerak (cetak / pptx)
   Adegan siap pakai: data-adegan="mawar-sampul" dan "mawar-penutup".
   Pojok: KC.mawar.pojok(dek) — mawar kecil + logo di pojok kiri atas tiap slide isi.
   Tanpa Math.random(): sebaran tetes & serpih memakai PRNG berbiji.
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  const prng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const C = 450;                               /* pusat panggung */

  /* ---------- lima lapis: dalam (0) → luar (4) ----------
     n: jumlah kelopak, L: panjang, W: lebar, r0: jarak pangkal dari pusat,
     fy: pemendekan (kelopak dalam lebih tegak = lebih pendek terlihat), off: puntiran spiral */
  const LAPIS = [
    { n: 5, L: 185, W: 176, r0: 52, fy: .64, off: 0 },
    { n: 6, L: 215, W: 198, r0: 64, fy: .72, off: 19 },
    { n: 7, L: 248, W: 220, r0: 76, fy: .82, off: 7 },
    { n: 8, L: 282, W: 240, r0: 88, fy: .92, off: 26 },
    { n: 9, L: 318, W: 262, r0: 98, fy: 1, off: 13 }
  ];

  /* ---------- palet: warna pangkal (tua) & ujung (muda) per lapis, dalam → luar ---------- */
  const PALET = {
    sakura: { nama: 'Sakura–Peach', tua: ['#ef7fa3', '#f394b0', '#f6a7b0', '#f9b7a3', '#fbc4a2'], muda: ['#ffe1ea', '#ffe8ee', '#ffecec', '#fff0e8', '#fff3ea'] },
    merah:  { nama: 'Mawar Merah',  tua: ['#c8103f', '#d41f4c', '#de3358', '#e64b68', '#ec637a'], muda: ['#ffc7d2', '#ffd0d9', '#ffd7de', '#ffdee3', '#ffe4e8'] },
    lilac:  { nama: 'Lilac',        tua: ['#a78bfa', '#b39bfb', '#c0abfc', '#ccbbfd', '#d8cbfe'], muda: ['#f1ebff', '#f3eeff', '#f5f1ff', '#f7f4ff', '#f9f7ff'] },
    bening: { nama: 'Bening',       tua: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'], muda: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
    aurora: { nama: 'Ikut latar',   tua: null, muda: null }   /* diambil dari --kc-aksen & --kc-aksen-2 slide */
  };
  const VARIAN = {
    embun: { nama: 'Mawar Kaca Embun', ket: 'kelopak kaca susu bening, kilau cahaya air mengalir, butir embun di kelopak' },
    holo:  { nama: 'Mawar Kaca Holografik', ket: 'kelopak kaca dengan kilau pelangi yang berputar pelan' },
    tetes: { nama: 'Mawar Tetes Air', ket: 'kelopak paling bening, bibir terang, tetes air di ujung, riak di akhir' }
  };
  const MEKAR = {
    tengah:      { nama: 'Mekar dari tengah', ket: 'lapis dalam mekar lebih dulu, lalu ke luar; logo muncul terakhir' },
    'logo-dulu': { nama: 'Logo dulu', ket: 'logo tampil di tatakan, lalu mawar mekar di belakangnya' },
    serpih:      { nama: 'Serpih berkumpul', ket: 'serpih kaca terbang dari segala arah lalu menyusun mawar' }
  };

  const susun = () => {                     /* keadaan akhir tiap kelopak */
    const out = [];
    LAPIS.forEach((l, k) => { for (let i = 0; i < l.n; i++) {
      const g = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453, j = (g - Math.floor(g)) * 2 - 1;   /* goyangan tetap, bukan acak */
      out.push({ k, i, ...l, a: l.off + i * 360 / l.n + j * 4, L: Math.round(l.L * (1 + j * .05)), W: Math.round(l.W * (1 - j * .04)) }); } });
    return out;
  };
  const tf = (a, r0, sx, sy, tx = 0, ty = 0, rot = 0) =>
    `translate(${tx}px,${ty}px) rotate(${a + rot}deg) translateY(${-r0}px) scale(${sx},${sy})`;

  function buat(host, opsi = {}) {
    const o = Object.assign({ varian: host.dataset.varian || 'embun', palet: host.dataset.palet || 'sakura', mekar: host.dataset.mekar || 'tengah',
      inisial: host.dataset.inisial || 'UT', mini: false }, opsi);
    const r = prng(9173);
    host.classList.add('mw-panggung'); host.dataset.varian = o.varian; host.dataset.palet = o.palet;
    if (o.mini) host.classList.add('mw-mini');
    const adaLogo = !!getComputedStyle(host).getPropertyValue('--logo').trim();
    const K = susun();
    host.innerHTML = '<div class="mw-riak"></div><div class="mw-bunga">' +
      [4, 3, 2, 1, 0].map(k => `<div class="mw-lapis" data-l="${k}" style="--l:${k}">` +
        K.filter(p => p.k === k).map(p => `<i class="mw-k" style="--w:${p.W}px;--h:${p.L}px;--i:${p.i}"></i>`).join('') + '</div>').join('') +
      '</div><div class="mw-tatakan kaca bulat"><div class="mw-logo' + (adaLogo ? '' : ' mw-logo-kosong') + '">' + (adaLogo ? '' : o.inisial) + '</div></div><div class="mw-tetes"></div>';

    /* warna per lapis */
    const P = PALET[o.palet] || PALET.sakura, gaya = getComputedStyle(host);
    host.querySelectorAll('.mw-lapis').forEach(L => { const k = +L.dataset.l;
      const tua = P.tua ? P.tua[k] : `color-mix(in srgb,${gaya.getPropertyValue('--kc-aksen').trim() || '#f394b0'} ${55 - k * 6}%,${gaya.getPropertyValue('--kc-aksen-2').trim() || '#fbc4a2'})`;
      const muda = P.muda ? P.muda[k] : `color-mix(in srgb,${tua} 22%,white)`;
      L.style.setProperty('--tua', tua); L.style.setProperty('--muda', muda); });

    /* kelopak: urutan elemen = urutan K per lapis */
    const el = {}; host.querySelectorAll('.mw-lapis').forEach(L => el[L.dataset.l] = [...L.children]);
    const daftar = K.map(p => ({ ...p, e: el[p.k][p.i] }));
    daftar.forEach(p => { p.akhir = tf(p.a, p.r0, 1, p.fy); p.e.style.transform = p.akhir;
      p.e.style.setProperty('--d-kilau', (5 + (p.i % 3) * 1.3 + p.k * .7).toFixed(1) + 's');
      p.e.style.setProperty('--dl-kilau', (-(p.i * .9 + p.k * 1.7) % 7).toFixed(1) + 's'); });

    /* butir embun / tetes: di atas kelopak lapis 2–4 */
    const tetes = host.querySelector('.mw-tetes');
    if (o.varian !== 'holo' && !o.mini) {
      const n = o.varian === 'tetes' ? 10 : 14;
      for (let j = 0; j < n; j++) { const p = daftar[daftar.length - 1 - ((j * 7) % 24)], s = 9 + r() * (o.varian === 'tetes' ? 18 : 12);
        const rad = (p.a - 90) * Math.PI / 180, jarak = p.r0 + p.L * p.fy * (.45 + r() * .45), sisi = (r() - .5) * p.W * .45;
        const x = C + Math.cos(rad) * jarak - Math.sin(rad) * sisi, y = C + Math.sin(rad) * jarak + Math.cos(rad) * sisi;
        const t = document.createElement('i'); t.style.cssText = `left:${(x - s / 2).toFixed(0)}px;top:${(y - s / 2).toFixed(0)}px;--s:${s.toFixed(0)}px`; tetes.append(t); }
    }
    const tatakan = host.querySelector('.mw-tatakan'), logo = host.querySelector('.mw-logo'), riak = host.querySelector('.mw-riak');

    const ombak = (tunda, n = 2) => { for (let j = 0; j < n; j++) { const c = document.createElement('i'); riak.append(c);
      KC.anim(c, [{ transform: 'scale(.32)', opacity: .9 }, { transform: 'scale(2.3)', opacity: 0 }], { duration: 1500, delay: tunda + j * 260, easing: KC.kurva('keluar') }).then(() => c.remove()); } };
    const kurvaMekar = 'cubic-bezier(.2,.9,.3,1.12)';

    async function mainkan(mode = o.mekar) {
      host.classList.remove('mw-hidup');
      const tunggu = [];
      const L0 = mode === 'logo-dulu' ? 650 : 0;
      daftar.forEach(p => {
        let dari, tunda, dur = 1350;
        if (mode === 'serpih') {
          const sudut = r() * Math.PI * 2, jauh = 650 + r() * 450;
          dari = { transform: tf(p.a, p.r0, .35, .35, Math.cos(sudut) * jauh, Math.sin(sudut) * jauh, (r() - .5) * 540), opacity: 0 };
          tunda = (4 - p.k) * 140 + r() * 520; dur = 1500;
        } else {
          dari = { transform: tf(p.a - 38, p.r0 * .25, .16, .1), opacity: 0 };
          tunda = L0 + p.k * 270 + p.i * 38;
        }
        tunggu.push(KC.anim(p.e, [dari, { opacity: 1, offset: .35 }, { transform: p.akhir, opacity: 1 }], { duration: dur, delay: tunda, easing: kurvaMekar }));
      });
      const akhirBunga = mode === 'serpih' ? 2100 : L0 + 4 * 270 + 8 * 38 + 1350;
      const tLogo = mode === 'logo-dulu' ? 0 : akhirBunga - 450;
      tunggu.push(KC.anim(tatakan, [{ transform: 'scale(.25)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 1100, delay: tLogo, easing: KC.kurva('pegas') }));
      tunggu.push(KC.anim(logo, [{ transform: 'scale(.6)', opacity: 0, filter: 'blur(8px)' }, { transform: 'none', opacity: 1, filter: 'blur(0)' }], { duration: 900, delay: tLogo + 250, easing: KC.kurva('keluar') }));
      if (!KC.instan && !KC.kurangGerak) { ombak(mode === 'serpih' ? 0 : L0, 1); ombak(tLogo + 300, o.varian === 'tetes' ? 3 : 2); }
      [...tetes.children].forEach((t, j) => tunggu.push(KC.anim(t, [{ transform: 'translateY(-14px) scale(.2)', opacity: 0 }, { transform: 'none', opacity: 1 }],
        { duration: 700, delay: akhirBunga + 150 + j * 70, easing: KC.kurva('pegas') })));
      await Promise.all(tunggu);
      host.classList.add('mw-hidup');
    }
    function diam() { KC.instan = true; const p = mainkan(); KC.instan = false; return p; }
    return { mainkan, diam, host };
  }

  /* ---------- adegan sampul & penutup ---------- */
  const adegan = mode => async (s) => {
    const host = s.querySelector('.mw-panggung'); if (!host) return;
    const m = buat(host); await m.mainkan(host.dataset.mekar || mode);
  };
  KC.adegan = KC.adegan || {};
  KC.adegan['mawar-sampul'] = adegan('tengah');
  KC.adegan['mawar-penutup'] = adegan('serpih');

  /* ---------- mawar pojok: tampil di semua slide kecuali slide bermawar besar ---------- */
  function pojok(dek, opsi = {}) {
    dek = dek || document.querySelector('.dek');
    if (dek.querySelector(':scope > .mw-pojok')) return;
    const w = document.createElement('div'); w.className = 'mw-pojok'; w.setAttribute('aria-hidden', 'true');
    const g = document.createElement('div'); g.className = 'mw-pojok-g'; const p = document.createElement('div');
    g.append(p); w.append(g); dek.append(w); dek.classList.add('mw-ada-pojok');
    const sumber = dek.querySelector('.mw-panggung');
    const pilihan = Object.assign({ varian: sumber?.dataset.varian || 'embun', palet: sumber?.dataset.palet || 'sakura', inisial: sumber?.dataset.inisial || 'UT', mini: true }, opsi);
    const m = buat(p, pilihan); m.diam();
    let pernah = false;
    const cek = () => {
      const s = dek.querySelector(':scope > .slide.aktif'); if (!s) return;
      const besar = !!s.querySelector('.mw-panggung') || s.dataset.mawarPojok === 'tidak';
      if (besar) { w.classList.remove('tampil'); return; }
      if (!w.classList.contains('tampil')) {
        w.classList.add('tampil');
        if (!pernah && !document.documentElement.hasAttribute('data-cetak')) {
          /* pertama kali meninggalkan sampul: mawar besar mengecil ke pojok */
          KC.anim(g, [{ transform: 'translate(560px,380px) scale(6)', opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'none', opacity: 1 }], { duration: 1300, easing: KC.kurva('pegas-lembut') });
        }
        pernah = true;
      }
    };
    const mo = new MutationObserver(cek);
    dek.querySelectorAll(':scope > .slide').forEach(s => mo.observe(s, { attributes: true, attributeFilter: ['class'] }));
    cek();
  }

  KC.mawar = { buat, pojok, PALET, VARIAN, MEKAR, LAPIS };
  /* pasang pojok otomatis bila dek memintanya: <main class="dek" data-mawar-pojok="ya"> */
  const auto = () => { const d = document.querySelector('.dek[data-mawar-pojok="ya"]'); if (d) pojok(d); };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', auto) : queueMicrotask(auto);
})(window.KC);
