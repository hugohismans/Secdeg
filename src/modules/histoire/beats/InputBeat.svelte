<script lang="ts">
  import type { Line } from '../types';
  import RichText from '../RichText.svelte';
  import LineView from './LineView.svelte';
  import SifrHint from './SifrHint.svelte';
  import { compareAnswer } from '../../../math/compare';
  import { errorTracker } from '../../../state/errors.svelte';

  interface Props {
    prompt: string;
    expected: number[];
    placeholder?: string;
    hints: string[];
    success?: Line[];
    onresolve: () => void;
  }
  let { prompt, expected, placeholder, hints, success, onresolve }: Props = $props();

  let value = $state('');
  let wrong = $state(0);
  let message = $state('');
  let done = $state(false);
  let given = $state(false);
  const id = `in-${Math.random().toString(36).slice(2, 8)}`;

  function fmt(v: number) {
    return String(Math.round(v * 1000) / 1000).replace('.', ',');
  }

  function check(e: Event) {
    e.preventDefault();
    if (done) return;
    const r = compareAnswer(value, expected);
    if (r.correct) {
      done = true;
      message = '';
      onresolve();
      return;
    }
    if (r.invalid.length > 0) {
      message = `Je ne comprends pas « ${r.invalid[0]} ». Écris un nombre, par exemple 8, -13 ou 5/2.`;
      return;
    }
    wrong++;
    if (expected.length === 2 && r.missing.length === 1 && r.extra.length === 0) {
      message = 'Il en manque une. Pense au ± : deux nombres opposés ont le même carré.';
      errorTracker.record('oubli_pm');
    } else {
      message = hints[Math.min(wrong - 1, hints.length - 1)] ?? "Ce n'est pas ça.";
    }
  }

  function giveAnswer() {
    given = true;
    done = true;
    value = expected.map(fmt).join(' ; ');
    onresolve();
  }
</script>

<form class="input" onsubmit={check}>
  <label for={id}><strong><RichText text={prompt} /></strong></label>
  <div class="row">
    <input {id} type="text" inputmode="text" autocomplete="off" bind:value placeholder={placeholder ?? (expected.length > 1 ? 'ex : 5 ; -1' : 'ta réponse')} disabled={done} />
    <button type="submit" disabled={done}>Vérifier</button>
  </div>
  {#if message && !done}
    <p class="msg"><RichText text={message} /></p>
  {/if}
  {#if !done && wrong >= 3}
    <SifrHint text={hints[hints.length - 1] ?? ''} />
    <button type="button" class="ghost small" onclick={giveAnswer}>Le maître écrit la réponse pour toi</button>
  {/if}
  {#if done}
    {#if given}
      <p class="msg-ok">La réponse était <strong>{expected.map(fmt).join(' et ')}</strong>. Ce n'est pas grave : relis la piste, tu la retrouveras la prochaine fois.</p>
    {:else}
      <p class="msg-ok">✔ Juste.</p>
    {/if}
    {#if success}
      <div class="replies">{#each success as line}<LineView {line} />{/each}</div>
    {/if}
  {/if}
</form>

<style>
  .input {
    display: grid;
    gap: 0.5rem;
  }
  .row input {
    flex: 1;
    min-width: 140px;
    width: auto;
  }
  .msg {
    margin: 0;
    color: var(--garance);
  }
  .msg-ok {
    margin: 0;
    color: var(--cuivre);
  }
  .replies {
    display: grid;
    gap: 0.6rem;
  }
</style>
