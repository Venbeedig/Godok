/* ==========================================================
   KC INTI — waktu & ketukan, mode instan, animasi WAAPI, posisi relatif,
   mesin pegas, peta pembiasan tepi. Wajib dimuat PERTAMA.
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  KC.instan = false;
  /* pengguna yang meminta gerak dikurangi: animasi & pegas langsung ke keadaan akhir */
  KC.kurangGerak = matchMedia('(prefers-reduced-motion: reduce)').matches;
  KC.skala = 1;
  KC.ketukMs = 500;
  KC.ms = k => k * KC.ketukMs;
  KC.tunggu = ms => KC.instan ? Promise.resolve() : new Promise(r => setTimeout(r, ms));
  KC.kurva = n => getComputedStyle(document.documentElement).getPropertyValue('--kc-' + n).trim() || 'ease';

  /* animasi WAAPI yang sadar mode instan */
  KC.anim = (el, kf, o = {}) => {
    const a = el.animate(kf, Object.assign({ fill: 'both', easing: KC.kurva('keluar') }, o));
    if (KC.instan || KC.kurangGerak) a.finish();
    return a.finished.catch(() => {});
  };

  /* posisi elemen relatif ke wadah, dalam piksel kanvas 1920×1080 */
  KC.rel = (el, wadah) => {
    const a = el.getBoundingClientRect(), b = wadah.getBoundingClientRect(), s = KC.skala;
    return { x: (a.left - b.left) / s, y: (a.top - b.top) / s, w: a.width / s, h: a.height / s };
  };

  /* ---------- mesin pegas (fisika, bukan kurva) ---------- */
  KC.pegas = (awal, { kaku = 170, redam = 18, ubah = () => {} } = {}) => {
    const s = { x: { ...awal }, v: {}, t: { ...awal }, jalan: false, tunggu: [] };
    for (const k in awal) s.v[k] = 0;
    /* sub-langkah 1/120 dtk: gerak selesai tepat waktu walau FPS rendah (laptop lemah, proyektor) */
    const langkah = now => {
      let sisa = Math.min(0.12, (now - s.akhir) / 1000); s.akhir = now;
      while (sisa > 1e-6) {
        const dt = Math.min(sisa, 1 / 120); sisa -= dt;
        for (const k in s.t) { const a = -kaku * (s.x[k] - s.t[k]) - redam * s.v[k]; s.v[k] += a * dt; s.x[k] += s.v[k] * dt; }
      }
      let diam = true;
      for (const k in s.t) {
        const besar = Math.abs(s.t[k]) > 5; // piksel: toleransi 0,3px; skala/opacity: toleransi 0,003
        if (Math.abs(s.x[k] - s.t[k]) > (besar ? .3 : .003) || Math.abs(s.v[k]) > (besar ? 4 : .05)) diam = false;
      }
      if (diam) { selesai(); return; }
      ubah(s.x, s.v); s.f = requestAnimationFrame(langkah);
    };
    const selesai = () => {
      for (const k in s.t) { s.x[k] = s.t[k]; s.v[k] = 0; }
      ubah(s.x, s.v); s.jalan = false; s.tunggu.splice(0).forEach(r => r());
    };
    s.ke = target => {
      Object.assign(s.t, target);
      if (KC.instan || KC.kurangGerak) { cancelAnimationFrame(s.f); selesai(); return Promise.resolve(); }
      const p = new Promise(r => s.tunggu.push(r));
      if (!s.jalan) { s.jalan = true; s.akhir = performance.now(); s.f = requestAnimationFrame(langkah); }
      return p;
    };
    s.loncat = target => { Object.assign(s.t, target); Object.assign(s.x, target); for (const k in s.v) s.v[k] = 0; ubah(s.x, s.v); };
    s.henti = () => { cancelAnimationFrame(s.f); s.jalan = false; };
    ubah(s.x, s.v);
    return s;
  };

  /* ---------- peta pembiasan tepi (tingkat penuh, Chromium) ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  KC.petaBias = (W, H, r, bezel) => {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'), im = g.createImageData(W, H), d = im.data, hx = W / 2, hy = H / 2;
    const sdf = (x, y) => { const qx = Math.abs(x - hx) - (hx - r), qy = Math.abs(y - hy) - (hy - r);
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r; };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const s = sdf(x + .5, y + .5), i = (y * W + x) * 4; let dx = 0, dy = 0;
      if (s < 0 && -s < bezel) {
        const nx = sdf(x + 1.5, y + .5) - sdf(x - .5, y + .5), ny = sdf(x + .5, y + 1.5) - sdf(x + .5, y - .5);
        const L = Math.hypot(nx, ny) || 1, m = Math.pow(1 + s / bezel, 2); dx = -nx / L * m; dy = -ny / L * m;
      }
      d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
    }
    g.putImageData(im, 0, 0); return c.toDataURL();
  };
  KC.filterBias = (W, H, r, { skala = 60, bezel = 40 } = {}) => {
    W = Math.round(W); H = Math.round(H); r = Math.round(Math.min(r, W / 2, H / 2));
    const id = `kc-bias-${W}-${H}-${r}-${skala}`;
    if (!document.getElementById(id)) {
      const defs = document.querySelector('svg.kc-defs defs');
      defs.insertAdjacentHTML('beforeend', `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feImage href="${KC.petaBias(W, H, r, bezel)}" x="0" y="0" width="${W}" height="${H}" result="peta"/>
        <feDisplacementMap in="SourceGraphic" in2="peta" scale="${skala}" xChannelSelector="R" yChannelSelector="G"/></filter>`);
    }
    return id;
  };
  /* pasang pembiasan tepi ke semua .kaca.bias di dalam akar (dipanggil mesin saat tingkat penuh) */
  KC.biaskan = akar => {
    if (document.documentElement.dataset.bias !== 'ya') return;
    akar.querySelectorAll('.kaca.bias').forEach(el => {
      const W = el.offsetWidth, H = el.offsetHeight; if (!W || !H) return;
      const r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      const id = KC.filterBias(W, H, r, { skala: +el.dataset.biasSkala || 60, bezel: +el.dataset.biasBezel || Math.min(48, Math.min(W, H) * .22) });
      el.style.setProperty('--kc-bias', `url(#${id})`);
    });
  };

})(window.KC);
