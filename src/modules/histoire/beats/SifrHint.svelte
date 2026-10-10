<script lang="ts">
  /** Après trois erreurs, Sifr vient montrer la piste. */
  import Sifr from '../../../lib/Sifr.svelte';
  import RichText from '../RichText.svelte';
  interface Props {
    text: string;
  }
  let { text }: Props = $props();
</script>

<div class="sifr-hint">
  <Sifr width="64px" />
  <p><em>Sifr saute sur la table et pose une patte sur la tablette. On dirait qu'il te montre quelque chose.</em><br /><RichText {text} /></p>
</div>

<style>
  .sifr-hint {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 0.75rem;
    align-items: end;
    background: var(--warn-soft);
    border: 1px solid var(--filet);
    border-radius: var(--radius);
    padding: 0.6rem 0.8rem;
  }
  p {
    margin: 0;
  }
  em {
    color: var(--encre-douce);
    font-family: var(--f-titre);
  }
</style>
