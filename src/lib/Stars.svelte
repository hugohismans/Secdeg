<script lang="ts">
  interface Props {
    value: number;
    max?: number;
    size?: string;
  }
  let { value, max = 3, size = '1.2em' }: Props = $props();
</script>

<span class="stars" style="font-size: {size}" aria-label="{value} étoile{value > 1 ? 's' : ''} sur {max}">
  {#each Array(max) as _, i}
    <span class:on={i < value}>★</span>
  {/each}
</span>

<style>
  .stars span {
    color: var(--border);
  }
  .stars span.on {
    color: var(--ambre);
  }
</style>
