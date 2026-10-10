import { describe, it, expect } from 'vitest';
import { frac, add, sub, mul, div, fromNumber, toLatex, toString, eq, neg, sq, toDecimalString, gcd, lcm } from './fraction';

describe('fraction', () => {
  it('réduit et normalise le signe', () => {
    expect(frac(2, 4)).toEqual({ n: 1, d: 2 });
    expect(frac(3, -6)).toEqual({ n: -1, d: 2 });
    expect(frac(0, -5)).toEqual({ n: 0, d: 1 });
    expect(frac(-4, -2)).toEqual({ n: 2, d: 1 });
  });
  it('refuse le dénominateur nul', () => {
    expect(() => frac(1, 0)).toThrow();
  });
  it('convertit les décimaux', () => {
    expect(fromNumber(0.5)).toEqual({ n: 1, d: 2 });
    expect(fromNumber(-1.25)).toEqual({ n: -5, d: 4 });
    expect(fromNumber(3)).toEqual({ n: 3, d: 1 });
    expect(frac(1.5, 1)).toEqual({ n: 3, d: 2 });
  });
  it('opère exactement', () => {
    expect(add(frac(1, 2), frac(1, 3))).toEqual(frac(5, 6));
    expect(sub(frac(1, 2), frac(1, 3))).toEqual(frac(1, 6));
    expect(mul(frac(2, 3), frac(3, 4))).toEqual(frac(1, 2));
    expect(div(frac(2, 3), frac(4, 3))).toEqual(frac(1, 2));
    expect(neg(frac(1, 2))).toEqual(frac(-1, 2));
    expect(sq(frac(-3, 2))).toEqual(frac(9, 4));
    expect(eq(frac(2, 4), frac(1, 2))).toBe(true);
  });
  it('affiche en LaTeX et en texte', () => {
    expect(toLatex(frac(3))).toBe('3');
    expect(toLatex(frac(-3, 4))).toBe('-\\frac{3}{4}');
    expect(toLatex(frac(1, 2))).toBe('\\frac{1}{2}');
    expect(toString(frac(-1, 2))).toBe('-1/2');
    expect(toDecimalString(1.6180339)).toBe('1,62');
    expect(toDecimalString(2)).toBe('2');
  });
  it('gcd / lcm', () => {
    expect(gcd(12, 18)).toBe(6);
    expect(gcd(0, 5)).toBe(5);
    expect(lcm(4, 6)).toBe(12);
  });
});
