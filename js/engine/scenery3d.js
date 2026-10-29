// Décor 3D (arbres, buissons, rochers), ambiance, arène de combat 3D
// ---------- décor volumétrique : arbres, buissons, rochers (sprites multi-plans + vent) ----------
const rh3 = (a, b) => (hs(a | 0, b | 0) % 1000) / 1000;
const cv3 = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};
function envPal(P, dk) {
  return {
    cr:
      P.cr ||
      (dk
        ? ['#0f3f1e', '#185a2a', '#1f6a33', '#277a3b', '#3f9a4f', '#5cb868']
        : ['#134a22', '#1f6b30', '#2a7d3a', '#34953f', '#52b552', '#74cf6a']),
    pn:
      P.pn ||
      (dk
        ? ['#124a24', '#2c8a45', '#17582b', '#37a057', '#1d6b34', '#47b868']
        : ['#17592a', '#2c8a45', '#1d6b32', '#37a057', '#23803c', '#47b868']),
    bu: P.bu,
    tk: P.tk,
    rk: P.rk,
    fc: P.fc
  };
}
function blob3(o, x, y, r, pal, sd, hi) {
  const g = o.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.08, x, y, r * 1.04);
  g.addColorStop(0, pal[hi]);
  g.addColorStop(0.5, pal[Math.max(0, hi - 2)]);
  g.addColorStop(1, pal[Math.max(0, hi - 4)]);
  o.fillStyle = g;
  o.beginPath();
  o.arc(x, y, r, 0, 7);
  o.fill();
  for (let j = 0; j < 9; j++) {
    const a = rh3(sd, j) * 6.283,
      rr = r * (0.22 + 0.12 * rh3(sd + 3, j));
    o.fillStyle = pal[Math.max(0, hi - 2)];
    o.beginPath();
    o.arc(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9, rr, 0, 7);
    o.fill();
  }
  const n = (r * 2) | 0;
  for (let i = 0; i < n; i++) {
    const a = rh3(sd, i + 20) * 6.283,
      d = Math.sqrt(rh3(sd + 7, i)) * r * 0.9,
      px = x + Math.cos(a) * d,
      py = y + Math.sin(a) * d,
      lit = (px - x) * -0.5 + (py - y) * -0.6 > 0;
    o.fillStyle = pal[lit ? Math.min(5, hi + 1) : Math.max(0, hi - 3)];
    o.fillRect(px | 0, py | 0, 2, 2);
  }
  o.fillStyle = pal[Math.min(5, hi + 1)];
  o.globalAlpha = 0.55;
  o.beginPath();
  o.arc(x - r * 0.35, y - r * 0.4, r * 0.32, 0, 7);
  o.fill();
  o.globalAlpha = 1;
}
function trunk3(T, tk, top, w0, sd, lean) {
  const o = T.getContext('2d'),
    c = hex3(tk),
    cl = `rgb(${Math.min(255, c[0] + 34)},${Math.min(255, c[1] + 26)},${Math.min(255, c[2] + 18)})`,
    cd = `rgb(${(c[0] * 0.55) | 0},${(c[1] * 0.55) | 0},${(c[2] * 0.55) | 0})`;
  o.fillStyle = 'rgba(0,0,0,.27)';
  o.beginPath();
  o.ellipse(48, 123, 34, 6.5, 0, 0, 7);
  o.fill();
  const x0 = 48,
    g = o.createLinearGradient(x0 - w0, 0, x0 + w0, 0);
  g.addColorStop(0, cl);
  g.addColorStop(0.45, tk);
  g.addColorStop(1, cd);
  o.fillStyle = g;
  o.beginPath();
  o.moveTo(x0 - w0 - 5, 125);
  o.quadraticCurveTo(x0 - w0 + 1, 114, x0 - w0 * 0.62 + lean, top);
  o.lineTo(x0 + w0 * 0.62 + lean, top);
  o.quadraticCurveTo(x0 + w0 - 1, 114, x0 + w0 + 5, 125);
  o.closePath();
  o.fill();
  o.strokeStyle = cd;
  o.lineWidth = 1.3;
  for (let i = 0; i < 7; i++) {
    const xx = x0 - w0 * 0.6 + rh3(sd, i) * w0 * 1.2,
      y1 = top + 10 + rh3(sd + 2, i) * 22;
    o.beginPath();
    o.moveTo(xx + lean * 0.5, y1);
    o.lineTo(xx + (rh3(sd + 4, i) - 0.5) * 3, y1 + 14 + rh3(sd + 5, i) * 26);
    o.stroke();
  }
  o.strokeStyle = cl;
  o.globalAlpha = 0.6;
  for (let i = 0; i < 3; i++) {
    const xx = x0 - w0 * 0.55 + i * 2;
    o.beginPath();
    o.moveTo(xx, top + 14);
    o.lineTo(xx - 1, 118);
    o.stroke();
  }
  o.globalAlpha = 1;
}
function mkRound3(P, dk, vr) {
  const pal = envPal(P, dk),
    cr = pal.cr,
    L = [cv3(96, 128), cv3(96, 128), cv3(96, 128)],
    T = cv3(96, 128),
    sd = vr * 131 + 7;
  trunk3(T, P.tk, 72, 6.5, sd, 0);
  {
    const o = T.getContext('2d');
    o.strokeStyle = P.tk;
    o.lineCap = 'round';
    o.lineWidth = 4;
    o.beginPath();
    o.moveTo(48, 86);
    o.lineTo(33, 66);
    o.moveTo(48, 80);
    o.lineTo(64, 60);
    o.stroke();
  }
  const spec = [
    [10, [14, 21], 26, 1],
    [11, [11, 16], 27, 3],
    [9, [8, 13], 24, 5]
  ];
  spec.forEach(([n, [r0, r1], R, hi], li) => {
    const o = L[li].getContext('2d');
    for (let i = 0; i < n; i++) {
      const a = i * 2.399 + li * 1.1 + sd,
        rad = Math.sqrt((i + 0.6) / n) * R,
        x = 48 + Math.cos(a) * rad,
        y = (li == 2 ? 40 : 46) + Math.sin(a) * rad * 0.86 - (li == 2 ? rad * 0.12 : 0),
        r = r0 + rh3(sd + li, i) * (r1 - r0);
      blob3(o, x, y, r, cr, sd * 7 + li * 31 + i, hi);
    }
    if (li == 2) {
      const fr = P.kind == 'mix' && !P.cr && vr == 1 ? ['#e63946', '#ff5a5f'] : P.cr ? [cr[5], cr[4]] : null;
      if (fr && (vr == 1 || P.cr)) {
        for (let i = 0; i < 9; i++) {
          const a = rh3(sd, i + 40) * 6.283,
            d = rh3(sd, i + 50) * 26;
          o.fillStyle = fr[i % 2];
          o.beginPath();
          o.arc(48 + Math.cos(a) * d, 44 + Math.sin(a) * d * 0.8, 2, 0, 7);
          o.fill();
        }
      }
    }
  });
  const F = cv3(96, 128),
    fo = F.getContext('2d');
  [T, ...L].forEach(c => fo.drawImage(c, 0, 0));
  return { L: [L[0], T, L[1], L[2]], full: F, h: 2.15, kind: 'round' };
}
function mkPine3(P, dk, vr, snow) {
  const pal = envPal(P, dk).pn,
    T = cv3(96, 128);
  trunk3(T, P.tk, 96, 4.4, vr * 17 + 3, 0);
  const tiers = [
      [108, 40, 44],
      [82, 33, 38],
      [58, 25, 36]
    ],
    Ls = tiers.map(() => cv3(96, 128));
  tiers.forEach(([by, w, hh], i) => {
    const o = Ls[i].getContext('2d'),
      dkc = pal[i * 2],
      lt = pal[i * 2 + 1],
      ap = by - hh;
    const g = o.createLinearGradient(48 - w, 0, 48 + w, 0);
    g.addColorStop(0, lt);
    g.addColorStop(0.55, dkc);
    g.addColorStop(1, pal[Math.max(0, i * 2 - 1)] || dkc);
    o.fillStyle = g;
    o.beginPath();
    o.moveTo(48, ap - (i == 2 ? 10 : 0));
    const m = 7;
    for (let j = 0; j <= m; j++) {
      const x = 48 - w + (2 * w * j) / m,
        sag = j % 2 ? 7 : 0;
      o.lineTo(x, by + sag + rh3(vr + i, j) * 3);
    }
    o.lineTo(48 + w, by + 2);
    o.closePath();
    o.fill();
    o.strokeStyle = lt;
    o.globalAlpha = 0.65;
    o.lineWidth = 1.4;
    for (let j = 0; j < 9; j++) {
      const y1 = ap + 6 + j * (hh / 9),
        ww = ((y1 - ap) / hh) * w;
      o.beginPath();
      o.moveTo(48 - ww * 0.95, y1 + 4);
      o.quadraticCurveTo(48 - ww * 0.5, y1 - 1, 48 - ww * 0.1, y1 + (j % 2 ? 2 : 0));
      o.stroke();
    }
    o.strokeStyle = dkc;
    o.globalAlpha = 0.7;
    for (let j = 0; j < 8; j++) {
      const y1 = ap + 10 + j * (hh / 9),
        ww = ((y1 - ap) / hh) * w;
      o.beginPath();
      o.moveTo(48 + ww * 0.95, y1 + 5);
      o.quadraticCurveTo(48 + ww * 0.5, y1, 48 + ww * 0.1, y1 + (j % 2 ? 2 : 0));
      o.stroke();
    }
    o.globalAlpha = 1;
    if (snow) {
      o.fillStyle = '#f4f8ff';
      for (let j = 0; j < 7; j++) {
        const y1 = ap + 4 + j * (hh / 7),
          ww = ((y1 - ap) / hh) * w;
        o.globalAlpha = 0.9 - j * 0.06;
        o.beginPath();
        o.ellipse(48 - ww * 0.35 + (j % 2) * ww * 0.3, y1 + 2, ww * 0.34, 3, 0, 0, 7);
        o.fill();
        o.beginPath();
        o.ellipse(48 + ww * 0.4 - (j % 2) * ww * 0.2, y1 + 4, ww * 0.26, 2.5, 0, 0, 7);
        o.fill();
      }
      o.globalAlpha = 1;
    }
  });
  const F = cv3(96, 128),
    fo = F.getContext('2d');
  fo.drawImage(T, 0, 0);
  Ls.forEach(c => fo.drawImage(c, 0, 0));
  return { L: [T, ...Ls], full: F, h: 2.35, kind: 'pine' };
}
function mkPalm3(P, vr) {
  const T = cv3(96, 128),
    o = T.getContext('2d'),
    tk = hex3(P.tk),
    lean = (vr ? 1 : -1) * 14,
    tx = 48 + lean;
  o.fillStyle = 'rgba(0,0,0,.25)';
  o.beginPath();
  o.ellipse(48, 123, 30, 6, 0, 0, 7);
  o.fill();
  for (let i = 0; i < 16; i++) {
    const k = i / 15,
      x = 48 + lean * k * k,
      y = 124 - k * 86,
      w = 6 - 3 * k;
    o.fillStyle = `rgb(${tk[0] + (i % 2 ? 22 : 0) + 10},${tk[1] + (i % 2 ? 16 : 0) + 6},${tk[2] + (i % 2 ? 8 : 0)})`;
    o.fillRect(x - w, y - 3, w * 2, 6);
    o.fillStyle = 'rgba(0,0,0,.25)';
    o.fillRect(x + w * 0.3, y - 3, w * 0.7, 6);
  }
  const mkF = (from, to) => {
    const c = cv3(96, 128),
      f = c.getContext('2d');
    f.lineCap = 'round';
    for (let i = from; i < to; i++) {
      const a = (i / 8) * 6.283 + vr,
        dx = Math.cos(a),
        side = dx,
        len = 34 + rh3(vr, i) * 8,
        ex = tx + dx * len,
        ey = 38 + Math.abs(Math.sin(a)) * 6 + (1 - Math.abs(dx)) * 18;
      f.strokeStyle = '#2a8a3e';
      f.lineWidth = 5;
      f.beginPath();
      f.moveTo(tx, 36);
      f.quadraticCurveTo(tx + dx * len * 0.6, 22 + rh3(vr, i + 9) * 6, ex, ey + 10);
      f.stroke();
      f.strokeStyle = P.pf || '#3fb255';
      f.lineWidth = 2.6;
      f.beginPath();
      f.moveTo(tx, 36);
      f.quadraticCurveTo(tx + dx * len * 0.6, 21 + rh3(vr, i + 9) * 6, ex, ey + 9);
      f.stroke();
      f.strokeStyle = '#1d6a30';
      f.lineWidth = 1;
      for (let j = 1; j < 7; j++) {
        const q = j / 7,
          qx = tx + (ex - tx) * q,
          qy = 36 + (ey + 10 - 36) * q - Math.sin(q * 3.14) * 14;
        f.beginPath();
        f.moveTo(qx, qy);
        f.lineTo(qx + (side > 0 ? 1 : -1) * 4, qy + 7);
        f.stroke();
      }
    }
    f.fillStyle = '#5a3a1c';
    f.beginPath();
    f.arc(tx - 2, 40, 3.2, 0, 7);
    f.arc(tx + 3, 41, 3.2, 0, 7);
    f.fill();
    return c;
  };
  const A = mkF(0, 4),
    B = mkF(4, 8),
    F = cv3(96, 128),
    fo = F.getContext('2d');
  fo.drawImage(T, 0, 0);
  fo.drawImage(A, 0, 0);
  fo.drawImage(B, 0, 0);
  return { L: [A, T, B], full: F, h: 2.1, kind: 'palm' };
}
function mkDead3(P, vr) {
  const T = cv3(96, 128),
    o = T.getContext('2d'),
    tk = P.tk;
  o.fillStyle = 'rgba(0,0,0,.25)';
  o.beginPath();
  o.ellipse(48, 123, 28, 5.5, 0, 0, 7);
  o.fill();
  o.lineCap = 'round';
  const br = (x, y, a, l, w, d, s) => {
    const x2 = x + Math.cos(a) * l,
      y2 = y + Math.sin(a) * l;
    o.strokeStyle = tk;
    o.lineWidth = w;
    o.beginPath();
    o.moveTo(x, y);
    o.lineTo(x2, y2);
    o.stroke();
    o.strokeStyle = 'rgba(255,255,255,.14)';
    o.lineWidth = Math.max(1, w * 0.3);
    o.beginPath();
    o.moveTo(x - w * 0.2, y);
    o.lineTo(x2 - w * 0.2, y2);
    o.stroke();
    if (d > 0) {
      br(x2, y2, a - 0.5 - rh3(s, d) * 0.5, l * 0.72, w * 0.7, d - 1, s + 3);
      br(x2, y2, a + 0.45 + rh3(s, d + 4) * 0.5, l * 0.68, w * 0.65, d - 1, s + 5);
      if (d > 2) br(x2, y2, a + (rh3(s, d + 9) - 0.5) * 0.4, l * 0.6, w * 0.6, d - 2, s + 7);
    }
  };
  br(48, 124, -Math.PI / 2 + (vr ? 0.1 : -0.1), 32, 9, 4, vr * 13 + 5);
  const F = T;
  return { L: [], full: F, h: 2.0, kind: 'dead', T };
}
function mkBush3(P, dk, vr, berry) {
  const bu = P.bu,
    C = cv3(64, 48),
    o = C.getContext('2d');
  o.fillStyle = 'rgba(0,0,0,.26)';
  o.beginPath();
  o.ellipse(32, 44, 26, 4.5, 0, 0, 7);
  o.fill();
  const pts = [
    [32, 26, 15],
    [18, 32, 11],
    [46, 32, 11],
    [25, 20, 11],
    [40, 21, 11],
    [32, 34, 12]
  ];
  pts.forEach((q, i) => blob3(o, q[0] + (rh3(vr, i) - 0.5) * 3, q[1], q[2], bu, vr * 50 + i, i > 3 ? 3 : 4));
  if (berry) {
    for (let i = 0; i < 10; i++) {
      o.fillStyle = i % 3 ? '#e63946' : '#ff7a85';
      const a = rh3(vr, i + 60) * 6.283,
        d = rh3(vr, i + 70) * 17;
      o.beginPath();
      o.arc(32 + Math.cos(a) * d, 27 + Math.sin(a) * d * 0.6, 1.8, 0, 7);
      o.fill();
    }
  }
  return { L: [C], full: C, h: 0.62, kind: 'bush' };
}
function mkRock3(P, vr) {
  const rk = P.rk.map(hex3),
    C = cv3(64, 48),
    o = C.getContext('2d'),
    css = c => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
  o.fillStyle = 'rgba(0,0,0,.28)';
  o.beginPath();
  o.ellipse(32, 44, 25, 4.5, 0, 0, 7);
  o.fill();
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * 6.283 + 0.3,
      r = 1 + (rh3(vr, i) - 0.5) * 0.35;
    pts.push([32 + Math.cos(a) * 23 * r, 27 + Math.sin(a) * 15 * r]);
  }
  o.fillStyle = css(rk[1]);
  o.beginPath();
  pts.forEach((p, i) => (i ? o.lineTo(p[0], p[1]) : o.moveTo(p[0], p[1])));
  o.closePath();
  o.fill();
  o.fillStyle = css(rk[2]);
  o.beginPath();
  o.moveTo(pts[6][0], pts[6][1]);
  [7, 8, 9, 0].forEach(i => o.lineTo(pts[i][0], pts[i][1]));
  o.lineTo(34, 24);
  o.lineTo(28, 28);
  o.closePath();
  o.fill();
  o.fillStyle = css(rk[0]);
  o.beginPath();
  o.moveTo(pts[2][0], pts[2][1]);
  [3, 4, 5].forEach(i => o.lineTo(pts[i][0], pts[i][1]));
  o.lineTo(34, 33);
  o.lineTo(40, 26);
  o.closePath();
  o.fill();
  o.strokeStyle = css(rk[0]);
  o.lineWidth = 1.2;
  o.beginPath();
  o.moveTo(32, 16);
  o.lineTo(30, 25);
  o.lineTo(35, 32);
  o.stroke();
  o.fillStyle = 'rgba(90,150,60,.75)';
  for (let i = 0; i < 5; i++) {
    o.fillRect(20 + rh3(vr, i + 30) * 22, 14 + rh3(vr, i + 35) * 5, 3 + rh3(vr, i) * 3, 2);
  }
  for (let i = 0; i < 24; i++) {
    o.fillStyle = rh3(vr, i + 80) > 0.5 ? css(rk[2]) : css(rk[0]);
    o.fillRect(14 + rh3(vr, i + 90) * 36, 16 + rh3(vr, i + 95) * 20, 2, 1);
  }
  return { L: [C], full: C, h: 0.6, kind: 'rock' };
}
V3.env = V3.env || {};
function envFor(th, type, dk, vr) {
  const key = th + type + dk + vr,
    c = V3.env[key];
  if (c) return c;
  const P = TH[th] || TH0;
  let e;
  try {
    e =
      type == 'round'
        ? mkRound3(P, dk, vr)
        : type == 'pine'
          ? mkPine3(P, dk, vr, P === TH.snow)
          : type == 'palm'
            ? mkPalm3(P, vr)
            : type == 'dead'
              ? mkDead3(P, vr)
              : type == 'berry'
                ? mkBush3(P, dk, vr, 1)
                : type == 'bush'
                  ? mkBush3(P, dk, vr, 0)
                  : mkRock3(P, vr);
  } catch (er) {
    e = { L: [], full: cv3(8, 8), h: 1, kind: type };
  }
  return (V3.env[key] = e);
}
function treeType(P, r) {
  const k = P.kind;
  return k == 'palm' || (k == 'palmix' && r % 3)
    ? 'palm'
    : k == 'dead'
      ? 'dead'
      : k == 'pine' || (k != 'round' && k != 'palmix' && r % 4 == 0)
        ? 'pine'
        : 'round';
}
function envSprites(L, m, g, px, py, t, a) {
  if (m.in) return;
  const th = m.th || 'plain',
    P = TH[th] || TH0,
    sx0 = Math.floor(px),
    sy0 = Math.floor(py),
    x1 = Math.max(0, sx0 - 17),
    x2 = Math.min(g[0].length - 1, sx0 + 17),
    y1 = Math.max(0, sy0 - 17),
    y2 = Math.min(g.length - 1, sy0 + 17),
    ca = Math.cos(a),
    sa = Math.sin(a),
    wxs = wx(),
    ws = wxs == 'pluie' ? 1.7 : 1;
  for (let yy = y1; yy <= y2; yy++)
    for (let xx = x1; xx <= x2; xx++) {
      const c = g[yy][xx];
      if (c != 'T' && c != '#' && c != 'b' && c != 'F' && c != 'q' && c != 'u' && c != 'r') continue;
      const cxm = xx + 0.5,
        cym = yy + 0.5,
        dx = cxm - px,
        dy = cym - py,
        d = Math.hypot(dx, dy),
        fw = dx * ca + dy * sa;
      if (fw < -1.2 || d > 17) continue;
      const r = hs(xx, yy),
        vr = (r >> 3) & 1,
        ph = (r % 628) / 100;
      let type,
        dk = c == '#' ? 1 : 0;
      if (c == 'T' || c == '#') type = treeType(P, r);
      else if (c == 'b') type = 'bush';
      else if (c == 'F') type = 'berry';
      else type = 'rock';
      const e = envFor(th, type, dk, vr),
        wind = (Math.sin(t / 900 + ph + xx * 0.3) + 0.55 * Math.sin(t / 410 + ph * 1.7) + 0.5) * ws * 0.65;
      if (type == 'rock') {
        L.push({ x: cxm, y: cym, c: e.full, h: e.h, lift: 0 });
        continue;
      }
      const sc =
        type == 'round' || type == 'pine' || type == 'palm' || type == 'dead'
          ? 0.92 + 0.16 * rh3(xx, yy + 9)
          : 1;
      if (d > 8.5 || !e.L.length) {
        L.push({
          x: cxm,
          y: cym,
          c: e.full,
          h: e.h * sc,
          lift: 0,
          sk: (e.kind == 'bush' ? 0.03 : 0.045) * wind * 0.7
        });
        continue;
      }
      const n = e.L.length;
      e.L.forEach((cvv, li) => {
        const front = li / (n - 1 || 1) - 0.5,
          off = front * 0.38,
          top = li / (n - 1 || 1),
          isTrunk =
            (e.kind == 'round' && li == 1) || (e.kind == 'pine' && li == 0) || (e.kind == 'palm' && li == 1);
        L.push({
          x: cxm - ca * off,
          y: cym - sa * off,
          c: cvv,
          h: e.h * sc,
          lift: 0,
          sk: isTrunk
            ? 0
            : (e.kind == 'bush' ? 0.03 : 0.02 + 0.035 * (e.kind == 'pine' ? li / n : top)) * wind
        });
      });
    }
}

const bubC = q =>
  spC('bb' + q, 16, 18, () => {
    cx.fillStyle = '#fff';
    cx.beginPath();
    cx.arc(8, 8, 7, 0, 7);
    cx.fill();
    cx.fillStyle = q == '?' ? '#2a6fe0' : '#e63946';
    cx.font = "bold 11px 'Press Start 2P',monospace";
    cx.textAlign = 'center';
    cx.fillText(q == '!!' ? '!' : q, 8, 12);
  });
// ajoute un humain 3D (repli sur le sprite 2D si trop loin / pas encore prêt)
function addHum(L, e, key, t, px, py, x, y, q, A, fb) {
  A = A || {};
  {
    const cb = V3.cs && V3.cs.boss;
    if (cb && V3.cs.s != null && Math.abs(x - cb.x) < 0.05 && Math.abs(y - cb.y) < 0.05)
      A = Object.assign({}, A, cb.A(t - V3.cs.s));
  }
  const d = Math.hypot(x - px, y - py);
  let mc = null;
  if (d < 11 && typeof mdHuman == 'function') {
    try {
      const yw = A.yaw != null ? A.yaw : Math.sin(t / 1700 + x * 3.1) * 0.28;
      mc = humFor(
        typeof e == 'object' ? e : LOOK(e),
        key,
        t,
        yw,
        Object.assign({ slow: !A.w && !A.wave && !A.jump && !A.broom && !A.pt, sd: x * 7 + y }, A),
        d < 6 ? 104 : 80
      );
    } catch (er) {
      mc = null;
    }
  }
  if (mc) {
    const h2 = 1.28;
    L.push({ x, y, c: mc, h: h2, lift: (A.lift || 0) - (0.08 / 1.5) * h2, sh: 1, nz: 1 });
    if (q) L.push({ x, y, c: bubC(q), h: 0.32, lift: 1.05 + (A.lift || 0), nz: 1 });
  } else L.push(fb);
}

const chimC = () =>
  spC('chim', 16, 28, () => {
    for (let y = 0; y < 28; y++)
      for (let x = 0; x < 16; x++) {
        if (y < 3 && x >= 0 && x < 16) {
          cx.fillStyle = y == 0 ? '#8a8076' : '#6e655c';
          cx.fillRect(x, y, 1, 1);
          continue;
        }
        if (x < 2 || x > 13) continue;
        const br = ((y >> 2) % 2 ? x + 2 : x) % 6 == 0 || y % 4 == 0;
        cx.fillStyle = br ? '#7a3a2c' : x < 5 ? '#b8654e' : '#a5543f';
        cx.fillRect(x, y, 1, 1);
      }
  });
const smkC = () =>
  spC('smk', 24, 24, () => {
    const g = cx.createRadialGradient(12, 12, 1, 12, 12, 11);
    g.addColorStop(0, 'rgba(235,235,240,.9)');
    g.addColorStop(0.6, 'rgba(220,222,230,.45)');
    g.addColorStop(1, 'rgba(220,222,230,0)');
    cx.fillStyle = g;
    cx.fillRect(0, 0, 24, 24);
  });
function chimneys(L, g, px, py, t) {
  for (const B of houseBlocks(g)) {
    if (!B.chim) continue;
    const d = Math.hypot(B.chim[0] - px, B.chim[1] - py);
    if (d > 13) continue;
    const h0 = hs(B.x0, B.y0);
    for (let i = 0; i < 4; i++) {
      const ph = (t / 3800 + i / 4 + (h0 % 7) / 7) % 1,
        al = Math.sin(ph * Math.PI) * 0.7;
      L.push({
        x: B.chim[0] + ph * 0.55,
        y: B.chim[1] + ph * 0.2,
        c: smkC(),
        h: 0.22 + ph * 0.55,
        lift: B.chim[2] + 0.05 + ph * 1.1,
        al,
        nz: 1,
        sh: 0,
        sk: 0
      });
    }
  }
}

const glowC = (k, col) =>
  spC('gl' + k, 32, 32, () => {
    const g = cx.createRadialGradient(16, 16, 1, 16, 16, 15);
    g.addColorStop(0, `rgba(${col},.95)`);
    g.addColorStop(0.35, `rgba(${col},.4)`);
    g.addColorStop(1, `rgba(${col},0)`);
    cx.fillStyle = g;
    cx.fillRect(0, 0, 32, 32);
  });
const leafC = k =>
  spC('lf' + k, 12, 12, () => {
    const cs = ['#7ec850', '#c8d64a', '#e8a23a', '#9ad06a'];
    cx.fillStyle = cs[k % 4];
    cx.beginPath();
    cx.ellipse(6, 6, 5, 2.6, 0.6, 0, 7);
    cx.fill();
    cx.fillStyle = 'rgba(0,0,0,.25)';
    cx.fillRect(3, 6, 6, 1);
  });
function ambient3(L, g, px, py, t, nn) {
  const q = V3.fx == null ? 2 : V3.fx;
  if (!q) return;
  const night = nn > 0.25,
    wxs = wx();
  for (const B of houseBlocks(g)) {
    if (!B.lamp || nn < 0.2) continue;
    const d = Math.hypot(B.lamp[0] - px, B.lamp[1] - py);
    if (d > 12) continue;
    L.push({
      x: B.lamp[0],
      y: B.lamp[1],
      c: glowC('y', '255,214,120'),
      h: 0.7,
      lift: B.lamp[2] - 0.28,
      al: Math.min(1, nn * 1.6) * (0.85 + 0.15 * Math.sin(t / 300 + B.x0)),
      nz: 0,
      sh: 0
    });
  }
  if (night && wxs != 'pluie') {
    const n = q > 1 ? 14 : 6;
    for (let i = 0; i < n; i++) {
      const a = i * 2.399 + (t / 9000) * (1 + (i % 3) * 0.2),
        r = 1.8 + ((i * 5) % 7) * 0.7 + Math.sin(t / 1700 + i) * 0.6,
        x = px + Math.cos(a) * r,
        y = py + Math.sin(a) * r,
        c = g[Math.floor(y)] && g[Math.floor(y)][Math.floor(x)];
      if (c === undefined || SOLID.includes(c)) continue;
      L.push({
        x,
        y,
        c: glowC('f', '200,255,120'),
        h: 0.1,
        lift: 0.12 + 0.55 * (0.5 + 0.5 * Math.sin(t / 1300 + i * 1.7)),
        al: 0.35 + 0.65 * Math.max(0, Math.sin(t / 420 + i * 2.3)),
        nz: 0,
        sh: 0
      });
    }
  } else if (!night && q > 0 && wxs != 'pluie' && wxs != 'brume') {
    const n = q > 1 ? 12 : 5,
      ws = 1;
    for (let i = 0; i < n; i++) {
      const ph = ((t / 1000) * (0.06 + (i % 4) * 0.012) + i * 0.137) % 1,
        x = px + ((i * 3.71 + (t / 1000) * 0.55 * (1 + (i % 3) * 0.2)) % 14) - 7,
        y = py + ((i * 5.13 + Math.sin(t / 2300 + i) * 1.4) % 12) - 6,
        c = g[Math.floor(y)] && g[Math.floor(y)][Math.floor(x)];
      if (c === undefined) continue;
      L.push({
        x,
        y,
        c: leafC(i),
        h: 0.045,
        lift: 2.2 - ph * 2.1 + Math.sin(t / 500 + i) * 0.05,
        al: Math.sin(ph * Math.PI) * 0.9,
        nz: 0,
        sh: 0,
        sk: Math.sin(t / 400 + i) * 0.5
      });
    }
  }
}
function v3Sprites(m, g, px, py, t, aa) {
  const L = [],
    G0 = G.map;
  if (!V3.noEnv) envSprites(L, m, g, px, py, t, aa == null ? V3.a : aa);
  const ad = (x, y, c, h, lift) => L.push({ x, y, c, h, lift: lift || 0, sh: h > 1.1 ? 1 : 0 });
  NP.forEach(n => {
    if (n.m != G0 || !n.e) return;
    const q = n.q != null && G.q['h' + n.q] != 2 ? (G.q['h' + n.q] == 1 ? '?' : '!') : '',
      nx = (n.vx ?? n.x) + 0.5,
      ny = (n.vy ?? n.y) + 0.5,
      mv = n.vx != null && (Math.abs(n.vx - n.x) > 0.02 || Math.abs(n.vy - n.y) > 0.02);
    addHum(
      L,
      npcLook(n),
      'n' + n.e + n.m + '_' + n.x + '_' + n.y,
      t,
      px,
      py,
      nx,
      ny,
      q,
      Object.assign(
        { w: mv ? 1 : 0, ph: t / 110, sd: n.x },
        mv ? {} : npcAct(n, nx, ny, t, px, py, aa == null ? V3.a : aa, !!m.in) || {}
      ),
      { x: nx, y: ny, c: persC(n.e, q), h: 1.15, lift: 0, sh: 1 }
    );
  });
  if (V3.cs)
    try {
      csSprites(L, px, py, t);
    } catch (e) {}
  ITM.forEach(i => {
    if (i.m == G0 && !G.q['i' + i.id]) ad(i.x + 0.5, i.y + 0.5, ballC(), 0.35);
  });
  const sx0 = Math.floor(px),
    sy0 = Math.floor(py),
    x1 = Math.max(0, sx0 - 16),
    x2 = Math.min(g[0].length - 1, sx0 + 16),
    y1 = Math.max(0, sy0 - 16),
    y2 = Math.min(g.length - 1, sy0 + 16),
    inn = !!m.in;
  if (V3.act && !inn) {
    try {
      actorSpr(L, m, g, px, py, t, aa == null ? V3.a : aa);
    } catch (e) {}
  }
  if (V3.bang && V3.bang.s == null) V3.bang.s = t;
  const bg = V3.bang && V3.bang.s != null && t - V3.bang.s < 1700;
  if (!inn) {
    try {
      chimneys(L, g, px, py, t);
      ambient3(L, g, px, py, t, V3.nn || 0);
    } catch (e) {}
  }
  for (let yy = y1; yy <= y2; yy++)
    for (let xx = x1; xx <= x2; xx++) {
      const c = g[yy][xx];
      if (
        (c == 'R' && !G.tr[G0 + '_' + yy]) ||
        (c == 'V' && !G.f.b) ||
        (c == 'W' && !G.f.e) ||
        (c == 'Y' && !(G0 == SOLM ? G.f.s3 : G0 == ORIM ? G.f.o4 : G.f.x))
      )
        addHum(
          L,
          c == 'R' ? npcLook({ e: '🧑', m: G0, x: xx, y: yy }) : { V: '🦹', W: '🕴', Y: '👑', R: '🧑' }[c],
          't' + c + (c == 'R' ? G0 + '_' + xx + '_' + yy : ''),
          t,
          px,
          py,
          xx + 0.5,
          yy + 0.5,
          bg && Math.hypot(xx + 0.5 - px, yy + 0.5 - py) < 3.4 ? '!!' : '',
          bg && Math.hypot(xx + 0.5 - px, yy + 0.5 - py) < 3.4
            ? {
                pt: 1,
                jump:
                  Math.max(0, Math.sin(((t - V3.bang.s) / 180) * Math.PI)) * (t - V3.bang.s < 180 ? 0.07 : 0)
              }
            : {},
          { x: xx + 0.5, y: yy + 0.5, c: trainC(c), h: 1.15, lift: 0, sh: 1 }
        );
      else if (c == 'M') ad(xx + 0.5, yy + 0.5, stallC(), 1);
      else if (c == 'O') ad(xx + 0.5, yy + 0.5, caveC(), 1);
      else if ((c == 'U' || c == 'D') && !inn)
        ad(xx + 0.5, yy + 0.5, arrC(c == 'U'), 0.7, 0.18 + Math.sin(t / 260) * 0.03);
      else if (c == 'N' && inn && m.k != 'cave') {
        const ee =
          { home: '👩', center: '👩‍⚕️', lab: '👴', gym: '🧔', palace: '👑', secret: '🧙' }[m.k] || '🧑';
        addHum(
          L,
          ee,
          'i' + ee,
          t,
          px,
          py,
          xx + 0.5,
          yy + 0.5,
          '',
          {},
          { x: xx + 0.5, y: yy + 0.5, c: persC(ee, ''), h: 1.15, lift: 0, sh: 1 }
        );
      }
    }
  if (inn && m.k == 'lab' && (!G.f.s || (V3.cs && V3.cs.lab)))
    [
      [0, 6.5, 3.5, 0.46],
      [2, 8.5, 3.5, 0.46],
      [1, 5.3, 3.75, 0]
    ].forEach(([sp, x, y, lf], i) => {
      try {
        let h2 = 0.68;
        {
          const lb = V3.cs && V3.cs.lab;
          if (lb) {
            if (sp == lb.mine) return;
            if (sp == lb.noa) {
              const r = lb.f(t - V3.cs.s);
              if (!r) return;
              x = r.x;
              y = r.y;
              lf += r.lf;
              h2 *= r.sc;
            }
          }
        }
        mc = mdFor(sp, 'l' + sp, t, Math.sin(t / 1500 + i * 2.1) * 0.45, 0.1, { R: 80 });
        if (mc)
          L.push({
            x,
            y,
            c: mc,
            h: h2,
            lift: lf - (0.08 / 1.5) * h2 + Math.abs(Math.sin(t / (520 + i * 70))) * 0.012,
            sh: 1,
            nz: 1
          });
      } catch (e) {}
    });
  if (V3.enc) {
    const e = V3.enc,
      k = Math.min(1, (t - e.t0) / 900),
      ease = 1 - Math.pow(1 - k, 3),
      dd = 4.4 - 2.7 * ease,
      ca = Math.cos(V3.a),
      sa = Math.sin(V3.a),
      b = Math.abs(Math.sin(t / 110)) * 0.12 * (1 - k * 0.4);
    const o = in3Creat(e.c.s),
      mq = MD[e.c.s] ? mdFor(e.c.s, 'e', t, Math.sin(t / 700) * 0.35, 0.1, { R: 96 }) : null;
    if (mq) {
      const h2 = (0.95 + 0.2 * ease) * 1.0;
      L.push({ x: px + ca * dd, y: py + sa * dd, c: mq, h: h2, lift: b - (0.08 / 1.5) * h2, sh: 1, nz: 1 });
    } else if (o.im)
      pushStack(
        L,
        o.im,
        px + ca * dd,
        py + sa * dd,
        (0.95 + 0.2 * ease) * 0.9,
        Math.sin(t / 700) * 0.35,
        1,
        b,
        0,
        Math.atan2(-ca, -sa)
      );
    else L.push({ x: px + ca * dd, y: py + sa * dd, c: creatC(e.c.s), h: 0.95 + 0.2 * ease, lift: b, nz: 1 });
    if (k > 0.12)
      L.push({
        x: px + ca * (dd - 0.05),
        y: py + sa * (dd - 0.05),
        c: persC('❗', '!!'),
        h: 0.5,
        lift: 0.95 + b + (mq ? 0.22 : 0),
        nz: 1
      });
  }
  return L;
}
function v3Particles(t, dtm, m) {
  if (m.in || !S.fxv || !Q.fx) return;
  const th = m.th || 'plain',
    K = {
      snow: ['#fff', 1],
      autumn: ['#e8792a', 1],
      meadow: ['#ffc4dc', 1],
      dawn: ['#ffc4dc', 1],
      volcano: ['#ff9a3a', -1],
      swamp: ['#d8ff7a', 0],
      star: ['#fff6b0', 0]
    }[th];
  if (!K) return;
  if (V3.pt.length < (Q.fx == 2 ? 70 : 34) && Math.random() < 0.35)
    V3.pt.push({
      x: Math.random() * 480,
      y: K[1] < 0 ? VHH + 4 : -4,
      vx: (Math.random() - 0.5) * 30,
      vy: K[1] == 0 ? (Math.random() - 0.5) * 20 : K[1] * (35 + Math.random() * 40),
      c: K[0],
      l: 0,
      s: 1 + Math.random() * 2.2
    });
  for (let i = V3.pt.length - 1; i >= 0; i--) {
    const p = V3.pt[i];
    p.l += dtm;
    p.x += ((p.vx + Math.sin(p.l / 380 + i) * 18) * dtm) / 1000;
    p.y += (p.vy * dtm) / 1000;
    if (p.y > VHH + 10 || p.y < -10 || p.l > 9000) {
      V3.pt.splice(i, 1);
      continue;
    }
    cx.fillStyle = p.c;
    cx.globalAlpha = K[1] == 0 ? 0.5 + 0.5 * Math.sin(p.l / 260 + i) : 0.85;
    cx.fillRect(p.x, p.y, p.s, p.s);
  }
  cx.globalAlpha = 1;
}
function render3(t, dtm) {
  {
    const R = S.r3 | 0;
    if (R) {
      const d = [0, [160, 128], [240, 192], [320, 256]][R];
      if (V3.W != d[0]) {
        V3.W = d[0];
        V3.H = d[1];
        V3.n = 0;
      }
    } else if (V3.r3p) {
      V3.W = 240;
      V3.H = 192;
      V3.n = 0;
    }
    V3.r3p = R;
    V3.fx = S.fx3 ? S.fx3 - 1 : Math.min(2, Q.fx | 0);
  }
  const t0 = performance.now(),
    m = maps[G.map],
    g = m.g,
    inn = !!m.in,
    W = V3.W || 240,
    H = V3.H || 192,
    b = r3buf('m', W, H),
    na = !inn && S.night ? nightA() : 0,
    nn = Math.min(1, na / 0.32);
  const key = inn ? 'in_' + m.k : m.th || 'plain',
    TX = V3.tex[key] || (V3.tex[key] = inn ? texIn(m.k) : texOut(m.th || 'plain'));
  let px = rx + 0.5,
    py = ry + 0.74,
    aV = V3.a,
    eyeO = null,
    hzO = null;
  {
    const cs = csStep(t);
    if (cs) {
      if (cs.x != null) {
        px = cs.x;
        py = cs.y;
      }
      if (cs.a != null) aV = cs.a;
      if (cs.eye != null) eyeO = cs.eye;
      if (cs.hz != null) hzO = cs.hz;
    }
    if (V3.cs && V3.cs.tick && V3.cs.s != null)
      try {
        V3.cs.tick(t - V3.cs.s);
      } catch (e) {}
  }
  V3.bp = (V3.bp || 0) + (mvg ? dtm * 0.0115 : 0);
  V3.ba = (V3.ba || 0) + ((mvg ? 1 : 0) - (V3.ba || 0)) * Math.min(1, dtm * 0.012);
  const eyeH = 0.5 + Math.abs(Math.sin(V3.bp)) * 0.022 * V3.ba;
  r3({
    b,
    g,
    m,
    TX,
    px,
    py,
    a: aV,
    eye: eyeO != null ? eyeO : eyeH,
    hzf: hzO != null ? hzO : 0.5,
    t,
    nn,
    wx: wx(),
    spr: ((V3.nn = nn), v3Sprites(m, g, px, py, t, aV))
  });
  cx.imageSmoothingEnabled = false;
  cx.drawImage(b.cv, 0, 0, 480, VHH);
  cx.imageSmoothingEnabled = true;
  if (m.k == 'cave') {
    const lg = cx.createRadialGradient(240, 200, 40, 240, 200, 300);
    lg.addColorStop(0, 'rgba(0,0,10,0)');
    lg.addColorStop(1, 'rgba(0,0,10,.45)');
    cx.fillStyle = lg;
    cx.fillRect(0, 0, 480, VHH);
  }
  drawWx(t, m);
  v3Particles(t, dtm, m);
  cx.fillStyle = 'rgba(255,255,255,.75)';
  cx.fillRect(238, VHH / 2 - 1, 4, 2);
  cx.fillRect(239, VHH / 2 - 2, 2, 4);
  {
    const sx0 = Math.floor(px),
      sy0 = Math.floor(py),
      dX = Math.cos(V3.a),
      dY = Math.sin(V3.a),
      R = 7,
      cs = 4,
      mx0 = 480 - (2 * R + 1) * cs - 8,
      my0 = 8;
    cx.fillStyle = 'rgba(0,0,0,.5)';
    cx.fillRect(mx0 - 2, my0 - 2, (2 * R + 1) * cs + 4, (2 * R + 1) * cs + 4);
    for (let j = -R; j <= R; j++)
      for (let i = -R; i <= R; i++) {
        const c = g[sy0 + j]?.[sx0 + i];
        if (c === undefined) continue;
        const w2 = SOLID.includes(c) && c != 'w';
        cx.fillStyle =
          c == 'w'
            ? '#4a8fe0'
            : 'CLBKX'.includes(c)
              ? '#ffd23f'
              : w2
                ? c == 'T' || c == '#'
                  ? '#2f6b3a'
                  : '#8a6a4a'
                : c == 'U' || c == 'D'
                  ? '#ffd23f'
                  : '=_'.includes(c)
                    ? '#d9c89a'
                    : '#a9d57a';
        cx.fillRect(mx0 + (i + R) * cs, my0 + (j + R) * cs, cs, cs);
      }
    NP.forEach(n => {
      if (n.m == G.map && Math.abs(n.x - sx0) <= R && Math.abs(n.y - sy0) <= R) {
        cx.fillStyle = '#5ad0ff';
        cx.fillRect(mx0 + (n.x - sx0 + R) * cs + 1, my0 + (n.y - sy0 + R) * cs + 1, 2, 2);
      }
    });
    const cxp = mx0 + (R + px - sx0) * cs,
      cyp = my0 + (R + py - sy0) * cs;
    cx.strokeStyle = '#e63946';
    cx.lineWidth = 2;
    cx.beginPath();
    cx.moveTo(cxp, cyp);
    cx.lineTo(cxp + dX * 7, cyp + dY * 7);
    cx.stroke();
    cx.fillStyle = '#fff';
    cx.fillRect(cxp - 1.5, cyp - 1.5, 3, 3);
  }
  {
    const a2 = Math.min(1, (2200 - (t - bn)) / 500);
    if (a2 > 0) {
      cx.globalAlpha = a2;
      cx.font = "16px 'Press Start 2P',monospace";
      const tw = Math.ceil((cx.measureText(m.n) || {}).width || m.n.length * 13) + 28,
        bx = Math.round((480 - tw) / 2);
      cx.fillStyle = '#181818';
      cx.fillRect(bx - 4, 14, tw + 8, 38);
      cx.fillStyle = '#f8f8f0';
      cx.fillRect(bx, 18, tw, 30);
      cx.fillStyle = '#181818';
      cx.textBaseline = 'middle';
      cx.fillText(m.n, bx + 14, 34);
      cx.textBaseline = 'alphabetic';
      cx.globalAlpha = 1;
    }
  }
  if (V3.fade > 0) {
    cx.fillStyle = `rgba(0,0,0,${Math.min(1, V3.fade)})`;
    cx.fillRect(0, 0, 480, VHH);
    V3.fade = Math.max(0, V3.fade - dtm / 380);
  }
  if (V3.flash > 0) {
    cx.fillStyle = `rgba(255,255,255,${Math.min(1, V3.flash)})`;
    cx.fillRect(0, 0, 480, VHH);
    V3.flash = Math.max(0, V3.flash - dtm / 260);
  }
  if (S.fps) {
    cx.fillStyle = '#000';
    cx.fillRect(4, 4, 150, 22);
    cx.fillStyle = '#fff';
    cx.font = '16px monospace';
    cx.fillText((perf.fps || 0) + ' fps 3D', 8, 21);
  }
  {
    const dt3 = performance.now() - t0;
    V3.ms = (V3.ms || dt3) * 0.93 + dt3 * 0.07;
    V3.n = (V3.n || 0) + 1;
    if (!S.r3 && V3.n > 90 && V3.ms > 16 && (V3.W || 240) > 160) {
      V3.W = 160;
      V3.H = 128;
      V3.n = 0;
    }
  }
}
// rencontre visible : la créature surgit devant toi avant le combat
function v3Enc(c, cb) {
  busy = true;
  V3.enc = { c, t0: performance.now() };
  try {
    sfx(700, 0.12);
  } catch (e) {}
  setTimeout(() => {
    V3.flash = 1;
    setTimeout(() => {
      V3.enc = null;
      busy = false;
      cb();
    }, 180);
  }, 980);
}
// créature en relief : le sprite est « gonflé » en tranches ; queues/oreilles sont décalées en profondeur
function stackFor(im, back) {
  const key = im.src + (back ? 'b' : 'f');
  V3.stk = V3.stk || {};
  let S = V3.stk[key];
  if (S !== undefined) return S;
  V3.stk[key] = null;
  try {
    const N = im.naturalWidth || 64,
      K = 20,
      c = cv3(N, N),
      o = c.getContext('2d');
    o.drawImage(im, 0, 0, N, N);
    const a = o.getImageData(0, 0, N, N).data,
      d = new Float32Array(N * N),
      op = new Uint8Array(N * N);
    let cy = 0,
      cn = 0;
    for (let i = 0; i < N * N; i++) {
      op[i] = a[i * 4 + 3] > 40 ? 1 : 0;
      d[i] = op[i] ? 999 : 0;
      if (op[i]) {
        cy += (i / N) | 0;
        cn++;
      }
    }
    if (cn < 20) return null;
    cy /= cn;
    const chamf = (arr, seed) => {
      for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++) {
          const i = y * N + x;
          let v = arr[i];
          if (!v && seed) continue;
          if (!seed && !op[i]) continue;
          v = Math.min(
            v,
            (x ? arr[i - 1] : v) + 1,
            (y ? arr[i - N] : v) + 1,
            (x && y ? arr[i - N - 1] : v) + 1.4,
            (x < N - 1 && y ? arr[i - N + 1] : v) + 1.4
          );
          arr[i] = v;
        }
      for (let y = N - 1; y >= 0; y--)
        for (let x = N - 1; x >= 0; x--) {
          const i = y * N + x;
          let v = arr[i];
          v = Math.min(
            v,
            (x < N - 1 ? arr[i + 1] : v) + 1,
            (y < N - 1 ? arr[i + N] : v) + 1,
            (x < N - 1 && y < N - 1 ? arr[i + N + 1] : v) + 1.4,
            (x && y < N - 1 ? arr[i + N - 1] : v) + 1.4
          );
          arr[i] = v;
        }
    };
    // distance au fond
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const i = y * N + x;
        if (!op[i]) continue;
        let v = d[i];
        v = Math.min(
          v,
          (x ? d[i - 1] : 0) + 1,
          (y ? d[i - N] : 0) + 1,
          (x && y ? d[i - N - 1] : 0) + 1.4,
          (x < N - 1 && y ? d[i - N + 1] : 0) + 1.4
        );
        d[i] = v;
      }
    for (let y = N - 1; y >= 0; y--)
      for (let x = N - 1; x >= 0; x--) {
        const i = y * N + x;
        if (!op[i]) continue;
        let v = d[i];
        v = Math.min(
          v,
          (x < N - 1 ? d[i + 1] : 0) + 1,
          (y < N - 1 ? d[i + N] : 0) + 1,
          (x < N - 1 && y < N - 1 ? d[i + N + 1] : 0) + 1.4,
          (x && y < N - 1 ? d[i + N - 1] : 0) + 1.4
        );
        d[i] = v;
      }
    let mx = 0;
    for (let i = 0; i < N * N; i++) if (op[i] && d[i] < 900 && d[i] > mx) mx = d[i];
    if (mx < 2) return null;
    // distance au « corps » (noyau le plus épais) → les appendices (queue, oreilles, cornes) sortent du plan
    const ad = new Float32Array(N * N);
    for (let i = 0; i < N * N; i++) ad[i] = op[i] && d[i] >= mx * 0.6 ? 0 : 999;
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const i = y * N + x;
        let v = ad[i];
        v = Math.min(
          v,
          (x ? ad[i - 1] : 999) + 1,
          (y ? ad[i - N] : 999) + 1,
          (x && y ? ad[i - N - 1] : 999) + 1.4,
          (x < N - 1 && y ? ad[i - N + 1] : 999) + 1.4
        );
        ad[i] = v;
      }
    for (let y = N - 1; y >= 0; y--)
      for (let x = N - 1; x >= 0; x--) {
        const i = y * N + x;
        let v = ad[i];
        v = Math.min(
          v,
          (x < N - 1 ? ad[i + 1] : 999) + 1,
          (y < N - 1 ? ad[i + N] : 999) + 1,
          (x < N - 1 && y < N - 1 ? ad[i + N + 1] : 999) + 1.4,
          (x && y < N - 1 ? ad[i + N - 1] : 999) + 1.4
        );
        ad[i] = v;
      }
    const th = new Float32Array(N * N),
      zc = new Float32Array(N * N);
    for (let i = 0; i < N * N; i++) {
      if (!op[i]) continue;
      const y = (i / N) | 0,
        e = Math.min(1, d[i] / (mx * 0.85));
      th[i] = 0.07 + 0.5 * Math.sqrt(e);
      const ap = Math.min(1, ad[i] / (mx * 1.1)) * 0.62;
      zc[i] = ap * (back ? (y > cy ? 1 : -0.45) : y > cy ? -1 : 0.5);
    }
    S = { sl: [], K };
    for (let k = 0; k < K; k++) {
      const zk = -1 + (2 * (k + 0.5)) / K,
        cv = cv3(N, N),
        cc = cv.getContext('2d'),
        ot = cc.createImageData(N, N),
        b = ot.data,
        f = 0.58 + (0.5 * (zk + 1)) / 2;
      for (let i = 0; i < N * N; i++) {
        if (!op[i] || Math.abs(zk - zc[i]) > th[i]) continue;
        b[i * 4] = Math.min(255, a[i * 4] * f);
        b[i * 4 + 1] = Math.min(255, a[i * 4 + 1] * f);
        b[i * 4 + 2] = Math.min(255, a[i * 4 + 2] * f * (zk < 0 ? 1.06 : 1));
        b[i * 4 + 3] = a[i * 4 + 3];
      }
      cc.putImageData(ot, 0, 0);
      S.sl.push(cv);
    }
    return (V3.stk[key] = S);
  } catch (e) {
    return null;
  }
}
// espèce d'une image de combat (retrouvée depuis la source du sprite) ; -1 si pas de modèle 3D
function specOf(im) {
  const s = im.src;
  V3.sps = V3.sps || {};
  let r = V3.sps[s];
  if (r !== undefined) return r;
  r = -1;
  try {
    for (const k in PXC)
      if (PXC[k] === s) {
        const i = parseInt(k);
        if (MD[i]) r = i;
        break;
      }
  } catch (e) {}
  return (V3.sps[s] = r);
}
// arène de combat en 3D (les créatures sont placées depuis leurs boîtes DOM : les attaques tombent juste dessus)
const ARN = {};
function arenaGrid(m) {
  const inn = !!m.in,
    th = m.th || 'plain',
    key = inn ? 'in_' + m.k : th;
  if (ARN[key]) return ARN[key];
  const N = 31,
    c0 = 15,
    g = [];
  for (let y = 0; y < N; y++) {
    const r = [];
    for (let x = 0; x < N; x++) {
      const d = Math.hypot(x - c0, y - c0),
        sp = (x * 13 + y * 7) % 5,
        sq = (x * 5 + y * 11) % 7;
      let ch = '.';
      if (inn) {
        ch =
          d > 9.5 ? '#' : d > 8 && (x + y) % 4 == 0 ? (sq % 2 ? 'p' : 's') : d > 7.5 && sq == 0 ? 'k' : '.';
      } else if (d < 4.6) ch = '=';
      else if (d < 5.8) ch = (x * 3 + y) % 5 == 0 ? 'f' : '.';
      else if (d < 8.6) ch = sp == 0 ? 'b' : sq == 0 ? 'q' : sp == 1 && sq < 3 ? 'g' : sq == 3 ? 'f' : '.';
      else if (d < 11) ch = (x * 7 + y * 3) % 5 < 3 ? 'T' : sq == 1 ? 'F' : 'g';
      else ch = sp < 4 ? 'T' : 'q';
      r.push(ch);
    }
    g.push(r);
  }
  return (ARN[key] = { g, m2: { in: inn, k: m.k, th: inn ? undefined : th, tn: inn ? 0 : 1 } });
}
function bat3(t) {
  const bt = $('bt'),
    on = bt && S.v3 && getComputedStyle(bt).display != 'none';
  let el = $('bbg3');
  if (on && !V3.bat) {
    V3.bat = 1;
    V3.bat0 = t;
  }
  if (!on) {
    if (el) el.remove();
    if (bt) bt.classList.remove('b3d', 'b3p');
    V3.bat = 0;
    return;
  }
  const m = maps[G.map],
    A = arenaGrid(m),
    r = bt.getBoundingClientRect(),
    W = Math.max(120, Math.min(230, (r.width / 1.9) | 0)),
    H = Math.max(120, Math.min(340, ((W * r.height) / Math.max(1, r.width)) | 0)),
    b = r3buf('b', W, H);
  if (!el || el !== b.cv) {
    if (el) el.remove();
    b.cv.id = 'bbg3';
    b.cv.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;z-index:-1;image-rendering:pixelated';
    bt.insertBefore(b.cv, bt.firstChild);
    bt.classList.add('b3d');
  }
  const inn = !!m.in,
    na = !inn && S.night ? nightA() : 0,
    nn = Math.min(1, na / 0.32),
    key = inn ? 'in_' + m.k : m.th || 'plain',
    TX = V3.tex[key] || (V3.tex[key] = inn ? texIn(m.k) : texOut(m.th || 'plain'));
  const dbl = !!(typeof B != 'undefined' && B && B.dbl),
    hzf = dbl ? 0.07 : 0.17,
    eye = 0.78,
    hz = (H * hzf) | 0,
    F = W / 2 / 0.66,
    REF = 4.6;
  const hk = t - (V3.hitT || -1e9),
    kick = hk < 380 ? Math.sin(t / 28) * 0.035 * (1 - hk / 380) : 0,
    sw = Math.sin(t / 4200) * 0.07 + kick,
    a = -Math.PI / 2 + sw,
    kd = Math.min(1, (t - (V3.bat0 || t)) / 1500),
    dl = REF + 3.4 * Math.pow(1 - kd, 3),
    cxp = 15.5 - Math.cos(a) * dl,
    cyp = 15.5 - Math.sin(a) * dl;
  const SPL = [];
  try {
    const bw = r.width || 1,
      bh = r.height || 1;
    const proj = rc => {
      const xb = ((rc.left + rc.width / 2 - r.left) / bw) * W,
        yb = Math.max(hz + H * 0.035, ((rc.bottom - rc.height * 0.04 - r.top) / bh) * H),
        hp = (rc.height / bh) * H,
        rd = (eye * F) / (yb - hz);
      return { x: 15.5 + rd * 0.66 * ((2 * xb) / W - 1), y: 15.5 + REF - rd, h: (hp * rd) / F };
    };
    const add = (sel, back) => {
      const el = bt.querySelector(sel);
      if (!el) return;
      const imgs = [...el.querySelectorAll('img.px')].filter(i => i.complete && i.naturalWidth);
      if (!imgs.length) return;
      bt.classList.add('b3p');
      const eo = parseFloat(getComputedStyle(el).opacity);
      imgs.forEach((im, k) => {
        const rc = im.getBoundingClientRect();
        if (!rc.height) return;
        const P = proj(rc),
          cs = getComputedStyle(im),
          op = parseFloat(cs.opacity) * eo,
          al = isNaN(op) ? 1 : op,
          sp0 = specOf(im);
        if (sp0 >= 0) {
          try {
            const bm = (cs.filter || '').match(/brightness\(([\d.]+)\)/),
              bri = bm ? Math.max(0.4, Math.min(2.2, parseFloat(bm[1]))) : 1,
              yw = back ? Math.PI - 0.3 + Math.sin(t / 1400) * 0.34 : -0.34 + Math.sin(t / 1500) * 0.32,
              mc = mdFor(sp0, (back ? 'm' : 'f') + k, t, yw, 0.12, {
                R: back ? 120 : 92,
                bri,
                flash: bri > 1 ? Math.min(0.7, (bri - 1) * 0.5) : 0
              });
            if (mc) {
              const h2 = P.h * (back ? 1.13 : 1.02);
              SPL.push({
                x: P.x,
                y: P.y,
                c: mc,
                h: h2,
                sh: 1,
                lift: (-0.08 / 1.5) * h2,
                al: al,
                nz: 1,
                wsc: 1
              });
              return;
            }
          } catch (e) {}
        }
        const S2 = stackFor(im, back);
        if (!S2) return;
        const yaw = back ? 0.3 : -0.3,
          rot = yaw + Math.sin(t / 1250 + (back ? 1.7 : 0)) * 0.36,
          fxv = Math.sin(rot),
          fzv = Math.cos(rot),
          D = 0.3 * P.h,
          ws = Math.max(0.34, Math.abs(Math.cos(rot)));
        S2.sl.forEach((cv, ix) => {
          const zk = -1 + (2 * (ix + 0.5)) / S2.K;
          SPL.push({
            x: P.x + fxv * zk * D,
            y: P.y + fzv * zk * D,
            c: cv,
            h: P.h,
            sh: ix == S2.K >> 1 ? 1 : 0,
            lift: 0,
            al: al,
            nz: 1,
            wsc: ws
          });
        });
      });
    };
    add('#sp .fs', 0);
    add('#sp .ms', 1);
  } catch (e) {}
  V3.bcam = [cxp, cyp, a];
  r3({
    b,
    g: A.g,
    m: A.m2,
    TX,
    px: cxp,
    py: cyp,
    a,
    eye,
    hzf,
    t,
    nn,
    wx: m.in ? 'clair' : wx(),
    spr: SPL.concat(
      m.in
        ? []
        : (() => {
            const L = [];
            envSprites(L, A.m2, A.g, cxp, cyp, t, a);
            return L;
          })()
    ),
    smooth: 1
  });
  bt.style.setProperty('--bx', (sw * 2.4).toFixed(3));
}
(function batLoop() {
  requestAnimationFrame(batLoop);
  const bt = $('bt');
  if (!S.v3 && !$('bbg3')) return;
  if (bt && (getComputedStyle(bt).display != 'none' || $('bbg3')))
    try {
      bat3(performance.now());
    } catch (e) {}
})();
