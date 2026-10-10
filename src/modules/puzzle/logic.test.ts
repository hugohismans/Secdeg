import { describe, it, expect } from 'vitest';
import { newBoard, checkBoard, boardEquation, tileHints, symbolicSteps } from './logic';
import { quad } from '../../math/quadratic';
import { LEVELS } from './levels';

describe('puzzle tuiles', () => {
  const q = quad(1, 6, -16);
  it('plateau initial', () => {
    const bd = newBoard(q);
    expect(bd).toEqual({ b: 6, rhs: 16, right: 0, bottom: 0, units: 0 });
    expect(checkBoard(bd).ok).toBe(false);
    expect(boardEquation(bd)).toBe('x^2 + 6x = 16');
  });
  it('répartition inégale', () => {
    const r = checkBoard({ b: 6, rhs: 16, right: 4, bottom: 2, units: 8 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('unequal');
  });
  it('coin incomplet', () => {
    const r = checkBoard({ b: 6, rhs: 16, right: 3, bottom: 3, units: 7 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('units');
    const e = checkBoard({ b: 6, rhs: 16, right: 3, bottom: 3, units: 0 });
    if (!e.ok) expect(e.reason).toBe('corner-empty');
  });
  it('carré complété', () => {
    expect(checkBoard({ b: 6, rhs: 16, right: 3, bottom: 3, units: 9 }).ok).toBe(true);
    expect(boardEquation({ b: 6, rhs: 16, right: 3, bottom: 3, units: 9 })).toBe('x^2 + 3x + 3x + 9 = 16 + 9');
  });
  it('indices', () => {
    const h = tileHints(q);
    expect(h).toHaveLength(3);
    expect(h[1][0]).toContain('3 bandes');
    expect(h[2].join(' ')).toContain('(x + 3)^2 = 25');
  });
});

describe('puzzle symbolique', () => {
  it('x² − 6x + 5 = 0', () => {
    const steps = symbolicSteps(quad(1, -6, 5));
    const ids = steps.map((s) => s.id);
    expect(ids).toEqual(['move-c', 'corner', 'square', 'roots']);
    expect(steps[0].expected).toEqual([-5]);
    expect(steps[1].expected).toEqual([9]);
    expect(steps[2].expected).toEqual([-3, 4]);
    expect(steps[3].expected).toEqual([1, 5]);
    expect(steps[2].after).toBe('\\left(x - 3\\right)^2 = 4');
  });
  it('2x² + 8x − 10 = 0 : étape diviser', () => {
    const steps = symbolicSteps(quad(2, 8, -10));
    expect(steps.map((s) => s.id)).toEqual(['move-c', 'divide', 'corner', 'square', 'roots']);
    expect(steps[1].expected).toEqual([4, 5]);
    expect(steps[2].expected).toEqual([4]);
    expect(steps[3].expected).toEqual([2, 9]);
    expect(steps[4].expected).toEqual([-5, 1]);
  });
  it('3x² − 5x + 1 = 0 : fractions', () => {
    const steps = symbolicSteps(quad(3, -5, 1));
    const corner = steps.find((s) => s.id === 'corner')!;
    expect(corner.expected[0]).toBeCloseTo(25 / 36, 10);
    const sq = steps.find((s) => s.id === 'square')!;
    expect(sq.expected[0]).toBeCloseTo(-5 / 6, 10);
    expect(sq.expected[1]).toBeCloseTo(13 / 36, 10);
  });
  it('Δ < 0 : pas de solution', () => {
    const steps = symbolicSteps(quad(1, 2, 5));
    const last = steps[steps.length - 1];
    expect(last.expected).toEqual([]);
    expect(last.after).toBe('S = \\varnothing');
  });
  it('tous les niveaux produisent des étapes cohérentes', () => {
    for (const lv of LEVELS) {
      const steps = symbolicSteps(lv.q);
      expect(steps.length).toBeGreaterThanOrEqual(4);
      for (const s of steps) {
        const squares = (s.template.match(/\\square/g) ?? []).length;
        expect(squares).toBeGreaterThanOrEqual(s.id === 'roots' ? 1 : s.expected.length);
        expect(s.fields.length).toBe(s.id === 'roots' ? 1 : s.expected.length);
        expect(s.hints).toHaveLength(3);
      }
    }
  });
});
