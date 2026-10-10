/**
 * Suivi des types d'erreur pour l'adaptativité : on garde une fenêtre
 * glissante des dernières erreurs et on en déduit l'erreur « prioritaire ».
 */
import { ADAPT, PROGRESS } from '../config';
import type { ErrorType } from '../math/diagnose';
import { loadJSON, saveJSON } from './storage';

const KEY = `${PROGRESS.storageKey}.errors`;

interface ErrorData {
  recent: ErrorType[];
}

const data = $state<ErrorData>(loadJSON<ErrorData>(KEY, { recent: [] }));

export const errorTracker = {
  record(type: ErrorType) {
    if (type === 'autre') return;
    data.recent = [...data.recent, type].slice(-ADAPT.window);
    saveJSON(KEY, { recent: data.recent });
  },
  counts(): Record<ErrorType, number> {
    const c: Record<ErrorType, number> = { signe_b: 0, oubli_pm: 0, oubli_2a: 0, delta: 0, autre: 0 };
    for (const t of data.recent) c[t]++;
    return c;
  },
  /** type d'erreur à travailler, ou null si rien ne se dégage */
  priority(): ErrorType | null {
    const c = this.counts();
    const total = data.recent.length;
    if (total === 0) return null;
    let best: ErrorType | null = null;
    let bestCount = 0;
    for (const t of ['signe_b', 'oubli_pm', 'oubli_2a', 'delta'] as ErrorType[]) {
      if (c[t] > bestCount) {
        best = t;
        bestCount = c[t];
      }
    }
    if (!best) return null;
    if (bestCount < ADAPT.minCount || bestCount / total < ADAPT.minShare) return null;
    return best;
  },
  /** biais à passer au générateur : la priorité, avec la probabilité configurée */
  bias(rng: () => number = Math.random): ErrorType | null {
    const p = this.priority();
    return p && rng() < ADAPT.targetProbability ? p : null;
  },
  get recent() {
    return data.recent;
  },
  reset() {
    data.recent = [];
    saveJSON(KEY, { recent: [] });
  },
};
