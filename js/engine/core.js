// Constantes, qualité graphique auto, mesure des performances, cache des cartes
const T = 32,
  VW = 15,
  VH = 12,
  VHH = VH * 32,
  cv = document.getElementById('c');
let cx = cv.getContext('2d');
const MAINCX = cx;
const SK = () => {
  let n = '1';
  try {
    n = localStorage.getItem('aerelia_slot') || '1';
  } catch (e) {}
  return n == '1' ? 'aerelia' : 'aerelia_' + n;
};
const QT = [
  { n: 'Bas', s: 1, ft: 33, fx: 0, rain: 25, part: 0, fire: 0, cl: 0, vg: 0, sway: 0, water: 0 },
  { n: 'Moyen', s: 1.5, ft: 16, fx: 1, rain: 50, part: 0, fire: 6, cl: 1, vg: 1, sway: 1, water: 1 },
  { n: 'Élevé', s: 2, ft: 16, fx: 1, rain: 90, part: 1, fire: 14, cl: 1, vg: 1, sway: 1, water: 1 },
  {
    n: 'Ultra',
    s: Math.min(3, Math.max(2, window.devicePixelRatio || 2)),
    ft: 0,
    fx: 2,
    rain: 140,
    part: 2,
    fire: 24,
    cl: 1,
    vg: 1,
    sway: 1,
    water: 1
  }
];
let Q = QT[2],
  aT = 2,
  maxT = 2,
  bc = { n: 0, t: 2, cores: 4, coarse: false };
const MC = {},
  PT = [];
function bench() {
  const c = document.createElement('canvas');
  c.width = 480;
  c.height = 320;
  const x = c.getContext('2d');
  let n = 0;
  const t0 = performance.now();
  while (performance.now() - t0 < 120) {
    for (let i = 0; i < 40; i++) {
      x.fillStyle = 'hsl(' + ((n + i) % 360) + ',60%,50%)';
      x.beginPath();
      x.arc((i * 37 + n) % 480, (i * 53) % VHH, 14, 0, 7);
      x.fill();
      x.fillRect((i * 29) % 480, (n * 3) % VHH, 24, 24);
    }
    n++;
  }
  return n;
}
function detect() {
  let c = null;
  try {
    c = JSON.parse(localStorage.getItem('aerelia_bench'));
  } catch (e) {}
  if (c && c.v == 1 && c.dpr == window.devicePixelRatio && c.w == screen.width) return c;
  const n = bench(),
    cores = navigator.hardwareConcurrency || 4,
    mem = navigator.deviceMemory || 4,
    coarse = (() => {
      try {
        return matchMedia('(pointer:coarse)').matches;
      } catch (e) {
        return false;
      }
    })();
  let t = n < 20 ? 0 : n < 60 ? 1 : n < 150 ? 2 : 3;
  if (cores <= 4 && t > 1) t--;
  if (mem <= 2 && t > 1) t = 1;
  if (coarse && t > 2) t = 2;
  c = { v: 1, dpr: window.devicePixelRatio, w: screen.width, n, t, cores, mem, coarse };
  try {
    localStorage.setItem('aerelia_bench', JSON.stringify(c));
  } catch (e) {}
  return c;
}
const QTR = QT.map(q => Object.assign({}, q, { s: 0.5, fx: 0, vg: 0, cl: 0, fire: Math.min(q.fire, 6) }));
function applyQ(msgOn) {
  const ti = S.q ? S.q - 1 : aT,
    q = (S.px ? QTR : QT)[ti];
  if (q !== Q || !applyQ.done) {
    Q = q;
    applyQ.done = 1;
    cv.width = 480 * Q.s;
    cv.height = VHH * Q.s;
    cx = MAINCX;
    cx.setTransform(Q.s, 0, 0, Q.s, 0, 0);
    for (const k in MC) delete MC[k];
  }
  document.body.className = 'q' + ti + (S.px ? ' px' : '') + (S.pal ? ' pal' + S.pal : '');
  if (msgOn) toast('⚙ Qualité : ' + Q.n);
}
function perf(t, work) {
  const d = t - (perf.l || t);
  perf.l = t;
  perf.f = (perf.f || 16) * 0.92 + d * 0.08;
  perf.w = (perf.w || 4) * 0.92 + work * 0.08;
  perf.n = (perf.n || 0) + 1;
  perf.c = (perf.c || 0) + 1;
  if (t - (perf.s || t) >= 1000) {
    perf.fps = perf.c;
    perf.c = 0;
    perf.s = t;
  }
  if (!perf.s) perf.s = t;
  if (S.q || perf.n < 90 || t - (perf.ch || 0) < 6000) return;
  if ((perf.w > 11 || (Q.ft < 20 && perf.f > 27)) && aT > 0) {
    aT--;
    maxT = aT;
    perf.ch = t;
    perf.n = 0;
    applyQ(1);
  }
}
function mapBg(k) {
  if (MC[k]) return MC[k];
  gatesApply(k);
  for (const j in MC) delete MC[j];
  const m = maps[k],
    g = m.g,
    w = g[0].length,
    h = g.length,
    s = Math.min(Q.s, Math.sqrt(16e6 / (w * T * h * T))),
    oc = document.createElement('canvas');
  oc.sc = s;
  oc.width = w * T * s;
  oc.height = h * T * s;
  const o = oc.getContext('2d');
  o.setTransform(s, 0, 0, s, 0, 0);
  const keep = cx,
    gm = G.map;
  cx = o;
  G.map = k;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = g[y][x];
      if (c == 'g') {
        o.fillStyle = '#4d9c3a';
        o.fillRect(x * T, y * T, T, T);
      } else if (c == 'w') {
        o.fillStyle = (x + y) % 2 ? '#3d86d8' : '#3a80d0';
        o.fillRect(x * T, y * T, T, T);
      } else tile(c, x, y, x * T, y * T, hs(x, y), 0, g, false);
    }
  G.map = gm;
  cx = keep;
  MC[k] = oc;
  return oc;
}
const $ = i => document.getElementById(i);
