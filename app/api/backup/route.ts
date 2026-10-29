import { NextResponse } from "next/server";
import { createBackup, listBackups, restoreBackup, getRegistrations, INITIAL_SEED_DATA } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const downloadFile = searchParams.get("download");

    if (downloadFile) {
      // Return file content as downloadable attachment
      const safeFilename = path.basename(downloadFile);
      const filepath = path.join(process.cwd(), "data", "backups", safeFilename);
      const content = await fs.readFile(filepath, "utf-8");

      return new NextResponse(content, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${safeFilename}"`
        }
      });
    }

    const backups = await listBackups();
    return NextResponse.json({
      success: true,
      backups
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to list or read backups" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, note, filename } = body;

    if (action === "create") {
      const backup = await createBackup(note);
      return NextResponse.json({
        success: true,
        message: "Backup snapshot generated successfully",
        backup
      });
    }

    if (action === "restore") {
      if (!filename) {
        return NextResponse.json(
          { success: false, error: "Snapshot filename is required for restoration" },
          { status: 400 }
        );
      }
      const safeFilename = path.basename(filename);
      const restored = await restoreBackup(safeFilename);
      if (!restored) {
        return NextResponse.json(
          { success: false, error: "Failed to restore backup snapshot" },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: `System state successfully restored from ${safeFilename}`
      });
    }

    if (action === "seed") {
      const DATA_DIR = path.join(process.cwd(), "data");
      const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");
      await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(INITIAL_SEED_DATA, null, 2), "utf-8");
      return NextResponse.json({
        success: true,
        message: "Default sample telemetry seeded"
      });
    }

    return NextResponse.json(
      { success: false, error: "Unknown backup action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Backup kernel error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal error in backup kernel" },
      { status: 500 }
    );
  }
}
