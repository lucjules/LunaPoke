// Animations de combat : capsule, K.O., entrée, évolution, PNJ, héros en combat
// ---------- ANIMATION DE DÉBUT DE COMBAT (sauvage / dresseur) ----------
const HERO_LK = { hat: '#e63946', hair: '#3a2a1a', shirt: '#f4f1e8', pants: '#2b3a67' };
function trainerLook(n) {
  if (!n) return LOOK('🧑');
  if (/^Noa/.test(n)) return LK3.rival;
  if (/Corbin/.test(n)) return LOOK('🦹');
  if (/Éclipse|Vesper/.test(n)) return LOOK('🕴');
  if (/Aurion|Orion|Solène/.test(n)) return LOOK('👑');
  if (/Prof/.test(n)) return LK3.prof;
  const ks = ['🧑', '👨', '👩', '🧔', '🧑‍🌾', '🎩', '👧', '👦'];
  return LOOK(ks[[...n].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % ks.length]);
}
function fxHum(L, key, t, yaw, A, R) {
  V3.hb = 0;
  V3.mdt = V3.mdt || {};
  V3.mdc = V3.mdc || {};
  const q = V3.mdt[key];
  if (q && t - q.t < 55 && V3.mdc[key]) return V3.mdc[key];
  V3.mdt[key] = { t };
  try {
    return mdRender(mdHuman(t, L, A), key, R, yaw, 0.1, { t });
  } catch (e) {
    return V3.mdc[key] || null;
  }
}
// ---------- combat : lancer de Capsule, K.O., entrées, évolution, coups de caméra ----------
const KOS = new WeakSet();
function b9fx(ms) {
  const bt = $('bt');
  if (!bt || !S.anim || !document.body.animate || document.hidden) return null;
  let E = null;
  try {
    E = fxEngine(bt, SPD < 500, Q.fx == 2 ? 1.3 : Q.fx ? 1 : 0.55);
  } catch (e) {}
  return E;
}
function b9cv(E, el) {
  const b = $('bt').getBoundingClientRect(),
    r = el.getBoundingClientRect();
  return {
    x: ((r.left + r.width / 2 - b.left) / b.width) * E.cw,
    y: ((r.top + r.height * 0.5 - b.top) / b.height) * E.ch,
    bot: ((r.bottom - b.top) / b.height) * E.ch,
    top: ((r.top - b.top) / b.height) * E.ch,
    w: (r.width / b.width) * E.cw
  };
}
function drawCap(g, x, y, r, rot, glow) {
  g.save();
  g.translate(Math.round(x), Math.round(y));
  g.rotate(rot);
  if (glow) {
    g.globalCompositeOperation = 'lighter';
    g.fillStyle = 'rgba(255,240,160,' + glow + ')';
    g.beginPath();
    g.arc(0, 0, r * 1.7, 0, 7);
    g.fill();
    g.globalCompositeOperation = 'source-over';
  }
  g.fillStyle = '#d8302c';
  g.beginPath();
  g.arc(0, 0, r, Math.PI, 0);
  g.fill();
  g.fillStyle = '#f6f4ee';
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI);
  g.fill();
  g.fillStyle = '#ff7a6a';
  g.beginPath();
  g.arc(-r * 0.32, -r * 0.42, r * 0.3, 0, 7);
  g.fill();
  g.fillStyle = '#2a2a34';
  g.fillRect(-r, -0.7, r * 2, 1.6);
  g.beginPath();
  g.arc(0, 0, r * 0.34, 0, 7);
  g.fill();
  g.fillStyle = '#fff';
  g.beginPath();
  g.arc(0, 0, r * 0.2, 0, 7);
  g.fill();
  g.restore();
}
async function capFx(f, ok, sh) {
  const E = b9fx();
  if (!E) return;
  const bt = $('bt'),
    df = bt.querySelector('.fs'),
    at = bt.querySelector('.ms');
  if (!df || !at) {
    E.end();
    return;
  }
  let lim = setTimeout(() => E.end(), 9000),
    anim = null;
  try {
    const hm = bt.querySelector('#bhm'),
      A = hm
        ? (() => {
            const q = b9cv(E, hm);
            return { x: q.x, y: q.y, w: q.w * 0.8, bot: q.bot };
          })()
        : b9cv(E, at),
      Bc = b9cv(E, df),
      r = Math.max(4.5, E.cw / 22),
      gy = Math.min(E.ch - 4, Bc.bot - 2),
      sp = E.sp;
    if (V3.bhS) {
      V3.bhS.pm = 1;
      setTimeout(() => {
        if (V3.bhS) V3.bhS.pm = 0;
      }, 600);
    }
    let cp = { x: A.x + A.w * 0.2, y: A.y - A.w * 0.2, rot: 0, on: 1, glow: 0 };
    E.o(0, 1e9, () => {
      if (cp.on) drawCap(E.g, cp.x, cp.y, r, cp.rot, cp.glow);
    });
    sfx(520, 0.1);
    const H = Math.max(14, (A.y - Bc.y) * 0.9 + E.ch * 0.12);
    await new Promise(rs => {
      const t0 = E.T,
        d = 620;
      E.o(0, d, u => {
        cp.x = lerp(A.x + A.w * 0.2, Bc.x, u);
        cp.y = lerp(A.y - A.w * 0.2, Bc.y, u) - Math.sin(u * Math.PI) * H;
        cp.rot = u * Math.PI * 7;
        if (u > 0.98) rs();
      });
      E.wait(d + 30).then(rs);
    });
    cp.x = Bc.x;
    cp.y = Bc.y;
    E.flash('#ffffff', 0.55, 300);
    E.rg(Bc.x, Bc.y, Bc.w * 0.5, 420, ['#ffffff', '#ffd0c8', '#ff8a7a']);
    sfx(300, 0.12);
    E.burst(Bc.x, Bc.y, 26, {
      v0: 0.4,
      v1: 2.6,
      l0: 300,
      l1: 600,
      cols: ['#ffffff', '#ffc8c0', '#ff6a5a', '#c02a2a'],
      s0: 3,
      s1: 1,
      glow: 1
    });
    anim = df.animate(
      [
        { transform: 'none', filter: 'none', opacity: 1 },
        {
          transform: 'scale(.7)',
          filter: 'brightness(0) invert(1) drop-shadow(0 0 6px #fff)',
          opacity: 1,
          offset: 0.35
        },
        {
          transform: 'scale(.04)',
          filter: 'brightness(0) invert(1) drop-shadow(0 0 10px #f66)',
          opacity: 0.1
        }
      ],
      { duration: 520 / sp, fill: 'forwards', easing: 'ease-in' }
    );
    await E.wait(420);
    // chute + rebonds
    const fy0 = Bc.y;
    await new Promise(rs => {
      const d = 720;
      E.o(0, d, u => {
        const b1 = u < 0.55 ? 1 : 0,
          v = u < 0.55 ? u / 0.55 : (u - 0.55) / 0.45;
        cp.x = lerp(Bc.x, Bc.x + 2, u);
        cp.y = b1 ? lerp(fy0, gy, v * v) : gy - Math.abs(Math.sin(v * Math.PI)) * r * 1.6 * (1 - v);
        cp.rot = u * 5;
        if (u > 0.98) rs();
      });
      E.wait(d + 30).then(rs);
    });
    cp.y = gy;
    cp.rot = 0;
    E.rg(cp.x, gy + r * 0.8, r * 2.2, 300, ['#e8e0c8', '#c8c0a0']);
    for (let i = 0; i < sh; i++) {
      await E.wait(380);
      sfx(260 - i * 30, 0.1);
      await new Promise(rs => {
        const d = 480;
        E.o(0, d, u => {
          cp.rot = Math.sin(u * Math.PI * 2) * (0.6 - u * 0.25);
          cp.x = Bc.x + 2 + Math.sin(u * Math.PI * 2) * 1.4;
          if (u > 0.97) rs();
        });
        E.wait(d + 30).then(rs);
      });
      cp.rot = 0;
      E.burst(cp.x, gy, 5, {
        v0: 0.3,
        v1: 1.2,
        a0: 3.4,
        a1: 6,
        l0: 200,
        l1: 400,
        cols: ['#fff', '#ffe9a0'],
        s0: 2,
        s1: 1,
        glow: 1
      });
    }
    await E.wait(420);
    if (ok) {
      cp.glow = 0.5;
      sfx(780, 0.14);
      setTimeout(() => sfx(990, 0.2), 140);
      E.flash('#fff6c0', 0.35, 400);
      E.rg(cp.x, gy, r * 4, 520, ['#ffffff', '#fff2a0', '#ffd34a']);
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * 6.283;
        E.P({
          x: cp.x,
          y: gy,
          vx: Math.cos(a) * 1.3,
          vy: Math.sin(a) * 1.3 - 0.4,
          ay: 0.03,
          dr: 0.96,
          life: 700,
          cols: ['#ffffff', '#ffe27a', '#ffb02e'],
          s0: 4,
          s1: 1,
          shape: 'sq',
          glow: 1
        });
      }
      await E.wait(900);
    } else {
      sfx(200, 0.18);
      E.flash('#ffffff', 0.6, 300);
      E.rg(cp.x, gy, r * 5, 420, ['#ffffff', '#ffb8a8', '#ff6a5a']);
      E.burst(cp.x, gy, 24, {
        v0: 0.5,
        v1: 2.4,
        l0: 300,
        l1: 600,
        cols: ['#ffffff', '#ff9a8a', '#d83a2a'],
        s0: 3,
        s1: 1,
        glow: 1
      });
      cp.on = 0;
      try {
        anim && anim.cancel();
      } catch (e) {}
      anim = null;
      df.animate(
        [
          { transform: 'scale(.05)', filter: 'brightness(0) invert(1)', opacity: 0.2 },
          { transform: 'scale(1.1)', filter: 'brightness(3)', opacity: 1, offset: 0.6 },
          { transform: 'none', filter: 'none', opacity: 1 }
        ],
        { duration: 520 / sp }
      );
      await E.wait(600);
    }
  } catch (e) {}
  clearTimeout(lim);
  E.end();
}
function koFx(c) {
  if (!S.anim || !document.body.animate) return;
  try {
    const inB = B.f.includes(c),
      el = $('bt').querySelector(inB ? '.fs' : '.ms');
    if (!el) return;
    const dir = inB ? 1 : -1;
    el.animate(
      [
        { transform: 'none', filter: 'none', opacity: 1 },
        {
          transform: `translate(${dir * 4}px,-6px) rotate(${dir * 4}deg)`,
          filter: 'brightness(2)',
          offset: 0.15
        },
        {
          transform: `translate(${dir * 14}px,26px) rotate(${dir * 38}deg) scale(.86)`,
          filter: 'grayscale(1) brightness(.8)',
          opacity: 0.7,
          offset: 0.7
        },
        {
          transform: `translate(${dir * 18}px,44px) rotate(${dir * 52}deg) scale(.6)`,
          filter: 'grayscale(1) brightness(.5)',
          opacity: 0
        }
      ],
      { duration: 880 / (SPD < 500 ? 1.7 : 1), fill: 'forwards', easing: 'ease-in' }
    );
    KOS.add(c);
    const E = b9fx();
    if (E) {
      const p = b9cv(E, el);
      E.burst(p.x, p.y + p.w * 0.2, 16, {
        v0: 0.2,
        v1: 1.2,
        a0: 3.4,
        a1: 6,
        l0: 400,
        l1: 800,
        cols: ['#ffffff', '#cfd8e0', '#8a96a4'],
        s0: 4,
        s1: 2,
        g: 0.02
      });
      E.wait(900).then(() => E.end());
    }
  } catch (e) {}
}
function entryFx(own) {
  if (!S.anim || !document.body.animate) return;
  try {
    const el = $('bt').querySelector(own ? '.ms' : '.fs');
    if (!el) return;
    el.animate(
      [
        { transform: 'scale(.15) translateY(30%)', filter: 'brightness(8) saturate(0)', opacity: 0.1 },
        { transform: 'scale(1.14)', filter: 'brightness(2.2)', opacity: 1, offset: 0.55 },
        { transform: 'none', filter: 'none', opacity: 1 }
      ],
      { duration: 560 / (SPD < 500 ? 1.7 : 1), easing: 'cubic-bezier(.2,.8,.2,1)' }
    );
    const E = b9fx();
    if (E) {
      const p = b9cv(E, el);
      sfx(660, 0.1);
      E.flash('#ffffff', 0.25, 260);
      E.rg(p.x, p.y, p.w * 0.6, 420, ['#ffffff', '#bfe8ff', '#6cc4ff']);
      E.burst(p.x, p.y, 22, {
        v0: 0.5,
        v1: 2.2,
        l0: 300,
        l1: 650,
        cols: ['#ffffff', '#bfe8ff', '#ffe27a'],
        s0: 3,
        s1: 1,
        glow: 1
      });
      E.wait(750).then(() => E.end());
    }
  } catch (e) {}
}
function camPunch(k) {
  if (!S.anim || !document.body.animate) return;
  try {
    const sp = $('sp');
    sp.animate(
      [
        { transform: 'none' },
        { transform: `scale(${1 + 0.06 * k}) rotate(${(Math.random() - 0.5) * 2.4 * k}deg)`, offset: 0.22 },
        { transform: 'none' }
      ],
      { duration: 420 }
    );
  } catch (e) {}
}
async function evoFx(me, ns) {
  const el = $('bt').querySelector('.ms');
  if (!el || !S.anim || !document.body.animate || document.hidden) {
    await sleep(SPD > 500 ? 1400 : 400);
    return;
  }
  const E = b9fx(),
    fast = SPD < 500,
    sp = fast ? 1.7 : 1,
    old = me.s,
    sil = 'brightness(0) invert(1) drop-shadow(0 0 8px #fff)';
  let timer = null;
  try {
    const p = E ? b9cv(E, el) : null;
    let ang = 0,
      pw = 0;
    if (E && p)
      E.o(0, 1e9, () => {
        ang += 0.03;
        E.glow(() => {
          for (let i = 0; i < 10; i++) {
            const a = ang + i * 0.628,
              L = p.w * (0.55 + pw * 0.9) + Math.sin(ang * 4 + i) * 4;
            E.line(
              p.x,
              p.y,
              p.x + Math.cos(a) * L,
              p.y + Math.sin(a) * L,
              1,
              'rgba(255,248,200,' + (0.14 + pw * 0.25) + ')'
            );
          }
        });
      });
    const an0 = el.animate(
      [
        { filter: 'none', transform: 'none' },
        { filter: sil, transform: 'scale(1.05)' }
      ],
      { duration: 420 / sp, fill: 'forwards' }
    );
    await sleep(450 / sp);
    const set = s => {
      el.innerHTML = spr(s, 160, 1);
    };
    let on = false,
      n = 0;
    const steps = [260, 230, 200, 170, 140, 120, 100, 90, 80, 70];
    for (const d of steps) {
      on = !on;
      set(on ? ns : old);
      n++;
      pw = n / steps.length;
      el.style.transform = `scale(${1 + pw * 0.18})`;
      sfx(380 + n * 45, 0.06);
      await sleep(d / sp);
    }
    set(ns);
    el.style.transform = 'scale(1.2)';
    if (E && p) {
      E.flash('#ffffff', 1, 700);
      E.rg(p.x, p.y, p.w * 1.4, 700, ['#ffffff', '#fff2a0', '#ffd34a']);
      E.rg(p.x, p.y, p.w * 1, 600, ['#ffffff', '#bfe8ff'], 120);
      E.burst(p.x, p.y, 60, {
        v0: 0.8,
        v1: 4.2,
        l0: 500,
        l1: 1100,
        cols: ['#ffffff', '#fff2a0', '#ffd34a', '#ffb02e'],
        s0: 5,
        s1: 1,
        glow: 1
      });
    }
    [660, 830, 990, 1320].forEach((f, i) => setTimeout(() => sfx(f, 0.2), i * 110));
    await sleep(260 / sp);
    try {
      an0.cancel();
    } catch (e) {}
    el.animate([{ filter: sil }, { filter: 'brightness(1.6)', offset: 0.4 }, { filter: 'none' }], {
      duration: 650 / sp
    });
    el.style.transition = 'transform .6s';
    el.style.transform = 'none';
    await sleep(750 / sp);
    if (E) E.wait(300).then(() => E.end());
  } catch (e) {
    E && E.end();
  } finally {
    el.style.transform = '';
    el.style.transition = '';
  }
}

// ---------- variété des PNJ, animations de PNJ, héros en combat, choix d'apparence ----------
const NPAL = {
  hair: ['#2a1c12', '#5a3a22', '#8a5a2b', '#c8782a', '#d8b060', '#1c1c1c', '#7a3a2a', '#9a9aa6'],
  shirt: [
    '#e63946',
    '#3a86ff',
    '#4a8a4a',
    '#c0803a',
    '#8a4fd0',
    '#2a9d8f',
    '#d4a017',
    '#ff7aa8',
    '#6b8e9b',
    '#e8e0c8',
    '#7a5aa8',
    '#e8703a'
  ],
  pants: ['#3a3a55', '#555566', '#6a5a3a', '#2b3a67', '#4a3a2a', '#3a5a4a', '#5a2a3a'],
  skin: ['#ffd7a8', '#f4cfa4', '#e8b98a', '#c98f62', '#a8714a', '#8a5a3a'],
  acc: ['#ff9a2a', '#d8302c', '#3a86ff', '#4a8a4a', '#e8c050', '#8a4fd0']
};
function npcLook(n, xx, yy) {
  const mm = n.m != null ? n.m : G.map,
    x = xx != null ? xx : n.x,
    y = yy != null ? yy : n.y,
    key = n.e + '|' + mm + '|' + x + '|' + y,
    C = (npcLook.c = npcLook.c || {});
  if (C[key]) return C[key];
  const b = LOOK(n.e),
    h = hs((mm * 53 + x) | 0, (y * 17 + 7) | 0),
    r = (k, m) => (h >>> k) % m,
    L = Object.assign({}, b);
  if (n.e == '🧙' || n.e == '👑' || n.e == '🦹' || n.e == '🕴') return (C[key] = L);
  const old = n.e == '👵' || n.e == '🧓' || n.e == '👴';
  L.hair = old ? ['#cfcfcf', '#e0e0e0', '#b8b8c4', '#f0f0f0'][r(2, 4)] : NPAL.hair[r(2, 8)];
  if (n.e != '🧑‍🌾' || r(11, 2)) {
    L.shirt = NPAL.shirt[r(5, 12)];
  }
  L.pants = NPAL.pants[r(9, 7)];
  L.skin = NPAL.skin[r(13, 6)];
  if (n.e == '🧑‍🌾' && b.hat) L.hat = ['#d9b45a', '#c8a040', '#e8d080', '#b89040'][r(15, 4)];
  if (n.e == '👦' || n.e == '👨') {
    delete L.long;
    if (r(17, 3) == 0) L.long = 1;
  }
  if (r(19, old ? 2 : 4) == 0) L.glasses = ['#222', '#222', '#b02a2a', '#2a4aa0'][r(21, 4)];
  if (r(23, 5) == 0) L.scarf = NPAL.acc[r(25, 6)];
  if (!old && r(27, 3) == 0) L.back = NPAL.acc[r(29, 6)];
  if ((n.e == '👵' || n.e == '🧑‍🌾' || n.e == '👩' || n.e == '👨') && r(4, 4) == 0) L.apron = '#f4f0e6';
  if ((n.e == '👦' || n.e == '👨') && !L.hat && r(8, 3) == 0) L.hat = NPAL.acc[r(12, 6)];
  return (C[key] = L);
}
const NPC_YS = 1;
function npcAct(n, nx, ny, t, px, py, a, inn) {
  const seed = (n.x * 7 + n.y * 13 + (n.m || 0) * 3) | 0,
    dP = Math.hypot(px - nx, py - ny),
    ca = Math.cos(a),
    sa = Math.sin(a);
  const yawTo = (tx, ty) => {
    const rx = tx - nx,
      ry = ty - ny;
    return Math.atan2(ca * ry - sa * rx, -(ca * rx + sa * ry)) * NPC_YS;
  };
  if (dP < 3.3) return { wave: 1, yaw: Math.sin(t / 900 + seed) * 0.14 };
  let o = null;
  for (const q of NP) {
    if (q !== n && q.m == n.m && q.e && Math.hypot(q.x - n.x, q.y - n.y) < 2.8) {
      o = q;
      break;
    }
  }
  if (o) {
    const ph = Math.sin(t / 760 + seed * 1.9);
    return {
      yaw: yawTo((o.vx != null ? o.vx : o.x) + 0.5, (o.vy != null ? o.vy : o.y) + 0.5) * 0.9,
      pt: Math.max(0, ph) * 0.85,
      jump: ph > 0.96 ? 0.012 : 0
    };
  }
  const bh = Math.abs(seed * 5 + (n.x ^ n.y)) % 6;
  if (bh == 1 && !inn && n.e != '🧙') return { broom: 1, yaw: 0.5 + Math.sin(t / 1400 + seed) * 0.1 };
  if (bh == 2) return { yaw: Math.sin(t / 1700 + seed) * 1.0 };
  if (bh == 3 && (t / 1000 + seed * 1.3) % 11 < 1.6) return { wave: 1, yaw: 0.2 };
  return null;
}
// ---------- héros / dresseur en 3D pendant le combat ----------
const HERO_PRE = {
  hair: ['#3a2a1a', '#222', '#8a5a2b', '#c8782a', '#d8b060', '#7a3a2a', '#9a4ac8', '#2a8a9a'],
  skin: NPAL.skin,
  shirt: ['#f4f1e8', '#e63946', '#3a86ff', '#4a8a4a', '#d4a017', '#8a4fd0', '#2a9d8f', '#ff7aa8', '#222'],
  pants: ['#2b3a67', '#3a3a55', '#555566', '#6a5a3a', '#3a5a4a', '#5a2a3a', '#222'],
  hat: [null, '#e63946', '#3a86ff', '#d4a017', '#4a8a4a', '#222', '#f4f4f4']
};
function heroLook() {
  const l = G.look;
  if (!l) return HERO_LK;
  const o = { hair: l.hair, shirt: l.shirt, pants: l.pants, skin: l.skin };
  if (l.hat) o.hat = l.hat;
  if (l.long) o.long = 1;
  if (l.scarf) o.scarf = l.scarf;
  return o;
}
function lookPick(cb) {
  busy = true;
  const cur = Object.assign(
    {
      hair: HERO_PRE.hair[0],
      skin: HERO_PRE.skin[0],
      shirt: HERO_PRE.shirt[0],
      pants: HERO_PRE.pants[0],
      hat: HERO_PRE.hat[1],
      long: 0
    },
    G.look || {}
  );
  const o = document.createElement('div');
  o.id = 'lkov';
  o.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,20,.78);display:flex;align-items:center;justify-content:center;z-index:99;font-family:inherit';
  const bx = document.createElement('div');
  bx.style.cssText =
    'background:#fff8e8;border:4px solid #3a2a1a;border-radius:12px;padding:12px 14px;width:min(88vw,340px);text-align:center;color:#222';
  const h = document.createElement('div');
  h.textContent = 'Ton apparence';
  h.style.cssText = 'font-weight:bold;margin-bottom:6px';
  const cv = document.createElement('canvas');
  cv.width = cv.height = 160;
  cv.style.cssText =
    'width:150px;height:150px;image-rendering:pixelated;background:linear-gradient(#bfe6ff,#d9f2c6);border:3px solid #3a2a1a;border-radius:10px;display:block;margin:0 auto 8px';
  const g = cv.getContext('2d');
  const rows = [
    ['Cheveux', 'hair'],
    ['Teint', 'skin'],
    ['Haut', 'shirt'],
    ['Pantalon', 'pants'],
    ['Casquette', 'hat'],
    ['Coupe', 'long']
  ];
  const mkRow = ([lab, k]) => {
    const r = document.createElement('div');
    r.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;margin:3px 0;font-size:14px';
    const l = document.createElement('span');
    l.textContent = lab;
    l.style.cssText = 'width:5.4em;text-align:left';
    const sw = document.createElement('span');
    sw.style.cssText =
      'display:inline-block;width:34px;height:20px;border:2px solid #3a2a1a;border-radius:5px;vertical-align:middle';
    const bt = d => {
      const b = document.createElement('button');
      b.textContent = d < 0 ? '◀' : '▶';
      b.style.cssText = 'font-size:18px;padding:4px 14px;min-width:44px;min-height:36px';
      b.onclick = () => {
        if (k == 'long') cur.long = cur.long ? 0 : 1;
        else {
          const a = HERO_PRE[k],
            i = Math.max(0, a.indexOf(cur[k]));
          cur[k] = a[(i + d + a.length) % a.length];
        }
        paint();
      };
      return b;
    };
    const mid = document.createElement('span');
    mid.append(sw);
    const upd = () => {
      if (k == 'long') {
        sw.textContent = cur.long ? 'Longue' : 'Courte';
        sw.style.cssText += ';width:auto;padding:0 6px;font-size:12px;line-height:20px;background:#fff';
      } else {
        sw.style.background = cur[k] || 'repeating-linear-gradient(45deg,#ddd,#ddd 4px,#fff 4px,#fff 8px)';
        sw.textContent = cur[k] ? '' : '∅';
      }
    };
    r.append(l, bt(-1), mid, bt(1));
    r._u = upd;
    return r;
  };
  const rws = rows.map(mkRow);
  const paint = () => rws.forEach(r => r._u());
  paint();
  const ok = document.createElement('button');
  ok.textContent = 'Valider';
  ok.style.cssText = 'display:block;margin:10px auto 0;font-size:18px;padding:8px 28px';
  let alive = true;
  const tick = () => {
    if (!alive) return;
    try {
      const t = performance.now(),
        L = { hair: cur.hair, skin: cur.skin, shirt: cur.shirt, pants: cur.pants };
      if (cur.hat) L.hat = cur.hat;
      if (cur.long) L.long = 1;
      const c = fxHum(L, 'lkp', t, Math.sin(t / 900) * 0.7, { sd: 1 }, 160);
      g.clearRect(0, 0, 160, 160);
      if (c) g.drawImage(c, 0, 0, 160, 160);
    } catch (e) {}
    setTimeout(tick, 70);
  };
  tick();
  ok.onclick = () => {
    alive = false;
    G.look = {
      hair: cur.hair,
      skin: cur.skin,
      shirt: cur.shirt,
      pants: cur.pants,
      hat: cur.hat || null,
      long: cur.long ? 1 : 0
    };
    try {
      save();
    } catch (e) {}
    o.remove();
    busy = false;
    cb && cb();
  };
  bx.append(h, cv, ...rws, ok);
  o.append(bx);
  document.body.append(o);
}
function lookBtn() {
  if (!busy) lookPick(() => {});
}
function heroAct(a) {
  const st = V3.bhS;
  if (!st) return;
  const own = G.party.includes(a),
    k = own ? 'pm' : 'pf';
  st[k] = 1;
  setTimeout(() => {
    st[k] = 0;
  }, 760);
}
function heroBattle(title, fl) {
  return new Promise(rs => {
    const bt = $('bt'),
      fs = bt && bt.querySelector('#sp .fs'),
      ms = bt && bt.querySelector('#sp .ms');
    if (!fs || !ms || B.dbl || !S.anim || !document.body.animate) {
      rs();
      return;
    }
    let fin = false,
      skipped = false;
    const done = () => {
      if (!fin) {
        fin = true;
        rs();
      }
    };
    try {
      const br = bt.getBoundingClientRect(),
        fr = fs.getBoundingClientRect(),
        mr = ms.getBoundingClientRect(),
        S1 = Math.round(Math.min(108, mr.width * 0.8)),
        tr = !!title,
        st = (V3.bhS = { pm: 0, pf: 0 });
      const old = bt.querySelector('#bhc');
      if (old) old.remove();
      const cont = document.createElement('div');
      cont.id = 'bhc';
      cont.style.cssText = 'position:absolute;inset:0;pointer-events:none';
      const mk = (id, x, y) => {
        const c = document.createElement('canvas');
        c.width = c.height = 112;
        c.id = id;
        c.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${S1}px;height:${S1}px;image-rendering:pixelated;background:transparent!important;border:0;opacity:0;filter:drop-shadow(0 3px 2px rgba(0,0,0,.28))`;
        return c;
      };
      const hx = Math.max(0, mr.left - br.left - S1 * 0.1),
        hy = mr.top - br.top - S1 * 0.74,
        fx = Math.min(br.width - S1, fr.left - br.left - S1 * 0.98),
        fy = fr.top - br.top + fr.height * 0.42;
      const hc = mk('bhm', hx, hy),
        tc = tr ? mk('bhf', fx, fy) : null;
      cont.append(hc);
      if (tc) cont.append(tc);
      bt.insertBefore(cont, bt.firstChild);
      const hl = heroLook(),
        hg = hc.getContext('2d'),
        tg = tc && tc.getContext('2d');
      hg.imageSmoothingEnabled = false;
      const draw = () => {
        if (bt.style.display == 'none' || !cont.isConnected) {
          clearInterval(iv);
          cont.remove();
          if (V3.bhS === st) V3.bhS = null;
          return;
        }
        const t = performance.now();
        try {
          const c = fxHum(hl, 'bhm', t, -2.55 + Math.sin(t / 900) * 0.07, { pt: st.pm, sd: 3 }, 112);
          if (c) {
            hg.clearRect(0, 0, 112, 112);
            hg.drawImage(c, 0, 0, 112, 112);
          }
          if (tg) {
            const c2 = fxHum(fl, 'bhf', t, 0.45 + Math.sin(t / 1100) * 0.07, { pt: st.pf, sd: 6 }, 112);
            if (c2) {
              tg.clearRect(0, 0, 112, 112);
              tg.drawImage(c2, 0, 0, 112, 112);
            }
          }
        } catch (e) {}
      };
      const iv = setInterval(draw, 85);
      draw();
      [fs, ms].forEach(e => (e.style.opacity = '0'));
      bt.addEventListener(
        'pointerdown',
        () => {
          skipped = true;
        },
        { once: true }
      );
      const w = ms_ => (skipped ? Promise.resolve() : sleep(ms_));
      const slide = (c, dx) => {
        c.style.opacity = '1';
        try {
          c.animate(
            [
              { transform: `translateX(${dx}px)`, opacity: 0 },
              { transform: 'none', opacity: 1 }
            ],
            { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' }
          );
        } catch (e) {}
      };
      const throwTo = async (from, el, key, own) => {
        const E = b9fx();
        st[key] = 1;
        await w(260);
        if (!E || skipped) {
          st[key] = 0;
          el.style.opacity = '1';
          return;
        }
        try {
          const A = b9cv(E, from),
            Bc = b9cv(E, el),
            r = Math.max(4.5, E.cw / 24),
            Hh = Math.max(10, E.ch * 0.14);
          let cp = { x: A.x, y: A.y, rot: 0 };
          E.o(0, 1e9, () => drawCap(E.g, cp.x, cp.y, r, cp.rot, 0));
          sfx(520, 0.08);
          await new Promise(rs2 => {
            E.o(0, 520, u => {
              cp.x = lerp(A.x + A.w * 0.2, Bc.x, u);
              cp.y = lerp(A.y - A.w * 0.1, Bc.y, u) - Math.sin(u * Math.PI) * Hh;
              cp.rot = u * 9;
              if (u > 0.97) rs2();
            });
            E.wait(560).then(rs2);
          });
          st[key] = 0;
          E.flash('#ffffff', 0.5, 260);
          sfx(700, 0.1);
          E.rg(Bc.x, Bc.y, Bc.w * 0.5, 380, ['#ffffff', '#bfe8ff', '#6cc4ff']);
          E.burst(Bc.x, Bc.y, 22, {
            v0: 0.5,
            v1: 2.4,
            l0: 300,
            l1: 600,
            cols: ['#ffffff', '#bfe8ff', '#ffe27a'],
            s0: 3,
            s1: 1,
            glow: 1
          });
          el.style.opacity = '1';
          try {
            el.animate(
              [
                {
                  transform: 'scale(.15) translateY(30px)',
                  filter: 'brightness(8) saturate(0)',
                  opacity: 0.1
                },
                { transform: 'scale(1.15)', filter: 'brightness(2)', opacity: 1, offset: 0.55 },
                { transform: 'none', filter: 'none', opacity: 1 }
              ],
              { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' }
            );
          } catch (e) {}
          await w(420);
          E.end();
        } catch (e) {
          st[key] = 0;
          el.style.opacity = '1';
          E && E.end();
        }
      };
      (async () => {
        try {
          slide(hc, -90);
          if (tc) slide(tc, 90);
          await w(520);
          if (tc) await throwTo(tc, fs, 'pf');
          else {
            fs.style.opacity = '1';
            try {
              fs.animate(
                [
                  { transform: 'translateX(40px) scale(.6)', opacity: 0 },
                  { transform: 'none', opacity: 1 }
                ],
                { duration: 420, easing: 'ease-out' }
              );
            } catch (e) {}
            await w(380);
          }
          await throwTo(hc, ms, 'pm');
          await w(120);
        } catch (e) {}
        [fs, ms].forEach(e => {
          e.style.opacity = '';
        });
        done();
      })();
      setTimeout(() => {
        [fs, ms].forEach(e => {
          e.style.opacity = '';
        });
        done();
      }, 6000);
    } catch (e) {
      try {
        [fs, ms].forEach(x => (x.style.opacity = ''));
      } catch (e2) {}
      done();
    }
  });
}
