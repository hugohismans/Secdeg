/**
 * Logique du jeu Rapidité, sans Svelte (testable).
 */
import type { Quadratic } from '../../math/quadratic';
import { discriminant, integerForm } from '../../math/quadratic';
import { generateWithCount, generateForDelta } from '../../math/generator';
import { toNumber } from '../../math/fraction';
import type { Rng } from '../../math/rng';
import { defaultRng, pick } from '../../math/rng';
import type { ErrorType } from '../../math/diagnose';
import { RAPIDITE } from '../../config';

export type Mode = 'count' | 'delta';

export interface Question {
  mode: Mode;
  q: Quadratic;
  /** pour le mode count : on montre l'équation ou le graphe */
  display: 'equation' | 'graph';
  /** réponse attendue : nombre de solutions ou valeur de Δ */
  answer: number;
  /** choix proposés (mode delta) */
  choices: number[];
  seconds: number;
}

export function makeQuestion(mode: Mode, rng: Rng = defaultRng, bias: ErrorType | null = null): Question {
  if (mode === 'count') {
    const count = pick(rng, [0, 1, 2, 2, 0] as const);
    const q = generateWithCount(count, { rng, bias });
    const display = rng() < 0.5 ? 'equation' : 'graph';
    return {
      mode,
      q,
      display,
      answer: count,
      choices: [0, 1, 2],
      seconds: display === 'equation' ? RAPIDITE.secondsCountEquation : RAPIDITE.secondsCountGraph,
    };
  }
  const q = generateForDelta(RAPIDITE.deltaCoefMax, { rng, bias });
  const { a, b, c } = integerForm(q);
  const d = toNumber(discriminant(q));
  // distracteurs : erreurs typiques
  const wrong = new Set<number>([b * b + 4 * a * c, -(b * b) - 4 * a * c, 2 * b - 4 * a * c, b * b - a * c]);
  wrong.delete(d);
  const distractors = Array.from(wrong).slice(0, 3);
  while (distractors.length < 3) {
    const v = d + pick(rng, [-8, -4, 4, 8, 12]) * (distractors.length + 1);
    if (!distractors.includes(v) && v !== d) distractors.push(v);
  }
  const choices = [d, ...distractors].sort(() => rng() - 0.5);
  return { mode, q, display: 'equation', answer: d, choices, seconds: RAPIDITE.secondsDelta };
}

export interface RoundState {
  index: number;
  score: number;
  streak: number;
  bestStreak: number;
  correct: number;
}

export function emptyRound(): RoundState {
  return { index: 0, score: 0, streak: 0, bestStreak: 0, correct: 0 };
}

/** Applique une réponse (ou un temps écoulé : correct = false). */
export function applyAnswer(s: RoundState, correct: boolean): RoundState {
  if (correct) {
    const streak = s.streak + 1;
    return {
      index: s.index + 1,
      score: s.score + RAPIDITE.pointsCorrect + RAPIDITE.pointsStreakBonus * (streak - 1),
      streak,
      bestStreak: Math.max(s.bestStreak, streak),
      correct: s.correct + 1,
    };
  }
  return { ...s, index: s.index + 1, streak: 0 };
}

export function starsFor(correct: number, total: number): number {
  const r = correct / total;
  return RAPIDITE.stars.filter((t) => r >= t).length;
}

/** Fenêtre de tracé centrée sur la partie utile de la parabole (sommet et axe des x). */
export function graphWindow(q: Quadratic): { xMin: number; xMax: number; yMin: number; yMax: number } {
  const a = toNumber(q.a);
  const b = toNumber(q.b);
  const c = toNumber(q.c);
  const vx = -b / (2 * a);
  const vy = c - (b * b) / (4 * a);
  const d = b * b - 4 * a * c;
  const spread = d > 0 ? Math.sqrt(d) / (2 * Math.abs(a)) : 0;
  const hw = Math.max(5, spread + 2);
  const xMin = Math.floor(vx - hw);
  const xMax = Math.ceil(vx + hw);
  const lo = Math.min(0, vy) - 3;
  const hi = Math.max(0, vy) + 3;
  const h = Math.max(10, hi - lo);
  const mid = (lo + hi) / 2;
  return { xMin, xMax, yMin: Math.floor(mid - h / 2), yMax: Math.ceil(mid + h / 2) };
}
