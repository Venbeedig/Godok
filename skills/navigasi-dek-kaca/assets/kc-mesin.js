/* ==========================================================
   KC MESIN — navigasi dek, koreografi ketukan, tingkat efek,
   krom pojok, mode instan untuk PDF.
   Pakai: KC.mulai()  (setelah semua slide ada di DOM)
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  const MASUK = {
    naik:   [{ opacity: 0, transform: 'translateY(48px)' }, { opacity: 1, transform: 'none' }],
    turun:  [{ opacity: 0, transform: 'translateY(-48px)' }, { opacity: 1, transform: 'none' }],
    pudar:  [{ opacity: 0 }, { opacity: 1 }],
    skala:  [{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'none' }],
    pegas:  [{ opacity: 0, transform: 'scale(.55)' }, { opacity: 1, transform: 'none' }],
    kiri:   [{ opacity: 0, transform: 'translateX(-70px)' }, { opacity: 1, transform: 'none' }],
    kanan:  [{ opacity: 0, transform: 'translateX(70px)' }, { opacity: 1, transform: 'none' }],
    embun:  [{ opacity: 0, filter: 'blur(22px)', transform: 'scale(1.04)' }, { opacity: 1, filter: 'blur(0)', transform: 'none' }],
    tetes:  [{ opacity: 0, transform: 'translateY(-90px) scale(.9,1.18)', offset: 0 }, { opacity: 1, transform: 'translateY(0) scale(1.1,.9)', offset: .55 }, { opacity: 1, transform: 'none' }],
    mekar:  [{ opacity: 0, transform: 'scale(.25)', borderRadius: '999px' }, { opacity: 1, transform: 'none' }]
  };
  const KURVA = { naik: 'pegas-lembut', turun: 'pegas-lembut', pudar: 'keluar', skala: 'pegas-lembut', pegas: 'pegas', kiri: 'pegas-lembut', kanan: 'pegas-lembut', embun: 'keluar', tetes: 'pegas', mekar: 'pegas' };
  const TINGKAT = ['penuh', 'sedang', 'hemat'], NAMA_T = { penuh: 'Efek penuh', sedang: 'Efek sedang', hemat: 'Efek hemat' };
  KC.adegan = KC.adegan || {};

  KC.mulai = (opsi = {}) => {
    const html = document.documentElement, dek = document.querySelector(opsi.dek || '.dek');
    const slides = [...dek.querySelectorAll(':scope > .slide')];
    const kurang = matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* Chromium (Chrome, Edge, Opera, Brave, Samsung) — userAgentData tidak ada di file://, jadi pakai UA string */
    const chromium = !!navigator.userAgentData?.brands?.some(b => /Chromium/.test(b.brand)) || /\b(Chrome|Chromium|Edg)\//.test(navigator.userAgent);
    let i = -1, sibuk = false, antre = null;
    KC.ketukMs = 60000 / (+dek.dataset.bpm || 120);
    dek.style.setProperty('--kc-ketuk', KC.ketukMs + 'ms');

    /* skala kanvas 1920×1080 ke layar */
    const skala = () => { KC.skala = Math.min(innerWidth / 1920, innerHeight / 1080); dek.style.setProperty('--skala', KC.skala); };
    addEventListener('resize', skala); skala();

    /* token warna + kaca per slide, potret isi asli untuk reset */
    const latarId = s => s.dataset.latar || dek.dataset.latar || 'aurora-lavender';
    const pasangToken = (s, id) => { const t = KC.latar.token(id); for (const k in t) s.style.setProperty(k, t[k]);
      s.dataset.kaca = s.dataset.kacaTetap || dek.dataset.kaca || KC.latar.kaca(id); };
    slides.forEach(s => {
      if (s.dataset.kaca) s.dataset.kacaTetap = s.dataset.kaca;
      pasangToken(s, latarId(s));
      const isi = s.querySelector(':scope > .isi'); KC.isiIkon(isi); s._asli = isi.innerHTML; s._tok = 0;
    });

    /* lapisan efek, krom, navigasi */
    const fx = dek.querySelector('.kc-fx') || dek.appendChild(Object.assign(document.createElement('div'), { className: 'kc-fx' }));
    let krom = dek.querySelector('.krom');
    if (!krom) { krom = document.createElement('div'); krom.className = 'krom'; krom.innerHTML = '<span class="kr-ki-at"></span><span class="kr-ka-at"></span><span class="kr-ki-bw"></span><span class="kr-ka-bw"></span>'; dek.append(krom); }
    krom.querySelector('.kr-ki-at').textContent = dek.dataset.mataKuliah || '';
    krom.querySelector('.kr-ka-bw').textContent = dek.dataset.kelompok || '';
    const nav = document.createElement('nav'); nav.className = 'kc-nav kaca'; nav.setAttribute('aria-label', 'Navigasi slide');
    nav.innerHTML = `<button class="kc-nav-mundur" aria-label="Slide sebelumnya">${KC.ikon('kiri')}</button>
      <div class="kc-titik" aria-hidden="true">${slides.map(() => '<i></i>').join('')}<b></b></div>
      <button class="kc-nav-maju" aria-label="Slide berikutnya"><span>Berikutnya</span>${KC.ikon('kanan')}</button>
      <button class="kc-nav-tingkat" title="Ganti tingkat efek (tombol T)"></button>`;
    dek.append(nav);
    const titik = [...nav.querySelectorAll('.kc-titik i')], indik = nav.querySelector('.kc-titik b'), lblMaju = nav.querySelector('.kc-nav-maju span');
    /* indikator cacing: tepi depan pegas cepat, tepi belakang pegas lambat */
    let pc = null, pl = null;
    const gambar = () => { if (!pc || !pl) return; const a = Math.min(pc.x.a, pl.x.a), b = Math.max(pc.x.b, pl.x.b);
      indik.style.left = a + 'px'; indik.style.width = (b - a) + 'px'; };
    pc = KC.pegas({ a: 7, b: 23 }, { kaku: 320, redam: 28, ubah: gambar });
    pl = KC.pegas({ a: 7, b: 23 }, { kaku: 110, redam: 17, ubah: gambar });
    const geserTitik = n => {
      const r = KC.rel(titik[n], nav.querySelector('.kc-titik')), t = { a: r.x - 3, b: r.x + r.w + 3 };
      if (KC.instan) { pc.loncat(t); pl.loncat(t); return; }
      pc.ke(t); pl.ke(t);
    };

    /* tingkat efek */
    const aturTingkat = (t, simpan) => {
      html.dataset.tingkat = t; nav.querySelector('.kc-nav-tingkat').textContent = NAMA_T[t];
      if (t === 'penuh' && chromium) html.dataset.bias = 'ya'; else delete html.dataset.bias;
      if (slides[i]) KC.biaskan(slides[i]);
      if (simpan) try { localStorage.setItem('kc-tingkat', t); } catch (e) {}
    };
    let simpanan = null; try { simpanan = localStorage.getItem('kc-tingkat'); } catch (e) {}
    aturTingkat(kurang ? 'hemat' : (opsi.tingkat || simpanan || 'penuh'));
    if (!simpanan && !kurang && !opsi.tingkat && !opsi.cetak) { // ukur FPS 2 detik pertama, turunkan bila berat
      let f = 0; const t0 = performance.now();
      const hitung = now => { f++; if (now - t0 < 2000) return requestAnimationFrame(hitung);
        const fps = f / ((now - t0) / 1000); if (fps < 24) aturTingkat('hemat'); else if (fps < 42) aturTingkat('sedang'); };
      requestAnimationFrame(hitung);
    }
    if (opsi.cetak) html.dataset.cetak = '';

    /* siapkan, masuk, keluar */
    const siapkan = s => {
      if (!s.querySelector(':scope > .latar')) { const l = document.createElement('div'); s.prepend(l); KC.latar.pasang(l, latarId(s)); }
      s.classList.add('tampil'); KC.biaskan(s);
    };
    const keluar = s => {
      s._tok++; s.classList.remove('tampil', 'aktif', 'masuk'); s._mulai = false;
      s.getAnimations({ subtree: true }).forEach(a => a.cancel());
      const isi = s.querySelector(':scope > .isi'); isi.innerHTML = s._asli;
      s.querySelectorAll(':scope > .latar').forEach(l => l.remove());
      if (s._latarDiganti) { pasangToken(s, latarId(s)); s._latarDiganti = false; }
    };
    const bersih = s => {
      s.getAnimations().forEach(a => a.cancel());
      ['clip-path', 'transform', 'opacity', 'filter', 'visibility', 'z-index', 'mask-image', '-webkit-mask-image', 'transform-origin'].forEach(p => s.style.removeProperty(p));
    };
    const tokenKeDek = s => {
      for (const k of ['--kc-teks', '--kc-teks-2', '--kc-aksen', '--kc-aksen-2', '--kc-bayang', '--kc-kaca-padat']) dek.style.setProperty(k, s.style.getPropertyValue(k));
      dek.dataset.kaca = s.dataset.kaca;
    };
    const masuk = async s => {
      if (s._mulai) return; s._mulai = true; s.classList.add('masuk');
      const tok = ++s._tok, c = { slide: s, dek, aktif: () => s._tok === tok };
      s.querySelectorAll('[data-masuk]').forEach(el => {
        if (s._lewatMorph && el.dataset.morph) return;
        const tipe = el.dataset.masuk || 'naik';
        KC.anim(el, MASUK[tipe] || MASUK.naik, { duration: tipe === 'pudar' ? 700 : 950, delay: (+el.dataset.ketuk || 0) * KC.ketukMs, easing: KC.kurva(KURVA[tipe] || 'keluar') });
      });
      const efek = [...s.querySelectorAll('[data-efek]')].map(async el => {
        await KC.tunggu((+el.dataset.ketuk || 0) * KC.ketukMs); if (!c.aktif()) return;
        const e = el.dataset.efek;
        if (e === 'ombak') return KC.ombakHuruf(el);
        if (e === 'tetes') return KC.tetesHuruf(el);
        if (e === 'embun') return KC.embun(el);
        if (e === 'acak') return KC.acak(el);
        if (e === 'kilau') return KC.kilau(el);
        if (e === 'ketik') return KC.ketik(el, el.dataset.teks || el.textContent);
        if (e === 'odometer') return KC.odometer(el, +el.dataset.nilai);
        if (e === 'gulir') { const kata = el.dataset.kata.split('|'); for (const k of kata.slice(1)) { await KC.tunggu(KC.ketukMs * 2); if (!c.aktif()) return; await KC.gulirKata(el, k); } }
      });
      const ad = KC.adegan[s.dataset.adegan];
      await Promise.all([...efek, ad ? ad(s, c) : null]);
    };

    /* pindah slide */
    const pilih = (lama, baru, arah) => {
      if (kurang) return 'pudar';
      let j = (arah > 0 ? baru.dataset.trans : lama.dataset.trans) || 'pudar';
      if (html.dataset.tingkat === 'hemat') return 'pudar';
      if (html.dataset.tingkat === 'sedang') j = KC.PETA_SEDANG[j] || j;
      return KC.transisi[j] ? j : 'pudar';
    };
    const ke = async (n, o = {}) => {
      if (n < 0 || n >= slides.length || (n === i && !o.paksa)) return;
      if (sibuk) { antre = [n, o]; return; }
      sibuk = true;
      const lama = slides[i], baru = slides[n], arah = n > i ? 1 : -1;
      i = n;
      siapkan(baru); tokenKeDek(baru);
      krom.querySelector('.kr-ka-at').textContent = `${String(n + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      krom.querySelector('.kr-ki-bw').textContent = baru.dataset.label || '';
      lblMaju.textContent = n === slides.length - 1 ? 'Ulangi' : 'Berikutnya';
      try { history.replaceState(null, '', '#' + (n + 1)); } catch (e) {}
      if (o.instan || !lama || lama === baru) {
        if (lama && lama !== baru) keluar(lama);
        baru.classList.add('aktif');
        geserTitik(n);
        if (o.instan) { KC.instan = true; await masuk(baru); await KC.tunggu(0); KC.instan = false; }
        else masuk(baru);
      } else {
        const jenis = pilih(lama, baru, arah), T = KC.transisi[jenis];
        lama.classList.remove('aktif'); lama.classList.add('tampil'); baru.classList.add('aktif');
        baru._lewatMorph = jenis === 'morph';
        geserTitik(n);
        const tm = setTimeout(() => masuk(baru), T.masuk ?? 400);
        try { await T(lama, baru, { arah, dek, fx, titik: o.titik, cepat: kurang }); } catch (e) { console.error('transisi', jenis, e); }
        clearTimeout(tm); masuk(baru);
        fx.textContent = ''; bersih(baru); bersih(lama); keluar(lama);
      }
      sibuk = false;
      if (antre) { const a = antre; antre = null; ke(...a); }
    };
    const titikTombol = b => { const r = KC.rel(b, dek); return { x: r.x + r.w / 2, y: r.y + r.h / 2 }; };
    /* ganti latar slide yang sedang tampil: memudar silang, warna teks ikut beralih */
    KC.gantiLatar = async (s, id, { durasi = 900 } = {}) => {
      const lama = [...s.querySelectorAll(':scope > .latar')].pop(), l = document.createElement('div');
      lama ? lama.after(l) : s.prepend(l);
      KC.latar.pasang(l, id); pasangToken(s, id); s._latarDiganti = true;
      if (s.classList.contains('aktif')) tokenKeDek(s);
      await KC.anim(l, [{ opacity: 0 }, { opacity: 1 }], { duration: durasi, easing: KC.kurva('cair') });
      s.querySelectorAll(':scope > .latar').forEach(x => { if (x !== l) x.remove(); });
    };
    KC.ke = ke; KC.jumlah = slides.length; KC.indeks = () => i; KC.aturTingkat = aturTingkat;
    KC.maju = o => ke(i === slides.length - 1 ? 0 : i + 1, o);
    KC.mundur = o => ke(i - 1, o);

    nav.querySelector('.kc-nav-maju').addEventListener('click', e => KC.maju({ titik: titikTombol(e.currentTarget) }));
    nav.querySelector('.kc-nav-mundur').addEventListener('click', e => KC.mundur({ titik: titikTombol(e.currentTarget) }));
    nav.querySelector('.kc-nav-tingkat').addEventListener('click', () => aturTingkat(TINGKAT[(TINGKAT.indexOf(html.dataset.tingkat) + 1) % 3], true));
    addEventListener('keydown', e => {
      if (e.target.closest('input,textarea,[contenteditable]')) return;
      const k = e.key;
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { if (k === 'Enter' && e.target.closest('button')) return; e.preventDefault(); KC.maju(); }
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); KC.mundur(); }
      else if (k === 'Home') ke(0); else if (k === 'End') ke(slides.length - 1);
      else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : html.requestFullscreen?.(); }
      else if (k === 't' || k === 'T') aturTingkat(TINGKAT[(TINGKAT.indexOf(html.dataset.tingkat) + 1) % 3], true);
    });
    let x0 = null;
    dek.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    dek.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 60) dx < 0 ? KC.maju() : KC.mundur(); });

    const awal = Math.max(0, Math.min(slides.length - 1, (parseInt(location.hash.slice(1)) || 1) - 1));
    return ke(awal, { instan: !!opsi.cetak });
  };
})(window.KC);
