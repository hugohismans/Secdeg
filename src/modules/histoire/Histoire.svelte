<script lang="ts">
  import { router } from '../../router.svelte';
  import { progress } from '../../state/progress.svelte';
  import CityMap from './CityMap.svelte';
  import ChapterPlayer from './ChapterPlayer.svelte';
  import { STORY_CHAPTERS } from './chapters';

  interface Props {
    chapter: number;
  }
  let { chapter }: Props = $props();

  let ch = $derived(STORY_CHAPTERS.find((c) => c.n === chapter) ?? null);
  let unlocked = $derived(chapter <= progress.storyDone + 1);
  let name = $state(progress.name);
</script>

{#if ch && unlocked}
  {#key chapter}
    <ChapterPlayer chapter={ch} />
  {/key}
{:else if ch}
  <div class="card">
    <p>Ce chapitre n'est pas encore ouvert. Termine d'abord le chapitre {progress.storyDone + 1}.</p>
    <a class="btn" href={router.href('histoire')}>Retour à la carte</a>
  </div>
{:else}
  <section class="map card">
    <CityMap chapters={STORY_CHAPTERS} done={progress.storyDone} onselect={(n) => router.go(`histoire/${n}`)} />
    <div class="legend">
      <span class="eyebrow">Madînat as-Salâm</span>
      <h1>La ville de la paix</h1>
      {#if progress.name}
        <p class="hi">« {progress.name}, le maître t'attend dans la salle des copistes. »</p>
      {:else}
        <label class="who">
          <span>Ton prénom, pour les dialogues :</span>
          <input type="text" bind:value={name} oninput={() => (progress.name = name)} maxlength="24" placeholder="Yasmine, Lucas…" />
        </label>
      {/if}
      <ol class="chap">
        {#each STORY_CHAPTERS as c}
          {@const s = c.n <= progress.storyDone ? 'done' : c.n === progress.storyDone + 1 ? 'current' : 'locked'}
          <li class={s}>
            {#if s === 'locked'}
              <span class="n">{c.n}</span><span class="t">{c.title}</span><span class="s">à venir</span>
            {:else}
              <a href={router.href(`histoire/${c.n}`)}>
                <span class="n">{c.n}</span><span class="t">{c.title}<small>{c.summary}</small></span><span class="s">{s === 'done' ? 'terminé' : 'à jouer'}</span>
              </a>
            {/if}
          </li>
        {/each}
      </ol>
    </div>
  </section>
{/if}

<style>
  .map {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(250px, 1fr);
    gap: 1.5rem;
    align-items: center;
    background: var(--papier);
  }
  @media (max-width: 760px) {
    .map {
      grid-template-columns: 1fr;
    }
  }
  .legend {
    display: grid;
    gap: 0.6rem;
    min-width: 0;
  }
  .legend h1 {
    margin: 0;
  }
  .hi {
    font-family: var(--f-titre);
    font-style: italic;
    color: var(--encre-douce);
    margin: 0;
  }
  .who {
    display: grid;
    gap: 0.3rem;
  }
  .chap {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 2px;
  }
  .chap li > a,
  .chap li.locked {
    display: grid;
    grid-template-columns: 1.8rem minmax(0, 1fr) auto;
    gap: 0.6rem;
    align-items: baseline;
    padding: 0.45rem 0.3rem;
    border-bottom: 1px dotted var(--filet);
    color: var(--encre);
    text-decoration: none;
  }
  .chap li > a:hover {
    background: var(--email);
  }
  .n {
    font-family: var(--f-titre);
    font-weight: 700;
    text-align: center;
    color: var(--encre-douce);
  }
  .t {
    font-weight: 500;
    min-width: 0;
  }
  .t small {
    display: block;
    font-weight: 400;
    color: var(--encre-douce);
    font-size: 0.85em;
  }
  .s {
    font-size: 0.8rem;
    color: var(--encre-douce);
  }
  .done .n {
    color: var(--cobalt);
  }
  .current > a {
    background: #f3e2c3;
    border-radius: 4px;
  }
  .current .n,
  .current .s {
    color: var(--ambre);
    font-weight: 700;
  }
  .locked .t {
    color: var(--encre-douce);
  }
</style>
