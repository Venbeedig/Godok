---
name: dirigen-ppt-kaca-cair
description: "Skill induk pembuat PPT presentasi kelompok bergaya Liquid Glass / kaca cair seperti video Apple: latar aurora bergerak, gelembung dan lensa kaca yang membiaskan teks, bentuk yang meleleh dan menyatu, kata yang berguling, komponen ala iOS, dan 16 transisi cair. Baca materi yang diunggah, tanya satu ronde pilihan ganda, lalu panggil 12 skill pecahan berurutan sampai jadi satu file HTML presentasi (offline, 3 tingkat efek untuk laptop lemah sampai kuat) + PDF. Pakai setiap kali LO minta PPT gaya kaca cair, liquid glass, glassmorphism, kaca bening, iOS 26, gelembung, efek air, atau 'seperti video kaca itu', walau kata kaca tidak disebut."
---

# Dirigen PPT Kaca Cair

Kepala paket. Skill ini tidak menggambar apa pun sendiri: ia membaca materi, mengisi BRIEF, memanggil pecahan dengan urutan tetap, merakit, **menguji**, lalu menyerahkan.

## Kapan dipakai

LO mengunggah/menempel materi (makalah, modul, catatan acak, PPT lama) dan minta presentasi kelompok bergaya kaca cair. Juga saat merevisi dek yang dibuat paket ini.

## Keluaran wajib

1. `presentasi-<slug>.html` — **versi utama**. Satu file, tanpa aset eksternal; klik dua kali lalu tekan F untuk layar penuh.
2. `presentasi-<slug>.pdf` — keadaan akhir tiap slide (mode `gambar`), untuk grup/dosen. Tambah `-teks.pdf` bila LO memilih "teks bisa disalin" atau "keduanya".
3. Di chat: daftar isi per slide (satu baris per slide), daftar penanda `⟨ISI SENDIRI⟩` yang tersisa, cara memakai (F, T, panah), dan satu baris **KOMBINASI**.

Tulis ke `/mnt/user-data/outputs/` (atau folder keluaran yang tersedia di lingkungan).

## Ronde tanya — SATU kali

Baca materi sampai habis dulu. Lalu satu pesan: blok isian singkat untuk data yang tidak bisa dipilih + tool pilihan ganda (maksimal 4 pertanyaan). Bila tool tidak ada, satu pesan bernomor.

**Isian (lewati yang sudah jelas dari materi):** judul/topik · mata kuliah · nama dosen · nomor kelompok · nama + NIM anggota · durasi (menit).

**Pilihan ganda:**
1. **Tema** — tawarkan 3 tema dari `bank-ide-tema-kaca` bagian B sesuai rumpun mata kuliah + "Liquid Klasik (paling mirip video)". Opsi "Lainnya" tetap tersedia untuk tema lain atau "campur per bagian".
2. **Tempo gerak** — Tenang (90 BPM) · Standar (120, disarankan) · Enerjik (140).
3. **Gaya slide identitas** — I2 gumpal jadi ubin (disarankan) · I1 pulau dinamis · I5 lensa baca (formal) · I6 tab anggota.
4. **PDF** — Gambar (identik layar) · Teks bisa disalin · Keduanya.

Sesudah ronde ini **jangan bertanya lagi**. Lubang diisi default dan ditandai `⟨ISI SENDIRI: …⟩`.

### Default

| Hal | Default |
|---|---|
| Tema | dari rumpun (bank B); tidak jelas → 1 Liquid Klasik |
| Tempo | 120 BPM |
| Identitas | I2 |
| PDF | gambar |
| Durasi | 15 menit → 10–11 slide (bank D) |
| Data anggota | `⟨ISI SENDIRI: Nama Anggota 1⟩` / `⟨ISI SENDIRI: NIM⟩` |
| Tingkat efek | otomatis (deteksi FPS) + tombol T |
| Pustaka | dibuat bila materi menyebut sumber |

## BRIEF

```yaml
judul:            slug:
mata_kuliah:      rumpun:          dosen:
kelompok:         anggota: []      # - nama | NIM  (salin huruf per huruf)
durasi_menit:     jumlah_slide:
tema: 1           # nomor dari bank A
latar_utama:      latar_aksen: []
kaca:             bpm: 120
lensa: []         morph: []        teks: []
trans_utama:      trans_aksen: []
identitas: I2     pdf: gambar
peta_slide: []    # - no | tipe | judul | isi ringkas | komponen | efek | transisi | latar
kombinasi_lama:
```

## Urutan pemanggilan — tetap

| # | Skill | Keluaran |
|---|---|---|
| 1 | `bank-ide-tema-kaca` | tema → latar, kaca, lensa, morph, teks, transisi, BPM; susunan dek dari durasi (D); ide momen (C) |
| 2 | `tata-letak-slide-kaca` | PETA SLIDE: tipe, judul-pernyataan, isi ≤ 35 kata, kerangka |
| 3 | `latar-kaca-cair` | `data-latar` dek & per slide, pola keluarga per bagian |
| 4 | `komponen-ui-kaca` | komponen per slide (peta isi → komponen) |
| 5 | `identitas-kelompok-kaca` | slide 2 sesuai varian I1–I6 |
| 6 | `efek-lensa-pembias` | resep lensa di sampul / pernyataan / penutup (≤ 1 per slide) |
| 7 | `teks-gulir-cair` | `data-efek` (≤ 1 per slide) |
| 8 | `morph-bentuk-cair` | adegan morph (≤ 1 besar per slide) |
| 9 | `transisi-kaca-cair` | `data-trans` tiap slide: 1 utama + 2 aksen |
| 10 | `navigasi-dek-kaca` | kerangka dek, atribut, adegan, uji navigasi |
| 11 | `material-kaca-cair` | token, preset kaca, `.bias` di 1–2 kaca besar, tingkat efek |
| 12 | `perakit-pdf-kaca` | PDF |

## Perakitan (teknis)

1. Buat folder kerja `kerja/kc/`. Salin **semua** file `assets/*` dari skill 2–11 ke situ (material: `kc-material.css kc-inti.js kc-filter.html`; latar: `kc-latar.css kc-latar.js`; lensa: `kc-lensa.css kc-lensa.js`; teks: `kc-teks.css kc-teks.js`; morph: `kc-morph.css kc-morph.js`; komponen: `kc-komponen.css kc-komponen.js`; transisi: `kc-transisi.css kc-transisi.js`; navigasi: `kc-dek.css kc-mesin.js`; tata letak: `kc-tata-letak.css`; identitas: `kc-identitas.css kc-identitas.js`). **Jangan menulis ulang aset itu** — sudah diuji.
2. Tulis `kerja/isi-dek.html`: satu `<main class="dek" …>` berisi semua `<section class="slide">`. Contoh semua tipe: `tata-letak-slide-kaca/assets/contoh-dek.html`.
3. Tulis `kerja/adegan.js`: `KC.adegan.nama = async (s, c) => {…}` untuk slide yang punya `data-adegan`. Contoh: `assets/contoh-adegan.js` di skill ini. Adegan identitas sudah ada di `kc-identitas.js`.
4. Rakit: `python3 scripts/rakit.py --aset kerja/kc --isi kerja/isi-dek.html --tambah kerja/adegan.js --judul "<Judul>" --keluar <out>/presentasi-<slug>.html`
5. **Uji**: `python3 scripts/uji_dek.py <out>/presentasi-<slug>.html kerja/uji` → baca keluarannya, **lihat** `kerja/uji/lembar.jpg`. Perbaiki semua galat, slide macet, dan teks yang keluar zona, lalu rakit & uji lagi.
6. PDF: `python3 <perakit-pdf-kaca>/scripts/cetak_pdf.py <html> <out>/presentasi-<slug>.pdf --mode <gambar|teks|keduanya>`

Catatan uji: Chromium tanpa GPU merender jauh lebih lambat dari laptop sungguhan; jangan menilai kelancaran dari uji ini — nilai benar/tidaknya keadaan akhir.

## Urutan lapisan (belakang → depan)

```
.latar (z0, dibangun mesin per slide) → .isi (z2): kaca, komponen, teks → .kc-lensa (z5) → .kc-goo (z6)
→ .krom pojok (z40) → .kc-fx efek transisi (z45) → .kc-nav navigasi (z50)
```

## Anggaran gerak per slide — pagar anti-ramai

- Satu **pusat perhatian** per slide: satu lensa *atau* satu morph besar *atau* satu komponen hidup. Efek teks boleh menemani hanya di judul.
- Semua koreografi masuk selesai ≤ 3 ketukan setelah transisi (≤ 4,5 untuk identitas I1). Yang lebih lama hanya yang memang mengiringi presenter (indikator agenda, I6, L5).
- Dalam satu dek: 1 transisi utama + 2 aksen; `retak` & `cipratan` maks. 1×; `kubus` & `lorong` maks. 2×.
- Latar: hanya gumpal + maksimal 2 lapisan bergerak.
- Slide `pustaka`: tanpa efek apa pun. Slide `identitas`: tanpa efek teks pada nama & NIM.

## Aturan mutlak

- **Nol aset eksternal**: tanpa CDN, URL gambar, font web wajib. Logo/foto hanya dari file LO, disematkan sebagai data URI.
- Tidak ada angka, persentase, atau label karangan. Angka hanya dari materi, dengan sumber kecil.
- Tidak ada `Math.random()` di file jadi; acakan memakai PRNG berbiji yang sudah ada di aset.
- Kontras teks utama ≥ 7:1 di atas kaca; di latar gelap teks putih, di latar terang `--kc-teks`.
- Setiap slide punya tombol **Berikutnya** (navigasi mesin), slide terakhir **Ulangi**.
- `prefers-reduced-motion` dihormati (mesin melakukannya otomatis — jangan dimatikan).
- Kanvas 1920×1080 diskalakan; uji juga di 1366×768.
- Jangan meniru merek: tidak ada logo Apple, nama aplikasi, atau status bar ponsel. Yang ditiru hanya bahasa geraknya.

## Checklist sebelum menyerahkan

- [ ] `uji_dek.py`: tanpa galat JS, tanpa slide macet, tanpa teks keluar zona.
- [ ] `lembar.jpg` sudah dilihat: tidak ada slide kosong, lensa berhenti di tempat yang benar, teks terbaca.
- [ ] Nama & NIM anggota dicek huruf per huruf terhadap kiriman LO.
- [ ] Tiap slide ≤ 5 butir & ≤ 35 kata di layar; judul berupa pernyataan.
- [ ] Anggaran gerak dipatuhi (satu pusat perhatian per slide).
- [ ] PDF terbuka, jumlah halaman = jumlah slide, keadaan akhir benar (bukan setengah animasi).
- [ ] Balasan chat memuat: isi per slide, sisa `⟨ISI SENDIRI⟩`, cara pakai (→ ← F T), baris KOMBINASI.
