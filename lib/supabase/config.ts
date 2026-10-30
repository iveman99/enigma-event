export class AuthConfigurationError extends Error {}

export function isAuthConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new AuthConfigurationError("Supabase is not configured.");
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(parsed.hostname)) {
    throw new AuthConfigurationError("Supabase must use HTTPS.");
  }
  return { url, key };
}

export function getAppOrigin() {
  const value = process.env.APP_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "");
  if (!value) throw new AuthConfigurationError("APP_URL is not configured.");
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(parsed.hostname)) {
    throw new AuthConfigurationError("APP_URL must use HTTPS.");
  }
  return parsed.origin;
}
