---
name: identitas-kelompok-kaca
description: "Slide identitas kelompok untuk PPT kuliah gaya kaca cair (Liquid Glass): nama kelompok, mata kuliah, dosen, dan kartu kaca tiap anggota (inisial, nama, NIM) dengan enam varian masuk — pulau dinamis mekar lalu anggota turun sebagai notifikasi, gumpal susu pecah jadi ubin anggota, gelembung meletup, tumpukan notifikasi, lensa membaca nama satu per satu, dan tab anggota yang menggulirkan nama & NIM. Lengkap dengan aturan susunan menurut jumlah anggota dan aturan ejaan nama/NIM. Dipanggil oleh dirigen-ppt-kaca-cair."
---

# Identitas Kelompok Kaca

Slide yang paling sering dilihat dosen dan paling sering salah ketik. Animasinya boleh cair, **ejaannya tidak boleh**.

| File | Isi |
|---|---|
| `assets/kc-identitas.css` | `.grid-anggota`, `.kartu-anggota`, `.inisial`, `.tumpuk`, `.daftar-formal`, kartu besar tab |
| `assets/kc-identitas.js` | `KC.adegan['identitas-pulau' · 'identitas-ubin' · 'identitas-gelembung' · 'identitas-notif' · 'identitas-lensa' · 'identitas-tab']` |

Memakai `KC.pulau`, `KC.notif`, `KC.tab` (komponen), `KC.gumpalJadi`, `KC.gelembungPop` (morph), `KC.resepLensa.L4` (lensa), `KC.gulirKata` (teks).

## Kartu anggota (dipakai I1–I4)

```html
<div class="kaca kartu-anggota"><span class="inisial">AS</span><b>Ayu Safitri</b><small>NIM 044123456</small></div>
```
Inisial = huruf depan dua kata pertama nama, huruf besar. Foto anggota boleh menggantikan inisial **hanya** kalau LO mengirim fotonya: `<span class="inisial" style="background:url(data:…) center/cover"></span>`.

## Enam varian

| Kode | `data-adegan` | Susunan | Gerak | Rasa |
|---|---|---|---|---|
| **I1** | `identitas-pulau` | pulau dinamis di atas (nama kelompok + matkul + dosen), kartu bertumpuk di bawahnya | pulau mekar → kartu turun satu per ¾ ketukan | modern, seperti iPhone |
| **I2** | `identitas-ubin` | judul di atas, kartu dalam kisi | satu gumpal susu pecah jadi kartu-kartu (M4) — **bawaan** | khas video (Control Center) |
| **I3** | `identitas-gelembung` | judul di atas, kartu dalam kisi | tiap kartu lahir sebagai gelembung yang meletup (M9) | ceria, kelas rendah |
| **I4** | `identitas-notif` | judul di atas, kartu bertumpuk | kartu turun seperti notifikasi | rapi, cepat |
| **I5** | `identitas-lensa` | daftar formal rata tengah (nama besar, NIM kecil) | lensa singgah di tiap nama (L4) | formal, aman untuk dosen ketat |
| **I6** | `identitas-tab` | kartu besar nama+NIM di tengah, tab inisial di bawah | indikator pindah tiap 2 ketukan; nama & NIM berguling (T1) | cocok saat anggota bergantian memperkenalkan diri |

### Templat I1
```html
<section class="slide" data-tipe="identitas" data-label="Anggota" data-trans="tetes" data-adegan="identitas-pulau">
  <div class="kc-pulau id-pulau"><div class="kc-pulau-isi"><span class="id-pulau-ikon"><i data-ikon="kelompok"></i></span>
    <div><b>Kelompok 5</b><small>Pembelajaran IPA SD · ⟨Nama dosen⟩</small></div></div></div>
  <div class="isi"><div class="grid-anggota tumpuk id-tumpuk-pulau"> …kartu-anggota… </div></div>
</section>
```
### Templat I2 / I3 / I4
```html
<div class="isi tl-atas">
  <div class="kepala"><span class="t-label" data-masuk="pudar">Disusun oleh</span><h2 class="t-judul" data-masuk="naik">Kelompok 5</h2></div>
  <div class="badan"><div class="grid-anggota"> …kartu-anggota… </div></div>   <!-- I4: class="grid-anggota tumpuk" -->
</div>
```
### Templat I5
```html
<div class="badan"><div class="lensa-panggung daftar-formal">
  <div class="baris"><b class="kata">Ayu Safitri</b><small>NIM 044123456</small></div> …
</div></div>
```
### Templat I6
```html
<div class="isi tl-tengah"><div class="id-panggung">
  <span class="t-label" data-masuk="pudar">Kelompok 5 · Pembelajaran IPA SD</span>
  <div class="kaca id-kartu-besar" data-masuk="mekar"><span class="id-nama">Ayu Safitri</span><span class="id-nim">NIM 044123456</span></div>
  <div class="kaca kc-tab inisial" data-masuk="naik" data-ketuk="1"><div class="kaca kc-tab-ind"></div>
    <div class="kc-tab-i" data-nama="Ayu Safitri" data-nim="NIM 044123456">AS</div> …
  </div></div></div>
```
Kartu besar berisi anggota **pertama**; atribut `data-nama`/`data-nim` tiap tab berisi anggotanya sendiri.

## Susunan menurut jumlah anggota

| Jumlah | I2/I3 (kisi, kartu 440px) | I1/I4 (tumpuk, kartu 880px) | I5 | I6 |
|---|---|---|---|---|
| 1–3 | satu baris | tumpuk | daftar | tab |
| 4–6 | dua baris (3+3 / 3+2), flex-wrap rata tengah | 4 muat; 5–6 → kartu tinggi 96px | daftar | tab |
| 7–9 | tiga baris, kartu 400px, nama 28px | **jangan** — pakai I2 | daftar dua kolom | tab inisial 100px |
| 10+ | pecah dua slide "Anggota (1/2)" | — | pecah | pecah |

## Aturan ejaan (wajib)

- Salin nama **huruf per huruf** dari kiriman LO, lalu baca ulang. Huruf kapital di awal tiap kata, bukan huruf besar semua. Tanpa gelar.
- NIM persis seperti dikirim, tanpa titik/spasi, diawali "NIM ".
- Urutan anggota = urutan kiriman LO; bila tidak ada, urut NIM terkecil.
- Data belum ada → `⟨ISI SENDIRI: Nama Anggota 1⟩` dan `⟨ISI SENDIRI: NIM⟩`. Jangan mengarang nama.
- Nama dan NIM **tidak** diberi efek teks (kecuali T1 di I6 yang berakhir pada teks asli). Lensa I5 harus berhenti di nama terakhir dengan nama tetap terbaca.
- Untuk 5 anggota, semua kartu sudah tampil dalam ≤ 3 detik (I2, I3, I4) atau ≤ 4,5 detik (I1). I5 dan I6 sengaja berjalan pelan karena mengiringi perkenalan; di I5 semua nama sudah terbaca sejak awal, di I6 pakai hanya bila tiap anggota memang memperkenalkan diri bergiliran.
- Latar slide identitas: yang paling tenang di dek; kaca `susu` atau `embun`.
