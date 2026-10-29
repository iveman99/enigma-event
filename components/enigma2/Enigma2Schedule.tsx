"use client";

import React, { useState } from "react";
import { cyberAudio } from "@/lib/audio";

interface Milestone {
  id: string;
  time: string;
  title: string;
  description: string;
  cx: number;
  cy: number;
  stalkTop: number;
  color: string;
  rx: number;
  ry: number;
  titleSize: string;
  descSize: string;
  timeSize: string;
}

const MILESTONES: Milestone[] = [
  {
    id: "reg",
    time: "09:00 AM",
    title: "Registration",
    description: "Kits, Badges & Breakfast",
    cx: 340,
    cy: 260,
    stalkTop: 18,
    color: "#38bdf8",
    rx: 48,
    ry: 16,
    titleSize: "14",
    descSize: "11",
    timeSize: "10",
  },
  {
    id: "inaug",
    time: "09:30 AM",
    title: "Inauguration",
    description: "Keynote & Stage Briefing",
    cx: 485,
    cy: 280,
    stalkTop: 72,
    color: "#60a5fa",
    rx: 46,
    ry: 15.5,
    titleSize: "13.5",
    descSize: "10.5",
    timeSize: "9.5",
  },
  {
    id: "hack",
    time: "10:00 AM",
    title: "Compile Vibes",
    description: "AI Vibe-Coding Hackathon",
    cx: 630,
    cy: 300,
    stalkTop: 128,
    color: "#06b6d4",
    rx: 44,
    ry: 15,
    titleSize: "13",
    descSize: "10.5",
    timeSize: "9.5",
  },
  {
    id: "blind",
    time: "01:00 PM",
    title: "Blind Code",
    description: "Screen Blackout Challenge",
    cx: 775,
    cy: 320,
    stalkTop: 182,
    color: "#d946ef",
    rx: 42,
    ry: 14.5,
    titleSize: "12.5",
    descSize: "10",
    timeSize: "9",
  },
  {
    id: "fifa",
    time: "02:00 PM",
    title: "FIFA & Cryptic",
    description: "Esports & Campus Hunt",
    cx: 920,
    cy: 340,
    stalkTop: 236,
    color: "#10b981",
    rx: 40,
    ry: 14,
    titleSize: "12",
    descSize: "10",
    timeSize: "9",
  },
  {
    id: "awards",
    time: "04:30 PM",
    title: "Awards Finale",
    description: "₹44,000 Vault Distribution",
    cx: 1065,
    cy: 360,
    stalkTop: 282,
    color: "#f59e0b",
    rx: 38,
    ry: 13.5,
    titleSize: "11.5",
    descSize: "9.5",
    timeSize: "8.5",
  },
];

export default function Enigma2Schedule() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="schedule" className="py-14 sm:py-20 relative overflow-hidden bg-[#06080e] select-none text-gray-100">
      {/* Top Laser Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

      {/* Cyber Ambient Lighting Spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Slide Container (Generous padding so floating docks never overlap) */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-32 relative z-10">
        
        {/* ============================================================== */}
        {/* PRESENTATION SLIDE (Faithful Dribbble Recreation)               */}
        {/* ============================================================== */}
        <div 
          className="rounded-3xl border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden relative backdrop-blur-2xl"
          style={{
            background: "radial-gradient(circle at 85% 15%, rgba(244, 114, 182, 0.15), transparent 45%), radial-gradient(circle at 15% 85%, rgba(56, 189, 248, 0.12), transparent 45%), #0c101d",
          }}
        >
          
          {/* SLIDE INNER CONTENT */}
          <div className="p-6 sm:p-10 lg:p-12 relative z-10">
            
            {/* TOP ROW: LEFT HEADING & BIG DATE/TIMINGS + RIGHT STAT CARD */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
              
              {/* Left Column: Eyebrow, Heading & BIG Date/Timings (No sloppy words) */}
              <div className="space-y-4 shrink-0">
                <div>
                  <h2 className="font-[family-name:var(--font-orbitron)] font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.05]">
                    Event <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">
                      Timeline.
                    </span>
                  </h2>
                </div>

                {/* BIG DATE & TIMINGS: 09:00 - 05:30 PM IN BIG CYBER FONT */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-1">
                  <div>
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase block">
                      DATE
                    </span>
                    <div className="font-[family-name:var(--font-orbitron)] font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-wider mt-0.5">
                      16 JAN 2027
                    </div>
                  </div>

                  <div className="w-px h-9 bg-white/20 hidden sm:block" />

                  <div>
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] sm:text-[11px] font-bold text-cyan-400 tracking-[0.2em] uppercase block">
                      TIMINGS
                    </span>
                    <div className="font-[family-name:var(--font-orbitron)] font-black text-xl sm:text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300 tracking-wider mt-0.5 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                      09:00 — 05:30 <span className="text-sm sm:text-base font-bold text-cyan-400">PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: "XX" Floating Stat Card */}
              <div className="w-full sm:w-72 lg:w-80 shrink-0 p-4 sm:p-5 rounded-2xl bg-white/[0.05] border border-white/15 backdrop-blur-xl shadow-xl flex items-center gap-4 hover:border-amber-400/50 transition-all duration-300">
                <div className="font-[family-name:var(--font-orbitron)] font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] shrink-0">
                  ₹44K
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-white uppercase tracking-wider text-[11px]">
                    Total Prize Vault
                  </div>
                  <p className="text-gray-400 font-[family-name:var(--font-jetbrains-mono)] text-[10px] leading-tight">
                    Cash bounties, trophies & merit certificates across 4 live arenas.
                  </p>
                </div>
              </div>

            </div>

            {/* ============================================================== */}
            {/* CENTER: CHAINED RINGS (NO SCROLL - FULLY RESPONSIVE VECTOR)    */}
            {/* ============================================================== */}
            <div className="mt-4 w-full relative">
              <svg
                viewBox="0 0 1200 410"
                className="w-full h-auto block select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="dribbbleChainGrad" x1="320" y1="240" x2="1100" y2="380" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#06b6d4" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#d946ef" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.95" />
                  </linearGradient>

                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 1. Underlying Connecting Chain Link between rings */}
                {MILESTONES.map((item, i) => {
                  if (i === MILESTONES.length - 1) return null;
                  const next = MILESTONES[i + 1];
                  return (
                    <line
                      key={`link-${i}`}
                      x1={item.cx + item.rx * 0.72}
                      y1={item.cy + 5}
                      x2={next.cx - next.rx * 0.72}
                      y2={next.cy - 5}
                      stroke="url(#dribbbleChainGrad)"
                      strokeWidth="2"
                      opacity="0.55"
                    />
                  );
                })}

                {/* 2. Chained Isometric Rings with Descending Sizes */}
                {MILESTONES.map((item, i) => {
                  const isHovered = hoveredId === item.id;
                  return (
                    <g 
                      key={`ring-${i}`} 
                      filter={isHovered ? "url(#softGlow)" : undefined}
                      className="cursor-pointer"
                      onMouseEnter={() => {
                        setHoveredId(item.id);
                        cyberAudio.playHover();
                      }}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Outer Glow Ellipse */}
                      <ellipse
                        cx={item.cx}
                        cy={item.cy}
                        rx={isHovered ? item.rx + 4 : item.rx}
                        ry={isHovered ? item.ry + 2 : item.ry}
                        stroke={isHovered ? "#ffffff" : item.color}
                        strokeWidth={isHovered ? "2.5" : "1.8"}
                        fill="rgba(8, 12, 22, 0.75)"
                        opacity={isHovered ? 1 : 0.8}
                        className="transition-all duration-300"
                      />
                      {/* Inner Concentric Ring */}
                      <ellipse
                        cx={item.cx}
                        cy={item.cy}
                        rx={item.rx * 0.75}
                        ry={item.ry * 0.7}
                        stroke={item.color}
                        strokeWidth="1"
                        opacity="0.45"
                      />
                      {/* Center Point */}
                      <circle
                        cx={item.cx}
                        cy={item.cy}
                        r={isHovered ? "3.5" : "2.5"}
                        fill={item.color}
                      />
                    </g>
                  );
                })}

                {/* 3. Tall Descending Vertical Stalk Lines & Anchors (Starts Much Bigger) */}
                {MILESTONES.map((item, i) => {
                  const isHovered = hoveredId === item.id;
                  return (
                    <g key={`stalk-${i}`}>
                      <line
                        x1={item.cx}
                        y1={item.cy - item.ry}
                        x2={item.cx}
                        y2={item.stalkTop}
                        stroke={isHovered ? item.color : "rgba(255, 255, 255, 0.45)"}
                        strokeWidth={isHovered ? "2" : "1.5"}
                        className="transition-all duration-300"
                      />
                      {/* Top Anchor Dot */}
                      <circle
                        cx={item.cx}
                        cy={item.stalkTop}
                        r="2.8"
                        fill={isHovered ? item.color : "#ffffff"}
                      />
                    </g>
                  );
                })}

                {/* 4. Vector-Locked Text Labels with Cyber Font Styling */}
                {MILESTONES.map((item, i) => {
                  const isHovered = hoveredId === item.id;
                  return (
                    <g
                      key={`text-${i}`}
                      className="cursor-pointer"
                      onMouseEnter={() => {
                        setHoveredId(item.id);
                        cyberAudio.playHover();
                      }}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Line 1: Title (Orbitron Bold Cyber Font) */}
                      <text
                        x={item.cx + 12}
                        y={item.stalkTop + 14}
                        fill={isHovered ? "#fbbf24" : "#ffffff"}
                        fontFamily="var(--font-orbitron), sans-serif"
                        fontWeight="800"
                        fontSize={item.titleSize}
                        letterSpacing="0.02em"
                        className="transition-colors duration-200"
                      >
                        {item.title}
                      </text>

                      {/* Line 2: Description (JetBrains Mono) */}
                      <text
                        x={item.cx + 12}
                        y={item.stalkTop + 29}
                        fill={isHovered ? "#e2e8f0" : "#94a3b8"}
                        fontFamily="var(--font-jetbrains-mono), monospace"
                        fontWeight="500"
                        fontSize={item.descSize}
                        letterSpacing="0.01em"
                        className="transition-colors duration-200"
                      >
                        {item.description}
                      </text>

                      {/* Line 3: Time Tag (JetBrains Mono Bold) */}
                      <text
                        x={item.cx + 12}
                        y={item.stalkTop + 43}
                        fill={item.color}
                        fontFamily="var(--font-jetbrains-mono), monospace"
                        fontWeight="700"
                        fontSize={item.timeSize}
                        letterSpacing="0.05em"
                      >
                        {item.time}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
