import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ createServerClient: vi.fn(), set: vi.fn(), getAll: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));
vi.mock("next/headers", () => ({ cookies: async () => ({ set: mocks.set, getAll: mocks.getAll }) }));
import { createSupabaseServerClient } from "@/lib/supabase/server";

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "publishable-key");
});

describe("server-managed cookies", () => {
  it("keeps tokens HttpOnly, SameSite and Secure in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await createSupabaseServerClient();
    expect(mocks.createServerClient.mock.calls[0][2].cookieOptions).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  });
  it("writes every refreshed/chunked cookie to the response store", async () => {
    await createSupabaseServerClient();
    const options = mocks.createServerClient.mock.calls[0][2];
    options.cookies.setAll([{ name: "sb-token.0", value: "first", options: { httpOnly: true } }, { name: "sb-token.1", value: "second", options: { httpOnly: true } }]);
    expect(mocks.set).toHaveBeenCalledTimes(2);
  });
});
