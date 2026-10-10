import { describe, it, expect } from 'vitest';
import {
  quad, discriminant, rootCount, roots, axis, vertex, sumProduct, evaluate, canonical,
  halfSpread, integerForm, squareFree, exactRoots, exactToNumber, fromRoots, fromVertex, isPerfectSquare,
} from './quadratic';
import { frac } from './fraction';

describe('quadratic', () => {
  it("refuse a = 0", () => {
    expect(() => quad(0, 1, 2)).toThrow();
  });

  it('calcule Δ', () => {
    expect(discriminant(quad(1, 6, -16))).toEqual(frac(100));
    expect(discriminant(quad(1, -5, 6))).toEqual(frac(1));
    expect(discriminant(quad(1, 2, 1))).toEqual(frac(0));
    expect(discriminant(quad(1, 0, 1))).toEqual(frac(-4));
    expect(discriminant(quad(frac(1, 2), 1, frac(1, 2)))).toEqual(frac(0));
  });

  it('compte les racines', () => {
    expect(rootCount(quad(1, 6, -16))).toBe(2);
    expect(rootCount(quad(1, 2, 1))).toBe(1);
    expect(rootCount(quad(1, 0, 1))).toBe(0);
  });

  it("résout l'exemple du module Comprendre : x² + 6x − 16 = 0", () => {
    expect(roots(quad(1, 6, -16))).toEqual([-8, 2]);
  });

  it('racines numériques triées', () => {
    expect(roots(quad(-1, 0, 4))).toEqual([-2, 2]);
    expect(roots(quad(2, -4, 2))).toEqual([1]);
    expect(roots(quad(1, 0, 1))).toEqual([]);
    const r = roots(quad(1, -1, -1));
    expect(r[0]).toBeCloseTo((1 - Math.sqrt(5)) / 2, 10);
    expect(r[1]).toBeCloseTo((1 + Math.sqrt(5)) / 2, 10);
  });

  it('axe, sommet, somme et produit', () => {
    const q = quad(2, -8, 6); // racines 1 et 3, sommet (2, −2)
    expect(axis(q)).toEqual(frac(2));
    expect(vertex(q)).toEqual({ x: frac(2), y: frac(-2) });
    expect(sumProduct(q)).toEqual({ S: frac(4), P: frac(3) });
    expect(canonical(q)).toEqual({ a: frac(2), alpha: frac(2), beta: frac(-2) });
    expect(halfSpread(q)).toBeCloseTo(1, 10);
    expect(evaluate(q, 2)).toBe(-2);
  });

  it('centre ± écart redonne les racines', () => {
    const q = quad(1, -1, -1);
    const c = -(-1) / 2;
    const e = halfSpread(q);
    const r = roots(q);
    expect(c - e).toBeCloseTo(r[0], 10);
    expect(c + e).toBeCloseTo(r[1], 10);
  });

  it('forme entière', () => {
    expect(integerForm(quad(frac(1, 2), frac(3, 4), 1))).toEqual({ a: 2, b: 3, c: 4 });
    expect(integerForm(quad(2, 4, 6))).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('décomposition sans facteur carré', () => {
    expect(squareFree(8)).toEqual({ k: 2, r: 2 });
    expect(squareFree(9)).toEqual({ k: 3, r: 1 });
    expect(squareFree(5)).toEqual({ k: 1, r: 5 });
    expect(squareFree(72)).toEqual({ k: 6, r: 2 });
    expect(isPerfectSquare(49)).toBe(true);
    expect(isPerfectSquare(50)).toBe(false);
  });

  it('racines exactes', () => {
    expect(exactRoots(quad(1, 6, -16))).toEqual([
      { num: -8, k: 0, r: 1, den: 1 },
      { num: 2, k: 0, r: 1, den: 1 },
    ]);
    expect(exactRoots(quad(1, -1, -1))).toEqual([
      { num: 1, k: -1, r: 5, den: 2 },
      { num: 1, k: 1, r: 5, den: 2 },
    ]);
    expect(exactRoots(quad(1, 0, -8))).toEqual([
      { num: 0, k: -2, r: 2, den: 1 },
      { num: 0, k: 2, r: 2, den: 1 },
    ]);
    expect(exactRoots(quad(2, -4, 2))).toEqual([{ num: 1, k: 0, r: 1, den: 1 }]);
    expect(exactRoots(quad(2, 3, -2))).toEqual([
      { num: -2, k: 0, r: 1, den: 1 },
      { num: 1, k: 0, r: 1, den: 2 },
    ]);
    expect(exactRoots(quad(1, 0, 1))).toEqual([]);
    // a négatif : le dénominateur reste positif
    const neg = exactRoots(quad(-1, 0, 2));
    expect(neg[0]).toEqual({ num: 0, k: -1, r: 2, den: 1 });
    expect(exactToNumber(neg[1])).toBeCloseTo(Math.sqrt(2), 10);
  });

  it('construit à partir des racines ou du sommet', () => {
    expect(fromRoots(1, 2, -8)).toEqual(quad(1, 6, -16));
    expect(fromRoots(2, frac(1, 2), 3)).toEqual(quad(2, -7, 3));
    expect(fromVertex(1, 2, -1)).toEqual(quad(1, -4, 3));
    expect(roots(fromVertex(-2, 1, 8))).toEqual([-1, 3]);
  });
});
