<script lang="ts">
  /** Une manche de questions rapides, réutilisable dans l'Histoire. */
  import { onDestroy } from 'svelte';
  import { errorTracker } from '../../state/errors.svelte';
  import { ANIM } from '../../config';
  import Tex from '../../lib/Tex.svelte';
  import Parabola from '../../lib/Parabola.svelte';
  import { equationLatex } from '../../math/latex';
  import { diagnoseCount, diagnoseDelta } from '../../math/diagnose';
  import { toNumber } from '../../math/fraction';
  import { makeQuestion, applyAnswer, emptyRound, graphWindow, type Mode, type Question, type RoundState } from './logic';

  export interface RoundResult {
    correct: number;
    total: number;
    score: number;
    bestStreak: number;
  }
  interface Props {
    mode: Mode;
    total: number;
    timed: boolean;
    /** facteur appliqué au temps de chaque question (1 = config) */
    timeFactor?: number;
    onquit?: () => void;
    ondone: (r: RoundResult) => void;
  }
  let { mode, total, timed, timeFactor = 1, onquit, ondone }: Props = $props();

  let round = $state<RoundState>(emptyRound());
  let question = $state<Question | null>(null);
  let remaining = $state(1);
  let phase = $state<'question' | 'feedback'>('question');
  let feedback = $state<{ ok: boolean; message: string } | null>(null);
  let timer: number | undefined;
  let lastTick = 0;
  /** tests de bout en bout : expose la réponse si localStorage['secdeg.debug'] === '1' */
  const debug = (() => {
    try {
      return localStorage.getItem('secdeg.debug') === '1';
    } catch {
      return false;
    }
  })();

  function stopTimer() {
    if (timer !== undefined) cancelAnimationFrame(timer);
    timer = undefined;
  }
  onDestroy(stopTimer);

  function nextQuestion() {
    stopTimer();
    feedback = null;
    question = makeQuestion(mode, Math.random, errorTracker.bias());
    remaining = 1;
    phase = 'question';
    if (timed) {
      lastTick = performance.now();
      const dur = question.seconds * 1000 * timeFactor;
      const tick = (now: number) => {
        remaining = Math.max(0, remaining - (now - lastTick) / dur);
        lastTick = now;
        if (remaining <= 0) timeout();
        else timer = requestAnimationFrame(tick);
      };
      timer = requestAnimationFrame(tick);
    }
  }
  nextQuestion();

  function timeout() {
    if (!question || phase !== 'question') return;
    stopTimer();
    round = applyAnswer(round, false);
    feedback = { ok: false, message: `Le sablier est vide. La réponse était ${label(question.answer)}.` };
    phase = 'feedback';
  }

  function label(v: number): string {
    if (!question) return String(v);
    return question.mode === 'count' ? (v === 0 ? 'aucune solution' : v === 1 ? 'une solution double' : 'deux solutions') : `Δ = ${v}`;
  }

  function answer(v: number) {
    if (!question || phase !== 'question') return;
    stopTimer();
    const ok = v === question.answer;
    round = applyAnswer(round, ok);
    if (ok) {
      feedback = { ok: true, message: round.streak > 1 ? `✔ Juste. Série de ${round.streak}.` : '✔ Juste.' };
    } else {
      const diag = question.mode === 'count' ? diagnoseCount(question.q, v) : diagnoseDelta(question.q, v);
      if (diag) errorTracker.record(diag.type);
      feedback = { ok: false, message: `✘ ${diag?.message ?? `La réponse était ${label(question.answer)}.`}` };
    }
    phase = 'feedback';
  }

  function proceed() {
    if (round.index >= total) {
      ondone({ correct: round.correct, total, score: round.score, bestStreak: round.bestStreak });
    } else nextQuestion();
  }

  let eqTex = $derived(question ? equationLatex(question.q) : '');
  let win = $derived(question ? graphWindow(question.q) : { xMin: -8, xMax: 8, yMin: -8, yMax: 8 });
</script>

<div class="row between hud">
  <span class="muted">Question {Math.min(round.index + 1, total)} / {total}</span>
  {#if timed}
    <span><strong>{round.score}</strong> points · série {round.streak}</span>
  {/if}
  {#if onquit}<button class="ghost small" onclick={onquit}>Quitter</button>{/if}
</div>
{#if timed}
  <div class="timebar" aria-hidden="true"><div class="fill" class:low={remaining < 0.3} style="width: {remaining * 100}%"></div></div>
{/if}

{#if question}
  <div class="card question" style="--fb-ms: {ANIM.feedback}ms" data-answer={debug ? question.answer : undefined}>
    {#if question.mode === 'count'}
      <h2>Combien de solutions ?</h2>
      {#if question.display === 'equation'}
        <div class="eq"><Tex tex={eqTex} display /></div>
      {:else}
        <div class="graph">
          <Parabola a={toNumber(question.q.a)} b={toNumber(question.q.b)} c={toNumber(question.q.c)} showRoots={false} showGrid={false} xMin={win.xMin} xMax={win.xMax} yMin={win.yMin} yMax={win.yMax} aspect={0.6} />
        </div>
      {/if}
    {:else}
      <h2>Calcule Δ</h2>
      <div class="eq"><Tex tex={eqTex} display /></div>
    {/if}

    <div class="choices">
      {#each question.choices as ch}
        <button
          class:secondary={phase === 'feedback' && ch !== question.answer}
          class:good={phase === 'feedback' && ch === question.answer}
          disabled={phase === 'feedback'}
          onclick={() => answer(ch)}
        >
          {question.mode === 'count' ? (ch === 0 ? 'Aucune' : ch === 1 ? 'Une (double)' : 'Deux') : `Δ = ${ch}`}
        </button>
      {/each}
    </div>

    {#if phase === 'feedback' && feedback}
      <div class="feedback" class:ok={feedback.ok} class:ko={!feedback.ok}>{feedback.message}</div>
      <div class="row" style="justify-content:flex-end">
        <button onclick={proceed}>{round.index >= total ? 'Voir le résultat' : 'Question suivante'}</button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .hud {
    margin-bottom: 0.5rem;
  }
  .timebar {
    height: 10px;
    background: var(--papier-fonce);
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }
  .fill {
    height: 100%;
    background: var(--manganese);
    transition: width 0.1s linear;
  }
  .fill.low {
    background: var(--garance);
  }
  .question h2 {
    text-align: center;
  }
  .eq {
    font-size: 1.4em;
    text-align: center;
  }
  .graph {
    max-width: 520px;
    margin: 0 auto;
  }
  .choices {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: center;
    margin-top: 1rem;
  }
  .choices button {
    min-width: 120px;
    font-size: 1.05em;
  }
  .choices button.good {
    background: var(--ok);
    border-color: var(--ok);
    color: var(--email);
    opacity: 1;
  }
</style>
