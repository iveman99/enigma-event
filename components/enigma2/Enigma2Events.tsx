"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Code, 
  Binary, 
  Compass, 
  Gamepad2, 
  Users, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Phone, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  Award
} from "lucide-react";
import { ENIGMA2_EVENTS, Enigma2Event } from "@/lib/enigma2Data";
import { useAuth } from "@/lib/authContext";
import { cyberAudio } from "@/lib/audio";
import Image from "next/image";
import Enigma2AcrylicCard from "./Enigma2AcrylicCard";

interface Enigma2EventsProps {
  onSelectEventForRegister: (eventId: string) => void;
}

export default function Enigma2Events({ onSelectEventForRegister }: Enigma2EventsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { user, myRegistrations } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeEventModal, setActiveEventModal] = useState<Enigma2Event | null>(null);

  const handleSelectTrack = (trackId: string) => {
    const el = document.getElementById(`event-card-${trackId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-cyan-400", "scale-[1.02]");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-cyan-400", "scale-[1.02]");
      }, 1400);
    }
  };

  // Parallax scroll for the Futuristic Competition Arena Background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.08]);

  const categories = ["All", "Coding", "Problem Solving", "Gaming"];

  // Filter 4 core competitive arena events (The Arcade is featured in its own dedicated section)
  const filteredEvents = ENIGMA2_EVENTS.filter((e) => {
    if (e.id === "the-arcade") return false;
    if (selectedCategory === "All") return true;
    return e.category === selectedCategory;
  });

  // Track-specific themes, colors, and iconography
  const eventThemes: Record<
    string,
    {
      icon: React.ComponentType<{ className?: string; size?: number }>;
      accentName: string;
      glowColor: string;
      cardBorder: string;
      iconBg: string;
      iconColor: string;
      tagBg: string;
      tagText: string;
      tagBorder: string;
      exploreBtn: string;
      registerBtn: string;
      hoverGlow: string;
    }
  > = {
    "compile-vibes": {
      icon: Code,
      accentName: "Electric Cyan",
      glowColor: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      cardBorder: "border-cyan-500/25 hover:border-cyan-400/60",
      iconBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
      iconColor: "text-cyan-400",
      tagBg: "bg-cyan-950/60",
      tagText: "text-cyan-300",
      tagBorder: "border-cyan-500/30",
      exploreBtn: "text-cyan-300 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/30 hover:bg-cyan-900/40",
      registerBtn: "bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]",
      hoverGlow: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.18)]",
    },
    "blind-dates": {
      icon: Binary,
      accentName: "Neon Magenta",
      glowColor: "from-fuchsia-500/20 via-fuchsia-500/5 to-transparent",
      cardBorder: "border-fuchsia-500/25 hover:border-fuchsia-400/60",
      iconBg: "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400",
      iconColor: "text-fuchsia-400",
      tagBg: "bg-fuchsia-950/60",
      tagText: "text-fuchsia-300",
      tagBorder: "border-fuchsia-500/30",
      exploreBtn: "text-fuchsia-300 hover:text-white border-fuchsia-500/30 hover:border-fuchsia-400 bg-fuchsia-950/30 hover:bg-fuchsia-900/40",
      registerBtn: "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.35)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)]",
      hoverGlow: "group-hover:shadow-[0_0_40px_rgba(217,70,239,0.18)]",
    },
    "decode-hunt": {
      icon: Compass,
      accentName: "Cyber Violet",
      glowColor: "from-purple-500/20 via-purple-500/5 to-transparent",
      cardBorder: "border-purple-500/25 hover:border-purple-400/60",
      iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      iconColor: "text-purple-400",
      tagBg: "bg-purple-950/60",
      tagText: "text-purple-300",
      tagBorder: "border-purple-500/30",
      exploreBtn: "text-purple-300 hover:text-white border-purple-500/30 hover:border-purple-400 bg-purple-950/30 hover:bg-purple-900/40",
      registerBtn: "bg-gradient-to-r from-purple-500 to-violet-400 hover:from-purple-400 hover:to-violet-300 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]",
      hoverGlow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.18)]",
    },
    "fifa-addicts": {
      icon: Gamepad2,
      accentName: "Neon Emerald",
      glowColor: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      cardBorder: "border-emerald-500/25 hover:border-emerald-400/60",
      iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      iconColor: "text-emerald-400",
      tagBg: "bg-emerald-950/60",
      tagText: "text-emerald-300",
      tagBorder: "border-emerald-500/30",
      exploreBtn: "text-emerald-300 hover:text-white border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40",
      registerBtn: "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]",
      hoverGlow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.18)]",
    },
  };

  return (
    <section
      id="events"
      ref={sectionRef}
      className="py-24 sm:py-32 relative overflow-hidden bg-[#07080b] select-none"
    >
      {/* 1. Cinematic Arena Background - High-Tech Battleground Stadium */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none"
      >
        <Image
          src="/images/enigma2-events-bg.jpg"
          alt="ENIGMA 2.0 Competition Battleground Arena"
          fill
          className="object-cover object-center opacity-40"
          priority={false}
          quality={95}
        />
        {/* Arena lighting and seamless blends */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080b] via-[#07080b]/55 to-[#07080b]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080b]/85 via-transparent to-[#07080b]/85" />
        {/* Dynamic arena ambient spotlights */}
        <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/5 w-[500px] h-[500px] bg-fuchsia-500/12 rounded-full blur-[140px] pointer-events-none" />
      </motion.div>

      {/* Top Transition Boundary Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none z-10" />

      {/* Fine Sci-Fi Perspective Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 2xl:px-32 relative z-20 space-y-12 sm:space-y-14">
        {/* Section Header - Futuristic Battleground Briefing */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="font-[family-name:var(--font-orbitron)] text-[10px] sm:text-xs font-bold text-cyan-300 tracking-[0.25em] uppercase">
              COMPETITION ARENA // 4 LIVE TRACKS
            </span>
          </div>

          {/* Monumental Headline */}
          <h2 className="font-[family-name:var(--font-orbitron)] font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            ENTER THE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]">
              BATTLEGROUNDS.
            </span>
          </h2>

          <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed">
            Four distinct cyber proving grounds crafted to test raw algorithmic reflexes, AI prompt orchestration, cryptic deduction, and high-stakes console esports.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  cyberAudio.playClick();
                }}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-[family-name:var(--font-orbitron)] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer backdrop-blur-md ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-cyan-500 to-sky-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-[1.02]"
                    : "bg-black/40 text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Events Grid - 4 Bespoke 3D Acrylic Glass Box Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 pt-4 justify-items-center">
          {filteredEvents.map((event, idx) => {
            const isRegistered = myRegistrations.some((r) => r.event_id === event.id && r.status !== "rejected");

            return (
              <Enigma2AcrylicCard
                key={event.id}
                event={event}
                isRegistered={isRegistered}
                user={user}
                onExplore={() => {
                  setActiveEventModal(event);
                  cyberAudio.playClick();
                }}
                onRegister={() => {
                  cyberAudio.playClick();
                  onSelectEventForRegister(event.id);
                }}
                idx={idx}
              />
            );
          })}
        </div>
      </div>

      {/* Rules & Operational Protocol Specification Modal */}
      <AnimatePresence>
        {activeEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            {/* Backdrop click dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEventModal(null)}
              className="absolute inset-0 cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(6,182,212,0.25)] z-10"
            >
              {/* Modal Top Header */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                      EVENT SPECIFICATION // {activeEventModal.category}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-[family-name:var(--font-orbitron)] font-bold text-white mt-1">
                    {activeEventModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveEventModal(null)}
                  className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-5">
                {/* Overview Narrative */}
                <div>
                  <h4 className="text-xs font-[family-name:var(--font-orbitron)] text-cyan-300 font-bold uppercase tracking-wider mb-2">
                    CHALLENGE MISSION BRIEF
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed font-sans">
                    {activeEventModal.fullDescription}
                  </p>
                </div>

                {/* Event Key Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono">
                  <div>
                    <span className="text-gray-400 text-[10px] block">CATEGORY</span>
                    <span className="text-white font-bold">{activeEventModal.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">PARTICIPATION</span>
                    <span className="text-white font-bold">{activeEventModal.badge}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">SCHEDULE</span>
                    <span className="text-cyan-300 font-bold">{activeEventModal.schedule}</span>
                  </div>
                </div>

                {/* Rules & Guidelines */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-[family-name:var(--font-orbitron)] text-fuchsia-300 font-bold uppercase tracking-wider">
                    OPERATIONAL RULES & COMBAT PROTOCOLS:
                  </h4>
                  <ul className="space-y-2 text-xs font-mono text-gray-300">
                    {activeEventModal.rules.map((rule, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                      >
                        <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coordinators Contact Box */}
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <h4 className="text-xs font-[family-name:var(--font-orbitron)] text-gray-400 font-bold uppercase tracking-wider">
                    EVENT FIELD COORDINATORS:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeEventModal.coordinators.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{c.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{c.role}</p>
                        </div>
                        <a
                          href={`tel:${c.phone}`}
                          onClick={() => cyberAudio.playClick()}
                          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 transition-colors"
                        >
                          <Phone size={12} /> {c.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveEventModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-gray-300 font-mono text-xs hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = activeEventModal.id;
                    setActiveEventModal(null);
                    onSelectEventForRegister(id);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-[family-name:var(--font-orbitron)] font-bold text-xs uppercase shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all flex items-center gap-2"
                >
                  <span>REGISTER FOR CHALLENGE</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
