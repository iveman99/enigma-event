import { authJson, authRoute, AuthHttpError } from "@/lib/auth/http";
import { readProfile, requireVerifiedSession } from "@/lib/auth/profile";
import { isAuthConfigured } from "@/lib/supabase/config";

export async function GET() {
  return authRoute(async () => {
    if (!isAuthConfigured()) return authJson({ authenticated: false, configured: false, user: null });
    try {
      const { supabase, user } = await requireVerifiedSession();
      return authJson({ authenticated: true, configured: true, user: await readProfile(supabase, user) });
    } catch (error) {
      if (error instanceof AuthHttpError && error.status === 401) return authJson({ authenticated: false, configured: true, user: null });
      throw error;
    }
  });
}
