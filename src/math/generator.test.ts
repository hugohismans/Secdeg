import { describe, it, expect } from 'vitest';
import { generate, generateWithCount, generateForDelta, DIFFICULTIES } from './generator';
import { mulberry32 } from './rng';
import { discriminant, roots, rootCount, exactRoots, isPerfectSquare, integerForm } from './quadratic';
import { toNumber, isInteger } from './fraction';

const N = 200;

describe('generate', () => {
  it('est déterministe avec une graine', () => {
    const a = generate('mixte', { rng: mulberry32(42) });
    const b = generate('mixte', { rng: mulberry32(42) });
    expect(a).toEqual(b);
  });

  it('entier_simple : a = 1 et racines entières distinctes', () => {
    const rng = mulberry32(1);
    for (let i = 0; i < N; i++) {
      const q = generate('entier_simple', { rng });
      expect(toNumber(q.a)).toBe(1);
      const r = roots(q);
      expect(r).toHaveLength(2);
      r.forEach((x) => expect(Number.isInteger(x)).toBe(true));
    }
  });

  it('entier_a : a ≠ 1 entier, racines entières', () => {
    const rng = mulberry32(2);
    for (let i = 0; i < N; i++) {
      const q = generate('entier_a', { rng });
      expect(isInteger(q.a)).toBe(true);
      expect(toNumber(q.a)).not.toBe(1);
      expect(toNumber(q.a)).not.toBe(0);
      const r = roots(q);
      expect(r).toHaveLength(2);
      r.forEach((x) => expect(Number.isInteger(x)).toBe(true));
    }
  });

  it('fraction : racines rationnelles, au moins une non entière', () => {
    const rng = mulberry32(3);
    for (let i = 0; i < N; i++) {
      const q = generate('fraction', { rng });
      const ex = exactRoots(q);
      expect(ex.length).toBeGreaterThanOrEqual(1);
      ex.forEach((x) => expect(x.k).toBe(0));
      expect(ex.some((x) => x.den !== 1)).toBe(true);
    }
  });

  it('irrationnel : Δ > 0 non carré parfait', () => {
    const rng = mulberry32(4);
    for (let i = 0; i < N; i++) {
      const q = generate('irrationnel', { rng });
      const { a, b, c } = integerForm(q);
      const d = b * b - 4 * a * c;
      expect(d).toBeGreaterThan(0);
      expect(isPerfectSquare(d)).toBe(false);
    }
  });

  it('double : Δ = 0', () => {
    const rng = mulberry32(5);
    for (let i = 0; i < N; i++) {
      expect(toNumber(discriminant(generate('double', { rng })))).toBe(0);
    }
  });

  it('negatif : Δ < 0', () => {
    const rng = mulberry32(6);
    for (let i = 0; i < N; i++) {
      expect(toNumber(discriminant(generate('negatif', { rng })))).toBeLessThan(0);
    }
  });

  it('coefficients raisonnables', () => {
    const rng = mulberry32(7);
    for (const level of DIFFICULTIES) {
      for (let i = 0; i < 50; i++) {
        const q = generate(level, { rng });
        for (const f of [q.a, q.b, q.c]) {
          expect(Math.abs(f.n)).toBeLessThanOrEqual(60);
          expect(f.d).toBeLessThanOrEqual(12);
        }
      }
    }
  });

  it('biais signe_b : b < 0', () => {
    const rng = mulberry32(8);
    for (const level of DIFFICULTIES) {
      for (let i = 0; i < 30; i++) {
        const q = generate(level, { rng, bias: 'signe_b' });
        expect(toNumber(q.b)).toBeLessThan(0);
      }
    }
  });

  it('biais oubli_2a : a ≠ 1', () => {
    const rng = mulberry32(9);
    for (let i = 0; i < 50; i++) {
      const q = generate('mixte', { rng, bias: 'oubli_2a' });
      expect(Math.abs(toNumber(q.a))).not.toBe(1);
    }
  });

  it('biais oubli_pm : deux racines', () => {
    const rng = mulberry32(10);
    for (let i = 0; i < 50; i++) {
      expect(rootCount(generate('mixte', { rng, bias: 'oubli_pm' }))).toBe(2);
    }
  });

  it('les deux signes de b apparaissent sans biais', () => {
    const rng = mulberry32(11);
    const signs = new Set<number>();
    for (let i = 0; i < 50; i++) signs.add(Math.sign(toNumber(generate('entier_simple', { rng }).b)));
    expect(signs.has(1)).toBe(true);
    expect(signs.has(-1)).toBe(true);
  });
});

describe('generateWithCount / generateForDelta', () => {
  it('respecte le nombre de racines demandé', () => {
    const rng = mulberry32(12);
    for (let i = 0; i < 60; i++) {
      expect(rootCount(generateWithCount(0, { rng }))).toBe(0);
      expect(rootCount(generateWithCount(1, { rng }))).toBe(1);
      expect(rootCount(generateWithCount(2, { rng }))).toBe(2);
    }
  });
  it('petits coefficients entiers pour Δ de tête', () => {
    const rng = mulberry32(13);
    for (let i = 0; i < 60; i++) {
      const q = generateForDelta(6, { rng });
      for (const f of [q.a, q.b, q.c]) {
        expect(f.d).toBe(1);
        expect(Math.abs(f.n)).toBeLessThanOrEqual(6);
      }
      expect(toNumber(q.a)).not.toBe(0);
    }
  });
});
