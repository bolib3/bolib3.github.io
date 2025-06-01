import type { Category, Dataset, Problem } from '@/types';
import * as fs from 'fs';
import { basename } from 'path';
import z from 'zod';
import { intersect, union } from './utils';

export const BOLIB_PATH = '../bolib3/bolib3';

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const problemMetadataValidator = z.object({
  name: z.string(),
  category: z.string(),
  dimension: z.object({
    x: z.number(),
    y: z.number(),
    F: z.number(),
    G: z.number(),
    H: z.number(),
    f: z.number(),
    g: z.number(),
    h: z.number(),
  }),
  type: z.object({
    x: z.string(),
    y: z.string(),
    F: z.string(),
    G: z.string(),
    H: z.string(),
    f: z.string(),
    g: z.string(),
    h: z.string(),
  }),
  datasets: z.array(z.string()).optional(),
  solution: z.object({
    optimality: z.string(),
    x: z.array(z.number()),
    y: z.array(z.number()),
    F: z.number(),
    G: z.array(z.number()),
    H: z.array(z.number()),
    f: z.number(),
    g: z.array(z.number()),
    h: z.array(z.number()),
  }),
});

export function loadDatasets(): Dataset[] {
  const datasetPaths = fs.globSync(BOLIB_PATH + '/data/*.csv');

  return datasetPaths.map((path) => ({
    name: basename(path),
    size: fs.statSync(path).size,
  }));
}

export function loadProblems(categories: Record<string, Category>, datasets: Dataset[]): Problem[] {
  const pythonProblemPaths = fs.globSync(BOLIB_PATH + '/python/*.py');
  const gamsProblemPaths = fs.globSync(BOLIB_PATH + '/gams/*.gms');
  const matlabProblemPaths = fs.globSync(BOLIB_PATH + '/matlab/*.m');
  const latexProblemPaths = fs.globSync(BOLIB_PATH + '/latex/*.tex');
  const problemPdfPaths = fs.globSync(BOLIB_PATH + '/pdf/*.pdf');
  const problemMetadataPaths = fs.globSync(BOLIB_PATH + '/json/*.json');

  const pythonProblemNames = pythonProblemPaths.map((path) => basename(path, '.py'));
  const gamsProblemNames = gamsProblemPaths.map((path) => basename(path, '.gms'));
  const matlabProblemNames = matlabProblemPaths.map((path) => basename(path, '.m'));
  const latexProblemNames = latexProblemPaths.map((path) => basename(path, '.tex'));
  const problemPdfNames = problemPdfPaths.map((path) => basename(path, '.pdf'));
  const problemMetadataNames = problemMetadataPaths.map((path) => basename(path, '.json'));

  const commonProblemNames = intersect(
    pythonProblemNames,
    gamsProblemNames,
    matlabProblemNames,
    latexProblemNames,
    problemPdfNames,
    problemMetadataNames
  );

  const allProblemNames = union(
    pythonProblemNames,
    gamsProblemNames,
    matlabProblemNames,
    latexProblemNames,
    problemPdfNames,
    problemMetadataNames
  );

  if (commonProblemNames.length === allProblemNames.length) {
    console.log('All problem names are common across all formats.');
  } else {
    console.warn(
      'There are some problem names that are not common across all formats. Ignoring the following:\n',
      allProblemNames.filter((name) => !commonProblemNames.includes(name)).join(', ')
    );
  }

  return commonProblemNames.map((name): Problem => {
    const metadataPath = `${BOLIB_PATH}/json/${name}.json`;
    const rawMetadata = fs.readFileSync(metadataPath, 'utf-8');
    const parseResult = problemMetadataValidator.safeParse(JSON.parse(rawMetadata));

    if (!parseResult.success) {
      throw new Error(`Invalid metadata for problem ${name}: ${parseResult.error.message}`);
    }

    const metadata = parseResult.data;

    const problemsDatasets = metadata.datasets?.map((datasetName) => {
      const dataset = datasets.find((d) => d.name === datasetName);

      if (!dataset) {
        throw new Error(`Dataset ${datasetName} not found for problem ${name}`);
      }

      return dataset;
    });

    return {
      name: metadata.name,
      description: loremIpsum, // TODO: Set actual description or remove this field
      category: categories[metadata.category] ?? categories.miscellaneous!,
      upperLevelVariables: metadata.dimension.x,
      lowerLevelVariables: metadata.dimension.y,
      upperLevelConstraints: metadata.dimension.F,
      lowerLevelConstraints: metadata.dimension.G,
      datasets: problemsDatasets,
      // citation: undefined, // TODO: Set actual citation
      solution: metadata.solution,
    };
  });
}
