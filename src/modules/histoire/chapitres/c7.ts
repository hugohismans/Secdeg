import type { Chapter } from '../types';

export const c7: Chapter = {
  n: 7,
  title: 'Devant le calife',
  summary: 'Les questions d’al-Ma’mûn et la formule',
  beats: [
    { kind: 'place', text: 'Le palais du calife · la salle d’audience' },
    { kind: 'narr', text: 'Au centre de la ville ronde, sous la coupole verte, le calife al-Ma’mûn reçoit savants, poètes et ambassadeurs. Aujourd’hui, c’est votre tour.' },
    { kind: 'say', who: 'calife', text: 'Muhammad ibn Mûsâ. On me dit que ton livre résout tous les problèmes de carrés et de racines. Et que ton apprenti répond plus vite que mes astronomes.' },
    { kind: 'say', who: 'maitre', text: 'On vous a bien renseigné, Commandeur des croyants. Pour l’apprenti, du moins.' },
    { kind: 'say', who: 'calife', text: 'Voyons cela. Je pose une question, je retourne le sablier. Combien de racines ?' },
    {
      kind: 'rapidite',
      total: 6,
      minCorrect: 4,
      timeFactor: 1.5,
      intro: 'Six questions. Il en faut au moins quatre justes pour convaincre le calife.',
      retry: [{ who: 'calife', text: 'Le sablier est cruel. Recommençons, je suis d’humeur patiente aujourd’hui.' }],
    },
    { kind: 'say', who: 'calife', text: 'Remarquable. Dis-moi, savant : peux-tu écrire ta méthode en une seule phrase, pour que mes scribes la retiennent ?' },
    { kind: 'say', who: 'maitre', text: 'En mots, oui. *Prends la moitié des racines, multiplie-la par elle-même, ajoute-la au nombre, prends-en la racine, retranche la moitié des racines.*' },
    { kind: 'narr', text: 'Le narrateur ne peut plus se retenir. Regarde ce que deviendra cette phrase, morceau par morceau, dans mille ans.' },
    { kind: 'reveal' },
    { kind: 'say', who: 'calife', text: 'Je ne comprends pas un seul de ces signes. Mais c’est très beau.' },
    { kind: 'narr', text: "Le livre d'al-Khwârizmî sera traduit en latin au XIIe siècle. Son titre, *al-jabr*, donnera le mot **algèbre**. Son nom, écrit *Algoritmi* en latin, donnera le mot **algorithme**. Et *sifr*, le chat, pardon, le zéro, donnera **zéro** et **chiffre**." },
    { kind: 'say', who: 'maitre', text: 'Merci, {nom}. Tu as bien travaillé. Va, maintenant. Il reste des carrés à compléter.' },
    { kind: 'narr', text: 'Sifr te raccompagne jusqu’à la porte de Koufa. Puis il fait demi-tour, comme si de rien n’était.' },
  ],
};
