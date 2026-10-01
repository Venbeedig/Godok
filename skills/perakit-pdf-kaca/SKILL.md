---
name: perakit-pdf-kaca
description: "Mengubah dek presentasi HTML gaya kaca cair jadi PDF 16:9, satu halaman per slide pada keadaan akhir setiap animasi (lensa sudah berhenti, ubin sudah menyala, angka sudah selesai berputar). Mode gambar identik dengan layar dan ringan; mode teks menambahkan lapisan teks tak terlihat sehingga isi bisa dipilih, disalin, dan dicari tanpa membuat file membengkak. Dipanggil oleh dirigen-ppt-kaca-cair paling akhir; pakai juga saat LO minta versi PDF dari dek kaca cair."
---

# Perakit PDF Kaca

Skrip: `scripts/cetak_pdf.py` (sudah diuji pada dek 17 slide).

```bash
python3 scripts/cetak_pdf.py presentasi-x.html presentasi-x.pdf                    # mode gambar
python3 scripts/cetak_pdf.py presentasi-x.html presentasi-x.pdf --mode teks        # bisa disalin
python3 scripts/cetak_pdf.py presentasi-x.html presentasi-x.pdf --mode keduanya    # dua file
python3 scripts/cetak_pdf.py presentasi-x.html presentasi-x.pdf --hd               # potret 3840×2160
```
Butuh Playwright + Chromium (sudah terpasang di lingkungan; **jangan** menjalankan `playwright install` bila `PLAYWRIGHT_BROWSERS_PATH` ada), Pillow, dan pypdf untuk mode teks.

## Cara kerja

1. Buka dek dengan `?cetak=1&tingkat=penuh` → navigasi tersembunyi, efek tingkat penuh.
2. Untuk tiap slide: `KC.ke(i, {instan:true, paksa:true})`. Mode instan membuat semua `KC.anim`, `KC.tunggu`, pegas, dan adegan langsung melompat ke **keadaan akhir** — tidak pernah memotret animasi setengah jalan. Transisi CSS dimatikan lewat `[data-cetak] * { transition:none }`.
3. Tunggu 900ms (latar & font selesai dirender), potret 1920×1080.
4. **Gambar:** semua potret disusun jadi PDF pada 96 dpi → halaman 20 × 11,25 inci (1440 × 810 pt), 16:9.
5. **Teks:** untuk slide yang sama, gaya sementara membuat semua selain huruf tak terlihat (visibility/transparan, tata letak tidak berubah) dan huruf hampir transparan, lalu Chromium mencetaknya sebagai PDF vektor. Halaman itu ditumpuk di atas halaman gambar dengan pypdf → tampilan identik, teks bisa dipilih.

## Hasil uji (dek demo 17 slide)

| Mode | Ukuran | Catatan |
|---|---|---|
| gambar | ≈ 2,3 MB | identik dengan layar |
| teks (hibrida) | ≈ 2,7 MB | teks bisa dipilih & dicari; selisih piksel dengan mode gambar ≤ 3/255 (tak terlihat) |
| cetak langsung Chromium (tidak dipakai) | ≈ 35 MB | tiap blur dirasterisasi ulang ±2 MB/halaman, dan efek `background-clip:text` meninggalkan garis kotak |

## Pemeriksaan wajib

```bash
pdftoppm -r 32 -png presentasi-x.pdf cek/h     # lalu lihat beberapa halaman
python3 -c "from pypdf import PdfReader as R; r=R('presentasi-x-teks.pdf'); print(len(r.pages)); print(r.pages[1].extract_text()[:300])"
```
- Jumlah halaman = jumlah slide.
- Tiap halaman di keadaan akhir: lensa di tempat berhenti, notifikasi lengkap, sakelar menyala, cincin terisi, odometer berisi angka benar.
- Mode teks: nama anggota dan NIM terekstrak dengan ejaan benar (label huruf besar berspasi lebar akan terekstrak dengan spasi antarhuruf — wajar).
- Galat halaman yang dicetak skrip harus kosong.

## Aturan

- PDF dibuat dari file HTML **final** yang sudah lolos `uji_dek.py`.
- Jangan menambah halaman sampul/penutup yang tidak ada di dek.
- Slide yang adegannya interaktif (lensa L5 mengikuti penunjuk) tercetak di posisi awal lensa — itu benar.
- Nama berkas sama dengan HTML: `presentasi-<slug>.pdf` dan `presentasi-<slug>-teks.pdf`.
