import sharp from "sharp";

// Keep 400 students × (one ID + four event receipts) below ~625 MiB before
// replacement/abandoned uploads. Never accept SVG/HTML or trust the MIME label.
export const MAX_STORED_IMAGE = 320 * 1024;
export async function prepareDocumentImage(buffer: Buffer) {
  const source = sharp(buffer, { limitInputPixels: 20000000, animated: false });
  const metadata = await source.metadata();
  if (!["jpeg", "png", "webp"].includes(metadata.format || "")) throw new Error("Unsupported image");
  for (const quality of [85, 75, 65]) {
    const output = await sharp(buffer, { limitInputPixels: 20000000, animated: false }).rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#fff" }).jpeg({ quality }).toBuffer();
    if (output.byteLength <= MAX_STORED_IMAGE) return output;
  }
  throw new Error("Choose a clearer cropped image with less background");
}
