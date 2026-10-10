<script lang="ts">
  import { router } from '../../router.svelte';
  import { progress } from '../../state/progress.svelte';
  import { settings } from '../../state/settings.svelte';
  import Tex from '../../lib/Tex.svelte';
  import GameIcon from '../../lib/GameIcon.svelte';
  import { GAMES, type GameKey } from '../../content/games';
  import { COURSE_PARTS } from '../comprendre/outline';

  function project() {
    settings.projection = true;
    router.go('projection');
  }
  const games: GameKey[] = ['rapidite', 'puzzle', 'lance'];
</script>

<section class="course card">
  <div class="main">
    <span class="eyebrow">Le Cours</span>
    <h1>Équations du second degré</h1>
    <p class="muted">De la figure d'al-Khwârizmî à la formule des racines.</p>
    <div class="parts">
      {#each COURSE_PARTS as part}
        <div class="part">
          <h2><span class="rom">{part.roman}.</span> {part.title}</h2>
          <ol class="steps">
            {#each part.steps as st}
              <li>
                <a href={router.href(`comprendre/${st.index}`)} class:seen={st.index <= progress.comprendreStep}>
                  <span class="n">{st.index + 1}</span>
                  <span class="t">{#if st.rich}{st.rich.before ?? ''}<Tex tex={st.rich.tex} />{st.rich.after ?? ''}{:else}{st.label}{/if}</span>
                </a>
              </li>
            {/each}
          </ol>
        </div>
      {/each}
    </div>
  </div>
  <aside class="side">
    <div class="row">
      <a class="btn" href={router.href(`comprendre/${progress.comprendreDone ? 0 : progress.comprendreStep}`)}>
        {progress.comprendreStep > 0 && !progress.comprendreDone ? 'Reprendre le cours' : 'Commencer le cours'}
      </a>
      <button class="secondary" onclick={project}>Projeter en classe</button>
    </div>
    <a class="memo" href={router.href('comprendre/11')}>Fiche mémo</a>
    <span class="eyebrow">S'entraîner</span>
    <div class="games">
      {#each games as g}
        <a class="game" href={router.href(GAMES[g].path)}>
          <GameIcon game={g} />
          <span><span class="gt">{GAMES[g].title}</span><span class="gs">{GAMES[g].sub}</span></span>
        </a>
      {/each}
    </div>
  </aside>
</section>

<style>
  .course {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 1.75rem;
    padding: 1.5rem;
    border-top: 8px solid var(--cobalt);
  }
  @media (max-width: 760px) {
    .course {
      grid-template-columns: 1fr;
    }
  }
  h1 {
    margin: 0.2rem 0 0.2rem;
  }
  .parts {
    display: grid;
    gap: 1.1rem;
    margin-top: 0.9rem;
  }
  .part h2 {
    font-size: 1.15rem;
    margin: 0 0 0.35rem;
  }
  .rom {
    color: var(--or);
    font-style: italic;
  }
  .steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 2px;
  }
  .steps a {
    display: grid;
    grid-template-columns: 2rem minmax(0, 1fr);
    gap: 0.5rem;
    padding: 0.35rem 0.5rem;
    border-radius: 4px;
    color: var(--encre);
    text-decoration: none;
  }
  .steps a:hover {
    background: var(--papier);
  }
  .t :global(.katex) {
    font-size: 1.02em;
  }
  .n {
    text-align: right;
    color: var(--encre-douce);
    font-variant-numeric: tabular-nums;
  }
  .seen .n {
    color: var(--cobalt);
    font-weight: 700;
  }
  .side {
    display: grid;
    gap: 0.9rem;
    align-content: start;
  }
  .memo {
    font-family: var(--f-titre);
    font-style: italic;
  }
  .games {
    display: grid;
    gap: 0.6rem;
  }
  .game {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr);
    gap: 0.75rem;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid var(--filet);
    border-radius: var(--radius);
    background: var(--papier);
    color: var(--encre);
    text-decoration: none;
  }
  .game:hover {
    border-color: var(--encre-douce);
  }
  .gt {
    display: block;
    font-weight: 700;
  }
  .gs {
    display: block;
    font-size: 0.88em;
    color: var(--encre-douce);
  }
</style>
