<script lang="ts">
  /**
   * Parabole y = ax² + bx + c en SVG, avec axes, racines, sommet, axe de
   * symétrie et flèches « centre ± écart ». Responsive (viewBox).
   */
  import { COLORS } from '../config';
  import type { Snippet } from 'svelte';

  interface Props {
    a: number;
    b: number;
    c: number;
    xMin?: number;
    xMax?: number;
    yMin?: number;
    yMax?: number;
    showRoots?: boolean;
    showVertex?: boolean;
    showAxis?: boolean;
    showArrows?: boolean;
    showGrid?: boolean;
    /** hauteur relative (viewBox) */
    aspect?: number;
    /** contenu SVG supplémentaire, reçoit les fonctions de conversion */
    children?: Snippet<[{ sx: (x: number) => number; sy: (y: number) => number; W: number; H: number }]>;
    class?: string;
  }
  let {
    a, b, c,
    xMin = -8, xMax = 8, yMin = -8, yMax = 8,
    showRoots = true, showVertex = false, showAxis = false, showArrows = false, showGrid = true,
    aspect = 0.75, children, class: cls = '',
  }: Props = $props();

  const W = 600;
  let H = $derived(Math.round(W * aspect));
  const PAD = 24;

  let sx = $derived((x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD));
  let sy = $derived((y: number) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD));

  let delta = $derived(b * b - 4 * a * c);
  let roots = $derived.by((): number[] => {
    if (a === 0) return b === 0 ? [] : [-c / b];
    if (delta < 0) return [];
    if (delta === 0) return [-b / (2 * a)];
    const s = Math.sqrt(delta);
    return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((p, q) => p - q);
  });
  let vx = $derived(a === 0 ? NaN : -b / (2 * a));
  let vy = $derived(a === 0 ? NaN : c - (b * b) / (4 * a));

  let path = $derived.by(() => {
    const n = 160;
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const x = xMin + ((xMax - xMin) * i) / n;
      const y = a * x * x + b * x + c;
      // on clippe pour éviter des coordonnées gigantesques
      const yc = Math.max(yMin - 50, Math.min(yMax + 50, y));
      pts.push(`${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(yc).toFixed(1)}`);
    }
    return pts.join(' ');
  });

  let ticks = $derived.by(() => {
    const xs: number[] = [];
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) xs.push(x);
    const ys: number[] = [];
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) ys.push(y);
    return { xs, ys };
  });
  let tickEvery = $derived(xMax - xMin > 20 ? 5 : xMax - xMin > 12 ? 2 : 1);

  function fmt(v: number): string {
    return (Math.round(v * 100) / 100).toString().replace('.', ',');
  }
</script>

<svg viewBox="0 0 {W} {H}" class="parabola {cls}" role="img" aria-label="Parabole d'équation y = {a}x² + {b}x + {c}">
  <defs>
    <clipPath id="clip-plot">
      <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} />
    </clipPath>
    <marker id="arrow-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill={COLORS.delta} />
    </marker>
  </defs>
  <rect x="0" y="0" width={W} height={H} fill="white" rx="8" />
  {#if showGrid}
    <g class="grid" stroke="#edf2f7" stroke-width="1">
      {#each ticks.xs as x}
        <line x1={sx(x)} y1={PAD} x2={sx(x)} y2={H - PAD} />
      {/each}
      {#each ticks.ys as y}
        <line x1={PAD} y1={sy(y)} x2={W - PAD} y2={sy(y)} />
      {/each}
    </g>
  {/if}
  <!-- axes -->
  <g stroke="#4a5568" stroke-width="1.5">
    {#if yMin <= 0 && yMax >= 0}<line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} />{/if}
    {#if xMin <= 0 && xMax >= 0}<line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} />{/if}
  </g>
  <g class="ticks" font-size="12" fill="#4a5568" text-anchor="middle">
    {#each ticks.xs as x}
      {#if x !== 0 && x % tickEvery === 0 && yMin <= 0 && yMax >= 0}
        <text x={sx(x)} y={sy(0) + 14}>{x}</text>
      {/if}
    {/each}
    {#each ticks.ys as y}
      {#if y !== 0 && y % tickEvery === 0 && xMin <= 0 && xMax >= 0}
        <text x={sx(0) - 8} y={sy(y) + 4} text-anchor="end">{y}</text>
      {/if}
    {/each}
  </g>

  <!-- axe de symétrie -->
  {#if showAxis && Number.isFinite(vx) && vx >= xMin && vx <= xMax}
    <line x1={sx(vx)} y1={PAD} x2={sx(vx)} y2={H - PAD} stroke={COLORS.vertex} stroke-width="2" stroke-dasharray="6 5" />
    <text x={sx(vx) + 6} y={PAD + 14} font-size="14" fill={COLORS.vertex} font-style="italic">x = {fmt(vx)}</text>
  {/if}

  <!-- courbe -->
  <path d={path} fill="none" stroke={COLORS.curve} stroke-width="3" stroke-linejoin="round" clip-path="url(#clip-plot)" />

  <!-- flèches centre ± écart -->
  {#if showArrows && roots.length === 2 && yMin <= 0 && yMax >= 0}
    {@const y0 = sy(0) - 22}
    <g stroke={COLORS.delta} stroke-width="2.5" marker-end="url(#arrow-head)">
      <line x1={sx(vx)} y1={y0} x2={sx(roots[1])} y2={y0} />
      <line x1={sx(vx)} y1={y0} x2={sx(roots[0])} y2={y0} />
    </g>
    <text x={(sx(vx) + sx(roots[1])) / 2} y={y0 - 8} font-size="14" fill={COLORS.delta} text-anchor="middle">+√Δ/2a</text>
    <text x={(sx(vx) + sx(roots[0])) / 2} y={y0 - 8} font-size="14" fill={COLORS.delta} text-anchor="middle">−√Δ/2a</text>
  {/if}

  <!-- racines -->
  {#if showRoots && yMin <= 0 && yMax >= 0}
    {#each roots as r}
      {#if r >= xMin && r <= xMax}
        <circle cx={sx(r)} cy={sy(0)} r="7" fill={COLORS.root} stroke="white" stroke-width="2" />
        <text x={sx(r)} y={sy(0) - 12} font-size="14" fill={COLORS.root} text-anchor="middle" font-weight="600">{fmt(r)}</text>
      {/if}
    {/each}
  {/if}

  <!-- sommet -->
  {#if showVertex && Number.isFinite(vx) && vx >= xMin && vx <= xMax && vy >= yMin && vy <= yMax}
    <circle cx={sx(vx)} cy={sy(vy)} r="6" fill={COLORS.vertex} stroke="white" stroke-width="2" />
    <text x={sx(vx) + 10} y={sy(vy) + (a > 0 ? 18 : -10)} font-size="13" fill={COLORS.vertex}>S({fmt(vx)} ; {fmt(vy)})</text>
  {/if}

  {#if children}{@render children({ sx, sy, W, H })}{/if}
</svg>

<style>
  .parabola {
    width: 100%;
    border-radius: 8px;
    box-shadow: var(--shadow);
    user-select: none;
    -webkit-user-select: none;
  }
</style>
