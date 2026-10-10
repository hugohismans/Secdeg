<script lang="ts">
  import { router } from '../../router.svelte';
  import { progress } from '../../state/progress.svelte';
  import { COLORS, LANCE } from '../../config';
  import Tex from '../../lib/Tex.svelte';
  import Slider from '../../lib/Slider.svelte';
  import Hints from '../../lib/Hints.svelte';
  import Stars from '../../lib/Stars.svelte';
  import LevelGrid from '../../lib/LevelGrid.svelte';
  import Scene from './Scene.svelte';
  import { LEVELS } from './levels';
  import { checkShot, starsForShots, type ShotResult } from './logic';
  import { quad, discriminant, exactRoots, vertex } from '../../math/quadratic';
  import { toLatex } from '../../math/fraction';
  import { polyLatex, exactRootLatex } from '../../math/latex';

  interface Props {
    level: number;
  }
  let { level }: Props = $props();

  let lv = $derived(level >= 1 && level <= LEVELS.length ? LEVELS[level - 1] : null);
  let unlocked = $derived(progress.isUnlocked('lance', level));

  let a = $state(1);
  let b = $state(0);
  let c = $state(0);
  let shotId = $state(0);
  let shots = $state(0);
  let flying = $state(false);
  let result = $state<ShotResult | null>(null);
  let done = $state(false);
  let stars = $state(0);
  let hintsUsed = $state(0);

  $effect(() => {
    const l = lv;
    if (!l) return;
    a = l.start.a;
    b = l.start.b;
    c = l.start.c;
    shotId = 0;
    shots = 0;
    result = null;
    done = false;
    stars = 0;
    hintsUsed = 0;
    flying = false;
  });

  function fire() {
    if (flying || done) return;
    shots++;
    result = null;
    flying = true;
    shotId++;
  }

  function shotEnd() {
    if (!lv) return;
    flying = false;
    const r = checkShot(lv, a, b, c);
    result = r;
    if (r.ok) {
      done = true;
      stars = Math.max(1, starsForShots(shots) - (hintsUsed >= 3 ? 1 : 0));
      progress.setStars('lance', level, stars);
    }
  }

  let q = $derived(a !== 0 ? quad(a, b, c) : null);
  let eqTex = $derived(q ? `y = ${polyLatex(q)}` : `y = ${b}x + ${c}`);
  let deltaTex = $derived(q ? `\\Delta = ${toLatex(discriminant(q))}` : '');
  let rootsTex = $derived(q ? exactRoots(q).map(exactRootLatex) : []);
  let vTex = $derived(q ? `S\\left(${toLatex(vertex(q).x)}\\,;\\,${toLatex(vertex(q).y)}\\right)` : '');
</script>

{#if !lv}
  <h1>🎯 Lance-parabole</h1>
  <p class="muted">Le projectile suit la parabole y = ax² + bx + c. Règle les coefficients pour toucher les cibles, atterrir au bon endroit ou culminer à la bonne hauteur. Moins de tirs = plus d'étoiles.</p>
  <LevelGrid game="lance" levels={LEVELS} onselect={(n) => router.go(`lance/${n}`)} />
{:else if !unlocked}
  <div class="card">
    <p>Ce niveau est verrouillé : termine d'abord le niveau {level - 1}.</p>
    <a class="btn" href={router.href('lance')}>Retour aux niveaux</a>
  </div>
{:else}
  <div class="row between">
    <h1>Niveau {level} · {lv.title}</h1>
    <a class="btn ghost small" href={router.href('lance')}>Niveaux</a>
  </div>
  <p><strong>{lv.text}</strong></p>

  <div class="layout">
    <div class="scene">
      <Scene {a} {b} {c} level={lv} {shotId} onshotend={shotEnd} />
    </div>
    <div class="panel">
      <div class="eq"><Tex tex={eqTex} display /></div>
      <Slider label="a" bind:value={a} min={LANCE.aRange[0]} max={LANCE.aRange[1]} step={LANCE.step} color={COLORS.x2} />
      <Slider label="b" bind:value={b} min={LANCE.bRange[0]} max={LANCE.bRange[1]} step={LANCE.step} color={COLORS.bx} />
      <Slider label="c" bind:value={c} min={LANCE.cRange[0]} max={LANCE.cRange[1]} step={LANCE.step} color={COLORS.c} />
      <div class="row between">
        <button onclick={fire} disabled={flying || done} class="fire">🚀 Tirer</button>
        <span class="muted">Tirs : {shots}</span>
      </div>
      {#if result && !result.ok}
        <div class="feedback ko">✘ {result.message || 'Raté !'}</div>
      {/if}
      {#if done && q}
        <div class="feedback ok">
          <strong>🎯 Touché en {shots} tir{shots > 1 ? 's' : ''} !</strong>
          <Stars value={stars} size="1.6em" />
          <div class="recap">
            <Tex tex={eqTex} display />
            <Tex tex={deltaTex} display />
            {#if rootsTex.length > 0}
              <p>Racines (atterrissage) : {#each rootsTex as r, i}<span class="root"><Tex tex={`x_${i + 1} = ${r}`} /></span>{/each}</p>
            {:else}
              <p>Δ &lt; 0 : la trajectoire ne touche pas le sol.</p>
            {/if}
            <p>Sommet : <Tex tex={vTex} /></p>
          </div>
          <div class="row">
            {#if level < LEVELS.length}
              <a class="btn" href={router.href(`lance/${level + 1}`)}>Niveau suivant ▶</a>
            {/if}
            <a class="btn secondary" href={router.href('lance')}>Tous les niveaux</a>
          </div>
        </div>
      {:else}
        <Hints hints={lv.hints} resetKey={level} onreveal={() => hintsUsed++} />
      {/if}
    </div>
  </div>
{/if}

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
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 0.2rem 0.5rem;
  }
  .fire {
    font-size: 1.15em;
  }
  .recap p {
    margin: 0.2em 0;
  }
  .root {
    display: inline-block;
    margin-right: 1em;
  }
</style>
