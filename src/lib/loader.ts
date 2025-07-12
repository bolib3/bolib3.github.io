import type { Category, Dataset, Problem } from '@/types';
import * as fs from 'fs';
import { basename } from 'path';
import z from 'zod';

export const BOLIB_PATH = './bolib3/bolib3';

const problemMetadataValidator = z.object({
  name: z.string(),
  category: z.string(),
  subcategory: z.string().optional(),
  added: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  published: z.boolean().optional().default(false),
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
  datasets: z.array(z.string()),
  solution: z.object({
    optimality: z.string(),
    x: z.array(z.number()),
    y: z.array(z.number()),
    F: z.number(),
    G: z.array(z.number()).optional(),
    H: z.array(z.number()).optional(),
    f: z.number(),
    g: z.array(z.number()).optional(),
    h: z.array(z.number()).optional(),
  }),
});

export function loadDatasets(): Dataset[] {
  const datasetPaths = fs.globSync(BOLIB_PATH + '/data/*.{csv,json}');

  return datasetPaths.map((path) => ({
    name: basename(path),
    size: fs.statSync(path).size,
  }));
}

export function loadProblems(categories: Record<string, Category>, datasets: Dataset[]): Problem[] {
  const problemMetadataPaths = fs.globSync(`${BOLIB_PATH}/json/*.json`);

  console.log(`Found metadata for ${problemMetadataPaths.length} problems in bolib3.`);

  const pythonProblems = fs.globSync(`${BOLIB_PATH}/python/*.py`).map((p) => basename(p, '.py'));
  const gamsProblems = fs.globSync(`${BOLIB_PATH}/gams/*.gms`).map((p) => basename(p, '.gms'));
  const matlabProblems = fs.globSync(`${BOLIB_PATH}/matlab/*.m`).map((p) => basename(p, '.m'));
  const latexProblems = fs.globSync(`${BOLIB_PATH}/latex/*.tex`).map((p) => basename(p, '.tex'));
  const problemPdfs = fs.globSync(`${BOLIB_PATH}/pdf/*.pdf`).map((p) => basename(p, '.pdf'));

  const foundProblems = {
    python: pythonProblems,
    gams: gamsProblems,
    matlab: matlabProblems,
    latex: latexProblems,
    pdf: problemPdfs,
  };

  const problems: Problem[] = [];

  for (const metadataPath of problemMetadataPaths) {
    const rawMetadata = fs.readFileSync(metadataPath, 'utf-8');
    const parseResult = problemMetadataValidator.safeParse(JSON.parse(rawMetadata));

    if (!parseResult.success) {
      throw new Error(`Invalid problem metadata in ${metadataPath}: ${parseResult.error.message}`);
    }

    const metadata = parseResult.data;
    const name = metadata.name;

    if (!metadata.published) {
      console.info(`Problem ${name} is not published, skipping.`);
      continue;
    }

    for (const [type, problems] of Object.entries(foundProblems)) {
      if (!problems.includes(name)) {
        throw new Error(`Problem ${name} not found in ${type} files.`);
      }
    }

    const problemsDatasets = metadata.datasets?.map((datasetName) => {
      const dataset = datasets.find((d) => d.name === datasetName);

      if (!dataset) {
        throw new Error(`Dataset ${datasetName} not found for problem ${name}`);
      }

      return dataset;
    });

    problems.push({
      name: metadata.name,
      category: categories[metadata.category] ?? categories.miscellaneous!,
      subcategory: metadata.subcategory ?? null,
      added: metadata.added,
      dimension: metadata.dimension,
      datasets: problemsDatasets,
      solution: metadata.solution,
    });
  }

  return problems;
}
