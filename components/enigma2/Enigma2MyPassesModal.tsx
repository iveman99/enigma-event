"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Ticket, Printer, Calendar, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { cyberAudio } from "@/lib/audio";

interface MyPassesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreEvents?: () => void;
}

export default function Enigma2MyPassesModal({
  isOpen,
  onClose,
  onExploreEvents
}: MyPassesModalProps) {
  const { user, myRegistrations } = useAuth();

  const handlePrint = () => {
    cyberAudio.playClick();
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-neon-cyan/40 rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.25)] overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-neon-cyan/15 via-zinc-900 to-transparent border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
                <Ticket size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white tracking-wider flex items-center gap-2">
                  MY CYBER PASSES <span className="text-xs text-neon-cyan font-mono">[{myRegistrations.length}]</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  {user ? `Operative: ${user.name} (${user.college})` : "Active Passes Roster"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar space-y-6">
            {myRegistrations.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                  <Ticket size={28} />
                </div>
                <div>
                  <h4 className="text-base font-display font-bold text-white">NO PASSES ACQUIRED YET</h4>
                  <p className="text-xs font-mono text-gray-400 mt-1 max-w-sm mx-auto">
                    You haven&apos;t enrolled in any Enigma 2.0 challenges yet. Pick a competition below to register in 1 click!
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onExploreEvents) onExploreEvents();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-neon-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Explore Challenges
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myRegistrations.map((pass) => (
                  <div
                    key={pass.id}
                    className="p-5 rounded-2xl bg-zinc-900/90 border border-neon-cyan/30 shadow-[0_0_20px_rgba(0,243,255,0.1)] space-y-4 relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan text-[10px] font-mono font-bold">
                            {pass.category}
                          </span>
                          <span className="text-[11px] font-mono text-gray-400">
                            {pass.participationType}
                          </span>
                        </div>
                        <h4 className="text-lg font-display font-bold text-white mt-1">
                          {pass.eventTitle}
                        </h4>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-mono text-gray-400 block">TICKET CODE</span>
                        <span className="text-base font-mono font-bold text-neon-cyan">
                          {pass.ticketCode}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-gray-400">
                      <div>
                        <span className="text-gray-500 block text-[10px]">OPERATIVE</span>
                        <span className="text-white font-bold">{pass.leaderName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">TIMELINE</span>
                        <span className="text-gray-300">JANUARY 2027</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">STATUS</span>
                        <span className="text-green-400 font-bold flex items-center gap-1">
                          <CheckCircle size={12} /> CONFIRMED
                        </span>
                      </div>
                    </div>

                    {pass.teamName && (
                      <div className="text-xs font-mono text-gray-400 bg-white/5 p-2 rounded-lg">
                        <span className="text-neon-magenta font-bold">Squad: {pass.teamName}</span>
                        {pass.teamMembers && pass.teamMembers.length > 0 && (
                          <span className="text-gray-400 block mt-0.5">
                            Roster: {pass.teamMembers.map((m) => m.name).join(", ")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handlePrint}
                    className="px-5 py-2.5 rounded-xl bg-neon-cyan text-black font-display font-bold text-xs uppercase hover:bg-white transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Printer size={15} /> Print / Save Passes
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
