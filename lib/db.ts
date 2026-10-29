import fs from "fs/promises";
import path from "path";

export interface TeamMember {
  name: string;
  email: string;
  college: string;
}

export interface Registration {
  id: string;
  ticketCode: string;
  timestamp: string;
  eventId: string;
  eventTitle: string;
  category: string;
  participationType: "Solo" | "Team";
  teamName?: string;
  leaderName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  prn: string;
  teamMembers?: TeamMember[];
  status: "CONFIRMED" | "VERIFIED" | "PENDING";
  notes?: string;
}

export interface BackupRecord {
  filename: string;
  createdAt: string;
  recordsCount: number;
  sizeBytes: number;
  checksum: string;
  note?: string;
}

export interface StudentUser {
  id: string;
  provider: "google" | "github" | "manual";
  providerId?: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar?: string;
  college: string;
  course: string;
  year: string;
  phone: string;
  prn?: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const BACKUPS_DIR = path.join(DATA_DIR, "backups");

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(BACKUPS_DIR, { recursive: true });
}


function generateSimpleChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "0x" + Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
}

export const INITIAL_SEED_DATA: Registration[] = [
  {
    id: "ENG27-CT01",
    ticketCode: "ENG27-CV-9821",
    timestamp: "2026-10-20T10:15:00.000Z",
    eventId: "compile-vibes",
    eventTitle: "Compile The Vibes",
    category: "Coding",
    participationType: "Team",
    teamName: "Neural Nexus",
    leaderName: "Aarav Sharma",
    email: "aarav.sharma@vjti.ac.in",
    phone: "+91 98201 12345",
    college: "VJTI Mumbai",
    department: "Computer Engineering",
    year: "Final Year",
    prn: "VJTI-2023-CS-041",
    teamMembers: [
      { name: "Pooja Mehta", email: "pooja.mehta@vjti.ac.in", college: "VJTI Mumbai" },
      { name: "Rohan Deshmukh", email: "rohan.d@vjti.ac.in", college: "VJTI Mumbai" }
    ],
    status: "CONFIRMED"
  },
  {
    id: "ENG27-BD02",
    ticketCode: "ENG27-BD-4412",
    timestamp: "2026-10-21T14:32:00.000Z",
    eventId: "blind-dates",
    eventTitle: "Blind Date with Code",
    category: "Coding",
    participationType: "Solo",
    leaderName: "Sanya Kulkarni",
    email: "sanya.k@udcs.mu.ac.in",
    phone: "+91 91672 55432",
    college: "UDCS, University of Mumbai",
    department: "M.Sc. Computer Science",
    year: "Part 1",
    prn: "UDCS-2026-089",
    status: "CONFIRMED"
  },
  {
    id: "ENG27-DH03",
    ticketCode: "ENG27-DH-7719",
    timestamp: "2026-10-22T09:12:00.000Z",
    eventId: "decode-hunt",
    eventTitle: "Decode The Hunt",
    category: "Problem Solving",
    participationType: "Team",
    teamName: "Cipher_Warriors",
    leaderName: "Aditya Verma",
    email: "aditya.v@spit.ac.in",
    phone: "+91 99203 77881",
    college: "Sardar Patel Institute of Technology",
    department: "Information Technology",
    year: "Third Year",
    prn: "SPIT-2024-IT-019",
    teamMembers: [
      { name: "Devansh Parekh", email: "devansh.p@spit.ac.in", college: "SPIT Mumbai" }
    ],
    status: "CONFIRMED"
  },
  {
    id: "ENG27-FF04",
    ticketCode: "ENG27-FA-3011",
    timestamp: "2026-10-22T17:45:00.000Z",
    eventId: "fifa-addicts",
    eventTitle: "FIFA Addicts",
    category: "Gaming",
    participationType: "Solo",
    leaderName: "Kabir Khan",
    email: "kabir.khan@djsce.ac.in",
    phone: "+91 98199 44321",
    college: "D. J. Sanghvi College of Engineering",
    department: "Data Science",
    year: "Second Year",
    prn: "DJ-2025-DS-102",
    status: "CONFIRMED"
  },
  {
    id: "ENG27-AR05",
    ticketCode: "ENG27-AR-5520",
    timestamp: "2026-10-23T08:20:00.000Z",
    eventId: "arcade-showcase",
    eventTitle: "The Arcade - Project Showcase",
    category: "Innovation",
    participationType: "Team",
    teamName: "QuantumAI Lab",
    leaderName: "Sneha Nair",
    email: "sneha.nair@vesit.edu",
    phone: "+91 97690 12890",
    college: "VESIT Mumbai",
    department: "Artificial Intelligence & Data Science",
    year: "Final Year",
    prn: "VESIT-2023-AI-044",
    teamMembers: [
      { name: "Anish Patil", email: "anish.p@vesit.edu", college: "VESIT Mumbai" }
    ],
    status: "CONFIRMED"
  }
];

export async function getRegistrations(): Promise<Registration[]> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(REGISTRATIONS_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // file doesn't exist or is invalid
  }

  // Seed default data
  await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(INITIAL_SEED_DATA, null, 2), "utf-8");
  return INITIAL_SEED_DATA;
}

export async function saveRegistration(
  reg: Omit<Registration, "id" | "ticketCode" | "timestamp" | "status">
): Promise<Registration> {
  const registrations = await getRegistrations();

  const idSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const ticketSuffix = Math.floor(1000 + Math.random() * 9000);
  const eventCode = reg.eventId.slice(0, 2).toUpperCase();

  const newReg: Registration = {
    ...reg,
    id: `ENG27-${idSuffix}`,
    ticketCode: `ENG27-${eventCode}-${ticketSuffix}`,
    timestamp: new Date().toISOString(),
    status: "CONFIRMED"
  };

  const updated = [newReg, ...registrations];
  await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return newReg;
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const registrations = await getRegistrations();
  const filtered = registrations.filter((r) => r.id !== id);
  if (filtered.length === registrations.length) return false;
  await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export async function getStats() {
  const registrations = await getRegistrations();
  
  const byEvent: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const byCollege: Record<string, number> = {};

  let totalParticipants = 0;

  for (const r of registrations) {
    byEvent[r.eventTitle] = (byEvent[r.eventTitle] || 0) + 1;
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
    byCollege[r.college] = (byCollege[r.college] || 0) + 1;

    totalParticipants += 1 + (r.teamMembers?.length || 0);
  }

  return {
    totalRegistrations: registrations.length,
    totalParticipants,
    byEvent,
    byCategory,
    byCollege,
    confirmedRate: "100%",
    lastUpdated: new Date().toISOString()
  };
}

export async function createBackup(note?: string): Promise<BackupRecord> {
  await ensureDirs();
  const registrations = await getRegistrations();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `enigma2_backup_${timestamp}.json`;
  const filepath = path.join(BACKUPS_DIR, filename);

  const payload = {
    version: "2.0.0",
    createdAt: new Date().toISOString(),
    system: "ENIGMA 2.0 TERMINAL BACKUP KERNEL",
    note: note || "Automated System Snapshot",
    recordsCount: registrations.length,
    registrations
  };

  const content = JSON.stringify(payload, null, 2);
  await fs.writeFile(filepath, content, "utf-8");

  const stat = await fs.stat(filepath);
  return {
    filename,
    createdAt: payload.createdAt,
    recordsCount: registrations.length,
    sizeBytes: stat.size,
    checksum: generateSimpleChecksum(content),
    note: payload.note
  };
}

export async function listBackups(): Promise<BackupRecord[]> {
  await ensureDirs();
  const files = await fs.readdir(BACKUPS_DIR);
  const backups: BackupRecord[] = [];

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filepath = path.join(BACKUPS_DIR, file);
      try {
        const stat = await fs.stat(filepath);
        const raw = await fs.readFile(filepath, "utf-8");
        const parsed = JSON.parse(raw);
        backups.push({
          filename: file,
          createdAt: parsed.createdAt || stat.mtime.toISOString(),
          recordsCount: parsed.recordsCount || (parsed.registrations?.length ?? 0),
          sizeBytes: stat.size,
          checksum: generateSimpleChecksum(raw),
          note: parsed.note || "Standard Backup"
        });
      } catch {
        // ignore corrupted file
      }
    }
  }

  return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function restoreBackup(filename: string): Promise<boolean> {
  await ensureDirs();
  const filepath = path.join(BACKUPS_DIR, filename);
  try {
    const raw = await fs.readFile(filepath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.registrations)) {
      await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(parsed.registrations, null, 2), "utf-8");
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

// ----------------------------------------------------
// Student User Management
// ----------------------------------------------------

export async function getUsers(): Promise<StudentUser[]> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data;
    }
  } catch {
    // file does not exist yet
  }
  return [];
}

export async function getUserByEmail(email: string): Promise<StudentUser | null> {
  const users = await getUsers();
  const normalized = email.toLowerCase().trim();
  return users.find((u) => u.email.toLowerCase().trim() === normalized) || null;
}

export async function getUserById(id: string): Promise<StudentUser | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

export async function upsertOAuthUser(params: {
  provider: "google" | "github";
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}): Promise<{ user: StudentUser; isNew: boolean }> {
  await ensureDirs();
  const users = await getUsers();
  const normalizedEmail = params.email.toLowerCase().trim();
  const existingIndex = users.findIndex(
    (u) => u.email.toLowerCase().trim() === normalizedEmail
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const existing = users[existingIndex];
    const updated: StudentUser = {
      ...existing,
      provider: params.provider,
      providerId: params.providerId,
      avatar: params.avatar || existing.avatar,
      firstName: existing.firstName || params.firstName,
      lastName: existing.lastName || params.lastName,
      name: existing.name || `${params.firstName} ${params.lastName}`.trim(),
      updatedAt: now,
    };
    users[existingIndex] = updated;
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    return { user: updated, isNew: false };
  }

  const fullName = `${params.firstName} ${params.lastName}`.trim() || params.email.split("@")[0];
  const newUser: StudentUser = {
    id: "STU-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    provider: params.provider,
    providerId: params.providerId,
    email: normalizedEmail,
    firstName: params.firstName,
    lastName: params.lastName,
    name: fullName,
    avatar: params.avatar || "",
    college: "",
    course: "",
    year: "",
    phone: "",
    prn: "",
    isProfileComplete: false,
    createdAt: now,
    updatedAt: now,
  };

  users.unshift(newUser);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  return { user: newUser, isNew: true };
}

export async function updateStudentProfile(
  id: string,
  updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    college?: string;
    course?: string;
    year?: string;
    prn?: string;
  }
): Promise<StudentUser | null> {
  await ensureDirs();
  const users = await getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  const current = users[idx];
  const firstName = updates.firstName ?? current.firstName;
  const lastName = updates.lastName ?? current.lastName;
  const name = `${firstName} ${lastName}`.trim() || current.name;

  const college = updates.college ?? current.college;
  const course = updates.course ?? current.course;

  // Profile is complete if basic details are present
  const isProfileComplete = Boolean(
    firstName &&
    lastName &&
    college &&
    course
  );

  const updated: StudentUser = {
    ...current,
    ...updates,
    firstName,
    lastName,
    name,
    isProfileComplete,
    updatedAt: new Date().toISOString(),
  };

  users[idx] = updated;
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  return updated;
}

