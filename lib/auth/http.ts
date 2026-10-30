import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthConfigurationError, getAppOrigin } from "@/lib/supabase/config";

export class AuthHttpError extends Error {
  constructor(public status: number, message: string, public code = "auth_error") { super(message); }
}

export function authJson(body: unknown, status = 200, headers?: HeadersInit) {
  const response = NextResponse.json(body, { status, headers });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Vary", "Cookie");
  return response;
}

export function assertSameOrigin(request: Request) {
  if (request.headers.get("origin") !== getAppOrigin()) {
    throw new AuthHttpError(403, "Please submit this form from the Enigma website.", "invalid_origin");
  }
}

export async function readAuthBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  assertSameOrigin(request);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new AuthHttpError(415, "Please send a JSON request.");
  }
  if (Number(request.headers.get("content-length")) > 16384) throw new AuthHttpError(413, "Request is too large.");
  const text = await request.text();
  if (Buffer.byteLength(text) > 16384) throw new AuthHttpError(413, "Request is too large.");
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new AuthHttpError(400, "Invalid request."); }
  return schema.parse(value);
}

export async function authRoute(action: () => Promise<NextResponse>) {
  try { return await action(); } catch (error) {
    if (error instanceof z.ZodError) return authJson({ success: false, error: error.issues[0]?.message || "Please check the form." }, 400);
    if (error instanceof AuthConfigurationError) return authJson({ success: false, error: "Sign-in is being connected. Please try again shortly.", code: "auth_not_configured" }, 503);
    if (error instanceof AuthHttpError) return authJson({ success: false, error: error.message, code: error.code }, error.status, error.status === 429 ? { "Retry-After": "600" } : undefined);
    // Do not return upstream errors, tokens, database details or personal information.
    return authJson({ success: false, error: "We couldn't complete that request. Please try again.", code: "service_unavailable" }, 503);
  }
}
