<script lang="ts">
  /**
   * Scène des fontaines : le jet d'eau suit exactement y = ax² + bx + c.
   * Bassins = points d'atterrissage (racines), anneaux = cibles, repère vert = sommet imposé.
   */
  import { onDestroy } from 'svelte';
  import { COLORS, LANCE } from '../../config';
  import type { LanceLevel } from './levels';
  import { hitsTarget, rootsOf } from './logic';

  interface Props {
    a: number;
    b: number;
    c: number;
    level: LanceLevel;
    /** change de valeur pour déclencher un tir */
    shotId: number;
    onshotend?: () => void;
  }
  let { a, b, c, level, shotId, onshotend }: Props = $props();

  const W = 640;
  const H = 440;
  const PAD = 28;
  const xMin: number = LANCE.xMin;
  const xMax: number = LANCE.xMax;
  const yMin: number = LANCE.yMin;
  const yMax: number = LANCE.yMax;
  const sx = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD);
  const unit = (W - 2 * PAD) / (xMax - xMin);
  const f = (x: number) => a * x * x + b * x + c;

  function pathBetween(x0: number, x1: number): string {
    const n = 160;
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = Math.max(yMin - 30, Math.min(yMax + 30, f(x)));
      pts.push(`${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  let roots = $derived(a === 0 ? [] : rootsOf(a, b, c));
  /** le jet sort de la buse : la première racine si elle est visible, sinon le bord gauche */
  let startX = $derived(roots.length > 0 && roots[0] >= xMin && roots[0] <= xMax && a < 0 ? roots[0] : xMin);
  let fullPath = $derived(pathBetween(xMin, xMax));

  // animation du tir
  let flying = $state(false);
  let headX = $state(xMin);
  let hit = $state<boolean[]>([]);
  let raf: number | undefined;
  let lastShot = -1;

  $effect(() => {
    if (shotId === lastShot || shotId === 0) return;
    lastShot = shotId;
    startShot();
  });

  function startShot() {
    if (raf !== undefined) cancelAnimationFrame(raf);
    flying = true;
    headX = startX;
    hit = level.targets.map(() => false);
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      headX = Math.min(xMax, headX + LANCE.unitsPerSecond * dt);
      hit = level.targets.map((t, i) => hit[i] || (headX >= t.x && hitsTarget(a, b, c, t)));
      if (headX >= xMax) {
        flying = false;
        raf = undefined;
        onshotend?.();
      } else raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  onDestroy(() => {
    if (raf !== undefined) cancelAnimationFrame(raf);
  });

  let headY = $derived(Math.max(yMin, Math.min(yMax, f(headX))));
  let headVisible = $derived(f(headX) >= yMin - 0.5 && f(headX) <= yMax + 0.5);
  let flownPath = $derived(flying ? pathBetween(startX, headX) : '');
  let xTicks = $derived.by(() => {
    const t: number[] = [];
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) t.push(x);
    return t;
  });
  let yTicks = $derived.by(() => {
    const t: number[] = [];
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) if (y !== 0 && y % 2 === 0) t.push(y);
    return t;
  });
  const ground = sy(0);
</script>

<svg viewBox="0 0 {W} {H}" class="scene" role="img" aria-label="Le jardin des fontaines">
  <defs>
    <clipPath id="clip-scene"><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} /></clipPath>
    <pattern id="pave" width="24" height="12" patternUnits="userSpaceOnUse">
      <rect width="24" height="12" fill={COLORS.paper} />
      <path d="M0 0 H24 M0 6 H24 M6 0 V6 M18 6 V12" stroke={COLORS.rule} stroke-width="1" />
    </pattern>
  </defs>
  <rect width={W} height={H} fill={COLORS.glaze} rx="10" />
  <!-- quadrillage léger -->
  <g stroke="#efe5cf" stroke-width="1">
    {#each xTicks as x}<line x1={sx(x)} y1={PAD} x2={sx(x)} y2={H - PAD} />{/each}
    {#each yTicks as y}<line x1={PAD} y1={sy(y)} x2={W - PAD} y2={sy(y)} />{/each}
  </g>
  <!-- pavement sous le sol -->
  <rect x={PAD} y={ground} width={W - 2 * PAD} height={H - PAD - ground} fill="url(#pave)" />
  <line x1={PAD} y1={ground} x2={W - PAD} y2={ground} stroke={COLORS.ink} stroke-width="2" />
  <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} stroke={COLORS.rule} stroke-width="1.5" />
  <g font-size="11" fill={COLORS.inkSoft} text-anchor="middle">
    {#each xTicks as x}{#if x % 2 === 0 && x !== 0}<text x={sx(x)} y={ground + 14}>{x}</text>{/if}{/each}
    {#each yTicks as y}<text x={sx(0) - 8} y={sy(y) + 4} text-anchor="end">{y}</text>{/each}
  </g>

  <!-- bassins (points d'atterrissage) -->
  {#each level.landings as x}
    <g>
      <path d="M{sx(x) - 22},{ground} Q{sx(x)},{ground + 22} {sx(x) + 22},{ground} Z" fill="#b9cfd6" stroke={COLORS.x2} stroke-width="2" />
      <path d="M{sx(x) - 24},{ground} H{sx(x) + 24}" stroke={COLORS.ink} stroke-width="3" stroke-linecap="round" />
      <text x={sx(x)} y={ground + 36} font-size="12" fill={COLORS.x2} text-anchor="middle" font-weight="700">x = {x}</text>
    </g>
  {/each}

  <!-- sommet imposé -->
  {#if level.vertex}
    {#if level.vertex.x !== undefined && level.vertex.y !== undefined}
      <g stroke={COLORS.vertex} stroke-width="2" stroke-dasharray="4 3">
        <line x1={sx(level.vertex.x) - 12} y1={sy(level.vertex.y)} x2={sx(level.vertex.x) + 12} y2={sy(level.vertex.y)} />
        <line x1={sx(level.vertex.x)} y1={sy(level.vertex.y) - 12} x2={sx(level.vertex.x)} y2={sy(level.vertex.y) + 12} />
      </g>
      <text x={sx(level.vertex.x) + 14} y={sy(level.vertex.y) - 8} font-size="12" fill={COLORS.vertex} font-weight="700">S({level.vertex.x} ; {level.vertex.y})</text>
    {:else if level.vertex.y !== undefined}
      <line x1={PAD} y1={sy(level.vertex.y)} x2={W - PAD} y2={sy(level.vertex.y)} stroke={COLORS.vertex} stroke-width="2" stroke-dasharray="6 4" />
      <text x={W - PAD - 4} y={sy(level.vertex.y) - 6} font-size="12" fill={COLORS.vertex} text-anchor="end" font-weight="700">hauteur du jet = {level.vertex.y}</text>
    {:else if level.vertex.x !== undefined}
      <line x1={sx(level.vertex.x)} y1={PAD} x2={sx(level.vertex.x)} y2={H - PAD} stroke={COLORS.vertex} stroke-width="2" stroke-dasharray="6 4" />
    {/if}
  {/if}

  <!-- trajectoire prévue et jet -->
  <path d={fullPath} fill="none" stroke={COLORS.curve} stroke-width="2" stroke-dasharray="5 5" opacity="0.4" clip-path="url(#clip-scene)" />
  {#if flying}
    <path d={flownPath} fill="none" stroke="#8fb3c9" stroke-width="7" stroke-linecap="round" opacity="0.55" clip-path="url(#clip-scene)" />
    <path d={flownPath} fill="none" stroke={COLORS.curve} stroke-width="2.5" clip-path="url(#clip-scene)" />
    {#if headVisible}
      <path d="M0,-9 C5,-2 6,3 0,6 C-6,3 -5,-2 0,-9 Z" transform="translate({sx(headX)} {sy(headY)})" fill={COLORS.curve} stroke={COLORS.glaze} stroke-width="1.5" />
    {/if}
  {/if}

  <!-- anneaux à traverser -->
  {#each level.targets as t, i}
    {@const h = hit[i]}
    <g class="target" class:hit={h}>
      <circle cx={sx(t.x)} cy={sy(t.y)} r={LANCE.hitTolerance * unit + 6} fill="none" stroke={h ? COLORS.ok : COLORS.target} stroke-width="5" />
      <circle cx={sx(t.x)} cy={sy(t.y)} r={LANCE.hitTolerance * unit + 6} fill="none" stroke={COLORS.glaze} stroke-width="1.2" stroke-dasharray="3 3" />
      <text x={sx(t.x) + 18} y={sy(t.y) - 12} font-size="12" fill={h ? COLORS.ok : COLORS.target} font-weight="700">({t.x} ; {t.y})</text>
    </g>
  {/each}

  <!-- buse de la fontaine -->
  {#if startX > xMin}
    <g transform="translate({sx(startX)} {ground})">
      <rect x="-7" y="-10" width="14" height="10" fill={COLORS.bx} stroke={COLORS.ink} stroke-width="1.5" />
      <rect x="-3" y="-15" width="6" height="5" fill={COLORS.ink} />
    </g>
  {/if}
</svg>

<style>
  .scene {
    width: 100%;
    border-radius: 10px;
    border: 1px solid var(--filet);
    user-select: none;
    -webkit-user-select: none;
  }
  .target.hit {
    animation: pop 0.4s ease-out;
    transform-box: fill-box;
    transform-origin: center;
  }
  @keyframes pop {
    50% {
      transform: scale(1.3);
    }
  }
</style>
