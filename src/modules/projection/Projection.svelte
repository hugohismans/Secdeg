<script lang="ts">
  interface Props {
    sub: string;
  }
  let { sub }: Props = $props();
</script>

<div class="card">
  <h1>Projection</h1>
  <p class="muted">En construction ({sub}).</p>
</div>
