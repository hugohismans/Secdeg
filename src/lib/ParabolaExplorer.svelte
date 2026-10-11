<script lang="ts">
  /**
   * Parabole à curseurs a, b, c avec Δ, racines, sommet et axe en direct.
   * Utilisée dans le module Comprendre (étapes C et D) et en mode projection.
   */
  import Parabola from './Parabola.svelte';
  import Slider from './Slider.svelte';
  import Tex from './Tex.svelte';
  import { COLORS, PARABOLA } from '../config';
  import { quad, discriminant, exactRoots, rootCount, axis, vertex } from '../math/quadratic';
  import { toNumber, toLatex } from '../math/fraction';
  import { polyLatex, exactRootLatex, decimalLatex, sqrtLatex } from '../math/latex';

  interface Props {
    a?: number;
    b?: number;
    c?: number;
    showAxis?: boolean;
    showArrows?: boolean;
    showVertex?: boolean;
    /** affiche le détail centre ± écart */
    showSpread?: boolean;
    /** boutons de cas préréglés (Δ > 0, = 0, < 0) */
    presets?: boolean;
  }
  let {
    a = $bindable(1), b = $bindable(-2), c = $bindable(-3),
    showAxis = false, showArrows = false, showVertex = false, showSpread = false, presets = true,
  }: Props = $props();

  let q = $derived(a === 0 ? null : quad(a, b, c));
  let delta = $derived(q ? toNumber(discriminant(q)) : NaN);
  let count = $derived(q ? rootCount(q) : 0);
  let ex = $derived(q ? exactRoots(q) : []);
  let ax = $derived(q ? axis(q) : null);
  let vt = $derived(q ? vertex(q) : null);
  let deltaTex = $derived(
    q
      ? `\\begin{aligned} \\Delta &= b^2 - 4ac \\\\ &= (${b})^2 - 4 \\cdot (${a}) \\cdot (${c}) \\\\ &= ${delta} \\end{aligned}`.replace(/(\d)\.(\d)/g, '$1{,}$2')
      : '',
  );

  let caseText = $derived(
    count === 2 ? 'Δ > 0 : deux solutions, la parabole coupe l\'axe des x en deux points.'
    : count === 1 ? 'Δ = 0 : une solution double, la parabole touche l\'axe des x en un seul point (son sommet).'
    : 'Δ < 0 : pas de solution dans ℝ, la parabole ne coupe pas l\'axe des x.',
  );

  function preset(kind: 0 | 1 | 2) {
    if (kind === 2) { a = 1; b = -2; c = -3; }
    else if (kind === 1) { a = 1; b = -4; c = 4; }
    else { a = 1; b = -2; c = 3; }
  }
</script>

<div class="explorer">
  <div class="graph">
    <Parabola {a} {b} {c} xMin={PARABOLA.xMin} xMax={PARABOLA.xMax} yMin={PARABOLA.yMin} yMax={PARABOLA.yMax} {showAxis} {showArrows} {showVertex} />
  </div>
  <div class="panel">
    <div class="eq-main"><Tex tex={q ? `y = ${polyLatex(q)}` : `y = ${b}x + ${c}`} display /></div>
    <Slider label="a" bind:value={a} min={PARABOLA.aRange[0]} max={PARABOLA.aRange[1]} step={PARABOLA.step} color={COLORS.x2} />
    <Slider label="b" bind:value={b} min={PARABOLA.bRange[0]} max={PARABOLA.bRange[1]} step={PARABOLA.step} color={COLORS.bx} />
    <Slider label="c" bind:value={c} min={PARABOLA.cRange[0]} max={PARABOLA.cRange[1]} step={PARABOLA.step} color={COLORS.c} />
    {#if presets}
      <div class="row presets">
        <button class="secondary small" onclick={() => preset(2)}>Δ &gt; 0</button>
        <button class="secondary small" onclick={() => preset(1)}>Δ = 0</button>
        <button class="secondary small" onclick={() => preset(0)}>Δ &lt; 0</button>
      </div>
    {/if}
    {#if q}
      <div class="readout" style="border-color: {COLORS.delta}">
        <Tex tex={deltaTex} display />
        <p class="case"><strong>{caseText}</strong></p>
        {#if count > 0}
          <p>
            {count === 2 ? 'Racines' : 'Racine double'} :
            {#each ex as r, i}
              <span class="root"><Tex tex={`x_${i + 1} = ${exactRootLatex(r)}`} />{#if r.k !== 0}<span class="muted"> ≈ <Tex tex={decimalLatex((r.num + r.k * Math.sqrt(r.r)) / r.den)} /></span>{/if}</span>
            {/each}
          </p>
        {/if}
        {#if showSpread && ax}
          <p>
            Axe de symétrie : <Tex tex={`x = -\\frac{b}{2a} = ${toLatex(ax)}`} />
            {#if count === 2}
              <br />Écart : <Tex tex={`\\frac{\\sqrt{\\Delta}}{2a} = \\frac{${sqrtLatex(delta)}}{${2 * a}}`.replace(/\./g, '{,}')} />
              <Tex tex={`\\approx ${decimalLatex(Math.sqrt(delta) / (2 * Math.abs(a)))}`} />
            {/if}
          </p>
        {/if}
        {#if showVertex && vt}
          <p>Sommet : <Tex tex={`S\\left(${toLatex(vt.x)} \\;;\\; ${toLatex(vt.y)}\\right)`} /></p>
        {/if}
      </div>
    {:else}
      <div class="feedback warn">Avec a = 0, ce n'est plus une équation du second degré (la courbe est une droite).</div>
    {/if}
  </div>
</div>

<style>
  .explorer {
    display: grid;
    gap: 1rem;
    grid-template-columns: minmax(0, 1fr);
  }
  @media (min-width: 820px) {
    .explorer {
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, 1fr);
      align-items: start;
    }
  }
  .eq-main {
    font-size: 1.15em;
  }
  .presets {
    margin: 0.5rem 0;
  }
  .readout {
    background: var(--surface);
    border-left: 4px solid;
    border-radius: var(--radius);
    padding: 0.5rem 0.75rem;
    margin-top: 0.5rem;
    box-shadow: var(--shadow);
  }
  .readout p {
    margin: 0.3em 0;
  }
  .root {
    display: inline-block;
    margin-right: 1em;
  }
</style>
