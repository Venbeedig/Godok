---
name: transisi-kaca-cair
description: "16 transisi antar slide bergaya kaca cair untuk PPT HTML, dalam empat keluarga: tetesan & cipratan (tetes jatuh lalu riak, riak dari titik klik, leleh dituang, cipratan butir kaca), kaca bergeser & pecah (panel kaca menyapu, tirai bilah kaca, kaca retak runtuh, wiper miring), morph elemen sama (morph posisi & bentuk seperti Morph PowerPoint, tombol jadi lembar, gumpal pindah, judul mengalir), serta kamera & kedalaman (tembus lensa, lorong kaca, kocok kartu, kubus kaca). Otomatis turun ke versi ringan di tingkat sedang/hemat. Dipanggil oleh dirigen-ppt-kaca-cair; pakai juga saat minta transisi slide cair, glass, ripple, shatter, atau morph."
---

# Transisi Kaca Cair

| File | Isi |
|---|---|
| `assets/kc-transisi.css` | lapisan efek `.kc-fx` (riak, cincin, panel, bilah, retak, wiper, pil, lensa, bingkai) |
| `assets/kc-transisi.js` | `KC.transisi.{16 nama + pudar}`, `KC.KELUARGA_TRANSISI`, `KC.PETA_SEDANG` |

Butuh `kc-inti.js`, `kc-material.css`, dan untuk `alir` juga `kc-teks.js`; untuk `gumpal` filter goo dari `kc-filter.html`.

## Memilih transisi

Tulis di slide **tujuan**: `<section class="slide" data-trans="riak">`. Saat mundur, mesin memakai transisi slide yang ditinggalkan dengan arah terbalik. Untuk `tetes`, `riak`, `cipratan`, `lensa`, `retak` titik asalnya adalah tombol yang diklik (atau pusat layar bila pakai keyboard); bisa dipaksa lewat `KC.ke(n, {titik:{x,y}})`.

## 16 transisi

### A. Tetesan & cipratan
| Nama | Gerak | Lama | Cocok |
|---|---|---|---|
| `tetes` | tetes kaca jatuh (gravitasi), gepeng saat menyentuh, tiga riak, slide baru terbuka melingkar dari titik jatuh | 1,6 dtk | pembuka bagian, identitas |
| `riak` | lingkaran membesar dari titik klik + cincin kaca + riak | 1,0 dtk | **bawaan slide isi** |
| `leleh` | slide baru dituang dari atas; ujungnya menetes (13 tetes, PRNG berbiji) | 1,3 dtk | ganti suasana, cerita |
| `cipratan` | 8 butir kaca terpercik, tiap butir membuka lingkaran sendiri | 1,4 dtk | kejutan, kuis, penutup ceria |

### B. Kaca bergeser & pecah
| Nama | Gerak | Lama | Cocok |
|---|---|---|---|
| `panel` | lembaran kaca tebal (blur 46px) menyapu menutup layar, isi berganti di baliknya, lalu lewat | 1,2 dtk | pindah antar bagian |
| `tirai` | 8 bilah kaca turun beruntun, berganti, turun lagi | 1,3 dtk | daftar, poin, ganti latar gelap/terang |
| `retak` | garis retak memancar dari titik pukul, 10 keping slide lama runtuh dengan gravitasi | 1,4 dtk | miskonsepsi, "mitos vs fakta" — **maks. 1× per dek** |
| `wiper` | bilah kaca miring 13,5° menyapu, slide baru di belakangnya | 1,15 dtk | proses, langkah berikutnya |

### C. Morph elemen sama
| Nama | Gerak | Syarat |
|---|---|---|
| `morph` | elemen dengan `data-morph="kunci"` yang sama di dua slide berpindah & berubah ukuran/radius (kaca) atau berskala (teks); isi lain memudar | beri `data-morph` sama di kedua slide (mis. kartu data → kartu grafik) |
| `pil` | tombol "Berikutnya" mekar jadi lembar kaca selayar, lalu menghilang memperlihatkan slide baru | tidak ada |
| `gumpal` | semua kaca slide lama melebur jadi satu gumpal di tengah, lalu pecah ke posisi kaca slide baru | kedua slide punya 1–12 elemen `.kaca` di `.isi` |
| `alir` | judul lama terbang ke posisi judul baru sambil hurufnya berguling jadi judul baru (T1) | kedua slide punya `.t-judul`/`.t-raksasa` atau `data-morph="judul"` |

### D. Kamera & kedalaman
| Nama | Gerak | Cocok |
|---|---|---|
| `lensa` | lensa membesar dari pusat; dunia baru terlihat diperbesar di dalamnya lalu memenuhi layar, slide lama membesar & kabur | masuk ke detail, definisi |
| `lorong` | kamera menembus 3 bingkai kaca; slide lama mundur ke kedalaman | tanya jawab, bagian baru |
| `kocok` | slide lama jadi kartu, dikocok ke belakang; kartu baru maju lalu memenuhi layar | contoh/studi kasus berikutnya |
| `kubus` | rotasi kubus 3D (asal transformasi `50% 50% −960px`), sisi yang menjauh menggelap | penutup, perpindahan besar |

Kontrak fungsi (bila ingin menambah transisi sendiri):
```js
KC.transisi.namaBaru = async (lama, baru, { arah, dek, fx, titik }) => { … };
KC.transisi.namaBaru.masuk = 500; // ms sejak mulai transisi sebelum koreografi isi slide baru dimulai
```
Mesin sudah memberi `.tampil` ke kedua slide (baru di atas) dan setelah selesai menghapus `clip-path`, `transform`, `opacity`, `filter`, `mask`, `z-index` inline keduanya serta mengosongkan `.kc-fx`. Pakai `KC.anim()` (bukan `el.animate` mentah) supaya mode instan & reduced-motion bekerja.

## Penurunan per tingkat

| Tingkat | Perlakuan |
|---|---|
| `penuh` | seperti tabel |
| `sedang` | `retak→tirai`, `cipratan→riak`, `gumpal→morph`, `lorong→lensa`, `leleh→wiper` (`KC.PETA_SEDANG`) |
| `hemat` | semua → `pudar` (380ms, geser 40px) |
| reduced-motion | semua → `pudar` 160ms tanpa geser |

## Ritme pemakaian dalam satu dek

- Pilih **satu transisi utama** untuk slide isi (biasanya `riak`, `wiper`, atau `panel`) dan **dua aksen** untuk momen khusus. Enam belas transisi berbeda dalam 15 slide terasa seperti katalog, bukan presentasi.
- Pembatas bagian memakai transisi keluarga yang sama dengan transisi utama, tetapi versi lebih besar (`riak` → `tetes`, `wiper` → `panel`).
- `retak` dan `cipratan` maksimal sekali per dek. `kubus` dan `lorong` maksimal dua kali.
- Slide `pustaka` masuk dengan `riak`, `panel`, atau `pudar` — jangan dengan efek besar.
- Arah: maju selalu ke kanan/bawah, mundur dibalik otomatis.
