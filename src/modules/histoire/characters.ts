import type { Who } from './types';

export const CHARACTERS: Record<Who, { name: string; role: string }> = {
  maitre: { name: 'Al-Khwârizmî', role: 'le maître' },
  ahmad: { name: 'Ahmad', role: 'le deuxième des frères Banû Mûsâ' },
  muhammad: { name: 'Muhammad', role: "l'aîné des frères Banû Mûsâ" },
  hasan: { name: 'Al-Hasan', role: 'le plus jeune des frères Banû Mûsâ' },
  calife: { name: "Al-Ma'mûn", role: 'le calife' },
};
