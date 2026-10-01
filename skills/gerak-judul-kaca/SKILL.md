---
name: gerak-judul-kaca
description: "12 gerak masuk judul per halaman untuk dek kaca cair (J1–J12): naik pegas seperti referensi, gulir huruf, embun, ombak, tetes, kaca terisi, lensa menyapu, leleh, riak air, gelembung, pantulan air, dan tirai air. Mesin membagi gerak ke tiap slide secara otomatis sehingga dua slide berurutan tidak pernah sama, atau satu gerak untuk seluruh dek. Dipanggil oleh dirigen-ppt-mawar-kaca; pakai juga saat LO minta judul slide bergerak, animasi judul berbeda tiap halaman, atau judul seperti di video referensi."
---

# Gerak Judul Kaca

Judul di referensi naik kata demi kata dengan pegas lembut. Skill ini menjadikannya J1, lalu menambah 11 variasi bertema air dan kaca. Cukup muat aset; setiap judul slide langsung bergerak.

| File | Isi |
|---|---|
| `assets/kc-judul.js` | `KC.judul.daftar`, `KC.judul.siapkan(dek)`, `KC.judul.jalankan(el, kode)`; pengamat kelas `.masuk` |
| `assets/kc-judul.css` | kata/huruf terpecah, salinan hantu (J6), lensa (J7), gelembung (J10), pantulan (J11), tirai (J12) |

Dimuat sesudah `kc-inti.js` dan **sebelum** `KC.mulai()` (`rakit_mawar.py` sudah mengatur urutannya).

## Bank 12 gerak

| Kode | Nama | Gerak | Cocok |
|---|---|---|---|
| J1 | Naik pegas | kata naik bergantian dengan pegas lembut — **sama seperti referensi** | semua |
| J2 | Gulir huruf | huruf berguling naik satu per satu dengan jejak gerak | judul pendek |
| J3 | Embun | judul mengembun dari kabut: kabur & renggang → rapat & tajam | definisi, kutipan |
| J4 | Ombak | huruf naik bergelombang, memanjang lalu memantul | ceria |
| J5 | Tetes | tiap huruf jatuh seperti tetes air, gepeng saat mendarat | pendek, tegas |
| J6 | Kaca terisi | garis kaca bening dulu, lalu warna mengisi dari kiri dengan kilau | pernyataan |
| J7 | Lensa menyapu | pil kaca meluncur sepanjang judul, huruf tertinggal di belakangnya | konsep inti |
| J8 | Leleh | huruf meleleh turun, memanjang & kabur, lalu mengeras | transisi bagian |
| J9 | Riak air | judul bergelombang seperti pantulan di air, lalu tenang | air, alam |
| J10 | Gelembung | tiap kata lahir di dalam gelembung yang lalu meletup | anak, ceria |
| J11 | Pantulan air | judul naik dari garis air dengan pantulan yang memudar | penutup bagian |
| J12 | Tirai air | tirai air mengalir kiri → kanan, judul tampak di belakangnya | pembuka bagian |

## Cara pakai

- **Bawaan:** `<main class="dek" data-judul-gaya="acak">` — tiap slide mendapat gerak dari kantong acak berbiji (judul tab + nama kelompok), **tanpa pengulangan berurutan**, dan semua 12 terpakai sebelum ada yang diulang.
- Satu gerak untuk seluruh dek: `data-judul-gaya="J1"` (atau kode lain).
- Paksa satu slide: `<h2 class="t-judul" data-judul="J7">`. Tanpa gerak: `data-judul="tidak"`.
- Pilihan "satu gaya per bagian": tulis `data-judul` yang sama di judul tiap slide dalam bagian itu.
- Yang dikenai: judul pertama `.t-judul` / `.t-raksasa` di `.isi` tiap slide. Dilewati otomatis: slide `pustaka`, judul di dalam panggung mawar/lensa, judul yang sudah punya `data-efek` atau `data-morph`. `data-masuk` pada judul itu dihapus supaya tidak dobel.
- Gerak dimulai saat slide mendapat kelas `.masuk` (sesudah transisi). Mode cetak/instan dan `prefers-reduced-motion`: judul langsung tampil.

## Pagar

- Satu gerak judul per slide; jangan tambah `data-efek` teks lain di judul yang sama.
- Judul ≤ 8 kata. J2, J5, J10 paling bagus untuk ≤ 4 kata; untuk judul panjang mesin tetap jalan, tapi pilih J1, J3, J6, J12 bila dipaksa.
- Jangan memberi gerak judul di slide anggota pada nama/NIM (itu milik `nama-tombol-kaca`).
