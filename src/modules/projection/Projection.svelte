<script lang="ts">
  /**
   * Mode projection (prof) : active l'agrandissement global et donne un accès
   * direct au module Comprendre et à la parabole à curseurs, sans chrono ni score.
   */
  import { router } from '../../router.svelte';
  import { settings } from '../../state/settings.svelte';
  import ParabolaExplorer from '../../lib/ParabolaExplorer.svelte';

  interface Props {
    sub: string;
  }
  let { sub }: Props = $props();

  $effect(() => {
    settings.projection = true;
  });

  let showAxis = $state(false);
  let showVertex = $state(false);
  let showArrows = $state(false);

  function quit() {
    settings.projection = false;
    router.go('');
  }
</script>

{#if sub === 'parabole'}
  <div class="row between head">
    <h1>Parabole à curseurs</h1>
    <div class="row">
      <label class="chk"><input type="checkbox" bind:checked={showAxis} /> Axe de symétrie</label>
      <label class="chk"><input type="checkbox" bind:checked={showVertex} /> Sommet</label>
      <label class="chk"><input type="checkbox" bind:checked={showArrows} /> Écart ±√Δ/2a</label>
      <a class="btn secondary small" href={router.href('projection')}>Menu</a>
    </div>
  </div>
  <ParabolaExplorer {showAxis} {showVertex} {showArrows} showSpread={showArrows} />
{:else}
  <h1>Mode projection</h1>
  <p class="muted">Texte et éléments agrandis, sans chrono ni score. Idéal pour projeter au tableau.</p>
  <div class="menu">
    <a class="card item" href={router.href('comprendre/0')}>
      <span class="icon">📐</span>
      <span class="title">Comprendre la formule</span>
      <span class="muted">Complétion du carré, de l'exemple à la formule générale, en 12 étapes.</span>
    </a>
    <a class="card item" href={router.href('projection/parabole')}>
      <span class="icon">📈</span>
      <span class="title">Parabole à curseurs</span>
      <span class="muted">a, b, c en direct : Δ, racines, axe de symétrie, sommet.</span>
    </a>
  </div>
  <div class="actions">
    <button class="secondary" onclick={quit}>Quitter le mode projection</button>
  </div>
{/if}

<style>
  .head {
    margin-bottom: 0.5rem;
  }
  .chk {
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
  }
  .chk input {
    width: 1.3em;
    height: 1.3em;
  }
  .menu {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }
  .item {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    text-decoration: none;
    color: var(--text);
    padding: 1.5rem;
  }
  .icon {
    font-size: 2.2em;
  }
  .title {
    font-weight: 700;
    font-size: 1.3em;
  }
  .actions {
    margin-top: 1rem;
  }
</style>
