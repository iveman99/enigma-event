import { authJson, authRoute, assertSameOrigin, AuthHttpError } from "@/lib/auth/http";
import { requireVerifiedSession } from "@/lib/auth/profile";

// Signup is live first. Never expose seeded JSON records or issue an approved
// ticket before the private-upload/payment-review workflow is connected.
export async function GET() {
  return authRoute(async () => {
    await requireVerifiedSession();
    return authJson({ success: true, count: 0, registrations: [], registrationAvailable: false });
  });
}

export async function POST(request: Request) {
  return authRoute(async () => {
    assertSameOrigin(request);
    await requireVerifiedSession();
    throw new AuthHttpError(503, "Event registration is being prepared. Your account is ready; please check back soon.", "registration_not_ready");
  });
}

export async function DELETE(request: Request) {
  return authRoute(async () => {
    assertSameOrigin(request);
    await requireVerifiedSession();
    throw new AuthHttpError(403, "Organiser access is required.", "forbidden");
  });
}
