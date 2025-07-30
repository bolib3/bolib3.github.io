import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import sharp, { type OverlayOptions } from 'sharp';

const scale = 4.0;
const trimThreshold = 50;
const pageSpacing = 100;
const pageBottomCrop = 100;

export async function convertPdfToImage(pdfPath: string, imagePath: string) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data }).promise;

  if (doc.numPages === 0) {
    throw new Error('No pages found in the PDF document.');
  }

  const pageBuffers: Buffer[] = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvasFactory = doc.canvasFactory as any;
    const { canvas, context } = canvasFactory.create(viewport.width, viewport.height);

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: context, viewport }).promise;

    const buffer = canvas.toBuffer('image/png');
    const trimmedBuffer = await sharp(buffer).trim({ threshold: trimThreshold }).png().toBuffer();

    const metadata = await sharp(trimmedBuffer).metadata();
    const { width, height } = metadata;
    const cropHeight = height! - pageBottomCrop;

    const croppedBuffer = await sharp(trimmedBuffer)
      .extract({ left: 0, top: 0, width: width!, height: cropHeight })
      .png()
      .toBuffer();

    const finalBuffer = await sharp(croppedBuffer)
      .trim({ threshold: trimThreshold })
      .png()
      .toBuffer();
    pageBuffers.push(finalBuffer);
  }

  let combinedImage = sharp(pageBuffers[0]);

  if (pageBuffers.length > 1) {
    const totalHeight =
      (await Promise.all(pageBuffers.map((buf) => sharp(buf).metadata()))).reduce(
        (sum, meta) => sum + meta.height!,
        0
      ) +
      (pageBuffers.length - 1) * pageSpacing;

    combinedImage = sharp({
      create: {
        width: (await sharp(pageBuffers[0]).metadata()).width!,
        height: totalHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    });

    combinedImage = await composeBuffers(pageBuffers);
  }

  const finalTrimmedBuffer = await combinedImage
    .trim({ threshold: trimThreshold })
    .png()
    .toBuffer();

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  await sharp(finalTrimmedBuffer).png().toFile(imagePath);
}

async function composeBuffers(pageBuffers: Buffer[]) {
  // Get dimensions of all pages
  const pageDimensions: { width: number; height: number }[] = [];
  for (const buffer of pageBuffers) {
    const metadata = await sharp(buffer).metadata();
    pageDimensions.push({ width: metadata.width!, height: metadata.height! });
  }

  // Calculate canvas dimensions
  const maxWidth = Math.max(...pageDimensions.map((p) => p.width));
  const totalHeight =
    pageDimensions.reduce((sum, p) => sum + p.height, 0) + (pageBuffers.length - 1) * pageSpacing;

  // Create canvas with max width
  const combinedImage = sharp({
    create: {
      width: maxWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  });

  // Compose images
  let currentTop = 0;
  const compositeInputs: OverlayOptions[] = [];
  for (let i = 0; i < pageBuffers.length; i++) {
    compositeInputs.push({
      input: pageBuffers[i],
      top: currentTop,
      left: 0,
    });
    currentTop += pageDimensions[i]!.height + pageSpacing;
  }

  return combinedImage.composite(compositeInputs);
}
