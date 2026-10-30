import { authJson, authRoute, AuthHttpError, readAuthBody } from "@/lib/auth/http";
import { requireVerifiedSession } from "@/lib/auth/profile";
import { registrationSchema, ownsUpload } from "@/lib/registration";
import { DOCUMENT_BUCKET, serviceClient } from "@/lib/registration-server";

// Each request reads only the verified account’s own entries.
export async function GET() {
  return authRoute(async () => {
    const { user } = await requireVerifiedSession();
    const { data, error } = await serviceClient().from("event_registrations").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw new AuthHttpError(503, "Event registrations are being connected. Please try again later.");
    const registrations = (data || []).map(record => { const safe = { ...record }; delete safe.reviewed_by; return safe; });
    return authJson({ success: true, registrations });
  });
}

export async function POST(request: Request) {
  return authRoute(async () => {
    const input = await readAuthBody(request, registrationSchema);
    const { user } = await requireVerifiedSession();
    if (input.members.some(m => m.email === user.email?.toLowerCase())) throw new AuthHttpError(400, "You are already included as the team leader. Add only your teammates.");
    if (!ownsUpload(input.receiptPath, user.id, "receipt")) throw new AuthHttpError(400, "Please upload your own payment screenshot.");
    const service = serviceClient();
    const { data: receipt } = await service.storage.from(DOCUMENT_BUCKET).info(input.receiptPath);
    if (!receipt) throw new AuthHttpError(400, "Your screenshot wasn't found. Please upload it again.");
    const { data, error } = await service.rpc("submit_event_registration", { p_actor: user.id, p_event: input.eventId, p_team: input.teamName, p_members: input.members, p_receipt: input.receiptPath, p_reference: input.transactionReference });
    if (error) {
      if (error.message.includes("PROFILE_INCOMPLETE")) throw new AuthHttpError(400, "Complete your profile, college, course and ID card before registering.");
      if (error.message.includes("REGISTRATIONS_CLOSED")) throw new AuthHttpError(409, "Registration for this event is currently closed.");
      if (error.message.includes("ALREADY_REGISTERED")) throw new AuthHttpError(409, "You have already submitted this event. Check My registrations for its status.");
      if (error.code === "23505") throw new AuthHttpError(409, "This payment reference or receipt has already been used. Each entry needs its own payment.");
      throw new AuthHttpError(503, "Your registration couldn't be saved. Please try again. Don't make another payment.");
    }
    return authJson({ success: true, registration: data });
  });
}

export async function DELETE() { return authJson({ success: false, error: "Registrations cannot be deleted here." }, 403); }
