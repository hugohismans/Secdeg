import type { Chapter } from '../types';
import { quad } from '../../../math/quadratic';

const r = String.raw;

export const c5: Chapter = {
  n: 5,
  title: 'La question impossible',
  summary: 'Deux racines, une seule, ou aucune',
  beats: [
    { kind: 'place', text: 'La bibliothèque · tard dans la nuit' },
    { kind: 'narr', text: 'Les lampes à huile fument. Le maître relit un passage de son livre, le doigt sur la ligne.' },
    { kind: 'say', who: 'maitre', text: 'Le premier jour, je t’ai donné ce problème : *un carré et vingt-et-un dirhams égalent dix racines.* Résous-le.' },
    { kind: 'math', tex: r`x^2 + 21 = 10x` },
    {
      kind: 'solver',
      q: quad(1, -10, 21),
      intro: 'Mets toutes les racines à gauche et le nombre à droite, puis complète le carré.',
    },
    { kind: 'say', who: 'maitre', text: 'Trois *et* sept. Deux racines, toutes les deux positives : cette fois, je n’ai rien à refuser. Je l’écris d’ailleurs dans mon livre.' },
    { kind: 'say', who: 'hasan', text: 'Et si on remplace vingt-et-un par trente ?' },
    { kind: 'math', tex: r`x^2 + 30 = 10x` },
    {
      kind: 'choice',
      prompt: 'Après avoir complété le carré, on obtient…',
      options: [
        { label: '$(x - 5)^2 = 5$', reply: [{ who: 'hasan', text: 'Vérifie : vingt-cinq moins trente, ça fait combien ?' }] },
        { label: '$(x - 5)^2 = -5$', ok: true, reply: [{ who: 'maitre', text: 'Un carré égal à moins cinq.' }] },
        { label: '$(x - 5)^2 = 55$', reply: [{ who: 'hasan', text: 'Tu as ajouté trente au lieu de le retirer.' }] },
      ],
      hint: '$x^2 - 10x = -30$, puis on ajoute $25$ des deux côtés.',
    },
    {
      kind: 'choice',
      prompt: 'Un carré peut-il valoir $-5$ ?',
      options: [
        { label: "Non : un carré n'est jamais négatif", ok: true },
        { label: 'Oui, avec $-\\sqrt{5}$', reply: [{ who: 'hasan', text: 'Moins racine de cinq, au carré, donne plus cinq. Le signe moins disparaît quand on multiplie un nombre par lui-même.' }] },
      ],
      hint: 'Un positif fois un positif est positif. Un négatif fois un négatif aussi.',
    },
    { kind: 'say', who: 'maitre', text: 'Alors, comme je l’écris dans mon livre : *la question est impossible.* Ce n’est pas une erreur de calcul. C’est la question elle-même qui n’a pas de réponse.' },
    { kind: 'say', who: 'hasan', text: 'Et entre les deux ? S’il reste exactement zéro ?' },
    { kind: 'math', tex: r`\begin{gathered} x^2 + 25 = 10x \\ \Longrightarrow\; (x-5)^2 = 0 \end{gathered}` },
    {
      kind: 'input',
      prompt: 'Combien vaut $x$ ?',
      expected: [5],
      hints: ['Seul $0$ a pour carré $0$.', '$x - 5 = 0$'],
      success: [{ who: 'maitre', text: 'Une seule racine : cinq. Les deux racines se sont rejointes.' }],
    },
    { kind: 'narr', text: 'Tout dépend de ce qui reste une fois le carré complété. Positif : deux racines. Zéro : une seule. Négatif : aucune. Mille ans plus tard, on donnera un nom à ce reste : le **discriminant**, noté $\\Delta = b^2 - 4ac$.' },
    {
      kind: 'choice',
      prompt: 'Pour $x^2 + 4x + 7 = 0$, combien de solutions ?',
      options: [
        { label: 'Deux', reply: [{ who: 'hasan', text: 'Complète le carré : $(x + 2)^2 = 4 - 7$. Que reste-t-il ?' }] },
        { label: 'Une seule', reply: [{ who: 'hasan', text: 'Il faudrait qu’il reste exactement zéro. Ici, $4 - 7$…' }] },
        { label: 'Aucune', ok: true, reply: [{ who: 'maitre', text: 'Il reste $-3$. La question est impossible. Et avec Δ : $16 - 28 = -12$, négatif aussi.' }] },
      ],
      hint: '$(x + 2)^2 = 4 - 7$',
    },
    { kind: 'narr', text: 'Le narrateur triche encore : voici un dessin que Descartes inventera huit siècles plus tard, la courbe $y = ax^2 + bx + c$. Les solutions sont les endroits où elle touche l’axe horizontal.' },
    { kind: 'explorer', a: 1, b: -10, c: 21, prompt: 'Bouge les curseurs. Que se passe-t-il quand Δ devient négatif ?' },
    { kind: 'say', who: 'ahmad', text: 'Une courbe… Ça me rappelle quelque chose. Venez au jardin demain. Et prenez des vêtements de rechange.' },
  ],
};
