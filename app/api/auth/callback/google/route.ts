import { NextRequest, NextResponse } from "next/server";
import { upsertOAuthUser } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=${encodeURIComponent(error || "No code provided")}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google token error:", tokenData);
      return NextResponse.redirect(`${baseUrl}/?auth_error=google_token_failed`);
    }

    // 2. Fetch User Profile
    const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userRes.json();
    if (!userRes.ok || !profile.email) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=google_profile_failed`);
    }

    // 3. Upsert user into database
    const firstName = profile.given_name || profile.name?.split(" ")[0] || "Student";
    const lastName = profile.family_name || profile.name?.split(" ").slice(1).join(" ") || "";

    const { user } = await upsertOAuthUser({
      provider: "google",
      providerId: profile.sub || profile.id,
      email: profile.email,
      firstName,
      lastName,
      avatar: profile.picture || "",
    });

    // 4. Save session cookie
    await setSessionCookie(user);

    // 5. Redirect based on profile completeness
    if (!user.isProfileComplete) {
      return NextResponse.redirect(`${baseUrl}/enigma2?auth=onboarding`);
    } else {
      return NextResponse.redirect(`${baseUrl}/enigma2?auth=success`);
    }
  } catch (err: any) {
    console.error("Google auth callback error:", err);
    return NextResponse.redirect(`${baseUrl}/enigma2?auth_error=server_error`);
  }
}
