/* uji_navigasi.cjs — uji ketahanan navigasi: tekan cepat, maju-mundur, tiap tingkat efek, reduced-motion. */
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const [, , file, out = '.kerja/nav'] = process.argv;
  require('fs').mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const gagal = [];
  const cekKeadaan = async (p, label, harap) => {
    const s = await p.evaluate(() => ({
      idx: KC.indeks, tampil: document.querySelectorAll('.slide.tampil').length,
      tunggu: document.querySelectorAll('.slide.tampil .kc-tunggu').length,
      fx: document.querySelector('.kc-fx').children.length,
      klip: [...document.querySelectorAll('.slide')].filter((x) => x.style.clipPath).length,
      tak: [...document.querySelectorAll('.slide.tampil [data-pptx]')].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99 && !e.closest('.kc-tunggu')).length
    }));
    const ok = s.idx === harap && s.tampil === 1 && s.tunggu === 0 && s.fx === 0 && s.klip === 0 && s.tak === 0;
    if (!ok) gagal.push(label + ' ' + JSON.stringify(s));
    return s;
  };
  for (const [tingkat, rm, vw, vh] of [['penuh', false, 1920, 1080], ['sedang', false, 1366, 768], ['hemat', false, 1366, 768], ['penuh', true, 1280, 800]]) {
    const ctx = await b.newContext({ viewport: { width: vw, height: vh }, reducedMotion: rm ? 'reduce' : 'no-preference' });
    const p = await ctx.newPage();
    const galat = []; p.on('pageerror', (e) => galat.push(e.message));
    await p.goto('file://' + path.resolve(file) + '?tingkat=' + tingkat);
    await p.waitForFunction(() => window.KC && KC.siap);
    await p.waitForTimeout(1500);
    for (let i = 0; i < 12; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(120); }
    await p.waitForTimeout(4500);
    await cekKeadaan(p, `[${tingkat}${rm ? ',rm' : ''}] cepat-maju`, 12);
    for (let i = 0; i < 5; i++) { await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(60); }
    await p.waitForTimeout(4500);
    await cekKeadaan(p, `[${tingkat}${rm ? ',rm' : ''}] cepat-mundur`, 7);
    // satu per satu sampai akhir, lalu tombol Ulangi
    for (let n = 8; n <= 12; n++) {
      await p.click('.kc-nav .maju');
      await p.waitForTimeout(rm ? 1500 : tingkat === 'hemat' ? 2600 : 4200);
      await cekKeadaan(p, `[${tingkat}${rm ? ',rm' : ''}] maju ke ${n + 1}`, n);
    }
    await p.screenshot({ path: path.join(out, `akhir-${tingkat}${rm ? '-rm' : ''}-${vw}.jpg`), type: 'jpeg', quality: 80 });
    await p.click('.kc-nav .maju'); // Ulangi
    await p.waitForTimeout(rm || tingkat === 'hemat' ? 2500 : 6500);
    await cekKeadaan(p, `[${tingkat}${rm ? ',rm' : ''}] ulangi`, 0);
    await p.screenshot({ path: path.join(out, `sampul-${tingkat}${rm ? '-rm' : ''}-${vw}.jpg`), type: 'jpeg', quality: 80 });
    if (galat.length) gagal.push(`[${tingkat}] galat JS: ` + galat.join(' | '));
    await ctx.close();
  }
  console.log(gagal.length ? 'GAGAL:\n  ' + gagal.join('\n  ') : 'navigasi: semua lolos');
  await b.close();
  process.exit(gagal.length ? 1 : 0);
})();
