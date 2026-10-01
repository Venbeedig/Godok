---
name: efek-lensa-pembias
description: "Efek lensa kaca pembias untuk PPT HTML gaya Liquid Glass: gelembung kaca yang lewat di atas judul dan memperbesar/membelokkan huruf di belakangnya (seperti 'Fluid.' di video Apple), dengan 10 resep siap pakai: lintas-titik, titik-mekar, sapu-pil, baca-kata, ikuti-penunjuk, lensa kembar menyatu, prisma, balik warna, tetes jadi lensa, dan cincin pembias tepi. Gerak memakai pegas fisika dan melar sesuai kecepatan. Dipanggil oleh dirigen-ppt-kaca-cair; pakai juga kapan pun minta efek kaca pembesar, kaca cembung, atau magnifier di teks slide."
---

# Efek Lensa Pembias

| File | Isi |
|---|---|
| `assets/kc-lensa.css` | `.kc-lensa`, `.kc-lensa-isi`, `.prisma`, `.balik`, `.lensa-panggung` |
| `assets/kc-lensa.js` | `KC.lensa(panggung, opsi)` + `KC.resepLensa.L1 … L10` |

Butuh `kc-inti.js` dan `kc-material.css` (`material-kaca-cair`).

## Cara kerjanya (supaya tidak ditulis ulang dengan cara yang salah)

`backdrop-filter` tidak bisa memperbesar. Maka lensa memakai **klon**:

1. Semua isi `.lensa-panggung` diklon ke dalam lensa (`.kc-lensa-klon`, ukuran sama dengan panggung).
2. Lensa adalah `.kaca` bulat berposisi `translate(x−w/2, y−h/2)`.
3. Klon diberi `translate(w/2 − z·x, h/2 − z·y) scale(z)` dengan origin `0 0` — titik di bawah pusat lensa tetap di pusat, sekelilingnya membesar `z` kali. Rumus ini sudah diuji; jangan diganti `transform-origin` yang berubah tiap frame.
4. Lensa diberi tint `--kc-kaca-padat` 66% + blur 30px, sehingga huruf asli di bawahnya tersamar dan yang terlihat hanya huruf klon yang tajam dan besar — seperti di video.
5. Posisi, ukuran, zoom, dan opacity digerakkan **satu pegas** (`KC.pegas`). Saat bergerak, lensa melar searah kecepatan (`rotate(θ) scale(1+t, 1/(1+t)) rotate(−θ)`), maksimal 42%, lalu kembali bulat saat diam.

Klon itu statis. Kalau teks di bawah lensa berubah (kata berguling), ubah **keduanya**:
```js
await KC.gulirKata([judul, L.kembar(judul)], 'Mengembun.');
```

## API

```js
const L = KC.lensa(panggung, { w:220, h:220, zoom:1.38, x:0, y:0, o:1, prisma:false, balik:false, kaku:120, redam:16 });
await L.ke({ x:600, y:90 });          // bergerak dengan pegas (Promise selesai saat diam)
L.ke({ w:300, h:150, z:1.5, o:1 });   // ubah ukuran / zoom / opacity
L.loncat({ x:0 });  L.kembar(el);  L.segarkan();  L.hapus();
```
Koordinat dalam piksel kanvas 1920×1080, relatif ke kiri-atas panggung. `x,y` = **pusat** lensa.

Markup panggung:
```html
<div class="lensa-panggung"><h1 class="t-raksasa">Siklus Air<span class="titik-akhir">.</span></h1></div>
```
Tandai sasaran berhenti dengan `.titik-akhir` atau `.lensa-sasaran`; untuk L4 bungkus tiap kata dengan `.kata`.

## 10 resep — `await KC.resepLensa.Lx(panggung, c, opsi)`

| Kode | Nama | Gerak | Pakai untuk |
|---|---|---|---|
| **L1** | lintas-titik | masuk dari kiri, melintas sambil melar jadi pil, berhenti bulat di `.titik-akhir` — **adegan video** | judul sampul, judul bagian |
| **L2** | titik-mekar | tanda titik di akhir kata membesar jadi lensa di tempatnya (pegas goyang) | pernyataan satu kata ("Cair.") |
| **L3** | sapu-pil | pil tinggi menyapu sebaris dari kiri ke kanan lalu memudar (`{tinggal:true}` = berhenti di ujung) | membuka kalimat kunci |
| **L4** | baca-kata | lensa melompat kata demi kata tiap `opsi.ketuk` ketukan, lebarnya menyesuaikan kata | definisi, kalimat kutipan, daftar nama |
| **L5** | ikuti | lensa mengikuti penunjuk/sentuhan (interaktif) | tanya jawab, slide jeda |
| **L6** | kembar | dua lensa datang dari kiri dan kanan, bertemu, melebur jadi satu pil | "dua konsep jadi satu", sintesis |
| **L7** | prisma | seperti L1, tepi huruf di dalam lensa berpendar merah-biru (aberasi kromatik) | istilah asing, sains, teknologi |
| **L8** | balik | lensa turun ke kata kunci dan membalik warnanya | kesalahan umum, kata yang ditekankan |
| **L9** | tetes | tetes kaca lonjong jatuh ke sasaran, gepeng, lalu membulat jadi lensa | tema air, sebab-akibat |
| **L10** | cincin | tanpa perbesaran; hanya pembiasan tepi SVG (tingkat penuh + Chromium), di browser lain tampil sebagai kaca bulat biasa | judul minimalis, foto/ikon |

`c` adalah konteks adegan dari mesin (`c.aktif()` → berhenti bila slide sudah ditinggal). Semua resep mengembalikan objek lensa sehingga bisa dilanjutkan: `const L = await KC.resepLensa.L1(pg, c); await L.ke({o:0});`.

Contoh adegan sampul (dipasang lewat `data-adegan="sampul"`):
```js
KC.adegan.sampul = async (s, c) => {
  await KC.tunggu(KC.ms(1)); if (!c.aktif()) return;
  await KC.resepLensa.L1(s.querySelector('.lensa-panggung'), c);
};
```

## Takaran

| Ukuran judul | Diameter lensa | Zoom |
|---|---|---|
| `.t-raksasa` 176px | 130–170px saat diam, pil 230×150 saat melintas | 1,35–1,5 |
| `.t-judul` 88px | 90–120px | 1,25–1,35 |
| baris nama / teks 40px | lebar kata × zoom + 40px | 1,15–1,22 |

## Aturan

- **Satu lensa per slide** (L6 dihitung satu). Dua lensa yang bergerak bersamaan membuat mata tidak tahu harus membaca apa.
- Lensa harus **berhenti** sebelum presenter mulai bicara: total gerak ≤ 3 ketukan sejak slide masuk. L5 pengecualian karena digerakkan presenter.
- Lensa tidak boleh menutupi huruf yang belum terbaca saat diam. Tempat berhenti terbaik: tanda titik, huruf terakhir, atau kata kunci.
- Jangan pasang lensa di nama anggota kecuali varian I5 yang memang membacakan nama satu per satu, dan pastikan di keadaan akhir nama terbaca utuh.
- Tingkat `hemat`: lensa tetap muncul tetapi tanpa blur (isian padat); gerak tetap pegas. Reduced-motion: `KC.kurangGerak` membuat pegas lensa langsung melompat ke posisi akhir — tidak perlu kode tambahan.
