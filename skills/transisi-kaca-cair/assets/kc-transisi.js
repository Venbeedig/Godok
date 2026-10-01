/* ==========================================================
   KC TRANSISI — 16 transisi kaca cair + pudar cadangan
   Kontrak: async fn(lama, baru, o) dengan
     o = {arah: 1|-1, dek, fx, titik:{x,y}}
   Mesin sudah memberi .tampil ke kedua slide, baru di atas lama.
   Properti .masuk = ms sejak mulai transisi untuk memulai animasi isi.
   Sesudah selesai, mesin membersihkan style inline kedua slide.
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  const W = 1920, H = 1080;
  const mk = (cls, css) => { const e = document.createElement('div'); e.className = cls; if (css) e.style.cssText = css; return e; };
  const R = (x, y) => Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 40;
  const prng = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
  const rAF = (dur, fn, kurva = t => t) => new Promise(ok => {
    if (KC.instan) { fn(1); return ok(); }
    const t0 = performance.now();
    const f = now => { const p = Math.min(1, (now - t0) / dur); fn(kurva(p)); p < 1 ? requestAnimationFrame(f) : ok(); };
    requestAnimationFrame(f);
  });
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 4);
  const riak = (fx, x, y, n = 3, tunda = 0) => { for (let k = 0; k < n; k++) { const r = mk('kc-fx-riak', `left:${x}px;top:${y}px`); fx.append(r);
    KC.anim(r, [{ transform: 'scale(.2)', opacity: .95 }, { transform: `scale(${5 + k * 3})`, opacity: 0 }], { duration: 1300, delay: tunda + k * 150, easing: 'cubic-bezier(.2,.7,.3,1)' }); } };
  const beku = el => { const c = el.cloneNode(true); c.classList.add('kc-beku'); c.classList.remove('aktif'); c.removeAttribute('id'); return c; };

  const T = {};

  /* ===================== A. TETESAN & CIPRATAN ===================== */
  /* A1 tetes: setetes kaca jatuh, memantul, riak membuka slide baru */
  T.tetes = async (lama, baru, { fx, titik }) => {
    const x = titik?.x ?? W / 2, y = titik?.y ?? H / 2, d = 120;
    baru.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    const t = mk('kaca bulat kc-fx-tetes', `width:${d}px;height:${d * 1.12}px`); fx.append(t);
    await KC.anim(t, [{ transform: `translate(${x - d / 2}px,-200px) scale(.86,1.2)` }, { transform: `translate(${x - d / 2}px,${y - d / 2}px) scale(.86,1.2)` }],
      { duration: 560, easing: 'cubic-bezier(.55,0,1,.45)' });
    KC.anim(t, [{ transform: `translate(${x - d / 2}px,${y - d / 2}px) scale(1.6,.55)`, opacity: 1 }, { transform: `translate(${x - d / 2}px,${y - d / 2}px) scale(3.4,.15)`, opacity: 0 }], { duration: 420, easing: 'ease-out' });
    riak(fx, x, y, 3);
    await KC.anim(baru, [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R(x, y)}px at ${x}px ${y}px)` }], { duration: 1050, easing: KC.kurva('keluar') });
  };
  T.tetes.masuk = 760;

  /* A2 riak: lingkaran membesar dari titik klik / tombol */
  T.riak = async (lama, baru, { fx, titik }) => {
    const x = titik?.x ?? W / 2, y = titik?.y ?? H / 2;
    riak(fx, x, y, 3);
    const cincin = mk('kc-fx-cincin', `left:${x}px;top:${y}px`); fx.append(cincin);
    KC.anim(cincin, [{ width: '0px', height: '0px', opacity: 1 }, { width: R(x, y) * 2 + 'px', height: R(x, y) * 2 + 'px', opacity: .2 }], { duration: 1000, easing: KC.kurva('keluar') });
    await KC.anim(baru, [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R(x, y)}px at ${x}px ${y}px)` }], { duration: 1000, easing: KC.kurva('keluar') });
  };
  T.riak.masuk = 300;

  /* A3 leleh: slide baru dituang dari atas dengan tetesan di ujungnya */
  T.leleh = async (lama, baru, { arah }) => {
    const r = prng(97), tetes = Array.from({ length: 13 }, (_, i) => ({ x: (i + .2 + r() * .6) * W / 13, w: 50 + r() * 90, l: 70 + r() * 230 }));
    const maks = 300, langkah = 24;
    await rAF(1300, p => {
      const yb = p * (H + maks + 60) - maks - 60, pts = [];
      for (let x = W; x >= 0; x -= langkah) {
        let d = 0; for (const t of tetes) { const u = (x - t.x) / t.w; if (Math.abs(u) < 1) d += t.l * Math.pow(Math.cos(u * Math.PI / 2), 2); }
        const y = yb + d; pts.push(`${x}px ${arah > 0 ? y : H - y}px`);
      }
      const atas = arah > 0 ? '0px 0px,1920px 0px' : '0px 1080px,1920px 1080px';
      baru.style.clipPath = `polygon(${atas},${pts.join(',')})`;
    }, easeInOut);
  };
  T.leleh.masuk = 700;

  /* A4 cipratan: butir kaca terpercik, tiap butir membuka lingkaran */
  T.cipratan = async (lama, baru, { fx, titik }) => {
    const x0 = titik?.x ?? W / 2, y0 = titik?.y ?? H / 2, r = prng(31), n = 8;
    const butir = Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2 + r() * .5, j = 260 + r() * 420; return { x: x0 + Math.cos(a) * j * 1.5, y: y0 + Math.sin(a) * j, s: 46 + r() * 50 }; });
    butir.push({ x: x0, y: y0, s: 90 });
    baru.style.webkitMaskImage = baru.style.maskImage = 'linear-gradient(transparent,transparent)';
    const bola = butir.map(b => { const e = mk('kaca bulat kc-fx-butir', `width:${b.s}px;height:${b.s}px;left:${-b.s / 2}px;top:${-b.s / 2}px`); fx.append(e);
      KC.anim(e, [{ transform: `translate(${x0}px,${y0}px) scale(.3)` }, { transform: `translate(${b.x}px,${b.y}px) scale(1)` }], { duration: 420, easing: 'cubic-bezier(.2,.8,.3,1)' }); return e; });
    await KC.tunggu(380);
    bola.forEach(e => KC.anim(e, [{ opacity: 1 }, { opacity: 0, transform: getComputedStyle(e).transform + ' scale(2.4)' }], { duration: 500 }));
    await rAF(950, p => {
      const g = butir.map((b, i) => { const q = Math.max(0, Math.min(1, (p - i * .03) / .8)), rr = easeOut(q) * R(b.x, b.y);
        return `radial-gradient(circle at ${b.x}px ${b.y}px,#000 ${rr}px,transparent ${rr + 1.5}px)`; }).join(',');
      baru.style.webkitMaskImage = baru.style.maskImage = g;
    });
  };
  T.cipratan.masuk = 600;

  /* ===================== B. KACA BERGESER & PECAH ===================== */
  /* B1 panel geser: lembaran kaca tebal menyapu layar */
  T.panel = async (lama, baru, { fx, arah }) => {
    baru.style.opacity = 0;
    const p = mk('kaca kc-fx-panel'); fx.append(p);
    const a = arah > 0 ? 1 : -1;
    await KC.anim(p, [{ transform: `translateX(${a * 2200}px) skewX(${-a * 6}deg)` }, { transform: 'translateX(-100px) skewX(0deg)' }], { duration: 560, easing: 'cubic-bezier(.7,0,.3,1)' });
    baru.style.opacity = 1; lama.style.visibility = 'hidden';
    await KC.anim(p, [{ transform: 'translateX(-100px)' }, { transform: `translateX(${-a * 2300}px) skewX(${a * 6}deg)` }], { duration: 640, easing: 'cubic-bezier(.6,0,.2,1)' });
  };
  T.panel.masuk = 650;

  /* B2 tirai kaca: bilah-bilah kaca turun beruntun */
  T.tirai = async (lama, baru, { fx, arah }) => {
    baru.style.opacity = 0; const n = 8, w = W / n;
    const bil = Array.from({ length: n }, (_, i) => { const b = mk('kaca kc-fx-bilah', `left:${i * w - 1}px;width:${w + 2}px`); fx.append(b); return b; });
    const urut = i => (arah > 0 ? i : n - 1 - i) * 55;
    await Promise.all(bil.map((b, i) => KC.anim(b, [{ transform: 'translateY(-105%)' }, { transform: 'translateY(0)' }], { duration: 480, delay: urut(i), easing: 'cubic-bezier(.7,0,.3,1)' })));
    baru.style.opacity = 1; lama.style.visibility = 'hidden';
    await Promise.all(bil.map((b, i) => KC.anim(b, [{ transform: 'translateY(0)' }, { transform: 'translateY(105%)' }], { duration: 520, delay: urut(i), easing: 'cubic-bezier(.6,0,.3,1)' })));
  };
  T.tirai.masuk = 700;

  /* B3 retak: kaca slide lama retak dari titik pukul lalu runtuh */
  T.retak = async (lama, baru, { fx, titik }) => {
    const x = titik?.x ?? W * .56, y = titik?.y ?? H * .44, r = prng(53), n = 10;
    const sud = Array.from({ length: n }, (_, i) => (i + .3 + r() * .4) / n * Math.PI * 2).sort((a, b) => a - b);
    const tepi = a => { const dx = Math.cos(a), dy = Math.sin(a); const tx = dx > 0 ? (W - x) / dx : dx < 0 ? -x / dx : 1e9, ty = dy > 0 ? (H - y) / dy : dy < 0 ? -y / dy : 1e9; const t = Math.min(tx, ty); return [x + dx * t, y + dy * t]; };
    const sudut = [[W, H], [0, H], [0, 0], [W, 0]].map(([cx, cy]) => ({ p: [cx, cy], a: (Math.atan2(cy - y, cx - x) + Math.PI * 2) % (Math.PI * 2) }));
    // garis retak
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'kc-fx-retak'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = sud.map(a => { const [ex, ey] = tepi(a); return `<line x1="${x}" y1="${y}" x2="${ex}" y2="${ey}"/>`; }).join('');
    fx.append(svg);
    await KC.anim(svg, [{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
    // kepingan = klon beku slide lama, dipotong per irisan
    const keping = sud.map((a0, i) => {
      const a1 = i + 1 < n ? sud[i + 1] : sud[0] + Math.PI * 2;
      const sd = sudut.map(c => ({ p: c.p, a: c.a < a0 ? c.a + Math.PI * 2 : c.a })).filter(c => c.a > a0 && c.a < a1).sort((p, q) => p.a - q.a);
      const pts = [[x, y], tepi(a0), ...sd.map(c => c.p), tepi(a1)];
      const k = beku(lama); k.style.clipPath = `polygon(${pts.map(p => `${p[0]}px ${p[1]}px`).join(',')})`; k.style.zIndex = 3; fx.append(k);
      return { k, am: (a0 + a1) / 2 };
    });
    lama.style.visibility = 'hidden'; svg.remove();
    await Promise.all(keping.map(({ k, am }, i) => KC.anim(k, [
      { transform: 'none', opacity: 1 },
      { transform: `translate(${Math.cos(am) * 120}px,${Math.sin(am) * 60 + 30}px) rotate(${(r() - .5) * 8}deg)`, opacity: 1, offset: .25 },
      { transform: `translate(${Math.cos(am) * 380}px,${1250 + r() * 300}px) rotate(${(r() - .5) * 70}deg)`, opacity: .9 }],
      { duration: 1250, delay: i * 25, easing: 'cubic-bezier(.45,0,.85,.45)' })));
  };
  T.retak.masuk = 500;

  /* B4 wiper: bilah kaca miring menyapu, slide baru di belakangnya */
  T.wiper = async (lama, baru, { fx, arah }) => {
    const m = 260, a = arah > 0;
    const poli = s => a ? `polygon(0px 0px,${s + m}px 0px,${s - m}px ${H}px,0px ${H}px)` : `polygon(${W}px 0px,${s + m}px 0px,${s - m}px ${H}px,${W}px ${H}px)`;
    const s0 = a ? -m - 120 : W + m + 120, s1 = a ? W + m + 120 : -m - 120;
    const bil = mk('kaca kc-fx-wiper'); fx.append(bil);
    const o = { duration: 1150, easing: 'cubic-bezier(.65,0,.35,1)' };
    KC.anim(bil, [{ transform: `translateX(${s0 - 90}px) rotate(13.5deg)` }, { transform: `translateX(${s1 - 90}px) rotate(13.5deg)` }], o);
    await KC.anim(baru, [{ clipPath: poli(s0) }, { clipPath: poli(s1) }], o);
  };
  T.wiper.masuk = 500;

  /* ===================== C. MORPH ELEMEN SAMA ===================== */
  /* C1 morph: elemen ber-data-morph sama pindah & berubah bentuk */
  T.morph = async (lama, baru, { fx, dek }) => {
    const pas = [...baru.querySelectorAll('[data-morph]')].map(b => [lama.querySelector(`[data-morph="${b.dataset.morph}"]`), b]).filter(p => p[0]);
    const lainLama = [...lama.querySelectorAll('.isi > *')];
    lainLama.forEach(e => KC.anim(e, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.97)' }], { duration: 320 }));
    baru.style.opacity = 0;
    const kerja = pas.map(([a, b]) => {
      const ra = KC.rel(a, dek), rb = KC.rel(b, dek), kaca = a.classList.contains('kaca');
      const p = a.cloneNode(true); p.removeAttribute('data-masuk'); fx.append(p);
      Object.assign(p.style, { position: 'absolute', left: 0, top: 0, margin: 0, width: ra.w + 'px', height: ra.h + 'px', transformOrigin: '0 0', opacity: 1, boxSizing: 'border-box' });
      const ka = getComputedStyle(a).borderTopLeftRadius, kb = getComputedStyle(b).borderTopLeftRadius;
      a.style.visibility = 'hidden';
      if (kaca) {
        [...p.children].forEach(c => KC.anim(c, [{ opacity: 1 }, { opacity: 0 }], { duration: 220 }));
        return KC.anim(p, [{ transform: `translate(${ra.x}px,${ra.y}px)`, width: ra.w + 'px', height: ra.h + 'px', borderRadius: ka },
          { transform: `translate(${rb.x}px,${rb.y}px)`, width: rb.w + 'px', height: rb.h + 'px', borderRadius: kb }], { duration: 950, easing: KC.kurva('pegas') });
      }
      return KC.anim(p, [{ transform: `translate(${ra.x}px,${ra.y}px) scale(1)` }, { transform: `translate(${rb.x}px,${rb.y}px) scale(${rb.w / ra.w},${rb.h / ra.h})` }], { duration: 900, easing: KC.kurva('pegas-lembut') });
    });
    await KC.tunggu(260);
    lama.style.visibility = 'hidden';
    baru.style.opacity = 1;
    pas.forEach(([, b]) => b.style.visibility = 'hidden');
    await Promise.all(kerja);
    pas.forEach(([a, b]) => { b.style.visibility = ''; a.style.visibility = ''; });
  };
  T.morph.masuk = 420;

  /* C2 pil jembatan: tombol Berikutnya mekar jadi lembar kaca penuh */
  T.pil = async (lama, baru, { fx, dek }) => {
    const tbl = dek.querySelector('.kc-nav-maju'), r = tbl ? KC.rel(tbl, dek) : { x: 1700, y: 960, w: 120, h: 72 };
    baru.style.opacity = 0;
    const p = mk('kaca kc-fx-pil', `left:0;top:0`); fx.append(p);
    await KC.anim(p, [{ transform: `translate(${r.x}px,${r.y}px)`, width: r.w + 'px', height: r.h + 'px', borderRadius: '999px' },
      { transform: 'translate(-20px,-20px)', width: W + 40 + 'px', height: H + 40 + 'px', borderRadius: '0px' }], { duration: 760, easing: KC.kurva('pegas-lembut') });
    baru.style.opacity = 1; lama.style.visibility = 'hidden';
    await KC.anim(p, [{ opacity: 1, transform: 'translate(-20px,-20px) scale(1)' }, { opacity: 0, transform: 'translate(-20px,-20px) scale(1.06)' }], { duration: 520 });
  };
  T.pil.masuk = 800;

  /* C3 gumpal pindah: semua kaca lama melebur jadi satu gumpal lalu pecah ke posisi baru */
  T.gumpal = async (lama, baru, { fx, dek }) => {
    const ambil = s => [...s.querySelectorAll('.isi .kaca')].filter(e => e.offsetWidth > 40).slice(0, 12).map(e => ({ r: KC.rel(e, dek), k: parseFloat(getComputedStyle(e).borderTopLeftRadius) || 28 }));
    const A = ambil(lama); baru.style.opacity = 0;
    const B = ambil(baru);
    const lap = mk('kc-goo'); fx.append(lap);
    const n = Math.max(A.length, B.length, 1), c = { x: W / 2 - 140, y: H / 2 - 140, w: 280, h: 280 };
    const bit = Array.from({ length: n }, (_, i) => { const a = A[i % Math.max(A.length, 1)] || { r: c, k: 140 }; const b = mk(''); lap.append(b);
      Object.assign(b.style, { position: 'absolute', left: a.r.x + 'px', top: a.r.y + 'px', width: a.r.w + 'px', height: a.r.h + 'px', borderRadius: a.k + 'px' }); return b; });
    lama.querySelectorAll('.isi > *').forEach(e => KC.anim(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 }));
    await Promise.all(bit.map((b, i) => { const a = A[i % Math.max(A.length, 1)] || { r: c, k: 140 };
      return KC.anim(b, [{ left: a.r.x + 'px', top: a.r.y + 'px', width: a.r.w + 'px', height: a.r.h + 'px', borderRadius: a.k + 'px' },
        { left: c.x + 'px', top: c.y + 'px', width: c.w + 'px', height: c.h + 'px', borderRadius: '140px' }], { duration: 650, delay: i * 30, easing: 'cubic-bezier(.6,0,.3,1)' }); }));
    lama.style.visibility = 'hidden'; baru.style.opacity = 1;
    baru.querySelectorAll('.isi > *').forEach(e => e.style.opacity = 0);
    await Promise.all(bit.map((b, i) => { const t = B[i % Math.max(B.length, 1)] || { r: c, k: 140 };
      return KC.anim(b, [{ left: c.x + 'px', top: c.y + 'px', width: c.w + 'px', height: c.h + 'px', borderRadius: '140px' },
        { left: t.r.x + 'px', top: t.r.y + 'px', width: t.r.w + 'px', height: t.r.h + 'px', borderRadius: t.k + 'px' }], { duration: 950, delay: i * 45, easing: KC.kurva('pegas') }); }));
    baru.querySelectorAll('.isi > *').forEach(e => e.style.opacity = '');
    await KC.anim(lap, [{ opacity: 1 }, { opacity: 0 }], { duration: 380 });
  };
  T.gumpal.masuk = 1500;

  /* C4 teks mengalir: judul lama berpindah tempat sambil hurufnya berguling jadi judul baru */
  T.alir = async (lama, baru, { fx, dek }) => {
    const ja = lama.querySelector('[data-morph="judul"],.t-judul,.t-raksasa'), jb = baru.querySelector('[data-morph="judul"],.t-judul,.t-raksasa');
    if (!ja || !jb) return T.pudar(lama, baru, {});
    const ra = KC.rel(ja, dek), rb = KC.rel(jb, dek);
    const p = ja.cloneNode(true); p.removeAttribute('data-masuk'); fx.append(p);
    Object.assign(p.style, { position: 'absolute', left: 0, top: 0, margin: 0, transformOrigin: '0 0', whiteSpace: 'nowrap', color: getComputedStyle(ja).color, transform: `translate(${ra.x}px,${ra.y}px)` });
    ja.style.visibility = 'hidden';
    lama.querySelectorAll('.isi > *').forEach(e => KC.anim(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 }));
    baru.style.opacity = 0;
    const sk = parseFloat(getComputedStyle(jb).fontSize) / parseFloat(getComputedStyle(ja).fontSize);
    const gerak = KC.anim(p, [{ transform: `translate(${ra.x}px,${ra.y}px) scale(1)` }, { transform: `translate(${rb.x}px,${rb.y}px) scale(${sk})` }], { duration: 1000, easing: KC.kurva('pegas-lembut') });
    await KC.gulirKata(p, jb.textContent.trim(), { arah: 1 });
    await gerak;
    lama.style.visibility = 'hidden'; baru.style.opacity = 1;
  };
  T.alir.masuk = 900;

  /* ===================== D. KAMERA & KEDALAMAN ===================== */
  /* D1 tembus lensa: lensa membesar dari tengah, dunia baru terlihat lewat kaca */
  T.lensa = async (lama, baru, { fx, titik }) => {
    const x = titik?.x ?? W / 2, y = titik?.y ?? H / 2, rr = R(x, y);
    const c = mk('kc-fx-lensa', `left:${x}px;top:${y}px`); fx.append(c);
    const o = { duration: 1150, easing: 'cubic-bezier(.7,0,.2,1)' };
    KC.anim(lama, [{ transform: 'scale(1)', filter: 'blur(0)' }, { transform: 'scale(1.12)', filter: 'blur(6px)' }], o);
    KC.anim(c, [{ width: '0px', height: '0px', opacity: 1 }, { width: '420px', height: '420px', opacity: 1, offset: .35 }, { width: rr * 2 + 'px', height: rr * 2 + 'px', opacity: 0 }], o);
    await KC.anim(baru, [{ clipPath: `circle(0px at ${x}px ${y}px)`, transform: 'scale(1.5)' }, { clipPath: `circle(210px at ${x}px ${y}px)`, transform: 'scale(1.3)', offset: .35 },
      { clipPath: `circle(${rr}px at ${x}px ${y}px)`, transform: 'scale(1)' }], o);
  };
  T.lensa.masuk = 700;

  /* D2 lorong kaca: kamera menembus bingkai-bingkai kaca */
  T.lorong = async (lama, baru, { fx, dek, arah }) => {
    dek.classList.add('kc-3d');
    for (let k = 0; k < 3; k++) { const b = mk('kaca kc-fx-bingkai'); fx.append(b);
      KC.anim(b, [{ transform: `scale(${arah > 0 ? .3 : 2.6})`, opacity: 0 }, { opacity: 1, offset: .4 }, { transform: `scale(${arah > 0 ? 2.6 : .3})`, opacity: 0 }], { duration: 1100, delay: k * 140, easing: 'cubic-bezier(.5,0,.6,1)' }); }
    const z = arah > 0 ? 1 : -1;
    KC.anim(lama, [{ transform: 'translateZ(0)', opacity: 1, filter: 'blur(0)' }, { transform: `translateZ(${z * 700}px)`, opacity: 0, filter: 'blur(10px)' }], { duration: 900, easing: 'cubic-bezier(.6,0,.4,1)' });
    await KC.anim(baru, [{ transform: `translateZ(${-z * 900}px)`, opacity: 0, filter: 'blur(12px)' }, { transform: 'translateZ(0)', opacity: 1, filter: 'blur(0)' }], { duration: 1150, delay: 200, easing: KC.kurva('keluar') });
    dek.classList.remove('kc-3d');
  };
  T.lorong.masuk = 800;

  /* D3 kocok kartu: slide jadi kartu, dikocok ke belakang, kartu baru maju */
  T.kocok = async (lama, baru, { arah }) => {
    const a = arah > 0 ? 1 : -1, bulat = 'inset(0 round 56px)';
    lama.style.zIndex = 2; baru.style.zIndex = 1;
    KC.anim(baru, [{ transform: `translateX(${a * 34}%) scale(.72) rotate(${a * 5}deg)`, clipPath: bulat, filter: 'brightness(.85)' }, { transform: `translateX(${a * 8}%) scale(.76) rotate(${a * 2}deg)`, clipPath: bulat, filter: 'brightness(.95)' }], { duration: 520, easing: 'ease-out' });
    await KC.anim(lama, [{ transform: 'none', clipPath: 'inset(0 round 0px)' }, { transform: `translateX(${-a * 6}%) scale(.76) rotate(${-a * 2}deg)`, clipPath: bulat, offset: .5 }, { transform: `translateX(${-a * 40}%) scale(.66) rotate(${-a * 7}deg)`, clipPath: bulat, opacity: .0 }], { duration: 760, easing: 'cubic-bezier(.6,0,.3,1)' });
    baru.style.zIndex = 3;
    await KC.anim(baru, [{ transform: `translateX(${a * 8}%) scale(.76) rotate(${a * 2}deg)`, clipPath: bulat, filter: 'brightness(.95)' }, { transform: 'none', clipPath: 'inset(0 round 0px)', filter: 'brightness(1)' }], { duration: 760, easing: KC.kurva('pegas-lembut') });
  };
  T.kocok.masuk = 1100;

  /* D4 kubus kaca: rotasi kubus dengan tepi berkilau */
  T.kubus = async (lama, baru, { dek, arah }) => {
    dek.classList.add('kc-3d');
    const a = arah > 0 ? 1 : -1, o = { duration: 1100, easing: 'cubic-bezier(.65,0,.3,1)' };
    lama.style.transformOrigin = baru.style.transformOrigin = '50% 50% -960px';
    KC.anim(lama, [{ transform: 'rotateY(0deg)', filter: 'brightness(1)' }, { transform: `rotateY(${-a * 90}deg)`, filter: 'brightness(.6)' }], o);
    await KC.anim(baru, [{ transform: `rotateY(${a * 90}deg)`, filter: 'brightness(.6)' }, { transform: 'rotateY(0deg)', filter: 'brightness(1)' }], o);
    dek.classList.remove('kc-3d');
  };
  T.kubus.masuk = 700;

  /* cadangan: pudar + geser kecil (tingkat hemat & reduced-motion) */
  T.pudar = async (lama, baru, { arah = 1, cepat }) => {
    const d = cepat ? 160 : 380;
    KC.anim(lama, [{ opacity: 1 }, { opacity: 0 }], { duration: d });
    await KC.anim(baru, [{ opacity: 0, transform: `translateX(${cepat ? 0 : arah * 40}px)` }, { opacity: 1, transform: 'none' }], { duration: d });
  };
  T.pudar.masuk = 0;

  KC.transisi = T;
  KC.KELUARGA_TRANSISI = { tetesan: ['tetes', 'riak', 'leleh', 'cipratan'], kaca: ['panel', 'tirai', 'retak', 'wiper'], morph: ['morph', 'pil', 'gumpal', 'alir'], kamera: ['lensa', 'lorong', 'kocok', 'kubus'] };
  /* turunan per tingkat: transisi berat diganti saudara yang lebih ringan */
  KC.PETA_SEDANG = { retak: 'tirai', cipratan: 'riak', gumpal: 'morph', lorong: 'lensa', leleh: 'wiper' };
})(window.KC);
