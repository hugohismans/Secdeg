/**
 * Routeur minimal par hash : #/comprendre/3, #/puzzle/2, #/projection/parabole…
 * Pas de dépendance, fonctionne hors ligne et sur GitHub Pages.
 */
export interface Route {
  /** segments du chemin, ex : ['comprendre', '3'] */
  segments: string[];
  /** premier segment ('' pour l'accueil) */
  page: string;
}

function parse(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  const segments = path.split('/').filter((s) => s !== '').map(decodeURIComponent);
  return { segments, page: segments[0] ?? '' };
}

let current = $state<Route>(parse(typeof location !== 'undefined' ? location.hash : ''));

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    current = parse(location.hash);
    window.scrollTo({ top: 0 });
  });
}

export const router = {
  get route(): Route {
    return current;
  },
  go(path: string) {
    const target = `#/${path.replace(/^\/?#?\/?/, '')}`;
    if (location.hash === target) return;
    location.hash = target;
  },
  href(path: string): string {
    return `#/${path.replace(/^\/?#?\/?/, '')}`;
  },
};
