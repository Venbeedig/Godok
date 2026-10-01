/* ==========================================================
   KC MORPH — gumpal goo jadi ubin, mekar bentuk
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  /* ---------- M4 GUMPAL → UBIN: satu gumpal susu pecah jadi kisi kaca ---------- */
  KC.gumpalJadi = async (wadah, target, { dari, jeda = 70, durasi = 900 } = {}) => {
    const rect = target.map(t => KC.rel(t, wadah));
    target.forEach(t => { t.style.opacity = 0; });
    if (KC.instan) { target.forEach(t => t.style.opacity = ''); return; }
    const cx = rect.reduce((a, r) => a + r.x + r.w / 2, 0) / rect.length, cy = rect.reduce((a, r) => a + r.y + r.h / 2, 0) / rect.length;
    dari = dari || { x: cx - 110, y: cy - 110, w: 220, h: 220, r: 110 };
    const lap = document.createElement('div'); lap.className = 'kc-goo'; wadah.append(lap);
    const bit = rect.map(() => { const b = document.createElement('i'); lap.append(b);
      Object.assign(b.style, { left: dari.x + 'px', top: dari.y + 'px', width: dari.w + 'px', height: dari.h + 'px', borderRadius: dari.r + 'px' }); return b; });
    await KC.anim(lap, [{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 520, easing: KC.kurva('pegas') });
    await Promise.all(bit.map((b, i) => KC.anim(b, [
      { left: dari.x + 'px', top: dari.y + 'px', width: dari.w + 'px', height: dari.h + 'px', borderRadius: dari.r + 'px' },
      { left: rect[i].x + 'px', top: rect[i].y + 'px', width: rect[i].w + 'px', height: rect[i].h + 'px', borderRadius: (parseFloat(getComputedStyle(target[i]).borderTopLeftRadius) || 28) + 'px' }],
      { duration: durasi, delay: i * jeda, easing: KC.kurva('pegas') })));
    target.forEach((t, i) => { t.style.opacity = ''; KC.anim(t, [{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: i * 25 }); });
    await KC.anim(lap, [{ opacity: 1 }, { opacity: 0 }], { duration: 420 });
    lap.remove();
  };

  /* ---------- M1/M2 MEKAR: ubah ukuran & sudut bentuk dengan pegas ---------- */
  KC.mekar = (el, dari, ke, { durasi = 900, tunda = 0, kurva = 'pegas' } = {}) =>
    KC.anim(el, [dari, ke], { duration: durasi, delay: tunda, easing: KC.kurva(kurva) });

  /* ---------- lapisan goo + proksi (dipakai M5, M6, M10) ---------- */
  const lapGoo = wadah => { const l = document.createElement('div'); l.className = 'kc-goo'; wadah.append(l); return l; };
  const proksi = (lap, r, rad) => { const b = document.createElement('i'); lap.append(b);
    Object.assign(b.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px', borderRadius: rad + 'px' }); return b; };
  const kf = (r, rad) => ({ left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px', borderRadius: rad + 'px' });
  const radius = el => parseFloat(getComputedStyle(el).borderTopLeftRadius) || 28;

  /* M3 satu gelembung jadi banyak tombol = gumpalJadi dengan sumber bulat kecil */
  KC.satuJadiBanyak = (wadah, tombol) => KC.gumpalJadi(wadah, tombol, { jeda: 90, durasi: 820 });

  /* M5 lebur: beberapa kartu meleleh menyatu menjadi satu kartu sasaran */
  KC.leburJadi = async (wadah, sumber, sasaran) => {
    const rs = sumber.map(e => KC.rel(e, wadah)), rt = KC.rel(sasaran, wadah);
    sasaran.style.opacity = 0;
    if (KC.instan) { sumber.forEach(e => e.style.opacity = 0); sasaran.style.opacity = ''; return; }
    const lap = lapGoo(wadah), bit = rs.map((r, i) => proksi(lap, r, radius(sumber[i])));
    sumber.forEach(e => KC.anim(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 }));
    await Promise.all(bit.map((b, i) => KC.anim(b, [kf(rs[i], radius(sumber[i])), kf(rt, radius(sasaran))], { duration: 950, delay: i * 60, easing: KC.kurva('pegas-lembut') })));
    sasaran.style.opacity = ''; await KC.anim(lap, [{ opacity: 1 }, { opacity: 0 }], { duration: 380 }); lap.remove();
  };

  /* M6 tetes jatuh, gepeng, lalu melebar jadi kartu sasaran */
  KC.tetesJadi = async (wadah, sasaran) => {
    const rt = KC.rel(sasaran, wadah); sasaran.style.opacity = 0;
    if (KC.instan) { sasaran.style.opacity = ''; return; }
    const cx = rt.x + rt.w / 2, cy = rt.y + rt.h / 2, d = 110;
    const lap = lapGoo(wadah), b = proksi(lap, { x: cx - d / 2, y: -200, w: d, h: d * 1.2 }, d / 2);
    await KC.anim(b, [kf({ x: cx - d / 2, y: -200, w: d, h: d * 1.2 }, d / 2), kf({ x: cx - d / 2, y: cy - d / 2, w: d, h: d * 1.2 }, d / 2)], { duration: 520, easing: 'cubic-bezier(.55,0,1,.45)' });
    await KC.anim(b, [kf({ x: cx - d / 2, y: cy - d / 2, w: d, h: d * 1.2 }, d / 2), kf({ x: cx - d, y: cy - d * .3, w: d * 2, h: d * .6 }, d * .3)], { duration: 140, easing: 'ease-out' });
    await KC.anim(b, [kf({ x: cx - d, y: cy - d * .3, w: d * 2, h: d * .6 }, d * .3), kf(rt, radius(sasaran))], { duration: 900, easing: KC.kurva('pegas') });
    sasaran.style.opacity = ''; await KC.anim(lap, [{ opacity: 1 }, { opacity: 0 }], { duration: 360 }); lap.remove();
  };

  /* M9 gelembung pop: elemen lahir sebagai gelembung bulat, membesar, meletup jadi bentuk aslinya */
  KC.gelembungPop = async (el, { tunda = 0 } = {}) => {
    const rad = getComputedStyle(el).borderTopLeftRadius, r = KC.rel(el, el.parentElement);
    const cincin = document.createElement('i'); cincin.className = 'kc-cincin-pop';
    Object.assign(cincin.style, { left: r.x + r.w / 2 + 'px', top: r.y + r.h / 2 + 'px' }); el.parentElement.append(cincin);
    KC.anim(cincin, [{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 0 }, { opacity: 0, offset: .55 }, { opacity: .9, offset: .6 }, { transform: `translate(-50%,-50%) scale(${Math.max(r.w, r.h) / 120})`, opacity: 0 }], { duration: 1100, delay: tunda })
      .then(() => cincin.remove());
    await KC.anim(el, [{ transform: 'scale(.15)', borderRadius: '50%', opacity: 0 }, { transform: 'scale(.4)', borderRadius: '50%', opacity: 1, offset: .5 }, { transform: 'scale(1.05)', borderRadius: rad, offset: .75 }, { transform: 'none', borderRadius: rad, opacity: 1 }],
      { duration: 1000, delay: tunda, easing: KC.kurva('keluar') });
  };

  /* M10 manik: gelembung bertunas dari satu titik ke titik berikutnya (untuk langkah/proses) */
  KC.manik = async (wadah, langkah, { jeda = KC.ketukMs } = {}) => {
    const rs = langkah.map(e => KC.rel(e, wadah)); langkah.forEach(e => e.style.opacity = 0);
    if (KC.instan) { langkah.forEach(e => e.style.opacity = ''); return; }
    const lap = lapGoo(wadah); let prev = null;
    for (let i = 0; i < langkah.length; i++) {
      const r = rs[i], rad = radius(langkah[i]);
      const awal = prev ? { x: prev.x + prev.w / 2 - 40, y: prev.y + prev.h / 2 - 40, w: 80, h: 80 } : { x: r.x + r.w / 2 - 10, y: r.y + r.h / 2 - 10, w: 20, h: 20 };
      const b = proksi(lap, awal, 40);
      await KC.anim(b, [kf(awal, 40), kf(r, rad)], { duration: 760, easing: KC.kurva('pegas') });
      langkah[i].style.opacity = ''; KC.anim(langkah[i], [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      prev = r; await KC.tunggu(jeda * .4);
    }
    await KC.anim(lap, [{ opacity: 1 }, { opacity: 0 }], { duration: 360 }); lap.remove();
  };

  /* M11 jeli: goyangan kenyal saat elemen tiba atau diklik */
  KC.jeli = el => KC.anim(el, [{ transform: 'scale(1.14,.86)' }, { transform: 'none' }], { duration: 900, easing: KC.kurva('jeli'), fill: 'none' });
})(window.KC);
