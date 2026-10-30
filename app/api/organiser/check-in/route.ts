import { z } from "zod";
import { authJson, authRoute, AuthHttpError, readAuthBody } from "@/lib/auth/http";
import { parsePassCode } from "@/lib/festival-pass";
import { requireOrganiser } from "@/lib/registration-server";

const inputSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("preview"), code: z.string().trim().max(100) }).strict(),
  z.object({ action: z.literal("checkin"), code: z.string().trim().max(100) }).strict(),
  z.object({ action: z.literal("reverse"), code: z.string().trim().max(100), reason: z.string().trim().min(5).max(500) }).strict(),
]);
type Person = { email?: string };
type Registration = { event_id: string; event_title: string; team_name: string; participant: Person; members: Person[] };

async function eventList(service: ReturnType<typeof import("@/lib/registration-server").serviceClient>, email: string) {
  const { data, error } = await service.from("event_registrations")
    .select("event_id,event_title,team_name,participant,members").eq("status", "approved").limit(2000);
  if (error) throw new AuthHttpError(503, "Approved events couldn't be loaded.");
  return ((data || []) as Registration[]).filter(r => [r.participant, ...(r.members || [])]
    .some(p => p.email?.toLowerCase() === email))
    .map(r => ({ id: r.event_id, title: r.event_title, team: r.team_name }));
}

export async function GET() {
  return authRoute(async () => {
    const { service } = await requireOrganiser();
    const { data, error } = await service.from("festival_passes")
      .select("email,display_name,checked_in_at").order("display_name").limit(2000);
    if (error) throw new AuthHttpError(503, "The attendance desk is being connected.");
    const { data: registrations, error: registrationsError } = await service.from("event_registrations")
      .select("participant,members").eq("status", "approved").limit(2000);
    if (registrationsError) throw new AuthHttpError(503, "Approved events couldn't be loaded.");
    const activeEmails = new Set<string>();
    for (const r of (registrations || []) as Array<{ participant: Person; members: Person[] }>)
      for (const p of [r.participant, ...(r.members || [])]) if (p.email) activeEmails.add(p.email.toLowerCase());
    return authJson({ success: true, attendees: (data || []).filter(p => activeEmails.has(p.email)).map(p => ({ email: p.email, name: p.display_name, checkedInAt: p.checked_in_at })) });
  });
}

export async function POST(request: Request) {
  return authRoute(async () => {
    const input = await readAuthBody(request, inputSchema);
    const { user, service } = await requireOrganiser();
    const token = parsePassCode(input.code);
    if (!token) throw new AuthHttpError(400, "Enter or scan a valid Enigma pass code.");
    const { data: pass, error } = await service.from("festival_passes")
      .select("email,display_name,phone,checked_in_at").eq("token", token).maybeSingle();
    if (error) throw new AuthHttpError(503, "The pass couldn't be checked.");
    if (!pass) throw new AuthHttpError(404, "Pass not found.");
    const events = await eventList(service, pass.email);
    if (!events.length) throw new AuthHttpError(409, "This pass has no currently approved events.");
    if (input.action === "preview") return authJson({ success: true, person: { name: pass.display_name, email: pass.email, phone: pass.phone, checkedInAt: pass.checked_in_at, events } });
    if (input.action === "reverse") {
      const { error: reverseError } = await service.rpc("reverse_festival_check_in", { p_actor: user.id, p_token: token, p_reason: input.reason });
      if (reverseError) throw new AuthHttpError(409, "Arrival could not be reversed. Refresh and try again.");
      return authJson({ success: true, result: "reversed", person: { name: pass.display_name, email: pass.email, phone: pass.phone, checkedInAt: null, events } });
    }
    const { data: result, error: checkError } = await service.rpc("check_in_festival_pass", { p_actor: user.id, p_token: token });
    if (checkError) throw new AuthHttpError(409, "This pass cannot be checked in. Refresh and review its approval status.");
    return authJson({ success: true, result: result.result, person: { name: pass.display_name, email: pass.email, phone: pass.phone, checkedInAt: result.checkedInAt, events } });
  });
}
