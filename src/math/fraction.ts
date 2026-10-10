/**
 * Fractions exactes (rationnels) : numérateur entier, dénominateur entier > 0,
 * toujours réduites. Sert à afficher proprement b/2a, (b/2a)², -c/a, etc.
 */
export interface Fraction {
  readonly n: number;
  readonly d: number;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function frac(n: number, d = 1): Fraction {
  if (d === 0) throw new Error('Dénominateur nul');
  if (!Number.isInteger(n) || !Number.isInteger(d)) {
    // Entrée décimale : on convertit en fraction exacte (ex : 0.5 -> 1/2)
    const fn = fromNumber(n);
    const fd = fromNumber(d);
    return div(fn, fd);
  }
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1;
  // « + 0 » évite le -0 de JavaScript
  return { n: n / g + 0, d: d / g };
}

export const ZERO = frac(0);
export const ONE = frac(1);

/** Convertit un nombre décimal en fraction (au plus 6 décimales). */
export function fromNumber(x: number): Fraction {
  if (Number.isInteger(x)) return frac(x, 1);
  if (!Number.isFinite(x)) throw new Error('Nombre non fini');
  const s = x.toString();
  if (s.includes('e')) {
    // Notation scientifique : on arrondit à 6 décimales
    const r = Math.round(x * 1e6);
    return frac(r, 1e6);
  }
  const decimals = s.split('.')[1]?.length ?? 0;
  const p = Math.pow(10, Math.min(decimals, 9));
  return frac(Math.round(x * p), p);
}

export function add(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d + b.n * a.d, a.d * b.d);
}
export function sub(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d - b.n * a.d, a.d * b.d);
}
export function mul(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.n, a.d * b.d);
}
export function div(a: Fraction, b: Fraction): Fraction {
  if (b.n === 0) throw new Error('Division par zéro');
  return frac(a.n * b.d, a.d * b.n);
}
export function neg(a: Fraction): Fraction {
  return frac(-a.n, a.d);
}
export function sq(a: Fraction): Fraction {
  return mul(a, a);
}
export function eq(a: Fraction, b: Fraction): boolean {
  return a.n === b.n && a.d === b.d;
}
export function isZero(a: Fraction): boolean {
  return a.n === 0;
}
export function sign(a: Fraction): -1 | 0 | 1 {
  return a.n > 0 ? 1 : a.n < 0 ? -1 : 0;
}
export function isInteger(a: Fraction): boolean {
  return a.d === 1;
}
export function toNumber(a: Fraction): number {
  return a.n / a.d;
}
export function compare(a: Fraction, b: Fraction): number {
  return a.n * b.d - b.n * a.d;
}

/** Affichage "humain" à la belge : 1/2, -3, 2 (pas de décimales) */
export function toString(a: Fraction): string {
  return a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`;
}

/**
 * Affichage LaTeX : \frac{1}{2}, -\frac{3}{4}, 5.
 * Le signe est sorti de la fraction.
 */
export function toLatex(a: Fraction): string {
  if (a.d === 1) return `${a.n}`;
  const s = a.n < 0 ? '-' : '';
  return `${s}\\frac{${Math.abs(a.n)}}{${a.d}}`;
}

/** Affichage décimal arrondi, avec virgule décimale (usage belge). */
export function toDecimalString(x: number, decimals = 2): string {
  const r = Math.round(x * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return r.toString().replace('.', ',');
}
