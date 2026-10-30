import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(), signInWithOtp: vi.fn(), verifyOtp: vi.fn(), signInWithOAuth: vi.fn(),
  exchangeCodeForSession: vi.fn(), from: vi.fn(), limitAuthAttempt: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: async () => ({
  auth: mocks, from: mocks.from,
}) }));
vi.mock("@/lib/auth/rate-limit", () => ({ limitAuthAttempt: mocks.limitAuthAttempt }));

import { requestOtpSchema, phoneSchema, profileSchema } from "@/lib/auth/validation";
import { AuthHttpError } from "@/lib/auth/http";
import { requireVerifiedSession, toStudentUser, type StudentProfile } from "@/lib/auth/profile";
import { POST as requestOtp } from "@/app/api/auth/otp/request/route";
import { POST as verifyOtp } from "@/app/api/auth/otp/verify/route";
import { POST as updateProfile } from "@/app/api/auth/onboarding/route";
import { GET as getSession } from "@/app/api/auth/session/route";
import { POST as google } from "@/app/api/auth/google/route";
import { GET as callback } from "@/app/api/auth/callback/route";
import { POST as register, GET as registrations } from "@/app/api/registrations/route";
import type { User } from "@supabase/supabase-js";

const input = { mode: "signup", firstName: "Asha", lastName: "Patil", email: "ASHA@example.com", phone: "9876543210" };
const user = { id: "user-1", email: "asha@example.com", email_confirmed_at: "2026-10-29", app_metadata: { provider: "email" }, user_metadata: {} } as User;
const profile: StudentProfile = { id: user.id, first_name: "Asha", last_name: "Patil", phone: "+919876543210", college: "", course: "", year: "", prn: "", created_at: "2026-10-29", updated_at: "2026-10-29" };
const request = (body: unknown, origin = "http://localhost:3000") => new Request("http://localhost:3000/api/auth", {
  method: "POST", headers: { origin, "Content-Type": "application/json" }, body: JSON.stringify(body),
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("APP_URL", "http://localhost:3000");
  vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "test-publishable-key");
  mocks.getUser.mockResolvedValue({ data: { user }, error: null });
  mocks.signInWithOtp.mockResolvedValue({ error: null });
  mocks.limitAuthAttempt.mockResolvedValue(undefined);
  const query = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: profile, error: null }), update: vi.fn().mockReturnThis() };
  mocks.from.mockReturnValue(query);
});

describe("signup validation", () => {
  it("normalizes email and Indian phone without inventing details", () => {
    expect(requestOtpSchema.parse(input)).toMatchObject({ email: "asha@example.com", phone: "+919876543210" });
  });
  it("rejects invalid phones, missing signup fields and malformed email", () => {
    expect(phoneSchema.safeParse("123").success).toBe(false);
    expect(requestOtpSchema.safeParse({ mode: "signup", email: "a@example.com" }).success).toBe(false);
    expect(requestOtpSchema.safeParse({ ...input, email: "bad" }).success).toBe(false);
  });
  it("does not accept identity or privilege fields in profile updates", () => {
    for (const extra of [{ id: "another-user" }, { email: "other@example.com" }, { role: "admin" }, { emailVerified: true }]) {
      expect(profileSchema.safeParse({ firstName: "Asha", lastName: "Patil", phone: input.phone, ...extra }).success).toBe(false);
    }
  });
});

describe("OTP endpoints", () => {
  it("sends signup metadata without creating a client-side authenticated account", async () => {
    const response = await requestOtp(request(input));
    expect(response.status).toBe(200);
    expect(mocks.signInWithOtp).toHaveBeenCalledWith({ email: "asha@example.com", options: { shouldCreateUser: true, data: { first_name: "Asha", last_name: "Patil", phone: "+919876543210" } } });
    expect(await response.json()).not.toHaveProperty("user");
    expect(response.headers.get("Cache-Control")).toContain("no-store");
  });
  it("does not create accounts for the sign-in action", async () => {
    await requestOtp(request({ mode: "signin", email: "asha@example.com" }));
    expect(mocks.signInWithOtp).toHaveBeenCalledWith({ email: "asha@example.com", options: { shouldCreateUser: false } });
  });
  it("rejects cross-site submissions before sending email", async () => {
    expect((await requestOtp(request(input, "https://attacker.example"))).status).toBe(403);
    expect(mocks.signInWithOtp).not.toHaveBeenCalled();
  });
  it("rejects malformed and oversized payloads", async () => {
    expect((await requestOtp(request({ ...input, firstName: "a".repeat(17000) }))).status).toBe(413);
    expect((await requestOtp(new Request("http://localhost:3000/api/auth", { method: "POST", headers: { origin: "http://localhost:3000", "Content-Type": "application/json" }, body: "{" }))).status).toBe(400);
    expect(mocks.signInWithOtp).not.toHaveBeenCalled();
  });
  it("enforces shared request limits before the provider call", async () => {
    mocks.limitAuthAttempt.mockRejectedValue(new AuthHttpError(429, "Too many attempts."));
    const response = await requestOtp(request(input));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
    expect(mocks.signInWithOtp).not.toHaveBeenCalled();
  });
  it("handles email-service outages without claiming a code was sent", async () => {
    mocks.signInWithOtp.mockResolvedValue({ error: { status: 500, message: "secret upstream details" } });
    const response = await requestOtp(request(input));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("secret upstream details");
  });
  it("rejects expired and replayed OTPs", async () => {
    mocks.verifyOtp.mockResolvedValue({ data: { user: null }, error: { code: "otp_expired" } });
    const response = await verifyOtp(request({ email: user.email, token: "123456" }));
    expect(response.status).toBe(400);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("returns only a verified provider identity and its database profile", async () => {
    mocks.verifyOtp.mockResolvedValue({ data: { user }, error: null });
    const response = await verifyOtp(request({ email: user.email, token: "123456" }));
    expect(response.status).toBe(200);
    expect((await response.json()).user).toMatchObject({ id: user.id, emailVerified: true, phoneVerified: false, isProfileComplete: true });
  });
  it("rejects a provider response without email confirmation", async () => {
    mocks.verifyOtp.mockResolvedValue({ data: { user: { ...user, email_confirmed_at: undefined } }, error: null });
    expect((await verifyOtp(request({ email: user.email, token: "123456" }))).status).toBe(400);
  });
});

describe("sessions and profile ownership", () => {
  it("never trusts a missing session", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(requireVerifiedSession()).rejects.toMatchObject({ status: 401 });
    expect((await getSession()).status).toBe(200);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("does not accept an email as a substitute for an authenticated session", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const response = await updateProfile(request({ firstName: "Asha", lastName: "Patil", phone: input.phone }));
    expect(response.status).toBe(401);
  });
  it("scopes updates to the provider's user ID", async () => {
    expect((await updateProfile(request({ firstName: "Asha", lastName: "Patil", phone: input.phone }))).status).toBe(200);
    expect(mocks.from().eq).toHaveBeenCalledWith("id", user.id);
  });
  it("ignores user metadata claims of administrator access", () => {
    const result = toStudentUser({ ...user, user_metadata: { role: "admin", email_verified: true, avatar_url: "https://example.com/photo.jpg", picture: "https://example.com/photo.jpg" } }, profile);
    expect(result).not.toHaveProperty("role");
    expect(result).not.toHaveProperty("avatar");
    expect(result).not.toHaveProperty("picture");
    expect(result.phoneVerified).toBe(false);
  });
  it("returns a safe setup state when no provider credentials exist", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    expect(await (await getSession()).json()).toMatchObject({ authenticated: false, configured: false });
    expect(mocks.getUser).not.toHaveBeenCalled();
  });
});

describe("OAuth and legacy access", () => {
  it("uses a fixed callback URL and managed PKCE flow", async () => {
    mocks.signInWithOAuth.mockResolvedValue({ data: { url: "https://example.supabase.co/auth/v1/authorize" }, error: null });
    expect((await google(request({}))).status).toBe(200);
    expect(mocks.signInWithOAuth).toHaveBeenCalledWith({ provider: "google", options: { redirectTo: "http://localhost:3000/api/auth/callback", skipBrowserRedirect: true } });
  });
  it("does not allow callback open redirects or cancelled sign-in", async () => {
    const response = await callback(new Request("http://localhost:3000/api/auth/callback?error=cancelled&next=https://attacker.example"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/enigma2?auth_error=oauth_failed");
    expect(mocks.exchangeCodeForSession).not.toHaveBeenCalled();
  });
  it("rejects invalid PKCE exchanges and accepts a verified session", async () => {
    mocks.exchangeCodeForSession.mockResolvedValueOnce({ data: {}, error: new Error("Invalid verifier") });
    expect((await callback(new Request("http://localhost:3000/api/auth/callback?code=bad"))).headers.get("location")).toContain("auth_error");
    mocks.exchangeCodeForSession.mockResolvedValueOnce({ data: { user }, error: null });
    expect((await callback(new Request("http://localhost:3000/api/auth/callback?code=valid"))).headers.get("location")).toContain("auth=success");
  });
  it("never exposes seeded registrations or issues fake confirmed passes", async () => {
    expect((await registrations()).status).toBe(503);
    expect((await register(request({}))).status).toBe(400);
  });
});
