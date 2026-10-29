import { NextRequest, NextResponse } from "next/server";
import { hasPreviewAccess, PREVIEW_COOKIE } from "@/lib/previewAccess";

export function proxy(request: NextRequest) {
  if (hasPreviewAccess(request.cookies.get(PREVIEW_COOKIE)?.value)) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Preview password required" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/enigma-access", request.url));
}

export const config = {
  matcher: ["/enigma2/:path*", "/api/auth/:path*", "/api/registrations", "/api/backup"],
};
