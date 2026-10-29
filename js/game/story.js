// Rival, guide du dresseur, étapes de l'histoire, quêtes annexes
NP.push(
  {
    m: 15,
    e: '🧓',
    x: 12,
    y: 7,
    l: [
      "Vieil homme : Granit ne perd jamais… sauf contre les créatures d'Eau.",
      'Vieil homme : Sans 3 badges, le col reste fermé.'
    ]
  },
  {
    m: 17,
    e: '👨',
    x: 7,
    y: 9,
    l: [
      "Pêcheur : Le port regorge de Coralie. Lance ta ligne dans l'eau !",
      'Pêcheur : Zéphyr vole plus vite que le vent.'
    ]
  }
);
NP.forEach(n => {
  const q = { 0: [10, 13], 2: [30, 13], 4: [10, 13], 15: [30, 13], 17: [10, 13] }[n.m];
  n.x = q[0];
  n.y = q[1];
});
const NOA = {
  15: [
    16,
    'n3',
    "Noa : Pierrefeu ! J'ai pris de l'avance, mais tu m'as rattrapé. Un combat ?",
    "Noa : Pas mal ! Les Vesper se sont installés au Mont Croissant. Retrouve-moi à Havre-d'Opale !"
  ],
  17: [
    20,
    'n4',
    "Noa : Te voilà ! Le Commandant Vesper est au sommet du Croissant. Un dernier combat avant d'y aller ?",
    'Noa : Bien joué ! Je te laisse le Commandant. Je veille depuis le pied de la montagne.'
  ]
};
NOA[24] = [
  40,
  'n5',
  "Noa : Ardenfeu ! J'ai suivi la lueur du sceau noir… Un combat avant l'arène ?",
  "Noa : Pas mal ! Je file vers Cristalbourg. Méfie-toi des Disciples d'Éclipse."
];
NOA[26] = [
  44,
  'n6',
  'Noa : Cristalbourg ! Plus que la Gorge du Givre et la Citadelle. Un dernier duel entre nous ?',
  'Noa : Tu y es presque. Je garde le passage derrière toi.'
];
function noaX0(q) {
  say([q[2]], async () => {
    const L = q[0],
      r = await battle([mkC(17, L - 1), mkC((((G.st || 0) + 1) % 3) + 9, L), mkC(12, L)], 'Noa', false);
    G.f[q[1]] = 1;
    save();
    if (r != 'lose') say([q[3]]);
  });
}
const GUIDE = [
  [
    'Bienvenue à Aérélia',
    `<p>Aérélia est un monde peuplé de <b>Lunaires</b>, des créatures liées aux <b>Éclats lunaires</b>. Toi, tu pars de ton village avec un seul rêve : <b>devenir Maître des Lunaires</b>.</p><p>Le Professeur Sauge t'attend à son laboratoire pour te confier ton premier partenaire. Ensuite : explore les routes, <b>capture des Lunaires</b>, bats les champions d'arène pour gagner leurs <b>badges</b>, démasque la Team Vesper, puis brave la Ligue.</p><p>Ton rival, lui aussi, a commencé son voyage… Ce guide explique tout et se relit à tout moment : ☰ Menu → Guide.</p>`
  ],
  [
    'Marcher',
    `<p><b>Clavier :</b> flèches ou WASD · <b>Z / Espace</b> = bouton A · <b>X</b> = bouton B · <b>Entrée</b> = START · <b>P</b> = SELECT.<br><b>Téléphone :</b> croix directionnelle, boutons A et B, START et SELECT.</p><p><b>A</b> parle, ouvre, pêche, valide. <b>B</b> annule et ferme ; maintenu, il fait <b>courir</b>. <b>START</b> ouvre le menu, <b>SELECT</b> les paramètres.</p><p>Le mouvement est libre : tu glisses le long des murs. Tu peux marcher plus vite dans ⚙ Paramètres.</p><p>Entrée ou ▶ OK fait défiler les dialogues.</p>`
  ],
  [
    'Interagir',
    `<p>Place-toi <b>face</b> à un personnage et appuie sur <b>A</b> pour lui parler ; face à l'eau pour <b>pêcher</b>, face à un coffre ou un buisson pour l'ouvrir.</p><p>Entre dans un bâtiment par sa porte, ressors par le <b>tapis rouge</b>. Les villageois te donnent des indices et parfois des quêtes.</p>`
  ],
  [
    'Lire le monde',
    `<p>🌿 <b>Hautes herbes</b> : des créatures sauvages.<br>🟫 Chemins de terre = routes, 🪨 pavés = villes.<br>⬆⬇ flèches au sol : changer de zone.<br>✨ objet caché · 🛒 boutique.</p><p>Portes : rouge + = <b>Centre de soins</b>, violette = laboratoire, dorée = <b>arène</b>, marron = maison.</p><p>🌿 Les <b>buissons</b> bloquent le chemin ; certains, à baies rouges, cachent un petit trésor : appuie sur A face à eux. Les <b>ponts</b> et les <b>défilés</b> étroits sont des passages obligés, avant chaque ville.</p>`
  ],
  [
    'Le menu ☰',
    `<p><b>Équipe</b> : choisis qui est en tête. <b>Sac</b> : soigne tes créatures. <b>Quêtes</b> : ton objectif. <b>Bestiaire</b> : créatures vues et capturées. <b>Carte</b> : voyage rapide. <b>Succès</b>, <b>Paramètres</b>, <b>Sauvegarde</b>.</p><p>Raccourcis clavier : START/M menu, E équipe, V sac, Q quêtes, G bestiaire, SELECT/P paramètres.</p>`
  ],
  [
    'Combat : les bases',
    `<p>À chaque tour tu choisis : <b>Combat</b> (les attaques), <b>Sac</b> (Capsules, Potions), <b>Équipe</b> (changer de créature) ou <b>Fuite</b> (impossible contre un dresseur). A valide, B revient en arrière.</p><p>La créature la plus rapide attaque en premier (la paralysie la ralentit). Une créature à 0 PV est K.O. Tes créatures gagnent de l'expérience et montent de niveau.</p>`
  ],
  [
    'Les types',
    `<p>🔥 Feu bat 🌿 Plante · 🌿 Plante bat 💧 Eau · 💧 Eau bat 🔥 Feu · 🕊 Vol bat 🌿 Plante.</p><p>Une attaque « super efficace » fait ×2 de dégâts ; « pas très efficace » fait ×0,5 (même type = ×0,5). Le type Normal n'est ni fort ni faible.</p><p>Chaque créature a une attaque Normale et une attaque de son type (plus une 3e au niveau 8).</p>`
  ],
  [
    'Capturer',
    `<p>Affaiblis la créature sauvage, puis lance une <b>Capsule</b>. Moins elle a de PV, plus c'est facile.</p><p>Un statut (sommeil, brûlure, paralysie) augmente encore tes chances.</p><p>Équipe pleine (6) ? Les captures vont au <b>PC</b> : parle à l'infirmière d'un Centre de soins.</p>`
  ],
  [
    'Statuts',
    `<p>🔥 <b>Brûlure</b> : perd des PV chaque tour.<br>💤 <b>Sommeil</b> : rate des tours, se réveille au hasard.<br>⚡ <b>Paralysie</b> : une chance sur quatre de rater son tour.</p><p>Les attaques de Feu, Plante et Eau peuvent les infliger. Une Super Potion guérit le statut. Ils disparaissent après le combat.</p>`
  ],
  [
    'Objets et boutique',
    `<p><b>Capsule</b> : capturer. <b>Potion</b> : +40 PV. <b>Super Potion</b> : +100 PV et soigne le statut.</p><p>La boutique 🛒 de chaque ville les vend contre des 💰. Tu gagnes de l'argent en battant des dresseurs et en trouvant des objets cachés.</p>`
  ],
  [
    'Se soigner',
    `<p>Dans un <b>Centre de soins</b> (porte rouge) : l'infirmière soigne toute ton équipe gratuitement. Ta maison à Brumeval aussi.</p><p>Si toute ton équipe est K.O., tu te réveilles à Brumeval, soigné. Tu ne perds pas ta progression.</p>`
  ],
  [
    'Niveaux et évolutions',
    `<p>Au <b>niveau 8</b>, une créature apprend une 3e attaque, plus puissante, et au <b>niveau 20</b> une 4e, encore plus forte.</p><p>Les évolutions arrivent à certains niveaux : starters niveau 10, Piaf 9, Rattou 12, Mousse 12, Crabi 14. Une créature qui évolue devient bien plus forte.</p>`
  ],
  [
    'Arènes, badges, Ligue',
    `<p>6 arènes : Cendrebourg, Lunargent, Pierrefeu, Havre-d'Opale, puis Ardenfeu et Cristalbourg dans l'acte II. On les fait dans l'ordre.</p><p>Après l'aube dorée, l'<b>archipel des étoiles</b> cache 3 arènes de plus (badges 9 à 11). Il faut <b>4 badges</b> pour atteindre le Mont Croissant. Après l'histoire, la <b>Ligue</b> (5 duels) et le <b>Palais de combat</b> (série de victoires) t'attendent sur le Plateau.</p>`
  ],
  [
    'Quêtes et secrets',
    `<p>Les habitants des maisons (⌂) ont des quêtes : rapporte-leur une créature précise pour une récompense.</p><p>Cherche les ✨ cachées, pêche dans les mares, explore la <b>Grotte Lunaire</b> sur la Route 2 : un coffre et une créature rare t'y attendent.</p><p>Dans ☰ Menu → Quêtes, chaque quête a ses 💡 indices et peut être suivie par le 🧭 chemin en pointillé.</p>`
  ],
  [
    'Carte et niveaux conseillés',
    `<p>Le chemin : Brumeval → Route 1 → Cendrebourg → Route 2 → Lunargent → Forêt d'Argent → Route 3 → Pierrefeu → Route 4 → Havre-d'Opale → Mont Croissant.</p><p>Niveaux conseillés : Route 1 : 3-6 · Cendrebourg : 8 · Route 2 : 8-11 · Lunargent : 11-12 · Forêt : 12-15 · Route 3 : 14-17 · Route 4 : 17-20 · Mont : 20-25 · Ligue : 30+ · Acte II : 34 à 52.</p><p>Voyage rapide : ☰ Menu → Carte, vers les villes déjà visitées.</p>`
  ],
  [
    'Réglages et sauvegarde',
    `<p>⚙ Paramètres : musique, volumes, vitesse du texte, <b>difficulté</b>, animations, vitesse de marche, vibrations, astuces.</p><p>Le jeu se sauvegarde tout seul, dans 3 fichiers au choix (écran titre ou Paramètres → Changer de fichier). Pour changer d'appareil : Paramètres → Exporter, copie le texte, puis Importer sur l'autre appareil.</p>`
  ],
  [
    'Nouveautés',
    `<p><b>Combats doubles</b> : 2 créatures par camp (Ligue, Palais). Choisis l'attaque de chacune puis sa cible.</p><p><b>Surnoms</b> : ☰ Menu → Équipe → ✏️. <b>PC</b> : tri par niveau, type ou nom.</p><p><b>Carte</b> : ☰ Menu → Carte. L'onglet <b>Monde</b> montre les lieux découverts (touche-les pour les infos et voyager), l'onglet <b>Zone</b> le plan détaillé où tu es.</p><p><b>Bestiaire</b> : touche une créature vue pour sa fiche complète.</p><p><b>Histoire</b> : ☰ Menu → 📜 Histoire : étapes, 💡 indices et 🧭 chemin en pointillé vers ton objectif (touche G pour l'activer).</p>`
  ],
  [
    'Version rétro et archipel',
    `<p><b>Style console portable</b> : boutons A/B, START, SELECT, combats à menu <b>Combat / Sac / Équipe / Fuite</b>, pixels rétro et palette Game Boy (⚙ Paramètres).</p><p><b>Acte IV</b> : après Aurion, un chemin s'ouvre au sommet du Sanctuaire solaire vers l'<b>archipel des étoiles</b> : 3 arènes (badges 9 à 11), Maître Orion et la créature légendaire Astraël.</p><p><b>Quêtes annexes</b> : les habitants avec un <b>!</b> rouge au-dessus de la tête ont une demande. ☰ Menu → Quêtes les liste avec indices et chemin 🧭.</p>`
  ],
  [
    'Conseils de pro',
    `<p>• Emmène des créatures de types variés.<br>• Utilise « Changer » pour exploiter les types.<br>• Garde toujours quelques Potions et des Capsules.<br>• Les coups critiques arrivent au hasard : ne compte pas dessus.<br>• Soigne-toi avant chaque arène.</p><p>Bonne aventure !</p>`
  ]
];
let gp = 0;
function guide(p) {
  if (p != null) gp = p;
  panel(
    `<h3>📘 Guide du dresseur (${gp + 1}/${GUIDE.length})</h3><h4>${GUIDE[gp][0]}</h4>${GUIDE[gp][1]}<div style="display:flex;gap:8px;margin:12px 0"><button id="gpv" ${gp ? '' : 'disabled'}>◀ Précédent</button><button id="gnx">${gp < GUIDE.length - 1 ? 'Suivant ▶' : 'Terminer ✔'}</button></div>`
  );
  $('gpv').onclick = () => guide(gp - 1);
  $('gnx').onclick = () => {
    if (gp < GUIDE.length - 1) guide(gp + 1);
    else {
      $('pn').style.display = 'none';
      busy = false;
    }
  };
}
function guideBtn() {
  if (!busy) guide(0);
}
const CHAIN = [0, 1, 2, 3, 4, 5, 14, 15, 16, 17, 18, 21, 23, 24, 25, 26, 27, 28],
  CH_N = [
    'Le départ',
    'Lunargent et la forêt',
    'Les cimes',
    'Le port',
    'Le Mont Croissant',
    "La légende de l'Aube",
    "Après l'aventure"
  ];
const STORY = [
  {
    c: 0,
    t: 'Rejoindre le laboratoire',
    obj: 'Va au laboratoire du Professeur Sauge (porte violette) pour choisir ton partenaire.',
    h: [
      "Le labo est à l'est du village, sur la grand-rue.",
      'Cherche la porte violette 🔬 : le grand bâtiment en haut à droite.'
    ],
    done: () => G.f.s,
    m: 0,
    ch: 'L',
    inn: 8
  },
  {
    c: 0,
    t: 'Rencontrer Noa',
    obj: "Pars vers le nord par la Route 1 : Noa t'attend.",
    h: [
      'Prends la sortie nord du village et suis le chemin de terre.',
      "Noa t'attend sur la Route 1, avant les premières hautes herbes."
    ],
    done: () => G.f.r,
    m: 1,
    ch: 'Q'
  },
  {
    c: 0,
    t: 'Arène de Cendrebourg',
    obj: "Bats Ilex à l'arène de Cendrebourg (badge 1).",
    h: [
      "Cendrebourg est au bout de la Route 1. Soigne-toi avant l'arène.",
      "L'arène est le grand bâtiment à la porte dorée. Ilex utilise le Feu : l'Eau est efficace."
    ],
    done: () => G.badge >= 1,
    m: 2,
    ch: 'B',
    inn: 9
  },
  {
    c: 1,
    t: 'Route 2 et Lunargent',
    obj: "Prends la Route 2 vers le nord jusqu'à Lunargent.",
    h: [
      'Au nord de Cendrebourg, la Route 2 mène à Lunargent.',
      "Un sentier à l'ouest de la Route 2 mène à la Grotte Lunaire (facultatif)."
    ],
    done: () => G.f.n,
    m: 4,
    ch: null
  },
  {
    c: 1,
    t: 'Arène de Lunargent',
    obj: "Bats Mira à l'arène de Lunargent (badge 2).",
    h: [
      "L'arène est le grand bâtiment à gauche en haut de la ville.",
      "Mira utilise l'Eau : la Plante est efficace."
    ],
    done: () => G.badge >= 2,
    m: 4,
    ch: 'B',
    inn: 9
  },
  {
    c: 1,
    t: "Traverser la Forêt d'Argent",
    obj: "Traverse la Forêt d'Argent et bats le lieutenant Corbin.",
    h: [
      "La Forêt d'Argent est au nord de Lunargent.",
      'Corbin barre le chemin au milieu de la forêt : bats-le pour passer.'
    ],
    done: () => G.f.b,
    m: 5,
    ch: 'V'
  },
  {
    c: 2,
    t: 'Route 3 et Pierrefeu',
    obj: "Sors de la forêt par le nord, suis la Route 3 jusqu'à Pierrefeu.",
    h: [
      'La sortie nord de la forêt mène à la Route 3.',
      'Pierrefeu est au bout de la Route 3, après deux dresseurs.'
    ],
    done: () => G.f.n3,
    m: 15,
    ch: null
  },
  {
    c: 2,
    t: 'Arène de Pierrefeu',
    obj: "Bats Granit à l'arène de Pierrefeu (badge 3).",
    h: [
      "L'arène est à droite en haut. Granit utilise le type Normal.",
      "Aucun type n'est fort contre lui : monte tes niveaux et garde des Potions."
    ],
    done: () => G.badge >= 3,
    m: 15,
    ch: 'B',
    inn: 9
  },
  {
    c: 3,
    t: "Route 4 et Havre-d'Opale",
    obj: "Prends la Route 4 vers le nord jusqu'à Havre-d'Opale.",
    h: [
      'Il faut 3 badges pour franchir le col, puis la Route 4.',
      "Havre-d'Opale est au bout de la Route 4, au bord de l'eau."
    ],
    done: () => G.f.n4,
    m: 17,
    ch: null
  },
  {
    c: 3,
    t: "Arène d'Havre-d'Opale",
    obj: "Bats Zéphyr à l'arène du port (badge 4).",
    h: [
      "L'arène est le grand bâtiment à gauche en haut.",
      'Le Vol bat la Plante : emmène plutôt des créatures Normal ou Eau.'
    ],
    done: () => G.badge >= 4,
    m: 17,
    ch: 'B',
    inn: 9
  },
  {
    c: 4,
    t: 'Le Commandant Vesper',
    obj: 'Monte au sommet du Mont Croissant et affronte le Commandant Vesper.',
    h: [
      "Le Mont Croissant est au nord d'Havre-d'Opale ; il faut 4 badges.",
      'Quatre dresseurs te barrent la route, puis le Commandant tout en haut.'
    ],
    done: () => G.f.e,
    m: 18,
    ch: 'W'
  },
  {
    c: 5,
    t: 'Le sceau noir',
    obj: 'Retourne voir le Professeur Sauge au laboratoire : un sceau noir est apparu au nord.',
    h: [
      "Un grondement a retenti à la fin de l'histoire : Sauge t'attend.",
      "Le labo est la porte violette 🔬 de Brumeval. Tu peux voyager jusqu'à Brumeval par la carte."
    ],
    done: () => G.f.a2,
    m: 0,
    ch: 'L',
    inn: 8
  },
  {
    c: 5,
    t: 'Sentier des Brumes et Ardenfeu',
    obj: "Du Plateau de la Ligue, prends la porte nord et traverse le Sentier des Brumes jusqu'à Ardenfeu.",
    h: [
      'La sortie nord du Plateau est maintenant ouverte.',
      'Ardenfeu est au bout du Sentier des Brumes, après un pont et des défilés.'
    ],
    done: () => G.f.n5,
    m: 24,
    ch: null
  },
  {
    c: 5,
    t: "Arène d'Ardenfeu",
    obj: "Bats Brasier à l'arène d'Ardenfeu (badge 5).",
    h: [
      "L'arène est le grand bâtiment à droite en haut.",
      "Brasier utilise le Feu et le Normal : l'Eau est efficace."
    ],
    done: () => G.badge >= 5,
    m: 24,
    ch: 'B',
    inn: 9
  },
  {
    c: 5,
    t: 'Route des Cendres et Cristalbourg',
    obj: "Prends la Route des Cendres vers le nord jusqu'à Cristalbourg.",
    h: [
      "Il faut 5 badges pour franchir la sortie nord d'Ardenfeu.",
      "Cristalbourg est au bout de la Route des Cendres, de l'autre côté d'un pont."
    ],
    done: () => G.f.n6,
    m: 26,
    ch: null
  },
  {
    c: 5,
    t: 'Arène de Cristalbourg',
    obj: "Bats Névé à l'arène de Cristalbourg (badge 6).",
    h: [
      "L'arène est le grand bâtiment à gauche en haut.",
      "Névé utilise l'Eau et le Vol : la Plante n'est pas ton amie."
    ],
    done: () => G.badge >= 6,
    m: 26,
    ch: 'B',
    inn: 9
  },
  {
    c: 5,
    t: "La Citadelle d'Éclipse",
    obj: 'Traverse la Gorge du Givre, monte à la Citadelle et affronte le Maître Éclipse.',
    h: [
      'Il faut 6 badges pour entrer dans la Gorge du Givre.',
      'Cinq Disciples gardent la Citadelle, puis le Maître Éclipse tout en haut.'
    ],
    done: () => G.f.x,
    m: 28,
    ch: 'Y'
  },
  {
    c: 6,
    t: 'La Ligue',
    obj: 'Parle au gardien de la Ligue, sur le Plateau, pour affronter les 5 champions.',
    h: [
      'Le Plateau est tout en haut du Mont Croissant, après le Commandant.',
      "Parle au gardien dans l'arène du Plateau : tes victoires sont sauvegardées."
    ],
    done: () => G.lg >= 5,
    m: 21,
    ch: 'B',
    inn: 9
  },
  {
    c: 6,
    t: 'Le Palais de combat',
    obj: 'Relève le défi en série au Palais de combat (maison marron du Plateau).',
    h: ['Le Palais est la maison marron ⌂ du Plateau.', "Parle à l'hôte pour lancer une série de combats."],
    done: () => G.rec >= 1,
    m: 21,
    ch: 'K',
    inn: 22
  }
];
const curStepIdx = () => STORY.findIndex(x => !x.done()),
  curStep = () => STORY[curStepIdx()] || null;
function pathTo(ch, adj, xy) {
  const m = maps[G.map],
    g = m.g,
    sx = G.x,
    sy = G.y,
    prev = new Map(),
    q = [[sx, sy]],
    D = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
  prev.set(sx + ',' + sy, null);
  let end = null;
  while (q.length && !end) {
    const [x, y] = q.shift();
    if (ch && g[y][x] == ch && !(x == sx && y == sy)) {
      end = [x, y];
      break;
    }
    if (xy && x == xy[0] && y == xy[1] && !(x == sx && y == sy)) {
      end = [x, y];
      break;
    }
    if (adj && D.some(([dx, dy]) => g[y + dy]?.[x + dx] == adj)) {
      end = [x, y];
      break;
    }
    for (const [dx, dy] of D) {
      const nx = x + dx,
        ny = y + dy,
        t = g[ny]?.[nx];
      if (!t || prev.has(nx + ',' + ny) || SOLID.includes(t)) continue;
      prev.set(nx + ',' + ny, [x, y]);
      q.push([nx, ny]);
    }
  }
  if (!end) return null;
  const p = [];
  for (let c = end; c; c = prev.get(c[0] + ',' + c[1])) p.push(c);
  return p.reverse();
}
function goalOf(tg) {
  if (!tg) return null;
  const cm = maps[G.map];
  if (cm.in) return tg.inn == G.map ? (tg.xy ? { xy: tg.xy } : { adj: tg.adj || 'N' }) : { ch: 'X' };
  if (G.map == tg.m) return tg.xy ? { xy: tg.xy } : tg.ch ? { ch: tg.ch } : null;
  const a = CHAIN.indexOf(G.map),
    b = CHAIN.indexOf(tg.m);
  return a < 0 || b < 0 ? null : { ch: b > a ? 'U' : 'D' };
}
const itemTg = () => {
  const left = ITM.filter(i => !G.q['i' + i.id]);
  if (!left.length) return null;
  const d = m => Math.abs(CHAIN.indexOf(m) - CHAIN.indexOf(G.map)),
    c = left.find(i => i.m == G.map) || left.slice().sort((a, b) => d(a.m) - d(b.m))[0];
  return { m: c.m, xy: [c.x, c.y] };
};
const hasS = x => G.party.some(c => c.s == x);
const SQ = [
  {
    id: 'h0',
    t: 'Un Rattou pour le grand-père',
    vis: () => true,
    done: () => G.q.h0 == 2,
    obj: () =>
      hasS(3)
        ? 'Rapporte ton Rattou au grand-père (maison brune, en bas à gauche de Brumeval).'
        : 'Attrape un Rattou dans les hautes herbes de la Route 1.',
    h: [
      'Les Rattou vivent dans les hautes herbes de la Route 1.',
      'Le grand-père habite la maison brune ⌂ de Brumeval, en bas à gauche.'
    ],
    tg: () => (hasS(3) ? { m: 0, ch: 'K', inn: 10 } : { m: 1, ch: 'g' })
  },
  {
    id: 'h1',
    t: 'Un Crabi pour Léa',
    vis: () => G.vis.includes(2),
    done: () => G.q.h1 == 2,
    obj: () =>
      hasS(6)
        ? 'Rapporte ton Crabi à Léa (maison brune de Cendrebourg).'
        : 'Attrape un Crabi : hautes herbes des Routes 1 et 2, ou en pêchant.',
    h: [
      "Les Crabi se trouvent dans l'herbe des Routes 1 et 2, et dans les mares (pêche).",
      'Léa habite la maison brune ⌂ en bas à gauche de Cendrebourg.'
    ],
    tg: () => (hasS(6) ? { m: 2, ch: 'K', inn: 11 } : { m: 1, ch: 'g' })
  },
  {
    id: 'h2',
    t: 'Le collectionneur',
    vis: () => G.vis.includes(4),
    done: () => G.q.h2 == 2,
    obj: () =>
      G.dex.c.length >= 6
        ? 'Retourne voir le collectionneur (maison brune ⌂ de Lunargent, en bas à droite).'
        : `Capture 6 espèces différentes (${G.dex.c.length}/6).`,
    h: [
      'Chaque espèce compte une fois : explore plusieurs routes et pêche.',
      'Les créatures de nuit (Spectro, Lunard) apparaissent entre 21h et 6h.'
    ],
    tg: () => (G.dex.c.length >= 6 ? { m: 4, ch: 'K', inn: 12 } : null)
  },
  {
    id: 'h3',
    t: 'Un Galet pour le Chalet de Roc',
    vis: () => G.vis.includes(15),
    done: () => G.q.h3 == 2,
    obj: () =>
      hasS(14)
        ? 'Rapporte ton Galet au Chalet de Roc (maison brune de Pierrefeu).'
        : 'Attrape un Galet : hautes herbes de la Route 3 ou Grotte Lunaire.',
    h: [
      "Les Galet vivent dans l'herbe de la Route 3 et dans la Grotte Lunaire.",
      'Le Chalet de Roc est la maison brune ⌂ en bas à gauche de Pierrefeu.'
    ],
    tg: () => (hasS(14) ? { m: 15, ch: 'K', inn: 19 } : { m: 14, ch: 'g' })
  },
  {
    id: 'h4',
    t: 'Niveau 20 pour la maison du port',
    vis: () => G.vis.includes(17),
    done: () => G.q.h4 == 2,
    obj: () =>
      G.party.some(c => c.lv >= 20)
        ? "Retourne à la maison du port d'Havre-d'Opale (maison brune ⌂)."
        : 'Amène une créature au niveau 20, puis va à la maison du port.',
    h: [
      "Affronte des dresseurs : ils donnent beaucoup d'expérience.",
      "La maison du port est la maison brune ⌂ en bas à gauche d'Havre-d'Opale."
    ],
    tg: () => (G.party.some(c => c.lv >= 20) ? { m: 17, ch: 'K', inn: 20 } : null)
  },
  {
    id: 'h5',
    t: 'Un Magmite pour la forge',
    vis: () => G.vis.includes(24),
    done: () => G.q.h5 == 2,
    obj: () =>
      hasS(22)
        ? "Rapporte ton Magmite à la forge d'Ardenfeu."
        : 'Attrape un Magmite dans les hautes herbes de la Route des Cendres.',
    h: [
      'Les Magmite vivent près des volcans, sur la Route des Cendres.',
      "La forge est la maison brune ⌂ en haut d'Ardenfeu."
    ],
    tg: () => (hasS(22) ? { m: 24, ch: 'K', inn: 29 } : { m: 25, ch: 'g' })
  },
  {
    id: 'h6',
    t: 'Niveau 35 pour la maison de cristal',
    vis: () => G.vis.includes(26),
    done: () => G.q.h6 == 2,
    obj: () =>
      G.party.some(c => c.lv >= 35)
        ? 'Retourne à la maison de cristal de Cristalbourg.'
        : 'Amène une créature au niveau 35, puis va à la maison de cristal.',
    h: [
      "Les Disciples d'Éclipse donnent beaucoup d'expérience.",
      'La maison de cristal est la maison brune ⌂ à droite de Cristalbourg.'
    ],
    tg: () => (G.party.some(c => c.lv >= 35) ? { m: 26, ch: 'K', inn: 30 } : null)
  },
  {
    id: 'lun',
    t: 'Luniel, la créature rare',
    vis: () => G.vis.includes(3),
    done: () => !!G.q.lun,
    obj: () => 'Trouve Luniel dans la Grotte Lunaire (Route 2) et capture-le.',
    h: [
      "La Grotte Lunaire est au bout d'un sentier à l'ouest de la Route 2.",
      'Luniel est tout au fond de la grotte : prends des Capsules et affaiblis-le.'
    ],
    tg: () => ({ m: 3, ch: 'O', inn: 13, adj: 'N' })
  },
  {
    id: 'chest',
    t: 'Le coffre de la grotte',
    vis: () => G.vis.includes(3),
    done: () => !!G.q.chest,
    obj: () => 'Ouvre le coffre au fond de la Grotte Lunaire.',
    h: [
      'Le coffre est dans la Grotte Lunaire, sur la Route 2.',
      'Il est dans le coin en haut à droite de la grotte.'
    ],
    tg: () => ({ m: 3, ch: 'O', inn: 13, adj: 'o' })
  },
  {
    id: 'items',
    t: 'Les objets cachés ✨',
    vis: () => true,
    done: () => ITM.every(i => G.q['i' + i.id]),
    obj: () => `Trouve les objets cachés (${ITM.filter(i => G.q['i' + i.id]).length}/${ITM.length}).`,
    h: [
      'Les ✨ brillent doucement sur les routes et dans les villes.',
      () => {
        const t = itemTg();
        return t ? 'Le plus proche est dans : ' + maps[t.m].n + '.' : '';
      }
    ],
    tg: itemTg
  }
];
const sqActive = () => SQ.find(x => x.id == G.track && x.vis() && !x.done());
const activeTarget = () => {
  const q = sqActive();
  return q ? q.tg() : curStep();
};
const activeTitle = () => {
  const q = sqActive();
  return q ? q.t : (curStep() || {}).t || '';
};
const trackName = () => {
  const q = sqActive();
  return q ? q.t : 'Histoire';
};
let hq = {};
function guideGoal() {
  return goalOf(activeTarget());
}
let gpC = { k: '' };
function guidePath() {
  const t = activeTarget(),
    k = G.map + '|' + G.x + '|' + G.y + '|' + JSON.stringify(t && [t.m, t.ch, t.inn, t.adj, t.xy]);
  if (gpC.k == k) return gpC.p;
  gpC = { k, p: null };
  const gl = goalOf(t);
  if (gl) gpC.p = pathTo(gl.ch, gl.adj, gl.xy);
  return gpC.p;
}
function toggleGuide() {
  S.guide = S.guide ? 0 : 1;
  saveS();
  toast('🧭 Chemin ' + (S.guide ? 'activé' : 'désactivé'));
}
let hintN = 0,
  hintSt = -1;
const stF = {};
function story() {
  if (busy) return;
  const ci = curStepIdx(),
    dn = ci < 0 ? STORY.length : ci,
    st = STORY[ci],
    rr = f => {
      $('pn').style.display = 'none';
      busy = false;
      f();
    };
  if (hintSt != ci) {
    hintSt = ci;
    hintN = 0;
  }
  let h = `<h3>📜 Journal de l'histoire</h3><div class="bar" style="height:14px"><i style="width:${(dn / STORY.length) * 100}%;background:#e8b04a"></i></div><div style="margin:4px 0;font-size:13px">${dn}/${STORY.length} étapes · 🧭 Suivi : ${trackName()}${G.track ? ' <button id="ts2">Suivre l\'histoire</button>' : ''}</div>`;
  const cc = st ? st.c : -1;
  CH_N.forEach((cn, c) => {
    const cnt = STORY.filter(x => x.c == c).length,
      dd = STORY.filter((x, i) => x.c == c && (ci < 0 || i < ci)).length,
      op = c == cc || stF[c];
    h += `<button class="fh${c == cc ? ' cu' : ''}" data-fc="${c}">${op ? '▼' : '▶'} Chapitre ${c + 1} · ${cn}<em>${dd}/${cnt}</em></button>`;
    if (!op) return;
    STORY.forEach((s2, i) => {
      if (s2.c != c) return;
      if (ci < 0 || i < ci) h += `<div style="opacity:.6">✅ <s>${s2.t}</s></div>`;
      else if (i == ci)
        h += `<div style="background:#fff3c4;border:2px solid #e8b04a;border-radius:10px;padding:8px;margin:4px 0">🔸 <b>${s2.t}</b><br>${s2.obj}${hintN ? '<br>💡 ' + s2.h.slice(0, hintN).join('<br>💡 ') : ''}<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button id="sh">💡 Indice${hintN >= s2.h.length ? ' (tout vu)' : ''}</button><button id="sg">🧭 Chemin : ${S.guide ? 'ON' : 'OFF'}</button><button id="sm">📍 Carte</button></div><div id="sd" style="font-size:13px;margin-top:6px"></div></div>`;
      else h += `<div style="opacity:.45">🔒 ${i == ci + 1 ? s2.t : '???'}</div>`;
    });
  });
  if (ci < 0)
    h += "<p>🎉 Toute l'histoire est terminée ! Il reste les quêtes annexes, le bestiaire et les succès.</p>";
  panel(h);
  if ($('ts2'))
    $('ts2').onclick = () => {
      G.track = null;
      save();
      rr(story);
    };
  document.querySelectorAll('#pn [data-fc]').forEach(
    b =>
      (b.onclick = () => {
        const c = +b.dataset.fc;
        if (c == cc) return;
        stF[c] = !stF[c];
        rr(story);
      })
  );
  if (!st) return;
  const gp = guidePath();
  $('sd').textContent = gp
    ? `≈ ${gp.length - 1} pas jusqu'à ${maps[G.map].in ? 'la sortie ou ' : ''}la prochaine étape dans cette zone.`
    : maps[G.map].in
      ? ''
      : 'Rends-toi dans la zone indiquée.';
  $('sh').onclick = () => {
    hintN = Math.min(st.h.length, hintN + 1);
    rr(story);
  };
  $('sg').onclick = () => {
    S.guide = S.guide ? 0 : 1;
    saveS();
    rr(story);
  };
  $('sm').onclick = () => rr(() => worldmap(0));
}
const fmt = t => `${Math.floor(t / 3600)}h ${Math.floor(t / 60) % 60}min`;
const obj = () => {
  const x = curStep();
  return x ? x.obj : 'Histoire terminée ! Termine les quêtes et le Bestiaire.';
};
setInterval(() => {
  if ($('ti').style.display == 'none') G.sx.time++;
}, 1000);
