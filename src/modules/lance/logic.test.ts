import { describe, it, expect } from 'vitest';
import { checkShot, hitsTarget, rootsOf, starsForShots } from './logic';
import { LEVELS } from './levels';

describe('lance-parabole', () => {
  it('cible touchée selon la tolérance', () => {
    expect(hitsTarget(-0.5, 1, 3, { x: 2, y: 3 })).toBe(true);
    expect(hitsTarget(-0.5, 1, 2, { x: 2, y: 3 })).toBe(false);
  });
  it('racines', () => {
    expect(rootsOf(-1, 2, 3)).toEqual([-1, 3]);
    expect(rootsOf(1, 0, 1)).toEqual([]);
  });
  it('chaque niveau a une solution attendue qui passe', () => {
    const solutions = [
      [-0.5, 1, 3], [-0.5, 0.5, 4], [-1, 2, 3], [-1, 6, -5], [-1, 4, 0], [-1, -4, -3], [-1, -2, 3], [2, -4, 0],
    ];
    LEVELS.forEach((lv, i) => {
      const [a, b, c] = solutions[i];
      const r = checkShot(lv, a, b, c);
      expect(r.ok, `niveau ${i + 1}: ${r.message}`).toBe(true);
    });
  });
  it('échecs expliqués', () => {
    const r = checkShot(LEVELS[2], -1, 0, 4); // racines ±2 au lieu de −1 et 3
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/touche le sol en -2 et 2/);
    const v = checkShot(LEVELS[4], -1, 2, 3); // sommet (1 ; 4)
    expect(v.ok).toBe(false);
    expect(v.vertexOk).toBe(false);
    expect(v.message).toMatch(/sommet/);
    const t = checkShot(LEVELS[0], -0.5, 0, 0);
    expect(t.message).toMatch(/trop bas/);
    expect(checkShot(LEVELS[0], 0, 1, 1).ok).toBe(false);
  });
  it('racine parasite refusée', () => {
    // racines −1 et 3 demandées ; −1, 3 ok mais aussi... impossible pour un 2nd degré ;
    // on vérifie plutôt qu'une seule racine correcte ne suffit pas
    expect(checkShot(LEVELS[2], -1, -2, 3).ok).toBe(false); // racines −3 et 1
  });
  it('étoiles selon le nombre de tirs', () => {
    expect(starsForShots(1)).toBe(3);
    expect(starsForShots(3)).toBe(2);
    expect(starsForShots(6)).toBe(1);
    expect(starsForShots(20)).toBe(1);
  });
});
