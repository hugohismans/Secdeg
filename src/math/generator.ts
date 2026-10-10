/**
 * Génération d'équations par niveau de difficulté, avec un biais optionnel
 * vers un type d'erreur à travailler (adaptativité).
 */
import type { Quadratic } from './quadratic';
import { quad, fromRoots, fromVertex, discriminant, isPerfectSquare } from './quadratic';
import { frac, toNumber } from './fraction';
import type { Rng } from './rng';
import { defaultRng, randInt, randNonZero, pick } from './rng';
import type { ErrorType } from './diagnose';

export type Difficulty =
  | 'entier_simple' // a = 1, racines entières
  | 'entier_a' // a ≠ 1, racines entières
  | 'fraction' // racines rationnelles non entières
  | 'irrationnel' // Δ > 0 non carré parfait
  | 'double' // Δ = 0
  | 'negatif' // Δ < 0
  | 'mixte'; // un des cas précédents au hasard

export const DIFFICULTIES: Difficulty[] = [
  'entier_simple', 'entier_a', 'fraction', 'irrationnel', 'double', 'negatif',
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  entier_simple: 'Racines entières, a = 1',
  entier_a: 'Racines entières, a ≠ 1',
  fraction: 'Racines fractionnaires',
  irrationnel: 'Racines avec radicaux',
  double: 'Racine double',
  negatif: 'Pas de solution réelle',
  mixte: 'Mélange',
};

export interface GenOptions {
  rng?: Rng;
  /** type d'erreur à travailler : influence les coefficients */
  bias?: ErrorType | null;
  /** borne des racines entières */
  rootMax?: number;
}

function pickA(rng: Rng, bias: ErrorType | null | undefined, allowOne: boolean): number {
  if (bias === 'oubli_2a') return pick(rng, [2, 3, -2, 4, -3]);
  if (allowOne) return 1;
  return randNonZero(rng, -3, 3);
}

/** Applique le biais "signe de b" : on veut b < 0 (le piège du −b). */
function wantNegativeB(bias: ErrorType | null | undefined, rng: Rng): boolean {
  return bias === 'signe_b' ? true : rng() < 0.5;
}

export function generate(level: Difficulty, opts: GenOptions = {}): Quadratic {
  const rng = opts.rng ?? defaultRng;
  const bias = opts.bias ?? null;
  const rootMax = opts.rootMax ?? 6;
  if (level === 'mixte') {
    // le biais "oubli du ±" exige deux racines ; sinon on tire parmi tous les cas
    // le biais "oubli de 2a" exclut le niveau où a = 1
    const pool: Difficulty[] =
      bias === 'oubli_pm'
        ? ['entier_simple', 'entier_a', 'fraction', 'irrationnel']
        : bias === 'oubli_2a'
          ? ['entier_a', 'fraction', 'irrationnel', 'double', 'negatif']
          : DIFFICULTIES;
    return generate(pick(rng, pool), opts);
  }

  for (let attempt = 0; attempt < 200; attempt++) {
    let q: Quadratic | null = null;
    switch (level) {
      case 'entier_simple': {
        const r1 = randInt(rng, -rootMax, rootMax);
        let r2 = randInt(rng, -rootMax, rootMax);
        if (r2 === r1) r2 = r1 + (r1 < rootMax ? 1 : -1);
        q = fromRoots(1, r1, r2);
        break;
      }
      case 'entier_a': {
        const a = pickA(rng, bias, false);
        const r1 = randInt(rng, -rootMax, rootMax);
        let r2 = randInt(rng, -rootMax, rootMax);
        if (r2 === r1) r2 = r1 + (r1 < rootMax ? 1 : -1);
        q = fromRoots(a === 1 ? 2 : a, r1, r2);
        break;
      }
      case 'fraction': {
        // (p x − m)(q x − n) avec au moins une racine non entière
        const p = pick(rng, [2, 3, 2, 4]);
        const qq = pick(rng, [1, 2, 3]);
        const m = randNonZero(rng, -5, 5);
        const n = randInt(rng, -5, 5);
        if (m % p === 0 && (qq === 1 || n % qq === 0)) continue;
        q = fromRoots(p * qq, frac(m, p), frac(n, qq));
        break;
      }
      case 'irrationnel': {
        const a = pickA(rng, bias, rng() < 0.6);
        const b = randNonZero(rng, -8, 8);
        const c = randNonZero(rng, -8, 8);
        q = quad(a, b, c);
        const d = toNumber(discriminant(q));
        if (d <= 0 || isPerfectSquare(d)) {
          q = null;
          continue;
        }
        break;
      }
      case 'double': {
        const a = pickA(rng, bias, rng() < 0.6);
        const r = randNonZero(rng, -rootMax, rootMax);
        q = fromRoots(a, r, r);
        break;
      }
      case 'negatif': {
        // sommet au-dessus de l'axe avec a > 0 (ou en dessous avec a < 0)
        const a = pickA(rng, bias, rng() < 0.6);
        const alpha = randInt(rng, -4, 4);
        const beta = randInt(rng, 1, 6) * Math.sign(a);
        q = fromVertex(a, alpha, beta);
        break;
      }
    }
    if (!q) continue;
    // Biais sur le signe de b : on veut b < 0 strictement
    if (bias === 'signe_b' && toNumber(q.b) >= 0) {
      if (toNumber(q.b) === 0) continue;
      // remplacer x par −x change le signe de b sans changer |racines|
      q = quad(q.a, frac(-q.b.n, q.b.d), q.c);
    } else if (!wantNegativeB(bias, rng) && toNumber(q.b) < 0 && bias !== 'signe_b') {
      // variété : la moitié du temps on prend b > 0
      q = quad(q.a, frac(-q.b.n, q.b.d), q.c);
    }
    // Biais "oubli du ±" : il faut deux racines
    if (bias === 'oubli_pm' && toNumber(discriminant(q)) <= 0) continue;
    // Coefficients raisonnables pour un calcul à la main
    const big = Math.max(Math.abs(q.a.n), Math.abs(q.b.n), Math.abs(q.c.n));
    if (big > 60) continue;
    return q;
  }
  // Repli (ne devrait pas arriver)
  return quad(1, -5, 6);
}

/**
 * Équation à coefficients entiers dont le nombre de racines est donné
 * (pour le mode Rapidité « combien de solutions ? »).
 */
export function generateWithCount(count: 0 | 1 | 2, opts: GenOptions = {}): Quadratic {
  const rng = opts.rng ?? defaultRng;
  const level: Difficulty = count === 0 ? 'negatif' : count === 1 ? 'double' : pick(rng, ['entier_simple', 'entier_a', 'irrationnel']);
  return generate(level, opts);
}

/** Équation à petits coefficients entiers pour calculer Δ de tête. */
export function generateForDelta(maxCoef: number, opts: GenOptions = {}): Quadratic {
  const rng = opts.rng ?? defaultRng;
  const a = randNonZero(rng, -maxCoef, maxCoef);
  const b = opts.bias === 'signe_b' ? -randInt(rng, 1, maxCoef) : randInt(rng, -maxCoef, maxCoef);
  const c = randNonZero(rng, -maxCoef, maxCoef);
  return quad(a, b, c);
}
