import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { MAX_STORED_IMAGE, prepareDocumentImage } from "@/lib/document-image";
describe("private document image handling", () => {
  it("rejects HTML, SVG and broken image payloads despite file names or MIME labels", async () => {
    for (const value of ["<html>receipt.jpg</html>", '<svg width="10" height="10"><rect width="10" height="10" /></svg>', "invalid PNG"]) await expect(prepareDocumentImage(Buffer.from(value))).rejects.toThrow();
  });
  it("resizes, strips metadata and stores an actual bounded JPEG", async () => {
    const input = await sharp({ create: { width: 2400, height: 1200, channels: 3, background: "#ffffff" } }).jpeg().withMetadata({ exif: { IFD0: { Artist: "Private metadata" } } }).toBuffer();
    const output = await prepareDocumentImage(input);
    const meta = await sharp(output).metadata();
    expect(meta.format).toBe("jpeg"); expect(meta.width).toBe(1600); expect(meta.height).toBe(800);
    expect(meta.exif).toBeUndefined(); expect(output.byteLength).toBeLessThanOrEqual(MAX_STORED_IMAGE);
  });
});
