import { describe, it, expect } from 'vitest';
import { matchesValue, compareSet, compareAnswer, toleranceFor } from './compare';

describe('compare', () => {
  it('formes équivalentes', () => {
    expect(matchesValue('1/2', 0.5)).toBe(true);
    expect(matchesValue('0,5', 0.5)).toBe(true);
    expect(matchesValue('2/4', 0.5)).toBe(true);
    expect(matchesValue('-1/2', -0.5)).toBe(true);
    expect(matchesValue('(1+√5)/2', (1 + Math.sqrt(5)) / 2)).toBe(true);
  });
  it('décimaux arrondis tolérés selon la précision écrite', () => {
    const phi = (1 + Math.sqrt(5)) / 2; // 1,618…
    expect(matchesValue('1,62', phi)).toBe(true);
    expect(matchesValue('1,6', phi)).toBe(true);
    expect(matchesValue('1,618', phi)).toBe(true);
    expect(matchesValue('1,7', phi)).toBe(false);
    expect(matchesValue('2', phi)).toBe(false);
    expect(toleranceFor('1,62')).toBeCloseTo(0.005, 6);
  });
  it('ensembles sans ordre', () => {
    expect(compareSet(['2', '-8'], [-8, 2]).correct).toBe(true);
    expect(compareSet(['-8', '2'], [-8, 2]).correct).toBe(true);
    expect(compareSet(['2', '2'], [-8, 2]).correct).toBe(false);
    const r = compareSet(['2'], [-8, 2]);
    expect(r.correct).toBe(false);
    expect(r.missing).toEqual([-8]);
    const e = compareSet(['2', '5'], [2]);
    expect(e.extra).toEqual([5]);
    const inv = compareSet(['abc'], [2]);
    expect(inv.invalid).toEqual(['abc']);
    expect(inv.correct).toBe(false);
  });
  it('réponse brute', () => {
    expect(compareAnswer('-8 ; 2', [-8, 2]).correct).toBe(true);
    expect(compareAnswer('2 et -8', [-8, 2]).correct).toBe(true);
    expect(compareAnswer('', []).correct).toBe(true);
    expect(compareAnswer('', [1]).correct).toBe(false);
  });
});
