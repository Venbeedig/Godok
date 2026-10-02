/* ekspor.cjs — siapkan bahan PDF & PPTX dari dek HTML (keadaan akhir tiap slide).
   Keluaran di <folder>: penuh/sNN.jpg (slide utuh, untuk PDF), latar/sNN.jpg (latar saja),
   gambar/sNN-kK.png (elemen gambar, latar transparan), tata.json (posisi teks & kaca).
   Pakai: node scripts/ekspor.cjs <file.html> <folder> */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const [, , file, out = 'ekspor'] = process.argv;
  for (const sub of ['penuh', 'latar', 'gambar']) fs.mkdirSync(path.join(out, sub), { recursive: true });
  const url = 'file://' + path.resolve(file) + '?instan&tingkat=penuh';
  const b = await chromium.launch();
  const buka = async (dsf) => {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: dsf });
    await p.goto(url);
    await p.waitForFunction(() => window.KC && KC.siap);
    await p.evaluate(() => document.fonts.ready);
    return p;
  };
  const p1 = await buka(1), p2 = await buka(2);
  const total = await p1.evaluate(() => KC.total);
  const tata = { lebar: 1920, tinggi: 1080, slides: [] };

  for (let i = 0; i < total; i++) {
    const nn = String(i + 1).padStart(2, '0');
    for (const p of [p1, p2]) { await p.evaluate((n) => KC.lihat(n), i); await p.waitForTimeout(200); }
    await p1.screenshot({ path: path.join(out, 'penuh', `s${nn}.jpg`), type: 'jpeg', quality: 92 });
    await p1.evaluate(() => document.documentElement.classList.add('tanpa-isi'));
    await p1.waitForTimeout(80);
    await p1.screenshot({ path: path.join(out, 'latar', `s${nn}.jpg`), type: 'jpeg', quality: 90 });
    await p1.evaluate(() => document.documentElement.classList.remove('tanpa-isi'));

    const data = await p1.evaluate(() => {
      const s = document.querySelector('.slide.tampil');
      const hex = (c) => { const m = c.match(/\d+(\.\d+)?/g) || [0, 0, 0]; return m.slice(0, 3).map((v) => (+v).toString(16).padStart(2, '0')).join('').toUpperCase(); };
      const css = getComputedStyle(s);
      const palet = {}; ['--c1', '--c2', '--c3', '--tinta', '--aksen', '--bayang'].forEach((k) => { palet[k.slice(2)] = css.getPropertyValue(k).trim(); });
      const kotak = (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
      const lari = (root) => {
        const par = [[]];
        const jalan = (node) => node.childNodes.forEach((ch) => {
          if (ch.nodeType === 3) {
            const cs = getComputedStyle(ch.parentElement);
            let t = ch.textContent.replace(/\s+/g, ' ');
            if (cs.textTransform === 'uppercase') t = t.toUpperCase();
            if (t.trim() || (t === ' ' && par[par.length - 1].length)) par[par.length - 1].push({ t, ukuran: parseFloat(cs.fontSize), tebal: parseInt(cs.fontWeight, 10), warna: hex(cs.color), miring: cs.fontStyle === 'italic', spasi: parseFloat(cs.letterSpacing) || 0 });
          } else if (ch.nodeName === 'BR') par[par.length - 1].push({ t: '\n' });
          else if (ch.nodeType === 1) jalan(ch);
        });
        jalan(root);
        par.forEach((p) => { if (p.length) { p[0].t = p[0].t.replace(/^\s+/, ''); p[p.length - 1].t = p[p.length - 1].t.replace(/\s+$/, ''); } });
        return par;
      };
      const items = [];
      s.querySelectorAll('[data-pptx]').forEach((e, k) => {
        const jenis = e.dataset.pptx, cs = getComputedStyle(e), b = kotak(e);
        const it = { k, jenis, nama: e.dataset.nama || '', ...b };
        if (jenis === 'kaca') {
          it.radius = parseFloat(cs.borderTopLeftRadius) || 0;
          it.varian = e.classList.contains('susu') ? 'susu' : e.classList.contains('warna') ? 'warna' : 'biasa';
        } else if (jenis === 'teks' || jenis === 'daftar') {
          it.rata = cs.textAlign === 'center' ? 'tengah' : cs.textAlign === 'right' || cs.textAlign === 'end' ? 'kanan' : 'kiri';
          it.tengahV = /flex|grid/.test(cs.display) && cs.alignItems === 'center';
          it.pad = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(parseFloat);
          it.tinggiBaris = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3;
          it.pil = e.classList.contains('pil');
          if (it.pil) it.radius = parseFloat(cs.borderTopLeftRadius) || b.h / 2;
          if (jenis === 'daftar') {
            it.butir = [...e.children].map((li) => {
              const lc = getComputedStyle(li);
              return { par: lari(li)[0], jarak: parseFloat(lc.marginBottom) || 0, tinggiBaris: parseFloat(lc.lineHeight) || 40, indent: parseFloat(lc.paddingLeft) || 0, gantung: parseFloat(lc.textIndent) || 0 };
            });
            it.peluru = e.classList.contains('daftar');
          } else it.par = lari(e);
        }
        items.push(it);
      });
      return { palet, bagian: s.dataset.bagian || '', items };
    });

    // potret elemen gambar dengan latar transparan (resolusi 2x)
    for (const it of data.items.filter((x) => x.jenis === 'gambar')) {
      const f = `s${nn}-k${it.k}.png`;
      const h = await p2.evaluateHandle((k) => {
        document.documentElement.classList.add('solo');
        const e = document.querySelector('.slide.tampil').querySelectorAll('[data-pptx]')[k];
        e.classList.add('solo-target');
        return e;
      }, it.k);
      await p2.waitForTimeout(60);
      await h.asElement().screenshot({ path: path.join(out, 'gambar', f), omitBackground: true });
      await p2.evaluate((e) => { e.classList.remove('solo-target'); document.documentElement.classList.remove('solo'); }, h);
      it.file = 'gambar/' + f;
    }
    tata.slides.push({ latar: `latar/s${nn}.jpg`, penuh: `penuh/s${nn}.jpg`, ...data });
    process.stdout.write(`slide ${i + 1}/${total}\r`);
  }
  fs.writeFileSync(path.join(out, 'tata.json'), JSON.stringify(tata, null, 1));
  console.log(`\nselesai: ${total} slide → ${out}`);
  await b.close();
})();
