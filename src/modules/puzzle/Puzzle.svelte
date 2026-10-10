<script lang="ts">
  import { router } from '../../router.svelte';
  import { progress } from '../../state/progress.svelte';
  import Tex from '../../lib/Tex.svelte';
  import Hints from '../../lib/Hints.svelte';
  import Stars from '../../lib/Stars.svelte';
  import LevelGrid from '../../lib/LevelGrid.svelte';
  import TileBoard from './TileBoard.svelte';
  import SymbolicSolver from './SymbolicSolver.svelte';
  import { LEVELS } from './levels';
  import { newBoard, checkBoard, boardEquation, tileHints, symbolicSteps, type Board } from './logic';
  import { equationLatex } from '../../math/latex';
  import { PUZZLE } from '../../config';

  interface Props {
    level: number;
  }
  let { level }: Props = $props();

  let lv = $derived(level >= 1 && level <= LEVELS.length ? LEVELS[level - 1] : null);
  let unlocked = $derived(progress.isUnlocked('puzzle', level));

  // état d'un niveau
  let board = $state<Board>({ b: 0, rhs: 0, right: 0, bottom: 0, units: 0 });
  let phase = $state<'move-c' | 'tiles' | 'roots' | 'symbolic' | 'done'>('tiles');
  let boardFeedback = $state<{ ok: boolean; message: string } | null>(null);
  let hintsUsed = $state(0);
  let errors = $state(0);
  let stars = $state(0);

  $effect(() => {
    // (ré)initialise quand on change de niveau
    const l = lv;
    if (!l) return;
    board = newBoard(l.q);
    boardFeedback = null;
    hintsUsed = 0;
    errors = 0;
    stars = 0;
    phase = l.kind === 'symbolic' ? 'symbolic' : l.kind === 'tiles-move-c' ? 'move-c' : 'tiles';
  });

  let steps = $derived(lv ? symbolicSteps(lv.q) : []);
  let rootsStep = $derived(steps.filter((s) => s.id === 'roots'));
  let moveStep = $derived(steps.filter((s) => s.id === 'move-c'));

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
    stars = Math.max(1, s);
    progress.setStars('puzzle', level, stars);
  }

  let halfTex = $derived(board.b / 2);
</script>

{#if !lv}
  <h1>🧩 Puzzle de tuiles</h1>
  <p class="muted">Complète le carré avec des tuiles, puis sans tuiles. Chaque niveau débloque le suivant.</p>
  <LevelGrid game="puzzle" levels={LEVELS} onselect={(n) => router.go(`puzzle/${n}`)} />
{:else if !unlocked}
  <div class="card">
    <p>Ce niveau est verrouillé : termine d'abord le niveau {level - 1}.</p>
    <a class="btn" href={router.href('puzzle')}>Retour aux niveaux</a>
  </div>
{:else}
  <div class="row between">
    <h1>Niveau {level} · {lv.title}</h1>
    <a class="btn ghost small" href={router.href('puzzle')}>Niveaux</a>
  </div>
  <div class="eq-main"><Tex tex={equationLatex(lv.q)} display /></div>

  {#if phase === 'move-c'}
    <p>Avant de placer les tuiles, il faut mettre le nombre seul à droite.</p>
    <SymbolicSolver q={lv.q} steps={moveStep} onhint={() => hintsUsed++} onerror={() => errors++} ondone={() => (phase = 'tiles')} />
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
    <Hints hints={tileHints(lv.q)} resetKey={level} onreveal={() => hintsUsed++} />
  {:else if phase === 'roots'}
    <TileBoard bind:board disabled />
    <div class="eq"><Tex tex={`(x + ${halfTex})^2 = ${board.rhs + board.units}`} display /></div>
    <p>Le grand carré a pour côté <Tex tex={`x + ${halfTex}`} /> et pour aire <Tex tex={`${board.rhs + board.units}`} />.</p>
    <SymbolicSolver q={lv.q} steps={rootsStep} onhint={() => hintsUsed++} onerror={() => errors++} ondone={finish} />
  {:else if phase === 'symbolic'}
    <p>Plus de tuiles : fais les mêmes gestes avec les nombres.</p>
    <SymbolicSolver q={lv.q} {steps} onhint={() => hintsUsed++} onerror={() => errors++} ondone={finish} />
  {:else}
    <div class="card center">
      <h2>Niveau réussi !</h2>
      <Stars value={stars} size="2.2em" />
      <p class="muted">{hintsUsed} indice{hintsUsed > 1 ? 's' : ''} · {errors} erreur{errors > 1 ? 's' : ''}</p>
      <div class="row" style="justify-content:center">
        {#if level < LEVELS.length}
          <a class="btn" href={router.href(`puzzle/${level + 1}`)}>Niveau suivant ▶</a>
        {/if}
        <a class="btn secondary" href={router.href('puzzle')}>Tous les niveaux</a>
      </div>
    </div>
  {/if}
{/if}

<style>
  .eq-main {
    font-size: 1.3em;
    margin-bottom: 0.5rem;
  }
  .eq {
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 0.4rem 0.75rem;
    margin: 0.75rem 0;
    font-size: 1.15em;
  }
</style>
