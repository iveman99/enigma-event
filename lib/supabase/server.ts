import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

// All auth operations go through server routes. Tokens are never exposed to JS.
export async function createSupabaseServerClient() {
  const { url, key } = getSupabaseConfig();
  const store = await cookies();
  return createServerClient(url, key, {
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 },
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        values.forEach(({ name, value, options }) => store.set(name, value, options));
      },
    },
  });
}
