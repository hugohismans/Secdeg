<script lang="ts">
  /** Scène du lance-parabole : sol, cibles, repères d'atterrissage, trajectoire animée. */
  import { onDestroy } from 'svelte';
  import { COLORS, LANCE } from '../../config';
  import type { LanceLevel } from './levels';
  import { hitsTarget } from './logic';

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
  const f = (x: number) => a * x * x + b * x + c;

  function pathUpTo(xEnd: number): string {
    const n = 160;
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const x = xMin + ((xMax - xMin) * i) / n;
      if (x > xEnd) break;
      const y = Math.max(yMin - 30, Math.min(yMax + 30, f(x)));
      pts.push(`${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  let fullPath = $derived(pathUpTo(xMax));

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
    headX = xMin;
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
  let flownPath = $derived(flying ? pathUpTo(headX) : '');
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
</script>

<svg viewBox="0 0 {W} {H}" class="scene" role="img" aria-label="Scène du lance-parabole">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e6f0ff" />
      <stop offset="1" stop-color="#ffffff" />
    </linearGradient>
    <clipPath id="clip-scene"><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} /></clipPath>
  </defs>
  <rect width={W} height={H} fill="url(#sky)" rx="10" />
  <!-- sol -->
  <rect x={PAD} y={sy(0)} width={W - 2 * PAD} height={H - PAD - sy(0)} fill="#f0fff4" />
  <g stroke="#e2e8f0" stroke-width="1">
    {#each xTicks as x}<line x1={sx(x)} y1={PAD} x2={sx(x)} y2={H - PAD} />{/each}
    {#each yTicks as y}<line x1={PAD} y1={sy(y)} x2={W - PAD} y2={sy(y)} />{/each}
  </g>
  <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} stroke="#2d3748" stroke-width="2" />
  <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} stroke="#a0aec0" stroke-width="1.5" />
  <g font-size="11" fill="#4a5568" text-anchor="middle">
    {#each xTicks as x}{#if x % 2 === 0 && x !== 0}<text x={sx(x)} y={sy(0) + 14}>{x}</text>{/if}{/each}
    {#each yTicks as y}<text x={sx(0) - 8} y={sy(y) + 4} text-anchor="end">{y}</text>{/each}
  </g>

  <!-- repères d'atterrissage -->
  {#each level.landings as x}
    <g>
      <line x1={sx(x)} y1={sy(0)} x2={sx(x)} y2={sy(0) - 26} stroke={COLORS.root} stroke-width="2" />
      <path d="M{sx(x)},{sy(0) - 26} l16,6 l-16,6 z" fill={COLORS.root} />
      <text x={sx(x)} y={sy(0) + 28} font-size="12" fill={COLORS.root} text-anchor="middle" font-weight="700">x = {x}</text>
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
      <text x={W - PAD - 4} y={sy(level.vertex.y) - 6} font-size="12" fill={COLORS.vertex} text-anchor="end" font-weight="700">hauteur max = {level.vertex.y}</text>
    {:else if level.vertex.x !== undefined}
      <line x1={sx(level.vertex.x)} y1={PAD} x2={sx(level.vertex.x)} y2={H - PAD} stroke={COLORS.vertex} stroke-width="2" stroke-dasharray="6 4" />
    {/if}
  {/if}

  <!-- trajectoire prévue (faible) et trajectoire parcourue -->
  <path d={fullPath} fill="none" stroke={COLORS.curve} stroke-width="2" stroke-dasharray="5 5" opacity="0.45" clip-path="url(#clip-scene)" />
  {#if flying}
    <path d={flownPath} fill="none" stroke={COLORS.curve} stroke-width="3.5" clip-path="url(#clip-scene)" />
    {#if headVisible}
      <circle cx={sx(headX)} cy={sy(headY)} r="8" fill={COLORS.curve} stroke="#fff" stroke-width="2" />
    {/if}
  {/if}

  <!-- cibles -->
  {#each level.targets as t, i}
    {@const h = hit[i]}
    <g class="target" class:hit={h}>
      <circle cx={sx(t.x)} cy={sy(t.y)} r={LANCE.hitTolerance * ((W - 2 * PAD) / (xMax - xMin)) + 6} fill={h ? COLORS.ok : COLORS.target} fill-opacity="0.2" stroke={h ? COLORS.ok : COLORS.target} stroke-width="2" />
      <circle cx={sx(t.x)} cy={sy(t.y)} r="5" fill={h ? COLORS.ok : COLORS.target} />
      <text x={sx(t.x) + 14} y={sy(t.y) - 10} font-size="12" fill={h ? COLORS.ok : COLORS.target} font-weight="700">({t.x} ; {t.y})</text>
    </g>
  {/each}

  <!-- lanceur -->
  <text x={sx(xMin) + 2} y={sy(0) - 10} font-size="18">🚀</text>
</svg>

<style>
  .scene {
    width: 100%;
    border-radius: 10px;
    box-shadow: var(--shadow);
    user-select: none;
    -webkit-user-select: none;
  }
  .target.hit {
    animation: pop 0.4s ease-out;
    transform-box: fill-box;
    transform-origin: center;
  }
  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.4);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
