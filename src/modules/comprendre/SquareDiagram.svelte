<script lang="ts">
  /**
   * Le diagramme de complétion du carré, partagé entre l'exemple numérique
   * (x² + 6x) et la généralisation (x² + (b/a)x).
   *
   * stage :
   *   'initial'   carré x·x + rectangle x·full
   *   'cut'       rectangle coupé en deux bandes x·half (glissables si interactive)
   *   'moved'     bandes placées à droite et en dessous du carré (via placed)
   *   'completed' coin half·half ajouté
   */
  import { COLORS, ANIM } from '../../config';
  import { draggable, clientToSvg } from '../../lib/drag';
  import SvgLabel from './SvgLabel.svelte';

  interface Labels {
    x: string;
    half: string;
    full: string;
    /** aire du coin (ex : "9" ou "b²/4a²") */
    corner: string;
  }
  interface Props {
    labels: Labels;
    stage: 'initial' | 'cut' | 'moved' | 'completed';
    /** bandes placées (bindable) ; en mode non interactif, stage 'moved' place tout */
    placed?: [boolean, boolean];
    interactive?: boolean;
    /** montrer les aires à l'intérieur des formes */
    showAreas?: boolean;
    /** met le coin en surbrillance (pointillés) même avant complétion */
    showCornerHint?: boolean;
    /** coin cliquable (étape "compléter le coin") */
    cornerClickable?: boolean;
    oncorner?: () => void;
    onplaced?: (index: number) => void;
    /** étiquette du côté complet du carré (ex : "x + 3") */
    sideLabel?: string;
  }
  let {
    labels, stage, placed = $bindable([false, false]), interactive = false, showAreas = true,
    showCornerHint = false, cornerClickable = false, oncorner, onplaced, sideLabel,
  }: Props = $props();

  // Géométrie (unités du viewBox)
  const S = 130; // côté x
  const Hh = 55; // demi-bande
  const OX = 56;
  const OY = 30;
  const W = 466;
  const H = 240;
  const GAP = 70; // espace entre le carré et le rectangle initial

  const square = { x: OX, y: OY, w: S, h: S };
  const rectInit = { x: OX + S + GAP, y: OY, w: 2 * Hh, h: S };
  const bandInit = [
    { x: rectInit.x, y: OY, w: Hh, h: S, rot: 0 },
    { x: rectInit.x + Hh, y: OY, w: Hh, h: S, rot: 0 },
  ];
  const targets = [
    { x: OX + S, y: OY, w: Hh, h: S }, // droite
    { x: OX, y: OY + S, w: S, h: Hh }, // dessous
  ];
  const corner = { x: OX + S, y: OY + S, w: Hh, h: Hh };

  let svgEl: SVGSVGElement | undefined = $state();
  let drag = $state<{ i: number; x: number; y: number } | null>(null);
  let allPlaced = $derived(stage === 'moved' || stage === 'completed' || (placed[0] && placed[1]));

  /** position et orientation courantes de la bande i */
  function bandBox(i: number): { x: number; y: number; w: number; h: number } {
    if (drag && drag.i === i) return { x: drag.x, y: drag.y, w: Hh, h: S };
    if (allPlaced || placed[i]) return targets[i];
    return bandInit[i];
  }

  function dragOpts(i: number) {
    return {
      enabled: interactive && stage === 'cut' && !placed[i],
      onstart: (e: { clientX: number; clientY: number }) => {
        if (!svgEl) return;
        const p = clientToSvg(svgEl, e.clientX, e.clientY);
        drag = { i, x: p.x - Hh / 2, y: p.y - S / 2 };
      },
      onmove: (e: { clientX: number; clientY: number }) => {
        if (!svgEl || !drag) return;
        const p = clientToSvg(svgEl, e.clientX, e.clientY);
        drag = { i, x: p.x - Hh / 2, y: p.y - S / 2 };
      },
      onend: () => {
        if (!drag) return;
        const cx = drag.x + Hh / 2;
        const cy = drag.y + S / 2;
        // la bande tombe-t-elle sur une cible libre ?
        let hit = -1;
        for (let t = 0; t < 2; t++) {
          if (placed[t]) continue;
          const tg = targets[t];
          const tol = 30;
          if (cx >= tg.x - tol && cx <= tg.x + tg.w + tol && cy >= tg.y - tol && cy <= tg.y + tg.h + tol) hit = t;
        }
        drag = null;
        if (hit >= 0) {
          // la bande prend la cible atteinte ; on ré-attribue pour que chaque bande ait sa cible
          const next: [boolean, boolean] = [placed[0], placed[1]];
          next[hit] = true;
          placed = next;
          onplaced?.(hit);
        }
      },
    };
  }

  /** aire d'une demi-bande : "3x", ou "bx/2a" si half = "b/2a" */
  function areaOf(side: string): string {
    const i = side.indexOf('/');
    if (i < 0) return `${side}${labels.x}`;
    return `${side.slice(0, i)}${labels.x}/${side.slice(i + 1)}`;
  }
  let bandArea = $derived(areaOf(labels.half));
  let bandAreaFrac = $derived(labels.half.includes('/'));
  let stroke = '#fff';
</script>

<svg bind:this={svgEl} viewBox="0 0 {W} {H}" class="diagram" class:dragging={drag !== null} style="--slide-ms: {ANIM.slide}ms; --corner-ms: {ANIM.cornerAppear}ms" role="img" aria-label="Complétion du carré">
  <!-- carré x² -->
  <rect x={square.x} y={square.y} width={square.w} height={square.h} fill={COLORS.x2} {stroke} stroke-width="2" rx="2" />
  {#if showAreas}
    <SvgLabel text="{labels.x}²" x={square.x + S / 2} y={square.y + S / 2} fill="#fff" size={24} />
  {/if}
  <SvgLabel text={labels.x} x={square.x - 14} y={square.y + S / 2} fill={COLORS.x2} anchor="end" />
  <SvgLabel text={labels.x} x={square.x + S / 2} y={square.y - 14} fill={COLORS.x2} />

  <!-- cibles (zones en pointillés) -->
  {#if stage === 'cut' && interactive}
    {#each targets as t, i}
      {#if !placed[i]}
        <rect x={t.x} y={t.y} width={t.w} height={t.h} fill={COLORS.bx} fill-opacity="0.12" stroke={COLORS.bx} stroke-dasharray="6 4" stroke-width="2" rx="2" />
      {/if}
    {/each}
  {/if}

  <!-- rectangle initial (une pièce) -->
  {#if stage === 'initial'}
    <rect x={rectInit.x} y={rectInit.y} width={rectInit.w} height={rectInit.h} fill={COLORS.bx} {stroke} stroke-width="2" rx="2" />
    {#if showAreas}
      <SvgLabel text={areaOf(labels.full)} x={rectInit.x + Hh} y={rectInit.y + S / 2} fill="#fff" size={labels.full.includes('/') ? 16 : 20} />
    {/if}
    <SvgLabel text={labels.full} x={rectInit.x + Hh} y={rectInit.y - 14} fill={COLORS.bx} />
    <SvgLabel text={labels.x} x={rectInit.x + rectInit.w + 12} y={rectInit.y + S / 2} fill={COLORS.bx} anchor="start" />
  {:else}
    <!-- deux bandes -->
    {#each [0, 1] as i}
      {@const bb = bandBox(i)}
      {@const isDragging = drag?.i === i}
      {@const can = interactive && stage === 'cut' && !placed[i]}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <g
        class="band"
        class:can
        class:lifted={isDragging}
        style="transform: translate({bb.x}px, {bb.y}px)"
        use:draggable={dragOpts(i)}
        role={can ? 'button' : undefined}
        aria-label={can ? `Bande ${i + 1}, à glisser contre le carré` : undefined}
        tabindex={can ? 0 : undefined}
        onkeydown={(e) => {
          if (can && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            const next: [boolean, boolean] = [placed[0], placed[1]];
            const t = !placed[i] && !placed[i === 0 ? 1 : 0] ? i : placed[0] ? 1 : 0;
            next[t] = true;
            placed = next;
            onplaced?.(t);
          }
        }}
      >
        <rect x="0" y="0" width={bb.w} height={bb.h} fill={COLORS.bx} {stroke} stroke-width="2" rx="2" />
        {#if showAreas}
          {#if bb.w > bb.h}
            <SvgLabel text={bandArea} x={bb.w / 2} y={bb.h / 2} fill="#fff" size={bandAreaFrac ? 14 : 18} />
          {:else}
            <g style="transform: translate({bb.w / 2}px, {bb.h / 2}px) rotate(-90deg)">
              <SvgLabel text={bandArea} x={0} y={0} fill="#fff" size={bandAreaFrac ? 14 : 18} />
            </g>
          {/if}
        {/if}
      </g>
    {/each}
    <!-- étiquettes des bandes -->
    {#if !allPlaced && !placed[0] && !placed[1] && !drag}
      <SvgLabel text={labels.half} x={bandInit[0].x + Hh / 2} y={OY - 14} fill={COLORS.bx} />
      <SvgLabel text={labels.half} x={bandInit[1].x + Hh / 2} y={OY - 14} fill={COLORS.bx} />
      <SvgLabel text={labels.x} x={bandInit[1].x + Hh + 12} y={OY + S / 2} fill={COLORS.bx} anchor="start" />
    {/if}
    {#if allPlaced || placed[0]}
      <SvgLabel text={labels.half} x={targets[0].x + Hh / 2} y={OY - 14} fill={COLORS.bx} />
    {/if}
    {#if allPlaced || placed[1]}
      <SvgLabel text={labels.half} x={OX - 14} y={targets[1].y + Hh / 2} fill={COLORS.bx} anchor="end" />
    {/if}
  {/if}

  <!-- coin manquant -->
  {#if stage === 'completed'}
    <rect class="corner-fill" x={corner.x} y={corner.y} width={corner.w} height={corner.h} fill={COLORS.corner} {stroke} stroke-width="2" rx="2" />
    {#if showAreas}
      <SvgLabel text={labels.corner} x={corner.x + Hh / 2} y={corner.y + Hh / 2} fill="#fff" size={labels.corner.includes('/') ? 13 : 18} />
    {/if}
  {:else if allPlaced && (showCornerHint || cornerClickable)}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <rect
      class="corner-hint"
      class:clickable={cornerClickable}
      x={corner.x} y={corner.y} width={corner.w} height={corner.h}
      fill={COLORS.corner} fill-opacity="0.15" stroke={COLORS.corner} stroke-dasharray="6 4" stroke-width="2" rx="2"
      role={cornerClickable ? 'button' : undefined}
      tabindex={cornerClickable ? 0 : undefined}
      aria-label={cornerClickable ? 'Compléter le coin manquant' : undefined}
      onclick={() => cornerClickable && oncorner?.()}
      onkeydown={(e) => cornerClickable && (e.key === 'Enter' || e.key === ' ') && oncorner?.()}
    />
    <g style="pointer-events: none"><SvgLabel text="?" x={corner.x + Hh / 2} y={corner.y + Hh / 2} fill={COLORS.corner} size={22} /></g>
  {/if}

  <!-- côté complet -->
  {#if sideLabel && (stage === 'completed')}
    <line x1={OX} y1={OY + S + Hh + 22} x2={OX + S + Hh} y2={OY + S + Hh + 22} stroke={COLORS.corner} stroke-width="2" />
    <line x1={OX} y1={OY + S + Hh + 16} x2={OX} y2={OY + S + Hh + 28} stroke={COLORS.corner} stroke-width="2" />
    <line x1={OX + S + Hh} y1={OY + S + Hh + 16} x2={OX + S + Hh} y2={OY + S + Hh + 28} stroke={COLORS.corner} stroke-width="2" />
    <SvgLabel text={sideLabel} x={OX + (S + Hh) / 2} y={OY + S + Hh + 38} fill={COLORS.corner} size={16} />
  {/if}
</svg>

<style>
  .diagram {
    width: 100%;
    max-width: 560px;
    margin: 0 auto;
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    user-select: none;
    -webkit-user-select: none;
  }
  :root.projection .diagram {
    max-width: 900px;
  }
  .band {
    transition: transform var(--slide-ms, 450ms) cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .band.lifted,
  .dragging .band.lifted {
    transition: none;
    filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.3));
  }
  .band.can {
    cursor: grab;
  }
  .band.can rect {
    animation: pulse 1.2s ease-in-out infinite alternate;
  }
  @keyframes pulse {
    from {
      stroke: #fff;
    }
    to {
      stroke: #fbd38d;
      stroke-width: 4;
    }
  }
  .corner-hint.clickable {
    cursor: pointer;
    animation: pulse-corner 1s ease-in-out infinite alternate;
  }
  @keyframes pulse-corner {
    from {
      fill-opacity: 0.1;
    }
    to {
      fill-opacity: 0.4;
    }
  }
  .corner-fill {
    animation: appear var(--corner-ms, 500ms) ease-out;
    transform-origin: center;
    transform-box: fill-box;
  }
  @keyframes appear {
    from {
      transform: scale(0.2);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
