---
name: material-kaca-cair
description: "Bahan dasar gaya Liquid Glass (kaca cair) untuk PPT HTML: token warna, kelas .kaca berlapis (blur latar, kilau tepi, cahaya dalam, bayangan), enam preset kaca (bening, susu, embun, es, asap, warna), pembiasan tepi SVG, tiga tingkat efek (penuh, sedang, hemat), kurva pegas, ketukan BPM, dan mesin pegas JS. Dipanggil oleh dirigen-ppt-kaca-cair; pakai juga kapan pun butuh efek kaca bening/glassmorphism ala iOS di slide atau halaman HTML."
---

# Material Kaca Cair

Fondasi paket. Semua skill kaca cair lain memakai token dan kelas dari sini. Kode di folder `assets/` **sudah diuji** di Chromium (render 1920×1080), jadi salin apa adanya — jangan ditulis ulang dari ingatan.

| File | Isi |
|---|---|
| `assets/kc-material.css` | token, `.kaca`, 6 preset, 3 tingkat, panggung 1920×1080, tipografi, krom pojok |
| `assets/kc-inti.js` | `KC.instan`, `KC.ms()`, `KC.tunggu()`, `KC.anim()`, `KC.rel()`, `KC.pegas()`, peta pembiasan tepi |
| `assets/kc-filter.html` | `<svg class="kc-defs">` berisi filter `kc-goo-warna`, `kc-goo-kaca`, `kc-blur-v` — tempel tepat setelah `<body>` |

`kc-inti.js` wajib dimuat **pertama** di antara semua JS paket.

## 1. Anatomi satu lembar kaca

Kaca di video referensi bukan sekadar `backdrop-filter: blur()`. Ada enam lapisan, semuanya dalam satu kelas `.kaca`:

```
① latar di belakang di-blur + disaturasi   → backdrop-filter: blur(24px) saturate(165%)
② tint tipis                                → --kc-kaca-isi (putih 28% untuk susu)
③ kilau lengkung kiri-atas                  → radial-gradient di lapisan background paling atas
④ garis kilau tepi atas 1,5px               → inset 0 1.5px 0 putih .95
⑤ bibir kaca 1px + cahaya dalam bawah       → inset 0 0 0 1px, inset 0 -22px 34px -20px
⑥ bayangan jatuh lembut berwarna latar      → 0 26px 50px -20px rgba(--kc-bayang,.34)
```

Bentuk diatur lewat `--r` (radius): `.kaca.pil` = 999px, `.kaca.bulat` = 50%. Elemen kaca selalu `position:relative` — kalau perlu `absolute`, tulis aturan komponen **sesudah** `.kaca` di CSS.

## 2. Enam preset kaca

Pasang `data-kaca="…"` di slide (atau di elemen). Latar sudah punya preset bawaan (lihat `latar-kaca-cair`), jadi biasanya tidak perlu diisi.

| Preset | Rasa | Cocok di latar |
|---|---|---|
| `bening` | hampir tak berwarna, saturasi tinggi, blur 12px | kaustik, gelembung, holografik, es |
| `susu` | putih susu seperti video Apple — **bawaan** | semua aurora, ombak, awan, mesh terang |
| `embun` | buram tebal + butir halus, blur 42px | kabut, latar ramai yang mengganggu baca |
| `es` | biru dingin, tepi biru muda | neon gelap, galaksi, sian |
| `asap` | kaca gelap berasap | neon kota, hujan neon, lava, bokeh |
| `warna` | kaca berwarna aksen | satu kartu penekanan per slide, jangan lebih |

## 3. Token warna

Diisi otomatis dari latar oleh mesin (`KC.latar.token(id)`), ditulis inline di tiap `.slide` lalu disalin ke `.dek` untuk krom & navigasi:

| Token | Arti |
|---|---|
| `--kc-teks`, `--kc-teks-2` | teks utama & redup (berganti halus saat latar berganti, lewat `@property`) |
| `--kc-aksen`, `--kc-aksen-2` | warna aksen latar (tombol, ubin menyala, sorotan) |
| `--kc-sorot` | RGB kilau (255,255,255 di terang; biru es di `es`) |
| `--kc-bayang` | RGB bayangan, diambil dari nada latar |
| `--kc-kaca-padat` | isian kaca saat tingkat **hemat** (tanpa blur) |

## 4. Tiga tingkat efek — "semua perangkat harus aman"

Atribut `data-tingkat` di `<html>`. Mesin menyetelnya otomatis, presenter bisa menggantinya dengan tombol **T** atau tombol pil "Efek …" di navigasi (tersimpan di `localStorage`).

| Tingkat | Kaca | Latar | Transisi | Dipakai saat |
|---|---|---|---|---|
| `penuh` | blur + pembiasan tepi SVG (Chromium) | semua animasi | 16 transisi asli | laptop dengan GPU, FPS ≥ 42 |
| `sedang` | blur ×0,55, tanpa pembiasan | animasi 2× lebih lambat | transisi berat diganti saudaranya | FPS 24–42 |
| `hemat` | **tanpa** backdrop-filter, isian padat | diam | pudar 380ms | FPS < 24, layar HP, Zoom |

Deteksi otomatis: mesin menghitung FPS 2 detik pertama. `prefers-reduced-motion: reduce` langsung memaksa `hemat` + transisi pudar 160ms. Browser tanpa `backdrop-filter` jatuh ke isian padat lewat `@supports`.

## 5. Pembiasan tepi (tingkat penuh)

Kaca Apple membelokkan latar di bibirnya. Resep teruji:

1. `KC.petaBias(W,H,r,bezel)` menggambar **peta perpindahan** di canvas: di dalam pita `bezel` dari tepi, tiap piksel digeser ke arah dalam sebesar `(1 − jarak/bezel)²`; R = geser-x, G = geser-y, 128 = netral.
2. `KC.filterBias()` membungkusnya jadi `<filter>` (`feImage` + `feDisplacementMap`) dengan `x=0 y=0 width=100% height=100%` dan `feImage` berukuran persis W×H — **cara ini sudah diukur dengan peta penanda dan sejajar tepat dengan elemen**.
3. Elemen diberi kelas `.kaca.bias`; `KC.biaskan(slide)` memasang `--kc-bias: url(#…)` dan CSS memakainya: `backdrop-filter: var(--kc-bias,) blur(…) saturate(…)`.
4. Hanya aktif bila `<html data-bias="ya">` — mesin mengisinya hanya di tingkat penuh **dan** browser Chromium (Chrome, Edge, Brave, Opera). Safari/Firefox tetap dapat kaca blur biasa, tidak rusak.

Pakai `.bias` hanya untuk 1–2 kaca besar per slide (kartu utama, tab bar). Peta dibuat per ukuran, jadi elemen yang ukurannya berubah terus (lensa yang melar) tidak cocok diberi `.bias`.

## 6. Waktu: ketukan, kurva, pegas

- **Ketukan.** `data-bpm` di `.dek` (bawaan 120 → 500ms). Semua jeda koreografi ditulis dalam ketukan: `data-ketuk="1.5"`, `KC.ms(2)`. Ganti BPM = seluruh dek melambat/mencepat serempak.
- **Kurva** (dibuat dari simulasi pegas, bukan ditebak): `--kc-pegas` (overshoot 13%), `--kc-pegas-lembut` (2%), `--kc-jeli` (28%, goyang kenyal), `--kc-cair` (ease-in-out), `--kc-keluar`, `--kc-masuk`. Browser tanpa `linear()` mendapat cubic-bezier cadangan.
- **Mesin pegas JS** `KC.pegas({x:0,…},{kaku,redam,ubah})` → `.ke({x:500})` (Promise), `.loncat()`, `.henti()`. Integrasi sub-langkah 1/120 detik, jadi gerak tetap selesai tepat waktu walau FPS jatuh (laptop lemah, proyektor). Dipakai lensa, indikator tab, penggeser, titik navigasi.
- **Mode instan.** `KC.instan = true` membuat `KC.anim`, `KC.tunggu`, dan pegas langsung ke keadaan akhir — dipakai perakit PDF.

## 7. Tipografi

Stack sistem dulu (`SF Pro Display, Inter, Segoe UI Variable, Segoe UI, system-ui…`) supaya file jalan offline. Kelas: `.t-raksasa` 176px/800 (judul satu kata seperti "Fluid."), `.t-judul` 88px, `.t-sub` 34px, `.t-isi` 32px, `.t-label` 17px huruf besar berspasi lebar (label kecil di video), `.t-angka` angka tabular.

## 8. Krom pojok

Seperti video: empat label kecil di pojok. Diisi mesin dari atribut dek dan slide:

| Pojok | Isi | Sumber |
|---|---|---|
| kiri atas | mata kuliah | `data-mata-kuliah` di `.dek` |
| kanan atas | `03 / 14` | otomatis |
| kiri bawah | nama bagian | `data-label` di `.slide` |
| kanan bawah | `Kelompok 5` | `data-kelompok` di `.dek` |

Video menaruh "120 BPM" di kanan bawah — **jangan ditiru**. Angka hiasan tanpa makna di slide akademik terbaca sebagai data palsu.

## Aturan

- Kontras teks utama ≥ 7:1 terhadap kaca + latar di bawahnya. Bila kurang: naikkan `--kc-kaca-isi` atau ganti preset ke `embun`, jangan menebalkan bayangan teks.
- Maksimal **tiga** lapis kaca bertumpuk di satu titik layar; lebih dari itu blur berlipat dan teks jadi keruh.
- Kaca berwarna (`warna`) maksimal satu per slide.
- Jangan memberi `backdrop-filter` pada elemen yang ikut di-`filter` goo — filter induk memutus blur latar anaknya (itu sebabnya morph memakai gumpal susu lalu baru menukar ke kaca asli).
