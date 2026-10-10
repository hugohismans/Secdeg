<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import ParabolaExplorer from '../../../lib/ParabolaExplorer.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import { DL } from '../tex';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();
  $effect(() => onready(true));

  let a = $state(1);
  let b = $state(-2);
  let c = $state(-3);
</script>

<StepLayout title="10. Trois cas selon le signe de Δ">
  <p>
    La formule contient <Tex tex={`\\sqrt{${DL('\\Delta')}}`} />. Or la racine carrée d'un nombre négatif n'existe pas dans ℝ.
    Tout dépend donc du <strong>signe de Δ</strong>. Bouge les curseurs et regarde combien de fois la parabole <Tex tex="y = ax^2 + bx + c" /> coupe l'axe des <Tex tex="x" /> : ce sont les solutions de <Tex tex="ax^2 + bx + c = 0" />.
  </p>
  <ParabolaExplorer bind:a bind:b bind:c />
  <div class="cases">
    <div class="card"><strong><Tex tex="\Delta > 0" /></strong><br />deux solutions distinctes<br /><Tex tex="x_1 \neq x_2" /></div>
    <div class="card"><strong><Tex tex="\Delta = 0" /></strong><br />une solution double<br /><Tex tex={'x = -\\tfrac{b}{2a}'} /></div>
    <div class="card"><strong><Tex tex="\Delta < 0" /></strong><br />pas de solution dans ℝ<br /><Tex tex="S = \varnothing" /></div>
  </div>
</StepLayout>

<style>
  .cases {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
    text-align: center;
  }
</style>
