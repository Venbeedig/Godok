/* ==========================================================
   KC KOMPONEN — ikon garis + perilaku komponen UI kaca
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  const P = {
    wifi:'<path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16.1a5 5 0 0 1 7 0"/><circle cx="12" cy="19.6" r="1.1" fill="currentColor"/>',
    bulan:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    matahari:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    suara:'<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
    senter:'<path d="M8 2.5h8V7l-2 4v10.5h-4V11L8 7z"/><path d="M8 7h8M12 13v2"/>',
    rumah:'<path d="M3 11 12 3l9 8"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/>',
    cari:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    grafik:'<path d="M5 20v-8M11 20V5M17 20v-5"/>',
    orang:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    kelompok:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.8"/><path d="M16 14.2a5 5 0 0 1 6 4.8"/>',
    jeda:'<path d="M8 5v14M16 5v14" stroke-width="3.4"/>',
    putar:'<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
    maju:'<path d="M3 6v12l8.5-6zM12 6v12l8.5-6z" fill="currentColor"/>',
    mundur:'<path d="M21 6v12l-8.5-6zM12 6v12l-8.5-6z" fill="currentColor"/>',
    hati:'<path d="M12 20.5s-8-4.8-8-11A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8 2.9c0 6.2-8 11-8 11z" fill="currentColor" stroke="none"/>',
    bagikan:'<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
    lonceng:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    centang:'<path d="m4 12.5 5 5L20 6.5"/>',
    buku:'<path d="M4 19.5V5a2.5 2.5 0 0 1 2.5-2.5H20v17H6.5A2.5 2.5 0 0 0 4 22a2.5 2.5 0 0 1 2.5-2.5H20"/>',
    lampu:'<path d="M9 18h6M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-4 11.6c.8.7 1 1.4 1 2.4h6c0-1 .2-1.7 1-2.4a6.5 6.5 0 0 0-4-11.6z"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    bendera:'<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
    tetes:'<path d="M12 2.8s6.5 7.2 6.5 11.7a6.5 6.5 0 0 1-13 0C5.5 10 12 2.8 12 2.8z"/>',
    kanan:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    kiri:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
    musik:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    jam:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    tanya:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.3-2.5 3.9"/><circle cx="12" cy="17.3" r=".7" fill="currentColor"/>',
    geser:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
    toga:'<path d="M2 9.5 12 4l10 5.5L12 15z"/><path d="M6 11.7V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.3"/>',
    lapisan:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>'
  };
  KC.ikon = n => `<svg class="kc-ikon" viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.tetes}</svg>`;
  KC.daftarIkon = Object.keys(P);
  /* ganti <i data-ikon="wifi"></i> jadi svg */
  KC.isiIkon = akar => akar.querySelectorAll('[data-ikon]').forEach(e => { if (!e.firstChild) e.innerHTML = KC.ikon(e.dataset.ikon); });

  /* K1 tab bar: indikator kaca meluncur, melar sesuai kecepatan */
  KC.tab = (bar, i) => {
    const item = [...bar.querySelectorAll('.kc-tab-i')], ind = bar.querySelector('.kc-tab-ind');
    const r = KC.rel(item[i], bar);
    if (!ind._p) ind._p = KC.pegas({ x: r.x, w: r.w }, { kaku: 210, redam: 21, ubah: (s, v) => {
      const t = Math.min(.25, Math.abs(v.x) / 9000);
      ind.style.width = s.w + 'px'; ind.style.transform = `translateX(${s.x}px) scale(${1 + t},${1 - t * .6})`; } });
    item.forEach((e, k) => e.classList.toggle('aktif', k === i));
    return ind._p.ke({ x: r.x, w: r.w });
  };

  /* K6 cari: sorotan meluncur ke baris ke-i */
  KC.cariPilih = (kotak, i) => {
    const baris = [...kotak.querySelectorAll('.kc-cari-baris')], s = kotak.querySelector('.kc-cari-sorot');
    const r = KC.rel(baris[i], s.parentElement);
    baris.forEach((b, k) => b.classList.toggle('pilih', k === i));
    s.style.height = r.h + 'px';
    return KC.anim(s, [{ opacity: s.style.opacity || 0, transform: getComputedStyle(s).transform === 'none' ? `translateY(${r.y}px) scale(.96)` : getComputedStyle(s).transform },
      { opacity: 1, transform: `translateY(${r.y}px)` }], { duration: 650, easing: KC.kurva('pegas') });
  };

  /* K5 grafik: batang tumbuh berurutan */
  KC.grafik = (kartu, { jeda = 70 } = {}) => Promise.all([...kartu.querySelectorAll('.kc-batang i')].map((b, i) =>
    KC.anim(b, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 1000, delay: i * jeda, easing: KC.kurva('pegas') })));

  /* K7 notifikasi: turun dari atas, bertumpuk */
  KC.notif = (els, { jeda = KC.ketukMs } = {}) => Promise.all([...els].map((n, i) =>
    KC.anim(n, [{ transform: 'translateY(-140px) scale(.92)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 900, delay: i * jeda, easing: KC.kurva('pegas') })));

  /* K8 penggeser: gagang meluncur ke persen tertentu */
  KC.geser = (wadah, ke) => {
    const dari = parseFloat(getComputedStyle(wadah).getPropertyValue('--g')) || 50;
    if (!wadah._p) wadah._p = KC.pegas({ g: dari }, { kaku: 140, redam: 16, ubah: s => wadah.style.setProperty('--g', s.g + '%') });
    return wadah._p.ke({ g: ke });
  };

  /* K10 cincin progres */
  KC.cincin = (svg, persen) => {
    const c = svg.querySelector('.isi'), kel = 2 * Math.PI * c.r.baseVal.value;
    svg.style.setProperty('--kel', kel);
    return KC.anim(c, [{ strokeDashoffset: kel }, { strokeDashoffset: kel * (1 - persen / 100) }], { duration: 1400, easing: KC.kurva('pegas-lembut') });
  };

  /* K4 pulau dinamis: pil hitam mekar jadi kartu */
  KC.pulau = async (el, { w = 900, h = 150, r = 56 } = {}) => {
    const isi = el.querySelector('.kc-pulau-isi');
    await KC.anim(el, [{ width: '260px', height: '64px', borderRadius: '999px' }, { width: w + 'px', height: h + 'px', borderRadius: r + 'px' }],
      { duration: 900, easing: KC.kurva('pegas') });
    await KC.anim(isi, [{ opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 400 });
  };

  /* K2 ubin menyala bergiliran */
  KC.nyalakan = async (ubin, { kelas = 'nyala', jeda = KC.ketukMs } = {}) => {
    for (const u of ubin) { u.classList.add(kelas); KC.anim(u, [{ transform: 'scale(.92)' }, { transform: 'none' }], { duration: 700, easing: KC.kurva('jeli') }); await KC.tunggu(jeda); }
  };

  /* K12 lembar bawah: naik dari tepi bawah dengan pegas */
  KC.lembar = el => KC.anim(el, [{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 950, easing: KC.kurva('pegas-lembut') });
})(window.KC);
