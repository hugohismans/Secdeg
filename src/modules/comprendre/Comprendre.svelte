<script lang="ts">
  interface Props {
    step: number;
  }
  let { step }: Props = $props();
</script>

<div class="card">
  <h1>Comprendre</h1>
  <p class="muted">En construction ({step}).</p>
</div>
