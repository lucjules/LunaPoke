// Personnages humains en 3D (style chibi)
// ---------- PERSONNAGES EN 3D (style chibi, comme les créatures) ----------
// A : {w:amplitude marche, ph:phase, wave:0..1, pt:0..1 pointer, jump:hauteur, sd:graine}
function mdHuman(t, L, A) {
  A = A || {};
  const o = [],
    br = Math.sin(t / 760) * 0.008,
    bl = blinkK(t + (A.sd || 0) * 733);
  const SK = L.skin || '#ffd7a8',
    HR = L.hair || '#3a2a1a',
    SH = L.shirt || '#4a8a4a',
    PA = L.pants || '#3a3a55',
    CO = L.coat || null,
    w = A.w || 0,
    ph = A.ph || 0,
    sw = Math.sin(ph) * w,
    jp = A.jump || 0,
    y0 = jp;
  const hx = c => hex3(c),
    sh = (c, f) => {
      const h = hx(c);
      return (
        '#' +
        h
          .map(v =>
            Math.max(0, Math.min(255, (v * f) | 0))
              .toString(16)
              .padStart(2, '0')
          )
          .join('')
      );
    };
  const limb = (b, th, fi, len, r, col, s, op) => {
    const sT = Math.sin(th),
      cT = Math.cos(th),
      sF = Math.sin(fi),
      cF = Math.cos(fi),
      dx = s * sT,
      dy = -cT * cF,
      dz = cT * sF,
      rx = Math.asin(Math.max(-1, Math.min(1, -cT * sF))),
      rz = Math.atan2(s * sT, cT * cF);
    o.push(
      MP(
        [b[0] + (dx * len) / 2, b[1] + (dy * len) / 2, b[2] + (dz * len) / 2],
        [r[0], len / 2 + r[1], r[0]],
        col,
        Object.assign({ rot: [rx, 0, rz] }, op || {})
      )
    );
    return [b[0] + dx * len, b[1] + dy * len, b[2] + dz * len];
  };
  const bell = !!L.robe,
    hipY = 0.34 + y0;
  // jambes + chaussures
  if (bell) {
    o.push(MP([0, 0.3 + y0, 0], [0.3, 0.3, 0.25], L.robe, { g: 0.1 }));
    o.push(MP([0, 0.06 + y0, 0], [0.33, 0.05, 0.28], sh(L.robe, 0.7), { ao: 1 }));
    for (const s of [-1, 1])
      o.push(MP([s * 0.1, 0.035 + y0, 0.16 + s * sw * 0.05], [0.075, 0.04, 0.11], '#3a2a20'));
  } else
    for (const s of [-1, 1]) {
      const a = s * sw * 0.62,
        f = limb([s * 0.095, hipY, 0], 0.03, a, 0.235, [0.075, 0.02], PA, s);
      o.push(
        MP(
          [f[0], Math.max(0.04, f[1] - 0.02) + y0 * 0, f[2] + 0.035],
          [0.088, 0.056, 0.13],
          L.shoe || '#2c2622',
          { ao: 1, g: 0.15 }
        )
      );
    }
  // bassin + torse
  if (!bell) {
    o.push(MP([0, hipY + 0.01, 0], [0.19, 0.11, 0.15], PA, { g: 0.05 }));
  }
  o.push(MP([0, 0.54 + br + y0, 0], [0.205, 0.2, 0.155], SH, { g: 0.12 }));
  if (CO) {
    o.push(MP([0, 0.4 + br + y0, 0], [0.24, 0.27, 0.185], CO, { g: 0.1 }));
    o.push(MP([0, 0.57 + br + y0, 0.1], [0.075, 0.17, 0.09], SH));
    o.push(MP([0, 0.3 + y0, 0.15], [0.02, 0.2, 0.04], sh(CO, 0.8)));
  } else {
    o.push(MP([0, 0.42 + y0, 0], [0.2, 0.03, 0.155], '#34283c'));
    o.push(MP([0, 0.42 + y0, 0.15], [0.04, 0.026, 0.02], '#e8c050', { g: 0.6 }));
  }
  o.push(MP([0, 0.69 + br + y0, 0.02], [0.135, 0.045, 0.115], sh(CO || SH, 1.18)));
  o.push(MP([0, 0.725 + br + y0, 0], [0.065, 0.05, 0.065], SK));
  // bras
  const col = CO || SH,
    sh0 = [0, 0.61 + br + y0, 0],
    wv = A.wave || 0,
    pt = A.pt || 0,
    idl = Math.sin(t / 900 + (A.sd || 0)) * 0.03;
  for (const s of [-1, 1]) {
    const base = [s * 0.225, sh0[1], 0];
    let th = 0.16 + idl,
      fi = -s * sw * 0.55;
    if (s == 1) {
      if (wv > 0) {
        th = 2.3 + Math.sin(t / 120) * 0.28 * wv;
        fi = 0.15;
      } else if (pt > 0) {
        th = 0.25;
        fi = 1.45 * pt;
      }
    }
    if (A.broom) {
      th = 0.3;
      fi = 1.12 + Math.sin(t / 350 + s) * 0.1;
    }
    const hd = limb(base, th, fi, 0.2, [0.062, 0.02], col, s);
    o.push(MP(hd, [0.058, 0.058, 0.058], SK, { g: 0.1 }));
  }
  if (A.broom) {
    const bx = Math.sin(t / 350) * 0.16;
    o.push(MP([bx * 0.5, 0.27, 0.36], [0.013, 0.28, 0.013], '#8a6a3a', { rot: [-0.53, 0, 0] }));
    o.push(MP([bx, 0.04, 0.52], [0.075, 0.04, 0.055], '#c8a45a', { g: 0.1 }));
  }
  if (L.back) {
    o.push(MP([0, 0.5 + br + y0, -0.17], [0.14, 0.17, 0.075], L.back, { g: 0.1 }));
    o.push(MP([0, 0.63 + br + y0, -0.17], [0.1, 0.035, 0.07], sh(L.back, 1.25)));
  }
  if (L.apron) {
    o.push(MP([0, 0.37 + y0, 0.162], [0.13, 0.17, 0.012], L.apron, { g: 0.1 }));
    o.push(MP([0, 0.53 + br + y0, 0.162], [0.08, 0.07, 0.01], L.apron));
  }
  // tête
  const hy = 0.92 + br * 1.5 + y0;
  o.push(MP([0, hy, 0], [0.265, 0.25, 0.24], SK, { g: 0.15 }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.092, hy + 0.012, 0.218], [0.04, 0.058 * bl, 0.028], '#1a1418', { g: 0.9 }));
    o.push(MP([s * 0.092 + s * 0.012, hy + 0.034, 0.238], [0.016, 0.02 * bl, 0.012], '#fff', { e: 1 }));
    o.push(MP([s * 0.092, hy + 0.092, 0.2], [0.052, 0.012, 0.02], HR, { rot: [0, 0, s * 0.14] }));
    o.push(MP([s * 0.158, hy - 0.062, 0.17], [0.05, 0.032, 0.025], '#ff9aa8'));
    o.push(MP([s * 0.256, hy - 0.01, 0.0], [0.03, 0.048, 0.04], SK));
  }
  o.push(MP([0, hy - 0.115, 0.225], [0.034, 0.011, 0.012], '#a8443f'));
  o.push(MP([0, hy - 0.035, 0.242], [0.02, 0.018, 0.016], sh(SK, 0.9)));
  if (L.glasses) {
    const gc = L.glasses;
    for (const s of [-1, 1]) {
      o.push(MP([s * 0.092, hy + 0.052, 0.248], [0.056, 0.009, 0.008], gc));
      o.push(MP([s * 0.092, hy - 0.03, 0.248], [0.056, 0.009, 0.008], gc));
      o.push(MP([s * 0.092 + s * 0.052, hy + 0.01, 0.248], [0.009, 0.044, 0.008], gc));
      o.push(MP([s * 0.092 - s * 0.052, hy + 0.01, 0.248], [0.009, 0.044, 0.008], gc));
    }
    o.push(MP([0, hy + 0.02, 0.25], [0.03, 0.008, 0.008], gc));
  }
  if (L.scarf) {
    o.push(MP([0, 0.69 + br + y0, 0.02], [0.155, 0.055, 0.13], L.scarf, { g: 0.1 }));
    o.push(MP([0.075, 0.6 + br + y0, 0.14], [0.04, 0.11, 0.02], L.scarf));
  }
  // cheveux
  const noH = L.wiz && !L.beard;
  if (!noH) {
    o.push(MP([0, hy + 0.04, -0.04], [0.275, 0.25, 0.255], HR, { g: 0.25 }));
    o.push(MP([0, hy + 0.14, 0.13], [0.225, 0.085, 0.13], HR, { g: 0.2 }));
    for (const s of [-1, 1]) o.push(MP([s * 0.215, hy - 0.01, 0.02], [0.07, 0.14, 0.15], HR));
    if (!L.hat && !L.wiz && !L.crown) o.push(MP([0.03, hy + 0.26, 0.03], [0.045, 0.06, 0.045], HR));
  }
  if (L.long) {
    o.push(MP([0, hy - 0.17, -0.14], [0.255, 0.33, 0.13], HR, { g: 0.2 }));
    for (const s of [-1, 1]) o.push(MP([s * 0.245, hy - 0.12, 0.05], [0.05, 0.2, 0.08], HR));
  }
  if (L.beard) {
    o.push(MP([0, hy - 0.15, 0.13], [0.17, 0.14, 0.12], HR, { g: 0.15 }));
    o.push(MP([0, hy - 0.085, 0.21], [0.085, 0.022, 0.03], HR));
  }
  if (L.hat) {
    const hc = L.hat;
    o.push(MP([0, hy + 0.11, -0.01], [0.29, 0.17, 0.27], hc, { g: 0.25 }));
    o.push(MP([0, hy + 0.08, 0.2], [0.235, 0.03, 0.17], hc, { g: 0.3, rot: [0.2, 0, 0] }));
  }
  if (L.wiz) {
    const wc = L.wiz;
    o.push(MP([0, hy + 0.1, 0], [0.42, 0.045, 0.38], wc, { g: 0.2 }));
    o.push(MP([0, hy + 0.2, 0], [0.25, 0.13, 0.23], wc));
    o.push(MP([0.03, hy + 0.34, 0], [0.17, 0.14, 0.16], wc));
    o.push(MP([0.09, hy + 0.47, 0], [0.08, 0.12, 0.08], wc));
    o.push(MP([0, hy + 0.12, 0.0], [0.27, 0.025, 0.25], '#ffd23f', { e: 1 }));
  }
  if (L.crown) {
    for (let i = 0; i < 5; i++) {
      const a = -0.9 + i * 0.45;
      o.push(
        MP(
          [Math.sin(a) * 0.2, hy + 0.255 + (i % 2 ? 0 : 0.05), Math.cos(a) * 0.1],
          [0.034, 0.065 + (i % 2 ? 0 : 0.025), 0.034],
          '#ffd23f',
          { e: 1 }
        )
      );
    }
    o.push(MP([0, hy + 0.205, 0], [0.22, 0.04, 0.2], '#ffd23f', { e: 1 }));
  }
  const sc = L.wiz ? 0.86 : 1;
  if (sc != 1)
    for (const q of o) {
      q.p = [q.p[0] * sc, q.p[1] * sc, q.p[2] * sc];
      q.r = [q.r[0] * sc, q.r[1] * sc, q.r[2] * sc];
    }
  return o;
}
function humFor(L, key, t, yaw, A, R) {
  V3.mdt = V3.mdt || {};
  if (V3.hbT !== Math.floor(t / 12)) {
    V3.hbT = Math.floor(t / 12);
    V3.hb = 0;
  }
  V3.hb = V3.hb || 0;
  const q = V3.mdt[key];
  R = R || 88;
  if (q && t - q.t < (A && A.slow ? 110 : 40) && t >= q.t && V3.mdc && V3.mdc[key]) return V3.mdc[key];
  if (q && V3.hb >= 4 && V3.mdc && V3.mdc[key]) return V3.mdc[key];
  if (V3.hb >= 6) return null;
  V3.hb++;
  V3.mdt[key] = { t };
  return mdRender(mdHuman(t, L, A), key, R, yaw, 0.1, { t });
}
