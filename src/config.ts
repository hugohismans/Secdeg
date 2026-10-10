/**
 * Fichier de configuration unique.
 * Toutes les constantes de réglage (durées, chronos, physique du jeu, seuils,
 * couleurs) sont ici pour pouvoir ajuster le ressenti sans toucher au code.
 */

// ---------------------------------------------------------------------------
// Couleurs : la correspondance est la MÊME en géométrie, en LaTeX et sur la
// parabole. Changer une couleur ici la change partout.
// ---------------------------------------------------------------------------
export const COLORS = {
  /** x²  : le grand carré */
  x2: '#2b6cb0',
  /** bx : le rectangle / les deux bandes */
  bx: '#dd6b20',
  /** (b/2a)² : le petit coin manquant */
  corner: '#2f855a',
  /** c : le terme constant */
  c: '#718096',
  /** Δ : le discriminant */
  delta: '#805ad5',
  /** racines sur la parabole */
  root: '#c53030',
  /** sommet et axe de symétrie */
  vertex: '#2f855a',
  /** courbe de la parabole */
  curve: '#2b4c9b',
  /** cibles du lance-parabole */
  target: '#e53e3e',
  /** succès / erreur dans les feedbacks */
  ok: '#2f855a',
  ko: '#c53030',
} as const;

// ---------------------------------------------------------------------------
// Animations (ms)
// ---------------------------------------------------------------------------
export const ANIM = {
  /** glissement d'une bande vers sa place, dans le module Comprendre */
  slide: 450,
  /** apparition du coin manquant */
  cornerAppear: 500,
  /** transition entre deux étapes */
  stepFade: 250,
  /** mise en surbrillance d'un terme dans une formule */
  highlight: 600,
  /** feedback (bonne / mauvaise réponse) */
  feedback: 350,
} as const;

// ---------------------------------------------------------------------------
// Mode Rapidité
// ---------------------------------------------------------------------------
export const RAPIDITE = {
  /** secondes pour répondre : nombre de solutions (équation) */
  secondsCountEquation: 8,
  /** secondes pour répondre : nombre de solutions (graphe) */
  secondsCountGraph: 5,
  /** secondes pour calculer Δ de tête */
  secondsDelta: 12,
  /** questions par manche */
  questionsPerRound: 10,
  /** points par bonne réponse, et bonus par élément de série */
  pointsCorrect: 10,
  pointsStreakBonus: 2,
  /** bornes des coefficients pour le calcul de Δ de tête */
  deltaCoefMax: 6,
  /** seuils d'étoiles : fraction de bonnes réponses */
  stars: [0.5, 0.75, 0.95],
} as const;

// ---------------------------------------------------------------------------
// Lance-parabole
// ---------------------------------------------------------------------------
export const LANCE = {
  /** Le projectile suit exactement y = ax² + bx + c. "Gravité" règle la
   *  vitesse de parcours : nombre d'unités d'abscisse par seconde. */
  unitsPerSecond: 4,
  /** échelle du repère : étendue visible en unités */
  xMin: -10,
  xMax: 10,
  yMin: -6,
  yMax: 12,
  /** tolérance (en unités) pour toucher une cible ou un point d'atterrissage */
  hitTolerance: 0.35,
  /** bornes des curseurs */
  aRange: [-3, 3] as [number, number],
  bRange: [-12, 12] as [number, number],
  cRange: [-12, 12] as [number, number],
  /** pas des curseurs */
  step: 0.5,
  /** nombre maximal de tirs par niveau pour obtenir 3, 2 puis 1 étoile */
  starsByShots: [1, 3, 6],
} as const;

// ---------------------------------------------------------------------------
// Puzzle de tuiles
// ---------------------------------------------------------------------------
export const PUZZLE = {
  /** taille d'une tuile unité en px (base, avant mode projection) */
  tilePx: 28,
  /** distance de snap en px pour qu'une tuile se cale */
  snapPx: 24,
  /** nombre d'indices utilisés au-delà duquel on perd une étoile */
  hintPenalty: 1,
} as const;

// ---------------------------------------------------------------------------
// Parabole à curseurs (module Comprendre et mode projection)
// ---------------------------------------------------------------------------
export const PARABOLA = {
  aRange: [-4, 4] as [number, number],
  bRange: [-10, 10] as [number, number],
  cRange: [-10, 10] as [number, number],
  step: 0.5,
  /** fenêtre par défaut */
  xMin: -8,
  xMax: 8,
  yMin: -8,
  yMax: 8,
} as const;

// ---------------------------------------------------------------------------
// Adaptativité
// ---------------------------------------------------------------------------
export const ADAPT = {
  /** nombre minimal d'erreurs d'un même type pour le rendre prioritaire */
  minCount: 3,
  /** part minimale de ce type parmi toutes les erreurs */
  minShare: 0.4,
  /** probabilité de servir un exercice ciblant l'erreur prioritaire */
  targetProbability: 0.6,
  /** fenêtre glissante : on ne garde que les N dernières erreurs */
  window: 30,
} as const;

// ---------------------------------------------------------------------------
// Progression
// ---------------------------------------------------------------------------
export const PROGRESS = {
  /** clé localStorage (changer en cas de migration) */
  storageKey: 'secdeg.v1',
  /** nombre d'étoiles requis au niveau précédent pour débloquer le suivant */
  starsToUnlock: 1,
} as const;

// ---------------------------------------------------------------------------
// Mode projection
// ---------------------------------------------------------------------------
export const PROJECTION = {
  /** facteur d'agrandissement du texte et des éléments */
  scale: 1.6,
} as const;

// ---------------------------------------------------------------------------
// Indices
// ---------------------------------------------------------------------------
export const HINTS = {
  /** nombre de niveaux d'indice : vague, précis, correction */
  levels: 3,
} as const;
