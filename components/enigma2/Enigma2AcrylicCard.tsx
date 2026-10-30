"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Users, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Clock,
  Code,
  Terminal,
  Compass,
  Gamepad2
} from "lucide-react";
import { Enigma2Event } from "@/lib/enigma2Data";
import { cyberAudio } from "@/lib/audio";

interface Enigma2AcrylicCardProps {
  event: Enigma2Event;
  isRegistered: boolean;
  user: any;
  onExplore: () => void;
  onRegister: () => void;
  idx: number;
}

export default function Enigma2AcrylicCard({
  event,
  isRegistered,
  user,
  onExplore,
  onRegister,
  idx,
}: Enigma2AcrylicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Natural 3D tilt perspective matching reference photo:
  // Shows LEFT face (connected to wall mount) and BOTTOM face, while keeping the FRONT face clearly facing the viewer!
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 26, stiffness: 140 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Resting orientation: rotateX = +5.5deg (reveals bottom face), rotateY = -7.5deg (reveals LEFT face & wall mount!)
  // Mouse hover provides dynamic micro-parallax while preserving front-facing readability
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [9.5, 1.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12.5, -3.5]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["25%", "75%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["25%", "75%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    cyberAudio.playHover();
  };

  // Event specific theme configurations
  const getTheme = () => {
    switch (event.id) {
      case "compile-vibes":
        return {
          icon: Code,
          accentColor: "text-cyan-400",
          glowColor: "rgba(6, 182, 212, 0.25)",
          tagBg: "bg-cyan-950/70 text-cyan-300 border-cyan-500/40",
          iconBg: "bg-cyan-500/15 border-cyan-500/40 text-cyan-300",
          exploreBtn: "text-cyan-300 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/40",
          registerBtn: "bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]",
          trackNumber: "TRACK 01",
          summary: "Build and deploy a functional prototype in 2.5 hours using smart AI prompt engineering and modern toolchains.",
        };
      case "blind-dates":
        return {
          icon: Terminal,
          accentColor: "text-fuchsia-400",
          glowColor: "rgba(217, 70, 239, 0.25)",
          tagBg: "bg-fuchsia-950/70 text-fuchsia-300 border-fuchsia-500/40",
          iconBg: "bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300",
          exploreBtn: "text-fuchsia-300 hover:text-white border-fuchsia-500/30 hover:border-fuchsia-400 bg-fuchsia-950/40",
          registerBtn: "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]",
          trackNumber: "TRACK 02",
          summary: "Tackle 3 progressive algorithmic rounds with your monitor powered down. Pure syntax memory and cognitive recursion.",
        };
      case "decode-hunt":
        return {
          icon: Compass,
          accentColor: "text-purple-400",
          glowColor: "rgba(168, 85, 247, 0.25)",
          tagBg: "bg-purple-950/70 text-purple-300 border-purple-500/40",
          iconBg: "bg-purple-500/15 border-purple-500/40 text-purple-300",
          exploreBtn: "text-purple-300 hover:text-white border-purple-500/30 hover:border-purple-400 bg-purple-950/40",
          registerBtn: "bg-gradient-to-r from-purple-500 to-violet-400 hover:from-purple-400 hover:to-violet-300 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]",
          trackNumber: "TRACK 03",
          summary: "Campus-wide clue-solving race. Decrypt ciphers, find physical and digital checkpoints, and race against the clock.",
        };
      case "fifa-addicts":
      default:
        return {
          icon: Gamepad2,
          accentColor: "text-emerald-400",
          glowColor: "rgba(16, 185, 129, 0.25)",
          tagBg: "bg-emerald-950/70 text-emerald-300 border-emerald-500/40",
          iconBg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
          exploreBtn: "text-emerald-300 hover:text-white border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/40",
          registerBtn: "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]",
          trackNumber: "TRACK 04",
          summary: "EA Sports FIFA Mobile esports tournament. Single-elimination knockout brackets where tactical speed crowns the champion.",
        };
    }
  };

  const theme = getTheme();
  const EventIcon = theme.icon;

  // Box depth is 76px (half-depth = 38px)
  const depth = 76;
  const halfDepth = 38;

  return (
    <motion.div
      id={`event-card-${event.id}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: idx * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full flex justify-center py-6 sm:py-8 px-4 sm:px-6 select-none"
    >
      {/* 3D Perspective Scene Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[480px] flex items-center justify-center cursor-default group"
        style={{ perspective: 1200 }}
      >
        {/* Architectural Wall Mounting Bracket (Cantilever arm connecting to Left Acrylic Face) */}
        <div className="hidden sm:flex items-center absolute -left-8 top-1/2 -translate-y-1/2 z-0 pointer-events-none">
          {/* Wall plate with chrome bolts */}
          <div className="w-2.5 h-28 bg-gradient-to-r from-[#121620] via-[#252f40] to-[#121620] rounded-sm border border-white/25 shadow-2xl flex flex-col justify-between py-2 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-black shadow-inner" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-black shadow-inner" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-black shadow-inner" />
          </div>
          {/* Cantilever arm extending into the 3D acrylic box */}
          <div className="w-8 h-4.5 bg-gradient-to-b from-[#2e3748] via-[#1c222e] to-[#10141d] border-t border-b border-white/30 shadow-lg" />
        </div>

        {/* Realistic 3D Cast Shadow (projecting downwards and to the right) */}
        <div className="absolute -bottom-8 left-10 w-[85%] h-14 bg-black/85 blur-2xl rounded-full pointer-events-none" />

        {/* TRUE 6-SIDED 3D TRANSPARENT ACRYLIC GLASS CUBE */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full min-h-[430px] rounded-2xl"
        >
          {/* 1. TOP ACRYLIC FACE (Tilted 90deg, forming glossy acrylic ceiling) */}
          <div
            className="absolute left-0 right-0 pointer-events-none rounded-t-xl"
            style={{
              height: `${depth}px`,
              top: `-${halfDepth}px`,
              transform: "rotateX(90deg)",
              transformOrigin: "center",
              background:
                "linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 70%, rgba(255, 255, 255, 0.22) 100%)",
              border: "1.8px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* 2. LEFT ACRYLIC FACE (Tilted 90deg, connects to the wall mounting bracket) */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none rounded-l-xl flex flex-col justify-between items-center py-6 overflow-hidden"
            style={{
              width: `${depth}px`,
              left: `-${halfDepth}px`,
              transform: "rotateY(-90deg)",
              transformOrigin: "center",
              background:
                "linear-gradient(to right, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.22) 100%)",
              border: "1.8px solid rgba(255, 255, 255, 0.55)",
              boxShadow: "inset 0 0 25px rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Top acrylic corner highlight */}
            <div className="w-full h-1 bg-white/40" />

            {/* Micro typography stamped on the side acrylic face (inspired by Loom Coffee label in photo) */}
            <div className="transform -rotate-90 whitespace-nowrap text-[9px] font-mono tracking-[0.28em] text-white/50 uppercase font-bold">
              {theme.trackNumber} • ENIGMA 2.0
            </div>

            {/* Wall clamp receiver anchor on left face */}
            <div className="w-5 h-6 bg-gradient-to-r from-[#1c222e] to-[#2e3748] border border-white/30 rounded-sm shadow-md" />

            {/* Bottom acrylic corner highlight */}
            <div className="w-full h-1 bg-white/40" />
          </div>

          {/* 3. RIGHT ACRYLIC FACE */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none rounded-r-xl"
            style={{
              width: `${depth}px`,
              right: `-${halfDepth}px`,
              transform: "rotateY(90deg)",
              transformOrigin: "center",
              background:
                "linear-gradient(to left, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.04) 100%)",
              border: "1.5px solid rgba(255, 255, 255, 0.35)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* 4. BOTTOM ACRYLIC FACE (Revealed by +rotateX, looking like a real glass floor) */}
          <div
            className="absolute left-0 right-0 pointer-events-none rounded-b-xl flex items-center justify-center overflow-hidden"
            style={{
              height: `${depth}px`,
              bottom: `-${halfDepth}px`,
              transform: "rotateX(-90deg)",
              transformOrigin: "center",
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(255, 255, 255, 0.16) 100%)",
              border: "1.8px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "inset 0 0 25px rgba(255, 255, 255, 0.18)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Subtle light caustics line on bottom acrylic floor */}
            <div className="w-3/4 h-px bg-white/30 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>

          {/* 5. BACK ACRYLIC FACE (Frosted rear panel with ambient color aura) */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              transform: `translateZ(-${halfDepth}px) rotateY(180deg)`,
              background:
                "linear-gradient(to bottom, #090e1a 0%, #050810 100%)",
              border: "1.5px solid rgba(255, 255, 255, 0.2)",
              boxShadow: `inset 0 0 45px ${theme.glowColor}`,
            }}
          />

          {/* 6. FRONT ACRYLIC GLASS FACE (The crystal-clear front showcase panel) */}
          <div
            className="relative w-full h-full rounded-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-[20px_30px_60px_rgba(0,0,0,0.85)]"
            style={{
              transform: `translateZ(${halfDepth}px)`,
              background:
                "linear-gradient(135deg, rgba(14, 20, 34, 0.86) 0%, rgba(8, 12, 22, 0.9) 100%)",
              border: "2px solid rgba(255, 255, 255, 0.55)",
              boxShadow:
                "inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.6), 0 25px 50px rgba(0,0,0,0.8)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* 4 Precision Corner Glass Standoff Brackets: ⌜ ⌝ ⌞ ⌟ */}
            <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-white/85 pointer-events-none z-30 drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
            <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-white/85 pointer-events-none z-30 drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
            <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-white/85 pointer-events-none z-30 drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
            <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-white/85 pointer-events-none z-30 drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]" />

            {/* Specular Diagonal Glass Glare Reflection Sweep */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-700"
              style={{
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 25%, transparent 50%, rgba(255,255,255,0.1) 80%, transparent 100%)",
              }}
            />

            {/* Dynamic Interactive Glare Highlight tracking cursor */}
            <motion.div
              className="absolute w-48 h-48 rounded-full bg-white/12 blur-3xl pointer-events-none"
              style={{
                left: glareX,
                top: glareY,
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Floating Internal Display Content */}
            <div className="space-y-5 relative z-10">
              {/* Top HUD Row */}
              <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${theme.tagBg} border shadow-sm`}
                  >
                    {event.category}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-gray-400 tracking-wider">
                    {theme.trackNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold text-[10px] tracking-wide shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                    {event.prizePool} PRIZE
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                    <span className="text-[10px] font-mono font-bold text-emerald-300 tracking-wider">
                      {event.fee}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Icon Lockup */}
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-13 h-13 rounded-2xl ${theme.iconBg} border flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  <EventIcon size={26} className={theme.accentColor} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-[family-name:var(--font-orbitron)] font-bold text-2xl sm:text-[26px] text-white tracking-tight group-hover:text-cyan-100 transition-colors leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {event.title}
                  </h3>
                  <p className="text-[11px] font-mono text-gray-400 flex items-center gap-2">
                    <span className="text-gray-200 font-semibold">{event.badge}</span>
                    <span>•</span>
                    <span className="text-cyan-300 flex items-center gap-1">
                      <Clock size={12} />
                      <span>{event.schedule}</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Event Description (Clean, Human, No Buzzwords) */}
              <p className="text-gray-300 font-sans text-xs sm:text-sm leading-relaxed">
                {theme.summary}
              </p>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-white/10 text-xs font-mono text-gray-300">
                <div className="flex items-center gap-2 bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
                  <Users size={14} className={theme.accentColor} />
                  <span className="truncate">
                    {event.minTeamSize === event.maxTeamSize
                      ? `${event.minTeamSize} Player`
                      : `${event.minTeamSize}-${event.maxTeamSize} Players`}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
                  <MapPin size={14} className="text-amber-400" />
                  <span className="truncate">UDCS Kalina</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    onExplore();
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-[family-name:var(--font-orbitron)] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${theme.exploreBtn}`}
                >
                  <span>EXPLORE EVENT</span>
                  <ChevronRight size={14} />
                </button>

                {isRegistered ? (
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      onRegister();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-[family-name:var(--font-orbitron)] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    <CheckCircle2 size={15} />
                    <span>ENTRY SUBMITTED</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      onRegister();
                    }}
                    className={`px-5 py-2.5 rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${theme.registerBtn}`}
                  >
                    <span>{user ? "REGISTER" : "REGISTER NOW"}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
