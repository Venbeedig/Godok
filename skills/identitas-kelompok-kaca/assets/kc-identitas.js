/* ==========================================================
   KC IDENTITAS — enam varian slide identitas kelompok (I1–I6)
   Pasang di slide: data-adegan="identitas-ubin" (dst.)
   ========================================================== */
window.KC = window.KC || {};
(function(KC){
  const A = KC.adegan = KC.adegan || {};
  const kartu = s => [...s.querySelectorAll('.kartu-anggota')];

  /* I1 pulau: Dynamic Island mekar berisi nama kelompok, anggota turun sebagai notifikasi */
  A['identitas-pulau'] = async (s, c) => {
    kartu(s).forEach(k => k.style.opacity = 0);
    await KC.pulau(s.querySelector('.kc-pulau'), { w: 980, h: 150, r: 60 }); if (!c.aktif()) return;
    kartu(s).forEach(k => k.style.opacity = '');
    await KC.notif(kartu(s), { jeda: KC.ms(.75) });
  };
  /* I2 ubin: satu gumpal susu pecah jadi kartu-kartu anggota */
  A['identitas-ubin'] = async (s, c) => {
    await KC.tunggu(KC.ms(.5)); if (!c.aktif()) return;
    await KC.gumpalJadi(s.querySelector('.isi'), kartu(s));
  };
  /* I3 gelembung: tiap kartu lahir sebagai gelembung yang meletup */
  A['identitas-gelembung'] = async (s, c) => {
    kartu(s).forEach(k => k.style.opacity = 0);
    await KC.tunggu(KC.ms(.5)); if (!c.aktif()) return;
    await Promise.all(kartu(s).map((k, i) => { k.style.opacity = ''; return KC.gelembungPop(k, { tunda: i * KC.ms(.5) }); }));
  };
  /* I4 notifikasi: anggota masuk bertumpuk seperti notifikasi (cukup data-masuk="turun") */
  A['identitas-notif'] = async (s, c) => { await KC.notif(kartu(s), { jeda: KC.ms(.5) }); };
  /* I5 lensa baca: daftar formal, lensa singgah di tiap nama */
  A['identitas-lensa'] = async (s, c) => {
    await KC.tunggu(KC.ms(1.5)); if (!c.aktif()) return;
    await KC.resepLensa.L4(s.querySelector('.lensa-panggung'), c, { zoom: 1.18, ketuk: 1.2 });
  };
  /* I6 tab: tab inisial; kartu besar menggulirkan nama & NIM anggota yang dipilih */
  A['identitas-tab'] = async (s, c) => {
    const bar = s.querySelector('.kc-tab'), item = [...bar.querySelectorAll('.kc-tab-i')];
    const nama = s.querySelector('.id-nama'), nim = s.querySelector('.id-nim');
    await KC.tunggu(KC.ms(1)); KC.tab(bar, 0);
    for (let k = 1; k < item.length; k++) {
      await KC.tunggu(KC.ms(2)); if (!c.aktif()) return;
      KC.tab(bar, k); KC.gulirKata(nama, item[k].dataset.nama); KC.gulirKata(nim, item[k].dataset.nim, { arah: -1 });
    }
  };
})(window.KC);
