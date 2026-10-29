// Modèles 3D des créatures (ellipsoïdes, ombrage « toon »)
// ---------- vrais modèles 3D (ellipsoïdes lancés par rayons, ombrage « toon » + contours) ----------
const MDm = (rx, ry, rz) => {
  const cx = Math.cos(rx),
    sx = Math.sin(rx),
    cy = Math.cos(ry),
    sy = Math.sin(ry),
    cz = Math.cos(rz),
    sz = Math.sin(rz);
  return [
    cz * cy,
    cz * sy * sx - sz * cx,
    cz * sy * cx + sz * sx,
    sz * cy,
    sz * sy * sx + cz * cx,
    sz * sy * cx - cz * sx,
    -sy,
    cy * sx,
    cy * cx
  ];
};
const MDx = (A, B) => {
  const r = new Array(9);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      r[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j];
  return r;
};
const MP = (p, r, c, o) => Object.assign({ p, r, c: typeof c == 'string' ? hex3(c) : c, rot: null }, o || {});
const MD = {};
const mdLight = (() => {
    const l = [-0.45, 0.72, 0.55],
      n = Math.hypot(...l);
    return l.map(v => v / n);
  })(),
  mdH = (() => {
    const l = [mdLight[0], mdLight[1], mdLight[2] + 1],
      n = Math.hypot(...l);
    return l.map(v => v / n);
  })();
function mdBuf(R) {
  V3.mdb = V3.mdb || {};
  let b = V3.mdb[R];
  if (b) return b;
  const cv = cv3(R, R),
    c = cv.getContext('2d'),
    id = c.createImageData(R, R);
  return (V3.mdb[R] = {
    cv,
    c,
    id,
    d32: new Uint32Array(id.data.buffer),
    z: new Float32Array(R * R),
    pid: new Int16Array(R * R),
    col: new Uint32Array(R * R)
  });
}
// rend un modèle dans un canvas R×R ; vue orthographique, y de -0.08 à 1.42
function mdRender(prims, key, R, yaw, pitch, o) {
  o = o || {};
  const B = mdBuf(R),
    d32 = B.d32,
    zb = B.z,
    pb = B.pid;
  V3.mdc = V3.mdc || {};
  let out = V3.mdc[key];
  if (!out) {
    out = V3.mdc[key] = cv3(R, R);
  }
  zb.fill(-1e9);
  pb.fill(-1);
  d32.fill(0);
  const W = 1.5,
    Y0 = 1.42,
    s = W / R,
    Z0 = 6,
    M0 = MDx(MDm(pitch, 0, 0), MDm(0, yaw, 0)),
    L = mdLight,
    H = mdH,
    bri = o.bri || 1,
    fl = o.flash || 0;
  for (let pi = 0; pi < prims.length; pi++) {
    const pr = prims[pi],
      p = pr.p,
      rr = pr.r;
    const cxm = M0[0] * p[0] + M0[1] * p[1] + M0[2] * p[2],
      cym = M0[3] * p[0] + M0[4] * p[1] + M0[5] * p[2],
      czm = M0[6] * p[0] + M0[7] * p[1] + M0[8] * p[2];
    const M = pr.rot ? MDx(M0, MDm(pr.rot[0], pr.rot[1], pr.rot[2])) : M0,
      rx = rr[0],
      ry = rr[1],
      rz = rr[2],
      ux = M[0] / rx,
      uy = M[1] / ry,
      uz = M[2] / rz,
      vx = M[3] / rx,
      vy = M[4] / ry,
      vz = M[5] / rz,
      wx = M[6] / rx,
      wy = M[7] / ry,
      wz = M[8] / rz,
      A = wx * wx + wy * wy + wz * wz,
      obx = -ux * cxm - vx * cym + wx * (Z0 - czm),
      oby = -uy * cxm - vy * cym + wy * (Z0 - czm),
      obz = -uz * cxm - vz * cym + wz * (Z0 - czm),
      bx = !!pr.box,
      rho = (bx ? Math.hypot(rx, ry, rz) : Math.max(rx, ry, rz)) * 1.04,
      i0 = Math.max(0, Math.floor((cxm - rho + W / 2) / s)),
      i1 = Math.min(R - 1, Math.ceil((cxm + rho + W / 2) / s)),
      j0 = Math.max(0, Math.floor((Y0 - cym - rho) / s)),
      j1 = Math.min(R - 1, Math.ceil((Y0 - cym + rho) / s)),
      cr = pr.c[0] * bri,
      cg = pr.c[1] * bri,
      cb = pr.c[2] * bri,
      gl = pr.g || 0,
      em = pr.e || 0;
    for (let j = j0; j <= j1; j++) {
      const py = Y0 - (j + 0.5) * s;
      for (let i = i0; i <= i1; i++) {
        const px = (i + 0.5) * s - W / 2,
          ox = obx + ux * px + vx * py,
          oy = oby + uy * px + vy * py,
          oz = obz + uz * px + vz * py,
          ow = ox * wx + oy * wy + oz * wz;
        let t, qx, qy, qz;
        if (bx) {
          // pavé : intersection du rayon avec le cube unité (méthode des tranches)
          let tn = -1e9,
            tf = 1e9,
            ax = 0;
          const O = [ox, oy, oz],
            Wd = [wx, wy, wz];
          for (let a = 0; a < 3; a++) {
            if (Math.abs(Wd[a]) < 1e-9) {
              if (Math.abs(O[a]) > 1) tn = 2e9;
              continue;
            }
            const t1 = (O[a] - 1) / Wd[a],
              t2 = (O[a] + 1) / Wd[a],
              lo = Math.min(t1, t2),
              hi = Math.max(t1, t2);
            if (lo > tn) {
              tn = lo;
              ax = a;
            }
            if (hi < tf) tf = hi;
          }
          if (tn > tf) continue;
          t = tn;
          // normale de la face touchée, dans le repère local
          const sg = O[ax] - t * Wd[ax] >= 0 ? 1 : -1;
          qx = ax == 0 ? sg : 0;
          qy = ax == 1 ? sg : 0;
          qz = ax == 2 ? sg : 0;
        } else {
          const disc = ow * ow - A * (ox * ox + oy * oy + oz * oz - 1);
          if (disc <= 0) continue;
          t = (ow - Math.sqrt(disc)) / A;
          qx = (ox - t * wx) / rx;
          qy = (oy - t * wy) / ry;
          qz = (oz - t * wz) / rz;
        }
        const z = Z0 - t,
          k = j * R + i;
        if (z <= zb[k]) continue;
        zb[k] = z;
        pb[k] = pi;
        let nx = M[0] * qx + M[1] * qy + M[2] * qz,
          ny = M[3] * qx + M[4] * qy + M[5] * qz,
          nz = M[6] * qx + M[7] * qy + M[8] * qz;
        const nl = 1 / Math.hypot(nx, ny, nz);
        nx *= nl;
        ny *= nl;
        nz *= nl;
        let r, g, b;
        if (em) {
          const f = 1 + 0.12 * Math.sin(o.t / 120 + pi);
          r = Math.min(255, cr * f);
          g = Math.min(255, cg * f);
          b = Math.min(255, cb * f);
        } else {
          const d = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
          let sh = 0.5 + 0.52 * Math.min(1, d / 0.8);
          sh = Math.round(sh * 5) / 5;
          if (pr.ao && ny < 0.1) sh *= 0.78;
          const rim = Math.pow(1 - Math.max(0, nz), 2.4) * 0.28,
            sp = gl ? Math.pow(Math.max(0, nx * H[0] + ny * H[1] + nz * H[2]), 34) * gl * 210 : 0;
          r = cr * sh + rim * 70 + sp;
          g = cg * sh + rim * 95 + sp;
          b = cb * sh + rim * 130 + sp;
        }
        if (fl) {
          r += (255 - r) * fl;
          g += (255 - g) * fl;
          b += (255 - b) * fl;
        }
        d32[k] = (255 << 24) | ((b > 255 ? 255 : b) << 16) | ((g > 255 ? 255 : g) << 8) | (r > 255 ? 255 : r);
      }
    }
  }
  // contours
  for (let j = 0; j < R; j++)
    for (let i = 0; i < R; i++) {
      const k = j * R + i,
        id = pb[k];
      if (id < 0) continue;
      let e = 0;
      const z = zb[k];
      if (
        i == 0 ||
        pb[k - 1] < 0 ||
        j == 0 ||
        pb[k - R] < 0 ||
        i == R - 1 ||
        pb[k + 1] < 0 ||
        j == R - 1 ||
        pb[k + R] < 0
      )
        e = 2;
      else {
        const zl = zb[k - 1],
          zr = zb[k + 1],
          zu = zb[k - R],
          zd = zb[k + R];
        if (zl - z > 0.06 || zr - z > 0.06 || zu - z > 0.06 || zd - z > 0.06) e = 1;
      }
      if (e) {
        const c = d32[k],
          f = e == 2 ? 0.3 : 0.62;
        d32[k] =
          (255 << 24) |
          ((((c >> 16) & 255) * f * 0.9) << 16) |
          ((((c >> 8) & 255) * f * 0.85) << 8) |
          ((c & 255) * f);
      }
    }
  B.c.putImageData(B.id, 0, 0);
  const oc = out.getContext('2d');
  oc.clearRect(0, 0, R, R);
  oc.drawImage(B.cv, 0, 0);
  return out;
}
function tailChain(o, n, fn, col1, col2, r0, r1) {
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1),
      q = fn(u);
    o.push(
      MP(
        q,
        [
          r0 + (r1 - r0) * Math.sin(u * Math.PI * 0.9 + 0.3) * 0.6 + 0.02,
          r0 + (r1 - r0) * Math.sin(u * Math.PI * 0.9 + 0.3) * 0.6 + 0.02,
          r0 * 0.95
        ],
        i % 2 ? col1 : col2,
        { g: 0.1 }
      )
    );
  }
}
const blinkK = t => (t % 3900 < 130 ? 0.12 : 1);
// Braisou — renard de feu
MD[0] = t => {
  const o = [],
    br = Math.sin(t / 620) * 0.012,
    wag = Math.sin(t / 430),
    ear = Math.sin(t / 950) * 0.07,
    bl = blinkK(t);
  const OR = '#ee6a2c',
    OD = '#c9481f',
    CR = '#ffd5a8',
    BR = '#74291a',
    YL = '#ffc84a';
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.15, 0.075, 0.13], [0.125, 0.075, 0.155], BR, { ao: 1 }));
    o.push(MP([s * 0.15, 0.2, 0.04], [0.1, 0.13, 0.1], OD));
  }
  o.push(MP([0, 0.4 + br, 0], [0.27, 0.26 + br, 0.23], OR, { g: 0.2 }));
  o.push(MP([0, 0.38 + br, 0.14], [0.17, 0.19, 0.12], CR));
  for (const s of [-1, 1])
    o.push(MP([s * 0.3, 0.42 + br, 0.09], [0.075, 0.13, 0.075], OD, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.83 + br, 0.02], [0.37, 0.29, 0.31], OR, { g: 0.25 }));
  o.push(MP([0, 0.745 + br, 0.25], [0.175, 0.12, 0.11], CR));
  o.push(MP([0, 0.78 + br, 0.345], [0.042, 0.03, 0.03], '#3a1810', { g: 0.7 }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.145, 0.875 + br, 0.285], [0.052, 0.07 * bl, 0.03], '#1a1010', { g: 0.9 }));
    o.push(MP([s * 0.145 + s * 0.013, 0.9 + br, 0.312], [0.019, 0.021 * bl, 0.012], '#ffffff', { e: 1 }));
    o.push(MP([s * 0.235, 0.765 + br, 0.25], [0.055, 0.036, 0.03], '#ff8f7c'));
    o.push(MP([s * 0.24, 1.1 + br, 0.0], [0.12, 0.18, 0.06], OR, { rot: [0, 0, -s * (0.5 + ear)], g: 0.15 }));
    o.push(MP([s * 0.235, 1.09 + br, 0.04], [0.07, 0.12, 0.03], CR, { rot: [0, 0, -s * (0.5 + ear)] }));
    o.push(MP([s * 0.315, 1.25 + br, 0], [0.055, 0.075, 0.045], YL, { rot: [0, 0, -s * (0.5 + ear)], e: 1 }));
  }
  o.push(MP([0, 1.14 + br, 0.03], [0.06, 0.11, 0.05], YL, { e: 1 }));
  o.push(MP([-0.1, 1.1 + br, 0.03], [0.045, 0.085, 0.045], YL, { rot: [0, 0, 0.35], e: 1 }));
  o.push(MP([0.1, 1.1 + br, 0.03], [0.045, 0.085, 0.045], YL, { rot: [0, 0, -0.35], e: 1 }));
  tailChain(
    o,
    6,
    u => [
      0.1 + u * 0.38 + wag * 0.05 * u,
      0.3 + u * 0.52 - u * u * 0.05 + Math.sin(t / 300 + u * 3) * 0.01,
      -0.2 - u * 0.14
    ],
    '#8a3a1c',
    '#b8732e',
    0.1,
    0.15
  );
  o.push(MP([0.5 + wag * 0.06, 0.9, -0.34], [0.16, 0.2, 0.15], '#ff8a1c', { e: 1 }));
  o.push(
    MP([0.5 + wag * 0.07, 1.06 + Math.sin(t / 140) * 0.03, -0.34], [0.09, 0.14, 0.09], '#ffd24a', { e: 1 })
  );
  return o;
};
// Ondin — méduse d'eau
MD[1] = t => {
  const o = [],
    bob = Math.sin(t / 700) * 0.02,
    bl = blinkK(t + 900);
  const BL = '#3f86dc',
    BD = '#2a64b8',
    LT = '#a9d6ff',
    DR = '#d6eeff';
  for (const [sx, sz, i] of [
    [-1, 1, 0],
    [1, 1, 1],
    [-1, -1, 2],
    [1, -1, 3]
  ]) {
    const sw = Math.sin(t / 520 + i * 1.7) * 0.03,
      ph = sz < 0 ? 0.85 : 1;
    o.push(MP([sx * 0.32 * ph, 0.33, sz * 0.17], [0.1, 0.1, 0.1], BD));
    o.push(MP([sx * (0.46 + sw) * ph, 0.21, sz * 0.23], [0.09, 0.11, 0.09], BD, { rot: [0, 0, sx * 0.5] }));
    o.push(MP([sx * (0.52 + sw * 1.4) * ph, 0.07, sz * 0.3], [0.085, 0.07, 0.09], BD, { ao: 1 }));
  }
  o.push(MP([0, 0.34, 0], [0.36, 0.1, 0.31], BD, { ao: 1 }));
  o.push(MP([0, 0.58 + bob, 0], [0.43, 0.37, 0.39], BL, { g: 0.4 }));
  o.push(MP([0, 0.5 + bob, 0.2], [0.29, 0.24, 0.2], '#68a8ef'));
  o.push(MP([0, 0.97 + bob, 0], [0.13, 0.08, 0.12], BL));
  o.push(MP([0, 1.12 + bob, 0], [0.115, 0.17, 0.105], '#9fd2ff', { g: 1 }));
  o.push(MP([0, 1.27 + bob, 0], [0.06, 0.09, 0.06], '#cfeaff', { g: 1 }));
  o.push(MP([-0.04, 1.15 + bob, 0.07], [0.025, 0.05, 0.02], '#ffffff', { e: 1 }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.16, 0.64 + bob, 0.33], [0.055, 0.072 * bl, 0.03], '#141a2a', { g: 0.9 }));
    o.push(MP([s * 0.16 + s * 0.014, 0.665 + bob, 0.36], [0.02, 0.022 * bl, 0.012], '#ffffff', { e: 1 }));
    o.push(MP([s * 0.29, 0.55 + bob, 0.27], [0.058, 0.038, 0.03], '#ff8fa0'));
  }
  o.push(MP([0, 0.5 + bob, 0.37], [0.05, 0.016, 0.02], '#1a2a4a'));
  return o;
};
// Feuillon — grenouille-feuille
MD[2] = t => {
  const o = [],
    br = Math.sin(t / 640) * 0.012,
    sway = Math.sin(t / 800) * 0.06,
    bl = blinkK(t + 1700);
  const GR = '#6cc04c',
    GD = '#4a9a34',
    GL = '#c2ee90',
    LF = '#b9e866',
    LD = '#7cc04a',
    FT = '#2f6e28';
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.17, 0.075, 0.135], [0.135, 0.075, 0.155], FT, { ao: 1 }));
    o.push(MP([s * 0.17, 0.2, 0.04], [0.1, 0.13, 0.1], GD));
  }
  o.push(MP([0, 0.4 + br, 0], [0.31, 0.3 + br, 0.27], GR, { g: 0.2 }));
  o.push(MP([0, 0.36 + br, 0.16], [0.2, 0.22, 0.13], GL));
  for (const s of [-1, 1])
    o.push(MP([s * 0.32, 0.43 + br, 0.09], [0.08, 0.13, 0.08], GD, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.83 + br, 0.02], [0.36, 0.28, 0.31], GR, { g: 0.25 }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.135, 0.87 + br, 0.285], [0.058, 0.075 * bl, 0.032], '#142010', { g: 0.9 }));
    o.push(MP([s * 0.135 + s * 0.014, 0.895 + br, 0.315], [0.02, 0.023 * bl, 0.012], '#ffffff', { e: 1 }));
    o.push(MP([s * 0.235, 0.77 + br, 0.26], [0.056, 0.036, 0.03], '#ff8fa6'));
    o.push(
      MP([s * 0.26, 1.12 + br + sway * 0.3, 0.02], [0.25, 0.1, 0.04], LF, {
        rot: [0, 0, s * (0.3 + sway)],
        g: 0.3
      })
    );
    o.push(
      MP([s * 0.27, 1.13 + br + sway * 0.3, 0.045], [0.19, 0.05, 0.02], LD, { rot: [0, 0, s * (0.3 + sway)] })
    );
  }
  o.push(MP([0, 1.07 + br, 0], [0.06, 0.055, 0.06], LD));
  o.push(MP([0, 0.74 + br, 0.3], [0.06, 0.022, 0.03], '#1c3a18'));
  return o;
};
// ---- lot 2 : créatures de base ----
const mdEye = (o, x, y, z, r, bl, col) => {
  o.push(MP([x, y, z], [r, r * 1.3 * bl, r * 0.55], col || '#1a1010', { g: 0.9 }));
  o.push(
    MP(
      [x + Math.sign(x || 1) * r * 0.25, y + r * 0.32 * bl, z + r * 0.5],
      [r * 0.36, r * 0.4 * bl, r * 0.2],
      '#ffffff',
      { e: 1 }
    )
  );
};
const mdCheek = (o, x, y, z, c) => o.push(MP([x, y, z], [0.058, 0.038, 0.03], c || '#ff8fa6'));
const mdFeet = (o, xs, col, r) => {
  for (const s of [-1, 1]) o.push(MP([s * xs, 0.075, 0.13], r || [0.12, 0.075, 0.15], col, { ao: 1 }));
};
// Rattou — souris violette
MD[3] = t => {
  const o = [],
    br = Math.sin(t / 600) * 0.012,
    bl = blinkK(t + 400),
    tw = Math.sin(t / 900) * 0.06;
  const PU = '#8a7a9a',
    PD = '#6c5c7e',
    LG = '#cfc6d6',
    PK = '#f08ab0';
  mdFeet(o, 0.15, '#4a3a5a');
  for (const s of [-1, 1]) o.push(MP([s * 0.15, 0.2, 0.04], [0.1, 0.13, 0.1], PD));
  o.push(MP([0, 0.4 + br, 0], [0.27, 0.26 + br, 0.23], PU, { g: 0.2 }));
  o.push(MP([0, 0.37 + br, 0.14], [0.17, 0.19, 0.12], LG));
  for (const s of [-1, 1])
    o.push(MP([s * 0.29, 0.42 + br, 0.09], [0.07, 0.12, 0.07], PD, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.82 + br, 0.02], [0.34, 0.27, 0.29], PU, { g: 0.25 }));
  o.push(MP([0, 0.745 + br, 0.24], [0.15, 0.105, 0.1], '#b9acc4'));
  o.push(MP([0, 0.775 + br, 0.335], [0.042, 0.032, 0.03], '#e8789a', { g: 0.7 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.86 + br, 0.275, 0.05, bl);
    mdCheek(o, s * 0.24, 0.76 + br, 0.245);
    o.push(
      MP([s * 0.3, 1.07 + br + tw * s * 0.3, -0.02], [0.18, 0.18, 0.045], PU, {
        rot: [0, -s * 0.35, s * (0.1 + tw)],
        g: 0.15
      })
    );
    o.push(
      MP([s * 0.3, 1.07 + br + tw * s * 0.3, 0.015], [0.12, 0.12, 0.03], PK, {
        rot: [0, -s * 0.35, s * (0.1 + tw)]
      })
    );
  }
  o.push(MP([0, 0.69 + br, 0.3], [0.035, 0.012, 0.02], '#3a2a4a'));
  tailChain(
    o,
    8,
    u => [0.1 + u * 0.5, 0.13 + Math.sin(u * 2.8 + t / 500) * 0.05 + u * 0.12, -0.2 - u * 0.18],
    '#dba3b8',
    '#c98fa5',
    0.03,
    0.045
  );
  return o;
};
// Piaf — oiseau bleu
MD[4] = t => {
  const o = [],
    br = Math.sin(t / 520) * 0.014,
    bl = blinkK(t + 1100),
    fl = Math.sin(t / 230) * 0.07 * (Math.sin(t / 2700) > 0.6 ? 3 : 1);
  const BL = '#4a9be0',
    BD = '#3578c4',
    LT = '#bfe0ff',
    YE = '#ffb52e';
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.1, 0.14, 0.05], [0.026, 0.075, 0.026], YE));
    o.push(MP([s * 0.1, 0.06, 0.1], [0.075, 0.04, 0.11], YE, { ao: 1 }));
  }
  o.push(MP([0, 0.3, -0.26], [0.12, 0.06, 0.2], '#e8a830', { rot: [-0.5, 0, 0] }));
  o.push(MP([0, 0.34, -0.3], [0.07, 0.05, 0.18], BD, { rot: [-0.6, 0, 0] }));
  o.push(MP([0, 0.62 + br, 0], [0.42, 0.42 + br, 0.37], BL, { g: 0.3 }));
  o.push(MP([0, 0.55 + br, 0.2], [0.28, 0.28, 0.2], LT));
  o.push(MP([0, 0.69 + br, 0.37], [0.07, 0.045, 0.085], YE, { g: 0.5 }));
  o.push(MP([0, 0.63 + br, 0.36], [0.055, 0.025, 0.07], '#e89818'));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.16, 0.8 + br, 0.31, 0.055, bl);
    mdCheek(o, s * 0.28, 0.7 + br, 0.28);
    o.push(
      MP([s * 0.44, 0.58 + br, -0.02], [0.09, 0.26, 0.17], BD, { rot: [0, 0, s * (0.28 + fl)], g: 0.2 })
    );
    o.push(MP([s * 0.5, 0.4 + br, -0.02], [0.06, 0.14, 0.12], '#2a5aa0', { rot: [0, 0, s * (0.28 + fl)] }));
  }
  o.push(MP([0, 1.07 + br, 0.02], [0.05, 0.12, 0.05], BD, { rot: [0, 0, 0.1 + fl * 0.5] }));
  o.push(MP([-0.07, 1.04 + br, 0.02], [0.04, 0.1, 0.04], BL, { rot: [0, 0, 0.5] }));
  o.push(MP([0.07, 1.04 + br, 0.02], [0.04, 0.1, 0.04], BL, { rot: [0, 0, -0.5] }));
  return o;
};
// Mousse — champignon
MD[5] = t => {
  const o = [],
    br = Math.sin(t / 660) * 0.012,
    bl = blinkK(t + 2100),
    sw = Math.sin(t / 1100) * 0.02;
  const RD = '#d8403a',
    CR = '#f2ecd8',
    BE = '#cdb48c',
    BD = '#a88c64';
  mdFeet(o, 0.14, '#7a5e3e', [0.11, 0.075, 0.14]);
  for (const s of [-1, 1]) o.push(MP([s * 0.14, 0.19, 0.05], [0.09, 0.12, 0.09], BD));
  o.push(MP([0, 0.36 + br, 0], [0.27, 0.25, 0.24], BD, { g: 0.15 }));
  o.push(MP([0, 0.34 + br, 0.13], [0.17, 0.17, 0.12], '#e4d4b4'));
  for (const s of [-1, 1])
    o.push(MP([s * 0.29, 0.4 + br, 0.09], [0.07, 0.12, 0.07], BD, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.65 + br, 0], [0.31, 0.27, 0.28], BE, { g: 0.2 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.13, 0.66 + br, 0.26, 0.05, bl);
    mdCheek(o, s * 0.22, 0.58 + br, 0.24);
  }
  o.push(MP([0, 0.56 + br, 0.285], [0.05, 0.015, 0.025], '#5a3a2a'));
  const cy = 1.0 + br,
    cxo = sw;
  o.push(MP([cxo, cy - 0.08, 0], [0.55, 0.09, 0.49], '#b8302e', { ao: 1 }));
  o.push(MP([cxo, cy, 0], [0.52, 0.31, 0.46], RD, { g: 0.35 }));
  for (const [dx, dy, dz, r] of [
    [0, 0.8, 0.6, 0.085],
    [-0.62, 0.66, 0.42, 0.075],
    [0.62, 0.66, 0.42, 0.075],
    [-0.28, 0.95, -0.1, 0.07],
    [0.34, 0.9, -0.3, 0.08],
    [0, 0.38, 0.92, 0.065],
    [-0.78, 0.4, -0.48, 0.06],
    [0.82, 0.3, -0.1, 0.055]
  ]) {
    const n = Math.hypot(dx, dy, dz);
    o.push(
      MP(
        [cxo + ((0.52 * dx) / n) * 0.97, cy + ((0.31 * dy) / n) * 0.97, ((0.46 * dz) / n) * 0.97],
        [r, r * 0.9, r * 0.7],
        '#fff6ee',
        { g: 0.2 }
      )
    );
  }
  return o;
};
// Crabi — crabe
MD[6] = t => {
  const o = [],
    br = Math.sin(t / 560) * 0.012,
    bl = blinkK(t + 300),
    sn = Math.sin(t / 420) * 0.09,
    bob = Math.sin(t / 900) * 0.012;
  const RE = '#ee6a4a',
    RD = '#c04a30',
    BL = '#9fd6e6';
  for (const s of [-1, 1])
    for (let i = 0; i < 3; i++) {
      const z = -0.14 + i * 0.14,
        w = Math.sin(t / 500 + i * 1.5 + (s > 0 ? 1 : 0)) * 0.02;
      o.push(MP([s * (0.42 + i * 0.02), 0.12, z], [0.17, 0.045, 0.04], RD, { rot: [0, 0, s * 0.3], ao: 1 }));
      o.push(MP([s * (0.56 + i * 0.02 + w), 0.06, z], [0.05, 0.075, 0.04], RD, { ao: 1 }));
    }
  o.push(MP([0, 0.34 + br + bob, 0], [0.46, 0.2 + br, 0.34], RE, { g: 0.25 }));
  o.push(MP([0, 0.44 + br + bob, -0.02], [0.38, 0.12, 0.28], '#f58060'));
  o.push(MP([0, 0.33 + br + bob, 0.22], [0.27, 0.13, 0.14], BL));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.16, 0.58 + br + bob, 0.1], [0.03, 0.11, 0.03], '#f6e8d8'));
    o.push(MP([s * 0.16, 0.72 + br + bob, 0.12], [0.095, 0.105 * bl, 0.09], '#ffffff', { g: 0.5 }));
    o.push(MP([s * 0.16, 0.72 + br + bob, 0.2], [0.05, 0.055 * bl, 0.03], '#1a1010', { g: 0.9 }));
    o.push(MP([s * 0.5, 0.5 + bob, 0.12], [0.08, 0.16, 0.08], RE, { rot: [0, 0, -s * 0.5] }));
    o.push(MP([s * 0.58, 0.82 + bob, 0.12], [0.17, 0.13, 0.13], RE, { g: 0.25 }));
    o.push(
      MP([s * (0.68 + sn * 0.4), 1.02 + bob, 0.12], [0.09, 0.17, 0.09], RE, {
        rot: [0, 0, -s * (0.3 + sn)],
        g: 0.2
      })
    );
    o.push(
      MP([s * (0.5 - sn * 0.4), 1.02 + bob, 0.12], [0.09, 0.17, 0.09], RE, {
        rot: [0, 0, s * (0.3 + sn)],
        g: 0.2
      })
    );
    mdCheek(o, s * 0.3, 0.38 + bob, 0.3, '#ff9a8a');
  }
  o.push(MP([0, 0.3 + br + bob, 0.33], [0.06, 0.015, 0.02], '#6a2a1a'));
  return o;
};
// Cendrelin — goutte de feu
MD[7] = t => {
  const o = [],
    br = Math.sin(t / 480) * 0.02,
    bl = blinkK(t + 1500),
    fk = Math.sin(t / 140) * 0.035,
    fk2 = Math.sin(t / 190 + 1) * 0.03;
  const Y1 = '#ffc83a',
    Y2 = '#ffe27a',
    OR = '#ff9a2a';
  o.push(MP([0, 0.14, 0], [0.3, 0.07, 0.26], OR, { ao: 1 }));
  o.push(MP([0, 0.45 + br, 0], [0.4, 0.36 + br, 0.34], Y1, { g: 0.3 }));
  o.push(MP([0, 0.42 + br, 0.18], [0.28, 0.27, 0.18], Y2));
  o.push(MP([fk * 0.3, 0.86 + br, 0], [0.31, 0.42, 0.26], Y1, { g: 0.3 }));
  o.push(MP([fk * 0.7, 1.1 + br, 0], [0.17, 0.28, 0.13], '#ffb52e', { g: 0.3 }));
  o.push(MP([fk * 1.1, 1.28 + br, 0], [0.08, 0.16, 0.065], OR, { g: 0.3, e: 1 }));
  o.push(MP([fk * 1.4, 1.38 + br, 0], [0.035, 0.08, 0.03], '#ffe27a', { e: 1 }));
  o.push(MP([0.34 + fk2, 1.0 + br, -0.02], [0.07, 0.13, 0.05], OR, { rot: [0, 0, -0.4 + fk2 * 3], e: 1 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.5 + br, 0.31, 0.052, bl);
    mdCheek(o, s * 0.25, 0.4 + br, 0.27, '#ff8a70');
  }
  o.push(MP([0, 0.37 + br, 0.335], [0.05, 0.014, 0.02], '#8a3a1a'));
  return o;
};
// Lunard — chat lunaire
MD[8] = t => {
  const o = [],
    br = Math.sin(t / 640) * 0.012,
    wag = Math.sin(t / 470),
    ear = Math.sin(t / 1000) * 0.07,
    bl = blinkK(t + 2600);
  const PU = '#6a5ab8',
    PD = '#4e3f96',
    LT = '#a79de0',
    PK = '#ff9ac0',
    YL = '#ffe27a';
  mdFeet(o, 0.15, '#3a2f78');
  for (const s of [-1, 1]) o.push(MP([s * 0.15, 0.2, 0.04], [0.1, 0.13, 0.1], PD));
  o.push(MP([0, 0.4 + br, 0], [0.27, 0.26 + br, 0.23], PU, { g: 0.2 }));
  o.push(MP([0, 0.38 + br, 0.14], [0.17, 0.19, 0.12], LT));
  for (const s of [-1, 1])
    o.push(MP([s * 0.3, 0.42 + br, 0.09], [0.075, 0.13, 0.075], PD, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.83 + br, 0.02], [0.36, 0.28, 0.31], '#7466c8', { g: 0.25 }));
  o.push(MP([0, 0.745 + br, 0.25], [0.16, 0.11, 0.1], LT));
  o.push(MP([0, 0.775 + br, 0.345], [0.036, 0.026, 0.026], '#ff8fb0', { g: 0.6 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.145, 0.87 + br, 0.285, 0.062, bl, '#241a58');
    mdCheek(o, s * 0.235, 0.765 + br, 0.25);
    o.push(MP([s * 0.23, 1.12 + br, 0], [0.11, 0.18, 0.06], PU, { rot: [0, 0, -s * (0.45 + ear)], g: 0.15 }));
    o.push(MP([s * 0.225, 1.11 + br, 0.04], [0.06, 0.12, 0.03], PK, { rot: [0, 0, -s * (0.45 + ear)] }));
  }
  o.push(MP([0, 1.0 + br, 0.29], [0.075, 0.075, 0.03], YL, { e: 1 }));
  o.push(MP([0.035, 1.015 + br, 0.31], [0.068, 0.068, 0.03], '#7466c8'));
  tailChain(
    o,
    6,
    u => [
      0.12 + u * 0.38 + wag * 0.05 * u,
      0.3 + u * 0.55 - u * u * 0.05 + Math.sin(t / 300 + u * 3) * 0.01,
      -0.2 - u * 0.14
    ],
    '#4e3f96',
    '#6a5ab8',
    0.07,
    0.08
  );
  o.push(MP([0.52 + wag * 0.06, 0.88, -0.34], [0.12, 0.12, 0.12], YL, { e: 1 }));
  return o;
};
// ---- lot 3 : évolutions et espèces 12-16 ----
const mdBrow = (o, x, y, z, rz, col) =>
  o.push(MP([x, y, z], [0.075, 0.02, 0.03], col || '#2a2030', { rot: [0, 0, rz] }));
// Flamgrin — lion de feu
MD[9] = t => {
  const o = [],
    br = Math.sin(t / 600) * 0.012,
    wag = Math.sin(t / 430),
    bl = blinkK(t + 800);
  const OR = '#e8552a',
    OD = '#b8401e',
    CR = '#ffd8a8';
  mdFeet(o, 0.17, '#6a2a1a', [0.14, 0.08, 0.17]);
  for (const s of [-1, 1]) o.push(MP([s * 0.17, 0.2, 0.04], [0.11, 0.14, 0.11], OD));
  o.push(MP([0, 0.42 + br, 0], [0.31, 0.28 + br, 0.26], OR, { g: 0.2 }));
  o.push(MP([0, 0.4 + br, 0.15], [0.19, 0.2, 0.13], CR));
  for (const s of [-1, 1])
    o.push(MP([s * 0.32, 0.44 + br, 0.09], [0.08, 0.14, 0.08], OD, { rot: [0, 0, s * 0.4] }));
  for (let i = 0; i < 12; i++) {
    const th = (i / 12) * Math.PI * 2,
      L = 0.16 + Math.sin(t / 190 + i * 1.7) * 0.02,
      rr = 0.41;
    o.push(
      MP(
        [Math.sin(th) * rr, 0.88 + br + Math.cos(th) * rr * 0.95, -0.1],
        [0.12, L, 0.08],
        i % 2 ? '#ffb02e' : '#ff7a1c',
        { rot: [0, 0, -th], e: 1 }
      )
    );
  }
  o.push(MP([0, 0.88 + br, -0.04], [0.4, 0.38, 0.14], '#c8421e', { g: 0.1 }));
  o.push(MP([0, 0.88 + br, 0.04], [0.33, 0.28, 0.28], OR, { g: 0.25 }));
  o.push(MP([0, 0.8 + br, 0.25], [0.17, 0.12, 0.1], CR));
  o.push(MP([0, 0.835 + br, 0.34], [0.045, 0.032, 0.03], '#3a1810', { g: 0.7 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.15, 0.94 + br, 0.27, 0.052, bl);
    mdBrow(o, s * 0.15, 1.02 + br, 0.29, -s * 0.3, '#6a2a1a');
    mdCheek(o, s * 0.24, 0.82 + br, 0.24);
    o.push(MP([s * 0.25, 1.13 + br, 0.05], [0.1, 0.1, 0.05], OR));
    o.push(MP([s * 0.25, 1.13 + br, 0.08], [0.06, 0.06, 0.03], CR));
  }
  tailChain(
    o,
    6,
    u => [
      0.12 + u * 0.42 + wag * 0.05 * u,
      0.28 + u * 0.4 + Math.sin(t / 300 + u * 3) * 0.01,
      -0.22 - u * 0.14
    ],
    '#8a4a22',
    '#a85c2c',
    0.1,
    0.13
  );
  o.push(MP([0.58 + wag * 0.06, 0.78, -0.36], [0.14, 0.17, 0.12], '#ff8a1c', { e: 1 }));
  o.push(
    MP([0.58 + wag * 0.07, 0.94 + Math.sin(t / 140) * 0.03, -0.36], [0.08, 0.12, 0.08], '#ffd24a', { e: 1 })
  );
  return o;
};
// Ondaros — baleine d'eau
MD[10] = t => {
  const o = [],
    bob = Math.sin(t / 760) * 0.025,
    bl = blinkK(t + 1300),
    fin = Math.sin(t / 600) * 0.1,
    tl = Math.sin(t / 500) * 0.06;
  const BL = '#3a7ad0',
    BD = '#2a5aa8',
    LT = '#a9d4f2';
  o.push(MP([0, 0.12, 0], [0.4, 0.05, 0.32], '#2a5aa8', { ao: 1 }));
  o.push(MP([0, 0.56 + bob, 0], [0.5, 0.44, 0.42], BL, { g: 0.35 }));
  o.push(MP([0, 0.44 + bob, 0.22], [0.36, 0.27, 0.22], LT));
  for (const s of [-1, 1]) {
    o.push(
      MP([s * 0.54, 0.42 + bob, 0.08], [0.21, 0.07, 0.11], BD, { rot: [0, 0, s * (0.5 + fin)], g: 0.2 })
    );
    mdEye(o, s * 0.22, 0.68 + bob, 0.34, 0.055, bl);
    mdCheek(o, s * 0.34, 0.55 + bob, 0.3);
    o.push(MP([s * 0.035, 1.08 + bob, 0], [0.025, 0.13, 0.022], '#e6f4ff', { g: 0.9, e: 1 }));
    o.push(
      MP([s * (0.09 + Math.abs(tl) * 0.2), 1.22 + bob, 0], [0.03, 0.07, 0.025], '#cfeaff', { g: 0.9, e: 1 })
    );
  }
  o.push(MP([0, 0.5 + bob, 0.4], [0.11, 0.022, 0.03], '#1a2a4a'));
  for (let i = 0; i < 5; i++) {
    const u = i / 4;
    o.push(
      MP(
        [0.24 + u * 0.32 + tl * u, 0.3 + u * 0.5 + bob, -0.34 - u * 0.12],
        [0.12 - u * 0.04, 0.11 - u * 0.03, 0.11],
        i % 2 ? BL : BD,
        { g: 0.1 }
      )
    );
  }
  o.push(MP([0.58 + tl, 0.86 + bob, -0.46], [0.2, 0.045, 0.12], BD, { rot: [0, 0, 0.5] }));
  o.push(MP([0.52 + tl, 0.78 + bob, -0.46], [0.2, 0.045, 0.12], BD, { rot: [0, 0, -0.5] }));
  return o;
};
// Sylvaros — arbre gardien
MD[11] = t => {
  const o = [],
    br = Math.sin(t / 700) * 0.01,
    bl = blinkK(t + 2400),
    sw = Math.sin(t / 900) * 0.025;
  const BK = '#7a5a36',
    BL = '#a07a4c',
    G1 = '#4aa83c',
    G2 = '#78c860',
    G3 = '#3a8a30';
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.16, 0.075, 0.13], [0.13, 0.075, 0.15], '#3a2a18', { ao: 1 }));
    o.push(MP([s * 0.16, 0.2, 0.04], [0.1, 0.13, 0.1], BK));
  }
  o.push(MP([0, 0.45 + br, 0], [0.31, 0.34 + br, 0.27], BK, { g: 0.1 }));
  o.push(MP([0, 0.52 + br, 0.15], [0.23, 0.22, 0.13], BL));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.33, 0.5 + br, 0.06], [0.07, 0.13, 0.07], BK, { rot: [0, 0, s * 0.5] }));
    o.push(MP([s * 0.42, 0.38 + br, 0.06], [0.1, 0.05, 0.04], G2, { rot: [0, 0, s * 0.6] }));
  }
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.11, 0.58 + br, 0.27, 0.05, bl);
    mdCheek(o, s * 0.2, 0.49 + br, 0.24);
  }
  o.push(MP([0, 0.45 + br, 0.285], [0.04, 0.012, 0.02], '#2a1a10'));
  o.push(MP([sw, 1.0 + br, 0], [0.52, 0.3, 0.46], G1, { g: 0.2 }));
  o.push(MP([-0.3 + sw, 1.1 + br, 0.06], [0.3, 0.24, 0.28], G1, { g: 0.2 }));
  o.push(MP([0.3 + sw, 1.1 + br, 0.06], [0.3, 0.24, 0.28], G1, { g: 0.2 }));
  o.push(MP([sw * 1.4, 1.24 + br, -0.06], [0.36, 0.2, 0.32], G2, { g: 0.3 }));
  o.push(MP([-0.16 + sw, 1.08 + br, 0.28], [0.2, 0.12, 0.12], G2));
  o.push(MP([0.2 + sw, 1.04 + br, 0.3], [0.18, 0.1, 0.1], G3));
  o.push(MP([-0.4 + sw, 0.94 + br, -0.02], [0.18, 0.12, 0.2], G3));
  o.push(MP([0.42 + sw, 0.96 + br, -0.02], [0.18, 0.12, 0.2], G3));
  return o;
};
// Aigrin — aigle bleu
MD[12] = t => {
  const o = [],
    br = Math.sin(t / 560) * 0.012,
    bl = blinkK(t + 1900),
    fl = Math.sin(t / 300) * 0.05;
  const BL = '#6aa8e0',
    BD = '#4a88c4',
    LT = '#d0e4f6',
    YE = '#e8c860',
    OR = '#ffb52e';
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.12, 0.14, 0.05], [0.03, 0.08, 0.03], OR));
    o.push(MP([s * 0.12, 0.06, 0.11], [0.08, 0.04, 0.12], OR, { ao: 1 }));
  }
  o.push(MP([0, 0.28, -0.2], [0.14, 0.06, 0.2], YE, { rot: [-0.5, 0, 0] }));
  o.push(MP([0, 0.55 + br, 0], [0.31, 0.42 + br, 0.27], BL, { g: 0.3 }));
  o.push(MP([0, 0.5 + br, 0.17], [0.2, 0.3, 0.14], LT));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.5, 0.7 + br, -0.04], [0.14, 0.36, 0.05], YE, { rot: [0, 0, s * (0.5 + fl)], g: 0.3 }));
    o.push(MP([s * 0.62, 0.55 + br, -0.04], [0.1, 0.28, 0.04], '#d8aa40', { rot: [0, 0, s * (0.65 + fl)] }));
  }
  o.push(MP([0, 1.0 + br, 0.02], [0.29, 0.25, 0.26], BL, { g: 0.3 }));
  o.push(MP([0, 0.93 + br, 0.2], [0.15, 0.12, 0.1], LT));
  o.push(MP([0, 0.95 + br, 0.3], [0.05, 0.045, 0.07], OR, { g: 0.5 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.13, 1.03 + br, 0.235, 0.05, bl);
    mdBrow(o, s * 0.14, 1.12 + br, 0.25, -s * 0.45);
    mdCheek(o, s * 0.22, 0.92 + br, 0.21);
  }
  o.push(MP([0, 1.27 + br, 0.0], [0.07, 0.14, 0.05], YE, { e: 1 }));
  o.push(MP([-0.11, 1.22 + br, 0.0], [0.05, 0.12, 0.04], YE, { rot: [0, 0, 0.5], e: 1 }));
  o.push(MP([0.11, 1.22 + br, 0.0], [0.05, 0.12, 0.04], YE, { rot: [0, 0, -0.5], e: 1 }));
  return o;
};
// Luciole — chenille
MD[13] = t => {
  const o = [],
    bl = blinkK(t + 700);
  const GR = '#7cd24a',
    GD = '#4a9a32',
    LT = '#d8f090',
    YL = '#ffe27a';
  for (let i = 4; i >= 1; i--) {
    const u = i / 4,
      w = Math.sin(t / 500 - i * 0.9) * 0.025,
      r = 0.27 - i * 0.025;
    o.push(
      MP([-0.2 - i * 0.17, 0.27 + w + (i % 2 ? 0.02 : 0), -0.05 - i * 0.1], [r, r * 0.95, r], GR, { g: 0.3 })
    );
    o.push(MP([-0.2 - i * 0.17, 0.2 + w, -0.02 - i * 0.1 + 0.12], [r * 0.55, r * 0.4, r * 0.5], LT));
    if (i != 3)
      o.push(MP([-0.2 - i * 0.17, 0.27 + r * 0.85 + w, -0.05 - i * 0.1], [r * 0.4, r * 0.2, r * 0.4], GD));
    for (const s of [-1, 1])
      o.push(MP([-0.2 - i * 0.17 + s * 0.04, 0.07, 0.0 - i * 0.1 + 0.05], [0.05, 0.05, 0.06], LT, { ao: 1 }));
  }
  o.push(MP([-0.1, 0.3, 0.02], [0.3, 0.28, 0.27], GR, { g: 0.3 }));
  o.push(MP([-0.08, 0.2, 0.14], [0.2, 0.15, 0.14], LT));
  o.push(MP([-0.1, 0.52, 0], [0.1, 0.08, 0.1], GD));
  o.push(MP([0.08, 0.55, 0.1], [0.35, 0.32, 0.3], GR, { g: 0.35 }));
  o.push(MP([0.08, 0.46, 0.3], [0.17, 0.12, 0.09], LT));
  for (const s of [-1, 1]) {
    mdEye(o, 0.08 + s * 0.14, 0.6, 0.37, 0.055, bl);
    mdCheek(o, 0.08 + s * 0.24, 0.5, 0.33, '#ff9ab0');
    const sw = Math.sin(t / 420 + s) * 0.05;
    o.push(MP([0.08 + s * 0.12, 0.9, 0.08], [0.018, 0.1, 0.018], GD, { rot: [0, 0, -s * 0.15 + sw] }));
    o.push(MP([0.08 + s * (0.17 + sw * 1.2), 1.04, 0.08], [0.055, 0.055, 0.055], YL, { e: 1 }));
  }
  o.push(MP([0.08, 0.43, 0.4], [0.045, 0.015, 0.02], '#2a5a20'));
  return o;
};
// Galet — rocher
MD[14] = t => {
  const o = [],
    br = Math.sin(t / 900) * 0.01,
    bl = blinkK(t + 3100);
  const RK = '#8a8478',
    RD = '#6a665c',
    RL = '#aaa498';
  for (const s of [-1, 1]) o.push(MP([s * 0.22, 0.08, 0.12], [0.15, 0.08, 0.16], RD, { ao: 1 }));
  o.push(MP([0, 0.5 + br, 0], [0.46, 0.42 + br, 0.38], RK, { g: 0.15 }));
  for (const [x, y, z, rx, ry, rz, c] of [
    [-0.3, 0.82, 0.05, 0.2, 0.15, 0.18, RL],
    [0.3, 0.8, 0.0, 0.2, 0.16, 0.18, RD],
    [0, 0.92, -0.1, 0.24, 0.14, 0.2, RK],
    [-0.42, 0.45, 0.08, 0.14, 0.18, 0.16, RD],
    [0.42, 0.42, 0.06, 0.15, 0.2, 0.16, RL],
    [0.18, 0.3, 0.3, 0.14, 0.1, 0.1, RL],
    [-0.2, 0.62, -0.25, 0.18, 0.18, 0.14, RD],
    [0.1, 0.7, 0.3, 0.12, 0.08, 0.08, RL]
  ])
    o.push(MP([x, y + br, z], [rx, ry, rz], c, { g: 0.1 }));
  o.push(MP([0, 0.58 + br, 0.3], [0.34, 0.26, 0.15], '#a39c8e'));
  for (const s of [-1, 1]) {
    mdBrow(o, s * 0.14, 0.73 + br, 0.43, -s * 0.4, '#2a2420');
    mdEye(o, s * 0.14, 0.65 + br, 0.43, 0.04, bl);
  }
  o.push(MP([0, 0.5 + br, 0.45], [0.08, 0.012, 0.02], '#2a2420'));
  for (const s of [-1, 1]) o.push(MP([s * 0.5, 0.42 + br, 0.04], [0.1, 0.14, 0.1], RD, { g: 0.1 }));
  return o;
};
// Spectro — fantôme
MD[15] = t => {
  const o = [],
    fl = Math.sin(t / 650) * 0.04,
    bl = blinkK(t + 500);
  const PU = '#9a88d8',
    PD = '#7a68b8',
    LT = '#c8b8f0';
  o.push(MP([0, 0.1, 0], [0.34, 0.04, 0.28], '#5a4a90', { ao: 1 }));
  o.push(MP([0, 0.66 + fl, 0], [0.43, 0.45, 0.37], PU, { g: 0.3 }));
  o.push(MP([0, 0.5 + fl, 0.2], [0.3, 0.28, 0.18], '#a898e4'));
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2,
      w = Math.sin(t / 300 + i * 1.3) * 0.03;
    o.push(
      MP([Math.cos(a) * 0.33, 0.28 + fl + w, Math.sin(a) * 0.27], [0.12, 0.16, 0.12], i % 2 ? PU : PD, {
        g: 0.2
      })
    );
  }
  for (const x of [-0.22, 0, 0.22])
    o.push(MP([x, 1.08 + fl, -0.02], [0.09, 0.14, 0.08], PU, { rot: [0, 0, -x * 1.5] }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.15, 0.74 + fl, 0.31], [0.09, 0.1 * bl, 0.05], '#ffffff', { g: 0.6 }));
    o.push(MP([s * 0.15, 0.73 + fl, 0.355], [0.045, 0.055 * bl, 0.025], '#1a1030', { g: 0.9 }));
    mdCheek(o, s * 0.28, 0.6 + fl, 0.29);
  }
  o.push(MP([0, 0.5 + fl, 0.35], [0.1, 0.075, 0.03], LT));
  o.push(MP([0, 0.5 + fl, 0.375], [0.055, 0.045, 0.02], '#3a2a60'));
  for (const s of [-1, 1])
    o.push(
      MP([s * 0.44, 0.52 + fl + Math.sin(t / 400 + s) * 0.03, 0.04], [0.1, 0.07, 0.08], PD, {
        rot: [0, 0, s * 0.4]
      })
    );
  return o;
};
// Luniel — étoile lunaire
MD[16] = t => {
  const o = [],
    bob = Math.sin(t / 700) * 0.035,
    rk = Math.sin(t / 1300) * 0.07,
    bl = blinkK(t + 2000);
  const PU = '#8a70d0',
    PL = '#b8a0f0',
    CR = '#fff0b0';
  const cy = 0.74 + bob;
  [
    [0, 0.3, PU],
    [1, 0.38, PL],
    [2, 0.24, PU],
    [3, 0.24, PU],
    [4, 0.38, PL]
  ].forEach(([k, L, c]) => {
    const th = (k * Math.PI * 2) / 5 + rk,
      lf = 1 + Math.sin(t / 500 + k) * 0.04;
    o.push(
      MP(
        [Math.sin(th) * (0.22 + L * 0.5 * lf), cy + Math.cos(th) * (0.22 + L * 0.5 * lf) * 0.9, 0],
        [0.15 + (k == 1 || k == 4 ? 0.03 : 0), (L + 0.2) * lf, 0.1],
        c,
        { rot: [0, 0, -th], g: 0.4 }
      )
    );
  });
  o.push(MP([0, cy, 0], [0.36, 0.36, 0.17], PU, { g: 0.3 }));
  o.push(MP([0, cy, 0.12], [0.27, 0.27, 0.11], CR, { g: 0.35, e: 0 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.09, cy + 0.04, 0.215, 0.04, bl);
    mdCheek(o, s * 0.17, cy - 0.05, 0.2);
  }
  o.push(MP([0, cy - 0.07, 0.225], [0.05, 0.016, 0.02], '#8a4a2a'));
  o.push(MP([0, 0.1, 0], [0.2, 0.03, 0.16], '#5a4a90', { ao: 1 }));
  return o;
};
// ---- lot 4 : espèces 17-24 ----
// Ratalpha — loup violet
MD[17] = t => {
  const o = [],
    br = Math.sin(t / 620) * 0.012,
    wag = Math.sin(t / 520),
    ear = Math.sin(t / 1100) * 0.06;
  const PU = '#6a5a8a',
    PD = '#4a3a68',
    LT = '#b8a8cc',
    GY = '#8a7aa6';
  mdFeet(o, 0.16, '#3a2a58', [0.13, 0.075, 0.16]);
  for (const s of [-1, 1]) o.push(MP([s * 0.16, 0.2, 0.04], [0.1, 0.13, 0.1], PD));
  o.push(MP([0, 0.42 + br, 0], [0.29, 0.27 + br, 0.24], PU, { g: 0.2 }));
  o.push(MP([0, 0.4 + br, 0.15], [0.18, 0.2, 0.12], LT));
  for (const s of [-1, 1])
    o.push(MP([s * 0.31, 0.44 + br, 0.09], [0.08, 0.14, 0.08], PD, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.86 + br, 0.02], [0.38, 0.28, 0.31], PU, { g: 0.25 }));
  o.push(MP([0, 0.77 + br, 0.26], [0.17, 0.12, 0.11], LT));
  o.push(MP([0, 0.805 + br, 0.355], [0.045, 0.032, 0.03], '#1a1020', { g: 0.7 }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.14, 0.9 + br, 0.285], [0.06, 0.017, 0.03], '#1a1020'));
    mdBrow(o, s * 0.15, 0.96 + br, 0.27, -s * 0.35, '#2a1a40');
    mdCheek(o, s * 0.25, 0.79 + br, 0.25, '#d89ac8');
    o.push(MP([s * 0.37, 0.8 + br, 0.04], [0.08, 0.13, 0.07], GY, { rot: [0, 0, -s * 0.7] }));
    o.push(MP([s * 0.27, 1.17 + br, 0], [0.12, 0.2, 0.06], PU, { rot: [0, 0, -s * (0.35 + ear)], g: 0.15 }));
    o.push(
      MP([s * 0.265, 1.15 + br, 0.04], [0.065, 0.13, 0.03], '#b89ad8', { rot: [0, 0, -s * (0.35 + ear)] })
    );
  }
  tailChain(
    o,
    7,
    u => [
      0.1 + u * 0.45 + wag * 0.05 * u,
      0.25 + u * 0.45 + Math.sin(t / 300 + u * 3) * 0.012,
      -0.22 - u * 0.16
    ],
    '#5a4a78',
    '#7a6a98',
    0.09,
    0.12
  );
  o.push(MP([0.55 + wag * 0.06, 0.76, -0.4], [0.12, 0.13, 0.12], GY));
  return o;
};
// Titancrabe — homard géant
MD[18] = t => {
  const o = [],
    br = Math.sin(t / 620) * 0.012,
    sn = Math.sin(t / 480) * 0.1,
    bob = Math.sin(t / 900) * 0.012;
  const RE = '#e8603c',
    RD = '#b84028',
    BL = '#a8c8e4';
  for (const s of [-1, 1])
    for (let i = 0; i < 4; i++) {
      const z = -0.2 + i * 0.14,
        w = Math.sin(t / 520 + i * 1.4 + (s > 0 ? 1 : 0)) * 0.02;
      o.push(
        MP([s * (0.44 + i * 0.01), 0.14, z], [0.18, 0.045, 0.045], RD, { rot: [0, 0, s * 0.35], ao: 1 })
      );
      o.push(MP([s * (0.58 + w), 0.06, z], [0.05, 0.08, 0.045], RD, { ao: 1 }));
    }
  o.push(MP([0, 0.4 + br + bob, 0], [0.5, 0.28 + br, 0.38], RE, { g: 0.25 }));
  o.push(MP([0, 0.5 + br + bob, -0.04], [0.4, 0.14, 0.3], '#f07650'));
  o.push(MP([0, 0.36 + br + bob, 0.28], [0.3, 0.17, 0.14], BL));
  for (const s of [-1, 1]) {
    o.push(
      MP([s * 0.15, 0.58 + br + bob, 0.33], [0.05, 0.06 * blinkK(t + s * 300), 0.03], '#1a1010', { g: 0.9 })
    );
    o.push(MP([s * 0.15 + 0.012, 0.6 + br + bob, 0.355], [0.018, 0.02, 0.01], '#fff', { e: 1 }));
    mdBrow(o, s * 0.15, 0.67 + br + bob, 0.34, -s * 0.4, '#3a1a10');
    o.push(
      MP([s * 0.14, 0.9 + bob, 0.05], [0.02, 0.17, 0.02], '#2a1a1a', { rot: [0, 0, s * (0.5 + sn * 0.5)] })
    );
    o.push(MP([s * 0.52, 0.55 + bob, 0.1], [0.09, 0.17, 0.09], RE, { rot: [0, 0, -s * 0.5] }));
    o.push(MP([s * 0.62, 0.84 + bob, 0.1], [0.2, 0.15, 0.14], RE, { g: 0.25 }));
    o.push(
      MP([s * (0.7 + sn * 0.4), 1.0 + bob, 0.1], [0.1, 0.18, 0.1], RE, {
        rot: [0, 0, -s * (0.3 + sn)],
        g: 0.2
      })
    );
    o.push(
      MP([s * (0.52 - sn * 0.4), 1.0 + bob, 0.1], [0.1, 0.18, 0.1], RE, {
        rot: [0, 0, s * (0.3 + sn)],
        g: 0.2
      })
    );
    mdCheek(o, s * 0.3, 0.42 + bob, 0.33, '#ff9a8a');
  }
  o.push(MP([0, 0.34 + br + bob, 0.37], [0.07, 0.015, 0.02], '#6a2a1a'));
  return o;
};
// Fongidor — champignon vert
MD[19] = t => {
  const o = [],
    br = Math.sin(t / 700) * 0.01,
    bl = blinkK(t + 1200),
    sw = Math.sin(t / 1200) * 0.02;
  const GN = '#3a9a4a',
    BE = '#b09462',
    BD = '#8a7040';
  mdFeet(o, 0.17, '#6a5230', [0.13, 0.075, 0.15]);
  for (const s of [-1, 1]) o.push(MP([s * 0.17, 0.2, 0.05], [0.1, 0.13, 0.1], BD));
  o.push(MP([0, 0.38 + br, 0], [0.31, 0.28, 0.27], BD, { g: 0.1 }));
  o.push(MP([0, 0.36 + br, 0.15], [0.2, 0.19, 0.13], '#d8c490'));
  for (const s of [-1, 1])
    o.push(MP([s * 0.34, 0.42 + br, 0.09], [0.08, 0.14, 0.08], BD, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.68 + br, 0], [0.36, 0.28, 0.31], BE, { g: 0.2 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.7 + br, 0.28, 0.055, bl);
    mdCheek(o, s * 0.25, 0.6 + br, 0.26);
  }
  o.push(MP([0, 0.58 + br, 0.305], [0.055, 0.016, 0.025], '#4a2a1a'));
  const cy = 1.06 + br,
    cx0 = sw;
  o.push(MP([cx0, cy - 0.1, 0], [0.64, 0.1, 0.56], '#2a5a30', { ao: 1 }));
  for (let i = 0; i < 9; i++) {
    const a = -1.2 + i * 0.3;
    o.push(
      MP([cx0 + Math.sin(a) * 0.5, cy - 0.1, Math.cos(a) * 0.44], [0.06, 0.07, 0.05], '#f0e8c8', { g: 0.2 })
    );
  }
  o.push(MP([cx0, cy + 0.02, 0], [0.6, 0.34, 0.52], GN, { g: 0.35 }));
  for (const [dx, dy, dz, r] of [
    [0, 0.8, 0.6, 0.1],
    [-0.62, 0.66, 0.42, 0.085],
    [0.62, 0.66, 0.42, 0.085],
    [-0.28, 0.95, -0.1, 0.08],
    [0.34, 0.9, -0.3, 0.09],
    [0, 0.38, 0.92, 0.075],
    [-0.8, 0.4, -0.4, 0.065],
    [0.82, 0.3, -0.1, 0.06]
  ]) {
    const n = Math.hypot(dx, dy, dz);
    o.push(
      MP(
        [cx0 + ((0.6 * dx) / n) * 0.97, cy + 0.02 + ((0.34 * dy) / n) * 0.97, ((0.52 * dz) / n) * 0.97],
        [r, r * 0.9, r * 0.7],
        '#f4f4e0',
        { g: 0.2 }
      )
    );
  }
  return o;
};
// Bélier — petit bélier
MD[20] = t => {
  const o = [],
    br = Math.sin(t / 640) * 0.012,
    bl = blinkK(t + 2200),
    ear = Math.sin(t / 1000) * 0.06;
  const BR = '#a07c54',
    BD = '#7a5a38',
    LT = '#d8bc94',
    HN = '#e0cc9c';
  mdFeet(o, 0.15, '#4a3220');
  for (const s of [-1, 1]) o.push(MP([s * 0.15, 0.2, 0.04], [0.1, 0.13, 0.1], BD));
  o.push(MP([0, 0.4 + br, 0], [0.27, 0.26 + br, 0.23], BR, { g: 0.15 }));
  o.push(MP([0, 0.38 + br, 0.14], [0.17, 0.19, 0.12], LT));
  for (const s of [-1, 1])
    o.push(MP([s * 0.3, 0.42 + br, 0.09], [0.075, 0.13, 0.075], BD, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.85 + br, 0.02], [0.35, 0.28, 0.3], '#b8946a', { g: 0.2 }));
  o.push(MP([0, 0.76 + br, 0.25], [0.17, 0.12, 0.1], LT));
  o.push(MP([0, 0.795 + br, 0.34], [0.04, 0.03, 0.03], '#3a2010', { g: 0.7 }));
  o.push(MP([0, 1.12 + br, 0.02], [0.22, 0.12, 0.18], '#f0e4c8', { g: 0.1 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.89 + br, 0.28, 0.05, bl);
    mdCheek(o, s * 0.24, 0.78 + br, 0.25);
    o.push(MP([s * 0.34, 0.92 + br, 0.0], [0.09, 0.1, 0.05], '#d8b888', { rot: [0, 0, s * (0.2 + ear)] }));
    for (let i = 0; i < 7; i++) {
      const a = -0.6 + i * 0.52,
        r0 = 0.17;
      o.push(
        MP(
          [s * (0.36 + Math.sin(a) * r0 * 0.9), 1.03 + br + Math.cos(a) * r0, 0.0 + i * 0.004],
          [0.065 - i * 0.002, 0.065 - i * 0.002, 0.06],
          HN,
          { g: 0.25 }
        )
      );
    }
  }
  o.push(MP([0, 0.28, -0.24], [0.1, 0.1, 0.09], '#f0e4c8'));
  return o;
};
// Hulotte — chouette
MD[21] = t => {
  const o = [],
    br = Math.sin(t / 600) * 0.012,
    bl = blinkK(t + 900),
    fl = Math.sin(t / 500) * 0.04;
  const BR = '#9c7c54',
    LT = '#e0c8a0',
    MN = '#a8d4c0';
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.12, 0.07, 0.1], [0.1, 0.065, 0.13], '#4a3220', { ao: 1 }));
    o.push(MP([s * 0.12, 0.16, 0.05], [0.04, 0.09, 0.04], '#6a4a2a'));
  }
  o.push(MP([0, 0.56 + br, 0], [0.36, 0.46 + br, 0.31], BR, { g: 0.2 }));
  o.push(MP([0, 0.5 + br, 0.2], [0.25, 0.35, 0.14], LT));
  for (let k = 0; k < 4; k++)
    for (const s of [-1, 1]) o.push(MP([s * 0.08, 0.32 + k * 0.12, 0.3], [0.03, 0.03, 0.02], '#b89868'));
  for (const s of [-1, 1])
    o.push(MP([s * 0.4, 0.62 + br, -0.02], [0.1, 0.3, 0.15], MN, { rot: [0, 0, s * (0.18 + fl)], g: 0.2 }));
  o.push(MP([0, 1.03 + br, 0.02], [0.39, 0.3, 0.3], '#a8885c', { g: 0.25 }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.25, 1.28 + br, 0], [0.08, 0.14, 0.06], BR, { rot: [0, 0, -s * 0.4] }));
    o.push(MP([s * 0.16, 1.06 + br, 0.27], [0.14, 0.14 * bl + 0.02, 0.05], MN, { g: 0.5 }));
    o.push(MP([s * 0.16, 1.06 + br, 0.3], [0.1, 0.1 * bl + 0.01, 0.04], '#ffffff', { g: 0.7 }));
    o.push(MP([s * 0.16, 1.06 + br, 0.325], [0.05, 0.055 * bl, 0.025], '#1a1010', { g: 0.9 }));
  }
  o.push(MP([0, 0.94 + br, 0.31], [0.045, 0.06, 0.06], '#f0a020', { g: 0.5 }));
  return o;
};
// Magmite — volcan
MD[22] = t => {
  const o = [],
    br = Math.sin(t / 700) * 0.012,
    bl = blinkK(t + 3000),
    lv = Math.sin(t / 170) * 0.02;
  const RK = '#7a4a30',
    RD = '#5a3220';
  for (const s of [-1, 1]) o.push(MP([s * 0.22, 0.07, 0.12], [0.15, 0.07, 0.16], RD, { ao: 1 }));
  o.push(MP([0, 0.42 + br, 0], [0.5, 0.36 + br, 0.4], RK, { g: 0.1 }));
  o.push(MP([0, 0.8 + br, 0], [0.38, 0.42, 0.32], '#8a5a3a', { g: 0.1 }));
  o.push(MP([0, 1.1 + br, 0], [0.25, 0.22, 0.21], '#8a5a3a'));
  o.push(MP([0, 1.27 + br + lv, 0], [0.2, 0.07, 0.17], '#ff6a1a', { e: 1 }));
  o.push(MP([lv * 2, 1.36 + br, 0], [0.09, 0.08, 0.08], '#ffc84a', { e: 1 }));
  o.push(MP([-0.08, 1.3 + br + Math.sin(t / 230) * 0.03, 0.03], [0.05, 0.05, 0.05], '#ff9a2a', { e: 1 }));
  o.push(MP([0.02, 0.98 + br, 0.17], [0.05, 0.2, 0.04], '#ff7a1c', { e: 1, rot: [0, 0, 0.15] }));
  o.push(MP([-0.2, 0.78 + br, 0.2], [0.04, 0.16, 0.04], '#ff7a1c', { e: 1, rot: [0, 0, -0.3] }));
  for (const [x, y, z, r] of [
    [0.3, 0.55, 0.3, 0.09],
    [-0.34, 0.62, 0.28, 0.08],
    [0.1, 0.88, 0.24, 0.06],
    [-0.1, 1.0, 0.18, 0.05]
  ])
    o.push(MP([x, y + br, z], [r, r, r * 0.8], RD));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.5 + br, 0.38, 0.05, bl);
    mdCheek(o, s * 0.27, 0.4 + br, 0.35, '#ff8a6a');
  }
  o.push(MP([0, 0.38 + br, 0.4], [0.06, 0.016, 0.02], '#2a1208'));
  return o;
};
// Coralie — coquillage
MD[23] = t => {
  const o = [],
    bob = Math.sin(t / 800) * 0.012,
    bl = blinkK(t + 1400),
    sw = Math.sin(t / 900) * 0.03;
  const PK = '#f08aa8',
    PD = '#c8607e',
    SH = '#7cc4ee';
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.2, 0.075, 0.1], [0.13, 0.075, 0.14], PD, { ao: 1 }));
    o.push(MP([s * 0.2, 0.16, 0.06], [0.1, 0.09, 0.1], PK));
  }
  o.push(MP([0, 0.4 + bob, 0.02], [0.38, 0.28, 0.33], PK, { g: 0.3 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.42 + bob, 0.31, 0.052, bl);
    mdCheek(o, s * 0.25, 0.32 + bob, 0.28, '#ff6a8a');
  }
  o.push(MP([0, 0.3 + bob, 0.34], [0.05, 0.014, 0.02], '#6a2a3a'));
  o.push(MP([0, 0.76 + bob, -0.05], [0.45, 0.34, 0.4], SH, { g: 0.9 }));
  o.push(MP([-0.14, 0.9 + bob, 0.1], [0.12, 0.06, 0.1], '#d6f0ff', { g: 1 }));
  o.push(MP([0, 0.74 + bob, 0.1], [0.34, 0.24, 0.26], '#9ad4f4', { g: 0.6 }));
  o.push(MP([0, 1.07 + bob, -0.04], [0.03, 0.16, 0.03], '#e6f4ff', { g: 1 }));
  o.push(MP([sw, 1.25 + bob, -0.04], [0.06, 0.06, 0.06], '#ffffff', { e: 1 }));
  for (const s of [-1, 1])
    o.push(MP([s * 0.4, 0.52 + bob, 0.0], [0.09, 0.11, 0.08], PD, { rot: [0, 0, s * 0.4] }));
  return o;
};
// Pétale — fleur
MD[24] = t => {
  const o = [],
    br = Math.sin(t / 700) * 0.012,
    bl = blinkK(t + 1700),
    wd = Math.sin(t / 900);
  const PK = '#f8b8d0',
    PD = '#f090b8',
    MG = '#d8508a';
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.14, 0.07, 0.09], [0.11, 0.07, 0.13], '#a83a64', { ao: 1 }));
    o.push(MP([s * 0.14, 0.18, 0.05], [0.08, 0.11, 0.08], MG));
  }
  o.push(MP([0, 0.44 + br, -0.02], [0.2, 0.3 + br, 0.17], MG, { g: 0.2 }));
  o.push(MP([0, 0.4 + br, 0.08], [0.13, 0.2, 0.09], '#e8789e'));
  for (const s of [-1, 1]) {
    o.push(
      MP([s * 0.3 + wd * 0.01, 0.36, -0.03], [0.24, 0.07, 0.05], MG, {
        rot: [0, 0, s * (0.5 + wd * 0.06)],
        g: 0.2
      })
    );
    o.push(MP([s * 0.36, 0.5 + br, 0.03], [0.1, 0.07, 0.04], MG, { rot: [0, 0, s * 0.6] }));
  }
  for (let i = 0; i < 8; i++) {
    const th = (i / 8) * Math.PI * 2,
      sw = Math.sin(t / 600 + i) * 0.02,
      rr = 0.42;
    o.push(
      MP(
        [Math.sin(th) * rr, 0.98 + br + Math.cos(th) * rr * 0.95, -0.05 - (i % 2) * 0.02],
        [0.19, 0.2, 0.07],
        i % 2 ? PD : PK,
        { rot: [0, 0, -th + sw], g: 0.3 }
      )
    );
  }
  o.push(MP([0, 0.98 + br, -0.04], [0.36, 0.36, 0.1], PD));
  o.push(MP([0, 0.98 + br, 0.04], [0.3, 0.3, 0.12], '#fff0a0', { g: 0.35 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.1, 1.0 + br, 0.15, 0.04, bl);
    mdCheek(o, s * 0.19, 0.9 + br, 0.13);
  }
  o.push(MP([0, 0.9 + br, 0.165], [0.05, 0.016, 0.02], '#8a4a2a'));
  return o;
};
// ---- lot 5 : espèces 25-37 ----
// Tempestor — tornade
MD[25] = t => {
  const o = [],
    bl = blinkK(t + 600);
  const T = [
    [1.18, 0.54, '#e8eef6'],
    [1.0, 0.46, '#9aa8bc'],
    [0.84, 0.4, '#f2f6fb'],
    [0.64, 0.32, '#9aa8bc'],
    [0.46, 0.22, '#dce4ee'],
    [0.3, 0.14, '#8896ac'],
    [0.18, 0.08, '#b8c4d4']
  ];
  T.forEach(([y, r, c], i) => {
    const sw = (Math.sin(t / 400 + i * 0.9) * 0.04 * (i + 1)) / 3;
    o.push(
      MP([sw, y + Math.sin(t / 700 + i) * 0.01, Math.cos(t / 500 + i) * 0.02], [r, 0.13, r * 0.85], c, {
        g: 0.2,
        rot: [Math.sin(t / 600 + i) * 0.06, (t / 900) * (i % 2 ? 1 : -1) * 0, 0]
      })
    );
  });
  const f = (Math.sin(t / 400 + 2 * 0.9) * 0.04 * 3) / 3;
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.12 + f, 0.84, 0.37, 0.06, bl);
    mdCheek(o, s * 0.24 + f, 0.76, 0.33);
  }
  o.push(MP([f, 0.75, 0.38], [0.04, 0.014, 0.02], '#5a6a80'));
  return o;
};
// Titanor — golem de pierre
MD[26] = t => {
  // golem de pierre taillé en blocs, comme son sprite
  const o = [],
    br = Math.sin(t / 900) * 0.008,
    gl = 0.75 + Math.sin(t / 300) * 0.25;
  const GY = '#8a8a92',
    GD = '#6a6a74',
    GL = '#aaaab4',
    TL = '#3fe0d0';
  o.push(MP([0, 0.05, 0], [0.5, 0.035, 0.34], '#4a4a54', { ao: 1 }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.2, 0.1, 0.02], [0.15, 0.1, 0.17], GD, { box: 1 }));
    o.push(MP([s * 0.2, 0.3, 0], [0.12, 0.12, 0.13], GY, { box: 1 }));
  }
  o.push(MP([0, 0.62 + br, 0], [0.36, 0.24, 0.26], GY, { box: 1, g: 0.15 }));
  o.push(MP([0, 0.6 + br, 0.27], [0.24, 0.15, 0.02], GL, { box: 1 }));
  o.push(MP([0, 0.62 + br, 0.3], [0.09, 0.07, 0.02], [63 * gl, 224 * gl, 208 * gl], { box: 1, e: 1 }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.46, 0.84 + br, 0], [0.13, 0.11, 0.15], GL, { box: 1, g: 0.15 }));
    o.push(MP([s * 0.5, 0.55 + br, 0.02], [0.1, 0.2, 0.11], GY, { box: 1 }));
    o.push(MP([s * 0.52, 0.27 + br, 0.04], [0.13, 0.1, 0.13], GD, { box: 1 }));
  }
  o.push(MP([0, 1.03 + br, 0.02], [0.22, 0.17, 0.2], GY, { box: 1, g: 0.15 }));
  o.push(MP([0, 1.22 + br, 0], [0.16, 0.04, 0.15], GL, { box: 1 }));
  o.push(MP([0, 1.03 + br, 0.225], [0.17, 0.045, 0.02], '#1e2a2e', { box: 1 }));
  for (const s of [-1, 1])
    o.push(MP([s * 0.08, 1.035 + br, 0.25], [0.045, 0.022, 0.01], TL, { box: 1, e: 1 }));
  o.push(MP([-0.16, 0.88 + br, 0.12], [0.08, 0.03, 0.08], '#6a9a5a'));
  return o;
};
// Braseron — grenouille de feu couronnée
MD[27] = t => {
  const o = [],
    br = Math.sin(t / 640) * 0.012,
    bl = blinkK(t + 700),
    wag = Math.sin(t / 450);
  const OR = '#e8552a',
    OD = '#b8401e',
    CR = '#f8c898',
    GD = '#f0c040';
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.17, 0.075, 0.135], [0.135, 0.075, 0.155], '#8a2a14', { ao: 1 }));
    o.push(MP([s * 0.17, 0.2, 0.04], [0.1, 0.13, 0.1], OD));
  }
  o.push(MP([0, 0.4 + br, 0], [0.31, 0.3 + br, 0.27], OR, { g: 0.2 }));
  o.push(MP([0, 0.36 + br, 0.16], [0.2, 0.22, 0.13], CR));
  for (const s of [-1, 1])
    o.push(MP([s * 0.32, 0.43 + br, 0.09], [0.08, 0.13, 0.08], OD, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.83 + br, 0.02], [0.37, 0.28, 0.31], OR, { g: 0.25 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.135, 0.87 + br, 0.285, 0.058, bl);
    mdBrow(o, s * 0.14, 0.96 + br, 0.29, -s * 0.4, '#4a1a0a');
    mdCheek(o, s * 0.235, 0.77 + br, 0.26);
  }
  o.push(MP([0, 0.74 + br, 0.3], [0.06, 0.022, 0.03], '#5a1a0a'));
  o.push(MP([0, 1.08 + br, 0.02], [0.24, 0.06, 0.21], GD, { e: 1 }));
  for (let i = 0; i < 5; i++) {
    const a = -0.8 + i * 0.4;
    o.push(
      MP(
        [Math.sin(a) * 0.2, 1.17 + br + Math.cos(a) * 0.03, Math.cos(a) * 0.17],
        [0.04, 0.1 + (i == 2 ? 0.04 : 0), 0.035],
        GD,
        { e: 1, rot: [0, 0, -a * 0.3] }
      )
    );
  }
  tailChain(
    o,
    6,
    u => [0.12 + u * 0.4 + wag * 0.04 * u, 0.2 + u * 0.4, -0.2 - u * 0.18],
    '#7a4a22',
    '#9a5e2c',
    0.09,
    0.12
  );
  o.push(MP([0.55 + wag * 0.05, 0.62, -0.42], [0.1, 0.14, 0.1], '#ff8a1c', { e: 1 }));
  return o;
};
// Givrelin — cube de glace
MD[28] = t => {
  // cube de glace, comme son sprite
  const o = [],
    br = Math.sin(t / 760) * 0.012,
    bl = blinkK(t + 1000);
  const IC = '#8ccbea',
    ID = '#5f9fca',
    IL = '#c8ecfb';
  o.push(MP([0, 0.06, 0], [0.4, 0.04, 0.36], '#5a98c0', { ao: 1 }));
  for (const s of [-1, 1]) o.push(MP([s * 0.2, 0.07, 0.08], [0.12, 0.07, 0.14], ID, { ao: 1 }));
  o.push(MP([0, 0.52 + br, 0], [0.4, 0.4, 0.36], IC, { box: 1, g: 0.8 }));
  o.push(MP([0, 0.94 + br, 0], [0.42, 0.045, 0.38], '#f4fbff', { box: 1, g: 0.5 }));
  o.push(MP([0.12, 0.99 + br, 0.05], [0.16, 0.04, 0.14], '#ffffff'));
  o.push(MP([-0.24, 0.72 + br, 0.365], [0.05, 0.14, 0.01], '#ffffff', { box: 1, e: 1, rot: [0, 0, 0.5] }));
  o.push(MP([-0.12, 0.79 + br, 0.365], [0.025, 0.08, 0.01], IL, { box: 1, e: 1, rot: [0, 0, 0.5] }));
  for (const [x, z, h] of [
    [-0.32, 0.3, 0.1],
    [0.05, 0.33, 0.07],
    [0.3, 0.3, 0.09]
  ])
    o.push(MP([x, 0.12 + br + h * 0.4, z], [0.035, h, 0.035], IL, { g: 0.8 }));
  for (let i = 0; i < 3; i++) {
    const a = t / 900 + i * 2.1;
    o.push(
      MP(
        [Math.cos(a) * 0.55, 0.6 + Math.sin(t / 500 + i) * 0.15, Math.sin(a) * 0.3],
        [0.04, 0.04, 0.04],
        '#ffffff',
        {
          e: 1
        }
      )
    );
  }
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.6 + br, 0.37, 0.05, bl);
    mdCheek(o, s * 0.27, 0.5 + br, 0.365, '#ff9ab0');
  }
  o.push(MP([0, 0.49 + br, 0.37], [0.06, 0.016, 0.02], '#3a5a7a'));
  return o;
};
// Cristalor — gemme
MD[29] = t => {
  // gemme taillée : corps à facettes (un pavé de face, un pavé tourné de 45°), pointe en haut
  const o = [],
    br = Math.sin(t / 720) * 0.01,
    bl = blinkK(t + 1800),
    gl = Math.sin(t / 500) * 0.5 + 0.5;
  const PU = '#8a58d8',
    PD = '#6a3cb4',
    PL = '#b890f0',
    PW = '#e6dcff',
    Q = Math.PI / 4;
  o.push(MP([0, 0.06, 0], [0.3, 0.035, 0.26], '#4a2a8a', { ao: 1 }));
  for (const s of [-1, 1]) o.push(MP([s * 0.14, 0.08, 0.1], [0.1, 0.075, 0.12], PD, { ao: 1 }));
  // le bas s'affine
  o.push(MP([0, 0.22, 0], [0.22, 0.1, 0.2], PD, { box: 1 }));
  o.push(MP([0, 0.22, 0], [0.19, 0.1, 0.19], PD, { box: 1, rot: [0, Q, 0] }));
  o.push(MP([0, 0.58 + br, 0], [0.32, 0.28, 0.27], PU, { box: 1, g: 0.9 }));
  o.push(MP([0, 0.58 + br, 0], [0.26, 0.28, 0.26], PL, { box: 1, g: 0.9, rot: [0, Q, 0] }));
  // pointe : étages de plus en plus petits et clairs
  [
    [0.91, 0.27, 0.07, PL],
    [1.03, 0.2, 0.07, '#c9b0f6'],
    [1.14, 0.13, 0.06, '#dccafa'],
    [1.23, 0.06, 0.05, PW]
  ].forEach(([y, r, h, c], k) =>
    o.push(MP([0, y + br, 0], [r, h, r * 0.9], c, { box: 1, g: 1, rot: [0, k % 2 ? Q : 0, 0] }))
  );
  o.push(MP([-0.21, 0.66 + br, 0.28], [0.03, 0.13, 0.01], '#ffffff', { box: 1, e: 1, rot: [0, 0, 0.25] }));
  o.push(MP([0.1 + gl * 0.02, 1.16 + br, 0.04], [0.04, 0.03, 0.035], '#fff', { e: 1 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.16, 0.64 + br, 0.28, 0.048, bl);
    mdCheek(o, s * 0.25, 0.54 + br, 0.28);
  }
  o.push(MP([0, 0.52 + br, 0.375], [0.045, 0.014, 0.02], '#3a1a6a'));
  return o;
};
// Foudrion — éclair
MD[30] = t => {
  const o = [],
    bl = blinkK(t + 500),
    bob = Math.sin(t / 600) * 0.03,
    fk = 0.85 + Math.abs(Math.sin(t / 90)) * 0.15;
  const YE = '#ffe04a',
    YD = '#f2be28';
  o.push(MP([0, 0.06, 0], [0.24, 0.03, 0.2], '#7a6a30', { ao: 1 }));
  // éclair en Z : segment du haut, petit décrochement, segment du bas qui finit en pointe
  o.push(MP([0.06, 1.05 + bob, 0], [0.12, 0.28, 0.08], YE, { box: 1, e: 1, rot: [0, 0, -0.5] }));
  o.push(MP([0.04, 0.8 + bob, 0], [0.17, 0.08, 0.08], YE, { box: 1, e: 1 }));
  o.push(MP([0.04, 0.55 + bob, 0], [0.11, 0.28, 0.08], YD, { box: 1, e: 1, rot: [0, 0, -0.5] }));
  o.push(MP([-0.12, 0.26 + bob, 0], [0.06, 0.1, 0.07], YD, { box: 1, e: 1, rot: [0, 0, -0.5] }));
  o.push(MP([0.04, 0.8 + bob, 0.09], [0.17, 0.15, 0.05], '#fffdf4', { g: 0.5 }));
  for (const s of [-1, 1]) {
    mdEye(o, 0.04 + s * 0.07, 0.83 + bob, 0.13, 0.032, bl);
    mdCheek(o, 0.04 + s * 0.13, 0.76 + bob, 0.12);
  }
  o.push(MP([0.04, 0.75 + bob, 0.14], [0.035, 0.012, 0.015], '#6a5a2a'));
  for (const [x, y, ph] of [
    [-0.48, 1.05, 0],
    [0.46, 0.38, 2],
    [0.42, 1.2, 4]
  ])
    o.push(
      MP([x, y + Math.sin(t / 300 + ph) * 0.04, 0], [0.11 * fk, 0.025, 0.03], '#ffffff', {
        e: 1,
        rot: [0, 0, Math.sin(t / 200 + ph) * 0.5]
      })
    );
  return o;
};
// Ombrelin — chauve-souris
MD[31] = t => {
  const o = [],
    br = Math.sin(t / 560) * 0.012,
    bl = blinkK(t + 2700),
    fl = Math.sin(t / 260) * 0.08;
  const PU = '#6a4a98',
    PD = '#4a3270',
    LT = '#8a6ab8',
    MB = '#b890d8',
    PK = '#ff9ac0';
  for (const s of [-1, 1]) o.push(MP([s * 0.1, 0.09, 0.06], [0.08, 0.07, 0.1], PD, { ao: 1 }));
  o.push(MP([0, 0.56 + br, 0], [0.3, 0.38 + br, 0.26], PU, { g: 0.2 }));
  o.push(MP([0, 0.5 + br, 0.17], [0.19, 0.27, 0.12], LT));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.46, 0.9 + br, -0.06], [0.3, 0.045, 0.04], PD, { rot: [0, 0, s * (0.55 + fl)] }));
    o.push(
      MP([s * 0.56, 0.62 + br, -0.06], [0.3, 0.3, 0.03], MB, { rot: [0, 0, s * (0.15 + fl * 0.6)], g: 0.2 })
    );
    o.push(MP([s * 0.34, 0.42 + br, -0.06], [0.14, 0.2, 0.03], MB, { rot: [0, 0, s * (0.1 + fl * 0.3)] }));
    o.push(
      MP([s * 0.62, 0.46 + br, -0.06], [0.08, 0.16, 0.03], '#a078c8', { rot: [0, 0, s * (0.1 + fl * 0.5)] })
    );
  }
  o.push(MP([0, 1.0 + br, 0.02], [0.31, 0.26, 0.26], PU, { g: 0.25 }));
  o.push(MP([0, 0.93 + br, 0.21], [0.16, 0.12, 0.1], LT));
  o.push(MP([0, 0.96 + br, 0.3], [0.04, 0.03, 0.03], '#2a1a40'));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.17, 1.3 + br, 0], [0.1, 0.2, 0.05], PU, { rot: [0, 0, -s * 0.3], g: 0.15 }));
    o.push(MP([s * 0.17, 1.28 + br, 0.03], [0.06, 0.13, 0.03], PK, { rot: [0, 0, -s * 0.3] }));
    o.push(MP([s * 0.13, 1.03 + br, 0.26], [0.075, 0.085 * bl, 0.04], '#ffffff', { g: 0.6 }));
    o.push(MP([s * 0.13, 1.03 + br, 0.295], [0.04, 0.05 * bl, 0.025], '#1a1030', { g: 0.9 }));
    mdBrow(o, s * 0.14, 1.12 + br, 0.26, -s * 0.3, '#2a1a40');
    o.push(MP([s * 0.05, 0.88 + br, 0.31], [0.015, 0.03, 0.012], '#ffffff'));
  }
  return o;
};
// Sylvanide — sapin
MD[32] = t => {
  const o = [],
    br = Math.sin(t / 700) * 0.01,
    bl = blinkK(t + 2300);
  const T = [
    [0.34, 0.54, '#2f8a4a'],
    [0.62, 0.47, '#3a9a54'],
    [0.9, 0.37, '#2f8a4a'],
    [1.14, 0.27, '#3a9a54'],
    [1.32, 0.14, '#4aaa60']
  ];
  for (const s of [-1, 1]) o.push(MP([s * 0.12, 0.07, 0.08], [0.1, 0.07, 0.12], '#4a3220', { ao: 1 }));
  o.push(MP([0, 0.18, 0], [0.12, 0.14, 0.1], '#6a4a2a'));
  T.forEach(([y, r, c], i) => {
    const sw = Math.sin(t / 800 + i) * 0.012;
    o.push(MP([sw * i, y + br, 0], [r, 0.14, r * 0.9], c, { g: 0.2 }));
  });
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.62 + br, 0.43, 0.05, bl);
    mdCheek(o, s * 0.28, 0.54 + br, 0.4);
  }
  o.push(MP([0, 0.53 + br, 0.45], [0.045, 0.014, 0.02], '#1a4a24'));
  o.push(MP([0, 1.4 + br, 0], [0.065, 0.065, 0.065], '#ffe27a', { e: 1 }));
  return o;
};
// Éclipsor — éclipse
MD[33] = t => {
  const o = [],
    bob = Math.sin(t / 800) * 0.03,
    bl = blinkK(t + 1100);
  o.push(MP([0, 0.72 + bob, -0.12], [0.6, 0.6, 0.08], '#d8c8f0', { e: 1 }));
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2,
      L = 0.09 + Math.sin(t / 200 + i * 2) * 0.02;
    o.push(
      MP([Math.sin(a) * 0.6, 0.72 + bob + Math.cos(a) * 0.6, -0.1], [0.05, L, 0.04], '#f2e8ff', {
        e: 1,
        rot: [0, 0, -a]
      })
    );
  }
  o.push(MP([0, 0.72 + bob, 0], [0.46, 0.46, 0.42], '#3a2a6a', { g: 0.5 }));
  o.push(MP([-0.14, 0.86 + bob, 0.3], [0.14, 0.12, 0.06], '#6a56a8', { g: 0.8 }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.15, 0.74 + bob, 0.36], [0.075, 0.07 * bl, 0.04], '#ffffff', { g: 0.6 }));
    o.push(MP([s * 0.15, 0.73 + bob, 0.395], [0.036, 0.04 * bl, 0.02], '#1a1030', { g: 0.9 }));
    mdBrow(o, s * 0.15, 0.84 + bob, 0.38, -s * 0.4, '#e8d8ff');
  }
  o.push(MP([0, 0.6 + bob, 0.42], [0.07, 0.014, 0.02], '#e8d8ff'));
  return o;
};
// Volcanor — grand volcan
MD[34] = t => {
  const o = [],
    br = Math.sin(t / 720) * 0.012,
    bl = blinkK(t + 800),
    lv = Math.sin(t / 160) * 0.025;
  const RK = '#5a3828',
    RD = '#3a2018';
  for (const s of [-1, 1]) o.push(MP([s * 0.24, 0.07, 0.12], [0.15, 0.07, 0.16], RD, { ao: 1 }));
  o.push(MP([0, 0.4 + br, 0], [0.54, 0.36 + br, 0.43], RK, { g: 0.1 }));
  o.push(MP([0, 0.78 + br, 0], [0.4, 0.46, 0.33], '#6a4430', { g: 0.1 }));
  o.push(MP([0, 1.08 + br, 0], [0.26, 0.24, 0.21], '#6a4430'));
  o.push(MP([0, 1.25 + br + lv, 0], [0.24, 0.08, 0.19], '#ff5a1a', { e: 1 }));
  o.push(MP([lv, 1.36 + br, 0], [0.13, 0.12, 0.1], '#ff9a2a', { e: 1 }));
  o.push(MP([lv * 1.5, 1.42 + br, 0], [0.06, 0.06, 0.06], '#ffe27a', { e: 1 }));
  o.push(MP([0.03, 0.98 + br, 0.2], [0.07, 0.25, 0.05], '#ff7a1c', { e: 1, rot: [0, 0, 0.2] }));
  o.push(MP([-0.2, 0.74 + br, 0.26], [0.05, 0.2, 0.04], '#ff7a1c', { e: 1, rot: [0, 0, -0.35] }));
  for (const [x, y, z, r] of [
    [0.34, 0.5, 0.34, 0.1],
    [-0.38, 0.58, 0.3, 0.09],
    [0.16, 0.9, 0.28, 0.07]
  ])
    o.push(MP([x, y + br, z], [r, r, r * 0.8], RD));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.15, 0.5 + br, 0.4, 0.052, bl);
    mdCheek(o, s * 0.28, 0.4 + br, 0.37, '#ff8a6a');
  }
  o.push(MP([0, 0.38 + br, 0.42], [0.06, 0.016, 0.02], '#2a1208'));
  return o;
};
// Récifor — corail
MD[35] = t => {
  const o = [],
    br = Math.sin(t / 700) * 0.012,
    bl = blinkK(t + 1600);
  const PK = '#f0a0b8',
    PL = '#f8c8d8',
    PD = '#d87898';
  for (const s of [-1, 1]) o.push(MP([s * 0.2, 0.07, 0.1], [0.13, 0.07, 0.14], PD, { ao: 1 }));
  o.push(MP([0, 0.4 + br, 0], [0.46, 0.32 + br, 0.38], PK, { g: 0.3 }));
  o.push(MP([0, 0.36 + br, 0.2], [0.3, 0.22, 0.18], PL));
  for (const [x, y, h, a] of [
    [-0.38, 0.62, 0.22, 0.45],
    [0.38, 0.62, 0.22, -0.45],
    [-0.2, 0.74, 0.28, 0.2],
    [0.2, 0.74, 0.28, -0.2],
    [0, 0.78, 0.3, 0]
  ]) {
    const sw = Math.sin(t / 600 + x * 5) * 0.025;
    o.push(
      MP([x + Math.sin(-a) * h * 0.4 + sw, y + br + h * 0.4, -0.04], [0.08, h * 0.55, 0.08], PK, {
        rot: [0, 0, a],
        g: 0.2
      })
    );
    o.push(
      MP([x + Math.sin(-a) * h * 1.0 + sw * 1.6, y + br + h * 1.05, -0.04], [0.1, 0.1, 0.1], PL, { g: 0.5 })
    );
  }
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.15, 0.45 + br, 0.34, 0.05, bl);
    mdCheek(o, s * 0.29, 0.34 + br, 0.31, '#ff7a9a');
  }
  o.push(MP([0, 0.33 + br, 0.375], [0.055, 0.016, 0.02], '#8a3a5a'));
  return o;
};
// Floralune — fleur lunaire (variante de Pétale)
MD[36] = t => {
  const o = MD[24](t),
    cy = 0.98 + Math.sin(t / 700) * 0.012;
  o.push(MP([-0.11, cy + 0.1, 0.17], [0.09, 0.09, 0.03], '#ffd84a', { e: 1 }));
  o.push(MP([-0.07, cy + 0.11, 0.19], [0.082, 0.082, 0.03], '#fff0a0'));
  for (const s of [-1, 1])
    o.push(
      MP([s * 0.34, 0.5 + Math.sin(t / 700) * 0.012, 0.05], [0.1, 0.06, 0.04], '#9a58b8', {
        rot: [0, 0, s * 0.6]
      })
    );
  return o;
};
// Nocturne — chat nuit
MD[37] = t => {
  const o = [],
    br = Math.sin(t / 640) * 0.012,
    wag = Math.sin(t / 470),
    ear = Math.sin(t / 1000) * 0.07,
    bl = blinkK(t + 2900);
  const NV = '#2a2f5a',
    ND = '#1a1d3e',
    LT = '#8a90b8',
    PK = '#ff9ac0';
  mdFeet(o, 0.15, '#14162e');
  for (const s of [-1, 1]) o.push(MP([s * 0.15, 0.2, 0.04], [0.1, 0.13, 0.1], ND));
  o.push(MP([0, 0.4 + br, 0], [0.27, 0.26 + br, 0.23], NV, { g: 0.3 }));
  o.push(MP([0, 0.38 + br, 0.14], [0.17, 0.19, 0.12], LT));
  for (const s of [-1, 1])
    o.push(MP([s * 0.3, 0.42 + br, 0.09], [0.075, 0.13, 0.075], ND, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.83 + br, 0.02], [0.36, 0.28, 0.31], '#323868', { g: 0.4 }));
  o.push(MP([0, 0.745 + br, 0.25], [0.16, 0.11, 0.1], '#aab0cc'));
  o.push(MP([0, 0.775 + br, 0.345], [0.036, 0.026, 0.026], '#ff8fb0', { g: 0.6 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.145, 0.87 + br, 0.285, 0.065, bl, '#ffe27a');
    mdCheek(o, s * 0.235, 0.765 + br, 0.25);
    o.push(MP([s * 0.23, 1.12 + br, 0], [0.11, 0.18, 0.06], NV, { rot: [0, 0, -s * (0.45 + ear)], g: 0.3 }));
    o.push(MP([s * 0.225, 1.11 + br, 0.04], [0.06, 0.12, 0.03], PK, { rot: [0, 0, -s * (0.45 + ear)] }));
  }
  o.push(MP([0, 1.0 + br, 0.29], [0.075, 0.075, 0.03], '#f4f0ff', { e: 1 }));
  o.push(MP([0.035, 1.015 + br, 0.31], [0.068, 0.068, 0.03], '#323868'));
  tailChain(
    o,
    6,
    u => [
      0.12 + u * 0.38 + wag * 0.05 * u,
      0.3 + u * 0.55 - u * u * 0.05 + Math.sin(t / 300 + u * 3) * 0.01,
      -0.2 - u * 0.14
    ],
    '#1a1d3e',
    '#2a2f5a',
    0.07,
    0.08
  );
  o.push(MP([0.52 + wag * 0.06, 0.88, -0.34], [0.12, 0.12, 0.12], '#ffffff', { e: 1 }));
  return o;
};
// ---- lot 6 : usines d'archétypes + espèces 38-69 ----
const mdRc = (o, m) => {
  const mm = {};
  for (const k in m) mm[hex3(k).join()] = hex3(m[k]);
  o.forEach(p => {
    const n = mm[p.c.join()];
    if (n) p.c = n.slice();
  });
  return o;
};
// créature debout générique (tête + corps + oreilles + queue)
function mdCrt(t, c) {
  const ph = c.ph || 0,
    o = [],
    br = Math.sin(t / (600 + ph * 40)) * 0.012,
    bl = blinkK(t + ph * 410),
    wag = Math.sin(t / 470 + ph),
    ear = Math.sin(t / 1000 + ph) * 0.07;
  const B = c.B,
    D = c.D || B,
    L = c.L || '#f4e8d0',
    H = c.H || B,
    bs = c.bs || 1,
    hs = c.hs || 1,
    hy = 0.83 + br + (c.hy || 0);
  mdFeet(o, 0.15 * bs, c.F || D, [0.12 * bs, 0.075, 0.15 * bs]);
  for (const s of [-1, 1]) o.push(MP([s * 0.15 * bs, 0.2, 0.04], [0.1 * bs, 0.13, 0.1 * bs], D));
  o.push(MP([0, 0.4 + br, 0], [0.27 * bs, 0.26 + br, 0.23 * bs], B, { g: 0.2 }));
  o.push(MP([0, 0.38 + br, 0.14 * bs], [0.17 * bs, 0.19, 0.12], L));
  if (c.arms !== 0)
    for (const s of [-1, 1])
      o.push(MP([s * 0.3 * bs, 0.42 + br, 0.09], [0.075, 0.13, 0.075], c.A || D, { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, hy, 0.02], [0.35 * hs, 0.28 * hs, 0.3 * hs], H, { g: 0.25 }));
  if (c.sn !== 0) {
    o.push(MP([0, hy - 0.085 * hs, 0.25 * hs], [0.16 * hs, 0.11 * hs, 0.1 * hs], c.sn || L));
    o.push(MP([0, hy - 0.05 * hs, 0.345 * hs], [0.042, 0.032, 0.03], c.nc || '#3a1810', { g: 0.7 }));
  }
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.145 * hs, hy + 0.04 * hs, 0.285 * hs, c.er || 0.055, bl, c.eyeC);
    mdCheek(o, s * 0.235 * hs, hy - 0.065 * hs, 0.25 * hs, c.ck);
    if (c.brow) mdBrow(o, s * 0.15 * hs, hy + 0.13 * hs, 0.29 * hs, -s * c.brow, c.brc || '#2a1a10');
  }
  const ek = c.ears || 'pt',
    EC = c.ec || B,
    EI = c.ei || '#ff9ac0';
  for (const s of [-1, 1]) {
    if (ek == 'pt') {
      o.push(
        MP([s * 0.23 * hs, hy + 0.29 * hs, 0], [0.11, 0.18, 0.06], EC, {
          rot: [0, 0, -s * (0.45 + ear)],
          g: 0.15
        })
      );
      o.push(
        MP([s * 0.225 * hs, hy + 0.28 * hs, 0.04], [0.06, 0.12, 0.03], EI, { rot: [0, 0, -s * (0.45 + ear)] })
      );
    } else if (ek == 'rd') {
      o.push(MP([s * 0.26 * hs, hy + 0.24 * hs, 0], [0.12, 0.12, 0.05], EC, { rot: [0, 0, -s * ear] }));
      o.push(MP([s * 0.26 * hs, hy + 0.24 * hs, 0.03], [0.07, 0.07, 0.03], EI));
    } else if (ek == 'lg') {
      o.push(
        MP([s * 0.13 * hs, hy + 0.45 * hs, 0], [0.075, 0.27, 0.045], EC, {
          rot: [0, 0, -s * (0.14 + ear * 0.6)],
          g: 0.15
        })
      );
      o.push(
        MP([s * 0.13 * hs, hy + 0.45 * hs, 0.03], [0.04, 0.2, 0.025], EI, {
          rot: [0, 0, -s * (0.14 + ear * 0.6)]
        })
      );
    } else if (ek == 'dr') {
      o.push(
        MP([s * 0.38 * hs, hy + 0.12 * hs, 0], [0.16, 0.07, 0.04], EC, {
          rot: [0, 0, s * (0.45 - ear)],
          g: 0.15
        })
      );
      o.push(
        MP([s * 0.37 * hs, hy + 0.12 * hs, 0.03], [0.1, 0.04, 0.03], EI, { rot: [0, 0, s * (0.45 - ear)] })
      );
    }
  }
  const tk = c.tail || 'none';
  if (tk == 'chain')
    tailChain(
      o,
      6,
      u => [
        0.1 + u * 0.4 + wag * 0.05 * u,
        0.28 + u * 0.42 + Math.sin(t / 300 + u * 3) * 0.01,
        -0.2 - u * 0.16
      ],
      c.t1 || D,
      c.t2 || B,
      c.tr0 || 0.08,
      c.tr1 || 0.1
    );
  else if (tk == 'puff') o.push(MP([0, 0.28, -0.28], [0.13, 0.13, 0.13], c.t1 || '#fff', { g: 0.1 }));
  if (c.extra) c.extra(o, { br, t, bl, hy, hs, bs, wag, ear });
  return o;
}
// soleil
function mdSun(t, P) {
  const o = [],
    bob = Math.sin(t / 800) * 0.03,
    bl = blinkK(t + P.ph),
    sp = (t / 2600) * (P.spin || 0),
    cy = 0.72 + bob;
  for (let i = 0; i < P.n; i++) {
    const a = (i / P.n) * Math.PI * 2 + sp,
      L = P.len + Math.sin(t / 220 + i * 1.9) * 0.025;
    o.push(
      MP([Math.sin(a) * P.rr, cy + Math.cos(a) * P.rr, -0.04], [P.w, L, 0.07], i % 2 ? P.r1 : P.r2, {
        rot: [0, 0, -a],
        e: 1
      })
    );
  }
  o.push(MP([0, cy, -0.06], [P.rr * 0.95, P.rr * 0.95, 0.08], P.r2, { e: 1 }));
  o.push(MP([0, cy, 0], [0.43, 0.43, 0.3], P.core, { g: 0.5 }));
  if (P.face) o.push(MP([0, cy - 0.03, 0.12], [0.34, 0.3, 0.2], P.face, { g: 0.3 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.13, cy + 0.07, 0.3, 0.05, bl);
    mdCheek(o, s * 0.25, cy - 0.03, 0.27, '#ff8a6a');
  }
  o.push(MP([0, cy - 0.1, 0.325], [0.07, 0.02, 0.02], '#8a4a2a'));
  return o;
}
// orbe avec écusson
function mdOrb(t, P) {
  const o = [],
    bob = Math.sin(t / 900) * 0.03,
    cy = 0.72 + bob,
    bl = blinkK(t + P.ph);
  o.push(MP([0, cy, -0.04], [0.54, 0.54, 0.08], P.rim, { e: 1 }));
  o.push(MP([0, cy, 0], [0.48, 0.48, 0.43], P.c, { g: 0.7 }));
  o.push(MP([-0.16, cy + 0.2, 0.3], [0.15, 0.1, 0.06], P.hi || '#8a78d8', { g: 1 }));
  for (const [x, y, z] of P.sp || [
    [0.3, 0.25, 0.3],
    [-0.32, 0.0, 0.3],
    [0.2, -0.3, 0.3],
    [-0.1, 0.4, 0.25],
    [0.38, -0.08, 0.25]
  ])
    o.push(MP([x, cy + y, z], [0.028, 0.028, 0.02], '#fff', { e: 1 }));
  o.push(MP([0, cy - 0.02, 0.38], [0.2, 0.18, 0.06], P.patch, { g: 0.3 }));
  for (const s of [-1, 1])
    o.push(MP([s * 0.085, cy + 0.01, 0.43], [0.032, 0.042 * bl, 0.02], '#1a1030', { g: 0.9 }));
  o.push(MP([0, cy - 0.07, 0.435], [0.03, 0.012, 0.012], '#8a4a6a'));
  return o;
}
// nuage
function mdCloud(t, P) {
  const o = [],
    bob = Math.sin(t / 900) * 0.025,
    bl = blinkK(t + P.ph),
    w = Math.sin(t / 700) * 0.02;
  o.push(MP([0, 0.1, 0], [0.34, 0.04, 0.28], '#4a3a70', { ao: 1 }));
  o.push(MP([0, 0.52 + bob, 0], [0.46, 0.34, 0.34], P.c, { g: 0.3 }));
  for (const [x, y, z, r] of [
    [-0.32, 0.6, 0.04, 0.2],
    [0.32, 0.6, 0.04, 0.2],
    [-0.16, 0.8, -0.04, 0.22],
    [0.16, 0.82, -0.04, 0.2],
    [0, 0.88, -0.1, 0.18],
    [-0.38, 0.4, -0.02, 0.16],
    [0.38, 0.4, -0.02, 0.16]
  ])
    o.push(MP([x + w * (x > 0 ? 1 : -1), y + bob, z], [r, r * 0.9, r], P.c2 || P.c, { g: 0.3 }));
  o.push(MP([0, 0.45 + bob, 0.28], [0.24, 0.15, 0.1], P.l, { g: 0.2 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.6 + bob, 0.32, 0.05, bl);
    mdCheek(o, s * 0.3, 0.5 + bob, 0.28);
    if (P.arms)
      o.push(
        MP([s * 0.55, 0.45 + bob + Math.sin(t / 500 + s) * 0.03, 0.04], [0.2, 0.07, 0.06], P.c2 || P.c, {
          rot: [0, 0, s * 0.5]
        })
      );
  }
  o.push(MP([0, 0.45 + bob, 0.37], [0.05, 0.016, 0.02], '#4a2a5a'));
  return o;
}
// méduse
function mdJelly(t, P) {
  const o = [],
    bob = Math.sin(t / 760) * 0.03,
    bl = blinkK(t + P.ph),
    pu = Math.sin(t / 500) * 0.02;
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * 0.17,
      ph = t / 500 + i * 1.3;
    for (let k = 0; k < 3; k++)
      o.push(
        MP(
          [
            x * (1 + k * 0.1) + Math.sin(ph - k * 0.7) * 0.03 * (k + 1),
            0.34 + bob - k * 0.14,
            Math.sin(i * 2.1) * 0.1
          ],
          [0.06 - k * 0.012, 0.1, 0.06 - k * 0.012],
          P.t,
          { g: 0.2 }
        )
      );
  }
  o.push(MP([0, 0.72 + bob, 0], [0.44 + pu, 0.36, 0.4 + pu], P.d, { g: 0.8 }));
  o.push(MP([0, 0.55 + bob, 0.18], [0.32, 0.2, 0.22], P.dl, { g: 0.3 }));
  if (P.cap) o.push(MP([0, 1.02 + bob, 0], [0.1, 0.1, 0.1], '#fff', { e: 1 }));
  if (P.spots)
    for (const [x, y, z] of [
      [-0.22, 0.9, 0.2],
      [0.2, 0.95, 0.15],
      [0, 1.05, 0.0],
      [-0.3, 0.78, 0.1]
    ])
      o.push(MP([x, y + bob, z], [0.07, 0.06, 0.05], '#f6f0ff', { g: 0.4 }));
  if (!P.spots)
    o.push(MP([0, 0.98 + bob, 0.12], [0.16, 0.04, 0.12], '#d8eeff', { g: 0.8, rot: [0.4, 0, 0] }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.62 + bob, 0.36, 0.052, bl);
    mdCheek(o, s * 0.28, 0.52 + bob, 0.32);
  }
  o.push(MP([0, 0.52 + bob, 0.395], [0.05, 0.016, 0.02], '#2a4a7a'));
  return o;
}
// tortue
function mdTurtle(t, P) {
  const o = [],
    br = Math.sin(t / 800) * 0.012,
    bl = blinkK(t + P.ph),
    hn = Math.sin(t / 1200) * 0.02;
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.34, 0.1, 0.28], [0.13, 0.09, 0.15], P.g, { ao: 1 }));
    o.push(MP([s * 0.3, 0.1, -0.28], [0.14, 0.09, 0.15], P.g, { ao: 1 }));
  }
  o.push(MP([0, 0.5 + br, -0.04], [0.52, 0.14, 0.46], P.rim, { ao: 1 }));
  o.push(MP([0, 0.65 + br, -0.04], [0.5, 0.36, 0.44], P.sh, { g: 0.2 }));
  for (const [x, y, z, r] of [
    [-0.2, 0.9, 0.0, 0.15],
    [0.22, 0.88, -0.1, 0.14],
    [0, 0.95, -0.2, 0.13],
    [-0.34, 0.7, 0.1, 0.12],
    [0.36, 0.72, 0.0, 0.12]
  ])
    o.push(MP([x, y + br, z], [r, r * 0.5, r], P.moss, { g: 0.1 }));
  o.push(MP([0, 0.36 + br + hn, 0.36], [0.26, 0.24, 0.24], P.g, { g: 0.25 }));
  o.push(MP([0, 0.3 + br + hn, 0.52], [0.14, 0.08, 0.08], P.gl));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.11, 0.42 + br + hn, 0.52, 0.05, bl);
    mdCheek(o, s * 0.2, 0.32 + br + hn, 0.5, '#ff8a8a');
  }
  if (P.tree) {
    o.push(MP([0, 1.02 + br, -0.04], [0.05, 0.14, 0.05], '#6a4a2a'));
    o.push(MP([0, 1.24 + br, -0.04], [0.3, 0.1, 0.26], '#4aa84a', { g: 0.2 }));
    o.push(MP([0, 1.32 + br, -0.04], [0.2, 0.1, 0.18], '#78c860'));
    o.push(MP([0.1, 1.4 + br, 0], [0.04, 0.04, 0.04], '#ff9ac0'));
  }
  return o;
}
// poisson
function mdFish(t, P) {
  const o = [],
    bob = Math.sin(t / 700) * 0.025,
    bl = blinkK(t + P.ph),
    tl = Math.sin(t / 420) * 0.07;
  o.push(MP([0, 0.1, 0], [0.3, 0.04, 0.24], '#5a7a9a', { ao: 1 }));
  for (let i = 0; i < 5; i++) {
    const u = i / 4;
    o.push(
      MP(
        [tl * u, 0.5 + bob + u * 0.1, -0.28 - u * 0.22],
        [0.2 - u * 0.08, 0.26 - u * 0.1, 0.14 - u * 0.04],
        P.b,
        { g: 0.3 }
      )
    );
  }
  o.push(MP([tl * 1.4, 0.7 + bob, -0.78], [0.04, 0.22, 0.16], P.f, { rot: [0, 0, 0.2 + tl], g: 0.2 }));
  o.push(MP([tl * 1.5, 0.45 + bob, -0.78], [0.04, 0.2, 0.14], P.f, { rot: [0, 0, -0.3 + tl] }));
  o.push(MP([0, 0.6 + bob, 0], [0.34, 0.44, 0.38], P.b, { g: 0.5 }));
  o.push(MP([0, 0.5 + bob, 0.2], [0.22, 0.28, 0.18], P.l));
  o.push(MP([0, 1.06 + bob, -0.06], [0.05, 0.2, 0.22], P.f, { g: 0.2, rot: [0.3, 0, 0] }));
  for (const s of [-1, 1]) {
    o.push(
      MP([s * 0.38, 0.5 + bob, 0.06], [0.07, 0.15, 0.12], P.f, { rot: [0, 0, s * 0.4 + tl * s], g: 0.2 })
    );
    o.push(MP([s * 0.25, 0.74 + bob, 0.3], [0.09, 0.09, 0.05], '#fff', { g: 0.6 }));
    o.push(MP([s * 0.25, 0.74 + bob, 0.34], [0.05, 0.055 * bl, 0.03], '#1a1010', { g: 0.9 }));
    mdCheek(o, s * 0.3, 0.58 + bob, 0.3);
    if (P.moon) {
      o.push(MP([s * 0.35, 0.66 + bob, 0.12], [0.09, 0.09, 0.03], '#ffd84a', { e: 1, rot: [0, s * 0.9, 0] }));
      o.push(MP([s * 0.37, 0.68 + bob, 0.14], [0.08, 0.08, 0.03], P.b, { rot: [0, s * 0.9, 0] }));
    }
  }
  o.push(MP([0, 0.52 + bob, 0.37], [0.07, 0.04, 0.06], P.f));
  return o;
}
// serpent enroulé
function mdCoil(t, P) {
  const o = [],
    br = Math.sin(t / 640) * 0.012,
    bl = blinkK(t + P.ph),
    sw = Math.sin(t / 700) * 0.03;
  for (let r = 0; r < 3; r++) {
    const R = 0.4 - r * 0.06,
      y = 0.14 + r * 0.17;
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + r * 0.7;
      o.push(
        MP([Math.sin(a) * R, y, Math.cos(a) * R * 0.85], [0.15, 0.12, 0.15], r % 2 ? P.b2 : P.b, { g: 0.25 })
      );
      if (Math.cos(a) > 0.3)
        o.push(
          MP([Math.sin(a) * R, y, Math.cos(a) * R * 0.85 + 0.12], [0.055, 0.055, 0.04], P.d, {
            rot: [0, 0, 0.78]
          })
        );
    }
  }
  for (let i = 0; i < 4; i++)
    o.push(MP([Math.sin(t / 500 + i) * 0.02, 0.66 + i * 0.07, 0], [0.11, 0.1, 0.11], P.b, { g: 0.2 }));
  o.push(MP([sw, 0.98 + br, 0.02], [0.3, 0.24, 0.26], P.h || P.b, { g: 0.3 }));
  o.push(MP([sw, 0.9 + br, 0.2], [0.15, 0.1, 0.1], P.l));
  for (const s of [-1, 1]) {
    mdEye(o, sw + s * 0.12, 1.02 + br, 0.25, 0.05, bl);
    mdCheek(o, sw + s * 0.22, 0.92 + br, 0.22);
  }
  o.push(MP([sw, 0.88 + br, 0.29], [0.045, 0.014, 0.02], '#3a2a1a'));
  if (P.crest)
    for (let i = 0; i < 5; i++) {
      const a = -0.8 + i * 0.4;
      o.push(
        MP(
          [sw + Math.sin(a) * 0.2, 1.2 + br, Math.cos(a) * 0.08],
          [0.035, 0.1 + (i == 2 ? 0.05 : 0), 0.03],
          '#ffd84a',
          { e: 1, rot: [0, 0, -a * 0.4] }
        )
      );
    }
  tailChain(o, 5, u => [0.38 + u * 0.18, 0.1, 0.1 - u * 0.3], P.b2, P.b, 0.06, 0.1);
  return o;
}
// dragon marin en S
function mdSea(t, P) {
  const o = [],
    bob = Math.sin(t / 700) * 0.025,
    bl = blinkK(t + P.ph);
  for (let i = 0; i < 9; i++) {
    const u = i / 8,
      sw = Math.sin(t / 520 + u * 4) * 0.04;
    o.push(
      MP(
        [
          Math.sin(u * 3.4 + 0.6) * 0.3 * (1 - u * 0.2) + sw,
          0.28 + (1 - u) * 0.62 + bob * (1 - u),
          Math.cos(u * 3.4) * 0.1 - u * 0.1
        ],
        [0.19 - u * 0.1, 0.15, 0.17 - u * 0.09],
        i % 2 ? P.b : P.b2,
        { g: 0.4 }
      )
    );
    if (i % 2 == 0)
      o.push(
        MP(
          [Math.sin(u * 3.4 + 0.6) * 0.3 * (1 - u * 0.2) + sw + 0.12, 0.3 + (1 - u) * 0.62, -u * 0.1],
          [0.05, 0.1, 0.03],
          P.f,
          { rot: [0, 0, -0.5], g: 0.3 }
        )
      );
  }
  o.push(MP([0, 1.05 + bob, 0.04], [0.3, 0.24, 0.27], P.b, { g: 0.5 }));
  o.push(MP([0, 0.96 + bob, 0.22], [0.15, 0.1, 0.1], P.l));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.13, 1.09 + bob, 0.27, 0.05, bl);
    mdCheek(o, s * 0.23, 0.99 + bob, 0.24);
    o.push(MP([s * 0.17, 1.3 + bob, 0], [0.04, 0.16, 0.04], P.f, { rot: [0, 0, -s * 0.5], g: 0.4 }));
    o.push(MP([s * 0.36, 1.02 + bob, 0.1], [0.12, 0.04, 0.03], P.f, { rot: [0, 0, s * 0.2], g: 0.3 }));
    o.push(MP([s * 0.4 + s * 0.05, 0.98 + bob, 0.1], [0.04, 0.04, 0.04], '#fff', { e: 1 }));
  }
  o.push(MP([0, 0.94 + bob, 0.3], [0.04, 0.012, 0.02], '#1a2a4a'));
  return o;
}
// salamandre
function mdSal(t, P) {
  const o = [],
    br = Math.sin(t / 620) * 0.012,
    bl = blinkK(t + P.ph),
    wag = Math.sin(t / 430);
  for (const s of [-1, 1])
    for (const z of [0.22, -0.22]) {
      o.push(MP([s * 0.27, 0.1, z], [0.11, 0.1, 0.13], P.d, { ao: 1 }));
      o.push(MP([s * 0.24, 0.2, z], [0.09, 0.12, 0.09], P.b));
    }
  o.push(MP([0, 0.34 + br, -0.02], [0.3, 0.25 + br, 0.46], P.b, { g: 0.2 }));
  o.push(MP([0, 0.27 + br, 0.04], [0.2, 0.14, 0.4], P.l));
  for (const [x, z] of [
    [-0.1, 0.1],
    [0.12, -0.1],
    [0, -0.28],
    [-0.08, -0.3]
  ])
    o.push(MP([x, 0.55 + br, z], [0.07, 0.04, 0.07], P.sp, { e: 1 }));
  if (P.spikes)
    for (let i = 0; i < 4; i++) o.push(MP([0, 0.62 + br, 0.2 - i * 0.16], [0.05, 0.1, 0.06], P.sp, { e: 1 }));
  o.push(MP([0, 0.5 + br, 0.38], [0.28, 0.23, 0.24], P.b, { g: 0.3 }));
  o.push(MP([0, 0.44 + br, 0.58], [0.15, 0.1, 0.1], P.l));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.13, 0.56 + br, 0.56, 0.05, bl);
    mdCheek(o, s * 0.24, 0.46 + br, 0.52);
  }
  tailChain(o, 6, u => [wag * 0.07 * u, 0.3 + u * 0.4, -0.46 - u * 0.2], P.b, P.d, 0.1, 0.12);
  o.push(MP([wag * 0.08, 0.78, -0.7], [0.12, 0.15, 0.1], '#ff8a1c', { e: 1 }));
  o.push(MP([wag * 0.09, 0.94 + Math.sin(t / 140) * 0.03, -0.7], [0.07, 0.11, 0.07], '#ffd24a', { e: 1 }));
  return o;
}
// oiseau générique
function mdBird(t, P) {
  const o = [],
    br = Math.sin(t / 560) * 0.012,
    bl = blinkK(t + P.ph * 500),
    fl = Math.sin(t / 300 + P.ph) * (P.fa || 0.05);
  const pg = P.pg;
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.11, 0.14, 0.05], [0.03, 0.08, 0.03], P.fc || '#ffb52e'));
    o.push(MP([s * 0.11, 0.06, 0.12], [0.08, 0.04, 0.13], P.fc || '#ffb52e', { ao: 1 }));
  }
  if (P.tail) o.push(MP([0, 0.3, -0.24], [0.12, 0.06, 0.2], P.tail, { rot: [-0.5, 0, 0] }));
  o.push(MP([0, 0.56 + br, 0], [0.31 + (P.bw || 0), 0.42 + br, 0.27], P.b, { g: 0.3 }));
  o.push(MP([0, 0.5 + br, 0.17], [0.2 + (P.bw || 0), 0.3, 0.14], P.l));
  for (const s of [-1, 1]) {
    if (pg) {
      o.push(
        MP([s * (0.36 + (P.bw || 0)), 0.52 + br, 0], [0.08, 0.3, 0.13], P.w, {
          rot: [0, 0, s * (0.15 + fl)],
          g: 0.2
        })
      );
    } else {
      o.push(
        MP([s * 0.5, 0.7 + br, -0.04], [0.14, 0.36 * (P.ws || 1), 0.05], P.w, {
          rot: [0, 0, s * (0.5 + fl)],
          g: 0.3
        })
      );
      o.push(
        MP([s * 0.62, 0.55 + br, -0.04], [0.1, 0.28 * (P.ws || 1), 0.04], P.w2 || P.w, {
          rot: [0, 0, s * (0.65 + fl)]
        })
      );
    }
  }
  o.push(MP([0, 1.0 + br, 0.02], [0.3, 0.25, 0.27], P.h || P.b, { g: 0.3 }));
  o.push(MP([0, 0.93 + br, 0.2], [0.16, 0.12, 0.1], P.hl || P.l));
  o.push(MP([0, 0.95 + br, 0.3], [0.05, 0.045, 0.07 + (P.bk || 0)], P.bc || '#ffb52e', { g: 0.5 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.13, 1.03 + br, 0.235, 0.05, bl);
    mdCheek(o, s * 0.22, 0.92 + br, 0.21);
    if (P.brow) mdBrow(o, s * 0.14, 1.12 + br, 0.25, -s * 0.45);
  }
  if (P.crest) P.crest(o, br, t);
  return o;
}
// scarabée
function mdBeetle(t, P) {
  const o = [],
    br = Math.sin(t / 600) * 0.01,
    bl = blinkK(t + P.ph * 300);
  for (const s of [-1, 1])
    for (let i = 0; i < 3; i++) {
      const z = -0.2 + i * 0.2;
      o.push(MP([s * 0.4, 0.14, z], [0.2, 0.035, 0.04], P.lg, { rot: [0, 0, s * 0.3], ao: 1 }));
      o.push(MP([s * 0.56, 0.07, z + 0.03 * (i - 1)], [0.05, 0.08, 0.04], P.lg, { ao: 1 }));
    }
  o.push(MP([0, 0.5 + br, -0.1], [0.45, 0.34, 0.5], P.sh, { g: 0.7 }));
  o.push(MP([0, 0.62 + br, -0.12], [0.4, 0.2, 0.44], P.sh2 || P.sh, { g: 0.9 }));
  o.push(MP([0, 0.5 + br, -0.6], [0.02, 0.3, 0.02], '#1a2a2a'));
  if (P.dots)
    for (const [x, z] of [
      [-0.2, -0.2],
      [0.2, -0.2],
      [-0.15, -0.4],
      [0.15, -0.4],
      [0, -0.05]
    ])
      o.push(MP([x, 0.78 + br, z], [0.06, 0.03, 0.06], P.dots, { g: 0.4 }));
  o.push(MP([0, 0.4 + br, 0.34], [0.3, 0.27, 0.26], P.hd, { g: 0.3 }));
  o.push(MP([0, 0.34 + br, 0.54], [0.14, 0.09, 0.07], P.hl));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.12, 0.47 + br, 0.59, 0.052, bl);
    mdCheek(o, s * 0.22, 0.36 + br, 0.52);
    const sw = Math.sin(t / 400 + s) * 0.04;
    o.push(MP([s * 0.14, 0.74 + br, 0.38], [0.018, 0.14, 0.018], P.lg, { rot: [0, 0, -s * 0.4 + sw] }));
    o.push(MP([s * (0.24 + sw), 0.88 + br, 0.38], [0.05, 0.05, 0.05], P.bl || '#bfe8e0', { g: 0.4 }));
  }
  if (P.horn) o.push(MP([0, 0.68 + br, 0.45], [0.05, 0.17, 0.05], P.horn, { rot: [0.5, 0, 0], g: 0.3 }));
  return o;
}
// papillon
function mdButter(t, P) {
  const o = [],
    bob = Math.sin(t / 500) * 0.03,
    bl = blinkK(t + P.ph * 300),
    fl = 0.35 + Math.sin(t / 170) * 0.18;
  o.push(MP([0, 0.5 + bob, 0], [0.1, 0.34, 0.09], P.b, { g: 0.3 }));
  for (const s of [-1, 1]) {
    o.push(
      MP([s * (0.38 - fl * 0.1), 0.98 + bob, -0.04], [0.3, 0.32, 0.045], P.w, {
        rot: [0, s * fl * 0.5, s * 0.3],
        g: 0.3
      })
    );
    o.push(
      MP([s * (0.3 - fl * 0.1), 0.52 + bob, -0.04], [0.2, 0.24, 0.04], P.w2, {
        rot: [0, s * fl * 0.5, -s * 0.2],
        g: 0.3
      })
    );
    o.push(
      MP([s * (0.4 - fl * 0.1), 1.0 + bob, -0.01], [0.1, 0.1, 0.03], P.sp, {
        rot: [0, s * fl * 0.5, 0],
        e: 0
      })
    );
    o.push(MP([s * (0.3 - fl * 0.1), 0.5 + bob, -0.01], [0.07, 0.07, 0.03], P.sp));
    const sw = Math.sin(t / 380 + s) * 0.04;
    o.push(MP([s * 0.1, 1.32 + bob, 0], [0.016, 0.14, 0.016], P.b, { rot: [0, 0, -s * 0.4 + sw] }));
    o.push(MP([s * (0.2 + sw), 1.45 + bob, 0], [0.045, 0.045, 0.045], P.sp));
  }
  o.push(MP([0, 0.95 + bob, 0.02], [0.21, 0.2, 0.19], P.b, { g: 0.4 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.08, 0.98 + bob, 0.17, 0.04, bl);
    mdCheek(o, s * 0.15, 0.9 + bob, 0.15);
  }
  o.push(MP([0, 0.89 + bob, 0.19], [0.03, 0.01, 0.015], '#6a2a3a'));
  return o;
}
// grenouille large
function mdFrog(t, P) {
  const o = [],
    br = Math.sin(t / 640) * 0.014,
    bl = blinkK(t + P.ph * 300);
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.3, 0.07, 0.2], [0.16, 0.07, 0.17], P.d, { ao: 1 }));
    o.push(MP([s * 0.38, 0.2, -0.1], [0.15, 0.17, 0.2], P.b2, { g: 0.2 }));
  }
  o.push(MP([0, 0.34 + br, 0], [0.46, 0.3 + br, 0.38], P.b, { g: 0.3 }));
  o.push(MP([0, 0.28 + br, 0.2], [0.34, 0.2, 0.2], P.l));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.26, 0.66 + br, 0.08], [0.16, 0.16 * bl + 0.02, 0.15], P.rim || '#e8f4ff', { g: 0.7 }));
    o.push(MP([s * 0.26, 0.66 + br, 0.16], [0.1, 0.1 * bl + 0.01, 0.09], '#fff', { g: 0.6 }));
    o.push(MP([s * 0.26, 0.66 + br, 0.22], [0.06, 0.07 * bl, 0.04], '#1a1010', { g: 0.9 }));
    mdCheek(o, s * 0.34, 0.36 + br, 0.3, '#ff8aa0');
  }
  o.push(MP([0, 0.34 + br, 0.38], [0.2, 0.018, 0.03], '#2a3a5a'));
  if (P.spots)
    for (const [x, z] of [
      [-0.2, 0.0],
      [0.2, 0.0],
      [0, -0.2],
      [-0.3, -0.1],
      [0.3, -0.1]
    ])
      o.push(MP([x, 0.6 + br, z], [0.07, 0.04, 0.07], P.spots, { g: 0.3 }));
  if (P.bub)
    for (let i = 0; i < 3; i++) {
      const u = (t / 900 + i / 3) % 1;
      o.push(
        MP(
          [Math.sin(i * 2 + t / 300) * 0.1 - 0.3 + i * 0.3, 0.95 + u * 0.35, 0.05],
          [0.04, 0.04, 0.04],
          '#e8f6ff',
          { e: 1 }
        )
      );
    }
  return o;
}
// cactus
function mdCactus(t, P) {
  const o = [],
    br = Math.sin(t / 700) * 0.012,
    bl = blinkK(t + P.ph * 300),
    sw = Math.sin(t / 900) * 0.02;
  for (const s of [-1, 1]) o.push(MP([s * 0.15, 0.07, 0.08], [0.12, 0.07, 0.13], '#3a5a2a', { ao: 1 }));
  o.push(MP([0, 0.5 + br, 0], [P.w, P.h + br, 0.3], '#4aa84a', { g: 0.2 }));
  for (let i = 0; i < 5; i++)
    o.push(MP([(i - 2) * 0.08, 0.48 + br, 0.28], [0.012, P.h * 0.8, 0.02], '#7ac86a'));
  for (const [x, y] of [
    [-0.3, 0.6],
    [0.3, 0.5],
    [-0.2, 0.3],
    [0.25, 0.75]
  ])
    o.push(MP([x, y + br, 0.2], [0.02, 0.02, 0.04], '#fff'));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.12, 0.6 + br, 0.3, 0.05, bl);
    mdCheek(o, s * 0.23, 0.5 + br, 0.27);
    if (P.brow) mdBrow(o, s * 0.13, 0.68 + br, 0.3, -s * 0.4, '#1a3a1a');
    o.push(MP([s * (P.w + 0.06), 0.62 + br, 0], [0.1, 0.12, 0.1], '#4aa84a', { g: 0.2 }));
    if (P.tall) {
      o.push(MP([s * (P.w + 0.12 + sw), 0.9 + br, 0], [0.09, 0.2, 0.09], '#4aa84a'));
      o.push(MP([s * (P.w + 0.12 + sw), 1.12 + br, 0], [0.11, 0.08, 0.1], P.fl, { g: 0.3 }));
    }
  }
  o.push(MP([0, 0.43 + br, 0.3], [0.05, 0.016, 0.02], '#1a3a1a'));
  if (!P.tall) {
    o.push(MP([sw, 0.5 + br + P.h * 0.95, 0], [0.12, 0.07, 0.11], P.fl, { g: 0.3 }));
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * 6.28;
      o.push(
        MP([sw + Math.sin(a) * 0.1, 0.58 + br + P.h * 0.95, Math.cos(a) * 0.08], [0.06, 0.05, 0.06], P.fl, {
          g: 0.3
        })
      );
    }
  }
  return o;
}
// ---- espèces ----
MD[38] = t =>
  mdSun(t, {
    ph: 3,
    n: 12,
    rr: 0.52,
    len: 0.17,
    w: 0.1,
    r1: '#ffb02e',
    r2: '#ffd84a',
    core: '#ffd04a',
    face: '#ffe888',
    spin: 0.3
  });
MD[43] = t =>
  mdSun(t, {
    ph: 5,
    n: 14,
    rr: 0.54,
    len: 0.16,
    w: 0.09,
    r1: '#ff9a2a',
    r2: '#ffd84a',
    core: '#ffe27a',
    face: '#fff4c8',
    spin: -0.4
  });
MD[39] = t => {
  // comme Coralie, avec une coquille hérissée de pointes (comme son sprite)
  const o = MD[23](t),
    b = Math.sin(t / 800) * 0.012;
  o.push(MP([0, 0.93 + b, 0.02], [0.2, 0.05, 0.2], '#d6f0ff', { g: 1 }));
  for (let i = 0; i < 6; i++) {
    const a = -1.1 + (i * 2.2) / 5;
    o.push(
      MP([Math.sin(a) * 0.36, 0.98 + b + Math.cos(a) * 0.12, -0.05], [0.045, 0.15, 0.045], '#e8f6ff', {
        rot: [0, 0, -a * 0.9],
        g: 0.8
      })
    );
  }
  return o;
};
MD[40] = t => {
  const o = [],
    br = Math.sin(t / 600) * 0.012,
    bl = blinkK(t + 800),
    sw = Math.sin(t / 900) * 0.03;
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.14, 0.06, 0.06], [0.04, 0.06, 0.04], '#8a5a2a'));
    o.push(MP([s * 0.15, 0.2, 0.04], [0.03, 0.14, 0.03], '#8a5a2a'));
  }
  o.push(MP([0, 0.46 + br, 0], [0.34, 0.26 + br, 0.3], '#c89850', { g: 0.25 }));
  o.push(MP([0, 0.4 + br, 0.2], [0.22, 0.16, 0.12], '#f0d8a0'));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.13, 0.5 + br, 0.28, 0.055, bl);
    mdCheek(o, s * 0.24, 0.4 + br, 0.25);
  }
  o.push(MP([0, 0.4 + br, 0.31], [0.05, 0.016, 0.02], '#5a3a1a'));
  for (const [x, h, c] of [
    [-0.2, 0.5, '#7ac84a'],
    [0, 0.62, '#8ad45a'],
    [0.2, 0.5, '#7ac84a']
  ])
    o.push(MP([x + sw * (x ? 1 : 0.5), 0.88 + br + h * 0.18, 0], [0.1, h * 0.5, 0.1], c, { g: 0.4 }));
  return o;
};
MD[41] = t => mdCloud(t, { ph: 2, c: '#7a60a8', c2: '#8a70b8', l: '#b8a4d8' });
MD[82] = t => mdCloud(t, { ph: 6, c: '#8a96aa', c2: '#9aa6ba', l: '#c8d0dc', arms: 1 });
MD[42] = t =>
  mdBird(t, {
    ph: 1,
    b: '#f0ecd8',
    l: '#fffcf0',
    w: '#d8a040',
    w2: '#b8802a',
    ws: 1.1,
    h: '#f8f4e4',
    bc: '#f0a020',
    fa: 0.05,
    crest: (o, br) => {
      o.push(MP([0, 1.22 + br, 0.0], [0.12, 0.14, 0.1], '#d8a85a', { g: 0.3 }));
      o.push(MP([0, 1.36 + br, 0], [0.06, 0.1, 0.06], '#d8a85a'));
    }
  });
MD[44] = t => mdRc(MD[35](t), { '#f0a0b8': '#8fd6d6', '#f8c8d8': '#d8f4ff', '#d87898': '#5aa8b0' });
MD[45] = t => {
  const o = [],
    bob = Math.sin(t / 700) * 0.03,
    bl = blinkK(t + 1200),
    sw = Math.sin(t / 500) * 0.03;
  const cy = 0.84 + bob;
  for (const a of [0.6, -0.6])
    o.push(
      MP([Math.sin(a) * 0.07, 0.34 + bob, 0], [0.025, 0.3, 0.025], '#8a6a3a', { rot: [0, 0, -a * 0.5] })
    );
  o.push(MP([0, cy, -0.02], [0.2, 0.5, 0.08], '#ffd84a', { g: 0.4 }));
  o.push(MP([0, cy, -0.02], [0.5, 0.2, 0.08], '#ffd84a', { g: 0.4 }));
  o.push(MP([0, cy, 0], [0.38, 0.38, 0.12], '#ffe27a', { rot: [0, 0, 0.785], g: 0.5 }));
  o.push(MP([0, cy, 0.04], [0.3, 0.3, 0.1], '#fff0a0', { rot: [0, 0, 0.785], g: 0.4 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.1, cy + 0.04, 0.15, 0.04, bl);
    mdCheek(o, s * 0.19, cy - 0.04, 0.13);
  }
  o.push(MP([0, cy - 0.08, 0.16], [0.045, 0.014, 0.02], '#8a4a2a'));
  o.push(MP([0.04 + sw, 0.32 + bob, 0], [0.03, 0.12, 0.02], '#c89a50', { rot: [0, 0, 0.5] }));
  return o;
};
MD[46] = t => {
  const o = [],
    br = Math.sin(t / 700) * 0.01,
    bl = blinkK(t + 700),
    w = Math.sin(t / 800) * 0.03;
  for (const s of [-1, 1]) o.push(MP([s * 0.2, 0.07, 0.1], [0.14, 0.07, 0.15], '#4a2a6a', { ao: 1 }));
  o.push(MP([0, 0.36 + br, 0], [0.4, 0.25 + br, 0.34], '#7a4aa8', { g: 0.3 }));
  for (let i = 0; i < 7; i++) {
    const a = -1.25 + i * 0.42,
      L = 0.28 + (i == 3 ? 0.08 : 0);
    o.push(
      MP(
        [Math.sin(a) * 0.3, 0.62 + br + Math.cos(a) * 0.2, -0.06],
        [0.12, L, 0.05],
        i % 2 ? '#e8a8e8' : '#d890d8',
        { rot: [0, 0, -a + w * (i - 3) * 0.2], g: 0.5 }
      )
    );
  }
  o.push(MP([0, 0.4 + br, 0.3], [0.26, 0.16, 0.1], '#b88ad8'));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.44 + br, 0.32, 0.055, bl);
    mdCheek(o, s * 0.27, 0.34 + br, 0.29);
  }
  o.push(MP([0, 0.34 + br, 0.38], [0.05, 0.016, 0.02], '#3a1a5a'));
  return o;
};
MD[47] = t => {
  const o = [],
    br = Math.sin(t / 700) * 0.014,
    bl = blinkK(t + 300),
    fk = Math.sin(t / 200) * 0.01;
  o.push(MP([0, 0.14, 0], [0.3, 0.07, 0.26], '#e8902a', { ao: 1 }));
  o.push(MP([0, 0.45 + br, 0], [0.4, 0.36 + br, 0.34], '#ffc83a', { g: 0.4 }));
  o.push(MP([0, 0.42 + br, 0.18], [0.28, 0.27, 0.18], '#ffe27a'));
  o.push(MP([0, 0.86 + br, 0], [0.28, 0.36, 0.24], '#ffc83a', { g: 0.4 }));
  o.push(MP([0, 1.1 + br, 0], [0.14, 0.18, 0.12], '#ffb52e'));
  o.push(MP([0, 1.24 + br, 0], [0.17, 0.06, 0.14], '#b8803a', { g: 0.3 }));
  o.push(MP([0, 1.32 + br, 0], [0.1, 0.07, 0.09], '#8a5a2a'));
  o.push(MP([fk, 1.4 + br, 0], [0.04, 0.05, 0.04], '#ffe27a', { e: 1 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.14, 0.5 + br, 0.31, 0.052, bl);
    mdCheek(o, s * 0.25, 0.4 + br, 0.27);
  }
  o.push(MP([0, 0.37 + br, 0.335], [0.05, 0.014, 0.02], '#8a3a1a'));
  return o;
};
MD[48] = t => {
  // huître entrouverte qui garde une perle de lune
  const o = [],
    bl = blinkK(t + 1500),
    op = Math.sin(t / 1400) * 0.06,
    gl = 0.9 + Math.sin(t / 400) * 0.1;
  o.push(MP([0, 0.3, 0], [0.5, 0.22, 0.4], '#3a5a8a', { g: 0.4 }));
  o.push(MP([0, 0.2, 0.02], [0.5, 0.1, 0.42], '#2a4268', { ao: 1 }));
  for (let i = 0; i < 5; i++)
    o.push(
      MP([(i - 2) * 0.17, 0.32, 0.3 + (i % 2) * 0.02], [0.03, 0.16, 0.02], '#2e4c78', {
        rot: [0.5, 0, (i - 2) * 0.2]
      })
    );
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.17, 0.36, 0.37, 0.055, bl);
    mdCheek(o, s * 0.3, 0.27, 0.33);
  }
  o.push(MP([0, 0.27, 0.4], [0.07, 0.03, 0.025], '#1a2a4a'));
  o.push(MP([0, 0.78 + op, -0.24], [0.5, 0.34, 0.16], '#d8e2f2', { rot: [-1.25 - op, 0, 0], g: 0.5 }));
  for (let i = 0; i < 5; i++)
    o.push(
      MP([(i - 2) * 0.16, 0.86 + op, -0.14], [0.03, 0.3, 0.02], '#c8c8da', {
        rot: [-1.25 - op, 0, (i - 2) * 0.12]
      })
    );
  o.push(MP([0, 0.56, 0.16], [0.17, 0.17, 0.17], [246 * gl, 222 * gl, 255 * gl], { g: 1 }));
  o.push(MP([-0.06, 0.62, 0.3], [0.04, 0.035, 0.02], '#ffffff', { e: 1 }));
  return o;
};
MD[49] = t => {
  // sphère étoilée, avec un anneau incliné et une petite lune en orbite
  const o = mdOrb(t, { ph: 1, c: '#2e2060', rim: '#c8b8f0', patch: '#ffe8f4', hi: '#8a78d8' }),
    cy = 0.72 + Math.sin(t / 900) * 0.03,
    sp = t / 1600,
    ma = t / 1100;
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2 + sp,
      z = Math.sin(a) * 0.66;
    o.push(
      MP([Math.cos(a) * 0.66, cy + z * 0.28, z * 0.5], [0.04, 0.025, 0.04], i % 3 ? '#c8b8f0' : '#ffe8f4', {
        e: 1
      })
    );
  }
  o.push(
    MP(
      [Math.cos(ma) * 0.6, cy + 0.4 + Math.sin(ma) * 0.06, Math.sin(ma) * 0.3],
      [0.08, 0.08, 0.08],
      '#e8e0ff',
      { g: 0.6 }
    )
  );
  return o;
};
MD[50] = t => {
  // l'étoile du soir : une étoile à cinq branches entourée d'un halo
  const o = [],
    bob = Math.sin(t / 650) * 0.04,
    bl = blinkK(t + 300),
    cy = 0.74 + bob;
  const BL = '#4a78e8',
    BP = '#8fb0ff',
    CR = '#f4f8ff';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + t / 4300;
    o.push(
      MP(
        [Math.cos(a) * 0.62, cy + Math.sin(a) * 0.62, -0.12],
        [0.03, 0.03, 0.02],
        i % 2 ? '#ffffff' : '#bfd4ff',
        { e: 1 }
      )
    );
  }
  for (let k = 0; k < 5; k++) {
    const th = (k * Math.PI * 2) / 5 + Math.sin(t / 1400) * 0.08,
      lf = 1 + Math.sin(t / 480 + k) * 0.05,
      d = 0.24 + 0.17 * lf;
    o.push(
      MP([Math.sin(th) * d, cy + Math.cos(th) * d * 0.92, 0], [0.16, 0.54 * lf, 0.11], k % 2 ? BP : BL, {
        rot: [0, 0, -th],
        g: 0.6
      })
    );
    o.push(
      MP(
        [Math.sin(th) * (d + 0.26), cy + Math.cos(th) * (d + 0.26) * 0.92, 0.02],
        [0.05, 0.05, 0.05],
        '#ffffff',
        { e: 1 }
      )
    );
  }
  o.push(MP([0, cy, 0], [0.36, 0.36, 0.18], BL, { g: 0.5 }));
  o.push(MP([0, cy, 0.12], [0.27, 0.27, 0.11], CR, { g: 0.5 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.09, cy + 0.04, 0.215, 0.04, bl, '#1a2a6a');
    mdCheek(o, s * 0.17, cy - 0.05, 0.2, '#ffb0d0');
  }
  o.push(MP([0, cy - 0.07, 0.225], [0.05, 0.016, 0.02], '#4a3a8a'));
  o.push(MP([0, 0.1, 0], [0.22, 0.03, 0.18], '#2a3a7a', { ao: 1 }));
  return o;
};

MD[51] = t =>
  mdCrt(t, {
    ph: 4,
    B: '#a8764a',
    D: '#7a5030',
    L: '#e0c098',
    ears: 'rd',
    ec: '#a8764a',
    ei: '#e0c098',
    tail: 'chain',
    t1: '#7a5030',
    t2: '#a8764a',
    tr0: 0.1,
    tr1: 0.14,
    nc: '#2a1a10',
    extra: (o, e) => {
      for (const s of [-1, 1])
        for (const k of [-1, 1])
          o.push(
            MP([s * (0.34 + 0.08), e.hy - 0.1 + k * 0.03, 0.28], [0.1, 0.012, 0.012], '#fff', {
              rot: [0, 0, s * k * 0.2]
            })
          );
    }
  });
MD[52] = t =>
  mdCrt(t, {
    ph: 4,
    B: '#a8764a',
    D: '#7a5030',
    L: '#e0c098',
    ears: 'rd',
    ec: '#a8764a',
    ei: '#e0c098',
    tail: 'chain',
    t1: '#7a5030',
    t2: '#a8764a',
    tr0: 0.1,
    tr1: 0.14,
    nc: '#2a1a10',
    bs: 1.08,
    extra: (o, e) => {
      for (const s of [-1, 1])
        for (const k of [-1, 1])
          o.push(
            MP([s * 0.42, e.hy - 0.1 + k * 0.03, 0.28], [0.1, 0.012, 0.012], '#fff', {
              rot: [0, 0, s * k * 0.2]
            })
          );
      o.push(MP([0, 0.65 + e.br, 0.1], [0.3, 0.07, 0.22], '#5ab0e0', { g: 0.3 }));
      o.push(MP([0, 0.6 + e.br, 0.3], [0.06, 0.06, 0.03], '#d8f4ff', { e: 1 }));
    }
  });
MD[53] = t => mdJelly(t, { ph: 3, t: '#a8d4f4', d: '#b8dcf8', dl: '#e0f2ff' });
MD[54] = t => mdJelly(t, { ph: 5, t: '#5aa0e0', d: '#8a70d0', dl: '#a898e8', cap: 1, spots: 1 });
MD[55] = t =>
  mdTurtle(t, { ph: 1, g: '#6ac050', gl: '#8ad870', sh: '#8a6a4a', rim: '#5a4228', moss: '#78b858' });
MD[56] = t =>
  mdTurtle(t, {
    ph: 2,
    g: '#5aa848',
    gl: '#7ac860',
    sh: '#7a5a3a',
    rim: '#4a3220',
    moss: '#6aa84a',
    tree: 1
  });
MD[57] = t => mdFish(t, { ph: 1, b: '#d8e0ea', l: '#f4f8fc', f: '#f0b84a', moon: 1 });
MD[58] = t => mdFish(t, { ph: 3, b: '#e8ecf0', l: '#fffcf4', f: '#f0b030', moon: 1 });
MD[59] = t => mdSea(t, { ph: 2, b: '#2a6ac8', b2: '#3a82e0', l: '#a8d4f4', f: '#6ac8e8' });
MD[60] = t => mdSal(t, { ph: 1, b: '#f0902a', d: '#c8681a', l: '#ffd898', sp: '#ffe27a' });
MD[61] = t => mdSal(t, { ph: 3, b: '#e8682a', d: '#b8481a', l: '#ffc888', sp: '#ffd84a', spikes: 1 });
MD[62] = t =>
  mdCrt(t, {
    ph: 2,
    B: '#e04a2a',
    D: '#a8301a',
    L: '#ffc8a0',
    ears: 'none',
    brow: 0.45,
    tail: 'chain',
    t1: '#a8301a',
    t2: '#d04020',
    tr0: 0.1,
    tr1: 0.13,
    bs: 1.1,
    hs: 1.08,
    extra: (o, e) => {
      for (const s of [-1, 1]) {
        o.push(
          MP([s * 0.24, e.hy + 0.3, 0], [0.05, 0.17, 0.05], '#f8e8c0', { rot: [0, 0, -s * 0.4], g: 0.3 })
        );
        o.push(
          MP([s * 0.44, 0.78 + e.br, -0.12], [0.1, 0.38, 0.04], '#f0c040', {
            rot: [0, 0, s * (0.5 + Math.sin(e.t / 300) * 0.05)],
            g: 0.3,
            e: 1
          })
        );
        o.push(MP([s * 0.55, 0.6 + e.br, -0.12], [0.08, 0.26, 0.04], '#d8a030', { rot: [0, 0, s * 0.65] }));
      }
    }
  });
MD[63] = t =>
  mdBird(t, {
    ph: 2,
    b: '#9aa0b0',
    l: '#d8dce6',
    w: '#8a90a0',
    ws: 0.7,
    h: '#a0a6b6',
    bc: '#ff9a2a',
    fa: 0.04,
    crest: (o, br, t) => {
      for (let i = 0; i < 5; i++) {
        const a = -0.8 + i * 0.4;
        o.push(
          MP(
            [Math.sin(a) * 0.16, 1.24 + br + Math.sin(t / 180 + i) * 0.015, 0],
            [0.05, 0.13 + (i == 2 ? 0.05 : 0), 0.04],
            i % 2 ? '#ff9a4a' : '#ffc860',
            { e: 1, rot: [0, 0, -a * 0.4] }
          )
        );
      }
      o.push(MP([0, 0.55 + br, 0.3], [0.08, 0.08, 0.03], '#ff8a2a', { e: 1 }));
    }
  });
MD[64] = t =>
  mdBird(t, {
    ph: 4,
    b: '#e04a2a',
    l: '#ffb070',
    w: '#f0c040',
    w2: '#d8a030',
    ws: 1.25,
    h: '#e85a30',
    bc: '#ffd84a',
    fa: 0.07,
    brow: 1,
    tail: '#f0c040',
    crest: (o, br, t) => {
      o.push(MP([0, 1.28 + br, 0], [0.1, 0.12, 0.08], '#ffd84a', { e: 1 }));
      for (const s of [-1, 1])
        o.push(MP([s * 0.14, 1.24 + br, 0], [0.05, 0.13, 0.04], '#f0c040', { e: 1, rot: [0, 0, -s * 0.5] }));
    }
  });
MD[65] = t =>
  mdCrt(t, {
    ph: 3,
    B: '#2a2a30',
    D: '#1a1a20',
    L: '#4a4a54',
    ears: 'pt',
    ec: '#d84a2a',
    ei: '#ffb070',
    eyeC: '#ffd84a',
    tail: 'chain',
    t1: '#1a1a20',
    t2: '#2a2a30',
    extra: (o, e) => {
      o.push(MP([0, 0.4 + e.br, 0.26], [0.08, 0.08, 0.03], '#ff7a1c', { e: 1 }));
      o.push(MP([0.46, 0.8 + Math.sin(e.t / 200) * 0.02, -0.36], [0.09, 0.13, 0.08], '#ff8a1c', { e: 1 }));
    }
  });
MD[66] = t =>
  mdCrt(t, {
    ph: 5,
    B: '#2a2a30',
    D: '#1a1a20',
    L: '#4a4a54',
    ears: 'none',
    eyeC: '#ffd84a',
    bs: 1.12,
    hs: 1.05,
    brow: 0.4,
    brc: '#ff8a1c',
    tail: 'chain',
    t1: '#1a1a20',
    t2: '#2a2a30',
    extra: (o, e) => {
      o.push(MP([0, 0.4 + e.br, 0.26], [0.1, 0.1, 0.03], '#ff7a1c', { e: 1 }));
      for (const s of [-1, 1]) {
        o.push(
          MP([s * 0.24, e.hy + 0.31, 0], [0.06, 0.2, 0.05], '#d84a2a', { rot: [0, 0, -s * 0.5], g: 0.3 })
        );
        o.push(MP([s * 0.4, e.hy + 0.5, 0], [0.045, 0.05, 0.04], '#ffd84a', { e: 1 }));
        o.push(MP([s * 0.34, 0.42 + e.br, 0.1], [0.1, 0.1, 0.1], '#3a3a44'));
      }
    }
  });
MD[67] = t => {
  const o = [],
    br = Math.sin(t / 650) * 0.012,
    bl = blinkK(t + 500),
    lf = Math.sin(t / 700) * 0.06;
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.12, 0.07, 0.09], [0.1, 0.07, 0.13], '#5a3a7a', { ao: 1 }));
    o.push(MP([s * 0.12, 0.18, 0.05], [0.07, 0.1, 0.07], '#7a5a9a'));
  }
  o.push(MP([0, 0.4 + br, 0], [0.22, 0.26 + br, 0.2], '#7aba5a', { g: 0.2 }));
  o.push(MP([0, 0.38 + br, 0.12], [0.14, 0.18, 0.1], '#c8e890'));
  o.push(MP([0, 0.88 + br, 0], [0.3, 0.3, 0.27], '#ffb8d0', { g: 0.4 }));
  o.push(MP([0, 1.14 + br, 0], [0.17, 0.2, 0.15], '#ffb8d0', { g: 0.4 }));
  o.push(MP([0, 1.3 + br, 0], [0.08, 0.12, 0.07], '#f890b8', { g: 0.4 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.12, 0.9 + br, 0.25, 0.05, bl);
    mdCheek(o, s * 0.22, 0.8 + br, 0.22);
    o.push(
      MP([s * 0.38, 0.92 + br, 0], [0.2, 0.09, 0.04], '#6ac850', { rot: [0, 0, s * (0.5 + lf)], g: 0.3 })
    );
    o.push(MP([s * 0.3, 0.46 + br, 0.06], [0.08, 0.05, 0.04], '#7aba5a', { rot: [0, 0, s * 0.6] }));
  }
  o.push(MP([0, 0.76 + br, 0.27], [0.05, 0.014, 0.02], '#8a3a5a'));
  return o;
};
MD[68] = t => {
  const o = [],
    br = Math.sin(t / 700) * 0.012,
    bl = blinkK(t + 1300);
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.14, 0.07, 0.09], [0.11, 0.07, 0.13], '#5a3a7a', { ao: 1 }));
    o.push(MP([s * 0.14, 0.18, 0.05], [0.08, 0.11, 0.08], '#6ab850'));
  }
  o.push(MP([0, 0.42 + br, -0.02], [0.2, 0.3 + br, 0.17], '#6ab850', { g: 0.2 }));
  for (const s of [-1, 1])
    o.push(
      MP([s * 0.38, 0.5 + br + Math.sin(t / 600 + s) * 0.02, 0], [0.24, 0.07, 0.05], '#5aa840', {
        rot: [0, 0, s * (0.7 + Math.sin(t / 700) * 0.05)],
        g: 0.3
      })
    );
  for (let i = 0; i < 9; i++) {
    const th = (i / 9) * Math.PI * 2,
      sw = Math.sin(t / 600 + i) * 0.02;
    o.push(
      MP(
        [Math.sin(th) * 0.46, 0.98 + br + Math.cos(th) * 0.46, -0.05 - (i % 2) * 0.02],
        [0.22, 0.22, 0.07],
        i % 2 ? '#f8b0d0' : '#fcc8e0',
        { rot: [0, 0, -th + sw], g: 0.3 }
      )
    );
  }
  o.push(MP([0, 0.98 + br, -0.04], [0.4, 0.4, 0.1], '#f090b8'));
  o.push(MP([0, 0.98 + br, 0.04], [0.32, 0.32, 0.12], '#ffe8a8', { g: 0.35 }));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.1, 1.0 + br, 0.15, 0.04, bl);
    mdCheek(o, s * 0.19, 0.9 + br, 0.13);
  }
  o.push(MP([0, 0.9 + br, 0.165], [0.05, 0.016, 0.02], '#8a4a2a'));
  return o;
};
MD[69] = t => {
  const o = [],
    br = Math.sin(t / 700) * 0.012,
    bl = blinkK(t + 1900),
    sw = Math.sin(t / 900) * 0.02;
  for (const s of [-1, 1]) o.push(MP([s * 0.14, 0.07, 0.1], [0.11, 0.07, 0.14], '#3a6a3a', { ao: 1 }));
  o.push(MP([0, 0.4 + br, 0], [0.4, 0.36 + br, 0.32], '#5aa860', { g: 0.2 }));
  o.push(MP([0, 0.24, 0.1], [0.36, 0.1, 0.24], '#e8b8d0', { g: 0.2 }));
  o.push(MP([0, 0.4 + br, 0.2], [0.2, 0.24, 0.14], '#f4e8c8'));
  for (const s of [-1, 1])
    o.push(MP([s * 0.32, 0.46 + br, 0.04], [0.07, 0.14, 0.07], '#5aa860', { rot: [0, 0, s * 0.4] }));
  o.push(MP([0, 0.92 + br, 0], [0.38, 0.34, 0.33], '#7cc474', { g: 0.3 }));
  o.push(MP([0, 0.88 + br, 0.16], [0.27, 0.24, 0.18], '#d8f0c0'));
  for (const s of [-1, 1]) {
    mdEye(o, s * 0.12, 0.9 + br, 0.3, 0.055, bl);
    mdCheek(o, s * 0.22, 0.8 + br, 0.27);
  }
  o.push(MP([0, 0.78 + br, 0.33], [0.05, 0.016, 0.02], '#4a2a2a'));
  for (let i = 0; i < 5; i++) {
    const a = -0.9 + i * 0.45;
    o.push(
      MP(
        [Math.sin(a) * 0.26 + sw, 1.12 + br + Math.cos(a) * 0.1, Math.cos(a) * 0.1],
        [0.09, 0.09, 0.06],
        '#fcd0e4',
        { g: 0.3 }
      )
    );
  }
  o.push(MP([sw, 1.16 + br, 0.1], [0.07, 0.07, 0.05], '#ffe8a8'));
  return o;
};
// ---- lot 7 : espèces 70-99 ----
MD[70] = t =>
  mdCrt(t, {
    ph: 1,
    B: '#f0f0ec',
    D: '#c8c8c0',
    L: '#fff',
    ears: 'lg',
    ec: '#f0f0ec',
    ei: '#bfe8a0',
    tail: 'puff',
    t1: '#fff',
    nc: '#e08aa0',
    extra: (o, e) => {
      for (const s of [-1, 1])
        o.push(
          MP([s * 0.13 * e.hs, e.hy + 0.66 * e.hs, 0], [0.05, 0.07, 0.04], '#7ac860', {
            rot: [0, 0, -s * 0.2],
            g: 0.2
          })
        );
    }
  });
MD[71] = t =>
  mdCrt(t, {
    ph: 3,
    B: '#d8cdb0',
    D: '#a89878',
    L: '#f4ecd4',
    ears: 'lg',
    ec: '#d8cdb0',
    ei: '#f0c8a0',
    tail: 'puff',
    t1: '#fff',
    nc: '#8a5a3a',
    extra: (o, e) => {
      const x = 0.18 * e.hs,
        y = e.hy + 0.52 * e.hs;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * 6.28;
        o.push(
          MP([x + Math.sin(a) * 0.09, y + Math.cos(a) * 0.09, 0.04], [0.045, 0.05, 0.03], '#ffd84a', {
            rot: [0, 0, -a],
            g: 0.3,
            e: 1
          })
        );
      }
      o.push(MP([x, y, 0.05], [0.05, 0.05, 0.04], '#8a5a2a'));
    }
  });
MD[72] = t => mdCactus(t, { ph: 1, w: 0.38, h: 0.4, fl: '#ff9ac0' });
MD[73] = t => mdCactus(t, { ph: 2, w: 0.34, h: 0.5, fl: '#ffd84a', tall: 1, brow: 1 });
MD[74] = t =>
  mdCrt(t, {
    ph: 2,
    B: '#8a82b0',
    D: '#5a5280',
    L: '#cfc8e4',
    ears: 'pt',
    ec: '#8a82b0',
    ei: '#ffb0d0',
    tail: 'chain',
    t1: '#5a5280',
    t2: '#8a82b0',
    nc: '#ff8fb0',
    extra: (o, e) => {
      o.push(MP([0, e.hy + 0.17, 0.29], [0.06, 0.06, 0.03], '#ffe27a', { e: 1 }));
      o.push(MP([0.03, e.hy + 0.18, 0.31], [0.055, 0.055, 0.03], '#8a82b0'));
      for (const s of [-1, 1])
        for (const k of [-1, 1])
          o.push(
            MP([s * 0.4, e.hy - 0.1 + k * 0.03, 0.26], [0.12, 0.012, 0.012], '#fff', {
              rot: [0, 0, s * k * 0.15]
            })
          );
    }
  });
MD[75] = t =>
  mdCrt(t, {
    ph: 4,
    B: '#2e2a50',
    D: '#1a1838',
    L: '#4a4670',
    ears: 'pt',
    ec: '#2e2a50',
    ei: '#8a70c8',
    eyeC: '#ffd84a',
    brow: 0.35,
    brc: '#ffd84a',
    bs: 1.08,
    tail: 'chain',
    t1: '#1a1838',
    t2: '#2e2a50',
    nc: '#8a70c8',
    extra: (o, e) => {
      o.push(MP([0, e.hy + 0.17, 0.29], [0.06, 0.06, 0.03], '#ffe27a', { e: 1 }));
      o.push(MP([0.03, e.hy + 0.18, 0.31], [0.055, 0.055, 0.03], '#2e2a50'));
      o.push(MP([0.5 + e.wag * 0.05, 0.84, -0.36], [0.1, 0.1, 0.1], '#ffd84a', { e: 1 }));
    }
  });
MD[76] = t =>
  mdCrt(t, {
    ph: 2,
    B: '#9a6a3e',
    D: '#6a4424',
    L: '#e0c090',
    ears: 'rd',
    ec: '#9a6a3e',
    ei: '#e0c090',
    tail: 'puff',
    t1: '#9a6a3e',
    nc: '#2a1a10',
    bs: 1.05
  });
MD[77] = t =>
  mdCrt(t, {
    ph: 4,
    B: '#9a6a3e',
    D: '#6a4424',
    L: '#e0c090',
    ears: 'rd',
    ec: '#9a6a3e',
    ei: '#e0c090',
    tail: 'puff',
    t1: '#9a6a3e',
    nc: '#2a1a10',
    bs: 1.15,
    hs: 1.08,
    brow: 0.25,
    extra: (o, e) => {
      for (let i = 0; i < 3; i++)
        o.push(MP([0, 0.3 + i * 0.1 + e.br, 0.2], [0.28, 0.03, 0.1], '#9aa4b4', { g: 0.5 }));
      for (const s of [-1, 1]) {
        o.push(MP([s * 0.4, 0.4 + e.br, 0.12], [0.13, 0.13, 0.12], '#aab4c4', { g: 0.6 }));
        o.push(MP([s * 0.36, e.hy + 0.22, 0.1], [0.04, 0.1, 0.03], '#c8d0dc', { rot: [0, 0, s * 0.3] }));
      }
      o.push(MP([0, e.hy + 0.22, 0.2], [0.1, 0.06, 0.04], '#aab4c4', { g: 0.6 }));
    }
  });
MD[78] = t =>
  mdCrt(t, {
    ph: 2,
    B: '#c88a54',
    D: '#8a5a30',
    L: '#f0d8b4',
    ears: 'dr',
    ec: '#c88a54',
    ei: '#f0c8a8',
    tail: 'puff',
    t1: '#fff',
    nc: '#3a2010',
    extra: (o, e) => {
      for (const s of [-1, 1]) {
        o.push(MP([s * 0.14, e.hy + 0.38, 0], [0.025, 0.1, 0.025], '#d8c090', { rot: [0, 0, -s * 0.2] }));
        o.push(MP([s * 0.17, e.hy + 0.5, 0], [0.022, 0.06, 0.022], '#d8c090', { rot: [0, 0, s * 0.4] }));
      }
      for (const [x, y] of [
        [-0.1, 0.45],
        [0.12, 0.5],
        [-0.14, 0.34],
        [0.16, 0.36]
      ])
        o.push(MP([x, y + e.br, 0.18], [0.035, 0.035, 0.02], '#fff0dc'));
    }
  });
MD[79] = t =>
  mdCrt(t, {
    ph: 4,
    B: '#b87a44',
    D: '#7a4a24',
    L: '#f0d8b4',
    ears: 'dr',
    ec: '#b87a44',
    ei: '#f0c8a8',
    tail: 'puff',
    t1: '#fff',
    nc: '#3a2010',
    bs: 1.08,
    extra: (o, e) => {
      for (const s of [-1, 1]) {
        o.push(
          MP([s * 0.16, e.hy + 0.4, 0], [0.03, 0.14, 0.03], '#f0c040', {
            rot: [0, 0, -s * 0.25],
            g: 0.4,
            e: 1
          })
        );
        o.push(MP([s * 0.3, e.hy + 0.6, 0], [0.025, 0.1, 0.025], '#f0c040', { rot: [0, 0, s * 0.45], e: 1 }));
        o.push(
          MP([s * 0.22, e.hy + 0.66, 0], [0.022, 0.07, 0.022], '#f0c040', { rot: [0, 0, -s * 0.3], e: 1 })
        );
        o.push(
          MP([s * 0.4, e.hy + 0.68, 0], [0.022, 0.07, 0.022], '#f0c040', { rot: [0, 0, s * 0.3], e: 1 })
        );
      }
    }
  });
const mdSpikes = (o, e, col, n, y0) => {
  for (let i = 0; i < n; i++) {
    const a = -1.5 + (i * 3) / (n - 1),
      u = Math.abs(a);
    o.push(
      MP([Math.sin(a) * 0.38, y0 + Math.cos(a) * 0.3, -0.12 - u * 0.04], [0.04, 0.17, 0.04], col, {
        rot: [0, 0, -a * 0.9],
        g: 0.3
      })
    );
    o.push(
      MP([Math.sin(a) * 0.3, y0 + 0.14 + Math.cos(a) * 0.35, -0.2], [0.04, 0.17, 0.04], col, {
        rot: [-0.2, 0, -a * 0.7]
      })
    );
  }
};
MD[80] = t =>
  mdCrt(t, {
    ph: 3,
    B: '#d8c09a',
    D: '#8a6a4a',
    L: '#f0e0c0',
    H: '#d8c09a',
    ears: 'rd',
    ec: '#8a6a4a',
    ei: '#d8c09a',
    nc: '#3a2010',
    extra: (o, e) => {
      mdSpikes(o, e, '#8a7258', 9, 0.68);
    }
  });
MD[81] = t =>
  mdCrt(t, {
    ph: 5,
    B: '#c8b490',
    D: '#7a6a5a',
    L: '#f0e0c0',
    H: '#c8b490',
    ears: 'rd',
    ec: '#7a6a5a',
    ei: '#c8b490',
    nc: '#3a2010',
    bs: 1.1,
    extra: (o, e) => {
      mdSpikes(o, e, '#9aa6b8', 11, 0.7);
      o.push(MP([0, e.hy + 0.17, 0.1], [0.3, 0.06, 0.2], '#aab4c4', { g: 0.6 }));
    }
  });
MD[83] = t =>
  mdBird(t, {
    ph: 2,
    b: '#6ac0f0',
    l: '#dff2ff',
    w: '#4aa8e0',
    w2: '#ffd84a',
    ws: 0.8,
    h: '#74c8f4',
    fa: 0.07,
    crest: (o, br) => {
      o.push(MP([0, 1.24 + br, 0], [0.06, 0.12, 0.05], '#ffe27a', { e: 1 }));
      o.push(MP([-0.08, 1.2 + br, 0], [0.04, 0.1, 0.04], '#ffe27a', { rot: [0, 0, 0.5], e: 1 }));
      o.push(MP([0.08, 1.2 + br, 0], [0.04, 0.1, 0.04], '#ffe27a', { rot: [0, 0, -0.5], e: 1 }));
    }
  });
MD[84] = t =>
  mdBird(t, {
    ph: 3,
    b: '#5a74a8',
    l: '#d0d8e8',
    w: '#3a4e80',
    w2: '#e8c040',
    ws: 0.9,
    h: '#6a84b8',
    bc: '#f0c040',
    brow: 1,
    fa: 0.04,
    crest: (o, br) => {
      o.push(MP([0, 1.26 + br, -0.02], [0.09, 0.12, 0.08], '#3a4e80', { rot: [0.3, 0, 0] }));
    }
  });
MD[85] = t =>
  mdBird(t, {
    ph: 4,
    b: '#5a74b8',
    l: '#d8e0f0',
    w: '#e8c040',
    w2: '#c8a030',
    ws: 1.3,
    bw: 0.04,
    h: '#6a84c8',
    bc: '#f0c040',
    brow: 1,
    fa: 0.06,
    crest: (o, br) => {
      for (const s of [-1, 1])
        o.push(MP([s * 0.1, 1.26 + br, 0], [0.04, 0.16, 0.04], '#f4f4ff', { rot: [0, 0, -s * 0.4], e: 1 }));
      o.push(MP([0, 1.28 + br, 0], [0.05, 0.18, 0.04], '#f4f4ff', { e: 1 }));
    }
  });
MD[88] = t =>
  mdBird(t, {
    ph: 1,
    b: '#f4f4f8',
    l: '#fff',
    w: '#9aa8c0',
    w2: '#7a88a0',
    ws: 0.9,
    h: '#fafafc',
    bc: '#ff9a2a',
    fa: 0.06
  });
MD[89] = t =>
  mdBird(t, {
    ph: 2,
    b: '#f4f4f8',
    l: '#fff',
    w: '#5a88c8',
    w2: '#3a68a8',
    ws: 1.4,
    h: '#fafafc',
    bc: '#ff9a2a',
    bk: 0.04,
    fa: 0.07
  });
MD[90] = t =>
  mdBird(t, {
    ph: 3,
    pg: 1,
    b: '#5a8ad0',
    l: '#d8e8f8',
    w: '#3a6ab0',
    h: '#6a98dc',
    bc: '#ffb52e',
    fc: '#ffb52e',
    fa: 0.08,
    crest: (o, br) => {
      o.push(MP([0, 1.24 + br, 0.02], [0.05, 0.1, 0.04], '#ffe27a', { e: 1 }));
      o.push(MP([-0.06, 1.21 + br, 0.02], [0.035, 0.08, 0.035], '#ffe27a', { rot: [0, 0, 0.5], e: 1 }));
    }
  });
MD[91] = t =>
  mdBird(t, {
    ph: 4,
    pg: 1,
    b: '#4a4e68',
    l: '#c8ccd8',
    w: '#2a2e48',
    h: '#5a5e78',
    bc: '#ffb52e',
    fc: '#ffb52e',
    fa: 0.08,
    bw: 0.03,
    crest: (o, br) => {
      o.push(MP([0, 0.76 + br, 0.14], [0.2, 0.05, 0.14], '#ffd84a', { g: 0.4 }));
      o.push(MP([0, 0.7 + br, 0.22], [0.05, 0.05, 0.03], '#4af0e0', { e: 1 }));
    }
  });
MD[86] = t => mdButter(t, { ph: 1, b: '#ffb8d0', w: '#ffd84a', w2: '#ffe27a', sp: '#fff6c8' });
MD[87] = t => mdButter(t, { ph: 3, b: '#f8c8e4', w: '#9a78d8', w2: '#b898e8', sp: '#ffe8ff' });
MD[92] = t =>
  mdBeetle(t, {
    ph: 1,
    sh: '#3aa890',
    sh2: '#4abca4',
    hd: '#4abca4',
    hl: '#9ae0d0',
    lg: '#2a4a4a',
    dots: '#9ae8d8'
  });
MD[93] = t =>
  mdBeetle(t, {
    ph: 3,
    sh: '#e0a830',
    sh2: '#f0c050',
    hd: '#f0c050',
    hl: '#fff0a0',
    lg: '#6a3a1a',
    dots: '#a86a2a',
    horn: '#f0d8a0',
    bl: '#ffe27a'
  });
MD[94] = t => mdFrog(t, { ph: 1, b: '#4a94e8', b2: '#3a78c8', d: '#2a5aa0', l: '#a8d4f8', rim: '#e0f0ff' });
MD[95] = t =>
  mdFrog(t, {
    ph: 3,
    b: '#d8a838',
    b2: '#b88828',
    d: '#8a6a20',
    l: '#f0d890',
    rim: '#e8f4ff',
    spots: '#4a8ad8',
    bub: 1
  });
MD[96] = t => mdCoil(t, { ph: 1, b: '#6ac850', b2: '#58b040', d: '#3a8a30', l: '#b8e890' });
MD[97] = t =>
  mdCoil(t, { ph: 3, b: '#3a8a58', b2: '#2e7048', d: '#f0c040', l: '#a8d8a0', h: '#4a9a68', crest: 1 });
MD[98] = t =>
  mdRc(MD[9](t), {
    '#e8552a': '#e8b440',
    '#b8401e': '#c08a28',
    '#ffd8a8': '#fff0c8',
    '#c8421e': '#d89a28',
    '#ffb02e': '#ffd84a',
    '#ff7a1c': '#ff9a2a',
    '#8a4a22': '#a86a20',
    '#a85c2c': '#c88428',
    '#6a2a1a': '#8a5a20'
  });
MD[99] = t => {
  const o = [],
    bob = Math.sin(t / 800) * 0.03,
    bl = blinkK(t + 900),
    gl = 0.7 + Math.sin(t / 250) * 0.3;
  const NV = '#1c2a48',
    CY = '#4af0e8';
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2,
      r = 0.52;
    o.push(
      MP([Math.sin(a) * r, 0.66 + bob + Math.cos(a) * r * 0.9, -0.06], [0.045, 0.17, 0.04], CY, {
        rot: [0, 0, -a],
        e: 1
      })
    );
  }
  o.push(MP([0, 0.66 + bob, 0], [0.5, 0.46, 0.44], NV, { g: 0.6 }));
  o.push(MP([-0.15, 0.84 + bob, 0.3], [0.14, 0.08, 0.06], '#4a6a9a', { g: 1 }));
  o.push(MP([0, 1.02 + bob, 0.1], [0.025, 0.18, 0.025], '#2a4068', { rot: [0.5, 0, 0] }));
  o.push(MP([0, 1.2 + bob, 0.2], [0.07, 0.07, 0.07], CY, { e: 1 }));
  for (const s of [-1, 1]) {
    o.push(MP([s * 0.16, 0.76 + bob, 0.38], [0.08, 0.07 * bl, 0.04], CY, { e: 1 }));
    mdBrow(o, s * 0.16, 0.86 + bob, 0.4, -s * 0.5, CY);
  }
  o.push(MP([0, 0.5 + bob, 0.4], [0.24, 0.1, 0.05], '#0a1020'));
  for (let i = 0; i < 6; i++)
    o.push(
      MP([(i - 2.5) * 0.08, 0.55 + bob, 0.43], [0.025, 0.05, 0.02], '#f4f8ff', {
        rot: [0, 0, i % 2 ? 0.2 : -0.2]
      })
    );
  for (const s of [-1, 1]) o.push(MP([s * 0.5, 0.5 + bob, 0.04], [0.12, 0.1, 0.1], '#2a4068', { g: 0.5 }));
  return o;
};
// pose / animation de rendu pour une espèce
function mdFor(spec, key, t, yaw, pitch, o) {
  const f = MD[spec];
  if (!f) return null;
  V3.mdt = V3.mdt || {};
  const q = V3.mdt[key];
  if (q && q.sp === spec && q.r === ((o && o.R) || 88) && t - q.t < 40 && t >= q.t && V3.mdc[key])
    return V3.mdc[key];
  V3.mdt[key] = { sp: spec, t, r: (o && o.R) || 88 };
  return mdRender(f(t), key, (o && o.R) || 88, yaw, pitch, Object.assign({ t }, o || {}));
}
