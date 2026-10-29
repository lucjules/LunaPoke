// Outils communs aux tests
const { expect } = require('@playwright/test');

// relève les erreurs JavaScript et les messages d'erreur ou d'avertissement de la console
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push('erreur : ' + e.message));
  page.on('console', m => {
    if (m.type() == 'error' || m.type() == 'warning') errors.push(m.type() + ' : ' + m.text());
  });
  return errors;
}

// ouvre le jeu avec une sauvegarde prête (équipe, carte) et des animations rapides
async function openWithSave(page, { party = [[0, 12]], map = 1, x = 17, y = 60, settings = {} } = {}) {
  await page.goto('/index.html');
  await page.evaluate(
    ({ party, map, x, y, settings }) => {
      localStorage.clear();
      G = newG();
      G.party = party.map(([s, lv]) => mkC(s, lv));
      Object.assign(G, { map, x, y, pn: 'Test', rv: 'Noa', balls: 5, pots: 3 });
      G.f.s = G.f.r = 1;
      save();
      Object.assign(S, { anim: 0, spd: 2, mus: 0 }, settings);
      saveS();
      // évite le test de performance (variable selon la machine)
      localStorage.setItem(
        'aerelia_bench',
        JSON.stringify({
          v: 1,
          dpr: devicePixelRatio,
          w: screen.width,
          n: 100,
          t: 2,
          cores: 8,
          mem: 8,
          coarse: false
        })
      );
    },
    { party, map, x, y, settings }
  );
  await page.goto('/index.html');
  await page.click('#go');
  await page.waitForFunction(() => $('ti').style.display == 'none');
}

// joue un combat jusqu'au bout : A sur les messages, première option des menus
async function playBattle(page, start) {
  await page.evaluate(start => {
    window.__res = null;
    SPD = 20;
    eval(start).then(r => (window.__res = r));
  }, start);
  for (let i = 0; i < 600; i++) {
    const s = await page.evaluate(() => ({
      res: window.__res,
      mn: $('mn').querySelectorAll('button').length,
      ch: $('ch').style.display == 'flex'
    }));
    if (s.res) return s.res;
    if (s.ch) await page.evaluate(() => $('ch').querySelector('button').click());
    else if (s.mn)
      await page.evaluate(() => {
        const bs = $('mn').querySelectorAll('button');
        // « Combat », puis la dernière attaque (la plus forte)
        bs[bs[0].textContent == 'Combat' ? 0 : Math.max(0, bs.length - 2)].click();
      });
    else await page.keyboard.press('z');
    await page.waitForTimeout(30);
  }
  throw new Error('le combat ne se termine pas');
}

module.exports = { expect, watchErrors, openWithSave, playBattle };
