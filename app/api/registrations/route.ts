import { NextResponse } from "next/server";
import { getRegistrations, saveRegistration, deleteRegistration, getStats } from "@/lib/db";

export async function GET() {
  try {
    const registrations = await getRegistrations();
    const stats = await getStats();
    return NextResponse.json({
      success: true,
      count: registrations.length,
      stats,
      registrations
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      eventId,
      eventTitle,
      category,
      participationType,
      teamName,
      leaderName,
      email,
      phone,
      college,
      department,
      year,
      prn,
      teamMembers,
      notes
    } = body;

    if (!eventId || !eventTitle || !leaderName || !email || !phone || !college) {
      return NextResponse.json(
        { success: false, error: "Missing required registration parameters" },
        { status: 400 }
      );
    }

    const newRecord = await saveRegistration({
      eventId,
      eventTitle,
      category: category || "Technical",
      participationType: participationType || "Solo",
      teamName: teamName || "",
      leaderName,
      email,
      phone,
      college,
      department: department || "Computer Science",
      year: year || "Current",
      prn: prn || "N/A",
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
      notes: notes || ""
    });

    return NextResponse.json({
      success: true,
      message: "Registration successfully saved to Enigma 2.0 quantum network",
      registration: newRecord
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error during registration write" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Registration ID is required" },
        { status: 400 }
      );
    }

    const success = await deleteRegistration(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${id} purged successfully`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete record" },
      { status: 500 }
    );
  }
}
