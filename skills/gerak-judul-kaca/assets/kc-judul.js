/* ==========================================================
   KC GERAK JUDUL — 12 gerak masuk judul per halaman (J1–J12)
   J1 sama dengan judul di galeri demo kaca cair (naik dengan pegas);
   J2–J12 variasi cairnya. Mesin membagi gerak ke tiap slide supaya
   dua slide berurutan tidak pernah memakai gerak yang sama.
   Pakai:
     <main class="dek" data-judul-gaya="acak">   (bawaan)  · atau "J4" untuk satu gerak di semua slide
     <h2 class="t-judul" data-judul="J7">…</h2> (paksa satu slide)   · data-judul="tidak" (tanpa gerak)
   Dimuat sesudah kc-inti.js dan SEBELUM KC.mulai() (rakit.py sudah begitu).
   Tanpa Math.random(): urutan gerak memakai PRNG berbiji dari judul dek.
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  const prng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const benih = s => { let h = 1779033703 ^ s.length; for (const c of s) { h = Math.imul(h ^ c.charCodeAt(0), 3432918353); h = h << 13 | h >>> 19; } return h >>> 0; };
  const K = n => KC.kurva(n);

  /* pecah judul: kata utuh (tidak terpotong di tengah) berisi huruf */
  function pecah(el) {
    if (el.dataset.kjPecah) return { kata: [...el.querySelectorAll('.kj-kata')], huruf: [...el.querySelectorAll('.kj-h')] };
    const teks = el.textContent; el.dataset.kjPecah = 1; el.setAttribute('aria-label', teks); el.textContent = '';
    const kata = [], huruf = [];
    teks.split(/(\s+)/).forEach(b => {
      if (!b) return;
      if (/^\s+$/.test(b)) { el.append(document.createTextNode(' ')); return; }
      const k = document.createElement('span'); k.className = 'kj-kata'; k.setAttribute('aria-hidden', 'true');
      [...b].forEach(c => { const h = document.createElement('span'); h.className = 'kj-h'; h.textContent = c; k.append(h); huruf.push(h); });
      el.append(k); kata.push(k);
    });
    return { kata, huruf };
  }
  const salinan = (el, kelas) => { const c = el.cloneNode(true); c.removeAttribute('data-judul'); c.className += ' ' + kelas; c.setAttribute('aria-hidden', 'true');
    const b = KC.rel(el, el.offsetParent); Object.assign(c.style, { position: 'absolute', left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', margin: 0 });
    el.offsetParent.append(c); return c; };

  /* ---------- 12 gerak ---------- */
  const J = {
    J1: { nama: 'Naik pegas', ket: 'kata naik bergantian dengan pegas lembut — sama seperti judul di referensi',
      f: el => Promise.all(pecah(el).kata.map((k, i) => KC.anim(k, [{ opacity: 0, transform: 'translateY(48px)' }, { opacity: 1, transform: 'none' }], { duration: 950, delay: i * 80, easing: K('pegas-lembut') }))) },
    J2: { nama: 'Gulir huruf', ket: 'huruf berguling naik satu per satu dengan jejak gerak (khas Liquid Glass)',
      f: el => { const { kata, huruf } = pecah(el); kata.forEach(k => k.classList.add('kj-potong'));
        return Promise.all(huruf.map((h, i) => KC.anim(h, [{ transform: 'translateY(105%)', textShadow: '0 -.25em 0 color-mix(in srgb,currentColor 40%,transparent),0 -.5em 0 color-mix(in srgb,currentColor 22%,transparent)' },
          { transform: 'translateY(-6%)', textShadow: '0 0 0 transparent', offset: .7 }, { transform: 'none', textShadow: '0 0 0 transparent' }], { duration: 760, delay: i * 30, easing: K('pegas-lembut') })))
          .then(() => kata.forEach(k => k.classList.remove('kj-potong'))); } },
    J3: { nama: 'Embun', ket: 'judul mengembun dari kabut: kabur dan renggang lalu rapat dan tajam',
      f: el => KC.anim(el, [{ filter: 'blur(22px)', letterSpacing: '.3em', opacity: 0 }, { filter: 'blur(0)', letterSpacing: getComputedStyle(el).letterSpacing, opacity: 1 }], { duration: 1300, easing: K('keluar') }) },
    J4: { nama: 'Ombak', ket: 'huruf naik bergelombang, memanjang lalu memantul',
      f: el => Promise.all(pecah(el).huruf.map((h, i) => KC.anim(h, [{ transform: 'translateY(.7em) scaleY(1.35)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 900, delay: i * 32, easing: K('pegas') }))) },
    J5: { nama: 'Tetes', ket: 'tiap huruf jatuh seperti tetes air, gepeng saat mendarat',
      f: el => Promise.all(pecah(el).huruf.map((h, i) => KC.anim(h, [
        { transform: 'translateY(-1.3em) scale(.75,1.3)', opacity: 0, easing: 'cubic-bezier(.5,0,.9,.5)' },
        { offset: .55, transform: 'translateY(0) scale(1.25,.76)', opacity: 1, easing: K('pegas') }, { transform: 'none', opacity: 1 }], { duration: 900, delay: i * 45, easing: 'linear' }))) },
    J6: { nama: 'Kaca terisi', ket: 'judul muncul sebagai garis kaca bening, lalu warna mengisi dari kiri dengan kilau',
      f: async el => { const h = salinan(el, 'kj-hantu');
        await Promise.all([KC.anim(h, [{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: K('keluar') }),
          KC.anim(el, [{ clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% 0 -10% 0)' }], { duration: 1100, delay: 350, easing: K('cair') })]);
        el.classList.add('kj-kilau'); await KC.anim(h, [{ opacity: 1 }, { opacity: 0 }], { duration: 500 }); h.remove();
        setTimeout(() => el.classList.remove('kj-kilau'), 1400); } },
    J7: { nama: 'Lensa menyapu', ket: 'pil kaca meluncur sepanjang judul dan meninggalkan huruf di belakangnya',
      f: async el => { const b = KC.rel(el, el.offsetParent), l = document.createElement('i'); l.className = 'kaca pil kj-lensa';
        const tinggi = Math.min(b.h * 1.25, parseFloat(getComputedStyle(el).fontSize) * 1.45), lebar = tinggi * 1.9;
        Object.assign(l.style, { left: b.x + 'px', top: (b.y + b.h / 2 - tinggi / 2) + 'px', width: lebar + 'px', height: tinggi + 'px' }); el.offsetParent.append(l);
        const jalan = Math.max(0, b.w - lebar);
        await Promise.all([KC.anim(l, [{ transform: 'translateX(-40px) scale(.6)', opacity: 0 }, { transform: 'translateX(0) scale(1)', opacity: 1, offset: .15 },
          { transform: `translateX(${jalan}px) scale(1)`, opacity: 1, offset: .85 }, { transform: `translateX(${jalan + 40}px) scale(.6)`, opacity: 0 }], { duration: 1500, easing: K('cair') }),
          KC.anim(el, [{ clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% 92% -10% 0)', offset: .15 }, { clipPath: 'inset(-10% 4% -10% 0)', offset: .85 }, { clipPath: 'inset(-10% 0 -10% 0)' }], { duration: 1500, easing: K('cair') })]);
        l.remove(); } },
    J8: { nama: 'Leleh', ket: 'huruf meleleh turun dari atas, memanjang dan kabur, lalu mengeras di tempatnya',
      f: el => { const hs = pecah(el).huruf, r = prng(hs.length * 31);
        return Promise.all(hs.map(h => KC.anim(h, [{ transform: 'translateY(-.55em) scaleY(2.1)', filter: 'blur(5px)', opacity: 0 }, { transform: 'none', filter: 'blur(0)', opacity: 1 }],
          { duration: 1000, delay: r() * 420, easing: K('pegas-lembut') }))); } },
    J9: { nama: 'Riak air', ket: 'judul bergelombang seperti pantulan di air, lalu tenang dan tajam',
      f: el => new Promise(selesai => {
        const defs = document.querySelector('svg.kc-defs defs'); if (!defs) return selesai(KC.anim(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 700 }));
        const id = 'kj-riak-' + Math.round(performance.now());
        defs.insertAdjacentHTML('beforeend', `<filter id="${id}" x="-10%" y="-40%" width="120%" height="180%" color-interpolation-filters="sRGB"><feTurbulence type="turbulence" baseFrequency=".006 .035" numOctaves="1" seed="4"/><feDisplacementMap in="SourceGraphic" scale="70" xChannelSelector="R" yChannelSelector="G"/></filter>`);
        const f = document.getElementById(id), dm = f.querySelector('feDisplacementMap'), tb = f.querySelector('feTurbulence');
        el.style.filter = `url(#${id})`; el.style.opacity = 0; const t0 = performance.now(), D = 1500;
        const langkah = now => { const p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3);
          dm.setAttribute('scale', (70 * (1 - e)).toFixed(1)); tb.setAttribute('baseFrequency', `.006 ${(.035 - .015 * e).toFixed(3)}`); el.style.opacity = Math.min(1, p * 2.5);
          if (p < 1) requestAnimationFrame(langkah); else { el.style.filter = ''; el.style.opacity = ''; f.remove(); selesai(); } };
        requestAnimationFrame(langkah); }) },
    J10: { nama: 'Gelembung', ket: 'tiap kata lahir di dalam gelembung yang lalu meletup',
      f: el => Promise.all(pecah(el).kata.map((k, i) => { const g = document.createElement('i'); g.className = 'kj-gel'; k.append(g);
        return Promise.all([KC.anim(k, [{ transform: 'scale(.3)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 800, delay: i * 140, easing: K('pegas') }),
          KC.anim(g, [{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1, offset: .45 }, { transform: 'scale(1.45)', opacity: 0 }], { duration: 1100, delay: i * 140, easing: K('keluar') })]).then(() => g.remove()); })) },
    J11: { nama: 'Pantulan air', ket: 'judul naik dari garis air dengan bayangan pantulan yang memudar',
      f: async el => { const p = salinan(el, 'kj-pantul');
        await Promise.all([KC.anim(el, [{ clipPath: 'inset(-10% 0 100% 0)', transform: 'translateY(.5em)' }, { clipPath: 'inset(-10% 0 -10% 0)', transform: 'none' }], { duration: 1100, easing: K('pegas-lembut') }),
          KC.anim(p, [{ opacity: .45, transform: 'translateY(.9em) scaleY(-.9) skewX(-6deg)' }, { opacity: .3, transform: 'translateY(1em) scaleY(-.95) skewX(4deg)', offset: .5 }, { opacity: 0, transform: 'translateY(1.05em) scaleY(-1)' }], { duration: 1600, easing: K('keluar') })]);
        p.remove(); } },
    J12: { nama: 'Tirai air', ket: 'tirai air mengalir dari kiri ke kanan, judul tampak di belakangnya',
      f: el => KC.anim(el, [{ maskPosition: '100% 0', webkitMaskPosition: '100% 0', filter: 'blur(4px)' }, { maskPosition: '0% 0', webkitMaskPosition: '0% 0', filter: 'blur(0)' }],
        { duration: 1300, easing: K('cair') }).then(() => el.classList.remove('kj-tirai')), siap: el => el.classList.add('kj-tirai') }
  };
  const KODE = Object.keys(J);

  /* ---------- bagi gerak ke slide ---------- */
  function siapkan(dek) {
    if (!dek || dek._kjSiap) return; dek._kjSiap = true;
    const gaya = dek.dataset.judulGaya || 'acak', r = prng(benih(document.title + (dek.dataset.kelompok || '')));
    let kantong = [], lalu = '';
    const ambil = () => { if (!kantong.length) { kantong = KODE.slice(); for (let i = kantong.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [kantong[i], kantong[j]] = [kantong[j], kantong[i]]; } }
      let k = kantong.shift(); if (k === lalu && kantong.length) { kantong.push(k); k = kantong.shift(); } return k; };
    dek.querySelectorAll(':scope > .slide').forEach(s => {
      if (s.dataset.tipe === 'pustaka') return;
      const h = s.querySelector('.isi .t-judul, .isi .t-raksasa'); if (!h || h.closest('.mw-panggung,.lensa-panggung') || h.dataset.efek || h.dataset.morph) return;
      if (h.dataset.judul === 'tidak') return;
      if (!J[h.dataset.judul]) h.dataset.judul = J[gaya] ? gaya : ambil();
      lalu = h.dataset.judul; delete h.dataset.masuk;
    });
    const mo = new MutationObserver(cat => cat.forEach(c => { const s = c.target;
      if (!s.classList.contains('masuk')) { s._kj = false; return; }
      if (s._kj) return; s._kj = true;
      if (document.documentElement.hasAttribute('data-cetak') || KC.instan || KC.kurangGerak) return;
      s.querySelectorAll('.isi [data-judul]').forEach(async h => { const g = J[h.dataset.judul]; if (!g) return;
        g.siap && g.siap(h); h.classList.add('kj-jalan', 'kj-tunggu');
        await KC.tunggu((+h.dataset.ketuk || 0) * KC.ketukMs); h.classList.remove('kj-tunggu');
        try { await g.f(h); } catch (e) { console.error('judul', h.dataset.judul, e); } }); }));
    dek.querySelectorAll(':scope > .slide').forEach(s => mo.observe(s, { attributes: true, attributeFilter: ['class'] }));
  }

  KC.judul = { daftar: Object.fromEntries(KODE.map(k => [k, { nama: J[k].nama, ket: J[k].ket }])), siapkan, jalankan: (el, kode) => J[kode].f(el) };
  const d = document.querySelector('.dek'); if (d) siapkan(d); else document.addEventListener('DOMContentLoaded', () => siapkan(document.querySelector('.dek')));
})(window.KC);
