/* kc.js — mesin Presentasi Kaca Air
   Navigasi: → / Spasi / PageDown = maju · ← / PageUp = mundur · F = layar penuh
             T = tingkat efek (penuh/sedang/hemat) · R = putar ulang pembuka (di slide 1)
   URL: ?s=5 (mulai di slide 5) · ?instan (tanpa animasi, untuk ekspor) · ?tingkat=hemat */
(function () {
  'use strict';
  var KC = (window.KC = window.KC || {});
  var W = 1920, H = 1080;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- alat dasar ---------- */
  KC.prng = function (seed) {
    var a = seed >>> 0 || 1;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  var E = {
    in3: function (t) { return t * t * t; },
    out3: function (t) { return 1 - Math.pow(1 - t, 3); },
    io2: function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; },
    io3: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    outBack: function (t) { var c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  };
  KC.E = E;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var seg = function (t, a, b) { return clamp((t - a) / (b - a), 0, 1); };
  var jauhSudut = function (x, y) { return Math.max(Math.hypot(x, y), Math.hypot(W - x, y), Math.hypot(x, H - y), Math.hypot(W - x, H - y)); };
  var NS = 'http://www.w3.org/2000/svg';

  var q = new URLSearchParams(location.search);
  var root = document.documentElement;
  KC.instan = q.has('instan');
  KC.rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  KC.ketuk = 500; // 120 BPM
  var LAMBAT = Math.max(1, parseFloat(q.get('lambat') || '1') || 1); // hanya untuk pengujian
  if (KC.instan) root.classList.add('instan');
  if (q.has('tanpa-isi')) root.classList.add('tanpa-isi');

  /* ---------- registri animasi (bisa dilompati) ---------- */
  var aktif = new Set(), tunda = new Set(), lompat = false;
  KC.anim = function (el, kf, o) {
    o = Object.assign({ fill: 'both' }, o);
    if (KC.instan) { o.duration = 0; o.delay = 0; }
    else if (KC.rm) { o.duration = Math.min(o.duration || 0, 160); o.delay = 0; }
    else if (LAMBAT > 1) { o.duration = (o.duration || 0) * LAMBAT; o.delay = (o.delay || 0) * LAMBAT; }
    var a = el.animate(kf, o);
    aktif.add(a);
    a.finished.then(function () { aktif.delete(a); }, function () { aktif.delete(a); });
    if (lompat) { try { a.finish(); } catch (e) { /* abaikan */ } }
    return a;
  };
  KC.jalan = function (dur, fn) {
    return new Promise(function (res) {
      if (KC.instan || dur <= 0) { fn(1); return res(); }
      dur *= LAMBAT;
      var t0 = null;
      function tick(now) {
        if (t0 === null) t0 = now;
        var t = lompat ? 1 : Math.min(1, (now - t0) / dur);
        fn(t);
        if (t < 1) requestAnimationFrame(tick); else res();
      }
      requestAnimationFrame(tick);
    });
  };
  KC.tunggu = function (ms) {
    return new Promise(function (res) {
      if (KC.instan || lompat || ms <= 0) return res();
      ms *= LAMBAT;
      var id;
      var f = function () { clearTimeout(id); tunda.delete(f); res(); };
      id = setTimeout(f, ms);
      tunda.add(f);
    });
  };
  KC.lompati = function () {
    lompat = true;
    aktif.forEach(function (a) { try { a.finish(); } catch (e) { /* abaikan */ } });
    Array.from(tunda).forEach(function (f) { f(); });
  };

  /* ---------- elemen bantu ---------- */
  function svgLapis(parent) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    s.setAttribute('width', W); s.setAttribute('height', H);
    s.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none';
    parent.appendChild(s);
    return s;
  }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  /* cincin riak yang melebar dari (x,y) */
  KC.riak = function (svg, x, y, o) {
    o = Object.assign({ n: 3, maks: 700, dur: 1300, jeda: 160, tunda: 0, tebal: 3 }, o);
    for (var i = 0; i < o.n; i++) {
      var c = el('circle', { cx: x, cy: y, r: 100, 'class': 'cincin-riak', 'vector-effect': 'non-scaling-stroke' }, svg);
      c.style.strokeWidth = o.tebal - i * 0.6;
      c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center';
      var sk = (o.maks * (1 - i * 0.18)) / 100;
      KC.anim(c, [{ transform: 'scale(.02)', opacity: 0.95 }, { transform: 'scale(' + sk + ')', opacity: 0 }],
        { duration: o.dur, delay: o.tunda + i * o.jeda, easing: 'cubic-bezier(.2,.7,.3,1)' })
        .finished.then(function (cc) { return function () { cc.remove(); }; }(c), function () {});
    }
  };
  /* butir/gelembung kaca kecil */
  KC.butir = function (parent, x, y, o) {
    o = Object.assign({ u: 18, dx: 0, dy: -140, dur: 1100, tunda: 0, lengkung: 0 }, o);
    var b = document.createElement('i');
    b.className = 'butir';
    b.style.width = b.style.height = o.u + 'px';
    parent.appendChild(b);
    var x0 = x - o.u / 2, y0 = y - o.u / 2;
    var kf = o.lengkung
      ? [{ transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(.3)', opacity: 0.95 },
         { transform: 'translate(' + (x0 + o.dx * 0.5) + 'px,' + (y0 - o.lengkung) + 'px) scale(1)', opacity: 1, offset: 0.45 },
         { transform: 'translate(' + (x0 + o.dx) + 'px,' + (y0 + o.dy) + 'px) scale(.5)', opacity: 0 }]
      : [{ transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(.4)', opacity: 0 },
         { transform: 'translate(' + (x0 + o.dx * 0.3) + 'px,' + (y0 + o.dy * 0.2) + 'px) scale(1)', opacity: 0.95, offset: 0.2 },
         { transform: 'translate(' + (x0 + o.dx) + 'px,' + (y0 + o.dy) + 'px) scale(.8)', opacity: 0 }];
    KC.anim(b, kf, { duration: o.dur, delay: o.tunda, easing: o.lengkung ? 'cubic-bezier(.3,.6,.6,1)' : 'ease-out' })
      .finished.then(function () { b.remove(); }, function () {});
  };
  /* tepi bukaan kaca: dua garis (lebar samar + tipis terang) */
  function tepiBuka(svg, tag) {
    var g = el('g', {}, svg);
    var a = el(tag, { fill: 'none', stroke: 'rgba(255,255,255,.28)', 'stroke-width': 30 }, g);
    var b = el(tag, { fill: 'none', stroke: 'rgba(255,255,255,.92)', 'stroke-width': 3.5 }, g);
    return { g: g, set: function (k, v) { a.setAttribute(k, v); b.setAttribute(k, v); } };
  }

  /* ---------- palet & kartu ---------- */
  KC.PALET = {
    orchid: [['C349EE', 'Orchid Pulse'], ['8CA7F4', 'Periwinkle Mist'], ['EBF6C9', 'Matcha Cream']],
    laguna: [['5B6CF0', 'Indigo Ripple'], ['5ED3E0', 'Aqua Jelly'], ['E4FBF1', 'Mint Foam']],
    persik: [['F0679F', 'Coral Song'], ['FFAE8B', 'Peach Tide'], ['FFF3D1', 'Vanilla Foam']],
    kacalaut: [['2F9FB8', 'Lagoon Teal'], ['8FDCB5', 'Sea Glass'], ['F3F7D0', 'Sand Pearl']]
  };
  var IKON = [
    '<svg viewBox="0 0 24 24"><path d="M12 21.2l-1.4-1.3C5.4 15.2 2 12.1 2 8.4 2 5.4 4.4 3 7.4 3c1.7 0 3.4.8 4.6 2.1C13.2 3.8 14.9 3 16.6 3 19.6 3 22 5.4 22 8.4c0 3.7-3.4 6.8-8.6 11.5L12 21.2z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M13.5 2L4.5 13.6h6.3L9.9 22l9.6-12.4h-6.6L13.5 2z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 2.4l2.9 6.2 6.7.8-5 4.6 1.4 6.7L12 17.3l-6 3.4 1.4-6.7-5-4.6 6.7-.8z"/></svg>'
  ];
  function bangunKartu(k) {
    var p = KC.PALET[k.dataset.palet] || KC.PALET.orchid;
    var h = '<div class="kp-badan"><span class="kp-label">' + (k.dataset.label || '') + '</span>' +
      '<div class="kp-glif">' + KC.glifHewan(k.dataset.hewan || 'koi') + '</div>' +
      '<div class="kp-judul">' + (k.dataset.judul || '') + '</div></div>';
    p.forEach(function (w, j) {
      h += '<div class="kp-pita p' + (j + 1) + '"><span class="hex">HEX<br>' + w[0] + '</span><span class="nama">' + w[1] + '</span><span class="ikon">' + IKON[j] + '</span></div>';
    });
    k.innerHTML = h;
  }

  /* ---------- latar hidup per slide ---------- */
  function bangunLatar(s, i) {
    var l = document.createElement('div');
    l.className = 'latar';
    l.innerHTML = '<div class="gp gp1"></div><div class="gp gp2"></div><div class="gp gp3"></div><div class="gp gp4"></div><div class="kaustik"></div>';
    var r = KC.prng(1009 + i * 97);
    $$('.gp', l).forEach(function (g) { g.style.animationDelay = (-r() * 20).toFixed(1) + 's'; });
    for (var k = 0; k < 9; k++) {
      var b = document.createElement('i');
      b.className = 'gelembung';
      var u = 10 + r() * 36;
      b.style.cssText = 'width:' + u.toFixed(0) + 'px;height:' + u.toFixed(0) + 'px;left:' + (30 + r() * 1860).toFixed(0) + 'px;' +
        'animation-duration:' + (16 + r() * 16).toFixed(1) + 's;animation-delay:-' + (r() * 30).toFixed(1) + 's;--goyang:' + ((r() - 0.5) * 140).toFixed(0) + 'px';
      l.appendChild(b);
    }
    s.insertBefore(l, s.firstChild);
  }

  /* ---------- mawar kaca berlapis ---------- */
  var LAPIS = [ // luar → dalam
    { n: 10, h: 300, w: 300, rot: 0, dalam: ['var(--c2)', 0.34], luar: ['#fff', 0.5] },
    { n: 8, h: 238, w: 262, rot: 22.5, dalam: ['var(--c1)', 0.3], luar: ['#fff', 0.46] },
    { n: 7, h: 178, w: 216, rot: 9, dalam: ['var(--c1)', 0.44], luar: ['var(--c2)', 0.4] },
    { n: 6, h: 122, w: 172, rot: 30, dalam: ['var(--c1)', 0.62], luar: ['var(--c1)', 0.3] }
  ];
  var DASAR_KELOPAK = 150;
  function jalurKelopak(b, h, w) {
    var y0 = -b, y1 = -(b + h), f = function (v) { return v.toFixed(1); };
    return 'M 0 ' + f(y0) +
      ' C ' + f(-w * 0.52) + ' ' + f(y0 - h * 0.06) + ', ' + f(-w * 0.66) + ' ' + f(y0 - h * 0.62) + ', ' + f(-w * 0.4) + ' ' + f(y0 - h * 0.92) +
      ' C ' + f(-w * 0.24) + ' ' + f(y1 - h * 0.05) + ', ' + f(-w * 0.07) + ' ' + f(y1) + ', 0 ' + f(y1 + h * 0.07) +
      ' C ' + f(w * 0.07) + ' ' + f(y1) + ', ' + f(w * 0.24) + ' ' + f(y1 - h * 0.05) + ', ' + f(w * 0.4) + ' ' + f(y0 - h * 0.92) +
      ' C ' + f(w * 0.66) + ' ' + f(y0 - h * 0.62) + ', ' + f(w * 0.52) + ' ' + f(y0 - h * 0.06) + ', 0 ' + f(y0) + ' Z';
  }
  function bangunMawar(wadah, seed) {
    var r = KC.prng(seed), uid = 'm' + seed;
    var acuan = wadah.firstChild;
    LAPIS.forEach(function (L, li) {
      var s = document.createElementNS(NS, 'svg');
      s.setAttribute('viewBox', '-450 -450 900 900');
      s.setAttribute('class', 'lapis l' + (li + 1));
      var R = DASAR_KELOPAK + L.h;
      var d = '<defs><radialGradient id="' + uid + 'g' + li + '" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="' + R + '">' +
        '<stop offset="' + (DASAR_KELOPAK / R).toFixed(3) + '" style="stop-color:' + L.dalam[0] + ';stop-opacity:' + L.dalam[1] + '"/>' +
        '<stop offset="1" style="stop-color:' + L.luar[0] + ';stop-opacity:' + L.luar[1] + '"/></radialGradient></defs>';
      var jk = jalurKelopak(DASAR_KELOPAK, L.h, L.w);
      var w = L.w, b = DASAR_KELOPAK, h = L.h;
      var urat = 'M ' + (-w * 0.33).toFixed(1) + ' ' + (-b - h * 0.5).toFixed(1) + ' C ' + (-w * 0.38).toFixed(1) + ' ' + (-b - h * 0.7).toFixed(1) + ', ' +
        (-w * 0.3).toFixed(1) + ' ' + (-b - h * 0.84).toFixed(1) + ', ' + (-w * 0.17).toFixed(1) + ' ' + (-b - h * 0.92).toFixed(1);
      for (var i = 0; i < L.n; i++) {
        var a = L.rot + (360 / L.n) * i;
        d += '<g transform="rotate(' + a.toFixed(2) + ')"><g class="kelopak"><path class="isi-k" fill="url(#' + uid + 'g' + li + ')" d="' + jk + '"/>' +
          '<path class="urat" d="' + urat + '"/></g></g>';
      }
      if (li === 0) { // embun di kelopak luar
        for (var e = 0; e < 9; e++) {
          var ang = r() * Math.PI * 2, rr = 290 + r() * 120, u = 4 + r() * 6;
          var cx = (Math.cos(ang) * rr).toFixed(1), cy = (Math.sin(ang) * rr).toFixed(1);
          d += '<circle class="embun" cx="' + cx + '" cy="' + cy + '" r="' + u.toFixed(1) + '" opacity=".75"/>' +
            '<circle cx="' + (cx - u * 0.3).toFixed(1) + '" cy="' + (cy - u * 0.3).toFixed(1) + '" r="' + (u * 0.35).toFixed(1) + '" fill="#fff"/>';
        }
      }
      s.innerHTML = d;
      wadah.insertBefore(s, acuan);
    });
  }
  /* animasi mekar: kelopak dalam dulu, lalu ke luar */
  function mekarkan(wadah, mulai, cepat) {
    var lapis = $$('.lapis', wadah);
    lapis.slice().reverse().forEach(function (s, k) {
      $$('.kelopak', s).forEach(function (kp, j) {
        KC.anim(kp, [{ opacity: 0, transform: 'rotate(-42deg) scale(.12)' }, { opacity: 1, transform: 'none' }],
          { duration: cepat ? 900 : 1150, delay: mulai + k * (cepat ? 120 : 170) + j * (cepat ? 22 : 32), easing: 'cubic-bezier(.2,1.18,.32,1)', fill: 'backwards' });
      });
      $$('.embun', s).forEach(function (eb, j) {
        KC.anim(eb, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 0.75, transform: 'none' }],
          { duration: 500, delay: mulai + 900 + j * 60, easing: 'ease-out', fill: 'backwards' });
      });
    });
    var cakram = $('.cakram', wadah), cincin = $('.cincin-air', wadah), img = $('img', wadah), sapu = $('.sapuan', wadah);
    KC.anim(cakram, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: mulai + 420, easing: 'cubic-bezier(.2,1.25,.32,1)', fill: 'backwards' });
    KC.anim(img, [{ opacity: 0, transform: 'scale(1.15)', filter: 'blur(14px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 900, delay: mulai + 620, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    KC.anim(cincin, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: mulai + 700, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    KC.anim(sapu, [{ transform: 'translateX(-120%)' }, { transform: 'translateX(120%)' }], { duration: 1000, delay: mulai + 1400, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'both' });
  }

  /* ---------- gerak masuk ---------- */
  var GERAK = {
    naik: ['translateY(60px)', 'scale(.98)'], turun: ['translateY(-50px)', ''], kiri: ['translateX(-90px)', ''],
    kanan: ['translateX(90px)', ''], skala: ['scale(.84)', ''], pudar: ['', '']
  };
  KC.masukkan = function (els, offset) {
    els.forEach(function (e) {
      if (e.dataset.masuk === 'adegan') return;
      if (e.dataset.dasar == null) e.dataset.dasar = e.style.transform || '';
      var dasar = e.dataset.dasar, g = GERAK[e.dataset.masuk] || GERAK.naik;
      var kacaBesar = e.classList.contains('kaca') || e.classList.contains('kartu-palet');
      var dari = { opacity: 0, transform: ((g[0] + ' ' + g[1]).trim() + ' ' + dasar).trim() || 'none' };
      var ke = { opacity: 1, transform: dasar || 'none' };
      if (!kacaBesar) { dari.filter = 'blur(8px)'; ke.filter = 'blur(0)'; }
      e.classList.remove('kc-tunggu');
      KC.anim(e, [dari, ke], { duration: 950, delay: (offset || 0) + parseFloat(e.dataset.ketuk || '0') * KC.ketuk, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    });
  };
  function siapkanMasuk(s) {
    $$('[data-masuk]', s).forEach(function (e) {
      e.getAnimations().forEach(function (a) { a.cancel(); });
      e.classList.add('kc-tunggu');
    });
  }

  /* ---------- adegan khusus ---------- */
  KC.adegan = {};
  KC.adegan.pembuka = function (s, ctx) {
    var w = $('.mawar-wadah', s), kartu = $('.kartu-sampul', s), isi = $('.isi', s);
    w.classList.remove('idle', 'kc-tunggu');
    $$('.kelopak, .embun, .cakram, .cakram img, .cincin-air, .sapuan', w).forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); });
    var isiKartu = $$('[data-masuk]', kartu);
    if (!ctx.awal) { // kembali ke sampul: mekar singkat saja
      kartu.classList.remove('kc-tunggu');
      KC.anim(kartu, [{ opacity: 0, transform: 'translateX(120px)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 150, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
      mekarkan(w, 0, true);
      KC.masukkan(isiKartu, 450);
      return KC.tunggu(1800).then(function () { if (ctx.hidup()) w.classList.add('idle'); });
    }
    var T0 = 0, JATUH = 760, MEKAR = 860, GESER = 2650;
    // 1. tetes kaca jatuh
    var tetes = document.createElement('div');
    tetes.className = 'tetes';
    tetes.style.left = '960px'; tetes.style.top = '540px';
    isi.appendChild(tetes);
    KC.anim(tetes, [
      { transform: 'translateY(-760px) scale(.7,1.1)', opacity: 0.2 },
      { transform: 'translateY(-500px) scale(.75,1.15)', opacity: 1, offset: 0.3 },
      { transform: 'translateY(0) scale(.82,1.22)', opacity: 1, offset: 0.62 },
      { transform: 'translateY(4px) scale(1.9,.32)', opacity: 0.9, offset: 0.8 },
      { transform: 'translateY(6px) scale(2.6,.08)', opacity: 0 }
    ], { duration: JATUH + 420, delay: T0, easing: 'cubic-bezier(.5,0,.7,.4)', fill: 'both' }).finished.then(function () { tetes.remove(); }, function () {});
    // 2. riak & percikan saat menyentuh
    var lap = svgLapis(isi);
    KC.riak(lap, 960, 540, { n: 4, maks: 760, dur: 1700, jeda: 170, tunda: JATUH + 40, tebal: 4 });
    var r = KC.prng(77);
    for (var i = 0; i < 12; i++) {
      var a = -Math.PI * (0.1 + 0.8 * r());
      KC.butir(isi, 960, 530, { u: 8 + r() * 16, dx: Math.cos(a) * (120 + r() * 220), dy: 40 + r() * 60, lengkung: 120 + r() * 160, dur: 900 + r() * 400, tunda: JATUH + 20 });
    }
    // 3. mawar mekar + logo
    mekarkan(w, MEKAR, false);
    // 4. mawar bergeser ke kiri, kartu judul masuk
    KC.anim(w, [{ transform: 'translate(360px,0)' }, { transform: 'none' }], { duration: 1300, delay: GESER, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'backwards' });
    kartu.classList.remove('kc-tunggu');
    KC.anim(kartu, [{ opacity: 0, transform: 'translateX(160px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 1200, delay: GESER + 250, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    KC.masukkan(isiKartu, GESER + 550);
    return KC.tunggu(GESER + 1700).then(function () { lap.remove(); if (ctx.hidup()) w.classList.add('idle'); });
  };

  KC.adegan.penutup = function (s, ctx) {
    var w = $('.mawar-wadah', s);
    w.classList.remove('idle', 'kc-tunggu');
    $$('.kelopak, .embun, .cakram, .cakram img, .cincin-air, .sapuan', w).forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); });
    mekarkan(w, 0, true);
    KC.masukkan($$('[data-masuk]', s), 600);
    return KC.tunggu(2200).then(function () { if (ctx.hidup()) w.classList.add('idle'); });
  };

  KC.adegan.identitas = function (s) {
    var isi = $('.isi', s), ubin = $$('.ubin', s);
    KC.masukkan($$('[data-masuk]', s), 0);
    // gumpal kaca di tengah pecah menjadi ubin anggota
    var cx = 960, cy = 600;
    var g = document.createElement('div');
    g.className = 'kaca';
    g.style.cssText = 'left:' + (cx - 170) + 'px;top:' + (cy - 170) + 'px;width:340px;height:340px;border-radius:50%';
    isi.appendChild(g);
    KC.anim(g, [
      { opacity: 0, transform: 'scale(.2)' },
      { opacity: 1, transform: 'scale(1.06,.94)', offset: 0.45 },
      { opacity: 1, transform: 'scale(.95,1.05)', offset: 0.7 },
      { opacity: 0, transform: 'scale(1.5)' }
    ], { duration: 1400, delay: 200, easing: 'ease-in-out', fill: 'both' }).finished.then(function () { g.remove(); }, function () {});
    ubin.forEach(function (u, i) {
      var x = u.offsetLeft + u.offsetWidth / 2, y = u.offsetTop + u.offsetHeight / 2;
      u.classList.remove('kc-tunggu');
      KC.anim(u, [
        { opacity: 0, transform: 'translate(' + (cx - x) + 'px,' + (cy - y) + 'px) scale(.25)', borderRadius: '50%' },
        { opacity: 1, transform: 'translate(' + ((cx - x) * 0.25) + 'px,' + ((cy - y) * 0.25) + 'px) scale(.8)', borderRadius: '90px', offset: 0.35 },
        { opacity: 1, transform: 'none', borderRadius: '40px' }
      ], { duration: 1150, delay: 820 + i * 110, easing: 'cubic-bezier(.2,1.15,.32,1)', fill: 'backwards' });
    });
    return KC.tunggu(2000);
  };

  KC.adegan.proses = function (s) {
    KC.masukkan($$('[data-masuk]', s), 0);
    var isiJalur = $('.isi-jalur', s), simpul = $$('.simpul', s), langkah = $$('.langkah', s);
    var MULAI = 500, DUR = 2200, jalur = $('.jalur', s);
    jalur.classList.remove('kc-tunggu');
    KC.anim(jalur, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 200, fill: 'backwards' });
    KC.anim(isiJalur, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: DUR, delay: MULAI, easing: 'cubic-bezier(.45,0,.3,1)', fill: 'backwards' });
    simpul.forEach(function (n, i) {
      var t = MULAI + (DUR * i) / (simpul.length - 1) * 0.92;
      n.classList.remove('kc-tunggu');
      KC.anim(n, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: t, easing: 'cubic-bezier(.2,1.35,.32,1)', fill: 'backwards' });
      if (langkah[i]) {
        langkah[i].classList.remove('kc-tunggu');
        KC.anim(langkah[i], [{ opacity: 0, transform: 'translateY(70px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: t + 120, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
      }
    });
    return KC.tunggu(MULAI + DUR + 600);
  };

  /* ---------- transisi hewan laut ---------- */
  var T = (KC.transisi = {});

  T.pudar = function (lama, baru, o) {
    var d = KC.rm ? 0 : 40 * o.arah;
    return KC.anim(baru, [{ opacity: 0, transform: 'translateX(' + d + 'px)' }, { opacity: 1, transform: 'none' }],
      { duration: KC.rm ? 160 : 380, easing: 'cubic-bezier(.16,1,.3,1)' }).finished;
  };
  T.pudar.masuk = 80;

  /* riak: lingkaran kaca membuka dari titik klik */
  T.riak = function (lama, baru, o) {
    var p = o.titik || { x: W / 2, y: H / 2 }, R = jauhSudut(p.x, p.y) + 40;
    baru.style.clipPath = 'circle(0px at ' + p.x + 'px ' + p.y + 'px)';
    var tp = tepiBuka(o.svg, 'circle');
    tp.set('cx', p.x); tp.set('cy', p.y);
    KC.riak(o.svg, p.x, p.y, { n: 3, maks: R * 0.8, dur: 1100, jeda: 140 });
    return KC.jalan(1050, function (t) {
      var r = R * E.io3(t);
      baru.style.clipPath = 'circle(' + r.toFixed(1) + 'px at ' + p.x + 'px ' + p.y + 'px)';
      tp.set('r', r.toFixed(1));
      tp.g.style.opacity = 1 - t * t;
    });
  };
  T.riak.masuk = 420;

  /* koi: dua koi kaca berputar spiral ke tengah, kolam baru mekar dari pusaran */
  T.koi = function (lama, baru, o) {
    var besar = o.besar, dur = besar ? 2100 : 1650, cx = W / 2, cy = H / 2 + 10;
    var R = jauhSudut(cx, cy) + 40, dir = o.arah > 0 ? 1 : -1, sk = besar ? 1.25 : 1.02;
    baru.style.clipPath = 'circle(0px at ' + cx + 'px ' + cy + 'px)';
    var ikan = [0, 1].map(function () { var e = KC.buatHewan('koi', { kaca: o.kaca }); o.fx.appendChild(e); return e; });
    var tp = tepiBuka(o.svg, 'circle');
    tp.set('cx', cx); tp.set('cy', cy);
    var riakJalan = false, jejak = 0;
    return KC.jalan(dur, function (t) {
      var u = E.io2(t);
      ikan.forEach(function (e, i) {
        var th = (i ? 0 : Math.PI) + dir * u * Math.PI * 1.7;
        var rho = lerp(1080, 110, u);
        var x = cx + rho * Math.cos(th), y = cy + rho * Math.sin(th) * 0.58;
        var hx = -Math.sin(th) * dir * rho - Math.cos(th) * 970 * 0.35, hy = Math.cos(th) * 0.58 * dir * rho - Math.sin(th) * 0.58 * 970 * 0.35;
        var ang = (Math.atan2(hy, hx) * 180) / Math.PI + Math.sin(t * 38 + i * 2) * 6;
        var s = sk * lerp(1, 0.5, seg(t, 0.62, 1));
        e.style.transform = 'translate(' + (x - 200).toFixed(1) + 'px,' + (y - 86).toFixed(1) + 'px) rotate(' + ang.toFixed(1) + 'deg) scale(' + s.toFixed(3) + ')';
        e.style.opacity = 1 - seg(t, 0.76, 1);
        if (t > jejak && t < 0.8) { // gelembung di ekor
          var rad = (ang * Math.PI) / 180;
          KC.butir(o.fx, x - Math.cos(rad) * 170 * s, y - Math.sin(rad) * 170 * s, { u: 8 + ((i + Math.round(t * 50)) % 4) * 4, dx: ((i ? 1 : -1) * 20), dy: -90, dur: 900 });
        }
      });
      if (t > jejak) jejak = t + 0.05;
      if (!riakJalan && t > 0.3) { riakJalan = true; KC.riak(o.svg, cx, cy, { n: 4, maks: R * 0.75, dur: 1300, jeda: 150 }); }
      var v = seg(t, 0.3, 1), r = R * E.io3(v);
      baru.style.clipPath = 'circle(' + r.toFixed(1) + 'px at ' + cx + 'px ' + cy + 'px)';
      tp.set('r', r.toFixed(1));
      tp.g.style.opacity = v > 0 ? 1 - v * v : 0;
    });
  };
  T.koi.masuk = 950;

  /* ubur-ubur: naik berdenyut, slide baru mengembang dari payungnya */
  T.ubur = function (lama, baru, o) {
    var besar = o.besar, dur = besar ? 2250 : 1750, n = 3;
    var xs = besar ? [W / 2] : [o.urutan % 2 ? W * 0.68 : W * 0.32];
    var kawan = besar ? [{ x: W / 2 - 560, k: 0.5, tunda: 0.1 }, { x: W / 2 + 580, k: 0.42, tunda: 0.18 }] : [{ x: (o.urutan % 2 ? W * 0.3 : W * 0.72), k: 0.4, tunda: 0.12 }];
    var utama = { x: xs[0], k: besar ? 1.05 : 0.86, tunda: 0 };
    var semua = [utama].concat(kawan).map(function (j) {
      var e = KC.buatHewan('ubur', { kaca: o.kaca });
      e.style.transformOrigin = '200px 140px';
      o.fx.appendChild(e);
      j.el = e; return j;
    });
    baru.style.clipPath = 'ellipse(0px 0px at ' + utama.x + 'px ' + (H + 200) + 'px)';
    var tp = tepiBuka(o.svg, 'ellipse');
    var jejak = 0;
    return KC.jalan(dur, function (t) {
      semua.forEach(function (j, idx) {
        var tt = clamp((t - j.tunda) / (1 - j.tunda), 0, 1);
        var u = tt - Math.sin(2 * Math.PI * n * tt) / (2 * Math.PI * n);
        var p = Math.cos(2 * Math.PI * n * tt);
        var y = lerp(H + 360, -560 * (j === utama ? 1 : 0.6), u);
        j.y = y;
        j.el.style.transform = 'translate(' + (j.x - 200).toFixed(1) + 'px,' + (y - 140).toFixed(1) + 'px) scale(' + (j.k * (1 + 0.09 * p)).toFixed(3) + ',' + (j.k * (1 - 0.07 * p)).toFixed(3) + ')';
        KC.gerakTentakel(j.el, tt * 16 + idx, 1 + 0.12 * p);
        if (idx === 0 && t > jejak && y < H + 100 && y > 0) {
          KC.butir(o.fx, j.x + ((Math.round(t * 100) % 5) - 2) * 50, y + 120, { u: 10 + (Math.round(t * 100) % 3) * 6, dy: -120, dx: 0, dur: 1000 });
          jejak = t + 0.06;
        }
      });
      var v = seg(t, 0.12, 1), cyb = utama.y + 20;
      var r = jauhSudut(utama.x, clamp(cyb, -800, H + 800)) * E.io2(v) * (1 + 0.035 * Math.cos(2 * Math.PI * n * t)) + (v > 0 ? 60 * v : 0);
      var rx = r, ry = r * 1.08;
      baru.style.clipPath = 'ellipse(' + rx.toFixed(1) + 'px ' + ry.toFixed(1) + 'px at ' + utama.x.toFixed(1) + 'px ' + cyb.toFixed(1) + 'px)';
      tp.set('cx', utama.x.toFixed(1)); tp.set('cy', cyb.toFixed(1)); tp.set('rx', rx.toFixed(1)); tp.set('ry', ry.toFixed(1));
      tp.g.style.opacity = v > 0 ? 1 - v * v : 0;
    });
  };
  T.ubur.masuk = 1000;

  /* paus: paus kaca berenang melintas, slide baru tersingkap di belakangnya dengan tepi bergelombang */
  T.paus = function (lama, baru, o) {
    var dir = o.arah > 0 ? 1 : -1, besar = o.besar, k = besar ? 1.22 : 0.96, dur = besar ? 2300 : 1850;
    var e = KC.buatHewan('paus', { kaca: o.kaca });
    e.style.transformOrigin = '500px 225px';
    o.fx.appendChild(e);
    var garis = el('polyline', { fill: 'none', stroke: 'rgba(255,255,255,.9)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, o.svg);
    var lebar = el('polyline', { fill: 'none', stroke: 'rgba(255,255,255,.25)', 'stroke-width': 34, 'stroke-linejoin': 'round' }, o.svg);
    o.svg.insertBefore(lebar, garis);
    baru.style.clipPath = dir > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
    var yc = besar ? 500 : 540, sembur = false, jejak = 0;
    return KC.jalan(dur, function (t) {
      var u = lerp(E.io2(t), t, 0.35);
      var cxw = dir > 0 ? lerp(-620 * k, W + 620 * k, u) : lerp(W + 620 * k, -620 * k, u);
      var y = yc + Math.sin(u * Math.PI * 2) * 40;
      var ang = Math.cos(u * Math.PI * 2) * 5 * dir * -1 + Math.sin(t * 30) * 1.4;
      e.style.transform = 'translate(' + (cxw - 500).toFixed(1) + 'px,' + (y - 225).toFixed(1) + 'px) rotate(' + ang.toFixed(2) + 'deg) scale(' + (k * dir).toFixed(3) + ',' + k.toFixed(3) + ')';
      // tepi bukaan bergelombang di bawah tubuh paus
      var xe = cxw - dir * 80, pts = [], tepi = [];
      for (var yy = -40; yy <= H + 40; yy += 45) {
        var x = xe + 40 * Math.sin(yy / 120 + t * 12) + 18 * Math.sin(yy / 47 - t * 7);
        pts.push(x.toFixed(1) + 'px ' + yy + 'px');
        tepi.push(x.toFixed(1) + ',' + yy);
      }
      var tepiX = dir > 0 ? '-40px' : (W + 40) + 'px';
      baru.style.clipPath = 'polygon(' + tepiX + ' -40px, ' + pts.join(', ') + ', ' + tepiX + ' ' + (H + 40) + 'px)';
      garis.setAttribute('points', tepi.join(' '));
      lebar.setAttribute('points', tepi.join(' '));
      // semburan dari lubang napas
      var rad = (ang * Math.PI) / 180, lx = 300 * k * dir, ly = -113 * k;
      var bx = cxw + lx * Math.cos(rad) - ly * Math.sin(rad), by = y + lx * Math.sin(rad) + ly * Math.cos(rad);
      if (!sembur && u > 0.42 && bx > 80 && bx < W - 80) {
        sembur = true;
        var r = KC.prng(31);
        for (var i = 0; i < 14; i++) {
          KC.butir(o.fx, bx, by, { u: 10 + r() * 18, dx: (r() - 0.5) * 220 - dir * 60, dy: 30 + r() * 80, lengkung: 180 + r() * 160, dur: 1000 + r() * 400, tunda: i * 25 });
        }
      }
      if (t > jejak && t < 0.92) {
        var ex = cxw - dir * 480 * k;
        KC.butir(o.fx, ex, y + ((Math.round(t * 100) % 7) - 3) * 22, { u: 8 + (Math.round(t * 100) % 4) * 5, dx: -dir * 40, dy: -110, dur: 1000 });
        jejak = t + 0.035;
      }
    });
  };
  T.paus.masuk = 900;

  /* penyu: penyu kaca berenang diagonal, mozaik sisik heksagon menutup lalu membuka */
  T.penyu = function (lama, baru, o) {
    var dir = o.arah > 0 ? 1 : -1, besar = o.besar, dur = besar ? 2400 : 1950, rh = o.ringan ? 124 : 88;
    var defs = el('defs', {}, o.svg);
    ['c1|c2', 'c2|c3', 'c3|c1'].forEach(function (p, i) {
      var c = p.split('|');
      var g = el('linearGradient', { id: 'hx' + i, x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
      el('stop', { offset: 0, style: 'stop-color:var(--' + c[0] + ')' }, g);
      el('stop', { offset: 0.55, style: 'stop-color:color-mix(in srgb, var(--' + c[1] + ') 70%, #fff)' }, g);
      el('stop', { offset: 1, style: 'stop-color:var(--' + c[1] + ')' }, g);
    });
    var ux = 1 * dir, uy = -0.62 * dir, nl = Math.hypot(ux, uy); ux /= nl; uy /= nl;
    var heks = [], r = KC.prng(53), dmin = Infinity, dmax = -Infinity;
    var dx = Math.sqrt(3) * rh, dy = 1.5 * rh, titik = '';
    for (var a = 0; a < 6; a++) {
      var an = (Math.PI / 180) * (60 * a - 30);
      titik += (Math.cos(an) * rh * 1.02).toFixed(1) + ',' + (Math.sin(an) * rh * 1.02).toFixed(1) + ' ';
    }
    for (var row = -1; row * dy < H + rh; row++) {
      for (var col = -1; col * dx < W + dx; col++) {
        var x = col * dx + (row % 2 ? dx / 2 : 0), y = row * dy;
        var d = x * ux + y * uy;
        dmin = Math.min(dmin, d); dmax = Math.max(dmax, d);
        var p = el('polygon', { points: titik, fill: 'url(#hx' + Math.floor(r() * 3) + ')', 'class': 'heks', transform: 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(0)' }, o.svg);
        heks.push({ el: p, x: x, y: y, d: d });
      }
    }
    heks.forEach(function (h) { h.d = (h.d - dmin) / (dmax - dmin); });
    var e = KC.buatHewan('penyu', { kaca: o.kaca });
    e.style.transformOrigin = '250px 290px';
    o.fx.appendChild(e);
    var S = dir > 0 ? { x: -320, y: H + 300 } : { x: W + 320, y: -300 }, F = dir > 0 ? { x: W + 320, y: -300 } : { x: -320, y: H + 300 };
    var sudut = (Math.atan2(F.y - S.y, F.x - S.x) * 180) / Math.PI + 90, kk = besar ? 1.0 : 0.82;
    var sirip = { dk: $('.sirip-dk', e), dki: $('.sirip-dki', e), bk: $('.sirip-bk', e), bki: $('.sirip-bki', e) };
    baru.style.clipPath = 'inset(0 0 100% 0)';
    var tukar = false, jejak = 0;
    return KC.jalan(dur, function (t) {
      heks.forEach(function (h) {
        var a = seg(t, h.d * 0.36, h.d * 0.36 + 0.14), b = seg(t, 0.54 + h.d * 0.34, 0.54 + h.d * 0.34 + 0.12);
        var s = a < 1 ? E.outBack(a) : 1;
        s *= 1 - E.in3(b);
        h.el.setAttribute('transform', 'translate(' + h.x.toFixed(1) + ' ' + h.y.toFixed(1) + ') scale(' + Math.max(0, s).toFixed(3) + ')');
      });
      if (!tukar && t >= 0.52) { tukar = true; baru.style.clipPath = 'none'; }
      var pp = seg(t, 0.02, 0.98);
      var x = lerp(S.x, F.x, pp), y = lerp(S.y, F.y, pp) + Math.sin(pp * Math.PI * 2) * 30;
      var kayuh = Math.sin(t * Math.PI * 7);
      e.style.transform = 'translate(' + (x - 250).toFixed(1) + 'px,' + (y - 290).toFixed(1) + 'px) rotate(' + (sudut + kayuh * 3).toFixed(1) + 'deg) scale(' + kk + ')';
      sirip.dk.style.transform = 'rotate(' + (kayuh * 24).toFixed(1) + 'deg)';
      sirip.dki.style.transform = 'rotate(' + (-kayuh * 24).toFixed(1) + 'deg)';
      sirip.bk.style.transform = 'rotate(' + (-kayuh * 14).toFixed(1) + 'deg)';
      sirip.bki.style.transform = 'rotate(' + (kayuh * 14).toFixed(1) + 'deg)';
      if (t > jejak && t < 0.95) {
        KC.butir(o.fx, x - ux * 200 * kk, y - uy * 200 * kk, { u: 10 + (Math.round(t * 100) % 4) * 5, dx: -ux * 60, dy: -100, dur: 1000 });
        jejak = t + 0.04;
      }
    });
  };
  T.penyu.masuk = 1250;

  /* ---------- mesin dek ---------- */
  var slides, idx = 0, tujuan = 0, sibuk = null, kanvas, fx, nav, toast, krKiri, krKanan;
  var TINGKAT = ['penuh', 'sedang', 'hemat'], NAMA_TINGKAT = { penuh: 'Penuh', sedang: 'Sedang', hemat: 'Hemat' };
  var tingkat = 'penuh', tingkatManual = false;
  try { var tsimpan = localStorage.getItem('kc-tingkat'); if (TINGKAT.indexOf(tsimpan) >= 0) { tingkat = tsimpan; tingkatManual = true; } } catch (e) { /* abaikan */ }
  if (TINGKAT.indexOf(q.get('tingkat')) >= 0) { tingkat = q.get('tingkat'); tingkatManual = true; }

  function setTingkat(t, simpan) {
    tingkat = t;
    TINGKAT.forEach(function (x) { root.classList.toggle('tingkat-' + x, x === t); });
    if (simpan) { try { localStorage.setItem('kc-tingkat', t); } catch (e) { /* abaikan */ } }
    var b = nav && $('.tingkat', nav);
    if (b) b.textContent = NAMA_TINGKAT[t];
  }
  KC.setTingkat = setTingkat;

  function pilihTransisi(nama) {
    if (KC.rm || tingkat === 'hemat') return T.pudar;
    return T[nama] || T.riak;
  }

  function mulaiSlide(s, awal) {
    var tok = (s._tok = (s._tok || 0) + 1);
    var ctx = { awal: !!awal, hidup: function () { return s._tok === tok; } };
    var nama = s.dataset.adegan;
    if (nama && KC.adegan[nama]) return KC.adegan[nama](s, ctx);
    KC.masukkan($$('[data-masuk]', s), 0);
    return Promise.resolve();
  }

  function perbaruiKrom() {
    var s = slides[idx], total = slides.length, pad = function (v) { return (v < 10 ? '0' : '') + v; };
    krKanan.textContent = pad(idx + 1) + ' / ' + pad(total);
    krKiri.textContent = s.dataset.bagian || '';
    [krKiri, krKanan, nav, toast].forEach(function (x) { x.dataset.palet = s.dataset.palet; });
    krKiri.classList.toggle('sembunyi', idx === 0);
    krKanan.classList.toggle('sembunyi', idx === 0);
    var maju = $('.maju span', nav);
    maju.textContent = idx === total - 1 ? 'Ulangi' : 'Berikutnya';
    $('.maju', nav).classList.toggle('ulang', idx === total - 1);
    $('.mundur', nav).style.visibility = idx === 0 ? 'hidden' : '';
    var c = $('.cacing', nav), x = 10 + idx * 24, lama = c._x == null ? x : c._x;
    if (c._x != null && lama !== x && !KC.instan) {
      var kiri = Math.min(lama, x), lebar = Math.abs(x - lama) + 12;
      c.animate([{ left: lama + 'px', width: '12px' }, { left: kiri + 'px', width: lebar + 'px', offset: 0.45 }, { left: x + 'px', width: '12px' }],
        { duration: 520, easing: 'cubic-bezier(.45,0,.2,1)' });
    }
    c.style.left = x + 'px'; c._x = x;
    try { history.replaceState(null, '', location.pathname + location.search + '#' + (idx + 1)); } catch (e) { /* abaikan */ }
  }

  KC.ke = function (n, opsi) {
    opsi = opsi || {};
    n = clamp(n, 0, slides.length - 1);
    tujuan = n;
    if (sibuk) { // transisi masih berjalan: percepat, lalu langsung ke tujuan terakhir
      KC.lompati();
      return sibuk.then(function () { return tujuan === n ? KC.ke(n, opsi) : null; });
    }
    if (n === idx) return Promise.resolve();
    var lama = slides[idx], baru = slides[n], arah = n > idx ? 1 : -1;
    var nama = arah > 0 ? baru.dataset.trans : lama.dataset.trans;
    var fn = pilihTransisi(nama || 'riak');
    lompat = false;
    lama._tok = (lama._tok || 0) + 1;
    fx.innerHTML = '';
    fx.dataset.palet = baru.dataset.palet;
    var svg = svgLapis(fx);
    siapkanMasuk(baru);
    baru.classList.add('tampil');
    baru.style.zIndex = 3; lama.style.zIndex = 2;
    var ctx = {
      arah: arah, titik: opsi.titik, fx: fx, svg: svg, urutan: n,
      besar: (arah > 0 ? baru : lama).hasAttribute('data-besar'),
      kaca: tingkat === 'penuh', ringan: tingkat !== 'penuh'
    };
    idx = n;
    perbaruiKrom();
    var tMasuk = KC.tunggu(fn.masuk != null ? fn.masuk : 450).then(function () { mulaiSlide(baru, false); });
    var jalan = Promise.resolve().then(function () { return fn(lama, baru, ctx); }).catch(function (e) { console.error(e); });
    sibuk = jalan.then(function () {
      lama.classList.remove('tampil');
      [lama, baru].forEach(function (s) { ['clipPath', 'transform', 'opacity', 'filter', 'zIndex', 'visibility'].forEach(function (p) { s.style[p] = ''; }); });
      lama.getAnimations().forEach(function (a) { a.cancel(); });
      baru.getAnimations().forEach(function (a) { if (a.effect && a.effect.target === baru) a.cancel(); });
      fx.innerHTML = '';
      return tMasuk;
    }).then(function () { lompat = false; sibuk = null; });
    return sibuk;
  };
  KC.maju = function (o) { return tujuan === slides.length - 1 ? (o && o.ulang ? KC.ke(0, o) : Promise.resolve()) : KC.ke(tujuan + 1, o); };
  KC.mundur = function (o) { return KC.ke(tujuan - 1, o); };
  KC.lihat = function (n) { // tampil seketika (dipakai ekspor)
    slides.forEach(function (s, i) { s.classList.toggle('tampil', i === n); });
    idx = tujuan = n; perbaruiKrom();
    siapkanMasuk(slides[n]);
    return mulaiSlide(slides[n], false);
  };
  KC.putarPembuka = function () {
    if (idx !== 0 || sibuk) return;
    siapkanMasuk(slides[0]);
    mulaiSlide(slides[0], true);
  };
  Object.defineProperty(KC, 'total', { get: function () { return slides.length; } });
  Object.defineProperty(KC, 'indeks', { get: function () { return idx; } });

  function skala() {
    var vw = window.innerWidth, vh = window.innerHeight, s = Math.min(vw / W, vh / H);
    KC.skala = s;
    kanvas.style.transform = 'translate(' + ((vw - W * s) / 2).toFixed(2) + 'px,' + ((vh - H * s) / 2).toFixed(2) + 'px) scale(' + s.toFixed(5) + ')';
  }
  function titikDari(ev) {
    var b = ev.currentTarget.getBoundingClientRect(), k = kanvas.getBoundingClientRect();
    return { x: ((b.left + b.width / 2 - k.left) / KC.skala), y: ((b.top + b.height / 2 - k.top) / KC.skala) };
  }
  function layarPenuh() {
    var d = document;
    if (!d.fullscreenElement) { (root.requestFullscreen ? root.requestFullscreen() : Promise.reject()).then(function () { if (idx === 0) setTimeout(KC.putarPembuka, 350); }, function () {}); }
    else if (d.exitFullscreen) d.exitFullscreen();
  }
  function tampilToast(teks) {
    toast.textContent = teks;
    toast.classList.add('muncul');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.classList.remove('muncul'); }, 1500);
  }
  function gantiTingkat() {
    var t = TINGKAT[(TINGKAT.indexOf(tingkat) + 1) % TINGKAT.length];
    setTingkat(t, true);
    tampilToast('Efek: ' + NAMA_TINGKAT[t]);
  }

  function bangunNav() {
    var titik = '';
    for (var i = 0; i < slides.length; i++) titik += '<i></i>';
    nav = document.createElement('nav');
    nav.className = 'kc-nav kaca';
    nav.setAttribute('aria-label', 'Navigasi presentasi');
    nav.innerHTML =
      '<button class="mundur" aria-label="Slide sebelumnya"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<div class="titik" aria-hidden="true">' + titik + '<span class="cacing"></span></div>' +
      '<button class="maju"><span>Berikutnya</span><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<button class="tingkat" title="Tingkat efek (T)">Penuh</button>' +
      '<button class="layar" aria-label="Layar penuh (F)" title="Layar penuh (F)"><svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>';
    kanvas.appendChild(nav);
    toast = document.createElement('div');
    toast.className = 'kc-toast kaca';
    kanvas.appendChild(toast);
    $('.mundur', nav).addEventListener('click', function (e) { KC.mundur({ titik: titikDari(e) }); });
    $('.maju', nav).addEventListener('click', function (e) { KC.maju({ titik: titikDari(e), ulang: true }); });
    $('.tingkat', nav).addEventListener('click', gantiTingkat);
    $('.layar', nav).addEventListener('click', layarPenuh);
    var redupT;
    var bangun = function () { nav.classList.remove('redup'); clearTimeout(redupT); redupT = setTimeout(function () { nav.classList.add('redup'); }, 2800); };
    window.addEventListener('mousemove', bangun, { passive: true });
    bangun();
  }

  function ukurFps() {
    if (tingkatManual || KC.instan || KC.rm) return;
    var n = 0, t0 = null;
    function f(now) {
      if (t0 === null) t0 = now;
      n++;
      if (now - t0 < 2000) return requestAnimationFrame(f);
      var fps = (n * 1000) / (now - t0);
      if (fps < 24) setTingkat('hemat');
      else if (fps < 42) setTingkat('sedang');
    }
    setTimeout(function () { requestAnimationFrame(f); }, 400);
  }

  function mulai() {
    kanvas = $('#kanvas');
    fx = $('.kc-fx');
    krKiri = $('.krom-kiri');
    krKanan = $('.krom-kanan');
    slides = $$('.dek > .slide');
    slides.forEach(bangunLatar);
    $$('.kartu-palet').forEach(bangunKartu);
    $$('.mawar-wadah').forEach(function (w, i) { bangunMawar(w, 11 + i * 7); });
    bangunNav();
    setTingkat(tingkat, false);
    skala();
    window.addEventListener('resize', skala);

    var awal = parseInt(q.get('s') || (location.hash || '').replace('#', '') || '1', 10);
    idx = tujuan = clamp((isNaN(awal) ? 1 : awal) - 1, 0, slides.length - 1);
    slides[idx].classList.add('tampil');
    perbaruiKrom();
    siapkanMasuk(slides[idx]);
    mulaiSlide(slides[idx], true);

    window.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var diTombol = e.target && e.target.tagName === 'BUTTON';
      switch (e.key) {
        case 'ArrowRight': case 'PageDown': case 'ArrowDown': KC.maju(); e.preventDefault(); break;
        case ' ': case 'Enter': if (diTombol) return; KC.maju(); e.preventDefault(); break;
        case 'ArrowLeft': case 'PageUp': case 'ArrowUp': case 'Backspace': KC.mundur(); e.preventDefault(); break;
        case 'Home': KC.ke(0); break;
        case 'End': KC.ke(slides.length - 1); break;
        case 'f': case 'F': layarPenuh(); break;
        case 't': case 'T': gantiTingkat(); break;
        case 'r': case 'R': KC.putarPembuka(); break;
      }
    });
    var sx = null, sy = null;
    kanvas.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    kanvas.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) { if (dx < 0) KC.maju(); else KC.mundur(); }
      sx = null;
    }, { passive: true });
    $$('.cakram').forEach(function (c) { c.style.cursor = 'pointer'; c.addEventListener('click', KC.putarPembuka); });
    ukurFps();
    KC.siap = true;
    document.dispatchEvent(new CustomEvent('kc-siap'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mulai);
  else mulai();
})();
