---
name: mawar-kaca-berlapis
description: "Logo kampus (mis. Universitas Terbuka) di tengah mawar kaca cair berlapis: lima lapis kelopak kaca bening yang membiaskan latar, mekar lapis demi lapis dengan butir embun dan riak air, lalu logo muncul di tatakan kaca. 3 varian kelopak × 5 palet × 3 cara mekar, mode pojok yang menemani tiap slide, plus skrip untuk mengambil logo dari file LO dan merender mawar jadi PNG transparan untuk .pptx/PDF. Dipanggil oleh dirigen-ppt-mawar-kaca dan ppt-referensi-mawar; pakai juga saat LO minta logo dengan mawar, bunga kaca, logo mekar, atau efek mawar berlapis."
---

# Mawar Kaca Berlapis

Mawar ini dibangun dari 35 kelopak kaca sungguhan (`backdrop-filter`), bukan gambar: warna latar holografik/aurora di belakangnya ikut terbias di tiap kelopak. Logo **tidak pernah digambar ulang**; yang dipakai hanya file logo dari LO.

| File | Isi |
|---|---|
| `assets/kc-mawar.js` | `KC.mawar.buat(host, opsi)`, adegan `mawar-sampul` & `mawar-penutup`, `KC.mawar.pojok(dek)` |
| `assets/kc-mawar.css` | kelopak kaca, kilau air, varian holo/tetes, tatakan logo, napas pelan, mode pojok, tingkat efek |
| `scripts/ambil_logo.py` | ambil logo dari `.html` (mis. galeri-logo-mekar-pastel.html), `.pptx`, atau gambar |
| `scripts/render_png.py` | mawar + logo → PNG 1800×1800 transparan; latar holo/pagi → JPG 1920×1080 |

Butuh `kc-material.css`, `kc-inti.js`, `kc-latar*.{css,js}` dari paket kaca cair dan `bank-latar-holo-pagi`.

## Anatomi

```
.mw-panggung (900×900, pusat 450,450)
 ├─ 5 lapis kelopak, dalam → luar: 5 · 6 · 7 · 8 · 9 kelopak (spiral, sedikit tak beraturan seperti mawar asli)
 │    tiap kelopak: kaca blur 9px saturate 185%, gradien pangkal tua → ujung muda, kilau air mengalir (::before)
 ├─ butir embun di kelopak + cincin riak saat mekar
 └─ .kaca.bulat.mw-tatakan (240px) → .mw-logo = var(--logo); tanpa --logo tampil inisial (data-inisial)
```

## Pilihan

| Kode | Varian kelopak (`data-varian`) | Rasa |
|---|---|---|
| M1 | `embun` (bawaan) | kaca susu bening, kilau air, butir embun |
| M2 | `holo` | kilau pelangi berputar pelan di tiap kelopak — serasi dengan latar holografik |
| M3 | `tetes` | paling bening, bibir kelopak terang, tetes air di ujung, riak di akhir |

| Palet (`data-palet`) | Warna |
|---|---|
| `sakura` (bawaan) | merah muda pucat → peach |
| `merah` | mawar merah tegas |
| `lilac` | ungu lilac lembut |
| `bening` | putih bening tanpa warna (paling "kaca") |
| `aurora` | ikut `--kc-aksen` / `--kc-aksen-2` latar slide |

| Cara mekar (`data-mekar`) | Urutan |
|---|---|
| `tengah` (bawaan sampul) | lapis dalam mekar dulu lalu ke luar; logo muncul terakhir |
| `logo-dulu` | logo tampil di tatakan, lalu mawar mekar di belakangnya |
| `serpih` (bawaan penutup) | serpih kaca terbang dari segala arah lalu menyusun mawar |

## Cara pakai di dek HTML

```html
<main class="dek" data-mawar-pojok="ya" …>
  <section class="slide" data-tipe="sampul" data-latar="holo-klasik" data-adegan="mawar-sampul">
    <div class="isi">
      <div class="mw-panggung sampul-mawar" data-varian="embun" data-palet="sakura" data-mekar="tengah" data-inisial="UT"></div>
      <div class="sampul-teks">…judul…</div>
    </div>
  </section>
  …
  <section class="slide" data-tipe="penutup" data-latar="holo-senja" data-adegan="mawar-penutup">
    <div class="isi"><div class="mw-panggung penutup-mawar" data-varian="holo" data-mekar="serpih" data-inisial="UT"></div>…</div>
  </section>
```

- Logo: `rakit_mawar.py --logo logo.png` menyematkan `:root{--logo:url("data:…")}`. Tanpa logo, tatakan berisi inisial dan dek tetap jadi.
- **Pojok:** `data-mawar-pojok="ya"` di dek → di tiap slide tanpa panggung mawar, mawar mini + logo menetap di pojok kiri atas dan bernapas pelan. Saat pertama muncul ia "terbang" mengecil dari tengah. Label krom bergeser otomatis.
- Dari JS: `const m = KC.mawar.buat(host, {varian, palet, mekar, inisial}); await m.mainkan(); m.diam();`
- Satu mawar besar per slide. Jangan menaruh `filter` atau `opacity` pada induk `.mw-panggung` — itu mematikan kaca kelopak (backdrop root).
- Mode cetak/instan dan `prefers-reduced-motion`: mawar langsung tampil mekar penuh.

## Logo dari file LO

```bash
python3 scripts/ambil_logo.py galeri-logo-mekar-pastel.html kerja/logo     # → kerja/logo.png (+ ukuran & warna dominan)
python3 scripts/ambil_logo.py referensi.pptx kerja/logo --nomor 2           # pilih gambar ke-2 dari daftar ppt/media
```

Bila skrip memperingatkan logo tidak transparan (kotak putih), tetap pakai; tatakan kaca putih membuatnya menyatu. Bila tidak ada logo sama sekali, minta LO mengunggah PNG logonya. **Jangan menggambar logo sendiri.**

## Gambar diam (.pptx / PDF)

```bash
python3 scripts/render_png.py --aset kerja/kc --mawar kerja/mawar.png --logo kerja/logo.png --varian embun --palet sakura
python3 scripts/render_png.py --aset kerja/kc --latar holo-klasik,pagi-fajar,holo-senja --folder kerja/latar
```

Mawar dirender mekar penuh, latar transparan (`--latar-mawar <id>` untuk ikut membiaskan latar). Latar dirender JPG mutu 90 agar .pptx ringan (`--format png` bila perlu).
