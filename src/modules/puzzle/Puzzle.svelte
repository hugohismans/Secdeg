<script lang="ts">
  import { router } from '../../router.svelte';
  import { progress } from '../../state/progress.svelte';
  import Stars from '../../lib/Stars.svelte';
  import LevelGrid from '../../lib/LevelGrid.svelte';
  import PuzzlePlay, { type PuzzleResult } from './PuzzlePlay.svelte';
  import { LEVELS } from './levels';
  import { GAMES } from '../../content/games';

  interface Props {
    level: number;
  }
  let { level }: Props = $props();

  let lv = $derived(level >= 1 && level <= LEVELS.length ? LEVELS[level - 1] : null);
  let unlocked = $derived(progress.isUnlocked('puzzle', level));
  let result = $state<PuzzleResult | null>(null);

  $effect(() => {
    void level;
    result = null;
  });

  function done(r: PuzzleResult) {
    result = r;
    progress.setStars('puzzle', level, r.stars);
  }
</script>

{#if !lv}
  <span class="eyebrow">{GAMES.puzzle.sub}</span>
  <h1>{GAMES.puzzle.title}</h1>
  <p class="muted">Pose les carreaux pour compléter le carré, puis passe aux nombres. Chaque niveau débloque le suivant.</p>
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
  {#if !result}
    {#key level}
      <PuzzlePlay level={lv} ondone={done} />
    {/key}
  {:else}
    <div class="card center">
      <h2>Niveau réussi !</h2>
      <Stars value={result.stars} size="2.2em" />
      <p class="muted">{result.hints} indice{result.hints > 1 ? 's' : ''} · {result.errors} erreur{result.errors > 1 ? 's' : ''}</p>
      <div class="row" style="justify-content:center">
        {#if level < LEVELS.length}
          <a class="btn" href={router.href(`puzzle/${level + 1}`)}>Niveau suivant</a>
        {/if}
        <a class="btn secondary" href={router.href('puzzle')}>Tous les niveaux</a>
      </div>
    </div>
  {/if}
{/if}
