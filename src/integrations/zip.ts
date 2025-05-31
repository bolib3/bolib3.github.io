import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import { problems } from '../lib/data';
import { slugify } from '../lib/utils';
import { datasets } from '../lib/data';

interface SourceFile {
  path: string;
  name: string;
}

export default function zipIntegration(): AstroIntegration {
  return {
    name: 'zip-integration',
    hooks: {
      'astro:build:setup': async ({ logger }) => {
        await zipSample(logger);
      },
      'astro:server:setup': async ({ logger }) => {
        await zipSample(logger);
        // TODO: setupWatcher();
      },
      'astro:server:done': async () => {
        // TODO: closeWatcher();
      },
    },
  };
}

async function zipSample(logger: AstroIntegrationLogger) {
  const zipDirectory = 'public/collections';

  const zips: { files: SourceFile[]; name: string }[] = [
    {
      files: problems.map((problem) => ({
        path: 'public/sample/bilevel.py',
        name: slugify(problem.name) + '.py',
      })),
      name: 'python-collection.zip',
    },
    {
      files: problems.map((problem) => ({
        path: 'public/sample/bilevel.m',
        name: slugify(problem.name) + '.m',
      })),
      name: 'matlab-collection.zip',
    },
    {
      files: problems.map((problem) => ({
        path: 'public/sample/bilevel.gms',
        name: slugify(problem.name) + '.gms',
      })),
      name: 'gams-collection.gms.zip',
    },
    {
      files: problems.map((problem) => ({
        path: 'public/sample/bilevel.tex',
        name: slugify(problem.name) + '.tex',
      })),
      name: 'latex-collection.zip',
    },
    // Datasets
    {
      files: datasets.map((dataset) => ({
        path: 'public/sample/bilevel.csv',
        name: slugify(dataset.name),
      })),
      name: 'dataset-collection.zip',
    },
  ];

  for (const zip of zips) {
    const zipPath = path.join(zipDirectory, zip.name);
    await createZip(zip.files, zipPath);
    logger.info(`Zip created at ${zipPath}`);
  }
}

async function createZip(sourceFiles: SourceFile[], outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    for (const file of sourceFiles) {
      if (!fs.existsSync(file.path)) {
        throw new Error(`Missing file: ${file.path}`);
      }

      archive.file(file.path, { name: file.name });
    }

    archive.finalize();
  });
}
