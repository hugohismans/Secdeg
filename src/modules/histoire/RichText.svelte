<script lang="ts">
  /** Texte de l'histoire : {nom}, *italique*, **gras**, $LaTeX$. */
  import Tex from '../../lib/Tex.svelte';
  import { progress } from '../../state/progress.svelte';

  interface Props {
    text: string;
  }
  let { text }: Props = $props();

  type Seg = { t: 'tex' | 'b' | 'i' | 'txt'; v: string };

  function parse(src: string, name: string): Seg[] {
    const s = src.replace(/\{nom\}/g, name);
    const out: Seg[] = [];
    const parts = s.split(/(\$[^$]+\$)/g);
    for (const p of parts) {
      if (!p) continue;
      if (p.startsWith('$') && p.endsWith('$') && p.length > 1) {
        out.push({ t: 'tex', v: p.slice(1, -1) });
        continue;
      }
      const sub = p.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      for (const q of sub) {
        if (!q) continue;
        if (q.startsWith('**') && q.endsWith('**')) out.push({ t: 'b', v: q.slice(2, -2) });
        else if (q.startsWith('*') && q.endsWith('*') && q.length > 1) out.push({ t: 'i', v: q.slice(1, -1) });
        else out.push({ t: 'txt', v: q });
      }
    }
    return out;
  }

  let segs = $derived(parse(text, progress.displayName));
</script>

{#each segs as s}{#if s.t === 'tex'}<Tex tex={s.v} />{:else if s.t === 'b'}<strong>{s.v}</strong>{:else if s.t === 'i'}<em>{s.v}</em>{:else}{s.v}{/if}{/each}
