/**
 * Niveaux du Puzzle de tuiles. Les premiers se jouent avec des tuiles
 * (x², x, 1) sur x² + bx = r avec b pair positif ; les suivants passent à la
 * saisie symbolique, avec de plus en plus de difficultés (b impair, b négatif,
 * a ≠ 1, fractions, Δ négatif).
 */
import type { Quadratic } from '../../math/quadratic';
import { quad } from '../../math/quadratic';

export type LevelKind = 'tiles' | 'tiles-move-c' | 'symbolic';

export interface Level {
  title: string;
  subtitle: string;
  kind: LevelKind;
  /** l'équation ax² + bx + c = 0 */
  q: Quadratic;
}

export const LEVELS: Level[] = [
  { title: 'Premier carré', subtitle: 'x² + 4x = 5', kind: 'tiles', q: quad(1, 4, -5) },
  { title: 'Comme dans la leçon', subtitle: 'x² + 6x = 16', kind: 'tiles', q: quad(1, 6, -16) },
  { title: 'Plus large', subtitle: 'x² + 8x = 9', kind: 'tiles', q: quad(1, 8, -9) },
  { title: 'Coin de 25', subtitle: 'x² + 10x = 11', kind: 'tiles', q: quad(1, 10, -11) },
  { title: 'Déplacer c', subtitle: 'x² + 6x + 5 = 0', kind: 'tiles-move-c', q: quad(1, 6, 5) },
  { title: 'Sans tuiles', subtitle: 'x² + 8x + 12 = 0', kind: 'symbolic', q: quad(1, 8, 12) },
  { title: 'b négatif', subtitle: 'x² − 6x + 5 = 0', kind: 'symbolic', q: quad(1, -6, 5) },
  { title: 'b impair', subtitle: 'x² + 3x − 4 = 0', kind: 'symbolic', q: quad(1, 3, -4) },
  { title: 'Diviser par a', subtitle: '2x² + 8x − 10 = 0', kind: 'symbolic', q: quad(2, 8, -10) },
  { title: 'Avec radicaux', subtitle: 'x² − 4x + 1 = 0', kind: 'symbolic', q: quad(1, -4, 1) },
  { title: 'Tout en fractions', subtitle: '3x² − 5x + 1 = 0', kind: 'symbolic', q: quad(3, -5, 1) },
  { title: 'Pas de solution ?', subtitle: 'x² + 2x + 5 = 0', kind: 'symbolic', q: quad(1, 2, 5) },
];
