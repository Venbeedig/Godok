---
name: nama-tombol-kaca
description: "12 efek yang membentuk nama anggota kelompok menjadi tombol kaca pil (nama + NIM di dalamnya): burung kaca terbang, tetes air memercik, kupu-kupu, ikan koi, kelopak mawar gugur, gelembung, bintang jatuh, ubur-ubur, pesawat kertas, riak air, kristal es mencair, dan kunang-kunang. Pembawa kaca terbang ke tempat tiap kartu lalu kaca tombol terbentuk dari titik itu. Dipanggil oleh dirigen-ppt-mawar-kaca untuk slide anggota; pakai juga saat LO minta nama anggota muncul dengan efek, tombol nama, atau slide perkenalan kelompok yang hidup."
---

# Nama Jadi Tombol Kaca

Slide anggota meniru slide 2 referensi: tiap nama + NIM duduk di tombol kaca berbentuk pil. Bedanya, tombol tidak sekadar muncul; **sesuatu terbang membawanya** lalu kaca tombol mengembang dari titik pendaratan, baru nama dan NIM menyusul.

| File | Isi |
|---|---|
| `assets/kc-nama.js` | `KC.namaTombol(slide, efek)`, `KC.efekNama` (daftar), adegan `nama-tombol` dan `nama-<efek>` |
| `assets/kc-nama.css` | pembawa (kepak sayap, ekor, denyut), percik, cincin riak, kilat, kunang; kartu tersembunyi sebelum terbentuk |

Butuh `kc-inti.js` + `kc-komponen.css` (kartu `.kartu-anggota`). Bentuk pembawa SVG kaca inline, warnanya mengikuti `--kc-aksen` dan `--kc-aksen-2` latar slide. Posisi asal memakai PRNG berbiji, jadi gerak sama setiap diputar.

## Bank 12 efek

| Kode | `data-efek-nama` | Pembawa & lintasan | Tombol terbentuk dengan | Rasa |
|---|---|---|---|---|
| N1 | `burung` (bawaan) | burung kaca dari kiri, melengkung dan mengepak, menghadap arah terbang | mekar | anggun, paling mirip referensi |
| N2 | `tetes` | tetes air jatuh lurus dari atas | percik + cincin | segar, cepat |
| N3 | `kupu` | kupu-kupu dari bawah kiri/kanan, berkelok | mekar | lembut |
| N4 | `ikan` | ikan koi kaca berenang dari kanan, ekor mengibas | riak | tenang, air |
| N5 | `kelopak` | kelopak mawar gugur berputar dari atas | mekar | serasi dengan mawar logo |
| N6 | `gelembung` | gelembung sabun naik dari bawah | letup + cincin | ceria |
| N7 | `bintang` | bintang jatuh dengan ekor cahaya dari kanan atas | kilat | dramatis, cepat |
| N8 | `ubur` | ubur-ubur naik berdenyut dari bawah | mekar | unik, laut |
| N9 | `pesawat` | pesawat kertas kaca melayang berputar dari kiri | buka | sekolah, ringan |
| N10 | `riak` | tanpa pembawa: riak merambat dari tengah slide | muncul saat riak sampai | minimal, formal |
| N11 | `kristal` | kristal es berputar dari luar layar | leleh | sains, dingin |
| N12 | `kunang` | kawanan 7 kunang-kunang mengelilingi tiap kartu | menyala | malam, hangat |

Jeda antar anggota 240 ms (170 ms bila > 6 anggota). Seluruh slide selesai ±3–4 detik untuk 5–6 anggota.

## Markup

```html
<section class="slide" data-tipe="identitas" data-latar="holo-opal" data-adegan="nama-tombol" data-efek-nama="burung">
  <div class="isi tl-atas">
    <div class="kepala"><span class="t-label">Anggota kelompok</span><h2 class="t-judul">Kami berlima</h2></div>
    <div class="badan"><div class="grid-anggota" data-nt>
      <div class="kaca kartu-anggota"><span class="inisial">AS</span><b>Ayu Safitri</b><small>NIM 0123456789</small></div>
      …
    </div></div>
  </div>
</section>
```

- `data-nt` di `.grid-anggota` menyembunyikan kartu sampai pembawanya tiba. Tanpa `data-nt` kartu terlihat sejak awal (efek tetap jalan, tapi kurang rapi).
- Gaya pil (radius penuh, lebar 480 px, nama 29 px, NIM kecil di bawah nama) ada di `kc-tata-mawar.css` milik `dirigen-ppt-mawar-kaca`.
- Efek lain tanpa ganti adegan: `data-adegan="nama-kupu"`, `nama-ikan`, dst.
- Dari JS: `await KC.namaTombol(slide, 'kelopak')`.
- **Nama & NIM disalin huruf per huruf** dari kiriman LO. Jangan beri efek teks lain (gulir huruf, dsb.) pada nama dan NIM.
- 3–4 anggota: satu baris. 5–6: dua baris (3 + 2/3). 7–9: tiga kolom; pertimbangkan N10 atau N2 yang lebih ringkas.
- Mode cetak, instan, dan `prefers-reduced-motion`: kartu langsung tampil lengkap.

## Memilih efek

- Bawaan: **N1 burung**. Bila LO memilih "acak", pilih satu dengan PRNG dari judul dek (bukan `Math.random()`) dan tulis kodenya di baris KOMBINASI.
- Serasi dengan latar: holografik → N1, N3, N6, N7; aurora pagi → N2, N4, N5, N9; latar gelap → N12, N7.
- Formal/dosen tegas → N10 atau N2. Anak/PGSD → N6, N9, N3.
