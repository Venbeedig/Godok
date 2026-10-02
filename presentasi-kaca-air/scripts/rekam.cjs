/* rekam.cjs — potret beberapa bingkai di tengah transisi (untuk memeriksa gerak).
   Pakai: node scripts/rekam.cjs <file.html> <folder> <dari> <ke> <jumlah-bingkai> <jeda-ms> [lambat] [tingkat] */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const [, , file, out, dari, ke, n = '6', jeda = '400', lambat = '4', tingkat = 'penuh'] = process.argv;
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const galat = []; p.on('pageerror', (e) => galat.push(e.message));
  await p.goto('file://' + path.resolve(file) + '?tingkat=' + tingkat + '&lambat=' + lambat + '&s=' + dari);
  await p.waitForFunction(() => window.KC && KC.siap);
  if (+dari === +ke) { // rekam adegan pembuka
    await p.evaluate(() => KC.putarPembuka());
  } else {
    await p.waitForTimeout(+dari === 1 ? 5200 * +lambat : 400 * +lambat);
    await p.evaluate((k) => { KC.ke(k - 1); }, +ke);
  }
  for (let i = 0; i < +n; i++) {
    await p.waitForTimeout(+jeda);
    await p.screenshot({ path: path.join(out, `f${dari}-${ke}-${i}.jpg`), type: 'jpeg', quality: 80 });
  }
  console.log(galat.length ? 'GALAT ' + galat.join(' | ') : 'ok');
  await b.close();
})();
