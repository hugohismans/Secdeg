<script lang="ts">
  /** Grille de niveaux avec cadenas et étoiles. */
  import Stars from './Stars.svelte';
  import { progress } from '../state/progress.svelte';

  interface Props {
    game: string;
    levels: { title: string; subtitle?: string }[];
    onselect: (level: number) => void;
  }
  let { game, levels, onselect }: Props = $props();
</script>

<ul class="grid">
  {#each levels as lv, i}
    {@const n = i + 1}
    {@const unlocked = progress.isUnlocked(game, n)}
    <li>
      <button class="level secondary" disabled={!unlocked} onclick={() => onselect(n)} aria-label="Niveau {n} : {lv.title}">
        <span class="num">{n}</span>{#if !unlocked}<span class="lock">verrouillé</span>{/if}
        <span class="title">{lv.title}</span>
        {#if lv.subtitle}<span class="sub muted">{lv.subtitle}</span>{/if}
        <Stars value={progress.stars(game, n)} size="1em" />
      </button>
    </li>
  {/each}
</ul>

<style>
  .grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }
  .level {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: 0.75rem;
    gap: 0.2rem;
    min-height: 100px;
  }
  .num {
    font-family: var(--f-titre);
    font-weight: 700;
    font-size: 1.4em;
  }
  .title {
    font-weight: 600;
  }
  .lock {
    font-size: 0.8em;
    color: var(--muted);
    font-weight: 400;
  }
  .sub {
    font-size: 0.85em;
    font-weight: 400;
  }
</style>
