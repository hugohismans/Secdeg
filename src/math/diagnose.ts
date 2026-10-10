/**
 * Diagnostic des erreurs typiques : on recalcule ce que donnerait chaque
 * erreur classique et on compare à la réponse de l'élève.
 */
import type { Quadratic } from './quadratic';
import { roots, discriminant, quad, integerForm } from './quadratic';
import { toNumber, neg, isZero } from './fraction';

export type ErrorType =
  | 'signe_b' // a utilisé +b au lieu de −b (ou s'est trompé sur le signe de b)
  | 'oubli_pm' // n'a donné qu'une des deux racines
  | 'oubli_2a' // a oublié de diviser par 2a
  | 'delta' // Δ mal calculé
  | 'autre';

export const ERROR_LABELS: Record<ErrorType, string> = {
  signe_b: 'le signe de b',
  oubli_pm: "l'oubli du ±",
  oubli_2a: "l'oubli de diviser par 2a",
  delta: 'le calcul de Δ',
  autre: 'autre',
};

export interface Diagnosis {
  type: ErrorType;
  /** explication en français, adressée à l'élève */
  message: string;
}

function sameSet(a: number[], b: number[], tol = 1e-6): boolean {
  if (a.length !== b.length) return false;
  const rest = b.slice();
  for (const x of a) {
    const i = rest.findIndex((y) => Math.abs(x - y) <= tol);
    if (i < 0) return false;
    rest.splice(i, 1);
  }
  return true;
}

function subsetOf(given: number[], expected: number[], tol = 1e-6): boolean {
  return given.every((g) => expected.some((e) => Math.abs(g - e) <= tol));
}

/**
 * Diagnostique une réponse "racines" fausse. `given` : valeurs numériques
 * fournies par l'élève (déjà analysées). Retourne null si la réponse est juste.
 */
export function diagnoseRoots(q: Quadratic, given: number[], tol = 1e-6): Diagnosis | null {
  const expected = roots(q);
  if (sameSet(given, expected, tol)) return null;

  const a = toNumber(q.a);
  const b = toNumber(q.b);

  // 1. Oubli du ± : une seule des deux racines (et rien d'autre)
  if (expected.length === 2 && given.length === 1 && subsetOf(given, expected, tol)) {
    return {
      type: 'oubli_pm',
      message:
        "Tu n'as donné qu'une racine. Comme Δ > 0, il y a deux solutions : le ± de la formule donne une racine avec « + » et une avec « − ».",
    };
  }

  // 2. Signe de b : racines de ax² − bx + c (c'est ce qu'on obtient avec +b)
  if (!isZero(q.b)) {
    const wrongB = quad(q.a, neg(q.b), q.c);
    const cand = roots(wrongB);
    if (cand.length > 0 && (sameSet(given, cand, tol) || (given.length === 1 && subsetOf(given, cand, tol)))) {
      const bTxt = b < 0 ? `b = ${b}, donc −b = ${-b}` : `b = ${b}, donc −b = ${-b}`;
      return {
        type: 'signe_b',
        message: `Attention au signe de b dans la formule : x = (−b ± √Δ) / 2a. Ici ${bTxt}. Tu as pris le signe contraire.`,
      };
    }
  }

  // 3. Oubli de diviser par 2a : (−b ± √Δ)
  if (expected.length > 0) {
    const cand = expected.map((r) => r * 2 * a);
    if (sameSet(given, cand, tol) || (given.length === 1 && subsetOf(given, cand, tol))) {
      return {
        type: 'oubli_2a',
        message: `Tu as oublié de diviser par 2a. Ici 2a = ${2 * a} : la formule est x = (−b ± √Δ) / 2a, tout le numérateur est divisé par ${2 * a}.`,
      };
    }
    // Variante : divisé par a seulement
    const candA = expected.map((r) => r * 2);
    if (a !== 0.5 && (sameSet(given, candA, tol) || (given.length === 1 && subsetOf(given, candA, tol)))) {
      return {
        type: 'oubli_2a',
        message: `Tu as divisé par a au lieu de 2a. Le dénominateur de la formule est 2a = ${2 * a}.`,
      };
    }
  }

  // 4. Δ mal calculé : Δ' = b² + 4ac (erreur de signe la plus courante)
  const c = toNumber(q.c);
  const wrongDelta = b * b + 4 * a * c;
  if (wrongDelta >= 0) {
    const s = Math.sqrt(wrongDelta);
    const cand = wrongDelta === 0 ? [-b / (2 * a)] : [(-b - s) / (2 * a), (-b + s) / (2 * a)];
    if (sameSet(given, cand, tol) || (given.length === 1 && subsetOf(given, cand, tol))) {
      return {
        type: 'delta',
        message: `Ton Δ est faux : Δ = b² − 4ac, avec un « moins ». Ici Δ = ${b}² − 4·(${a})·(${c}) = ${toNumber(discriminant(q))}.`,
      };
    }
  }

  // 5. Δ négatif mais l'élève a donné des racines quand même
  if (expected.length === 0 && given.length > 0) {
    return {
      type: 'delta',
      message: `Ici Δ = ${toNumber(discriminant(q))} < 0 : on ne peut pas prendre la racine carrée d'un nombre négatif, il n'y a pas de solution dans ℝ.`,
    };
  }

  // 6. L'élève dit "pas de solution" alors qu'il y en a
  if (given.length === 0 && expected.length > 0) {
    return {
      type: 'delta',
      message: `Il y a pourtant des solutions : Δ = ${toNumber(discriminant(q))} ≥ 0. Recalcule Δ = b² − 4ac.`,
    };
  }

  return {
    type: 'autre',
    message: "Ce n'est pas la bonne réponse. Reprends le calcul étape par étape : Δ, puis √Δ, puis x = (−b ± √Δ) / 2a.",
  };
}

/** Diagnostique une valeur de Δ fausse (calcul de tête). */
export function diagnoseDelta(q: Quadratic, givenDelta: number): Diagnosis | null {
  const { a, b, c } = integerForm(q);
  const d = b * b - 4 * a * c;
  if (givenDelta === d) return null;
  if (givenDelta === b * b + 4 * a * c) {
    return { type: 'delta', message: 'Δ = b² − 4ac : c\'est un « moins » devant 4ac.' };
  }
  if (b < 0 && givenDelta === -(b * b) - 4 * a * c) {
    return {
      type: 'signe_b',
      message: `b = ${b} est négatif, mais b² = (${b})² = ${b * b} est positif : un carré est toujours positif.`,
    };
  }
  if (givenDelta === 2 * b - 4 * a * c) {
    return { type: 'delta', message: `b² signifie b × b = ${b} × ${b} = ${b * b}, et non 2b.` };
  }
  if (givenDelta === b * b - a * c) {
    return { type: 'delta', message: "N'oublie pas le facteur 4 : Δ = b² − 4ac." };
  }
  if (givenDelta === b * b - 4 * a + c || givenDelta === b * b - 4 * (a + c)) {
    return { type: 'delta', message: '4ac est un produit : 4 × a × c.' };
  }
  return { type: 'delta', message: `Δ = b² − 4ac = (${b})² − 4·(${a})·(${c}) = ${d}.` };
}

/** Diagnostique une réponse "nombre de solutions" fausse. */
export function diagnoseCount(q: Quadratic, givenCount: number): Diagnosis | null {
  const d = toNumber(discriminant(q));
  const expected = d > 0 ? 2 : d === 0 ? 1 : 0;
  if (givenCount === expected) return null;
  const msg =
    expected === 2
      ? `Δ = ${d} > 0 : deux solutions distinctes.`
      : expected === 1
        ? `Δ = ${d} = 0 : une seule solution (double).`
        : `Δ = ${d} < 0 : pas de solution dans ℝ.`;
  return { type: 'delta', message: msg };
}
