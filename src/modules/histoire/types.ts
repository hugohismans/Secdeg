/**
 * Format des chapitres du mode Histoire.
 * Les textes acceptent : {nom} (prénom de l'élève), *italique*, **gras**, $LaTeX$.
 */
import type { Quadratic } from '../../math/quadratic';
import type { Level as PuzzleLevel } from '../puzzle/levels';
import type { LanceLevel } from '../lance/levels';

export type Who = 'maitre' | 'ahmad' | 'muhammad' | 'hasan' | 'calife';

/** une réplique : un personnage, ou la narration */
export interface Line {
  who: Who | 'narr';
  text: string;
}

export interface ChoiceOption {
  /** texte du bouton (peut contenir du $LaTeX$) */
  label: string;
  /** bonne réponse ; si aucune option n'a `ok`, le choix est libre */
  ok?: boolean;
  /** répliques affichées après ce choix */
  reply?: Line[];
}

export type SquareLabels = { x: string; half: string; full: string; corner: string };

export type Beat =
  /** en-tête de lieu, en haut d'une scène */
  | { kind: 'place'; text: string }
  | { kind: 'narr'; text: string }
  | { kind: 'say'; who: Who; text: string }
  /** une équation (LaTeX) sur la tablette, éventuellement précédée de sa version en mots */
  | { kind: 'math'; tex?: string; words?: string }
  | { kind: 'choice'; prompt: string; options: ChoiceOption[]; hint?: string }
  /** saisie d'un ou plusieurs nombres (ordre indifférent) */
  | { kind: 'input'; prompt: string; expected: number[]; placeholder?: string; hints: string[]; success?: Line[] }
  /**
   * la tablette du maître (complétion du carré)
   * task 'place' : glisser les deux bandes ; 'corner' : toucher le coin ; aucune : affichage
   */
  | {
      kind: 'tablet';
      labels: SquareLabels;
      stage: 'initial' | 'cut' | 'moved' | 'completed';
      task?: 'place' | 'corner';
      prompt?: string;
      showAreas?: boolean;
      side?: string;
    }
  | { kind: 'solver'; q: Quadratic; intro?: string }
  | { kind: 'puzzle'; level: PuzzleLevel; intro?: string }
  | { kind: 'lance'; level: LanceLevel; intro?: string }
  | {
      kind: 'rapidite';
      total: number;
      minCorrect: number;
      timeFactor: number;
      intro?: string;
      retry: Line[];
    }
  | { kind: 'explorer'; a: number; b: number; c: number; prompt: string }
  /** la phrase d'al-Khwârizmî qui se transforme en formule */
  | { kind: 'reveal' };

export interface Chapter {
  n: number;
  title: string;
  /** résumé court pour la carte */
  summary: string;
  beats: Beat[];
}
