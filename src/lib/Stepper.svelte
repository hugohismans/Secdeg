<script lang="ts">
  /** Barre suivant / précédent avec points de progression. */
  interface Props {
    index: number;
    count: number;
    canNext?: boolean;
    nextLabel?: string;
    onprev: () => void;
    onnext: () => void;
    labels?: string[];
  }
  let { index, count, canNext = true, nextLabel = 'Suivant', onprev, onnext, labels = [] }: Props = $props();
</script>

<nav class="stepper" aria-label="Navigation entre les étapes">
  <button class="secondary" onclick={onprev} disabled={index <= 0} aria-label="Étape précédente">◀ Précédent</button>
  <ol class="dots" aria-label="Progression">
    {#each Array(count) as _, i}
      <li class:done={i < index} class:current={i === index} title={labels[i] ?? `Étape ${i + 1}`}>
        <span class="visually-hidden">{labels[i] ?? `Étape ${i + 1}`}</span>
      </li>
    {/each}
  </ol>
  <button onclick={onnext} disabled={!canNext || index >= count - 1} aria-label="Étape suivante">{nextLabel} ▶</button>
</nav>

<style>
  .stepper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin: 1rem 0;
    position: sticky;
    bottom: 0;
    background: var(--bg);
    padding: 0.5rem 0;
    z-index: 2;
  }
  .dots {
    display: flex;
    gap: 6px;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
    justify-content: center;
  }
  .dots li {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--border);
  }
  .dots li.done {
    background: var(--primary-soft);
    border: 2px solid var(--primary);
  }
  .dots li.current {
    background: var(--primary);
    transform: scale(1.3);
  }
  @media (max-width: 480px) {
    .dots {
      display: none;
    }
  }
</style>
