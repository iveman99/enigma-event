import { startOAuth } from "@/lib/auth/oauth";
export function POST(request: Request) { return startOAuth(request, "google"); }
