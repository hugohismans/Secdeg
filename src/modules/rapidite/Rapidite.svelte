<script lang="ts">
  interface Props {
    mode: string;
  }
  let { mode }: Props = $props();
</script>

<div class="card">
  <h1>Rapidite</h1>
  <p class="muted">En construction ({mode}).</p>
</div>
