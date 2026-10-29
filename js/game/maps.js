// Construction des cartes : villes, routes, intérieurs, objets cachés
// ---------- Cartes ----------
function mk(w, h, f) {
  const a = [];
  for (let y = 0; y < h; y++) {
    const r = [];
    for (let x = 0; x < w; x++) r.push(x == 0 || y == 0 || x == w - 1 || y == h - 1 ? '#' : f(x, y));
    a.push(r);
  }
  return a;
}
function rect(g, x1, y1, x2, y2, c) {
  for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) g[y][x] = c;
}
const town = mk(20, 12, () => '.');
rect(town, 2, 2, 5, 4, 'H');
town[4][3] = 'C';
rect(town, 12, 2, 15, 4, 'H');
town[4][13] = 'L';
[
  [5, 7],
  [6, 7],
  [14, 7],
  [15, 7],
  [3, 9],
  [16, 9]
].forEach(([x, y]) => (town[y][x] = 'T'));
town[0][10] = 'U';
town[6][12] = 'M';
rect(town, 16, 5, 18, 6, 'H');
town[6][17] = 'K';
const route = mk(20, 16, (x, y) => {
  if (x == 9 || x == 10) return '.';
  const h = (x * 37 + y * 17) % 11;
  return h < 2 ? 'T' : 'g';
});
rect(route, 2, 6, 4, 8, 'w');
route[0][10] = 'U';
route[15][10] = 'D';
route[7][9] = route[7][10] = 'R';
const city = mk(20, 12, () => '.');
rect(city, 3, 2, 6, 4, 'H');
city[4][4] = 'C';
rect(city, 12, 2, 17, 4, 'H');
city[4][14] = 'B';
rect(city, 1, 7, 4, 10, 'g');
rect(city, 15, 7, 18, 10, 'g');
[
  [8, 6],
  [11, 6]
].forEach(([x, y]) => (city[y][x] = 'T'));
city[11][10] = 'D';
city[0][10] = 'U';
city[6][14] = 'M';
rect(city, 7, 7, 9, 8, 'H');
city[8][8] = 'K';
const maps = [
  { n: 'Brumeval', g: town },
  { n: 'Route 1', g: route, e: { s: [3, 4, 5, 6], l: [3, 5] } },
  { n: 'Cendrebourg', g: city, e: { s: [3, 4, 8, 6], l: [5, 7] } }
];
const r2 = mk(20, 16, (x, y) => {
  if (x == 9 || x == 10) return '.';
  const h = (x * 29 + y * 23) % 9;
  return h < 2 ? 'T' : 'g';
});
rect(r2, 14, 9, 17, 11, 'w');
r2[0][10] = 'U';
r2[15][10] = 'D';
r2[3][8] = 'O';
r2[6][9] = r2[6][10] = r2[11][9] = r2[11][10] = 'R';
const lun = mk(20, 12, () => '.');
rect(lun, 3, 2, 6, 4, 'H');
lun[4][4] = 'C';
rect(lun, 12, 2, 17, 4, 'H');
lun[4][14] = 'B';
[
  [8, 6],
  [11, 6],
  [2, 8],
  [17, 8]
].forEach(([x, y]) => (lun[y][x] = 'T'));
lun[11][10] = 'D';
lun[0][10] = 'U';
lun[6][14] = 'M';
rect(lun, 7, 7, 9, 8, 'H');
lun[8][8] = 'K';
maps.push({ n: 'Route 2', g: r2, e: { s: [3, 4, 5, 6, 8], l: [7, 10] } }, { n: 'Lunargent', g: lun });
const fo = mk(20, 16, (x, y) => {
  if (x == 9 || x == 10) return '.';
  const h = (x * 31 + y * 19) % 7;
  return h < 2 ? 'T' : 'g';
});
fo[15][10] = 'D';
fo[0][10] = 'U';
fo[2][9] = fo[2][10] = 'V';
fo[6][9] = fo[6][10] = fo[10][9] = fo[10][10] = 'R';
maps.push({ n: "Forêt d'Argent", g: fo, e: { s: [13, 14, 15, 5, 4, 8], l: [10, 13] } });
const I = (k, n, f) => {
  const g = mk(15, 10, () => '.');
  f(g);
  g[9][7] = 'X';
  maps.push({ n, g, in: 1, k });
};
I('home', 'Maison', g => {
  rect(g, 3, 1, 5, 1, 's');
  g[3][2] = g[4][2] = 'b';
  g[3][10] = 'N';
  g[3][9] = g[3][11] = 'k';
  g[1][12] = 'p';
});
I('center', 'Centre de soins', g => {
  g[3][7] = 'N';
  g[3][5] = g[3][6] = g[3][8] = g[3][9] = 'k';
  g[2][7] = 'm';
  g[1][2] = g[1][12] = 'p';
});
I('lab', 'Laboratoire du Prof. Sauge', g => {
  rect(g, 2, 1, 5, 1, 's');
  rect(g, 9, 1, 12, 1, 's');
  g[3][3] = g[3][11] = 'm';
  g[3][7] = 'N';
  g[3][6] = g[3][8] = 'k';
  g[6][3] = g[6][11] = 'p';
});
I('gym', 'Arène', g => {
  g[2][7] = 'N';
  g[2][3] = g[2][11] = 'p';
  g[5][3] = g[5][11] = 'p';
});
maps[3].w = maps[5].w = 1;
[0, 1, 2].forEach(q => {
  I('home', ['Maison du grand-père', 'Maison de Léa', 'Maison du collectionneur'][q], g => {
    rect(g, 2, 1, 4, 1, 's');
    g[3][11] = 'N';
    g[4][10] = g[4][12] = 'k';
    g[3][2] = g[4][2] = 'b';
    g[1][12] = 'p';
  });
  maps[maps.length - 1].q = q;
});
const cv2 = mk(15, 12, (x, y) => {
  const h = (x * 41 + y * 29) % 9;
  return h < 1 ? 'r' : h < 4 ? 'g' : '.';
});
for (let y = 1; y < 11; y++) if (cv2[y][7] == 'r') cv2[y][7] = '.';
for (let x = 7; x < 13; x++) cv2[3][x] = '.';
cv2[2][7] = 'N';
cv2[2][12] = 'o';
cv2[11][7] = 'X';
maps.push({ n: 'Grotte Lunaire', g: cv2, in: 1, k: 'cave', e: { s: [14, 15, 8, 13], l: [9, 12] } });
const ITM = [
  { id: 1, m: 1, x: 3, y: 4, t: 'pots', n: 1 },
  { id: 2, m: 1, x: 16, y: 12, t: 'balls', n: 2 },
  { id: 3, m: 3, x: 4, y: 12, t: 'gold', n: 150 },
  { id: 4, m: 5, x: 14, y: 4, t: 'pots', n: 2 },
  { id: 5, m: 2, x: 6, y: 9, t: 'balls', n: 1 },
  { id: 6, m: 0, x: 17, y: 9, t: 'gold', n: 80 }
];
ITM.forEach(i => (maps[i.m].g[i.y][i.x] = '.'));
const rt = (w, h, f) => {
  const g = mk(w, h, f);
  g[0][10] = 'U';
  g[h - 1][10] = 'D';
  return g;
};
const tw = ex => {
  const g = mk(20, 12, () => '.');
  rect(g, 3, 2, 6, 4, 'H');
  g[4][4] = 'C';
  rect(g, 12, 2, 17, 4, 'H');
  g[4][14] = 'B';
  rect(g, 7, 7, 9, 8, 'H');
  g[8][8] = 'K';
  g[6][14] = 'M';
  [
    [8, 6],
    [11, 6],
    [2, 8],
    [17, 8]
  ].forEach(([x, y]) => (g[y][x] = 'T'));
  g[0][10] = 'U';
  g[11][10] = 'D';
  ex && ex(g);
  return g;
};
const m3 = rt(20, 18, (x, y) => (x == 9 || x == 10 ? '.' : (x * 29 + y * 31) % 7 < 2 ? 'T' : 'g'));
m3[5][9] = m3[5][10] = m3[12][9] = m3[12][10] = 'R';
const m4 = rt(20, 18, (x, y) => (x == 9 || x == 10 ? '.' : (x * 23 + y * 37) % 8 < 2 ? 'T' : 'g'));
rect(m4, 14, 6, 17, 10, 'w');
m4[6][9] = m4[6][10] = m4[13][9] = m4[13][10] = 'R';
const m6 = rt(20, 20, (x, y) => (x == 9 || x == 10 ? '.' : (x * 19 + y * 43) % 5 < 2 ? 'T' : 'g'));
m6[8][9] = m6[8][10] = m6[14][9] = m6[14][10] = 'R';
m6[2][9] = m6[2][10] = 'W';
maps.push(
  { n: 'Route 3', g: m3, e: { s: [20, 21, 14, 4, 5], l: [13, 16] } },
  { n: 'Pierrefeu', g: tw() },
  { n: 'Route 4', g: m4, e: { s: [22, 23, 24, 25, 6], l: [16, 19] } },
  { n: "Havre-d'Opale", g: tw(g => rect(g, 1, 8, 5, 10, 'w')) },
  { n: 'Mont Croissant', g: m6, e: { s: [26, 20, 15, 21, 25], l: [19, 22] } }
);
maps[14].w = maps[18].w = 1;
[3, 4].forEach(q => {
  I('home', ['Chalet de Roc', 'Maison du port'][q - 3], g => {
    rect(g, 2, 1, 4, 1, 's');
    g[3][11] = 'N';
    g[4][10] = g[4][12] = 'k';
    g[3][2] = g[4][2] = 'b';
    g[1][12] = 'p';
  });
  maps[maps.length - 1].q = q;
});
maps.push({
  n: 'Plateau de la Ligue',
  g: tw(g => {
    g[0][10] = '#';
  })
});
I('palace', 'Palais de combat', g => {
  g[2][7] = 'N';
  g[2][3] = g[2][11] = 'p';
  g[5][3] = g[5][11] = 'p';
});
ITM.push(
  { id: 7, m: 14, x: 5, y: 6, t: 'pots', n: 2 },
  { id: 8, m: 16, x: 3, y: 12, t: 'sp', n: 1 },
  { id: 9, m: 18, x: 15, y: 10, t: 'balls', n: 3 },
  { id: 10, m: 15, x: 17, y: 9, t: 'gold', n: 200 },
  { id: 11, m: 17, x: 4, y: 6, t: 'sp', n: 1 }
);
ITM.slice(6).forEach(i => (maps[i.m].g[i.y][i.x] = '.'));
const UP = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 14,
    14: 15,
    15: 16,
    16: 17,
    17: 18,
    18: 21,
    21: 23,
    23: 24,
    24: 25,
    25: 26,
    26: 27,
    27: 28
  },
  DN = {};
for (const k in UP) DN[UP[k]] = +k;
const TP = {
  1: [3, 4],
  3: [3, 6],
  5: [5, 8],
  14: [20, 21],
  16: [22, 23],
  18: [26, 25],
  23: [27, 31],
  25: [28, 29],
  27: [30, 32],
  28: [31, 33]
};
const nz = (x, y, q = 0) =>
  Math.sin(x * 0.71 + y * 0.37 + q) + Math.sin(x * 0.29 - y * 0.83 + q * 2) + Math.sin((x + y) * 0.19 - q);
const rnd = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
function mkRoute(w, h, o) {
  const cxp = y =>
    Math.round(o.px + (o.amp || 4) * Math.sin(y / 6 + (o.ph || 0)) * Math.min(1, y / 9, (h - 1 - y) / 9));
  const g = mk(w, h, (x, y) => {
    const d = Math.abs(x - cxp(y)),
      safe = y < (o.top || 6) || y > h - 12;
    if (d <= 1) return '_';
    if (x < 3 || x > w - 4) return 'T';
    if (d > 2 && nz(x, y, o.s) > (o.td || 1.45)) return 'T';
    if (d > 2 && nz(x * 0.9 + 3, y * 1.1, 2 + o.s) > 1.3) return rnd(x, y) % 3 ? 'T' : 'b';
    if (d == 2 && y % 11 < 2 && rnd(x, y) % 3) return 'b';
    if (d > 2 && !safe && nz(x * 1.3, y * 1.3, 5 + o.s) > -0.15) return 'g';
    return rnd(x, y) % 19 == 0 ? 'f' : '.';
  });
  (o.ponds || []).forEach(([x, y, a, b]) => {
    for (let j = -b; j <= b; j++)
      for (let i = -a; i <= a; i++)
        if (
          (i * i) / (a * a) + (j * j) / (b * b) <= 1 &&
          g[y + j]?.[x + i] &&
          Math.abs(x + i - cxp(y + j)) > 2
        )
          g[y + j][x + i] = 'w';
  });
  (o.passes || []).forEach(([y, pw]) => {
    for (let j = 0; j < 3; j++) {
      const q = [cxp(y + j - 1), cxp(y + j), cxp(y + j + 1)],
        lo = Math.min(...q) - pw,
        hi = Math.max(...q) + pw;
      for (let x = 3; x < w - 3; x++) g[y + j][x] = x >= lo && x <= hi ? '_' : rnd(x, y) % 4 ? 'T' : 'b';
    }
  });
  if (o.bridge) {
    const [y, len] = o.bridge;
    for (let j = 0; j < len; j++)
      for (let x = 3; x < w - 3; x++) g[y + j][x] = Math.abs(x - cxp(y + j)) <= 1 ? 'j' : 'w';
  }
  [
    [3, 9],
    [h - 10, h - 4]
  ].forEach(([a, b]) => {
    for (let y = a; y < b; y++)
      for (let x = 3; x < w - 3; x++) if (Math.abs(x - cxp(y)) > 2) g[y][x] = rnd(x, y) % 5 ? 'T' : 'b';
  });
  const row = (y, c) => {
    for (let x = 3; x < w - 3; x++) g[y][x] = Math.abs(x - cxp(y)) <= 1 ? c : 'T';
  };
  const bad = new Set();
  [...(o.tr || []), ...(o.boss ? [o.boss[0]] : []), ...(o.qy ? [o.qy] : [])].forEach(y => {
    for (let j = -3; j <= 3; j++) bad.add(y + j);
  });
  (o.passes || []).forEach(([y]) => {
    for (let j = -2; j <= 5; j++) bad.add(y + j);
  });
  if (o.bridge) for (let j = -2; j < o.bridge[1] + 2; j++) bad.add(o.bridge[0] + j);
  {
    const th = o.th || 'plain',
      top = o.top || 6,
      DQ = {
        mountain: [22, 10],
        volcano: [20, 14],
        ruins: [8, 22],
        star: [6, 18],
        desert: [10, 16],
        snow: [12, 10],
        forest: [4, 8],
        swamp: [3, 10],
        mist: [6, 8],
        autumn: [4, 10],
        meadow: [0, 6],
        dawn: [0, 6],
        coast: [16, 6],
        beach: [8, 10],
        tropical: [0, 8],
        lake: [6, 8]
      }[th] || [0, 0],
      OP = { beach: 55, desert: 50, tropical: 25, coast: 25 }[th] || 0,
      FL = { meadow: 16, dawn: 12, tropical: 8, autumn: 5 }[th] || 0;
    for (let y = top; y < h - 3; y++)
      for (let x = 4; x < w - 4; x++) {
        const ch = g[y][x],
          rr = rnd(x * 5 + 1, y * 3 + 2) % 100;
        if (ch == 'T') {
          if (OP && y >= top + 4 && y < h - 12 && !bad.has(y) && rnd(x, y * 7) % 100 < OP) g[y][x] = '.';
          else if (rr < DQ[0]) g[y][x] = 'q';
          else if (rr < DQ[0] + DQ[1]) g[y][x] = 'u';
        } else if (ch == '.' && FL && rr < FL) g[y][x] = 'f';
      }
    if (['lake', 'beach', 'tropical', 'swamp', 'coast'].includes(th)) {
      for (let y = top + 9, k = 0; y < h - 16; y += 15, k++) {
        if ([-4, -3, -2, -1, 0, 1, 2, 3, 4].some(j => bad.has(y + j))) continue;
        const xs = cxp(y) + (k % 2 ? -8 : 8),
          a = 3 + (k % 3),
          b = 2 + (k % 2);
        for (let j = -b; j <= b; j++)
          for (let i = -a; i <= a; i++) {
            const xx = xs + i,
              yy = y + j;
            if (
              (i * i) / (a * a) + (j * j) / (b * b) <= 1 &&
              g[yy]?.[xx] &&
              xx > 4 &&
              xx < w - 5 &&
              Math.abs(xx - cxp(yy)) > 2
            )
              g[yy][xx] = 'w';
          }
      }
    }
  }
  for (let y0 = (o.top || 6) + 3; y0 < h - 17; y0 += 13) {
    let ok = true;
    for (let j = 0; j < 6; j++) if (bad.has(y0 + j)) ok = false;
    if (!ok) continue;
    for (let j = 0; j < 6; j++) {
      const y = y0 + j;
      for (let x = 3; x < w - 3; x++) if ('._f'.includes(g[y][x])) g[y][x] = 'g';
    }
  }
  if (!o.nogate) {
    const b2 = new Set(),
      ad = (y, a, b) => {
        for (let j = a; j <= b; j++) b2.add(y + j);
      };
    [...(o.tr || []), ...(o.boss ? [o.boss[0]] : []), ...(o.qy ? [o.qy] : [])].forEach(y => ad(y, -1, 1));
    (o.passes || []).forEach(([y]) => ad(y, -1, 3));
    if (o.bridge) ad(o.bridge[0], -1, o.bridge[1]);
    let last = -99,
      n = 0;
    g.gates = [];
    for (let t = (o.top || 6) + 8; t < h - 11; t++) {
      if (t - last < 10) continue;
      let H = 0;
      for (const hh of [4, 3]) {
        let ok = true;
        for (let j = -hh; j <= hh; j++) if (b2.has(t + j)) ok = false;
        if (ok) {
          H = hh;
          break;
        }
      }
      if (!H) continue;
      const c = cxp(t),
        R = w - 5 - c,
        L = c - 4,
        sd = R >= L ? 1 : -1,
        E = Math.min(9, (sd > 0 ? R : L) - 1);
      if (E < 5) continue;
      last = t;
      let kind = (n + (o.s | 0)) % 3;
      if (kind == 1 && H < 4) kind = 0;
      const ppl = (n + (o.s | 0) * 2) % 3 == 2;
      n++;
      const set = (i, j, ch) => {
        const x = c + sd * i,
          y = t + j;
        if (x > 3 && x < w - 4 && g[y]) g[y][x] = ch;
      };
      for (let j = -H; j <= H; j++) {
        for (let i = 2; i <= E + 1; i++) set(i, j, 'T');
        for (let i = -1; i <= 1; i++) g[t + j][c + i] = j ? '_' : ppl ? 'y' : 'Z';
      }
      for (let x = 3; x < w - 3; x++)
        if (Math.abs(x - c) > 1 && !((x - c) * sd >= 2 && (x - c) * sd <= E + 1)) g[t][x] = 'T';
      const hz = (i1, i2, j, wd) => {
          for (let i = i1; i <= i2; i++) {
            set(i, j, 'g');
            if (wd) set(i, j - Math.sign(j), 'g');
          }
        },
        vt = (i, j1, j2, wd) => {
          for (let j = Math.min(j1, j2); j <= Math.max(j1, j2); j++) {
            set(i, j, 'g');
            if (wd) set(i - 1, j, 'g');
          }
        };
      let cj = 0,
        ci = E + 1;
      if (kind == 0) {
        hz(2, E, H, 1);
        hz(2, E, -H, 1);
        vt(E, -H, H, 1);
      } else if (kind == 1) {
        hz(2, E, H, 0);
        vt(E, 2, H, 0);
        hz(4, E, 2, 0);
        vt(4, -2, 2, 0);
        hz(4, E, -2, 0);
        vt(E, -H, -2, 0);
        hz(2, E, -H, 0);
        cj = 1;
        ci = E;
      } else {
        for (let j = -H; j <= H; j++)
          for (let i = 2; i <= E; i++)
            if (j || i >= E - 1)
              set(i, j, i > 3 && i < E - 1 && Math.abs(j) >= 1 && rnd(c + i, t + j) % 5 == 0 ? 'T' : 'g');
        cj = H;
        ci = E + 1;
      }
      set(ci, cj, 'z');
      g.gates.push({ t, c, ppl, k: kind });
    }
  }
  for (let y = o.top || 6; y < h - 12; y++)
    for (let x = 3; x < w - 3; x++)
      if (g[y][x] == 'b' && Math.abs(x - cxp(y)) > 2 && rnd(x * 3, y * 7) % 5 < 3) g[y][x] = 'g';

  (o.tr || []).forEach(y => row(y, 'R'));
  if (o.boss) row(o.boss[0], o.boss[1]);
  if (o.qy) row(o.qy, 'Q');
  o.hook && o.hook(g, cxp);
  g[0][cxp(0)] = o.noU ? '#' : 'U';
  g[h - 1][cxp(h - 1)] = 'D';
  return g;
}
function mkTown(o) {
  const w = 40,
    h = 28,
    g = mk(w, h, (x, y) => {
      if (
        (x >= 19 && x <= 21) ||
        (y >= 12 && y <= 13 && x >= 2 && x <= w - 3) ||
        (y >= 22 && y <= 23 && x >= 2 && x <= w - 3)
      )
        return '=';
      if (x <= 1 || x >= w - 2 || y <= 1 || y >= h - 2) return 'T';
      return rnd(x, y) % 13 == 0 ? 'f' : '.';
    });
  (o.b || []).forEach(([t, x, y, bw]) => {
    rect(g, x, y, x + bw - 1, y + 2, 'H');
    const dx = x + (bw >> 1);
    if (t != 'H') {
      g[y + 2][dx] = t;
      for (let yy = y + 3; yy < (y < 12 ? 12 : 22); yy++) g[yy][dx] = '=';
    }
  });
  if (o.m) g[o.m[1]][o.m[0]] = 'M';
  if (o.pond) rect(g, ...o.pond, 'w');
  (o.t || []).forEach(([x, y]) => (g[y][x] = 'T'));
  for (let x = 2; x < w - 2; x++)
    for (const y of [2, h - 3, 10, 20]) if ('.f'.includes(g[y][x])) g[y][x] = rnd(x, y) % 3 ? 'T' : 'b';
  for (let y = 3; y < h - 3; y++)
    for (const x of [2, w - 3]) if ('.f'.includes(g[y][x])) g[y][x] = rnd(x, y) % 3 ? 'T' : 'b';
  if (o.noU) rect(g, 19, 0, 21, 1, 'T');
  else g[0][20] = 'U';
  if (o.noD) rect(g, 19, h - 2, 21, h - 1, 'T');
  else g[h - 1][20] = 'D';
  return g;
}
const cave = (g, c, y) => {
  const x0 = c(y);
  for (let x = 5; x <= x0 - 2; x++) {
    g[y][x] = '_';
    g[y - 1][x] = '.';
    g[y + 1][x] = '.';
  }
  g[y - 1][4] = g[y + 1][4] = '.';
  g[y][4] = 'O';
};
const TW = {
  0: {
    b: [
      ['C', 4, 6, 5],
      ['H', 11, 6, 5],
      ['L', 24, 6, 7],
      ['H', 33, 6, 5],
      ['K', 4, 16, 5],
      ['H', 11, 16, 5],
      ['H', 24, 16, 5],
      ['H', 31, 16, 5]
    ],
    noD: 1,
    t: [
      [8, 10],
      [18, 10],
      [34, 10],
      [8, 20],
      [16, 20]
    ]
  },
  2: {
    b: [
      ['C', 4, 6, 5],
      ['H', 11, 6, 5],
      ['B', 24, 6, 7],
      ['H', 33, 6, 5],
      ['K', 4, 16, 5],
      ['H', 11, 16, 5],
      ['H', 24, 16, 5],
      ['H', 31, 16, 5]
    ],
    m: [17, 11],
    pond: [9, 24, 16, 25]
  },
  4: {
    b: [
      ['B', 4, 6, 7],
      ['H', 12, 6, 5],
      ['C', 24, 6, 5],
      ['H', 31, 6, 5],
      ['H', 4, 16, 5],
      ['H', 11, 16, 5],
      ['K', 24, 16, 5],
      ['H', 31, 16, 5]
    ],
    m: [23, 11],
    pond: [28, 24, 36, 25]
  },
  15: {
    b: [
      ['C', 4, 6, 5],
      ['H', 11, 6, 5],
      ['B', 24, 6, 7],
      ['H', 33, 6, 5],
      ['K', 4, 16, 5],
      ['H', 11, 16, 5],
      ['H', 24, 16, 5],
      ['H', 31, 16, 5]
    ],
    m: [17, 11]
  },
  17: {
    b: [
      ['B', 4, 6, 7],
      ['H', 12, 6, 5],
      ['C', 24, 6, 5],
      ['H', 31, 6, 5],
      ['K', 4, 16, 5],
      ['H', 11, 16, 5]
    ],
    m: [23, 11],
    pond: [22, 16, 35, 21]
  },
  21: {
    b: [
      ['C', 4, 6, 5],
      ['H', 11, 6, 5],
      ['B', 24, 6, 7],
      ['K', 4, 16, 5],
      ['H', 11, 16, 5],
      ['H', 24, 16, 5]
    ],
    m: [17, 11]
  }
};
const BIO = {
  1: 'plain',
  3: 'meadow',
  5: 'forest',
  14: 'autumn',
  16: 'lake',
  18: 'mountain',
  23: 'mist',
  25: 'volcano',
  27: 'snow',
  28: 'ruins',
  32: 'dawn',
  34: 'coast',
  36: 'desert',
  39: 'beach',
  41: 'tropical',
  43: 'swamp',
  45: 'star'
};
const RT = {
  1: [
    34,
    80,
    {
      px: 17,
      amp: 5,
      ph: 0,
      s: 1,
      tr: [46, 22],
      qy: 60,
      bridge: [32, 4],
      passes: [
        [54, 1],
        [12, 0]
      ],
      ponds: [
        [8, 40, 3, 2],
        [26, 26, 3, 2]
      ]
    }
  ],
  3: [
    34,
    82,
    {
      px: 17,
      amp: 6,
      ph: 1.2,
      s: 3,
      tr: [60, 26],
      bridge: [42, 4],
      passes: [
        [50, 0],
        [16, 1]
      ],
      ponds: [[26, 68, 4, 3]],
      hook: (g, c) => cave(g, c, 34)
    }
  ],
  5: [
    36,
    86,
    {
      px: 18,
      amp: 5,
      ph: 2,
      s: 5,
      tr: [68, 44],
      boss: [14, 'V'],
      td: 1.0,
      top: 5,
      bridge: [36, 3],
      passes: [
        [56, 0],
        [26, 1],
        [20, 0]
      ]
    }
  ],
  14: [
    34,
    82,
    {
      px: 17,
      amp: 6,
      ph: 0.5,
      s: 7,
      tr: [60, 30],
      bridge: [44, 4],
      passes: [
        [52, 0],
        [18, 1]
      ],
      ponds: [[8, 36, 3, 2]]
    }
  ],
  16: [
    34,
    82,
    {
      px: 17,
      amp: 5,
      ph: 2.5,
      s: 9,
      tr: [60, 30],
      bridge: [46, 4],
      passes: [
        [40, 0],
        [14, 1]
      ],
      ponds: [
        [26, 22, 5, 4],
        [7, 66, 3, 2]
      ]
    }
  ],
  18: [
    34,
    90,
    {
      px: 17,
      amp: 6,
      ph: 1,
      s: 11,
      tr: [74, 60, 46, 30],
      boss: [8, 'W'],
      td: 1.2,
      top: 8,
      passes: [
        [66, 0],
        [52, 1],
        [38, 0],
        [20, 1]
      ],
      bridge: [24, 4]
    }
  ],
  23: [
    34,
    80,
    {
      px: 17,
      amp: 5,
      ph: 0.8,
      s: 13,
      tr: [58, 34],
      bridge: [44, 4],
      passes: [
        [48, 0],
        [22, 1],
        [12, 0]
      ],
      ponds: [[8, 50, 3, 2]]
    }
  ],
  25: [
    34,
    82,
    {
      px: 17,
      amp: 6,
      ph: 1.9,
      s: 15,
      tr: [62, 38],
      bridge: [50, 4],
      passes: [
        [56, 1],
        [24, 0]
      ],
      ponds: [[26, 30, 4, 3]]
    }
  ],
  27: [
    34,
    84,
    {
      px: 17,
      amp: 5,
      ph: 3,
      s: 17,
      tr: [64, 44, 24],
      bridge: [34, 4],
      passes: [
        [54, 0],
        [14, 1]
      ],
      ponds: [
        [8, 70, 3, 2],
        [26, 16, 3, 2]
      ]
    }
  ],
  28: [
    34,
    92,
    {
      px: 17,
      amp: 6,
      ph: 2.2,
      s: 19,
      tr: [78, 66, 54, 40, 26],
      boss: [8, 'Y'],
      td: 1.1,
      top: 10,
      noU: 1,
      passes: [
        [72, 1],
        [60, 0],
        [46, 1],
        [32, 0],
        [18, 1]
      ]
    }
  ]
};
maps.push(
  { n: 'Sentier des Brumes', e: { s: [27, 31, 29, 15, 25], l: [34, 38] }, w: 1 },
  { n: 'Ardenfeu' },
  { n: 'Route des Cendres', e: { s: [28, 29, 22, 26, 32], l: [38, 42] } },
  { n: 'Cristalbourg' },
  { n: 'Gorge du Givre', e: { s: [30, 32, 26, 31, 29], l: [42, 46] }, w: 1 },
  { n: "Citadelle d'Éclipse", e: { s: [31, 33, 26, 30], l: [45, 49] }, w: 1 }
);
[5, 6].forEach(q => {
  I('home', ['Forge du village', 'Maison de cristal'][q - 5], g => {
    rect(g, 2, 1, 4, 1, 's');
    g[3][11] = 'N';
    g[4][10] = g[4][12] = 'k';
    g[3][2] = g[4][2] = 'b';
    g[1][12] = 'p';
  });
  maps[maps.length - 1].q = q;
});
maps[28].noEnc = 0;
Object.assign(TW, {
  24: {
    b: [
      ['C', 4, 6, 5],
      ['K', 11, 6, 5],
      ['B', 24, 6, 7],
      ['H', 33, 6, 5],
      ['H', 4, 16, 5],
      ['H', 11, 16, 5],
      ['H', 24, 16, 5],
      ['H', 31, 16, 5]
    ],
    m: [17, 11],
    pond: [28, 24, 36, 25]
  },
  26: {
    b: [
      ['B', 4, 6, 7],
      ['H', 12, 6, 5],
      ['C', 24, 6, 5],
      ['K', 31, 6, 5],
      ['H', 4, 16, 5],
      ['H', 11, 16, 5],
      ['H', 24, 16, 5]
    ],
    m: [23, 11],
    pond: [22, 16, 35, 21]
  }
});
ITM.push(
  { id: 12, m: 23, t: 'sp', n: 2 },
  { id: 13, m: 24, t: 'gold', n: 400 },
  { id: 14, m: 25, t: 'balls', n: 3 },
  { id: 15, m: 27, t: 'sp', n: 2 }
);
for (const k in TW) {
  maps[k].g = mkTown(TW[k]);
  maps[k].px = 20;
  maps[k].sp = [20, 12];
  maps[k].tn = 1;
}
for (const k in RT) {
  const [w, h, o] = RT[k];
  maps[k].th = BIO[k];
  maps[k].g = mkRoute(w, h, Object.assign({ th: BIO[k] }, o));
  maps[k].px = o.px;
  maps[k].tr = o.tr;
  maps[k].sp = [o.px, h - 4];
  if (o.qy) maps[k].qy = o.qy;
  if (o.boss) maps[k].boss = o.boss[0];
}
const IPOS = {
  1: [24, 56],
  2: [9, 30],
  3: [9, 64],
  4: [26, 50],
  5: [3, 10],
  6: [36, 10],
  7: [8, 46],
  8: [28, 40],
  9: [26, 56],
  10: [36, 20],
  11: [3, 20],
  12: [10, 50],
  13: [36, 10],
  14: [10, 44],
  15: [24, 40]
};
function reach(m) {
  const g = maps[m].g,
    [sx, sy] = maps[m].sp,
    seen = new Set([sx + ',' + sy]),
    q = [[sx, sy]];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ]) {
      const nx = x + dx,
        ny = y + dy,
        t = g[ny]?.[nx];
      if (!t || seen.has(nx + ',' + ny) || '#HTwNkpsmbroF'.includes(t)) continue;
      seen.add(nx + ',' + ny);
      q.push([nx, ny]);
    }
  }
  return seen;
}
ITM.forEach(i => {
  const p = IPOS[i.id],
    g = maps[i.m].g;
  let best = null,
    bd = 1e9;
  for (const k of reach(i.m)) {
    const [x, y] = k.split(',').map(Number);
    if (!'._=f'.includes(g[y][x])) continue;
    const d = (x - p[0]) ** 2 + (y - p[1]) ** 2;
    if (d < bd) {
      bd = d;
      best = [x, y];
    }
  }
  i.x = best[0];
  i.y = best[1];
});
const COL = {
  '.': '#9bd36b',
  g: '#4f9d3a',
  '#': '#1f4d2b',
  T: '#1f6b34',
  H: '#b5651d',
  w: '#3a7bd5',
  C: '#d33',
  L: '#8a4fd0',
  B: '#e6b800',
  U: '#d8c690',
  D: '#d8c690'
};
COL.R = COL.M = '#d8c690';
