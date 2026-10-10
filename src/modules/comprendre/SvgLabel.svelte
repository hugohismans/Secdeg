<script lang="ts">
  /**
   * Étiquette dans un SVG : "x", "3", "b/2a" (rendu en fraction), "x²".
   * Les lettres sont en italique mathématique.
   */
  interface Props {
    text: string;
    x: number;
    y: number;
    size?: number;
    fill?: string;
    anchor?: 'start' | 'middle' | 'end';
    weight?: string;
  }
  let { text, x, y, size = 18, fill = '#1a202c', anchor = 'middle', weight = '600' }: Props = $props();

  let parts = $derived.by(() => {
    const i = text.indexOf('/');
    if (i < 0) return null;
    return { num: text.slice(0, i), den: text.slice(i + 1) };
  });

  /** Découpe "6x", "x²", "b²" en tspans : lettres en italique, chiffres droits. */
  function spans(s: string): { t: string; italic: boolean; sup: boolean }[] {
    const out: { t: string; italic: boolean; sup: boolean }[] = [];
    for (const ch of s) {
      if (ch === '²') out.push({ t: '2', italic: false, sup: true });
      else out.push({ t: ch, italic: /[a-zΔ]/i.test(ch), sup: false });
    }
    return out;
  }
  let fracWidth = $derived(Math.max(parts?.num.length ?? 0, parts?.den.length ?? 0) * size * 0.6 + 4);
</script>

{#snippet rich(s: string, px: number, py: number, fs: number)}
  <text x={px} y={py} font-size={fs} {fill} text-anchor={anchor} font-weight={weight} dominant-baseline="middle">
    {#each spans(s) as sp}
      {#if sp.sup}
        <tspan font-size={fs * 0.65} dy={-fs * 0.4}>{sp.t}</tspan>
      {:else}
        <tspan font-style={sp.italic ? 'italic' : 'normal'} font-family={sp.italic ? "'KaTeX_Math', 'Times New Roman', serif" : 'inherit'}>{sp.t}</tspan>
      {/if}
    {/each}
  </text>
{/snippet}

{#if parts}
  {@const half = fracWidth / 2}
  {@const ox = anchor === 'middle' ? 0 : anchor === 'start' ? half : -half}
  <g>
    {@render rich(parts.num, x + ox, y - size * 0.55, size * 0.85)}
    <line x1={x + ox - half} y1={y} x2={x + ox + half} y2={y} stroke={fill} stroke-width="1.5" />
    {@render rich(parts.den, x + ox, y + size * 0.6, size * 0.85)}
  </g>
{:else}
  {@render rich(text, x, y, size)}
{/if}
