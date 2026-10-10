<script lang="ts">
  import { router } from '../../router.svelte';
  import { progress } from '../../state/progress.svelte';
  import { settings } from '../../state/settings.svelte';
  import Stars from '../../lib/Stars.svelte';

  const games = [
    { key: 'rapidite', path: 'rapidite', icon: '⚡', title: 'Rapidité', text: '0, 1 ou 2 solutions ? Δ de tête ? Réponds vite.' },
    { key: 'puzzle', path: 'puzzle', icon: '🧩', title: 'Puzzle de tuiles', text: 'Complète le carré avec des tuiles x², x et 1.' },
    { key: 'lance', path: 'lance', icon: '🎯', title: 'Lance-parabole', text: 'Règle a, b, c pour toucher les cibles.' },
  ];
</script>

<section class="hero card">
  <h1>Équations du second degré</h1>
  <p class="muted">Comprendre d'où vient la formule, puis s'entraîner en jouant.</p>
  <div class="row">
    <a class="btn big" href={router.href('comprendre/' + progress.comprendreStep)}>
      📐 {progress.comprendreStep > 0 && !progress.comprendreDone ? 'Reprendre « Comprendre »' : 'Comprendre la formule'}
    </a>
    {#if progress.comprendreDone}<span class="ok">✔ Module terminé</span>{/if}
  </div>
</section>

<h2>Jeux</h2>
<div class="games">
  {#each games as g}
    <a class="card game" href={router.href(g.path)}>
      <span class="icon">{g.icon}</span>
      <span class="title">{g.title}</span>
      <span class="muted text">{g.text}</span>
      {#if g.key === 'rapidite'}
        <span class="muted small">Record : {progress.best('rapidite:count')} pts</span>
      {:else}
        <Stars value={progress.totalStars(g.key)} max={Math.max(3, progress.totalStars(g.key))} size="0.9em" />
      {/if}
    </a>
  {/each}
</div>

<h2>Pour le prof</h2>
<div class="card row between">
  <div>
    <strong>Mode projection</strong>
    <p class="muted" style="margin:0">Texte et éléments agrandis, sans chrono ni score, pour le tableau.</p>
  </div>
  <div class="row">
    <label class="row"><input type="checkbox" bind:checked={settings.projection} /> Activer</label>
    <a class="btn secondary" href={router.href('projection')}>Ouvrir</a>
  </div>
</div>

<style>
  .hero {
    margin-bottom: 1.25rem;
  }
  .big {
    font-size: 1.1em;
  }
  .games {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }
  .game {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-decoration: none;
    color: var(--text);
    transition: transform 0.1s ease;
  }
  .game:active {
    transform: scale(0.98);
  }
  .icon {
    font-size: 1.8em;
  }
  .title {
    font-weight: 700;
    font-size: 1.1em;
  }
  .text {
    font-size: 0.95em;
  }
  .small {
    font-size: 0.85em;
  }
  input[type='checkbox'] {
    width: 1.4em;
    height: 1.4em;
  }
</style>
