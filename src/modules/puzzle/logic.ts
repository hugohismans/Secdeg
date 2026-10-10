/**
 * Logique du puzzle de tuiles (sans Svelte, testable).
 * Plateau : un carré x², `right` bandes x à droite, `bottom` bandes x en
 * dessous, `units` tuiles unité dans le coin.
 */
import type { Quadratic } from '../../math/quadratic';
import { discriminant, roots, canonical, exactRoots } from '../../math/quadratic';
import { toNumber, toLatex, neg, sub as fsub, mul, frac, sq, div, add } from '../../math/fraction';
import { polyLatex, exactRootLatex, fracLatex } from '../../math/latex';

export interface Board {
  /** nombre total de bandes x (= b) */
  b: number;
  /** membre de droite initial (= −c) */
  rhs: number;
  right: number;
  bottom: number;
  units: number;
}

export function newBoard(q: Quadratic): Board {
  return { b: toNumber(q.b), rhs: -toNumber(q.c), right: 0, bottom: 0, units: 0 };
}

export function inPool(bd: Board): number {
  return bd.b - bd.right - bd.bottom;
}

export type BoardStatus =
  | { ok: true }
  | { ok: false; reason: 'pool' | 'unequal' | 'units' | 'corner-empty'; message: string };

/** Vérifie si le carré est correctement complété. */
export function checkBoard(bd: Board): BoardStatus {
  const half = bd.b / 2;
  if (inPool(bd) > 0) {
    return { ok: false, reason: 'pool', message: `Il reste ${inPool(bd)} bande${inPool(bd) > 1 ? 's' : ''} x à placer : toutes les bandes font partie de l'équation.` };
  }
  if (bd.right !== bd.bottom) {
    return {
      ok: false,
      reason: 'unequal',
      message: `La figure n'est pas un carré : ${bd.right} bande${bd.right > 1 ? 's' : ''} à droite et ${bd.bottom} en dessous. Il faut la même largeur des deux côtés : ${half} et ${half}.`,
    };
  }
  const need = bd.right * bd.bottom;
  if (bd.units === 0 && need > 0) {
    return { ok: false, reason: 'corner-empty', message: `Il manque le coin : un carré de ${bd.right} × ${bd.bottom} tuiles unité.` };
  }
  if (bd.units !== need) {
    return {
      ok: false,
      reason: 'units',
      message: `Le coin fait ${bd.right} × ${bd.bottom} = ${need} tuiles, tu en as mis ${bd.units}.`,
    };
  }
  return { ok: true };
}

/** Équation courante selon l'état du plateau, en LaTeX. */
export function boardEquation(bd: Board): string {
  const parts: string[] = ['x^2'];
  const placed = bd.right + bd.bottom;
  const pool = inPool(bd);
  if (bd.right > 0) parts.push(`${bd.right === 1 ? '' : bd.right}x`);
  if (bd.bottom > 0) parts.push(`${bd.bottom === 1 ? '' : bd.bottom}x`);
  if (pool > 0 && placed > 0) parts.push(`${pool === 1 ? '' : pool}x`);
  if (pool > 0 && placed === 0) parts.push(`${bd.b === 1 ? '' : bd.b}x`);
  if (bd.units > 0) parts.push(`${bd.units}`);
  const left = parts.join(' + ');
  const right = bd.units > 0 ? `${bd.rhs} + ${bd.units}` : `${bd.rhs}`;
  return `${left} = ${right}`;
}

/** Indices gradués pour un niveau "tuiles". */
export function tileHints(q: Quadratic): string[][] {
  const b = toNumber(q.b);
  const rhs = -toNumber(q.c);
  const h = b / 2;
  const total = rhs + h * h;
  const r = roots(q);
  return [
    ["Pour obtenir un carré, les bandes x doivent être réparties de la même façon à droite et en dessous du carré x²."],
    [`Mets ${h} bandes à droite et ${h} en dessous. Le coin manquant est alors un carré de ${h} × ${h} = ${h * h} tuiles unité.`],
    [
      `Correction : ${h} bandes de chaque côté, ${h * h} tuiles dans le coin, ajoutées aussi à droite.`,
      `$$x^2 + ${b}x + ${h * h} = ${rhs} + ${h * h}`,
      `$$(x + ${h})^2 = ${total}`,
      `$$x + ${h} = \\pm ${Math.sqrt(total)} \\quad\\Rightarrow\\quad x = ${r[1]} \\text{ ou } x = ${r[0]}`,
    ],
  ];
}

/** Étapes de la résolution symbolique guidée. */
export interface SymbolicStep {
  id: 'divide' | 'move-c' | 'corner' | 'square' | 'roots';
  prompt: string;
  /** LaTeX de l'équation avant l'étape */
  before: string;
  /** réponses attendues (valeurs numériques), dans l'ordre des champs */
  expected: number[];
  /** libellés des champs */
  fields: string[];
  /** LaTeX avec trous, "\\square" pour chaque champ */
  template: string;
  hints: string[][];
  /** LaTeX de l'équation après l'étape */
  after: string;
}

export function symbolicSteps(q: Quadratic): SymbolicStep[] {
  const steps: SymbolicStep[] = [];
  const a = q.a;
  const b = q.b;
  const c = q.c;
  const bOverA = div(b, a);
  const cOverA = div(c, a);
  const half = div(bOverA, frac(2)); // b/2a
  const corner = sq(half); // (b/2a)²
  const rhs0 = neg(cOverA); // −c/a
  const rhs1 = add(rhs0, corner); // Δ/4a²
  const d = discriminant(q);
  const L = toLatex;
  const eq0 = `${polyLatex(q)} = 0`;
  const eqMoved = `${polyLatex(quad1(a, b))} = ${L(neg(c))}`;
  const eqDiv = `${polyLatex(quad1(frac(1), bOverA))} = ${L(rhs0)}`;
  const eqCorner = `x^2 + ${term(bOverA)}x + ${L(corner)} = ${L(rhs0)} + ${L(corner)}`;
  const eqSquare = `\\left(x ${sgn(half)} ${L(absf(half))}\\right)^2 = ${L(rhs1)}`;

  steps.push({
    id: 'move-c',
    prompt: 'Mets le terme constant à droite.',
    before: eq0,
    expected: [toNumber(neg(c))],
    fields: ['membre de droite'],
    template: `${polyLatex(quad1(a, b))} = \\square`,
    hints: [
      ['Que vaut le membre de droite quand on fait passer c de l\'autre côté ?'],
      [`c = ${L(c)} passe à droite en changeant de signe.`],
      [`$$${eqMoved}`],
    ],
    after: eqMoved,
  });

  if (toNumber(a) !== 1) {
    steps.push({
      id: 'divide',
      prompt: `Divise tout par a = ${L(a)} pour avoir un vrai carré x².`,
      before: eqMoved,
      expected: [toNumber(bOverA), toNumber(rhs0)],
      fields: ['coefficient de x', 'membre de droite'],
      template: `x^2 + \\square\\, x = \\square`,
      hints: [
        ['Chaque terme, y compris le membre de droite, est divisé par a.'],
        [`b/a = ${L(b)}/${L(a)} et le membre de droite devient ${L(neg(c))}/${L(a)}.`],
        [`$$${eqDiv}`],
      ],
      after: eqDiv,
    });
  }

  steps.push({
    id: 'corner',
    prompt: 'Quel nombre faut-il ajouter des deux côtés pour compléter le carré ?',
    before: toNumber(a) !== 1 ? eqDiv : eqMoved,
    expected: [toNumber(corner)],
    fields: ['nombre à ajouter'],
    template: `x^2 + ${term(bOverA)}x + \\square = ${L(rhs0)} + \\square`,
    hints: [
      ['C\'est l\'aire du coin manquant : le carré de la moitié du coefficient de x.'],
      [`La moitié de ${L(bOverA)} est ${L(half)}. Le coin vaut (${L(half)})².`],
      [`$$\\left(${L(half)}\\right)^2 = ${L(corner)}`, `$$${eqCorner}`],
    ],
    after: eqCorner,
  });

  steps.push({
    id: 'square',
    prompt: 'Écris le membre de gauche comme un carré et calcule le membre de droite.',
    before: eqCorner,
    expected: [toNumber(half), toNumber(rhs1)],
    fields: ['nombre dans le carré', 'membre de droite'],
    template: `\\left(x + \\square\\right)^2 = \\square`,
    hints: [
      ['Le côté du grand carré est x + (moitié du coefficient de x). À droite, additionne les deux nombres.'],
      [`x + ${L(half)} ; à droite : ${L(rhs0)} + ${L(corner)}.`],
      [`$$${eqSquare}`],
    ],
    after: eqSquare,
  });

  const ex = exactRoots(q);
  const dn = toNumber(d);
  const rootsTex = ex.map((r) => exactRootLatex(r));
  steps.push({
    id: 'roots',
    prompt: dn < 0 ? 'Que peux-tu conclure ?' : 'Prends la racine carrée (sans oublier le ±) et isole x.',
    before: eqSquare,
    expected: roots(q),
    fields: ['solutions'],
    template: 'x = \\square',
    hints: [
      dn < 0
        ? ['Un carré peut-il être négatif ?']
        : ['Deux nombres opposés ont le même carré : il y a deux valeurs possibles pour x + ' + L(half) + '.'],
      dn < 0
        ? [`Le membre de droite vaut ${L(rhs1)} < 0 : aucun carré n'est négatif. (C'est Δ < 0.)`]
        : [`x ${sgn(half)} ${L(absf(half))} = \\pm\\sqrt{${L(rhs1)}}, puis soustrais ${L(half)} des deux côtés.`],
      dn < 0
        ? ['$$S = \\varnothing']
        : [`$$x = ${L(neg(half))} \\pm \\sqrt{${L(rhs1)}}`, `$$x_1 = ${rootsTex[0]}${rootsTex[1] ? `\\quad x_2 = ${rootsTex[1]}` : ''}`],
    ],
    after: dn < 0 ? 'S = \\varnothing' : `x_1 = ${rootsTex[0]}${rootsTex[1] ? `\\quad x_2 = ${rootsTex[1]}` : ''}`,
  });

  return steps;
}

// --- helpers ---
import type { Fraction } from '../../math/fraction';
function quad1(a: Fraction, b: Fraction): Quadratic {
  return { a, b, c: frac(0) };
}
function absf(f: Fraction): Fraction {
  return frac(Math.abs(f.n), f.d);
}
function sgn(f: Fraction): string {
  return f.n < 0 ? '-' : '+';
}
function term(coef: Fraction): string {
  if (coef.n === 1 && coef.d === 1) return '';
  if (coef.n === -1 && coef.d === 1) return '-';
  return fracLatex(coef);
}
// évite les imports inutilisés
void fsub; void mul; void canonical;
