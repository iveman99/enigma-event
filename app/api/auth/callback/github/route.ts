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

  const clientId = process.env.GITHUB_ID;
  const clientSecret = process.env.GITHUB_SECRET;
  const redirectUri = `${baseUrl}/api/auth/callback/github`;

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("GitHub token error:", tokenData);
      return NextResponse.redirect(`${baseUrl}/?auth_error=github_token_failed`);
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch User Profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Enigma-Event-App",
      },
    });

    const profile = await userRes.json();
    if (!userRes.ok || !profile.id) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=github_profile_failed`);
    }

    // 3. GitHub users might have private emails, fetch /user/emails
    let email = profile.email;
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "Enigma-Event-App",
        },
      });
      if (emailRes.ok) {
        const emails = await emailRes.json();
        const primary = emails.find((e: any) => e.primary && e.verified) || emails[0];
        if (primary) {
          email = primary.email;
        }
      }
    }

    if (!email) {
      email = `${profile.login}@users.noreply.github.com`;
    }

    // 4. Parse name
    const rawName = profile.name || profile.login || "Developer";
    const nameParts = rawName.trim().split(" ");
    const firstName = nameParts[0] || rawName;
    const lastName = nameParts.slice(1).join(" ") || "";

    const { user } = await upsertOAuthUser({
      provider: "github",
      providerId: String(profile.id),
      email,
      firstName,
      lastName,
      avatar: profile.avatar_url || "",
    });

    // 5. Save session cookie
    await setSessionCookie(user);

    // 6. Redirect based on profile completeness
    if (!user.isProfileComplete) {
      return NextResponse.redirect(`${baseUrl}/enigma2?auth=onboarding`);
    } else {
      return NextResponse.redirect(`${baseUrl}/enigma2?auth=success`);
    }
  } catch (err: any) {
    console.error("GitHub auth callback error:", err);
    return NextResponse.redirect(`${baseUrl}/enigma2?auth_error=server_error`);
  }
}
