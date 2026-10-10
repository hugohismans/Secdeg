import { describe, it, expect } from 'vitest';
import { makeQuestion, applyAnswer, emptyRound, starsFor } from './logic';
import { mulberry32 } from '../../math/rng';
import { rootCount, discriminant } from '../../math/quadratic';
import { toNumber } from '../../math/fraction';

describe('rapidite', () => {
  it('questions "count" cohérentes', () => {
    const rng = mulberry32(1);
    for (let i = 0; i < 50; i++) {
      const qu = makeQuestion('count', rng);
      expect(rootCount(qu.q)).toBe(qu.answer);
      expect(qu.choices).toEqual([0, 1, 2]);
      expect(qu.seconds).toBeGreaterThan(0);
    }
  });
  it('questions "delta" : la bonne réponse est parmi 4 choix distincts', () => {
    const rng = mulberry32(2);
    for (let i = 0; i < 50; i++) {
      const qu = makeQuestion('delta', rng);
      expect(qu.answer).toBe(toNumber(discriminant(qu.q)));
      expect(qu.choices).toHaveLength(4);
      expect(new Set(qu.choices).size).toBe(4);
      expect(qu.choices).toContain(qu.answer);
    }
  });
  it('score et série', () => {
    let s = emptyRound();
    s = applyAnswer(s, true);
    s = applyAnswer(s, true);
    expect(s.score).toBe(10 + 12);
    expect(s.streak).toBe(2);
    s = applyAnswer(s, false);
    expect(s.streak).toBe(0);
    expect(s.bestStreak).toBe(2);
    expect(s.index).toBe(3);
    expect(s.correct).toBe(2);
  });
  it('étoiles', () => {
    expect(starsFor(10, 10)).toBe(3);
    expect(starsFor(8, 10)).toBe(2);
    expect(starsFor(5, 10)).toBe(1);
    expect(starsFor(2, 10)).toBe(0);
  });
});

import { graphWindow } from './logic';
import { quad } from '../../math/quadratic';
describe('graphWindow', () => {
  it('contient le sommet et l\'axe des x', () => {
    for (const q of [quad(1, -12, 36), quad(-2, 8, 10), quad(1, 0, 20), quad(3, 1, 1)]) {
      const w = graphWindow(q);
      const a = toNumber(q.a), b = toNumber(q.b), c = toNumber(q.c);
      const vx = -b / (2 * a), vy = c - (b * b) / (4 * a);
      expect(vx).toBeGreaterThan(w.xMin);
      expect(vx).toBeLessThan(w.xMax);
      expect(vy).toBeGreaterThan(w.yMin);
      expect(vy).toBeLessThan(w.yMax);
      expect(w.yMin).toBeLessThan(0);
      expect(w.yMax).toBeGreaterThan(0);
    }
  });
});
