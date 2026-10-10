<script lang="ts">
  /** Curseur tactile avec boutons − / + et saisie numérique, pour a, b, c. */
  interface Props {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    color?: string;
    onchange?: (v: number) => void;
  }
  let { label, value = $bindable(), min, max, step = 1, color = 'var(--primary)', onchange }: Props = $props();

  function clamp(v: number): number {
    const s = Math.round((v - min) / step) * step + min;
    return Math.min(max, Math.max(min, Math.round(s * 1000) / 1000));
  }
  function set(v: number) {
    if (!Number.isFinite(v)) return;
    value = clamp(v);
    onchange?.(value);
  }
  function onInput(e: Event) {
    set(Number((e.target as HTMLInputElement).value));
  }
  function onText(e: Event) {
    const raw = (e.target as HTMLInputElement).value.replace(',', '.');
    const v = Number(raw);
    if (raw.trim() !== '' && Number.isFinite(v)) set(v);
  }
  const id = `slider-${Math.random().toString(36).slice(2, 8)}`;
  let shown = $derived(String(value).replace('.', ','));
</script>

<div class="slider" style="--c: {color}">
  <label for={id} class="lbl"><span class="name">{label}</span> = <output>{shown}</output></label>
  <div class="controls">
    <button class="small secondary" onclick={() => set(value - step)} aria-label="Diminuer {label}" disabled={value <= min}>−</button>
    <input {id} type="range" {min} {max} {step} {value} oninput={onInput} aria-label={label} />
    <button class="small secondary" onclick={() => set(value + step)} aria-label="Augmenter {label}" disabled={value >= max}>+</button>
    <input class="num" type="text" inputmode="decimal" value={shown} onchange={onText} aria-label="Valeur de {label}" />
  </div>
</div>

<style>
  .slider {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin: 0.4rem 0;
  }
  .lbl {
    font-weight: 600;
  }
  .name {
    color: var(--c);
    font-size: 1.2em;
    font-style: italic;
    font-family: 'KaTeX_Math', 'Times New Roman', serif;
  }
  .controls {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  input[type='range'] {
    flex: 1;
    min-width: 80px;
    accent-color: var(--c);
    height: var(--tap);
    margin: 0;
    touch-action: pan-y;
  }
  .num {
    width: 4.5em;
    text-align: center;
    padding: 0.3em;
  }
  .small {
    min-width: var(--tap);
    padding: 0;
    border-color: var(--c);
    color: var(--c);
    font-size: 1.2em;
  }
</style>
