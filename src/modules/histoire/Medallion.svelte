<script lang="ts">
  /** Portraits stylisés en médaillon (silhouettes géométriques). */
  import type { Who } from './types';
  import { COLORS } from '../../config';
  interface Props {
    who: Who;
    size?: string;
  }
  let { who, size = '64px' }: Props = $props();
  const skin = '#e8cfa5';
  const gold = '#e9d7a6';
  const looks: Record<Who, { bg: string; robe: string; turban: string; beard: boolean; band: string }> = {
    maitre: { bg: COLORS.x2, robe: COLORS.bx, turban: COLORS.glaze, beard: true, band: COLORS.x2 },
    ahmad: { bg: COLORS.bx, robe: COLORS.corner, turban: COLORS.glaze, beard: false, band: COLORS.bx },
    muhammad: { bg: COLORS.corner, robe: COLORS.x2, turban: COLORS.glaze, beard: true, band: COLORS.corner },
    hasan: { bg: COLORS.delta, robe: COLORS.bx, turban: COLORS.glaze, beard: false, band: COLORS.delta },
    calife: { bg: COLORS.ink, robe: COLORS.corner, turban: COLORS.glaze, beard: true, band: '#c9a54a' },
  };
  let l = $derived(looks[who]);
  let young = $derived(who === 'ahmad' || who === 'hasan');
</script>

<svg viewBox="0 0 100 100" style="width: {size}; height: {size}" aria-hidden="true" class="medal">
  <circle cx="50" cy="50" r="48" fill={l.bg} />
  <circle cx="50" cy="50" r="43" fill="none" stroke={gold} stroke-width="1.5" stroke-dasharray="2 3" />
  <path d="M16 100 C18 77 33 69 50 69 C67 69 82 77 84 100 Z" fill={l.robe} />
  <path d="M44 66 L50 80 L56 66 Z" fill={COLORS.glaze} />
  <circle cx="50" cy={young ? 54 : 52} r={young ? 15 : 14} fill={skin} />
  {#if l.beard}
    <path d="M37 54 C37 70 45 76 50 76 C55 76 63 70 63 54 C58 60 42 60 37 54 Z" fill={COLORS.ink} />
  {/if}
  {#if young}
    <path d="M34 47 C34 31 66 31 66 47 C60 41 40 41 34 47 Z" fill={COLORS.ink} />
    <ellipse cx="50" cy="36" rx="15" ry="7" fill={l.turban} />
  {:else}
    <ellipse cx="50" cy="38" rx="20" ry="12" fill={l.turban} />
    <path d="M31 40 C40 34 60 34 69 40" fill="none" stroke={l.band} stroke-width="2.5" />
    <ellipse cx="50" cy="29" rx="10" ry="6" fill={l.turban} />
    {#if who === 'calife'}
      <circle cx="50" cy="31" r="3.2" fill="#c9a54a" stroke={COLORS.ink} stroke-width="0.8" />
    {/if}
  {/if}
</svg>

<style>
  .medal {
    display: block;
    flex: none;
  }
</style>
