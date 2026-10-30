import { verifyOtpSchema } from "@/lib/auth/validation";
import { authJson, authRoute, AuthHttpError, readAuthBody } from "@/lib/auth/http";
import { limitAuthAttempt } from "@/lib/auth/rate-limit";
import { readProfile } from "@/lib/auth/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  return authRoute(async () => {
    const { email, token } = await readAuthBody(request, verifyOtpSchema);
    await limitAuthAttempt(request, email, "verify");
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (error || !data.user?.email_confirmed_at) {
      throw new AuthHttpError(400, "That code is incorrect or has expired. Please try again or request a new code.", "invalid_otp");
    }
    return authJson({ success: true, user: await readProfile(supabase, data.user) });
  });
}
