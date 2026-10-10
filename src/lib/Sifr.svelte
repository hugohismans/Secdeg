<script lang="ts">
  /** Sifr, le chat de la bibliothèque : silhouette + collier à perle de cobalt. */
  import { SIFR_PATH, SIFR_VIEWBOX } from './sifr-path';
  import { COLORS } from '../config';

  interface Props {
    width?: string;
    /** tourné vers la gauche */
    flip?: boolean;
    class?: string;
    label?: string;
  }
  let { width = '64px', flip = false, class: cls = '', label = 'Sifr, le chat de la bibliothèque' }: Props = $props();
  const id = `sifr-${Math.random().toString(36).slice(2, 8)}`;
</script>

<svg class="sifr {cls}" viewBox={SIFR_VIEWBOX} style="width: {width}" role="img" aria-label={label}>
  <defs><clipPath {id}><path d={SIFR_PATH} /></clipPath></defs>
  <g transform={flip ? 'translate(306 0) scale(-1 1)' : undefined}>
    <path fill={COLORS.ink} d={SIFR_PATH} />
    <path clip-path="url(#{id})" d="M220 69 C 240 76 262 81 292 78" fill="none" stroke={COLORS.x2} stroke-width="6" />
    <circle cx="278" cy="87" r="5" fill={COLORS.x2} stroke="#e9d7a6" stroke-width="1.4" />
  </g>
</svg>

<style>
  .sifr {
    height: auto;
    display: inline-block;
  }
</style>
