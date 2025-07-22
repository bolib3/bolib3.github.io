import type { Problem } from '../types';
import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import { problems, datasets, Dataset } from '../lib/data';
import fs from 'fs';
import { BOLIB_PATH } from '../lib/loader';
import { convertPdfToImage } from '../lib/pdf';

export default function publisherIntegration(): AstroIntegration {
  return {
    name: 'publisher',
    hooks: {
      'astro:build:setup': ({ logger }) => publish(logger),
      'astro:server:setup': ({ logger }) => publish(logger),
      // TODO: Consider setting up a watcher for changes in the source files for local development
    },
  };
}

async function publish(logger: AstroIntegrationLogger) {
  datasets.forEach(publishDataset);
  logger.info(`Published ${datasets.length} datasets.`);
  await Promise.all(problems.map(publishProblem));
  logger.info(`Published ${problems.length} problems.`);
}

function publishDataset(dataset: Dataset) {
  fs.cpSync(dataset.originalPath, `public/${dataset.publicPath}`, {
    recursive: true,
  });
}

async function publishProblem(problem: Problem) {
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
  fs.copyFileSync(
    `${BOLIB_PATH}/pdf/${problem.name}.pdf`,
    `public/problems/pdf/${problem.name}.pdf`
  );

  await convertPdfToImage(
    `${BOLIB_PATH}/pdf/${problem.name}.pdf`,
    `public/problems/png/${problem.name}.png`
  );
}
