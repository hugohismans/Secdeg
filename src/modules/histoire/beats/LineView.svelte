<script lang="ts">
  import type { Line } from '../types';
  import { CHARACTERS } from '../characters';
  import Medallion from '../Medallion.svelte';
  import RichText from '../RichText.svelte';
  interface Props {
    line: Line;
  }
  let { line }: Props = $props();
</script>

{#if line.who === 'narr'}
  <p class="narr"><RichText text={line.text} /></p>
{:else}
  <div class="say">
    <Medallion who={line.who} size="56px" />
    <div class="bubble">
      <span class="who">{CHARACTERS[line.who].name}</span>
      <RichText text={line.text} />
    </div>
  </div>
{/if}

<style>
  .narr {
    font-family: var(--f-titre);
    font-style: italic;
    font-size: 1.08rem;
    color: var(--encre-douce);
    margin: 0;
    padding-left: 0.9rem;
    border-left: 2px solid var(--or);
  }
  .narr :global(em) {
    font-style: normal;
  }
  .say {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 0.75rem;
    align-items: start;
  }
  .bubble {
    background: var(--email);
    border: 1px solid var(--filet);
    border-radius: 4px 14px 14px 14px;
    padding: 0.65rem 0.9rem;
    min-width: 0;
  }
  .who {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--cobalt);
    margin-bottom: 0.1rem;
  }
</style>
