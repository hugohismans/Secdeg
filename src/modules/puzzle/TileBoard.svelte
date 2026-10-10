<script lang="ts">
  /**
   * Plateau de tuiles : carré x², bandes x à droite et en dessous, coin de
   * tuiles unité. Glisser-déposer (pointer) + boutons tactiles.
   */
  import { COLORS, PUZZLE } from '../../config';
  import { draggable, clientToSvg } from '../../lib/drag';
  import type { Board } from './logic';
  import { inPool } from './logic';

  interface Props {
    board: Board;
    disabled?: boolean;
  }
  let { board = $bindable(), disabled = false }: Props = $props();

  const U = 20; // taille d'une tuile unité
  const X = 5 * U; // longueur symbolique de x
  const M = 18;
  let maxSide = $derived(Math.max(1, board.b));
  let pool = $derived(inPool(board));
  // largeur : carré + zone droite (jusqu'à b bandes) + espace + réserve
  let W = $derived(M + X + maxSide * U + 40 + 3 * U + 20 + M);
  let H = $derived(M + X + Math.max(board.bottom + 1, 3) * U + M + 10);

  const sq = { x: M, y: M };
  let zoneRight = $derived({ x: M + X, y: M, w: Math.max(1, board.b - board.bottom) * U, h: X });
  let zoneBottom = $derived({ x: M, y: M + X, w: X, h: Math.max(1, board.b - board.right) * U });
  let corner = $derived({ x: M + X, y: M + X, w: board.right * U, h: board.bottom * U });
  let poolX = $derived(M + X + maxSide * U + 40);

  let svgEl: SVGSVGElement | undefined = $state();
  let drag = $state<{ kind: 'x' | 'unit'; x: number; y: number } | null>(null);

  function inside(px: number, py: number, z: { x: number; y: number; w: number; h: number }, tol = U) {
    return px >= z.x - tol && px <= z.x + z.w + tol && py >= z.y - tol && py <= z.y + z.h + tol;
  }

  function dragOpts(kind: 'x' | 'unit') {
    return {
      enabled: !disabled && (kind === 'unit' || pool > 0),
      onstart: (e: { clientX: number; clientY: number }) => {
        if (!svgEl) return;
        const p = clientToSvg(svgEl, e.clientX, e.clientY);
        drag = { kind, x: p.x, y: p.y };
      },
      onmove: (e: { clientX: number; clientY: number }) => {
        if (!svgEl || !drag) return;
        const p = clientToSvg(svgEl, e.clientX, e.clientY);
        drag = { ...drag, x: p.x, y: p.y };
      },
      onend: () => {
        if (!drag) return;
        const { kind, x, y } = drag;
        drag = null;
        if (kind === 'x') {
          if (inside(x, y, zoneRight)) addRight();
          else if (inside(x, y, zoneBottom)) addBottom();
        } else if (inside(x, y, { x: corner.x, y: corner.y, w: Math.max(corner.w, U), h: Math.max(corner.h, U) }, U * 1.5)) {
          addUnit();
        }
      },
    };
  }

  function addRight() {
    if (pool > 0) board = { ...board, right: board.right + 1 };
  }
  function addBottom() {
    if (pool > 0) board = { ...board, bottom: board.bottom + 1 };
  }
  function removeRight() {
    if (board.right > 0) board = { ...board, right: board.right - 1 };
  }
  function removeBottom() {
    if (board.bottom > 0) board = { ...board, bottom: board.bottom - 1 };
  }
  function addUnit() {
    board = { ...board, units: board.units + 1 };
  }
  function removeUnit() {
    if (board.units > 0) board = { ...board, units: board.units - 1 };
  }

  let cornerCells = $derived.by(() => {
    const cells: { x: number; y: number; filled: boolean }[] = [];
    const cols = Math.max(board.right, 1);
    const rows = Math.max(board.bottom, 1);
    // on dessine autant de cases que de tuiles unité, dans une grille de `cols` colonnes
    const n = Math.max(board.units, board.right * board.bottom);
    for (let i = 0; i < n; i++) {
      const cx = i % cols;
      const cy = Math.floor(i / cols);
      if (cy >= rows && board.units <= board.right * board.bottom) break;
      cells.push({ x: corner.x + cx * U, y: corner.y + cy * U, filled: i < board.units });
    }
    return cells;
  });
</script>

<div class="board" style="--snap: {PUZZLE.snapPx}px">
  <svg bind:this={svgEl} viewBox="0 0 {W} {H}" role="img" aria-label="Plateau de tuiles">
    <!-- carré x² -->
    <rect x={sq.x} y={sq.y} width={X} height={X} fill={COLORS.x2} stroke="#fff" stroke-width="2" rx="2" />
    <text x={sq.x + X / 2} y={sq.y + X / 2} fill="#fff" font-size="22" font-weight="700" text-anchor="middle" dominant-baseline="middle" font-style="italic">x²</text>

    <!-- zones de dépôt -->
    {#if pool > 0 && !disabled}
      <rect x={zoneRight.x + board.right * U} y={zoneRight.y} width={Math.max(U, zoneRight.w - board.right * U)} height={zoneRight.h} fill={COLORS.bx} fill-opacity="0.08" stroke={COLORS.bx} stroke-dasharray="5 4" stroke-width="1.5" />
      <rect x={zoneBottom.x} y={zoneBottom.y + board.bottom * U} width={zoneBottom.w} height={Math.max(U, zoneBottom.h - board.bottom * U)} fill={COLORS.bx} fill-opacity="0.08" stroke={COLORS.bx} stroke-dasharray="5 4" stroke-width="1.5" />
    {/if}

    <!-- bandes placées à droite -->
    {#each Array(board.right) as _, i}
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <g class="tile" onclick={() => !disabled && removeRight()}>
        <rect x={M + X + i * U} y={M} width={U} height={X} fill={COLORS.bx} stroke="#fff" stroke-width="2" rx="2" />
        <text x={M + X + i * U + U / 2} y={M + X / 2} fill="#fff" font-size="13" font-style="italic" text-anchor="middle" dominant-baseline="middle" transform="rotate(-90 {M + X + i * U + U / 2} {M + X / 2})">x</text>
      </g>
    {/each}
    <!-- bandes placées en dessous -->
    {#each Array(board.bottom) as _, i}
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <g class="tile" onclick={() => !disabled && removeBottom()}>
        <rect x={M} y={M + X + i * U} width={X} height={U} fill={COLORS.bx} stroke="#fff" stroke-width="2" rx="2" />
        <text x={M + X / 2} y={M + X + i * U + U / 2} fill="#fff" font-size="13" font-style="italic" text-anchor="middle" dominant-baseline="middle">x</text>
      </g>
    {/each}

    <!-- coin -->
    {#if board.right > 0 && board.bottom > 0}
      <rect x={corner.x} y={corner.y} width={corner.w} height={corner.h} fill={COLORS.corner} fill-opacity="0.12" stroke={COLORS.corner} stroke-dasharray="4 3" stroke-width="1.5" />
    {/if}
    {#each cornerCells as cell}
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <rect
        class="tile"
        x={cell.x + 1} y={cell.y + 1} width={U - 2} height={U - 2}
        fill={cell.filled ? COLORS.corner : 'transparent'}
        stroke={cell.filled ? '#fff' : 'none'}
        rx="2"
        onclick={() => !disabled && (cell.filled ? removeUnit() : addUnit())}
      />
    {/each}

    <!-- réserve -->
    <text x={poolX + 1.5 * U} y={M - 4} font-size="12" fill="#4a5568" text-anchor="middle">Réserve</text>
    {#if pool > 0}
      {#each Array(Math.min(pool, 10)) as _, i}
        <rect x={poolX + i * 3} y={M + i * 2} width={U} height={X} fill={COLORS.bx} stroke="#fff" stroke-width="2" rx="2" opacity={i === Math.min(pool, 10) - 1 ? 0 : 1} />
      {/each}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <g class="grab" use:draggable={dragOpts('x')} role="button" tabindex="0" aria-label="Bande x à glisser" style="transform: translate({drag?.kind === 'x' ? drag.x - U / 2 : poolX + (Math.min(pool, 10) - 1) * 3}px, {drag?.kind === 'x' ? drag.y - X / 2 : M + (Math.min(pool, 10) - 1) * 2}px)" class:lifted={drag?.kind === 'x'}>
        <rect x="0" y="0" width={U} height={X} fill={COLORS.bx} stroke="#fff" stroke-width="2" rx="2" />
        <text x={U / 2} y={X / 2} fill="#fff" font-size="13" font-style="italic" text-anchor="middle" dominant-baseline="middle" transform="rotate(-90 {U / 2} {X / 2})">x</text>
      </g>
      <text x={poolX + U / 2 + 14} y={M + X + 16} font-size="13" fill={COLORS.bx} font-weight="700" text-anchor="middle">× {pool}</text>
    {/if}
    <!-- tuile unité (réserve illimitée) -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <g class="grab" use:draggable={dragOpts('unit')} role="button" tabindex="0" aria-label="Tuile unité à glisser dans le coin" style="transform: translate({drag?.kind === 'unit' ? drag.x - U / 2 : poolX + 2 * U}px, {drag?.kind === 'unit' ? drag.y - U / 2 : M}px)" class:lifted={drag?.kind === 'unit'}>
      <rect x="0" y="0" width={U} height={U} fill={COLORS.corner} stroke="#fff" stroke-width="2" rx="2" />
      <text x={U / 2} y={U / 2} fill="#fff" font-size="12" text-anchor="middle" dominant-baseline="middle">1</text>
    </g>
    <text x={poolX + 2.5 * U} y={M + U + 16} font-size="13" fill={COLORS.corner} font-weight="700" text-anchor="middle">× ∞</text>
  </svg>

  {#if !disabled}
    <div class="controls">
      <div class="grp" style="--c: {COLORS.bx}">
        <span>Bande <em>x</em> :</span>
        <button class="small secondary" onclick={addRight} disabled={pool === 0}>→ droite</button>
        <button class="small secondary" onclick={addBottom} disabled={pool === 0}>↓ dessous</button>
        <button class="small ghost" onclick={removeRight} disabled={board.right === 0}>retirer droite</button>
        <button class="small ghost" onclick={removeBottom} disabled={board.bottom === 0}>retirer dessous</button>
      </div>
      <div class="grp" style="--c: {COLORS.corner}">
        <span>Coin :</span>
        <button class="small secondary" onclick={addUnit}>+1 tuile</button>
        <button class="small ghost" onclick={removeUnit} disabled={board.units === 0}>−1 tuile</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .board svg {
    width: 100%;
    max-width: 620px;
    margin: 0 auto;
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    user-select: none;
    -webkit-user-select: none;
  }
  .tile {
    cursor: pointer;
  }
  .grab {
    cursor: grab;
  }
  .grab.lifted {
    filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.3));
  }
  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }
  .grp {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
  }
  .grp span {
    font-weight: 600;
    color: var(--c);
    min-width: 5.5em;
  }
  .grp .secondary {
    border-color: var(--c);
    color: var(--c);
  }
  .grp .ghost {
    color: var(--muted);
  }
</style>
