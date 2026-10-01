---
name: latar-kaca-cair
description: "Bank 24 latar hidup untuk PPT kaca cair, murni CSS/SVG tanpa file gambar, dalam empat keluarga: aurora pastel (seperti video Liquid Glass), malam/neon, alam & air (kaustik kolam, ombak, hujan di jendela, gelembung sabun, kabut, awan), dan abstrak/mesh (pelangi, lampu lava, holografik, risograf, kisi, bokeh). Lengkap dengan token warna teks per latar, preset kaca yang cocok, sinkron fase antar-slide, dan ganti latar di tengah slide. Dipanggil oleh dirigen-ppt-kaca-cair; pakai juga saat butuh latar bergerak yang lembut untuk slide atau halaman HTML."
---

# Latar Kaca Cair

Kaca hanya seindah apa yang ada di belakangnya. Skill ini menyediakan 24 latar yang **dibangun oleh JS dari konfigurasi** (bukan 24 blok CSS terpisah), sehingga tiap latar sekaligus membawa warna teks, aksen, dan preset kaca yang cocok.

| File | Isi |
|---|---|
| `assets/kc-latar.css` | gaya semua jenis lapisan (gumpal, pita, ombak, tekstur, butir, bintang, tetes, hujan, gelembung, bokeh, kisi, matahari, lava, holo) |
| `assets/kc-latar.js` | `KC.latar.daftar` (24 konfigurasi), `KC.latar.pasang(el,id)`, `KC.latar.token(id)`, `.kaca(id)`, `.mode(id)`, `.keluarga(k)` |

Butuh `kc-filter.html` dari `material-kaca-cair` (filter `kc-goo-warna` untuk lampu lava).

## Katalog 24 latar

### A. Aurora pastel — terang, kaca `susu`
| id | Nama | Warna & gerak | Rasa |
|---|---|---|---|
| `aurora-lavender` | Aurora Lavender | lavender–biru langit, dua pita cahaya mengalir — **persis video** | netral, modern |
| `aurora-pagi` | Aurora Pagi | peach, mentega, biru muda | hangat, optimis |
| `aurora-senja` | Aurora Senja | koral, magenta muda, ungu, periwinkle | puitis, emosional |
| `aurora-mint` | Aurora Mint | mint, aqua, lilac, hijau limau | segar, sains, kesehatan |
| `aurora-susu` | Aurora Susu | krem, blush, sage — paling tenang, butir kertas | lembut, karakter, BK |
| `aurora-es` | Aurora Es | putih es, sian pucat (kaca `bening`) | bersih, data, matematika |

### B. Malam / neon — gelap, kaca `asap` atau `es`
| id | Nama | Warna & gerak | Rasa |
|---|---|---|---|
| `neon-kota` | Neon Kota | magenta & sian di biru tua + bokeh lampu | teknologi, media |
| `neon-ungu` | Nebula Ungu | nebula ungu-magenta + bintang | IPA tata surya, imajinasi |
| `neon-sian` | Sian Laut Malam | sian & teal + kaustik redup | laut, maritim, tenang |
| `neon-hujan` | Hujan Neon | garis hujan miring di atas cahaya kota | cuaca, dramatis |
| `neon-grid` | Grid Synthwave | matahari bergaris + lantai kisi bergerak maju | retro, "wow", kreativitas |
| `neon-galaksi` | Galaksi | 260 bintang berkedip + nebula tipis | refleksi, filsafat, penutup |

### C. Alam & air
| id | Nama | Mode / kaca | Gerak |
|---|---|---|---|
| `air-kaustik` | Kolam Kaustik | terang / `bening` | dua jaring kaustik bergeser berlawanan arah |
| `air-ombak` | Ombak Pagi | terang / `susu` | tiga lapis ombak di bawah, kecepatan berbeda |
| `air-hujan-jendela` | Hujan di Jendela | gelap / `asap` | 90 tetes di kaca, 14% meluncur, bokeh kota |
| `air-gelembung` | Gelembung Sabun | terang / `bening` | 18 gelembung pelangi naik bergoyang |
| `air-embun` | Kabut Embun | terang / `embun` | dua lapis kabut turbulensi melayang |
| `air-awan` | Langit Awan | terang / `susu` | awan turbulensi hanyut |

### D. Abstrak & mesh
| id | Nama | Mode / kaca | Gerak |
|---|---|---|---|
| `mesh-pelangi` | Mesh Pelangi | terang / `susu` | lima gumpal warna jenuh melayang |
| `mesh-lava` | Lampu Lava | gelap / `asap` | gumpal oranye–merah muda naik-turun dan melebur (goo), opacity 62% supaya teks tetap terbaca |
| `mesh-holo` | Holografik | terang / `bening` | kerucut warna pelangi pastel berputar 50 detik |
| `mesh-grain` | Risograf Grain | terang / `susu` | gumpal pastel + butir kasar seperti cetak riso |
| `mesh-kisi` | Kisi Pastel | terang / `susu` | lantai kisi perspektif ungu muda bergerak maju |
| `mesh-bokeh` | Bokeh Malam | gelap / `asap` | 34 lingkaran bokeh besar warna-warni |

## Cara pakai

```html
<main class="dek" data-latar="aurora-lavender">       <!-- latar bawaan dek -->
  <section class="slide" data-latar="neon-kota">…</section>   <!-- slide ini beda -->
```
Mesin membangun latar **hanya saat slide tampil** (`KC.latar.pasang` ke `<div>` pertama di slide) dan membuangnya saat slide ditinggal — jadi 20 slide dengan 20 latar tidak memberatkan.

**Sinkron fase.** Tiap latar diberi `--lt-fase = −(waktu sejak dibuka)` sebagai jeda animasi negatif. Dua slide berurutan dengan latar sama tampak *satu* latar yang terus mengalir, walaupun transisinya membuka slide baru lewat lingkaran atau tirai.

**Ganti latar di tengah slide** (penanda pindah bagian, atau slide "suasana berganti"):
```js
KC.gantiLatar(slide, 'air-awan');   // memudar silang 900ms, warna teks ikut beralih halus
```
Saat slide ditinggal, latar & token kembali ke `data-latar` aslinya.

## Pola memilih latar untuk satu dek

1. **Satu keluarga, satu dek** (paling aman): semua slide `aurora-*`, variasi warna per bagian.
2. **Keluarga per bagian**: pembuka aurora → materi air/alam → data mesh terang → penutup neon. Ganti keluarga hanya di slide pembatas bagian.
3. **Gelap–terang bergantian** hanya bila transisinya menutupi layar penuh (`panel`, `tirai`, `kubus`, `lorong`) — kalau tidak, mata silau.
4. Slide `pustaka` dan `identitas`: pakai latar paling tenang di dek (aurora-susu, aurora-es, air-embun).
5. Presentasi lewat proyektor kampus: hindari `aurora-susu` dan `aurora-es` (terlalu pucat, tenggelam di proyektor redup) kecuali kaca diberi preset `embun`.

## Menambah latar baru

Tambahkan entri di `D` pada `kc-latar.js`:
```js
'nama-baru':{nama:'Nama Tampil',kel:'aurora',mode:'terang',kaca:'susu',aksen:'#hex',aksen2:'#hex',
  teks:'#hex (opsional)', bayang:'r,g,b (opsional)',
  dasar:'linear-gradient(…)',
  gumpal:[[x%, y%, lebar, tinggi, '#warna', opacity], …],      // 2–5 gumpal
  lapis:[['pita',{y,a,t,c,o,d}], ['butir',{o}], …]}           // jenis: pita ombak tekstur butir bintang tetes hujan gel bokeh kisi matahari lava holo
```
Semua posisi acak memakai **PRNG berbiji dari id latar** — tampilan sama setiap file dibuka. Jangan memakai `Math.random()`.

## Aturan

- Maksimal **dua** lapisan yang terus bergerak menonjol (gumpal tidak dihitung — geraknya 22–40 detik dan nyaris tak terasa).
- Latar tidak boleh membuat teks di atas kaca < 7:1. Uji dengan memotret slide pada detik ke-0 dan ke-20 (gumpal sudah berpindah).
- Di tingkat `sedang` semua animasi latar 2× lebih lambat; di `hemat` dan reduced-motion latar diam.
- Galeri 24 latar sekaligus dalam satu slide **terlalu berat** (24 lapis blur besar). Untuk memperlihatkan pilihan latar ke kelompok, pakai halaman `katalog-latar.html` di repo, bukan slide.
