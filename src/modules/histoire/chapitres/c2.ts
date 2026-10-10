import type { Chapter } from '../types';
import { EX_LABELS } from './shared';

const r = String.raw;

export const c2: Chapter = {
  n: 2,
  title: 'Compléter le carré',
  summary: 'Couper, glisser, ajouter le coin',
  beats: [
    { kind: 'place', text: 'La salle des copistes · fin d’après-midi' },
    { kind: 'narr', text: 'Le lendemain. Le maître a sorti une paire de ciseaux et une feuille de papier de Bagdad, le meilleur du monde, paraît-il.' },
    { kind: 'math', words: '« Un carré et dix racines égalent trente-neuf dirhams. »', tex: r`x^2 + 10x = 39` },
    { kind: 'say', who: 'maitre', text: 'Notre rectangle de dix racines est trop long pour former un carré avec le bien. Que proposes-tu ?' },
    {
      kind: 'choice',
      prompt: 'Que faire du rectangle ?',
      options: [
        { label: 'Le couper en deux bandes de cinq', ok: true, reply: [{ who: 'maitre', text: "C'est ce que j'allais dire. Tu ne m'as rien laissé." }] },
        { label: 'Le couper en dix bandes de un', reply: [{ who: 'maitre', text: 'Possible, mais tu passeras la nuit à coller. Deux bandes suffiront.' }] },
        { label: 'Le jeter', reply: [{ who: 'ahmad', text: 'Je vote pour ! … Non ? Bon.' }] },
      ],
      hint: 'Il faut pouvoir en mettre une partie à droite du carré, et une autre partie en dessous.',
    },
    {
      kind: 'tablet',
      labels: EX_LABELS,
      stage: 'cut',
      task: 'place',
      prompt: "Glisse une bande à droite du carré et l'autre en dessous.",
    },
    { kind: 'say', who: 'ahmad', text: 'On dirait un carré qui a perdu un morceau.' },
    { kind: 'say', who: 'maitre', text: "C'est exactement ça. Il manque un petit carré pour que la figure soit entière. Son côté vaut cinq. Combien de dirhams faut-il ajouter, et *de quel côté* de l'égalité ?" },
    {
      kind: 'choice',
      prompt: 'Que faut-il ajouter ?',
      options: [
        { label: '25, seulement dans le carré', reply: [{ who: 'ahmad', text: "Si tu ajoutes d'un seul côté, la balance penche. Je le sais, j'ai essayé avec les dattes de mon frère." }] },
        { label: '25, dans le carré et aussi aux trente-neuf dirhams', ok: true, reply: [{ who: 'maitre', text: "Voilà. Ce qu'on ajoute d'un côté, on l'ajoute de l'autre. Sinon, ce n'est plus la même question." }] },
        { label: '10, puisqu’il y a dix racines', reply: [{ who: 'maitre', text: 'Le coin est un carré de cinq sur cinq. Combien de petits carrés de un sur un tiennent dedans ?' }] },
      ],
      hint: 'Le coin est un carré de côté 5. Et une égalité, c’est une balance.',
    },
    { kind: 'tablet', labels: EX_LABELS, stage: 'moved', task: 'corner', prompt: 'Touche le coin pour le compléter.' },
    { kind: 'math', tex: r`x^2 + 10x + \textcolor{#2c7356}{25} = 39 + \textcolor{#2c7356}{25}` },
    {
      kind: 'input',
      prompt: "Quelle est maintenant l'aire du grand carré ?",
      expected: [64],
      hints: ['Trente-neuf dirhams, plus le coin que tu viens d’ajouter.', '$39 + 25 = ?$'],
      success: [{ who: 'maitre', text: 'Soixante-quatre. Un carré parfait, comme je les aime.' }],
    },
    { kind: 'tablet', labels: EX_LABELS, stage: 'completed', side: 'x + 5' },
    {
      kind: 'input',
      prompt: "Quel est le côté d'un carré dont l'aire vaut 64 ?",
      expected: [8],
      hints: ['Cherche le nombre qui, multiplié par lui-même, donne 64.', '$8 \\times 8 = 64$'],
    },
    { kind: 'say', who: 'maitre', text: 'Le côté du grand carré, c’est la racine plus cinq. Donc la racine vaut… ?' },
    {
      kind: 'input',
      prompt: 'Si $x + 5 = 8$, que vaut $x$ ?',
      expected: [3],
      hints: ['Retire 5 des deux côtés.', '$8 - 5 = ?$'],
      success: [{ who: 'maitre', text: 'Trois. Vérifions : le carré de trois, neuf. Dix racines, trente. Neuf et trente, trente-neuf. Le compte est bon.' }],
    },
    { kind: 'narr', text: "Voici la méthode telle qu'il l'écrit dans son livre : *prends la moitié des racines, multiplie-la par elle-même, ajoute-la au nombre, prends-en la racine, retranche la moitié des racines.* Avec nos nombres : $5$, puis $25$, puis $64$, puis $8$, puis $3$." },
    { kind: 'say', who: 'ahmad', text: 'Et si je fais la même chose avec un autre problème, ça marche aussi ?' },
    { kind: 'say', who: 'maitre', text: "Toujours. C'est tout l'intérêt d'une méthode." },
    { kind: 'narr', text: 'Sifr s’étire sur la tablette, pile dans le coin vert. Il a l’air de trouver que c’est sa place.' },
  ],
};
