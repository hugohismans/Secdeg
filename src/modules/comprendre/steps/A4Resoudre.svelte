<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import SquareDiagram from '../SquareDiagram.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import AnswerInput from '../../../lib/AnswerInput.svelte';
  import { EX, EX_LABELS, hl } from '../tex';
  import { matchesValue } from '../../../math/compare';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();

  let sideOk = $state(false);
  let tries = $state(0);
  let showNeg = $state(false);
  $effect(() => onready(sideOk));

  function check(v: string) {
    tries++;
    sideOk = matchesValue(v, 8);
  }
</script>

<StepLayout title="4. Trouver x">
  {#snippet visual()}
    <SquareDiagram labels={EX_LABELS} stage="completed" sideLabel="x + 5 = 8" />
  {/snippet}

  <div class="eq"><Tex tex={EX.eqSquare} display /></div>
  {#if !sideOk}
    <p><strong>Un carré a une aire de 64. Quel est son côté ?</strong></p>
    <AnswerInput placeholder="côté du carré" onsubmit={check} />
    {#if tries > 0}
      <div class="feedback ko">✘ Cherche le nombre qui, multiplié par lui-même, donne 64.</div>
    {/if}
  {:else}
    <div class="feedback ok">✔ <Tex tex="8 \times 8 = 64" />, donc le côté vaut 8.</div>
    <div class="eq"><Tex tex={`x + 5 = 8 \\quad\\Rightarrow\\quad x = ${hl('3')}`} display /></div>
    <p>Vérification : <Tex tex={'3^2 + 10 \\times 3 = 9 + 30 = 39'} /> ✔</p>

    {#if !showNeg}
      <div class="actions"><button class="secondary" onclick={() => (showNeg = true)}>Est-ce la seule solution ?</button></div>
    {:else}
      <div class="feedback info">
        <strong>La géométrie ne montre qu'une solution.</strong> Un côté de carré est forcément positif. Mais l'algèbre en voit une autre :
        <Tex tex="(-8)^2 = 64" /> aussi ! Donc <Tex tex="x + 5" /> peut valoir <Tex tex="8" /> <em>ou</em> <Tex tex="-8" />.
      </div>
      <div class="eq"><Tex tex={`x + 5 = ${hl('\\pm')} 8 \\quad\\Rightarrow\\quad x = 3 \;\\text{ ou }\; x = -13`} display /></div>
      <p>Vérification : <Tex tex={'(-13)^2 + 10 \\times (-13) = 169 - 130 = 39'} /> ✔</p>
      <p>Les solutions sont <Tex tex={'S = \\{-13 \;;\; 3\\}'} />. Retiens le <Tex tex="\pm" /> : <strong>deux nombres opposés ont le même carré</strong>.</p>
      <p class="muted">Al-Khwârizmî, lui, ne gardait que 3 : pour lui, une longueur négative n'avait pas de sens. Il a fallu des siècles pour accepter −13.</p>
    {/if}
  {/if}
</StepLayout>
