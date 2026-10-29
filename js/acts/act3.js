// Acte III : l'Aube dorée
// ---------- ACTE III : l'Aube dorée ----------
SP.push(
  { n: 'Soleron', t: 'F', h: 68, a: 78, d: 62, e: '🌞' },
  { n: 'Marinel', t: 'E', h: 74, a: 64, d: 78, e: '🐚' },
  { n: 'Brindor', t: 'P', h: 72, a: 70, d: 72, e: '🌾' },
  { n: 'Nébulor', t: 'N', h: 70, a: 74, d: 70, e: '🌫️' },
  { n: 'Aubaigle', t: 'V', h: 66, a: 82, d: 58, e: '🕊️' },
  { n: 'Solaris', t: 'F', h: 95, a: 95, d: 85, e: '☀️' }
);
const SOLM = 36,
  A3 = maps.length;
maps.push(
  { n: "Chemin de l'Aube", e: { s: [38, 40, 42, 31, 29], l: [48, 52] } },
  { n: 'Soleilmer' },
  { n: "Récifs d'Opale", e: { s: [39, 41, 42, 30, 32], l: [52, 55] } },
  { n: 'Aubecime' },
  { n: 'Sanctuaire solaire', e: { s: [38, 39, 40, 41, 42, 33], l: [54, 57] } }
);
const HK = [];
[7, 8].forEach(q => {
  HK.push(maps.length);
  I('home', ['Maison des marées', "Maison de l'aube"][q - 7], g => {
    rect(g, 2, 1, 4, 1, 's');
    g[3][11] = 'N';
    g[4][10] = g[4][12] = 'k';
    g[3][2] = g[4][2] = 'b';
    g[1][12] = 'p';
  });
  maps[maps.length - 1].q = q;
});
const TW3 = {
  33: {
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
  35: {
    b: [
      ['B', 4, 6, 7],
      ['H', 12, 6, 5],
      ['C', 24, 6, 5],
      ['K', 31, 6, 5],
      ['H', 4, 16, 5],
      ['H', 11, 16, 5],
      ['H', 24, 16, 5]
    ],
    m: [23, 11],
    pond: [22, 16, 35, 21]
  }
};
const RT3 = {
  32: [
    34,
    82,
    {
      px: 17,
      amp: 5,
      ph: 0.7,
      s: 21,
      tr: [60, 36],
      bridge: [46, 4],
      passes: [
        [52, 0],
        [20, 1]
      ],
      ponds: [[8, 64, 3, 2]]
    }
  ],
  34: [
    34,
    84,
    {
      px: 17,
      amp: 6,
      ph: 1.4,
      s: 23,
      tr: [66, 44, 24],
      bridge: [34, 4],
      passes: [
        [56, 1],
        [16, 0]
      ],
      ponds: [
        [26, 60, 5, 4],
        [7, 30, 3, 2]
      ]
    }
  ],
  36: [
    34,
    94,
    {
      px: 17,
      amp: 6,
      ph: 2.6,
      s: 25,
      tr: [80, 68, 56, 42, 28],
      boss: [8, 'Y'],
      td: 1.1,
      top: 10,
      noU: 1,
      passes: [
        [74, 1],
        [62, 0],
        [48, 1],
        [34, 0],
        [18, 1]
      ]
    }
  ]
};
for (const k in TW3) {
  maps[k].g = mkTown(TW3[k]);
  maps[k].px = 20;
  maps[k].sp = [20, 12];
  maps[k].tn = 1;
}
for (const k in RT3) {
  const [w, h, o] = RT3[k];
  maps[k].th = BIO[k];
  maps[k].g = mkRoute(w, h, Object.assign({ th: BIO[k] }, o));
  maps[k].px = o.px;
  maps[k].tr = o.tr;
  maps[k].sp = [o.px, h - 4];
  if (o.boss) maps[k].boss = o.boss[0];
}
maps[28].g[0][maps[28].px] = 'U';
Object.assign(UP, { 28: 32, 32: 33, 33: 34, 34: 35, 35: 36 });
for (const k of [28, 32, 33, 34, 35]) DN[UP[k]] = +k;
TP[32] = [38, 40];
TP[34] = [41, 42];
TP[36] = [39, 33];
CHAIN.push(32, 33, 34, 35, 36);
CH_N.splice(6, 0, "L'Aube dorée");
STORY.forEach(x => {
  if (x.c == 6) x.c = 7;
});
const li = STORY.findIndex(x => x.t == 'La Ligue');
STORY.splice(
  li,
  0,
  {
    c: 6,
    t: "Le Chemin de l'Aube",
    obj: "Au nord de la Citadelle, une lueur dorée s'est ouverte : suis le Chemin de l'Aube jusqu'à Soleilmer.",
    h: [
      "Monte au nord de la Citadelle d'Éclipse : la barrière d'ombre a disparu.",
      "Soleilmer est au bout du Chemin de l'Aube, après un pont et des défilés."
    ],
    done: () => G.f.n7,
    m: 33,
    ch: null
  },
  {
    c: 6,
    t: 'Arène de Soleilmer',
    obj: "Bats Aurore à l'arène de Soleilmer (badge 7).",
    h: [
      "L'arène est le grand bâtiment à droite en haut.",
      "Aurore utilise la Plante et le Vol : le Feu bat ses Plantes, l'Eau ses Vols."
    ],
    done: () => G.badge >= 7,
    m: 33,
    ch: 'B',
    inn: 9
  },
  {
    c: 6,
    t: "Les Récifs d'Opale",
    obj: "Passe par les Récifs d'Opale jusqu'à Aubecime.",
    h: [
      'Il faut 7 badges pour franchir la sortie nord de Soleilmer.',
      'Aubecime est au bout des récifs, après un pont.'
    ],
    done: () => G.f.n8,
    m: 35,
    ch: null
  },
  {
    c: 6,
    t: "Arène d'Aubecime",
    obj: "Bats Zénith à l'arène d'Aubecime (badge 8).",
    h: [
      "L'arène est le grand bâtiment à gauche en haut.",
      "Zénith utilise l'Eau et le Normal : la Plante est efficace."
    ],
    done: () => G.badge >= 8,
    m: 35,
    ch: 'B',
    inn: 9
  },
  {
    c: 6,
    t: 'Le Sanctuaire solaire',
    obj: "Gravis le Sanctuaire solaire et affronte Aurion, le gardien de l'aube.",
    h: [
      'Il faut 8 badges pour entrer dans le Sanctuaire.',
      'Cinq sentinelles gardent la route, puis Aurion tout en haut.'
    ],
    done: () => G.f.s3,
    m: 36,
    ch: 'Y'
  }
);
CH_N.length;
GY[33] = {
  n: 'Aurore',
  i: 7,
  t: [
    [40, 52],
    [42, 53],
    [38, 53],
    [41, 54]
  ],
  h: "Je suis Aurore, gardienne des premières lueurs ! Tu n'as encore rien vu de l'aube !",
  w: [
    'Aurore : Éblouissant ! Voici le Badge Aurore.',
    "Aurore : Les Récifs d'Opale sont au nord. Fais attention aux Sentinelles solaires."
  ]
};
GY[35] = {
  n: 'Zénith',
  i: 8,
  t: [
    [39, 55],
    [41, 56],
    [42, 56],
    [38, 56],
    [40, 57]
  ],
  h: 'Je suis Zénith, maître du plus haut soleil. Peu atteignent mon arène !',
  w: [
    'Zénith : Incroyable ! Voici le Badge Zénith.',
    "Zénith : Le Sanctuaire solaire t'attend. Aurion garde l'ultime secret de l'aube."
  ]
};
NOA[33] = [
  52,
  'n7',
  "Noa : Soleilmer ! Je savais que tu viendrais. Un duel avant l'arène d'Aurore ?",
  'Noa : Toujours aussi fort… Je continue vers les Récifs. À bientôt !'
];
NOA[35] = [
  56,
  'n8',
  "Noa : Aubecime ! Plus qu'une étape avant le Sanctuaire. Montre-moi ta force !",
  'Noa : Je te laisse monter seul au Sanctuaire. Fais-moi honneur !'
];
NOA[36] = [
  58,
  'n9',
  "Noa : Le Sanctuaire solaire… Je voulais te faire un dernier duel ici, au pied de l'aube.",
  'Noa : Merci pour tout, {J}. Va affronter Aurion !'
];
NP.push(
  {
    m: 33,
    e: '🧑‍🌾',
    x: 10,
    y: 13,
    l: [
      "Pêcheur : Soleilmer est la première ville touchée par l'aube.",
      "Pêcheur : On dit que les Récifs d'Opale cachent de curieuses créatures marines."
    ]
  },
  {
    m: 33,
    e: '👵',
    x: 30,
    y: 13,
    l: [
      'Vieille femme : Le Sanctuaire solaire abrite un gardien nommé Aurion.',
      'Vieille femme : Il faut huit badges pour le voir.'
    ]
  },
  {
    m: 35,
    e: '🧓',
    x: 10,
    y: 13,
    l: [
      'Ermite : Au sommet du sanctuaire, une créature dorée veille depuis des siècles.',
      "Ermite : Elle ne se montre qu'à ceux qui ont vaincu Aurion."
    ]
  },
  {
    m: 35,
    e: '👦',
    x: 30,
    y: 13,
    l: [
      "Garçon : Solaris ! Les enfants de la région racontent qu'il est rapide comme le soleil.",
      'Garçon : Prépare beaucoup de Capsules.'
    ]
  }
);
QS.push(
  [
    () => G.party.some(x => x.s == 38),
    "Un Soleron… Rapporte-m'en un des herbes du Chemin de l'Aube !",
    'Un Soleron ! Merci, voici 2 000 💰.',
    () => (G.gold += 2000)
  ],
  [
    () => G.party.some(x => x.lv >= 50),
    "Reviens quand l'une de tes créatures aura atteint le niveau 50.",
    'Niveau 50 ! Prends ces 10 Super Potions.',
    () => (G.sp += 10)
  ]
);
SQ.push(
  {
    id: 'h7',
    t: 'Un Soleron pour la maison des marées',
    vis: () => G.vis.includes(33),
    done: () => G.q.h7 == 2,
    obj: () =>
      hasS(38)
        ? 'Rapporte ton Soleron à la maison des marées de Soleilmer.'
        : "Attrape un Soleron dans les hautes herbes du Chemin de l'Aube.",
    h: [
      "Les Soleron vivent dans l'herbe du Chemin de l'Aube.",
      'La maison des marées est la maison brune ⌂ à droite de Soleilmer.'
    ],
    tg: () => (hasS(38) ? { m: 33, ch: 'K', inn: HK[0] } : { m: 32, ch: 'g' })
  },
  {
    id: 'h8',
    t: "Niveau 50 pour la maison de l'aube",
    vis: () => G.vis.includes(35),
    done: () => G.q.h8 == 2,
    obj: () =>
      G.party.some(c => c.lv >= 50)
        ? "Retourne à la maison de l'aube d'Aubecime."
        : "Amène une créature au niveau 50, puis va à la maison de l'aube.",
    h: [
      "Les Sentinelles solaires donnent beaucoup d'expérience.",
      "La maison de l'aube est la maison brune ⌂ à droite d'Aubecime."
    ],
    tg: () => (G.party.some(c => c.lv >= 50) ? { m: 35, ch: 'K', inn: HK[1] } : null)
  },
  {
    id: 'sol',
    t: 'Solaris, le gardien doré',
    vis: () => !!G.f.s3,
    done: () => G.dex.c.includes(43),
    obj: () => 'Retourne au sommet du Sanctuaire solaire et capture Solaris.',
    h: [
      'Solaris apparaît sur la dalle du Sanctuaire, après Aurion.',
      'Affaiblis-le sans le mettre K.O. et lance beaucoup de Capsules.'
    ],
    tg: () => ({ m: 36, ch: 'Y' })
  }
);
WN.push(
  [32, 404, 396, "Chemin de l'Aube"],
  [33, 356, 440, 'Soleilmer', 1],
  [34, 296, 480, "Récifs d'Opale"],
  [35, 232, 508, 'Aubecime', 1],
  [36, 166, 524, 'Sanctuaire solaire']
);
WE.push([28, 32], [32, 33], [33, 34], [34, 35], [35, 36]);
Object.assign(WI, {
  32: ['Niveaux 48 à 52', 'Un chemin doré au nord de la Citadelle.'],
  33: ["Arène d'Aurore (Plante / Vol)", "Ville de l'aube : centre, boutique, maison des marées."],
  34: ['Niveaux 52 à 55', 'Des récifs, des ponts et des Sentinelles solaires.'],
  35: ['Arène de Zénith (Eau / Normal)', "Ville du zénith : centre, boutique, maison de l'aube."],
  36: ['Niveaux 54 à 57', 'Aurion garde la dalle de Solaris tout en haut.']
});
{
  const D = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  [
    [16, 32, [24, 50]],
    [17, 34, [9, 30]],
    [18, 36, [26, 60]]
  ].forEach(([id, m, p]) => {
    const g = maps[m].g,
      sp = maps[m].sp,
      seen = new Set([sp[0] + ',' + sp[1]]),
      q = [[sp[0], sp[1]]];
    while (q.length) {
      const [x, y] = q.shift();
      for (const [dx, dy] of D) {
        const nx = x + dx,
          ny = y + dy,
          t = g[ny]?.[nx];
        if (!t || seen.has(nx + ',' + ny) || SOLID.includes(t)) continue;
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
    ITM.push({ id, m, x: best[0], y: best[1], t: ['sp', 'gold', 'sp'][id - 16], n: [3, 600, 3][id - 16] });
  });
}
function solar() {
  if (G.f.s3) {
    if (G.dex.c.includes(43) || G.busyS) return;
    return say(['Une lueur dorée se pose sur la dalle… Solaris est de retour !'], async () => {
      const r = await battle([mkC(43, 58)], null, true);
      save();
    });
  }
  if (!G.f.n9) return say(["Une barrière de lumière t'empêche d'avancer : quelqu'un t'attend plus bas."]);
  sayB(
    [
      'Aurion : Tu as traversé les récifs et vaincu mes sentinelles…',
      "Aurion : Je suis Aurion, gardien de l'aube. Seuls les dresseurs dignes peuvent voir Solaris !",
      'Aurion : Montre-moi la force de ton lien avec tes créatures !'
    ],
    async () => {
      const r = await battle(
        [mkC(38, 55), mkC(39, 55), mkC(40, 56), mkC(41, 56), mkC(42, 57), mkC(33, 60)],
        'Aurion',
        false,
        true
      );
      if (r == 'win') {
        G.f.s3 = 1;
        G.gold += 8000;
        save();
        say(
          [
            "Aurion : Magnifique… Ton lien est plus fort que l'aube elle-même.",
            "Aurion : Solaris, vois ce dresseur ! Le soleil l'a choisi.",
            'Une créature dorée descend du ciel…'
          ],
          async () => {
            const r2 = await battle([mkC(43, 58)], null, true);
            save();
            say(
              ["Aurion : Que tu l'aies capturé ou non, l'aube est à toi, {J}.", "— L'AUBE DORÉE —"],
              credits3
            );
          }
        );
      }
    }
  );
}
function credits3() {
  panel(
    `<h3>☀️ L'AUBE DORÉE</h3><p>Tu as atteint le bout de l'histoire d'Aérélia, {J}. Huit badges, la Ligue, l'Éclat-mère brisé et Solaris à la lumière du matin.</p><p>⏱ ${fmt(G.sx.time)} · ⚔ ${G.sx.wins} victoires · 📖 ${G.dex.s.length}/${SP.length} vus · 🎯 ${G.dex.c.length} capturés</p><p>Il reste la Ligue, le Palais de combat, les quêtes, la Clairière Cachée et le Bestiaire à compléter. Merci d'avoir joué !</p>`
  );
}
ACH.push(
  ['Huit badges', 'Obtenir les 8 badges', () => G.badge >= 8],
  ['Aube dorée', 'Vaincre Aurion', () => G.f.s3],
  ['Gardien solaire', 'Capturer Solaris', () => G.dex.c.includes(43)]
);
