<script lang="ts">
  /**
   * Rendu KaTeX d'une formule. `tex` est du LaTeX (pas de HTML utilisateur).
   * En mode affichage, la formule ne peut jamais élargir la page : elle rétrécit
   * pour tenir dans la largeur disponible (jusqu'à MIN_FIT), puis défile dans son cadre.
   */
  import katex from 'katex';
  import { onMount, tick } from 'svelte';

  interface Props {
    tex: string;
    display?: boolean;
    class?: string;
  }
  let { tex, display = false, class: cls = '' }: Props = $props();

  const MIN_FIT = 0.6;
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
  let box: HTMLDivElement | undefined = $state();
  let fit = $state(1);

  function measure() {
    if (!box) return;
    const inner = box.querySelector('.katex-html') as HTMLElement | null;
    if (!inner) return;
    const avail = box.clientWidth - 4;
    const natural = inner.getBoundingClientRect().width / fit;
    if (natural <= 0 || avail <= 0) return;
    const next = Math.max(MIN_FIT, Math.min(1, avail / natural));
    if (Math.abs(next - fit) > 0.01) fit = next;
  }

  $effect(() => {
    void html;
    tick().then(measure);
  });

  onMount(() => {
    if (!display || !box || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(box);
    return () => ro.disconnect();
  });
</script>

{#if display}
  <div class="math-display {cls}" bind:this={box} style:font-size={fit < 1 ? `${fit}em` : undefined}>{@html html}</div>
{:else}
  <span class="math-inline {cls}">{@html html}</span>
{/if}

<style>
  /* width: 0 + min-width: 100% : remplit son parent sans jamais l'élargir */
  .math-display {
    width: 0;
    min-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }
</style>
