// Système de combat (simple et double), décors de combat
// ---------- Combat ----------
const sleep = ms => new Promise(r => setTimeout(r, ms));
let B;
const F = () => B.f[B.fi],
  M = () => G.party[B.m];
function rn2() {
  const E = B.E || [],
    A = B.A || [],
    inf = c => {
      const r = Math.max(0, c.hp) / c.mh;
      return `<div style="margin-bottom:5px"><div class="nm"><b>${nm(c)}</b><span>Nv${c.lv}${c.st ? ' ' + { brn: 'BRU', slp: 'DOR', par: 'PAR' }[c.st] : ''}</span></div><div class="hpr"><span>PV</span><div class="bar"><i style="width:${r * 100}%;background:${r > 0.5 ? '#3c3' : r > 0.2 ? '#eb3' : '#e33'}"></i></div></div></div>`;
    };
  $('sp').innerHTML =
    `<div class="fs">${E.map(c => spr(c.s, 64)).join('')}</div><div class="ms">${A.map(c => spr(c.s, 64, 1)).join('')}</div>`;
  $('fi').innerHTML = E.map(inf).join('');
  $('mi').innerHTML = A.map(inf).join('');
}
const bmenu = (a, o) =>
  new Promise(r => {
    const mn = $('mn');
    const show = (items, back) => {
      mn.innerHTML = '';
      items.forEach(([t, v, d, cb]) => {
        const b = document.createElement('button');
        b.textContent = t;
        b.disabled = !!d;
        b.onclick = () => {
          if (cb) cb();
          else {
            mn.innerHTML = '';
            r(v);
          }
        };
        mn.append(b);
      });
      if (back) {
        const b = document.createElement('button');
        b.textContent = 'Retour';
        b.onclick = back;
        mn.append(b);
      }
    };
    const main = () => {
      $('msg').textContent = `Que fait ${nm(a)} ?`;
      const bag = [
        ...(o.ball ? [[`Capsule ×${G.balls}`, { k: 'ball' }, G.balls < 1]] : []),
        [`Potion ×${G.pots}`, { k: 'pot' }, G.pots < 1],
        ...(o.sp ? [[`Super Potion ×${G.sp}`, { k: 'spt' }, G.sp < 1]] : [])
      ];
      show([
        [
          'Combat',
          0,
          0,
          () =>
            show(
              mvs(a).map(k => [MV[k][0], { k: 'atk', m: k }]),
              main
            )
        ],
        ['Sac', 0, 0, () => show(bag, main)],
        ...(o.sw ? [['Équipe', { k: 'sw' }, G.party.filter(c => c.hp > 0).length < 2]] : []),
        ...(o.run !== undefined ? [['Fuite', { k: 'run' }, !o.run]] : [])
      ]);
    };
    main();
  });
function menu2(a) {
  return bmenu(a, {});
}
async function round2() {
  const A = G.party.filter(c => c.hp > 0).slice(0, 2),
    E = B.f.filter(c => c.hp > 0).slice(0, 2);
  if (!A.length) return 'lose';
  if (!E.length) return 'win';
  B.A = A;
  B.E = E;
  rn();
  if (!B.intro) {
    B.intro = 1;
    await msg('Combat double !');
  }
  const pl = [];
  for (const a of A) {
    const p = await menu2(a);
    if (p.k == 'pot') {
      pl.push({ a, k: 'pot' });
      continue;
    }
    let t = E[0];
    if (E.length > 1) {
      const i = await new Promise(r =>
        choose(
          E.map(e => `${nm(e)} (${e.hp}/${e.mh})`),
          k => {
            busy = true;
            r(k);
          }
        )
      );
      t = E[i];
    }
    pl.push({ a, k: 'atk', m: p.m, t });
  }
  for (const e of E) {
    const ms = mvs(e),
      tg = A[Math.floor(Math.random() * A.length)];
    let m = ms[Math.random() < 0.6 ? ms.length - 1 : 0];
    if (B.t && Math.random() < 0.7)
      m = ms.reduce((b, k) => (eff(k[0], SP[tg.s].t) * MV[k][1] > eff(b[0], SP[tg.s].t) * MV[b][1] ? k : b));
    pl.push({ a: e, k: 'atk', m, t: tg });
  }
  pl.sort((x, y) => spd(y.a) - spd(x.a));
  for (const p of pl) {
    if (p.a.hp <= 0) continue;
    if (p.k == 'pot') {
      G.pots--;
      p.a.hp = Math.min(p.a.mh, p.a.hp + 40);
      rn();
      await msg(`${nm(p.a)} récupère des PV.`);
      continue;
    }
    const mine = A.includes(p.a);
    let t = p.t;
    if (t.hp <= 0) {
      const pool = (mine ? E : A).filter(c => c.hp > 0);
      if (!pool.length) continue;
      t = pool[0];
    }
    await attack(p.a, t, p.m);
    if (t.hp <= 0) {
      await msg(`${nm(t)} est K.O. !`);
      if (mine) await gain(p.a, t);
    }
    if (G.party.every(c => c.hp <= 0)) return 'lose';
    if (B.f.every(c => c.hp <= 0)) return 'win';
  }
  return G.party.every(c => c.hp <= 0) ? 'lose' : B.f.every(c => c.hp <= 0) ? 'win' : null;
}
function rn() {
  if (B.dbl) return rn2();
  const f = F(),
    m = M();
  $('sp').innerHTML =
    `<div class="fs"${typeof KOS != 'undefined' && KOS.has(f) && f.hp <= 0 ? ' style="visibility:hidden"' : ''}>${spr(f.s, 128)}</div><div class="ms"${typeof KOS != 'undefined' && KOS.has(m) && m.hp <= 0 ? ' style="visibility:hidden"' : ''}>${spr(m.s, 160, 1)}</div>`;
  const info = (c, id, own) => {
    const r = Math.max(0, c.hp) / c.mh,
      col = r > 0.5 ? '#3c3' : r > 0.2 ? '#eb3' : '#e33',
      xp = own ? Math.min(1, c.xp / (c.lv * c.lv * 2 + 8)) : 0;
    $(id).innerHTML =
      `<div class="nm"><b>${nm(c)}</b><span>Nv${c.lv}</span></div><div class="hpr"><span>PV</span><div class="bar"><i style="width:${r * 100}%;background:${col}"></i></div></div>` +
      (c.st ? `<div class="hpn">${{ brn: 'BRÛLÉ', slp: 'ENDORMI', par: 'PARALYSÉ' }[c.st]}</div>` : '') +
      (own
        ? `<div class="hpn">${Math.max(0, c.hp)}/${c.mh}</div><div class="xpb"><i style="width:${xp * 100}%"></i></div>`
        : '');
  };
  info(f, 'fi', 0);
  info(m, 'mi', 1);
}
const msg = t => {
  $('msg').textContent = tr(t);
  return sleep(SPD);
};
function menu() {
  return bmenu(M(), { ball: !B.t, sp: 1, sw: 1, run: B.run ? 1 : 0 });
}
const pickMon = () =>
  new Promise(r => {
    const ix = G.party.map((c, i) => i).filter(i => G.party[i].hp > 0 && i != B.m);
    choose(
      [...ix.map(i => `${nm(G.party[i])} Nv${G.party[i].lv} (${G.party[i].hp}/${G.party[i].mh})`), 'Annuler'],
      k => {
        busy = true;
        r(k < ix.length ? ix[k] : null);
      }
    );
  });
async function attack(a, d, k) {
  const [n, p] = MV[k];
  if (a.st == 'slp') {
    if (Math.random() < 0.4) {
      a.st = 0;
      rn();
      await msg(`${nm(a)} se réveille !`);
    } else {
      await msg(`${nm(a)} dort profondément…`);
      return;
    }
  }
  if (a.st == 'par' && Math.random() < 0.25) {
    await msg(`${nm(a)} est paralysé et ne peut pas bouger !`);
    return;
  }
  await msg(`${nm(a)} utilise ${n} !`);
  try {
    heroAct(a);
  } catch (e) {}
  await fx(k, B.f.includes(d));
  const e = eff(k[0], SP[d.s].t),
    crit = Math.random() < (a.it == 'lu' ? 0.2 : 0.1);
  const hp0 = d.hp;
  d.hp = Math.max(
    0,
    d.hp -
      Math.max(
        1,
        Math.floor(
          ((((2 * a.lv) / 5 + 2) * p * a.at * (a.it == 'gr' ? 1.15 : 1)) /
            (d.df * (d.it == 'ec' ? 1.15 : 1)) /
            14 +
            2) *
            e *
            wb(k[0]) *
            (crit ? 1.5 : 1) *
            (G.party.includes(d) ? [0.75, 1, 1.3][S.diff] : 1) *
            (0.85 + Math.random() * 0.15)
        )
      )
  );
  rn();
  popDmg(d, hp0 - d.hp, e, crit);
  if (typeof koFx == 'function') {
    if (e > 1 || crit) camPunch(crit && e > 1 ? 1.6 : 1);
    if (d.hp <= 0) koFx(d);
  } else {
  }
  $('sp').classList.remove('hit');
  void $('sp').offsetWidth;
  if (S.anim) $('sp').classList.add('hit');
  if (Q.fx && e > 1 && S.anim) {
    const b = $('bt');
    b.classList.remove('flash');
    void b.offsetWidth;
    b.classList.add('flash');
  }
  if (S.vib && navigator.vibrate) navigator.vibrate(e > 1 ? 70 : 30);
  sfx(e > 1 ? 320 : e < 1 ? 120 : 200, 0.15);
  if (crit) {
    if (G.party.includes(a)) G.sx.crit = (G.sx.crit || 0) + 1;
    await msg('Coup critique !');
  }
  if (e > 1) await msg("C'est super efficace !");
  else if (e < 1) await msg("Ce n'est pas très efficace…");
  await after(a, d, k);
}
async function after(a, d, k) {
  if (d.hp > 0 && d.it == 'ba' && d.hp < d.mh / 3) {
    d.it = 0;
    d.hp = Math.min(d.mh, d.hp + Math.ceil(d.mh * 0.4));
    rn();
    await msg(`${nm(d)} mange sa Baie Soin !`);
  }
  if (d.hp > 0 && !d.st && Math.random() < 0.25) {
    const t = { F: 'brn', P: 'slp', E: 'par' }[k[0]];
    if (t) {
      d.st = t;
      rn();
      await msg(`${nm(d)} ${{ brn: 'est brûlé', slp: "s'endort", par: 'est paralysé' }[t]} !`);
    }
  }
  if (a.st == 'brn' && a.hp > 0) {
    a.hp = Math.max(1, a.hp - Math.max(1, Math.floor(a.mh / 8)));
    rn();
    await msg(`${nm(a)} souffre de sa brûlure.`);
  }
}
async function gain(me, f) {
  const xp = Math.floor(f.lv * 7.5 * [1.25, 1, 0.9][S.diff]);
  me.xp += xp;
  await msg(`${nm(me)} gagne ${xp} points d'expérience.`);
  while (me.xp >= me.lv * me.lv * 2 + 8) {
    me.xp -= me.lv * me.lv * 2 + 8;
    const o = me.mh;
    me.lv++;
    stat(me);
    me.hp += me.mh - o;
    rn();
    await msg(`${nm(me)} passe au niveau ${me.lv} !`);
    [500, 630, 790].forEach((f, i) => setTimeout(() => sfx(f, 0.15), i * 120));
    const ev = SP[me.s].ev;
    if (ev && me.lv >= ev[0]) {
      await msg(`Quoi ? ${nm(me)} évolue !`);
      try {
        await evoFx(me, ev[1]);
      } catch (e) {
        await sleep(SPD > 500 ? 1400 : 400);
      }
      await msg(`${nm(me)} évolue en ${SP[ev[1]].n} !`);
      me.s = ev[1];
      const o2 = me.mh;
      stat(me);
      me.hp += me.mh - o2;
      mark(me.s, 1);
      rn();
    }
  }
}
const BGT = {
  plain: {
    s: ['#6fbff0', '#dff3ff'],
    g: ['#92d85e', '#5a9a38'],
    f: 'hills',
    fc: '#6fae7a',
    pl: ['#a8e870', '#4f8a2e']
  },
  meadow: {
    s: ['#76c8f6', '#e8f7ff'],
    g: ['#a0e468', '#62a83a'],
    f: 'hills',
    fc: '#82cc90',
    pl: ['#b4f078', '#4f8a2e'],
    d: 'flowers'
  },
  forest: {
    s: ['#3f6a5c', '#a4c49c'],
    g: ['#4a954a', '#244f2a'],
    f: 'pines',
    fc: '#18402a',
    pl: ['#6ab25a', '#2f5a2a']
  },
  autumn: {
    s: ['#f0a860', '#fde4b8'],
    g: ['#bcb44c', '#84702c'],
    f: 'trees',
    fc: '#b4501c',
    pl: ['#d6c860', '#7a6428'],
    d: 'leaves'
  },
  lake: {
    s: ['#62b8ee', '#dcf5ff'],
    g: ['#84d46e', '#468f46'],
    f: 'sea',
    fc: '#2fa6d8',
    pl: ['#9ae87c', '#3f8a3a']
  },
  mountain: {
    s: ['#86a4c6', '#dde8f0'],
    g: ['#a2a284', '#62624a'],
    f: 'peaks',
    fc: '#76869e',
    pl: ['#b8b898', '#5a5a44']
  },
  mist: {
    s: ['#92b4ac', '#d8e8e4'],
    g: ['#6c9878', '#38624f'],
    f: 'pines',
    fc: '#46766e',
    pl: ['#8cc0a0', '#3a6a58'],
    d: 'fog'
  },
  volcano: {
    s: ['#561a12', '#f08a3a'],
    g: ['#5e463a', '#241814'],
    f: 'volcano',
    fc: '#241210',
    pl: ['#7a5a48', '#2a1a14'],
    d: 'lava'
  },
  snow: {
    s: ['#92b8dc', '#eef8ff'],
    g: ['#f6faff', '#bcd2e6'],
    f: 'icepeaks',
    fc: '#b4cee6',
    pl: ['#ffffff', '#9cb8d4'],
    d: 'snow'
  },
  ruins: {
    s: ['#2e2050', '#9a84c4'],
    g: ['#6a6a7c', '#363650'],
    f: 'ruins',
    fc: '#241c40',
    pl: ['#8a8aa0', '#3a3a58']
  },
  dawn: {
    s: ['#f49cc4', '#ffeac4'],
    g: ['#a2e07e', '#66a84a'],
    f: 'hills',
    fc: '#e096b8',
    pl: ['#b8f090', '#4f8a3a'],
    d: 'petals'
  },
  coast: {
    s: ['#62cdf4', '#eafcff'],
    g: ['#efdca6', '#c4aa6c'],
    f: 'sea',
    fc: '#2fb0d8',
    pl: ['#f6e8b8', '#b8a060'],
    d: 'sand'
  },
  desert: {
    s: ['#74c4ee', '#fce8b8'],
    g: ['#e8cc80', '#b08c46'],
    f: 'dunes',
    fc: '#c9a252',
    pl: ['#f2dc98', '#a88442'],
    d: 'sand'
  },
  beach: {
    s: ['#5cc8f4', '#eafcff'],
    g: ['#f0dea8', '#c8ae70'],
    f: 'palmsea',
    fc: '#2cb4de',
    pl: ['#f8ecc0', '#b8a060'],
    d: 'sand'
  },
  tropical: {
    s: ['#58c8f0', '#e4fbf2'],
    g: ['#72d46c', '#2f9a3a'],
    f: 'palmsea',
    fc: '#22b8d0',
    pl: ['#90ea84', '#2f8a36'],
    d: 'flowers'
  },
  swamp: {
    s: ['#728e62', '#c2d29c'],
    g: ['#5e7e3e', '#2c3a1c'],
    f: 'deadtrees',
    fc: '#222e1a',
    pl: ['#7a9a50', '#2f3f1c'],
    d: 'fog'
  },
  star: {
    s: ['#0e0832', '#4a3a9a'],
    g: ['#3a3f7c', '#14143c'],
    f: 'crystals',
    fc: '#6a5ac8',
    pl: ['#5a60b0', '#1e1e52'],
    st: 1
  },
  cave: {
    s: ['#16161e', '#2c2c3a'],
    g: ['#4a4a5a', '#202028'],
    f: 'stalac',
    fc: '#101018',
    pl: ['#6a6a7a', '#26262e']
  },
  arena: {
    s: ['#3a2a20', '#6a4a34'],
    g: ['#c8a878', '#7a5a38'],
    f: 'hall',
    fc: '#2a1a12',
    pl: ['#e8d0a0', '#7a5a38']
  }
};
function paintBG(k, ph) {
  const T = BGT[k] || BGT.plain,
    W = 160,
    H = 120,
    HZ = 34,
    c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const o = c.getContext('2d');
  let sd = k.length * 977 + ph * 31 + 7;
  const R = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const lin = (y0, y1, c0, c1) => {
      const g = o.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, c0);
      g.addColorStop(1, c1);
      o.fillStyle = g;
      o.fillRect(0, y0, W, y1 - y0);
    },
    px = (x, y, w, h, col) => {
      o.fillStyle = col;
      o.fillRect(Math.round(x), Math.round(y), w, h);
    },
    blob = (x, y, r, col) => {
      o.fillStyle = col;
      o.beginPath();
      o.arc(x, y, r, 0, 7);
      o.fill();
    },
    tri = (x, y, w, h, col) => {
      o.fillStyle = col;
      o.beginPath();
      o.moveTo(x, y - h);
      o.lineTo(x + w, y);
      o.lineTo(x - w, y);
      o.fill();
    };
  lin(0, HZ, T.s[0], T.s[1]);
  if (T.st || ph == 2) {
    for (let i = 0; i < 46; i++) px(R() * W, R() * HZ * 0.9, 1, 1, `rgba(255,255,255,${0.4 + R() * 0.6})`);
  }
  if (k != 'cave' && k != 'arena') {
    if (ph == 2) {
      blob(128, 11, 5, '#f4f0d0');
      blob(130, 10, 4.2, T.s[0]);
      blob(128, 11, 4.6, '#f4f0d0');
      px(126, 10, 2, 2, '#d8d4b0');
      px(129, 14, 2, 1, '#d8d4b0');
    } else if (k != 'star') {
      const sx = ph ? 36 : 30,
        sy = ph ? 27 : 12;
      [16, 12, 9].forEach((r, i) =>
        blob(sx, sy, r, `rgba(255,${ph ? 200 : 246},${ph ? 140 : 176},${0.1 + i * 0.08})`)
      );
      blob(sx, sy, 6, ph ? '#ffd08a' : '#fff7b8');
    }
    for (let i = 0; i < 4; i++) {
      const cx0 = R() * W,
        cy0 = 4 + R() * 16,
        a = ph == 2 ? 0.12 : 0.8;
      o.fillStyle = `rgba(255,255,255,${a})`;
      [
        [0, 0, 9],
        [8, -2, 7],
        [-8, 1, 6],
        [14, 2, 5]
      ].forEach(([dx, dy, r]) => {
        o.beginPath();
        o.ellipse(cx0 + dx, cy0 + dy, r, r * 0.5, 0, 0, 7);
        o.fill();
      });
    }
  }
  const F = T.fc,
    dk = a => `rgba(0,0,0,${a})`;
  switch (T.f) {
    case 'hills':
    case 'dunes':
      for (let l = 0; l < 3; l++) {
        o.fillStyle = l == 0 ? F : l == 1 ? F : F;
        o.globalAlpha = 0.55 + l * 0.2;
        o.beginPath();
        o.moveTo(0, HZ);
        for (let x = 0; x <= W; x += 2)
          o.lineTo(
            x,
            HZ -
              6 -
              l * 3 -
              Math.sin(x / (11 + l * 4) + l * 2) * (5 - l) -
              (T.f == 'dunes' ? Math.sin(x / 30) * 3 : 0)
          );
        o.lineTo(W, HZ);
        o.fill();
      }
      o.globalAlpha = 1;
      break;
    case 'pines':
      for (let l = 0; l < 2; l++)
        for (let x = -4 + l * 5; x < W + 4; x += 9 + ((R() * 4) | 0)) {
          tri(x, HZ - l * 3 + 1, 4 + R() * 2, 10 + R() * 10 + l * -3, l ? F : '#0d2a1c');
        }
      break;
    case 'trees':
      for (let x = -4; x < W; x += 8 + ((R() * 4) | 0)) {
        const h = 7 + R() * 6;
        px(x, HZ - h / 2, 2, h / 2, '#4a2a14');
        blob(x + 1, HZ - h, 5, F);
        blob(x - 2, HZ - h + 2, 3.4, '#d27a22');
      }
      break;
    case 'peaks':
    case 'icepeaks':
      for (let i = 0; i < 5; i++) {
        const x = i * 28 - 6 + R() * 8,
          h = 22 + R() * 18;
        tri(x, HZ + 1, 16 + R() * 6, h, F);
        tri(x - 3, HZ + 1, 8, h * 0.8, 'rgba(0,0,0,.15)');
        tri(x, HZ - h + 7, 6, 7, '#fff');
      }
      break;
    case 'volcano':
      tri(80, HZ + 1, 40, 26, F);
      tri(80, HZ - 20, 9, 5, '#ff7a1a');
      blob(80, HZ - 25, 4, '#ffd24a');
      for (let i = 0; i < 4; i++) {
        px(76 + i * 3, HZ - 18 + i * 4, 1, 7, '#ff6a1a');
      }
      for (let i = 0; i < 4; i++)
        blob(80 + R() * 8 - 4, HZ - 30 - i * 4, 3 + i * 0.8, `rgba(60,40,40,${0.5 - i * 0.1})`);
      tri(20, HZ + 1, 16, 12, '#3a1a14');
      tri(140, HZ + 1, 16, 10, '#3a1a14');
      break;
    case 'ruins':
      for (let i = 0; i < 9; i++) {
        const x = 6 + i * 18,
          h = 10 + R() * 12;
        px(x, HZ - h, 5, h, F);
        px(x - 1, HZ - h, 7, 2, '#3a3060');
        if (R() > 0.5) px(x, HZ - h - 3, 5, 3, F);
      }
      px(44, HZ - 18, 70, 3, F);
      break;
    case 'sea':
    case 'palmsea':
      o.fillStyle = F;
      o.fillRect(0, HZ - 9, W, 9);
      for (let i = 0; i < 18; i++) px(R() * W, HZ - 8 + R() * 7, 6 + R() * 6, 1, 'rgba(255,255,255,.55)');
      px(0, HZ - 9, W, 1, 'rgba(255,255,255,.6)');
      if (T.f == 'palmsea')
        for (let i = 0; i < 4; i++) {
          const x = 10 + i * 34 + R() * 10,
            h = 16 + R() * 8;
          o.strokeStyle = '#4a3a22';
          o.lineWidth = 2;
          o.beginPath();
          o.moveTo(x, HZ + 1);
          o.quadraticCurveTo(x + 4, HZ - h / 2, x + 2, HZ - h);
          o.stroke();
          for (let a = 0; a < 5; a++) {
            o.strokeStyle = '#1f8a3a';
            o.lineWidth = 2;
            o.beginPath();
            o.moveTo(x + 2, HZ - h);
            o.quadraticCurveTo(x + 2 + (a - 2) * 5, HZ - h - 5, x + 2 + (a - 2) * 8, HZ - h + 4);
            o.stroke();
          }
        }
      else blob(128, HZ - 9, 6, '#5aa860');
      break;
    case 'deadtrees':
      for (let i = 0; i < 8; i++) {
        const x = i * 16 + R() * 8,
          h = 14 + R() * 10;
        o.strokeStyle = F;
        o.lineWidth = 2;
        o.beginPath();
        o.moveTo(x, HZ + 1);
        o.lineTo(x, HZ - h);
        o.moveTo(x, HZ - h * 0.6);
        o.lineTo(x - 6, HZ - h * 0.9);
        o.moveTo(x, HZ - h * 0.4);
        o.lineTo(x + 6, HZ - h * 0.75);
        o.stroke();
      }
      break;
    case 'crystals':
      for (let i = 0; i < 9; i++) {
        const x = i * 14 + R() * 6,
          h = 10 + R() * 22;
        tri(x, HZ + 1, 3 + R() * 3, h, F);
        tri(x - 1, HZ + 1, 1.6, h * 0.8, '#b8a8ff');
      }
      break;
    case 'stalac':
      o.fillStyle = F;
      for (let x = 0; x < W; x += 7) {
        const h = 10 + R() * 26;
        o.beginPath();
        o.moveTo(x, 0);
        o.lineTo(x + 7, 0);
        o.lineTo(x + 3.5, h);
        o.fill();
      }
      for (let x = 3; x < W; x += 11) {
        tri(x, HZ + 1, 4, 8 + R() * 14, F);
      }
      break;
    case 'hall':
      o.fillStyle = F;
      o.fillRect(0, 0, W, HZ);
      for (let x = 6; x < W; x += 24) {
        px(x, 0, 6, HZ, '#4a3022');
        px(x, 0, 2, HZ, '#6a4a34');
      }
      px(0, HZ - 4, W, 4, '#1a100a');
      for (let x = 14; x < W; x += 48) {
        px(x, 10, 10, 14, '#2a6a9a');
        px(x + 1, 11, 8, 6, '#7ac0f0');
      }
      break;
  }
  // sol
  lin(HZ, H, T.g[0], T.g[1]);
  for (let i = 0; i < 16; i++) {
    const y = HZ + Math.pow(i / 16, 1.55) * (H - HZ),
      h = 2 + i * 0.9;
    px(0, y, W, Math.round(h), i % 2 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)');
  }
  if (k == 'arena') {
    for (let i = 0; i < 8; i++) {
      const y = HZ + Math.pow(i / 8, 1.6) * (H - HZ);
      px(0, y, W, 1, 'rgba(60,30,10,.35)');
    }
    for (let i = -9; i < 10; i++) {
      o.strokeStyle = 'rgba(60,30,10,.3)';
      o.beginPath();
      o.moveTo(80 + i * 3, HZ);
      o.lineTo(80 + i * 20, H);
      o.stroke();
    }
  }
  for (let i = 0; i < 220; i++) {
    const x = R() * W,
      y = HZ + 4 + Math.pow(R(), 0.8) * (H - HZ - 4),
      s = y > HZ + 60 ? 2 : 1;
    px(x, y, s, 1, R() > 0.5 ? 'rgba(255,255,255,.13)' : 'rgba(0,0,0,.13)');
  }
  if (!['sand', 'snow', 'lava', 'fog', 'flowers', 'leaves', 'petals'].includes(T.d) || 0) {
  }
  if (
    k != 'cave' &&
    k != 'arena' &&
    k != 'star' &&
    k != 'ruins' &&
    T.d != 'sand' &&
    T.d != 'snow' &&
    T.d != 'lava'
  ) {
    for (let i = 0; i < 40; i++) {
      const x = R() * W,
        y = HZ + 6 + Math.pow(R(), 0.75) * (H - HZ - 8),
        h = (2 + (y - HZ) / 22) | 0;
      px(x, y - h, 1, h, 'rgba(0,0,0,.2)');
      px(x + 1, y - h - 1, 1, h, 'rgba(255,255,255,.22)');
      px(x - 1, y - h, 1, h - 1, 'rgba(0,0,0,.16)');
    }
  }
  if (T.d == 'flowers' || T.d == 'petals')
    for (let i = 0; i < 50; i++) {
      px(R() * W, HZ + 6 + R() * (H - HZ - 8), 2, 2, ['#fff', '#ffd54f', '#ff8fb1', '#b39ddb'][i % 4]);
    }
  if (T.d == 'leaves')
    for (let i = 0; i < 50; i++) {
      px(R() * W, HZ + 6 + R() * (H - HZ - 8), 3, 2, ['#c0392b', '#e08a2a', '#f0b040'][i % 3]);
    }
  if (T.d == 'snow')
    for (let i = 0; i < 12; i++) {
      const x = R() * W,
        y = HZ + 10 + R() * (H - HZ - 20);
      o.fillStyle = 'rgba(150,180,215,.4)';
      o.beginPath();
      o.ellipse(x, y, 9, 2.4, 0, 0, 7);
      o.fill();
      o.fillStyle = 'rgba(255,255,255,.9)';
      o.beginPath();
      o.ellipse(x, y - 1, 8, 1.8, 0, 0, 7);
      o.fill();
    }
  if (T.d == 'sand')
    for (let i = 0; i < 14; i++) {
      const y = HZ + 10 + R() * (H - HZ - 10);
      o.strokeStyle = 'rgba(0,0,0,.09)';
      o.lineWidth = 1;
      o.beginPath();
      o.moveTo(R() * 80, y);
      o.quadraticCurveTo(R() * 120, y - 2, R() * 120, y);
      o.stroke();
    }
  if (T.d == 'lava') {
    for (let i = 0; i < 10; i++) {
      const x = R() * W,
        y = HZ + 10 + R() * (H - HZ - 14);
      o.strokeStyle = '#ff6a1a';
      o.lineWidth = 1.4;
      o.beginPath();
      o.moveTo(x, y);
      o.lineTo(x + R() * 14 - 7, y + R() * 8);
      o.lineTo(x + R() * 20 - 10, y + R() * 12);
      o.stroke();
      px(x, y, 2, 1, '#ffd24a');
    }
  }
  if (T.d == 'fog') {
    for (let i = 0; i < 5; i++) {
      o.fillStyle = 'rgba(225,238,232,.16)';
      o.beginPath();
      o.ellipse(R() * W, HZ + 4 + i * 28, 50, 7, 0, 0, 7);
      o.fill();
    }
  }
  if (k == 'star')
    for (let i = 0; i < 36; i++) px(R() * W, HZ + R() * (H - HZ), 1, 1, 'rgba(220,210,255,.7)');
  lin(HZ - 5, HZ + 5, 'rgba(255,255,255,0)', 'rgba(255,255,255,.18)');
  if (ph == 2) {
    o.fillStyle = 'rgba(8,10,64,.46)';
    o.fillRect(0, 0, W, H);
  } else if (ph == 1) {
    o.fillStyle = 'rgba(255,140,60,.16)';
    o.fillRect(0, 0, W, H);
  }
  return c.toDataURL('image/png');
}
const BGC = {};
function setBG() {
  const b = $('bt');
  let bg = $('bbg');
  if (!bg) {
    bg = document.createElement('div');
    bg.id = 'bbg';
    b.insertBefore(bg, b.firstChild);
  }
  bg.style.display = S.v3 ? 'none' : '';
  const m = maps[G.map],
    k = m.in ? (m.k == 'cave' ? 'cave' : 'arena') : m.th || 'plain',
    dn = new Date(),
    hr = dn.getHours() + dn.getMinutes() / 60,
    ph = hr >= 21 || hr < 5 ? 2 : hr >= 18 || hr < 8 ? 1 : 0,
    key = k + ph;
  if (BGC[key] === undefined) {
    let u = null;
    if (!/jsdom/i.test(navigator.userAgent))
      try {
        u = paintBG(k, ph);
      } catch (e) {
        u = null;
      }
    BGC[key] = u;
  }
  const u = BGC[key],
    T = BGT[k] || BGT.plain;
  bg.style.backgroundImage = u ? `url(${u})` : '';
  b.style.setProperty('--pl1', T.pl[0]);
  b.style.setProperty('--pl2', T.pl[1]);
  b.classList.add('intro');
  setTimeout(() => b.classList.remove('intro'), 900);
}
function popDmg(d, n, e, crit) {
  try {
    if (!S.anim || !n) return;
    const b = $('bt'),
      t = B.f.includes(d) ? document.querySelector('#sp .fs') : document.querySelector('#sp .ms');
    if (!t) return;
    const r = t.getBoundingClientRect(),
      br = b.getBoundingClientRect(),
      s = document.createElement('div');
    s.className = 'dmgp' + (e > 1 ? ' se' : e < 1 ? ' nv' : '') + (crit ? ' cr' : '');
    s.textContent = (e > 1 ? '💥 ' : '') + '-' + n;
    s.style.left = r.left - br.left + r.width / 2 + 'px';
    s.style.top = r.top - br.top + r.height * 0.25 + 'px';
    b.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  } catch (x) {}
}
async function battle(foes, title, run, dbl) {
  if (G.party.every(c => c.hp <= 0)) heal();
  G.sx.battles++;
  G.sb = 0;
  if (wx() == 'pluie') toast('🌧 Il pleut : Eau +25%, Feu −25%');
  B = { f: foes, fi: 0, m: G.party.findIndex(c => c.hp > 0), run, t: title, dbl };
  $('bt').classList.toggle('dbl', !!dbl);
  $('bt').style.display = 'flex';
  setBG();
  $('bt').style.background =
    `linear-gradient(${['#9ad1f5,#cfe8a8 60%,#8bb35a', '#9ad1f5,#bfe6a0 60%,#7fb05a', '#f6c58b,#f2e2b0 55%,#b9c88a', '#8ed0ff,#cfeaa2 60%,#6fa24c', '#3b3b7a,#7a6fb0 55%,#4a5a8a', '#2d4a3a,#4f7d55 55%,#2a4a30'][G.map] || { 14: '#b8c6db,#dfe6ee 55%,#8d9aa8', 15: '#cfe3ff,#e8f0d8 60%,#90b070', 16: '#f9d29d,#f5e6b8 55%,#c9b27c', 17: '#7ec8e3,#bfe8f3 55%,#4a9bd0', 18: '#2a2f4a,#5a5f8a 55%,#3a3a50', 23: '#6b7a8f,#9aa6b5 55%,#5a6475', 24: '#e07b39,#f2c28a 55%,#8a4a2a', 25: '#d9a066,#f0d9a8 55%,#8a6a3a', 26: '#bfe9ff,#e8f6ff 55%,#7fb5d8', 27: '#7aa0c4,#c8dff0 55%,#4a6a8a', 28: '#20102a,#4a2a5a 55%,#1a1020', 32: '#f9c9a0,#f6e4b8 55%,#d9a86a', 33: '#f9c9a0,#f6e4b8 55%,#d9a86a', 34: '#7fd0e8,#cfeef2 55%,#4aa3c9', 35: '#ffd98a,#fff0c4 55%,#e8b45a', 36: '#ffe6a0,#fff8d8 55%,#f2c45a' }[G.map] || '#5a5a6a,#2e2e3a'})`;
  busy = true;
  let res = null;
  foes.forEach(f => mark(f.s));
  rn();
  try {
    if (typeof battleFx == 'function' && S.anim !== false) await battleFx(title, foes, dbl, dbl && title);
  } catch (e) {}
  tip(
    'battle',
    'Choisis une attaque : Feu > Plante > Eau > Feu. Affaiblis un sauvage puis lance une Capsule !'
  );
  await msg(title ? `${title} te défie !` : `Un ${nm(F())} sauvage apparaît !`);
  const foeTurn = async () => {
    const f = F(),
      me = M();
    const ms = mvs(f);
    let mk2 = ms[Math.random() < 0.6 ? ms.length - 1 : 0];
    if (B.t && Math.random() < 0.7)
      mk2 = ms.reduce((b, k) =>
        eff(k[0], SP[me.s].t) * MV[k][1] > eff(b[0], SP[me.s].t) * MV[b][1] ? k : b
      );
    await attack(f, me, mk2);
    if (me.hp <= 0) {
      await msg(`${nm(me)} est K.O. !`);
      const n = G.party.findIndex(c => c.hp > 0);
      if (n < 0) {
        res = 'lose';
        return;
      }
      B.m = n;
      rn();
      try {
        entryFx(1);
      } catch (e) {}
      await msg(`Vas-y, ${nm(M())} !`);
    }
  };
  while (!res) {
    if (B.dbl) {
      res = await round2();
      continue;
    }
    const a = await menu(),
      me = M(),
      f = F();
    if (a.k == 'run') {
      if (Math.random() < 0.6) {
        await msg('Tu prends la fuite !');
        res = 'run';
      } else {
        await msg('Impossible de fuir !');
        await foeTurn();
      }
    } else if (a.k == 'sw') {
      const n = await pickMon();
      if (n != null) {
        B.m = n;
        rn();
        try {
          entryFx(1);
        } catch (e) {}
        await msg(`Vas-y, ${nm(M())} !`);
        await foeTurn();
      }
    } else if (a.k == 'spt') {
      G.sp--;
      me.hp = Math.min(me.mh, me.hp + 100);
      me.st = 0;
      rn();
      await msg(`${nm(me)} récupère des PV et guérit !`);
      await foeTurn();
    } else if (a.k == 'pot') {
      G.pots--;
      me.hp = Math.min(me.mh, me.hp + 40);
      rn();
      await msg(`${nm(me)} récupère des PV.`);
      await foeTurn();
    } else if (a.k == 'ball') {
      G.balls--;
      await msg('Tu lances une Capsule…');
      const okc = Math.random() < ((1 - (f.hp / f.mh) * 0.7) * 0.55 + 0.1) * (f.st ? 1.5 : 1);
      try {
        if (typeof capFx == 'function') await capFx(f, okc, okc ? 3 : Math.floor(Math.random() * 3));
      } catch (e) {}
      if (okc) {
        await msg(`${nm(f)} est capturé !`);
        mark(f.s, 1);
        G.sx.caught++;
        if (G.party.length < 6) G.party.push(f);
        else {
          G.box.push(f);
          tip('pc', 'Équipe pleine : les captures vont dans le PC des Centres de soins.');
          await msg('Équipe pleine : envoyé au PC.');
        }
        res = 'caught';
      } else {
        await msg("Il s'est échappé !");
        await foeTurn();
      }
    } else {
      const first = spd(f) > spd(me);
      if (first) {
        await foeTurn();
        if (res || M() !== me) continue;
      }
      await attack(me, f, a.m);
      if (f.hp <= 0) {
        await msg(`${nm(f)} est K.O. !`);
        await gain(me, f);
        B.fi++;
        if (B.fi >= foes.length) res = 'win';
        else {
          rn();
          try {
            entryFx(0);
          } catch (e) {}
          await msg(`${title} envoie ${nm(F())} !`);
        }
      } else if (!first) await foeTurn();
    }
  }
  if (res == 'win') {
    G.sx.wins++;
    if (B.dbl) G.sx.dbl = (G.sx.dbl || 0) + 1;
  }
  if (res == 'win') {
    const g = B.t ? 150 + foes.reduce((a, f) => a + f.lv, 0) * 10 : foes[0].lv * 8;
    G.gold += g;
    await msg(`Tu gagnes ${g} 💰 !`);
  }
  $('bt').style.display = 'none';
  busy = false;
  G.party.forEach(c => (c.st = 0));
  if (res == 'lose') {
    heal();
    go(0, maps[0].sp[0], maps[0].sp[1]);
    say(['Tu es à bout de forces… Tu te réveilles à Brumeval, ton équipe est soignée.']);
  }
  save();
  return res;
}
