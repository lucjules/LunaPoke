// Menu principal, carte du monde, paramètres, succès, PC, Ligue, Palais, fichiers de sauvegarde
function saveNow() {
  save();
  say(['Partie sauvegardée !']);
}
function hub() {
  if (busy) return;
  const bd = G.badge || 0;
  panel(
    `<h3>☰ Menu</h3><div class="tc"><div><b>${G.pn || 'Toi'}</b> · ${G.gold} 💰</div><div class="bdg">${Array.from({ length: 19 }, (_, i) => `<i class="${i < bd ? 'on' : ''}"></i>`).join('')}</div><div>Bestiaire ${G.dex.c.length}/${SP.length} · Équipe ${G.party.length}/6</div></div><p class="ob">🎯 ${obj()}</p>` +
      '<div class="mg">' +
      [
        ['Équipe', 'team'],
        ['Sac', 'bag'],
        ['Quêtes', 'quests'],
        ['Bestiaire', 'dex'],
        ['Carte', 'worldmap'],
        ['Histoire', 'story'],
        ['Guide', 'guideBtn'],
        ['Succès', 'achievements'],
        ['Apparence', 'lookBtn'],
        ['Réglages', 'settings'],
        ['Sauvegarde', 'saveNow']
      ]
        .map(([n, f]) => `<button data-h="${f}" class="li">${n}</button>`)
        .join('') +
      '</div>'
  );
  document.querySelectorAll('#pn [data-h]').forEach(
    b =>
      (b.onclick = () => {
        $('pn').style.display = 'none';
        busy = false;
        window[b.dataset.h]();
      })
  );
}
const WN = [
  [0, 80, 510, 'Brumeval', 1],
  [1, 112, 455, 'Route 1'],
  [2, 170, 405, 'Cendrebourg', 1],
  [3, 120, 352, 'Route 2'],
  [4, 78, 302, 'Lunargent', 1],
  [5, 138, 248, "Forêt d'Argent"],
  [14, 192, 198, 'Route 3'],
  [15, 238, 158, 'Pierrefeu', 1],
  [16, 176, 112, 'Route 4'],
  [17, 112, 76, "Havre-d'Opale", 1],
  [18, 172, 34, 'Mont Croissant'],
  [21, 258, 34, 'Plateau de la Ligue', 1],
  [13, 214, 352, 'Grotte Lunaire'],
  [23, 312, 72, 'Sentier des Brumes'],
  [24, 372, 118, 'Ardenfeu', 1],
  [25, 322, 172, 'Route des Cendres'],
  [26, 388, 224, 'Cristalbourg', 1],
  [27, 336, 278, 'Gorge du Givre'],
  [28, 396, 336, "Citadelle d'Éclipse"]
];
const WE = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 14],
  [14, 15],
  [15, 16],
  [16, 17],
  [17, 18],
  [18, 21],
  [3, 13],
  [21, 23],
  [23, 24],
  [24, 25],
  [25, 26],
  [26, 27],
  [27, 28]
];
const WI = {
  0: ['Village de départ', 'Labo du Prof. Sauge, ta maison, la grand-rue.'],
  1: ['Niveaux 3 à 6', 'Premiers dresseurs, mares de pêche.'],
  2: ["Arène d'Ilex (Feu)", 'Centre, boutique, maison de Léa.'],
  3: ['Niveaux 8 à 11', 'Un sentier mène à la Grotte Lunaire.'],
  4: ['Arène de Mira (Eau)', 'Centre, boutique, maison du collectionneur.'],
  5: ['Niveaux 12 à 15', 'Le lieutenant Corbin garde le passage.'],
  14: ['Niveaux 14 à 17', 'Sentier de montagne.'],
  15: ['Arène de Granit (Normal)', 'Chalet de Roc, boutique.'],
  16: ['Niveaux 17 à 20', 'Un lac et des dresseurs.'],
  17: ['Arène de Zéphyr (Vol)', 'Le port, la maison du port.'],
  18: ['Niveaux 20 à 25', "Le Commandant Vesper t'attend au sommet."],
  21: ['Ligue et Palais de combat', "Après l'histoire : 5 champions, séries de victoires."],
  13: ['Niveaux 9 à 12', 'Un coffre et Luniel, la créature rare.'],
  23: ['Niveaux 34 à 38', 'Un sentier brumeux au nord du Plateau.'],
  24: ['Arène de Brasier (Feu)', 'Ville volcanique : centre, boutique, forge.'],
  25: ['Niveaux 38 à 42', 'Une route de cendres, de ponts et de défilés.'],
  26: ['Arène de Névé (Eau)', 'Ville de cristal : centre, boutique, maison.'],
  27: ['Niveaux 42 à 46', 'Une gorge glacée pleine de défilés.'],
  28: ['Niveaux 45 à 49', 'Le repaire du Maître Éclipse.']
};
const TCOL = {
  q: '#7a7a7a',
  u: '#8a7a5a',
  Z: '#8a5a2b',
  y: '#d9c28f',
  z: '#4a90e2',
  '.': '#8fd35f',
  '=': '#c4bfb2',
  _: '#d9c28f',
  g: '#4d9c3a',
  T: '#1f6b30',
  '#': '#1f6b30',
  w: '#3d86d8',
  H: '#b5651d',
  C: '#d33',
  B: '#e6b800',
  L: '#8a4fd0',
  K: '#8a5a2b',
  M: '#e6a23c',
  U: '#fff',
  D: '#fff',
  R: '#e63946',
  V: '#222',
  W: '#222',
  O: '#444',
  Q: '#d9c28f',
  f: '#f4a6c8',
  F: '#a8703a',
  b: '#2f8a42',
  j: '#a8703a',
  Y: '#222'
};
const TNAME = {
  q: 'Rocher',
  u: 'Décor',
  Z: 'Barrière',
  y: 'Ouvriers',
  z: 'Coffre caché',
  '.': 'Pelouse',
  '=': 'Rue pavée',
  _: 'Chemin de terre',
  g: 'Hautes herbes',
  T: 'Arbres',
  '#': 'Arbres',
  w: 'Eau (pêche possible)',
  H: 'Bâtiment',
  C: 'Centre de soins',
  B: 'Arène',
  L: 'Laboratoire',
  K: 'Maison à visiter',
  M: 'Boutique',
  U: 'Sortie vers le nord',
  D: 'Sortie vers le sud',
  R: 'Dresseur',
  V: 'Boss',
  W: 'Boss final',
  O: 'Grotte',
  Q: 'Chemin de terre',
  f: 'Fleurs',
  F: 'Barrière',
  b: 'Buisson (certains cachent un trésor)',
  j: 'Pont',
  Y: 'Boss final'
};
function worldmap(tab) {
  tab = tab || 0;
  if (busy) return;
  const rr = f => {
      $('pn').style.display = 'none';
      busy = false;
      f();
    },
    vis = m => G.vis.includes(m),
    adj = m => WE.some(([a, b]) => (a == m && vis(b)) || (b == m && vis(a)));
  const tabs = `<div class="tabs"><button id="t0" class="${tab == 0 ? 'on' : ''}">🌍 Monde</button><button id="t1" class="${tab == 1 ? 'on' : ''}">📍 Zone</button>${vis(39) || G.f.s3 ? `<button id="t2" class="${tab == 2 ? 'on' : ''}">🏝 Archipel</button>` : ''}${vis(A5) ? `<button id="t3" class="${tab == 3 ? 'on' : ''}">🌄 Aube</button>` : ''}</div>`;
  if (tab == 0 || tab == 2 || tab == 3) {
    const WL = tab == 3 ? WN3 : tab == 2 ? WN2 : WN,
      EL = WE.filter(([a, b]) => WL.some(n => n[0] == a) && WL.some(n => n[0] == b));
    let v =
      '<svg viewBox="0 0 440 545" style="width:100%;max-height:62vh;background:#f2e2b8;border:3px solid #7a5a2a;border-radius:12px">';
    EL.forEach(([a, b]) => {
      const A = WL.find(n => n[0] == a),
        Z = WL.find(n => n[0] == b);
      if (!vis(a) && !vis(b)) return;
      const both = vis(a) && vis(b);
      v += `<path d="M${A[1]} ${A[2]}Q${(A[1] + Z[1]) / 2 + 14} ${(A[2] + Z[2]) / 2} ${Z[1]} ${Z[2]}" stroke="${both ? '#8b5a2b' : '#b9a77a'}" stroke-width="5" fill="none" ${both ? '' : 'stroke-dasharray="4 5"'} stroke-linecap="round"/>`;
    });
    WL.forEach(([m, x, y, n, town]) => {
      const k = vis(m);
      if (!k && !adj(m)) return;
      const cur = G.map == m || (maps[G.map].in && G.ret && G.ret[0] == m);
      v +=
        `<g data-n="${m}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="${town ? 13 : 8}" fill="${k ? (town ? '#e8b04a' : '#7fbf6a') : '#c9c0a8'}" stroke="#5a3d1a" stroke-width="2.5"/>` +
        (cur
          ? `<circle cx="${x}" cy="${y}" r="13" fill="none" stroke="#e63946" stroke-width="3"><animate attributeName="r" values="12;22;12" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="1.6s" repeatCount="indefinite"/></circle><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14">📍</text>`
          : `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="${town ? 13 : 10}">${k ? (town ? '🏠' : '🌿') : '?'}</text>`) +
        `<text x="${x}" y="${y + (town ? 28 : 22)}" text-anchor="middle" font-size="11" font-weight="700" fill="#3a2810">${k ? n : '???'}</text></g>`;
    });
    {
      const st = activeTarget(),
        N = st && WL.find(n => n[0] == st.m);
      if (N && (vis(st.m) || adj(st.m)))
        v += `<circle cx="${N[1]}" cy="${N[2]}" r="20" fill="none" stroke="#f2c94c" stroke-width="3" stroke-dasharray="4 4"><animateTransform attributeName="transform" type="rotate" from="0 ${N[1]} ${N[2]}" to="360 ${N[1]} ${N[2]}" dur="6s" repeatCount="indefinite"/></circle>`;
    }
    panel(
      '<h3>🗺 Carte</h3>' +
        tabs +
        v +
        '</svg><div class="lg"><span>📍 toi</span><span>🏠 ville</span><span>🌿 route</span><span>⭕ objectif</span></div><div id="mi2" class="tc">Touche un lieu pour voir ses infos. Les lieux « ? » ne sont pas encore découverts.</div>'
    );
    document.querySelectorAll('#pn g[data-n]').forEach(
      g =>
        (g.onclick = () => {
          const m = +g.dataset.n,
            N = WL.find(n => n[0] == m),
            I = WI[m],
            k = vis(m),
            tr = maps[m].tr
              ? maps[m].tr.filter(y => G.tr[m + '_' + y]).length +
                '/' +
                maps[m].tr.length +
                ' dresseurs battus'
              : '';
          $('mi2').innerHTML = k
            ? `<b>${N[3]}</b><br>${I[0]}<br>${I[1]}${tr ? '<br>⚔ ' + tr : ''}${[0, 2, 4, 15, 17, 21, 24, 26, 33, 35, 40, 42, 44].concat(FT5).includes(m) ? `<br><button data-f="${m}" class="go">➜ Voyager ici</button>` : ''}`
            : '<b>Lieu inconnu</b><br>Explore pour le découvrir.';
          $('mi2')
            .querySelectorAll('[data-f]')
            .forEach(
              b =>
                (b.onclick = () =>
                  rr(() => {
                    const q = maps[+b.dataset.f];
                    go(+b.dataset.f, q.sp[0], q.sp[1]);
                    sfx(600, 0.2);
                  }))
            );
        })
    );
  } else {
    const inn = maps[G.map].in && G.ret,
      mi = inn ? G.ret[0] : G.map,
      pos = inn ? [G.ret[1], G.ret[2]] : [G.x, G.y],
      m = maps[mi],
      w = m.g[0].length,
      h = m.g.length;
    let u = worldmap.u || 5;
    panel(
      '<h3>🗺 Carte</h3>' +
        tabs +
        `<div><b>${m.n}</b>${inn ? ' (tu es dans un bâtiment)' : ''}</div><canvas id="zm" style="width:100%;border:2px solid #5b4a2a;border-radius:8px;image-rendering:pixelated;margin:6px 0"></canvas><div>🔍 <input type="range" id="zz" min="3" max="9" value="${u}"></div><div id="zi">Touche la carte pour identifier un endroit. ⚪ toi · 🔵 habitants · 🔴 dresseurs</div>`
    );
    const dr = () => {
      const c = $('zm'),
        x = c.getContext('2d');
      c.width = w * u;
      c.height = h * u;
      m.g.forEach((r, y) =>
        r.forEach((t, xx) => {
          x.fillStyle = TCOL[t] || '#999';
          x.fillRect(xx * u, y * u, u, u);
        })
      );
      if (S.guide && !inn && mi == G.map) {
        const gp = guidePath();
        if (gp) {
          x.strokeStyle = '#ffd23f';
          x.lineWidth = Math.max(2, u * 0.5);
          x.lineCap = 'round';
          x.setLineDash([1, u * 1.2]);
          x.beginPath();
          gp.forEach(([a, b], i) =>
            i ? x.lineTo((a + 0.5) * u, (b + 0.5) * u) : x.moveTo((a + 0.5) * u, (b + 0.5) * u)
          );
          x.stroke();
          x.setLineDash([]);
        }
      }
      NP.filter(n => n.m == mi).forEach(n => {
        x.fillStyle = '#2a6fe0';
        x.beginPath();
        x.arc((n.x + 0.5) * u, (n.y + 0.5) * u, Math.max(2, u * 0.45), 0, 7);
        x.fill();
      });
      x.fillStyle = '#fff';
      x.strokeStyle = '#e63946';
      x.lineWidth = 2;
      x.beginPath();
      x.arc((pos[0] + 0.5) * u, (pos[1] + 0.5) * u, Math.max(4, u * 0.9), 0, 7);
      x.fill();
      x.stroke();
    };
    dr();
    $('zz').oninput = e => {
      u = worldmap.u = +e.target.value;
      dr();
    };
    $('zm').onclick = e => {
      const c = $('zm'),
        r = c.getBoundingClientRect(),
        tx = Math.floor(((e.clientX - r.left) / r.width) * w),
        ty = Math.floor(((e.clientY - r.top) / r.height) * h),
        t = m.g[ty]?.[tx];
      $('zi').textContent =
        `${TNAME[t] || 'Hors carte'} · à ${Math.abs(tx - pos[0]) + Math.abs(ty - pos[1])} cases de toi`;
    };
  }
  $('t0').onclick = () => rr(() => worldmap(0));
  $('t1').onclick = () => rr(() => worldmap(1));
  if ($('t2')) $('t2').onclick = () => rr(() => worldmap(2));
  if ($('t3')) $('t3').onclick = () => rr(() => worldmap(3));
}
function settings() {
  if (busy) return;
  const o = (k, l, v) => `<option value="${v}" ${S[k] == v ? 'selected' : ''}>${l}</option>`,
    L = (t, h) =>
      `<div style="display:flex;justify-content:space-between;align-items:center;margin:7px 0"><span>${t}</span>${h}</div>`,
    cb = k => `<input type="checkbox" data-k="${k}" ${S[k] ? 'checked' : ''}>`,
    rg = k => `<input type="range" min="0" max="10" data-k="${k}" value="${S[k]}">`,
    sl = (k, a) => `<select data-k="${k}">${a.map((l, i) => o(k, l, i)).join('')}</select>`;
  panel(
    '<h3>⚙ Paramètres</h3><h4>🔊 Son</h4>' +
      L('Musique', cb('mus')) +
      L('Volume musique', rg('vol')) +
      L('Volume effets', rg('sfx')) +
      L('Vibrations (téléphone)', cb('vib')) +
      '<h4>🖥 Affichage</h4>' +
      L('Pixels rétro (écran 240×160)', cb('px')) +
      L('Palette', sl('pal', ['Couleurs', 'Game Boy vert', 'Gris'])) +
      L('Qualité graphique (hors rétro)', sl('q', ['Auto', 'Bas', 'Moyen', 'Élevé', 'Ultra'])) +
      L('Effets visuels (ombres, pluie, nuages)', cb('fxv')) +
      L('Météo (pluie, brume)', cb('meteo')) +
      L('Particules (poussière, pétales)', cb('part')) +
      L('Cycle jour / nuit', cb('night')) +
      L('Afficher les FPS', cb('fps')) +
      '<h4>🧊 Vue 3D</h4>' +
      L('Vue 3D première personne (touche T)', cb('v3')) +
      L('Résolution 3D', sl('r3', ['Auto', 'Basse', 'Moyenne', 'Haute'])) +
      L('Effets 3D (ombres, lucioles, fumée)', sl('fx3', ['Auto', 'Bas', 'Moyen', 'Élevé'])) +
      '<h4>🎮 Jeu</h4>' +
      L('Vitesse du texte', sl('spd', ['Lent', 'Normal', 'Rapide'])) +
      L('Difficulté', sl('diff', ['Facile', 'Normal', 'Difficile'])) +
      L('Vitesse de marche', sl('walk', ['Normale', 'Rapide'])) +
      L("Animations d'attaque", cb('anim')) +
      L("Chemin en pointillé vers l'objectif", cb('guide')) +
      L('Astuces du tutoriel', cb('tips')) +
      `<h4>⚡ Performances</h4><div id="pi">Test : score ${bc.n} · ${bc.cores} cœurs · ${bc.coarse ? 'tactile' : 'ordinateur'} · ${perf.fps || 0} FPS · qualité ${Q.n}${S.q ? '' : ' (auto)'}</div><div><button id="bq">Relancer le test de performance</button></div><h4>📊 Statistiques</h4><div class="stg"><span>⏱ Temps</span><b>${fmt(G.sx.time)}</b><span>👣 Pas</span><b>${G.sx.steps}</b><span>⚔ Victoires</span><b>${G.sx.wins}/${G.sx.battles}</b><span>🎯 Captures</span><b>${G.sx.caught}</b><span>📖 Bestiaire</span><b>${G.dex.s.length}/${SP.length} vus</b><span>🏅 Badges</span><b>${G.badge}/19</b></div>
 <h4>💾 Sauvegarde</h4><textarea id="sv" rows="3" style="width:100%"></textarea><div><button id="cp">Exporter</button> <button id="im">Importer</button> <button id="rz">Nouvelle partie</button> <button id="ts">Changer de fichier</button> <button id="tt">Revoir les astuces</button></div><small id="sm"></small>
 <h4>🕹 Commandes</h4><small>Croix / flèches / WASD · A = Z ou Espace · B = X ou Échap (maintenu : courir) · START = Entrée ou M · SELECT = P · raccourcis E équipe, V sac, Q quêtes, G bestiaire</small>`
  );
  document.querySelectorAll('#pn [data-k]').forEach(
    el =>
      (el.onchange = () => {
        const k = el.dataset.k;
        S[k] = el.type == 'checkbox' ? +el.checked : +el.value;
        if (k == 'mus' && !!S.mus != !!mus) {
          try {
            music();
          } catch (e) {
            S.mus = 0;
            el.checked = false;
          }
        }
        applyS();
        saveS();
        applyQ();
      })
  );
  $('cp').onclick = () => {
    $('sv').value = JSON.stringify(G);
    $('sv').select();
    try {
      navigator.clipboard.writeText($('sv').value);
    } catch (e) {}
    $('sm').textContent = 'Texte prêt à copier.';
  };
  $('im').onclick = () => {
    try {
      const d = JSON.parse($('sv').value);
      if (!d.party || d.map == null) throw 0;
      G = d;
      G.inv = G.inv || {};
      G.dex = G.dex || { s: [], c: [] };
      G.tr = G.tr || {};
      G.q = G.q || {};
      G.sp = G.sp || 0;
      G.vis = G.vis || [0];
      G.sx = G.sx || { steps: 0, battles: 0, wins: 0, caught: 0, time: 0 };
      G.gold = G.gold ?? 100;
      G.lg = G.lg || 0;
      G.box = G.box || [];
      G.ach = G.ach || [];
      G.tips = G.tips || [];
      G.rec = G.rec || 0;
      save();
      $('sm').textContent = 'Sauvegarde importée !';
    } catch (e) {
      $('sm').textContent = 'Texte invalide.';
    }
  };
  $('bq').onclick = () => {
    try {
      localStorage.removeItem('aerelia_bench');
    } catch (e) {}
    bc = detect();
    aT = maxT = bc.t;
    perf.n = 0;
    applyQ(1);
    $('sm').textContent = 'Test terminé : qualité conseillée ' + QT[bc.t].n;
  };
  $('ts').onclick = () => {
    $('pn').style.display = 'none';
    toTitle();
  };
  $('tt').onclick = () => {
    G.tips = [];
    save();
    $('sm').textContent = 'Les astuces réapparaîtront.';
  };
  let c = 0;
  $('rz').onclick = () => {
    if (++c < 2) {
      $('rz').textContent = 'Confirmer ?';
      return;
    }
    G = newG();
    freshWorld();
    save();
    $('pn').style.display = 'none';
    busy = false;
    intro();
  };
}
function credits(fin) {
  panel(
    fin
      ? `<h3>🌅 VRAIE FIN</h3><p>L'Éclat-mère est brisé : l'aube se lève enfin sur Aérélia.</p><p>⏱ ${fmt(G.sx.time)} · ⚔ ${G.sx.wins} victoires · 📖 ${G.dex.s.length}/${SP.length} vus · 🎯 ${G.dex.c.length} capturés</p><p>Merci d'avoir joué, {J} ! Il reste la Ligue, le Palais de combat, les quêtes et le Bestiaire.</p>`
      : `<h3>🌙 Fin du premier acte</h3><p>Les Éclats lunaires brillent à nouveau sur Aérélia… mais un sceau noir vient d'apparaître au nord.</p><p>⏱ ${fmt(G.sx.time)} · ⚔ ${G.sx.wins} victoires · 📖 ${G.dex.s.length}/${SP.length} vus</p><p>Retourne voir le Professeur Sauge : l'aventure continue !</p>`
  );
}
function toast(t, c, w) {
  if (!(w > 8) && $('pn') && $('pn').style.display == 'block')
    return setTimeout(() => toast(t, c, (w || 0) + 1), 800);
  const d = document.createElement('div');
  d.className = 'toast ' + (c || '');
  d.textContent = tr(t);
  document.body.append(d);
  setTimeout(() => d.remove(), c == 'tip' ? 5500 : 3500);
}
function tip(id, t) {
  if (!S.tips || G.tips.includes(id)) return;
  G.tips.push(id);
  const sh = () => {
    if ($('bt').style.display == 'flex' || $('pn').style.display == 'block') return setTimeout(sh, 900);
    toast('💡 ' + t, 'tip');
  };
  sh();
}
const ACH = [
  ['Premier pas', 'Choisir ton premier partenaire', () => G.f.s],
  ['Dresseur', 'Gagner 10 combats', () => G.sx.wins >= 10],
  ['Collectionneur', 'Capturer 10 espèces', () => G.dex.c.length >= 10],
  ['Maître capteur', 'Capturer toutes les espèces', () => G.dex.c.length >= SP.length - 1],
  ['Encyclopédie', 'Voir toutes les espèces', () => G.dex.s.length >= SP.length],
  ['Champion', 'Obtenir les 4 badges', () => G.badge >= 4],
  ['Sauveur de la lune', "Terminer l'histoire", () => G.f.e],
  ['Maître de la Ligue', 'Vaincre la Ligue', () => G.lg >= 5],
  [
    'Explorateur',
    'Visiter toutes les zones extérieures',
    () => [0, 1, 2, 3, 4, 5, 14, 15, 16, 17, 18, 21].every(m => G.vis.includes(m))
  ],
  [
    'Chasseur de trésors',
    'Trouver 8 objets cachés',
    () => Object.keys(G.q).filter(k => /^i\d/.test(k)).length >= 8
  ],
  ['Marcheur', 'Faire 10 000 pas', () => G.sx.steps >= 10000],
  ['Niveau 50', 'Amener une créature au niveau 50', () => G.party.some(c => c.lv >= 50)],
  [
    'Évolution',
    'Faire évoluer une créature',
    () => G.party.some(c => [9, 10, 11, 12, 17, 18, 19].includes(c.s))
  ],
  ['Légendaire', 'Capturer Luniel', () => G.q.lun],
  ['Série de 10', '10 victoires de suite au Palais', () => G.rec >= 10],
  ['Riche', 'Posséder 5 000 💰', () => G.gold >= 5000],
  ['Pêcheur', 'Pêcher 5 fois', () => (G.sx.fish || 0) >= 5],
  ['Duelliste', 'Gagner 50 combats', () => G.sx.wins >= 50],
  ['Équipe au complet', "Avoir 6 créatures dans l'équipe", () => G.party.length >= 6],
  ['Mi-parcours', 'Capturer 14 espèces', () => G.dex.c.length >= 14],
  ['Coup de maître', 'Réussir 10 coups critiques', () => (G.sx.crit || 0) >= 10],
  ['Combat double', 'Gagner un combat double', () => (G.sx.dbl || 0) >= 1],
  ['Surnom', 'Donner un surnom à une créature', () => G.party.concat(G.box).some(c => c.nick)],
  ['Passage secret', 'Découvrir la Clairière Cachée', () => G.q.sec],
  ['Pierre magique', 'Faire évoluer une créature avec une pierre', () => G.q.stone],
  ['Millionnaire', 'Posséder 10 000 💰', () => G.gold >= 10000],
  [
    'Services rendus',
    'Terminer les 5 quêtes des habitants',
    () => ['h0', 'h1', 'h2', 'h3', 'h4'].every(k => G.q[k] == 2)
  ],
  ['Marathonien', 'Faire 25 000 pas', () => G.sx.steps >= 25000],
  [
    "Chasseur d'objets",
    'Trouver tous les objets cachés',
    () => Object.keys(G.q).filter(k => /^i\d/.test(k)).length >= ITM.length
  ],
  ['Six badges', 'Obtenir les 6 badges', () => G.badge >= 6],
  ["Maître de l'Aube", 'Terminer la vraie fin', () => G.f.x],
  [
    'Buissonnier',
    'Fouiller 10 buissons à baies',
    () => Object.keys(G.q).filter(k => k[0] == 'b' && k[1] != 'a' && /^b\d/.test(k)).length >= 10
  ]
];
setInterval(() => {
  if ($('ti').style.display != 'none') return;
  for (let i = 0; i < ACH.length; i++)
    if (!G.ach.includes(i) && ACH[i][2]()) {
      G.ach.push(i);
      save();
      sfx(880, 0.3);
      toast('🏆 Succès : ' + ACH[i][0]);
      break;
    }
}, 1500);
let aF = 0;
function achievements() {
  if (busy) return;
  const F = ['Tous', 'Obtenus', 'À débloquer'],
    n = G.ach.length,
    list = ACH.map((a, i) => [a, i, G.ach.includes(i)]).filter(x => aF == 0 || (aF == 1) == x[2]);
  panel(
    `<h3>🏆 Succès (${n}/${ACH.length})</h3><div class="pbar"><i style="width:${(n / ACH.length) * 100}%"></i></div><div class="tabs">${F.map((f, i) => `<button data-af="${i}" class="${aF == i ? 'on' : ''}">${f}</button>`).join('')}</div>` +
      (list.length
        ? list
            .map(
              ([a, i, o]) =>
                `<div class="ac${o ? ' ok' : ''}"><span class="ai">${o ? '●' : '○'}</span><span><b>${a[0]}</b><small>${a[1]}</small></span></div>`
            )
            .join('')
        : '<p class="ob">Rien à afficher ici.</p>')
  );
  document.querySelectorAll('#pn [data-af]').forEach(
    b =>
      (b.onclick = () => {
        aF = +b.dataset.af;
        $('pn').style.display = 'none';
        busy = false;
        achievements();
      })
  );
}
function pcBox() {
  panel(
    `<h3>💻 PC (${G.box.length})</h3><h4>Équipe (${G.party.length}/6)</h4>` +
      G.party
        .map(
          (c, i) =>
            `<button class="ir" data-d="${i}" ${G.party.length < 2 ? 'disabled' : ''}><span class="di">${spr(c.s, 26)}</span><span class="it">${nm(c)} <small>Nv${c.lv}</small></span><em>▸ PC</em></button>`
        )
        .join('') +
      `<h4>Boîte (${G.box.length})</h4>` +
      (G.box.length
        ? `<div class="tabs sort"><span>Trier</span><button data-s="lv">Niveau</button><button data-s="ty">Type</button><button data-s="nm">Nom</button></div>` +
          G.box
            .map(
              (c, i) =>
                `<button class="ir" data-w="${i}" ${G.party.length > 5 ? 'disabled' : ''}><span class="di">${spr(c.s, 26)}</span><span class="it">${nm(c)} <small>Nv${c.lv}</small></span><em>▸ Équipe</em></button>`
            )
            .join('')
        : '<p class="ob">La boîte est vide. Les créatures capturées quand ton équipe est pleine arrivent ici.</p>')
  );
  const re = () => {
    $('pn').style.display = 'none';
    busy = false;
    pcBox();
  };
  document.querySelectorAll('#pn [data-s]').forEach(
    b =>
      (b.onclick = () => {
        const k = b.dataset.s;
        G.box.sort((a, c) =>
          k == 'lv'
            ? c.lv - a.lv
            : k == 'ty'
              ? SP[a.s].t.localeCompare(SP[c.s].t)
              : nm(a).localeCompare(nm(c))
        );
        save();
        re();
      })
  );
  document.querySelectorAll('#pn [data-d]').forEach(
    b =>
      (b.onclick = () => {
        G.box.push(G.party.splice(+b.dataset.d, 1)[0]);
        save();
        re();
      })
  );
  document.querySelectorAll('#pn [data-w]').forEach(
    b =>
      (b.onclick = () => {
        const c = G.box.splice(+b.dataset.w, 1)[0];
        c.hp = c.mh;
        c.st = 0;
        G.party.push(c);
        save();
        re();
      })
  );
}
const LG = [
  [
    'Ilex',
    [
      [9, 30],
      [22, 31],
      [7, 32]
    ]
  ],
  [
    'Mira',
    [
      [10, 30],
      [23, 31],
      [18, 32]
    ]
  ],
  [
    'Granit',
    [
      [26, 32],
      [14, 31],
      [17, 32]
    ]
  ],
  [
    'Zéphyr',
    [
      [12, 32],
      [25, 33],
      [21, 31],
      [4, 32]
    ]
  ],
  [
    'Noa',
    [
      [9, 36],
      [10, 36],
      [11, 36],
      [16, 37]
    ]
  ]
];
LG[3][2] = LG[4][2] = 1;
function league() {
  if (G.badge < 4 || !G.f.e)
    return say(["Gardien : La Ligue n'est ouverte qu'à ceux qui ont sauvé la lune."]);
  if (G.lg >= 5) return say(["Gardien : Tu es le Maître de la Ligue. Le Palais de combat t'attend !"]);
  say([`Gardien : Cinq duels, un par champion. Prochain adversaire : ${LG[G.lg][0]}.`], async () => {
    const L = LG[G.lg],
      r = await battle(
        L[1].map(a => mkC(...a)),
        L[0],
        false,
        L[2]
      );
    if (r == 'win') {
      G.lg++;
      G.gold += 400 * G.lg;
      if (G.lg >= 5) G.gold += 2000;
      save();
      say(
        G.lg >= 5
          ? [
              `${L[0]} : Incroyable… Tu es le nouveau Maître de la Ligue !`,
              'Tu reçois 2 000 💰 de prime. Le Palais de combat est ouvert à tous.'
            ]
          : [`${L[0]} est vaincu ! Soigne-toi au Centre, puis reviens voir le gardien.`]
      );
    }
  });
}
const ask = o => new Promise(r => choose(o, r));
function palace() {
  say(
    [
      `Hôte : Bienvenue au Palais de combat ! Enchaîne les victoires, plus tu en fais, plus c'est dur. Record : ${G.rec}.`
    ],
    async () => {
      if (await ask(['Relever le défi', 'Plus tard'])) return;
      let r = 0;
      for (;;) {
        const L = 24 + r * 2,
          P = () => Math.floor(Math.random() * SP.length),
          res = await battle([mkC(P(), L), mkC(P(), L + 1)], 'Challenger ' + (r + 1), false, r % 2 == 1);
        if (res != 'win') break;
        r++;
        G.rec = Math.max(G.rec, r);
        if (r % 3 == 0) G.sp += 2;
        save();
        if (await ask([`Continuer (${r} victoire${r > 1 ? 's' : ''})`, 'Encaisser et partir'])) break;
      }
      if (r) say([`Série de ${r} victoire${r > 1 ? 's' : ''} ! Record : ${G.rec}.`]);
    }
  );
}
function initG(g) {
  g.dex = g.dex || { s: [], c: [] };
  g.tr = g.tr || {};
  g.gold = g.gold ?? 100;
  g.lg = g.lg || 0;
  g.box = g.box || [];
  g.ach = g.ach || [];
  g.tips = g.tips || [];
  g.rec = g.rec || 0;
  g.inv = g.inv || {};
  g.q = g.q || {};
  g.sp = g.sp || 0;
  g.vis = g.vis || [0];
  g.sx = g.sx || { steps: 0, battles: 0, wins: 0, caught: 0, time: 0 };
  g.f = g.f || { s: 0, r: 0 };
  g.party.forEach(c => mark(c.s, 1));
  return g;
}
function slotInfo(n) {
  try {
    const g = JSON.parse(localStorage.getItem(n == 1 ? 'aerelia' : 'aerelia_' + n));
    return g && g.party && g.party.length
      ? `🏅 ${g.badge || 0}/19 · ⏱ ${fmt((g.sx && g.sx.time) || 0)}<br>Niveau max ${Math.max(...g.party.map(c => c.lv))}`
      : null;
  } catch (e) {
    return null;
  }
}
function slotData(n) {
  try {
    const g = JSON.parse(localStorage.getItem(n == 1 ? 'aerelia' : 'aerelia_' + n));
    return g && g.party && g.party.length ? g : null;
  } catch (e) {
    return null;
  }
}
function renderSlots() {
  let cur = 1;
  try {
    cur = +(localStorage.getItem('aerelia_slot') || 1);
  } catch (e) {}
  $('slots').innerHTML = [1, 2, 3]
    .map(n => {
      const g = slotData(n),
        on = n == cur;
      const body = g
        ? `<span class="ss">${g.party
            .slice(0, 3)
            .map(c => spr(c.s, 28))
            .join(
              ''
            )}</span><span class="st"><b>${g.pn || 'Dresseur'}</b><small>🏅 ${g.badge || 0}/19 · Nv ${Math.max(...g.party.map(c => c.lv))} · ${(t => Math.floor(t / 3600) + 'h' + String(Math.floor(t / 60) % 60).padStart(2, '0'))((g.sx && g.sx.time) || 0)}</small></span>`
        : `<span class="st"><b>Nouvelle aventure</b><small>Fichier vide</small></span>`;
      return `<div class="sr${on ? ' on' : ''}"><button class="sl" data-n="${n}"><span class="sn">${n}</span>${body}</button>${g ? `<button class="sx" data-x="${n}" aria-label="Effacer le fichier ${n}">🗑</button>` : ''}</div>`;
    })
    .join('');
  $('slots')
    .querySelectorAll('.sl')
    .forEach(b => (b.onclick = () => useSlot(+b.dataset.n)));
  $('slots')
    .querySelectorAll('.sx')
    .forEach(
      b =>
        (b.onclick = e => {
          e.stopPropagation();
          const n = +b.dataset.x;
          if (b.dataset.c != '1') {
            b.dataset.c = '1';
            b.textContent = 'Sûr ?';
            b.classList.add('arm');
            setTimeout(() => {
              if (b.isConnected) {
                b.dataset.c = '';
                b.textContent = '🗑';
                b.classList.remove('arm');
              }
            }, 3000);
            return;
          }
          try {
            localStorage.removeItem(n == 1 ? 'aerelia' : 'aerelia_' + n);
          } catch (er) {}
          if (n == cur) useSlot(n);
          else renderSlots();
        })
    );
  $('go').textContent = G.f.s ? '▶ Continuer' : '▶ Nouvelle aventure';
}
function useSlot(n) {
  try {
    localStorage.setItem('aerelia_slot', n);
  } catch (e) {}
  G = initG(load() || newG());
  rx = G.x;
  ry = G.y;
  PT.length = 0;
  for (const k in MC) delete MC[k];
  renderSlots();
}
setInterval(() => {
  try {
    if (!busy) {
      freshWorld.n = 0;
      return;
    }
    const vis =
      ['dlg', 'pn', 'ch', 'bt', 'ti', 'cin'].some(i => {
        const e = $(i);
        return e && e.style.display && e.style.display != 'none';
      }) || document.querySelector('body>div[style*="z-index:99"]');
    if (vis) {
      freshWorld.n = 0;
      return;
    }
    freshWorld.n = (freshWorld.n || 0) + 1;
    if (freshWorld.n >= 3) {
      freshWorld.n = 0;
      busy = false;
    }
  } catch (e) {}
}, 700);
function freshWorld() {
  try {
    rx = G.x;
    ry = G.y;
    PT.length = 0;
    for (const k in MC) delete MC[k];
    dq = [];
    dcb = null;
    if (typT) {
      clearInterval(typT);
      typT = null;
    }
    dlg.style.display = 'none';
    ch.style.display = 'none';
    $('pn').style.display = 'none';
    const c = $('cin');
    if (c) c.style.display = 'none';
    busy = false;
  } catch (e) {}
}
function toTitle() {
  save();
  $('ti').style.display = 'flex';
  busy = true;
  renderSlots();
}
const saveS = () => {
  try {
    localStorage.setItem('aerelia_s', JSON.stringify(S));
  } catch (e) {}
};
let SPD = [1400, 900, 350][S.spd];
const applyS = () => {
  SPD = [1400, 900, 350][S.spd];
};
const fast = () => {
  S.spd = (S.spd + 1) % 3;
  applyS();
  saveS();
};
const TC = { N: '#b9a98a', F: '#f2784b', E: '#4a9bf0', P: '#5fbf5a', V: '#9ad0e8' };
const TD = { N: '#8c7a5a', F: '#c4451c', E: '#2a6fc0', P: '#3a8f3a', V: '#6aa5c0' };
let sid = 0;
