import { createHash, timingSafeEqual } from "node:crypto";

export const PREVIEW_COOKIE = "enigma_preview_access";
const EXPECTED_HASH = "f4312aaeea636d96f043f2eeb4b84c73ddc77f86ec400cb3be31fa73d49ccb1d";

export function previewToken(password: string): string {
  return createHash("sha256").update(`enigma-preview:${password}`).digest("hex");
}

export function hasPreviewAccess(token?: string): boolean {
  if (!token) return false;
  const hash = createHash("sha256").update(token).digest();
  return timingSafeEqual(hash, Buffer.from(EXPECTED_HASH, "hex"));
}
