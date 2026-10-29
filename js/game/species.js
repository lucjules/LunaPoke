// Espèces de base, attaques, table des types
// ---------- Données ----------
const SP = [
  { n: 'Braisou', t: 'F', h: 45, a: 55, d: 40, e: '🦊' },
  { n: 'Ondin', t: 'E', h: 50, a: 45, d: 50, e: '🐙' },
  { n: 'Feuillon', t: 'P', h: 55, a: 45, d: 50, e: '🌱' },
  { n: 'Rattou', t: 'N', h: 40, a: 45, d: 35, e: '🐀' },
  { n: 'Piaf', t: 'V', h: 40, a: 50, d: 35, e: '🐦' },
  { n: 'Mousse', t: 'P', h: 45, a: 40, d: 45, e: '🍄' },
  { n: 'Crabi', t: 'E', h: 45, a: 50, d: 55, e: '🦀' },
  { n: 'Cendrelin', t: 'F', h: 55, a: 60, d: 45, e: '🔥' },
  { n: 'Lunard', t: 'N', h: 55, a: 55, d: 55, e: '🌙' }
];
SP.push(
  { n: 'Flamgrin', t: 'F', h: 65, a: 75, d: 55, e: '🦁' },
  { n: 'Ondaros', t: 'E', h: 72, a: 62, d: 70, e: '🐋' },
  { n: 'Sylvaros', t: 'P', h: 75, a: 62, d: 68, e: '🌳' },
  { n: 'Aigrin', t: 'V', h: 58, a: 70, d: 52, e: '🦅' },
  { n: 'Luciole', t: 'P', h: 42, a: 48, d: 42, e: '🐛' },
  { n: 'Galet', t: 'N', h: 60, a: 50, d: 70, e: '🪨' },
  { n: 'Spectro', t: 'N', h: 50, a: 62, d: 45, e: '👻' },
  { n: 'Luniel', t: 'V', h: 75, a: 75, d: 75, e: '🌟' },
  { n: 'Ratalpha', t: 'N', h: 62, a: 70, d: 55, e: '🐺' },
  { n: 'Titancrabe', t: 'E', h: 68, a: 72, d: 85, e: '🦞' },
  { n: 'Fongidor', t: 'P', h: 70, a: 58, d: 70, e: '🍄' },
  { n: 'Bélier', t: 'N', h: 60, a: 65, d: 55, e: '🐏' },
  { n: 'Hulotte', t: 'V', h: 55, a: 60, d: 50, e: '🦉' },
  { n: 'Magmite', t: 'F', h: 60, a: 70, d: 60, e: '🌋' },
  { n: 'Coralie', t: 'E', h: 58, a: 55, d: 75, e: '🐚' },
  { n: 'Pétale', t: 'P', h: 60, a: 62, d: 58, e: '🌸' },
  { n: 'Tempestor', t: 'V', h: 70, a: 78, d: 60, e: '🌪' },
  { n: 'Titanor', t: 'N', h: 80, a: 75, d: 80, e: '🗿' },
  { n: 'Braseron', t: 'F', h: 75, a: 85, d: 65, e: '🦎' },
  { n: 'Givrelin', t: 'E', h: 72, a: 68, d: 80, e: '🧊' },
  { n: 'Cristalor', t: 'N', h: 80, a: 70, d: 95, e: '💎' },
  { n: 'Foudrion', t: 'V', h: 70, a: 90, d: 62, e: '⚡' },
  { n: 'Ombrelin', t: 'N', h: 72, a: 82, d: 70, e: '🦇' },
  { n: 'Sylvanide', t: 'P', h: 82, a: 72, d: 78, e: '🌲' },
  { n: 'Éclipsor', t: 'N', h: 95, a: 95, d: 85, e: '🌑' }
);
[
  [0, 9, 10],
  [1, 10, 10],
  [2, 11, 10],
  [4, 12, 9],
  [3, 17, 12],
  [6, 18, 14],
  [5, 19, 12]
].forEach(([a, b, l]) => (SP[a].ev = [l, b]));
SP.push(
  { n: 'Volcanor', t: 'F', h: 70, a: 80, d: 60, e: '🌋' },
  { n: 'Récifor', t: 'E', h: 78, a: 66, d: 76, e: '🪸' },
  { n: 'Floralune', t: 'P', h: 76, a: 68, d: 74, e: '🌸' },
  { n: 'Nocturne', t: 'N', h: 72, a: 72, d: 72, e: '🌑' }
);
SP[7].se = ['pf', 34];
SP[23].se = ['pm', 35];
SP[24].se = ['ps', 36];
SP[8].se = ['pl', 37];
// attaque propre à chaque espèce (apprise au niveau 12), par numéro d'espèce
const SIG = [
  ...['FC', 'EB', 'PG', 'NV', 'VR', 'PS', 'EB', 'FB', 'NE', 'FC'],
  ...['ES', 'PR', 'VP', 'PS', 'NC', 'NG', 'NE', 'NG', 'NC', 'PS'],
  ...['NB', 'VB', 'FE', 'EB', 'PG', 'VB', 'NC', 'FD', 'EG', 'NC'],
  ...['VR', 'ND', 'PE', 'NE', 'FE', 'ES', 'PS', 'NE', 'FD', 'EB'],
  ...['PR', 'NG', 'VP', 'FE', 'EB', 'VB', 'PR', 'FB', 'NC', 'NE'],
  ...['NE', 'EP', 'EP', 'EG', 'EG', 'NC', 'PR', 'EP', 'ES', 'EC'],
  ...['FC', 'FC', 'FE', 'FB', 'FR', 'FB', 'FC', 'PG', 'PS', 'PR'],
  ...['NV', 'PE', 'PE', 'PE', 'NE', 'NV', 'NG', 'NC', 'NV', 'NB'],
  ...['NC', 'PE', 'NG', 'VR', 'VR', 'VP', 'PS', 'PS', 'VB', 'VB'],
  ...['EG', 'EG', 'NC', 'NB', 'EB', 'EB', 'PG', 'NF', 'FE', 'EC']
];
const SIG_LV = 12;
// attaques connues : Normale + type dès le départ, puis type 2 (niv. 8), attaque propre (niv. 12),
// type 3 (niv. 20) ; la plus puissante reste en dernier (les adversaires la choisissent souvent)
const mvs = c => {
  const t = SP[c.s].t,
    l = c.lv >= 20 ? ['N', t, t + '2', t + '3'] : c.lv >= 8 ? ['N', t, t + '2'] : ['N', t];
  if (c.lv >= SIG_LV && SIG[c.s]) l.splice(Math.min(2, l.length), 0, SIG[c.s]);
  return [...new Set(l)];
};
const spd = c => {
  const b = SP[c.s];
  return Math.floor((100 - b.d) * 0.6 + b.a * 0.5) + c.lv * 2 + (c.st == 'par' ? -15 : 0);
};
const MV = {
  N: ['Charge', 40],
  F: ['Flammèche', 50],
  E: ["Jet d'eau", 50],
  P: ['Fouet-lianes', 50],
  V: ['Picore', 45],
  F2: ['Canicule', 75],
  E2: ['Raz-de-marée', 75],
  P2: ['Tempête verte', 75],
  V2: ['Rafale', 70],
  N2: ['Plaquage', 70],
  F3: ['Explosion solaire', 95],
  E3: ['Tsunami', 95],
  P3: ['Rayon de verdure', 95],
  V3: ['Ouragan', 90],
  N3: ['Coup de tonnerre', 95],
  // attaques propres aux espèces (la 1re lettre de la clé donne le type)
  FB: ['Feu follet', 0],
  FC: ['Crocs feu', 60],
  FD: ['Danse flamme', 0],
  FE: ['Éruption', 95],
  FR: ['Renaissance', 0],
  EB: ['Bulles', 45],
  ES: ['Source vive', 0],
  EG: ['Souffle gelé', 60],
  EP: ['Aqua-jet', 45],
  EC: ['Cascade', 85],
  PS: ['Poudre dodo', 0],
  PG: ['Giga-sève', 60],
  PR: ['Racines', 0],
  PE: ['Épines', 70],
  VR: ['Vif-envol', 45],
  VB: ['Bourrasque', 60],
  VP: ['Piqué', 90],
  NV: ['Vive-attaque', 45],
  NG: ['Grondement', 0],
  NC: ['Carapace', 0],
  NB: ['Bélier', 80],
  NE: ['Éclat lunaire', 75],
  ND: ['Vampirisme', 55],
  NF: ['Regard figé', 0]
};
// effets : st = statut infligé (ch = chance), a / d = attaque / défense modifiée (me = sur soi),
// heal = soin (part des PV max), drain = part des dégâts récupérée, prio = agit en premier
const MVE = {
  FB: { st: 'brn', ch: 0.9 },
  FC: { st: 'brn', ch: 0.2 },
  FD: { me: 1, a: 1 },
  FE: { me: 1, d: -1 },
  FR: { heal: 0.5 },
  EB: { a: -1 },
  ES: { heal: 0.4 },
  EG: { st: 'par', ch: 0.25 },
  EP: { prio: 1 },
  PS: { st: 'slp', ch: 0.75 },
  PG: { drain: 0.5 },
  PR: { heal: 0.25, me: 1, d: 1 },
  PE: { d: -1, ch: 0.3 },
  VR: { prio: 1 },
  VB: { d: -1, ch: 0.5 },
  NV: { prio: 1 },
  NG: { a: -1 },
  NC: { me: 1, d: 1 },
  NE: { d: -1, ch: 0.2 },
  ND: { drain: 0.5 },
  NF: { st: 'par', ch: 0.9 }
};
const TYN = { N: 'Normal', F: 'Feu', E: 'Eau', P: 'Plante', V: 'Vol' };
// description courte d'une attaque (menu de combat, bestiaire)
const mvDesc = k => {
  const p = MV[k][1],
    e = MVE[k] || {},
    pct = v => Math.round(v * 100) + ' %',
    l = [TYN[k[0]], p ? 'puissance ' + p : 'sans dégâts'];
  if (e.prio) l.push('agit en premier');
  if (e.st)
    l.push(
      { brn: 'brûle', slp: 'endort', par: 'paralyse' }[e.st] + (e.ch < 1 && p ? ' (' + pct(e.ch) + ')' : '')
    );
  if (e.heal) l.push('soigne ' + pct(e.heal) + ' des PV');
  if (e.drain) l.push('récupère ' + pct(e.drain) + ' des dégâts');
  if (e.a || e.d)
    l.push(
      (e.a ? 'Attaque' : 'Défense') +
        (e.me ? '' : ' adverse') +
        ((e.a || e.d) > 0 ? ' +' : ' −') +
        (e.ch && e.ch < 1 ? ' (' + pct(e.ch) + ')' : '')
    );
  return l.join(', ');
};
// multiplicateur d'une caractéristique modifiée en combat (de −3 à +3)
const stg = (c, s) => {
  const v = (c.bs && c.bs[s]) || 0;
  return v >= 0 ? (2 + v) / 2 : 2 / (2 - v);
};
// table des types : Feu > Plante > Eau > Feu, Vol > Plante, Eau > Vol (la pluie détrempe les ailes)
const up = ['F>P', 'P>E', 'E>F', 'V>P', 'E>V'],
  dn = ['P>F', 'F>E', 'E>P', 'P>V'];
const eff = (a, d) =>
  up.includes(a + '>' + d) ? 2 : dn.includes(a + '>' + d) || (a == d && a != 'N') ? 0.5 : 1;
