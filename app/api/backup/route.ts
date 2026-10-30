import { authJson } from "@/lib/auth/http";

// Local-file snapshots contain private records and are not a production backup.
// Replaced by the authenticated organiser workflow in the registration phase.
export async function GET() {
  return authJson({ success: false, error: "Organiser backups are not available.", code: "not_available" }, 403);
}
export const POST = GET;
