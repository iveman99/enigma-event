import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig, isAuthConfigured } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  // The festival is public. The unfinished organiser terminal stays unavailable;
  // API handlers independently enforce verified sessions and ownership rules.
  if (request.nextUrl.pathname === "/enigma2/terminal" || request.nextUrl.pathname.startsWith("/enigma2/terminal/")) {
    return new NextResponse(null, { status: 404, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" } });
  }

  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  // Route handlers own auth writes; refresh only on page requests to avoid
  // racing the callback's one-time PKCE code or an in-progress OTP request.
  if (request.nextUrl.pathname.startsWith("/enigma2") && isAuthConfigured()) {
    try {
      const { url, key } = getSupabaseConfig();
      const supabase = createServerClient(url, key, {
        cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 },
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(values, headers) {
            values.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
            Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
            response.headers.set("Cache-Control", "private, no-store");
          },
        },
      });
      await supabase.auth.getUser();
    } catch {
      // A provider outage must not hide the festival page. Protected API routes
      // still validate the session and fail closed before accessing any data.
    }
  }
  return response;
}

export const config = {
  matcher: ["/enigma2/:path*", "/api/auth/:path*", "/api/registrations", "/api/backup"],
};
