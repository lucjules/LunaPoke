// Démarrage : mise en page, écran titre, rencontres des nouvelles espèces
// zones d'affichage : l'écran de jeu, les menus au-dessus des boutons
function layout() {
  try {
    const w = $('w').getBoundingClientRect(),
      c = $('ctl').getBoundingClientRect(),
      H = innerHeight,
      r = document.documentElement.style,
      land = matchMedia('(orientation:landscape) and (max-height:520px)').matches;
    let oy = 0,
      oh = Math.max(120, c.top - 6);
    if (land) {
      oy = w.top;
      oh = w.height;
    }
    const set = (k, v) => {
      const t = Math.round(v) + 'px';
      if (r.getPropertyValue(k) != t) r.setProperty(k, t);
    };
    set('--ox', w.left);
    set('--oy', oy);
    set('--ow', w.width);
    set('--oh', oh);
    set('--dl', w.left);
    set('--dw', w.width);
    set('--db', H - w.bottom);
  } catch (e) {}
}
addEventListener('resize', layout);
addEventListener('orientationchange', layout);
setInterval(layout, 600);
layout();
(() => {
  let o = null;
  cv.addEventListener('pointerdown', e => {
    o = [e.clientX, e.clientY];
    swv = [0, 0];
    adv();
  });
  cv.addEventListener('pointermove', e => {
    if (!o) return;
    const dx = e.clientX - o[0],
      dy = e.clientY - o[1],
      l = Math.hypot(dx, dy);
    if (l < 12) {
      swv = [0, 0];
      return;
    }
    const k = Math.min(1, l / 45);
    swv = [(dx / l) * k, (dy / l) * k];
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(v =>
    cv.addEventListener(v, () => {
      o = null;
      swv = [0, 0];
    })
  );
})();
(() => {
  try {
    $('tmo').innerHTML = [0, 1, 2].map(i => spr(i, 64)).join('');
  } catch (e) {}
})();
draw();
busy = true;
renderSlots();
$('go').onclick = () => {
  $('ti').style.display = 'none';
  busy = false;
  try {
    if (S.mus && !mus) music();
  } catch (e) {
    S.mus = 0;
  }
  if (!G.f.s) intro();
};
// rencontres sauvages des nouvelles espèces (répartition par niveau)
(() => {
  const f1 = [51, 53, 55, 57, 60, 63, 65, 67, 70, 72, 74, 76, 78, 80, 83, 86, 88, 90, 92, 94, 96],
    ev2 = Object.fromEntries(
      [
        [51, 52, 16],
        [53, 54, 18],
        [55, 56, 20],
        [57, 58, 16],
        [60, 61, 14],
        [61, 62, 30],
        [63, 64, 26],
        [65, 66, 22],
        [67, 68, 14],
        [70, 71, 20],
        [72, 73, 22],
        [74, 75, 24],
        [76, 77, 24],
        [78, 79, 24],
        [80, 81, 22],
        [83, 84, 14],
        [84, 85, 30],
        [86, 87, 20],
        [88, 89, 26],
        [90, 91, 24],
        [92, 93, 22],
        [94, 95, 22],
        [96, 97, 26]
      ].map(([a, b, l]) => [a, [b, l]])
    );
  maps.forEach((m, mi) => {
    if (!m.e || m.in || !m.e.l) return;
    const l = m.e.l[0];
    let pool = f1.map(s => {
      let c = s;
      while (ev2[c] && l >= ev2[c][1] + 2) c = ev2[c][0];
      return c;
    });
    pool = [...new Set(pool)];
    const add = [pool[(mi * 5) % pool.length], pool[(mi * 5 + 7) % pool.length]];
    m.e.s = [...new Set(m.e.s.concat(add))];
  });
})();
