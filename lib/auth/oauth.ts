import "server-only";
import { authJson, authRoute, assertSameOrigin, AuthHttpError } from "./http";
import { getAppOrigin } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export function startOAuth(request: Request, provider: "google" | "github") {
  return authRoute(async () => {
    assertSameOrigin(request);
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${getAppOrigin()}/api/auth/callback`, skipBrowserRedirect: true },
    });
    if (error || !data.url) throw new AuthHttpError(503, `Couldn't connect to ${provider === "google" ? "Google" : "GitHub"}. Please try again or use email.`);
    return authJson({ success: true, url: data.url });
  });
}
