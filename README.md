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
2. Claude.ai → **Settings → Capabilities → Skills → Upload skill**, unggah ke-13 zip satu per satu (`kaca-cair-semua.zip` hanya arsip gabungan, bukan untuk diunggah).
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
```
