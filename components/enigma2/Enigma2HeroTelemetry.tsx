"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, Sparkles, ArrowUpRight } from "lucide-react";
import { cyberAudio } from "@/lib/audio";

interface Enigma2HeroTelemetryProps {
  className?: string;
}

export default function Enigma2HeroTelemetry({ className = "" }: Enigma2HeroTelemetryProps) {
  const scrollTo = (id: string) => {
    cyberAudio.playClick();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative select-none pointer-events-auto ${className}`}
    >
      {/* Outer Glow Halo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity" />

      {/* Main HUD Container - Optimized for Right-Side Landscape */}
      <div className="relative w-full max-w-[310px] sm:max-w-[330px] rounded-2xl bg-[#07090e]/88 border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,0,0,0.7)] p-3 sm:p-3.5 overflow-hidden">
        {/* Futuristic Corner Tech Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400/80 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400/80 rounded-br-sm pointer-events-none" />

        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

        {/* Top Header Pill Bar */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] font-[family-name:var(--font-orbitron)] font-bold text-gray-300 tracking-[0.22em] uppercase">
              TECHFEST INTEL
            </span>
          </div>

          <div className="flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-mono text-amber-300/90 font-semibold tracking-wider">
            <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
            <span>2027 CONCLAVE</span>
          </div>
        </div>

        {/* Dual Telemetry Modules (Prize Pool + Event Date) - Stacked for clean right-side footprint */}
        <div className="flex flex-col gap-2.5">
          {/* Module 1: TOTAL PRIZE POOL */}
          <div
            onClick={() => scrollTo("events")}
            className="group/prize relative cursor-pointer rounded-xl bg-gradient-to-r from-amber-500/15 via-[#0b0e17]/80 to-[#0b0e17]/90 border border-amber-500/30 hover:border-amber-400/80 p-2.5 sm:p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(251,191,36,0.3)]"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Trophy className="w-2.5 h-2.5 text-amber-400" />
                </div>
                <span className="text-[8.5px] sm:text-[9.5px] font-[family-name:var(--font-orbitron)] font-bold text-amber-300 tracking-[0.18em] uppercase">
                  TOTAL PRIZE POOL
                </span>
              </div>
              <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover/prize:text-amber-300 transition-colors" />
            </div>

            <div className="text-2xl sm:text-3xl font-[family-name:var(--font-orbitron)] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 tracking-wider leading-none drop-shadow-[0_2px_15px_rgba(251,191,36,0.4)]">
              ₹44,000
            </div>

            <div className="mt-1 text-[8px] sm:text-[9px] font-sans font-medium text-gray-400 flex items-center gap-1.5">
              <span className="text-amber-400 font-semibold">CASH POOL</span>
              <span className="text-gray-600">•</span>
              <span>BOUNTIES & AWARDS</span>
            </div>
          </div>

          {/* Module 2: EVENT DATE */}
          <div
            onClick={() => scrollTo("schedule")}
            className="group/date relative cursor-pointer rounded-xl bg-gradient-to-r from-cyan-500/15 via-[#0b0e17]/80 to-[#0b0e17]/90 border border-cyan-500/30 hover:border-cyan-400/80 p-2.5 sm:p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Calendar className="w-2.5 h-2.5 text-cyan-400" />
                </div>
                <span className="text-[8.5px] sm:text-[9.5px] font-[family-name:var(--font-orbitron)] font-bold text-cyan-300 tracking-[0.18em] uppercase">
                  EVENT DATE
                </span>
              </div>
              <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover/date:text-cyan-300 transition-colors" />
            </div>

            <div className="text-2xl sm:text-3xl font-[family-name:var(--font-orbitron)] font-black text-white tracking-wider leading-none drop-shadow-[0_2px_15px_rgba(6,182,212,0.4)] group-hover/date:text-cyan-200 transition-colors">
              16 JAN 2027
            </div>

            <div className="mt-1 text-[8px] sm:text-[9px] font-sans font-medium text-gray-400 flex items-center gap-1.5">
              <span className="text-cyan-400 font-semibold">SATURDAY</span>
              <span className="text-gray-600">•</span>
              <span>1-DAY HYBRID MARATHON</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
