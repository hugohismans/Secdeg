import type { Chapter } from '../types';
import { LEVELS } from '../../lance/levels';

export const c6: Chapter = {
  n: 6,
  title: 'Les fontaines des Banû Mûsâ',
  summary: 'Le jet d’eau suit la courbe',
  beats: [
    { kind: 'place', text: 'Le jardin du palais · midi' },
    { kind: 'narr', text: 'Au jardin, les trois frères ont installé des tuyaux, des buses et des bassins. Muhammad, l’aîné, tient un rouleau couvert de plans.' },
    { kind: 'say', who: 'muhammad', text: 'Bienvenue. Nous construisons des fontaines dont les jets dessinent des arcs. Ahmad dit que tu sais tout sur les courbes.' },
    { kind: 'say', who: 'ahmad', text: "J'ai dit « presque tout »." },
    { kind: 'say', who: 'muhammad', text: "On règle chaque jet avec trois molettes : $a$, $b$ et $c$. Le problème, c'est que l'eau tombe toujours à côté des bassins." },
    { kind: 'narr', text: 'Le narrateur précise : prouver qu’un jet d’eau suit une parabole, ce sera le travail de Galilée, huit siècles plus tard. Les frères ne le savent pas encore. Toi, si.' },
    {
      kind: 'lance',
      level: { ...LEVELS[2], text: "L'eau doit jaillir du bassin en x = −1 et retomber dans celui en x = 3." },
    },
    { kind: 'say', who: 'muhammad', text: 'Dans le bassin ! Comment as-tu trouvé ?' },
    {
      kind: 'choice',
      prompt: 'Comment trouver la courbe quand on connaît les deux points où l’eau touche le sol ?',
      options: [
        { label: 'Ces deux points sont les racines : $y = a(x + 1)(x - 3)$', ok: true, reply: [{ who: 'muhammad', text: 'Les racines de l’équation sont les points d’arrivée du jet. Je note.' }] },
        { label: 'Au hasard, jusqu’à ce que ça marche', reply: [{ who: 'ahmad', text: "C'est ma méthode ! Elle marche, mais on finit trempé." }] },
      ],
      hint: 'Le jet touche le sol là où $y = 0$, c’est-à-dire aux racines.',
    },
    {
      kind: 'lance',
      level: { ...LEVELS[4], text: 'Le calife veut un jet qui monte exactement à la hauteur 4, au milieu de deux bassins placés en 0 et en 4.' },
    },
    { kind: 'say', who: 'hasan', text: "Le sommet est toujours au milieu des deux racines. C'est l'axe de symétrie : $x = -\\frac{b}{2a}$." },
    { kind: 'narr', text: 'Les deux racines sont à la même distance de cet axe. La formule le dira un jour : $x = -\\frac{b}{2a} \\pm \\frac{\\sqrt{\\Delta}}{2a}$. Un centre, plus ou moins un écart.' },
    {
      kind: 'lance',
      level: { ...LEVELS[3], text: "Dernier jet : jaillir en x = 1, retomber en x = 5, en passant dans l'anneau doré." },
    },
    { kind: 'say', who: 'muhammad', text: 'Trois fontaines parfaites. Le calife va les adorer. Il veut d’ailleurs vous voir demain, le maître et toi.' },
    { kind: 'say', who: 'ahmad', text: 'Il pose ses questions très vite. Entraîne-toi. Et ne parle pas des dattes.' },
    { kind: 'narr', text: 'Les Banû Mûsâ écriront plus tard un célèbre *Livre des procédés ingénieux*, rempli de fontaines et d’automates.' },
  ],
};
