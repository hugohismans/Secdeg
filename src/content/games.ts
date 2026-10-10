/** Noms des jeux, tirés de l'histoire (mêmes noms dans le Cours et l'Histoire). */
export const GAMES = {
  rapidite: {
    path: 'rapidite',
    title: 'Les questions du calife',
    sub: 'Rapidité : 0, 1 ou 2 solutions, Δ de tête',
  },
  puzzle: {
    path: 'puzzle',
    title: 'La cour à carreler',
    sub: 'Puzzle de tuiles, 12 niveaux',
  },
  lance: {
    path: 'lance',
    title: 'Les fontaines des Banû Mûsâ',
    sub: 'Lance-parabole, 8 niveaux',
  },
} as const;

export type GameKey = keyof typeof GAMES;
