---
name: bank-latar-holo-pagi
description: "Bank 24 latar hidup tambahan untuk dek kaca cair dalam dua keluarga: 12 Holografik (kilau pelangi stiker hologram, foil, prisma, opal, mutiara, kristal, cakram, sabun, krom) dan 12 Aurora Pagi (fajar, mentari, embun, langit, sakura, lavender, pantai, gunung berkabut, cahaya jendela, madu, pelangi). Murni CSS/SVG, gerak pelan, lengkap dengan warna teks, aksen, dan preset kaca per latar. Dipanggil oleh dirigen-ppt-mawar-kaca; pakai juga setiap kali LO minta latar holografik, hologram, iridescent, aurora pagi, pagi hari, atau pastel pagi."
---

# Bank Latar Holografik & Aurora Pagi

Perluasan `latar-kaca-cair`. Latar baru didaftarkan ke `KC.latar.daftar` yang sama, jadi dipakai persis seperti latar lama: `data-latar="holo-foil"` di `<main class="dek">` atau di `<section class="slide">`. Mesin otomatis memasang warna teks, aksen, dan preset kaca yang cocok.

| File | Isi |
|---|---|
| `assets/kc-latar-hp.js` | 24 konfigurasi + 18 jenis lapisan baru; dimuat **sesudah** `kc-latar.js`. Membungkus `KC.latar.pasang` agar lapisan `ekstra` ikut dibangun. `KC.latarHP.holo` / `.pagi` = daftar id per keluarga |
| `assets/kc-latar-hp.css` | gaya lapisan `hp-*` (kerucut, foil, kilap, berkas, opal, faset, cakram, marmer, krom, mentari, sinar, kelopak, gunung, kabut, cahaya, debu, pelangi) |

Butuh `kc-material.css`, `kc-latar.css`, `kc-inti.js`, `kc-latar.js` dari paket kaca cair. Tanpa `Math.random()`: sebaran memakai PRNG berbiji dari id latar, jadi latar yang sama selalu tampil sama.

## A. Holografik — kilau pelangi, kaca bening

| id | Nama | Lapisan & gerak | Kaca | Cocok untuk |
|---|---|---|---|---|
| `holo-klasik` | Holo Klasik | kerucut pelangi pastel berputar 50 dtk + kilap menyapu | bening | **sampul** (bawaan) |
| `holo-foil` | Foil Hologram | pita foil miring bergeser seperti stiker dimiringkan | bening | slide pernyataan |
| `holo-prisma` | Berkas Prisma | 6 berkas cahaya warna-warni dari pojok, berdenyut | bening | konsep, definisi |
| `holo-opal` | Opal Susu | 26 serpih warna lembut di dasar susu (kabur 64px) | susu | slide anggota |
| `holo-mutiara` | Mutiara | dua pita kilau mutiara + kilap | susu | slide kelompok |
| `holo-kristal` | Kristal Faset | faset segitiga berkilau seperti batu potong | bening | geometri, sains |
| `holo-cakram` | Cakram Pelangi | pantulan CD/cakram + kerucut pelan | bening | teknologi |
| `holo-sabun` | Lapisan Sabun | marmer pelangi lapisan sabun + gelembung | bening | ringan, anak |
| `holo-krom` | Krom Cair | krom perak mengalir + kerucut tipis | es | data, formal |
| `holo-senja` | Holo Senja | kerucut + foil hangat jingga–merah muda | susu | **penutup** (bawaan) |
| `holo-malam` | Holo Malam | kerucut & foil di langit gelap berbintang (**gelap**, teks putih) | asap | pernyataan dramatis |
| `holo-mint` | Holo Mint | kerucut mint–lilac + kilap | bening | kesehatan, IPA |

## B. Aurora Pagi — cahaya pagi pastel, kaca susu/embun

| id | Nama | Lapisan & gerak | Kaca | Cocok untuk |
|---|---|---|---|---|
| `pagi-fajar` | Fajar | matahari terbit pucat + pita aurora tipis | susu | agenda, pembuka bagian |
| `pagi-mentari` | Sinar Mentari | sinar matahari berputar lambat dari pojok | susu | poin, banding |
| `pagi-embun` | Embun Pagi | tekstur + debu cahaya melayang | embun | pernyataan, kutipan |
| `pagi-langit` | Langit Pagi | langit biru muda + dua pita aurora | susu | definisi (bawaan dek) |
| `pagi-sakura` | Sakura Pagi | kelopak sakura gugur pelan | susu | BK, sastra, perasaan |
| `pagi-jeruk` | Jeruk Pagi | pita jingga + kilap | susu | hangat, semangat |
| `pagi-lavender` | Ladang Lavender | siluet bukit ungu berlapis | susu | daftar unsur |
| `pagi-pantai` | Pantai Pagi | matahari + tiga lapis ombak | susu | IPS, geografi |
| `pagi-gunung` | Gunung Berkabut | gunung berlapis + kabut + matahari | embun | proses, tahapan |
| `pagi-jendela` | Cahaya Jendela | berkas cahaya jendela + debu melayang | susu | praktik di kelas |
| `pagi-madu` | Madu Pagi | serpih opal hangat keemasan | susu | rumus, kisi |
| `pagi-pelangi` | Pelangi Pagi | busur pelangi tipis | susu | kesimpulan |

## Pola pakai dalam dek

- **Bawaan (disarankan):** pembuka (sampul, kelompok, anggota) dan penutup **Holografik**; slide materi **Aurora Pagi**. Contoh urutan: `holo-klasik → holo-mutiara → holo-opal → pagi-fajar → pagi-langit → pagi-lavender → … → holo-senja`.
- Pilihan lain: bergantian per slide (holo–pagi–holo …), satu keluarga untuk satu bagian materi, atau satu latar untuk seluruh dek.
- Jangan pakai latar yang sama dua slide berurutan; bila slide > 12, ulang dari awal daftar dengan urutan berbeda.
- `holo-malam` satu-satunya latar gelap: pakai paling banyak sekali (pernyataan puncak), teks otomatis putih.
- Tingkat efek `hemat` mematikan gerak lapisan; `prefers-reduced-motion` dihormati otomatis.

## Pratinjau & gambar diam

- Katalog semua latar: `python3 alat/katalog.py <folder-aset> katalog-latar-holo-pagi.html holo,pagi` (di repo Godok).
- PNG/JPG 1920×1080 untuk .pptx: `mawar-kaca-berlapis/scripts/render_png.py --aset <aset> --latar holo-klasik,pagi-fajar --folder latar/`.

## Aturan

- Latar tidak memuat teks atau ikon; isi tetap di `.isi`.
- Tidak ada gambar eksternal: semua lapisan CSS, gradien, atau SVG data URI.
- Kontras teks dijaga oleh token tiap latar (`teks`, `teks2`). Jangan menimpa `--kc-teks` per slide kecuali LO meminta.
