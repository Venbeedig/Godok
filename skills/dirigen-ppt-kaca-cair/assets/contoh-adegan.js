/* ==========================================================
   KC ADEGAN — koreografi per slide (contoh dek demo).
   Tiap adegan: async (slide, c) ; c.aktif() false = slide sudah ditinggal.
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  const A = KC.adegan = KC.adegan || {};
  const pusat = (el, wadah) => { const r = KC.rel(el, wadah); return { x: r.x + r.w / 2, y: r.y + r.h / 2, r }; };

  /* L1 lensa melintas judul lalu berhenti di titik (seperti "Fluid." di video) */
  A.sampul = async (s, c) => { await KC.tunggu(KC.ms(1)); if (!c.aktif()) return; await KC.resepLensa.L1(s.querySelector('.lensa-panggung'), c); };

  /* K1 agenda: indikator berpindah tiap dua ketukan, keterangan ikut berguling */
  A.agenda = async (s, c) => {
    const bar = s.querySelector('.kc-tab'), ket = s.querySelector('.agenda-ket');
    const isi = ['Apa itu siklus air', 'Evaporasi sampai infiltrasi', 'Sebaran air di bumi', 'Percobaan untuk kelas IV'];
    await KC.tunggu(KC.ms(1)); KC.tab(bar, 0);
    for (let k = 1; k < 4; k++) {
      await KC.tunggu(KC.ms(2.5)); if (!c.aktif()) return;
      KC.tab(bar, k); KC.gulirKata(ket, isi[k]);
    }
  };

  /* T1 + L7: kata berguling, lensa prisma ikut menggulirkan kembarannya */
  A.pernyataan = async (s, c) => {
    const pg = s.querySelector('.lensa-panggung'), kata = pg.querySelector('.kata-gulir');
    const L = KC.lensa(pg, { w: 190, h: 190, zoom: 1.35, prisma: true, x: pg.offsetWidth - 40, y: pg.offsetHeight / 2, o: 0 });
    L.ke({ o: 1 });
    for (const k of ['Mengembun.', 'Turun.', 'Mengalir.']) {
      await KC.tunggu(KC.ms(2.5)); if (!c.aktif()) return;
      await KC.gulirKata([kata, L.kembar(kata)], k);
      const w = kata.getBoundingClientRect().width / KC.skala;
      L.ke({ x: (pg.offsetWidth - w) / 2 + w - 30 });
    }
  };

  /* K6 cari: mengetik, hasil muncul, sorotan meluncur */
  A.cari = async (s, c) => {
    const kotak = s.querySelector('.kc-cari'), baris = [...s.querySelectorAll('.kc-cari-baris')];
    baris.forEach(b => b.style.opacity = 0);
    await KC.tunggu(KC.ms(1.5)); if (!c.aktif()) return;
    await KC.ketik(s.querySelector('.kc-cari-teks'), 'siklus air');
    baris.forEach((b, i) => { b.style.opacity = ''; KC.anim(b, [{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: i * 90, easing: KC.kurva('pegas-lembut') }); });
    for (let i = 0; i < baris.length; i++) { await KC.tunggu(KC.ms(i ? 2 : 1)); if (!c.aktif()) return; KC.cariPilih(kotak, i); }
  };

  /* K13 garis waktu: titik menyala satu per satu */
  A.proses = async (s, c) => {
    const isi = s.querySelector('.kc-waktu-isi'), titik = [...s.querySelectorAll('.kc-waktu-titik')], label = [...s.querySelectorAll('.kc-waktu-label')];
    label.forEach(l => l.style.opacity = .25);
    for (let k = 0; k < 4; k++) {
      await KC.tunggu(KC.ms(k ? 2 : 1.5)); if (!c.aktif()) return;
      isi.style.width = (k * 33.3) + '%';
      titik[k].style.setProperty('--kc-kaca-isi', 'var(--kc-aksen)');
      KC.anim(titik[k], [{ transform: 'scale(.5)' }, { transform: 'scale(1.25)' }], { duration: 800, easing: KC.kurva('jeli') });
      KC.anim(label[k], [{ opacity: .25, transform: 'translate(-50%,10px)' }, { opacity: 1, transform: 'translate(-50%,0)' }], { duration: 600 });
    }
  };

  /* K10 cincin progres */
  A.cincin = async (s, c) => {
    await KC.tunggu(KC.ms(1.5)); if (!c.aktif()) return;
    const [a, b] = s.querySelectorAll('.kc-cincin');
    await Promise.all([KC.cincin(a, 97.5), KC.cincin(b, 2.5)]);
  };

  /* K5 grafik batang */
  A.grafik = async (s, c) => { await KC.tunggu(KC.ms(1)); if (!c.aktif()) return; await KC.grafik(s.querySelector('.kc-grafik')); };

  /* K8 penggeser banding: geser dari kiri penuh ke tengah, lalu goyang sekali */
  A.banding = async (s, c) => {
    const g = s.querySelector('.kc-geser');
    await KC.tunggu(KC.ms(2)); if (!c.aktif()) return;
    await KC.geser(g, 30); await KC.tunggu(KC.ms(1)); if (!c.aktif()) return; await KC.geser(g, 52);
  };

  /* K3 pemutar: bilah kemajuan = posisi slide sebenarnya (bukan angka karangan) */
  A.pemutar = async (s, c) => {
    const n = KC.indeks() + 1, N = KC.jumlah;
    s.querySelector('.wkt-kiri').textContent = `slide ${n}`; s.querySelector('.wkt-kanan').textContent = `dari ${N}`;
    const bar = s.querySelector('.kc-putar-bar i'); bar.style.setProperty('--p', '0%');
    await KC.tunggu(KC.ms(1.5)); bar.style.setProperty('--p', (n / N * 100).toFixed(1) + '%');
  };

  /* K2 ubin menyala bergiliran */
  A.ubin = async (s, c) => { await KC.tunggu(KC.ms(2)); if (!c.aktif()) return; await KC.nyalakan(s.querySelectorAll('.kc-ubin'), { jeda: KC.ms(1.5) }); };

  /* K9 kuis: sakelar menyala untuk pernyataan yang benar */
  A.kuis = async (s, c) => {
    for (const k of s.querySelectorAll('.kc-sakelar')) { await KC.tunggu(KC.ms(2)); if (!c.aktif()) return; if (k.dataset.jawab === '1') k.classList.add('nyala'); else KC.anim(k, [{ transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }], { duration: 420, easing: 'linear', fill: 'none' }); }
  };

  /* K4 + L5: pulau dinamis mekar; lensa mengikuti penunjuk */
  A.tanya = async (s, c) => {
    const pg = s.querySelector('.lensa-panggung');
    KC.pulau(s.querySelector('.kc-pulau'), { w: 760, h: 130, r: 52 });
    await KC.tunggu(KC.ms(3)); if (!c.aktif()) return;
    const L = KC.lensa(pg, { w: 200, h: 200, zoom: 1.45, x: pg.offsetWidth / 2, y: pg.offsetHeight / 2, o: 0 });
    L.ke({ o: 1 });
    pg.parentElement.addEventListener('pointermove', e => { const r = pg.getBoundingClientRect(); L.ke({ x: (e.clientX - r.left) / KC.skala, y: (e.clientY - r.top) / KC.skala }); });
  };

  /* latar berganti: KC.gantiLatar tiap 3 ketukan, nama latar ikut berguling */
  A.galeri = async (s, c) => {
    const nama = s.querySelector('.nama-latar');
    for (const id of ['aurora-pagi', 'neon-kota', 'air-kaustik', 'mesh-holo', 'neon-grid', 'air-awan', 'mesh-bokeh', 'mesh-kisi']) {
      await KC.tunggu(KC.ms(3)); if (!c.aktif()) return;
      KC.gantiLatar(s, id); KC.gulirKata(nama, KC.latar.daftar[id].nama);
    }
  };

  /* penutup: kata berguling jadi "Terima kasih." lalu lensa berhenti di huruf terakhir */
  A.penutup = async (s, c) => {
    const pg = s.querySelector('.lensa-panggung'), h = pg.querySelector('.kata-tutup');
    const L = KC.lensa(pg, { w: 170, h: 170, zoom: 1.4, x: pg.offsetWidth / 2, y: -150, o: 0 });
    await KC.tunggu(KC.ms(1)); if (!c.aktif()) return;
    await KC.gulirKata([h, L.kembar(h)], 'Terima kasih.');
    L.ke({ o: 1 });
    const w = h.getBoundingClientRect().width / KC.skala, x0 = (pg.offsetWidth - w) / 2;
    await L.ke({ x: x0 + w * .5, y: pg.offsetHeight * .5, w: 260, h: 170 }); if (!c.aktif()) return;
    await L.ke({ x: x0 + w - 24, y: pg.offsetHeight * .6, w: 130, h: 130, z: 1.5 });  // berhenti di tanda titik
  };
})(window.KC);
