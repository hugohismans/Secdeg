<script lang="ts">
  import { router } from './router.svelte';
  import { settings } from './state/settings.svelte';
  import Home from './modules/home/Home.svelte';
  import Comprendre from './modules/comprendre/Comprendre.svelte';
  import Projection from './modules/projection/Projection.svelte';
  import Rapidite from './modules/rapidite/Rapidite.svelte';
  import Puzzle from './modules/puzzle/Puzzle.svelte';
  import LanceParabole from './modules/lance/LanceParabole.svelte';

  let route = $derived(router.route);
  let isHome = $derived(route.page === '');
</script>

<header class="top">
  <div class="container row between">
    <a href={router.href('')} class="brand" aria-label="Accueil">
      <span class="logo">x²</span>
      <span>Second degré</span>
    </a>
    <div class="row">
      {#if settings.projection}
        <span class="badge">Mode projection</span>
      {/if}
      {#if !isHome}
        <a class="btn ghost small" href={router.href('')}>Accueil</a>
      {/if}
    </div>
  </div>
</header>

<main class="container">
  {#if route.page === ''}
    <Home />
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
      <p>Page introuvable.</p>
      <a class="btn" href={router.href('')}>Retour à l'accueil</a>
    </div>
  {/if}
</main>

<style>
  .top {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    margin-bottom: 1rem;
    position: sticky;
    top: 0;
    z-index: 5;
  }
  .top .container {
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    min-height: var(--tap);
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    text-decoration: none;
    color: var(--text);
  }
  .logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2em;
    height: 2em;
    border-radius: 8px;
    background: var(--primary);
    color: #fff;
    font-family: 'KaTeX_Math', serif;
    font-style: italic;
  }
  .badge {
    background: var(--warn-soft);
    color: var(--warn);
    border-radius: 999px;
    padding: 0.2em 0.7em;
    font-size: 0.85em;
    font-weight: 600;
  }
</style>
