---
name: komponen-ui-kaca
description: "13 komponen UI kaca hidup ala iOS untuk mengisi slide PPT HTML gaya Liquid Glass: tab bar dengan indikator kaca meluncur, ubin Control Center yang menyala, kartu pemutar musik (bilah = kemajuan presentasi), Dynamic Island yang mekar, kartu grafik batang, kolom cari yang mengetik, tumpukan notifikasi, penggeser banding sebelum/sesudah, sakelar benar/salah, cincin progres, tombol gelembung, lembar bawah, dan garis waktu — plus 30 ikon garis. Dipanggil oleh dirigen-ppt-kaca-cair; pakai juga saat isi slide perlu tampil sebagai widget/antarmuka kaca."
---

# Komponen UI Kaca

Video referensi tidak menampilkan poin berpeluru — ia menampilkan **antarmuka**: pemutar musik, Control Center, tab bar, grafik Activity, Spotlight, notifikasi. Skill ini memetakan isi kuliah ke antarmuka semacam itu.

| File | Isi |
|---|---|
| `assets/kc-komponen.css` | gaya `.kc-ikon` + K1–K13 |
| `assets/kc-komponen.js` | `KC.ikon(nama)`, `KC.isiIkon(akar)`, `KC.tab`, `KC.cariPilih`, `KC.grafik`, `KC.notif`, `KC.geser`, `KC.cincin`, `KC.pulau`, `KC.nyalakan`, `KC.lembar` |

Ikon: tulis `<i data-ikon="tetes"></i>`; mesin menggantinya dengan SVG garis. Daftar: `wifi bulan matahari suara senter rumah cari grafik orang kelompok jeda putar maju mundur hati bagikan lonceng centang buku lampu target bendera tetes kanan kiri musik jam tanya geser toga lapisan`.

## Peta isi → komponen

| Isi materi | Komponen | Gerak |
|---|---|---|
| agenda, bagian, langkah bernama | **K1 tab bar** | indikator berpindah tiap 2–2,5 ketukan |
| 3–6 poin pendek, kegiatan, fitur | **K2 ubin kontrol** | gumpal → ubin (M4), lalu menyala bergiliran |
| "sedang dibahas", pembatas bagian | **K3 pemutar** | bilah = posisi slide **sebenarnya** |
| judul bagian, tanya jawab, identitas | **K4 pulau dinamis** | pil hitam mekar jadi kartu |
| data persentase / perbandingan angka | **K5 kartu grafik** | batang tumbuh pegas berurutan |
| definisi, istilah, pertanyaan pemantik | **K6 kolom cari** | mengetik → hasil → sorotan meluncur |
| poin penting, miskonsepsi, fakta | **K7 notifikasi** | turun satu per ketukan |
| sebelum vs sesudah, dua pendekatan | **K8 penggeser** | gagang meluncur dari kiri ke tengah |
| benar/salah, kuis, ceklis | **K9 sakelar** | menyala satu per satu |
| persentase tunggal, capaian | **K10 cincin progres** | lingkaran terisi + odometer (T2) |
| 2–4 pilihan, aksi | **K11 tombol gelembung** | satu gelembung pecah jadi tombol (M3) |
| contoh, catatan tambahan | **K12 lembar bawah** | naik dari tepi bawah |
| tahapan, sejarah, siklus | **K13 garis waktu** | titik menyala satu per satu |

## Markup siap salin

**K1 tab bar** (`KC.tab(bar, i)`; indikator `.kc-tab-ind` wajib anak pertama):
```html
<div class="kaca kc-tab bias">
  <div class="kaca kc-tab-ind"></div>
  <div class="kc-tab-i"><i data-ikon="buku"></i>Pengertian</div>
  <div class="kc-tab-i"><i data-ikon="lapisan"></i>Tahapan</div>
</div>
```
**K2 ubin** (`.nyala` / `.nyala-2` = isi warna aksen; `--kol` jumlah kolom):
```html
<div class="kc-ubin-grid" style="--kol:2">
  <div class="kaca kc-ubin"><i data-ikon="target"></i><div><b>Pertanyaan pemantik</b><small>5 menit</small></div></div>
</div>
```
**K3 pemutar**:
```html
<div class="kc-putar"><div class="kc-putar-at"><div class="kc-putar-sampul"></div>
  <div><b>Penerapan di Kelas IV</b><small>Bagian 3 dari 4</small></div><div class="kc-gel"><i></i><i></i><i></i><i></i><i></i></div></div>
  <div class="kc-putar-bar"><i></i></div><div class="kc-putar-wkt"><span class="wkt-kiri"></span><span class="wkt-kanan"></span></div>
  <div class="kc-putar-tbl"><i data-ikon="mundur"></i><i data-ikon="jeda"></i><i data-ikon="maju"></i></div></div>
```
Isi bilah dari `KC.indeks()+1` dan `KC.jumlah` (tulis "slide 11 / dari 17"), **bukan** menit:detik karangan.

**K4 pulau** (taruh langsung di `.slide`, di luar `.isi`): `<div class="kc-pulau"><div class="kc-pulau-isi">…</div></div>` → `KC.pulau(el, {w:900,h:150,r:56})`.

**K5 grafik** (`--t` = tinggi batang dalam % dari nilai terbesar yang wajar; label memuat angka asli):
```html
<div class="kaca kc-grafik"><div class="kc-grafik-at"><div><b>Air tawar</b><small>persentase dari seluruh air tawar</small></div></div>
  <div class="kc-batang"><div style="--t:68.7%"><i></i><span>Es · 68,7%</span></div><div class="sorot" style="--t:30.1%"><i></i><span>Air tanah · 30,1%</span></div></div></div>
```
**K6 cari**: `.kaca.kc-cari > .kc-cari-kolom (ikon + .kc-cari-teks) + .kc-cari-hasil (.kc-cari-sorot + .kc-cari-baris…)` → `KC.ketik(teks,'siklus air')`, lalu `KC.cariPilih(kotak, i)`.

**K7 notifikasi**:
```html
<div class="kc-notif-tumpuk"><div class="kaca kc-notif" data-masuk="turun" data-ketuk="1">
  <span class="kc-ik" style="--c:#ff4fd8"><i data-ikon="lampu"></i></span>
  <div><em>Miskonsepsi 1</em><b>Awan bukan asap</b><p>Awan adalah titik-titik air hasil kondensasi.</p></div></div></div>
```
**K8 penggeser** (`--g` posisi gagang, mulai 100% lalu `KC.geser(el, 52)`): `.kaca.kc-geser > .kc-geser-sisi + .kc-geser-sisi.kanan + .kc-geser-gagang > .kaca.bulat.kc-geser-tombol`. Tiap sisi maksimal 44% lebar supaya teks tidak tertutup.

**K9 sakelar**: `<div class="kc-baris-sakelar"><span>Pernyataan</span><span class="kc-sakelar" data-jawab="1"></span></div>`; tambahkan kelas `nyala` untuk benar, goyangkan (`KC.jeli`) untuk salah.

**K10 cincin**: `<svg class="kc-cincin" viewBox="0 0 260 260" style="--c:#0369a1"><circle class="jalur" cx="130" cy="130" r="112"/><circle class="isi" cx="130" cy="130" r="112"/></svg>` → `KC.cincin(svg, 97.5)`. Angka di tengah ≤ 52px supaya tidak menabrak garis.

**K11 tombol gelembung**: `<div class="kaca bulat kc-tombol-gel"><i data-ikon="hati"></i></div>` (`.merah` untuk ikon hati).

**K12 lembar bawah**: `<div class="kaca kc-lembar">…</div>` di dalam `.slide` → `KC.lembar(el)`. Sisakan 150px bawah untuk navigasi.

**K13 garis waktu**: `.kaca.kc-waktu-jalur > .kc-waktu-isi + (.kaca.kc-waktu-titik + .kc-waktu-label){n}` dengan `style="left:33.3%"`; isi `--p`/`width` bertahap.

## Aturan

- **Satu komponen utama per slide.** Komponen kedua hanya pendamping kecil (label pil, satu tombol).
- Komponen meminjam bentuk antarmuka, bukan merek: jangan menulis nama aplikasi, logo, atau status bar ponsel tiruan.
- Tidak ada angka karangan: grafik, cincin, odometer, dan pemutar hanya memakai angka dari materi atau dari posisi slide. Sumber data ditulis kecil di bawah kartu.
- Ukuran teks minimum di dalam komponen 18px (label) dan 23px (isi) pada kanvas 1920 — di proyektor kelas ini ukuran terkecil yang masih terbaca dari baris belakang.
