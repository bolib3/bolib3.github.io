import { categories } from './categories';
import { loadDatasets, loadProblems } from './loader';

export const datasets = loadDatasets();

export const problems = loadProblems(categories, datasets);
