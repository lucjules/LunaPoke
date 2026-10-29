// Contrôles : clavier, croix, boutons A/B/START/SELECT, curseur de menu
// ---------- Contrôles ----------
const K = {
  ArrowUp: [0, -1],
  w: [0, -1],
  ArrowDown: [0, 1],
  s: [0, 1],
  ArrowLeft: [-1, 0],
  a: [-1, 0],
  ArrowRight: [1, 0],
  d: [1, 0]
};
const pads = new Set(),
  recomp = () => {
    ph = [0, 0];
    pads.forEach(d => {
      ph[0] += d[0];
      ph[1] += d[1];
    });
  };
(() => {
  const P = $('pad'),
    B = [...P.querySelectorAll('button')];
  let id;
  const df = (a, c) => Math.abs(((a - c + 540) % 360) - 180),
    V = [
      [1, 0, 0],
      [0, 1, 90],
      [-1, 0, 180],
      [0, -1, 270]
    ],
    D = [
      [1, 1, 45],
      [-1, 1, 135],
      [-1, -1, 225],
      [1, -1, 315]
    ];
  const show = v => {
    const on = new Set();
    if (v[0] || v[1]) {
      on.add(v + '');
      if (v[0] && v[1]) {
        on.add([v[0], 0] + '');
        on.add([0, v[1]] + '');
      }
    }
    B.forEach(b => b.classList.toggle('on', on.has(b.dataset.d.split(',').map(Number) + '')));
  };
  const upd = e => {
    const r = P.getBoundingClientRect(),
      dx = e.clientX - (r.left + r.width / 2),
      dy = e.clientY - (r.top + r.height / 2);
    let v = [0, 0];
    if (Math.hypot(dx, dy) / (r.width / 2) > 0.2) {
      const a = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
      const c = V.find(q => df(a, q[2]) <= 30) || D.find(q => df(a, q[2]) <= 15);
      if (c) v = [c[0], c[1]];
    }
    if ((v[0] || v[1]) && (v[0] != ph[0] || v[1] != ph[1])) padEdge(v);
    ph = v;
    show(v);
  };
  const end = () => {
    id = undefined;
    ph = [0, 0];
    show([0, 0]);
  };
  P.addEventListener('pointerdown', e => {
    e.preventDefault();
    id = e.pointerId;
    P.setPointerCapture && P.setPointerCapture(e.pointerId);
    upd(e);
  });
  P.addEventListener('pointermove', e => {
    if (e.pointerId === id) upd(e);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(v => P.addEventListener(v, end));
})();
addEventListener('keyup', e => {
  if (K[e.key]) keys[e.key] = 0;
  if (e.key == 'x' || e.key == 'X' || e.key == 'Backspace') runB = 0;
});
addEventListener('blur', () => {
  for (const k in keys) keys[k] = 0;
  pads.clear();
  recomp();
  swv = [0, 0];
});
const PRA = [
    [
      '....gggggg....',
      '...gggggggg...',
      '..gggggggggg..',
      '..gssssssssg..',
      '..sskssssksss.',
      '..sbbbssbbbss.',
      '..ssssssssss..',
      '...ssmmmmss...',
      '....ssssss....',
      '..wwwwwwwwww..',
      '..wwwwwwwwww..',
      '.wwwwwwwwwwww.',
      '.wwwwwwwwwwww.',
      '.wwwwwwwwwwww.',
      '..wwwwwwwwww..',
      '...nnn..nnn...',
      '...nnn..nnn...',
      '..kkkk..kkkk..'
    ],
    { g: '#c8c8d4', s: '#f2c9a0', k: '#222233', b: '#4a4a6a', m: '#b05a4a', w: '#ffffff', n: '#3a4a8a' }
  ],
  HRA = [
    [
      '....rrrrrr....',
      '...rrrrrrrr...',
      '..rrrrrrrrrr..',
      '..rrrrrrrrrrr.',
      '..ssssssssss..',
      '..sskssssksss.',
      '..ssssssssss..',
      '...ssmmmmss...',
      '....ssssss....',
      '..bbbbbbbbbb..',
      '..bbbbbbbbbb..',
      '.sbbbbbbbbbbs.',
      '.sbbbbbbbbbbs.',
      '..bbbbbbbbbb..',
      '..jjjjjjjjjj..',
      '...jjj..jjj...',
      '...jjj..jjj...',
      '..kkkk..kkkk..'
    ],
    { r: '#e03a3a', s: '#f2c9a0', k: '#222233', m: '#b05a4a', b: '#3a7ad8', j: '#4a4a6a' }
  ],
  RRA = [
    [
      '...hhhhhhhh...',
      '..hhhhhhhhhh..',
      '.hhhhhhhhhhhh.',
      '.hhsssssssshh.',
      '..ssssssssss..',
      '..sskssssksss.',
      '..ssssssssss..',
      '...ssmmmmss...',
      '....ssssss....',
      '..oooooooooo..',
      '..oooooooooo..',
      '.soooooooooos.',
      '.soooooooooos.',
      '..oooooooooo..',
      '..jjjjjjjjjj..',
      '...jjj..jjj...',
      '...jjj..jjj...',
      '..kkkk..kkkk..'
    ],
    { h: '#7a4a2a', s: '#f2c9a0', k: '#222233', m: '#b05a4a', o: '#f08a2a', j: '#4a4a6a' }
  ];
function art(a, sc) {
  if (/jsdom/i.test(navigator.userAgent)) return '';
  try {
    const rows = a[0],
      pal = a[1],
      c = document.createElement('canvas');
    c.width = rows[0].length;
    c.height = rows.length;
    const o = c.getContext('2d');
    if (!o) return '';
    rows.forEach((r, y) =>
      [...r].forEach((ch, x) => {
        if (pal[ch]) {
          o.fillStyle = pal[ch];
          o.fillRect(x, y, 1, 1);
        }
      })
    );
    return `<img src="${c.toDataURL()}" style="width:${rows[0].length * sc}px;image-rendering:pixelated;animation:bob 1.6s steps(2) infinite">`;
  } catch (e) {
    return '';
  }
}
function cin(h) {
  let o = $('cin');
  if (!o) {
    o = document.createElement('div');
    o.id = 'cin';
    document.body.append(o);
  }
  o.style.display = 'flex';
  o.innerHTML = h || '';
}
const cinOff = () => {
  const o = $('cin');
  if (o) o.style.display = 'none';
};
const pickName = (pre, q, cb) => {
  pre = pre.filter(x => x != G.pn);
  choose([...pre, 'Autre nom…'], i => {
    if (i < pre.length) cb(pre[i]);
    else askName(q, pre[0], cb);
  });
};
const intro = () => {
  try {
    if (/jsdom/i.test(navigator.userAgent) || typeof introGo != 'function') intro0();
    else introGo();
  } catch (e) {
    V3.in = null;
    cinOff();
    busy = false;
  }
};
const intro0 = () => {
  cin(art(PRA, 9));
  say(
    [
      'Bonjour ! Bienvenue dans le monde des Lunaires !',
      "Je suis le Professeur Sauge. Ici, tout le monde m'appelle le « Prof des Lunaires » !"
    ],
    () => {
      cin(`<div style="width:170px">${spr(3, 170)}</div>`);
      say(
        [
          'Ce monde est peuplé de créatures mystérieuses : les LUNAIRES !',
          "Certains les gardent comme compagnons, d'autres les font combattre. Moi, j'étudie le lien qui les unit aux Éclats lunaires."
        ],
        () => {
          cin(art(HRA, 9));
          say(['Mais assez parlé de moi ! Parle-moi un peu de toi.', "Comment t'appelles-tu ?"], () =>
            pickName(['Lune', 'Axel', 'Mira'], "Comment t'appelles-tu ?", n => {
              G.pn = n;
              cin(art(RRA, 9));
              say(
                [
                  `${n}… Joli nom ! Voici mon petit-fils. Depuis tout petit, c'est ton rival.`,
                  "Comment s'appelle-t-il, déjà ?"
                ],
                () =>
                  pickName(['Noa', 'Gaël', 'Théo'], 'Nom de ton rival', r => {
                    G.rv = r;
                    cin(art(HRA, 9));
                    say(
                      [
                        `${n} ! Ton aventure va bientôt commencer !`,
                        "Un monde de rêves et de combats avec les Lunaires t'attend… En route !",
                        "Retrouve-moi d'abord à mon laboratoire, à l'est du village (la porte violette)."
                      ],
                      () => {
                        cinOff();
                        busy = false;
                        go(0, 20, 12);
                        if (!G.tips.includes('guide')) G.tips.push('guide');
                        save();
                        toast('📘 Le guide est dans ☰ Menu (START)');
                      }
                    );
                  })
              );
            })
          );
        }
      );
    }
  );
};
function demoCap() {
  say(['Vieil homme : Tu débutes ? Regarde bien comment on capture un Lunaire !'], () =>
    choose(['Voir la démonstration', 'Non merci'], i => {
      if (i) return;
      cin(`<div style="width:170px">${spr(4, 170)}</div>`);
      say(
        [
          'Un Piaf sauvage apparaît !',
          'Le vieil homme affaiblit le Piaf avec une attaque…',
          'Ses PV sont bas ! Il lance une Capsule !',
          '… 1 … 2 … 3 … Clic !',
          'Le Piaf est capturé !',
          "Vieil homme : Plus ses PV sont bas, plus c'est facile. Un statut (sommeil, paralysie) aide aussi.",
          ...(G.q.omd ? [] : ["Vieil homme : Tiens, pour t'entraîner : 3 Capsules !"])
        ],
        () => {
          cinOff();
          if (!G.q.omd) {
            G.q.omd = 1;
            G.balls += 3;
            save();
            toast('🎁 3 Capsules');
          }
        }
      );
    })
  );
}
NP.push({ m: 0, e: '🧓', x: 26, y: 14, f: demoCap, l: ['Vieil homme : Bonjour !'] });
// « Nouvelle partie » efface le fichier en cours : il faut cliquer deux fois (3 s pour confirmer)
$('rs').onclick = e => {
  e.preventDefault();
  const a = $('rs');
  if (!a.dataset.c) {
    a.dataset.c = 1;
    a.textContent = 'Confirmer : effacer la partie ?';
    setTimeout(() => {
      delete a.dataset.c;
      a.textContent = 'Nouvelle partie';
    }, 3000);
    return;
  }
  delete a.dataset.c;
  a.textContent = 'Nouvelle partie';
  G = newG();
  freshWorld();
  save();
  intro();
};
bc = detect();
aT = maxT = bc.t;
applyQ();
(() => {
  const bad = (m, x, y) => SOLID.includes(maps[m].g[y]?.[x] || '#');
  if (!maps[G.map]) G.map = 0;
  if (bad(G.map, G.x, G.y)) {
    const p = maps[G.map].sp || [7, 8];
    G.x = p[0];
    G.y = p[1];
  }
  if (G.ret && (!maps[G.ret[0]] || bad(G.ret[0], G.ret[1], G.ret[2]))) {
    const p = (maps[G.ret[0]] || maps[0]).sp;
    G.ret = [maps[G.ret[0]] ? G.ret[0] : 0, p[0], p[1]];
  }
  rx = G.x;
  ry = G.y;
})();
addEventListener('pagehide', save);
document.addEventListener('visibilitychange', () => {
  if (ac && ac.suspend) document.hidden ? ac.suspend() : ac.resume();
});
function adv() {
  if (dlg.style.display == 'block') showD();
}
// ===== Contrôles A / B / START / SELECT + curseur de menu =====
const showing = e => {
  const d = e.style.display;
  return !!d && d != 'none';
};
function layer() {
  const ti = $('ti');
  if (ti.style.display != 'none') return ti;
  if (showing($('pn'))) return $('pn');
  if (showing($('ch'))) return $('ch');
  if (showing($('bt')) && $('mn').querySelector('button')) return $('mn');
  return null;
}
const navBtns = L => [
  ...L.querySelectorAll('button:not(:disabled),select:not(:disabled),input:not(:disabled)')
];
let cur = null,
  curI = 0;
function setCur(b) {
  if (cur && cur !== b) cur.classList.remove('cur');
  cur = b;
  if (b) {
    b.classList.add('cur');
    // en combat, la description de l'attaque sous le curseur s'affiche dans la boîte de message
    if (b.dataset.info) $('msg').textContent = b.dataset.info;
    try {
      const L = layer();
      if (L && L === $('pn') && navBtns(L)[0] === b) L.scrollTop = 0;
      else b.scrollIntoView({ block: 'nearest' });
    } catch (e) {}
  }
}
function syncCur() {
  const L = layer();
  if (!L) {
    if (cur) {
      cur.classList.remove('cur');
      cur = null;
    }
    return;
  }
  if (!cur || !L.contains(cur) || cur.disabled || !cur.isConnected) {
    const bs = navBtns(L);
    const n = bs[Math.min(curI, bs.length - 1)] || bs[0];
    if (cur) cur.classList.remove('cur');
    setCur(n || null);
  } else {
    const bs = navBtns(L);
    curI = Math.max(0, bs.indexOf(cur));
  }
}
function navMove(dx, dy) {
  const L = layer();
  if (!L) return;
  const bs = navBtns(L);
  if (!bs.length) return;
  if (!cur || !bs.includes(cur)) {
    setCur(bs[0]);
    return;
  }
  if (dx && (cur.tagName == 'SELECT' || cur.type == 'range')) {
    if (cur.tagName == 'SELECT')
      cur.selectedIndex = Math.max(0, Math.min(cur.options.length - 1, cur.selectedIndex + dx));
    else cur.value = +cur.value + dx;
    cur.dispatchEvent(new Event('change'));
    return;
  }
  const r = cur.getBoundingClientRect(),
    cx0 = r.left + r.width / 2,
    cy0 = r.top + r.height / 2;
  let best = null,
    bd = 1e9;
  for (const b of bs) {
    if (b === cur) continue;
    const q = b.getBoundingClientRect(),
      x = q.left + q.width / 2 - cx0,
      y = q.top + q.height / 2 - cy0,
      al = dx ? x * dx : y * dy,
      pp = dx ? Math.abs(y) : Math.abs(x);
    if (al <= 2) continue;
    const d = al + pp * 2.5;
    if (d < bd) {
      bd = d;
      best = b;
    }
  }
  if (!best && dy) {
    const i = bs.indexOf(cur);
    best = bs[(i + dy + bs.length) % bs.length];
  }
  if (best) {
    setCur(best);
    curI = bs.indexOf(best);
    sfx(520, 0.04);
  }
}
function padEdge(v) {
  if (!layer()) return;
  const m = v[1] && Math.abs(v[1]) >= Math.abs(v[0]) ? [0, v[1]] : [v[0], 0];
  navMove(m[0], m[1]);
}
function pressA() {
  if ($('dlg').style.display == 'block') return showD();
  // en combat, A fait défiler le message en cours
  if (msgSkip && !$('mn').querySelector('button')) return msgSkip();
  const L = layer();
  if (L) {
    const bs = navBtns(L),
      b = cur && L.contains(cur) ? cur : bs[0];
    if (b && b.type == 'text') {
      const ok = $('ok');
      ok && ok.click();
      return;
    }
    if (b && b.tagName != 'SELECT' && b.type != 'range') b.click();
    return;
  }
  if (busy) return;
  interact();
}
function pressB() {
  if ($('dlg').style.display == 'block') return;
  const L = layer();
  if (!L) return;
  if (L === $('pn')) {
    const x = $('bk') || $('x');
    x && x.click();
    return;
  }
  if (L === $('ch') || L === $('mn')) {
    const bs = [...L.querySelectorAll('button')].filter(
      b => !b.disabled && /^(Annuler|Retour|Quitter|Non|Partir|Fermer|Plus tard)/.test(b.textContent.trim())
    );
    bs.length && bs[bs.length - 1].click();
  }
}
function pressStart() {
  if ($('dlg').style.display == 'block') return;
  const L = layer();
  if (L === $('pn')) {
    $('x') && $('x').click();
    return;
  }
  if (L || busy) return;
  hub();
}
function pressSel() {
  if (layer() || busy || $('dlg').style.display == 'block') return;
  settings();
}
function interact() {
  if (busy) return;
  const nx = G.x + fd[0],
    ny = G.y + fd[1],
    t = maps[G.map].g[ny]?.[nx];
  bump(nx, ny, t);
}
addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (
    /^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName || '') &&
    e.key != 'Escape' &&
    !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
    e.key != 'Enter'
  )
    return;
  const k = e.key,
    lk = k.length == 1 ? k.toLowerCase() : k,
    act = $('dlg').style.display == 'block' || !!layer();
  if (lk == 'z' || lk == ' ' || (k == 'Enter' && act)) {
    e.preventDefault();
    if (!e.repeat) pressA();
    return;
  }
  if (k == 'Enter') {
    e.preventDefault();
    if (!e.repeat) pressStart();
    return;
  }
  if (lk == 'x' || k == 'Backspace' || k == 'Escape') {
    e.preventDefault();
    runB = 1;
    if (!e.repeat) pressB();
    return;
  }
  const sc = {
    e: team,
    b: bag,
    q: quests,
    v: dex,
    m: hub,
    p: settings,
    h: story,
    g: toggleGuide,
    t: toggle3d
  }[lk];
  if (sc && !busy && !layer()) return sc();
  if (K[k]) {
    e.preventDefault();
    if (!e.repeat && layer() && !keys[k]) navMove(K[k][0], K[k][1]);
    keys[k] = 1;
  }
});
(() => {
  const bind = (id, f, hold) => {
    const el = $(id);
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      el.classList.add('on');
      if (hold) runB = 1;
      f();
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(v =>
      el.addEventListener(v, () => {
        el.classList.remove('on');
        if (hold) runB = 0;
      })
    );
  };
  bind('bA', pressA);
  bind('bB', pressB, 1);
  bind('bSta', pressStart);
  bind('bSel', pressSel);
})();
(() => {
  let nd = null,
    nt = 0,
    had = false;
  setInterval(() => {
    syncCur();
    const L = layer();
    if (!L) {
      had = false;
      nd = null;
      return;
    }
    let dx = ph[0],
      dy = ph[1];
    for (const k in keys)
      if (keys[k]) {
        dx += K[k][0];
        dy += K[k][1];
      }
    let v = null;
    if (dy && Math.abs(dy) >= Math.abs(dx)) v = [0, Math.sign(dy)];
    else if (dx) v = [Math.sign(dx), 0];
    const key = v ? v + '' : '',
      now = performance.now();
    if (!had) {
      had = true;
      nd = key;
      nt = now + 420;
      return;
    }
    if (!v) {
      nd = '';
      return;
    }
    if (key != nd) {
      nd = key;
      nt = now + 380;
    } else if (now > nt) {
      nt = now + 120;
      navMove(v[0], v[1]);
    }
  }, 50);
})();
