---
name: bank-ide-tema-kaca
description: "Bank ide untuk PPT kaca cair (Liquid Glass): 24 tema siap pakai yang masing-masing mengunci kombinasi latar, preset kaca, resep lensa, morph, efek teks, transisi utama dan aksen, serta tempo BPM; 40 ide momen gerak yang memetakan isi materi ke animasi; 6 resep susunan dek menurut durasi; pemetaan rumpun mata kuliah ke tema; dan baris KOMBINASI supaya dek berikutnya tidak kembar. Dipanggil oleh dirigen-ppt-kaca-cair; pakai juga saat LO minta ide, variasi, atau 'pilihkan tema' untuk presentasi bergaya kaca."
---

# Bank Ide & Tema Kaca Cair

Kode merujuk ke skill pecahan: latar (`latar-kaca-cair`), L1–L10 (`efek-lensa-pembias`), M1–M12 (`morph-bentuk-cair`), T1–T10 (`teks-gulir-cair`), K1–K13 (`komponen-ui-kaca`), transisi (`transisi-kaca-cair`), I1–I6 (`identitas-kelompok-kaca`).

## A. 24 tema siap pakai

| # | Tema | Latar (utama · aksen) | Kaca | Lensa | Morph | Teks | Transisi utama · aksen | BPM | Identitas | Cocok untuk |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Liquid Klasik** (paling mirip video) | aurora-lavender | susu | L1 | M1, M4 | T1 | riak · tetes, kubus | 120 | I2 | aman untuk mata kuliah apa pun |
| 2 | Embun Pagi | aurora-pagi · air-embun | embun | L2 | M9 | T3 | riak · panel | 100 | I3 | bahasa, sastra, menulis |
| 3 | Senja Kampus | aurora-senja | susu | L7 | M6 | T1 | tirai · leleh | 110 | I1 | SBdP, seni, apresiasi |
| 4 | Mint Segar | aurora-mint | susu | L4 | M10 | T4 | wiper · morph | 120 | I4 | IPA, kesehatan, PJOK |
| 5 | Susu Hangat | aurora-susu | susu | L3 | M5 | T3 | panel · pil | 90 | I5 | PKn, karakter, BK, etika |
| 6 | Es Kutub | aurora-es | bening | L10 | M2 | T2 | riak · lensa | 110 | I6 | matematika, statistika |
| 7 | Kota Neon | neon-kota | asap | L7 | M8 | T9 | tirai · kocok | 132 | I1 | TIK, media pembelajaran |
| 8 | Nebula | neon-ungu · neon-galaksi | es | L8 | M3 | T10 | lensa · lorong | 120 | I3 | IPA tata surya, imajinasi |
| 9 | Laut Malam | neon-sian | es | L1 | M10 | T1 | riak · leleh | 110 | I4 | IPS maritim, geografi |
| 10 | Hujan Neon | neon-hujan | asap | L9 | M6 | T6 | tirai · tetes | 128 | I4 | cuaca, bencana, mitigasi |
| 11 | Synthwave | neon-grid | asap | L3 | M7 | T9 | kubus · lorong | 140 | I6 | teknologi, kreativitas, "wow" |
| 12 | Galaksi Sunyi | neon-galaksi | es | L5 | M12 | T3 | lensa · pudar | 90 | I5 | filsafat pendidikan, refleksi |
| 13 | Kolam Kaustik | air-kaustik | bening | L9 | M6 | T1 | riak · tetes | 120 | I2 | IPA air, ekosistem perairan |
| 14 | Ombak Pagi | air-ombak | susu | L3 | M10 | T4 | wiper · alir | 116 | I4 | IPS, pariwisata, pesisir |
| 15 | Jendela Hujan | air-hujan-jendela | asap | L2 | M9 | T3 | leleh · panel | 96 | I5 | puisi, cerpen, curhat reflektif |
| 16 | Gelembung | air-gelembung | bening | L6 | M9 | T6 | riak · cipratan, gumpal | 126 | I3 | kelas rendah, matematika menyenangkan |
| 17 | Kabut Gunung | air-embun | embun | L4 | M5 | T3 | panel · tirai | 92 | I5 | sejarah, budaya, kearifan lokal |
| 18 | Langit Biru | air-awan | susu | L1 | M4 | T2 | riak · morph | 120 | I2 | cuaca, geografi, lingkungan |
| 19 | Mesh Pelangi | mesh-pelangi | susu | L7 | M3 | T4 | pil · cipratan | 130 | I3 | SBdP, kreativitas, ice breaking |
| 20 | Lampu Lava | mesh-lava | asap | L6 | M5 | T6 | gumpal · leleh | 118 | I2 | energi, perubahan wujud, kimia |
| 21 | Holografik | mesh-holo | bening | L10 | M2 | T10 | lensa · kubus | 124 | I6 | inovasi, teknologi pendidikan |
| 22 | Risograf | mesh-grain | susu | L4 | M11 | T5 | panel · kocok | 112 | I4 | literasi, jurnal, bahasa |
| 23 | Kisi Pastel | mesh-kisi | susu | L3 | M7 | T2 | wiper · lorong | 120 | I6 | geometri, pengukuran, data |
| 24 | Bokeh Malam | mesh-bokeh | asap | L8 | M12 | T3 | kocok · lensa | 100 | I1 | seni, penutup emosional |

**Tema campuran per bagian** (untuk dek ≥ 12 slide): pembuka aurora-lavender → materi dari keluarga air → data dari mesh terang → tanya jawab neon-galaksi → penutup aurora-lavender lagi. Ganti keluarga hanya di slide pembatas bagian dengan transisi penutup layar (`panel`, `tirai`, `lorong`) atau `KC.gantiLatar` di slide pembatas.

## B. Rumpun mata kuliah → tema pertama yang ditawarkan

| Rumpun | Tema |
|---|---|
| IPA / sains | 13 Kolam Kaustik, 4 Mint Segar, 8 Nebula, 20 Lampu Lava |
| Matematika | 6 Es Kutub, 23 Kisi Pastel, 16 Gelembung |
| Bahasa & sastra | 2 Embun Pagi, 15 Jendela Hujan, 22 Risograf |
| IPS / sejarah / geografi | 14 Ombak Pagi, 17 Kabut Gunung, 9 Laut Malam |
| PKn / karakter / BK | 5 Susu Hangat, 12 Galaksi Sunyi |
| Seni / SBdP | 3 Senja Kampus, 19 Mesh Pelangi, 24 Bokeh Malam |
| TIK / media / inovasi | 7 Kota Neon, 11 Synthwave, 21 Holografik |
| Pedagogi umum / tidak jelas | 1 Liquid Klasik |

## C. 40 ide momen gerak

**Pembuka & bagian**
1. Layar kosong → satu gelembung → mekar jadi pil → pecah jadi tiga tombol → melebur ke judul (urutan EXPAND video; M1→M3→M5).
2. Judul satu kata, lensa melintas lalu berhenti di tanda titik (L1).
3. Tanda titik di judul membesar jadi lensa (L2) — "Air." "Hidup." "Belajar."
4. Pembatas bagian: Dynamic Island hitam mekar berisi "Bagian 2 · Tahapan" (K4).
5. Agenda sebagai tab bar; tiap pembatas bagian menampilkan tab bar yang sama dengan indikator pindah satu langkah (K1 + transisi `morph`).
6. Latar berganti keluarga saat bagian berganti (`KC.gantiLatar`) — suasana ikut pindah.
7. Pemutar musik "Sedang dibahas: Bagian 3 dari 4" dengan bilah = kemajuan presentasi (K3).

**Konsep & definisi**
8. Pertanyaan pemantik diketik di kolom cari; jawaban muncul sebagai hasil pencarian (K6 + T5).
9. Definisi panjang: lensa membaca kata kunci satu per satu (L4).
10. Satu kalimat tetap dengan satu kata yang berguling: "Air selalu ___" → Menguap. Mengembun. Turun. (T1).
11. Istilah asing diperbesar lensa prisma (L7).
12. Kata yang sering salah dibalik warnanya oleh lensa (L8).
13. Peta konsep: gumpal pecah jadi ubin konsep (M4), ubin menyala saat dijelaskan (K2).
14. Dua konsep yang menyatu: dua lensa bertemu jadi satu (L6) atau dua kartu melebur (M5).
15. Glosarium: kolom cari dengan sorotan meluncur ke istilah yang sedang dibahas.

**Poin & daftar**
16. Poin sebagai notifikasi yang turun satu per ketukan (K7).
17. Miskonsepsi sebagai notifikasi berlabel "Miskonsepsi 1/2/3".
18. Kegiatan pembelajaran sebagai ubin Control Center yang menyala bergiliran.
19. Pilihan/kategori: satu gelembung pecah jadi tombol (M3).
20. Kelebihan–kekurangan: dua kartu kaca, yang dibahas bergoyang jeli (M11).

**Proses & urutan**
21. Tahapan sebagai garis waktu dengan titik menyala (K13).
22. Siklus sebagai manik yang bertunas satu ke satu (M10).
23. Langkah percobaan sebagai pemutar dengan tombol maju.
24. Sebab → akibat: tetes jatuh dan melebar jadi kartu akibat (M6).
25. Hipotesis → hasil: transisi `alir`, judul lama berguling jadi judul baru.

**Data & angka**
26. Persentase tunggal dalam cincin progres + odometer (K10 + T2).
27. Perbandingan angka sebagai grafik batang tumbuh pegas + tooltip kaca (K5).
28. Kartu data berubah jadi kartu grafik dengan transisi `morph` (`data-morph` sama).
29. Hasil survei kelas: beberapa cincin kecil berdampingan.
30. "Fakta mengejutkan": angka diacak lalu mengendap (T9).

**Banding & evaluasi**
31. Sebelum/sesudah dengan penggeser kaca (K8).
32. Kuis benar/salah dengan sakelar yang menyala (K9).
33. Mitos vs fakta: mitos ditampilkan lalu kacanya retak (transisi `retak`, sekali saja).
34. Rubrik: ubin dengan tingkat warna (`nyala`, `nyala-2`).

**Interaksi & penutup**
35. Tanya jawab: lensa mengikuti penunjuk presenter (L5) di judul "Ada pertanyaan?".
36. Slide jeda/ice breaking: latar gelembung + cipratan.
37. Contoh kasus muncul di lembar bawah yang naik (K12).
38. Kesimpulan: tiga kartu poin melebur jadi satu kartu (M5) + kilau (T10).
39. Penutup: "Sampai jumpa." berguling jadi "Terima kasih." lalu lensa berhenti di huruf terakhir.
40. Pustaka: tenang total — kaca bening, tanpa efek, masuk dengan `riak` (aturan, bukan ide).

## D. Resep susunan dek

| Durasi | Slide | Susunan |
|---|---|---|
| 5–7 menit | 6 | sampul · identitas · pernyataan · poin · angka/banding · penutup |
| 10 menit | 8 | + agenda · definisi |
| 15 menit | 10–11 | sampul · identitas · agenda · definisi · pernyataan · proses · poin · angka · banding · pustaka · penutup |
| 20 menit | 13–14 | + pembatas bagian ×2 · kuis |
| 25–30 menit | 16–18 | + kegiatan · kutipan · tanya jawab · grafik (morph dari angka) |
| Microteaching | 8–10 | sampul · tujuan (ubin) · pemantik (cari) · materi ×3 · kegiatan · kuis · refleksi · penutup |

## E. Baris KOMBINASI

Tulis di akhir balasan chat setiap selesai membuat dek:
```
KC | tema=13 | latar=air-kaustik,neon-sian | kaca=bening | lensa=L9,L4 | morph=M6,M10 | teks=T1,T2 | trans=riak+tetes,lensa | bpm=120 | id=I2
```
Bila LO menempelkan baris KOMBINASI lama, dek baru wajib berbeda di **minimal** tema/latar utama, transisi utama, dan varian identitas.
