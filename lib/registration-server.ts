import "server-only";
import { createClient } from "@supabase/supabase-js";
import { AuthConfigurationError, getSupabaseConfig } from "./supabase/config";
import { AuthHttpError } from "./auth/http";
import { requireVerifiedSession } from "./auth/profile";
import type { PaymentSettings } from "./registration";

export const DOCUMENT_BUCKET = "enigma-documents";
export function serviceClient() {
  const { url } = getSupabaseConfig();
  if (!process.env.SUPABASE_SECRET_KEY) throw new AuthConfigurationError("Missing service key");
  return createClient(url, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}
export async function requireOrganiser() {
  const session = await requireVerifiedSession();
  const service = serviceClient();
  const { data, error } = await service.from("organisers").select("user_id").eq("user_id", session.user.id).maybeSingle();
  if (error) throw new AuthHttpError(503, "The organiser dashboard is being connected.");
  if (!data) throw new AuthHttpError(403, "This account does not have organiser access.");
  return { ...session, service };
}
export async function signedDocument(path: string) {
  const { data, error } = await serviceClient().storage.from(DOCUMENT_BUCKET).createSignedUrl(path, 120);
  if (error || !data) throw new AuthHttpError(503, "The image couldn't be opened. Please try again.");
  return data.signedUrl;
}
export async function paymentSettings(): Promise<PaymentSettings> {
  const { data, error } = await serviceClient().from("payment_settings").select("*").eq("id", true).single();
  if (error || !data) throw new AuthHttpError(503, "Event registrations are being connected. Please try again later.");
  return { enabled: data.enabled, payee: data.payee, upiId: data.upi_id, qrPath: data.qr_path, qrUrl: data.qr_path ? await signedDocument(data.qr_path) : null, events: data.open_events };
}
export async function limitUploads(userId: string) {
  const { data, error } = await serviceClient().rpc("consume_auth_rate_limit", { p_key: `upload:${userId}`, p_limit: 12, p_window_seconds: 86400 });
  if (error) throw new AuthHttpError(503, "Uploads are temporarily unavailable.");
  if (!data) throw new AuthHttpError(429, "Today's upload limit has been reached. Contact the organising team for help.");
}
