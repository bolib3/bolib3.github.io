import type { Problem } from '../types';

const placeholderCategory = {
  name: 'placeholder',
};

export const problems: Problem[] = [
  {
    name: 'Transmission station',
    category: placeholderCategory,
    upperLevelVariables: 10,
    lowerLevelVariables: 600,
    upperLevelConstraints: 0,
    lowerLevelConstraints: 10,
    citation: {
      authors: 'Ajay et al.',
      year: 2004,
      link: 'https://example.com',
    },
  },
  {
    name: 'Electric power markets',
    category: placeholderCategory,
    upperLevelVariables: 5,
    lowerLevelVariables: 150,
    upperLevelConstraints: 5,
    lowerLevelConstraints: 10,
    citation: {
      authors: 'Gabriel',
      year: 2010,
      link: 'https://example.com',
    },
  },
  {
    name: 'weish26.dat-100',
    category: placeholderCategory,
    upperLevelVariables: 700,
    lowerLevelVariables: 700,
    upperLevelConstraints: 15,
    lowerLevelConstraints: 94,
  },
  {
    name: 'BCPIns',
    category: placeholderCategory,
    upperLevelVariables: 100,
    lowerLevelVariables: 1593,
    upperLevelConstraints: 0,
    lowerLevelConstraints: 512,
  },
  {
    name: 'normalClique',
    category: placeholderCategory,
    upperLevelVariables: 2,
    lowerLevelVariables: 236,
    upperLevelConstraints: 10,
    lowerLevelConstraints: 236,
  },
  {
    name: 'Linear',
    category: placeholderCategory,
    upperLevelVariables: '10-80000',
    lowerLevelVariables: '10-80000',
    upperLevelConstraints: '10-80000',
    lowerLevelConstraints: '10-80000',
    citation: {
      authors: 'Moore.',
      year: 2007,
      link: 'https://example.com',
    },
  },
  {
    name: 'Linear regularised',
    category: placeholderCategory,
    upperLevelVariables: '10-80000',
    lowerLevelVariables: '10-80000',
    upperLevelConstraints: '10-80000',
    lowerLevelConstraints: '10-80000',
    citation: {
      authors: 'Moore.',
      year: 2007,
      link: 'https://example.com',
    },
  },
  {
    name: 'RBF kernel',
    category: placeholderCategory,
    upperLevelVariables: '10-80000',
    lowerLevelVariables: '10-80000',
    upperLevelConstraints: '10-80000',
    lowerLevelConstraints: '10-80000',
    citation: {
      authors: 'Coniglio et al.',
      year: 2022,
      link: 'https://example.com',
    },
  },
  {
    name: 'Polynomial kernel',
    category: placeholderCategory,
    upperLevelVariables: '10-80000',
    lowerLevelVariables: '10-80000',
    upperLevelConstraints: '10-80000',
    lowerLevelConstraints: '10-80000',
    citation: {
      authors: 'Kunapuli et al.',
      year: 2020,
      link: 'https://example.com',
    },
  },
];
