<script lang="ts">
  import { COLORS } from '../config';
  import type { GameKey } from '../content/games';
  interface Props {
    game: GameKey;
    size?: string;
  }
  let { game, size = '40px' }: Props = $props();
</script>

<svg viewBox="0 0 40 40" style="width: {size}; height: {size}" aria-hidden="true">
  {#if game === 'rapidite'}
    <path d="M12 6 H28 L22 20 L28 34 H12 L18 20 Z" fill="none" stroke={COLORS.delta} stroke-width="2.5" stroke-linejoin="round" />
    <path d="M16 30 H24 L20 24 Z" fill={COLORS.delta} />
  {:else if game === 'puzzle'}
    <rect x="5" y="5" width="18" height="18" fill={COLORS.x2} />
    <rect x="23" y="5" width="8" height="18" fill={COLORS.bx} />
    <rect x="5" y="23" width="18" height="8" fill={COLORS.bx} />
    <rect x="23" y="23" width="8" height="8" fill={COLORS.corner} />
  {:else}
    <path d="M6 34 Q20 -6 34 34" fill="none" stroke={COLORS.curve} stroke-width="2.5" stroke-dasharray="3 3" />
    <path d="M3 34 H13 M27 34 H37" stroke={COLORS.corner} stroke-width="3" />
  {/if}
</svg>
