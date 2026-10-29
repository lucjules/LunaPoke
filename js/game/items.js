// Objets, sac et boutique
const IT = {
  pf: ['Pierre Ardente', '🔥'],
  pm: ['Pierre Marée', '💧'],
  ps: ['Pierre Sève', '🍃'],
  pl: ['Pierre Lune', '🌙'],
  gr: ['Griffe Vive', '🗡️'],
  ec: ['Écaille Dure', '🛡️'],
  ba: ['Baie Soin', '🍒'],
  lu: ['Lentille', '🔍']
};
const IDESC = {
  pf: 'Fait évoluer Cendrelin',
  pm: 'Fait évoluer Coralie',
  ps: 'Fait évoluer Pétale',
  pl: 'Fait évoluer Lunard',
  gr: 'Objet tenu : +15% attaque',
  ec: 'Objet tenu : +15% défense',
  ba: 'Objet tenu : soigne 40% PV une fois sous 1/3',
  lu: 'Objet tenu : coups critiques ×2'
};
const addI = (k, n = 1) => {
  G.inv = G.inv || {};
  G.inv[k] = (G.inv[k] || 0) + n;
};
function bag(sel) {
  if (busy) return;
  const inv = (G.inv = G.inv || {});
  let h = `<h3>Sac</h3><div class="tc bagh"><span>💰 ${G.gold}</span><span>🔴 Capsules ×${G.balls}</span></div>`;
  if (sel == null) {
    const L = [
      ['pots', '🧪 Potion', G.pots],
      ['sp', '💊 Super Potion', G.sp],
      ...Object.keys(inv)
        .filter(k => inv[k] > 0 && IT[k])
        .map(k => [k, IT[k][1] + ' ' + IT[k][0], inv[k]])
    ];
    h +=
      L.map(
        ([k, t, n]) =>
          `<button class="ir" data-k="${k}" ${n < 1 ? 'disabled' : ''}><span class="it">${t}</span><em>×${n}</em></button>`
      ).join('') +
      '<h4>Objets tenus</h4>' +
      G.party
        .map(
          (c, i) =>
            `<button class="ir" data-t="${i}" ${c.it ? '' : 'disabled'}><span class="di">${spr(c.s, 26)}</span><span class="it">${nm(c)}</span><em>${c.it ? IT[c.it][1] + ' ' + IT[c.it][0] + ' (reprendre)' : '—'}</em></button>`
        )
        .join('');
  } else {
    const ds = IDESC[sel] || (sel == 'pots' ? 'Rend 40 PV' : 'Rend 100 PV');
    h +=
      `<p><b>${sel == 'pots' ? 'Potion' : sel == 'sp' ? 'Super Potion' : IT[sel][0]}</b> — ${ds}</p><p>Sur qui ?</p>` +
      G.party
        .map(
          (c, i) =>
            `<button class="ir" data-u="${i}"><span class="di">${spr(c.s, 26)}</span><span class="it">${nm(c)} <small>Nv${c.lv}</small>${c.it ? ' ' + IT[c.it][1] : ''}</span><em>${c.hp}/${c.mh} PV</em></button>`
        )
        .join('') +
      '<p><button id="bk">← Retour</button></p>';
  }
  panel(h);
  const re = k => {
    $('pn').style.display = 'none';
    busy = false;
    bag(k);
  };
  document.querySelectorAll('#pn [data-k]').forEach(b => (b.onclick = () => re(b.dataset.k)));
  document.querySelectorAll('#pn [data-t]').forEach(
    b =>
      (b.onclick = () => {
        const c = G.party[+b.dataset.t];
        addI(c.it);
        c.it = 0;
        save();
        re();
      })
  );
  if ($('bk')) $('bk').onclick = () => re();
  document.querySelectorAll('#pn [data-u]').forEach(
    b =>
      (b.onclick = () => {
        const c = G.party[+b.dataset.u],
          k = sel,
          done = m => {
            save();
            $('pn').style.display = 'none';
            busy = false;
            say([m]);
          };
        if (k == 'pots' || k == 'sp') {
          if (c.hp <= 0 || c.hp >= c.mh) return toast('Aucun effet.');
          const n = k == 'pots' ? 40 : 100;
          if (G[k] < 1) return;
          G[k]--;
          c.hp = Math.min(c.mh, c.hp + n);
          save();
          re(G[k] > 0 ? k : null);
        } else if (['gr', 'ec', 'ba', 'lu'].includes(k)) {
          if (!inv[k]) return;
          inv[k]--;
          if (c.it) addI(c.it);
          c.it = k;
          done(`${nm(c)} tient maintenant ${IT[k][1]} ${IT[k][0]}.`);
        } else {
          const se = SP[c.s].se;
          if (!se || se[0] != k) return toast("Ça n'aurait aucun effet sur " + nm(c) + '.');
          inv[k]--;
          const o = c.mh,
            old = SP[c.s].n;
          c.s = se[1];
          stat(c);
          c.hp += c.mh - o;
          mark(c.s, 1);
          G.q.stone = 1;
          sfx(700, 0.3);
          done(`${old} évolue en ${SP[c.s].n} grâce à la ${IT[k][0]} !`);
        }
      })
  );
}
function shop(t) {
  if (!t)
    return choose(['Capsules & soins', 'Objets tenus', `Quitter (💰 ${G.gold})`], i =>
      i < 2 ? shop(i + 1) : say(['Marchand : À bientôt !'])
    );
  const o =
    t == 1
      ? [
          ['Capsule', '🔴', 50, 'balls', 'Capture une créature sauvage'],
          ['Potion', '🧪', 30, 'pots', 'Rend 40 PV'],
          ['Super Potion', '💊', 90, 'sp', 'Rend 100 PV']
        ]
      : [
          ['Griffe Vive', '🗡️', 300, 'i:gr', "+15 % d'attaque"],
          ['Écaille Dure', '🛡️', 300, 'i:ec', '+15 % de défense'],
          ['Baie Soin', '🍒', 120, 'i:ba', 'Soigne en combat'],
          ['Lentille', '🔍', 250, 'i:lu', 'Coups critiques ×2']
        ];
  const have = k => (k.startsWith('i:') ? (G.inv && G.inv[k.slice(2)]) || 0 : G[k]);
  panel(
    `<h3>🛒 Boutique</h3><div class="tc bagh"><span>💰 ${G.gold}</span><span>${t == 1 ? 'Capsules & soins' : 'Objets tenus'}</span></div>` +
      o
        .map(
          (a, i) =>
            `<button class="sh" data-b="${i}" ${G.gold < a[2] ? 'disabled' : ''}><span class="shn"><b>${a[1]} ${a[0]}</b><small>${a[4]}</small></span><span class="shp"><b>${a[2]} 💰</b><small>tu en as ${have(a[3])}</small></span></button>`
        )
        .join('') +
      '<p><button id="bk">← Autre rayon</button></p>'
  );
  const re = () => {
    $('pn').style.display = 'none';
    busy = false;
    shop(t);
  };
  document.querySelectorAll('#pn [data-b]').forEach(
    b =>
      (b.onclick = () => {
        const a = o[+b.dataset.b];
        if (G.gold < a[2]) return toast("Pas assez d'argent !");
        G.gold -= a[2];
        if (a[3].startsWith('i:')) addI(a[3].slice(2));
        else G[a[3]]++;
        save();
        sfx(660, 0.12);
        re();
      })
  );
  $('bk').onclick = () => {
    $('pn').style.display = 'none';
    busy = false;
    shop();
  };
}
function noa20() {
  say(["Noa : Te revoilà ! J'ai beaucoup progressé depuis Cendrebourg. Prêt ?"], async () => {
    const r = await battle([mkC(3, 11), mkC((((G.st || 0) + 1) % 3) + 9, 12)], 'Noa', false);
    G.f.n = 1;
    save();
    if (r != 'lose')
      say([
        "Noa : Incroyable… Moi, je file à la Forêt d'Argent : on y a vu des sbires Vesper. Rejoins-moi !"
      ]);
  });
}
