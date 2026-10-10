<script lang="ts">
  /** Frise d'étoiles à huit branches (motif géométrique abbasside). */
  interface Props {
    height?: number;
    color?: string;
    line?: string;
  }
  let { height = 20, color = 'var(--cobalt)', line = '#e9d7a6' }: Props = $props();
  const id = `fz-${Math.random().toString(36).slice(2, 8)}`;
  let h = $derived(height);
</script>

<svg class="frieze" style="height: {h}px" viewBox="0 0 1200 {h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <pattern {id} width={h} height={h} patternUnits="userSpaceOnUse">
      <g fill="none" stroke={line} stroke-width="1.1" transform="translate({h / 2} {h / 2})">
        <rect x={-h * 0.27} y={-h * 0.27} width={h * 0.54} height={h * 0.54} />
        <rect x={-h * 0.27} y={-h * 0.27} width={h * 0.54} height={h * 0.54} transform="rotate(45)" />
      </g>
    </pattern>
  </defs>
  <rect width="1200" height={h} fill={color} />
  <rect width="1200" height={h} fill="url(#{id})" />
</svg>

<style>
  .frieze {
    display: block;
    width: 100%;
  }
</style>
