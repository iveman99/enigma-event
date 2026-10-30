import { authJson, authRoute, AuthHttpError } from "@/lib/auth/http";
import { requireOrganiser } from "@/lib/registration-server";

export async function GET() {
  return authRoute(async () => {
    try {
      await requireOrganiser();
      return authJson({ allowed: true });
    } catch (error) {
      if (error instanceof AuthHttpError && (error.status === 401 || error.status === 403)) return authJson({ allowed: false });
      throw error;
    }
  });
}
