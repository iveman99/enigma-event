import "server-only";
import { AuthHttpError } from "@/lib/auth/http";
import { readProfile, requireVerifiedSession } from "@/lib/auth/profile";

// Locally signed cookies and the email-based identity fallback are retired.
export async function getCurrentUser() {
  try {
    const { supabase, user } = await requireVerifiedSession();
    return await readProfile(supabase, user);
  } catch (error) {
    if (error instanceof AuthHttpError && error.status === 401) return null;
    throw error;
  }
}
