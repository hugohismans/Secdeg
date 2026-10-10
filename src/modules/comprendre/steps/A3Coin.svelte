<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import SquareDiagram from '../SquareDiagram.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import AnswerInput from '../../../lib/AnswerInput.svelte';
  import { EX, EX_LABELS, CO, hl } from '../tex';
  import { matchesValue } from '../../../math/compare';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();

  let areaOk = $state(false);
  let tries = $state(0);
  let completed = $state(false);
  $effect(() => onready(completed));

  function check(v: string) {
    tries++;
    areaOk = matchesValue(v, 25);
  }
</script>

<StepLayout title="3. Le coin manquant">
  {#snippet visual()}
    <SquareDiagram
      labels={EX_LABELS}
      stage={completed ? 'completed' : 'moved'}
      cornerClickable={areaOk && !completed}
      showCornerHint
      oncorner={() => (completed = true)}
    />
  {/snippet}

  <p>Pour obtenir un vrai carré, il manque un petit carré vert dans le coin. Son côté vaut <Tex tex={CO('5')} />.</p>
  {#if !areaOk}
    <p><strong>Quelle est l'aire de ce coin ?</strong></p>
    <AnswerInput placeholder="aire du coin" onsubmit={check} />
    {#if tries > 0}
      <div class="feedback ko">✘ Le coin est un carré de côté 5 : son aire est 5 × 5.</div>
    {/if}
  {:else}
    <div class="feedback ok">✔ Le coin a pour aire <Tex tex="5 \times 5 = 25" />.</div>
    {#if !completed}
      <p><strong>Touche le coin</strong>, ou le bouton, pour le compléter.</p>
      <div class="actions"><button onclick={() => (completed = true)}>Compléter le coin</button></div>
    {:else}
      <div class="eq"><Tex tex={`x^2 + 10x + ${hl(CO('25'))} = 39 + ${hl(CO('25'))}`} display /></div>
      <p>
        On a <strong>ajouté 25</strong> à gauche. Pour que l'égalité reste vraie, on ajoute <strong>aussi 25 à droite</strong>.
        C'est ça, « compléter le carré ».
      </p>
      <div class="eq"><Tex tex={EX.eqSquare} display /></div>
      <p>Le grand carré a pour côté <Tex tex="x + 5" /> et pour aire <Tex tex="39 + 25 = 64" />.</p>
    {/if}
  {/if}
</StepLayout>
