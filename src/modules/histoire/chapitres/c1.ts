import type { Chapter } from '../types';
import { EX_LABELS } from './shared';

const r = String.raw;

export const c1: Chapter = {
  n: 1,
  title: 'Le bien et la racine',
  summary: 'Le premier problème du maître',
  beats: [
    { kind: 'place', text: 'Bagdad, an 820 · La Maison de la Sagesse, au matin' },
    { kind: 'narr', text: "Le soleil n'a pas encore chauffé les murs de briques. Dans la salle des copistes, on n'entend que le grattement des calames sur le papier." },
    { kind: 'narr', text: "Tu arrives ici pour apprendre le métier de copiste. Au fond de la salle, un homme aux doigts tachés d'encre lève les yeux de son manuscrit." },
    { kind: 'say', who: 'maitre', text: "Tu dois être {nom}. Je suis Muhammad ibn Mûsâ al-Khwârizmî. On m'a dit que tu avais une belle écriture. Ici, on te demandera surtout de bien réfléchir." },
    { kind: 'say', who: 'maitre', text: "J'écris un livre pour aider les gens à résoudre les problèmes de tous les jours : les héritages, les partages de champs, le commerce. Écoute celui-ci." },
    { kind: 'math', words: '« Un carré et dix racines égalent trente-neuf dirhams. »' },
    { kind: 'say', who: 'maitre', text: "Le nombre que l'on cherche, je l'appelle la *racine*, en arabe *jidhr*. Multiplié par lui-même, il donne le *bien*, *mâl*. On l'appelle aussi le carré." },
    { kind: 'say', who: 'ahmad', text: "Et les dirhams, c'est l'argent qu'on n'a pas. Bonjour ! Ahmad, fils de Mûsâ. Je passais." },
    { kind: 'say', who: 'maitre', text: 'Ahmad passe toujours. Il ne reste jamais.' },
    { kind: 'narr', text: 'Le maître trace sur sa tablette un carré et un long rectangle.' },
    { kind: 'tablet', labels: EX_LABELS, stage: 'initial', showAreas: false },
    { kind: 'say', who: 'maitre', text: "Si la racine est le côté de ce carré, alors le bien est son aire. Et les dix racines, où sont-elles ?" },
    {
      kind: 'choice',
      prompt: 'Que représentent « dix racines » sur la tablette ?',
      options: [
        { label: r`Un rectangle de côtés $x$ et $10$, donc d'aire $10x$`, ok: true, reply: [{ who: 'maitre', text: "Exactement. Dix bandes de largeur un, collées l'une à l'autre : un rectangle." }] },
        { label: 'Dix carrés comme le premier', reply: [{ who: 'maitre', text: 'Ce serait dix *biens*. Ici, ce sont dix racines : dix longueurs $x$, côte à côte.' }] },
        { label: 'Un carré de côté 10', reply: [{ who: 'maitre', text: 'Son aire serait cent, sans aucune racine dedans. Regarde mieux la tablette.' }] },
      ],
      hint: "Une racine, c'est une longueur $x$. Mets-en dix côte à côte, avec une hauteur $x$.",
    },
    { kind: 'tablet', labels: EX_LABELS, stage: 'initial', showAreas: true },
    { kind: 'say', who: 'maitre', text: 'Le problème dit donc : le carré et le rectangle, ensemble, ont une aire de trente-neuf.' },
    { kind: 'narr', text: "(Psst. Le narrateur a mille ans d'avance sur tout le monde ici. Il connaît une façon d'écrire tout ça avec des signes, que personne n'a encore inventée.)" },
    {
      kind: 'choice',
      prompt: 'Comment écrira-t-on plus tard « un carré et dix racines égalent trente-neuf dirhams » ?',
      options: [
        { label: '$x^2 + 10x = 39$', ok: true, reply: [{ who: 'narr', text: 'Voilà. Le carré, $x^2$. Dix racines, $10x$. Trente-neuf dirhams, $39$.' }] },
        { label: '$x^2 + 10 = 39x$', reply: [{ who: 'narr', text: 'Ici, ce sont les dirhams qui seraient multipliés par $x$. Relis la phrase : ce sont les dix *racines*.' }] },
        { label: '$(x + 10)^2 = 39$', reply: [{ who: 'narr', text: "C'est le carré de $x + 10$, pas « un carré et dix racines »." }] },
      ],
      hint: 'Un carré : $x^2$. Dix racines : $10x$. Trente-neuf dirhams : $39$.',
    },
    { kind: 'say', who: 'ahmad', text: "Moi, j'aurais écrit : « beaucoup de calcul pour trente-neuf dirhams ». C'est plus court." },
    { kind: 'say', who: 'maitre', text: "Un autre, pour voir si tu as compris. Celui-ci reviendra plus tard, garde-le en tête." },
    { kind: 'math', words: '« Un carré et vingt-et-un dirhams égalent dix racines. »' },
    {
      kind: 'choice',
      prompt: 'Quelle écriture correspond ?',
      options: [
        { label: '$x^2 + 21 = 10x$', ok: true, reply: [{ who: 'maitre', text: 'Bien, {nom}.' }] },
        { label: '$x^2 + 10x = 21$', reply: [{ who: 'maitre', text: "Les dix racines sont de l'autre côté. Relis : un carré *et vingt-et-un dirhams* égalent dix racines." }] },
        { label: '$21x^2 = 10x$', reply: [{ who: 'maitre', text: "Il n'y a qu'un seul carré, et les vingt-et-un dirhams sont seuls." }] },
      ],
      hint: 'À gauche : le carré et les dirhams. À droite : les racines.',
    },
    { kind: 'say', who: 'maitre', text: 'Demain, nous chercherons la racine. Pas avec des signes : avec des ciseaux.' },
    { kind: 'say', who: 'ahmad', text: 'Des ciseaux ? Pour des mathématiques ? Je reviendrai demain. Pour voir.' },
    { kind: 'narr', text: 'Sous la table, quelque chose bouge. Une silhouette noire, un collier bleu.' },
    { kind: 'say', who: 'maitre', text: "Ah, voici Sifr. Il garde la bibliothèque. Il ne vaut rien, et pourtant on ne peut pas s'en passer." },
    { kind: 'narr', text: "*Sifr* veut dire « zéro ». Le maître a aussi écrit un livre sur les chiffres venus de l'Inde, avec ce drôle de signe qui veut dire « rien ». Le mot *sifr* deviendra un jour « zéro » et « chiffre »." },
  ],
};
