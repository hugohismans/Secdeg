/** Niveaux du Lance-parabole : cibles à toucher, points d'atterrissage, sommet imposé. */
export interface Point {
  x: number;
  y: number;
}

export interface LanceLevel {
  title: string;
  subtitle: string;
  /** consigne affichée */
  text: string;
  /** cibles que la trajectoire doit traverser */
  targets: Point[];
  /** abscisses où le projectile doit toucher le sol (racines) */
  landings: number[];
  /** sommet imposé (x et/ou y) */
  vertex?: { x?: number; y?: number };
  /** valeurs initiales des curseurs */
  start: { a: number; b: number; c: number };
  hints: string[][];
}

export const LEVELS: LanceLevel[] = [
  {
    title: 'Premier anneau',
    subtitle: '1 anneau',
    text: 'Règle a, b et c pour que le jet passe dans l\'anneau.',
    targets: [{ x: 2, y: 3 }],
    landings: [],
    start: { a: -0.5, b: 0, c: 0 },
    hints: [
      ['Commence par c : c est la hauteur de la courbe en x = 0.'],
      ['Avec a = −0,5 et c = 3, il faut choisir b pour que y(2) = 3 : −0,5·4 + 2b + 3 = 3.'],
      ['$$y = -0{,}5x^2 + x + 3 \\quad\\text{(ou toute autre parabole passant par } (2\\,;\\,3))'],
    ],
  },
  {
    title: 'Deux anneaux',
    subtitle: '2 anneaux',
    text: 'Le jet doit traverser les deux anneaux.',
    targets: [
      { x: -2, y: 1 },
      { x: 2, y: 3 },
    ],
    landings: [],
    start: { a: -0.5, b: 0, c: 2 },
    hints: [
      ['Deux points ne suffisent pas à fixer la parabole : choisis a, puis ajuste b et c.'],
      ['Essaie a = −0,5. Il faut alors y(−2) = 1 et y(2) = 3 : deux équations en b et c.'],
      ['$$y = -0{,}5x^2 + 0{,}5x + 4'],
    ],
  },
  {
    title: 'D\'un bassin à l\'autre',
    subtitle: 'racines −1 et 3',
    text: 'L\'eau doit jaillir en x = −1 et retomber dans le bassin en x = 3.',
    targets: [],
    landings: [-1, 3],
    start: { a: -1, b: 0, c: 0 },
    hints: [
      ['Les points où la parabole touche le sol sont ses racines. Pense à la forme a(x − x₁)(x − x₂).'],
      ['−1 et 3 sont racines de a(x + 1)(x − 3) = a(x² − 2x − 3). Choisis a < 0 pour que ça vole.'],
      ['$$y = -x^2 + 2x + 3 \\quad (a = -1,\; b = 2,\; c = 3)'],
    ],
  },
  {
    title: 'Anneau et bassins',
    subtitle: 'racines 1 et 5, anneau (3 ; 4)',
    text: 'Jaillir en x = 1, retomber en x = 5, en passant dans l\'anneau.',
    targets: [{ x: 3, y: 4 }],
    landings: [1, 5],
    start: { a: -1, b: 0, c: 0 },
    hints: [
      ['Les racines fixent b/a et c/a ; la cible fixe a.'],
      ['a(x − 1)(x − 5) = a(x² − 6x + 5). En x = 3 : a(9 − 18 + 5) = −4a = 4.'],
      ['$$y = -x^2 + 6x - 5'],
    ],
  },
  {
    title: 'Sommet imposé',
    subtitle: 'sommet (2 ; 4), racines 0 et 4',
    text: 'Le jet culmine en S(2 ; 4) et relie les bassins en 0 et 4.',
    targets: [],
    landings: [0, 4],
    vertex: { x: 2, y: 4 },
    start: { a: -0.5, b: 0, c: 0 },
    hints: [
      ["L'abscisse du sommet est −b/2a, au milieu des deux racines."],
      ['Racines 0 et 4 : y = a·x(x − 4). Le sommet est en x = 2 : y(2) = −4a = 4.'],
      ['$$y = -x^2 + 4x'],
    ],
  },
  {
    title: 'Sommet et cible',
    subtitle: 'sommet (−2 ; 1), anneau (0 ; −3)',
    text: 'Sommet en S(−2 ; 1), et le jet passe dans l\'anneau (0 ; −3).',
    targets: [{ x: 0, y: -3 }],
    landings: [],
    vertex: { x: -2, y: 1 },
    start: { a: -1, b: 0, c: 0 },
    hints: [
      ['Forme canonique : y = a(x − α)² + β avec S(α ; β).'],
      ['y = a(x + 2)² + 1 et y(0) = −3 : 4a + 1 = −3.'],
      ['$$y = -(x+2)^2 + 1 = -x^2 - 4x - 3'],
    ],
  },
  {
    title: 'Hauteur du jet',
    subtitle: 'racines −3 et 1, hauteur 4',
    text: 'Relier les bassins en −3 et 1, avec un jet qui monte exactement à la hauteur 4.',
    targets: [],
    landings: [-3, 1],
    vertex: { y: 4 },
    start: { a: -0.5, b: 0, c: 0 },
    hints: [
      ['Le sommet est au milieu des racines ; sa hauteur est −Δ/4a.'],
      ['y = a(x + 3)(x − 1), sommet en x = −1 : y(−1) = a(2)(−2) = −4a = 4.'],
      ['$$y = -x^2 - 2x + 3'],
    ],
  },
  {
    title: 'Le jet renversé',
    subtitle: 'sommet (1 ; −2), anneau (3 ; 6)',
    text: 'Cette fois a > 0, la courbe est tournée vers le haut : sommet en S(1 ; −2), et passer dans l\'anneau (3 ; 6).',
    targets: [{ x: 3, y: 6 }],
    landings: [],
    vertex: { x: 1, y: -2 },
    start: { a: 1, b: 0, c: 0 },
    hints: [
      ['y = a(x − 1)² − 2 : il reste à trouver a avec la cible.'],
      ['y(3) = a·4 − 2 = 6, donc a = 2.'],
      ['$$y = 2(x-1)^2 - 2 = 2x^2 - 4x'],
    ],
  },
];
