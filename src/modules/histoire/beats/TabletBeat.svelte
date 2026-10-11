<script lang="ts">
  import SquareDiagram from '../../comprendre/SquareDiagram.svelte';
  import RichText from '../RichText.svelte';
  import type { SquareLabels } from '../types';

  interface Props {
    labels: SquareLabels;
    stage: 'initial' | 'cut' | 'moved' | 'completed';
    task?: 'place' | 'corner';
    prompt?: string;
    showAreas?: boolean;
    side?: string;
    onresolve: () => void;
  }
  let { labels, stage, task, prompt, showAreas = true, side, onresolve }: Props = $props();

  let placed = $state<[boolean, boolean]>([false, false]);
  let cornerDone = $state(false);
  let resolved = $state(false);

  let shownStage = $derived(
    task === 'corner' ? (cornerDone ? 'completed' : 'moved') : task === 'place' ? (placed[0] && placed[1] ? 'moved' : 'cut') : stage,
  );

  $effect(() => {
    if (resolved) return;
    if (task === 'place' && placed[0] && placed[1]) {
      resolved = true;
      onresolve();
    }
  });

  function corner() {
    if (cornerDone) return;
    cornerDone = true;
    resolved = true;
    onresolve();
  }
  function placeNext() {
    if (!placed[0]) placed = [true, placed[1]];
    else if (!placed[1]) placed = [true, true];
  }
</script>

<div class="tablet">
  {#if prompt}<p class="prompt"><strong><RichText text={prompt} /></strong></p>{/if}
  <SquareDiagram
    {labels}
    stage={shownStage}
    bind:placed
    interactive={task === 'place' && !resolved}
    cornerClickable={task === 'corner' && !cornerDone}
    showCornerHint={task === 'corner'}
    oncorner={corner}
    {showAreas}
    sideLabel={side}
  />
  {#if task === 'place' && !resolved}
    <div class="row"><button class="secondary small" onclick={placeNext}>Placer une bande pour moi</button></div>
  {:else if task === 'corner' && !cornerDone}
    <div class="row"><button class="secondary small" onclick={corner}>Compléter le coin</button></div>
  {/if}
</div>

<style>
  .tablet {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.6rem;
    background: var(--papier);
    border: 1px solid var(--filet);
    border-radius: var(--radius);
    padding: 0.75rem;
  }
  .prompt {
    margin: 0;
  }
</style>
