<script lang="ts">
  /** La ville ronde de Bagdad : un quartier par chapitre, du portail de Koufa au palais. */
  import { COLORS } from '../../config';
  import { SIFR_PATH } from '../../lib/sifr-path';
  import type { Chapter } from './types';

  interface Props {
    chapters: Chapter[];
    done: number;
    onselect: (n: number) => void;
  }
  let { chapters, done, onselect }: Props = $props();

  const C = 300;
  function pt(a: number, r: number): [number, number] {
    const t = (a * Math.PI) / 180;
    return [C + r * Math.cos(t), C + r * Math.sin(t)];
  }
  // positions des chapitres (angle en degrés, rayon), du sud-ouest vers le centre
  const SPOTS: [number, number][] = [
    [122, 212],
    [160, 200],
    [205, 200],
    [262, 196],
    [322, 192],
    [28, 190],
    [0, 0],
  ];
  let pts = $derived(chapters.map((_, i) => (SPOTS[i] && SPOTS[i][1] ? pt(SPOTS[i][0], SPOTS[i][1]) : [C, C])));

  let route = $derived.by(() => {
    if (pts.length === 0) return '';
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const mx = (x0 + x1) / 2;
      const my = (y0 + y1) / 2;
      const vx = mx - C;
      const vy = my - C;
      const L = Math.hypot(vx, vy) || 1;
      const k = i < pts.length - 1 ? 26 : 0;
      d += ` Q${(mx + (vx / L) * k).toFixed(1)} ${(my + (vy / L) * k).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    return d;
  });

  const lanes: string[] = [];
  for (let a = 0; a < 360; a += 6) {
    if ([45, 135, 225, 315].some((g) => Math.abs(((a - g + 540) % 360) - 180) < 7)) continue;
    const [x1, y1] = pt(a, 162);
    const [x2, y2] = pt(a, 228);
    lanes.push(`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`);
  }
  const gates = [
    { a: 45, name: 'Porte de Bassora' },
    { a: 135, name: 'Porte de Koufa' },
    { a: 225, name: 'Porte de Syrie' },
    { a: 315, name: 'Porte du Khorassan' },
  ];
  function state(n: number): 'done' | 'current' | 'locked' {
    if (n <= done) return 'done';
    if (n === done + 1) return 'current';
    return 'locked';
  }
  let catAt = $derived(pts[Math.min(done, pts.length - 1)] ?? [C, C]);
</script>

<svg class="city" viewBox="0 0 720 600" role="group" aria-label="Carte de la ville ronde : les chapitres de l'histoire">
  <defs>
    <pattern id="ripple" width="18" height="10" patternUnits="userSpaceOnUse"><path d="M0 6 Q4.5 2 9 6 T18 6" fill="none" stroke="#8fb0bb" stroke-width="1" /></pattern>
  </defs>
  <path d="M640 0 C600 120 690 220 640 330 C595 430 680 520 650 600 L720 600 L720 0 Z" fill="#b9cfd6" />
  <path d="M640 0 C600 120 690 220 640 330 C595 430 680 520 650 600 L720 600 L720 0 Z" fill="url(#ripple)" />
  <text x="684" y="300" class="river" transform="rotate(90 684 300)">TIGRE</text>
  <circle cx={C} cy={C} r="272" fill="none" stroke="#b9cfd6" stroke-width="10" />
  <circle cx={C} cy={C} r="256" fill={COLORS.paper} stroke={COLORS.ink} stroke-width="3" />
  <circle cx={C} cy={C} r="256" fill="#e6d8bb" />
  <circle cx={C} cy={C} r="236" fill="none" stroke={COLORS.ink} stroke-width="1.6" />
  <path d={lanes.join(' ')} stroke={COLORS.rule} stroke-width="2" />
  <circle cx={C} cy={C} r="195" fill="none" stroke={COLORS.glaze} stroke-width="5" />
  <circle cx={C} cy={C} r="156" fill="none" stroke={COLORS.ink} stroke-width="1.6" />
  <circle cx={C} cy={C} r="150" fill={COLORS.glaze} />
  {#each gates as g}
    {@const [x1, y1] = pt(g.a, 268)}
    {@const [x2, y2] = pt(g.a, 40)}
    <line {x1} {y1} {x2} {y2} stroke={COLORS.glaze} stroke-width="9" />
  {/each}
  <path d={route} fill="none" stroke={COLORS.gold} stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round" />
  <rect x="262" y="262" width="76" height="76" rx="3" fill="#e6d8bb" stroke={COLORS.ink} stroke-width="1.5" />
  <circle cx={C} cy={C} r="24" fill={COLORS.corner} />
  {#each gates as g}
    {@const [gx, gy] = pt(g.a, 245)}
    {@const [lx, ly] = pt(g.a, 292)}
    <g transform="translate({gx.toFixed(1)} {gy.toFixed(1)}) rotate({g.a + 90})">
      <rect x="-11" y="-14" width="22" height="28" rx="2" fill="#e6d8bb" stroke={COLORS.ink} stroke-width="1.6" />
      <path d="M-6 14 V2 A6 6 0 0 1 6 2 V14 Z" fill={COLORS.ink} />
    </g>
    <text x={lx} y={ly} class="gate" text-anchor={Math.cos((g.a * Math.PI) / 180) > 0 ? 'start' : 'end'}>{g.name}</text>
  {/each}

  {#each chapters as ch, i}
    {@const s = state(ch.n)}
    {@const [x, y] = pts[i]}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <g
      class="mk {s}"
      transform="translate({x.toFixed(1)} {y.toFixed(1)})"
      role="button"
      tabindex={s === 'locked' ? -1 : 0}
      aria-label="Chapitre {ch.n} : {ch.title}{s === 'locked' ? ' (verrouillé)' : ''}"
      aria-disabled={s === 'locked'}
      onclick={() => s !== 'locked' && onselect(ch.n)}
      onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && s !== 'locked' && (e.preventDefault(), onselect(ch.n))}
    >
      <circle r="19" />
      <text y="6">{ch.n}</text>
    </g>
  {/each}

  <g transform="translate({(catAt[0] + 14).toFixed(1)} {(catAt[1] - 40).toFixed(1)}) scale(0.13)" aria-hidden="true">
    <path d={SIFR_PATH} fill={COLORS.ink} />
  </g>
</svg>

<style>
  .city {
    width: 100%;
    height: auto;
    display: block;
  }
  .river {
    font-family: var(--f-titre);
    font-size: 13px;
    letter-spacing: 0.4em;
    fill: #4d7480;
  }
  .gate {
    font-family: var(--f-titre);
    font-style: italic;
    font-size: 14px;
    fill: var(--encre-douce);
  }
  .mk {
    cursor: pointer;
  }
  .mk circle {
    stroke-width: 2.5;
  }
  .mk text {
    font-family: var(--f-titre);
    font-weight: 700;
    font-size: 18px;
    text-anchor: middle;
    pointer-events: none;
  }
  .mk.done circle {
    fill: var(--cobalt);
    stroke: var(--email);
  }
  .mk.done text,
  .mk.current text {
    fill: var(--email);
  }
  .mk.current circle {
    fill: var(--ambre);
    stroke: var(--email);
  }
  .mk.locked {
    cursor: default;
  }
  .mk.locked circle {
    fill: var(--email);
    stroke: var(--encre-douce);
    stroke-dasharray: 3 3;
  }
  .mk.locked text {
    fill: var(--encre-douce);
  }
  .mk:focus-visible circle {
    stroke: var(--or);
    stroke-width: 4;
  }
  @media (prefers-reduced-motion: no-preference) {
    .mk.current circle {
      animation: halo 1.8s ease-in-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }
    @keyframes halo {
      50% {
        transform: scale(1.15);
      }
    }
  }
</style>
