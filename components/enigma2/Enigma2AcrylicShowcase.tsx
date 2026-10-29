"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, RefreshCw, Trophy, Flame, Zap, Check } from "lucide-react";
import { cyberAudio } from "@/lib/audio";

interface Enigma2AcrylicShowcaseProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectTrack?: (eventId: string) => void;
}

interface ShowcaseCup {
  id: string;
  title: string;
  category: string;
  x: number; // percentage in box
  y: number; // percentage in box
  rotate: number; // degrees
  scale: number;
  zIndex: number;
  lidColor: string;
  bodyColor: string;
  patternType: "leaf" | "mountain" | "tree" | "stripes" | "logo" | "crest" | "waves" | "dots";
  accentColor: string;
  trackId?: string;
  prize?: string;
}

export default function Enigma2AcrylicShowcase({
  activeCategory,
  onSelectCategory,
  onSelectTrack,
}: Enigma2AcrylicShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [hoveredCup, setHoveredCup] = useState<string | null>(null);

  // Mouse tilt physics for the 3D acrylic box
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 140 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-16, 16]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["20%", "80%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredCup(null);
  };

  const triggerShake = () => {
    cyberAudio.playClick();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 900);
  };

  // The collection of stylish aesthetic cups nestled inside the acrylic cube
  // Styled directly after the reference image (terracotta, mint, lilac, mustard, cream, blush)
  const cups: ShowcaseCup[] = [
    // 1. Center upright cup (The Hero Coffee/Code Cup with Botanical Leaf)
    {
      id: "compile-vibes-cup",
      trackId: "compile-vibes",
      title: "Compile The Vibes",
      category: "Coding",
      x: 38,
      y: 28,
      rotate: 4,
      scale: 1.05,
      zIndex: 20,
      lidColor: "#d9653b", // Terracotta
      bodyColor: "#f7f4ed", // Cream
      patternType: "leaf",
      accentColor: "#b24d27",
      prize: "₹6,000",
    },
    // 2. Center-bottom upright cup with mountain graphic
    {
      id: "blind-dates-cup",
      trackId: "blind-dates",
      title: "Blind Date with Code",
      category: "Coding",
      x: 35,
      y: 52,
      rotate: -3,
      scale: 1.02,
      zIndex: 22,
      lidColor: "#d9653b",
      bodyColor: "#fdfbf7",
      patternType: "mountain",
      accentColor: "#cb5a30",
      prize: "₹4,500",
    },
    // 3. Right cup with acacia safari tree graphic
    {
      id: "decode-hunt-cup",
      trackId: "decode-hunt",
      title: "Decode The Hunt",
      category: "Problem Solving",
      x: 58,
      y: 55,
      rotate: 7,
      scale: 0.98,
      zIndex: 18,
      lidColor: "#6abda6", // Pastel mint
      bodyColor: "#faf6ee",
      patternType: "tree",
      accentColor: "#d48b28",
      prize: "₹3,500",
    },
    // 4. Right upper cup with lilac mountain
    {
      id: "fifa-addicts-cup",
      trackId: "fifa-addicts",
      title: "FIFA Console Esports",
      category: "Gaming",
      x: 57,
      y: 38,
      rotate: 15,
      scale: 0.95,
      zIndex: 16,
      lidColor: "#a38fc2", // Lavender
      bodyColor: "#f8f5ed",
      patternType: "mountain",
      accentColor: "#8f76b5",
      prize: "₹3,000",
    },
    // 5. Left bottom cup resting on its side with bold ENIGMA branding
    {
      id: "enigma-brand-cup",
      title: "ENIGMA 2.0",
      category: "All",
      x: 23,
      y: 54,
      rotate: -12,
      scale: 0.96,
      zIndex: 19,
      lidColor: "#3da58a", // Teal
      bodyColor: "#f3ede2",
      patternType: "logo",
      accentColor: "#1a1e28",
    },
    // 6. Left top cup with yellow dunes/waves
    {
      id: "top-left-dune-cup",
      title: "Vibe Sprint",
      category: "Coding",
      x: 24,
      y: 24,
      rotate: -8,
      scale: 0.94,
      zIndex: 14,
      lidColor: "#6abda6", // Mint
      bodyColor: "#fcf9f2",
      patternType: "waves",
      accentColor: "#e6b742",
    },
    // 7. Center tilted cup with pastel mint lid
    {
      id: "center-mint-cup",
      title: "Prompt Battle",
      category: "Coding",
      x: 44,
      y: 25,
      rotate: -28,
      scale: 0.88,
      zIndex: 12,
      lidColor: "#5fae98",
      bodyColor: "#f6f1e7",
      patternType: "dots",
      accentColor: "#7bb9a8",
    },
    // 8. Bottom tilted cup with striped shell motif
    {
      id: "bottom-stripes-cup",
      title: "Algorithmic Speed",
      category: "Problem Solving",
      x: 51,
      y: 47,
      rotate: 35,
      scale: 0.92,
      zIndex: 15,
      lidColor: "#d9653b",
      bodyColor: "#f9f6ef",
      patternType: "stripes",
      accentColor: "#b24d27",
    },
    // 9. Round terracotta lid facing directly forward in the center
    {
      id: "center-round-lid",
      title: "Core Token",
      category: "All",
      x: 45,
      y: 63,
      rotate: 0,
      scale: 0.86,
      zIndex: 25,
      lidColor: "#cc6644",
      bodyColor: "#cc6644",
      patternType: "crest",
      accentColor: "#f9f6ef",
      prize: "₹44K POOL",
    },
    // 10. Top right cup with pastel yellow & purple landscape
    {
      id: "top-right-cup",
      title: "Cyber Quest",
      category: "Problem Solving",
      x: 55,
      y: 28,
      rotate: 32,
      scale: 0.9,
      zIndex: 10,
      lidColor: "#e0ad3c",
      bodyColor: "#fbf8f0",
      patternType: "mountain",
      accentColor: "#8f76b5",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive 3D Showcase Presentation */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-4xl py-6 sm:py-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14"
        style={{ perspective: 1200 }}
      >
        {/* Left: The Architectural Wall Mount + 3D Acrylic Glass Box */}
        <div className="relative flex items-center justify-center">
          {/* Architectural Wall Mount Bracket (Cantilever arm from left wall) */}
          <div className="hidden sm:flex items-center absolute -left-16 sm:-left-24 top-1/2 -translate-y-1/2 z-0 pointer-events-none">
            {/* Wall Mount Base Plate with Bolts */}
            <div className="w-3.5 h-36 bg-gradient-to-r from-[#181d28] to-[#252c3c] rounded-sm border-y border-l border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative flex flex-col justify-between py-2 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 border border-black shadow-inner" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 border border-black shadow-inner" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 border border-black shadow-inner" />
            </div>
            {/* Horizontal Steel Cantilever Arm */}
            <div className="w-16 sm:w-20 h-5 bg-gradient-to-b from-[#2e3748] via-[#1c222e] to-[#141922] border-t border-b border-white/20 shadow-2xl relative">
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-r from-transparent to-black/60" />
            </div>
          </div>

          {/* Cast Shadow beneath the 3D Box on the Ground */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-72 sm:w-88 h-12 bg-black/60 blur-2xl rounded-full pointer-events-none" />

          {/* The 3D Acrylic Cube Container */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            animate={
              isShaking
                ? {
                    x: [0, -6, 6, -4, 4, -2, 2, 0],
                    y: [0, -4, 4, -3, 3, -1, 1, 0],
                    rotateZ: [0, -1.5, 1.5, -1, 1, 0],
                  }
                : {}
            }
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={triggerShake}
            className="relative w-[320px] h-[320px] sm:w-[410px] sm:h-[410px] rounded-2xl cursor-pointer group select-none"
          >
            {/* 3D Top Acrylic Face (Perspective lid with specular sky sheen) */}
            <div
              className="absolute -top-7 left-3 right-3 h-8 bg-gradient-to-b from-white/25 via-white/10 to-transparent rounded-t-xl border-t border-x border-white/40 pointer-events-none opacity-80 backdrop-blur-sm"
              style={{
                transform: "rotateX(65deg) translateZ(10px)",
                transformOrigin: "bottom",
              }}
            />

            {/* 3D Left Acrylic Face */}
            <div
              className="absolute -left-6 top-3 bottom-3 w-7 bg-gradient-to-r from-white/20 via-white/5 to-transparent rounded-l-xl border-l border-y border-white/30 pointer-events-none opacity-70 backdrop-blur-sm"
              style={{
                transform: "rotateY(-65deg) translateZ(10px)",
                transformOrigin: "right",
              }}
            />

            {/* Outer Polished Acrylic Glass Bevel Box */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.08] via-white/[0.03] to-white/[0.14] backdrop-blur-md border border-white/40 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_0_30px_rgba(255,255,255,0.12)] transition-all duration-300 group-hover:border-white/60">
              {/* Ultra-clear acrylic double corner brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/60" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/60" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/60" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/60" />

              {/* Specular Diagonal Reflection Streak across Front Glass */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 28%, transparent 50%, rgba(255,255,255,0.08) 85%, transparent 100%)",
                }}
              />

              {/* Dynamic Interactive Glare Highlight */}
              <motion.div
                className="absolute w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none"
                style={{
                  left: glareX,
                  top: glareY,
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Bold Dimensional Text on the Front Glass Face (Like the 'LOOM COFFEE' reference photo!) */}
              <div
                className="absolute top-8 right-8 z-30 pointer-events-none"
                style={{ transform: "translateZ(35px)" }}
              >
                <div className="text-right">
                  <h3
                    className="font-black text-3xl sm:text-4xl tracking-tighter text-[#161a22] drop-shadow-[0_2px_1px_rgba(255,255,255,0.4)]"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      letterSpacing: "-0.05em",
                    }}
                  >
                    ENIGMA
                  </h3>
                  <p
                    className="font-black text-xs sm:text-sm tracking-[0.25em] text-[#222836] drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)] uppercase -mt-1"
                  >
                    ARENA 2.0
                  </p>
                </div>
              </div>

              {/* Secondary Bottom Left Glass Branding */}
              <div
                className="absolute bottom-8 left-8 z-30 pointer-events-none"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
                    LIVE ARENA VAULT
                  </span>
                </div>
              </div>

              {/* Inside the Glass Box: Tumbled Cups & Canisters */}
              <div className="absolute inset-4 overflow-hidden rounded-xl">
                {cups.map((cup) => {
                  const isHovered = hoveredCup === cup.id;
                  const isCategoryActive =
                    activeCategory === "All" || activeCategory === cup.category;
                  const isTrackCup = Boolean(cup.trackId);

                  return (
                    <motion.div
                      key={cup.id}
                      animate={
                        isShaking
                          ? {
                              x: [0, (Math.random() - 0.5) * 14, 0],
                              y: [0, (Math.random() - 0.5) * 12, 0],
                              rotate: [
                                cup.rotate,
                                cup.rotate + (Math.random() - 0.5) * 18,
                                cup.rotate,
                              ],
                            }
                          : {
                              rotate: isHovered ? cup.rotate + 4 : cup.rotate,
                              scale: isHovered ? cup.scale * 1.08 : cup.scale,
                            }
                      }
                      transition={{ duration: 0.4 }}
                      onMouseEnter={() => {
                        setHoveredCup(cup.id);
                        cyberAudio.playHover();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        cyberAudio.playClick();
                        if (cup.trackId && onSelectTrack) {
                          onSelectTrack(cup.trackId);
                        } else if (cup.category) {
                          onSelectCategory(cup.category);
                        }
                      }}
                      style={{
                        position: "absolute",
                        left: `${cup.x}%`,
                        top: `${cup.y}%`,
                        zIndex: cup.zIndex,
                        transform: `translate(-50%, -50%) rotate(${cup.rotate}deg) scale(${cup.scale})`,
                        opacity: isCategoryActive ? 1 : 0.45,
                      }}
                      className={`cursor-pointer transition-opacity duration-300 ${
                        isHovered ? "drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" : "drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]"
                      }`}
                    >
                      {/* Render Cup based on Pattern */}
                      {cup.patternType === "crest" ? (
                        // Special: Round Terracotta Lid facing forward
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#a84d2a] shadow-inner flex flex-col items-center justify-center p-1 relative"
                          style={{ backgroundColor: cup.lidColor }}
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 flex flex-col items-center justify-center text-center">
                            <Trophy size={14} className="text-white drop-shadow" />
                            <span className="text-[8px] font-mono font-bold text-white tracking-tighter">
                              {cup.prize}
                            </span>
                          </div>
                        </div>
                      ) : (
                        // Regular Tapered Coffee Cup / Cyber Canister
                        <div className="relative w-16 sm:w-20 flex flex-col items-center">
                          {/* Cup Lid with Lip */}
                          <div
                            className="w-14 sm:w-17 h-3 rounded-t-md shadow-sm border-t border-x border-black/10 relative z-10"
                            style={{ backgroundColor: cup.lidColor }}
                          >
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-black/15" />
                          </div>
                          {/* Lid Rim Lip */}
                          <div
                            className="w-15 sm:w-18 h-1.5 rounded-full shadow-md -mt-0.5 relative z-10"
                            style={{ backgroundColor: cup.lidColor }}
                          />

                          {/* Tapered Cup Body */}
                          <div
                            className="w-13 sm:w-16 h-20 sm:h-24 relative overflow-hidden shadow-md flex flex-col items-center justify-center p-2"
                            style={{
                              backgroundColor: cup.bodyColor,
                              clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)",
                            }}
                          >
                            {/* Cup Artwork */}
                            {cup.patternType === "leaf" && (
                              <div className="flex flex-col items-center text-center">
                                {/* Hand-drawn style botanical coffee branch */}
                                <svg
                                  viewBox="0 0 24 24"
                                  className="w-8 h-10"
                                  fill="none"
                                  stroke={cup.accentColor}
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M12 2v20" />
                                  <path d="M12 6c3 0 5 2 5 4s-2 4-5 4" />
                                  <path d="M12 14c-3 0-5 2-5 4s2 4 5 4" />
                                  <circle cx="8" cy="8" r="1.5" fill={cup.accentColor} />
                                  <circle cx="16" cy="16" r="1.5" fill={cup.accentColor} />
                                </svg>
                                <span
                                  className="text-[7px] font-mono font-bold uppercase tracking-tighter"
                                  style={{ color: cup.accentColor }}
                                >
                                  COMPILE
                                </span>
                              </div>
                            )}

                            {cup.patternType === "mountain" && (
                              <div className="w-full h-full flex flex-col items-center justify-center">
                                <svg
                                  viewBox="0 0 40 30"
                                  className="w-10 h-8"
                                  fill={cup.accentColor}
                                >
                                  <path d="M5 25 L18 8 L28 20 L35 25 Z" opacity="0.9" />
                                  <path d="M15 25 L26 12 L35 25 Z" opacity="0.6" />
                                </svg>
                                <span
                                  className="text-[7px] font-mono font-bold uppercase tracking-tighter mt-1"
                                  style={{ color: cup.accentColor }}
                                >
                                  {cup.trackId === "blind-dates" ? "BLIND DATE" : "ESPORTS"}
                                </span>
                              </div>
                            )}

                            {cup.patternType === "tree" && (
                              <div className="flex flex-col items-center justify-center">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="w-8 h-9"
                                  fill={cup.accentColor}
                                >
                                  <path d="M12 18v4M9 18h6M12 3c-4.5 0-8 3-7 7 1 3 3 5 7 8 4-3 6-5 7-8 1-4-2.5-7-7-7z" />
                                </svg>
                                <span
                                  className="text-[7px] font-mono font-bold uppercase tracking-tighter mt-1"
                                  style={{ color: cup.accentColor }}
                                >
                                  DECODE
                                </span>
                              </div>
                            )}

                            {cup.patternType === "logo" && (
                              <div className="flex flex-col items-center justify-center text-center">
                                <span
                                  className="font-black text-sm tracking-tighter leading-none"
                                  style={{ color: cup.accentColor }}
                                >
                                  ENIGMA
                                </span>
                                <span className="text-[6px] font-mono font-bold tracking-widest text-gray-600 uppercase">
                                  COFFEE & CODE
                                </span>
                              </div>
                            )}

                            {cup.patternType === "stripes" && (
                              <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div
                                  className="w-8 h-1 rounded-full"
                                  style={{ backgroundColor: cup.accentColor }}
                                />
                                <div
                                  className="w-10 h-1.5 rounded-full"
                                  style={{ backgroundColor: cup.accentColor }}
                                />
                                <div
                                  className="w-7 h-1 rounded-full"
                                  style={{ backgroundColor: cup.accentColor }}
                                />
                              </div>
                            )}

                            {cup.patternType === "waves" && (
                              <div className="w-full flex flex-col items-center justify-center">
                                <svg
                                  viewBox="0 0 30 15"
                                  className="w-10 h-5"
                                  fill="none"
                                  stroke={cup.accentColor}
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                >
                                  <path d="M2 10 Q 7 3, 15 8 T 28 6" />
                                </svg>
                              </div>
                            )}

                            {cup.patternType === "dots" && (
                              <div className="grid grid-cols-2 gap-1.5 p-1">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: cup.accentColor }}
                                />
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: cup.accentColor }}
                                />
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: cup.accentColor }}
                                />
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: cup.accentColor }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tooltip on Hover */}
                      {isHovered && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono font-bold text-white border border-white/20 shadow-lg pointer-events-none z-50">
                          {cup.title} {cup.prize && `• ${cup.prize}`}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Briefing / Control Panel directly tied to the Acrylic Vault */}
        <div className="max-w-md space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 backdrop-blur-md">
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-[11px] font-mono font-bold text-gray-200 tracking-wider uppercase">
              ACRYLIC ARENA VITRINE // 3D INTERACTIVE
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-orbitron)] font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            Curated Tracks in a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400">
              Transparent Vitrine.
            </span>
          </h3>

          <p className="text-gray-300 text-xs sm:text-sm font-sans leading-relaxed">
            Inspired by modern architectural street signage and gallery vitrines, our 4 battleground tracks are housed inside a live 3D acrylic box. Move your cursor to inspect with real perspective tilt, or shake to re-tumble the arena canisters.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={triggerShake}
              className="px-4 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/20 text-white font-[family-name:var(--font-orbitron)] font-bold text-xs flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/20 active:scale-95"
            >
              <RefreshCw size={13} className={isShaking ? "animate-spin" : ""} />
              <span>SHAKE ARENA VAULT</span>
            </button>

            <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-cyan-300">
              ₹44,000 TOTAL PRIZE POOL
            </div>
          </div>

          {/* Direct Track Quick Jumps */}
          <div className="pt-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-2">
              QUICK TRACK JUMP:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
              {[
                { id: "compile-vibes", label: "Compile Vibes", color: "text-cyan-300 border-cyan-500/40 bg-cyan-950/30" },
                { id: "blind-dates", label: "Blind Date", color: "text-fuchsia-300 border-fuchsia-500/40 bg-fuchsia-950/30" },
                { id: "decode-hunt", label: "Decode Hunt", color: "text-purple-300 border-purple-500/40 bg-purple-950/30" },
                { id: "fifa-addicts", label: "FIFA Esports", color: "text-emerald-300 border-emerald-500/40 bg-emerald-950/30" },
              ].map((trk) => (
                <button
                  key={trk.id}
                  onClick={() => {
                    cyberAudio.playClick();
                    if (onSelectTrack) onSelectTrack(trk.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all duration-200 hover:scale-105 cursor-pointer ${trk.color}`}
                >
                  {trk.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
