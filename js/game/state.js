// État de la partie (G), réglages (S), sauvegarde et chargement
// ---------- État ----------
// marque une espèce vue (c=1 : capturée) dans le bestiaire
function mark(s, c) {
  const d = G.dex;
  if (!d.s.includes(s)) d.s.push(s);
  if (c && !d.c.includes(s)) d.c.push(s);
}
const newG = () => ({
  map: 0,
  x: 20,
  y: 12,
  party: [],
  balls: 0,
  pots: 0,
  badge: 0,
  gold: 100,
  f: { s: 0, r: 0 },
  dex: { s: [], c: [] },
  tr: {},
  q: {},
  sp: 0,
  vis: [0],
  sx: { steps: 0, battles: 0, wins: 0, caught: 0, time: 0 },
  lg: 0,
  box: [],
  ach: [],
  tips: [],
  rec: 0,
  inv: {}
});
let S = Object.assign(
  {
    mus: 1,
    vol: 5,
    sfx: 5,
    spd: 1,
    anim: 1,
    fxv: 1,
    night: 1,
    diff: 1,
    vib: 1,
    tips: 1,
    walk: 0,
    q: 0,
    part: 1,
    fps: 0,
    guide: 0,
    meteo: 1,
    px: 1,
    pal: 0,
    r3: 0,
    fx3: 0
  },
  (() => {
    try {
      return JSON.parse(localStorage.getItem('aerelia_s')) || {};
    } catch (e) {
      return {};
    }
  })()
);
let G = load() || newG(),
  busy = false,
  dq = [],
  dcb = null;
G.dex = G.dex || { s: [], c: [] };
G.tr = G.tr || {};
G.gold = G.gold ?? 100;
G.lg = G.lg || 0;
G.box = G.box || [];
G.ach = G.ach || [];
G.tips = G.tips || [];
G.rec = G.rec || 0;
G.q = G.q || {};
G.sp = G.sp || 0;
G.vis = G.vis || [0];
G.sx = G.sx || { steps: 0, battles: 0, wins: 0, caught: 0, time: 0 };
G.party.forEach(c => mark(c.s, 1));
function save() {
  try {
    localStorage.setItem(SK(), JSON.stringify(G));
  } catch (e) {}
}
function load() {
  try {
    const s = localStorage.getItem(SK());
    if (s) return JSON.parse(s);
  } catch (e) {}
}
const stat = c => {
  const b = SP[c.s];
  c.mh = Math.floor((Math.floor((b.h * c.lv) / 20) + c.lv + 10) * 1.5);
  c.at = Math.floor((b.a * c.lv) / 25) + 5;
  c.df = Math.floor((b.d * c.lv) / 25) + 5;
};
function mkC(s, lv) {
  const c = { s, lv, xp: 0 };
  stat(c);
  c.hp = c.mh;
  return c;
}
const nm = c => c.nick || SP[c.s].n,
  heal = () =>
    G.party.forEach(c => {
      c.hp = c.mh;
      c.st = 0;
    });
