import type { Chapter } from '../types';
import { quad } from '../../../math/quadratic';

const r = String.raw;

export const c4: Chapter = {
  n: 4,
  title: 'Restaurer et équilibrer',
  summary: 'Al-jabr, diviser par a, carreler une cour',
  beats: [
    { kind: 'place', text: 'Devant la Maison de la Sagesse · le matin' },
    { kind: 'narr', text: 'Un marchand attend devant la porte, l’air soucieux. Il serre contre lui un plan de terrain.' },
    { kind: 'say', who: 'maitre', text: "Ce marchand a un problème de terrain. C'est pour ce genre de problème que j'écris mon livre. Son titre, d'ailleurs, ce sont deux gestes : *al-jabr* et *al-muqâbala*." },
    { kind: 'say', who: 'maitre', text: "*Al-jabr*, c'est restaurer. Quand un côté de l'égalité a perdu quelque chose, on le lui rend, et on le donne aussi à l'autre côté." },
    {
      kind: 'choice',
      prompt: 'Pour restaurer $x^2 + 6x - 7 = 0$, que fait-on ?',
      options: [
        { label: 'On ajoute 7 des deux côtés : $x^2 + 6x = 7$', ok: true, reply: [{ who: 'maitre', text: 'Voilà. Le côté gauche a retrouvé ce qui lui manquait.' }] },
        { label: 'On retire 7 des deux côtés : $x^2 + 6x - 14 = -7$', reply: [{ who: 'maitre', text: 'Tu as creusé le trou au lieu de le reboucher.' }] },
        { label: 'On ajoute 7 à gauche seulement', reply: [{ who: 'ahmad', text: 'La balance ! Les dattes ! On en a déjà parlé.' }] },
      ],
      hint: 'Le côté gauche a « perdu » 7. Pour le lui rendre, on ajoute 7… des deux côtés.',
    },
    { kind: 'say', who: 'maitre', text: "*Al-muqâbala*, c'est équilibrer : on retire des deux côtés ce qui est pareil. Mon livre porte ces deux noms. Plus tard, très loin d'ici, *al-jabr* deviendra un mot que tu connais." },
    {
      kind: 'choice',
      prompt: 'Quel mot ?',
      options: [
        { label: 'Algèbre', ok: true, reply: [{ who: 'narr', text: '*Al-jabr*, « algèbre ». Tu es en train d’apprendre la matière qui porte le nom de ce livre.' }] },
        { label: 'Algorithme', reply: [{ who: 'narr', text: "Bien vu, mais ça, c'est une autre histoire, qu'on te racontera au dernier chapitre." }] },
        { label: 'Géométrie', reply: [{ who: 'narr', text: 'Géométrie vient du grec. Ici, on parle arabe.' }] },
      ],
      hint: 'Dis *al-jabr* à voix haute, très vite. À quelle matière ça ressemble ?',
    },
    { kind: 'say', who: 'maitre', text: 'Le marchand dit : *deux carrés et dix racines égalent quarante-huit dirhams*.' },
    { kind: 'math', tex: r`2x^2 + 10x = 48` },
    { kind: 'say', who: 'maitre', text: "Deux carrés ! Nos ciseaux ne savent compléter qu'un seul carré. Alors on ramène tout à un seul carré : on prend la moitié de chaque chose." },
    {
      kind: 'solver',
      q: quad(2, 10, -48),
      intro: 'Fais les gestes du maître, étape par étape. Les fractions sont acceptées, par exemple 5/2.',
    },
    { kind: 'say', who: 'maitre', text: 'Trois coudées. Le marchand sera content. Cette fois, la moitié des racines ne tombait pas juste : deux et demi. La méthode s’en moque.' },
    { kind: 'say', who: 'ahmad', text: 'Et moins huit ? Je dis ça pour les dattes.' },
    { kind: 'narr', text: 'Ce problème se trouve vraiment dans le livre d’al-Khwârizmî. Il commence, lui aussi, par tout diviser par deux.' },
    { kind: 'place', text: 'La cour du palais · midi' },
    { kind: 'say', who: 'ahmad', text: "Pendant que vous calculiez, le chef des carreleurs est passé. Il doit paver une cour carrée et il ne sait pas combien de carreaux commander. J'ai dit que {nom} n'avait jamais raté un carré. Ne me fais pas mentir." },
    { kind: 'say', who: 'maitre', text: 'Tu as dit ça ?' },
    { kind: 'say', who: 'ahmad', text: "J'ai parlé très vite." },
    {
      kind: 'puzzle',
      level: { title: 'La cour du palais', subtitle: 'x² + 8x − 20 = 0', kind: 'tiles-move-c', q: quad(1, 8, -20) },
      intro: "Le problème du carreleur : $x^2 + 8x - 20 = 0$. Restaure d'abord, puis pose les carreaux.",
    },
    { kind: 'say', who: 'maitre', text: 'Restaurer, équilibrer, compléter. Tu as fait les trois gestes du livre, {nom}.' },
    { kind: 'narr', text: 'Sifr traverse la cour sans regarder personne et s’installe au centre exact du carré de carreaux. Personne n’ose le déplacer.' },
  ],
};
