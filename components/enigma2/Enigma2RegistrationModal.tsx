"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Ticket,
  User,
  Users,
  Mail,
  Phone,
  School,
  Building2,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Printer,
  ChevronDown,
  Check,
  Plus,
  Trash2,
  QrCode
} from "lucide-react";
import { ENIGMA2_EVENTS, Enigma2Event } from "@/lib/enigma2Data";
import { useAuth } from "@/lib/authContext";
import { cyberAudio } from "@/lib/audio";
import { MUMBAI_COLLEGES, CollegeItem } from "@/lib/colleges";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedEventId?: string | null;
  onSuccess?: () => void;
  onOpenAuth?: () => void;
}

export default function Enigma2RegistrationModal({
  isOpen,
  onClose,
  preselectedEventId,
  onSuccess,
  onOpenAuth
}: RegistrationModalProps) {
  const { user, signIn, refreshMyRegistrations } = useAuth();

  const [selectedEventId, setSelectedEventId] = useState<string>(
    preselectedEventId || ENIGMA2_EVENTS[0].id
  );

  useEffect(() => {
    if (preselectedEventId) {
      setSelectedEventId(preselectedEventId);
    }
  }, [preselectedEventId]);

  const selectedEvent = ENIGMA2_EVENTS.find((e) => e.id === selectedEventId) || ENIGMA2_EVENTS[0];
  const isTeam = selectedEvent.badge.includes("Team") || selectedEvent.maxTeamSize > 1;

  // Form State
  const [leaderName, setLeaderName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<{ name: string; email: string; college: string }[]>([]);

  // Searchable College Dropdown state
  const [collegeSearch, setCollegeSearch] = useState("");
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = useState(false);
  const collegeDropdownRef = useRef<HTMLDivElement>(null);

  // Sync with user
  useEffect(() => {
    if (user) {
      setLeaderName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setCollege(user.college);
      setCollegeSearch(user.college);
    }
  }, [user, isOpen]);

  // Click outside listener for college combobox
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(e.target as Node)) {
        setIsCollegeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredColleges = MUMBAI_COLLEGES.filter((c) => {
    const q = collegeSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.area.toLowerCase().includes(q)
    );
  });

  const handleSelectCollege = (col: CollegeItem) => {
    setCollege(col.name);
    setCollegeSearch(col.name);
    setIsCollegeDropdownOpen(false);
    cyberAudio.playClick();
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<{
    id: string;
    ticketCode: string;
    timestamp: string;
    eventTitle: string;
    leaderName: string;
    college: string;
    teamName?: string;
  } | null>(null);

  const addMember = () => {
    if (members.length < (selectedEvent.maxTeamSize - 1)) {
      setMembers([...members, { name: "", email: "", college: college || user?.college || "" }]);
      cyberAudio.playClick();
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
    cyberAudio.playClick();
  };

  const updateMember = (index: number, field: string, val: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: val };
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    cyberAudio.playClick();

    const finalName = user ? user.name : leaderName.trim();
    const finalEmail = user ? user.email : email.trim();
    const finalPhone = user ? user.phone : phone.trim();
    const finalCollege = user ? user.college : college.trim();

    if (!finalName || !finalEmail || !finalPhone || !finalCollege) {
      setError("Please fill in your name, email, phone, and college.");
      return;
    }

    if (!user) {
      const parts = finalName.split(" ");
      signIn({
        name: finalName,
        firstName: parts[0] || finalName,
        lastName: parts.slice(1).join(" ") || "",
        email: finalEmail,
        phone: finalPhone,
        college: finalCollege,
        department: "Computer Science",
        course: "B.Tech Computer Science",
        year: "Final Year (BE / Final)",
        prn: "ENG27-001"
      });
    }

    setLoading(true);

    try {
      const payload = {
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        category: selectedEvent.category,
        participationType: isTeam && (members.length > 0 || teamName) ? "Team" : "Solo",
        teamName: teamName.trim(),
        leaderName: finalName,
        email: finalEmail,
        phone: finalPhone,
        college: finalCollege,
        department: user?.department || "Computer Science",
        year: user?.year || "Final Year",
        prn: user?.prn || "N/A",
        teamMembers: members.filter((m) => m.name.trim() !== "")
      };

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to commit registration");
      }

      cyberAudio.playSuccess();
      setGeneratedTicket({
        id: data.registration.id,
        ticketCode: data.registration.ticketCode,
        timestamp: data.registration.timestamp,
        eventTitle: data.registration.eventTitle,
        leaderName: data.registration.leaderName,
        college: data.registration.college,
        teamName: data.registration.teamName
      });

      await refreshMyRegistrations();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    cyberAudio.playClick();
    window.print();
  };

  const handleReset = () => {
    setGeneratedTicket(null);
    setTeamName("");
    setMembers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Full-screen Dark Backdrop with Ethereal Horizon Curve Motion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#060709]/95 backdrop-blur-2xl flex items-center justify-center pointer-events-auto overflow-hidden"
        >
          {/* Ambient Glowing Aurora Flares */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.12, 0.22, 0.12],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[-5%] top-[35%] w-[650px] h-[650px] bg-gradient-to-br from-rose-600/20 via-fuchsia-600/15 to-transparent rounded-full blur-[140px] pointer-events-none"
          />

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.18, 0.1],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute left-[-5%] bottom-[20%] w-[650px] h-[650px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-transparent rounded-full blur-[140px] pointer-events-none"
          />

          {/* Ethereal Glowing Chromatic Horizon Wave */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [-1.2, -1.8, -1.2],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[200%] h-[3px] bottom-[38%] left-[-50%] pointer-events-none"
          >
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f3ff] via-[#3b82f6] via-[#8b5cf6] via-[#ec4899] to-transparent shadow-[0_0_20px_#00f3ff,0_0_50px_#3b82f6,0_0_80px_#ec4899]" />
            <div className="w-full h-[8px] -mt-1 bg-gradient-to-r from-transparent via-[#00f3ff]/30 via-[#3b82f6]/30 via-[#8b5cf6]/30 via-[#ec4899]/30 to-transparent blur-[6px]" />
          </motion.div>
        </motion.div>

        {/* Modal Window: Smoked Dark Glass Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[480px] bg-[#121316]/95 border border-white/[0.08] rounded-[28px] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-2xl z-10 my-4 text-zinc-100"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">
                {generatedTicket ? "Passport Issued" : "Event Pass Registration"}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Form or Issued Ticket */}
          {!generatedTicket ? (
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[74vh] overflow-y-auto custom-scrollbar pr-1">
              <div>
                <h2 className="text-xl font-semibold text-white tracking-tight">
                  {selectedEvent.title}
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  {selectedEvent.category} • {selectedEvent.prizePool} Prize Pool • Free Entry
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                  <ShieldAlert size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Event Picker Dropdown */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Select Event</label>
                <div className="relative">
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#17181c] border border-white/[0.08] focus:border-white/30 rounded-xl text-white text-xs outline-none"
                  >
                    {ENIGMA2_EVENTS.map((ev) => (
                      <option key={ev.id} value={ev.id} className="bg-zinc-900 text-white">
                        {ev.title} ({ev.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Authenticated User Status or Input Fields */}
              {user ? (
                <div className="p-3.5 rounded-xl bg-[#17181c] border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-sm font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span>{user.name}</span>
                        <CheckCircle2 size={12} className="text-emerald-400" />
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate max-w-[200px]">
                        {user.college}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-400/10">
                    1-Click Verified
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#17181c] border border-white/[0.08] focus:border-white/30 rounded-xl text-white placeholder-zinc-500 text-xs outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#17181c] border border-white/[0.08] focus:border-white/30 rounded-xl text-white placeholder-zinc-500 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#17181c] border border-white/[0.08] focus:border-white/30 rounded-xl text-white placeholder-zinc-500 text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* College Combobox */}
                  <div className="relative" ref={collegeDropdownRef}>
                    <label className="block text-[11px] text-zinc-400 mb-1">Mumbai College</label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3.5 top-3 text-cyan-400" />
                      <input
                        type="text"
                        required
                        placeholder="Search college (e.g. UDCS, VJTI, SPIT...)"
                        value={collegeSearch}
                        onFocus={() => setIsCollegeDropdownOpen(true)}
                        onChange={(e) => {
                          setCollegeSearch(e.target.value);
                          setIsCollegeDropdownOpen(true);
                          setCollege(e.target.value);
                        }}
                        className="w-full pl-9 pr-8 py-2.5 bg-[#17181c] border border-white/[0.08] focus:border-cyan-400/50 rounded-xl text-white placeholder-zinc-500 text-xs outline-none"
                      />
                      <ChevronDown size={14} className="absolute right-3 top-3 text-zinc-500 pointer-events-none" />
                    </div>

                    {isCollegeDropdownOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-[#17181c] border border-white/[0.12] rounded-xl shadow-2xl custom-scrollbar py-1">
                        {filteredColleges.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectCollege(c)}
                            className="px-3 py-2 hover:bg-white/[0.06] cursor-pointer text-xs text-zinc-300"
                          >
                            <div className="font-medium text-white">{c.name}</div>
                            <span className="text-[10px] text-zinc-500">{c.area} • {c.shortName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Team Options */}
              {isTeam && (
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Team Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Cipher_Warriors"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#17181c] border border-white/[0.08] focus:border-white/30 rounded-xl text-white placeholder-zinc-500 text-xs outline-none"
                    />
                  </div>

                  {/* Additional Members */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-300">
                      <span>Team Members ({members.length + 1} / {selectedEvent.maxTeamSize})</span>
                      {members.length < (selectedEvent.maxTeamSize - 1) && (
                        <button
                          type="button"
                          onClick={addMember}
                          className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={12} /> Add Teammate
                        </button>
                      )}
                    </div>

                    {members.map((m, idx) => (
                      <div key={idx} className="p-3 bg-[#17181c] border border-white/[0.06] rounded-xl space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-zinc-400">Teammate #{idx + 2}</span>
                          <button
                            type="button"
                            onClick={() => removeMember(idx)}
                            className="text-zinc-500 hover:text-red-400 p-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Teammate name"
                            value={m.name}
                            onChange={(e) => updateMember(idx, "name", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-black/40 border border-white/[0.06] rounded-lg text-white text-xs outline-none"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={m.email}
                            onChange={(e) => updateMember(idx, "email", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-black/40 border border-white/[0.06] rounded-lg text-white text-xs outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button (Solid White Pill) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-white hover:bg-zinc-100 text-black font-semibold text-xs rounded-xl shadow-[0_4px_25px_rgba(255,255,255,0.18)] transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <span>{loading ? "Issuing Ticket Pass..." : "Confirm & Issue Event Pass"}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            /* Issued Ticket Screen */
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                <CheckCircle2 size={30} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white tracking-tight">Pass Issued!</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Your registration for {generatedTicket.eventTitle} is confirmed.
                </p>
              </div>

              {/* Boarding Pass Card */}
              <div className="p-4 rounded-2xl bg-[#17181c] border border-white/[0.08] text-left space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400">
                      ENIGMA 2.0 // OFFICIAL PASS
                    </span>
                    <div className="text-base font-bold text-white mt-0.5">{generatedTicket.eventTitle}</div>
                    <div className="text-xs text-zinc-300">{generatedTicket.leaderName}</div>
                    <div className="text-[11px] text-zinc-500">{generatedTicket.college}</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg text-black">
                    <QrCode size={36} />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Ticket Code:</span>
                  <span className="text-amber-400 font-bold">{generatedTicket.ticketCode}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-1/2 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print Ticket</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-1/2 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-100 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
