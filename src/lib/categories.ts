import type { Category } from '@/types';

export const categories = {
  transportation: {
    name: 'Transportation',
    colour: 'oklch(88.5% 0.062 18.334)',
  },
  synth: {
    name: 'Synthetic',
    colour: 'oklch(95.1% 0.026 236.824)',
  },
  svm: {
    name: 'Machine Learning / Support Vector Machine',
    colour: 'oklch(95% 0.052 163.051)',
  },
  regression: {
    name: 'Machine Learning / Regression',
    colour: 'oklch(95.2% 0.037 318.852)',
  },
  textbook: {
    name: 'Textbook',
    colour: 'oklch(95.2% 0.037 318.852)',
  },
  miscellaneous: {
    name: 'Miscellaneous',
    colour: 'oklch(95.2% 0.037 318.852)',
  },
} satisfies Record<string, Category>;
