---
name: tata-letak-slide-kaca
description: "Kerangka tata letak per tipe slide untuk PPT kuliah gaya kaca cair (Liquid Glass): sampul, identitas, agenda, pernyataan, definisi, poin, proses, angka/data, banding, kutipan, kegiatan, kuis, tanya jawab, pustaka, dan penutup — lengkap dengan zona aman navigasi, ukuran huruf minimum untuk proyektor, batas kata per slide, pasangan komponen dan transisi bawaan per tipe, serta 17 contoh slide siap salin. Dipanggil oleh dirigen-ppt-kaca-cair."
---

# Tata Letak Slide Kaca

| File | Isi |
|---|---|
| `assets/kc-tata-letak.css` | `.tl-tengah`, `.tl-dua`, `.tl-atas`, `.blok-teks`, `.pil-label`, `.kartu-isi`, `.daftar-pustaka`, kartu data & cincin, daftar sakelar |
| `assets/contoh-dek.html` | 17 slide contoh (tema Siklus Air) — **salin strukturnya, ganti isinya** |

## Kanvas & zona aman (1920×1080)

```
┌──────────────────────────────────────────────────────────────┐
│ MATA KULIAH (56,44)                              03 / 14     │  ← krom, jangan ditimpa
│   ┌──────────────────────────────────────────────────────┐   │
│   │  .isi : padding 130 atas · 150 kiri/kanan · 150 bawah │   │
│   │  semua teks & komponen di sini                        │   │
│   └──────────────────────────────────────────────────────┘   │
│ BAGIAN          [ ← ● ● ━ ● ● (Berikutnya →) Efek ]  KEL. 5  │  ← navigasi 30–102px dari bawah
└──────────────────────────────────────────────────────────────┘
```
Tidak ada isi di 130px teratas dan 150px terbawah. Komponen yang menempel tepi bawah (lembar bawah K12) menyisakan 150px padding dalam.

## Tiga kerangka

| Kelas | Susunan | Untuk |
|---|---|---|
| `.tl-tengah > .kolom` | semua di tengah, kolom vertikal, jarak 28px | sampul, pernyataan, penutup, tanya jawab, pemutar |
| `.tl-dua` (`.lebar-kiri` = 1,25:1) | teks kiri, komponen kanan, jarak 110px | definisi, poin, kegiatan, grafik |
| `.tl-atas > .kepala + .badan` | judul di atas, komponen besar di tengah bawah | identitas, agenda, proses, banding, kuis, pustaka |

## Tipe slide → kerangka, komponen, transisi

| Tipe | Kerangka | Komponen utama | Efek | Transisi masuk bawaan |
|---|---|---|---|---|
| `sampul` | tengah | pil label + judul raksasa di `.lensa-panggung` | lensa L1/L2 | — (slide pertama) |
| `identitas` | atas | lihat `identitas-kelompok-kaca` (I1–I6) | gumpal/notif/pop | `tetes` |
| `agenda` | tengah | K1 tab bar | indikator berpindah | `pil` |
| `pernyataan` | tengah | judul raksasa + label kecil | T1 gulir + lensa | `alir` atau `lensa` |
| `definisi` | dua (lebar kiri) | K6 kolom cari | T5 ketik | `lensa` |
| `poin` | dua | K7 notifikasi atau K2 ubin | turun / M4 | `tirai`, `riak` |
| `proses` | atas | K13 garis waktu atau manik M10 | titik menyala | `wiper` |
| `angka` | atas / dua | K10 cincin + T2, atau K5 grafik | odometer, batang tumbuh | `riak` → `morph` |
| `banding` | atas | K8 penggeser | gagang meluncur | `panel` |
| `kutipan` | tengah | `.kartu-isi` kaca `embun` | T3 embun | `leleh` |
| `kegiatan` | dua | K2 ubin menyala | M4 + nyala bergiliran | `gumpal` |
| `kuis` | atas | K9 sakelar | menyala satu per satu | `retak` atau `cipratan` |
| `tanya` | tengah | K4 pulau + judul | T4 ombak + lensa L5 | `lorong` |
| `pustaka` | atas | `.daftar-pustaka.kaca` | **tidak ada** | `riak`/`panel`/`pudar` |
| `penutup` | tengah | judul raksasa | T1 + lensa berhenti di huruf terakhir | `kubus` |

## Ukuran & batas isi

| Unsur | Ukuran | Batas |
|---|---|---|
| judul raksasa | 176px / 800 | 1 baris, ≤ 14 karakter (satu kata + titik paling kuat) |
| judul | 88px / 760 | ≤ 2 baris, ≤ 7 kata |
| sub | 34px | ≤ 2 baris |
| isi kartu / notifikasi | 23–27px | ≤ 14 kata per butir |
| label kecil | 17px huruf besar | ≤ 4 kata |
| per slide | — | ≤ 5 butir, ≤ 35 kata di layar; sisanya ke catatan lisan |

Proyektor kampus memudarkan pastel: teks utama selalu `--kc-teks` penuh, bukan `--kc-teks-2`, untuk kalimat yang harus dibaca dari belakang.

## Pola penulisan isi

- Judul berupa **pernyataan**, bukan topik: "Hampir semuanya asin", bukan "Sebaran Air".
- Satu gagasan per slide. Kalau ada dua, buat dua slide dan sambungkan dengan transisi `alir` atau `morph`.
- Angka selalu dengan sumber kecil di bawah komponen (`.sumber`).
- Tempat yang belum diketahui ditulis `⟨ISI SENDIRI: …⟩` — jangan dikarang.

## Contoh singkat (tipe `pernyataan`)

```html
<section class="slide" data-tipe="pernyataan" data-label="Inti" data-latar="aurora-senja" data-trans="alir" data-adegan="pernyataan">
  <div class="isi tl-tengah"><div class="kolom">
    <span class="t-label" data-masuk="pudar">Air selalu</span>
    <div class="lensa-panggung"><h2 class="t-raksasa kata-gulir" data-morph="judul">Menguap.</h2></div>
    <p class="t-sub" data-masuk="naik" data-ketuk="1">Empat kata kerja ini adalah seluruh siklus air</p>
  </div></div>
</section>
```
Contoh lengkap untuk semua tipe ada di `assets/contoh-dek.html`; adegannya di `dirigen-ppt-kaca-cair/assets/contoh-adegan.js`.
