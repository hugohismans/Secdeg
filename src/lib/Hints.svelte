<script lang="ts">
  /**
   * Indices gradués : 1) vague, 2) précis, 3) correction détaillée.
   * Chaque indice est une liste de lignes ; une ligne commençant par "$$" est
   * rendue en LaTeX (mode affichage).
   */
  import Tex from './Tex.svelte';
  import { HINTS } from '../config';

  interface Props {
    hints: string[][];
    onreveal?: (level: number) => void;
    /** réinitialise quand cette valeur change */
    resetKey?: unknown;
  }
  let { hints, onreveal, resetKey }: Props = $props();

  let revealed = $state(0);
  $effect(() => {
    void resetKey;
    revealed = 0;
  });

  const labels = ['Un petit indice', 'Un indice précis', 'La correction complète'];

  function reveal() {
    if (revealed < Math.min(hints.length, HINTS.levels)) {
      revealed++;
      onreveal?.(revealed);
    }
  }
</script>

<div class="hints">
  {#each hints.slice(0, revealed) as lines, i}
    <div class="hint feedback info">
      <strong>{labels[i] ?? `Indice ${i + 1}`}</strong>
      {#each lines as line}
        {#if line.startsWith('$$')}
          <Tex tex={line.slice(2)} display />
        {:else}
          <p>{line}</p>
        {/if}
      {/each}
    </div>
  {/each}
  {#if revealed < Math.min(hints.length, HINTS.levels)}
    <button class="secondary small" onclick={reveal}>
      💡 {revealed === 0 ? "J'ai besoin d'un indice" : revealed === 1 ? 'Un indice plus précis' : 'Voir la correction'}
    </button>
  {/if}
</div>

<style>
  .hints {
    margin: 0.75rem 0;
  }
  .hint p:last-child {
    margin-bottom: 0;
  }
</style>
