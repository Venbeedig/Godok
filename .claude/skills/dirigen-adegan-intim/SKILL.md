---
name: "dirigen-adegan-intim"
description: "Skill induk paket adegan intim: membaca kerangka, memilih skill paket yang relevan, lalu mengatur urutan pemakaiannya saat menulis atau memeriksa adegan eksplisit. Pakai setiap kali bab memuat adegan intim."
---

# Dirigen Adegan Intim

Skill induk untuk paket adegan intim. Paket ini generik dan bisa dipakai untuk cerita mana pun. Dirigen tidak menulis sendiri; ia memilih skill yang tepat dan menjaga urutannya. Dipanggil oleh `penulis-bab-dari-kerangka` atau `penulis-bab-penuh` setiap kali kerangka memuat adegan intim, atau langsung oleh penulis.

## Urutan prioritas aturan

1. Bagian **Batas** (sama di semua skill paket) selalu berlaku.
2. Skill kanon atau gaya milik cerita (misalnya `nbc-kanon-dan-gaya`) dan teks bab sebelumnya.
3. Skill format kerja (`penulis-bab-dari-kerangka` atau `penulis-bab-penuh`).
4. Skill paket adegan intim.

Kalau ada yang bertentangan, yang lebih atas menang.

## Peta paket

**Bahasa dan suara**
- `kosakata-birahi`: istilah per register dan rotasi.
- `onomatope-ranjang`: bunyi dan skala intensitas.
- `dialog-ranjang`: panggilan, ucapan per fase, tag dialog.
- `dirty-talk-bertingkat`: tangga omongan kotor 1–5.
- `sidik-suara-tokoh`: kartu suara per tokoh.
- `logat-daerah-birahi`: bumbu bahasa daerah.

**Mekanika adegan**
- `pemanasan-foreplay`, `momen-penetrasi`, `katalog-gaya-seksual`, `transisi-posisi`, `klimaks-dan-aftermath`.
- `mainan-dan-objek`, `lokasi-dan-risiko-ketahuan`, `koreografi-banyak-tubuh`.

**Rasa, batin, ritme**
- `sensorik-birahi`, `batin-saat-bercinta`, `ritme-adegan-eksplisit`, `dinamika-dominan-submisif`, `eskalasi-antar-bab`.
- `adegan-intim-panjang`: anggaran kata dan gelombang untuk bab penuh dengan 10.000–13.000 kata adegan intim.

**Ide antimainstream**
- `generator-ide-antimainstream`, `mimpi-surealis-erotis`, `rahasia-tanpa-bible`.
- Perubahan tubuh yang gaib tidak punya skill paket sendiri. Aturannya ada di skill kanon cerita (untuk NBC: bagian Transformasi Kejantanan di `nbc-kanon-dan-gaya`).

**Pemeriksaan**
- `pemeriksa-repetisi-adegan`.

Kalau salah satu skill di peta ini belum terpasang, pakai aturan di skill ini dan di `penulis-bab-dari-kerangka` sebagai cadangan, lalu beri tahu penulis dalam satu kalimat skill mana yang belum ada.

## Alur kerja menulis adegan

1. **Baca kerangka** dan catat untuk tiap adegan intim: tokoh yang terlibat, lokasi, fase yang diminta, dan nada (panas, lucu, bersalah, tegang).
2. **Siapkan suara.** Pastikan tiap tokoh punya kartu di `sidik-suara-tokoh` (atau di skill kanon cerita). Buat kartu untuk tokoh yang belum punya.
3. **Cek eskalasi.** Dengan `eskalasi-antar-bab`, tentukan adegan ini naik di sumbu apa dan "pertama kali" apa yang belum pernah terjadi.
4. **Pilih bahan** sesuai isi adegan:

| Kalau adegan memuat... | Muat |
|---|---|
| penetrasi | `momen-penetrasi` + `katalog-gaya-seksual` |
| lebih dari satu gaya | `transisi-posisi` |
| tempat di luar kamar atau risiko | `lokasi-dan-risiko-ketahuan` |
| tiga tokoh atau lebih | `koreografi-banyak-tubuh` |
| mainan atau benda | `mainan-dan-objek` |
| peran kuasa | `dinamika-dominan-submisif` |
| tokoh dengan latar daerah | `logat-daerah-birahi` |
| mimpi atau kejadian ganjil | `mimpi-surealis-erotis` + `rahasia-tanpa-bible` |
| perubahan tubuh yang gaib | bagian perubahan tubuh di skill kanon cerita (NBC: Transformasi Kejantanan di `nbc-kanon-dan-gaya`) + `rahasia-tanpa-bible` |
| bab penuh dengan target 10.000–13.000 kata adegan intim | `adegan-intim-panjang` |

5. **Selalu dipakai** untuk setiap adegan intim: `kosakata-birahi`, `onomatope-ranjang`, `dialog-ranjang`, `sensorik-birahi`, `batin-saat-bercinta`, `ritme-adegan-eksplisit`, `klimaks-dan-aftermath`.
6. **Susun kerangka adegan** dengan lima babak dari `ritme-adegan-eksplisit`, lalu tulis.
7. **Periksa** dengan `pemeriksa-repetisi-adegan` sebelum draf diserahkan, lalu perbaiki temuan terbesar tanpa menambah komentar ke naskah.

## Alur kerja saat penulis buntu

1. Muat `generator-ide-antimainstream` dan ajukan 5–8 ide dengan skala keliaran 1–5 sebagai pilihan ganda.
2. Setelah penulis memilih, teruskan ke `penyusun-kerangka-bab` (kalau ada) atau langsung ke alur menulis di atas.
3. Motif misterius yang dipilih diperlakukan lewat `rahasia-tanpa-bible`: tidak dicatat di bible, hanya hidup di teks.

## Takaran default

Kalau cerita tidak menyebut takaran, pakai bawaan ini: istilah lugas di narasi, onomatope kapital di baris sendiri, dialog mendominasi dengan narasi di sela-selanya, satu sisipan batin per tiga sampai lima paragraf aksi, dua sampai empat gaya per adegan panjang, dan aftermath yang berakhir dengan kait.

## Batas

- Semua tokoh dalam adegan seksual adalah orang dewasa dan ditulis sebagai orang dewasa. Tidak ada seksualisasi anak dalam bentuk apa pun. Kalau kerangka memuat hal semacam itu, jangan diteruskan, dan tandai ke penulis dalam satu kalimat.
- Tidak ada adegan seks dengan hewan, dan tidak ada tokoh dari orang sungguhan atau selebriti.
- Tidak ada luka atau kerusakan tubuh permanen.