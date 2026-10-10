import { describe, it, expect } from 'vitest';
import { diagnoseRoots, diagnoseDelta, diagnoseCount } from './diagnose';
import { quad } from './quadratic';

describe('diagnoseRoots', () => {
  const q = quad(1, -5, 6); // racines 2 et 3
  it('réponse juste', () => {
    expect(diagnoseRoots(q, [2, 3])).toBeNull();
    expect(diagnoseRoots(q, [3, 2])).toBeNull();
  });
  it('oubli du ±', () => {
    expect(diagnoseRoots(q, [2])?.type).toBe('oubli_pm');
  });
  it('signe de b : racines de x² + 5x + 6 = −2 et −3', () => {
    expect(diagnoseRoots(q, [-2, -3])?.type).toBe('signe_b');
    expect(diagnoseRoots(q, [-2])?.type).toBe('signe_b');
  });
  it('oubli de diviser par 2a', () => {
    const q2 = quad(2, -8, 6); // racines 1 et 3 ; sans /2a : 4 et 12
    expect(diagnoseRoots(q2, [4, 12])?.type).toBe('oubli_2a');
    // divisé par a seulement : 2 et 6
    expect(diagnoseRoots(q2, [2, 6])?.type).toBe('oubli_2a');
  });
  it('Δ avec + 4ac', () => {
    // x² − 5x + 6 : Δ' = 25 + 24 = 49 → (5 ± 7)/2 = 6 et −1
    expect(diagnoseRoots(q, [6, -1])?.type).toBe('delta');
  });
  it('Δ < 0 mais réponse donnée', () => {
    expect(diagnoseRoots(quad(1, 0, 1), [1])?.type).toBe('delta');
  });
  it('"pas de solution" alors qu\'il y en a', () => {
    expect(diagnoseRoots(q, [])?.type).toBe('delta');
  });
  it('autre erreur', () => {
    expect(diagnoseRoots(q, [7, 11])?.type).toBe('autre');
  });
  it('les messages sont en français et non vides', () => {
    expect(diagnoseRoots(q, [2])?.message).toMatch(/racine/);
  });
});

describe('diagnoseDelta', () => {
  const q = quad(2, -3, 1); // Δ = 9 − 8 = 1
  it('juste', () => {
    expect(diagnoseDelta(q, 1)).toBeNull();
  });
  it('b² + 4ac', () => {
    expect(diagnoseDelta(q, 17)?.type).toBe('delta');
  });
  it('b négatif élevé au carré avec un signe', () => {
    expect(diagnoseDelta(q, -17)?.type).toBe('signe_b');
  });
  it('2b au lieu de b²', () => {
    expect(diagnoseDelta(q, -6 - 8)?.message).toMatch(/b × b/);
  });
  it('oubli du 4', () => {
    expect(diagnoseDelta(q, 9 - 2)?.message).toMatch(/facteur 4/);
  });
  it('erreur quelconque', () => {
    expect(diagnoseDelta(q, 100)?.type).toBe('delta');
  });
});

describe('diagnoseCount', () => {
  it('compte', () => {
    expect(diagnoseCount(quad(1, 0, -1), 2)).toBeNull();
    expect(diagnoseCount(quad(1, 0, -1), 1)?.message).toMatch(/deux/);
    expect(diagnoseCount(quad(1, 2, 1), 2)?.message).toMatch(/double/);
    expect(diagnoseCount(quad(1, 0, 1), 2)?.message).toMatch(/pas de solution/);
  });
});
