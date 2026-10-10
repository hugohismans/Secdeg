import { describe, it, expect } from 'vitest';
import katex from 'katex';
import { STORY_CHAPTERS } from './chapters';
import { CHARACTERS } from './characters';
import type { Beat, Line } from './types';
import { symbolicSteps, checkBoard } from '../puzzle/logic';
import { roots } from '../../math/quadratic';
import { toNumber } from '../../math/fraction';

/** tous les textes d'un bloc (répliques comprises) */
function texts(b: Beat): string[] {
  const lines = (ls?: Line[]) => (ls ?? []).map((l) => l.text);
  switch (b.kind) {
    case 'place':
    case 'narr':
    case 'say':
      return [b.text];
    case 'math':
      return [b.words ?? ''];
    case 'choice':
      return [b.prompt, b.hint ?? '', ...b.options.flatMap((o) => [o.label, ...lines(o.reply)])];
    case 'input':
      return [b.prompt, ...b.hints, ...lines(b.success)];
    case 'tablet':
      return [b.prompt ?? ''];
    case 'solver':
    case 'puzzle':
    case 'lance':
      return [b.intro ?? ''];
    case 'rapidite':
      return [b.intro ?? '', ...lines(b.retry)];
    case 'explorer':
      return [b.prompt];
    default:
      return [];
  }
}

function speakers(b: Beat): string[] {
  const ls: Line[] = [];
  if (b.kind === 'say') ls.push({ who: b.who, text: b.text });
  if (b.kind === 'choice') b.options.forEach((o) => ls.push(...(o.reply ?? [])));
  if (b.kind === 'input') ls.push(...(b.success ?? []));
  if (b.kind === 'rapidite') ls.push(...b.retry);
  return ls.map((l) => l.who);
}

const all = STORY_CHAPTERS.flatMap((c) => c.beats.map((b) => ({ c: c.n, b })));

describe('histoire : structure', () => {
  it('sept chapitres numérotés de 1 à 7', () => {
    expect(STORY_CHAPTERS.map((c) => c.n)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    STORY_CHAPTERS.forEach((c) => {
      expect(c.title.length).toBeGreaterThan(3);
      expect(c.beats.length).toBeGreaterThan(8);
      expect(c.beats[0].kind).toBe('place');
    });
  });

  it('les personnages existent', () => {
    for (const { b } of all) for (const w of speakers(b)) expect(w === 'narr' || w in CHARACTERS, w).toBe(true);
  });

  it('les choix sont bien formés', () => {
    for (const { c, b } of all) {
      if (b.kind !== 'choice') continue;
      expect(b.options.length, `ch${c}: ${b.prompt}`).toBeGreaterThanOrEqual(2);
      const oks = b.options.filter((o) => o.ok).length;
      expect(oks, `ch${c}: ${b.prompt}`).toBeLessThanOrEqual(1);
      // un choix avec une bonne réponse doit proposer une piste pour Sifr
      if (oks === 1 && b.options.length > 2) expect(b.hint, `ch${c}: ${b.prompt}`).toBeTruthy();
    }
  });

  it('les saisies ont une réponse et des pistes', () => {
    for (const { c, b } of all) {
      if (b.kind !== 'input') continue;
      expect(b.expected.length, `ch${c}`).toBeGreaterThan(0);
      b.expected.forEach((v) => expect(Number.isFinite(v)).toBe(true));
      expect(b.hints.length, `ch${c}`).toBeGreaterThan(0);
    }
  });

  it('la ponctuation des segments LaTeX est équilibrée', () => {
    for (const { c, b } of all) for (const t of texts(b)) expect((t.match(/\$/g) ?? []).length % 2, `ch${c}: ${t}`).toBe(0);
  });

  it('toutes les formules se rendent avec KaTeX', () => {
    const render = (tex: string) => katex.renderToString(tex, { throwOnError: true, strict: false });
    for (const { c, b } of all) {
      for (const t of texts(b)) {
        for (const m of t.matchAll(/\$([^$]+)\$/g)) expect(() => render(m[1]), `ch${c}: ${m[1]}`).not.toThrow();
      }
      if (b.kind === 'math' && b.tex) expect(() => render(b.tex!), `ch${c}: ${b.tex}`).not.toThrow();
    }
  });
});

describe('histoire : mathématiques', () => {
  it('les problèmes du solveur ont des racines cohérentes', () => {
    for (const { b } of all) {
      if (b.kind !== 'solver') continue;
      const steps = symbolicSteps(b.q);
      expect(steps[steps.length - 1].expected).toEqual(roots(b.q));
    }
  });

  it('le problème du marchand donne 3 (et −8)', () => {
    const s = all.find(({ c, b }) => c === 4 && b.kind === 'solver');
    expect(s && s.b.kind === 'solver' && roots(s.b.q)).toEqual([-8, 3]);
  });

  it('x² + 21 = 10x a pour racines 3 et 7', () => {
    const s = all.find(({ c, b }) => c === 5 && b.kind === 'solver');
    expect(s && s.b.kind === 'solver' && roots(s.b.q)).toEqual([3, 7]);
  });

  it('la cour du palais se carrelle', () => {
    const p = all.find(({ b }) => b.kind === 'puzzle');
    expect(p && p.b.kind === 'puzzle').toBeTruthy();
    if (p && p.b.kind === 'puzzle') {
      const b = toNumber(p.b.level.q.b);
      expect(b % 2).toBe(0);
      const h = b / 2;
      expect(checkBoard({ b, rhs: -toNumber(p.b.level.q.c), right: h, bottom: h, units: h * h }).ok).toBe(true);
    }
  });

  it('le calife exige un score atteignable', () => {
    for (const { b } of all) if (b.kind === 'rapidite') expect(b.minCorrect).toBeLessThanOrEqual(b.total);
  });
});
