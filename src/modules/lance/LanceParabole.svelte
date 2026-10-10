<script lang="ts">
  import { router } from '../../router.svelte';
  import { progress } from '../../state/progress.svelte';
  import Stars from '../../lib/Stars.svelte';
  import LevelGrid from '../../lib/LevelGrid.svelte';
  import LancePlay, { type LanceResult } from './LancePlay.svelte';
  import { LEVELS } from './levels';
  import { GAMES } from '../../content/games';

  interface Props {
    level: number;
  }
  let { level }: Props = $props();

  let lv = $derived(level >= 1 && level <= LEVELS.length ? LEVELS[level - 1] : null);
  let unlocked = $derived(progress.isUnlocked('lance', level));
  let result = $state<LanceResult | null>(null);
  $effect(() => {
    void level;
    result = null;
  });
  function done(r: LanceResult) {
    result = r;
    progress.setStars('lance', level, r.stars);
  }
</script>

{#if !lv}
  <span class="eyebrow">{GAMES.lance.sub}</span>
  <h1>{GAMES.lance.title}</h1>
  <p class="muted">Les trois frères construisent des fontaines. L'eau suit la parabole y = ax² + bx + c : règle les coefficients pour qu'elle tombe dans les bassins, passe dans les anneaux ou monte à la bonne hauteur. Moins d'essais, plus d'étoiles.</p>
  <LevelGrid game="lance" levels={LEVELS} onselect={(n) => router.go(`lance/${n}`)} />
{:else if !unlocked}
  <div class="card">
    <p>Ce niveau est verrouillé : termine d'abord le niveau {level - 1}.</p>
    <a class="btn" href={router.href('lance')}>Retour aux niveaux</a>
  </div>
{:else}
  <div class="row between">
    <h1>Niveau {level} · {lv.title}</h1>
    <a class="btn ghost small" href={router.href('lance')}>Niveaux</a>
  </div>
  {#key level}
    <LancePlay level={lv} ondone={done} />
  {/key}
  {#if result}
    <div class="card center end">
      <Stars value={result.stars} size="1.8em" />
      <div class="row" style="justify-content:center">
        {#if level < LEVELS.length}
          <a class="btn" href={router.href(`lance/${level + 1}`)}>Niveau suivant</a>
        {/if}
        <a class="btn secondary" href={router.href('lance')}>Tous les niveaux</a>
      </div>
    </div>
  {/if}
{/if}

<style>
  .end {
    margin-top: 1rem;
  }
</style>
