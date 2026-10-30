import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ rpc: mocks.rpc }) }));
import { limitAuthAttempt } from "@/lib/auth/rate-limit";

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "test-public");
  vi.stubEnv("SUPABASE_SECRET_KEY", "test-server-secret");
  vi.stubEnv("VERCEL", "1");
  mocks.rpc.mockResolvedValue({ data: true, error: null });
});
const request = () => new Request("https://www.enigmaudcs.in/api/auth/otp/request", { headers: { "x-vercel-forwarded-for": "192.0.2.123" } });

describe("persistent OTP limits", () => {
  it("sends hashed identities, not raw emails or IPs, to the database", async () => {
    await limitAuthAttempt(request(), "student@example.com", "send");
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
    const parameters = JSON.stringify(mocks.rpc.mock.calls);
    expect(parameters).not.toContain("student@example.com");
    expect(parameters).not.toContain("192.0.2.123");
    expect(parameters).not.toContain("test-server-secret");
    expect(mocks.rpc.mock.calls[0][1].p_key).toMatch(/^send:[a-f0-9]{64}$/);
  });
  it("fails closed when the shared rate store is unavailable", async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { message: "internal database error" } });
    await expect(limitAuthAttempt(request(), "student@example.com", "send")).rejects.toMatchObject({ status: 503 });
  });
  it("blocks requests when the email or IP quota is exhausted", async () => {
    mocks.rpc.mockResolvedValueOnce({ data: true, error: null }).mockResolvedValueOnce({ data: false, error: null });
    await expect(limitAuthAttempt(request(), "student@example.com", "verify")).rejects.toMatchObject({ status: 429 });
  });
  it("does not silently bypass limits when the server key is missing", async () => {
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    await expect(limitAuthAttempt(request(), "student@example.com", "send")).rejects.toThrow("not configured");
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});
