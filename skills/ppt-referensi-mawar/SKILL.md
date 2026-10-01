---
name: ppt-referensi-mawar
description: "Skill induk pembuat file PowerPoint (.pptx) yang meniru presentasi referensi LO (mis. presentasi-modul8-bangun-ruang.pptx): slide referensi dipakai sebagai pola sehingga latar, font, warna, posisi, dan animasinya ikut, lalu teks diganti materi baru dan logo kampus (mis. Universitas Terbuka) dipasang di depan mawar kaca berlapis. Tanpa referensi, menyusun .pptx mandiri di atas latar Holografik & Aurora Pagi dengan kotak kaca tembus pandang. Teks tetap bisa diedit, ada catatan pembicara, transisi, dan animasi Zoom mawar. Pakai setiap kali LO minta file .pptx / PowerPoint yang mirip file contoh, berlogo mawar, atau versi PowerPoint dari dek mawar kaca."
---

# PPT Referensi Mawar

Menghasilkan `.pptx` yang bisa dibuka dan diedit di PowerPoint, Google Slides, dan LibreOffice. **File referensi LO adalah templatnya**: skill ini tidak menebak gaya, ia menyalin slide referensi utuh lalu mengganti teksnya.

| File | Isi |
|---|---|
| `scripts/bedah_referensi.py` | baca referensi → `profil.json` (ukuran, warna & font tema, tiap bentuk), `peta-bentuk.txt` (nama bentuk yang bisa diisi), `peta-awal.json` (kerangka peta), pratinjau PNG |
| `scripts/rakit_pptx.py` | PETA SLIDE (JSON) → `.pptx`; mode **referensi** (utama) dan **mandiri** (cadangan) |
| `assets/peta-contoh.json` | contoh peta 13 slide (Bangun Ruang) yang berlaku untuk kedua mode |

Butuh `python-pptx`. Gambar mawar + logo dan latar dari `mawar-kaca-berlapis/scripts/render_png.py` (butuh Playwright). Pratinjau butuh LibreOffice **Impress** (`soffice`; paket `libreoffice-impress`, bukan hanya `libreoffice-core`) dan `pdftoppm`.

## Ronde tanya — pilihan ganda, sebelum membuat

Baca referensi & materi dulu (jalankan `bedah_referensi.py`). Lalu tanyakan dengan tool pilihan ganda (maks. 4 per panggilan, berturut-turut) atau satu pesan bernomor. Saran bertanda ★; yang tidak dijawab diisi ★. Bila skill ini dipanggil oleh `dirigen-ppt-mawar-kaca`, lewati yang sudah dijawab di sana.

**Isian:** judul · mata kuliah + modul · kelompok · tutor · nama + NIM anggota · file referensi .pptx · file logo.

1. Seberapa mirip dengan referensi? ★ tata letak, warna, urutan tipe slide ditiru; isi diganti materi baru · hampir persis termasuk gambar-gambarnya · hanya nuansa warna (pakai mode mandiri)
2. Materi diambil dari? ★ file materi yang diunggah · isi referensi itu sendiri · diketik di chat
3. Logo & mawar di slide pembuka? ★ gambar logo di depan mawar berlapis (diam) · gambar + animasi Zoom bawaan PowerPoint · hanya logo tanpa mawar
4. Mawar kecil di pojok slide isi? ★ ya (kanan atas) · tidak
5. Kelopak & warna mawar? ★ kaca embun, merah muda–peach · holografik lilac · tetes bening · merah tegas
6. Teks harus bisa diedit? ★ ya, semua textbox asli · tidak apa-apa slide berupa gambar penuh
7. Transisi? ★ ikut referensi; slide tanpa transisi diberi Pudar · semua Pudar · tanpa transisi
8. Slide anggota? ★ pil kaca berisi nama + NIM · daftar biasa di kotak teks pola referensi
9. Catatan pembicara? ★ ya, 2–3 kalimat per slide · tidak
10. Bila referensi tidak ada: latar? ★ pembuka/penutup Holografik, materi Aurora Pagi · satu latar holografik · satu latar aurora pagi

## Alur

```bash
# 1. bedah referensi
python3 scripts/bedah_referensi.py referensi.pptx --keluar kerja/bedah --pratinjau
#    → baca kerja/bedah/peta-bentuk.txt dan LIHAT kerja/bedah/pratinjau/lembar-kontak.png

# 2. logo + mawar (dan latar, hanya untuk mode mandiri)
python3 <mawar-kaca-berlapis>/scripts/ambil_logo.py <galeri-logo.html | referensi.pptx | logo.png> kerja/logo
python3 <mawar-kaca-berlapis>/scripts/render_png.py --aset kerja/kc --mawar kerja/mawar.png --logo kerja/logo.png --varian embun --palet sakura
python3 <mawar-kaca-berlapis>/scripts/render_png.py --aset kerja/kc --latar holo-klasik,pagi-fajar,… --folder kerja/latar   # mode mandiri

# 3. tulis kerja/peta.json (mulai dari kerja/bedah/peta-awal.json atau assets/peta-contoh.json)

# 4. rakit
python3 scripts/rakit_pptx.py --peta kerja/peta.json --referensi referensi.pptx --keluar out/presentasi-<slug>.pptx --mawar kerja/mawar.png --pojok [--animasi]
python3 scripts/rakit_pptx.py --peta kerja/peta.json --keluar out/presentasi-<slug>.pptx --mawar kerja/mawar.png --latar-folder kerja/latar --aset kerja/kc [--animasi]

# 5. periksa
python3 scripts/bedah_referensi.py out/presentasi-<slug>.pptx --keluar kerja/cek --pratinjau   # lihat lembar-kontak.png
```

`kerja/kc` = folder berisi semua `assets/kc-*` paket kaca cair + `bank-latar-holo-pagi` + `mawar-kaca-berlapis` (dipakai untuk render dan untuk membaca warna teks tiap latar).

## PETA SLIDE

```json
{"anggota": [{"nama": "…", "nim": "…"}],
 "slide": [
  {"tipe": "sampul", "pola": 1, "isi": {"Judul": "Bangun Ruang", "Subjudul": "…"}, "ganti_gambar": "Logo",
   "latar": "holo-klasik", "label": "…", "judul": "…", "sub": "…", "catatan": "…"}
 ]}
```

**Mode referensi** memakai: `pola` (nomor slide referensi yang disalin utuh), `isi` {nama bentuk: teks atau [baris]}, `ganti_gambar` (gambar logo lama → mawar+logo di posisi & ukuran yang sama), `mawar` {x, y, w dalam inci}, `buang` [nama bentuk], `catatan`. Format run pertama tiap paragraf dipertahankan (font, ukuran, warna, poin). Slide asli referensi dibuang di akhir; animasi dan transisi pola ikut tersalin.

**Mode mandiri** memakai: `tipe` (`sampul`, `kelompok`, `anggota`, `agenda`, `poin`, `kartu`, `banding`, `kisi`, `pernyataan`, `penutup`), `latar`, `label`, `judul`, `sub`, `info`, `butir`, `kartu`/`kolom`, `poin`, `catatan`. Satu peta bisa memuat kedua kelompok kunci sekaligus (lihat `assets/peta-contoh.json`).

Memilih pola dari referensi: sampul → slide 1; slide kelompok/anggota → slide yang punya judul + kotak isi; materi → slide isi yang paling mirip panjang teksnya; penutup → slide terakhir. Nama bentuk diambil persis dari `peta-bentuk.txt`.

## Profil referensi 1 (Modul 8 Bangun Ruang)

Diisi sesudah `bedah_referensi.py` dijalankan pertama kali pada `presentasi-modul8-bangun-ruang.pptx`: ukuran slide, font judul & isi, warna tema, nomor pola untuk sampul / kelompok / anggota / materi / penutup, nama bentuk judul, isi, dan logo. Sampai itu terisi, **jalankan bedah setiap kali** dan baca hasilnya sebelum menulis peta.

## Aturan

- Logo tidak pernah digambar ulang: hanya gambar dari file LO (`ambil_logo.py`).
- Teks selalu textbox asli (bisa diedit); jangan meratakan slide jadi gambar kecuali LO memilihnya.
- Angka hanya dari materi. Nama & NIM disalin huruf per huruf.
- Teks yang lebih panjang dari aslinya: pecah ke slide berikutnya dengan pola yang sama, jangan perkecil font di bawah 16 pt.
- `--animasi` hanya ditambahkan pada slide yang belum punya animasi; animasi asli referensi tidak ditimpa.
- Selalu buka pratinjau hasil dan periksa: teks tidak meluap, mawar tidak menutupi judul, jumlah slide sesuai peta.

## Checklist

- [ ] `peta-bentuk.txt` dibaca; setiap kunci `isi` cocok dengan nama bentuk (rakit mencetak PERINGATAN bila tidak).
- [ ] Pratinjau hasil dilihat; tidak ada teks meluap atau placeholder referensi yang tertinggal.
- [ ] Slide 1 berlogo mawar, slide 2 Kelompok, slide 3 Anggota (nama + NIM benar).
- [ ] File terbuka di LibreOffice tanpa galat; ukuran wajar (latar JPG, mawar satu PNG yang dipakai ulang).
- [ ] Balasan chat menyebut mode yang dipakai, pola tiap slide, dan sisa `⟨ISI SENDIRI⟩`.
