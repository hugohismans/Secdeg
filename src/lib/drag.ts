/**
 * Action Svelte de glisser-déposer en pointer events (souris + tactile).
 * Rapporte les déplacements en pixels écran ; le composant convertit en
 * unités SVG avec `clientToSvg` si besoin.
 */
export interface DragEvent {
  /** déplacement total depuis le début du geste, en px écran */
  dx: number;
  dy: number;
  /** position courante du pointeur, en px écran */
  clientX: number;
  clientY: number;
}

export interface DragOptions {
  enabled?: boolean;
  onstart?: (e: DragEvent) => void;
  onmove?: (e: DragEvent) => void;
  onend?: (e: DragEvent) => void;
}

export function draggable(node: Element, options: DragOptions = {}) {
  let opts = options;
  let startX = 0;
  let startY = 0;
  let active = false;
  const el = node as HTMLElement;

  function ev(e: PointerEvent): DragEvent {
    return { dx: e.clientX - startX, dy: e.clientY - startY, clientX: e.clientX, clientY: e.clientY };
  }
  function down(e: PointerEvent) {
    if (opts.enabled === false) return;
    if (e.button !== undefined && e.button !== 0) return;
    active = true;
    startX = e.clientX;
    startY = e.clientY;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    e.preventDefault();
    opts.onstart?.(ev(e));
  }
  function move(e: PointerEvent) {
    if (!active) return;
    e.preventDefault();
    opts.onmove?.(ev(e));
  }
  function up(e: PointerEvent) {
    if (!active) return;
    active = false;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    opts.onend?.(ev(e));
  }

  el.style.touchAction = 'none';
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);

  return {
    update(next: DragOptions) {
      opts = next;
    },
    destroy() {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    },
  };
}

/** Convertit des coordonnées écran en coordonnées du viewBox d'un SVG. */
export function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number): { x: number; y: number } {
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: clientX, y: clientY };
  const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
  return { x: pt.x, y: pt.y };
}

/** Facteur px écran → unités SVG (pour convertir un dx). */
export function svgScale(svg: SVGSVGElement): number {
  const ctm = svg.getScreenCTM();
  return ctm ? 1 / ctm.a : 1;
}
