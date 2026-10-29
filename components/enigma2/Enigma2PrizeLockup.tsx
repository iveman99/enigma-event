"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cyberAudio } from "@/lib/audio";

interface Enigma2PrizeLockupProps {
  eventDate?: string;
  targetAmount?: number;
  tagline?: string;
  formatSubtitle?: string;
  onRegister?: () => void;
  className?: string;
}

export default function Enigma2PrizeLockup({
  eventDate = "16 JAN 2027",
  targetAmount = 44000,
  tagline = "THE FUTURE IS YOURS TO CRACK.",
  formatSubtitle = "ONE DAY. MULTIPLE CHALLENGES.",
  onRegister,
  className = "",
}: Enigma2PrizeLockupProps) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Car-launch odometer count-up animation over 2.6 seconds
  const runLaunchAnimation = () => {
    setIsComplete(false);
    setIsFlashing(false);
    const duration = 2600; // 2.6s dramatic reveal
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Dramatic cubic ease-out: rapid revving acceleration into smooth precision lock-in
      const ease = 1 - Math.pow(1 - progress, 3.5);
      const currentVal = Math.floor(ease * targetAmount);

      setDisplayNumber(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayNumber(targetAmount);
        setIsComplete(true);
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 600);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runLaunchAnimation();
    }, 400);
    return () => clearTimeout(timer);
  }, [targetAmount]);

  const handleRegister = () => {
    cyberAudio.playClick();
    if (onRegister) {
      onRegister();
    } else {
      document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.8 }}
      className={`relative flex flex-col items-center select-none ${className}`}
    >
      {/* 1. Date Pill Badge */}
      <div
        onClick={() => {
          cyberAudio.playClick();
          document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="group cursor-pointer inline-flex items-center px-4 sm:px-5 py-1 sm:py-1.5 rounded-full bg-[#080d1a]/85 hover:bg-[#0c1426] border border-cyan-400/50 hover:border-cyan-300 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] backdrop-blur-md"
      >
        <span className="font-[family-name:var(--font-orbitron)] font-bold text-xs sm:text-sm tracking-[0.2em] text-cyan-300 uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.7)] group-hover:text-cyan-200 transition-colors">
          {eventDate}
        </span>
      </div>

      {/* 2. Car-Launch Odometer Prize Pool */}
      <div
        onClick={() => {
          cyberAudio.playClick();
          runLaunchAnimation();
        }}
        title="Click to replay launch rev animation"
        className="group cursor-pointer flex flex-col items-center mt-2.5 sm:mt-3"
      >
        <div className="relative">
          {isFlashing && (
            <span
              aria-hidden="true"
              className="absolute -inset-4 bg-gradient-to-r from-cyan-400/0 via-cyan-300/40 to-teal-400/0 blur-xl rounded-full animate-ping pointer-events-none"
            />
          )}

          {/* Deep Cyan Glow Behind */}
          <span
            aria-hidden="true"
            className="absolute inset-0 font-[family-name:var(--font-orbitron)] font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] tracking-wider text-cyan-400 blur-md opacity-75 select-none pointer-events-none"
          >
            ₹{displayNumber.toLocaleString()}
          </span>

          {/* Foreground Radiant Cyan Scanline Text */}
          <span className="relative font-[family-name:var(--font-orbitron)] font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_22px_rgba(6,182,212,0.8)] group-hover:drop-shadow-[0_0_35px_rgba(6,182,212,1)] transition-all inline-block">
            ₹{displayNumber.toLocaleString()}
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px]"
            />
          </span>
        </div>

        {/* TOTAL PRIZE POOL Subtitle - Electric Cyan */}
        <span className="font-[family-name:var(--font-orbitron)] font-bold text-[9px] sm:text-[10px] md:text-xs text-cyan-300/90 tracking-[0.42em] uppercase mt-1 drop-shadow-[0_0_8px_rgba(6,182,212,0.7)] group-hover:text-cyan-200 transition-colors">
          TOTAL PRIZE POOL
        </span>
      </div>

      {/* 3. Event Tagline - Prominent, high-contrast against background ring */}
      <div className="mt-5 sm:mt-6 text-center px-1">
        <span className="font-[family-name:var(--font-orbitron)] font-black text-xs sm:text-sm md:text-base lg:text-[1.05rem] text-white tracking-[0.18em] sm:tracking-[0.24em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_0_25px_rgba(0,0,0,0.9)] block leading-tight whitespace-nowrap">
          THE FUTURE IS YOURS TO{" "}
          <span className="text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]">
            CRACK.
          </span>
        </span>

        {/* 4. Event Format Clarification - Highly legible supporting line */}
        <span className="font-[family-name:var(--font-orbitron)] font-bold text-[10px] sm:text-[11.5px] md:text-[13px] text-gray-100 tracking-[0.2em] sm:tracking-[0.26em] uppercase mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)] block leading-tight whitespace-nowrap">
          {formatSubtitle}
        </span>
      </div>

      {/* 5. Gold REGISTER NOW ↗ Button */}
      <div className="mt-4 sm:mt-5">
        <button
          type="button"
          onClick={handleRegister}
          className="group relative inline-flex items-center gap-2 px-6 sm:px-7 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:via-amber-300 hover:to-yellow-400 text-[#07090e] font-[family-name:var(--font-orbitron)] font-black text-xs sm:text-[13px] tracking-[0.16em] uppercase shadow-[0_4px_22px_rgba(251,191,36,0.45)] hover:shadow-[0_6px_32px_rgba(251,191,36,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <span>REGISTER NOW</span>
          <ArrowUpRight className="w-4 h-4 text-[#07090e] stroke-[2.75] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
