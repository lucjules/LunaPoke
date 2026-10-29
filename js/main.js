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
// recalcul quand la fenêtre, l'écran de jeu ou les contrôles changent de taille, au défilement
// et une fois les polices chargées ; un contrôle lent reste en secours
addEventListener('resize', layout);
addEventListener('orientationchange', layout);
addEventListener('scroll', layout, { passive: true });
if (window.ResizeObserver) {
  const ro = new ResizeObserver(layout);
  ['w', 'ctl'].forEach(id => ro.observe($(id)));
  ro.observe(document.body);
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
setInterval(() => {
  if (!document.hidden) layout();
}, 2000);
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
  // chaque forme de base doit être capturable quelque part : on place celles qui manquent
  // dans la zone de plus bas niveau où elle n'a pas encore évolué (la moins peuplée d'abord)
  const wild = maps.filter(m => m.e && !m.in && m.e.l),
    found = s => wild.some(m => m.e.s.includes(s));
  f1.forEach(s => {
    if (found(s)) return;
    const evl = ev2[s] ? ev2[s][1] : 99,
      zone = wild
        .filter(m => m.e.l[1] < evl)
        .sort((a, b) => a.e.s.length - b.e.s.length || a.e.l[0] - b.e.l[0])[0];
    if (zone) zone.e.s.push(s);
  });
  // Brumaillon (82) n'a pas d'évolution : il vit sur le Sentier des Brumes
  const mist = wild.find(m => m.th == 'mist');
  if (mist && !found(82)) mist.e.s.push(82);
})();
// application installable : le service worker met le jeu en cache (hors ligne)
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol))
  navigator.serviceWorker.register('sw.js').catch(() => {});
