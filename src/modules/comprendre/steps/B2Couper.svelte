<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import SquareDiagram from '../SquareDiagram.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import { EX, GEN, BX, hl } from '../tex';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();

  let cut = $state(false);
  let placed = $state<[boolean, boolean]>([false, false]);
  let done = $derived(placed[0] && placed[1]);
  $effect(() => onready(done));
  function placeNext() {
    if (!placed[0]) placed = [true, placed[1]];
    else if (!placed[1]) placed = [true, true];
  }
</script>

<StepLayout title="6. Couper la bande en deux">
  {#snippet visual()}
    <SquareDiagram labels={{ x: 'x', half: 'b/2a', full: 'b/a', corner: 'b²/4a²' }} stage={cut ? 'cut' : 'initial'} bind:placed interactive />
  {/snippet}

  {#if !cut}
    <div class="eq"><Tex tex={GEN.eqDivA} display /></div>
    <p>Même geste qu'avant : on coupe la bande <Tex tex={BX('\\tfrac{b}{a}')} /> en deux bandes égales. La moitié de <Tex tex={'\\tfrac{b}{a}'} />, c'est <Tex tex={BX('\\tfrac{b}{2a}')} />.</p>
    <div class="actions"><button onclick={() => (cut = true)}>Couper en deux</button></div>
  {:else}
    <div class="eq"><Tex tex={`x^2 + ${hl(BX('\\frac{b}{2a}x') + ' + ' + BX('\\frac{b}{2a}x'))} = -\\frac{c}{a}`} display /></div>
    <div class="eq side"><span class="lbl">Dans l'exemple</span><Tex tex={EX.eqCut} /></div>
    {#if !done}
      <p><strong>À toi :</strong> glisse les deux bandes contre le carré, comme tout à l'heure.</p>
      <div class="actions"><button class="secondary small" onclick={placeNext}>Placer une bande pour moi</button></div>
    {:else}
      <div class="feedback ok">✔ Même figure qu'avec les nombres : il manque le coin, de côté <Tex tex={BX('\\tfrac{b}{2a}')} />.</div>
    {/if}
  {/if}
</StepLayout>
