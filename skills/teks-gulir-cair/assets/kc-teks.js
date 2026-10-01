/* ==========================================================
   KC TEKS — T1 gulir, T2 odometer, T3 embun, T4 ombak, T5 ketik,
   T6 tetes, T9 acak, T10 kilau
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  /* ---------- T1 GULIR KATA: tiap huruf berguling dengan jejak gerak ---------- */
  KC.gulirKata = async (els, baru, { arah = 1, jeda = 30, durasi = 760 } = {}) => {
    els = [].concat(els).filter(Boolean);
    await Promise.all(els.map(async el => {
      const lama = el.dataset.kata ?? el.textContent; el.dataset.kata = baru;
      if (KC.instan) { el.textContent = baru; return; }
      const n = Math.max(lama.length, baru.length), sp = c => (c === ' ' || !c) ? ' ' : c;
      el.textContent = ''; el.classList.add('kc-gulir');
      const ukur = c => { const t = document.createElement('span'); t.className = 'kc-ukur'; t.textContent = c; el.append(t); const w = t.getBoundingClientRect().width / KC.skala; t.remove(); return w; };
      const kerja = [];
      for (let i = 0; i < n; i++) {
        const a = lama[i] ? sp(lama[i]) : '', b = baru[i] ? sp(baru[i]) : '';
        const kol = document.createElement('span'); kol.className = 'kc-kol';
        const w0 = a ? ukur(a) : 0, w1 = b ? ukur(b) : 0;
        kol.style.width = w0 + 'px';
        const rel = document.createElement('span'); rel.className = 'kc-rel';
        rel.innerHTML = `<span>${a || '​'}</span><span class="kc-hrf-baru" style="top:${arah * 100}%">${b || '​'}</span>`;
        kol.append(rel); el.append(kol);
        const tunda = i * jeda;
        kerja.push(kol.animate([{ width: w0 + 'px' }, { width: w1 + 'px' }], { duration: durasi * .8, delay: tunda, easing: KC.kurva('pegas-lembut'), fill: 'forwards' }).finished);
        kerja.push(rel.animate([
          { transform: 'translateY(0)', textShadow: 'none' },
          { offset: .3, textShadow: `0 ${arah * .1}em 0 color-mix(in srgb,currentColor 40%,transparent),0 ${arah * .2}em 0 color-mix(in srgb,currentColor 24%,transparent),0 ${arah * .3}em 0 color-mix(in srgb,currentColor 12%,transparent)` },
          { transform: `translateY(${-arah * 100}%)`, textShadow: 'none' }
        ], { duration: durasi, delay: tunda, easing: KC.kurva('pegas'), fill: 'forwards' }).finished);
      }
      await Promise.all(kerja).catch(() => {});
      if (el.dataset.kata === baru) { el.textContent = baru; el.classList.remove('kc-gulir'); }
    }));
  };

  /* ---------- T2 ODOMETER: angka berputar per digit ---------- */
  KC.odometer = (el, nilai, { lokal = 'id-ID', durasi = 1400, jeda = 60 } = {}) => {
    const teks = Number(nilai).toLocaleString(lokal);
    el.textContent = ''; el.classList.add('kc-odo', 't-angka');
    const kerja = [];
    [...teks].forEach((c, i) => {
      if (!/\d/.test(c)) { const s = document.createElement('span'); s.textContent = c; el.append(s); return; }
      const kol = document.createElement('span'); kol.className = 'kc-odo-kol';
      const pita = document.createElement('span'); pita.className = 'kc-odo-pita';
      pita.innerHTML = Array.from({ length: 20 }, (_, k) => `<span>${k % 10}</span>`).join('');
      kol.append(pita); el.append(kol);
      const ke = 10 + +c;
      const a = pita.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-ke * 100 / 20}%)` }],
        { duration: durasi + i * jeda, easing: KC.kurva('pegas-lembut'), fill: 'forwards' });
      if (KC.instan) a.finish(); kerja.push(a.finished);
    });
    // selesai: ganti kolom digit dengan teks polos (bisa dipilih, dibaca pembaca layar, dan diekstrak dari PDF)
    return Promise.all(kerja).catch(() => {}).then(() => { if (el.isConnected) { el.textContent = teks; el.classList.remove('kc-odo'); } });
  };

  /* ---------- T5 KETIK ---------- */
  KC.ketik = async (el, teks, { cepat = 55 } = {}) => {
    el.classList.add('kc-ketik');
    if (KC.instan) { el.textContent = teks; return; }
    el.textContent = '';
    for (const c of teks) { el.textContent += c; await KC.tunggu(cepat + (c === ' ' ? 40 : 0)); }
  };

  /* ---------- pecah huruf (dipakai T3/T4/T6/T9) ---------- */
  KC.pecahHuruf = el => {
    if (el.dataset.pecah) return [...el.querySelectorAll('.kc-h')];
    const t = el.textContent; el.dataset.pecah = 1; el.textContent = ''; el.setAttribute('aria-label', t);
    return [...t].map((c, i) => { const s = document.createElement('span'); s.className = 'kc-h'; s.style.setProperty('--i', i); s.textContent = c === ' ' ? ' ' : c; s.setAttribute('aria-hidden', 'true'); el.append(s); return s; });
  };
  /* T4 ombak huruf */
  KC.ombakHuruf = (el, { jeda = 32 } = {}) => Promise.all(KC.pecahHuruf(el).map((h, i) =>
    KC.anim(h, [{ transform: 'translateY(.7em) scaleY(1.35)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 900, delay: i * jeda, easing: KC.kurva('pegas') })));
  /* T6 tetes huruf */
  KC.tetesHuruf = (el, { jeda = 55 } = {}) => Promise.all(KC.pecahHuruf(el).map((h, i) =>
    KC.anim(h, [
      { transform: 'translateY(-1.4em) scale(.75,1.3)', opacity: 0, easing: 'cubic-bezier(.5,0,.9,.5)' },
      { offset: .55, transform: 'translateY(0) scale(1.28,.74)', opacity: 1, easing: KC.kurva('pegas') },
      { transform: 'none', opacity: 1 }], { duration: 900, delay: i * jeda, easing: 'linear' })));
  /* T3 embun: mengembun dari kabut */
  KC.embun = (el, { tunda = 0 } = {}) => KC.anim(el,
    [{ filter: 'blur(22px)', letterSpacing: '.35em', opacity: 0 }, { filter: 'blur(0)', letterSpacing: getComputedStyle(el).letterSpacing, opacity: 1 }],
    { duration: 1300, delay: tunda, easing: KC.kurva('keluar') });
  /* T9 acak lalu mengendap (PRNG berbiji) */
  KC.acak = async (el, { lama = 900 } = {}) => {
    const akhir = el.dataset.asli || el.textContent; el.dataset.asli = akhir;
    if (KC.instan) { el.textContent = akhir; return; }
    let b = 1234567; const r = () => (b = (b * 16807) % 2147483647) / 2147483647;
    const G = '░▒▓<>/\\=+*#%01', t0 = performance.now();
    await new Promise(ok => { const f = () => { const p = (performance.now() - t0) / lama;
      el.textContent = [...akhir].map((c, i) => c === ' ' || p > i / akhir.length + .25 ? c : G[(r() * G.length) | 0]).join('');
      p < 1.3 ? requestAnimationFrame(f) : (el.textContent = akhir, ok()); }; f(); });
  };
  /* T10 kilau sekali lewat */
  KC.kilau = el => { el.classList.remove('kc-kilau'); void el.offsetWidth; el.classList.add('kc-kilau'); return KC.tunggu(1400); };

})(window.KC);
