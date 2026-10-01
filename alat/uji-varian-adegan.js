window.KC = window.KC || {};
(function(KC){
  const A = KC.adegan;
  A['lensa-uji'] = async (s, c) => { await KC.tunggu(KC.ms(1)); if (!c.aktif()) return; const pg = s.querySelector('.lensa-panggung'); await KC.resepLensa[pg.dataset.resep](pg, c); };
  A['morph-mekar'] = async (s, c) => { const b = s.querySelector('.bentuk-mekar');
    await KC.tunggu(KC.ms(1)); await KC.mekar(b, { width: '120px', height: '120px', borderRadius: '60px' }, { width: '520px', height: '120px', borderRadius: '60px' });
    if (!c.aktif()) return; await KC.mekar(b, { width: '520px', height: '120px', borderRadius: '60px' }, { width: '900px', height: '420px', borderRadius: '52px' }); };
  A['morph-tombol'] = async (s, c) => { await KC.tunggu(KC.ms(1)); if (!c.aktif()) return; await KC.satuJadiBanyak(s.querySelector('.isi'), [...s.querySelectorAll('.kc-tombol-gel')]); };
  A['morph-lebur'] = async (s, c) => { const t = s.querySelector('.sasaran-lebur'); t.style.opacity = 0; await KC.tunggu(KC.ms(2)); if (!c.aktif()) return;
    await KC.leburJadi(s.querySelector('.isi'), [...s.querySelectorAll('.sumber-lebur .kaca')], t); };
  A['morph-tetes'] = async (s, c) => { await KC.tunggu(KC.ms(1)); if (!c.aktif()) return; await KC.tetesJadi(s.querySelector('.isi'), s.querySelector('.sasaran-tetes')); };
  A['morph-pop'] = async (s, c) => { await KC.tunggu(KC.ms(1)); KC.gelembungPop(s.querySelector('.pop')); await KC.tunggu(KC.ms(2)); KC.jeli(s.querySelector('.jeli')); };
  A['morph-manik'] = async (s, c) => { await KC.tunggu(KC.ms(1)); if (!c.aktif()) return; await KC.manik(s.querySelector('.isi'), [...s.querySelectorAll('.manik')]); };
  A['komponen-lembar'] = async (s, c) => { await KC.tunggu(KC.ms(1)); await KC.lembar(s.querySelector('.kc-lembar')); };
})(window.KC);
