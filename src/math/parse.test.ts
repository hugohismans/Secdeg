import { describe, it, expect } from 'vitest';
import { parseNumber, writtenDecimals, splitValues } from './parse';

describe('parseNumber', () => {
  it('entiers et décimaux (virgule ou point)', () => {
    expect(parseNumber('3')).toBe(3);
    expect(parseNumber('-3')).toBe(-3);
    expect(parseNumber(' 2,5 ')).toBe(2.5);
    expect(parseNumber('2.5')).toBe(2.5);
    expect(parseNumber('−3')).toBe(-3); // signe moins typographique
  });
  it('fractions', () => {
    expect(parseNumber('1/2')).toBe(0.5);
    expect(parseNumber('-1/2')).toBe(-0.5);
    expect(parseNumber('-3/4')).toBe(-0.75);
    expect(parseNumber('(1)/(2)')).toBe(0.5);
  });
  it('racines', () => {
    expect(parseNumber('√5')).toBeCloseTo(Math.sqrt(5), 12);
    expect(parseNumber('sqrt(5)')).toBeCloseTo(Math.sqrt(5), 12);
    expect(parseNumber('racine(9)')).toBe(3);
    expect(parseNumber('2√3')).toBeCloseTo(2 * Math.sqrt(3), 12);
    expect(parseNumber('-2√3')).toBeCloseTo(-2 * Math.sqrt(3), 12);
    expect(parseNumber('(1+√5)/2')).toBeCloseTo((1 + Math.sqrt(5)) / 2, 12);
    expect(parseNumber('(-1-√5)/2')).toBeCloseTo((-1 - Math.sqrt(5)) / 2, 12);
    expect(parseNumber('1-2√2')).toBeCloseTo(1 - 2 * Math.sqrt(2), 12);
    expect(parseNumber('3 - √2')).toBeCloseTo(3 - Math.sqrt(2), 12);
  });
  it('priorités', () => {
    expect(parseNumber('1+2*3')).toBe(7);
    expect(parseNumber('(1+2)*3')).toBe(9);
    expect(parseNumber('2^3')).toBe(8);
    expect(parseNumber('-2^2')).toBe(-4);
    expect(parseNumber('√(1+8)')).toBe(3);
  });
  it('rejette le non-sens', () => {
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('1/0')).toBeNull();
    expect(parseNumber('√-4')).toBeNull();
    expect(parseNumber('1,2,3')).toBeNull();
    expect(parseNumber('(1+2')).toBeNull();
    expect(parseNumber('x')).toBeNull();
    expect(parseNumber('2+')).toBeNull();
  });
});

describe('writtenDecimals', () => {
  it('compte les décimales écrites', () => {
    expect(writtenDecimals('2,50')).toBe(2);
    expect(writtenDecimals('-1.618')).toBe(3);
    expect(writtenDecimals('3')).toBe(0);
    expect(writtenDecimals('1/3')).toBe(0);
  });
});

describe('splitValues', () => {
  it('sépare les réponses multiples', () => {
    expect(splitValues('2 ; -3')).toEqual(['2', '-3']);
    expect(splitValues('2 et -3')).toEqual(['2', '-3']);
    expect(splitValues('2 ou -3')).toEqual(['2', '-3']);
    expect(splitValues('2, -3')).toEqual(['2', '-3']);
    expect(splitValues('{2 ; -3}')).toEqual(['2', '-3']);
    expect(splitValues('2,5')).toEqual(['2,5']);
    expect(splitValues('2,5 ; 1,5')).toEqual(['2,5', '1,5']);
    expect(splitValues('')).toEqual([]);
  });
});
