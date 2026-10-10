<script lang="ts">
  /** Champ de réponse avec bouton Vérifier (Entrée valide aussi). */
  interface Props {
    value?: string;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    onsubmit: (value: string) => void;
    extra?: import('svelte').Snippet;
  }
  let { value = $bindable(''), placeholder = '', label = 'Ta réponse', disabled = false, onsubmit, extra }: Props = $props();

  function submit(e: Event) {
    e.preventDefault();
    if (disabled) return;
    onsubmit(value);
  }
</script>

<form class="answer" onsubmit={submit}>
  <label>
    <span class="visually-hidden">{label}</span>
    <input type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" bind:value {placeholder} {disabled} />
  </label>
  <button type="submit" {disabled}>Vérifier</button>
  {#if extra}{@render extra()}{/if}
</form>

<style>
  .answer {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
    margin: 0.5rem 0;
  }
  label {
    flex: 1;
    min-width: 160px;
  }
</style>
