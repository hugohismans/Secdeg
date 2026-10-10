<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import SquareDiagram from '../SquareDiagram.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import AnswerInput from '../../../lib/AnswerInput.svelte';
  import { EX, hl } from '../tex';
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
    sideOk = matchesValue(v, 5);
  }
</script>

<StepLayout title="4. Trouver x">
  {#snippet visual()}
    <SquareDiagram labels={{ x: 'x', half: '3', full: '6', corner: '9' }} stage="completed" sideLabel="x + 3 = 5" />
  {/snippet}

  <div class="eq"><Tex tex={EX.eqSquare} display /></div>
  {#if !sideOk}
    <p><strong>Un carré a une aire de 25. Quel est son côté ?</strong></p>
    <AnswerInput placeholder="côté du carré" onsubmit={check} />
    {#if tries > 0}
      <div class="feedback ko">✘ Cherche le nombre qui, multiplié par lui-même, donne 25.</div>
    {/if}
  {:else}
    <div class="feedback ok">✔ <Tex tex="5 \times 5 = 25" />, donc le côté vaut 5.</div>
    <div class="eq"><Tex tex={`x + 3 = 5 \\quad\\Rightarrow\\quad x = ${hl('2')}`} display /></div>
    <p>Vérification : <Tex tex="2^2 + 6 \times 2 = 4 + 12 = 16" /> ✔</p>

    {#if !showNeg}
      <div class="actions"><button class="secondary" onclick={() => (showNeg = true)}>Est-ce la seule solution ?</button></div>
    {:else}
      <div class="feedback info">
        <strong>La géométrie ne montre qu'une solution.</strong> Un côté de carré est forcément positif. Mais l'algèbre en voit une autre :
        <Tex tex="(-5)^2 = 25" /> aussi ! Donc <Tex tex="x + 3" /> peut valoir <Tex tex="5" /> <em>ou</em> <Tex tex="-5" />.
      </div>
      <div class="eq"><Tex tex={`x + 3 = ${hl('\\pm')} 5 \\quad\\Rightarrow\\quad x = 2 \\;\\text{ ou }\\; x = -8`} display /></div>
      <p>Vérification : <Tex tex="(-8)^2 + 6 \times (-8) = 64 - 48 = 16" /> ✔</p>
      <p>Les solutions sont <Tex tex={'S = \\{-8 \\;;\\; 2\\}'} />. Retiens le <Tex tex="\pm" /> : <strong>deux nombres opposés ont le même carré</strong>.</p>
    {/if}
  {/if}
</StepLayout>
