<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import SquareDiagram from '../SquareDiagram.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import AnswerInput from '../../../lib/AnswerInput.svelte';
  import { GEN, DL, CO, CC, hl } from '../tex';
  import { matchesValue } from '../../../math/compare';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();

  let phase = $state(0); // 0 : même dénominateur, 1 : Δ nommé
  let deltaOk = $state(false);
  let tries = $state(0);
  $effect(() => onready(deltaOk));

  function check(v: string) {
    tries++;
    deltaOk = matchesValue(v, 100);
  }
</script>

<StepLayout title="8. Δ : ce qui reste">
  {#snippet visual()}
    <SquareDiagram labels={{ x: 'x', half: 'b/2a', full: 'b/a', corner: 'b²/4a²' }} stage="completed" />
  {/snippet}

  <p>Le membre de droite est l'aire du grand carré. Mettons-le sur un seul dénominateur :</p>
  <div class="eq"><Tex tex={`${CO('\\frac{b^2}{4a^2}')} ${CC('- \\frac{c}{a}')} = \\frac{b^2}{4a^2} - \\frac{${hl('4ac')}}{${hl('4a^2')}} = \\frac{${DL('b^2 - 4ac')}}{4a^2}`} display /></div>
  <p class="muted">(on a multiplié <Tex tex={'\\tfrac{c}{a}'} /> en haut et en bas par <Tex tex="4a" />)</p>

  {#if phase === 0}
    <div class="actions"><button onclick={() => (phase = 1)}>Donner un nom à ce qui reste</button></div>
  {:else}
    <div class="feedback info">
      On appelle <strong>discriminant</strong> et on note <Tex tex={DL('\\Delta = b^2 - 4ac')} /> : c'est <em>ce qui reste une fois le carré complété</em>, l'aire du grand carré (à un facteur <Tex tex="4a^2" /> près).
    </div>
    <div class="eq"><Tex tex={GEN.eqDelta} display /></div>

    <p><strong>À toi :</strong> dans l'exemple <Tex tex="x^2 + 6x - 16 = 0" /> (<Tex tex="a = 1, b = 6, c = -16" />), calcule <Tex tex={DL('\\Delta')} />.</p>
    {#if !deltaOk}
      <AnswerInput placeholder="Δ = b² − 4ac" onsubmit={check} />
      {#if tries > 0}
        <div class="feedback ko">✘ Attention aux signes : <Tex tex="\Delta = 6^2 - 4 \times 1 \times (-16)" />. Moins fois moins donne plus.</div>
      {/if}
    {:else}
      <div class="feedback ok">✔ <Tex tex="\Delta = 36 + 64 = 100" />, et <Tex tex={'\\tfrac{\\Delta}{4a^2} = \\tfrac{100}{4} = 25'} /> : exactement l'aire du grand carré trouvée tout à l'heure !</div>
    {/if}
  {/if}
</StepLayout>
