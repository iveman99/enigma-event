import { authJson, authRoute } from "@/lib/auth/http";
import { paymentSettings } from "@/lib/registration-server";
export async function GET() { return authRoute(async () => authJson({ success: true, settings: await paymentSettings() })); }
