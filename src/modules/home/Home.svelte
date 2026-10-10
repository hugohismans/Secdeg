<script lang="ts">
  import { router } from '../../router.svelte';
  import { progress } from '../../state/progress.svelte';
  import Frieze from '../../lib/Frieze.svelte';
  import { STORY_CHAPTERS } from '../histoire/chapters';

  let name = $state(progress.name);
  function saveName() {
    progress.name = name;
  }
  let next = $derived(Math.min(progress.storyDone + 1, STORY_CHAPTERS.length));
  let storyLabel = $derived(
    progress.storyDone >= STORY_CHAPTERS.length
      ? 'Revoir la carte'
      : progress.storyDone > 0
        ? `Reprendre au chapitre ${next}`
        : 'Commencer le chapitre 1',
  );
</script>

<section class="screen">
  <Frieze height={22} />
  <div class="home">
    <div class="head">
      <span class="ar big" lang="ar">الجبر والمقابلة</span>
      <h1>Le livre de la restauration</h1>
      <p class="sub">Bagdad, an 820. Apprends l'algèbre là où elle est née.</p>
    </div>

    <div class="name">
      <label for="prenom">Ton prénom :</label>
      <input id="prenom" type="text" bind:value={name} oninput={saveName} placeholder="Yasmine, Lucas…" autocomplete="off" maxlength="24" />
    </div>

    <div class="modes">
      <article class="mode story">
        <svg class="star-bg" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 4 L61 39 L96 50 L61 61 L50 96 L39 61 L4 50 L39 39 Z" />
          <path d="M50 18 L73 27 L82 50 L73 73 L50 82 L27 73 L18 50 L27 27 Z" />
        </svg>
        <span class="eyebrow">L'Histoire</span>
        <h2>Entrer à la Maison de la Sagesse</h2>
        <p>Sept chapitres. Tu découvres le carré, la racine et Δ aux côtés d'al-Khwârizmî, en jouant.</p>
        <a class="btn solid" href={router.href(progress.storyDone > 0 ? 'histoire' : 'histoire/1')} onclick={saveName}>{storyLabel}</a>
      </article>
      <article class="mode">
        <span class="eyebrow">Le Cours</span>
        <h2>Le cours, sans détour</h2>
        <p>Douze étapes pour comprendre d'où vient la formule. Pour réviser seul ou projeter en classe.</p>
        <a class="btn secondary" href={router.href('cours')}>Ouvrir le cours</a>
      </article>
    </div>
  </div>
</section>

<style>
  .screen {
    background: var(--email);
    border: 1px solid var(--filet);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
  }
  .home {
    padding: 2rem clamp(1rem, 4vw, 3rem) 2.25rem;
    display: grid;
    gap: 1.6rem;
  }
  .head {
    display: grid;
    gap: 0.3rem;
    text-align: center;
    justify-items: center;
  }
  .big {
    font-size: clamp(2rem, 6vw, 3.1rem);
    color: var(--cobalt);
    line-height: 1.25;
  }
  .head h1 {
    font-size: clamp(1.9rem, 5.5vw, 3rem);
    font-weight: 800;
    margin: 0;
  }
  .sub {
    color: var(--encre-douce);
    font-family: var(--f-titre);
    font-style: italic;
    font-size: 1.15rem;
    margin: 0;
  }
  .name {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;
    justify-content: center;
  }
  .name label {
    font-family: var(--f-titre);
    font-size: 1.15rem;
  }
  .name input {
    width: 13em;
    font-size: 1.1rem;
    background: var(--papier);
  }
  .modes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
  }
  .mode {
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    gap: 0.5rem;
    padding: 1.3rem 1.3rem 1.2rem;
    border-radius: var(--radius);
    border: 1px solid var(--filet);
    background: var(--papier);
    min-width: 0;
    position: relative;
    overflow: hidden;
  }
  .mode h2 {
    font-size: 1.6rem;
    margin: 0;
  }
  .mode p {
    margin: 0;
  }
  .mode .btn {
    justify-self: start;
  }
  .story {
    background: var(--cobalt);
    border-color: var(--cobalt);
    color: var(--email);
  }
  .story .eyebrow {
    color: #c9d5ea;
  }
  .story p {
    color: #dfe6f3;
  }
  .btn.solid {
    background: var(--email);
    color: var(--cobalt);
    border-color: var(--email);
  }
  .star-bg {
    position: absolute;
    right: -40px;
    bottom: -40px;
    width: 190px;
    height: 190px;
    opacity: 0.18;
    pointer-events: none;
  }
  .star-bg path {
    fill: none;
    stroke: #fff;
    stroke-width: 2;
  }
</style>
