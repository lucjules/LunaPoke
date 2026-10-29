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
// version du format de sauvegarde (à augmenter si la structure de G change)
const SAVE_VERSION = 2;
// retire les caractères dangereux d'un nom saisi ou importé (il finit dans du HTML)
const cleanName = (v, max = 12) =>
  typeof v == 'string'
    ? v
        .replace(/[<>&"'`{}\\\/]/g, '')
        .trim()
        .slice(0, max)
        .trim() || null
    : null;
// complète une sauvegarde (ancienne version, import, fichier abîmé) et nettoie les textes
function fixSave(g) {
  const d = newG();
  for (const k in d) if (g[k] == null) g[k] = d[k];
  for (const k of ['party', 'box', 'ach', 'tips', 'vis']) if (!Array.isArray(g[k])) g[k] = d[k];
  for (const k of ['f', 'dex', 'tr', 'q', 'inv']) if (typeof g[k] != 'object') g[k] = d[k];
  g.sx = Object.assign(d.sx, g.sx);
  g.dex.s = g.dex.s || [];
  g.dex.c = g.dex.c || [];
  const okC = c => c && typeof c == 'object' && Number.isInteger(c.s) && c.s >= 0 && c.lv > 0;
  g.party = g.party.filter(okC);
  g.box = g.box.filter(okC);
  g.party.concat(g.box).forEach(c => {
    const n = cleanName(c.nick);
    if (n) c.nick = n;
    else delete c.nick;
  });
  g.pn = cleanName(g.pn, 10);
  g.rv = cleanName(g.rv, 10);
  // les créatures de l'équipe comptent comme capturées dans le bestiaire de CETTE sauvegarde
  g.party.forEach(c => {
    if (!g.dex.s.includes(c.s)) g.dex.s.push(c.s);
    if (!g.dex.c.includes(c.s)) g.dex.c.push(c.s);
  });
  g.v = SAVE_VERSION;
  return g;
}
let G = fixSave(load() || newG()),
  busy = false,
  dq = [],
  dcb = null;
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
