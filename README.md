# Le livre de la restauration

Web app éducative pour apprendre les équations du second degré (3e et 4e secondaire, Fédération Wallonie-Bruxelles).
Priorité : comprendre d'où vient la formule des racines, par la complétion du carré, avant de l'appliquer.

L'univers : Bagdad, an 820. L'élève devient l'apprenti d'al-Khwârizmî, dont le livre *al-jabr wa-l-muqâbala*
a donné son nom à l'algèbre. Le code couleur mathématique reprend les pigments des céramiques abbassides.

Deux modes :

- **L'Histoire** : sept chapitres jouables dans la ville ronde de Bagdad. On découvre le carré, la racine, le ±,
  al-jabr, la « question impossible » (Δ), les fontaines des Banû Mûsâ et la formule, avec le maître, les trois frères
  et Sifr, le chat de la bibliothèque. Les faits historiques sont exacts ; les dialogues sont inventés.
- **Le Cours** : 12 étapes manipulables, de x² + 10x = 39 (le problème d'al-Khwârizmî) à x = (−b ± √Δ) / 2a, puis les trois
  cas selon Δ, « centre ± écart » et la fiche mémo. Mode projection pour le tableau.

Trois jeux, intégrés à l'Histoire et rejouables depuis le Cours :

- **Les questions du calife** (rapidité) : 0, 1 ou 2 solutions ? et Δ de tête, avec sablier, score, série et record.
- **La cour à carreler** (puzzle de tuiles) : compléter le carré avec des tuiles, puis en symbolique, sur 12 niveaux.
- **Les fontaines des Banû Mûsâ** (lance-parabole) : régler a, b, c pour que le jet passe dans les anneaux, tombe dans les bassins, monte à la bonne hauteur.

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
Polices embarquées (hors ligne) : Alegreya, Alegreya Sans, Reem Kufi.

## Crédits

- Silhouette de Sifr : « Sitting Cat Silhouette », Openclipart n° 169097, domaine public.

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
    ├── histoire/          mode Histoire : carte de la ville ronde, lecteur de chapitres,
    │                      chapitres/c1.ts … c7.ts (textes et activités)
    ├── cours/             accueil du Cours
    ├── comprendre/        diagramme de complétion du carré + 12 étapes
    ├── projection/
    ├── rapidite/
    ├── puzzle/            plateau de tuiles + solveur symbolique guidé
    └── lance/             scène SVG + niveaux
```

Hors périmètre pour l'instant, mais l'architecture le permet : défi multijoueur avec code de classe, tableau de bord prof, création d'exercices.
