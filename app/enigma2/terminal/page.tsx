"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Terminal as TerminalIcon,
  Database,
  Archive,
  Activity,
  Download,
  RotateCcw,
  Trash2,
  Search,
  ArrowLeft,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Registration, BackupRecord } from "@/lib/db";
import { cyberAudio } from "@/lib/audio";
import Enigma2RegistrationModal from "@/components/enigma2/Enigma2RegistrationModal";

interface StatsData {
  totalRegistrations: number;
  totalParticipants: number;
  byEvent: Record<string, number>;
  byCategory: Record<string, number>;
  byCollege: Record<string, number>;
  confirmedRate: string;
  lastUpdated: string;
}

export default function Enigma2TerminalPage() {
  const [activeTab, setActiveTab] = useState<"cli" | "grid" | "stats" | "backups">("cli");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Data states
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  // CLI Shell states
  const [cliInput, setCliInput] = useState("");
  const [cliLogs, setCliLogs] = useState<Array<{ text: string; type: "input" | "output" | "error" | "system" }>>([
    { text: "=== ENIGMA 2.0 KERNEL TERMINAL // BUILD 2027.01-PROD ===", type: "system" },
    { text: "SECURITY PROTOCOL: SHA-256 VERIFIED. OPERATOR SESSION ACTIVE.", type: "system" },
    { text: "Type 'help' for terminal directives or 'stats' for live telemetry.", type: "system" },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Table search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // New Registration Modal from Terminal
  const [showRegModal, setShowRegModal] = useState(false);

  // Backup creation input
  const [newBackupNote, setNewBackupNote] = useState("");
  const [backupLoading, setBackupLoading] = useState(false);

  // Theme
  const [terminalTheme, setTerminalTheme] = useState<"cyan" | "green" | "amber">("cyan");

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    cyberAudio.enabled = next;
    if (next) cyberAudio.playClick();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/registrations");
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations);
        setStats(data.stats);
      }

      const backupRes = await fetch("/api/backup");
      const backupData = await backupRes.json();
      if (backupData.success) {
        setBackups(backupData.backups);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [cliLogs]);

  // CLI Command Execution Engine
  const executeCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    cyberAudio.playTerminalKey();
    const newLogs = [...cliLogs, { text: `root@enigma-core:~$ ${trimmed}`, type: "input" as const }];

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    switch (command) {
      case "help":
        newLogs.push({
          text: `AVAILABLE TERMINAL DIRECTIVES:
  • help                - Print this diagnostic command directory
  • stats               - Output real-time registration & telemetry metrics
  • list                - Dump all registered candidates in formatted tabular output
  • inspect <id|code>   - Inspect full dossier of a participant by ID or Ticket Code
  • backup create [msg] - Snapshot current state into an encrypted backup JSON
  • backup list         - Display existing recovery checkpoints & checksums
  • backup restore <file> - Restore registrations database from designated snapshot
  • export csv|json     - Download complete registry data
  • clear               - Wipe terminal viewport
  • theme cyan|green|amber - Switch terminal phosphor color
  • seed                - Seed baseline mock telemetry records
  • ping                - Latency roundtrip test to Enigma Core`,
          type: "output"
        });
        break;

      case "stats":
        if (stats) {
          const eventsList = Object.entries(stats.byEvent)
            .map(([k, v]) => `    • ${k}: ${v} squads`)
            .join("\n");
          newLogs.push({
            text: `[TELEMETRY SYNC - ${new Date().toLocaleTimeString()}]:
  • Total Registrations : ${stats.totalRegistrations}
  • Total Participants  : ${stats.totalParticipants}
  • Confirmation Rate   : ${stats.confirmedRate}
  • Event Breakdown     :
${eventsList}
  • Unique Colleges     : ${Object.keys(stats.byCollege).length}`,
            type: "output"
          });
        } else {
          newLogs.push({ text: "Telemetry metrics uninitialized. Run 'fetch'.", type: "error" });
        }
        break;

      case "list":
        if (registrations.length === 0) {
          newLogs.push({ text: "Registry is empty. No candidates detected.", type: "output" });
        } else {
          const tableHeader = "TICKET CODE      | OPERATIVE NAME         | EVENT                   | STATUS";
          const tableDivider = "-----------------+------------------------+-------------------------+-----------";
          const rows = registrations.map(
            (r) =>
              `${r.ticketCode.padEnd(16)} | ${(r.leaderName || "Unknown").slice(0, 22).padEnd(22)} | ${r.eventTitle.slice(0, 23).padEnd(23)} | ${r.status}`
          );
          newLogs.push({
            text: `${tableHeader}\n${tableDivider}\n${rows.join("\n")}\n\nTotal Count: ${registrations.length} records.`,
            type: "output"
          });
        }
        break;

      case "inspect":
        if (!arg) {
          newLogs.push({ text: "Usage: inspect <ticketCode or ID>", type: "error" });
        } else {
          const found = registrations.find(
            (r) =>
              r.id.toLowerCase() === arg.toLowerCase() ||
              r.ticketCode.toLowerCase() === arg.toLowerCase()
          );
          if (found) {
            newLogs.push({
              text: `[RECORD DOSSIER: ${found.ticketCode}]:
  • ID           : ${found.id}
  • Lead Operative: ${found.leaderName}
  • Email        : ${found.email}
  • Phone        : ${found.phone}
  • Campus       : ${found.college}
  • Department   : ${found.department} (${found.year})
  • Target Event : ${found.eventTitle} (${found.category})
  • Squad Roster : ${found.teamName ? `[${found.teamName}] ` : ""}${found.teamMembers?.length ? found.teamMembers.map((m) => m.name).join(", ") : "Solo"}
  • Timestamp    : ${found.timestamp}
  • Status       : ${found.status}`,
              type: "output"
            });
            setSelectedReg(found);
          } else {
            newLogs.push({ text: `ERR_NOT_FOUND: No candidate matching '${arg}' found.`, type: "error" });
          }
        }
        break;

      case "backup": {
        const sub = parts[1]?.toLowerCase();
        if (sub === "create") {
          const note = parts.slice(2).join(" ") || "Manual Terminal Snapshot";
          try {
            const res = await fetch("/api/backup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "create", note })
            });
            const data = await res.json();
            if (data.success) {
              newLogs.push({
                text: `[BACKUP CREATED]: ${data.backup.filename} | Records: ${data.backup.recordsCount} | Checksum: ${data.backup.checksum}`,
                type: "output"
              });
              fetchData();
            } else {
              newLogs.push({ text: `Backup error: ${data.error}`, type: "error" });
            }
          } catch {
            newLogs.push({ text: "Network failure while writing snapshot.", type: "error" });
          }
        } else if (sub === "list") {
          if (backups.length === 0) {
            newLogs.push({ text: "No backup snapshots found in vault.", type: "output" });
          } else {
            const listText = backups
              .map(
                (b) =>
                  `  • ${b.filename} | ${b.recordsCount} records | ${b.checksum} | ${new Date(b.createdAt).toLocaleString()}`
              )
              .join("\n");
            newLogs.push({ text: `EXISTING RECOVERY SNAPSHOTS:\n${listText}`, type: "output" });
          }
        } else if (sub === "restore") {
          const filename = parts[2];
          if (!filename) {
            newLogs.push({ text: "Usage: backup restore <filename.json>", type: "error" });
          } else {
            try {
              const res = await fetch("/api/backup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "restore", filename })
              });
              const data = await res.json();
              if (data.success) {
                newLogs.push({ text: `[RESTORE OK]: ${data.message}`, type: "output" });
                fetchData();
              } else {
                newLogs.push({ text: `Restore failed: ${data.error}`, type: "error" });
              }
            } catch {
              newLogs.push({ text: "Restore communication error.", type: "error" });
            }
          }
        } else {
          newLogs.push({
            text: "Usage: backup create [note] | backup list | backup restore <file>",
            type: "error"
          });
        }
        break;
      }

      case "export": {
        const format = parts[1]?.toLowerCase() || "json";
        if (format === "csv") {
          exportCSV();
          newLogs.push({ text: "Exported registry to enigma2_registrations.csv", type: "output" });
        } else {
          exportJSON();
          newLogs.push({ text: "Exported registry to enigma2_registrations.json", type: "output" });
        }
        break;
      }

      case "theme": {
        const t = parts[1]?.toLowerCase();
        if (t === "cyan" || t === "green" || t === "amber") {
          setTerminalTheme(t);
          newLogs.push({ text: `Terminal phosphor profile set to ${t.toUpperCase()}`, type: "output" });
        } else {
          newLogs.push({ text: "Available themes: cyan | green | amber", type: "error" });
        }
        break;
      }

      case "seed": {
        try {
          const res = await fetch("/api/backup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "seed" })
          });
          const data = await res.json();
          if (data.success) {
            newLogs.push({ text: "Baseline sample registrations initialized successfully.", type: "output" });
            fetchData();
          }
        } catch {
          newLogs.push({ text: "Failed to seed sample telemetry.", type: "error" });
        }
        break;
      }

      case "clear":
        setCliLogs([]);
        return;

      case "ping":
        newLogs.push({
          text: `PONG: Enigma 2.0 Core online. Latency: 1.2ms. Node: Mumbai-South-UDCS.`,
          type: "output"
        });
        break;

      default:
        newLogs.push({
          text: `Direct command '${command}' unrecognized. Enter 'help' for instruction set.`,
          type: "error"
        });
        break;
    }

    setCliLogs(newLogs);
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    executeCommand(cliInput);
    setCliInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setCliInput(history[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setCliInput("");
      } else {
        setHistoryIndex(nextIdx);
        setCliInput(history[nextIdx] || "");
      }
    }
  };

  // Export Utilities
  const exportJSON = () => {
    cyberAudio.playClick();
    const blob = new Blob([JSON.stringify(registrations, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enigma2_registrations_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    cyberAudio.playClick();
    const headers = [
      "ID",
      "Ticket Code",
      "Timestamp",
      "Event Title",
      "Category",
      "Type",
      "Leader Name",
      "Email",
      "Phone",
      "College",
      "Department",
      "Team Name",
      "Members Count",
      "Status"
    ];

    const rows = registrations.map((r) => [
      r.id,
      r.ticketCode,
      r.timestamp,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      r.category,
      r.participationType,
      `"${r.leaderName.replace(/"/g, '""')}"`,
      r.email,
      `"${r.phone}"`,
      `"${r.college.replace(/"/g, '""')}"`,
      `"${r.department.replace(/"/g, '""')}"`,
      `"${(r.teamName || "").replace(/"/g, '""')}"`,
      r.teamMembers?.length || 0,
      r.status
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enigma2_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to purge record ${id}?`)) return;
    cyberAudio.playClick();
    try {
      const res = await fetch(`/api/registrations?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchData();
        executeCommand(`Record ${id} purged from disk.`);
      }
    } catch {
      // ignore
    }
  };

  const handleCreateBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    cyberAudio.playClick();
    setBackupLoading(true);
    try {
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", note: newBackupNote || "Manual Snapshot via Dashboard" })
      });
      const data = await res.json();
      if (data.success) {
        setNewBackupNote("");
        fetchData();
        cyberAudio.playSuccess();
      }
    } catch {
      // ignore
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    if (!confirm(`Restore database to checkpoint: ${filename}? Current modifications will be replaced.`))
      return;
    cyberAudio.playClick();
    try {
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", filename })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        cyberAudio.playSuccess();
        alert(`System state restored from ${filename}`);
      }
    } catch {
      // ignore
    }
  };

  // Filtered registrations
  const filteredRegistrations = registrations.filter((r) => {
    const matchCat = categoryFilter === "All" || r.category === categoryFilter;
    const matchSearch =
      searchQuery === "" ||
      r.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Color classes for theme
  const themeClasses = {
    cyan: {
      text: "text-neon-cyan",
      border: "border-neon-cyan/40",
      bg: "bg-neon-cyan/10",
      glow: "shadow-[0_0_20px_rgba(0,243,255,0.2)]",
      prompt: "text-neon-cyan"
    },
    green: {
      text: "text-green-400",
      border: "border-green-500/40",
      bg: "bg-green-500/10",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]",
      prompt: "text-green-400"
    },
    amber: {
      text: "text-amber-400",
      border: "border-amber-500/40",
      bg: "bg-amber-500/10",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
      prompt: "text-amber-400"
    }
  }[terminalTheme];

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-neon-cyan selection:text-black">
      {/* Top Cyber Telemetry Bar */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/enigma2"
              className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-neon-cyan transition-colors"
            >
              <ArrowLeft size={14} /> Back to Enigma 2.0
            </Link>

            <div className="h-4 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <h1 className="font-display font-bold text-sm sm:text-base text-white tracking-widest flex items-center gap-2">
                ENIGMA 2.0 <span className="text-neon-cyan font-mono text-xs">BACKEND TERMINAL</span>
              </h1>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10">
              <span className="text-gray-400">CLUSTER:</span>
              <span className="text-neon-cyan">MUMBAI_UDCS</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10">
              <span className="text-gray-400">SYNCS:</span>
              <span className="text-white font-bold">{registrations.length}</span>
            </div>

            <button
              onClick={toggleSound}
              className="p-1.5 rounded border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Toggle Audio Feedback"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={() => {
                fetchData();
                cyberAudio.playClick();
              }}
              className="p-1.5 rounded border border-white/10 text-gray-400 hover:text-neon-cyan hover:bg-white/5 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto gap-2 border-t border-white/5 pt-1 custom-scrollbar">
          <button
            onClick={() => {
              setActiveTab("cli");
              cyberAudio.playHover();
            }}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "cli"
                ? "border-neon-cyan text-neon-cyan font-bold bg-neon-cyan/5"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <TerminalIcon size={14} /> [CLI CONSOLE]
          </button>

          <button
            onClick={() => {
              setActiveTab("grid");
              cyberAudio.playHover();
            }}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "grid"
                ? "border-neon-cyan text-neon-cyan font-bold bg-neon-cyan/5"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Database size={14} /> [REGISTRATIONS GRID] ({registrations.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("stats");
              cyberAudio.playHover();
            }}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "stats"
                ? "border-neon-cyan text-neon-cyan font-bold bg-neon-cyan/5"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Activity size={14} /> [TELEMETRY ANALYTICS]
          </button>

          <button
            onClick={() => {
              setActiveTab("backups");
              cyberAudio.playHover();
            }}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "backups"
                ? "border-neon-cyan text-neon-cyan font-bold bg-neon-cyan/5"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Archive size={14} /> [BACKUP VAULT] ({backups.length})
          </button>
        </div>
      </header>

      {/* Main Terminal Body */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* TAB 1: CLI INTERACTIVE SHELL */}
        {activeTab === "cli" && (
          <div className="space-y-4">
            {/* Quick action bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-zinc-950 p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Phosphor:</span>
                {(["cyan", "green", "amber"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTerminalTheme(t);
                      cyberAudio.playClick();
                    }}
                    className={`px-2 py-0.5 rounded uppercase ${
                      terminalTheme === t ? "bg-white/20 text-white font-bold" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => executeCommand("stats")}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-neon-cyan text-gray-300 hover:text-white"
                >
                  Run stats
                </button>
                <button
                  onClick={() => executeCommand("list")}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-neon-cyan text-gray-300 hover:text-white"
                >
                  Run list
                </button>
                <button
                  onClick={() => executeCommand("backup create Scheduled Snapshot")}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-neon-cyan text-gray-300 hover:text-white"
                >
                  Create Backup
                </button>
                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-2.5 py-1 rounded bg-neon-cyan text-black font-bold hover:bg-white transition-colors"
                >
                  + Direct Register
                </button>
              </div>
            </div>

            {/* Shell Console Screen */}
            <div
              className={`p-4 md:p-6 rounded-2xl bg-black border ${themeClasses.border} ${themeClasses.glow} font-mono text-xs md:text-sm min-h-[500px] max-h-[650px] overflow-y-auto custom-scrollbar flex flex-col justify-between`}
            >
              <div className="space-y-2 whitespace-pre-wrap">
                {cliLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      log.type === "input"
                        ? "text-white font-bold"
                        : log.type === "error"
                        ? "text-red-400"
                        : log.type === "system"
                        ? "text-gray-500 text-xs"
                        : themeClasses.text
                    }`}
                  >
                    {log.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Shell Input Prompt */}
              <form onSubmit={handleCliSubmit} className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                <span className={`font-bold shrink-0 ${themeClasses.prompt}`}>root@enigma-core:~$</span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type directive (e.g. 'help', 'stats', 'list', 'backup create')"
                  autoFocus
                  className="w-full bg-transparent text-white focus:outline-none font-mono text-sm caret-neon-cyan"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono uppercase text-gray-300"
                >
                  Execute
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: DATA GRID TABLE */}
        {activeTab === "grid" && (
          <div className="space-y-4">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-950 p-4 rounded-xl border border-white/10">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search candidate name, college, ticket code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-mono text-gray-300 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Coding">Coding</option>
                  <option value="Problem Solving">Problem Solving</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Innovation">Innovation</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportCSV}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-mono text-gray-300 flex items-center gap-1.5"
                >
                  <FileSpreadsheet size={14} className="text-green-400" /> Export CSV
                </button>
                <button
                  onClick={exportJSON}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-mono text-gray-300 flex items-center gap-1.5"
                >
                  <Download size={14} className="text-neon-cyan" /> JSON
                </button>
                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-4 py-2 rounded-xl bg-neon-cyan text-black font-display font-bold text-xs flex items-center gap-1.5 hover:bg-white transition-colors"
                >
                  <PlusCircle size={14} /> Add Candidate
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Ticket Code</th>
                      <th className="p-3.5">Operative Name</th>
                      <th className="p-3.5">Event</th>
                      <th className="p-3.5">College</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Squad</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500 font-mono">
                          No registration entries match current criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((r) => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 font-bold text-neon-cyan">{r.ticketCode}</td>
                          <td className="p-3.5 text-white font-medium">{r.leaderName}</td>
                          <td className="p-3.5">
                            <span className="text-gray-300 block">{r.eventTitle}</span>
                            <span className="text-[10px] text-gray-500">{r.category}</span>
                          </td>
                          <td className="p-3.5 text-gray-400 max-w-[180px] truncate">{r.college}</td>
                          <td className="p-3.5 text-gray-400">
                            <div>{r.phone}</div>
                            <div className="text-[10px] text-gray-500">{r.email}</div>
                          </td>
                          <td className="p-3.5">
                            {r.participationType === "Team" ? (
                              <span className="text-neon-magenta font-semibold">
                                {r.teamName || "Team"} ({(r.teamMembers?.length || 0) + 1})
                              </span>
                            ) : (
                              <span className="text-gray-500">Solo</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">
                              {r.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedReg(r)}
                                className="p-1 rounded text-gray-400 hover:text-neon-cyan hover:bg-white/5"
                                title="Inspect Record"
                              >
                                <ExternalLink size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-white/5"
                                title="Purge Record"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TELEMETRY & ANALYTICS */}
        {activeTab === "stats" && stats && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-neon-cyan/30 shadow-[0_0_20px_rgba(0,243,255,0.1)]">
                <span className="text-xs font-mono text-gray-400 uppercase">Total Registrations</span>
                <p className="text-4xl font-display font-bold text-white mt-1">
                  {stats.totalRegistrations}
                </p>
                <span className="text-[11px] font-mono text-neon-cyan mt-1 block">Live Entries Synced</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-neon-magenta/30 shadow-[0_0_20px_rgba(255,0,85,0.1)]">
                <span className="text-xs font-mono text-gray-400 uppercase">Total Operatives / Hackers</span>
                <p className="text-4xl font-display font-bold text-white mt-1">
                  {stats.totalParticipants}
                </p>
                <span className="text-[11px] font-mono text-neon-magenta mt-1 block">Including Team Rosters</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10">
                <span className="text-xs font-mono text-gray-400 uppercase">Affiliated Colleges</span>
                <p className="text-4xl font-display font-bold text-white mt-1">
                  {Object.keys(stats.byCollege).length}
                </p>
                <span className="text-[11px] font-mono text-gray-400 mt-1 block">Mumbai & Maharashtra</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-green-500/30">
                <span className="text-xs font-mono text-gray-400 uppercase">Network Integrity</span>
                <p className="text-4xl font-display font-bold text-green-400 mt-1">
                  {stats.confirmedRate}
                </p>
                <span className="text-[11px] font-mono text-green-400/80 mt-1 block">SHA-256 Validated</span>
              </div>
            </div>

            {/* Breakdown Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Distribution */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity size={16} className="text-neon-cyan" /> Event Distribution Breakdown
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  {Object.entries(stats.byEvent).map(([ev, count]) => {
                    const pct = Math.round((count / (stats.totalRegistrations || 1)) * 100);
                    return (
                      <div key={ev} className="space-y-1">
                        <div className="flex justify-between text-gray-300">
                          <span>{ev}</span>
                          <span className="font-bold text-neon-cyan">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* College Distribution */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={16} className="text-neon-magenta" /> Top Participating Colleges
                </h3>
                <div className="space-y-2.5 font-mono text-xs">
                  {Object.entries(stats.byCollege).map(([col, count]) => (
                    <div
                      key={col}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between"
                    >
                      <span className="text-gray-300 truncate max-w-[280px]">{col}</span>
                      <span className="px-2 py-0.5 rounded bg-neon-magenta/20 text-neon-magenta font-bold">
                        {count} Entries
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BACKUP VAULT & RECOVERY */}
        {activeTab === "backups" && (
          <div className="space-y-6">
            {/* Create Snapshot Card */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10">
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Archive size={16} className="text-neon-cyan" /> Generate New Backup Snapshot
              </h3>
              <p className="text-xs text-gray-400 font-mono mb-4">
                Creates an immutable JSON checkpoint of the entire registrations database with calculated checksum.
              </p>

              <form onSubmit={handleCreateBackup} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Snapshot annotation or tag (e.g. Pre-event backup)..."
                  value={newBackupNote}
                  onChange={(e) => setNewBackupNote(e.target.value)}
                  className="flex-1 px-4 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-neon-cyan"
                />
                <button
                  type="submit"
                  disabled={backupLoading}
                  className="px-6 py-2 rounded-xl bg-neon-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
                >
                  {backupLoading ? "Writing Snapshot..." : "Create Snapshot"}
                </button>
              </form>
            </div>

            {/* Backups List */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider">
                Available Snapshot Archives ({backups.length})
              </h4>

              {backups.length === 0 ? (
                <div className="p-8 text-center bg-zinc-950 rounded-2xl border border-white/10 text-gray-500 font-mono text-xs">
                  No automated backup snapshots archived yet. Create one above!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {backups.map((b) => (
                    <div
                      key={b.filename}
                      className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-white/25 transition-all space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-mono font-bold text-neon-cyan truncate max-w-[240px]">
                            {b.filename}
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5">{b.note}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono text-gray-300">
                          {b.recordsCount} records
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-gray-500 space-y-0.5">
                        <div>Created: {new Date(b.createdAt).toLocaleString()}</div>
                        <div>Checksum: <span className="text-gray-300">{b.checksum}</span> • Size: {b.sizeBytes} B</div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-2">
                        <a
                          href={`/api/backup?download=${encodeURIComponent(b.filename)}`}
                          download
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5"
                        >
                          <Download size={13} /> Download
                        </a>
                        <button
                          onClick={() => handleRestoreBackup(b.filename)}
                          className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono flex items-center gap-1.5"
                        >
                          <RotateCcw size={13} /> Restore State
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Detail Inspect Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-950 border border-neon-cyan rounded-2xl p-6 space-y-4 shadow-[0_0_50px_rgba(0,243,255,0.3)]">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-white text-base">
                OPERATIVE DOSSIER // {selectedReg.ticketCode}
              </h3>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/5">
                <div>
                  <span className="text-gray-500 block">Name:</span>
                  <span className="text-white font-bold">{selectedReg.leaderName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Target Event:</span>
                  <span className="text-neon-cyan font-bold">{selectedReg.eventTitle}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Email:</span>
                  <span className="text-gray-300">{selectedReg.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Phone:</span>
                  <span className="text-gray-300">{selectedReg.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">College:</span>
                  <span className="text-gray-300">{selectedReg.college}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Department / PRN:</span>
                  <span className="text-gray-300">{selectedReg.department} ({selectedReg.prn || "N/A"})</span>
                </div>
              </div>

              {selectedReg.teamMembers && selectedReg.teamMembers.length > 0 && (
                <div className="p-3 rounded-xl bg-white/5 space-y-2">
                  <span className="text-neon-magenta font-bold block">
                    Squad Teammates ({selectedReg.teamName || "Team"}):
                  </span>
                  {selectedReg.teamMembers.map((m, idx) => (
                    <div key={idx} className="flex justify-between text-gray-300 border-b border-white/5 pb-1">
                      <span>{m.name}</span>
                      <span className="text-gray-500">{m.email}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[11px] text-gray-500">
                Committed on: {new Date(selectedReg.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 rounded-xl bg-neon-cyan text-black font-display font-bold text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal Triggered from Terminal */}
      <Enigma2RegistrationModal
        isOpen={showRegModal}
        onClose={() => setShowRegModal(false)}
        onSuccess={() => {
          fetchData();
          executeCommand("New candidate registered and synchronized with database.");
        }}
      />
    </div>
  );
}
