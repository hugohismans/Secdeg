<script lang="ts">
  /** Rendu KaTeX d'une formule. `tex` est du LaTeX (pas de HTML utilisateur). */
  import katex from 'katex';

  interface Props {
    tex: string;
    display?: boolean;
    class?: string;
  }
  let { tex, display = false, class: cls = '' }: Props = $props();

  const cache = new Map<string, string>();

  function render(src: string, disp: boolean): string {
    const key = (disp ? 'D' : 'I') + src;
    const hit = cache.get(key);
    if (hit) return hit;
    const html = katex.renderToString(src, {
      displayMode: disp,
      throwOnError: false,
      strict: false,
      output: 'html',
    });
    cache.set(key, html);
    return html;
  }

  let html = $derived(render(tex, display));
</script>

{#if display}
  <div class="math-display {cls}">{@html html}</div>
{:else}
  <span class="math-inline {cls}">{@html html}</span>
{/if}

<style>
  .math-display {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100%;
  }
</style>
