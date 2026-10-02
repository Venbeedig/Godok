/* kc-hewan.js — siluet hewan laut kaca air (paus, ubur-ubur, penyu, koi)
   Setiap hewan: ukuran desain (w,h), path tubuh untuk clip-path kaca, dan
   detail garis (tepi, mata, kilau) untuk lapisan SVG di atasnya. */
(function () {
  'use strict';
  var KC = (window.KC = window.KC || {});

  // Penyu: sirip dibuat dari satu bentuk lalu dicerminkan.
  function cermin(pts, lebar) {
    return pts.slice().reverse().map(function (p) { return [lebar - p[0], p[1]]; });
  }
  function jalur(pts) {
    // pts: [x,y] titik awal lalu kelompok kontrol bezier [c1x,c1y,c2x,c2y,x,y]
    var d = 'M ' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 1; i < pts.length; i++) d += ' C ' + pts[i].join(' ');
    return d + ' Z';
  }

  var siripDepanKanan = 'M 352 222 C 420 188, 482 196, 494 236 C 470 250, 432 298, 382 332 C 372 300, 362 262, 352 222 Z';
  var siripDepanKiri = 'M 148 222 C 138 262, 128 300, 118 332 C 68 298, 30 250, 6 236 C 18 196, 80 188, 148 222 Z';
  var siripBelakangKanan = 'M 330 420 C 370 430, 396 460, 392 494 C 366 492, 336 472, 318 446 Z';
  var siripBelakangKiri = 'M 182 446 C 164 472, 134 492, 108 494 C 104 460, 130 430, 170 420 Z';

  KC.HEWAN = {
    paus: {
      w: 1000, h: 450,
      tubuh:
        'M 980 262 C 982 196, 930 140, 830 122 C 700 98, 540 112, 420 150 ' +
        'C 330 178, 262 206, 200 222 C 186 225, 176 224, 166 220 ' +
        'C 150 196, 112 146, 40 118 C 58 160, 84 196, 116 226 ' +
        'C 86 256, 62 290, 44 338 C 104 318, 146 280, 170 252 ' +
        'C 182 248, 196 250, 212 256 C 300 290, 420 335, 560 355 ' +
        'C 600 360, 625 362, 640 363 C 628 392, 606 420, 572 442 ' +
        'C 624 432, 670 402, 702 366 C 780 368, 860 356, 905 330 ' +
        'C 958 306, 980 290, 980 262 Z',
      detail:
        '<path class="kilau" d="M 868 140 C 770 116, 630 116, 500 146"/>' +
        '<path class="kilau tipis" d="M 360 192 C 300 214, 250 228, 214 236"/>' +
        '<path class="garis" d="M 978 272 C 940 288, 890 298, 836 294"/>' +
        '<path class="garis halus" d="M 930 308 C 880 326, 820 334, 760 336"/>' +
        '<path class="garis halus" d="M 896 324 C 846 340, 796 346, 744 348"/>' +
        '<path class="garis halus" d="M 852 338 C 812 350, 772 354, 730 356"/>' +
        '<circle class="mata" cx="866" cy="262" r="9"/>' +
        '<circle class="mata-kilau" cx="863" cy="259" r="3"/>',
      lubang: [800, 112] // lubang napas, asal semburan
    },

    ubur: {
      w: 400, h: 640,
      tubuh:
        'M 28 236 C 28 116, 106 36, 200 36 C 294 36, 372 116, 372 236 ' +
        'Q 343 258 314 238 Q 285 258 257 238 Q 228 258 200 238 ' +
        'Q 172 258 143 238 Q 115 258 86 238 Q 57 258 28 236 Z',
      detail:
        '<path class="kilau" d="M 70 170 C 80 110, 130 66, 196 60"/>' +
        '<path class="garis halus" d="M 82 214 C 92 132, 146 92, 200 92 C 254 92, 308 132, 318 214"/>' +
        '<circle class="cincin" cx="170" cy="150" r="26"/><circle class="cincin" cx="230" cy="150" r="26"/>' +
        '<circle class="cincin" cx="170" cy="200" r="22"/><circle class="cincin" cx="230" cy="200" r="22"/>',
      tentakel: { y: 244, xs: [52, 96, 140, 260, 304, 348], lengan: [160, 186, 214, 240] }
    },

    penyu: {
      w: 500, h: 540,
      tubuh:
        'M 250 150 C 330 150, 368 220, 368 300 C 368 390, 320 450, 250 450 ' +
        'C 180 450, 132 390, 132 300 C 132 220, 170 150, 250 150 Z ' +
        'M 250 40 C 285 40, 300 70, 296 104 C 293 128, 280 150, 262 160 ' +
        'L 238 160 C 220 150, 207 128, 204 104 C 200 70, 215 40, 250 40 Z ' +
        'M 262 446 L 250 482 L 238 446 Z',
      sirip: { dk: siripDepanKanan, dki: siripDepanKiri, bk: siripBelakangKanan, bki: siripBelakangKiri },
      detail:
        '<path class="garis" d="M 250 214 L 284 236 L 284 280 L 250 302 L 216 280 L 216 236 Z"/>' +
        '<path class="garis" d="M 250 302 L 284 324 L 284 366 L 250 388 L 216 366 L 216 324 Z"/>' +
        '<path class="garis halus" d="M 284 236 L 340 222 M 284 280 L 362 296 M 284 366 L 336 400 M 216 236 L 160 222 M 216 280 L 138 296 M 216 366 L 164 400 M 250 214 L 250 160 M 250 388 L 250 446"/>' +
        '<path class="kilau" d="M 176 210 C 196 178, 222 164, 250 162"/>' +
        '<circle class="mata" cx="228" cy="88" r="7"/><circle class="mata" cx="272" cy="88" r="7"/>'
    },

    koi: {
      w: 400, h: 172,
      tubuh:
        'M 396 86 C 396 64, 376 48, 344 44 C 296 38, 236 46, 176 62 ' +
        'C 146 70, 122 76, 100 80 C 78 62, 44 34, 6 22 C 24 52, 34 70, 44 86 ' +
        'C 34 102, 24 122, 6 152 C 44 138, 78 110, 100 94 ' +
        'C 122 98, 146 104, 176 112 C 236 128, 296 132, 344 128 ' +
        'C 376 124, 396 108, 396 86 Z',
      detail:
        '<path class="sirip-isi" d="M 306 46 C 270 16, 214 16, 172 60 C 214 50, 262 46, 306 46 Z"/>' +
        '<path class="sirip-isi" d="M 300 124 C 292 150, 270 166, 246 170 C 262 150, 276 136, 284 124 Z"/>' +
        '<ellipse class="bintik" cx="300" cy="72" rx="34" ry="16"/>' +
        '<ellipse class="bintik" cx="220" cy="92" rx="26" ry="13"/>' +
        '<path class="kilau" d="M 368 58 C 330 46, 270 46, 200 62"/>' +
        '<path class="garis" d="M 392 96 C 404 104, 408 116, 400 126"/>' +
        '<circle class="mata" cx="360" cy="74" r="6"/>'
    }
  };

  /* Bangun elemen hewan kaca.
     opsi.kaca: true = tubuh memakai backdrop-filter (tingkat penuh). */
  KC.buatHewan = function (jenis, opsi) {
    opsi = opsi || {};
    var H = KC.HEWAN[jenis];
    var el = document.createElement('div');
    el.className = 'hewan hewan-' + jenis + (opsi.kaca === false ? ' tanpa-blur' : '');
    el.style.width = H.w + 'px';
    el.style.height = H.h + 'px';
    var badan = document.createElement('div');
    badan.className = 'hewan-kaca';
    badan.style.clipPath = "path('" + H.tubuh + "')";
    el.appendChild(badan);
    var svg = '<svg class="hewan-garis" viewBox="0 0 ' + H.w + ' ' + H.h + '" width="' + H.w + '" height="' + H.h + '">';
    if (jenis === 'penyu') {
      svg += '<g class="sirip sirip-dk"><path class="sirip-isi tepi" d="' + H.sirip.dk + '"/></g>' +
        '<g class="sirip sirip-dki"><path class="sirip-isi tepi" d="' + H.sirip.dki + '"/></g>' +
        '<g class="sirip sirip-bk"><path class="sirip-isi tepi" d="' + H.sirip.bk + '"/></g>' +
        '<g class="sirip sirip-bki"><path class="sirip-isi tepi" d="' + H.sirip.bki + '"/></g>';
    }
    if (jenis === 'ubur') svg += '<g class="tentakel"></g>';
    svg += '<path class="tepi" d="' + H.tubuh + '"/>' + H.detail + '</svg>';
    el.insertAdjacentHTML('beforeend', svg);
    return el;
  };

  /* Tentakel ubur-ubur: dibangun ulang tiap bingkai dengan gelombang. */
  KC.gerakTentakel = function (el, fase, panjang) {
    var g = el.querySelector('.tentakel');
    if (!g) return;
    var T = KC.HEWAN.ubur.tentakel, s = '';
    panjang = panjang || 1;
    T.xs.forEach(function (x0, i) {
      var L = (300 + (i % 3) * 30) * panjang, d = 'M ' + x0 + ' ' + T.y;
      for (var k = 1; k <= 6; k++) {
        var y = T.y + (L * k) / 6;
        var x = x0 + Math.sin(fase + i * 0.9 + k * 0.8) * (6 + k * 4);
        d += ' L ' + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      s += '<path class="tentakel-tipis" d="' + d + '"/>';
    });
    T.lengan.forEach(function (x0, i) {
      var L = 250 * panjang, d = 'M ' + x0 + ' ' + (T.y - 6);
      for (var k = 1; k <= 5; k++) {
        var y = T.y + (L * k) / 5;
        var x = x0 + Math.sin(fase * 0.8 + i * 1.7 + k * 0.6) * (5 + k * 5);
        d += ' L ' + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      s += '<path class="lengan" d="' + d + '"/>';
    });
    g.innerHTML = s;
  };

  /* Glif putih untuk kartu palet (ikon tengah kartu). */
  KC.glifHewan = function (jenis) {
    var H = KC.HEWAN[jenis], extra = '';
    if (jenis === 'penyu') extra = '<path d="' + H.sirip.dk + '"/><path d="' + H.sirip.dki + '"/><path d="' + H.sirip.bk + '"/><path d="' + H.sirip.bki + '"/>';
    if (jenis === 'ubur') {
      var T = H.tentakel, s = '';
      T.xs.concat(T.lengan).forEach(function (x0, i) {
        s += '<path class="glif-tali" d="M ' + x0 + ' 240 C ' + (x0 + 18) + ' 330, ' + (x0 - 18) + ' 420, ' + (x0 + (i % 2 ? 14 : -14)) + ' ' + (470 + (i % 3) * 40) + '"/>';
      });
      extra = s;
    }
    return '<svg viewBox="0 0 ' + H.w + ' ' + H.h + '" class="glif-svg" aria-hidden="true">' + extra + '<path d="' + H.tubuh + '"/></svg>';
  };
})();
