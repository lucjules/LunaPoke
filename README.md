# Aérélia — La légende des Éclats lunaires

Jeu d'aventure et de capture de créatures au style rétro (console portable), écrit en un seul fichier HTML/JavaScript, sans dépendance ni étape de build.

## Lancer le jeu

Ouvrir `index.html` dans un navigateur (ordinateur ou mobile). La seule ressource externe est la police Google Fonts (Pixelify Sans / Press Start 2P) ; sans connexion, le jeu reste jouable avec une police de secours.

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
