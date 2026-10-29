// Moteur de particules et effets visuels des attaques, bruitages
const FXP = {
  F: ['#fffbe0', '#ffe27a', '#ffb02e', '#f2641f', '#b8280a'],
  E: ['#ffffff', '#bfeaff', '#6cc4ff', '#3d8fe0', '#2a62b8'],
  P: ['#f0ffc0', '#b6f27a', '#6cd05a', '#3a9a44', '#24703a'],
  V: ['#ffffff', '#e8f8ff', '#a8dcf0', '#7ab8d8', '#5a98b8'],
  N: ['#ffffff', '#fff0a0', '#ffd25a', '#e89a3a', '#a85a2a'],
  Y: ['#ffffff', '#fff6a0', '#ffe040', '#ffb000', '#c07000'],
  K: ['#9a8a8a', '#6a5a5a', '#4a3c3c', '#2c2430'],
  D: ['#efe4cc', '#d0c0a0', '#a89878']
};
const rr = (a, b) => a + Math.random() * (b - a),
  lerp = (a, b, t) => a + (b - a) * t,
  eIn = t => t * t,
  eOut = t => 1 - (1 - t) * (1 - t);
function fxEngine(bt, fast, hi) {
  const b = bt.getBoundingClientRect(),
    W = b.width || 400,
    H = b.height || 400,
    s = Math.max(2, Math.round(W / 150)),
    cw = Math.ceil(W / s),
    ch = Math.ceil(H / s),
    cv = document.createElement('canvas');
  cv.width = cw;
  cv.height = ch;
  cv.style.cssText =
    'position:absolute;left:0;top:0;width:100%;height:100%;z-index:6;pointer-events:none;image-rendering:pixelated;background:transparent!important;border:0';
  bt.append(cv);
  const g = cv.getContext('2d');
  if (!g) {
    cv.remove();
    return null;
  }
  const E = { cw, ch, g, T: 0, ps: [], ob: [], q: [], on: true, sp: fast ? 1.7 : 1, doms: [], hi };
  let last = performance.now();
  E.n = x => Math.max(1, Math.round(x * hi));
  E.px = (x, y, w, h, c) => {
    g.fillStyle = c;
    g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
  };
  E.disc = (x, y, r, c) => {
    g.fillStyle = c;
    for (let j = -Math.floor(r); j <= r; j++) {
      const w = Math.floor(Math.sqrt(Math.max(0, r * r - j * j)));
      g.fillRect(Math.round(x - w), Math.round(y + j), 2 * w + 1, 1);
    }
  };
  E.ring = (x, y, r, th, c) => {
    g.fillStyle = c;
    const n = Math.max(8, Math.ceil(r * 6.3));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283;
      g.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r), th, th);
    }
  };
  E.line = (x0, y0, x1, y1, th, c) => {
    g.fillStyle = c;
    const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) || 1;
    for (let i = 0; i <= n; i++)
      g.fillRect(Math.round(lerp(x0, x1, i / n) - th / 2), Math.round(lerp(y0, y1, i / n) - th / 2), th, th);
  };
  E.zig = (x0, y0, x1, y1, n, amp) => {
    const p = [[x0, y0]],
      dx = x1 - x0,
      dy = y1 - y0,
      l = Math.hypot(dx, dy) || 1;
    for (let i = 1; i < n; i++) {
      const t = i / n,
        o = rr(-amp, amp);
      p.push([x0 + dx * t - (dy / l) * o, y0 + dy * t + (dx / l) * o]);
    }
    p.push([x1, y1]);
    return p;
  };
  E.poly = (p, th, c) => {
    for (let i = 1; i < p.length; i++) E.line(p[i - 1][0], p[i - 1][1], p[i][0], p[i][1], th, c);
  };
  E.P = o =>
    E.ps.push(
      Object.assign(
        {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          ax: 0,
          ay: 0,
          dr: 1,
          life: 500,
          cols: FXP.F,
          s0: 2,
          s1: 1,
          shape: 'sq',
          rot: 0,
          vr: 0,
          glow: 0
        },
        o,
        { age: -(o.delay || 0) }
      )
    );
  E.burst = (x, y, n, o) => {
    for (let i = 0; i < E.n(n); i++) {
      const an = rr(o.a0 || 0, o.a1 == null ? 6.283 : o.a1),
        v = rr(o.v0, o.v1);
      E.P({
        x,
        y,
        vx: Math.cos(an) * v,
        vy: Math.sin(an) * v,
        ay: o.g || 0,
        dr: o.dr || 0.95,
        life: rr(o.l0, o.l1),
        cols: o.cols,
        s0: o.s0,
        s1: o.s1,
        shape: o.shape,
        glow: o.glow,
        vr: o.vr ? rr(-o.vr, o.vr) : 0,
        len: o.len,
        rot: rr(0, 6.28)
      });
    }
  };
  E.o = (t0, d, f) => E.ob.push({ t0: E.T + t0, d, f });
  E.wait = ms => new Promise(r => E.q.push([E.T + ms, r]));
  E.rg = (x, y, r1, d, cols, t0 = 0, r0 = 2) =>
    E.o(t0, d, u => {
      g.globalAlpha = 1 - u * u;
      E.ring(
        x,
        y,
        lerp(r0, r1, eOut(u)),
        u < 0.5 ? 2 : 1,
        cols[Math.min(cols.length - 1, Math.floor(u * cols.length))]
      );
      g.globalAlpha = 1;
    });
  E.glow = f => {
    g.globalCompositeOperation = 'lighter';
    f();
    g.globalCompositeOperation = 'source-over';
  };
  const ov = (css, kf, ms) => {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;inset:0;pointer-events:none;' + css;
    bt.append(d);
    E.doms.push(d);
    d.animate(kf, { duration: ms / E.sp, fill: 'forwards' });
    setTimeout(() => d.remove(), ms / E.sp + 100);
  };
  E.flash = (c, a, ms) =>
    ov(
      `z-index:7;background:${c};opacity:0`,
      [{ opacity: 0 }, { opacity: a, offset: 0.18 }, { opacity: 0 }],
      ms
    );
  E.dim = (c, a, ms) =>
    ov(
      `z-index:5;background:${c};opacity:0`,
      [{ opacity: 0 }, { opacity: a, offset: 0.2 }, { opacity: a, offset: 0.8 }, { opacity: 0 }],
      ms
    );
  E.shake = (px, ms) => {
    const kf = [{ transform: 'none' }];
    for (let i = 1; i < 9; i++) {
      const k = px * (1 - i / 9);
      kf.push({ transform: `translate(${rr(-k, k)}px,${rr(-k, k)}px)` });
    }
    kf.push({ transform: 'none' });
    try {
      $('sp').animate(kf, { duration: ms });
    } catch (e) {}
  };
  E.hit = (k = 1) => {
    if (!E.df || !E.A) return;
    const dx = E.B[0] - E.A[0],
      dy = E.B[1] - E.A[1],
      l = Math.hypot(dx, dy) || 1,
      m = (5 + 4 * (E.T1 || 1)) * k,
      x = (dx / l) * m,
      y = (dy / l) * m * 0.6,
      f = 'brightness(2.8) saturate(.2)';
    E.df.animate(
      [
        { transform: 'none', filter: 'none' },
        { transform: `translate(${x}px,${y}px)`, filter: f, offset: 0.14 },
        { transform: `translate(${x * 0.3}px,${y * 0.3}px)`, filter: 'none', offset: 0.3 },
        { transform: `translate(${x * 0.6}px,${y * 0.6}px)`, filter: f, offset: 0.46 },
        { transform: 'none', filter: 'none', offset: 0.62 },
        { transform: 'none', filter: f, offset: 0.74 },
        { transform: 'none', filter: 'none' }
      ],
      { duration: 520 / E.sp }
    );
  };
  E.ctr = el => {
    const e = el.querySelector('img,svg') || el,
      r = e.getBoundingClientRect();
    return [
      ((r.left + r.width / 2 - b.left) / b.width) * cw,
      ((r.top + r.height * 0.5 - b.top) / b.height) * ch,
      (r.width / b.width) * cw
    ];
  };
  E.end = () => {
    if (!E.on) return;
    E.on = false;
    cv.remove();
    E.q.forEach(([t, r]) => r());
    E.q = [];
  };
  const tick = now => {
    if (!E.on) return;
    const dt = Math.min(40, now - last) * E.sp;
    last = now;
    E.T += dt;
    const f = dt / 16.67;
    g.clearRect(0, 0, cw, ch);
    const ob = E.ob;
    E.ob = [];
    ob.forEach(o => {
      const u = (E.T - o.t0) / o.d;
      if (u < 0) {
        E.ob.push(o);
        return;
      }
      if (u <= 1) {
        o.f(u, E.T - o.t0);
        E.ob.push(o);
      }
    });
    E.ps = E.ps.filter(p => {
      p.age += dt;
      if (p.age < 0) return true;
      if (p.age > p.life) return false;
      const d = Math.pow(p.dr, f);
      p.vx = (p.vx + p.ax * f) * d;
      p.vy = (p.vy + p.ay * f) * d;
      p.x += p.vx * f;
      p.y += p.vy * f;
      p.rot += p.vr * f;
      const u = p.age / p.life,
        c = p.cols[Math.min(p.cols.length - 1, Math.floor(u * p.cols.length))],
        z = lerp(p.s0, p.s1, u);
      g.globalAlpha = p.nf ? 1 : u > 0.7 ? (1 - u) / 0.3 : 1;
      g.globalCompositeOperation = p.glow ? 'lighter' : 'source-over';
      g.fillStyle = c;
      if (p.shape == 'leaf') {
        g.save();
        g.translate(Math.round(p.x), Math.round(p.y));
        g.rotate(p.rot);
        g.fillRect(-z, -z / 2, z * 2, z);
        g.fillStyle = p.cols[0];
        g.fillRect(-z / 2, 0, z, 1);
        g.restore();
      } else if (p.shape == 'ln') {
        const m = Math.hypot(p.vx, p.vy) || 1,
          L = p.len || 6;
        E.line(p.x, p.y, p.x - (p.vx / m) * L, p.y - (p.vy / m) * L, Math.max(1, Math.round(z)), c);
      } else
        g.fillRect(
          Math.round(p.x - z / 2),
          Math.round(p.y - z / 2),
          Math.max(1, Math.round(z)),
          Math.max(1, Math.round(z))
        );
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';
      return true;
    });
    E.q = E.q.filter(([t, r]) => {
      if (E.T >= t) {
        r();
        return false;
      }
      return true;
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return E;
}
const FXF = {
  async F(E, A, B, T) {
    const C = FXP.F,
      [ax, ay] = A,
      [bx, by] = B,
      dx = bx - ax,
      dy = by - ay,
      L = Math.hypot(dx, dy) || 1,
      px = -dy / L,
      py = dx / L,
      K = FXP.K;
    const boom = (n, R) => {
      E.hit();
      E.burst(bx, by, n, { v0: 0.6, v1: R, g: 0.05, l0: 400, l1: 900, cols: C, s0: 4, s1: 1, glow: 1 });
      E.burst(bx, by, n / 3, {
        v0: 0.2,
        v1: 1.2,
        a0: 3.6,
        a1: 5.8,
        l0: 600,
        l1: 1100,
        cols: K,
        s0: 4,
        s1: 9,
        dr: 0.97,
        g: -0.02
      });
      E.rg(bx, by, 14 + T * 8, 420, C);
      E.flash('#ffcc66', 0.35 + T * 0.12, 300);
      E.shake(2 + T * 2.5, 320);
    };
    if (T == 1) {
      const x0 = ax + dx * 0.12,
        y0 = ay + dy * 0.12;
      E.o(0, 260, u => {
        E.glow(() => {
          E.disc(x0, y0, 2 + u * 4, C[3]);
          E.disc(x0, y0, 1 + u * 3, C[2]);
          E.disc(x0, y0, u * 1.8, C[0]);
        });
        if (Math.random() < 0.6) {
          const a = rr(0, 6.28);
          E.P({
            x: x0 + Math.cos(a) * 11,
            y: y0 + Math.sin(a) * 11,
            vx: -Math.cos(a) * 0.7,
            vy: -Math.sin(a) * 0.7,
            life: 240,
            cols: C,
            s0: 3,
            s1: 1,
            glow: 1
          });
        }
      });
      await E.wait(240);
      E.o(0, 400, u => {
        const t = eIn(u * 0.92 + 0.08),
          x = lerp(x0, bx, t),
          y = lerp(y0, by, t);
        E.glow(() => {
          E.disc(x, y, 7 + rr(0, 1), C[4]);
          E.disc(x, y, 5.5, C[3]);
          E.disc(x, y, 3.8, C[2]);
          E.disc(x, y, 2, C[0]);
        });
        for (let i = 0; i < 2; i++)
          E.P({
            x: x + rr(-1, 1),
            y: y + rr(-1, 1),
            vx: rr(-0.2, 0.2) - (dx / L) * 0.2,
            vy: rr(-0.5, 0) - 0.1,
            life: rr(260, 450),
            cols: C,
            s0: 5,
            s1: 1,
            glow: 1
          });
      });
      await E.wait(400);
      boom(26, 3.4);
      await E.wait(420);
    } else if (T == 2) {
      E.o(0, 300, u => {
        for (let i = 0; i < 2; i++)
          E.P({
            x: ax + rr(-8, 8),
            y: ay + rr(-4, 6),
            vy: -rr(0.4, 1.3),
            life: 350,
            cols: C,
            s0: 4,
            s1: 1,
            glow: 1
          });
      });
      E.dim('#ff6a1a', 0.2, 1500);
      await E.wait(260);
      E.o(0, 620, u => {
        const t = eOut(u),
          x = lerp(ax, bx, t),
          y = lerp(ay, by, t);
        for (let i = 0; i < E.n(7); i++) {
          const o = rr(-16, 16) * (0.4 + t);
          E.P({
            x: x + px * o,
            y: y + py * o,
            vx: (dx / L) * rr(0.3, 1) + rr(-0.2, 0.2),
            vy: (dy / L) * rr(0.3, 1) - rr(0.2, 0.9),
            life: rr(300, 520),
            cols: C,
            s0: rr(4, 7),
            s1: 1,
            glow: 0
          });
        }
      });
      await E.wait(560);
      E.hit();
      for (const o of [-12, 0, 12])
        E.o(o * 10 + 120, 520, u => {
          for (let i = 0; i < E.n(3); i++)
            E.P({
              x: bx + o + rr(-4, 4),
              y: by + 10,
              vx: rr(-0.3, 0.3),
              vy: -rr(1.3, 3.2),
              ay: 0.02,
              life: rr(300, 600),
              cols: C,
              s0: rr(5, 8),
              s1: 1,
              glow: 1
            });
        });
      boom(40, 4);
      await E.wait(900);
    } else {
      const sx = bx,
        sy = Math.max(16, by - E.ch * 0.26);
      E.dim('#200808', 0.5, 1900);
      E.o(0, 780, u => {
        const r = 2 + eOut(u) * 13;
        E.glow(() => {
          E.disc(sx, sy, r + 2, C[4]);
          E.disc(sx, sy, r, C[3]);
          E.disc(sx, sy, r * 0.7, C[1]);
          E.disc(sx, sy, r * 0.4, C[0]);
          for (let i = 0; i < 12; i++) {
            const a = (i / 12) * 6.283 + u * 5,
              r0 = r + 2,
              r1 = r + 3 + (i % 2 ? 4 : 9) * u;
            E.line(
              sx + Math.cos(a) * r0,
              sy + Math.sin(a) * r0,
              sx + Math.cos(a) * r1,
              sy + Math.sin(a) * r1,
              2,
              i % 2 ? C[2] : C[1]
            );
          }
        });
        if (Math.random() < 0.9) {
          const a = rr(0, 6.28),
            d = rr(26, 38);
          E.P({
            x: sx + Math.cos(a) * d,
            y: sy + Math.sin(a) * d,
            vx: -Math.cos(a) * 1.6,
            vy: -Math.sin(a) * 1.6,
            life: 420,
            cols: C,
            s0: 3,
            s1: 1,
            glow: 1
          });
        }
      });
      await E.wait(900);
      E.o(0, 260, u => {
        const t = eIn(u),
          y = lerp(sy, by, t);
        E.glow(() => {
          E.disc(sx, y, 15, C[3]);
          E.disc(sx, y, 11, C[1]);
          E.disc(sx, y, 6, C[0]);
        });
        for (let i = 0; i < 4; i++)
          E.P({ x: sx + rr(-8, 8), y: y - 6, vy: -rr(0.3, 1), life: 300, cols: C, s0: 5, s1: 1, glow: 1 });
      });
      await E.wait(250);
      E.hit(1.6);
      E.flash('#ffffff', 0.95, 420);
      E.shake(11, 520);
      E.o(0, 520, u => {
        const r = 4 + eOut(u) * 40;
        E.g.globalAlpha = u < 0.6 ? 1 : 1 - (u - 0.6) / 0.4;
        E.glow(() => {
          E.disc(bx, by, r, C[4]);
          E.disc(bx, by, r * 0.8, C[3]);
          E.disc(bx, by, r * 0.55, u < 0.3 ? C[0] : C[1]);
          E.disc(bx, by, r * 0.3, C[0]);
        });
        E.g.globalAlpha = 1;
      });
      E.rg(bx, by, 48, 600, C);
      E.rg(bx, by, 34, 500, C, 120);
      E.burst(bx, by, 70, { v0: 1, v1: 5.5, g: 0.04, l0: 600, l1: 1200, cols: C, s0: 5, s1: 1, glow: 1 });
      E.burst(bx, by, 24, {
        v0: 0.3,
        v1: 1.6,
        a0: 3.6,
        a1: 5.8,
        l0: 900,
        l1: 1500,
        cols: K,
        s0: 5,
        s1: 12,
        dr: 0.97,
        g: -0.02
      });
      await E.wait(1300);
    }
  },
  async E(E, A, B, T) {
    const C = FXP.E,
      [ax, ay] = A,
      [bx, by] = B,
      dx = bx - ax,
      dy = by - ay,
      L = Math.hypot(dx, dy) || 1,
      dir = dx >= 0 ? 1 : -1;
    const splash = (n, R) => {
      E.hit();
      E.burst(bx, by, n, {
        v0: 0.8,
        v1: R,
        a0: 3.6,
        a1: 5.85,
        g: 0.13,
        l0: 500,
        l1: 900,
        cols: C,
        s0: 4,
        s1: 1.5
      });
      E.burst(bx, by, n / 3, {
        v0: 0.3,
        v1: 1.4,
        l0: 500,
        l1: 800,
        cols: C,
        s0: 5,
        s1: 9,
        dr: 0.96,
        glow: 0
      });
      E.rg(bx, by, 12 + T * 8, 460, C, 0, 3);
      E.rg(bx, by + 6, 18 + T * 9, 560, C, 100, 4);
      E.flash('#9fd8ff', 0.28 + T * 0.1, 300);
      E.shake(1.5 + T * 2.5, 300);
    };
    const wave = (h, len, dur, off) =>
      E.o(off, dur, u => {
        const f = dir > 0 ? lerp(-10, E.cw + len, u) : lerp(E.cw + 10, -len, u),
          top0 = by + h * 0.35;
        for (let d = 0; d < len; d++) {
          const x = f - d * dir;
          if (x < 0 || x >= E.cw) continue;
          const prof = d < len * 0.18 ? d / (len * 0.18) : 1 - ((d - len * 0.18) / (len * 0.82)) * 0.55,
            ht = h * prof,
            wob = Math.sin(x * 0.35 + E.T * 0.012) * 1.5,
            y0 = top0 - ht + wob;
          E.px(x, y0, 1, 3, C[0]);
          E.px(x, y0 + 3, 1, Math.max(0, ht * 0.18), C[1]);
          const rest = top0 - (y0 + 3 + ht * 0.18);
          for (let y = Math.round(y0 + 3 + ht * 0.18); y < top0 + 6; y++) {
            const band = ((y + Math.round(E.T * 0.02) + x) >> 2) & 1;
            E.px(x, y, 1, 1, band ? C[3] : C[2]);
          }
        }
        if (Math.random() < 0.9) {
          const d = rr(0, len * 0.25);
          E.P({
            x: f - d * dir,
            y: top0 - h + rr(0, 6),
            vx: dir * rr(0.5, 1.5),
            vy: -rr(0.5, 1.6),
            ay: 0.08,
            life: 420,
            cols: C,
            s0: 3,
            s1: 1
          });
        }
      });
    if (T == 1) {
      E.o(0, 200, u => {
        if (Math.random() < 0.8)
          E.P({ x: ax + rr(-8, 8), y: ay + rr(-8, 8), vy: -rr(0.3, 1), life: 300, cols: C, s0: 3, s1: 1.5 });
      });
      await E.wait(150);
      E.o(0, 520, u => {
        const t = eOut(u),
          x = lerp(ax, bx, t),
          y = lerp(ay, by, t) - Math.sin(Math.PI * t) * E.ch * 0.1;
        E.disc(x, y, 3.6, C[3]);
        E.disc(x, y, 2.4, C[1]);
        for (let i = 0; i < 4; i++)
          E.P({
            x: x + rr(-2, 2),
            y: y + rr(-2, 2),
            vx: rr(-0.4, 0.4),
            vy: rr(-0.2, 0.5),
            ay: 0.05,
            life: rr(220, 380),
            cols: C,
            s0: 4,
            s1: 1.5
          });
      });
      await E.wait(540);
      splash(24, 3);
      await E.wait(520);
    } else if (T == 2) {
      E.o(0, 260, u => {
        for (let i = 0; i < 2; i++) {
          const a = rr(0, 6.28);
          E.P({
            x: ax + Math.cos(a) * 14,
            y: ay + Math.sin(a) * 14,
            vx: -Math.cos(a) * 0.8,
            vy: -Math.sin(a) * 0.8,
            life: 260,
            cols: C,
            s0: 3,
            s1: 1
          });
        }
      });
      E.dim('#0a2a5a', 0.22, 1500);
      await E.wait(260);
      wave(24, 50, 760, 0);
      await E.wait(640);
      splash(36, 4);
      await E.wait(800);
    } else {
      E.dim('#082050', 0.4, 2000);
      E.o(0, 500, u => {
        for (let i = 0; i < 3; i++) {
          const a = rr(0, 6.28);
          E.P({
            x: ax + Math.cos(a) * 22,
            y: ay + Math.sin(a) * 22,
            vx: -Math.cos(a) * 1.4,
            vy: -Math.sin(a) * 1.4,
            life: 340,
            cols: C,
            s0: 3,
            s1: 1
          });
        }
        E.ring(ax, ay, 16 * (1 - u) + 4, 2, C[2]);
      });
      await E.wait(520);
      wave(30, 70, 820, 0);
      wave(42, 90, 900, 160);
      await E.wait(780);
      E.flash('#bfeaff', 0.6, 500);
      splash(60, 5);
      E.shake(9, 600);
      E.o(0, 900, u => {
        for (let i = 0; i < E.n(4); i++)
          E.P({
            x: rr(0, E.cw),
            y: -4,
            vx: rr(-0.2, 0.2),
            vy: rr(2, 4),
            life: rr(300, 500),
            cols: C,
            s0: 2,
            s1: 1.5,
            shape: 'ln',
            len: 5
          });
      });
      await E.wait(1000);
    }
  },
  async P(E, A, B, T) {
    const C = FXP.P,
      [ax, ay] = A,
      [bx, by] = B,
      dx = bx - ax,
      dy = by - ay,
      L = Math.hypot(dx, dy) || 1,
      px = -dy / L,
      py = dx / L;
    const crash = (n, R) => {
      E.hit();
      E.burst(bx, by, n, {
        v0: 0.6,
        v1: R,
        g: 0.03,
        dr: 0.96,
        l0: 600,
        l1: 1100,
        cols: C,
        s0: 3,
        s1: 2,
        shape: 'leaf',
        vr: 0.4
      });
      E.burst(bx, by, n / 2, { v0: 0.3, v1: 2, l0: 500, l1: 900, cols: C, s0: 2, s1: 1, glow: 1 });
      E.rg(bx, by, 12 + T * 7, 420, C);
      E.flash('#aef27a', 0.25 + T * 0.08, 300);
      E.shake(2 + T * 2.2, 300);
    };
    if (T == 1) {
      E.o(0, 700, u => {
        let ph, len;
        if (u < 0.3) {
          ph = u / 0.3;
          len = eOut(ph);
        } else if (u < 0.5) {
          len = 1.03;
        } else {
          len = 1 - eIn((u - 0.5) / 0.5);
        }
        const amp = u < 0.3 ? 16 * (1 - ph) : u < 0.5 ? -14 * Math.sin(((u - 0.3) / 0.2) * Math.PI) : 0,
          mx = lerp(ax, bx, 0.5) + px * amp,
          my = lerp(ay, by, 0.5) + py * amp,
          pts = [];
        for (let i = 0; i <= 16; i++) {
          const t = (i / 16) * len,
            x = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx,
            y = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by;
          pts.push([x, y]);
        }
        E.poly(pts, 4, C[4]);
        E.poly(pts, 2, C[3]);
        E.poly(
          pts.map(p => [p[0] - 0.5, p[1] - 1]),
          1,
          C[1]
        );
        const tp = pts[pts.length - 1];
        E.disc(tp[0], tp[1], 2.4, C[2]);
        E.px(tp[0] - 1, tp[1] - 1, 2, 2, C[0]);
      });
      await E.wait(220);
      E.o(0, 260, u => {
        const a = -0.6;
        E.glow(() => {
          E.line(bx - 12 * (1 - u * 0.3), by - 9, bx + 12, by + 9, 2, '#fff');
          E.line(bx + 12, by - 9, bx - 12, by + 9, 2, C[1]);
        });
      });
      crash(18, 3);
      await E.wait(560);
    } else if (T == 2) {
      E.o(0, 260, u => {
        for (let i = 0; i < 2; i++)
          E.P({
            x: ax + rr(-8, 8),
            y: ay + rr(-8, 8),
            vy: -rr(0.3, 1),
            life: 300,
            cols: C,
            s0: 2,
            s1: 1,
            glow: 1
          });
      });
      E.dim('#10401c', 0.2, 1500);
      await E.wait(220);
      let th = 0;
      E.o(0, 700, u => {
        const t = eOut(u),
          x = lerp(ax, bx, t),
          y = lerp(ay, by, t);
        E.glow(() => E.disc(x, y, 5 + u * 3, 'rgba(80,200,90,.35)'));
        for (let i = 0; i < E.n(3); i++) {
          th += 0.9;
          const R = rr(5, 13),
            a = th;
          E.P({
            x: x + Math.cos(a) * R,
            y: y + Math.sin(a) * R * 0.8,
            vx: -Math.sin(a) * 1.4 + (dx / L) * 0.9,
            vy: Math.cos(a) * 1.4 + (dy / L) * 0.9,
            life: rr(280, 460),
            cols: C,
            s0: rr(2.5, 4),
            s1: 2,
            shape: 'leaf',
            vr: 0.45
          });
        }
      });
      await E.wait(680);
      crash(34, 4);
      await E.wait(800);
    } else {
      E.dim('#0a3010', 0.45, 2000);
      const x0 = ax + dx * 0.1,
        y0 = ay + dy * 0.1;
      E.o(0, 650, u => {
        const r = 1.5 + eOut(u) * 8;
        E.glow(() => {
          E.disc(x0, y0, r + 2, 'rgba(60,170,80,.5)');
          E.disc(x0, y0, r, C[2]);
          E.disc(x0, y0, r * 0.6, C[1]);
          E.disc(x0, y0, r * 0.3, C[0]);
        });
        for (let i = 0; i < 2; i++) {
          const a = rr(0, 6.28),
            d = rr(22, 34);
          E.P({
            x: x0 + Math.cos(a) * d,
            y: y0 + Math.sin(a) * d,
            vx: -Math.cos(a) * 1.7,
            vy: -Math.sin(a) * 1.7,
            life: 380,
            cols: C,
            s0: 3,
            s1: 1,
            glow: 1
          });
        }
      });
      await E.wait(680);
      E.shake(3, 700);
      const ex = ax + (dx / L) * (L + 40),
        ey = ay + (dy / L) * (L + 40);
      E.o(0, 640, u => {
        const w = (u < 0.12 ? u / 0.12 : u > 0.8 ? (1 - u) / 0.2 : 1) * (1 + Math.sin(E.T * 0.05) * 0.12);
        E.glow(() => {
          E.line(x0, y0, ex, ey, Math.round(11 * w), 'rgba(40,160,70,.55)');
          E.line(x0, y0, ex, ey, Math.round(8 * w), C[3]);
          E.line(x0, y0, ex, ey, Math.round(5 * w), C[1]);
          E.line(x0, y0, ex, ey, Math.max(1, Math.round(2 * w)), '#fff');
          E.disc(x0, y0, 6 * w, C[1]);
          E.disc(bx, by, 7 * w + 2, C[1]);
          E.disc(bx, by, 4 * w, '#fff');
        });
        const t = rr(0, 1);
        E.P({
          x: lerp(x0, bx, t) + px * rr(-5, 5),
          y: lerp(y0, by, t) + py * rr(-5, 5),
          vx: px * rr(-0.8, 0.8),
          vy: py * rr(-0.8, 0.8) - 0.3,
          life: 350,
          cols: C,
          s0: 2,
          s1: 1,
          glow: 1
        });
        if (Math.random() < 0.5)
          E.P({
            x: bx,
            y: by,
            vx: rr(-2, 2),
            vy: rr(-2.5, 0.5),
            life: 500,
            cols: C,
            s0: 3,
            s1: 2,
            shape: 'leaf',
            vr: 0.4
          });
      });
      await E.wait(160);
      E.hit(1.6);
      E.rg(bx, by, 40, 600, C);
      E.rg(bx, by, 28, 500, C, 150);
      E.flash('#e8ffc8', 0.7, 500);
      E.shake(8, 520);
      crash(54, 5);
      await E.wait(1000);
    }
  },
  async V(E, A, B, T) {
    const C = FXP.V,
      [ax, ay] = A,
      [bx, by] = B,
      dx = bx - ax,
      dy = by - ay,
      L = Math.hypot(dx, dy) || 1,
      ux = dx / L,
      uy = dy / L,
      px = -uy,
      py = ux;
    const gust = (n, R) => {
      E.hit(T > 1 ? 1.4 : 1);
      E.burst(bx, by, n, {
        v0: 1,
        v1: R,
        l0: 300,
        l1: 600,
        cols: C,
        s0: 2,
        s1: 1,
        shape: 'ln',
        len: 9,
        dr: 0.96,
        glow: 1
      });
      E.burst(bx, by + 8, n / 3, {
        v0: 0.3,
        v1: 1.6,
        a0: 3.1,
        a1: 6.2,
        l0: 600,
        l1: 900,
        cols: FXP.D,
        s0: 4,
        s1: 9,
        dr: 0.96
      });
      E.rg(bx, by, 12 + T * 8, 420, C);
      E.rg(bx, by, 8 + T * 5, 360, C, 110);
      E.flash('#e8f8ff', 0.22 + T * 0.1, 260);
      E.shake(1.5 + T * 2.5, 300);
    };
    if (T == 1) {
      for (let i = 0; i < 3; i++) {
        const o = i * 150,
          sx = rr(-6, 6),
          sy = rr(-6, 6);
        E.o(o, 220, u => {
          const a = -0.9 + i * 0.9,
            x = bx + sx,
            y = by + sy,
            l = lerp(2, 12, eOut(u));
          E.glow(() => {
            E.line(
              x - Math.cos(a) * l,
              y - Math.sin(a) * l,
              x + Math.cos(a) * l,
              y + Math.sin(a) * l,
              2,
              '#fff'
            );
            E.line(
              x - Math.cos(a) * l * 0.5,
              y - Math.sin(a) * l * 0.5,
              x + Math.cos(a) * l * 0.5,
              y + Math.sin(a) * l * 0.5,
              1,
              C[2]
            );
          });
        });
        E.o(o, 10, u => {});
        setTimeout(
          () => {
            if (E.on)
              E.burst(bx + sx, by + sy, 6, {
                v0: 0.8,
                v1: 2.4,
                l0: 250,
                l1: 420,
                cols: C,
                s0: 2,
                s1: 1,
                glow: 1
              });
          },
          o / E.sp + 90
        );
      }
      await E.wait(100);
      E.hit();
      E.burst(bx, by - 4, 6, {
        v0: 0.2,
        v1: 1,
        g: 0.03,
        l0: 700,
        l1: 1100,
        cols: C,
        s0: 4,
        s1: 3,
        shape: 'leaf',
        vr: 0.2
      });
      E.flash('#e8f8ff', 0.2, 260);
      await E.wait(560);
    } else if (T == 2) {
      E.o(0, 200, u => {
        for (let i = 0; i < 3; i++)
          E.P({
            x: ax + rr(-8, 8),
            y: ay + rr(-8, 8),
            vx: -ux * 0.8,
            vy: -uy * 0.8,
            life: 240,
            cols: C,
            s0: 2,
            s1: 1,
            shape: 'ln',
            len: 7
          });
      });
      await E.wait(200);
      E.o(0, 640, u => {
        const t = eOut(u),
          x = lerp(ax, bx, t),
          y = lerp(ay, by, t);
        for (let i = 0; i < E.n(4); i++) {
          const o = rr(-16, 16);
          E.P({
            x: x + px * o - ux * 8,
            y: y + py * o - uy * 8,
            vx: ux * rr(4, 6) + px * Math.sin(E.T * 0.02 + o) * 0.6,
            vy: uy * rr(4, 6) + py * Math.sin(E.T * 0.02 + o) * 0.6,
            life: rr(120, 260),
            cols: C,
            s0: 2,
            s1: 1,
            shape: 'ln',
            len: rr(8, 18),
            nf: 0,
            glow: 1
          });
        }
        E.glow(() => {
          for (const s of [-1, 1]) {
            for (let a = -0.8; a <= 0.8; a += 0.1) {
              const R = 15;
              E.px(
                x - ux * (Math.cos(a) * R - 4) + px * Math.sin(a) * R * s * 0.9,
                y - uy * (Math.cos(a) * R - 4) + py * Math.sin(a) * R * s * 0.9,
                2,
                2,
                '#fff'
              );
            }
          }
        });
      });
      await E.wait(540);
      gust(26, 4.5);
      await E.wait(700);
    } else {
      E.dim('#203040', 0.35, 2100);
      E.o(0, 300, u => {
        for (let i = 0; i < 4; i++)
          E.P({
            x: ax + rr(-10, 10),
            y: ay + rr(-10, 10),
            vx: ux * rr(1, 3),
            vy: uy * rr(1, 3),
            life: 260,
            cols: C,
            s0: 2,
            s1: 1,
            shape: 'ln',
            len: 10,
            glow: 1
          });
      });
      await E.wait(300);
      E.o(0, 1000, u => {
        const al = u < 0.12 ? u / 0.12 : u > 0.85 ? (1 - u) / 0.15 : 1;
        E.g.globalAlpha = al;
        for (let j = 0; j < 11; j++) {
          const y = by + 22 - j * 5,
            w = 3 + j * 2.7 + Math.sin(E.T * 0.01 + j) * 1,
            x = bx + Math.sin(E.T * 0.012 + j * 0.55) * 3.5 + (j - 5) * 0.3;
          for (let r = 0; r < 5; r++) {
            const sh = ((r + Math.round(E.T * 0.03) + j) & 3) < 2;
            E.px(x - w + r * 0, y, w * 2, 5, sh ? C[2] : C[1]);
          }
          E.px(x - w, y, 2, 5, C[3]);
          E.px(x + w - 2, y, 2, 5, C[3]);
        }
        E.g.globalAlpha = 1;
        for (let i = 0; i < E.n(3); i++) {
          const j = rr(0, 11),
            w = 3 + j * 2.7,
            a = rr(0, 6.28);
          E.P({
            x: bx + Math.cos(a) * (w + 4),
            y: by + 22 - j * 5,
            vx: -Math.sin(a) * 1.6,
            vy: -0.8,
            life: 380,
            cols: j > 6 ? C : FXP.D,
            s0: rr(2, 3),
            s1: 1,
            shape: Math.random() < 0.4 ? 'leaf' : 'sq',
            vr: 0.4,
            glow: 0
          });
        }
      });
      setTimeout(() => {
        if (E.on) E.hit(1.5);
      }, 500 / E.sp);
      setTimeout(() => {
        if (E.on) E.hit(1.5);
      }, 800 / E.sp);
      E.shake(5, 900);
      await E.wait(1000);
      E.flash('#fff', 0.5, 300);
      gust(50, 6);
      E.shake(9, 500);
      await E.wait(800);
    }
  },
  async N(E, A, B, T) {
    const C = FXP.N,
      [ax, ay] = A,
      [bx, by] = B,
      Y = FXP.Y;
    const star = (R, dur, sp) =>
      E.o(0, dur, u => {
        const r = R * (0.25 + eOut(u) * 0.75);
        E.g.globalAlpha = u < 0.6 ? 1 : 1 - (u - 0.6) / 0.4;
        E.glow(() => {
          for (const [k, c] of [
            [1, C[3]],
            [0.82, C[2]],
            [0.58, C[1]],
            [0.32, '#fff']
          ]) {
            for (let a = 0; a < 6.283; a += 0.07) {
              const rad = r * k * (Math.cos(a * sp) > 0.1 ? 1 : 0.5);
              E.px(bx + Math.cos(a) * rad * 0.9 - 1, by + Math.sin(a) * rad * 0.9 - 1, 2.4, 2.4, c);
            }
          }
        });
        E.g.globalAlpha = 1;
      });
    if (T == 1) {
      await E.wait(180);
      E.hit();
      star(15, 330, 4);
      E.burst(bx, by, 12, {
        v0: 1,
        v1: 3.5,
        l0: 250,
        l1: 450,
        cols: C,
        s0: 2,
        s1: 1,
        shape: 'ln',
        len: 7,
        glow: 1
      });
      E.burst(bx, by + 8, 6, {
        v0: 0.3,
        v1: 1.4,
        a0: 3.1,
        a1: 6.2,
        l0: 500,
        l1: 800,
        cols: FXP.D,
        s0: 4,
        s1: 8,
        dr: 0.96
      });
      E.rg(bx, by, 16, 380, C);
      E.flash('#fff', 0.4, 240);
      E.shake(3, 260);
      await E.wait(520);
    } else if (T == 2) {
      await E.wait(300);
      E.hit(1.4);
      E.flash('#fff', 0.55, 300);
      E.shake(8, 460);
      star(22, 420, 5);
      E.o(0, 700, u => {
        E.g.globalAlpha = 1 - u * u;
        const D = [
          [-0.3, 16],
          [0.9, 13],
          [2, 15],
          [3.3, 12],
          [4.4, 16],
          [5.5, 12]
        ];
        for (const [a, l] of D) {
          const l2 = l * eOut(Math.min(1, u * 2.5));
          const pts = E.zig(
            bx + Math.cos(a) * 4,
            by + Math.sin(a) * 4,
            bx + Math.cos(a) * (4 + l2),
            by + Math.sin(a) * (4 + l2),
            4,
            1.4
          );
          E.poly(pts, 2, '#3a2a20');
          E.poly(pts, 1, '#fff');
        }
        E.g.globalAlpha = 1;
      });
      E.rg(bx, by, 30, 520, C);
      E.rg(bx, by, 20, 420, C, 100);
      E.burst(bx, by + 10, 16, {
        v0: 0.8,
        v1: 3,
        a0: 3.1,
        a1: 6.2,
        g: -0.01,
        l0: 600,
        l1: 1000,
        cols: FXP.D,
        s0: 6,
        s1: 3,
        dr: 0.95
      });
      E.burst(bx, by, 14, { v0: 1, v1: 4, g: 0.1, l0: 500, l1: 800, cols: C, s0: 3, s1: 1, glow: 1 });
      await E.wait(850);
    } else {
      E.dim('#0a0818', 0.55, 1500);
      await E.wait(260);
      E.flash('#fff6a0', 0.45, 160);
      for (let i = 0; i < 3; i++) {
        const x = bx + (i - 1) * 13 + rr(-2, 2),
          t0 = i * 120;
        const bolt = () => E.zig(x + rr(-6, 6), -2, x + rr(-2, 2), by, 9, 6);
        let pts = bolt();
        E.o(t0, 200, u => {
          if (Math.random() < 0.4) pts = bolt();
          E.glow(() => {
            E.poly(pts, 7, 'rgba(255,200,40,.45)');
            E.poly(pts, 4, Y[3]);
            E.poly(pts, 2, Y[1]);
            E.poly(pts, 1, '#fff');
          });
        });
        setTimeout(
          () => {
            if (!E.on) return;
            E.burst(x, by, 10, { v0: 1, v1: 3.5, g: 0.05, l0: 250, l1: 480, cols: Y, s0: 2, s1: 1, glow: 1 });
            E.flash('#fff', 0.7, 200);
            E.rg(x, by, 14, 320, Y);
          },
          (t0 + 60) / E.sp
        );
      }
      await E.wait(140);
      E.hit(1.6);
      E.shake(10, 700);
      E.o(0, 700, u => {
        if (Math.floor(E.T / 60) != Math.floor((E.T - 16) / 60)) {
        }
        for (let i = 0; i < 3; i++) {
          const a = rr(0, 6.28),
            r0 = rr(6, 10),
            p = E.zig(
              bx + Math.cos(a) * r0,
              by + Math.sin(a) * r0,
              bx + Math.cos(a + rr(-0.5, 0.5)) * (r0 + rr(8, 16)),
              by + Math.sin(a + rr(-0.5, 0.5)) * (r0 + rr(8, 16)),
              3,
              2.5
            );
          E.g.globalAlpha = 1 - u * 0.7;
          E.glow(() => {
            E.poly(p, 3, Y[3]);
            E.poly(p, 1, '#fff');
          });
          E.g.globalAlpha = 1;
        }
      });
      E.rg(bx, by, 34, 600, Y);
      E.rg(bx, by, 24, 480, Y, 160);
      E.burst(bx, by, 30, { v0: 1, v1: 5, g: 0.05, l0: 400, l1: 800, cols: Y, s0: 3, s1: 1, glow: 1 });
      await E.wait(900);
    }
  }
};
async function fx(t, toFoe) {
  if (!S.anim || !document.body.animate || document.hidden) return;
  let E = null;
  try {
    const k = t[0],
      T = +t[1] || 1,
      bt = $('bt'),
      fast = SPD < 500,
      hi = Q.fx == 2 ? 1.3 : Q.fx ? 1 : 0.55;
    E = fxEngine(bt, fast, hi);
    if (!E) return;
    const at = bt.querySelector(toFoe ? '.ms' : '.fs'),
      df = bt.querySelector(toFoe ? '.fs' : '.ms');
    if (!at || !df) {
      E.end();
      return;
    }
    E.A = E.ctr(at);
    E.B = E.ctr(df);
    E.at = at;
    E.df = df;
    E.T1 = T;
    const bw = bt.getBoundingClientRect(),
      cs = bw.width / E.cw,
      vx = (E.B[0] - E.A[0]) * cs,
      vy = (E.B[1] - E.A[1]) * cs,
      phys = t == 'N' || t == 'N2' || t == 'V',
      col = { F: '#ff9a3a', E: '#6cc4ff', P: '#8cf27a', V: '#dff6ff', N: '#ffe27a' }[k],
      sp = E.sp;
    if (t == 'N' || t == 'N2' || t == 'V') {
      const f = t == 'N2' ? 0.7 : t == 'N' ? 0.6 : 0.3,
        wind =
          t == 'N2'
            ? [
                { transform: 'none' },
                { transform: `translate(${-vx * 0.12}px,${-vy * 0.12}px) scale(1.04)`, offset: 0.35 },
                { transform: `translate(${vx * f}px,${vy * f}px)`, offset: 0.55 },
                { transform: 'none' }
              ]
            : t == 'N'
              ? [
                  { transform: 'none' },
                  { transform: `translate(${-vx * 0.06}px,${-vy * 0.06}px)`, offset: 0.2 },
                  { transform: `translate(${vx * f}px,${vy * f}px)`, offset: 0.4 },
                  { transform: 'none' }
                ]
              : [
                  { transform: 'none' },
                  { transform: `translate(${vx * 0.25}px,${vy * 0.25}px)`, offset: 0.12 },
                  { transform: 'none', offset: 0.22 },
                  { transform: `translate(${vx * 0.25}px,${vy * 0.25}px)`, offset: 0.34 },
                  { transform: 'none', offset: 0.44 },
                  { transform: `translate(${vx * 0.25}px,${vy * 0.25}px)`, offset: 0.56 },
                  { transform: 'none' }
                ];
      at.animate(wind, { duration: (t == 'N2' ? 600 : t == 'N' ? 420 : 650) / sp, easing: 'ease-in-out' });
    } else {
      const dur = [420, 700, 900][T - 1] / sp;
      at.animate(
        [
          { transform: 'none', filter: 'none' },
          {
            transform: `translate(${-vx * 0.04}px,${-vy * 0.04}px) scale(${1 + T * 0.03})`,
            filter: `drop-shadow(0 0 ${3 + T * 3}px ${col}) brightness(${1 + T * 0.12})`,
            offset: 0.55
          },
          { transform: 'none', filter: 'none' }
        ],
        { duration: dur }
      );
    }
    const lim = setTimeout(() => E.end(), 6000);
    await FXF[k](E, E.A, E.B, T);
    clearTimeout(lim);
    E.end();
    await sleep(fast ? 30 : 140);
  } catch (e) {
    E && E.end();
  }
}
const sfx = (f, d = 0.08) => {
  if (!S.sfx) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(),
      g = ac.createGain();
    o.type = 'square';
    o.frequency.value = f;
    g.gain.value = Math.max(0.0001, 0.012 * S.sfx);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d);
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + d);
  } catch (e) {}
};
