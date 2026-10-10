/**
 * Analyse de la saisie de l'élève : "-3", "2,5", "1/2", "-1/2", "√5",
 * "sqrt(5)", "(1+√5)/2", "3-2√2", "2*3", "(-1-√5)/2", "±" interdit ici.
 * Retourne un nombre, ou null si la saisie n'est pas comprise.
 */

type Tok = { t: 'num'; v: number } | { t: 'op'; v: string } | { t: 'sqrt' } | { t: 'lp' } | { t: 'rp' };

function tokenize(input: string): Tok[] | null {
  const s = input
    .trim()
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '*')
    .replace(/÷|:/g, '/')
    .replace(/sqrt|racine|rac|√/gi, '√')
    .toLowerCase();
  const toks: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const txt = s.slice(i, j);
      if ((txt.match(/\./g) ?? []).length > 1) return null;
      const v = Number(txt);
      if (!Number.isFinite(v)) return null;
      toks.push({ t: 'num', v });
      i = j;
      continue;
    }
    if (ch === '√') {
      toks.push({ t: 'sqrt' });
      i++;
      continue;
    }
    if (ch === '(' || ch === '[') {
      toks.push({ t: 'lp' });
      i++;
      continue;
    }
    if (ch === ')' || ch === ']') {
      toks.push({ t: 'rp' });
      i++;
      continue;
    }
    if ('+-*/^'.includes(ch)) {
      toks.push({ t: 'op', v: ch });
      i++;
      continue;
    }
    return null;
  }
  return toks;
}

/**
 * Grammaire :
 *   expr   := term (('+'|'-') term)*
 *   term   := unary (('*'|'/') unary | juxtaposition)*
 *   unary  := '-' unary | '+' unary | power
 *   power  := atom ('^' unary)?
 *   atom   := number | '√' atom | '(' expr ')'
 * Juxtaposition : "2√3" = 2*√3, "2(3)" = 2*3.
 */
class Parser {
  private i = 0;
  constructor(private toks: Tok[]) {}

  private peek(): Tok | undefined {
    return this.toks[this.i];
  }
  private next(): Tok | undefined {
    return this.toks[this.i++];
  }

  parse(): number | null {
    if (this.toks.length === 0) return null;
    const v = this.expr();
    if (v === null || this.i !== this.toks.length) return null;
    return v;
  }

  private expr(): number | null {
    let v = this.term();
    if (v === null) return null;
    for (;;) {
      const p = this.peek();
      if (p && p.t === 'op' && (p.v === '+' || p.v === '-')) {
        this.next();
        const r = this.term();
        if (r === null) return null;
        v = p.v === '+' ? v + r : v - r;
      } else return v;
    }
  }

  private term(): number | null {
    let v = this.unary();
    if (v === null) return null;
    for (;;) {
      const p = this.peek();
      if (p && p.t === 'op' && (p.v === '*' || p.v === '/')) {
        this.next();
        const r = this.unary();
        if (r === null) return null;
        if (p.v === '/') {
          if (r === 0) return null;
          v = v / r;
        } else v = v * r;
      } else if (p && (p.t === 'sqrt' || p.t === 'lp')) {
        // juxtaposition : 2√3, 2(1+√5)
        const r = this.power();
        if (r === null) return null;
        v = v * r;
      } else return v;
    }
  }

  private unary(): number | null {
    const p = this.peek();
    if (p && p.t === 'op' && (p.v === '-' || p.v === '+')) {
      this.next();
      const v = this.unary();
      if (v === null) return null;
      return p.v === '-' ? -v : v;
    }
    return this.power();
  }

  private power(): number | null {
    const base = this.atom();
    if (base === null) return null;
    const p = this.peek();
    if (p && p.t === 'op' && p.v === '^') {
      this.next();
      const e = this.unary();
      if (e === null) return null;
      return Math.pow(base, e);
    }
    return base;
  }

  private atom(): number | null {
    const t = this.next();
    if (!t) return null;
    if (t.t === 'num') return t.v;
    if (t.t === 'sqrt') {
      const v = this.atom();
      if (v === null || v < 0) return null;
      return Math.sqrt(v);
    }
    if (t.t === 'lp') {
      const v = this.expr();
      if (v === null) return null;
      const close = this.next();
      if (!close || close.t !== 'rp') return null;
      return v;
    }
    return null;
  }
}

/** Nombre lu, ou null si la saisie est vide ou incompréhensible. */
export function parseNumber(input: string): number | null {
  const toks = tokenize(input);
  if (!toks) return null;
  const v = new Parser(toks).parse();
  return v !== null && Number.isFinite(v) ? v : null;
}

/**
 * Nombre de décimales explicitement écrites par l'élève ("2,50" -> 2),
 * pour tolérer les arrondis. 0 si pas de décimale ou expression exacte.
 */
export function writtenDecimals(input: string): number {
  const m = input.trim().replace(',', '.').match(/^-?\d+\.(\d+)$/);
  return m ? m[1].length : 0;
}

/**
 * Sépare une saisie contenant plusieurs valeurs : "2 ; -3", "2 et -3",
 * "2, -3" (virgule suivie d'un espace ou d'un signe), "{2 ; -3}".
 */
export function splitValues(input: string): string[] {
  const cleaned = input.replace(/[{}]/g, '').trim();
  if (cleaned === '') return [];
  // ';' et 'et' et 'ou' sont des séparateurs sûrs ; la virgule ne l'est que
  // si elle est suivie d'un espace (sinon c'est une virgule décimale).
  return cleaned
    .split(/\s*;\s*|\s+(?:et|ou)\s+|,\s+(?=[-+(√\d])/i)
    .map((s) => s.trim())
    .filter((s) => s !== '');
}
