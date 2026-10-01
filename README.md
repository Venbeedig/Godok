# Godok

## Paket skill: PPT Kaca Cair (Liquid Glass)

Tiga belas skill `.md` untuk membuat presentasi kelompok bergaya **kaca cair**, seperti video referensi Liquid Glass: latar aurora yang mengalir, gelembung dan lensa kaca yang membiaskan huruf, bentuk yang meleleh lalu menyatu, kata yang berguling, komponen ala iOS, dan 16 transisi cair. Hasilnya **satu file HTML** yang jalan offline, plus PDF.

| Isi paket | Jumlah |
|---|---|
| Latar hidup (CSS/SVG, tanpa gambar) | 24, dalam 4 keluarga |
| Transisi antar slide | 16, dalam 4 keluarga |
| Resep lensa pembias | 10 (L1–L10) |
| Resep morph cair | 12 (M1–M12) |
| Efek teks | 10 (T1–T10) |
| Komponen UI kaca | 13 (K1–K13) + 30 ikon |
| Varian slide identitas kelompok | 6 (I1–I6) |
| Tema siap pakai · ide momen gerak | 24 · 40 |
| Tingkat efek (laptop kuat sampai HP/Zoom) | 3, berpindah otomatis atau tombol T |

### Daftar skill

| Skill | Peran |
|---|---|
| `dirigen-ppt-kaca-cair` | **induk** — membaca materi, satu ronde pertanyaan pilihan ganda, memanggil pecahan, merakit, menguji, menyerahkan |
| `bank-ide-tema-kaca` | 24 tema, 40 ide momen, resep susunan dek, baris KOMBINASI |
| `tata-letak-slide-kaca` | kerangka 15 tipe slide, zona aman, batas kata, 17 contoh slide |
| `latar-kaca-cair` | 24 latar + ganti latar di tengah slide |
| `komponen-ui-kaca` | tab bar, ubin kontrol, pemutar, Dynamic Island, grafik, cari, notifikasi, penggeser, sakelar, cincin, dll. |
| `identitas-kelompok-kaca` | 6 varian slide anggota kelompok + aturan ejaan nama/NIM |
| `efek-lensa-pembias` | lensa kaca yang memperbesar & membelokkan huruf |
| `teks-gulir-cair` | kata berguling, odometer, embun, ombak, ketik, tetes, acak, kilau |
| `morph-bentuk-cair` | gumpal goo, bulat→pil→kartu, pecah, lebur, tetes, manik, jeli |
| `transisi-kaca-cair` | tetesan, kaca pecah/geser, morph, kamera & kedalaman |
| `navigasi-dek-kaca` | mesin dek, navigasi pil kaca, keyboard/sentuh, koreografi ketukan |
| `material-kaca-cair` | bahan kaca, 6 preset, pembiasan tepi SVG, 3 tingkat efek, pegas |
| `perakit-pdf-kaca` | PDF identik layar, dengan atau tanpa lapisan teks yang bisa disalin |

Setiap skill pecahan membawa file `assets/` (CSS/JS) yang **sudah diuji** di Chromium. Skill induk merakitnya dengan `scripts/rakit.py` dan mengujinya dengan `scripts/uji_dek.py`.

### Memasang di Claude.ai

1. Unduh file di folder [`zip/`](zip/) — satu `.zip` per skill.
2. Claude.ai → **Settings → Capabilities → Skills → Upload skill**, unggah zip satu per satu (`kaca-cair-semua.zip` dan `mawar-kaca-baru.zip` hanya arsip gabungan, bukan untuk diunggah).
3. Di percakapan baru, unggah materi presentasi lalu tulis misalnya: *"Buatkan PPT kelompok gaya kaca cair dari materi ini."*

Di Claude Code, salin folder `skills/*` ke `.claude/skills/` proyek atau `~/.claude/skills/`.

### Galeri (buka di Chrome/Edge, tekan F untuk layar penuh)

| File | Isi |
|---|---|
| [`galeri/galeri-demo-kaca-cair.html`](galeri/galeri-demo-kaca-cair.html) | dek contoh 17 slide "Siklus Air" — memakai ke-16 transisi |
| [`galeri/galeri-varian-kaca-cair.html`](galeri/galeri-varian-kaca-cair.html) | 23 slide uji: I1–I6, L1–L10, morph, lembar bawah |
| [`galeri/katalog-latar.html`](galeri/katalog-latar.html) | 24 latar; klik untuk melihat bergerak |
| [`galeri/galeri-demo-kaca-cair.pdf`](galeri/galeri-demo-kaca-cair.pdf) | PDF dek contoh (teks bisa disalin) |

Navigasi: → / Spasi maju · ← mundur · F layar penuh · T ganti tingkat efek. Nama anggota dan NIM di galeri hanyalah contoh.

### Membangun ulang galeri

```bash
python3 alat/bangun_galeri.py          # HTML dari aset di skills/
python3 alat/bangun_galeri.py --pdf    # + PDF (butuh playwright, Pillow, pypdf)
python3 alat/bangun_galeri.py --pptx   # + contoh .pptx mawar kaca (butuh playwright, python-pptx)
python3 alat/kemas_zip.py              # zip per skill + arsip gabungan
```

## Paket skill: Mawar Kaca (logo mawar, Holografik & Aurora Pagi)

Enam skill tambahan yang memakai mesin kaca cair di atas. Logo kampus (mis. Universitas Terbuka) duduk di tengah **mawar kaca berlapis** yang mekar di slide pembuka, disusul slide **Kelompok** dan slide **Anggota** yang nama + NIM-nya dibentuk jadi tombol kaca oleh burung kaca (atau 11 efek lain). Judul tiap halaman bergerak berbeda-beda, latarnya Holografik dan Aurora Pagi. Keluarannya HTML kaca cair + PDF, dan **.pptx** yang meniru file presentasi referensi.

| Isi paket | Jumlah |
|---|---|
| Latar baru: Holografik · Aurora Pagi | 12 · 12 |
| Mawar kaca: varian kelopak × palet × cara mekar | 3 × 5 × 3, + mode pojok |
| Efek nama anggota jadi tombol | 12 (N1–N12) |
| Gerak judul per halaman | 12 (J1–J12), dibagi otomatis tanpa berulang |
| Pertanyaan pilihan ganda sebelum membuat | 19 (HTML) · 10 (.pptx) |

| Skill | Peran |
|---|---|
| `dirigen-ppt-mawar-kaca` | **induk HTML** — banyak pertanyaan pilihan ganda, BRIEF, merakit dengan `rakit_mawar.py`, uji, PDF, serah ke .pptx |
| `ppt-referensi-mawar` | **induk .pptx** — bedah file referensi, salin slide-nya sebagai pola, ganti teks, pasang logo+mawar; cadangan mode mandiri |
| `mawar-kaca-berlapis` | mawar 5 lapis (35 kelopak kaca) di belakang logo; ambil logo dari file LO; render PNG untuk .pptx |
| `bank-latar-holo-pagi` | 24 latar baru (12 holo, 12 pagi) untuk `data-latar` |
| `nama-tombol-kaca` | 12 efek pembawa: burung, tetes, kupu, koi, kelopak, gelembung, bintang, ubur, pesawat, riak, kristal, kunang |
| `gerak-judul-kaca` | 12 gerak judul: naik pegas (seperti referensi), gulir, embun, ombak, tetes, kaca terisi, lensa, leleh, riak, gelembung, pantulan, tirai air |

Unggah juga ke-13 skill kaca cair; paket ini memakai aset mereka. Zip: satu per skill di [`zip/`](zip/), `mawar-kaca-baru.zip` berisi keenamnya.

### Galeri mawar kaca

| File | Isi |
|---|---|
| [`galeri/galeri-mawar-kaca.html`](galeri/galeri-mawar-kaca.html) | dek contoh 13 slide "Bangun Ruang": sampul mawar, Kelompok, Anggota (burung kaca), materi, penutup |
| [`galeri/galeri-varian-mawar.html`](galeri/galeri-varian-mawar.html) | 27 slide: 3 varian mawar, N1–N12, J1–J12 |
| [`galeri/katalog-latar-holo-pagi.html`](galeri/katalog-latar-holo-pagi.html) | 24 latar holografik & aurora pagi; klik untuk melihat bergerak |
| [`galeri/galeri-mawar-kaca.pdf`](galeri/galeri-mawar-kaca.pdf) | PDF dek contoh |
| [`galeri/contoh-mawar-kaca.pptx`](galeri/contoh-mawar-kaca.pptx) | contoh .pptx mode mandiri (teks bisa diedit, animasi Zoom mawar) |

Logo di galeri masih **inisial "UT"** sebagai pengganti: logo asli dipasang dari file LO dengan `ambil_logo.py`, tidak pernah digambar ulang. Isi Bangun Ruang di contoh adalah materi umum, bukan salinan file referensi.
