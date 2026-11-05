import { prepareDocumentImage } from "@/lib/document-image";
import { randomUUID } from "node:crypto";
import { authJson, authRoute, assertSameOrigin, AuthHttpError } from "@/lib/auth/http";
import { requireVerifiedSession } from "@/lib/auth/profile";
import { DOCUMENT_BUCKET, limitUploads, requireOrganiser, serviceClient, signedDocument } from "@/lib/registration-server";

import { ownsUpload } from "@/lib/registration";

export const runtime = "nodejs";
export async function POST(request: Request) {
  return authRoute(async () => {
    assertSameOrigin(request);
    const { user } = await requireVerifiedSession();
    if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) throw new AuthHttpError(415, "Choose an image to upload.");
    if (Number(request.headers.get("content-length")) > 1200000) throw new AuthHttpError(413, "Choose an image smaller than 1 MB.");
    await limitUploads(user.id);
    const form = await request.formData();
    const kind = form.get("kind");
    const file = form.get("file");
    if (!["id", "receipt", "qr"].includes(String(kind)) || !(file instanceof File) || file.size < 50 || file.size > 1048576) throw new AuthHttpError(400, "Choose a JPG, PNG or WebP image up to 1 MB.");
    if (kind === "qr") await requireOrganiser();
    let image: Buffer;
    try {
      image = await prepareDocumentImage(Buffer.from(await file.arrayBuffer()));
    } catch { throw new AuthHttpError(400, "This image couldn't be read. Choose a clear JPG, PNG or WebP image under 1 MB."); }
    const service = serviceClient();
    const path = `${user.id}/${kind}/${randomUUID()}.jpg`;
    const { error } = await service.storage.from(DOCUMENT_BUCKET).upload(path, image, { contentType: "image/jpeg", upsert: false });
    if (error) throw new AuthHttpError(503, "The upload couldn't be saved. Please try again.");
    if (kind === "id") {
      const { error: updateError } = await service.from("profiles").update({ id_card_path: path }).eq("id", user.id);
      if (updateError) { await service.storage.from(DOCUMENT_BUCKET).remove([path]); throw new AuthHttpError(503, "Your ID card couldn't be linked to your profile."); }
    }
    return authJson({ success: true, path });
  });
}

// Only the signed-in owner can request a short-lived document preview.
export async function GET(request: Request) {
  return authRoute(async () => {
    const { user } = await requireVerifiedSession();
    const params = new URL(request.url).searchParams;
    const kind = params.get("kind");
    let path = params.get("path") || "";
    if (kind !== "id" && kind !== "receipt") throw new AuthHttpError(400, "Choose an ID card or payment screenshot.");
    if (kind === "id" && !path) {
      const { data, error } = await serviceClient().from("profiles").select("id_card_path").eq("id", user.id).single();
      if (error) throw new AuthHttpError(503, "Your ID card couldn't be loaded. Please try again.");
      path = data?.id_card_path || "";
    }
    if (!ownsUpload(path, user.id, kind)) throw new AuthHttpError(404, "This image is not available.");
    return authJson({ url: await signedDocument(path) });
  });
}
