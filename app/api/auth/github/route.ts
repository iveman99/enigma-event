import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_ID;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/callback/github`;

  if (!clientId) {
    return NextResponse.json(
      { error: "GitHub Client ID is not configured." },
      { status: 500 }
    );
  }

  const rootUrl = "https://github.com/login/oauth/authorize";
  const options = {
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
  };

  const qs = new URLSearchParams(options);
  return NextResponse.redirect(`${rootUrl}?${qs.toString()}`);
}
