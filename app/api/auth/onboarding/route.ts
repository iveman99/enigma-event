import { profileSchema } from "@/lib/auth/validation";
import { authJson, authRoute, AuthHttpError, readAuthBody } from "@/lib/auth/http";
import { readProfile, requireVerifiedSession } from "@/lib/auth/profile";

export async function POST(request: Request) {
  return authRoute(async () => {
    const input = await readAuthBody(request, profileSchema);
    const { supabase, user } = await requireVerifiedSession();
    const { error } = await supabase.from("profiles").update({
      first_name: input.firstName, last_name: input.lastName, phone: input.phone,
      ...(input.college !== undefined ? { college: input.college } : {}),
      ...(input.course !== undefined ? { course: input.course } : {}),
      ...(input.year !== undefined ? { year: input.year } : {}),
      ...(input.prn !== undefined ? { prn: input.prn } : {}),
    }).eq("id", user.id);
    if (error) throw new AuthHttpError(503, "Your profile couldn't be saved. Please try again.");
    return authJson({ success: true, user: await readProfile(supabase, user) });
  });
}
