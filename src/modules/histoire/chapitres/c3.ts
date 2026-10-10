import type { Chapter } from '../types';

const r = String.raw;

export const c3: Chapter = {
  n: 3,
  title: 'Le nombre interdit',
  summary: 'Une deuxième racine, et le ±',
  beats: [
    { kind: 'place', text: 'La cour de la Maison de la Sagesse · le soir' },
    { kind: 'narr', text: 'Le soir, dans la cour, al-Hasan, le plus jeune des trois frères, dessine des figures dans le sable avec un bâton.' },
    { kind: 'say', who: 'hasan', text: "Mon frère dit que tu as trouvé la racine : trois. J'ai refait le calcul, et je crois qu'il y a un autre nombre." },
    { kind: 'math', tex: r`(x + 5)^2 = 64` },
    { kind: 'say', who: 'hasan', text: 'Quel nombre, multiplié par lui-même, donne soixante-quatre ?' },
    {
      kind: 'choice',
      prompt: 'Que peut valoir $x + 5$ ?',
      options: [
        { label: 'Seulement $8$', reply: [{ who: 'hasan', text: 'Huit, oui. Mais pense à une dette de huit dirhams…' }] },
        { label: '$8$, et aussi $-8$', ok: true, reply: [{ who: 'hasan', text: "Oui ! Les savants de l'Inde l'écrivent déjà : une dette multipliée par une dette donne une fortune. Moins huit fois moins huit, soixante-quatre." }] },
        { label: '$32$, la moitié de 64', reply: [{ who: 'hasan', text: 'Trente-deux fois trente-deux, ça fait bien plus que soixante-quatre !' }] },
      ],
      hint: '$(-8) \\times (-8) = ?$',
    },
    { kind: 'math', tex: r`x + 5 = 8 \quad\text{ou}\quad x + 5 = -8` },
    {
      kind: 'input',
      prompt: 'Si $x + 5 = -8$, que vaut $x$ ?',
      expected: [-13],
      hints: ['Retire 5 des deux côtés.', '$-8 - 5 = ?$'],
      success: [{ who: 'hasan', text: 'Moins treize. Vérifie : le carré de moins treize, cent soixante-neuf. Dix fois moins treize, moins cent trente. Il reste… trente-neuf !' }],
    },
    {
      kind: 'choice',
      prompt: 'On le dit au maître ?',
      options: [
        { label: 'Oui, allons-y', reply: [{ who: 'hasan', text: 'Courage. Je te suis. De loin.' }] },
        { label: 'Toi d’abord', reply: [{ who: 'hasan', text: "Ah non. C'est toi l'apprenti du maître." }] },
      ],
    },
    { kind: 'place', text: 'La salle des copistes · à la lueur des lampes' },
    { kind: 'say', who: 'maitre', text: 'Moins treize ? Une longueur de moins treize ? Montre-moi un champ de moins treize coudées, et je te donne mon calame.' },
    { kind: 'say', who: 'ahmad', text: "Je parie un sac de dattes qu'un jour, on s'en servira." },
    { kind: 'say', who: 'maitre', text: 'Tu paries toujours les dattes de ton frère.' },
    { kind: 'narr', text: "Le maître a raison pour son époque : dans son livre, une racine est une longueur, donc positive. Mais Ahmad a raison aussi. Il faudra quelques siècles, mais les mathématiciens finiront par accepter les nombres négatifs comme de vraies solutions." },
    { kind: 'say', who: 'maitre', text: 'Bon. Notons-le dans la marge, pour ceux qui viendront après nous. Mais retiens ceci, {nom}, car c’est juste : deux nombres opposés ont le même carré.' },
    { kind: 'math', tex: r`(x+5)^2 = 64 \;\Longrightarrow\; x + 5 = \pm 8 \;\Longrightarrow\; x = 3 \;\text{ ou }\; x = -13` },
    { kind: 'narr', text: 'Le signe $\\pm$ se lit « plus ou moins ». Il dit les deux possibilités d’un seul coup.' },
    {
      kind: 'input',
      prompt: 'À toi : résous $(x - 2)^2 = 9$. Donne les deux solutions, séparées par un point-virgule.',
      expected: [5, -1],
      placeholder: 'ex : 4 ; -2',
      hints: ['$x - 2 = 3$ ou $x - 2 = -3$.', '$x = 2 + 3$ ou $x = 2 - 3$.'],
      success: [{ who: 'ahmad', text: 'Cinq et moins un. Le maître acceptera cinq. Moins un, on le garde pour plus tard, avec les dattes.' }],
    },
  ],
};
