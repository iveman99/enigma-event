import "server-only";
import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { AuthConfigurationError, getSupabaseConfig } from "@/lib/supabase/config";
import { AuthHttpError } from "./http";

// Shared limits across Vercel instances; raw emails/IPs are never stored.
export async function limitAuthAttempt(request: Request, email: string, action: "send" | "verify") {
  const { url } = getSupabaseConfig();
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new AuthConfigurationError("SUPABASE_SECRET_KEY is not configured.");
  const ip = process.env.VERCEL === "1"
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    : "local";
  const client = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
  const rules = [
    { identity: `ip:${ip}`, limit: action === "send" ? 100 : 200, window: 600 },
    { identity: `email:${email}`, limit: action === "send" ? 3 : 5, window: action === "send" ? 900 : 600 },
  ];
  for (const rule of rules) {
    const key = `${action}:${createHmac("sha256", secret).update(rule.identity).digest("hex")}`;
    const { data, error } = await client.rpc("consume_auth_rate_limit", {
      p_key: key, p_limit: rule.limit, p_window_seconds: rule.window,
    });
    if (error) throw new AuthHttpError(503, "Verification is temporarily unavailable. Please try again shortly.");
    if (data !== true) throw new AuthHttpError(429, "Too many attempts. Please wait a few minutes before trying again.", "rate_limited");
  }
}
