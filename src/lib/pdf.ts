import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';

export async function convertPdfToImages(pdfPath: string, imagePath: string) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data }).promise;

  if (doc.numPages === 0) {
    throw new Error('No pages found in the PDF document.');
  }

  if (doc.numPages > 1) {
    console.warn(
      `Warning: The ${pdfPath} PDF document has ${doc.numPages} pages, but only the first page will be converted to an image.`
    );
  }

  const page = await doc.getPage(1);

  const canvasFactory = doc.canvasFactory as any;
  const viewport = page.getViewport({ scale: 1.0 });
  const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
  const renderContext = {
    canvasContext: canvasAndContext.context,
    viewport,
  };

  const renderTask = page.render(renderContext);
  await renderTask.promise;
  const buffer = canvasAndContext.canvas.toBuffer('image/png');
  fs.writeFileSync(imagePath, buffer);
}
