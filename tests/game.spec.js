// Tests de bout en bout : le jeu se lance, se joue et se sauvegarde sans erreur
const fs = require('fs');
const path = require('path');
const { test } = require('@playwright/test');
const { expect, watchErrors, openWithSave, playBattle } = require('./helpers');

const ROOT = path.join(__dirname, '..');

test('chaque fichier chargé par la page existe et est mis en cache par le service worker', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const used = [...html.matchAll(/(?:href|src)="([^"#:]+)"/g)].map(m => m[1]);
  for (const f of used) {
    expect(fs.existsSync(path.join(ROOT, f)), f + ' existe').toBeTruthy();
    expect(sw.includes(`'${f}'`), f + ' est dans sw.js').toBeTruthy();
  }
  for (const f of [...sw.matchAll(/^\s+'([^']+)',?$/gm)].map(m => m[1]).filter(f => f != './'))
    expect(fs.existsSync(path.join(ROOT, f)), f + ' (sw.js) existe').toBeTruthy();
});

test('écran titre : aucune erreur, polices locales, aucune requête externe', async ({ page }) => {
  const errors = watchErrors(page);
  const external = [];
  await page.route(
    u => !u.href.startsWith('http://localhost'),
    r => {
      external.push(r.request().url());
      r.abort();
    }
  );
  await page.goto('/index.html');
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => [SP.length, maps.length])).toEqual([100, 64]);
  expect(await page.evaluate(() => document.fonts.check('16px "Press Start 2P"'))).toBeTruthy();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('nouvelle partie : intro, noms, choix du starter', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/index.html');
  await page.click('#go');
  for (let i = 0; i < 200 && !(await page.evaluate(() => G.pn && G.rv && !busy)); i++) {
    if (await page.$('#lkov')) await page.click('#lkov button:text("Valider")');
    await page.keyboard.press('z');
    await page.waitForTimeout(100);
  }
  expect(await page.evaluate(() => [G.pn, G.rv])).toEqual(['Lune', 'Noa']);
  await page.evaluate(() => {
    go(8, 7, 8);
    lab();
  });
  for (let i = 0; i < 100 && !(await page.evaluate(() => G.f.s)); i++) {
    await page.keyboard.press('z');
    await page.waitForTimeout(100);
  }
  expect(await page.evaluate(() => [G.party.length, G.balls, G.pots, G.v])).toEqual([1, 8, 4, 2]);
  expect(errors).toEqual([]);
});

test('combat sauvage et combat de dresseur jusqu’au bout', async ({ page }) => {
  const errors = watchErrors(page);
  await openWithSave(page, {
    party: [
      [0, 20],
      [10, 20]
    ]
  });
  expect(['win', 'lose', 'run', 'caught']).toContain(
    await playBattle(page, 'battle([mkC(3, 8)], null, true)')
  );
  expect(['win', 'lose']).toContain(
    await playBattle(page, "battle([mkC(5, 12), mkC(6, 12)], 'Dresseur', false)")
  );
  expect(await page.evaluate(() => G.party.every(c => !c.bs && !c.st))).toBeTruthy();
  expect(errors).toEqual([]);
});

test('combat double', async ({ page }) => {
  const errors = watchErrors(page);
  await openWithSave(page, {
    party: [
      [0, 30],
      [10, 30],
      [11, 30]
    ]
  });
  expect(['win', 'lose']).toContain(
    await playBattle(page, "battle([mkC(28, 20), mkC(64, 20), mkC(3, 20)], 'Duo', false, true)")
  );
  expect(errors).toEqual([]);
});

test('chaque attaque propre produit son effet', async ({ page }) => {
  const errors = watchErrors(page);
  await openWithSave(page, { party: [[0, 25]] });
  const r = await page.evaluate(async () => {
    SPD = 1;
    B = { f: [mkC(14, 25)], fi: 0, m: 0, run: 1, t: null };
    $('bt').style.display = 'flex';
    const out = {};
    for (const k of new Set(SIG)) {
      const a = mkC(SIG.indexOf(k), 25),
        d = mkC(14, 25);
      a.hp = Math.floor(a.mh * 0.4);
      const h0 = a.hp;
      B.f = [d];
      // le hasard est forcé pour que les effets à pourcentage se déclenchent
      const rnd = Math.random;
      Math.random = () => 0.01;
      await attack(a, d, k);
      Math.random = rnd;
      out[k] = { healed: a.hp > h0, hurt: d.hp < d.mh, st: d.st || '', a: a.bs || {}, d: d.bs || {} };
    }
    $('bt').style.display = 'none';
    return out;
  });
  for (const k in r) {
    const e = await page.evaluate(k => ({ p: MV[k][1], ...(MVE[k] || {}) }), k);
    if (e.p) expect(r[k].hurt, k + ' fait des dégâts').toBeTruthy();
    if (e.heal || e.drain) expect(r[k].healed, k + ' soigne').toBeTruthy();
    if (e.st) expect(r[k].st, k + ' inflige un statut').toBe(e.st);
    if (e.a || e.d) {
      const bs = e.me ? r[k].a : r[k].d;
      expect(bs[e.a ? 'a' : 'd'], k + ' modifie une caractéristique').toBe(e.a || e.d);
    }
  }
  expect(errors).toEqual([]);
});

test('menus, bestiaire, carte et paramètres s’ouvrent sans erreur', async ({ page }) => {
  const errors = watchErrors(page);
  await openWithSave(page);
  for (const f of [
    'hub',
    'team',
    'bag',
    'dex',
    'quests',
    'story',
    'achievements',
    'settings',
    'pcBox',
    'guideBtn'
  ])
    await page.evaluate(f => {
      busy = false;
      $('pn').style.display = 'none';
      window[f]();
    }, f);
  const undef = await page.evaluate(() => {
    for (let i = 0; i < SP.length; i++) {
      dexInfo(i);
      if (/undefined|NaN/.test($('pn').innerText)) return i;
    }
    return -1;
  });
  expect(undef, 'aucune fiche du bestiaire avec « undefined »').toBe(-1);
  for (const t of [0, 1])
    await page.evaluate(t => {
      busy = false;
      $('pn').style.display = 'none';
      worldmap(t);
    }, t);
  expect(errors).toEqual([]);
});

test('toutes les cartes s’affichent, en 2D et en 3D', async ({ page }) => {
  const errors = watchErrors(page);
  await openWithSave(page);
  for (const v3 of [0, 1])
    for (let m = 0; m < 64; m++) {
      await page.evaluate(
        ([m, v3]) => {
          S.v3 = v3;
          const q = maps[m];
          go(m, (q.sp || [7, 8])[0], (q.sp || [7, 8])[1]);
        },
        [m, v3]
      );
      await page.waitForTimeout(v3 ? 60 : 30);
    }
  expect(errors).toEqual([]);
});

test('sprites et modèles 3D de toutes les créatures ; toutes capturables', async ({ page }) => {
  const errors = watchErrors(page);
  await openWithSave(page);
  const r = await page.evaluate(() => {
    for (let i = 0; i < SP.length; i++) {
      spr(i, 64);
      spr(i, 64, 1);
      if (!mdFor(i, 't' + i, 1000, 0, 0.1, { R: 64 })) return 'pas de modèle 3D : ' + i;
    }
    // sauvages, pêche, événements, starters, puis évolutions
    const R = new Set([16, 43, 50, 98, 99, 0, 1, 2, 6, 10, 23, 18, 28, 35, 39, 44]);
    maps.forEach(m => m.e && m.e.s.forEach(s => R.add(s)));
    for (let ch = 1; ch;) {
      ch = 0;
      SP.forEach((s, i) => {
        if (R.has(i))
          for (const t of [s.ev && s.ev[1], s.se && s.se[1]])
            if (t != null && !R.has(t)) {
              R.add(t);
              ch = 1;
            }
      });
    }
    return SP.map((s, i) => (R.has(i) ? null : s.n)).filter(Boolean);
  });
  expect(r).toEqual([]);
  expect(errors).toEqual([]);
});

test('une sauvegarde importée piégée est nettoyée', async ({ page }) => {
  const errors = watchErrors(page);
  await openWithSave(page);
  const r = await page.evaluate(() => {
    busy = false;
    settings();
    const g = JSON.parse(JSON.stringify(G));
    g.pn = '<img src=x onerror=alert(1)>';
    g.party[0].nick = '"><b>x';
    g.party.push({ s: 'abc' }, { s: 999, lv: 5, hp: 5, mh: 5 });
    $('sv').value = JSON.stringify(g);
    $('im').click();
    toTitle();
    return {
      pn: G.pn,
      nick: G.party[0].nick,
      n: G.party.length,
      slots: $('slots').innerHTML.includes('<img src=x')
    };
  });
  expect(r).toEqual({ pn: 'img src=x', nick: 'bx', n: 1, slots: false });
  expect(errors).toEqual([]);
});

test('une sauvegarde abîmée n’empêche pas le démarrage', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/index.html');
  await page.evaluate(() => {
    localStorage.clear();
    const g = newG();
    // espèce inconnue (999) à côté d'une créature des actes III-IV (ajoutées après state.js)
    g.party = [mkC(0, 10), { s: 999, lv: 5, hp: 5, mh: 5 }, mkC(SP.length - 1, 30)];
    g.f.s = 1;
    G = g; // le jeu sauvegarde la partie en cours en quittant la page
    localStorage.setItem('aerelia', JSON.stringify(g));
    localStorage.setItem('aerelia_2', JSON.stringify({ party: [{ s: 999, lv: 5 }] }));
    localStorage.setItem('aerelia_3', '42');
  });
  await page.reload();
  await page.waitForTimeout(500);
  expect(
    await page.evaluate(() => [G.party.map(c => c.s), $('slots').querySelectorAll('.sl').length])
  ).toEqual([[0, 99], 3]);
  expect(errors).toEqual([]);
});

test('application installable : service worker et jeu hors ligne', async ({ page, context }) => {
  await page.goto('/index.html');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForTimeout(500);
  await context.setOffline(true);
  await page.reload();
  expect(await page.evaluate(() => SP.length)).toBe(100);
  await context.setOffline(false);
});

test('intérieurs : chaque personnage reste accessible depuis la porte', async ({ page }) => {
  await openWithSave(page);
  const blocked = await page.evaluate(() =>
    maps
      .map((m, mi) => {
        if (!m.in || m.k == 'cave' || m.k == 'secret') return null;
        const g = m.g,
          D = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
          ],
          seen = new Set(['7,8']),
          q = [[7, 8]];
        while (q.length) {
          const [x, y] = q.shift();
          if (D.some(([a, b]) => g[y + b]?.[x + a] == 'N')) return null;
          for (const [a, b] of D) {
            const nx = x + a,
              ny = y + b,
              c = g[ny]?.[nx];
            if (!c || seen.has(nx + ',' + ny) || SOLID.includes(c) || c == 'X') continue;
            seen.add(nx + ',' + ny);
            q.push([nx, ny]);
          }
        }
        return m.n;
      })
      .filter(Boolean)
  );
  expect(blocked).toEqual([]);
});

test('musique : les morceaux sont complets et ne saturent pas', async ({ page }) => {
  await page.goto('/index.html');
  const r = await page.evaluate(async () => {
    const out = [];
    for (const k in TRK) {
      const T = TRK[k],
        st = 60 / T.bpm / 4,
        ctx = new OfflineAudioContext(1, Math.ceil(22050 * (32 * st + 1)), 22050),
        g = ctx.createGain();
      g.gain.value = 0.6; // volume maximum
      g.connect(ctx.destination);
      for (let s = 0; s < 32; s++) musStep(ctx, g, T, s, 0.05 + s * st);
      const d = (await ctx.startRendering()).getChannelData(0);
      let pk = 0;
      for (const v of d) pk = Math.max(pk, Math.abs(v));
      out.push([k, T.notes.length, pk < 0.95, pk > 0.02]);
    }
    return out;
  });
  for (const [k, n, noClip, audible] of r) {
    expect(n, k + ' : 8 mesures de 8 croches').toBe(64);
    expect(noClip, k + ' ne sature pas').toBeTruthy();
    expect(audible, k + ' est audible').toBeTruthy();
  }
});
