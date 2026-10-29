"use client";

import { motion } from "framer-motion";
import { Laptop, Palette, Utensils, AlertCircle, Phone, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { ARCADE_TRACKS } from "@/lib/enigma2Data";
import { cyberAudio } from "@/lib/audio";

interface Enigma2ArcadeProps {
  onOpenRegister: () => void;
}

export default function Enigma2Arcade({ onOpenRegister }: Enigma2ArcadeProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case "project-showcase":
        return Laptop;
      case "poster-presentation":
        return Palette;
      case "food-fun-stalls":
        return Utensils;
      default:
        return Sparkles;
    }
  };

  const rules = [
    "Hardware & booth deployment must be completed 1 hour prior to opening bell.",
    "Maintain high aesthetic standards and safety protocol at your designated pavilion.",
    "Zero hazardous materials or unauthorized electrical loads allowed.",
    "Special compute or power specifications must be declared in advance to operations.",
    "Decisions of the UDCS review council and jury panel are definitive."
  ];

  return (
    <section id="arcade" className="py-28 relative overflow-hidden bg-[#08090d]">
      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-gray-300">
            <span>INNOVATION & CREATIVE NEXUS</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">ARCADE</span>
          </h2>

          <p className="max-w-xl mx-auto text-gray-400 font-sans text-xs sm:text-sm">
            Showcase your moonshot prototypes, academic breakthroughs, or launch a buzzing campus stall.
          </p>
        </div>

        {/* 3 Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARCADE_TRACKS.map((track, i) => {
            const Icon = getIcon(track.id);
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-8 rounded-3xl bg-[#0e111a]/85 border border-white/10 hover:border-amber-400/40 hover:shadow-2xl transition-all flex flex-col justify-between group backdrop-blur-md"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                      TRACK 0{i + 1} // {track.tagline}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                      {track.title}
                    </h3>
                  </div>

                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-sans">
                    {track.description}
                  </p>

                  <ul className="space-y-1.5 pt-2 text-xs font-mono text-gray-300">
                    {track.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10">
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      onOpenRegister();
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/40 text-xs font-sans font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Reserve Pavilion Spot</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Guidelines and Direct Coordinators Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Guidelines */}
          <div className="p-8 rounded-3xl bg-[#0e111a]/85 border border-white/10 space-y-4 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle size={20} />
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                Exhibitor Guidelines & Protocol
              </h3>
            </div>
            <ul className="space-y-3 font-mono text-xs text-gray-400">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordinators Contact Box */}
          <div className="p-8 rounded-3xl bg-[#0e111a]/85 border border-white/10 flex flex-col justify-between space-y-6 backdrop-blur-md shadow-xl">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block font-semibold">
                ARCADE POINT OF CONTACT
              </span>
              <h3 className="text-2xl font-display font-bold text-white mt-1">
                Have questions or special setup needs?
              </h3>
              <p className="text-xs font-sans text-gray-400 mt-2">
                Connect directly with our student council leads to coordinate your demonstration station.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="mailto:placementcell.udcs@gmail.com"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-sans font-semibold text-white transition-all"
              >
                placementcell.udcs@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
