import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ getUser: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: () => ({ auth: mocks }) }));
import { proxy } from "@/proxy";

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("SUPABASE_URL", "");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "");
});

describe("public festival access", () => {
  it("allows an anonymous visitor without a preview cookie", async () => {
    const response = await proxy(new NextRequest("https://www.enigmaudcs.in/enigma2"));
    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.has("location")).toBe(false);
  });
  it("lets auth requests reach their independent route checks", async () => {
    const response = await proxy(new NextRequest("https://www.enigmaudcs.in/api/auth/session"));
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
  it("does not expose the unfinished organiser terminal", async () => {
    for (const path of ["/enigma2/terminal", "/enigma2/terminal/export"]) {
      const response = await proxy(new NextRequest("https://www.enigmaudcs.in" + path));
      expect(response.status).toBe(404);
      expect(response.headers.get("x-robots-tag")).toBe("noindex");
    }
  });
  it("keeps the festival visible during a provider outage", async () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "test-key");
    mocks.getUser.mockRejectedValue(new Error("Provider unavailable"));
    const response = await proxy(new NextRequest("https://www.enigmaudcs.in/enigma2"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
});
