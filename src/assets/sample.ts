import type { Problem } from '../types';

const placeholderCategory = {
  name: 'placeholder',
};

const placeholderCitation = {
  title: 'Example Citation',
  href: 'https://example.com',
};

export const problems: Problem[] = [
  {
    name: 'Transmission station',
    category: placeholderCategory,
    citation: placeholderCitation,
    upperLevelVariables: 10,
    lowerLevelVariables: 600,
    upperLevelConstraints: 0,
    lowerLevelConstraints: 10,
  },
  {
    name: 'Electric power markets',
    category: placeholderCategory,
    citation: placeholderCitation,
    upperLevelVariables: 5,
    lowerLevelVariables: 150,
    upperLevelConstraints: 5,
    lowerLevelConstraints: 10,
  },
  {
    name: 'weish26.dat-100',
    category: placeholderCategory,
    citation: placeholderCitation,
    upperLevelVariables: 700,
    lowerLevelVariables: 700,
    upperLevelConstraints: 15,
    lowerLevelConstraints: 94,
  },
  {
    name: 'BCPIns',
    category: placeholderCategory,
    citation: placeholderCitation,
    upperLevelVariables: 100,
    lowerLevelVariables: 1593,
    upperLevelConstraints: 0,
    lowerLevelConstraints: 512,
  },
  {
    name: 'normalClique',
    category: placeholderCategory,
    citation: placeholderCitation,
    upperLevelVariables: 2,
    lowerLevelVariables: 236,
    upperLevelConstraints: 10,
    lowerLevelConstraints: 236,
  },
  {
    name: 'Linear',
    category: placeholderCategory,
    citation: placeholderCitation,
    upperLevelVariables: '10-80000',
    lowerLevelVariables: '10-80000',
    upperLevelConstraints: '10-80000',
    lowerLevelConstraints: '10-80000',
  },
  {
    name: 'Linear regularised',
    category: placeholderCategory,
    citation: placeholderCitation,
    upperLevelVariables: '10-80000',
    lowerLevelVariables: '10-80000',
    upperLevelConstraints: '10-80000',
    lowerLevelConstraints: '10-80000',
  },
  {
    name: 'RBF kernel',
    category: placeholderCategory,
    citation: placeholderCitation,
    upperLevelVariables: '10-80000',
    lowerLevelVariables: '10-80000',
    upperLevelConstraints: '10-80000',
    lowerLevelConstraints: '10-80000',
  },
  {
    name: 'Polynomial kernel',
    category: placeholderCategory,
    citation: placeholderCitation,
    upperLevelVariables: '10-80000',
    lowerLevelVariables: '10-80000',
    upperLevelConstraints: '10-80000',
    lowerLevelConstraints: '10-80000',
  },
];
