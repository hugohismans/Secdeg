/**
 * Mise en forme LaTeX des trinômes, fractions et racines, avec signes propres
 * et (optionnellement) le code couleur partagé avec la géométrie.
 */
import type { Fraction } from './fraction';
import { toLatex as fracLatex, isZero, isInteger, toNumber } from './fraction';
import type { Quadratic, ExactRoot } from './quadratic';
import { COLORS } from '../config';

export { fracLatex };

export function colored(color: string, latex: string): string {
  return `\\textcolor{${color}}{${latex}}`;
}

/** Valeur absolue d'une fraction en LaTeX, sans signe. */
function absLatex(f: Fraction): string {
  return fracLatex({ n: Math.abs(f.n), d: f.d });
}

/**
 * Un terme "coef · symbole" (ex : 6x, -x², (1/2)x).
 * Retourne { sign, body } : body sans signe, pour pouvoir assembler proprement.
 */
export function term(coef: Fraction, symbol: string): { sign: '+' | '-'; body: string } | null {
  if (isZero(coef)) return null;
  const sgn = coef.n < 0 ? '-' : '+';
  let body: string;
  if (symbol === '') body = absLatex(coef);
  else if (Math.abs(coef.n) === 1 && coef.d === 1) body = symbol;
  else if (isInteger(coef)) body = `${Math.abs(coef.n)}${symbol}`;
  else body = `${absLatex(coef)}${symbol}`;
  return { sign: sgn, body };
}

/** Assemble une liste de termes signés en expression ("x^2 - 3x + 2"). */
export function joinTerms(terms: ({ sign: '+' | '-'; body: string } | null)[]): string {
  const parts = terms.filter((t): t is { sign: '+' | '-'; body: string } => t !== null);
  if (parts.length === 0) return '0';
  let out = parts[0].sign === '-' ? `-${parts[0].body}` : parts[0].body;
  for (const t of parts.slice(1)) out += ` ${t.sign} ${t.body}`;
  return out;
}

export interface PolyOptions {
  /** colorie chaque terme selon COLORS (x², bx, c) */
  colors?: boolean;
  /** variable (x par défaut) */
  variable?: string;
}

/** ax² + bx + c en LaTeX. */
export function polyLatex(q: Quadratic, opts: PolyOptions = {}): string {
  const v = opts.variable ?? 'x';
  const t2 = term(q.a, `${v}^2`);
  const t1 = term(q.b, v);
  const t0 = term(q.c, '');
  if (opts.colors) {
    const wrap = (t: { sign: '+' | '-'; body: string } | null, color: string) =>
      t ? { sign: t.sign, body: colored(color, t.body) } : null;
    return joinTerms([wrap(t2, COLORS.x2), wrap(t1, COLORS.bx), wrap(t0, COLORS.c)]);
  }
  return joinTerms([t2, t1, t0]);
}

/** ax² + bx + c = 0 */
export function equationLatex(q: Quadratic, opts: PolyOptions = {}): string {
  return `${polyLatex(q, opts)} = 0`;
}

/** Racine exacte en LaTeX : -3, \frac{1}{2}, \frac{-1 + \sqrt{5}}{2}, 2\sqrt{3}, … */
export function exactRootLatex(x: ExactRoot): string {
  if (x.k === 0) return fracLatex({ n: x.num, d: x.den });
  const sqrtPart = `${Math.abs(x.k) === 1 ? '' : Math.abs(x.k)}\\sqrt{${x.r}}`;
  let numer: string;
  if (x.num === 0) numer = `${x.k < 0 ? '-' : ''}${sqrtPart}`;
  else numer = `${x.num} ${x.k < 0 ? '-' : '+'} ${sqrtPart}`;
  if (x.den === 1) return numer;
  return `\\frac{${numer}}{${x.den}}`;
}

/** √n simplifié en LaTeX : \sqrt{8} -> 2\sqrt{2}, \sqrt{9} -> 3. */
export function sqrtLatex(n: number): string {
  if (n < 0) return `\\sqrt{${n}}`;
  if (!Number.isInteger(n)) return `\\sqrt{${n}}`;
  let k = 1;
  let r = n;
  for (let p = 2; p * p <= r; p++) {
    while (r % (p * p) === 0) {
      r /= p * p;
      k *= p;
    }
  }
  if (r === 1) return `${k}`;
  return `${k === 1 ? '' : k}\\sqrt{${r}}`;
}

/** Nombre décimal arrondi en LaTeX (virgule décimale). */
export function decimalLatex(x: number, decimals = 2): string {
  const r = Math.round(x * 10 ** decimals) / 10 ** decimals;
  return r.toString().replace('.', '{,}');
}

/** Une fraction entre parenthèses si elle est négative (pour "a · (−3)"). */
export function parenIfNeg(f: Fraction): string {
  return toNumber(f) < 0 ? `(${fracLatex(f)})` : fracLatex(f);
}
