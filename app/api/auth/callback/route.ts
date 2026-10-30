import { NextResponse } from "next/server";
import { getAppOrigin } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authRoute } from "@/lib/auth/http";

export async function GET(request: Request) {
  return authRoute(async () => {
    // Never accept caller-controlled redirect destinations or Host headers.
    const target = new URL("/enigma2", getAppOrigin());
    const params = new URL(request.url).searchParams;
    try {
      const code = params.get("code");
      if (!code || params.has("error")) throw new Error("OAuth was cancelled.");
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error || !data.user?.email_confirmed_at) throw new Error("Invalid OAuth session.");
      target.searchParams.set("auth", "success");
    } catch {
      target.searchParams.set("auth_error", "oauth_failed");
    }
    const response = NextResponse.redirect(target);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  });
}
