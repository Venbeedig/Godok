---
name: navigasi-dek-kaca
description: "Mesin dek presentasi HTML gaya kaca cair: kanvas 1920x1080 yang diskalakan, navigasi pil kaca di setiap slide (tombol mundur, titik kemajuan bergaya cacing cair, tombol Berikutnya/Ulangi, tombol tingkat efek), keyboard, geser sentuh, layar penuh, koreografi masuk berbasis ketukan BPM (data-masuk, data-ketuk, data-efek), adegan JS per slide yang bisa dibatalkan, deteksi FPS otomatis untuk tiga tingkat efek, krom pojok, dan mode instan untuk cetak PDF. Dipanggil oleh dirigen-ppt-kaca-cair; pakai juga saat butuh kerangka slide HTML yang ringan dan bisa dibuka offline."
---

# Navigasi Dek Kaca

| File | Isi |
|---|---|
| `assets/kc-dek.css` | `.slide`, keadaan `.aktif/.tampil/.masuk`, navigasi pil kaca, mode cetak |
| `assets/kc-mesin.js` | `KC.mulai()`, `KC.ke()`, `KC.maju()`, `KC.mundur()`, `KC.gantiLatar()`, `KC.aturTingkat()`, `KC.adegan` |

Mesin memerlukan semua skill pecahan lain sudah dimuat (latar, transisi, komponen untuk ikon). Urutan JS: `kc-inti → kc-latar → kc-lensa → kc-teks → kc-morph → kc-komponen → kc-transisi → kc-mesin → kc-identitas → adegan dek`. Skrip `rakit.py` di `dirigen-ppt-kaca-cair` sudah mengurutkannya.

## Kerangka dek

```html
<div class="panggung">
<main class="dek" data-latar="aurora-lavender" data-bpm="120"
      data-mata-kuliah="Pembelajaran IPA SD" data-kelompok="Kelompok 5">
  <section class="slide" data-tipe="sampul" data-label="Pembuka" data-adegan="sampul">
    <div class="isi tl-tengah"> … </div>
  </section>
  <section class="slide" data-tipe="poin" data-label="Poin" data-latar="neon-kota" data-trans="tirai"> … </section>
</main>
</div>
<script> …aset… KC.mulai({ cetak: q.has('cetak'), tingkat: q.get('tingkat') }); </script>
```
Mesin sendiri yang membuat: latar tiap slide, lapisan `.kc-fx`, krom empat pojok, dan navigasi. Jangan menulisnya manual.

## Atribut

| Di | Atribut | Arti |
|---|---|---|
| `.dek` | `data-latar` | latar bawaan semua slide |
| | `data-bpm` | tempo koreografi (90 tenang · 120 standar · 140 enerjik) |
| | `data-kaca` | paksa satu preset kaca untuk seluruh dek (opsional) |
| | `data-mata-kuliah`, `data-kelompok` | isi krom pojok |
| `.slide` | `data-latar`, `data-kaca` | ganti latar / kaca slide ini |
| | `data-trans` | transisi **masuk** ke slide ini |
| | `data-label` | nama bagian di krom kiri bawah |
| | `data-adegan` | nama fungsi `KC.adegan[nama](slide, c)` |
| | `data-tipe` | tipe tata letak (untuk dibaca manusia & perakit) |
| elemen | `data-masuk` | `naik turun pudar skala pegas kiri kanan embun tetes mekar` |
| | `data-ketuk` | jeda dalam ketukan (boleh pecahan: `.5`, `1.5`) |
| | `data-efek` | efek teks (`gulir ombak tetes embun acak kilau ketik odometer`) |
| | `data-morph` | kunci pasangan untuk transisi `morph`/`alir` |

Elemen ber-`data-masuk` disembunyikan sampai koreografi dimulai, jadi tidak ada kedipan saat transisi.

## Adegan (koreografi JS per slide)

```js
KC.adegan.cari = async (s, c) => {
  await KC.tunggu(KC.ms(1.5)); if (!c.aktif()) return;   // selalu cek setelah menunggu
  await KC.ketik(s.querySelector('.kc-cari-teks'), 'siklus air');
};
```
- `c.aktif()` jadi `false` begitu slide ditinggal → adegan berhenti rapi.
- Saat slide ditinggal, isi `.isi` **dikembalikan ke HTML aslinya** (dipotret saat mulai) — adegan boleh mengubah DOM sesukanya, masuk lagi akan memutar ulang dari awal.
- Gunakan `KC.tunggu`, `KC.anim`, `KC.pegas` — semuanya otomatis instan saat dicetak PDF.

## Navigasi

| Masukan | Aksi |
|---|---|
| → · Spasi · PageDown · Enter · tombol **Berikutnya** | maju (di slide terakhir: **Ulangi** ke awal) |
| ← · PageUp · Backspace · tombol ← | mundur |
| Home / End | slide pertama / terakhir |
| F | layar penuh |
| T · tombol "Efek …" | ganti tingkat efek penuh → sedang → hemat (disimpan) |
| geser jari > 60px | maju / mundur (layar sentuh) |
| `#5` di URL | buka langsung slide 5 (URL diperbarui tiap pindah) |

Masukan saat transisi berjalan diantre (maksimal satu), jadi klik cepat tidak membuat slide bertumpuk. Indikator titik adalah "cacing" cair: tepi depan pegas cepat, tepi belakang pegas lambat, sehingga memanjang saat bergerak.

Clicker presentasi (pointer laser) mengirim PageDown/PageUp — sudah tertangani.

## Tingkat efek otomatis

Saat dibuka tanpa pilihan tersimpan, mesin menghitung FPS 2 detik: < 24 → `hemat`, < 42 → `sedang`, selebihnya `penuh`. `prefers-reduced-motion` → `hemat`. URL `?tingkat=sedang` memaksa tingkat (berguna untuk uji). Pembiasan tepi hanya menyala di `penuh` + Chromium (dideteksi dari user-agent karena `navigator.userAgentData` tidak ada di `file://`).

## Mode cetak

`?cetak` → navigasi disembunyikan. `KC.ke(n, {instan:true, paksa:true})` membuka slide n langsung di **keadaan akhir** semua koreografi (dipakai `perakit-pdf-kaca`).

## Uji wajib sebelum diserahkan

Jalankan uji otomatis dari `dirigen-ppt-kaca-cair` (Playwright menekan maju dari slide pertama sampai terakhir, memotret, dan mencatat galat konsol). Lalu manual: maju-mundur cepat 10×, ganti tingkat 3×, buka di 1366×768.
