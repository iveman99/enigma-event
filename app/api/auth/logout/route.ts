import { cookies } from "next/headers";
import { authJson, authRoute, assertSameOrigin, AuthHttpError } from "@/lib/auth/http";
import { isAuthConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  return authRoute(async () => {
    assertSameOrigin(request);
    if (isAuthConfigured()) {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error && error.status !== 401 && error.status !== 403) throw new AuthHttpError(503, "Couldn't sign out. Please try again.");
    }
    (await cookies()).delete("enigma_session");
    return authJson({ success: true });
  });
}
