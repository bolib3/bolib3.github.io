import type { Dataset, Problem } from '../types';
import type { AstroIntegration } from 'astro';
import { problems, datasets } from '../lib/data';
import fs from 'fs';
import { BOLIB_PATH } from '../lib/loader';

export default function publisherIntegration(): AstroIntegration {
  return {
    name: 'publisher',
    hooks: {
      'astro:build:setup': () => publish(),
      'astro:server:setup': () => publish(),
      // TODO: Consider setting up a watcher for changes in the source files for local development
    },
  };
}

function publish() {
  datasets.forEach(publishDataset);
  problems.forEach(publishProblem);
}

function publishDataset(dataset: Dataset) {
  fs.copyFileSync(`${BOLIB_PATH}/data/${dataset.name}`, `public/datasets/${dataset.name}`);
}

function publishProblem(problem: Problem) {
  fs.copyFileSync(
    `${BOLIB_PATH}/python/${problem.name}.py`,
    `public/problems/python/${problem.name}.py`
  );
  fs.copyFileSync(
    `${BOLIB_PATH}/gams/${problem.name}.gms`,
    `public/problems/gams/${problem.name}.gms`
  );
  fs.copyFileSync(
    `${BOLIB_PATH}/matlab/${problem.name}.m`,
    `public/problems/matlab/${problem.name}.m`
  );
  fs.copyFileSync(
    `${BOLIB_PATH}/latex/${problem.name}.tex`,
    `public/problems/latex/${problem.name}.tex`
  );
}
