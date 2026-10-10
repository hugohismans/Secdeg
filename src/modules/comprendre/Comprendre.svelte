<script lang="ts">
  import { router } from '../../router.svelte';
  import { progress } from '../../state/progress.svelte';
  import { ANIM } from '../../config';
  import Stepper from '../../lib/Stepper.svelte';
  import A1 from './steps/A1Probleme.svelte';
  import A2 from './steps/A2Couper.svelte';
  import A3 from './steps/A3Coin.svelte';
  import A4 from './steps/A4Resoudre.svelte';
  import B1 from './steps/B1Diviser.svelte';
  import B2 from './steps/B2Couper.svelte';
  import B3 from './steps/B3Coin.svelte';
  import B4 from './steps/B4Delta.svelte';
  import B5 from './steps/B5Formule.svelte';
  import C1 from './steps/C1TroisCas.svelte';
  import D1 from './steps/D1CentreEcart.svelte';
  import E1 from './steps/E1Memo.svelte';

  interface Props {
    step: number;
  }
  let { step }: Props = $props();

  const steps = [
    { c: A1, label: 'Un carré et un rectangle' },
    { c: A2, label: 'Couper et glisser' },
    { c: A3, label: 'Le coin manquant' },
    { c: A4, label: 'Trouver x' },
    { c: B1, label: 'En général' },
    { c: B2, label: 'Couper la bande' },
    { c: B3, label: 'Le coin (b/2a)²' },
    { c: B4, label: 'Δ apparaît' },
    { c: B5, label: 'La formule' },
    { c: C1, label: 'Trois cas' },
    { c: D1, label: 'Centre ± écart' },
    { c: E1, label: 'Fiche mémo' },
  ];

  let index = $derived(Math.min(Math.max(0, step), steps.length - 1));
  let ready = $state(false);

  $effect(() => {
    // mémorise la position (jamais en arrière si le module est terminé)
    if (index > progress.comprendreStep || !progress.comprendreDone) progress.comprendreStep = index;
  });

  function go(i: number) {
    ready = false;
    router.go(`comprendre/${i}`);
  }
  let Current = $derived(steps[index].c);
</script>

<div class="comprendre" style="--step-ms: {ANIM.stepFade}ms">
  <p class="muted crumbs">Comprendre · étape {index + 1} / {steps.length}</p>
  {#key index}
    <Current onready={(ok: boolean) => (ready = ok)} />
  {/key}
  {#if !ready && index < steps.length - 1}
    <p class="muted center hint-next">Termine l'activité pour passer à la suite.</p>
  {/if}
  <Stepper {index} count={steps.length} canNext={ready} labels={steps.map((s) => s.label)} onprev={() => go(index - 1)} onnext={() => go(index + 1)} />
</div>

<style>
  .crumbs {
    margin: 0 0 0.5rem;
    font-size: 0.9em;
  }
  .hint-next {
    font-size: 0.9em;
    margin-top: 1rem;
  }
</style>
