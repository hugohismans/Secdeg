/** Plan du Cours : les 12 étapes du module Comprendre, groupées en trois parties. */
export interface OutlineStep {
  index: number;
  label: string;
  /** titre mixte : texte avant, formule, texte après (optionnel) */
  rich?: { before?: string; tex: string; after?: string };
}

export const STEP_LABELS: string[] = [
  'Un carré et dix racines',
  'Couper et glisser',
  'Le coin manquant',
  'Trouver x',
  'En général',
  'Couper la bande en deux',
  'Le coin (b/2a)²',
  'Δ apparaît',
  'La formule',
  'Trois cas',
  'Centre ± écart',
  'Fiche mémo',
];

const RICH: Record<number, OutlineStep['rich']> = {
  3: { before: 'Trouver ', tex: 'x' },
  4: { tex: '\\textcolor{#1f4c8f}{ax^2} + \\textcolor{#a9661a}{bx} + c = 0' },
  6: { before: 'Le coin ', tex: '\\textcolor{#2c7356}{\\left(\\tfrac{b}{2a}\\right)^2}' },
  7: { tex: '\\textcolor{#6b3a73}{\\Delta}', after: ' apparaît' },
};

function steps(from: number, to: number): OutlineStep[] {
  const out: OutlineStep[] = [];
  for (let i = from; i <= to; i++) out.push({ index: i, label: STEP_LABELS[i], rich: RICH[i] });
  return out;
}

export const COURSE_PARTS = [
  { roman: 'I', title: 'Compléter le carré', steps: steps(0, 3) },
  { roman: 'II', title: 'La formule', steps: steps(4, 8) },
  { roman: 'III', title: 'Lire Δ', steps: steps(9, 11) },
];
