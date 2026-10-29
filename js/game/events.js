// Événements de la carte : zones, portes, dresseurs, boss, labo, arènes, déplacements
// ---------- Événements ----------
function go(m, x, y) {
  gatesApply(m);
  if (S.v3) v3Face(G.map, m, y);
  G.map = m;
  G.x = x;
  G.y = y;
  rx = x;
  ry = y;
  if (!G.vis.includes(m)) G.vis.push(m);
  save();
}
function ev(t) {
  if (t == 'g') tip('grass', 'Les hautes herbes cachent des créatures sauvages !');
  if (t == 'g' && Math.random() < 0.16 && (G.sb || 0) >= 12 && maps[G.map].e && G.party.length) {
    const E = maps[G.map].e,
      wc = mkC(pick(E.s), E.l[0] + Math.floor(Math.random() * (E.l[1] - E.l[0] + 1)));
    if (S.v3) v3Enc(wc, () => battle([wc], null, true));
    else battle([wc], null, true);
  } else if (t == 'U') {
    const gt =
      {
        0: [
          () => G.f.s,
          "Prof. Sauge : Hé ! Attends ! Ne quitte pas le village sans partenaire, c'est dangereux ! Viens d'abord à mon laboratoire !"
        ],
        5: [() => G.f.b, 'Le lieutenant Corbin garde encore le passage…'],
        15: [() => G.badge >= 3, 'Le col est fermé : il te faut 3 badges.'],
        17: [() => G.badge >= 4, 'Le Mont Croissant exige 4 badges.'],
        18: [() => G.f.e, "Des nuages épais cachent le sommet. Termine d'abord l'histoire."],
        21: [
          () => G.f.a2,
          'Un sceau noir bloque la route du nord. Va voir le Professeur Sauge au laboratoire.'
        ],
        24: [() => G.badge >= 5, 'La route des Cendres est gardée : il te faut 5 badges.'],
        26: [() => G.badge >= 6, 'La gorge est impraticable : il te faut 6 badges.'],
        28: [() => G.f.x, "Une barrière d'ombre bloque le nord. Vaincs d'abord le Maître Éclipse."],
        33: [() => G.badge >= 7, 'La route des récifs est fermée : il te faut 7 badges.'],
        35: [() => G.badge >= 8, 'Le sanctuaire solaire exige 8 badges.'],
        36: [() => G.f.s3, 'Une barrière de lumière ferme le ciel : Aurion garde encore le passage.'],
        40: [() => G.badge >= 9, 'Le ferry du nord est fermé : il te faut 9 badges.'],
        42: [() => G.badge >= 10, 'Les vents sont trop forts : il te faut 10 badges.'],
        44: [() => G.badge >= 11, 'La Voie des Étoiles exige 11 badges.']
      }[G.map] || GT5[G.map];
    if (gt && !gt[0]()) {
      back();
      return say([gt[1]]);
    }
    if (G.map == 0) {
      if (!G.f.s) {
        back();
        return say(['Tu ne peux pas partir sans partenaire ! Va voir le Professeur Sauge au labo.']);
      }
    }
    {
      const n = UP[G.map];
      go(n, maps[n].px, maps[n].g.length - 3);
      if (G.map == 4 && !G.f.n) noa2();
      const q = NOA[G.map];
      if (q && !G.f[q[1]]) noaX(q);
    }
  } else if (t == 'D') {
    const p = DN[G.map];
    go(p, maps[p].ux ?? maps[p].px, 2);
  } else if ('CLBK'.includes(t)) {
    sfx(520, 0.12);
    G.ret = [G.map, G.x, G.y + 1];
    go(
      {
        C: G.map ? 7 : 6,
        L: 8,
        B: 9,
        K: {
          0: 10,
          2: 11,
          4: 12,
          15: 19,
          17: 20,
          21: 22,
          24: 29,
          26: 30,
          33: HK[0],
          35: HK[1],
          40: HK2[0],
          42: HK2[1],
          44: HK2[2]
        }[G.map]
      }[t],
      7,
      8
    );
  } else if (t == 'O') {
    G.ret = [G.map, G.x + 1, G.y];
    sfx(300, 0.2);
    go(13, 7, 10);
  } else if (t == 'Q') {
    if (!G.f.r) rival();
  } else if (t == 'X') {
    const r = G.ret || [0, 20, 12];
    go(r[0], r[1], r[2]);
  } else if (t == 'M') {
    tip('shop', 'La boutique vend Capsules, soins et objets tenus (Griffe, Écaille, Baie, Lentille).');
    say(['Marchand : Bienvenue ! Que puis-je pour toi ?'], shop);
  } else if (t == 'V') {
    if (G.f.b) return;
    sayI(
      [
        "Lieutenant Corbin : Tu es bien courageux d'arriver jusqu'ici… Les Éclats lunaires de la forêt sont à nous !"
      ],
      async () => {
        const r = await battle([mkC(8, 14), mkC(12, 14), mkC(9, 15)], 'Lieutenant Corbin', false);
        if (r == 'win') {
          G.f.b = 1;
          G.gold += 500;
          save();
          say([
            "Corbin : Argh… Le Commandant Vesper t'attend au Mont Croissant, tout au nord. Si tu l'oses…",
            "Tu récupères un Éclat lunaire. Un passage s'ouvre vers le nord, au bout de la forêt."
          ]);
        }
      }
    );
  } else if (t == 'Y') {
    if (G.map == SOLM) return solar();
    if (G.map == ORIM) return orion();
    if (G.map == FIN5) return final5();
    if (G.f.x) return;
    sayI(
      [
        "Maître Éclipse : Tu as sauvé la lune… mais l'ombre, elle, ne meurt jamais.",
        'Maître Éclipse : Cette citadelle est mon dernier rempart. Viens !'
      ],
      async () => {
        const r = await battle(
          [mkC(31, 46), mkC(30, 47), mkC(28, 47), mkC(32, 48), mkC(33, 52)],
          'Maître Éclipse',
          false,
          true
        );
        if (r == 'win') {
          G.f.x = 1;
          G.gold += 5000;
          save();
          say(
            [
              'Maître Éclipse : Impossible…',
              "L'Éclat-mère se brise et libère une lumière dorée : l'aube se lève sur Aérélia.",
              'Noa : Tu es vraiment incroyable… Merci pour tout.',
              "Au nord de la Citadelle, une lueur dorée s'ouvre dans les nuages… L'aventure n'est pas finie !",
              '— VRAIE FIN —'
            ],
            () => credits(1)
          );
        }
      }
    );
  } else if (t == 'W') {
    if (G.f.e) return;
    sayI(
      [
        "Commandant Vesper : Enfin, le petit dresseur ! Les Éclats lunaires m'offriront le pouvoir d'éteindre la lune…",
        'Commandant Vesper : Montre-moi ce que tu vaux !'
      ],
      async () => {
        const r = await battle(
          [mkC(8, 22), mkC(9, 23), mkC(12, 23), mkC(26, 25)],
          'Commandant Vesper',
          false
        );
        if (r == 'win') {
          G.f.e = 1;
          G.gold += 1500;
          save();
          say(
            [
              "Commandant Vesper : Impossible… la lune m'a trahi.",
              "Les Éclats lunaires s'élèvent dans le ciel et rallument les étoiles d'Aérélia.",
              'Noa : On a réussi !',
              'Mais soudain, un grondement venu du nord… Un sceau noir apparaît dans le ciel. Il faut prévenir le Professeur Sauge !'
            ],
            credits
          );
        }
      }
    );
  } else if (t == 'R') {
    const k = G.map + '_' + G.y;
    if (G.tr[k]) return;
    const nom =
        G.map >= A5
          ? "Garde d'Aube"
          : G.map >= 39
            ? 'Marin des étoiles'
            : G.map >= 32
              ? 'Sentinelle solaire'
              : G.map >= 23
                ? "Disciple d'Éclipse"
                : G.map >= 3
                  ? 'Sbire Vesper'
                  : 'Dresseur',
      L =
        ({
          1: 5,
          3: 9,
          5: 11,
          14: 15,
          16: 18,
          18: 21,
          23: 36,
          25: 40,
          27: 43,
          28: 46,
          32: 48,
          34: 52,
          36: 55,
          39: 57,
          41: 60,
          43: 63,
          45: 66,
          ...L5
        }[G.map] || 9) + Math.min(2, Math.max(0, maps[G.map].tr.indexOf(G.y)));
    sayI([`${nom} : Hé, toi ! On se bat ?`], async () => {
      const r = await battle([mkC(TP[G.map][0], L - 1), mkC(TP[G.map][1], L)], nom, false);
      if (r == 'win') {
        G.tr[k] = 1;
        G.balls += 2;
        G.gold += 40 + L * 8;
        save();
        say([`${nom} : Bien joué ! Prends 2 Capsules et ${40 + L * 8} 💰.`]);
      }
    });
  }
}
function lab() {
  if (G.f.s && G.f.e && !G.f.a2)
    return say(
      [
        "Prof. Sauge : Ah, te voilà ! J'ai étudié le sceau noir apparu au nord…",
        "Prof. Sauge : Les Éclats lunaires n'étaient que des fragments. L'Éclat-mère dort sous la Citadelle d'Éclipse, au-delà de la Ligue.",
        'Prof. Sauge : Prends ces objets. La route du nord est ouverte : Ardenfeu, Cristalbourg… puis la Citadelle. Je compte sur toi !'
      ],
      () => {
        G.f.a2 = 1;
        G.sp += 5;
        G.balls += 10;
        G.gold += 1500;
        save();
        toast('🎁 5 Super Potions, 10 Capsules, 1 500 💰');
      }
    );
  if (G.f.s) return say(['Prof. Sauge : Cendrebourg est au nord, par la Route 1. Défie le champion Ilex !']);
  if (!G.pn)
    return say(
      [
        "Prof. Sauge : Ah, te voilà ! Bienvenue dans la région d'Aérélia, où humains et créatures lunaires vivent ensemble.",
        "Prof. Sauge : Mais avant tout… présentons-nous ! Comment t'appelles-tu ?"
      ],
      () => nameFlow(lab)
    );
  say(
    [
      'Prof. Sauge : Alors {J}, prêt à partir ? Depuis peu, des Éclats lunaires disparaissent un peu partout…',
      "Prof. Sauge : Choisis un partenaire pour mener l'enquête !"
    ],
    () =>
      choose(['Braisou (Feu)', 'Ondin (Eau)', 'Feuillon (Plante)'], i => {
        G.party.push(mkC(i, 5));
        mark(i, 1);
        G.st = i;
        G.f.s = 1;
        G.balls = 8;
        G.pots = 4;
        save();
        say(
          [
            `Tu as choisi ${SP[i].n} !`,
            'Prof. Sauge : Prends aussi 8 Capsules et 4 Potions.',
            'Prof. Sauge : Voici mon Bestiaire : il enregistre chaque Lunaire que tu croises. À toi de le compléter !'
          ],
          () =>
            labNoa(i, () =>
              say(
                [
                  `Noa : Hé, Grand-père ! Et moi ? … Bon, je prends ${SP[(i + 1) % 3].n}. Il est plus fort que le tien !`,
                  "Prof. Sauge : Avant de partir, un combat d'entraînement ! Choisis une attaque avec les boutons : le Feu bat la Plante, la Plante bat l'Eau, l'Eau bat le Feu.",
                  'Prof. Sauge : Affaiblis-le puis lance une Capsule pour le capturer, ou fuis si tu veux.'
                ],
                async () => {
                  await battle([mkC(3, 2)], null, true);
                  say([
                    'Prof. Sauge : Bravo ! Quand tes créatures sont blessées, va au Centre de soins (porte rouge +).',
                    'Prof. Sauge : Tu peux tout revoir dans ☰ Menu → 📘 Guide. Bonne route, {J} ! Direction le nord par la grand-rue !'
                  ]);
                }
              )
            )
        );
      })
  );
}
function askName(q, def, cb) {
  const o = document.createElement('div');
  o.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,20,.7);display:flex;align-items:center;justify-content:center;z-index:99';
  const b = document.createElement('div');
  b.style.cssText =
    'background:#fff8e8;border:4px solid #3a2a1a;border-radius:12px;padding:16px;max-width:86vw;text-align:center;font-family:inherit;color:#222';
  const h = document.createElement('div');
  h.textContent = q;
  h.style.cssText = 'font-weight:bold;margin-bottom:10px';
  const i = document.createElement('input');
  i.maxLength = 10;
  i.value = def;
  i.style.cssText =
    'font-size:20px;text-align:center;width:11em;max-width:100%;padding:6px;border:2px solid #3a2a1a;border-radius:8px';
  const k = document.createElement('button');
  k.textContent = 'OK';
  k.style.cssText = 'display:block;margin:12px auto 0;font-size:18px;padding:8px 28px';
  const fin = () => {
    const v =
      i.value
        .replace(/[<>&"'`{}\\\/]/g, '')
        .trim()
        .slice(0, 10) || def;
    o.remove();
    busy = false;
    cb(v);
  };
  k.onclick = fin;
  i.onkeydown = e => {
    if (e.key == 'Enter') fin();
  };
  b.append(h, i, k);
  o.append(b);
  document.body.append(o);
  busy = true;
  setTimeout(() => {
    try {
      i.focus();
      i.select();
    } catch (e) {}
  }, 50);
}
function nameFlow(cb) {
  askName("Comment t'appelles-tu ?", 'Lune', n => {
    G.pn = n;
    say(
      [
        `Prof. Sauge : ${n}… Joli nom !`,
        "Prof. Sauge : Tu as un ami d'enfance qui n'arrête pas de te défier, n'est-ce pas ? Comment s'appelle-t-il, ton rival ?"
      ],
      () =>
        askName('Nom de ton rival', 'Noa', r => {
          G.rv = r;
          say([`Prof. Sauge : Donc tu es ${n} et ton rival est ${r}. C'est bien ça ?`], () =>
            choose(["Oui, c'est ça !", 'Changer les noms'], i => {
              if (i) {
                G.pn = G.rv = null;
                nameFlow(cb);
              } else {
                save();
                cb();
              }
            })
          );
        })
    );
  });
}
const sayI = (l, cb) => {
  const m = /^(Lieutenant Corbin|Maître Éclipse|Commandant Vesper)/.exec(l[0] || '');
  if (m && S.v3 && typeof bossCin == 'function') bossCin(m[1], () => say(l, cb));
  else intrude(null, () => say(l, cb));
};
function rival() {
  intrude(LK3.rival, rival0);
}
function noaX(q) {
  intrude(LK3.rival, () => noaX0(q));
}
function noa2() {
  intrude(LK3.rival, noa20);
}
function rival0() {
  back();
  const rs = (G.party[0].s + 1) % 3;
  say(
    [
      'Noa : Hé, {J} ! Attends-moi !',
      "Noa : Le Professeur m'a donné un partenaire à moi aussi. Voyons qui est le plus fort !"
    ],
    async () => {
      const r = await battle([mkC(rs, 4)], 'Noa', false);
      G.f.r = 1;
      save();
      if (r != 'lose') say(["Noa : Pas mal… Je file à Cendrebourg, le champion Ilex m'attend. À bientôt !"]);
    }
  );
}
const GY = {
  2: {
    n: 'Ilex',
    i: 1,
    t: [
      [7, 7],
      [0, 8]
    ],
    h: 'Je suis Ilex, champion de Cendrebourg ! Mes braises vont te réchauffer !',
    w: [
      'Ilex : Bravo ! Prends le Badge Cendre.',
      'Ilex : La Team Vesper vole les Éclats lunaires dans toute la région. Va à Lunargent par la Route 2 : la championne Mira en sait plus.'
    ]
  },
  4: {
    n: 'Mira',
    i: 2,
    t: [
      [6, 11],
      [1, 12],
      [10, 13]
    ],
    h: "Je suis Mira, gardienne de Lunargent. Les marées ne s'arrêtent jamais !",
    w: [
      'Mira : Magnifique ! Voici le Badge Marée.',
      "Mira : La Forêt d'Argent est au nord de la ville. Noa y est déjà partie !"
    ]
  }
};
GY[15] = {
  n: 'Granit',
  i: 3,
  t: [
    [20, 15],
    [14, 16],
    [26, 17]
  ],
  h: 'Je suis Granit, gardien des cimes. Ma roche ne cède jamais !',
  w: [
    'Granit : Tu as la force des montagnes ! Voici le Badge Granit.',
    "Granit : La Route 4 mène à Havre-d'Opale. Fais attention aux Vesper."
  ]
};
GY[17] = {
  n: 'Zéphyr',
  i: 4,
  t: [
    [21, 19],
    [12, 20],
    [25, 21],
    [4, 20]
  ],
  h: 'Je suis Zéphyr, maître des vents du port ! Accroche-toi !',
  w: [
    'Zéphyr : Magnifique ! Voici le Badge Tempête.',
    "Zéphyr : Le Mont Croissant t'est ouvert. Que la lune te guide !"
  ]
};
GY[24] = {
  n: 'Brasier',
  i: 5,
  t: [
    [22, 38],
    [27, 39],
    [9, 40],
    [27, 41]
  ],
  h: "Je suis Brasier, forgeron du volcan. Mes flammes ne s'éteignent jamais !",
  w: [
    "Brasier : Ça, c'est du feu de forge ! Voici le Badge Braise.",
    "Brasier : Cristalbourg est plus au nord. Fais attention aux Disciples d'Éclipse."
  ]
};
GY[26] = {
  n: 'Névé',
  i: 6,
  t: [
    [23, 42],
    [28, 43],
    [18, 43],
    [10, 44]
  ],
  h: 'Je suis Névé, gardienne des cristaux. Le froid ne pardonne pas !',
  w: [
    'Névé : Tu as fondu mes glaces ! Voici le Badge Cristal.',
    "Névé : La Citadelle d'Éclipse t'attend, au bout de la Gorge du Givre."
  ]
};
function gym() {
  if (G.ret[0] == 21) return league();
  const y = GY[G.ret[0]];
  if (G.badge >= y.i) return say([`${y.n} : Tu as déjà mon badge. Continue ta route !`]);
  if (G.badge < y.i - 1) return say([`${y.n} : Reviens quand tu auras le badge précédent.`]);
  say([`${y.n} : ${y.h}`], async () => {
    const r = await battle(
      y.t.map(a => mkC(...a)),
      y.n,
      false
    );
    if (r == 'win') {
      G.badge = y.i;
      save();
      say(y.w);
    }
  });
}
const SOLID = '#HTwNkpsmbroFZyzquah'; // a = table, h = cheminée (intérieurs)
const npAt = (x, y) => NP.find(n => n.m == G.map && n.x == x && n.y == y);
function back() {
  ry += 1.2;
  G.y = Math.floor(ry + 0.74);
}
function bush(x, y) {
  if (rnd(x, y) % 5) return false;
  const k = 'b' + G.map + '_' + x + '_' + y;
  if (G.q[k]) return false;
  G.q[k] = 1;
  const r = Math.random();
  sfx(450, 0.1);
  tip('bush', 'Certains buissons à baies cachent un trésor : appuie sur A face à eux.');
  if (r < 0.1) {
    G.balls++;
    say(['Tu fouilles le buisson : une Capsule !']);
  } else if (r < 0.3) {
    G.pots++;
    say(['Tu trouves une Potion dans le buisson !']);
  } else if (r < 0.5) {
    const g = 20 + Math.floor(Math.random() * 60);
    G.gold += g;
    say([`Quelques pièces cachées : ${g} 💰.`]);
  } else if (r < 0.62 && maps[G.map].e) {
    say(['Quelque chose bondit du buisson !'], () => {
      const E = maps[G.map].e;
      battle([mkC(pick(E.s), E.l[0] + Math.floor(Math.random() * (E.l[1] - E.l[0] + 1)))], null, true);
    });
  } else say(['Tu fouilles le buisson… rien.']);
  return true;
}
function gate(x, y, np) {
  const g = maps[G.map].g;
  if (G.y > y) {
    tip('gate', "Les barrières s'ouvrent de l'autre côté : contourne par les hautes herbes !");
    return say(
      np
        ? [
            "Ouvrier : Chemin barré, travaux en cours ! Passe plutôt par la prairie, on se poussera de l'autre côté !"
          ]
        : [
            "Une barrière bloque le chemin. Le loquet est de l'autre côté… Il faut contourner par les hautes herbes !"
          ]
    );
  }
  for (let i = -3; i <= 3; i++)
    if ('Zy'.includes(g[y][x + i])) {
      g[y][x + i] = '_';
      G.q['gt' + G.map + '_' + (x + i) + '_' + y] = 1;
    }
  gatesApply(G.map);
  delete MC[G.map];
  sfx(520, 0.2);
  save();
  say(
    np
      ? ['Ouvrier : Ah, tu as fait le tour ! Allez les gars, on lui laisse le passage !']
      : ["Tu soulèves le loquet : la barrière s'ouvre ! Le chemin est libre dans les deux sens."]
  );
}
function rchest(x, y) {
  const k = 'rc' + G.map + '_' + x + '_' + y;
  if (G.q[k]) return say(['Le coffre est vide.']);
  G.q[k] = 1;
  const r = hs(x + G.map, y) % 10,
    n = 2 + (hs(y, x + G.map) % 3);
  let m;
  if (r < 4) {
    const o = 120 + G.map * 12 + (hs(x, y) % 80);
    G.gold += o;
    m = `Tu trouves ${o} 💰 !`;
  } else if (r < 7) {
    G.balls += n;
    m = `Tu trouves ${n} Capsules !`;
  } else {
    G.pots += n;
    m = `Tu trouves ${n} Potions !`;
  }
  delete MC[G.map];
  sfx(800, 0.25);
  save();
  say(['Le détour en valait la peine ! Un coffre caché…', m]);
}
function gatesApply(k) {
  const m = maps[k],
    g = m?.g;
  if (!g) return;
  if (typeof ORIM != 'undefined' && k == ORIM && G.f.o4 && g[8][14] == 'T') {
    g[8][14] = '_';
    delete MC[k];
  }
  const pre = 'gt' + k + '_';
  for (const q in G.q)
    if (q.startsWith(pre)) {
      const [x, y] = q.slice(pre.length).split('_').map(Number);
      if ('Zy'.includes(g[y]?.[x])) g[y][x] = '_';
    }
  if (g.gates && !m.bk) {
    m.bk = 1;
    g.gates.forEach(a => {
      if (a.ppl)
        for (let i = -1; i <= 1; i++) {
          const o = { m: k, e: i == 0 ? '👷' : '🚧', x: a.c + i, y: a.t };
          o.f = () => gate(o.x, o.y, 1);
          NP.push(o);
        }
    });
  }
  if (m.bk)
    for (let i = NP.length - 1; i >= 0; i--) {
      const n = NP[i];
      if (n.m == k && n.e && (n.e == '👷' || n.e == '🚧') && g[n.y]?.[n.x] != 'y') NP.splice(i, 1);
    }
}
function bump(nx, ny, t) {
  if (t == 'b' && !maps[G.map].in && bush(nx, ny)) return true;
  const np = npAt(nx, ny);
  if (np) {
    if (np.f) {
      np.f();
      return true;
    }
    if (np.q != null) {
      quest(np.q);
      return true;
    }
    say([np.l[Math.floor(Math.random() * np.l.length)]]);
    return true;
  }
  if (t == 'Z') {
    gate(nx, ny);
    return true;
  }
  if (t == 'z') {
    rchest(nx, ny);
    return true;
  }
  if (t == 'N') {
    talk(maps[G.map].k, maps[G.map].q);
    return true;
  }
  if (t == 'o') {
    chest(nx, ny);
    return true;
  }
  if (t == 'w') {
    fish();
    return true;
  }
  return false;
}
function arrive(x, y) {
  G.x = x;
  G.y = y;
  const t = maps[G.map].g[y]?.[x];
  if (!t) return;
  G.sx.steps++;
  G.sb = (G.sb || 0) + 1;
  if (G.sx.steps == 1)
    tip(
      'move',
      'Croix directionnelle pour marcher, bouton A pour parler ou ouvrir, B maintenu pour courir, START pour le menu.'
    );
  if (G.sx.steps == 25)
    tip('menu', 'Appuie sur START pour le menu : équipe, sac, quêtes, carte, guide et succès.');
  if (G.sx.steps == 150)
    tip(
      'bush2',
      "Les passages étroits et les ponts sont obligatoires. Une barrière ? Contourne-la par les hautes herbes et ouvre-la de l'autre côté."
    );
  if (G.sx.steps == 60)
    tip('journal', "Besoin d'aide ? ☰ Menu → 📜 Histoire : objectif, indices et chemin en pointillé 🧭.");
  if (G.party.some(c => c.hp < c.mh * 0.4))
    tip('heal', 'Une créature est blessée : soigne-la dans un Centre (porte rouge +) ou avec une Potion.');
  if (item()) return;
  ev(t);
}
function step(dx, dy) {
  if (busy) return;
  const nx = G.x + dx,
    ny = G.y + dy,
    t = maps[G.map].g[ny]?.[nx];
  fd = [dx, dy];
  if (bump(nx, ny, t)) return;
  if (!t || SOLID.includes(t) || npAt(nx, ny)) return;
  rx = nx;
  ry = ny;
  arrive(nx, ny);
}
const solid = (x, y) => {
  x = Math.floor(x);
  y = Math.floor(y);
  const t = maps[G.map].g[y]?.[x];
  return !t || SOLID.includes(t) || !!npAt(x, y);
};
const hit = (px, py) =>
  solid(px + 0.26, py + 0.52) ||
  solid(px + 0.74, py + 0.52) ||
  solid(px + 0.26, py + 0.87) ||
  solid(px + 0.74, py + 0.87);
function tick(dt) {
  if (busy) {
    mvg = 0;
    return;
  }
  if (S.v3) return tick3(dt);
  let dx = ph[0] + swv[0],
    dy = ph[1] + swv[1];
  for (const k in keys)
    if (keys[k]) {
      dx += K[k][0];
      dy += K[k][1];
    }
  const l = Math.hypot(dx, dy);
  if (!l) {
    mvg = 0;
    return;
  }
  if (l > 1) {
    dx /= l;
    dy /= l;
  }
  fd = Math.abs(dx) >= Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)];
  const d = (([4.6, 6.8][S.walk | 0] * dt) / 1000) * (runB ? 1.55 : 1);
  let mx = 0,
    my = 0;
  if (dx && !hit(rx + dx * d, ry)) {
    rx += dx * d;
    mx = 1;
  }
  if (dy && !hit(rx, ry + dy * d)) {
    ry += dy * d;
    my = 1;
  }
  if (dx && !mx && !dy) {
    const e = Math.round(ry) - ry,
      n = Math.sign(e) * Math.min(Math.abs(e), d);
    if (Math.abs(e) > 0.01 && Math.abs(e) < 0.5 && !hit(rx, ry + n)) {
      ry += n;
      my = 1;
    }
  }
  if (dy && !my && !dx) {
    const e = Math.round(rx) - rx,
      n = Math.sign(e) * Math.min(Math.abs(e), d);
    if (Math.abs(e) > 0.01 && Math.abs(e) < 0.5 && !hit(rx + n, ry)) {
      rx += n;
      mx = 1;
    }
  }
  mvg = mx || my ? 1 : 0;

  const tx = Math.floor(rx + 0.5),
    ty = Math.floor(ry + 0.74);
  if (tx != G.x || ty != G.y) arrive(tx, ty);
}
