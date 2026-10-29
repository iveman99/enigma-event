"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Terminal, 
  Instagram, 
  MapPin, 
  Navigation,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { cyberAudio } from "@/lib/audio";

export default function Enigma2Footer() {
  return (
    <footer className="relative bg-[#04060a] border-t border-white/5 pt-14 sm:pt-16 pb-12 overflow-hidden select-none text-gray-200">
      {/* 1. CRISP, CONTINUOUS & PERFECT CYBER LASER LINE (No clipped badges) */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/90 to-transparent shadow-[0_0_16px_rgba(6,182,212,0.7)] pointer-events-none" />

      {/* 2. AMBIENT GLOW BACKDROPS */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* 3. CYBERNETIC MATRIX GRID OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* 4. GIANT HOLOGRAPHIC WATERMARK */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none select-none overflow-hidden whitespace-nowrap opacity-[0.03] z-0">
        <span className="font-[family-name:var(--font-orbitron)] font-black text-[12vw] tracking-[0.1em] text-white uppercase leading-none block">
          ENIGMA 2.0
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* BRAND POWERHOUSE COLUMN (COL 1-6) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* EXACT OFFICIAL UPPER LOGO LOCKUP (MUMBAI UNIVERSITY + ENIGMA 2.0 + UDCS) */}
            <Link
              href="#hero"
              onClick={() => cyberAudio.playClick()}
              className="inline-flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0c1222] via-[#090d18] to-transparent border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-[0_0_25px_rgba(6,182,212,0.15)] group"
            >
              {/* Left Logo: University of Mumbai */}
              <div className="relative aspect-[192/226] h-9 sm:h-11 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/images/logo-mu.png"
                  alt="University of Mumbai Crest"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Center: ENIGMA 2.0 Wordmark */}
              <div className="flex items-baseline leading-none">
                <span className="enigma-broken-font font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                  ENIGMA
                </span>
                <span className="ml-2 font-[family-name:var(--font-orbitron)] font-black text-xs sm:text-sm md:text-base text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.85)] group-hover:text-amber-300 transition-colors">
                  2.0
                </span>
              </div>

              {/* Right Logo: Department of Computer Science UDCS */}
              <div className="relative aspect-square h-9 sm:h-11 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/images/logo-udcs-clean.png"
                  alt="Department of Computer Science UDCS"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Tagline / Mission */}
            <div className="space-y-2.5 max-w-lg">
              <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs sm:text-sm text-gray-200 leading-relaxed">
                Flagship Technical Arena of the <span className="text-white font-bold">Department of Computer Science (UDCS)</span>, University of Mumbai.
              </p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/35 text-cyan-300 font-[family-name:var(--font-jetbrains-mono)] text-[10px] sm:text-[11px] font-bold tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span>4 BATTLEGROUNDS // ₹44K VAULT // 16 JAN 2027</span>
              </div>
            </div>

            {/* Interactive Cyber Quick Access Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/enigma2/terminal"
                onClick={() => cyberAudio.playClick()}
                className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-[#0b1220] border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer"
              >
                <Terminal size={15} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>TERMINAL ACCESS</span>
                <span className="text-[10px] text-cyan-400/60 font-normal">&gt;_</span>
              </Link>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com/udcs.mumbaiuniversity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-400/60 flex items-center justify-center text-gray-300 hover:text-amber-300 transition-all hover:scale-105 shadow-md"
                  title="UDCS Instagram"
                >
                  <Instagram size={17} />
                </a>
                <a
                  href="https://maps.google.com/?q=Department+of+Computer+Science+University+of+Mumbai+Kalina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-emerald-400/60 flex items-center justify-center text-gray-300 hover:text-emerald-300 transition-all hover:scale-105 shadow-md"
                  title="Google Maps Campus Direction"
                >
                  <Navigation size={17} />
                </a>
              </div>
            </div>
          </div>

          {/* QUICK LINKS (COL 7-9) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h4 className="text-xs font-mono text-cyan-300 uppercase tracking-[0.2em] font-bold">
                QUICK LINKS
              </h4>
            </div>

            <ul className="space-y-2.5 text-xs font-mono text-gray-400">
              <li>
                <a 
                  href="#about" 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <ChevronRight size={12} className="text-cyan-400/50 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  <span>About Enigma</span>
                </a>
              </li>
              <li>
                <a 
                  href="#events" 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <ChevronRight size={12} className="text-cyan-400/50 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  <span>Competitions & Events</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">₹44K</span>
                </a>
              </li>
              <li>
                <a 
                  href="#schedule" 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <ChevronRight size={12} className="text-cyan-400/50 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  <span>Event Schedule</span>
                </a>
              </li>
              <li>
                <a 
                  href="#team" 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <ChevronRight size={12} className="text-cyan-400/50 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  <span>Our Team</span>
                </a>
              </li>
              <li>
                <a 
                  href="#location" 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <ChevronRight size={12} className="text-cyan-400/50 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  <span>Venue & Campus</span>
                </a>
              </li>
              <li>
                <a 
                  href="#legacy" 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <ChevronRight size={12} className="text-purple-400/50 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
                  <span>Enigma 1.0 Rewind</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">VAULT</span>
                </a>
              </li>
            </ul>
          </div>

          {/* CAMPUS VENUE LOCATION (COL 10-12) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <MapPin size={15} className="text-amber-400" />
              <h4 className="text-xs font-mono text-amber-300 uppercase tracking-[0.2em] font-bold">
                CAMPUS LOCATION
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5 backdrop-blur-md">
              <div className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>UDCS KALINA CAMPUS</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Department of Computer Science, University of Mumbai, Vidyanagari, Kalina, Santacruz (East), Mumbai 400098.
              </p>
              
              <a
                href="https://maps.google.com/?q=Department+of+Computer+Science+University+of+Mumbai+Kalina"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-cyan-300 hover:text-white transition-colors pt-1 group"
              >
                <Navigation size={12} className="group-hover:translate-x-0.5 transition-transform" />
                <span className="underline underline-offset-4 decoration-cyan-500/50">Get Directions on Maps</span>
                <ExternalLink size={11} className="opacity-70" />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM CREDITS & SIGN-OFF BAR */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span>&copy; 2027 <strong className="text-white">ENIGMA 2.0</strong></span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span>Department of Computer Science, University of Mumbai</span>
          </div>

          {/* Holographic "Engineered by iVeman" Badge */}
          <div className="flex items-center gap-2">
            <div className="relative group px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-400/40 hover:border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.25)] hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-all">
              <span className="text-gray-400 text-[11px] mr-1.5">Engineered by</span>
              <a
                href="https://www.linkedin.com/in/veman-chippa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 font-bold tracking-wider hover:text-white transition-colors cursor-pointer"
              >
                iVeman
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
