<script lang="ts">
  /** Emblème : le carré complété (x², deux bandes, le coin), aux couleurs du code. */
  import { COLORS } from '../config';
  interface Props {
    size?: string;
  }
  let { size = '2em' }: Props = $props();
</script>

<svg viewBox="0 0 40 40" style="width: {size}; height: {size}" aria-hidden="true">
  <rect x="1" y="1" width="38" height="38" rx="6" fill={COLORS.glaze} stroke={COLORS.ink} stroke-width="1.5" />
  <rect x="6" y="6" width="19" height="19" fill={COLORS.x2} />
  <rect x="25" y="6" width="9" height="19" fill={COLORS.bx} />
  <rect x="6" y="25" width="19" height="9" fill={COLORS.bx} />
  <rect x="25" y="25" width="9" height="9" fill={COLORS.corner} />
</svg>
