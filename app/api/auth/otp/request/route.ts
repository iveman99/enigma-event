import { requestOtpSchema } from "@/lib/auth/validation";
import { authJson, authRoute, AuthHttpError, readAuthBody } from "@/lib/auth/http";
import { limitAuthAttempt } from "@/lib/auth/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  return authRoute(async () => {
    const input = await readAuthBody(request, requestOtpSchema);
    await limitAuthAttempt(request, input.email, "send");
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: input.email,
      options: {
        shouldCreateUser: input.mode === "signup",
        ...(input.mode === "signup" ? { data: { first_name: input.firstName, last_name: input.lastName, phone: input.phone } } : {}),
      },
    });
    if (error?.status === 429 || error?.code === "over_email_send_rate_limit") {
      throw new AuthHttpError(429, "Please wait before requesting another code.", "rate_limited");
    }
    // Do not disclose whether an address has an account.
    if (error && error.code !== "otp_disabled" && error.code !== "user_not_found") {
      throw new AuthHttpError(503, "We couldn't send a code. Please try again shortly or use Google or GitHub.", "email_unavailable");
    }
    return authJson({ success: true, message: "If this email is eligible, a verification code is on its way.", retryAfter: 60 });
  });
}
