---
name: teks-gulir-cair
description: "Efek teks bergaya Liquid Glass untuk PPT HTML: 10 resep — kata berguling huruf demi huruf dengan jejak gerak (seperti Fluid/Fast/Alive di video), angka odometer, teks mengembun dari kabut, ombak huruf, ketik di kolom kaca, huruf menetes, sapuan lensa, acak lalu mengendap, kilau sekali lewat, dan judul yang mengalir ke slide berikutnya. Semua berakhir pada teks asli yang bisa dipilih. Dipanggil oleh dirigen-ppt-kaca-cair; pakai juga saat minta animasi teks kinetik, rolling text, slot text, atau counter angka di slide."
---

# Teks Gulir Cair

| File | Isi |
|---|---|
| `assets/kc-teks.css` | `.kc-gulir`, `.kc-kol`, odometer, caret ketik, `.kc-h`, `.kc-kilau` |
| `assets/kc-teks.js` | `KC.gulirKata`, `KC.odometer`, `KC.ketik`, `KC.pecahHuruf`, `KC.ombakHuruf`, `KC.tetesHuruf`, `KC.embun`, `KC.acak`, `KC.kilau` |

Butuh `kc-inti.js`.

## T1 — kata berguling (inti video)

Di video, "Fluid." berganti jadi "Fast." lalu "Alive." dengan cara: tiap huruf berguling vertikal **sendiri-sendiri** (jeda 30ms per huruf), meninggalkan jejak gerak bertumpuk, terpotong garis atas-bawah baris.

```js
await KC.gulirKata(el, 'Mengembun.');                 // arah 1 = naik
await KC.gulirKata(el, 'NIM 0000000004', { arah: -1 }); // turun
await KC.gulirKata([judul, L.kembar(judul)], 'Turun.');  // judul + kembarannya di dalam lensa
```
Cara kerja yang sudah diuji: tiap posisi huruf jadi kolom `.kc-kol` berisi huruf lama dan huruf baru; kolom berganti lebar dari lebar huruf lama ke baru (pegas lembut), isinya bergeser −100% dengan kurva pegas, dan pada 30% perjalanan `text-shadow` tiga lapis (40%, 24%, 12% `currentColor`) memberi jejak gerak. Setelah selesai, elemen kembali berisi teks polos.

Tanpa JS tambahan, cukup atribut:
```html
<h2 class="t-raksasa" data-efek="gulir" data-kata="Menguap.|Mengembun.|Turun.|Mengalir.">Menguap.</h2>
```
Mesin menggulirkan kata berikutnya tiap 2 ketukan dan berhenti di kata terakhir.

## 10 resep teks

| Kode | Atribut / fungsi | Efek | Pakai untuk |
|---|---|---|---|
| **T1** | `data-efek="gulir"` · `KC.gulirKata` | huruf berguling dengan jejak gerak | kata kunci berganti, slogan, nama anggota (I6) |
| **T2** | `data-efek="odometer" data-nilai="97.5"` · `KC.odometer` | digit berputar per kolom, format `id-ID` (97,5 · 56.333) | angka data **asli** |
| **T3** | `data-efek="embun"` · `KC.embun` | mengembun dari blur 22px + spasi lebar | kutipan, kalimat reflektif |
| **T4** | `data-efek="ombak"` · `KC.ombakHuruf` | huruf naik bergelombang, memanjang lalu memantul | judul bagian, tanya jawab |
| **T5** | `data-efek="ketik" data-teks="…"` · `KC.ketik` | diketik dengan caret aksen berkedip | kolom cari, pertanyaan pemantik |
| **T6** | `data-efek="tetes"` · `KC.tetesHuruf` | tiap huruf jatuh, gepeng saat mendarat | tema air, judul kuis |
| **T7** | lensa L3 di `efek-lensa-pembias` | pil kaca menyapu sebaris | membuka kalimat penting |
| **T8** | transisi `alir` di `transisi-kaca-cair` | judul slide lama berpindah tempat sambil berguling jadi judul slide baru | lanjutan topik, hipotesis → hasil |
| **T9** | `data-efek="acak"` · `KC.acak` | karakter acak (░▒▓ <> = +) lalu mengendap kiri ke kanan (PRNG berbiji) | "fakta mengejutkan", teknologi |
| **T10** | `data-efek="kilau"` · `KC.kilau` | sorotan cahaya menyapu huruf sekali | visi, kesimpulan, kata penting |

Semua atribut bisa diberi `data-ketuk="1.5"` (mulai 1,5 ketukan setelah slide masuk).

## Takaran waktu (120 BPM)

| Efek | Lama | Jeda antar-huruf |
|---|---|---|
| T1 | 760ms per huruf | 30ms |
| T2 | 1,4 dtk + 60ms per digit | — |
| T3 | 1,3 dtk | — |
| T4 | 900ms | 32ms |
| T5 | 55ms per huruf (+40ms di spasi) | — |
| T6 | 900ms | 55ms |
| T9 | 900ms | — |
| T10 | 1,3 dtk | — |

## Aturan

- **Satu efek teks per slide**, di satu elemen (judul atau angka). Isi poin, nama, NIM, dan rujukan tidak diberi efek kecuali varian identitas yang memang dirancang begitu.
- Teks akhir harus **persis** teks yang dimaksud — T1 dan T9 berakhir pada teks polos; cek di keadaan akhir (PDF memotret keadaan akhir).
- T2 hanya untuk angka dari materi. Tidak boleh angka hiasan.
- T1 memotong vertikal baris (`clip-path`) — beri jarak baris ≥ 0,95 dan jangan pakai di teks multi-baris.
- Pecah huruf (T4/T6) memberi `aria-label` berisi teks utuh supaya pembaca layar tetap membaca kata, bukan huruf.
- Reduced-motion & mode PDF: semua langsung tampil penuh.
