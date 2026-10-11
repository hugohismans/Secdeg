<script lang="ts">
  import { router } from './router.svelte';
  import { settings } from './state/settings.svelte';
  import Emblem from './lib/Emblem.svelte';
  import Home from './modules/home/Home.svelte';
  import Cours from './modules/cours/Cours.svelte';
  import Histoire from './modules/histoire/Histoire.svelte';
  import Comprendre from './modules/comprendre/Comprendre.svelte';
  import Projection from './modules/projection/Projection.svelte';
  import Rapidite from './modules/rapidite/Rapidite.svelte';
  import Puzzle from './modules/puzzle/Puzzle.svelte';
  import LanceParabole from './modules/lance/LanceParabole.svelte';

  let route = $derived(router.route);
  let isHome = $derived(route.page === '');
  let inStory = $derived(route.page === 'histoire');
</script>

<header class="top">
  <div class="container bar">
    <a href={router.href('')} class="brand" aria-label="Accueil">
      <Emblem size="1.9em" />
      <span class="name">Le livre de la restauration</span>
    </a>
    <nav class="row nav">
      {#if settings.projection}
        <button class="badge" onclick={() => (settings.projection = false)} aria-label="Quitter la projection" title="Quitter la projection">
          Projection <span aria-hidden="true">×</span>
        </button>
      {/if}
      {#if !isHome}
        {#if inStory}
          <a class="btn ghost small" href={router.href('cours')}>Le Cours</a>
        {:else}
          <a class="btn ghost small" href={router.href('histoire')}>L'Histoire</a>
        {/if}
        <a class="btn ghost small" href={router.href('')}>Accueil</a>
      {/if}
    </nav>
  </div>
</header>

<main class="container">
  {#if route.page === ''}
    <Home />
  {:else if route.page === 'cours'}
    <Cours />
  {:else if route.page === 'histoire'}
    <Histoire chapter={Number(route.segments[1] ?? '') || 0} />
  {:else if route.page === 'comprendre'}
    <Comprendre step={Number(route.segments[1] ?? '') || 0} />
  {:else if route.page === 'projection'}
    <Projection sub={route.segments[1] ?? ''} />
  {:else if route.page === 'rapidite'}
    <Rapidite mode={route.segments[1] ?? ''} />
  {:else if route.page === 'puzzle'}
    <Puzzle level={Number(route.segments[1] ?? '') || 0} />
  {:else if route.page === 'lance'}
    <LanceParabole level={Number(route.segments[1] ?? '') || 0} />
  {:else}
    <div class="card">
      <p>Cette page n'existe pas.</p>
      <a class="btn" href={router.href('')}>Retour à l'accueil</a>
    </div>
  {/if}
</main>

<style>
  .top {
    background: var(--papier);
    border-bottom: 1px solid var(--filet);
    margin-bottom: 1.25rem;
    position: sticky;
    top: 0;
    z-index: 5;
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-block: 0.35rem;
    min-height: var(--tap);
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    text-decoration: none;
    color: var(--encre);
    min-width: 0;
  }
  .name {
    font-family: var(--f-titre);
    font-weight: 700;
    font-size: 1.1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .nav {
    gap: 0.1rem;
    flex-wrap: nowrap;
  }
  .badge {
    background: var(--warn-soft);
    color: var(--ambre);
    border: 1px solid var(--ambre);
    border-radius: 999px;
    min-height: 0;
    padding: 0.2em 0.75em;
    font-size: 0.85em;
    font-weight: 700;
    white-space: nowrap;
  }
  @media (max-width: 520px) {
    .name {
      font-size: 0.95rem;
    }
    .nav :global(.btn.small) {
      padding-inline: 0.5em;
    }
  }
  @media (max-width: 400px) {
    .name {
      display: none;
    }
  }
</style>
