# Presentasi Kaca Air — template PPT HTML

Dek presentasi kelompok bergaya kaca cair (liquid glass) untuk Universitas Terbuka:
palet gradasi gaya kartu Color Bears yang berganti tiap bagian, transisi kaca berbentuk
hewan laut, dan pembuka logo UT di tengah mawar kaca berlapis.

## Berkas jadi (`dist/`)

| Berkas | Untuk apa |
|---|---|
| `presentasi-kaca-air.html` | **Versi utama** untuk presentasi di laptop. Satu file, offline, klik dua kali untuk membuka di Chrome/Edge. |
| `presentasi-kaca-air.pptx` | Versi yang **dikumpulkan**: latar diam, kartu kaca dan teks bisa diedit, transisi **Morph** (PowerPoint 2019/365; versi lama otomatis memakai Fade). |
| `presentasi-kaca-air.pdf` | Keadaan akhir tiap slide, identik dengan layar. |
| `pratinjau-slide.jpg` | Lembar kontak semua slide. |

## Cara presentasi (file HTML)

| Tombol | Fungsi |
|---|---|
| `→` · `Spasi` · `PageDown` · tombol **Berikutnya** | maju (pointer/clicker presentasi juga bisa) |
| `←` · `PageUp` | mundur |
| `F` | layar penuh; pembuka mawar diputar ulang dari awal |
| `T` | tingkat efek: **Penuh** → **Sedang** (laptop sedang) → **Hemat** (laptop lemah) |
| `R` atau klik logo | putar ulang pembuka di slide 1 |
| `Home` / `End` | slide pertama / terakhir |

Tingkat efek dipilih otomatis dari kecepatan laptop saat file dibuka; pilihan manual (`T`) diingat.

## Susunan slide

| # | Slide | Palet | Transisi masuk |
|---|---|---|---|
| 1 | Sampul: logo UT di dalam mawar kaca 4 lapis | Orchid Pulse | pembuka: tetes air → riak → mawar mekar → logo |
| 2 | Identitas kelompok (gumpal kaca pecah jadi 5 ubin anggota) | Orchid Pulse | koi |
| 3 | Agenda: tiga kartu palet | Orchid Pulse | koi |
| 4 | Pembatas Bagian 1 | Laguna (Indigo Ripple · Aqua Jelly · Mint Foam) | ubur-ubur besar |
| 5 | Definisi | Laguna | ubur-ubur |
| 6 | Tiga poin penting | Laguna | ubur-ubur |
| 7 | Pembatas Bagian 2 | Persik (Coral Song · Peach Tide · Vanilla Foam) | paus besar |
| 8 | Tahapan (garis waktu 4 langkah) | Persik | paus |
| 9 | Perbandingan A vs B | Persik | paus |
| 10 | Pembatas Bagian 3 | Kaca Laut (Lagoon Teal · Sea Glass · Sand Pearl) | penyu + mozaik sisik |
| 11 | Kesimpulan | Kaca Laut | penyu |
| 12 | Daftar pustaka (tenang, tanpa efek) | Kaca Laut | riak |
| 13 | Penutup "Terima kasih" + mawar | Orchid Pulse | koi |

## Mengubah isi

Semua teks bertanda `⟨ … ⟩` adalah **isi sendiri**. Ubah di `src/index.html`, lalu jalankan:

```bash
./bangun.sh        # rakit HTML offline → uji → ekspor PDF & PPTX ke dist/
```

Kebutuhan: `python3` dengan `python-pptx` dan `Pillow`, serta `node` dengan paket `playwright` (Chromium).

Atribut penting di `src/index.html`:

- `data-palet` pada slide: `orchid` · `laguna` · `persik` · `kacalaut`
- `data-trans` pada slide (transisi saat masuk): `koi` · `ubur` · `paus` · `penyu` · `riak` · `pudar`
- `data-besar` membuat versi transisi yang lebih megah (dipakai di pembatas bagian)
- `data-masuk` + `data-ketuk` mengatur gerak masuk elemen (1 ketuk = 0,5 detik, tempo 120 BPM)

## Struktur

```
src/        index.html (isi slide) · kc.css (gaya) · kc.js (mesin, transisi, pembuka)
            kc-hewan.js (siluet paus, ubur-ubur, penyu, koi) · logo-ut.png · font/ (Poppins, OFL)
scripts/    rakit.py · uji.cjs · uji_navigasi.cjs · rekam.cjs · ekspor.cjs · bangun_pptx.py · bangun_pdf.py
dist/       hasil jadi
```

Font Poppins berlisensi SIL Open Font License (`src/font/OFL-Poppins.txt`). File PPTX memakai
Segoe UI (bawaan Windows) supaya tampil sama di komputer mana pun.
