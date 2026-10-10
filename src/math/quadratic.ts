/**
 * Trinôme du second degré ax² + bx + c, a ≠ 0, à coefficients rationnels.
 * Tous les calculs sont exacts (fractions) sauf les racines numériques.
 */
import type { Fraction } from './fraction';
import {
  frac, fromNumber, add, sub, mul, div, neg, sq, isZero, sign, toNumber, gcd, lcm,
} from './fraction';

export interface Quadratic {
  readonly a: Fraction;
  readonly b: Fraction;
  readonly c: Fraction;
}

export type Coef = number | Fraction;

function toFrac(x: Coef): Fraction {
  return typeof x === 'number' ? fromNumber(x) : x;
}

/** Construit un trinôme à partir de nombres ou de fractions. */
export function quad(a: Coef, b: Coef, c: Coef): Quadratic {
  const fa = toFrac(a);
  if (isZero(fa)) throw new Error('a doit être non nul');
  return { a: fa, b: toFrac(b), c: toFrac(c) };
}

/** Δ = b² − 4ac */
export function discriminant(q: Quadratic): Fraction {
  return sub(sq(q.b), mul(frac(4), mul(q.a, q.c)));
}

/** Nombre de solutions réelles : 0, 1 (double) ou 2. */
export function rootCount(q: Quadratic): 0 | 1 | 2 {
  const s = sign(discriminant(q));
  return s > 0 ? 2 : s === 0 ? 1 : 0;
}

/** Racines numériques, triées par ordre croissant. Tableau vide si Δ < 0. */
export function roots(q: Quadratic): number[] {
  const d = toNumber(discriminant(q));
  if (d < 0) return [];
  const a = toNumber(q.a);
  const b = toNumber(q.b);
  if (d === 0) return [-b / (2 * a)];
  const s = Math.sqrt(d);
  const r1 = (-b - s) / (2 * a);
  const r2 = (-b + s) / (2 * a);
  return r1 < r2 ? [r1, r2] : [r2, r1];
}

/** Abscisse de l'axe de symétrie : −b / 2a */
export function axis(q: Quadratic): Fraction {
  return div(neg(q.b), mul(frac(2), q.a));
}

/** Sommet (α, β) avec α = −b/2a et β = −Δ/4a */
export function vertex(q: Quadratic): { x: Fraction; y: Fraction } {
  const x = axis(q);
  const y = div(neg(discriminant(q)), mul(frac(4), q.a));
  return { x, y };
}

/** Somme et produit des racines : S = −b/a, P = c/a (valables si Δ ≥ 0). */
export function sumProduct(q: Quadratic): { S: Fraction; P: Fraction } {
  return { S: div(neg(q.b), q.a), P: div(q.c, q.a) };
}

/** Valeur du trinôme en x (numérique). */
export function evaluate(q: Quadratic, x: number): number {
  return toNumber(q.a) * x * x + toNumber(q.b) * x + toNumber(q.c);
}

/** Forme canonique a(x − α)² + β */
export function canonical(q: Quadratic): { a: Fraction; alpha: Fraction; beta: Fraction } {
  const v = vertex(q);
  return { a: q.a, alpha: v.x, beta: v.y };
}

/** Écart entre chaque racine et l'axe : √Δ / (2|a|), numérique. */
export function halfSpread(q: Quadratic): number {
  const d = toNumber(discriminant(q));
  if (d < 0) return NaN;
  return Math.sqrt(d) / (2 * Math.abs(toNumber(q.a)));
}

/**
 * Trinôme équivalent à coefficients entiers (multiplié par le PPCM des
 * dénominateurs, puis divisé par le PGCD). Mêmes racines.
 */
export function integerForm(q: Quadratic): { a: number; b: number; c: number } {
  const m = lcm(lcm(q.a.d, q.b.d), q.c.d);
  let a = q.a.n * (m / q.a.d);
  let b = q.b.n * (m / q.b.d);
  let c = q.c.n * (m / q.c.d);
  const g = gcd(gcd(a, b), c) || 1;
  a /= g;
  b /= g;
  c /= g;
  return { a, b, c };
}

/** Décompose n = k² · r avec r sans facteur carré (n ≥ 0 entier). */
export function squareFree(n: number): { k: number; r: number } {
  if (n < 0 || !Number.isInteger(n)) throw new Error('squareFree : entier positif attendu');
  if (n === 0) return { k: 0, r: 1 };
  let k = 1;
  let r = n;
  for (let p = 2; p * p <= r; p++) {
    while (r % (p * p) === 0) {
      r /= p * p;
      k *= p;
    }
  }
  return { k, r };
}

export function isPerfectSquare(n: number): boolean {
  if (n < 0) return false;
  const s = Math.round(Math.sqrt(n));
  return s * s === n;
}

/**
 * Racine exacte sous la forme (num + k√r) / den, den > 0, r sans facteur carré.
 * Si k = 0 (ou r = 1), la racine est rationnelle num/den.
 */
export interface ExactRoot {
  readonly num: number;
  readonly k: number;
  readonly r: number;
  readonly den: number;
}

function reduceRoot(num: number, k: number, r: number, den: number): ExactRoot {
  if (r === 1) {
    num += k;
    k = 0;
  }
  if (den < 0) {
    num = -num;
    k = -k;
    den = -den;
  }
  const g = gcd(gcd(num, k), den) || 1;
  return { num: num / g + 0, k: k / g + 0, r: k === 0 ? 1 : r, den: den / g };
}

/** Racines exactes, de la plus petite à la plus grande. Vide si Δ < 0. */
export function exactRoots(q: Quadratic): ExactRoot[] {
  const { a, b, c } = integerForm(q);
  const d = b * b - 4 * a * c;
  if (d < 0) return [];
  if (d === 0) return [reduceRoot(-b, 0, 1, 2 * a)];
  const { k, r } = squareFree(d);
  const r1 = reduceRoot(-b, -k, r, 2 * a);
  const r2 = reduceRoot(-b, k, r, 2 * a);
  return exactToNumber(r1) < exactToNumber(r2) ? [r1, r2] : [r2, r1];
}

export function exactToNumber(x: ExactRoot): number {
  return (x.num + x.k * Math.sqrt(x.r)) / x.den;
}

export function exactIsRational(x: ExactRoot): boolean {
  return x.k === 0;
}

export function exactToFraction(x: ExactRoot): Fraction | null {
  return x.k === 0 ? frac(x.num, x.den) : null;
}

/** Trinôme à partir de ses racines et de a : a(x − r1)(x − r2). */
export function fromRoots(a: Coef, r1: Coef, r2: Coef): Quadratic {
  const fa = toFrac(a);
  const f1 = toFrac(r1);
  const f2 = toFrac(r2);
  // a x² − a(r1 + r2) x + a r1 r2
  return quad(fa, neg(mul(fa, add(f1, f2))), mul(fa, mul(f1, f2)));
}

/** Trinôme à partir du sommet (α, β) et de a : a(x − α)² + β. */
export function fromVertex(a: Coef, alpha: Coef, beta: Coef): Quadratic {
  const fa = toFrac(a);
  const al = toFrac(alpha);
  const be = toFrac(beta);
  // a x² − 2aα x + aα² + β
  return quad(fa, neg(mul(frac(2), mul(fa, al))), add(mul(fa, sq(al)), be));
}
