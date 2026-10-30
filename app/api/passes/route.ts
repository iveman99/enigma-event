import { authJson, authRoute, AuthHttpError } from "@/lib/auth/http";
import { requireVerifiedSession } from "@/lib/auth/profile";
import { serviceClient } from "@/lib/registration-server";
import type { FestivalEvent, FestivalPass } from "@/lib/festival-pass";

type Person = { name?: string; email?: string; phone?: string };
type Registration = { user_id: string; event_id: string; event_title: string; team_name: string; participant: Person; members: Person[] };

export async function GET() {
  return authRoute(async () => {
    const { user } = await requireVerifiedSession();
    const ownEmail = user.email!.toLowerCase();
    const service = serviceClient();
    const { data, error } = await service.from("event_registrations")
      .select("user_id,event_id,event_title,team_name,participant,members")
      .eq("status", "approved").limit(2000);
    if (error) throw new AuthHttpError(503, "Your passes couldn't be loaded.");
    const visible = new Map<string, { person: Person; events: FestivalEvent[] }>();
    for (const r of (data || []) as Registration[]) {
      for (const person of [r.participant, ...(r.members || [])]) {
        const email = person.email?.toLowerCase();
        if (!email || (email !== ownEmail && r.user_id !== user.id)) continue;
        const entry = visible.get(email) || { person, events: [] };
        entry.events.push({ id: r.event_id, title: r.event_title, team: r.team_name });
        visible.set(email, entry);
      }
    }
    if (!visible.size) return authJson({ success: true, passes: [] });
    const { data: passRows, error: passError } = await service.from("festival_passes")
      .select("email,token,display_name,phone,checked_in_at").in("email", [...visible.keys()]);
    if (passError) throw new AuthHttpError(503, "Passes are being connected. Please try again shortly.");
    const passes: FestivalPass[] = (passRows || []).map(p => ({
      email: p.email, name: p.display_name, phone: p.phone, token: p.token,
      checkedInAt: p.checked_in_at, events: visible.get(p.email)?.events || [], isMine: p.email === ownEmail,
    })).sort((a,b) => Number(b.isMine) - Number(a.isMine) || a.name.localeCompare(b.name));
    return authJson({ success: true, passes });
  });
}
