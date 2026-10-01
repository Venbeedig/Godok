---
name: morph-bentuk-cair
description: "Morph bentuk cair untuk PPT HTML gaya Liquid Glass: 12 resep gerak — bulat jadi pil, pil jadi kartu, satu gelembung pecah jadi tombol, gumpal susu pecah jadi kisi ubin (seperti Control Center di video), kartu melebur jadi satu, tetes jatuh jadi kartu, indikator pil melar, Dynamic Island mekar, gelembung meletup, manik bertunas, goyang jeli, dan napas diam. Memakai filter goo SVG berbibir kaca dan pegas fisika. Dipanggil oleh dirigen-ppt-kaca-cair; pakai juga saat minta animasi gooey, metaball, blob, atau bentuk yang meleleh dan menyatu."
---

# Morph Bentuk Cair

| File | Isi |
|---|---|
| `assets/kc-morph.css` | lapisan `.kc-goo`, cincin letupan, kelas `.kc-napas` |
| `assets/kc-morph.js` | `KC.gumpalJadi`, `KC.mekar`, `KC.satuJadiBanyak`, `KC.leburJadi`, `KC.tetesJadi`, `KC.gelembungPop`, `KC.manik`, `KC.jeli` |

Butuh `kc-inti.js` + `kc-filter.html` (filter `kc-goo-kaca`) dari `material-kaca-cair`. M7 (`KC.tab`) dan M8 (`KC.pulau`) ada di `komponen-ui-kaca`.

## Kenapa "gumpal susu" dulu, baru kaca

Filter goo (blur alfa → ambang tajam) membuat bentuk-bentuk melebur seperti air raksa. Tetapi `filter` pada induk **memutus `backdrop-filter`** anak-anaknya. Maka setiap morph cair berjalan dua tahap:

1. **Proksi** `<i>` putih bergerak di dalam lapisan `.kc-goo` (`filter:url(#kc-goo-kaca)`). Filter itu menghasilkan gumpal susu 50% + bibir terang 2px + bayangan lembut — terlihat seperti kaca cair yang sedang bergerak.
2. Saat proksi tiba di posisi elemen asli, elemen `.kaca` asli muncul (pudar 380ms) dan lapisan goo memudar lalu dibuang.

Elemen sasaran harus sudah ada di DOM pada posisi akhirnya (fungsi mengukur posisinya dengan `KC.rel`). Fungsi menyembunyikan sendiri sasaran di awal.

## 12 resep

| Kode | Fungsi | Gerak | Pakai untuk |
|---|---|---|---|
| **M1** | `KC.mekar(el, dari, ke)` | bulat → pil (lebar memanjang, pegas) — pembuka video "EXPAND" | tombol jadi label judul |
| **M2** | `KC.mekar(el, dari, ke)` | pil → kartu (tinggi & radius berubah) | label jadi kartu isi |
| **M3** | `KC.satuJadiBanyak(wadah, tombol[])` | satu gelembung pecah jadi 3–5 tombol bulat | pilihan, kategori, "tiga hal" |
| **M4** | `KC.gumpalJadi(wadah, ubin[])` | gumpal pecah jadi kisi ubin (adegan "CONTROL" video) | ubin poin, anggota (I2), peta konsep |
| **M5** | `KC.leburJadi(wadah, sumber[], sasaran)` | beberapa kartu meleleh menyatu jadi satu | kesimpulan, sintesis |
| **M6** | `KC.tetesJadi(wadah, sasaran)` | tetes jatuh, gepeng saat mendarat, melebar jadi kartu | akibat, hasil, presipitasi |
| **M7** | `KC.tab(bar, i)` | indikator pil meluncur & melar sesuai kecepatan | agenda, langkah, anggota (I6) |
| **M8** | `KC.pulau(el, {w,h,r})` | Dynamic Island hitam mekar jadi kartu | pembatas bagian, identitas (I1), tanya jawab |
| **M9** | `KC.gelembungPop(el, {tunda})` | lahir sebagai gelembung bulat, membesar, meletup jadi bentuk aslinya + cincin | kartu yang datang satu per satu (I3) |
| **M10** | `KC.manik(wadah, langkah[])` | gelembung bertunas dari titik ke titik | proses, siklus, urutan |
| **M11** | `KC.jeli(el)` | goyang kenyal sekali (kurva `--kc-jeli`) | penekanan, jawaban benar, klik |
| **M12** | kelas `.kc-napas` | skala 1 → 1,015 bolak-balik 6 detik | kaca yang menunggu lama (slide tanya jawab) |

Contoh M1→M2 berantai:
```js
await KC.mekar(b, { width:'120px', height:'120px', borderRadius:'60px' }, { width:'520px', height:'120px', borderRadius:'60px' });
await KC.mekar(b, { width:'520px', height:'120px', borderRadius:'60px' }, { width:'900px', height:'420px', borderRadius:'52px' });
```

Contoh M4 dalam adegan:
```js
KC.adegan['ubin-poin'] = async (s, c) => {
  await KC.tunggu(KC.ms(.5)); if (!c.aktif()) return;
  await KC.gumpalJadi(s.querySelector('.isi'), [...s.querySelectorAll('.kc-ubin')]);
};
```
`wadah` = elemen berposisi (biasanya `.isi` slide); proksi dipasang di dalamnya.

## Adegan pembuka seperti video (EXPAND)

Urutan yang paling mirip referensi, untuk slide sampul atau pembatas bagian:
1. Layar kosong 1 ketukan → satu gelembung kaca `.kaca.bulat` 120px muncul (`data-masuk="mekar"`).
2. M1: gelembung memanjang jadi pil 1 ketukan kemudian.
3. M3: pil pecah jadi tiga tombol bulat (ikon jeda, hati, bagikan — atau ikon materi).
4. Tombol-tombol melebur lagi (M5) ke kartu judul.

Tetap ≤ 4 ketukan total; presenter tidak menunggu animasi.

## Aturan

- **Satu morph besar per slide.** M11 dan M12 tidak dihitung.
- Proksi goo maksimal 12 per gerak (M4/M5). Lebih dari itu, pecah jadi dua gelombang.
- Morph tidak boleh memindahkan teks yang sedang dibaca. Teks muncul **setelah** bentuk berhenti.
- Tingkat `hemat`: filter goo dimatikan, proksi jadi kotak berisi `--kc-kaca-padat` — geraknya tetap ada, tetapi tidak meleleh. Reduced-motion: semua langsung ke keadaan akhir (`KC.kurangGerak`).
- Jangan menaruh `backdrop-filter` di dalam lapisan `.kc-goo`.
