import { z } from "zod";
import { authJson, authRoute, AuthHttpError, readAuthBody } from "@/lib/auth/http";
import { DOCUMENT_BUCKET, paymentSettings, requireOrganiser, signedDocument } from "@/lib/registration-server";

const actions = z.discriminatedUnion("action", [
  z.object({ action: z.literal("review"), id: z.uuid(), version: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), note: z.string().trim().max(1000) }).strict(),
  z.object({ action: z.literal("document"), id: z.uuid(), kind: z.enum(["id", "receipt"]) }).strict(),
  z.object({ action: z.literal("settings"), enabled: z.boolean(), payee: z.string().trim().max(120), upiId: z.string().trim().max(150), qrPath: z.string().max(200), events: z.array(z.enum(["compile-vibes", "blind-dates", "decode-hunt", "fifa-addicts"])).max(4) }).strict(),
  z.object({ action: z.literal("manage"), id: z.uuid(), version: z.number().int().positive(), operation: z.enum(["edit", "archive"]), teamName: z.string().trim().max(80), note: z.string().trim().min(5).max(1000) }).strict(),
]);
export async function GET() {
  return authRoute(async () => {
    const { service } = await requireOrganiser();
    const { data, error } = await service.from("event_registrations").select("*").order("created_at", { ascending: false }).limit(2000);
    const { data: activity, error: activityError } = await service.from("registration_audit").select("id,registration_id,actor_id,action,note,created_at").order("created_at", { ascending: false }).limit(100);
    if (error || activityError) throw new AuthHttpError(503, "The review queue couldn't be loaded.");
    const actorIds = [...new Set((activity || []).map(a => a.actor_id))];
    const { data: actors } = actorIds.length ? await service.from("profiles").select("id,first_name,last_name").in("id", actorIds) : { data: [] };
    const names = new Map((actors || []).map(a => [a.id, `${a.first_name} ${a.last_name}`.trim()]));
    const { data: profiles, error: profilesError } = await service.from("profiles").select("id,first_name,last_name,phone,college,course,created_at,updated_at").order("created_at", { ascending: false }).limit(2000);
    if (profilesError) throw new AuthHttpError(503, "The student directory couldn't be loaded.");
    const students = [];
    for (let page = 1; page <= 10; page++) {
      const { data: users, error: usersError } = await service.auth.admin.listUsers({ page, perPage: 200 });
      if (usersError) throw new AuthHttpError(503, "The sign-in directory couldn't be loaded.");
      students.push(...users.users.map(u => ({ id: u.id, email: u.email || "", emailVerified: !!u.email_confirmed_at, lastSignIn: u.last_sign_in_at || null, createdAt: u.created_at })));
      if (users.users.length < 200) break;
    }
    const profileById = new Map((profiles || []).map(p => [p.id, p]));
    return authJson({ success: true, registrations: data, activity: (activity || []).map(a => ({ ...a, actor_name: names.get(a.actor_id) || "Account" })), settings: await paymentSettings(), students: students.map(s => ({ ...s, profile: profileById.get(s.id) || null })) });
  });
}
export async function POST(request: Request) {
  return authRoute(async () => {
    const input = await readAuthBody(request, actions);
    const { user, service } = await requireOrganiser();
    if (input.action === "document") {
      const { data, error } = await service.from("event_registrations").select("id_card_path,receipt_path").eq("id", input.id).single();
      if (error || !data) throw new AuthHttpError(404, "Registration not found.");
      return authJson({ success: true, url: await signedDocument(input.kind === "id" ? data.id_card_path : data.receipt_path) });
    }
    if (input.action === "review") {
      const { error } = await service.rpc("review_event_registration", { p_actor: user.id, p_id: input.id, p_version: input.version, p_decision: input.decision, p_note: input.note });
      if (error) {
        if (error.message.includes("SELF_REVIEW")) throw new AuthHttpError(403, "Another organiser must review your own entry.");
        if (error.message.includes("REVIEW_CONFLICT")) throw new AuthHttpError(409, "Another organiser already changed this entry. Refresh the queue.");
        if (error.message.includes("INVALID_REVIEW")) throw new AuthHttpError(400, "Add a clear reason (at least 5 characters) when requesting a correction.");
        throw new AuthHttpError(503, "The decision couldn't be saved. Refresh before trying again.");
      }
      return authJson({ success: true });
    }
    if (input.action === "manage") {
      const { error } = await service.rpc("manage_event_registration", { p_actor: user.id, p_id: input.id, p_version: input.version, p_action: input.operation, p_team: input.teamName, p_note: input.note });
      if (error) {
        if (error.message.includes("SELF_REVIEW")) throw new AuthHttpError(403, "Another organiser must manage your own entry.");
        if (error.message.includes("REVIEW_CONFLICT")) throw new AuthHttpError(409, "This entry changed. Refresh before trying again.");
        if (error.message.includes("INVALID_MANAGEMENT")) throw new AuthHttpError(400, "Check the team name and provide a reason.");
        throw new AuthHttpError(503, "The change couldn't be saved.");
      }
      return authJson({ success: true });
    }
    if (input.enabled && (!input.payee || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(input.upiId) || !input.qrPath)) throw new AuthHttpError(400, "Add the payee, a valid UPI ID and the payment QR before opening registrations.");
    if (input.qrPath && !/^[a-f0-9-]{36}\/qr\/[a-f0-9-]{36}\.jpg$/.test(input.qrPath)) throw new AuthHttpError(400, "Upload the payment QR first.");
    if (input.qrPath) {
      const { data } = await service.storage.from(DOCUMENT_BUCKET).info(input.qrPath);
      if (!data) throw new AuthHttpError(400, "Payment QR not found. Upload it again.");
    }
    const { error } = await service.rpc("save_payment_settings", { p_actor: user.id, p_enabled: input.enabled, p_payee: input.payee, p_upi: input.upiId, p_qr: input.qrPath, p_events: input.events });
    if (error) throw new AuthHttpError(503, "Payment settings couldn't be saved.");
    return authJson({ success: true });
  });
}
