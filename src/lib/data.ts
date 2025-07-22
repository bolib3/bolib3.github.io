import { categories } from './categories';
import { loadDatasets, loadProblems } from './loader';
import { basename } from 'path';
import fs from 'fs';
import { downloadFile } from './utils';

export class Dataset {
  readonly originalPath: string; // original path in bolib3
  readonly publicPath: string; // published path on the website
  readonly name: string;
  readonly size: number; // Size in bytes

  constructor(originalPath: string) {
    this.originalPath = originalPath;
    this.publicPath = '/datasets/' + originalPath.split('/data/')[1]!;
    this.name = basename(originalPath);
    this.size = fs.statSync(originalPath).size;
  }

  download(): void {
    downloadFile(this.publicPath, this.name);
  }
}

export const datasets = loadDatasets();

export const problems = loadProblems(categories, datasets);
