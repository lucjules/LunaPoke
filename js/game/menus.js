// Équipe, bestiaire, PNJ, quêtes des habitants, coffres, pêche
// ---------- Menus ----------
function panel(h) {
  const p = $('pn');
  h = tr(h);
  p.innerHTML = h + '<p><button id="x">Fermer</button></p>';
  p.style.display = 'block';
  busy = true;
  $('x').onclick = () => {
    p.style.display = 'none';
    busy = false;
  };
}
function renamePanel(i) {
  const c = G.party[i];
  $('pn').style.display = 'none';
  busy = false;
  panel(
    `<h3>✏️ Surnom de ${SP[c.s].n}</h3><input id="nk" maxlength="12" value="${c.nick || ''}" style="width:100%;font-size:18px;padding:8px;box-sizing:border-box"><p><button id="ok">Valider</button> <button id="rm">Effacer</button></p>`
  );
  const done = () => {
    save();
    $('pn').style.display = 'none';
    busy = false;
    team();
  };
  $('ok').onclick = () => {
    const v = ($('nk').value || '')
      .replace(/[<>&"'`]/g, '')
      .trim()
      .slice(0, 12);
    if (v) c.nick = v;
    else delete c.nick;
    done();
  };
  $('rm').onclick = () => {
    delete c.nick;
    done();
  };
}
function team() {
  if (busy) return;
  panel(
    '<h3>Équipe (' +
      G.party.length +
      '/6)</h3>' +
      G.party
        .map((c, i) => {
          const p = Math.max(0, Math.round((c.hp / c.mh) * 100));
          return `<div class="tm"><button data-i="${i}" class="tmb"><span class="di">${spr(c.s, 30)}</span><span class="tmt"><span><b>${i == 0 ? '★ ' : ''}${nm(c)}</b> <small>Nv${c.lv}</small></span><span class="hpb"><i class="${p < 25 ? 'lo' : p < 50 ? 'mid' : ''}" style="width:${p}%"></i></span><small>${c.hp}/${c.mh} PV${c.hp <= 0 ? ' · K.O.' : ''}</small></span></button><button data-r="${i}" class="ed" aria-label="Renommer">Nom</button></div>`;
        })
        .join('') +
      '<small>Touche une créature pour la mettre en tête.</small>'
  );
  document.querySelectorAll('#pn [data-r]').forEach(b => (b.onclick = () => renamePanel(+b.dataset.r)));
  document.querySelectorAll('#pn [data-i]').forEach(
    b =>
      (b.onclick = () => {
        const i = +b.dataset.i;
        [G.party[0], G.party[i]] = [G.party[i], G.party[0]];
        save();
        $('pn').style.display = 'none';
        busy = false;
        team();
      })
  );
}
const DESC = [
  "Un renardeau dont la queue ne s'éteint jamais. Il se blottit près des feux de camp.",
  'Un petit poulpe curieux qui jaillit des mares pour observer les voyageurs.',
  'Une pousse vivante. Il se nourrit de soleil et grandit un peu chaque matin.',
  'Rongeur débrouillard présent partout. Il adore ronger les clôtures.',
  "Oiseau vif au chant moqueur. Il survole les routes à l'aube.",
  "Champignon timide qui s'abrite sous les feuilles humides.",
  'Un crabe têtu dont la carapace résiste à presque tout.',
  'Gardien des braises de Cendrebourg. Son souffle réchauffe les hivers.',
  "Il ne sort qu'à la nuit tombée, guidé par la lueur de la lune.",
  'Lion de feu dont la crinière flambe quand il rugit.',
  'Une baleine douce qui chante pour apaiser les marées.',
  'Un arbre ambulant qui abrite des dizaines de petites créatures.',
  'Rapace majestueux qui plonge plus vite que le vent.',
  "Sa lueur guide les voyageurs égarés dans la Forêt d'Argent.",
  "Un caillou rond et lourd. On dit qu'il garde la mémoire des montagnes.",
  'Une silhouette pâle qui rôde dans les grottes et les nuits sans lune.',
  "Créature légendaire née d'un Éclat lunaire. Elle apparaît très rarement.",
  'Chef de meute respecté. Il fait trembler les petits rongeurs.',
  'Colosse des marées. Ses pinces brisent les rochers.',
  'Roi des sous-bois : ses spores endorment ses ennemis.',
  'Têtu des montagnes, il fonce sans réfléchir.',
  'Chouette silencieuse des sentiers de montagne.',
  'Né dans les volcans, il fait fondre la neige autour de lui.',
  'Coquillage des ports, sa nacre brille sous la lune.',
  'Fleur vivante des prairies. Elle danse quand le vent se lève.',
  'Il chevauche les orages du Mont Croissant.',
  "Statue vivante des anciens. Il ne bouge que si on l'y force.",
  "Salamandre des cratères d'Ardenfeu : sa peau reste brûlante des jours durant.",
  "Né dans la glace de Cristalbourg, il fait geler l'air autour de lui.",
  "Un bloc de cristal vivant. Rien ne l'abîme, pas même la foudre.",
  "Oiseau d'orage de la Gorge du Givre. Il plonge dans un éclair.",
  "Chauve-souris des ténèbres, fidèle aux Disciples d'Éclipse.",
  'Un vieil arbre des bois sombres, gardien de sentiers oubliés.',
  "Le fragment vivant de l'Éclat-mère. Sa présence éteint les étoiles.",
  'Un Cendrelin transformé par la Pierre Ardente. Son cratère crache des braises quand il se fâche.',
  "Né d'une Coralie et d'une Pierre Marée, ce récif vivant abrite des poissons entre ses branches.",
  'Une Pétale baignée de clair de lune. Elle ne fleurit vraiment que la nuit.',
  'Un Lunard devenu chat de la nuit. Ses yeux dorés voient à travers les ténèbres.',
  "Un petit soleil vivant du Chemin de l'Aube. Il se lève toujours avant tout le monde.",
  'Un coquillage aux reflets nacrés. Il chante quand la marée monte.',
  'Une gerbe de blé doré qui ondule même sans vent.',
  'Un nuage curieux qui adore cacher les sommets.',
  "Oiseau sacré de l'aube. Sa crête s'illumine aux premières lueurs.",
  "Gardien doré du Sanctuaire solaire. On dit qu'il réveille le soleil chaque matin.",
  'Un fragment de corail vivant qui roule sur les plages au gré des vagues.',
  "Un cerf-volant vivant. Il se laisse porter par les bourrasques de l'archipel.",
  'Un lotus qui respire la brume des marais.',
  'Sa flamme guide les bateaux perdus dans le brouillard.',
  'Une huître qui garde une perle de lune dans sa coquille.',
  'Une sphère étoilée venue du ciel du soir. Ses taches dessinent des constellations.',
  "L'étoile du soir devenue créature. Elle ne descend que pour les dresseurs les plus forts.",
  'Une loutre joueuse qui flotte sur le dos pour casser des coquillages.',
  'Une loutre puissante qui porte un collier de coquillages.',
  'Une petite méduse translucide qui dérive dans les eaux calmes.',
  "Une grande méduse ornée d'étoiles. Ses filaments brillent dans les profondeurs.",
  'Une tortue paisible. De la mousse pousse sur sa carapace.',
  'Un arbre a pris racine sur sa carapace. Elle se déplace très lentement.',
  "Un poisson argenté marqué d'un croissant de lune.",
  'Une carpe élégante qui remonte les courants au clair de lune.',
  "Dragon marin du grand large. Les marins le craignent autant qu'ils l'admirent.",
  'Une petite salamandre dont la queue fume quand elle est contente.',
  'Des crêtes de feu ont poussé sur son dos. Il dort dans les braises.',
  'Un dragon de feu aux ailes immenses. Son souffle fait fondre la roche.',
  'Un poussin couvert de cendre tiède. Il pépie des étincelles.',
  "Un phénix flamboyant. On dit qu'il renaît de ses cendres.",
  "Un diablotin farceur qui allume des feux de camp pour s'amuser.",
  'Ses poings enflammés et ses cornes de lave impressionnent même les dresseurs aguerris.',
  "Un bourgeon timide qui ne s'ouvre qu'au soleil.",
  'Une créature fleurie à collerette. Elle sème des pétales en marchant.',
  'Un esprit des bois qui veille sur les clairières.',
  'Un lapin aux oreilles en forme de feuilles. Il bondit dans les hautes herbes.',
  'Un lièvre véloce. La fleur sur sa tête suit le soleil.',
  'Un petit cactus fleuri qui pique quand on le serre trop fort.',
  'Un grand cactus aux bras levés, couronné de fleurs jaunes.',
  'Un chaton qui porte un croissant de lune sur le front.',
  'Une panthère nocturne, silencieuse comme une ombre.',
  'Un ourson gourmand qui adore le miel des forêts.',
  'Un grand ours cuirassé, protecteur des voyageurs.',
  'Un faon tacheté et craintif.',
  "Un cerf majestueux aux bois d'or.",
  'Un petit hérisson qui se roule en boule au moindre bruit.',
  'Ses piquants métalliques arrêtent presque toutes les attaques.',
  'Un esprit de brume qui se forme les matins humides.',
  'Un poussin duveteux qui rêve de voler.',
  'Un faucon vif qui plonge sur sa proie.',
  'Un grand rapace royal qui règne sur les falaises.',
  'Un papillon lumineux attiré par les lanternes.',
  'Ses ailes ornées de croissants brillent sous la lune.',
  'Une mouette rieuse qui suit les bateaux de pêche.',
  'Il peut planer des jours entiers sans battre des ailes.',
  'Un petit manchot qui glisse sur le ventre.',
  'Un manchot empereur au collier doré.',
  'Un scarabée turquoise à la carapace brillante.',
  'Un scarabée doré à grande corne, robuste comme un rocher.',
  'Une grenouille bleue qui saute de nénuphar en nénuphar.',
  'Un gros crapaud doré qui souffle des bulles.',
  'Un serpent vert et discret des hautes herbes.',
  'Un serpent à crête dont le regard fige ses adversaires.',
  'Le dragon solaire légendaire du Sommet des Légendes.',
  'Le colosse des abysses. Sa lanterne éclaire les fonds marins.'
];
function dex() {
  if (busy) return;
  panel(
    '<h3>📖 Bestiaire</h3>' +
      SP.map((s, i) => {
        const v = G.dex.s.includes(i);
        return `<button class="dr" data-e="${i}" ${v ? '' : 'disabled'}><span class="dm">${G.dex.c.includes(i) ? '✅' : v ? '👁' : '▫️'}</span><span class="dn">${String(i + 1).padStart(2, '0')}</span><span class="di">${v ? spr(i, 26) : ''}</span><span class="dt">${v ? s.n : '???'}</span></button>`;
      }).join('') +
      `<p>Vus ${G.dex.s.length} · Capturés ${G.dex.c.length}/${SP.length}</p>`
  );
  document.querySelectorAll('#pn [data-e]').forEach(b => (b.onclick = () => dexInfo(+b.dataset.e)));
}
function dexInfo(i) {
  $('pn').style.display = 'none';
  busy = false;
  const s = SP[i],
    cap = G.dex.c.includes(i),
    ty = { N: 'Normal', F: 'Feu 🔥', E: 'Eau 💧', P: 'Plante 🌿', V: 'Vol 🕊' }[s.t],
    bar = (l, v) =>
      `<div class="sb"><span>${l}</span><div class="bar"><i style="width:${Math.min(100, v)}%;background:#4a9bf0"></i></div><em>${v}</em></div>`,
    pre = SP.findIndex(x => (x.ev && x.ev[1] == i) || (x.se && x.se[1] == i)),
    hab = maps.map(m => (m.e && m.e.s.includes(i) ? m.n : null)).filter(Boolean);
  panel(
    `<h3>${String(i + 1).padStart(2, '0')} · ${s.n}</h3><div style="text-align:center">${spr(i, 130)}</div><p>Type : <b>${ty}</b> · ${cap ? '✅ Capturé' : '👁 Vu'}</p>${bar('PV', s.h)}${bar('Attaque', s.a)}${bar('Défense', s.d)}${DESC[i] ? `<p>${DESC[i]}</p>` : ''}` +
      (s.ev ? `<p>🔄 Évolue en <b>${SP[s.ev[1]].n}</b> au niveau ${s.ev[0]}.</p>` : '') +
      (s.se ? `<p>🔄 Évolue en <b>${SP[s.se[1]].n}</b> avec la ${IT[s.se[0]][0]}.</p>` : '') +
      (SIG[i]
        ? `<p>⚔ Attaque propre (niveau ${SIG_LV}) : <b>${MV[SIG[i]][0]}</b> — ${mvDesc(SIG[i])}.</p>`
        : '') +
      (pre >= 0 ? `<p>🔄 Évolution de <b>${SP[pre].n}</b>.</p>` : '') +
      (cap && hab.length ? `<p>📍 ${hab.join(', ')}</p>` : '') +
      (i == 16 ? '<p>📍 Grotte Lunaire</p>' : '') +
      (i < 3 ? '<p>🎁 Choix de départ</p>' : '') +
      '<p><button id="bk">◀ Retour au bestiaire</button></p>'
  );
  $('bk').onclick = () => {
    $('pn').style.display = 'none';
    busy = false;
    dex();
  };
}
const NP = [
  {
    m: 0,
    e: '👵',
    x: 9,
    y: 11,
    l: [
      'Villageoise : Les Éclats lunaires brillaient tant autrefois…',
      'Villageoise : Le Professeur Sauge cherche un jeune dresseur.'
    ]
  },
  {
    m: 2,
    e: '👦',
    x: 12,
    y: 8,
    l: [
      'Garçon : Ilex est très fort avec les créatures de Feu !',
      "Garçon : Bats-le avec une créature d'Eau !"
    ]
  },
  {
    m: 4,
    e: '🧙',
    x: 6,
    y: 8,
    l: [
      "Vieux sage : La Forêt d'Argent garde un secret lunaire…",
      'Vieux sage : Mira est la gardienne de la marée.'
    ]
  },
  {
    m: 4,
    e: '👧',
    x: 3,
    y: 9,
    l: [
      'Fillette : Mamie dit que le coffre de la Grotte Lunaire cache un passage…',
      "Fillette : Mais il ne s'ouvre qu'après l'apparition du sceau noir !"
    ]
  }
];
// les habitants se promènent de temps en temps
setInterval(() => {
  if (busy || document.hidden) return;
  NP.forEach(n => {
    if (n.m != G.map || n.st || Math.random() < 0.5) return;
    const d = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
      ][Math.floor(Math.random() * 4)],
      x = n.x + d[0],
      y = n.y + d[1];
    if (
      '.='.includes(maps[n.m].g[y]?.[x] || '#') &&
      !(x == G.x && y == G.y) &&
      !NP.some(o => o !== n && o.m == n.m && o.x == x && o.y == y)
    ) {
      n.x = x;
      n.y = y;
    }
  });
}, 700);
function talk(k, q) {
  if (k == 'secret') return colp();
  if (k == 'palace') return palace();
  if (k == 'lab') return lab();
  if (k == 'gym') return gym();
  if (k == 'cave') return legend();
  if (k == 'home' && q != null) return quest(q);
  heal();
  save();
  say(
    k == 'home'
      ? ['Maman : Te revoilà ! Repose-toi un peu, mon grand.', 'Ton équipe est en pleine forme !']
      : [
          'Infirmière : Bienvenue au Centre de soins !',
          'Tes partenaires sont en pleine forme. Veux-tu utiliser le PC ?'
        ],
    () => {
      if (k == 'center')
        choose(['Ouvrir le PC', 'Non merci'], i => {
          if (!i) pcBox();
        });
    }
  );
}
const QS = [
  [
    () => G.party.some(x => x.s == 3),
    'Attrape un Rattou sur la Route 1 et reviens me voir !',
    'Un Rattou ! Merci, voici 3 Potions et 100 💰.',
    () => {
      G.pots += 3;
      G.gold += 100;
    }
  ],
  [
    () => G.party.some(x => x.s == 6),
    "J'adore les Crabi ! Attrapes-en un, à la pêche ou dans l'herbe.",
    'Un Crabi ! Merci, voici 3 Capsules.',
    () => (G.balls += 3)
  ],
  [
    () => G.dex.c.length >= 6,
    'Je collectionne les créatures. Capture 6 espèces différentes !',
    'Six espèces ! Un vrai collectionneur. Prends 400 💰.',
    () => (G.gold += 400)
  ],
  [
    () => G.party.some(x => x.s == 14),
    "Un Galet ! J'en rêve depuis toujours… Rapporte-m'en un !",
    'Un Galet ! Merci, voici 5 Potions et 2 Super Potions.',
    () => {
      G.pots += 5;
      G.sp += 2;
    }
  ],
  [
    () => G.party.some(x => x.lv >= 20),
    "Reviens quand l'une de tes créatures aura atteint le niveau 20.",
    'Niveau 20 ! Impressionnant. Prends 600 💰.',
    () => (G.gold += 600)
  ],
  [
    () => G.party.some(x => x.s == 22),
    "Un Magmite ! Rapporte-m'en un des cratères du Sentier des Brumes.",
    'Un Magmite ! Merci, voici 1 000 💰.',
    () => (G.gold += 1000)
  ],
  [
    () => G.party.some(x => x.lv >= 35),
    "Reviens quand l'une de tes créatures aura atteint le niveau 35.",
    'Niveau 35 ! Prends ces 5 Super Potions.',
    () => (G.sp += 5)
  ]
];
let qTab = 0;
function quests() {
  if (busy) return;
  const rr = f => {
    $('pn').style.display = 'none';
    busy = false;
    f();
  };
  const act = SQ.filter(q => !q.done()),
    dn = SQ.filter(q => q.done());
  if (qTab == 1 && !dn.length) qTab = 0;
  let h = `<h3>📋 Quêtes annexes</h3><p class="ob">🎯 ${obj()}</p><div class="tabs"><button id="qa" class="${qTab ? '' : 'on'}">En cours (${act.length})</button><button id="qd" class="${qTab ? 'on' : ''}">Terminées (${dn.length})</button></div><div class="pbar"><i style="width:${SQ.length ? (dn.length / SQ.length) * 100 : 0}%"></i></div><small>🧭 Suivi du chemin : <b>${trackName()}</b></small>`;
  (qTab ? dn : act).forEach(q => {
    const av = q.vis(),
      n = hq[q.id] || 0,
      st = q.done() ? '✅' : G.q[q.id] == 1 ? '🔸' : '▫️',
      tr = G.track == q.id;
    if (q.done()) {
      h += `<div class="qc done">${st} <b>${q.t}</b></div>`;
      return;
    }
    h += `<div class="qc${tr ? ' tr' : ''}">${st} <b>${av ? q.t : '???'}</b>`;
    if (av)
      h += `<div class="qo">${q.obj()}</div>${
        n
          ? '<div class="qh">💡 ' +
            q.h
              .slice(0, n)
              .map(x => (typeof x == 'function' ? x() : x))
              .filter(Boolean)
              .join('<br>💡 ') +
            '</div>'
          : ''
      }<div class="qb"><button data-qh="${q.id}">💡 Indice${n >= q.h.length ? ' (tout vu)' : ''}</button><button data-qt="${q.id}" ${q.tg() ? '' : 'disabled'}>🧭 ${tr ? 'Suivi ✓' : q.tg() ? 'Suivre' : 'Pas de chemin'}</button></div>`;
    h += '</div>';
  });
  if (!(qTab ? dn : act).length)
    h += `<p class="ob">${qTab ? 'Aucune quête terminée pour le moment.' : '🎉 Toutes les quêtes annexes sont terminées !'}</p>`;
  panel(
    h +
      `<p><button id="qs">📜 Retour à l'histoire</button></p><small>Objets cachés trouvés : ${Object.keys(G.q).filter(k => /^i\d/.test(k)).length}/${ITM.length}</small>`
  );
  $('qa').onclick = () => {
    qTab = 0;
    rr(quests);
  };
  $('qd').onclick = () => {
    qTab = 1;
    rr(quests);
  };
  document.querySelectorAll('#pn [data-qh]').forEach(
    b =>
      (b.onclick = () => {
        const q = SQ.find(x => x.id == b.dataset.qh);
        hq[q.id] = Math.min(q.h.length, (hq[q.id] || 0) + 1);
        rr(quests);
      })
  );
  document.querySelectorAll('#pn [data-qt]').forEach(
    b =>
      (b.onclick = () => {
        G.track = b.dataset.qt;
        if (!S.guide) {
          S.guide = 1;
          saveS();
        }
        save();
        toast('🧭 Chemin vers : ' + trackName());
        rr(quests);
      })
  );
  $('qs').onclick = () => {
    G.track = null;
    save();
    rr(story);
  };
}
function quest(q) {
  const Q = QS[q],
    k = 'h' + q;
  if (G.q[k] == 2) return say(['Merci encore pour ton aide !']);
  if (Q[0]()) {
    G.q[k] = 2;
    Q[3]();
    save();
    sfx(900, 0.25);
    say([Q[2]]);
  } else {
    G.q[k] = 1;
    say([Q[1]]);
  }
}
function legend() {
  if (G.q.lun) return say(['La grotte est silencieuse…']);
  say(["Une lueur argentée t'observe… Luniel apparaît !"], async () => {
    const r = await battle([mkC(16, 15)], null, true);
    if (r == 'win' || r == 'caught') {
      G.q.lun = 1;
      save();
    }
  });
}
const SCH = { '2,2': 'gr', '12,2': 'ec', '2,4': 'ba', '12,4': 'lu' };
function chest(x, y) {
  if (G.map == SEC) {
    const k = 'c' + x + '_' + y,
      it = SCH[x + ',' + y];
    if (G.q[k] || !it) return say(['Le coffre est vide.']);
    G.q[k] = 1;
    addI(it);
    sfx(800, 0.25);
    save();
    return say([`Tu trouves ${IT[it][1]} ${IT[it][0]} ! (${IDESC[it]})`, 'Équipe-le depuis ☰ Menu → Sac.']);
  }
  if (G.q.chest) {
    if (G.f.a2)
      return say(
        ['Le coffre est vide… mais le fond sonne creux !', "Un passage lunaire s'ouvre et t'aspire !"],
        () => {
          G.ret = [13, 11, 3];
          sfx(900, 0.4);
          go(SEC, 7, 10);
        }
      );
    return say(['Le coffre est vide.']);
  }
  G.q.chest = 1;
  G.gold += 300;
  G.balls += 3;
  G.pots += 2;
  sfx(800, 0.25);
  save();
  say(['Tu ouvres le coffre : 300 💰, 3 Capsules et 2 Potions !']);
}
const SECG = mk(15, 12, () => '.');
rect(SECG, 2, 6, 5, 9, 'g');
rect(SECG, 9, 6, 12, 9, 'g');
[
  [2, 2],
  [12, 2],
  [2, 4],
  [12, 4]
].forEach(([x, y]) => (SECG[y][x] = 'o'));
SECG[2][7] = 'N';
SECG[2][5] = SECG[2][9] = 'p';
SECG[11][7] = 'X';
const SEC = maps.length;
maps.push({
  n: 'Clairière Cachée',
  g: SECG,
  in: 1,
  k: 'secret',
  e: { s: [7, 8, 23, 24, 16, 13], l: [24, 28] }
});
function colp() {
  say(
    [
      'Colporteur : Psst… Peu de gens trouvent cette clairière !',
      'Colporteur : Mes pierres font évoluer : Ardente→Cendrelin, Marée→Coralie, Sève→Pétale, Lune→Lunard. 600 💰 pièce.'
    ],
    colp2
  );
}
function colp2() {
  G.q.sec = 1;
  choose(
    ['Pierre Ardente 🔥', 'Pierre Marée 💧', 'Pierre Sève 🍃', 'Pierre Lune 🌙', `Partir (💰 ${G.gold})`],
    i => {
      if (i > 3) return say(['Colporteur : Reviens quand tu veux.']);
      if (G.gold < 600) return say(['Colporteur : Il te manque des 💰.'], colp2);
      G.gold -= 600;
      addI(['pf', 'pm', 'ps', 'pl'][i]);
      save();
      colp2();
    }
  );
}
function fish() {
  const r = Math.random();
  sfx(300, 0.1);
  G.sx.fish = (G.sx.fish || 0) + 1;
  tip('fish', "Face à l'eau, appuie sur A pour pêcher : une créature, ou un trésor !");
  say(['Tu lances ta ligne…'], () => {
    if (r < 0.5) say(['Rien ne mord.']);
    else if (r < 0.85) say(['Ça mord !'], () => battle([fishC()], null, true));
    else {
      const g = 40 + Math.floor(Math.random() * 60);
      G.gold += g;
      save();
      say([`Tu pêches un petit coffret : ${g} 💰 !`]);
    }
  });
}
function item() {
  const i = ITM.find(i => i.m == G.map && i.x == G.x && i.y == G.y && !G.q['i' + i.id]);
  if (!i) return false;
  G.q['i' + i.id] = 1;
  if (i.t == 'gold') G.gold += i.n;
  else G[i.t] += i.n;
  sfx(900, 0.2);
  save();
  say([
    `✨ Tu trouves ${i.n} ${i.t == 'gold' ? '💰' : i.t == 'pots' ? 'Potion(s)' : i.t == 'sp' ? 'Super Potion(s)' : 'Capsule(s)'} !`
  ]);
  return true;
}
// tirage d'une espèce sauvage ; dans les zones de début de partie (niveau max ≤ 20),
// Luciole apparaît en plus le jour, Spectro et Lunard la nuit
const pick = a => {
  const h = new Date().getHours(),
    E = maps[G.map] && maps[G.map].e,
    early = !E || !E.l || E.l[1] <= 20,
    p = [...a, ...(!early ? [] : h >= 21 || h < 6 ? [15, 15, 8] : [13])];
  return p[Math.floor(Math.random() * p.length)];
};
