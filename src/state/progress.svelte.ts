/**
 * Progression : étoiles par niveau, meilleurs scores, position dans le module
 * Comprendre. Sauvegardée en localStorage (protégé par try/catch).
 */
import { PROGRESS } from '../config';
import { loadJSON, saveJSON } from './storage';

interface ProgressData {
  stars: Record<string, number>;
  best: Record<string, number>;
  comprendreStep: number;
  comprendreDone: boolean;
}

const KEY = `${PROGRESS.storageKey}.progress`;

const data = $state<ProgressData>(
  loadJSON<ProgressData>(KEY, { stars: {}, best: {}, comprendreStep: 0, comprendreDone: false }),
);

function persist() {
  saveJSON(KEY, { stars: data.stars, best: data.best, comprendreStep: data.comprendreStep, comprendreDone: data.comprendreDone });
}

export const progress = {
  /** étoiles (0-3) pour "jeu:niveau" */
  stars(game: string, level: number): number {
    return data.stars[`${game}:${level}`] ?? 0;
  },
  /** enregistre un résultat, ne garde que le meilleur */
  setStars(game: string, level: number, stars: number) {
    const k = `${game}:${level}`;
    if (stars > (data.stars[k] ?? 0)) {
      data.stars[k] = stars;
      persist();
    }
  },
  totalStars(game: string): number {
    return Object.entries(data.stars)
      .filter(([k]) => k.startsWith(`${game}:`))
      .reduce((s, [, v]) => s + v, 0);
  },
  /** le niveau 1 est toujours ouvert ; les suivants demandent des étoiles au précédent */
  isUnlocked(game: string, level: number): boolean {
    if (level <= 1) return true;
    return this.stars(game, level - 1) >= PROGRESS.starsToUnlock;
  },
  best(key: string): number {
    return data.best[key] ?? 0;
  },
  /** retourne true si c'est un nouveau record */
  setBest(key: string, score: number): boolean {
    if (score > (data.best[key] ?? 0)) {
      data.best[key] = score;
      persist();
      return true;
    }
    return false;
  },
  get comprendreStep() {
    return data.comprendreStep;
  },
  set comprendreStep(v: number) {
    data.comprendreStep = v;
    persist();
  },
  get comprendreDone() {
    return data.comprendreDone;
  },
  set comprendreDone(v: boolean) {
    data.comprendreDone = v;
    persist();
  },
  reset() {
    data.stars = {};
    data.best = {};
    data.comprendreStep = 0;
    data.comprendreDone = false;
    persist();
  },
};
