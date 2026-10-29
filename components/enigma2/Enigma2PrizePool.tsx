"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Medal, Sparkles } from "lucide-react";

export default function Enigma2PrizePool() {
  return (
    <section id="rewards" className="py-28 relative overflow-hidden bg-[#08090d]">
      {/* Top subtle border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-16">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>16 JAN 2027 // REWARDS & RECOGNITION</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
            PRIZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">VAULT</span>
          </h2>

          <p className="max-w-xl mx-auto text-gray-400 font-sans text-xs sm:text-sm">
            ₹44,000 total rewards pool unlocked on 16 January 2027. Cash bounties, trophies, and official University of Mumbai certificates of excellence.
          </p>
        </div>

        {/* Center Grand Display */}
        <div className="relative max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#0e111a]/85 border border-amber-400/30 shadow-2xl text-center space-y-4 overflow-hidden backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Trophy size={36} />
          </div>

          <div>
            <span className="text-xs font-mono text-amber-300 uppercase tracking-[0.25em] block font-semibold">
              TOTAL ACCUMULATED REWARDS POOL
            </span>
            <div className="text-6xl sm:text-8xl font-display font-black text-white tracking-tight mt-2 drop-shadow-md">
              ₹44,000
            </div>
            <p className="text-xs sm:text-sm font-sans text-gray-300 mt-2">
              With <span className="text-amber-400 font-bold">₹21,000+ Direct Cash Pools</span> across Flagship Challenges
            </p>
          </div>
        </div>

        {/* 3 Vault Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#0e111a]/80 border border-white/10 hover:border-amber-400/30 transition-all text-center space-y-4 backdrop-blur-md shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <Award size={24} />
            </div>
            <h3 className="text-3xl font-display font-bold text-white">₹25,000</h3>
            <p className="text-xs font-mono text-amber-300 uppercase tracking-wider font-semibold">Flagship Coding Circuits</p>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Awarded across Compile The Vibes, Blind Date with Code, and Decode The Hunt finalists.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0e111a]/80 border border-white/10 hover:border-white/30 transition-all text-center space-y-4 backdrop-blur-md shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-200">
              <Medal size={24} />
            </div>
            <h3 className="text-3xl font-display font-bold text-white">Certificates</h3>
            <p className="text-xs font-mono text-gray-300 uppercase tracking-wider font-semibold">For All Verified Attendees</p>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Every participant receives an official University of Mumbai verified digital certificate.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0e111a]/80 border border-white/10 hover:border-amber-400/30 transition-all text-center space-y-4 backdrop-blur-md shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <Sparkles size={24} />
            </div>
            <h3 className="text-3xl font-display font-bold text-white">₹19,000</h3>
            <p className="text-xs font-mono text-amber-300 uppercase tracking-wider font-semibold">Esports & Spot Bounties</p>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Esports championship in FIFA Addicts, plus best prototype accolades and spot honors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
