import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, setSessionCookie } from "@/lib/session";
import { updateStudentProfile, getUserByEmail, upsertOAuthUser } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    let user = await getCurrentUser();
    const body = await request.json();
    const { firstName, lastName, phone, college, course, year, prn, email } = body;

    if (!firstName || !lastName || !college || !course) {
      return NextResponse.json(
        { error: "First Name, Last Name, College, and Course are required." },
        { status: 400 }
      );
    }

    // Fallback: If cookie session is missing, find user by email or create new
    if (!user && email) {
      user = await getUserByEmail(email);
      if (!user) {
        const res = await upsertOAuthUser({
          provider: "manual" as any,
          providerId: "manual-" + Date.now(),
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
        user = res.user;
      }
      if (user) {
        await setSessionCookie(user);
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in first." }, { status: 401 });
    }

    const updated = await updateStudentProfile(user.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone ? phone.trim() : user.phone,
      college: college.trim(),
      course: course.trim(),
      year: year ? year.trim() : "Final Year (BE / Final)",
      prn: prn ? prn.trim() : (user.prn || "N/A"),
    });

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
