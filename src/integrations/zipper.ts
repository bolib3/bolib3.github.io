import fs from 'fs';
import archiver from 'archiver';
import type { AstroIntegration, AstroIntegrationLogger } from 'astro';

export default function integration(): AstroIntegration {
  return {
    name: 'zipper',
    hooks: {
      'astro:build:done': async ({ logger }) => await zip(logger),
      'astro:server:setup': async ({ logger }) => await zip(logger),
      // TODO: Consider setting up a watcher for changes in the source files for local development
    },
  };
}

async function zip(logger: AstroIntegrationLogger) {
  createZip('public/problems/python', 'public/collections/python-collection.zip', logger);
  createZip('public/problems/matlab', 'public/collections/matlab-collection.zip', logger);
  createZip('public/problems/gams', 'public/collections/gams-collection.zip', logger);
  createZip('public/problems/latex', 'public/collections/latex-collection.zip', logger);
  createZip('public/datasets', 'public/collections/dataset-collection.zip', logger);
}

async function createZip(
  sourceDirectory: string,
  outputPath: string,
  logger: AstroIntegrationLogger
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(sourceDirectory, false);
    archive.finalize();
    logger.info(`Zip created at ${outputPath}`);
  });
}
