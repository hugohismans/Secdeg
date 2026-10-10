<script lang="ts">
  import StepLayout from '../StepLayout.svelte';
  import SquareDiagram from '../SquareDiagram.svelte';
  import Tex from '../../../lib/Tex.svelte';
  import { EX, GEN, X2, BX, CC, hl } from '../tex';

  interface Props {
    onready: (ok: boolean) => void;
  }
  let { onready }: Props = $props();

  let phase = $state(0); // 0 : équation, 1 : c à droite, 2 : divisé par a
  $effect(() => onready(phase >= 2));
</script>

<StepLayout title="5. En général : ax² + bx + c = 0">
  {#snippet visual()}
    <SquareDiagram labels={{ x: 'x', half: 'b/2a', full: 'b/a', corner: 'b²/4a²' }} stage="initial" showAreas={phase >= 2} />
  {/snippet}

  <p>Refaisons <strong>exactement les mêmes gestes</strong>, mais avec des lettres : n'importe quels <Tex tex="a" />, <Tex tex="b" />, <Tex tex="c" /> (avec <Tex tex="a \neq 0" />).</p>
  <div class="eq"><Tex tex={GEN.eq0} display /></div>
  <div class="eq side"><span class="lbl">Dans notre exemple</span><Tex tex={`${EX.eq0} \\quad (a = 1,\\; b = 6,\\; c = -16)`} /></div>

  {#if phase === 0}
    <div class="actions"><button onclick={() => (phase = 1)}>Passer c à droite</button></div>
  {/if}
  {#if phase >= 1}
    <div class="eq"><Tex tex={`${X2('ax^2')} + ${BX('bx')} = ${hl(CC('-c'))}`} display /></div>
    <p>Comme pour l'exemple, on met le nombre seul à droite : il représente l'aire totale.</p>
  {/if}
  {#if phase === 1}
    <p>Problème : <Tex tex={X2('ax^2')} /> n'est pas un carré de côté <Tex tex="x" /> (sauf si <Tex tex="a = 1" />). On <strong>divise tout par <Tex tex="a" /></strong>.</p>
    <div class="actions"><button onclick={() => (phase = 2)}>Diviser par a</button></div>
  {/if}
  {#if phase >= 2}
    <div class="eq"><Tex tex={`${X2()} + ${hl(BX('\\frac{b}{a}x'))} = ${hl(CC('-\\frac{c}{a}'))}`} display /></div>
    <p>
      Voilà notre carré <Tex tex={X2()} /> et notre rectangle de côtés <Tex tex="x" /> et <Tex tex={BX('\\tfrac{b}{a}')} />.
      Dans l'exemple, <Tex tex={'\\tfrac{b}{a} = \\tfrac{6}{1} = 6'} /> et <Tex tex={'-\\tfrac{c}{a} = 16'} /> : c'est bien la même figure.
    </p>
  {/if}
</StepLayout>
