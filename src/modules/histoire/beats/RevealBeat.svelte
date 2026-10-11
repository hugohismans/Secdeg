<script lang="ts">
  /** La phrase d'al-Khwârizmî, traduite morceau par morceau en notation moderne. */
  import Tex from '../../../lib/Tex.svelte';
  import { COLORS } from '../../../config';
  interface Props {
    onresolve: () => void;
  }
  let { onresolve }: Props = $props();

  const A = (s: string) => `\\textcolor{${COLORS.bx}}{${s}}`;
  const D = (s: string) => `\\textcolor{${COLORS.delta}}{${s}}`;
  const steps = [
    { words: 'Prends la moitié des racines,', tex: A('\\frac{b}{2a}'), ex: '5' },
    { words: 'multiplie-la par elle-même,', tex: `\\left(${A('\\frac{b}{2a}')}\\right)^2`, ex: '25' },
    { words: 'ajoute-la au nombre,', tex: `\\left(${A('\\frac{b}{2a}')}\\right)^2 - \\frac{c}{a} = \\frac{${D('\\Delta')}}{4a^2}`, ex: '64' },
    { words: 'prends-en la racine,', tex: `\\frac{\\sqrt{${D('\\Delta')}}}{2a}`, ex: '8' },
    { words: 'retranche la moitié des racines.', tex: `-${A('\\frac{b}{2a}')} + \\frac{\\sqrt{${D('\\Delta')}}}{2a}`, ex: '3' },
  ];
  let shown = $state(0);
  let final = $state(false);

  function next() {
    if (shown < steps.length) shown++;
    else if (!final) {
      final = true;
      onresolve();
    }
  }
</script>

<div class="reveal">
  <table>
    <thead>
      <tr><th>Al-Khwârizmî, vers 820</th><th>Mille ans plus tard</th><th>Avec 39 dirhams</th></tr>
    </thead>
    <tbody>
      {#each steps as st, i}
        <tr class:on={i < shown}>
          <td class="w">{st.words}</td>
          <td>{#if i < shown}<Tex tex={st.tex} />{/if}</td>
          <td class="ex">{#if i < shown}{st.ex}{/if}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if final}
    <div class="formula">
      <Tex tex={`x = \\frac{-b \\pm \\sqrt{${D('\\Delta')}}}{2a}`} display />
      <Tex tex={`${D('\\Delta')} = b^2 - 4ac`} display />
      <p class="muted">Le ± ajoute la racine que le maître refusait : −13 pour les 39 dirhams.</p>
    </div>
  {:else}
    <button onclick={next}>{shown < steps.length ? 'Traduire la suite' : 'Écrire la formule'}</button>
  {/if}
</div>

<style>
  .reveal {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;
    background: var(--email);
    border: 1px solid var(--filet);
    border-radius: var(--radius);
    padding: 0.9rem;
    overflow-x: auto;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  /* sur téléphone : une ligne par étape, la traduction sous la phrase */
  @media (max-width: 560px) {
    thead {
      display: none;
    }
    table,
    tbody,
    tr,
    td {
      display: block;
    }
    tr {
      padding: 0.35rem 0;
      border-bottom: 1px dotted var(--filet);
    }
    td {
      border: 0;
      padding: 0.1rem 0.25rem;
    }
    td.ex {
      text-align: left;
    }
    tr.on td.ex::before {
      content: 'Avec 39 dirhams : ';
      font-weight: 400;
      color: var(--encre-douce);
    }
  }
  th {
    text-align: left;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--encre-douce);
    padding: 0.3rem 0.5rem;
    border-bottom: 1px solid var(--filet);
  }
  td {
    padding: 0.45rem 0.5rem;
    border-bottom: 1px dotted var(--filet);
    vertical-align: middle;
  }
  .w {
    font-family: var(--f-titre);
    font-style: italic;
    color: var(--encre-douce);
  }
  tr.on .w {
    color: var(--encre);
  }
  .ex {
    font-family: var(--f-titre);
    font-weight: 700;
    color: var(--ambre);
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
  .formula {
    font-size: 1.25em;
    text-align: center;
  }
  .formula p {
    font-size: 0.8em;
  }
  button {
    justify-self: start;
  }
</style>
