<script lang="ts">
  /** Une partie des fontaines (un niveau), réutilisable dans l'Histoire. */
  import { COLORS, LANCE } from '../../config';
  import Tex from '../../lib/Tex.svelte';
  import Slider from '../../lib/Slider.svelte';
  import Hints from '../../lib/Hints.svelte';
  import Scene from './Scene.svelte';
  import type { LanceLevel } from './levels';
  import { checkShot, starsForShots, type ShotResult } from './logic';
  import { quad, discriminant, exactRoots, vertex } from '../../math/quadratic';
  import { toLatex } from '../../math/fraction';
  import { polyLatex, exactRootLatex } from '../../math/latex';

  export interface LanceResult {
    stars: number;
    shots: number;
  }
  interface Props {
    level: LanceLevel;
    ondone: (r: LanceResult) => void;
  }
  let { level, ondone }: Props = $props();

  // une partie = un niveau : le composant est recréé quand le niveau change
  // svelte-ignore state_referenced_locally
  let a = $state(level.start.a);
  // svelte-ignore state_referenced_locally
  let b = $state(level.start.b);
  // svelte-ignore state_referenced_locally
  let c = $state(level.start.c);
  let shotId = $state(0);
  let shots = $state(0);
  let flying = $state(false);
  let result = $state<ShotResult | null>(null);
  let done = $state(false);
  let stars = $state(0);
  let hintsUsed = $state(0);

  function fire() {
    if (flying || done) return;
    shots++;
    result = null;
    flying = true;
    shotId++;
  }

  function shotEnd() {
    flying = false;
    const r = checkShot(level, a, b, c);
    result = r;
    if (r.ok) {
      done = true;
      stars = Math.max(1, starsForShots(shots) - (hintsUsed >= 3 ? 1 : 0));
      ondone({ stars, shots });
    }
  }

  let q = $derived(a !== 0 ? quad(a, b, c) : null);
  let eqTex = $derived(q ? `y = ${polyLatex(q)}` : `y = ${b}x + ${c}`);
  let deltaTex = $derived(q ? `\\Delta = ${toLatex(discriminant(q))}` : '');
  let rootsTex = $derived(q ? exactRoots(q).map(exactRootLatex) : []);
  let vTex = $derived(q ? `S\\left(${toLatex(vertex(q).x)}\\,;\\,${toLatex(vertex(q).y)}\\right)` : '');
</script>

<p><strong>{level.text}</strong></p>
<div class="layout">
  <div class="scene">
    <Scene {a} {b} {c} {level} {shotId} onshotend={shotEnd} />
  </div>
  <div class="panel">
    <div class="eq"><Tex tex={eqTex} display /></div>
    <Slider label="a" bind:value={a} min={LANCE.aRange[0]} max={LANCE.aRange[1]} step={LANCE.step} color={COLORS.x2} />
    <Slider label="b" bind:value={b} min={LANCE.bRange[0]} max={LANCE.bRange[1]} step={LANCE.step} color={COLORS.bx} />
    <Slider label="c" bind:value={c} min={LANCE.cRange[0]} max={LANCE.cRange[1]} step={LANCE.step} color={COLORS.c} />
    <div class="row between">
      <button onclick={fire} disabled={flying || done} class="fire">Ouvrir la fontaine</button>
      <span class="muted">Essais : {shots}</span>
    </div>
    {#if result && !result.ok}
      <div class="feedback ko">✘ {result.message || 'Raté !'}</div>
    {/if}
    {#if done && q}
      <div class="feedback ok">
        <strong>Réussi en {shots} essai{shots > 1 ? 's' : ''} !</strong>
        <div class="recap">
          <Tex tex={eqTex} display />
          <Tex tex={deltaTex} display />
          {#if rootsTex.length > 0}
            <p>Le jet touche le sol en : {#each rootsTex as r, i}<span class="root"><Tex tex={`x_${i + 1} = ${r}`} /></span>{/each}</p>
          {:else}
            <p>Δ &lt; 0 : le jet ne touche jamais le sol.</p>
          {/if}
          <p>Sommet : <Tex tex={vTex} /></p>
        </div>
      </div>
    {:else}
      <Hints hints={level.hints} onreveal={() => hintsUsed++} />
    {/if}
  </div>
</div>

<style>
  .layout {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 860px) {
    .layout {
      grid-template-columns: minmax(0, 1.3fr) minmax(280px, 1fr);
      align-items: start;
    }
  }
  .eq {
    font-size: 1.15em;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.2rem 0.5rem;
  }
  .fire {
    font-size: 1.05em;
  }
  .recap p {
    margin: 0.2em 0;
  }
  .root {
    display: inline-block;
    margin-right: 1em;
  }
</style>
