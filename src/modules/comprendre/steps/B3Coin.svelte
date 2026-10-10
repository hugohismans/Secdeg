<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import SquareDiagram from '../SquareDiagram.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import { EX, GEN, CO, hl } from '../tex';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();

  let answer = $state<string | null>(null);
  let completed = $state(false);
  $effect(() => onready(completed));

  const choices = [
    { v: '\\frac{b}{2a}', ok: false, why: "C'est le côté du coin, pas son aire." },
    { v: '\\frac{b^2}{4a^2}', ok: true, why: 'Aire = côté × côté = (b/2a)² = b²/4a².' },
    { v: '\\frac{b^2}{2a}', ok: false, why: 'Il faut élever TOUT le côté au carré, le dénominateur aussi : (2a)² = 4a².' },
  ];
  let picked = $derived(choices.find((ch) => ch.v === answer));
</script>

<StepLayout title="7. Le coin : (b/2a)²">
  {#snippet visual()}
    <SquareDiagram
      labels={{ x: 'x', half: 'b/2a', full: 'b/a', corner: 'b²/4a²' }}
      stage={completed ? 'completed' : 'moved'}
      showCornerHint
      cornerClickable={!!picked?.ok && !completed}
      oncorner={() => (completed = true)}
    />
  {/snippet}

  <p>Le coin manquant est un carré de côté <Tex tex={CO('\\tfrac{b}{2a}')} />. <strong>Quelle est son aire ?</strong></p>
  <div class="choices">
    {#each choices as ch}
      <button class="secondary" class:chosen={answer === ch.v} onclick={() => (answer = ch.v)}><Tex tex={ch.v} /></button>
    {/each}
  </div>
  {#if picked}
    <div class="feedback" class:ok={picked.ok} class:ko={!picked.ok}>{picked.ok ? '✔ ' : '✘ '}{picked.why}</div>
  {/if}
  {#if picked?.ok && !completed}
    <p><strong>Touche le coin</strong> pour le compléter : on l'ajoute des deux côtés de l'égalité.</p>
    <div class="actions"><button onclick={() => (completed = true)}>Compléter le coin</button></div>
  {/if}
  {#if completed}
    <div class="eq"><Tex tex={`x^2 + \\frac{b}{a}x + ${hl(CO('\\frac{b^2}{4a^2}'))} = -\\frac{c}{a} + ${hl(CO('\\frac{b^2}{4a^2}'))}`} display /></div>
    <div class="eq side"><span class="lbl">Dans l'exemple</span><Tex tex={EX.eqCorner} /></div>
    <p>Le grand carré a pour côté <Tex tex={'x + \\tfrac{b}{2a}'} /> :</p>
    <div class="eq"><Tex tex={GEN.eqSquare} display /></div>
    <div class="eq side"><span class="lbl">Dans l'exemple</span><Tex tex={EX.eqSquare} /></div>
  {/if}
</StepLayout>

<style>
  .chosen {
    background: var(--primary-soft);
  }
</style>
