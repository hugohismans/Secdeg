# Second degré

Web app éducative pour apprendre les équations du second degré (secondaire, Fédération Wallonie-Bruxelles).
Priorité : comprendre d'où vient la formule des racines, par la complétion du carré, avant de l'appliquer.

- **Comprendre** : 12 étapes manipulables, de x² + 6x = 16 (tuiles à glisser) à x = (−b ± √Δ) / 2a, puis les trois cas selon Δ, « centre ± écart » et la fiche mémo.
- **Rapidité** : 0, 1 ou 2 solutions ? (équation ou graphe) et Δ de tête, avec chrono, score, série et record.
- **Puzzle de tuiles** : compléter le carré avec des tuiles, puis en symbolique, sur 12 niveaux.
- **Lance-parabole** : régler a, b, c pour toucher des cibles, atterrir sur les racines, imposer le sommet.
- **Mode projection** : tout en grand, sans chrono ni score, pour le tableau.

Sans compte ni serveur : la progression est dans le `localStorage`. PWA installable, fonctionne hors ligne.

## Développement

```bash
npm install
npm run dev        # serveur de développement
npm test           # tests du moteur mathématique et des jeux (Vitest)
npm run check      # vérification TypeScript / Svelte
npm run build      # build de production dans dist/
npm run preview    # sert dist/ en local
```

Stack : Svelte 5 (runes), Vite, TypeScript, KaTeX, SVG, vite-plugin-pwa.

## Réglages

Toutes les constantes de ressenti sont dans `src/config.ts` : couleurs (identiques en géométrie, en LaTeX et sur la parabole), durées d'animation, chronos du mode Rapidité, vitesse et échelle du lance-parabole, seuils d'étoiles et d'adaptativité, facteur du mode projection.

## Déploiement

Le workflow `.github/workflows/deploy.yml` construit et publie `dist/` sur GitHub Pages à chaque push sur `main`
(dans les réglages du dépôt, Pages → Source : « GitHub Actions »). Le chemin de base est `/Secdeg/`.

Pour un autre hébergeur statique (Cloudflare Pages, etc.) :

```bash
VITE_BASE=/ npm run build
```

## Organisation du code

```
src/
├── config.ts              constantes de réglage
├── math/                  moteur isolé et testé : fractions exactes, Δ, racines exactes,
│                          LaTeX, parsing de la saisie, comparaison tolérante,
│                          diagnostic des erreurs, générateur par difficulté
├── lib/                   composants partagés (KaTeX, parabole SVG, curseur, indices, drag…)
├── state/                 progression, erreurs (adaptativité), réglages — localStorage
└── modules/
    ├── comprendre/        diagramme de complétion du carré + 12 étapes
    ├── projection/
    ├── rapidite/
    ├── puzzle/            plateau de tuiles + solveur symbolique guidé
    └── lance/             scène SVG + niveaux
```

Hors périmètre pour l'instant, mais l'architecture le permet : défi multijoueur avec code de classe, tableau de bord prof, création d'exercices.
