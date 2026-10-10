/**
 * Comparaison tolérante des réponses : fractions, racines, décimaux arrondis.
 */
import { parseNumber, writtenDecimals, splitValues } from './parse';

const ABS_EPS = 1e-9;

/** Tolérance adaptée à la précision écrite : "1,62" tolère ±0,005 (+ marge). */
export function toleranceFor(input: string): number {
  const d = writtenDecimals(input);
  if (d === 0) return ABS_EPS;
  return 0.5 * Math.pow(10, -d) + ABS_EPS;
}

/** La saisie vaut-elle la valeur attendue ? */
export function matchesValue(input: string, expected: number): boolean {
  const v = parseNumber(input);
  if (v === null) return false;
  return Math.abs(v - expected) <= toleranceFor(input);
}

export interface SetComparison {
  /** toutes les valeurs attendues sont présentes et aucune en trop */
  correct: boolean;
  /** valeurs attendues non fournies */
  missing: number[];
  /** valeurs fournies qui ne correspondent à rien (sous forme numérique) */
  extra: number[];
  /** saisies incompréhensibles */
  invalid: string[];
  /** valeurs fournies reconnues (numériques) */
  given: number[];
}

/**
 * Compare un ensemble de valeurs saisies (déjà séparées) à l'ensemble attendu,
 * sans tenir compte de l'ordre ni des doublons.
 */
export function compareSet(inputs: string[], expected: number[]): SetComparison {
  const given: number[] = [];
  const invalid: string[] = [];
  const remaining = expected.slice();
  const extra: number[] = [];
  for (const raw of inputs) {
    const v = parseNumber(raw);
    if (v === null) {
      invalid.push(raw);
      continue;
    }
    given.push(v);
    const tol = toleranceFor(raw);
    const idx = remaining.findIndex((e) => Math.abs(e - v) <= tol);
    if (idx >= 0) remaining.splice(idx, 1);
    else if (!expected.some((e) => Math.abs(e - v) <= tol)) extra.push(v);
    // (si la valeur était déjà "consommée", c'est un doublon : on l'ignore)
  }
  return {
    correct: invalid.length === 0 && remaining.length === 0 && extra.length === 0,
    missing: remaining,
    extra,
    invalid,
    given,
  };
}

/** Variante qui prend la saisie brute "2 ; -3". */
export function compareAnswer(input: string, expected: number[]): SetComparison {
  return compareSet(splitValues(input), expected);
}
