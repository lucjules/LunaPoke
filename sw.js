// Service worker : met le jeu en cache pour qu'il fonctionne hors ligne.
// Stratégie « réseau d'abord » : en ligne, on charge toujours la dernière version (et on met le
// cache à jour) ; hors ligne, ou si le réseau tarde plus de 4 s, on sert la copie en cache.
// La liste FILES doit contenir tous les fichiers du jeu (un test le vérifie).
const CACHE = 'aerelia';
const FILES = [
  './',
  'index.html',
  'css/fonts.css',
  'css/layout.css',
  'css/retro.css',
  'css/menus.css',
  'js/engine/core.js',
  'js/game/species.js',
  'js/game/maps.js',
  'js/game/state.js',
  'js/game/dialog.js',
  'js/game/battle.js',
  'js/game/events.js',
  'js/engine/render2d.js',
  'js/engine/render3d.js',
  'js/engine/buildings3d.js',
  'js/engine/scenery3d.js',
  'js/engine/creatures3d.js',
  'js/engine/humans3d.js',
  'js/game/battle-anim.js',
  'js/game/cinematics.js',
  'js/game/menus.js',
  'js/engine/attack-fx.js',
  'js/game/story.js',
  'js/game/ui.js',
  'js/engine/sprites.js',
  'js/game/items.js',
  'js/acts/act3.js',
  'js/acts/act4.js',
  'js/acts/act5.js',
  'js/engine/audio-weather.js',
  'js/engine/controls.js',
  'js/main.js',
  'fonts/pixelify-sans-latin.woff2',
  'fonts/pixelify-sans-latin-ext.woff2',
  'fonts/press-start-2p-latin.woff2',
  'fonts/press-start-2p-latin-ext.woff2',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(c => c.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(k => k != CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method != 'GET' || new URL(req.url).origin != location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(cache => {
      const net = fetch(req).then(res => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      });
      const late = new Promise(r => setTimeout(r, 4000)).then(() => cache.match(req));
      return Promise.race([net, late.then(r => r || net)]).catch(() =>
        cache.match(req, { ignoreSearch: true }).then(r => r || cache.match('index.html'))
      );
    })
  );
});
