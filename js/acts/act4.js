// Acte IV : l'archipel des étoiles
const WN2 = [];
// ---------- ACTE IV : l'archipel des étoiles ----------
SP.push(
  { n: 'Corallin', t: 'E', h: 78, a: 70, d: 80, e: '🪸' },
  { n: 'Ventalis', t: 'V', h: 70, a: 82, d: 68, e: '🪁' },
  { n: 'Brumelin', t: 'P', h: 84, a: 70, d: 82, e: '🪷' },
  { n: 'Phareur', t: 'F', h: 76, a: 88, d: 72, e: '🏮' },
  { n: 'Mirelune', t: 'N', h: 85, a: 76, d: 84, e: '🦪' },
  { n: 'Orionyx', t: 'N', h: 80, a: 90, d: 80, e: '🌌' },
  { n: 'Astraël', t: 'V', h: 100, a: 100, d: 95, e: '✨' }
);
SP.push(
  { n: 'Loutrelle', t: 'E', h: 55, a: 55, d: 50, e: '🦦' },
  { n: 'Loutrion', t: 'E', h: 75, a: 68, d: 72, e: '🦦' },
  { n: 'Méduline', t: 'E', h: 50, a: 52, d: 48, e: '🪼' },
  { n: 'Méduzor', t: 'E', h: 74, a: 70, d: 76, e: '🪼' },
  { n: 'Tortuline', t: 'P', h: 58, a: 45, d: 62, e: '🐢' },
  { n: 'Tortaïga', t: 'P', h: 85, a: 62, d: 88, e: '🐢' },
  { n: 'Poissolune', t: 'E', h: 52, a: 56, d: 50, e: '🐟' },
  { n: 'Carpélune', t: 'E', h: 72, a: 74, d: 66, e: '🐠' },
  { n: 'Léviamar', t: 'E', h: 88, a: 86, d: 78, e: '🐉' },
  { n: 'Souffleron', t: 'F', h: 50, a: 58, d: 46, e: '🦎' },
  { n: 'Pyrosaure', t: 'F', h: 64, a: 70, d: 58, e: '🦎' },
  { n: 'Ignisaure', t: 'F', h: 80, a: 90, d: 70, e: '🐲' },
  { n: 'Cendrelle', t: 'F', h: 48, a: 54, d: 44, e: '🐤' },
  { n: 'Phénoxis', t: 'F', h: 82, a: 88, d: 68, e: '🦚' },
  { n: 'Charbouille', t: 'F', h: 52, a: 62, d: 48, e: '😈' },
  { n: 'Brasillard', t: 'F', h: 72, a: 82, d: 64, e: '👹' },
  { n: 'Bourgeon', t: 'P', h: 46, a: 50, d: 46, e: '🌱' },
  { n: 'Floraïde', t: 'P', h: 68, a: 66, d: 66, e: '🌺' },
  { n: 'Dryadelle', t: 'P', h: 78, a: 70, d: 76, e: '🧚' },
  { n: 'Lapinelle', t: 'P', h: 52, a: 54, d: 48, e: '🐰' },
  { n: 'Lièvrasol', t: 'P', h: 70, a: 76, d: 60, e: '🐇' },
  { n: 'Cactorne', t: 'P', h: 54, a: 56, d: 58, e: '🌵' },
  { n: 'Saguaron', t: 'P', h: 76, a: 72, d: 80, e: '🌵' },
  { n: 'Chatelune', t: 'N', h: 50, a: 56, d: 46, e: '🐱' },
  { n: 'Panthélune', t: 'N', h: 72, a: 84, d: 62, e: '🐆' },
  { n: 'Ourson', t: 'N', h: 58, a: 56, d: 54, e: '🧸' },
  { n: 'Ursagard', t: 'N', h: 88, a: 80, d: 84, e: '🐻' },
  { n: 'Cervinelle', t: 'N', h: 54, a: 50, d: 52, e: '🦌' },
  { n: 'Cervalor', t: 'N', h: 78, a: 72, d: 74, e: '🦌' },
  { n: 'Piquillon', t: 'N', h: 50, a: 52, d: 56, e: '🦔' },
  { n: 'Hérissor', t: 'N', h: 70, a: 70, d: 86, e: '🦔' },
  { n: 'Brumaillon', t: 'N', h: 72, a: 66, d: 72, e: '☁️' },
  { n: 'Piaillon', t: 'V', h: 46, a: 50, d: 44, e: '🐥' },
  { n: 'Faucelin', t: 'V', h: 62, a: 74, d: 56, e: '🦅' },
  { n: 'Rapacion', t: 'V', h: 80, a: 92, d: 68, e: '🦅' },
  { n: 'Papillux', t: 'V', h: 48, a: 52, d: 46, e: '🦋' },
  { n: 'Papilune', t: 'V', h: 70, a: 70, d: 66, e: '🦋' },
  { n: 'Mouettelin', t: 'V', h: 50, a: 54, d: 48, e: '🕊️' },
  { n: 'Albatros', t: 'V', h: 76, a: 78, d: 70, e: '🪽' },
  { n: 'Glaçonin', t: 'E', h: 52, a: 52, d: 54, e: '🐧' },
  { n: 'Manchorex', t: 'E', h: 80, a: 72, d: 84, e: '🐧' },
  { n: 'Scarabyte', t: 'N', h: 52, a: 54, d: 62, e: '🪲' },
  { n: 'Scarabor', t: 'N', h: 74, a: 76, d: 84, e: '🪲' },
  { n: 'Grenouillette', t: 'E', h: 50, a: 54, d: 48, e: '🐸' },
  { n: 'Crapaudor', t: 'E', h: 78, a: 74, d: 72, e: '🐸' },
  { n: 'Serpentine', t: 'P', h: 50, a: 58, d: 48, e: '🐍' },
  { n: 'Basilic', t: 'P', h: 76, a: 82, d: 74, e: '🐍' },
  { n: 'Aurélion', t: 'F', h: 100, a: 102, d: 92, e: '🔆' },
  { n: 'Abyssia', t: 'E', h: 104, a: 98, d: 96, e: '🌊' }
);
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
].forEach(([a, b, l]) => (SP[a].ev = [l, b]));

const A4 = maps.length,
  ORIM = A4 + 6;
maps.push(
  { n: 'Plage des Marées', e: { s: [44, 45, 39, 35, 42], l: [56, 59] } },
  { n: 'Port-Écume' },
  { n: 'Archipel de Corail', e: { s: [44, 46, 45, 35, 23], l: [59, 62] } },
  { n: 'Îlot des Vents' },
  { n: 'Marais des Murmures', e: { s: [46, 47, 48, 40, 36], l: [61, 64] } },
  { n: 'Brumevert' },
  { n: 'Voie des Étoiles', e: { s: [47, 48, 49, 41, 37], l: [63, 66] } }
);
const HK2 = [];
const TW4 = {
  [A4 + 1]: {
    b: [
      ['C', 4, 6, 5],
      ['H', 11, 6, 5],
      ['B', 24, 6, 7],
      ['K', 33, 6, 5],
      ['H', 4, 16, 5],
      ['H', 11, 16, 5],
      ['H', 24, 16, 5],
      ['H', 31, 16, 5]
    ],
    m: [17, 11],
    pond: [28, 24, 36, 25]
  },
  [A4 + 3]: {
    b: [
      ['B', 4, 6, 7],
      ['H', 12, 6, 5],
      ['C', 24, 6, 5],
      ['K', 31, 6, 5],
      ['H', 4, 16, 5],
      ['H', 11, 16, 5]
    ],
    m: [23, 11],
    pond: [22, 16, 35, 21]
  },
  [A4 + 5]: {
    b: [
      ['C', 4, 6, 5],
      ['K', 11, 6, 5],
      ['B', 24, 6, 7],
      ['H', 33, 6, 5],
      ['H', 4, 16, 5],
      ['H', 11, 16, 5],
      ['H', 24, 16, 5],
      ['H', 31, 16, 5]
    ],
    m: [17, 11],
    pond: [28, 24, 36, 25]
  }
};
const RT4 = {
  [A4]: [
    34,
    84,
    {
      px: 17,
      amp: 5,
      ph: 0.3,
      s: 27,
      tr: [66, 44],
      bridge: [34, 4],
      passes: [
        [54, 0],
        [16, 1]
      ],
      ponds: [
        [8, 56, 3, 2],
        [26, 24, 3, 2]
      ]
    }
  ],
  [A4 + 2]: [
    34,
    86,
    {
      px: 17,
      amp: 6,
      ph: 1.1,
      s: 29,
      tr: [68, 48, 28],
      bridge: [38, 4],
      passes: [
        [58, 1],
        [18, 0]
      ],
      ponds: [
        [26, 64, 5, 4],
        [7, 30, 3, 2]
      ]
    }
  ],
  [A4 + 4]: [
    34,
    88,
    {
      px: 17,
      amp: 6,
      ph: 2.3,
      s: 31,
      tr: [70, 56, 40],
      bridge: [48, 4],
      passes: [
        [62, 0],
        [28, 1],
        [14, 0]
      ],
      ponds: [
        [8, 70, 3, 2],
        [26, 20, 4, 3]
      ]
    }
  ],
  [A4 + 6]: [
    34,
    96,
    {
      px: 17,
      amp: 6,
      ph: 3.1,
      s: 33,
      tr: [84, 72, 60, 46, 32],
      boss: [8, 'Y'],
      td: 1.1,
      top: 10,
      noU: 1,
      passes: [
        [78, 1],
        [66, 0],
        [52, 1],
        [38, 0],
        [20, 1]
      ]
    }
  ]
};
for (const k in TW4) {
  maps[k].g = mkTown(TW4[k]);
  maps[k].px = 20;
  maps[k].sp = [20, 12];
  maps[k].tn = 1;
}
for (const k in RT4) {
  const [w, h, o] = RT4[k];
  maps[k].th = BIO[k];
  maps[k].g = mkRoute(w, h, Object.assign({ th: BIO[k] }, o));
  maps[k].px = o.px;
  maps[k].tr = o.tr;
  maps[k].sp = [o.px, h - 4];
  if (o.boss) maps[k].boss = o.boss[0];
}
maps[SOLM].g[0][maps[SOLM].px] = 'U';
{
  const ch = [36, A4, A4 + 1, A4 + 2, A4 + 3, A4 + 4, A4 + 5, A4 + 6];
  for (let i = 0; i < ch.length - 1; i++) {
    UP[ch[i]] = ch[i + 1];
    DN[ch[i + 1]] = ch[i];
  }
  ch.slice(1).forEach(k => CHAIN.push(k));
}
TP[A4] = [44, 45];
TP[A4 + 2] = [46, 35];
TP[A4 + 4] = [48, 36];
TP[A4 + 6] = [49, 41];
// quêtes secondaires génériques
const hid = () => Object.keys(G.q).filter(k => /^i\d/.test(k)).length;
const NQ = o => {
  const q = QS.length;
  QS.push([o.c, o.ask, o.ok, o.r]);
  if (o.m != null) NP.push({ m: o.m, e: o.e, x: o.x, y: o.y, q, st: 1, l: [o.ask] });
  SQ.push({
    id: 'h' + q,
    t: o.t,
    vis: () => G.vis.includes(o.vm),
    done: () => G.q['h' + q] == 2,
    obj: () => (o.c() ? o.ready : o.obj()),
    h: o.h,
    tg: () => (o.c() ? o.tg() : o.tg0 ? o.tg0() : null)
  });
  return q;
};
const npT = (m, x, y) => () => ({ m, xy: [x, y] });
const hS = s => () => G.party.some(c => c.s == s);
const sn = s => SP[s].n;
const QN = [
  {
    t: 'Le grand collectionneur',
    vm: 0,
    m: 0,
    x: 16,
    y: 13,
    e: '👦',
    c: () => G.dex.c.length >= 15,
    ask: 'Garçon : Je veux un bestiaire presque complet ! Capture 15 espèces différentes et je te récompense.',
    ok: 'Garçon : Quinze espèces ! Voici 5 Capsules et 500 ¥.',
    r: () => {
      G.balls += 5;
      G.gold += 500;
    },
    obj: () => `Capture 15 espèces différentes (${G.dex.c.length}/15).`,
    ready: 'Retourne voir le garçon sur la grand-rue de Brumeval.',
    h: [
      'Chaque espèce compte une fois : explore toutes les routes.',
      'Pêche aussi dans les mares, et sors la nuit pour les créatures nocturnes.'
    ],
    tg: npT(0, 16, 13)
  },
  {
    t: 'Le vieux boxeur',
    vm: 2,
    m: 2,
    x: 16,
    y: 13,
    e: '🧓',
    c: () => G.sx.wins >= 25,
    ask: 'Vieux boxeur : Gagne 25 combats et reviens me le dire. Je récompense les vrais dresseurs !',
    ok: 'Vieux boxeur : 25 victoires ! Voici 800 ¥ et 3 Super Potions.',
    r: () => {
      G.gold += 800;
      G.sp += 3;
    },
    obj: () => `Gagne 25 combats (${G.sx.wins}/25).`,
    ready: 'Retourne voir le vieux boxeur sur la grand-rue de Cendrebourg.',
    h: ['Les dresseurs de route comptent comme des victoires.', 'Les combats sauvages aussi !'],
    tg: npT(2, 16, 13)
  },
  {
    t: 'Pêcheur passionné',
    vm: 4,
    m: 4,
    x: 16,
    y: 13,
    e: '🧑‍🌾',
    c: () => (G.sx.fish || 0) >= 10,
    ask: "Pêcheur : Lance ta ligne 10 fois dans les mares et je t'offre une Pierre Marée !",
    ok: "Pêcheur : Tu as la patience d'un vrai pêcheur. Voici une Pierre Marée !",
    r: () => addI('pm'),
    obj: () => `Pêche 10 fois (${G.sx.fish || 0}/10).`,
    ready: 'Retourne voir le pêcheur sur la grand-rue de Lunargent.',
    h: ["Face à l'eau, appuie sur A pour pêcher.", 'Chaque lancer compte, même sans prise.'],
    tg: npT(4, 16, 13)
  },
  {
    t: 'La grande marche',
    vm: 15,
    m: 15,
    x: 16,
    y: 13,
    e: '👧',
    c: () => G.sx.steps >= 3000,
    ask: 'Randonneuse : Marche 3 000 pas dans la région et tu verras du pays !',
    ok: 'Randonneuse : Quelle endurance ! Voici 6 Capsules et 500 ¥.',
    r: () => {
      G.balls += 6;
      G.gold += 500;
    },
    obj: () => `Marche 3 000 pas (${G.sx.steps}/3000).`,
    ready: 'Retourne voir la randonneuse sur la grand-rue de Pierrefeu.',
    h: ['Chaque case parcourue compte comme un pas.', 'Les routes longues sont idéales.'],
    tg: npT(15, 16, 13)
  },
  {
    t: 'Chasseur de trésors',
    vm: 17,
    m: 17,
    x: 16,
    y: 13,
    e: '🧙',
    c: () => hid() >= 5,
    ask: 'Chasseur de trésors : Trouve 5 objets cachés ✨ et je te donne un cadeau !',
    ok: 'Chasseur de trésors : 5 trésors ! Voici 5 Super Potions.',
    r: () => (G.sp += 5),
    obj: () => `Trouve 5 objets cachés (${hid()}/5).`,
    ready: "Retourne voir le chasseur de trésors à Havre-d'Opale.",
    h: ['Les ✨ brillent doucement au sol.', 'La quête « Les objets cachés » indique le plus proche.'],
    tg: npT(17, 16, 13)
  },
  {
    t: 'La pierre du forgeron',
    vm: 24,
    m: 24,
    x: 16,
    y: 13,
    e: '👨',
    c: () => !!G.q.stone,
    ask: 'Forgeron : Fais évoluer une créature avec une pierre : je veux voir ça !',
    ok: 'Forgeron : Magnifique ! Voici 1 500 ¥ et une Pierre Ardente.',
    r: () => {
      G.gold += 1500;
      addI('pf');
    },
    obj: () => 'Fais évoluer une créature avec une pierre (colporteur de la Clairière Cachée).',
    ready: "Retourne voir le forgeron sur la grand-rue d'Ardenfeu.",
    h: [
      'Le colporteur de la Clairière Cachée (accès après le sceau noir) vend des pierres.',
      'Utilise la pierre depuis ☰ Menu → Sac.'
    ],
    tg: npT(24, 16, 13)
  },
  {
    t: "L'archiviste",
    vm: 26,
    m: 26,
    x: 16,
    y: 13,
    e: '🧓',
    c: () => G.dex.c.length >= 25,
    ask: 'Archiviste : Vingt-cinq espèces capturées ? Je paie bien pour un tel exploit.',
    ok: 'Archiviste : Bravo ! Voici une Lentille et 1 000 ¥.',
    r: () => {
      addI('lu');
      G.gold += 1000;
    },
    obj: () => `Capture 25 espèces (${G.dex.c.length}/25).`,
    ready: "Retourne voir l'archiviste à Cristalbourg.",
    h: ['Chaque nouvelle route ajoute de nouvelles espèces.', "Le Bestiaire montre ce qu'il te manque."],
    tg: npT(26, 16, 13)
  },
  {
    t: 'Le défi du capitaine',
    vm: 33,
    m: 33,
    x: 16,
    y: 13,
    e: '🧑‍🌾',
    c: () => G.party.some(c => c.lv >= 60),
    ask: "Capitaine : Montre-moi une créature de niveau 60 et je t'offre un trésor !",
    ok: 'Capitaine : Une vraie championne ! Voici 3 000 ¥ et 5 Super Potions.',
    r: () => {
      G.gold += 3000;
      G.sp += 5;
    },
    obj: () => 'Amène une créature au niveau 60.',
    ready: 'Retourne voir le capitaine à Soleilmer.',
    h: ["Les Sentinelles solaires donnent beaucoup d'expérience.", "Les dresseurs de l'archipel aussi."],
    tg: npT(33, 16, 13)
  },
  {
    t: 'Les cartes du ciel',
    vm: 35,
    m: 35,
    x: 16,
    y: 13,
    e: '👵',
    c: () => G.dex.c.length >= 30,
    ask: 'Vieille cartographe : Trente espèces capturées, et je te donne ma plus belle baie !',
    ok: 'Vieille cartographe : Merveilleux ! Voici une Baie, 5 Capsules et 2 500 ¥.',
    r: () => {
      addI('ba');
      G.balls += 5;
      G.gold += 2500;
    },
    obj: () => `Capture 30 espèces (${G.dex.c.length}/30).`,
    ready: 'Retourne voir la cartographe à Aubecime.',
    h: ["Les routes de l'aube cachent de nouvelles espèces.", 'Pense à pêcher dans les récifs.'],
    tg: npT(35, 16, 13)
  },
  {
    t: 'Un Corallin pour le port',
    vm: A4 + 1,
    m: A4 + 1,
    x: 16,
    y: 13,
    e: '🧑‍🌾',
    c: hS(44),
    ask: "Marin : Un Corallin ! Ils vivent sur la Plage des Marées. Rapporte-m'en un !",
    ok: 'Marin : Un Corallin ! Voici 4 000 ¥.',
    r: () => (G.gold += 4000),
    obj: () => `Attrape un ${sn(44)} dans les hautes herbes de la Plage des Marées.`,
    ready: 'Rapporte ton Corallin au marin de Port-Écume.',
    h: ["Les Corallin vivent dans l'herbe de la Plage des Marées et de l'Archipel de Corail."],
    tg: npT(A4 + 1, 16, 13),
    tg0: () => ({ m: A4, ch: 'g' })
  },
  {
    t: 'Un Ventalis pour les vents',
    vm: A4 + 3,
    m: A4 + 3,
    x: 16,
    y: 13,
    e: '👧',
    c: hS(45),
    ask: "Fillette : Je rêve d'un Ventalis, ce cerf-volant vivant !",
    ok: 'Fillette : Un Ventalis ! Voici 4 000 ¥ et 4 Super Potions.',
    r: () => {
      G.gold += 4000;
      G.sp += 4;
    },
    obj: () => `Attrape un ${sn(45)} sur la Plage des Marées ou l'Archipel de Corail.`,
    ready: "Rapporte ton Ventalis à la fillette de l'Îlot des Vents.",
    h: ["Les Ventalis volent dans l'herbe des deux premières routes de l'archipel."],
    tg: npT(A4 + 3, 16, 13),
    tg0: () => ({ m: A4, ch: 'g' })
  },
  {
    t: 'Un Brumelin pour le marais',
    vm: A4 + 5,
    m: A4 + 5,
    x: 16,
    y: 13,
    e: '🧙',
    c: hS(46),
    ask: "Sage du marais : Un Brumelin respire la brume… Attrape-m'en un !",
    ok: 'Sage du marais : Merveilleux ! Voici 4 500 ¥.',
    r: () => (G.gold += 4500),
    obj: () => `Attrape un ${sn(46)} dans l'Archipel de Corail ou le Marais des Murmures.`,
    ready: 'Rapporte ton Brumelin au sage de Brumevert.',
    h: ["Les Brumelin vivent dans l'herbe de l'Archipel de Corail et du Marais."],
    tg: npT(A4 + 5, 16, 13),
    tg0: () => ({ m: A4 + 4, ch: 'g' })
  },
  {
    t: 'Un Phareur pour le phare',
    vm: A4 + 1,
    m: A4 + 1,
    x: 26,
    y: 13,
    e: '👨',
    c: hS(47),
    ask: "Gardien du phare : Un Phareur éclaire la nuit… Attrape-m'en un dans le marais !",
    ok: 'Gardien du phare : Un Phareur ! Voici 4 000 ¥ et 6 Capsules.',
    r: () => {
      G.gold += 4000;
      G.balls += 6;
    },
    obj: () => `Attrape un ${sn(47)} dans le Marais des Murmures ou la Voie des Étoiles.`,
    ready: 'Rapporte ton Phareur au gardien du phare de Port-Écume.',
    h: ["Les Phareur vivent dans l'herbe du Marais des Murmures."],
    tg: npT(A4 + 1, 26, 13),
    tg0: () => ({ m: A4 + 4, ch: 'g' })
  },
  {
    t: 'Une Mirelune pour la marée',
    vm: A4 + 3,
    m: A4 + 3,
    x: 26,
    y: 13,
    e: '🧓',
    c: hS(48),
    ask: 'Vieux marin : Une Mirelune brille comme une perle. Si tu en trouves une, je serai comblé !',
    ok: 'Vieux marin : Une Mirelune ! Voici 4 000 ¥ et 4 Super Potions.',
    r: () => {
      G.gold += 4000;
      G.sp += 4;
    },
    obj: () => `Attrape une ${sn(48)} dans le Marais des Murmures ou la Voie des Étoiles.`,
    ready: "Rapporte ta Mirelune au vieux marin de l'Îlot des Vents.",
    h: ["Les Mirelune vivent dans l'herbe du Marais et de la Voie des Étoiles."],
    tg: npT(A4 + 3, 26, 13),
    tg0: () => ({ m: A4 + 4, ch: 'g' })
  },
  {
    t: "L'étoile Orionyx",
    vm: A4 + 5,
    m: A4 + 5,
    x: 26,
    y: 13,
    e: '👵',
    c: hS(49),
    ask: "Astronome : L'Orionyx ne vit que sous la Voie des Étoiles. Capture-le, je t'en supplie !",
    ok: 'Astronome : Un Orionyx ! Voici 6 000 ¥ et une Lentille.',
    r: () => {
      G.gold += 6000;
      addI('lu');
    },
    obj: () => `Attrape un ${sn(49)} sur la Voie des Étoiles.`,
    ready: "Rapporte ton Orionyx à l'astronome de Brumevert.",
    h: ["La Voie des Étoiles est la dernière route, tout au nord de l'archipel."],
    tg: npT(A4 + 5, 26, 13),
    tg0: () => ({ m: A4 + 6, ch: 'g' })
  },
  {
    t: 'Niveau 65 pour la cabane du phare',
    vm: A4 + 1,
    c: () => G.party.some(c => c.lv >= 65),
    ask: "Gardien : Reviens quand l'une de tes créatures aura atteint le niveau 65.",
    ok: 'Gardien : Niveau 65 ! Voici 5 Super Potions et 3 000 ¥.',
    r: () => {
      G.sp += 5;
      G.gold += 3000;
    },
    obj: () => 'Amène une créature au niveau 65, puis va à la cabane du phare.',
    ready: 'Retourne à la cabane du phare de Port-Écume.',
    h: ["Les marins de l'archipel donnent beaucoup d'expérience."],
    tg: () => ({ m: A4 + 1, ch: 'K', inn: HK2[0] }),
    tg0: () => null,
    house: 0
  },
  {
    t: 'Cent victoires',
    vm: A4 + 3,
    c: () => G.sx.wins >= 100,
    ask: 'Vieille sage : Reviens quand tu auras gagné 100 combats.',
    ok: 'Vieille sage : Cent victoires ! Voici 5 000 ¥.',
    r: () => (G.gold += 5000),
    obj: () => `Gagne 100 combats (${G.sx.wins}/100).`,
    ready: "Retourne à la maison des vents de l'Îlot des Vents.",
    h: ['Les combats de la Ligue et du Palais comptent aussi.'],
    tg: () => ({ m: A4 + 3, ch: 'K', inn: HK2[1] }),
    tg0: () => null,
    house: 1
  },
  {
    t: 'Le grand bestiaire',
    vm: A4 + 5,
    c: () => G.dex.c.length >= 40,
    ask: 'Ermite : Quarante espèces capturées, voilà un vrai savant. Reviens me voir alors.',
    ok: 'Ermite : Quarante espèces ! Voici 8 000 ¥ et une Écaille.',
    r: () => {
      G.gold += 8000;
      addI('ec');
    },
    obj: () => `Capture 40 espèces (${G.dex.c.length}/40).`,
    ready: 'Retourne à la hutte des brumes de Brumevert.',
    h: ["Complète les routes de l'archipel et pêche beaucoup."],
    tg: () => ({ m: A4 + 5, ch: 'K', inn: HK2[2] }),
    tg0: () => null,
    house: 2
  }
];
const QN0 = QS.length;
QN.forEach(o => {
  const q = NQ(o);
  if (o.house != null) {
    HK2.push(maps.length);
    I('home', ['Cabane du phare', 'Maison des vents', 'Hutte des brumes'][o.house], g => {
      rect(g, 2, 1, 4, 1, 's');
      g[3][11] = 'N';
      g[4][10] = g[4][12] = 'k';
      g[3][2] = g[4][2] = 'b';
      g[1][12] = 'p';
    });
    maps[maps.length - 1].q = q;
  }
});
// arènes, rival, scénario
GY[A4 + 1] = {
  n: 'Perle',
  i: 9,
  t: [
    [44, 58],
    [39, 59],
    [35, 60],
    [23, 60],
    [10, 62]
  ],
  h: "Je suis Perle, gardienne du port d'Écume. Les vagues m'obéissent !",
  w: [
    'Perle : Splendide ! Voici le Badge Écume.',
    "Perle : L'Archipel de Corail est au nord. Les marins y sont coriaces."
  ]
};
GY[A4 + 3] = {
  n: 'Aéris',
  i: 10,
  t: [
    [45, 61],
    [42, 62],
    [12, 62],
    [25, 63],
    [30, 64]
  ],
  h: "Je suis Aéris, reine des vents de l'îlot. Tiens-toi bien !",
  w: [
    'Aéris : Quel souffle ! Voici le Badge Rafale.',
    "Aéris : Le Marais des Murmures t'attend, plus au nord. Brumevert garde une arène."
  ]
};
GY[A4 + 5] = {
  n: 'Sylvane',
  i: 11,
  t: [
    [46, 64],
    [40, 64],
    [36, 65],
    [32, 65],
    [24, 66],
    [19, 66]
  ],
  h: 'Je suis Sylvane, gardienne des brumes. Peu de dresseurs sortent du marais !',
  w: [
    'Sylvane : Impressionnant. Voici le Badge Brume.',
    "Sylvane : La Voie des Étoiles est ouverte. Maître Orion t'y attend."
  ]
};
NOA[A4 + 1] = [
  60,
  'n10',
  "Noa : Port-Écume ! J'ai pris le ferry avant toi. Un duel avant l'arène de Perle ?",
  "Noa : Toujours aussi fort ! Je pars pour l'Archipel de Corail."
];
NOA[A4 + 3] = [
  63,
  'n11',
  "Noa : L'Îlot des Vents ! Les bourrasques m'ont presque emporté. On se bat ?",
  'Noa : Incroyable. Je te retrouve au Marais des Murmures.'
];
NOA[A4 + 5] = [
  65,
  'n12',
  "Noa : Brumevert… la brume est épaisse. Un duel pour s'échauffer ?",
  "Noa : Je t'attends au pied de la Voie des Étoiles."
];
NOA[ORIM] = [
  68,
  'n13',
  "Noa : Voici la Voie des Étoiles. Ici s'achève notre voyage. Un dernier duel, pour de vrai !",
  'Noa : Merci pour tout, {J}. Va affronter Maître Orion !'
];
{
  const n = CH_N.indexOf("Après l'aventure");
  CH_N.splice(n, 0, "L'archipel des étoiles");
  STORY.forEach(x => {
    if (x.c >= n) x.c++;
  });
  const li = STORY.findIndex(x => x.t == 'La Ligue');
  STORY.splice(
    li,
    0,
    {
      c: n,
      t: "Cap sur l'archipel",
      obj: 'Depuis le sommet du Sanctuaire solaire, franchis le ciel ouvert et rejoins Port-Écume.',
      h: [
        "Après Aurion, une sortie s'ouvre tout en haut du Sanctuaire solaire.",
        "Suis la Plage des Marées jusqu'à Port-Écume."
      ],
      done: () => G.vis.includes(A4 + 1),
      m: A4 + 1,
      ch: null
    },
    {
      c: n,
      t: 'Arène de Port-Écume',
      obj: "Bats Perle à l'arène de Port-Écume (badge 9).",
      h: ["L'arène est le grand bâtiment à droite en haut.", "Perle utilise l'Eau : la Plante est efficace."],
      done: () => G.badge >= 9,
      m: A4 + 1,
      ch: 'B',
      inn: 9
    },
    {
      c: n,
      t: "L'Archipel de Corail",
      obj: "Traverse l'Archipel de Corail jusqu'à l'Îlot des Vents.",
      h: ['Il faut 9 badges pour franchir la sortie nord de Port-Écume.'],
      done: () => G.f.n11,
      m: A4 + 3,
      ch: null
    },
    {
      c: n,
      t: "Arène de l'Îlot des Vents",
      obj: "Bats Aéris à l'arène de l'Îlot des Vents (badge 10).",
      h: [
        "L'arène est le grand bâtiment à gauche en haut.",
        "Aéris utilise le Vol : le Feu et l'Eau tiennent bon."
      ],
      done: () => G.badge >= 10,
      m: A4 + 3,
      ch: 'B',
      inn: 9
    },
    {
      c: n,
      t: 'Le Marais des Murmures',
      obj: "Passe par le Marais des Murmures jusqu'à Brumevert.",
      h: ["Il faut 10 badges pour franchir la sortie nord de l'Îlot."],
      done: () => G.f.n12,
      m: A4 + 5,
      ch: null
    },
    {
      c: n,
      t: 'Arène de Brumevert',
      obj: "Bats Sylvane à l'arène de Brumevert (badge 11).",
      h: [
        "L'arène est le grand bâtiment à droite en haut.",
        'Sylvane utilise la Plante : le Feu et le Vol sont efficaces.'
      ],
      done: () => G.badge >= 11,
      m: A4 + 5,
      ch: 'B',
      inn: 9
    },
    {
      c: n,
      t: 'La Voie des Étoiles',
      obj: 'Gravis la Voie des Étoiles et affronte Maître Orion.',
      h: [
        'Il faut 11 badges pour entrer sur la Voie des Étoiles.',
        'Cinq marins gardent la route, puis Maître Orion tout en haut.'
      ],
      done: () => G.f.o4,
      m: ORIM,
      ch: 'Y'
    }
  );
}
SQ.push({
  id: 'ast',
  t: "Astraël, l'étoile du soir",
  vis: () => !!G.f.o4,
  done: () => G.dex.c.includes(50),
  obj: () => 'Retourne au sommet de la Voie des Étoiles et capture Astraël.',
  h: [
    'Astraël apparaît sur la dalle, après Maître Orion.',
    'Affaiblis-le sans le mettre K.O. et lance beaucoup de Capsules.'
  ],
  tg: () => ({ m: ORIM, ch: 'Y' })
});
NP.push(
  {
    m: A4 + 1,
    e: '🧑‍🌾',
    x: 10,
    y: 13,
    l: [
      "Marin : Port-Écume est le dernier port avant l'archipel.",
      'Marin : Les Corallin adorent les plages.'
    ]
  },
  {
    m: A4 + 3,
    e: '🧓',
    x: 10,
    y: 13,
    l: [
      "Vieux vent : À l'Îlot des Vents, rien n'arrête une bourrasque.",
      'Vieux vent : Aéris vole plus vite que toi, crois-moi.'
    ]
  },
  {
    m: A4 + 3,
    e: '👦',
    x: 30,
    y: 13,
    l: ['Garçon : Le Marais des Murmures est plein de brume. Prends des Super Potions !']
  },
  {
    m: A4 + 5,
    e: '👧',
    x: 10,
    y: 13,
    l: [
      "Fillette : On dit qu'une étoile tombe parfois sur la Voie des Étoiles.",
      'Fillette : Maître Orion la garde.'
    ]
  },
  {
    m: A4 + 5,
    e: '🧙',
    x: 30,
    y: 13,
    l: ['Vieux sage : Astraël dort sous les étoiles du soir. Il ne se réveille que pour les plus forts.']
  }
);
WN2.push(
  ...[
    [36, 70, 505, 'Sanctuaire solaire'],
    [A4, 140, 445, 'Plage des Marées'],
    [A4 + 1, 226, 402, 'Port-Écume', 1],
    [A4 + 2, 300, 342, 'Archipel de Corail'],
    [A4 + 3, 350, 272, 'Îlot des Vents', 1],
    [A4 + 4, 290, 200, 'Marais des Murmures'],
    [A4 + 5, 208, 150, 'Brumevert', 1],
    [A4 + 6, 128, 86, 'Voie des Étoiles']
  ]
);
WN2.forEach(x => {});
for (let i = 0; i < 7; i++) WE.push([i ? A4 + i - 1 : 36, A4 + i]);
Object.assign(WI, {
  [A4]: ['Niveaux 56 à 59', 'La plage au nord du Sanctuaire : Corallin, Ventalis.'],
  [A4 + 1]: ['Arène de Perle (Eau)', "Port de l'archipel : centre, boutique, cabane du phare."],
  [A4 + 2]: ['Niveaux 59 à 62', 'Des îlots, des ponts et des marins.'],
  [A4 + 3]: ["Arène d'Aéris (Vol)", 'Île venteuse : centre, boutique, maison des vents.'],
  [A4 + 4]: ['Niveaux 61 à 64', 'Un marais brumeux plein de créatures rares.'],
  [A4 + 5]: ['Arène de Sylvane (Plante)', 'Village de brume : centre, boutique, hutte des brumes.'],
  [A4 + 6]: ['Niveaux 63 à 66', "Maître Orion garde la dalle d'Astraël tout en haut."]
});
{
  const D = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  [
    [19, A4, [24, 50], 'sp', 3],
    [20, A4 + 2, [9, 30], 'balls', 5],
    [21, A4 + 4, [26, 60], 'sp', 3],
    [22, A4 + 6, [10, 70], 'gold', 1200]
  ].forEach(([id, m, p, t, n]) => {
    const g = maps[m].g,
      sp = maps[m].sp,
      seen = new Set([sp[0] + ',' + sp[1]]),
      q = [[sp[0], sp[1]]];
    while (q.length) {
      const [x, y] = q.shift();
      for (const [dx, dy] of D) {
        const nx = x + dx,
          ny = y + dy,
          c = g[ny]?.[nx];
        if (!c || seen.has(nx + ',' + ny) || SOLID.includes(c)) continue;
        seen.add(nx + ',' + ny);
        q.push([nx, ny]);
      }
    }
    let best = null,
      bd = 1e9;
    for (const k of seen) {
      const [x, y] = k.split(',').map(Number);
      if (!'._=f'.includes(g[y][x])) continue;
      const d = (x - p[0]) ** 2 + (y - p[1]) ** 2;
      if (d < bd) {
        bd = d;
        best = [x, y];
      }
    }
    ITM.push({ id, m, x: best[0], y: best[1], t, n });
  });
}
function orion() {
  if (G.f.o4) {
    if (G.dex.c.includes(50) || G.busyS) return;
    return say(['Une étoile filante se pose sur la dalle… Astraël est de retour !'], async () => {
      const r = await battle([mkC(50, 66)], null, true);
      save();
    });
  }
  if (!G.f.n13) return say(["Un rideau d'étoiles t'empêche d'avancer : quelqu'un t'attend plus bas."]);
  sayB(
    [
      'Orion : Tu as traversé les îles, les brumes et mes marins…',
      'Orion : Je suis Orion, maître des étoiles. Peu de dresseurs voient Astraël !',
      'Orion : Montre-moi que ton lien avec tes créatures brille plus que le ciel !'
    ],
    async () => {
      const r = await battle(
        [mkC(44, 63), mkC(45, 63), mkC(46, 64), mkC(47, 64), mkC(48, 65), mkC(49, 68)],
        'Orion',
        false,
        true
      );
      if (r == 'win') {
        G.f.o4 = 1;
        G.gold += 12000;
        save();
        say(
          [
            "Orion : Magnifique… Les étoiles elles-mêmes s'inclinent.",
            "Orion : Astraël, vois ce dresseur ! Le ciel l'a choisi.",
            'Une étoile filante descend vers toi…'
          ],
          async () => {
            const r2 = await battle([mkC(50, 66)], null, true);
            save();
            say(['Orion : Capturé ou non, le ciel est à toi, {J}.', "— L'ARCHIPEL DES ÉTOILES —"], credits4);
          }
        );
      }
    }
  );
}
function credits4() {
  panel(
    `<h3>🌌 L'ARCHIPEL DES ÉTOILES</h3><p>Tu as vaincu Maître Orion, {J}. Onze badges, trois arènes d'archipel et une étoile dans ton Bestiaire.</p><p>⏱ ${fmt(G.sx.time)} · ⚔ ${G.sx.wins} victoires · 📖 ${G.dex.s.length}/${SP.length} vus · 🎯 ${G.dex.c.length} capturés</p><p>Il reste la Ligue, le Palais de combat, les nombreuses quêtes annexes, la Clairière Cachée et le Bestiaire à compléter. Merci d'avoir joué !</p>`
  );
}
function fishC() {
  const E = maps[G.map].e,
    idx = CHAIN.indexOf(G.map),
    lv = Math.max(3, E ? E.l[0] : Math.min(66, Math.round(4 + Math.max(0, idx) * 1.9))),
    pool = [6, 1].concat(
      lv >= 20 ? [10, 23] : [],
      lv >= 35 ? [18, 28] : [],
      lv >= 50 ? [35, 39] : [],
      lv >= 56 ? [44] : []
    );
  return mkC(pool[Math.floor(Math.random() * pool.length)], lv);
}
ACH.push(
  ['Onze badges', 'Obtenir les 11 badges', () => G.badge >= 11],
  ['Maître des étoiles', 'Vaincre Orion', () => G.f.o4],
  ['Gardien étoilé', 'Capturer Astraël', () => G.dex.c.includes(50)],
  ["Voyageur de l'archipel", 'Visiter la Voie des Étoiles', () => G.vis.includes(ORIM)],
  ['Bon voisin', 'Terminer 10 quêtes annexes', () => QS.filter((q, i) => G.q['h' + i] == 2).length >= 10],
  ['Centurion', 'Gagner 100 combats', () => G.sx.wins >= 100]
);
