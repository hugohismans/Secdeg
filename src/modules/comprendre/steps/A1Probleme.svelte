<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import SquareDiagram from '../SquareDiagram.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import { EX, X2, BX, CC } from '../tex';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();

  let showAreas = $state(false);
  let answer = $state<string | null>(null);
  const choices = [
    { v: '6', ok: false, why: '6 est la longueur du rectangle, pas son aire.' },
    { v: '6x', ok: true, why: 'Aire = longueur × largeur = 6 × x = 6x.' },
    { v: 'x+6', ok: false, why: 'x + 6 serait un périmètre partiel, pas une aire. L\'aire d\'un rectangle est le produit de ses côtés.' },
  ];
  let picked = $derived(choices.find((ch) => ch.v === answer));
  $effect(() => onready(!!picked?.ok));
</script>

<StepLayout title="1. Un carré et un rectangle">
  {#snippet visual()}
    <SquareDiagram labels={{ x: 'x', half: '3', full: '6', corner: '9' }} stage="initial" {showAreas} />
  {/snippet}

  <p>On veut résoudre l'équation :</p>
  <div class="eq"><Tex tex={EX.eq0} display /></div>
  <p>
    Imaginons des <strong>aires</strong>. <Tex tex={X2()} /> est l'aire d'un carré de côté <Tex tex="x" />.
    <Tex tex={BX('6x')} /> est l'aire d'un rectangle de côtés <Tex tex="x" /> et <Tex tex="6" />.
    L'équation dit : <em>les deux figures ensemble ont une aire de</em> <Tex tex={CC('16')} />.
  </p>

  <p><strong>Question :</strong> quelle est l'aire du rectangle orange ?</p>
  <div class="choices">
    {#each choices as ch}
      <button class="secondary" class:chosen={answer === ch.v} onclick={() => { answer = ch.v; showAreas = true; }}>
        <Tex tex={ch.v} />
      </button>
    {/each}
  </div>
  {#if picked}
    <div class="feedback" class:ok={picked.ok} class:ko={!picked.ok}>
      {picked.ok ? '✔ ' : '✘ '}{picked.why}
    </div>
  {/if}
  {#if picked?.ok}
    <p>On ne connaît pas <Tex tex="x" />, mais on sait que l'aire totale vaut 16. L'idée : <strong>réarranger les morceaux pour former un carré</strong>, dont on saura trouver le côté.</p>
  {/if}
</StepLayout>

<style>
  .chosen {
    background: var(--primary-soft);
  }
</style>
