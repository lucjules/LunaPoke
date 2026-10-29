# Aérélia — La légende des Éclats lunaires

Jeu d'aventure et de capture de créatures au style rétro (console portable), écrit en HTML, CSS et JavaScript, sans dépendance ni étape de build.

## Lancer le jeu

En ligne (une fois le dépôt public et GitHub Pages activé) : https://lucjules.github.io/LunaPoke/ — sur téléphone, le menu du navigateur propose « Ajouter à l'écran d'accueil » pour l'installer comme une application, qui marche ensuite hors ligne.

En local : 
Ouvrir `index.html` dans un navigateur (ordinateur ou mobile). Tout est inclus, polices comprises (dossier `fonts/`) : le jeu fonctionne aussi hors ligne.

## Contrôles

| Action | Clavier | Tactile |
| --- | --- | --- |
| Se déplacer | Flèches / WASD | Croix directionnelle |
| A (valider, parler) | Z / Espace | Bouton A |
| B (retour ; maintenu = courir) | X | Bouton B |
| START (menu) | Entrée | START |
| SELECT | P | SELECT |

## Contenu

- 100 espèces de créatures, 5 types (Feu, Eau, Plante, Vol, Normal) avec évolutions
- 64 cartes : villes, routes, forêt, grotte, plage, intérieurs, Ligue…
- Histoire en plusieurs actes (dont l'Aube dorée, l'archipel des étoiles, les Terres d'Aube)
- Combats au tour par tour, arènes, cinématiques, personnalisation du héros
- Vue 2D en tuiles et mode 3D (raycasting) activable avec le bouton « 3D »
- 3 emplacements de sauvegarde (stockés dans le `localStorage` du navigateur)
- Réglage automatique de la qualité graphique selon les performances de l'appareil

## Organisation du code

```
index.html              page du jeu : structure HTML et ordre de chargement
fonts/                  polices Pixelify Sans et Press Start 2P (licence SIL OFL)
css/
  fonts.css             déclaration des polices
  layout.css            mise en page, croix directionnelle, boutons, mobile
  retro.css             style « console portable » : dialogues, menus, écran titre, combat
  menus.css             finitions des menus et écran des sauvegardes
js/
  engine/               moteur (graphismes, son, contrôles)
    core.js             constantes, qualité graphique auto, performances
    render2d.js         rendu 2D en tuiles
    render3d.js         vue 3D à la première personne (raycasting)
    buildings3d.js      bâtiments et accessoires en vraie 3D
    scenery3d.js        décor 3D, ambiance, arène de combat 3D
    creatures3d.js      modèles 3D des créatures
    humans3d.js         personnages humains en 3D
    attack-fx.js        particules et effets des attaques, bruitages
    sprites.js          générateur de sprites pixel-art
    audio-weather.js    météo et musique
    controls.js         clavier, croix, boutons A/B/START/SELECT
  game/                 règles et contenu du jeu
    species.js          espèces de base, attaques, types
    maps.js             construction des cartes
    state.js            état de la partie, sauvegarde, chargement
    dialog.js           dialogues et choix
    battle.js           système de combat
    events.js           événements de la carte, dresseurs, arènes
    battle-anim.js      animations de combat
    cinematics.js       cinématiques, intro, boucle d'affichage
    menus.js            équipe, bestiaire, quêtes des habitants
    story.js            guide, histoire, quêtes annexes
    ui.js               menu, carte du monde, paramètres, succès, PC, Ligue
    items.js            objets, sac, boutique
  acts/                 actes III à V (nouvelles zones, espèces, arènes)
  main.js               démarrage
```

Les fichiers sont de simples scripts (pas de modules) qui partagent les mêmes variables globales. **L'ordre des balises `<script>` dans `index.html` compte** : un fichier peut utiliser ce que définissent les fichiers chargés avant lui. Les fonctions des fichiers suivants restent utilisables dans du code exécuté plus tard (pendant le jeu), mais pas au moment du chargement.

Le code est mis en forme avec [Prettier](https://prettier.io) (réglages dans `.prettierrc.json`) : `npx prettier --write "js/**/*.js" "css/*.css"`.

La table des numéros de cartes (`maps[0]` = Brumeval, etc.) se trouve en tête de `js/game/maps.js`.

Pour tester en local, ouvrir `index.html` directement ou lancer un petit serveur : `python3 -m http.server` puis aller sur http://localhost:8000.

## Tests et publication

- `npm install` puis `npm test` : tests de bout en bout avec Playwright (lancement, nouvelle partie, combats simples et doubles, effets de chaque attaque, menus, les 64 cartes en 2D et en 3D, toutes les créatures, sauvegardes, mode hors ligne).
- `npm run check` / `npm run format` : vérifie / applique la mise en forme Prettier.
- GitHub Actions (`.github/workflows/ci.yml`) lance ces vérifications à chaque envoi. Sur la branche principale, si elles passent et que le dépôt est public, le site est publié sur GitHub Pages (réglage à faire une fois : Settings → Pages → Source : « GitHub Actions »).
- Si un fichier est ajouté au jeu, l'ajouter aussi à la liste `FILES` de `sw.js` (un test le vérifie).
