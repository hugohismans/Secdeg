<script lang="ts">
  import { router } from '../../router.svelte';
  import { settings } from '../../state/settings.svelte';
  import { progress } from '../../state/progress.svelte';
  import { errorTracker } from '../../state/errors.svelte';
  import { RAPIDITE } from '../../config';
  import Stars from '../../lib/Stars.svelte';
  import { ERROR_LABELS } from '../../math/diagnose';
  import { GAMES } from '../../content/games';
  import RapiditeRound, { type RoundResult } from './RapiditeRound.svelte';
  import { starsFor, type Mode } from './logic';

  interface Props {
    mode: string;
  }
  let { mode }: Props = $props();

  let activeMode = $derived<Mode | null>(mode === 'count' || mode === 'delta' ? mode : null);
  let result = $state<RoundResult | null>(null);
  let isRecord = $state(false);
  let roundKey = $state(0);
  const total = RAPIDITE.questionsPerRound;

  const modeInfo: Record<Mode, { title: string; text: string }> = {
    count: { title: '0, 1 ou 2 solutions ?', text: 'Une équation ou une courbe : combien de solutions ?' },
    delta: { title: 'Δ de tête', text: 'Calcule Δ = b² − 4ac avec de petits coefficients.' },
  };

  function start(m: Mode) {
    result = null;
    roundKey++;
    router.go(`rapidite/${m}`);
  }
  function finish(r: RoundResult) {
    if (!activeMode) return;
    result = r;
    progress.setStars('rapidite', activeMode === 'count' ? 1 : 2, starsFor(r.correct, r.total));
    isRecord = progress.setBest(`rapidite:${activeMode}`, r.score);
  }
  function quit() {
    result = null;
    router.go('rapidite');
  }
  let priority = $derived(errorTracker.priority());
</script>

{#if !activeMode}
  <span class="eyebrow">{GAMES.rapidite.sub}</span>
  <h1>{GAMES.rapidite.title}</h1>
  <p class="muted">Le calife al-Ma'mûn pose ses questions, un sablier à la main. {total} questions par manche, les bonnes réponses d'affilée rapportent un bonus.</p>
  {#if priority}
    <div class="feedback info">À travailler : <strong>{ERROR_LABELS[priority]}</strong>. Les prochaines questions insisteront dessus.</div>
  {/if}
  <div class="modes">
    {#each ['count', 'delta'] as const as m}
      <button class="mode" onclick={() => start(m)}>
        <span class="title">{modeInfo[m].title}</span>
        <span class="muted">{modeInfo[m].text}</span>
        <span class="row"><Stars value={progress.stars('rapidite', m === 'count' ? 1 : 2)} /> <span class="muted">Record : {progress.best(`rapidite:${m}`)} points</span></span>
      </button>
    {/each}
  </div>
{:else if result}
  <div class="card center end">
    <h1>Manche terminée</h1>
    <Stars value={starsFor(result.correct, result.total)} size="2.2em" />
    <p class="big">{result.score} points</p>
    {#if isRecord}<p class="ok"><strong>Nouveau record !</strong></p>{/if}
    <p>{result.correct} / {result.total} bonnes réponses · meilleure série : {result.bestStreak}</p>
    <div class="row" style="justify-content:center">
      <button onclick={() => start(activeMode!)}>Rejouer</button>
      <button class="secondary" onclick={quit}>Changer de mode</button>
    </div>
  </div>
{:else}
  {#key `${activeMode}-${roundKey}`}
    <RapiditeRound mode={activeMode} {total} timed={!settings.projection} onquit={quit} ondone={finish} />
  {/key}
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
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-weight: 400;
    padding: 1rem;
  }
  .mode .title {
    font-family: var(--f-titre);
    font-size: 1.3em;
    font-weight: 700;
  }
  .end .big {
    font-family: var(--f-titre);
    font-size: 2em;
    font-weight: 700;
    margin: 0.3em 0;
  }
</style>
