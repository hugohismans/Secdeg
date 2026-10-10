<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import { router } from '../../../router.svelte';
  import { progress } from '../../../state/progress.svelte';
  import { COLORS } from '../../../config';
  import { DL, c as col } from '../tex';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();
  $effect(() => {
    onready(true);
    progress.comprendreDone = true;
  });
  const KO = (s: string) => col(COLORS.ko, s);
</script>

<StepLayout title="12. Fiche mémo">
  <div class="memo">
    <div class="card">
      <h3>Équation</h3>
      <Tex tex="ax^2 + bx + c = 0 \quad (a \neq 0)" display />
    </div>
    <div class="card">
      <h3>Discriminant</h3>
      <Tex tex={DL('\\Delta = b^2 - 4ac')} display />
      <p class="muted">« ce qui reste une fois le carré complété »</p>
    </div>
    <div class="card">
      <h3>Racines</h3>
      <Tex tex={'\\Delta > 0 :\\; x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}'} display />
      <Tex tex={'\\Delta = 0 :\\; x = -\\frac{b}{2a} \\text{ (racine double)}'} display />
      <Tex tex="\Delta < 0 :\; S = \varnothing" display />
    </div>
    <div class="card">
      <h3>Centre ± écart</h3>
      <Tex tex={'x = \\underbrace{-\\tfrac{b}{2a}}_{\\text{axe}} \\pm \\underbrace{\\tfrac{\\sqrt{\\Delta}}{2a}}_{\\text{écart}}'} display />
    </div>
    <div class="card">
      <h3>Somme et produit</h3>
      <Tex tex={'S = x_1 + x_2 = -\\frac{b}{a}'} display />
      <Tex tex={'P = x_1 \\cdot x_2 = \\frac{c}{a}'} display />
      <p class="muted">Pratique pour vérifier ses racines ou les deviner de tête.</p>
    </div>
    <div class="card trap">
      <h3>⚠️ Le piège du signe</h3>
      <p>Si <Tex tex="b" /> est négatif, <Tex tex="-b" /> est <strong>positif</strong>. Exemple avec <Tex tex="x^2 - 5x + 6 = 0" /> : <Tex tex="b = -5" />, donc</p>
      <Tex tex={`x = \\frac{${KO('-(-5)')} \\pm \\sqrt{25 - 24}}{2} = \\frac{${KO('5')} \\pm 1}{2}`} display />
      <p>et <Tex tex="b^2 = (-5)^2 = 25" />, toujours positif.</p>
    </div>
  </div>
  <div class="feedback ok">🎉 Tu as terminé le module « Comprendre ». À toi de jouer !</div>
  <div class="actions">
    <a class="btn" href={router.href('rapidite')}>⚡ Rapidité</a>
    <a class="btn secondary" href={router.href('puzzle')}>🧩 Puzzle de tuiles</a>
    <a class="btn secondary" href={router.href('lance')}>🎯 Lance-parabole</a>
  </div>
</StepLayout>

<style>
  .memo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 0.75rem;
  }
  .trap {
    border: 2px solid var(--ko);
  }
</style>
