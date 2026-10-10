<script lang="ts">
  /** Une partie du puzzle (un niveau), réutilisable dans l'Histoire. */
  import Tex from '../../lib/Tex.svelte';
  import Hints from '../../lib/Hints.svelte';
  import TileBoard from './TileBoard.svelte';
  import SymbolicSolver from './SymbolicSolver.svelte';
  import type { Level } from './levels';
  import { newBoard, checkBoard, boardEquation, tileHints, symbolicSteps, type Board } from './logic';
  import { equationLatex } from '../../math/latex';
  import { PUZZLE } from '../../config';

  export interface PuzzleResult {
    stars: number;
    hints: number;
    errors: number;
  }
  interface Props {
    level: Level;
    /** affiche l'équation de départ */
    showEquation?: boolean;
    ondone: (r: PuzzleResult) => void;
  }
  let { level, showEquation = true, ondone }: Props = $props();

  // une partie = un niveau : le composant est recréé quand le niveau change
  // svelte-ignore state_referenced_locally
  let board = $state<Board>(newBoard(level.q));
  // svelte-ignore state_referenced_locally
  let phase = $state<'move-c' | 'tiles' | 'roots' | 'symbolic' | 'done'>(
    level.kind === 'symbolic' ? 'symbolic' : level.kind === 'tiles-move-c' ? 'move-c' : 'tiles',
  );
  let boardFeedback = $state<{ ok: boolean; message: string } | null>(null);
  let hintsUsed = $state(0);
  let errors = $state(0);

  let steps = $derived(symbolicSteps(level.q));
  let rootsStep = $derived(steps.filter((s) => s.id === 'roots'));
  let moveStep = $derived(steps.filter((s) => s.id === 'move-c'));
  let half = $derived(board.b / 2);

  function verifyBoard() {
    const r = checkBoard(board);
    if (r.ok) {
      boardFeedback = { ok: true, message: '✔ Le carré est complété ! Il reste à trouver x.' };
      setTimeout(() => (phase = 'roots'), 700);
    } else {
      errors++;
      boardFeedback = { ok: false, message: `✘ ${r.message}` };
    }
  }

  function finish() {
    phase = 'done';
    let s = 3;
    if (hintsUsed > PUZZLE.hintPenalty) s--;
    if (hintsUsed >= 3 || errors > 3) s--;
    ondone({ stars: Math.max(1, s), hints: hintsUsed, errors });
  }
</script>

{#if showEquation}
  <div class="eq-main"><Tex tex={equationLatex(level.q)} display /></div>
{/if}

{#if phase === 'move-c'}
  <p>Avant de placer les tuiles, mets le nombre seul à droite.</p>
  <SymbolicSolver q={level.q} steps={moveStep} onhint={() => hintsUsed++} onerror={() => errors++} ondone={() => (phase = 'tiles')} />
{:else if phase === 'tiles'}
  <p>
    Place les <strong>{board.b} bandes <em>x</em></strong> autour du carré pour former un grand carré, puis remplis le coin avec des tuiles unité.
    Chaque tuile ajoutée dans le coin est aussi ajoutée à droite de l'égalité.
  </p>
  <TileBoard bind:board />
  <div class="eq"><Tex tex={boardEquation(board)} display /></div>
  <div class="row">
    <button onclick={verifyBoard}>Vérifier le carré</button>
  </div>
  {#if boardFeedback}
    <div class="feedback" class:ok={boardFeedback.ok} class:ko={!boardFeedback.ok}>{boardFeedback.message}</div>
  {/if}
  <Hints hints={tileHints(level.q)} onreveal={() => hintsUsed++} />
{:else if phase === 'roots'}
  <TileBoard bind:board disabled />
  <div class="eq"><Tex tex={`(x + ${half})^2 = ${board.rhs + board.units}`} display /></div>
  <p>Le grand carré a pour côté <Tex tex={`x + ${half}`} /> et pour aire <Tex tex={`${board.rhs + board.units}`} />.</p>
  <SymbolicSolver q={level.q} steps={rootsStep} onhint={() => hintsUsed++} onerror={() => errors++} ondone={finish} />
{:else if phase === 'symbolic'}
  <p>Plus de tuiles : fais les mêmes gestes avec les nombres.</p>
  <SymbolicSolver q={level.q} {steps} onhint={() => hintsUsed++} onerror={() => errors++} ondone={finish} />
{/if}

<style>
  .eq-main {
    font-size: 1.3em;
    margin-bottom: 0.5rem;
  }
  .eq {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.4rem 0.75rem;
    margin: 0.75rem 0;
    font-size: 1.15em;
  }
</style>
