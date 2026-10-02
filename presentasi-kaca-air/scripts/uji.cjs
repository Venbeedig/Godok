/* uji.cjs — uji dek: galat JS, teks meluap, keadaan akhir tiap slide, lembar kontak.
   Pakai: node scripts/uji.cjs <file.html> <folder-keluaran> [lebar tinggi]
   Butuh paket "playwright" (NODE_PATH ke node_modules global bila perlu). */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const [, , file, out = 'uji', lw = '1920', lh = '1080'] = process.argv;
  if (!file) { console.error('pakai: node uji.cjs <file.html> <folder>'); process.exit(2); }
  fs.mkdirSync(out, { recursive: true });
  const url = 'file://' + path.resolve(file);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +lw, height: +lh } });
  const galat = [];
  p.on('pageerror', (e) => galat.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') galat.push('console: ' + m.text()); });
  p.on('requestfailed', (r) => galat.push('request gagal: ' + r.url()));
  p.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) galat.push('aset eksternal: ' + r.url()); });

  await p.goto(url + '?instan&tingkat=penuh');
  await p.waitForFunction(() => window.KC && KC.siap);
  await p.evaluate(() => document.fonts.ready);
  const total = await p.evaluate(() => KC.total);
  const masalah = [];
  for (let i = 0; i < total; i++) {
    await p.evaluate((n) => KC.lihat(n), i);
    await p.waitForTimeout(250);
    const cek = await p.evaluate(() => {
      const s = document.querySelector('.slide.tampil');
      const hasil = [];
      s.querySelectorAll('[data-pptx="teks"], [data-pptx="daftar"]').forEach((e) => {
        const r = e.getBoundingClientRect();
        if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).display !== 'inline') hasil.push('meluap-x: ' + e.textContent.trim().slice(0, 50));
        const kaca = e.closest('.kaca');
        if (kaca) {
          const k = kaca.getBoundingClientRect();
          if (r.right > k.right + 1 || r.bottom > k.bottom + 1 || r.left < k.left - 1) hasil.push('keluar kaca: ' + e.textContent.trim().slice(0, 50));
        }
        if (r.right > 1920 || r.bottom > 1080 || r.left < 0 || r.top < 0) hasil.push('keluar kanvas: ' + e.textContent.trim().slice(0, 50));
        if (r.bottom > 965 && !e.closest('.krom')) hasil.push('masuk zona navigasi (y>' + Math.round(r.bottom) + '): ' + e.textContent.trim().slice(0, 40));
      });
      const tersembunyi = [...s.querySelectorAll('.kc-tunggu')].length;
      if (tersembunyi) hasil.push('masih tersembunyi: ' + tersembunyi + ' elemen');
      return hasil;
    });
    cek.forEach((m) => masalah.push('slide ' + (i + 1) + ': ' + m));
    await p.screenshot({ path: path.join(out, 's' + String(i + 1).padStart(2, '0') + '.png') });
  }

  // lembar kontak
  const gambar = fs.readdirSync(out).filter((f) => /^s\d+\.png$/.test(f)).sort();
  const html = '<html><body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(4,480px);gap:8px;padding:8px">' +
    gambar.map((g, i) => '<div style="position:relative"><img style="width:480px;height:270px;display:block" src="file://' + path.resolve(out, g) + '"><b style="position:absolute;left:6px;top:4px;color:#fff;font:700 18px sans-serif;text-shadow:0 1px 3px #000">' + (i + 1) + '</b></div>').join('') + '</body></html>';
  fs.writeFileSync(path.join(out, 'lembar.html'), html);
  const p2 = await b.newPage({ viewport: { width: 4 * 488 + 8, height: Math.ceil(gambar.length / 4) * 278 + 8 } });
  await p2.goto('file://' + path.resolve(out, 'lembar.html'));
  await p2.waitForTimeout(300);
  await p2.screenshot({ path: path.join(out, 'lembar.jpg'), type: 'jpeg', quality: 85, fullPage: true });

  console.log('slide:', total);
  console.log(galat.length ? 'GALAT:\n  ' + galat.join('\n  ') : 'galat JS: tidak ada');
  console.log(masalah.length ? 'MASALAH:\n  ' + masalah.join('\n  ') : 'tata letak: aman');
  await b.close();
  process.exit(galat.length || masalah.length ? 1 : 0);
})();
