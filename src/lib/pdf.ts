import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import sharp from 'sharp';

export async function convertPdfToImages(pdfPath: string, imagePath: string) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data }).promise;

  if (doc.numPages === 0) {
    throw new Error('No pages found in the PDF document.');
  }

  // TODO: Stitch multiple pages into a single image if needed
  if (doc.numPages > 1) {
    console.warn(
      `Warning: The ${pdfPath} PDF document has ${doc.numPages} pages, but only the first page will be converted to an image.`
    );
  }

  const page = await doc.getPage(1);
  const scale = 4.0;
  const viewport = page.getViewport({ scale });

  const canvasFactory = doc.canvasFactory as any;
  const { canvas, context } = canvasFactory.create(viewport.width, viewport.height);

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: context, viewport }).promise;

  // Convert canvas to PNG buffer
  const buffer = canvas.toBuffer('image/png');

  const trimThreshold = 5;

  // Process image with Sharp: auto-trim white margins
  const trimmedBuffer = await sharp(buffer).trim({ threshold: trimThreshold }).png().toBuffer();

  // Get image metadata to calculate bottom crop area
  const metadata = await sharp(trimmedBuffer).metadata();
  const { width, height } = metadata;

  // Remove bottom pixels to eliminate page numbers
  const cropHeight = height! - 100;

  const croppedBuffer = await sharp(trimmedBuffer)
    .extract({ left: 0, top: 0, width: width!, height: cropHeight })
    .png()
    .toBuffer();

  // Delete existing file to ensure override
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  // Second trim after removing page number area
  await sharp(croppedBuffer).trim({ threshold: trimThreshold }).png().toFile(imagePath);
}
