import { describe, it, expect } from 'vitest';
import { polyLatex, equationLatex, exactRootLatex, sqrtLatex, decimalLatex, term, joinTerms } from './latex';
import { quad } from './quadratic';
import { frac } from './fraction';

describe('latex', () => {
  it('polynômes avec signes propres', () => {
    expect(polyLatex(quad(1, 6, -16))).toBe('x^2 + 6x - 16');
    expect(polyLatex(quad(-1, 0, 4))).toBe('-x^2 + 4');
    expect(polyLatex(quad(2, -1, 0))).toBe('2x^2 - x');
    expect(polyLatex(quad(1, 0, 0))).toBe('x^2');
    expect(polyLatex(quad(frac(1, 2), frac(-3, 4), 1))).toBe('\\frac{1}{2}x^2 - \\frac{3}{4}x + 1');
    expect(equationLatex(quad(3, 2, 1))).toBe('3x^2 + 2x + 1 = 0');
  });
  it('colorie les termes', () => {
    const s = polyLatex(quad(1, 6, -16), { colors: true });
    expect(s).toContain('\\textcolor{');
    expect(s).toMatch(/\\textcolor\{#[0-9a-f]{6}\}\{x\^2\} \+ \\textcolor\{#[0-9a-f]{6}\}\{6x\} - \\textcolor\{#[0-9a-f]{6}\}\{16\}/);
  });
  it('termes et assemblage', () => {
    expect(term(frac(0), 'x')).toBeNull();
    expect(joinTerms([null, null])).toBe('0');
    expect(joinTerms([term(frac(-1), 'x'), term(frac(3), '')])).toBe('-x + 3');
  });
  it('racines exactes', () => {
    expect(exactRootLatex({ num: -8, k: 0, r: 1, den: 1 })).toBe('-8');
    expect(exactRootLatex({ num: 1, k: 0, r: 1, den: 2 })).toBe('\\frac{1}{2}');
    expect(exactRootLatex({ num: 1, k: -1, r: 5, den: 2 })).toBe('\\frac{1 - \\sqrt{5}}{2}');
    expect(exactRootLatex({ num: 0, k: 2, r: 2, den: 1 })).toBe('2\\sqrt{2}');
    expect(exactRootLatex({ num: 0, k: -1, r: 3, den: 1 })).toBe('-\\sqrt{3}');
    expect(exactRootLatex({ num: -3, k: 2, r: 7, den: 4 })).toBe('\\frac{-3 + 2\\sqrt{7}}{4}');
  });
  it('racines carrées simplifiées', () => {
    expect(sqrtLatex(9)).toBe('3');
    expect(sqrtLatex(8)).toBe('2\\sqrt{2}');
    expect(sqrtLatex(5)).toBe('\\sqrt{5}');
  });
  it('décimaux à virgule', () => {
    expect(decimalLatex(1.61803)).toBe('1{,}62');
    expect(decimalLatex(2)).toBe('2');
  });
});
