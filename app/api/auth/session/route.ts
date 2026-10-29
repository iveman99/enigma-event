import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({
      authenticated: Boolean(user),
      user: user || null,
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, user: null, error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
