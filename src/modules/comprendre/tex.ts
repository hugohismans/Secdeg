/** Raccourcis LaTeX colorés pour le module Comprendre (mêmes couleurs que le diagramme). */
import { COLORS } from '../../config';

export const HL_BG = '#fff3cd';

export const c = (color: string, s: string) => `\\textcolor{${color}}{${s}}`;
export const X2 = (s = 'x^2') => c(COLORS.x2, s);
export const BX = (s: string) => c(COLORS.bx, s);
export const CO = (s: string) => c(COLORS.corner, s);
export const CC = (s: string) => c(COLORS.c, s);
export const DL = (s: string) => c(COLORS.delta, s);
/** surbrillance du terme qui change */
export const hl = (s: string) => `\\colorbox{${HL_BG}}{$${s}$}`;

// Exemple numérique
// Le problème d'al-Khwârizmî : « un carré et dix racines égalent trente-neuf dirhams »
export const EX = {
  eq0: `${X2()} + ${BX('10x')} = ${CC('39')}`,
  eqCut: `${X2()} + ${BX('5x')} + ${BX('5x')} = ${CC('39')}`,
  eqCorner: `${X2()} + ${BX('10x')} + ${CO('25')} = ${CC('39')} + ${CO('25')}`,
  eqSquare: `(x + ${CO('5')})^2 = 64`,
};

/** étiquettes du diagramme pour l'exemple */
export const EX_LABELS = { x: 'x', half: '5', full: '10', corner: '25' };

// Cas général
export const GEN = {
  eq0: `${X2('ax^2')} + ${BX('bx')} + ${CC('c')} = 0`,
  eqMoveC: `${X2('ax^2')} + ${BX('bx')} = ${CC('-c')}`,
  eqDivA: `${X2()} + ${BX('\\frac{b}{a}x')} = ${CC('-\\frac{c}{a}')}`,
  eqCut: `${X2()} + ${BX('\\frac{b}{2a}x')} + ${BX('\\frac{b}{2a}x')} = ${CC('-\\frac{c}{a}')}`,
  eqCorner: `${X2()} + ${BX('\\frac{b}{a}x')} + ${CO('\\frac{b^2}{4a^2}')} = ${CC('-\\frac{c}{a}')} + ${CO('\\frac{b^2}{4a^2}')}`,
  eqSquare: `\\left(x + ${CO('\\frac{b}{2a}')}\\right)^2 = ${CO('\\frac{b^2}{4a^2}')} ${CC('- \\frac{c}{a}')}`,
  eqDelta: `\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{${DL('b^2 - 4ac')}}{4a^2} = \\frac{${DL('\\Delta')}}{4a^2}`,
  formula: `x = \\frac{-b \\pm \\sqrt{${DL('\\Delta')}}}{2a}`,
};
