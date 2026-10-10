<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import { GEN, DL, hl } from '../tex';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();

  let phase = $state(0);
  $effect(() => onready(phase >= 2));
</script>

<StepLayout title="9. La formule">
  <p>Il ne reste qu'à faire ce qu'on a fait avec 64 : prendre la racine carrée, <strong>sans oublier le ±</strong>.</p>
  <div class="eq"><Tex tex={GEN.eqDelta} display /></div>

  {#if phase === 0}
    <div class="actions"><button onclick={() => (phase = 1)}>Prendre la racine carrée</button></div>
  {/if}
  {#if phase >= 1}
    <div class="eq"><Tex tex={`x + \\frac{b}{2a} = ${hl('\\pm')} \\frac{\\sqrt{${DL('\\Delta')}}}{2a}`} display /></div>
    <div class="eq side"><span class="lbl">Dans l'exemple</span><Tex tex={'x + 5 = \\pm \\frac{\\sqrt{256}}{2} = \\pm 8'} /></div>
    <p class="muted">Ceci n'est possible que si <Tex tex="\Delta \geq 0" /> : on ne peut pas prendre la racine carrée d'un nombre négatif. On y revient à l'étape suivante.</p>
  {/if}
  {#if phase === 1}
    <div class="actions"><button onclick={() => (phase = 2)}>Isoler x</button></div>
  {/if}
  {#if phase >= 2}
    <div class="eq"><Tex tex={`x = -\\frac{b}{2a} \\pm \\frac{\\sqrt{\\Delta}}{2a} \\quad\\Longrightarrow\\quad ${hl(GEN.formula)}`} display /></div>
    <div class="eq side"><span class="lbl">Dans l'exemple</span><Tex tex={'x = \\frac{-10 \\pm 16}{2} \\;:\\; x = 3 \\text{ ou } x = -13'} /></div>
    <div class="feedback ok">
      <strong>Tu viens de démontrer la formule des racines.</strong> Elle n'a rien de magique : c'est la complétion du carré écrite avec des lettres.
    </div>
  {/if}
</StepLayout>
