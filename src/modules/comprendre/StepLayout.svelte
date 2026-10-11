<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props {
    title: string;
    visual?: Snippet;
    children: Snippet;
  }
  let { title, visual, children }: Props = $props();
</script>

<section class="step">
  <h2>{title}</h2>
  <div class="split" class:has-visual={!!visual}>
    {#if visual}
      <div class="visual">{@render visual()}</div>
    {/if}
    <div class="text">{@render children()}</div>
  </div>
</section>

<style>
  .step {
    animation: fade var(--step-ms, 250ms) ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  .split {
    display: grid;
    gap: 1rem;
    grid-template-columns: minmax(0, 1fr);
  }
  @media (min-width: 820px) {
    .split.has-visual {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      align-items: start;
    }
  }
  .visual {
    position: sticky;
    top: calc(var(--tap) + 1rem);
  }
  @media (max-width: 819px) {
    .visual {
      position: static;
    }
  }
  .text :global(.eq) {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 0.5rem 0.75rem;
    margin: 0.5rem 0;
    box-shadow: var(--shadow);
  }
  .text :global(.eq.side) {
    background: var(--primary-soft);
    box-shadow: none;
    font-size: 0.9em;
  }
  .text :global(.eq.side .lbl) {
    display: block;
    font-size: 0.85em;
    color: var(--muted);
    margin-bottom: 0.2em;
  }
  .text :global(.actions) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.75rem 0;
  }
  .text :global(.choices) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }
</style>
