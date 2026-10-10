/** Vérification d'un tir (sans Svelte, testable). */
import { LANCE } from '../../config';
import type { LanceLevel, Point } from './levels';

export interface ShotResult {
  ok: boolean;
  targetsHit: boolean[];
  landingsOk: boolean[];
  vertexOk: boolean;
  /** explication en cas d'échec */
  message: string;
}

function yAt(a: number, b: number, c: number, x: number): number {
  return a * x * x + b * x + c;
}

/** Une cible est touchée si la courbe passe à moins de `tol` (distance verticale). */
export function hitsTarget(a: number, b: number, c: number, t: Point, tol = LANCE.hitTolerance): boolean {
  return Math.abs(yAt(a, b, c, t.x) - t.y) <= tol;
}

export function rootsOf(a: number, b: number, c: number): number[] {
  if (a === 0) return b === 0 ? [] : [-c / b];
  const d = b * b - 4 * a * c;
  if (d < 0) return [];
  const s = Math.sqrt(d);
  return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((p, q) => p - q);
}

export function checkShot(level: LanceLevel, a: number, b: number, c: number, tol = LANCE.hitTolerance): ShotResult {
  const targetsHit = level.targets.map((t) => hitsTarget(a, b, c, t, tol));
  const roots = rootsOf(a, b, c);
  const landingsOk = level.landings.map((x) => roots.some((r) => Math.abs(r - x) <= tol));
  // atterrir "exactement" : pas de racine parasite dans la zone visible
  const extraRoot = level.landings.length > 0 && roots.some((r) => !level.landings.some((x) => Math.abs(r - x) <= tol) && r >= LANCE.xMin && r <= LANCE.xMax);
  let vertexOk = true;
  if (level.vertex && a !== 0) {
    const vx = -b / (2 * a);
    const vy = c - (b * b) / (4 * a);
    if (level.vertex.x !== undefined && Math.abs(vx - level.vertex.x) > tol) vertexOk = false;
    if (level.vertex.y !== undefined && Math.abs(vy - level.vertex.y) > tol) vertexOk = false;
  } else if (level.vertex) vertexOk = false;

  const msgs: string[] = [];
  if (a === 0) msgs.push('Avec a = 0 la trajectoire est une droite, pas une parabole.');
  targetsHit.forEach((h, i) => {
    if (!h) {
      const t = level.targets[i];
      const y = yAt(a, b, c, t.x);
      msgs.push(`En x = ${t.x}, la courbe est à la hauteur ${fmt(y)} au lieu de ${t.y} (${y > t.y ? 'trop haut' : 'trop bas'}).`);
    }
  });
  if (level.landings.length > 0) {
    const missing = level.landings.filter((_, i) => !landingsOk[i]);
    if (missing.length > 0 || extraRoot) {
      msgs.push(
        roots.length === 0
          ? 'La courbe ne touche pas le sol : Δ < 0.'
          : `Le projectile touche le sol en ${roots.map(fmt).join(' et ')} au lieu de ${level.landings.join(' et ')}.`,
      );
    }
  }
  if (!vertexOk && a !== 0) {
    const vx = -b / (2 * a);
    const vy = c - (b * b) / (4 * a);
    msgs.push(`Le sommet est en (${fmt(vx)} ; ${fmt(vy)}).`);
  }
  const ok = targetsHit.every(Boolean) && landingsOk.every(Boolean) && !extraRoot && vertexOk && a !== 0;
  return { ok, targetsHit, landingsOk, vertexOk, message: msgs.join(' ') };
}

export function fmt(v: number): string {
  return (Math.round(v * 100) / 100).toString().replace('.', ',');
}

export function starsForShots(shots: number): number {
  const [s3, s2, s1] = LANCE.starsByShots;
  if (shots <= s3) return 3;
  if (shots <= s2) return 2;
  if (shots <= s1) return 1;
  return 1;
}
