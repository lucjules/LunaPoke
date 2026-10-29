// Bâtiments et accessoires du village en vraie 3D (maillages + tampon de profondeur)
// ---------- accessoires 3D du village : tonneaux, caisses, bancs, lampadaires, vignes, barrières, coffres ----------
function mkTr(ox, oy, yaw) {
  const c = Math.cos(yaw),
    s = Math.sin(yaw);
  return {
    W: (x, y, z, u, v) => [ox + x * c - y * s, oy + x * s + y * c, z, u || 0, v || 0],
    N: (a, b, d) => [a * c - b * s, a * s + b * c, d]
  };
}
function pbox(P, T, ax, ay, az, bx, by, bz, o, top) {
  const f = (pts, n, oo) =>
    P.push(
      Object.assign(
        { p: pts.map(q => T.W(q[0], q[1], q[2], q[3], q[4])), n: T.N(n[0], n[1], n[2]), sd: 1 },
        oo
      )
    );
  f(
    [
      [ax, by, az, 0, 1],
      [bx, by, az, 1, 1],
      [bx, by, bz, 1, 0],
      [ax, by, bz, 0, 0]
    ],
    [0, 1, 0],
    o
  );
  f(
    [
      [bx, ay, az, 0, 1],
      [ax, ay, az, 1, 1],
      [ax, ay, bz, 1, 0],
      [bx, ay, bz, 0, 0]
    ],
    [0, -1, 0],
    o
  );
  f(
    [
      [bx, by, az, 0, 1],
      [bx, ay, az, 1, 1],
      [bx, ay, bz, 1, 0],
      [bx, by, bz, 0, 0]
    ],
    [1, 0, 0],
    o
  );
  f(
    [
      [ax, ay, az, 0, 1],
      [ax, by, az, 1, 1],
      [ax, by, bz, 1, 0],
      [ax, ay, bz, 0, 0]
    ],
    [-1, 0, 0],
    o
  );
  f(
    [
      [ax, ay, bz, 0, 0],
      [bx, ay, bz, 1, 0],
      [bx, by, bz, 1, 1],
      [ax, by, bz, 0, 1]
    ],
    [0, 0, 1],
    top || o
  );
}
function pcyl(P, T, cx, cy, z0, z1, r0, r1, n, o, top) {
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2,
      a1 = ((i + 1) / n) * Math.PI * 2,
      am = (a0 + a1) / 2,
      p = [
        [cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0, z0],
        [cx + Math.cos(a1) * r0, cy + Math.sin(a1) * r0, z0],
        [cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1, z1],
        [cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1, z1]
      ];
    P.push(
      Object.assign(
        { p: p.map(q => T.W(q[0], q[1], q[2])), n: T.N(Math.cos(am), Math.sin(am), 0.1), sd: 1 },
        o
      )
    );
  }
  if (top !== false) {
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      p.push(T.W(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, z1));
    }
    P.push(Object.assign({ p, n: T.N(0, 0, 1), sd: 1 }, top || o));
  }
}
function pp_barrel(P, ox, oy, s) {
  const T = mkTr(ox, oy, 0),
    w = { col: [132, 88, 52] },
    h = { col: [70, 66, 64] };
  pcyl(P, T, 0, 0, 0, 0.12, 0.15 * s, 0.18 * s, 8, w, false);
  pcyl(P, T, 0, 0, 0.12, 0.3, 0.18 * s, 0.19 * s, 8, w, false);
  pcyl(P, T, 0, 0, 0.3, 0.42, 0.19 * s, 0.15 * s, 8, w, { col: [156, 108, 64] });
  pcyl(P, T, 0, 0, 0.1, 0.14, 0.185 * s, 0.185 * s, 8, h, false);
  pcyl(P, T, 0, 0, 0.28, 0.32, 0.195 * s, 0.195 * s, 8, h, false);
}
function pp_crate(P, ox, oy, yaw, s) {
  const T = mkTr(ox, oy, yaw);
  pbox(
    P,
    T,
    -0.15 * s,
    -0.15 * s,
    0,
    0.15 * s,
    0.15 * s,
    0.28 * s,
    { col: [170, 124, 72] },
    { col: [190, 144, 88] }
  );
  pbox(P, T, -0.16 * s, -0.16 * s, 0.02 * s, 0.16 * s, -0.14 * s, 0.06 * s, { col: [120, 84, 48] });
  pbox(P, T, -0.16 * s, 0.14 * s, 0.02 * s, 0.16 * s, 0.16 * s, 0.06 * s, { col: [120, 84, 48] });
}
function pp_bench(P, ox, oy, yaw) {
  const T = mkTr(ox, oy, yaw),
    w = { col: [150, 102, 60] },
    d = { col: [100, 70, 42] };
  pbox(P, T, -0.4, -0.13, 0.2, 0.4, 0.13, 0.25, w, { col: [168, 120, 72] });
  pbox(P, T, -0.4, 0.11, 0.25, 0.4, 0.14, 0.48, w);
  for (const s of [-1, 1]) {
    pbox(P, T, s * 0.34 - 0.03, -0.1, 0, s * 0.34 + 0.03, 0.1, 0.2, d);
    pbox(P, T, s * 0.34 - 0.03, 0.1, 0.2, s * 0.34 + 0.03, 0.14, 0.5, d);
  }
}
function pp_lamp(P, ox, oy) {
  const T = mkTr(ox, oy, 0),
    fe = { col: [44, 46, 52] };
  pcyl(P, T, 0, 0, 0, 0.08, 0.07, 0.05, 6, fe);
  pcyl(P, T, 0, 0, 0.08, 1.15, 0.032, 0.026, 6, fe);
  pbox(P, T, -0.085, -0.085, 1.15, 0.085, 0.085, 1.19, fe);
  pbox(
    P,
    T,
    -0.07,
    -0.07,
    1.19,
    0.07,
    0.07,
    1.4,
    { col: [255, 226, 140], glass: 1 },
    { col: [255, 226, 140], glass: 1 }
  );
  pbox(P, T, -0.1, -0.1, 1.4, 0.1, 0.1, 1.43, fe);
  pcyl(P, T, 0, 0, 1.43, 1.5, 0.09, 0.02, 4, fe);
}
function pp_vines(P, x, y, nx, ny, w, h, z0) {
  const T = mkTr(x, y, 0);
  const ax = ny != 0 ? 1 : 0; // panneau vertical collé au mur
  const a = ax
    ? [
        [-w / 2, 0],
        [w / 2, 0]
      ]
    : [
        [0, -w / 2],
        [0, w / 2]
      ];
  const o = { tx: 'vine', n: [nx, ny, 0] };
  P.push({
    p: [
      [x + a[0][0] + nx * 0.012, y + a[0][1] + ny * 0.012, z0, 0, 1],
      [x + a[1][0] + nx * 0.012, y + a[1][1] + ny * 0.012, z0, 1, 1],
      [x + a[1][0] + nx * 0.012, y + a[1][1] + ny * 0.012, z0 + h, 1, 0],
      [x + a[0][0] + nx * 0.012, y + a[0][1] + ny * 0.012, z0 + h, 0, 0]
    ],
    n: [nx, ny, 0],
    sd: 1,
    tx: 'vine'
  });
}
function pp_chest(P, ox, oy, yaw) {
  const T = mkTr(ox, oy, yaw),
    w = { col: [140, 90, 48] };
  pbox(P, T, -0.25, -0.17, 0, 0.25, 0.17, 0.2, w, { col: [150, 98, 52] });
  pbox(P, T, -0.26, -0.18, 0.2, 0.26, 0.18, 0.27, { col: [120, 76, 40] }, { col: [150, 98, 52] });
  pbox(P, T, -0.03, 0.17, 0.12, 0.03, 0.2, 0.24, { col: [240, 200, 70] });
  for (const s of [-1, 1])
    pbox(P, T, s * 0.18 - 0.02, -0.18, 0, s * 0.18 + 0.02, 0.18, 0.27, { col: [240, 200, 70] });
}
function addProps(g, B, P) {
  const h = k => ((hs(B.x0 * 31 + k * 7, B.y0 * 17 + k * 5) >>> 4) % 1000) / 1000,
    fr = (x, y) => {
      const c = g[y] && g[y][x];
      return c == '.' || c == 'f';
    },
    { x0, y0, X1, Y1 } = B,
    ym = (y0 + Y1) / 2;
  if (h(1) < 0.62 && fr(x0 - 1, Y1 - 1)) {
    pp_barrel(P, x0 - 0.26, Y1 - 0.5, 1.35);
    pp_barrel(P, x0 - 0.24, Y1 - 1.05, 1.2);
    if (h(2) < 0.6) pp_crate(P, x0 - 0.2, Y1 - 0.28, 0.3, 1);
  }
  if (h(3) < 0.5 && fr(X1, Math.floor(ym))) {
    pp_bench(P, X1 + 0.2, ym, Math.PI / 2);
  }
  if (h(4) < 0.6 && fr(X1, Y1)) {
    pp_lamp(P, X1 + 0.25, Y1 + 0.28);
    B.lamp = [X1 + 0.25, Y1 + 0.28, 1.3];
  }
  if (h(5) < 0.5 && fr(x0 - 1, y0 - 1)) {
    pp_crate(P, x0 - 0.2, y0 - 0.2, 0.2, 1);
    if (h(6) < 0.5) pp_crate(P, x0 - 0.18, y0 + 0.15, -0.15, 0.85);
  }
  if (h(7) < 0.6) pp_vines(P, X1 + 0.01, ym + 0.3 * (h(8) - 0.5), 1, 0, 0.8 + h(9) * 0.6, 1.2, 0.1);
  if (h(10) < 0.5) pp_vines(P, x0 - 0.01, ym + 0.9 * (h(11) - 0.5), -1, 0, 0.7 + h(12) * 0.5, 1.1, 0.1);
  if (h(13) < 0.4) pp_vines(P, x0 + 1.5 + h(14) * 1.2, y0 - 0.01, 0, -1, 0.9, 1.2, 0.1);
}
function propBlock(P, x, y, rad) {
  return { x0: x, y0: y, X1: x + 1, Y1: y + 1, cx: x + 0.5, cy: y + 0.5, rad, polys: P, prop: 1, zR: 0 };
}
// ---------- BÂTIMENTS EN VRAIE 3D : maillage (murs, toit à pentes, cheminée, porche…) + tampon de profondeur ----------
const HM_H = 1.42,
  MS_L = [-0.35, 0.45, 0.82];
function sunInfo(nn, wxs) {
  const hr = V3.hourOv != null ? V3.hourOv : hourNow();
  let day = hr > 6.2 && hr < 19.8 && nn < 0.7,
    u = Math.max(0, Math.min(1, (hr - 6) / 13.6)),
    az = 0.25 + u * (Math.PI - 0.5),
    el = Math.sin(u * Math.PI),
    E = Math.asin(Math.max(0.18, Math.min(1, el * 0.92 + 0.08)));
  if (!day) {
    az = 2.1;
    E = 0.95;
  }
  const cE = Math.cos(E),
    L = day ? [Math.cos(az) * cE, Math.sin(az) * cE * 1.0, Math.sin(E)] : MS_L.map(v => v),
    k = day ? (wxs == 'pluie' ? 0.35 : wxs == 'brume' ? 0.25 : 1) * Math.max(0, 1 - nn * 1.4) : 0,
    len = Math.min(4.2, 2.7 / Math.max(0.28, Math.tan(E)));
  return { az, E, L, k, len, day, vx: -Math.cos(az), vy: -Math.sin(az) };
}
const msShade = (n, Lv) => {
  Lv = Lv || MS_L;
  const l = Math.hypot(n[0], n[1], n[2]) || 1,
    L = Math.hypot(Lv[0], Lv[1], Lv[2]);
  return 0.64 + 0.46 * Math.max(0, (n[0] * Lv[0] + n[1] * Lv[1] + n[2] * Lv[2]) / (l * L));
};
function houseBlocks(g) {
  if (!g || !g[0]) return [];
  if (g.__hm) return g.__hm;
  const h = g.length,
    w = g[0].length,
    seen = new Uint8Array(w * h),
    out = [],
    cov = new Uint8Array(w * h),
    isH = c => c == 'H' || c == 'C' || c == 'B' || c == 'L' || c == 'K';
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!isH(g[y][x]) || seen[y * w + x]) continue;
      const st = [[x, y]];
      seen[y * w + x] = 1;
      let x0 = x,
        x1 = x,
        y0 = y,
        y1 = y,
        n = 0;
      const cells = [];
      while (st.length) {
        const [a, b] = st.pop();
        n++;
        cells.push([a, b]);
        if (a < x0) x0 = a;
        if (a > x1) x1 = a;
        if (b < y0) y0 = b;
        if (b > y1) y1 = b;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1]
        ]) {
          const nx = a + dx,
            ny = b + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h || seen[ny * w + nx] || !isH(g[ny][nx])) continue;
          seen[ny * w + nx] = 1;
          st.push([nx, ny]);
        }
      }
      if (n != (x1 - x0 + 1) * (y1 - y0 + 1) || x1 - x0 < 1 || y1 - y0 < 1) continue;
      const doors = [];
      for (const [a, b] of cells) {
        cov[b * w + a] = 1;
        if (g[b][a] != 'H') doors.push([a, b, g[b][a]]);
      }
      {
        const Hb = mkHouse(x0, y0, x1, y1, doors);
        Hb.house = 1;
        try {
          addProps(g, Hb, Hb.polys);
        } catch (e) {}
        Hb.rad += 0.8;
        out.push(Hb);
      }
    }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = g[y][x];
      if (c == 'Z' || c == 'y') {
        cov[y * w + x] = 1;
        const P = [],
          T = mkTr(0, 0, 0),
          f = u =>
            g[y + u[1]] &&
            g[y + u[1]][x + u[0]] &&
            (g[y + u[1]][x + u[0]] == 'Z' || g[y + u[1]][x + u[0]] == 'y'),
          wd = { col: [150, 104, 58] },
          pd = { col: [116, 78, 44] };
        pbox(P, T, x + 0.43, y + 0.43, 0, x + 0.57, y + 0.57, 0.58, pd, { col: [170, 124, 72] });
        if (f([1, 0])) {
          pbox(P, T, x + 0.5, y + 0.46, 0.34, x + 1.5, y + 0.54, 0.42, wd);
          pbox(P, T, x + 0.5, y + 0.46, 0.14, x + 1.5, y + 0.54, 0.22, wd);
        }
        if (f([0, 1])) {
          pbox(P, T, x + 0.46, y + 0.5, 0.34, x + 0.54, y + 1.5, 0.42, wd);
          pbox(P, T, x + 0.46, y + 0.5, 0.14, x + 0.54, y + 1.5, 0.22, wd);
        }
        if (!f([1, 0]) && !f([-1, 0]) && !f([0, 1]) && !f([0, -1])) {
          pbox(P, T, x + 0.1, y + 0.46, 0.34, x + 0.9, y + 0.54, 0.42, wd);
          pbox(P, T, x + 0.1, y + 0.46, 0.14, x + 0.9, y + 0.54, 0.22, wd);
        }
        out.push(propBlock(P, x, y, 1.6));
      } else if (c == 'z' || c == 'o') {
        cov[y * w + x] = 1;
        const P = [];
        pp_chest(P, x + 0.5, y + 0.5, (((hs(x, y) >>> 3) % 4) * Math.PI) / 2);
        out.push(propBlock(P, x, y, 0.9));
      }
    }
  out.cov = cov;
  out.w = w;
  g.__hm = out;
  return out;
}
// ---------- éléments d'architecture : lucarnes, tour, dôme, porche, créneaux, volets ----------
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function autoN(p, hint) {
  const a = [p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]],
    b = [p[2][0] - p[0][0], p[2][1] - p[0][1], p[2][2] - p[0][2]];
  let n = cross3(a, b);
  const l = Math.hypot(n[0], n[1], n[2]) || 1;
  n = [n[0] / l, n[1] / l, n[2] / l];
  if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0) n = [-n[0], -n[1], -n[2]];
  return n;
}
function fpoly(P, pts, hint, o) {
  const p = pts.map(q => [q[0], q[1], q[2], q[3] || 0, q[4] || 0]);
  const n = autoN(p, hint);
  P.push(Object.assign({ p, n, sd: 1 }, o));
}
function feDormer(C, xc, wd, hh, opt) {
  opt = opt || {};
  const { P, HM, sl, Y1, wc, V } = C,
    xl = xc - wd,
    xr = xc + wd,
    yf = Y1 - 0.55,
    z0 = HM + sl * 0.55,
    z1 = z0 + hh,
    zr = z1 + 0.28,
    ye = Y1 - (z1 - HM) / sl,
    yr = Y1 - (zr - HM) / sl;
  fpoly(
    P,
    [
      [xl, yf, z0],
      [xr, yf, z0],
      [xr, yf, z1],
      [xl, yf, z1]
    ],
    [0, 1, 0],
    { col: wc }
  );
  fpoly(
    P,
    [
      [xl, yf, z1],
      [xr, yf, z1],
      [xc, yf, zr]
    ],
    [0, 1, 0],
    { col: wc }
  );
  fpoly(
    P,
    [
      [xc - wd * 0.62, yf + 0.012, z0 + 0.05],
      [xc + wd * 0.62, yf + 0.012, z0 + 0.05],
      [xc + wd * 0.62, yf + 0.012, z1 - 0.04],
      [xc - wd * 0.62, yf + 0.012, z1 - 0.04]
    ],
    [0, 1, 0],
    { col: V.tr }
  );
  fpoly(
    P,
    [
      [xc - wd * 0.5, yf + 0.024, z0 + 0.09],
      [xc + wd * 0.5, yf + 0.024, z0 + 0.09],
      [xc + wd * 0.5, yf + 0.024, z1 - 0.08],
      [xc - wd * 0.5, yf + 0.024, z1 - 0.08]
    ],
    [0, 1, 0],
    { col: [160, 210, 250], glass: 1 }
  );
  if (opt.cross) {
    const cz = zr - 0.07;
    fpoly(
      P,
      [
        [xc - 0.035, yf + 0.03, cz - 0.1],
        [xc + 0.035, yf + 0.03, cz - 0.1],
        [xc + 0.035, yf + 0.03, cz + 0.06],
        [xc - 0.035, yf + 0.03, cz + 0.06]
      ],
      [0, 1, 0],
      { col: [220, 50, 60] }
    );
    fpoly(
      P,
      [
        [xc - 0.075, yf + 0.03, cz - 0.05],
        [xc + 0.075, yf + 0.03, cz - 0.05],
        [xc + 0.075, yf + 0.03, cz + 0.01],
        [xc - 0.075, yf + 0.03, cz + 0.01]
      ],
      [0, 1, 0],
      { col: [220, 50, 60] }
    );
  }
  fpoly(
    P,
    [
      [xl, yf, z0],
      [xl, yf, z1],
      [xl, ye, z1]
    ],
    [-1, 0, 0],
    { col: wc }
  );
  fpoly(
    P,
    [
      [xr, yf, z0],
      [xr, yf, z1],
      [xr, ye, z1]
    ],
    [1, 0, 0],
    { col: wc }
  );
  const rp = (a, b, c, d, h) =>
    fpoly(
      P,
      [
        a.concat([a[0] * 1.2, (a[1] + a[2]) * 1.2]),
        b.concat([b[0] * 1.2, (b[1] + b[2]) * 1.2]),
        c.concat([c[0] * 1.2, (c[1] + c[2]) * 1.2]),
        d.concat([d[0] * 1.2, (d[1] + d[2]) * 1.2])
      ],
      h,
      { tx: 'roofS', rf: 1, rep: 1 }
    );
  rp(
    [xl - 0.05, yf + 0.05, z1 - 0.03],
    [xc, yf + 0.05, zr + 0.02],
    [xc, yr, zr + 0.02],
    [xl - 0.05, ye, z1 - 0.03],
    [-0.5, 0.3, 1]
  );
  rp(
    [xr + 0.05, yf + 0.05, z1 - 0.03],
    [xr + 0.05, ye, z1 - 0.03],
    [xc, yr, zr + 0.02],
    [xc, yf + 0.05, zr + 0.02],
    [0.5, 0.3, 1]
  );
}
function feTower(C, cx, cy, hw, z0, h, opt) {
  opt = opt || {};
  const { P } = C,
    z1 = z0 + h,
    sx = { tx: 'stone', rep: 1 };
  const q = (a, b, c, d, n) =>
    fpoly(P, [a.concat([0, 3]), b.concat([2, 3]), c.concat([2, 0]), d.concat([0, 0])], n, sx);
  q(
    [cx - hw, cy + hw, z0],
    [cx + hw, cy + hw, z0],
    [cx + hw, cy + hw, z1],
    [cx - hw, cy + hw, z1],
    [0, 1, 0]
  );
  q(
    [cx + hw, cy - hw, z0],
    [cx - hw, cy - hw, z0],
    [cx - hw, cy - hw, z1],
    [cx + hw, cy - hw, z1],
    [0, -1, 0]
  );
  q(
    [cx + hw, cy + hw, z0],
    [cx + hw, cy - hw, z0],
    [cx + hw, cy - hw, z1],
    [cx + hw, cy + hw, z1],
    [1, 0, 0]
  );
  q(
    [cx - hw, cy - hw, z0],
    [cx - hw, cy + hw, z0],
    [cx - hw, cy + hw, z1],
    [cx - hw, cy - hw, z1],
    [-1, 0, 0]
  );
  for (const [nx, ny] of [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ]) {
    const e = 0.012,
      ax = nx ? 0 : 1,
      ay = nx ? 1 : 0;
    fpoly(
      P,
      [
        [cx + nx * (hw + e) - ax * 0.09, cy + ny * (hw + e) - ay * 0.09, z1 - 0.5],
        [cx + nx * (hw + e) + ax * 0.09, cy + ny * (hw + e) + ay * 0.09, z1 - 0.5],
        [cx + nx * (hw + e) + ax * 0.09, cy + ny * (hw + e) + ay * 0.09, z1 - 0.18],
        [cx + nx * (hw + e) - ax * 0.09, cy + ny * (hw + e) - ay * 0.09, z1 - 0.18]
      ],
      [nx, ny, 0],
      { col: [255, 220, 130], glass: 1 }
    );
  }
  if (opt.dome) {
    feDome(C, cx, cy, hw * 0.92, z1 + 0.04);
    return;
  }
  const rr = hw + 0.16,
    zt = z1 + 0.04,
    za = z1 + 0.75;
  for (const [a, b, n] of [
    [
      [-1, 1],
      [1, 1],
      [0, 1, 0.7]
    ],
    [
      [1, 1],
      [1, -1],
      [1, 0, 0.7]
    ],
    [
      [1, -1],
      [-1, -1],
      [0, -1, 0.7]
    ],
    [
      [-1, -1],
      [-1, 1],
      [-1, 0, 0.7]
    ]
  ])
    fpoly(
      P,
      [
        [cx + a[0] * rr, cy + a[1] * rr, zt, 0, 2],
        [cx + b[0] * rr, cy + b[1] * rr, zt, 2, 2],
        [cx, cy, za, 1, 0]
      ],
      n,
      { tx: 'roofS', rf: 1, rep: 1 }
    );
  const pz = za,
    pm = opt.flag || [220, 50, 60];
  pbox(P, mkTr(0, 0, 0), cx - 0.015, cy - 0.015, pz, cx + 0.015, cy + 0.015, pz + 0.55, {
    col: [80, 70, 60]
  });
  fpoly(
    P,
    [
      [cx + 0.015, cy, pz + 0.5],
      [cx + 0.5, cy + 0.04, pz + 0.46],
      [cx + 0.5, cy + 0.04, pz + 0.26],
      [cx + 0.015, cy, pz + 0.28]
    ],
    [0, 1, 0],
    { col: pm }
  );
  fpoly(
    P,
    [
      [cx + 0.015, cy, pz + 0.28],
      [cx + 0.5, cy + 0.04, pz + 0.26],
      [cx + 0.5, cy + 0.04, pz + 0.46],
      [cx + 0.015, cy, pz + 0.5]
    ],
    [0, -1, 0],
    { col: pm }
  );
}
function feDome(C, cx, cy, r, z0) {
  const { P } = C,
    T = mkTr(0, 0, 0),
    n = 10,
    rings = [
      [0, r],
      [0.28 * r, r * 0.96],
      [0.56 * r, r * 0.83],
      [0.8 * r, r * 0.6],
      [0.95 * r, r * 0.3]
    ];
  pcyl(P, T, cx, cy, z0 - 0.15, z0 + 0.04, r * 1.02, r * 1.02, n, { col: [140, 150, 160] }, false);
  for (let i = 0; i < rings.length - 1; i++)
    pcyl(
      P,
      T,
      cx,
      cy,
      z0 + rings[i][0],
      z0 + rings[i + 1][0],
      rings[i][1],
      rings[i + 1][1],
      n,
      { col: [216, 228, 240] },
      i == rings.length - 2 ? { col: [216, 228, 240] } : false
    );
  // fente
  fpoly(
    P,
    [
      [cx - 0.07, cy + r * 0.93, z0 + 0.12],
      [cx + 0.07, cy + r * 0.93, z0 + 0.12],
      [cx + 0.05, cy + r * 0.55, z0 + r * 0.9],
      [cx - 0.05, cy + r * 0.55, z0 + r * 0.9]
    ],
    [0, 1, 0.3],
    { col: [60, 90, 130] }
  );
  pbox(P, T, cx - 0.012, cy - 0.012, z0 + r, cx + 0.012, cy + 0.012, z0 + r + 0.45, { col: [90, 90, 100] });
  pbox(P, T, cx - 0.04, cy - 0.04, z0 + r + 0.45, cx + 0.04, cy + 0.04, z0 + r + 0.53, {
    col: [255, 70, 70],
    glass: 1
  });
}
function fePorch(C, d) {
  const { P, Y1, HM } = C,
    T = mkTr(0, 0, 0),
    zw = 1.12,
    zo = 0.98,
    yo = Y1 + 0.72,
    x0 = d - 0.1,
    x1 = d + 1.1;
  fpoly(
    P,
    [
      [x0, Y1, zw, 0, 0],
      [x1, Y1, zw, 3, 0],
      [x1, yo, zo, 3, 2],
      [x0, yo, zo, 0, 2]
    ],
    [0, 0.3, 1],
    { tx: 'roofS', rf: 1, rep: 1 }
  );
  fpoly(
    P,
    [
      [x0, Y1, zw - 0.05],
      [x0, yo, zo - 0.05],
      [x1, yo, zo - 0.05],
      [x1, Y1, zw - 0.05]
    ],
    [0, -0.2, -1],
    { col: [96, 66, 44] }
  );
  fpoly(
    P,
    [
      [x0, yo, zo - 0.07],
      [x1, yo, zo - 0.07],
      [x1, yo, zo + 0.02],
      [x0, yo, zo + 0.02]
    ],
    [0, 1, 0],
    { col: [96, 66, 44] }
  );
  for (const px of [x0 + 0.07, x1 - 0.07])
    pbox(P, T, px - 0.04, yo - 0.08, 0, px + 0.04, yo, zo - 0.07, { col: [130, 90, 56] });
  pbox(P, T, d + 0.46, Y1 + 0.1, zo - 0.2, d + 0.54, Y1 + 0.18, zo - 0.07, { col: [44, 46, 52] });
  pbox(P, T, d + 0.44, Y1 + 0.1, zo - 0.42, d + 0.56, Y1 + 0.19, zo - 0.2, {
    col: [255, 226, 140],
    glass: 1
  });
}
function feMerlons(C, x0, X1, Y1, HM, zE) {
  const { P } = C,
    T = mkTr(0, 0, 0),
    yy = Y1 + 0.3 - 0.12;
  for (let x = x0 - 0.3 + 0.05; x < X1 + 0.3 - 0.2; x += 0.36)
    pbox(
      P,
      T,
      x,
      yy,
      zE + 0.05,
      x + 0.2,
      yy + 0.12,
      zE + 0.3,
      { col: [170, 166, 156] },
      { col: [186, 182, 172] }
    );
}
function feShutters(C, i) {
  const { P, Y1, V } = C,
    z0 = 0.48,
    z1 = 0.96,
    a = 0.9;
  for (const s of [-1, 1]) {
    const hx = i + 0.5 + s * 0.27,
      ex = hx + s * Math.cos(a) * 0.17,
      ey = Y1 + Math.sin(a) * 0.17;
    fpoly(
      P,
      [
        [hx, Y1 + 0.01, z0, 0, 1],
        [ex, ey, z0, 1, 1],
        [ex, ey, z1, 1, 0],
        [hx, Y1 + 0.01, z1, 0, 0]
      ],
      [s * 0.9, 0.4, 0],
      { col: V.sh }
    );
    fpoly(
      P,
      [
        [ex, ey, z0, 0, 1],
        [hx, Y1 + 0.01, z0, 1, 1],
        [hx, Y1 + 0.01, z1, 1, 0],
        [ex, ey, z1, 0, 0]
      ],
      [-s * 0.9, -0.4, 0],
      { col: V.sh }
    );
  }
}

function mkHouse(x0, y0, x1, y1, doors) {
  const v = (hs(x0 * 13, y0 * 7) >>> 3) % 4,
    X1 = x1 + 1,
    Y1 = y1 + 1,
    ov = 0.3,
    HM = HM_H,
    ym = (y0 + Y1) / 2,
    half = (Y1 - y0) / 2,
    sl = 0.8,
    zR = HM + half * sl,
    zE = HM - sl * ov,
    P = [],
    V = HV[v],
    wc = V.w,
    rf = hs(x0, y0);
  const poly = (p, n, o) => {
    P.push(Object.assign({ p, n, sd: msShade(n) }, o));
  };
  const box = (ax, ay, az, bx, by, bz, o, top) => {
    poly(
      [
        [ax, by, az, 0, 1],
        [bx, by, az, 1, 1],
        [bx, by, bz, 1, 0],
        [ax, by, bz, 0, 0]
      ],
      [0, 1, 0],
      o
    );
    poly(
      [
        [bx, ay, az, 0, 1],
        [ax, ay, az, 1, 1],
        [ax, ay, bz, 1, 0],
        [bx, ay, bz, 0, 0]
      ],
      [0, -1, 0],
      o
    );
    poly(
      [
        [bx, by, az, 0, 1],
        [bx, ay, az, 1, 1],
        [bx, ay, bz, 1, 0],
        [bx, by, bz, 0, 0]
      ],
      [1, 0, 0],
      o
    );
    poly(
      [
        [ax, ay, az, 0, 1],
        [ax, by, az, 1, 1],
        [ax, by, bz, 1, 0],
        [ax, ay, bz, 0, 0]
      ],
      [-1, 0, 0],
      o
    );
    poly(
      [
        [ax, ay, bz, 0, 0],
        [bx, ay, bz, 1, 0],
        [bx, by, bz, 1, 1],
        [ax, by, bz, 0, 1]
      ],
      [0, 0, 1],
      top || o
    );
  };
  const dxs = {};
  for (const [a, b, c] of doors) if (b == y1) dxs[a] = c;
  const T0 = 0.3125;
  for (let i = x0; i <= x1; i++) {
    poly(
      [
        [i, Y1, 0, 0, 1],
        [i + 1, Y1, 0, 1, 1],
        [i + 1, Y1, HM, 1, T0],
        [i, Y1, HM, 0, T0]
      ],
      [0, 1, 0],
      { tx: dxs[i] ? 'dm' + dxs[i] + v : 'hm' + v }
    );
    poly(
      [
        [i + 1, y0, 0, 0, 1],
        [i, y0, 0, 1, 1],
        [i, y0, HM, 1, T0],
        [i + 1, y0, HM, 0, T0]
      ],
      [0, -1, 0],
      { tx: 'hm' + v }
    );
  }
  for (let j = y0; j <= y1; j++) {
    poly(
      [
        [x0, j, 0, 0, 1],
        [x0, j + 1, 0, 1, 1],
        [x0, j + 1, HM, 1, T0],
        [x0, j, HM, 0, T0]
      ],
      [-1, 0, 0],
      { tx: 'hm' + v }
    );
    poly(
      [
        [X1, j + 1, 0, 0, 1],
        [X1, j, 0, 1, 1],
        [X1, j, HM, 1, T0],
        [X1, j + 1, HM, 0, T0]
      ],
      [1, 0, 0],
      { tx: 'hm' + v }
    );
  }
  // pignons + lucarne
  for (const [xx, nx] of [
    [x0, -1],
    [X1, 1]
  ]) {
    poly(
      nx < 0
        ? [
            [xx, y0, HM],
            [xx, Y1, HM],
            [xx, ym, zR]
          ]
        : [
            [xx, Y1, HM],
            [xx, y0, HM],
            [xx, ym, zR]
          ],
      [nx, 0, 0],
      { col: wc }
    );
    const wy = 0.26,
      wz0 = HM + 0.3,
      wz1 = HM + 0.74,
      e = nx * 0.004;
    poly(
      [
        [xx + e, ym - wy - 0.05, wz0 - 0.05],
        [xx + e, ym + wy + 0.05, wz0 - 0.05],
        [xx + e, ym + wy + 0.05, wz1 + 0.05],
        [xx + e, ym - wy - 0.05, wz1 + 0.05]
      ],
      [nx, 0, 0],
      { col: V.tr }
    );
    poly(
      [
        [xx + e * 2, ym - wy, wz0],
        [xx + e * 2, ym + wy, wz0],
        [xx + e * 2, ym + wy, wz1],
        [xx + e * 2, ym - wy, wz1]
      ],
      [nx, 0, 0],
      { col: [160, 210, 250], glass: 1 }
    );
  }
  // toit
  const L = Math.hypot(Y1 + ov - ym, zR - zE),
    nn1 = [0, sl, 1],
    nn2 = [0, -sl, 1],
    ux = (X1 + ov - (x0 - ov)) * 1.2;
  poly(
    [
      [x0 - ov, Y1 + ov, zE, 0, L * 1.2],
      [X1 + ov, Y1 + ov, zE, ux, L * 1.2],
      [X1 + ov, ym, zR, ux, 0],
      [x0 - ov, ym, zR, 0, 0]
    ],
    nn1,
    { tx: 'roofS', rf: 1, rep: 1 }
  );
  poly(
    [
      [X1 + ov, y0 - ov, zE, 0, L * 1.2],
      [x0 - ov, y0 - ov, zE, ux, L * 1.2],
      [x0 - ov, ym, zR, ux, 0],
      [X1 + ov, ym, zR, 0, 0]
    ],
    nn2,
    { tx: 'roofS', rf: 1, rep: 1 }
  );
  box(x0 - ov - 0.03, ym - 0.09, zR - 0.03, X1 + ov + 0.03, ym + 0.09, zR + 0.08, { rfc: 0.78 });
  // sous-face + tranches
  const tk = 0.07,
    dkw = [92, 62, 42];
  for (const [yy, sg, nn] of [
    [Y1, 1, [0, -sl, -1]],
    [y0, -1, [0, sl, -1]]
  ]) {
    const ye = sg > 0 ? Y1 + ov : y0 - ov;
    poly(
      [
        [x0 - ov, ye, zE - tk],
        [X1 + ov, ye, zE - tk],
        [X1 + ov, yy, HM - tk],
        [x0 - ov, yy, HM - tk]
      ],
      nn,
      { col: dkw }
    );
    poly(
      [
        [x0 - ov, ye, zE - tk],
        [X1 + ov, ye, zE - tk],
        [X1 + ov, ye, zE + 0.01],
        [x0 - ov, ye, zE + 0.01]
      ],
      [0, sg, 0],
      { col: dkw }
    );
    for (const [xr, nx] of [
      [x0 - ov, -1],
      [X1 + ov, 1]
    ]) {
      poly(
        [
          [xr, ye, zE - tk],
          [xr, ye, zE],
          [xr, ym, zR],
          [xr, ym, zR - tk]
        ],
        [nx, 0, 0],
        { col: dkw }
      );
      poly(
        [
          [xr, ye, zE - tk],
          [xr - nx * -ov * 0 + (nx < 0 ? ov : -ov), ye, zE - tk],
          [xr + (nx < 0 ? ov : -ov), ym, zR - tk],
          [xr, ym, zR - tk]
        ],
        nn,
        { col: dkw }
      );
    }
  }
  // cheminée
  if ((rf >>> 5) % 3 != 2) {
    const cxx = x0 + (X1 - x0) * (0.22 + (0.5 * ((rf >>> 9) % 100)) / 100),
      side = (rf >>> 3) & 1 ? 1 : -1,
      cyy = ym + side * 0.5,
      zr = zR - Math.abs(cyy - ym) * sl,
      z0 = zr - 0.3,
      z1 = zR + 0.46;
    const bo = { tx: 'brick', rep: 1 };
    const q = 0.17;
    poly(
      [
        [cxx - q, cyy + q, z0, 0, 3],
        [cxx + q, cyy + q, z0, 1, 3],
        [cxx + q, cyy + q, z1, 1, 0],
        [cxx - q, cyy + q, z1, 0, 0]
      ],
      [0, 1, 0],
      bo
    );
    poly(
      [
        [cxx + q, cyy - q, z0, 0, 3],
        [cxx - q, cyy - q, z0, 1, 3],
        [cxx - q, cyy - q, z1, 1, 0],
        [cxx + q, cyy - q, z1, 0, 0]
      ],
      [0, -1, 0],
      bo
    );
    poly(
      [
        [cxx + q, cyy + q, z0, 0, 3],
        [cxx + q, cyy - q, z0, 1, 3],
        [cxx + q, cyy - q, z1, 1, 0],
        [cxx + q, cyy + q, z1, 0, 0]
      ],
      [1, 0, 0],
      bo
    );
    poly(
      [
        [cxx - q, cyy - q, z0, 0, 3],
        [cxx - q, cyy + q, z0, 1, 3],
        [cxx - q, cyy + q, z1, 1, 0],
        [cxx - q, cyy - q, z1, 0, 0]
      ],
      [-1, 0, 0],
      bo
    );
    box(cxx - q - 0.04, cyy - q - 0.04, z1, cxx + q + 0.04, cyy + q + 0.04, z1 + 0.06, {
      col: [120, 114, 106]
    });
    poly(
      [
        [cxx - 0.1, cyy - 0.1, z1 + 0.062],
        [cxx + 0.1, cyy - 0.1, z1 + 0.062],
        [cxx + 0.1, cyy + 0.1, z1 + 0.062],
        [cxx - 0.1, cyy + 0.1, z1 + 0.062]
      ],
      [0, 0, 1],
      { col: [22, 18, 18] }
    );
    var chim = [cxx, cyy, z1 + 0.1];
  }
  // perron + jardinières
  for (const a in dxs) {
    const d = +a;
    box(d + 0.04, Y1, 0, d + 0.96, Y1 + 0.4, 0.06, { col: [196, 190, 176] });
    box(d + 0.14, Y1, 0.06, d + 0.86, Y1 + 0.24, 0.12, { col: [206, 200, 186] });
  }
  for (let i = x0; i <= x1; i++) {
    if (dxs[i]) continue;
    box(i + 0.18, Y1, 0.24, i + 0.82, Y1 + 0.15, 0.37, { col: [128, 84, 50] }, { tx: 'fbox', rep: 0 });
  }
  // ---- variantes selon le type de bâtiment ----
  const kind = doors.length ? doors[0][2] : 'H',
    Cx = { P, HM, sl, Y1, wc, V },
    mid = (x0 + X1) / 2,
    dxn = +Object.keys(dxs)[0];
  let rt = null,
    dz = null;
  if (kind == 'C') {
    rt = [206, 62, 58];
    dz = { xc: mid, cross: 1 };
  } else if (kind == 'L') {
    rt = [84, 104, 160];
    const tx = dxn + 0.5 >= mid ? x0 + 0.62 : X1 - 0.62;
    feTower(Cx, tx, Y1 - 0.4, 0.58, 0, HM + 1.55, { dome: 1 });
  } else if (kind == 'B') {
    rt = [216, 170, 54];
    for (const [tx, ci] of [
      [x0 + 0.35, x0],
      [X1 - 0.35, x1]
    ])
      if (dxs[ci] === undefined) feTower(Cx, tx, Y1 - 0.35, 0.46, 0, HM + 0.75, { flag: [240, 200, 40] });
  } else if (kind == 'K') {
    fePorch(Cx, dxn);
  }
  if (kind == 'H' || kind == 'K') {
    const wd = x1 - x0 + 1;
    if (wd >= 6 || (rf >>> 7) % 3 == 0)
      dz = {
        xc:
          chim && chim[1] > ym && Math.abs(chim[0] - mid) < 1.6 ? (chim[0] < mid ? X1 - 1.3 : x0 + 1.3) : mid
      };
  }
  if (dz) feDormer(Cx, dz.xc, 0.3, 0.42, { cross: dz.cross });
  for (let i = x0; i <= x1; i++) if (!dxs[i]) feShutters(Cx, i);
  let cx = (x0 + X1) / 2,
    cy = (y0 + Y1) / 2;
  return {
    x0,
    y0,
    X1,
    Y1,
    cx,
    cy,
    zR,
    rad: Math.hypot(X1 - x0 + 1, Y1 - y0 + 1) * 0.5 + 0.6,
    v,
    polys: P,
    chim,
    rf,
    rt
  };
}
function drawMesh(q) {
  const { d32, wz, zb, W, H, hz, eye, F, px, py, dX, dY, pX, pY, fS, fE, fogC, nr, ng, nb, wlit, TX, pk } = q,
    inv = 1 / (pX * dY - dX * pY),
    hw = W / 2,
    NEAR = 0.14,
    rcs = ROOF.map(hex3),
    B0 = houseBlocks(q.g);
  const A = [0, 0, 0, 0, 0],
    Bv = [0, 0, 0, 0, 0],
    Cv = [0, 0, 0, 0, 0];
  const tri = (a, b, c, P, T, tint, col, sd, rep) => {
    const minx = Math.max(0, Math.floor(Math.min(a[0], b[0], c[0]))),
      maxx = Math.min(W - 1, Math.ceil(Math.max(a[0], b[0], c[0]))),
      miny = Math.max(0, Math.floor(Math.min(a[1], b[1], c[1]))),
      maxy = Math.min(H - 1, Math.ceil(Math.max(a[1], b[1], c[1])));
    const area = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
    if (Math.abs(area) < 1e-5) return;
    const ia = 1 / area,
      eps = -0.002;
    for (let y = miny; y <= maxy; y++) {
      const yc = y + 0.5;
      for (let x = minx; x <= maxx; x++) {
        const xc = x + 0.5,
          w0 = ((b[0] - xc) * (c[1] - yc) - (c[0] - xc) * (b[1] - yc)) * ia,
          w1 = ((c[0] - xc) * (a[1] - yc) - (a[0] - xc) * (c[1] - yc)) * ia,
          w2 = 1 - w0 - w1;
        if (w0 < eps || w1 < eps || w2 < eps) continue;
        const iw = w0 * a[2] + w1 * b[2] + w2 * c[2],
          idx = y * W + x;
        if (iw <= wz[idx]) continue;
        let r,
          g2,
          bb,
          lit = 0;
        if (T) {
          let u = (w0 * a[3] + w1 * b[3] + w2 * c[3]) / iw,
            v = (w0 * a[4] + w1 * b[4] + w2 * c[4]) / iw,
            ui,
            vi;
          if (rep) {
            ui = ((u * TS) | 0) & 63;
            vi = ((v * TS) | 0) & 63;
          } else {
            ui = u < 0 ? 0 : u > 0.999 ? 63 : (u * TS) | 0;
            vi = v < 0 ? 0 : v > 0.999 ? 63 : (v * TS) | 0;
          }
          const ti = (vi * TS + ui) * 4,
            al = T[ti + 3];
          if (!al) continue;
          if (tint) {
            const s = T[ti] / 150;
            r = tint[0] * s;
            g2 = tint[1] * s;
            bb = tint[2] * s;
          } else if (al == 2 && wlit) {
            r = 255;
            g2 = 206 + (vi % 5) * 3;
            bb = 112;
            lit = 1;
          } else {
            r = T[ti];
            g2 = T[ti + 1];
            bb = T[ti + 2];
          }
        } else {
          r = col[0];
          g2 = col[1];
          bb = col[2];
          if (P.glass && wlit) {
            r = 255;
            g2 = 214;
            bb = 120;
            lit = 1;
          }
        }
        wz[idx] = iw;
        const d = 1 / iw,
          ff = Math.max(0, Math.min(1, (d - fS) / (fE - fS)));
        r *= sd;
        g2 *= sd;
        bb *= sd;
        if (!lit) {
          r *= nr;
          g2 *= ng;
          bb *= nb;
        }
        d32[idx] = pk(r + (fogC[0] - r) * ff, g2 + (fogC[1] - g2) * ff, bb + (fogC[2] - bb) * ff);
        if (d < zb[x]) zb[x] = d;
      }
    }
  };
  for (const B of B0) {
    const bx = B.cx - px,
      by = B.cy - py,
      bd = Math.hypot(bx, by);
    if (bd - B.rad > fE + 1) continue;
    if (inv * (-pY * bx + pX * by) < -B.rad) continue;
    const rc = B.rt || rcs[((B.x0 >> 2) + G.map) % 4];
    for (const P of B.polys) {
      const p0 = P.p[0];
      if (P.n[0] * (px - p0[0]) + P.n[1] * (py - p0[1]) + P.n[2] * (eye - p0[2]) <= 0) continue;
      let pts = [];
      for (const v of P.p) {
        const sx = v[0] - px,
          sy = v[1] - py;
        pts.push([inv * (dY * sx - dX * sy), inv * (-pY * sx + pX * sy), v[2], v[3] || 0, v[4] || 0]);
      }
      // coupe au plan proche
      const cl = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i],
          b = pts[(i + 1) % pts.length],
          ain = a[1] >= NEAR,
          bin = b[1] >= NEAR;
        if (ain) cl.push(a);
        if (ain != bin) {
          const k = (NEAR - a[1]) / (b[1] - a[1]);
          cl.push([
            a[0] + (b[0] - a[0]) * k,
            NEAR,
            a[2] + (b[2] - a[2]) * k,
            a[3] + (b[3] - a[3]) * k,
            a[4] + (b[4] - a[4]) * k
          ]);
        }
      }
      if (cl.length < 3) continue;
      const sp = cl.map(v => {
        const iw = 1 / v[1];
        return [hw * (1 + v[0] * iw), hz + F * iw * (eye - v[2]), iw, v[3] * iw, v[4] * iw];
      });
      const sdv = q.sun ? msShade(P.n, q.sun.L) : P.sd,
        T = P.tx ? TX[P.tx] : null;
      let tint = null,
        col = P.col;
      if (P.rf) tint = rc;
      if (P.rfc) col = [rc[0] * P.rfc, rc[1] * P.rfc, rc[2] * P.rfc];
      if (!T && !col) col = [200, 200, 200];
      for (let i = 1; i < sp.length - 1; i++) tri(sp[0], sp[i], sp[i + 1], P, T, tint, col, sdv, P.rep);
    }
  }
}
