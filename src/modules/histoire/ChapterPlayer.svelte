<script lang="ts">
  /**
   * Joue un chapitre : les blocs apparaissent un par un ; les blocs interactifs
   * (choix, saisie, tablette, jeux) attendent d'être résolus.
   */
  import { tick } from 'svelte';
  import type { Beat, Chapter } from './types';
  import { progress } from '../../state/progress.svelte';
  import { router } from '../../router.svelte';
  import Tex from '../../lib/Tex.svelte';
  import Frieze from '../../lib/Frieze.svelte';
  import Sifr from '../../lib/Sifr.svelte';
  import RichText from './RichText.svelte';
  import LineView from './beats/LineView.svelte';
  import ChoiceBeat from './beats/ChoiceBeat.svelte';
  import InputBeat from './beats/InputBeat.svelte';
  import TabletBeat from './beats/TabletBeat.svelte';
  import RevealBeat from './beats/RevealBeat.svelte';
  import SymbolicSolver from '../puzzle/SymbolicSolver.svelte';
  import PuzzlePlay from '../puzzle/PuzzlePlay.svelte';
  import LancePlay from '../lance/LancePlay.svelte';
  import RapiditeRound, { type RoundResult } from '../rapidite/RapiditeRound.svelte';
  import ParabolaExplorer from '../../lib/ParabolaExplorer.svelte';
  import { symbolicSteps } from '../puzzle/logic';
  import { STORY_CHAPTERS } from './chapters';

  interface Props {
    chapter: Chapter;
  }
  let { chapter }: Props = $props();

  let shown = $state(1);
  let resolved = $state<Record<number, boolean>>({});
  let rapidResult = $state<Record<number, RoundResult | null>>({});
  let rapidKey = $state(0);
  let flow: HTMLElement | undefined = $state();

  function isBlocking(b: Beat): boolean {
    return ['choice', 'input', 'solver', 'puzzle', 'lance', 'rapidite', 'reveal'].includes(b.kind) || (b.kind === 'tablet' && !!b.task);
  }

  let lastIndex = $derived(shown - 1);
  let waiting = $derived(isBlocking(chapter.beats[lastIndex]) && !resolved[lastIndex]);
  let finished = $derived(shown >= chapter.beats.length && !waiting);

  $effect(() => {
    if (finished) progress.finishChapter(chapter.n);
  });

  async function next() {
    if (waiting || shown >= chapter.beats.length) return;
    shown++;
    await tick();
    const el = flow?.querySelector(`[data-beat="${shown - 1}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resolve(i: number) {
    resolved = { ...resolved, [i]: true };
  }

  function rapidDone(i: number, r: RoundResult, min: number) {
    rapidResult = { ...rapidResult, [i]: r };
    if (r.correct >= min) resolve(i);
  }
  function rapidRetry(i: number) {
    rapidResult = { ...rapidResult, [i]: null };
    rapidKey++;
  }

  function onKey(e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'BUTTON' || t.tagName === 'A' || t.closest('svg'))) return;
    e.preventDefault();
    next();
  }

  let nextChapter = $derived(STORY_CHAPTERS.find((c) => c.n === chapter.n + 1));
</script>

<svelte:window onkeydown={onKey} />

<article class="chapter">
  <header class="head">
    <Frieze height={14} />
    <div class="titles">
      <span class="eyebrow">Chapitre {chapter.n} sur {STORY_CHAPTERS.length}</span>
      <h1>{chapter.title}</h1>
    </div>
  </header>

  <div class="flow" bind:this={flow}>
    {#each chapter.beats.slice(0, shown) as beat, i (i)}
      <section class="beat kind-{beat.kind}" data-beat={i}>
        {#if beat.kind === 'place'}
          <p class="place">{beat.text}</p>
        {:else if beat.kind === 'narr'}
          <LineView line={{ who: 'narr', text: beat.text }} />
        {:else if beat.kind === 'say'}
          <LineView line={{ who: beat.who, text: beat.text }} />
        {:else if beat.kind === 'math'}
          <div class="mathbox">
            {#if beat.words}<p class="words"><RichText text={beat.words} /></p>{/if}
            {#if beat.tex}<Tex tex={beat.tex} display />{/if}
          </div>
        {:else if beat.kind === 'choice'}
          <ChoiceBeat prompt={beat.prompt} options={beat.options} hint={beat.hint} onresolve={() => resolve(i)} />
        {:else if beat.kind === 'input'}
          <InputBeat prompt={beat.prompt} expected={beat.expected} placeholder={beat.placeholder} hints={beat.hints} success={beat.success} onresolve={() => resolve(i)} />
        {:else if beat.kind === 'tablet'}
          <TabletBeat labels={beat.labels} stage={beat.stage} task={beat.task} prompt={beat.prompt} showAreas={beat.showAreas} side={beat.side} onresolve={() => resolve(i)} />
        {:else if beat.kind === 'solver'}
          <div class="activity">
            {#if beat.intro}<p><strong><RichText text={beat.intro} /></strong></p>{/if}
            <SymbolicSolver q={beat.q} steps={symbolicSteps(beat.q)} ondone={() => resolve(i)} />
            {#if resolved[i]}<p class="done-msg">✔ Résolu.</p>{/if}
          </div>
        {:else if beat.kind === 'puzzle'}
          <div class="activity">
            {#if beat.intro}<p><strong><RichText text={beat.intro} /></strong></p>{/if}
            <PuzzlePlay level={beat.level} ondone={() => resolve(i)} />
            {#if resolved[i]}<p class="done-msg">✔ La cour est carrelée.</p>{/if}
          </div>
        {:else if beat.kind === 'lance'}
          <div class="activity">
            {#if beat.intro}<p><strong><RichText text={beat.intro} /></strong></p>{/if}
            <LancePlay level={beat.level} ondone={() => resolve(i)} />
          </div>
        {:else if beat.kind === 'rapidite'}
          <div class="activity">
            {#if beat.intro}<p><strong><RichText text={beat.intro} /></strong></p>{/if}
            {#if !rapidResult[i]}
              {#key rapidKey}
                <RapiditeRound mode="count" total={beat.total} timed timeFactor={beat.timeFactor} ondone={(r) => rapidDone(i, r, beat.minCorrect)} />
              {/key}
            {:else}
              {@const r = rapidResult[i]!}
              <p class="score">{r.correct} bonnes réponses sur {r.total}.</p>
              {#if !resolved[i]}
                <div class="replies">{#each beat.retry as line}<LineView {line} />{/each}</div>
                <button onclick={() => rapidRetry(i)}>Recommencer</button>
              {/if}
            {/if}
          </div>
        {:else if beat.kind === 'explorer'}
          <div class="activity">
            <p><strong><RichText text={beat.prompt} /></strong></p>
            <ParabolaExplorer a={beat.a} b={beat.b} c={beat.c} />
          </div>
        {:else if beat.kind === 'reveal'}
          <RevealBeat onresolve={() => resolve(i)} />
        {/if}
      </section>
    {/each}
  </div>

  {#if !finished}
    <div class="continue">
      {#if !waiting}
        <button onclick={next}>Continuer</button>
      {:else}
        <span class="muted wait">À toi de jouer.</span>
      {/if}
    </div>
  {:else}
    <div class="end card">
      <Sifr width="70px" />
      <div>
        <h2>Fin du chapitre {chapter.n}</h2>
        <div class="row">
          {#if nextChapter}
            <a class="btn" href={router.href(`histoire/${nextChapter.n}`)}>Chapitre {nextChapter.n} : {nextChapter.title}</a>
          {:else}
            <a class="btn" href={router.href('comprendre/11')}>Ouvrir la fiche mémo</a>
            <a class="btn secondary" href={router.href('cours')}>Le Cours</a>
          {/if}
          <a class="btn secondary" href={router.href('histoire')}>Retour à la carte</a>
        </div>
      </div>
    </div>
  {/if}
</article>

<style>
  .chapter {
    max-width: 820px;
    margin: 0 auto;
    min-width: 0;
  }
  .head {
    background: var(--email);
    border: 1px solid var(--filet);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 1.25rem;
  }
  .titles {
    padding: 0.8rem 1rem 0.9rem;
  }
  .titles h1 {
    margin: 0.1rem 0 0;
  }
  .flow {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
  }
  .beat {
    animation: rise 0.35s ease-out;
    scroll-margin-top: calc(var(--tap) + 1.5rem);
  }
  @keyframes rise {
    from {
      opacity: 0.2;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  .place {
    margin: 0.75rem 0 0;
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--or);
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .place::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--filet);
  }
  .mathbox {
    background: var(--email);
    border: 1px solid var(--filet);
    border-radius: var(--radius);
    padding: 0.5rem 0.9rem;
    text-align: center;
  }
  .mathbox :global(.katex-display) {
    font-size: 1.15em;
  }
  .words {
    font-family: var(--f-titre);
    font-size: 1.15rem;
    margin: 0.3rem 0 0;
  }
  .activity {
    grid-template-columns: minmax(0, 1fr);
    background: var(--papier);
    border: 1px solid var(--filet);
    border-radius: var(--radius);
    padding: 0.9rem;
    display: grid;
    gap: 0.5rem;
  }
  .activity > p {
    margin: 0;
  }
  .done-msg {
    color: var(--cuivre);
    font-weight: 700;
  }
  .score {
    font-family: var(--f-titre);
    font-size: 1.2rem;
  }
  .replies {
    display: grid;
    gap: 0.6rem;
  }
  .continue {
    position: sticky;
    bottom: 0;
    padding: 0.8rem 0;
    background: linear-gradient(to top, var(--papier) 70%, transparent);
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
  }
  .continue button {
    min-width: 12rem;
  }
  .wait {
    font-family: var(--f-titre);
    font-style: italic;
  }
  .end {
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: 70px minmax(0, 1fr);
    gap: 1rem;
    align-items: center;
  }
  .end h2 {
    margin: 0 0 0.5rem;
  }
</style>
