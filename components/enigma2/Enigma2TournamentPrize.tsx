"use client";

import React from "react";
import { motion } from "framer-motion";
import { cyberAudio } from "@/lib/audio";

// 3x5 block matrix definition for digits
const DIGIT_MATRICES: Record<string, number[][]> = {
  "0": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "1": [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  "2": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  "3": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  "4": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  "5": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  "6": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "7": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  "8": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "9": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
};

interface Enigma2TournamentPrizeProps {
  title?: string; // e.g. "PRIZEPOOL" or "TOTAL PRIZEPOOL"
  amount?: string; // e.g. "44000"
  eventDate?: string; // e.g. "16 JAN 2027"
  className?: string;
}

export default function Enigma2TournamentPrize({
  title = "PRIZEPOOL",
  amount = "44000",
  eventDate = "16 JAN 2027",
  className = "",
}: Enigma2TournamentPrizeProps) {
  const digits = amount.split("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.8 }}
      onClick={() => {
        cyberAudio.playClick();
        document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
      }}
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group hover:scale-[1.02] transition-transform duration-300 ${className}`}
    >
      {/* Outer Bracket Frame Container */}
      <div className="relative w-fit">
        {/* Top Header Row with Outer Bracket Lines */}
        <div className="flex items-center justify-between w-full relative">
          {/* Left Bracket Line & Corner Drop */}
          <div className="relative flex-1 flex items-center">
            <div className="h-[3px] sm:h-[4px] bg-white w-full rounded-l-sm drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" />
            <div className="absolute left-0 top-0 w-[3px] sm:w-[4px] h-20 sm:h-24 md:h-28 bg-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" />
          </div>

          {/* Centered PRIZEPOOL Header */}
          <span className="px-3 sm:px-4 text-white font-[family-name:var(--font-orbitron)] font-black text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.25em] uppercase whitespace-nowrap drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] group-hover:text-amber-300 transition-colors">
            {title}
          </span>

          {/* Right Bracket Line & Corner Drop */}
          <div className="relative flex-1 flex items-center">
            <div className="h-[3px] sm:h-[4px] bg-white w-full rounded-r-sm drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" />
            <div className="absolute right-0 top-0 w-[3px] sm:w-[4px] h-20 sm:h-24 md:h-28 bg-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" />
          </div>
        </div>

        {/* Center Massive Segmented Digits */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3 my-2 sm:my-3 py-1 px-3 sm:px-4">
          {digits.map((digit, dIdx) => {
            const matrix = DIGIT_MATRICES[digit] || DIGIT_MATRICES["0"];
            return (
              <div
                key={dIdx}
                className="grid grid-cols-3 gap-[2px] sm:gap-[2.5px] md:gap-[3px] drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]"
              >
                {matrix.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-[22px] lg:h-[22px] rounded-[2.5px] sm:rounded-[3.5px] transition-all duration-300 ${
                        cell === 1
                          ? "bg-white group-hover:bg-amber-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.85)]"
                          : "bg-transparent opacity-0 pointer-events-none"
                      }`}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Event Date Sub-header */}
        <div className="text-center pt-0.5 sm:pt-1">
          <span className="text-white font-[family-name:var(--font-orbitron)] font-black text-sm sm:text-lg md:text-xl lg:text-2xl tracking-[0.25em] uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] group-hover:text-cyan-300 transition-colors">
            {eventDate}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
