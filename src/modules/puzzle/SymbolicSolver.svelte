<script lang="ts">
  /** Résolution guidée par complétion du carré, étape par étape, avec saisie. */
  import Tex from '../../lib/Tex.svelte';
  import Hints from '../../lib/Hints.svelte';
  import type { SymbolicStep } from './logic';
  import type { Quadratic } from '../../math/quadratic';
  import { matchesValue, compareAnswer } from '../../math/compare';
  import { parseNumber } from '../../math/parse';
  import { diagnoseRoots } from '../../math/diagnose';
  import { errorTracker } from '../../state/errors.svelte';

  interface Props {
    q: Quadratic;
    steps: SymbolicStep[];
    onhint?: () => void;
    onerror?: () => void;
    ondone: () => void;
  }
  let { q, steps, onhint, onerror, ondone }: Props = $props();

  let index = $state(0);
  let values = $state<string[]>([]);
  let feedback = $state<{ ok: boolean; message: string } | null>(null);
  let done = $derived(index >= steps.length);
  let step = $derived(steps[Math.min(index, steps.length - 1)]);

  $effect(() => {
    // réinitialise les champs à chaque étape
    void index;
    values = step.fields.map(() => '');
    feedback = null;
  });

  let templateTex = $derived.by(() => {
    let i = 0;
    const n = step.fields.length;
    return step.template.replace(/\\square/g, () => {
      const k = i++ % n;
      return `\\boxed{\\,${values[k]?.trim() ? texOf(values[k]) : `\\textcolor{#a0aec0}{?${n > 1 ? `_{${k + 1}}` : ''}}`}\\,}`;
    });
  });

  function texOf(v: string): string {
    // affiche la saisie telle quelle, en LaTeX simple
    return v.replace(/\s+/g, '').replace(/\*/g, '\\cdot ').replace(/sqrt|√/g, '\\sqrt ').replace(/,/g, '{,}');
  }

  function check(e?: Event) {
    e?.preventDefault();
    if (done) return;
    if (step.id === 'roots') {
      const cmp = compareAnswer(values[0] ?? '', step.expected);
      if (cmp.correct) return success();
      if (cmp.invalid.length > 0) {
        feedback = { ok: false, message: `Je ne comprends pas « ${cmp.invalid[0]} ». Écris par exemple 2 ; -3 ou (1+√5)/2.` };
        return;
      }
      const diag = diagnoseRoots(q, cmp.given);
      if (diag) {
        errorTracker.record(diag.type);
        feedback = { ok: false, message: `✘ ${diag.message}` };
      } else {
        feedback = { ok: false, message: '✘ Ce n\'est pas ça.' };
      }
      onerror?.();
      return;
    }
    const bad: number[] = [];
    step.expected.forEach((exp, i) => {
      if (!matchesValue(values[i] ?? '', exp)) bad.push(i);
    });
    if (bad.length === 0) return success();
    const unreadable = bad.filter((i) => parseNumber(values[i] ?? '') === null);
    if (unreadable.length > 0) {
      feedback = { ok: false, message: `Je ne comprends pas « ${values[unreadable[0]]} ». Tu peux écrire une fraction (3/2), un décimal (1,5) ou une racine (√5).` };
      return;
    }
    feedback = {
      ok: false,
      message: `✘ ${bad.length === 1 ? `Le champ « ${step.fields[bad[0]]} » n'est pas correct.` : 'Les deux champs sont à revoir.'} ${stepTip(step.id)}`,
    };
    onerror?.();
  }

  function stepTip(id: SymbolicStep['id']): string {
    switch (id) {
      case 'move-c':
        return 'Un terme qui change de membre change de signe.';
      case 'divide':
        return 'Divise chaque terme par a, le membre de droite aussi.';
      case 'corner':
        return 'Prends la moitié du coefficient de x, puis élève-la au carré.';
      case 'square':
        return 'Le nombre dans le carré est la moitié du coefficient de x (avec son signe).';
      default:
        return '';
    }
  }

  function noSolution() {
    if (step.id !== 'roots') return;
    if (step.expected.length === 0) return success();
    errorTracker.record('delta');
    feedback = { ok: false, message: '✘ Il y a pourtant des solutions : le membre de droite est positif, on peut prendre sa racine carrée.' };
    onerror?.();
  }

  function success() {
    feedback = { ok: true, message: '✔ Exact.' };
    setTimeout(() => {
      index++;
      if (index >= steps.length) ondone();
    }, 500);
  }
</script>

<div class="solver">
  <ol class="trail">
    {#each steps.slice(0, Math.min(index, steps.length)) as s}
      <li><Tex tex={s.after} /></li>
    {/each}
  </ol>

  {#if !done}
    <div class="card current">
      <p class="muted small">Étape {index + 1} / {steps.length}</p>
      <p><strong>{step.prompt}</strong></p>
      <div class="eq"><Tex tex={templateTex} display /></div>
      <form class="fields" onsubmit={check}>
        {#each step.fields as f, i}
          <label>
            <span>{f}{step.fields.length > 1 ? ` (${i + 1})` : ''}</span>
            <input type="text" inputmode="text" autocomplete="off" bind:value={values[i]} placeholder={step.id === 'roots' ? 'ex : 2 ; -3' : 'ex : 3/2 ou 1,5'} disabled={feedback?.ok} />
          </label>
        {/each}
        <div class="row">
          <button type="submit" disabled={feedback?.ok}>Vérifier</button>
          {#if step.id === 'roots'}
            <button type="button" class="secondary" onclick={noSolution} disabled={feedback?.ok}>Pas de solution dans ℝ</button>
          {/if}
        </div>
      </form>
      {#if feedback}
        <div class="feedback" class:ok={feedback.ok} class:ko={!feedback.ok}>{feedback.message}</div>
      {/if}
      <Hints hints={step.hints} resetKey={index} onreveal={() => onhint?.()} />
    </div>
  {/if}
</div>

<style>
  .trail {
    padding-left: 1.2em;
    margin: 0 0 0.5rem;
  }
  .trail li {
    margin: 0.2em 0;
    color: var(--muted);
  }
  .small {
    font-size: 0.85em;
    margin: 0;
  }
  .eq {
    font-size: 1.2em;
  }
  .fields {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: flex-end;
  }
  .fields label {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    flex: 1;
    min-width: 150px;
  }
  .fields label span {
    font-size: 0.85em;
    color: var(--muted);
  }
</style>
