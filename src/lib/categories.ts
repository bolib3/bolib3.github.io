import type { Category } from '@/types';

export const categories = {
  transportation: {
    name: 'Transportation',
    colour: 'oklch(88.5% 0.062 18.334)',
  },
  textbook: {
    name: 'Textbook',
    colour: 'oklch(95% 0.052 163.051)',
  },
  machine_learning: {
    name: 'Machine Learning',
    colour: 'oklch(0.885 0.062 214.18)',
  },
  miscellaneous: {
    name: 'Miscellaneous',
    colour: 'oklch(95.2% 0.037 318.852)',
  },
} satisfies Record<string, Category>;
