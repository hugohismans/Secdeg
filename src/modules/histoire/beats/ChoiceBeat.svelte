<script lang="ts">
  import type { ChoiceOption } from '../types';
  import RichText from '../RichText.svelte';
  import LineView from './LineView.svelte';
  import SifrHint from './SifrHint.svelte';

  interface Props {
    prompt: string;
    options: ChoiceOption[];
    hint?: string;
    onresolve: () => void;
  }
  let { prompt, options, hint, onresolve }: Props = $props();

  // le bloc est recréé à chaque choix : la valeur initiale suffit
  // svelte-ignore state_referenced_locally
  const free = !options.some((o) => o.ok);
  let tried = $state<number[]>([]);
  let last = $state<number | null>(null);
  let done = $state(false);
  let wrong = $derived(tried.filter((i) => !options[i].ok).length);
  let correctIndex = $derived(options.findIndex((o) => o.ok));

  function pick(i: number) {
    if (done || tried.includes(i)) return;
    tried = [...tried, i];
    last = i;
    if (free || options[i].ok) {
      done = true;
      onresolve();
    }
  }
</script>

<div class="choice">
  <p class="prompt"><strong><RichText text={prompt} /></strong></p>
  <div class="opts" role="group" aria-label="Réponses possibles">
    {#each options as o, i}
      <button
        class="opt"
        class:bad={tried.includes(i) && !o.ok && !free}
        class:good={done && i === last}
        class:pointed={!done && wrong >= 3 && i === correctIndex}
        disabled={done || tried.includes(i)}
        onclick={() => pick(i)}
      >
        <RichText text={o.label} />
      </button>
    {/each}
  </div>
  {#if last !== null && options[last].reply}
    <div class="replies">
      {#each options[last].reply ?? [] as line}<LineView {line} />{/each}
    </div>
  {:else if last !== null && !done}
    <p class="ko-msg">Ce n'est pas ça. Essaie une autre réponse.</p>
  {/if}
  {#if !done && wrong >= 3 && hint}
    <SifrHint text={hint} />
  {/if}
</div>

<style>
  .choice {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.6rem;
  }
  .prompt {
    margin: 0;
  }
  .opts {
    display: grid;
    gap: 0.5rem;
  }
  .opt {
    justify-content: flex-start;
    text-align: left;
    font-weight: 400;
    border-radius: var(--radius);
    background: var(--email);
    color: var(--encre);
    border: 1.5px solid var(--encre);
    padding: 0.6rem 0.9rem;
  }
  .opt:hover:not(:disabled) {
    background: var(--papier);
  }
  .opt.bad {
    border-color: var(--garance);
    background: var(--ko-soft);
    text-decoration: line-through;
    text-decoration-color: var(--garance);
  }
  .opt.good {
    border-color: var(--cuivre);
    background: var(--ok-soft);
    opacity: 1;
  }
  .opt.pointed {
    outline: 3px dashed var(--ambre);
    outline-offset: 2px;
  }
  .replies {
    display: grid;
    gap: 0.6rem;
  }
  .ko-msg {
    margin: 0;
    color: var(--garance);
  }
</style>
