<script lang="ts">
  interface Props {
    level: number;
  }
  let { level }: Props = $props();
</script>

<div class="card">
  <h1>LanceParabole</h1>
  <p class="muted">En construction ({level}).</p>
</div>
