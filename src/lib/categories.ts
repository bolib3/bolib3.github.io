import type { Category } from '@/types';

export const categories = {
  transportation: {
    name: 'Transportation',
    colour: 'oklch(0.85 0.07 32)',
  },
  textbook: {
    name: 'Textbook',
    colour: 'oklch(0.85 0.07 85)',
  },
  machine_learning: {
    name: 'Machine Learning',
    colour: 'oklch(0.85 0.07 146)',
  },
  energy: {
    name: 'Energy',
    colour: 'oklch(0.85 0.07 194)',
  },
  miscellaneous: {
    name: 'Miscellaneous',
    colour: 'oklch(0.85 0.07 312)',
  },
} satisfies Record<string, Category>;
