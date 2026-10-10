<script lang="ts">
  import { onDestroy } from 'svelte';
  import { router } from '../../router.svelte';
  import { settings } from '../../state/settings.svelte';
  import { progress } from '../../state/progress.svelte';
  import { errorTracker } from '../../state/errors.svelte';
  import { RAPIDITE, ANIM } from '../../config';
  import Tex from '../../lib/Tex.svelte';
  import Parabola from '../../lib/Parabola.svelte';
  import Stars from '../../lib/Stars.svelte';
  import { equationLatex } from '../../math/latex';
  import { diagnoseCount, diagnoseDelta, ERROR_LABELS } from '../../math/diagnose';
  import { toNumber } from '../../math/fraction';
  import { makeQuestion, applyAnswer, emptyRound, starsFor, graphWindow, type Mode, type Question, type RoundState } from './logic';

  interface Props {
    mode: string;
  }
  let { mode }: Props = $props();

  let activeMode = $derived<Mode | null>(mode === 'count' || mode === 'delta' ? mode : null);
  let phase = $state<'idle' | 'question' | 'feedback' | 'end'>('idle');
  let round = $state<RoundState>(emptyRound());
  let question = $state<Question | null>(null);
  let remaining = $state(1); // fraction du temps restant
  let feedback = $state<{ ok: boolean; message: string } | null>(null);
  let timer: number | undefined;
  let lastTick = 0;
  let isRecord = $state(false);
  let timed = $derived(!settings.projection);

  const total = RAPIDITE.questionsPerRound;
  const modeInfo: Record<Mode, { title: string; text: string }> = {
    count: { title: '0, 1 ou 2 solutions ?', text: 'Une équation ou un graphe : combien de solutions ?' },
    delta: { title: 'Δ de tête', text: 'Calcule Δ = b² − 4ac avec de petits coefficients.' },
  };

  function stopTimer() {
    if (timer !== undefined) cancelAnimationFrame(timer);
    timer = undefined;
  }
  onDestroy(stopTimer);

  function start(m: Mode) {
    router.go(`rapidite/${m}`);
    round = emptyRound();
    isRecord = false;
    nextQuestion(m);
  }

  function nextQuestion(m: Mode) {
    stopTimer();
    feedback = null;
    question = makeQuestion(m, Math.random, errorTracker.bias());
    remaining = 1;
    phase = 'question';
    if (timed) {
      lastTick = performance.now();
      const dur = question.seconds * 1000;
      const tick = (now: number) => {
        remaining = Math.max(0, remaining - (now - lastTick) / dur);
        lastTick = now;
        if (remaining <= 0) timeout();
        else timer = requestAnimationFrame(tick);
      };
      timer = requestAnimationFrame(tick);
    }
  }

  function timeout() {
    if (!question || phase !== 'question') return;
    stopTimer();
    round = applyAnswer(round, false);
    feedback = { ok: false, message: `⏱ Temps écoulé ! La réponse était ${question.answer}.` };
    phase = 'feedback';
  }

  function answer(v: number) {
    if (!question || phase !== 'question') return;
    stopTimer();
    const ok = v === question.answer;
    round = applyAnswer(round, ok);
    if (ok) {
      feedback = { ok: true, message: round.streak > 1 ? `✔ Bravo ! Série de ${round.streak}.` : '✔ Bravo !' };
    } else {
      const diag = question.mode === 'count' ? diagnoseCount(question.q, v) : diagnoseDelta(question.q, v);
      if (diag) errorTracker.record(diag.type);
      feedback = { ok: false, message: `✘ ${diag?.message ?? `La réponse était ${question.answer}.`}` };
    }
    phase = 'feedback';
  }

  function proceed() {
    if (!activeMode) return;
    if (round.index >= total) finish();
    else nextQuestion(activeMode);
  }

  function finish() {
    if (!activeMode) return;
    phase = 'end';
    const stars = starsFor(round.correct, total);
    progress.setStars('rapidite', activeMode === 'count' ? 1 : 2, stars);
    isRecord = progress.setBest(`rapidite:${activeMode}`, round.score);
  }

  function quit() {
    stopTimer();
    phase = 'idle';
    router.go('rapidite');
  }

  let priority = $derived(errorTracker.priority());
  let deltaTex = $derived(question ? equationLatex(question.q) : '');
</script>

{#if !activeMode || phase === 'idle'}
  <h1>⚡ Rapidité</h1>
  <p class="muted">{total} questions, quelques secondes chacune. Les bonnes réponses d'affilée rapportent un bonus.</p>
  {#if priority}
    <div class="feedback info">À travailler : <strong>{ERROR_LABELS[priority]}</strong>. Les prochaines questions insisteront dessus.</div>
  {/if}
  <div class="modes">
    {#each ['count', 'delta'] as const as m}
      <button class="card mode" onclick={() => start(m)}>
        <span class="title">{modeInfo[m].title}</span>
        <span class="muted">{modeInfo[m].text}</span>
        <span class="row"><Stars value={progress.stars('rapidite', m === 'count' ? 1 : 2)} /> <span class="muted">Record : {progress.best(`rapidite:${m}`)} pts</span></span>
      </button>
    {/each}
  </div>
{:else if phase === 'end'}
  <div class="card center end">
    <h1>Manche terminée</h1>
    <Stars value={starsFor(round.correct, total)} size="2.2em" />
    <p class="big">{round.score} points</p>
    {#if isRecord}<p class="ok"><strong>🏆 Nouveau record !</strong></p>{/if}
    <p>{round.correct} / {total} bonnes réponses · meilleure série : {round.bestStreak}</p>
    <div class="row" style="justify-content:center">
      <button onclick={() => start(activeMode!)}>Rejouer</button>
      <button class="secondary" onclick={quit}>Changer de mode</button>
    </div>
  </div>
{:else if question}
  <div class="row between hud">
    <span class="muted">Question {Math.min(round.index + 1, total)} / {total}</span>
    {#if timed}
      <span><strong>{round.score}</strong> pts · série {round.streak}</span>
    {/if}
    <button class="ghost small" onclick={quit}>Quitter</button>
  </div>
  {#if timed}
    <div class="timebar" aria-hidden="true"><div class="fill" class:low={remaining < 0.3} style="width: {remaining * 100}%"></div></div>
  {/if}

  <div class="card question" style="--fb-ms: {ANIM.feedback}ms">
    {#if question.mode === 'count'}
      <h2>Combien de solutions ?</h2>
      {#if question.display === 'equation'}
        <div class="eq"><Tex tex={deltaTex} display /></div>
      {:else}
        <div class="graph">
          {@const w = graphWindow(question.q)}
          <Parabola a={toNumber(question.q.a)} b={toNumber(question.q.b)} c={toNumber(question.q.c)} showRoots={false} showGrid={false} xMin={w.xMin} xMax={w.xMax} yMin={w.yMin} yMax={w.yMax} aspect={0.6} />
        </div>
      {/if}
    {:else}
      <h2>Calcule Δ</h2>
      <div class="eq"><Tex tex={deltaTex} display /></div>
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
        <button onclick={proceed}>{round.index >= total ? 'Voir le résultat' : 'Question suivante ▶'}</button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .modes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }
  .mode {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 0.4rem;
    color: var(--text);
    border-color: var(--border);
  }
  .mode .title {
    font-size: 1.2em;
    font-weight: 700;
  }
  .hud {
    margin-bottom: 0.5rem;
  }
  .timebar {
    height: 10px;
    background: var(--border);
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }
  .fill {
    height: 100%;
    background: var(--primary);
    transition: width 0.1s linear;
  }
  .fill.low {
    background: var(--ko);
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
    font-size: 1.1em;
  }
  .choices button.good {
    background: var(--ok);
    border-color: var(--ok);
    opacity: 1;
  }
  .end .big {
    font-size: 2em;
    font-weight: 700;
    margin: 0.3em 0;
  }
</style>
