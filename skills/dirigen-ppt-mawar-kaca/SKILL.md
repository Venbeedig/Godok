---
name: dirigen-ppt-mawar-kaca
description: "Skill induk pembuat presentasi HTML kaca cair bertema Mawar Kaca: logo kampus (mis. Universitas Terbuka) di tengah mawar kaca berlapis yang mekar di slide pembuka, slide Kelompok tepat sesudahnya, slide anggota dengan nama + NIM yang dibentuk jadi tombol kaca oleh burung kaca dan 11 efek lain, gerak judul berbeda tiap halaman, dan latar Holografik + Aurora Pagi. Mengajukan banyak pertanyaan pilihan ganda dulu, lalu merakit satu file HTML offline + PDF (dan .pptx bila diminta). Pakai setiap kali LO minta PPT/presentasi dengan logo mawar, mawar kaca, latar holografik, aurora pagi, nama anggota jadi tombol, atau 'seperti presentasi modul 8 tapi versi kaca'."
---

# Dirigen PPT Mawar Kaca

Kepala paket mawar kaca. Skill ini memakai mesin `dirigen-ppt-kaca-cair` (navigasi, transisi, komponen, PDF) dan menambah empat skill: `bank-latar-holo-pagi`, `mawar-kaca-berlapis`, `nama-tombol-kaca`, `gerak-judul-kaca`. Untuk keluaran **.pptx** ia menyerahkan PETA SLIDE yang sama ke `ppt-referensi-mawar`.

## Keluaran wajib

1. `presentasi-<slug>.html` — versi utama, satu file tanpa aset eksternal (klik dua kali, F untuk layar penuh).
2. `presentasi-<slug>.pdf` — keadaan akhir tiap slide.
3. `presentasi-<slug>.pptx` — bila LO memilih (pertanyaan 18).
4. Di chat: isi per slide (satu baris per slide), sisa `⟨ISI SENDIRI⟩`, cara pakai (→ ← F T), dan satu baris **KOMBINASI** (mis. `M1-sakura-tengah · pola holo/pagi · N1 · J acak · tetes/riak/leleh · 120 BPM`).

## Susunan dek tetap

| # | Slide | Isi | Latar bawaan |
|---|---|---|---|
| 1 | Sampul | mawar kaca berlapis mekar, logo di tatakan; judul, mata kuliah, modul | `holo-klasik` |
| 2 | **Kelompok** | "Dipresentasikan oleh · Kelompok N" + pil mata kuliah & tutor | `holo-mutiara` |
| 3 | **Anggota** | tombol kaca pil berisi nama + NIM, dibentuk efek N1–N12 | `holo-opal` |
| 4 | Agenda | pil bernomor | `pagi-fajar` |
| 5 … n-1 | Materi | definisi, poin, banding, kisi rumus, pernyataan, praktik | Aurora Pagi bergilir |
| n | Penutup | mawar dari serpih kaca + "Terima kasih." | `holo-senja` |

Durasi → jumlah slide: 10 menit ≈ 9–10 slide, 15 menit ≈ 12–13, 20 menit ≈ 15–16 (selalu termasuk slide 1–4 dan penutup).

## Ronde tanya — banyak pilihan ganda, sebelum membuat apa pun

Baca semua materi dulu. Lalu tanyakan **semua** pertanyaan di bawah memakai tool pilihan ganda (maks. 4 pertanyaan per panggilan, berturut-turut sampai habis). Bila tool tidak ada, kirim satu pesan bernomor dan minta jawaban seperti `1A 2B 3A …`. Tandai saran dengan ★ dan sebutkan: *"nomor yang tidak dijawab saya isi dengan ★"*. Lewati pertanyaan yang jawabannya sudah jelas dari materi atau pesan LO.

**Isian singkat** (blok teks, bukan pilihan): judul/topik · mata kuliah + modul · nomor kelompok · nama tutor/dosen · nama + NIM semua anggota · durasi (menit) · file logo.

**A. Logo & mawar**
1. Logo kampus dari mana? ★ dari file yang diunggah (galeri logo / .pptx / PNG) · inisial dulu, logo menyusul · tanpa logo
2. Kelopak mawar? ★ M1 kaca embun bening · M2 kaca holografik pelangi · M3 tetes air paling bening
3. Warna mawar? ★ merah muda pucat ke peach (sakura) · merah tegas · lilac · putih bening · ikut warna latar
4. Cara mawar muncul di sampul? ★ mekar dari tengah lalu logo · logo dulu lalu mawar · serpih kaca berkumpul
5. Sesudah sampul? ★ mengecil ke pojok dan tetap bernapas di tiap slide · hilang · muncul lagi hanya di penutup
6. Penutup? ★ mawar dari serpih kaca (holografik) · sama seperti sampul · tanpa mawar

**B. Latar**
7. Pola latar? ★ pembuka & penutup Holografik, materi Aurora Pagi · bergantian tiap slide · satu keluarga per bagian · satu latar untuk semua
8. Latar sampul? ★ Holo Klasik · Foil Hologram · Berkas Prisma · Mutiara (sebut "lainnya" untuk memilih dari 12)
9. Nuansa Aurora Pagi untuk materi? ★ campur semua · hangat (fajar, mentari, jeruk, madu) · sejuk (langit, embun, pantai, gunung) · bunga (sakura, lavender, pelangi)

**C. Kelompok & anggota**
10. Slide kelompok dan anggota? ★ dua slide: Kelompok lalu Anggota · satu slide gabungan
11. Efek nama jadi tombol? ★ N1 burung kaca · N5 kelopak mawar gugur · N2 tetes air · acak dari 12 (sebut "lainnya" untuk N3–N12)
12. NIM ditampilkan? ★ di dalam tombol di bawah nama · sebaris di samping nama
13. Inisial di tombol? ★ ya, lingkaran inisial di kiri · tidak, nama saja

**D. Gerak & suasana**
14. Gerak judul per halaman? ★ berbeda tiap slide, tidak berulang berurutan · J1 seperti referensi untuk semua · satu gaya per bagian
15. Transisi antar slide? ★ air: tetes, riak, leleh · lembut: pudar, panel, wiper · ramai: kubus, lorong, cipratan
16. Tempo koreografi? Tenang 90 BPM · ★ Standar 120 · Enerjik 140
17. Tingkat efek? ★ otomatis (deteksi laptop) · hemat untuk laptop lemah · selalu penuh

**E. Keluaran**
18. Selain HTML? ★ PDF + .pptx · PDF saja · .pptx saja · tidak perlu
19. PDF? ★ gambar (identik layar) · teks bisa disalin · keduanya

Sesudah ronde ini **jangan bertanya lagi**. Data yang belum ada diisi `⟨ISI SENDIRI: …⟩`.

## BRIEF

```yaml
judul:            slug:            mata_kuliah:      modul:
kelompok:         tutor:           anggota: []       # - nama | NIM  (salin huruf per huruf)
durasi_menit:     jumlah_slide:
logo: <path|inisial>               inisial: UT
mawar: {varian: embun, palet: sakura, mekar: tengah, pojok: ya, penutup: serpih}
latar: {pola: holo-pagi, sampul: holo-klasik, nuansa_pagi: campur}
anggota_efek: burung               nim: bawah        inisial_tombol: ya
judul_gaya: acak                   trans: [tetes, riak, leleh]     bpm: 120     tingkat: otomatis
keluaran: [html, pdf, pptx]        pdf: gambar
peta_slide: []    # - no | tipe | latar | judul | isi ringkas | komponen | transisi
```

## Urutan kerja

| # | Skill | Keluaran |
|---|---|---|
| 1 | `tata-letak-slide-kaca` | PETA SLIDE materi: judul-pernyataan, ≤ 35 kata, ≤ 5 butir per slide |
| 2 | `bank-latar-holo-pagi` | `data-latar` tiap slide sesuai pola (tidak ada latar sama berurutan) |
| 3 | `mawar-kaca-berlapis` | logo (`ambil_logo.py`), panggung sampul & penutup, pojok |
| 4 | `nama-tombol-kaca` | slide anggota dengan `data-efek-nama` |
| 5 | `gerak-judul-kaca` | `data-judul-gaya` di dek |
| 6 | `komponen-ui-kaca`, `transisi-kaca-cair` | kartu, pil, kisi; `data-trans` (1 utama + 2 aksen) |
| 7 | `navigasi-dek-kaca`, `material-kaca-cair` | kerangka dek, tingkat efek |
| 8 | `perakit-pdf-kaca` | PDF |
| 9 | `ppt-referensi-mawar` | .pptx dari PETA SLIDE yang sama (bila dipilih) |

## Perakitan (teknis)

1. Folder `kerja/kc/`: salin **semua** `assets/kc-*` dari paket kaca cair (material, latar, lensa, teks, morph, komponen, transisi, navigasi, tata letak, identitas) **dan** dari keempat skill mawar serta `assets/kc-tata-mawar.css` skill ini. Jangan menulis ulang aset — sudah diuji.
2. Logo: `python3 <mawar-kaca-berlapis>/scripts/ambil_logo.py <file LO> kerja/logo`.
3. Tulis `kerja/isi-dek.html` mengikuti `assets/contoh-isi-dek.html` (13 slide, semua tipe di atas). Atribut dek: `data-mawar-pojok="ya" data-judul-gaya="acak" data-mata-kuliah="…" data-kelompok="…" data-bpm="120"`.
4. Rakit: `python3 scripts/rakit_mawar.py --aset kerja/kc --isi kerja/isi-dek.html --logo kerja/logo.png --judul "<Judul>" --keluar <out>/presentasi-<slug>.html` (tambahan adegan/gaya: `--tambah adegan.js gaya.css`).
5. **Uji**: `python3 <dirigen-ppt-kaca-cair>/scripts/uji_dek.py <html> kerja/uji` → tanpa galat JS, tanpa slide macet, lalu **lihat** `kerja/uji/lembar.jpg`. Perbaiki dan ulangi sampai bersih.
6. PDF: `python3 <perakit-pdf-kaca>/scripts/cetak_pdf.py <html> <out>/presentasi-<slug>.pdf --mode gambar`.
7. .pptx: ikuti `ppt-referensi-mawar` (render mawar & latar dengan `render_png.py`, lalu `rakit_pptx.py`).

## Pagar

- Satu pusat perhatian per slide: mawar besar hanya di sampul & penutup; slide anggota hanya efek nama; gerak judul boleh menemani.
- Nama & NIM disalin huruf per huruf; tanpa efek teks lain di atasnya.
- **Logo tidak pernah digambar ulang.** Hanya file LO, disematkan sebagai data URI. Bila belum ada: inisial + tandai `⟨ISI SENDIRI: logo⟩` di balasan.
- Nol aset eksternal, tanpa `Math.random()` di file jadi, `prefers-reduced-motion` dihormati.
- Angka hanya dari materi. Kontras teks mengikuti token latar.

## Checklist sebelum menyerahkan

- [ ] Semua pertanyaan sudah ditanyakan (atau jelas dari materi) dan jawabannya tercermin di BRIEF.
- [ ] `uji_dek.py` bersih; `lembar.jpg` dilihat: mawar mekar penuh, tombol anggota lengkap, judul terbaca.
- [ ] Slide 2 = Kelompok, slide 3 = Anggota; nama & NIM cocok dengan kiriman LO.
- [ ] Pola latar sesuai jawaban 7; tidak ada latar sama berurutan.
- [ ] PDF: jumlah halaman = jumlah slide. .pptx (bila diminta) terbuka dan teksnya bisa diedit.
- [ ] Balasan chat memuat isi per slide, sisa `⟨ISI SENDIRI⟩`, cara pakai, dan baris KOMBINASI.
