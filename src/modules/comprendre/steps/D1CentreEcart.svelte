<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import ParabolaExplorer from '../../../lib/ParabolaExplorer.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import { COLORS } from '../../../config';
  import { c as col, DL } from '../tex';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();
  $effect(() => onready(true));

  let a = $state(1);
  let b = $state(-2);
  let c = $state(-3);
  const V = (s: string) => col(COLORS.vertex, s);
</script>

<StepLayout title="11. Centre ± écart">
  <p>Relis la formule autrement :</p>
  <div class="eq"><Tex tex={`x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = ${V('-\\frac{b}{2a}')} \\;\\pm\\; ${DL('\\frac{\\sqrt{\\Delta}}{2a}')}`} display /></div>
  <ul>
    <li><Tex tex={V('-\\tfrac{b}{2a}')} /> est l'<strong>axe de symétrie</strong> de la parabole (la ligne verte pointillée). Les deux racines sont à égale distance de cet axe.</li>
    <li><Tex tex={DL('\\tfrac{\\sqrt{\\Delta}}{2a}')} /> est l'<strong>écart</strong> entre l'axe et chaque racine (les flèches violettes).</li>
  </ul>
  <p>La formule n'est donc rien d'autre que <strong>centre ± écart</strong>. Quand <Tex tex="\Delta = 0" />, l'écart est nul : les deux racines se confondent sur l'axe.</p>
  <ParabolaExplorer bind:a bind:b bind:c showAxis showArrows showVertex showSpread />
</StepLayout>
