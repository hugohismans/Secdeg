<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import SquareDiagram from '../SquareDiagram.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import { EX, EX_LABELS, X2, BX, CC } from '../tex';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();

  let showAreas = $state(false);
  let answer = $state<string | null>(null);
  const choices = [
    { v: '10', ok: false, why: '10 est la longueur du rectangle, pas son aire.' },
    { v: '10x', ok: true, why: 'Aire = longueur × largeur = 10 × x = 10x.' },
    { v: 'x+10', ok: false, why: "x + 10 additionne deux côtés. L'aire d'un rectangle est le produit de ses côtés." },
  ];
  let picked = $derived(choices.find((ch) => ch.v === answer));
  $effect(() => onready(!!picked?.ok));
</script>

<StepLayout title="1. Un carré et dix racines">
  {#snippet visual()}
    <SquareDiagram labels={EX_LABELS} stage="initial" {showAreas} />
  {/snippet}

  <p>Vers 820, à Bagdad, le savant al-Khwârizmî pose ce problème : <em>« un carré et dix racines égalent trente-neuf dirhams »</em>. Aujourd'hui, on l'écrit :</p>
  <div class="eq"><Tex tex={EX.eq0} display /></div>
  <p>
    Pensons en <strong>aires</strong>. <Tex tex={X2()} /> est l'aire d'un carré de côté <Tex tex="x" />.
    <Tex tex={BX('10x')} /> est l'aire d'un rectangle de côtés <Tex tex="x" /> et <Tex tex="10" />.
    Ensemble, les deux figures ont une aire de <Tex tex={CC('39')} />.
  </p>

  <p><strong>Question :</strong> quelle est l'aire du rectangle ambre ?</p>
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
    <p>On ne connaît pas <Tex tex="x" />, mais on sait que l'aire totale vaut 39. L'idée : <strong>réarranger les morceaux pour former un carré</strong>, dont on saura trouver le côté.</p>
  {/if}
</StepLayout>

<style>
  .chosen {
    background: var(--primary-soft);
  }
</style>
