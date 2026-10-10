<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import SquareDiagram from '../SquareDiagram.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import { EX, EX_LABELS, BX, hl } from '../tex';

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

<StepLayout title="2. Couper et glisser">
  {#snippet visual()}
    <SquareDiagram labels={EX_LABELS} stage={cut ? 'cut' : 'initial'} bind:placed interactive />
  {/snippet}

  {#if !cut}
    <p>Le rectangle <Tex tex={BX('10x')} /> est trop long pour s'accoler au carré. Coupons-le en <strong>deux bandes égales</strong> de largeur 5.</p>
    <div class="actions">
      <button onclick={() => (cut = true)}>Couper le rectangle en deux</button>
    </div>
    <div class="eq"><Tex tex={EX.eq0} display /></div>
  {:else}
    <div class="eq"><Tex tex={`x^2 + ${hl(BX('5x') + ' + ' + BX('5x'))} = 39`} display /></div>
    <p>Deux bandes de <Tex tex="5 \times x" /> : c'est toujours <Tex tex={BX('10x')} />, rien n'a changé.</p>
    {#if !done}
      <p><strong>À toi :</strong> glisse une bande à <strong>droite</strong> du carré et l'autre <strong>en dessous</strong>, dans les zones en pointillés.</p>
      <div class="actions">
        <button class="secondary small" onclick={placeNext}>Placer une bande pour moi</button>
      </div>
    {:else}
      <div class="feedback ok">✔ Regarde la figure : c'est presque un grand carré. Il manque juste un coin.</div>
    {/if}
  {/if}
</StepLayout>
