"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Building2, 
  Award, 
  Handshake, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  Download, 
  Mail, 
  Phone, 
  ExternalLink, 
  CheckCircle2, 
  Zap, 
  Users, 
  GraduationCap, 
  Globe, 
  FileText, 
  Copy, 
  Check,
  Cpu,
  Layers,
  Star
} from "lucide-react";
import { cyberAudio } from "@/lib/audio";

export default function Enigma2Sponsors() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("placementcell.udcs@gmail.com");
    setCopiedEmail(true);
    cyberAudio.playClick();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const partnerTiers = [
    {
      tier: "FLAGSHIP CO-BRANDING",
      title: "Title Sponsor",
      badge: "EXCLUSIVE // 1 OF 1 TIER",
      color: "from-amber-400 to-yellow-300",
      accentText: "text-amber-400",
      borderColor: "border-amber-400/50",
      glowColor: "rgba(245, 158, 11, 0.35)",
      bgGradient: "bg-gradient-to-br from-amber-950/40 via-[#0e121c]/90 to-[#070910]/95",
      status: "OPEN FOR PARTNERSHIP",
      description:
        "Exclusive premier brand naming rights across all digital streams, stage backdrops, certificates, and event promotion.",
      perks: [
        "Exclusive Naming Rights (e.g. Enigma 2.0 Presented By Your Brand)",
        "Keynote Stage Address during Grand Opening Ceremony",
        "Direct Access to Participant Resume & Portfolio Database",
        "VIP Jury Seat on Hackathon & Flagship Event Panels",
      ],
      isFlagship: true,
    },
    {
      tier: "INFRASTRUCTURE & COMPUTE",
      title: "Technology & Cloud Partner",
      badge: "PLATINUM ALLIANCE",
      color: "from-cyan-400 to-sky-300",
      accentText: "text-cyan-400",
      borderColor: "border-cyan-500/40",
      glowColor: "rgba(6, 182, 212, 0.25)",
      bgGradient: "bg-gradient-to-br from-cyan-950/30 via-[#0e121c]/90 to-[#070910]/95",
      status: "OPEN FOR COLLABORATION",
      description:
        "Power the hackathon computing environment, AI toolchains, API access credits, or developer deployment infrastructure.",
      perks: [
        "Dedicated Track Branding during 2.5H AI Hack Sprint",
        "Live Developer Workshop / Product Demo Spotlight",
        "Sponsored Challenge Category with Custom Problem Statement",
        "Branded Booth Pavilion at The Festival Innovation Zone",
      ],
      isFlagship: false,
    },
    {
      tier: "ESPORTS & ENTERTAINMENT",
      title: "Gaming & Arena Partner",
      badge: "GOLD ALLIANCE",
      color: "from-emerald-400 to-teal-300",
      accentText: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      glowColor: "rgba(16, 185, 129, 0.25)",
      bgGradient: "bg-gradient-to-br from-emerald-950/30 via-[#0e121c]/90 to-[#070910]/95",
      status: "OPEN FOR COLLABORATION",
      description:
        "Sponsor the high-octane FIFA Mobile esports tournament arena, livestream production, and competitor rewards.",
      perks: [
        "Official Esports Arena Title Branding",
        "Tournament Broadcast Screen Overlays & Shoutouts",
        "Branded Winner Trophies & Swag Distribution",
        "On-Stage Prize Distribution Participation",
      ],
      isFlagship: false,
    },
    {
      tier: "STUDENT ECOSYSTEM",
      title: "Community & Media Partner",
      badge: "COMMUNITY ALLIANCE",
      color: "from-purple-400 to-violet-300",
      accentText: "text-purple-400",
      borderColor: "border-purple-500/40",
      glowColor: "rgba(168, 85, 247, 0.25)",
      bgGradient: "bg-gradient-to-br from-purple-950/30 via-[#0e121c]/90 to-[#070910]/95",
      status: "OPEN FOR COLLABORATION",
      description:
        "Amplify festival reach across developer communities, college campus networks, technology media, and student clubs.",
      perks: [
        "Cross-Promotion across 40+ Engineering College Networks",
        "Digital Certificate Co-Branding for Verified Attendees",
        "Community Partner Spotlight in Official Press Release",
        "Exclusive VIP Passes for Community Organizers",
      ],
      isFlagship: false,
    },
  ];

  return (
    <section id="sponsors" className="py-28 sm:py-36 relative overflow-hidden bg-[#07090e] select-none text-gray-100">
      {/* Top transition border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent pointer-events-none" />

      {/* Ambient Alliance Glow Auras */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Cyber Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 xl:px-16 relative z-10 space-y-20">
        
        {/* 1. SECTION HEADLINE & BRIEFING */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/50 border border-amber-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span className="font-[family-name:var(--font-orbitron)] text-[10px] sm:text-xs font-bold text-amber-300 tracking-[0.25em] uppercase">
              STRATEGIC ALLIANCES // INDUSTRY CONSORTIUM
            </span>
          </div>

          {/* Monumental Headline */}
          <h2 className="font-[family-name:var(--font-orbitron)] font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            PARTNERS &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 drop-shadow-[0_0_35px_rgba(245,158,11,0.6)]">
              SPONSORS.
            </span>
          </h2>

          <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed">
            Connecting industry-leading technology giants and developer ecosystems with 500+ top-tier software engineers and innovators from Mumbai&apos;s premier university.
          </p>

          {/* Key Reach Metrics HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-[family-name:var(--font-orbitron)] font-black text-amber-300">
                500+
              </div>
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mt-1">
                Tech Delegates
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-[family-name:var(--font-orbitron)] font-black text-cyan-300">
                40+
              </div>
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mt-1">
                Colleges Reached
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-[family-name:var(--font-orbitron)] font-black text-emerald-300">
                ₹44,000
              </div>
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mt-1">
                Prize Vault
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-[family-name:var(--font-orbitron)] font-black text-fuchsia-300">
                100%
              </div>
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mt-1">
                Open Innovation
              </div>
            </div>
          </div>
        </div>

        {/* 2. GOVERNING ACADEMIC PATRONS (Official Institution Logos) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <GraduationCap size={18} className="text-amber-400" />
            <h3 className="font-[family-name:var(--font-orbitron)] text-xs sm:text-sm font-bold text-gray-300 tracking-[0.2em] uppercase">
              ACADEMIC PATRONS & ORGANIZING BODIES
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department of Computer Science Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] via-[#0d121c]/90 to-[#070a12]/95 border border-white/15 backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300 group shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 p-2.5 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/logo-udcs-clean.png"
                    alt="UDCS Mumbai Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 uppercase tracking-wider">
                    <span>HOST INSTITUTION</span>
                  </div>
                  <h4 className="font-[family-name:var(--font-orbitron)] font-bold text-lg sm:text-xl text-white group-hover:text-amber-200 transition-colors">
                    Department of Computer Science
                  </h4>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    University of Mumbai, Vidyanagari, Kalina Campus. Pioneering postgraduate computer science education and applied research.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2 text-[10px] font-mono text-gray-400">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-gray-300">
                  Autonomous Research Center
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-gray-300">
                  Faculty Patronage
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-gray-300">
                  Official Venue Host
                </span>
              </div>
            </motion.div>

            {/* Placement Cell UDCS Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] via-[#0d121c]/90 to-[#070a12]/95 border border-white/15 backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300 group shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 p-2.5 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/logo-mu.png"
                    alt="University of Mumbai Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-[10px] font-mono text-amber-300 uppercase tracking-wider">
                    <span>ORGANIZING SECRETARIAT</span>
                  </div>
                  <h4 className="font-[family-name:var(--font-orbitron)] font-bold text-lg sm:text-xl text-white group-hover:text-amber-200 transition-colors">
                    Placement Cell UDCS
                  </h4>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Student leadership council bridging academic distinction with corporate industry alliances, recruitments, and technical symposiums.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2 text-[10px] font-mono text-gray-400">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-gray-300">
                  Industry Liaison Council
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-gray-300">
                  Talent Pipeline Access
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-gray-300">
                  Enigma Festival Executive
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 3. STRATEGIC SPONSORSHIP TIERS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <Award size={18} className="text-amber-400" />
              <h3 className="font-[family-name:var(--font-orbitron)] text-xs sm:text-sm font-bold text-gray-300 tracking-[0.2em] uppercase">
                SPONSORSHIP & PARTNERSHIP TIERS
              </h3>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-bold hidden sm:inline">
              ENIGMA 2027 // PROSPECTUS OPEN
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {partnerTiers.map((tier, idx) => (
              <motion.div
                key={tier.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`
                  p-7 sm:p-8 rounded-3xl border transition-all duration-300
                  backdrop-blur-xl relative overflow-hidden group shadow-2xl flex flex-col justify-between
                  ${tier.bgGradient} ${tier.borderColor}
                  ${tier.isFlagship ? "hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30" : "hover:border-white/30"}
                `}
              >
                {/* Corner Chrome Brackets for High-Tech Vitrine Look */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-white/40 pointer-events-none" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-white/40 pointer-events-none" />

                <div className="space-y-4">
                  {/* Top Badge & Status Row */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <span className="text-[10px] font-mono font-bold text-gray-400 tracking-wider uppercase">
                      {tier.tier}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-white/[0.06] border border-white/15 ${tier.accentText}`}
                    >
                      {tier.badge}
                    </span>
                  </div>

                  {/* Title & Status */}
                  <div>
                    <h4 className="font-[family-name:var(--font-orbitron)] font-bold text-2xl text-white group-hover:text-amber-200 transition-colors">
                      {tier.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed mt-2">
                      {tier.description}
                    </p>
                  </div>

                  {/* Key Deliverables & Perks List */}
                  <div className="space-y-2.5 pt-3">
                    <div className="text-[11px] font-mono font-bold text-gray-400 tracking-wider uppercase">
                      KEY DELIVERABLES & BRAND VISIBILITY:
                    </div>
                    {tier.perks.map((perk, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs font-sans text-gray-300">
                        <CheckCircle2 size={14} className={`shrink-0 mt-0.5 ${tier.accentText}`} />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{tier.status}</span>
                  </span>

                  <a
                    href="mailto:placementcell.udcs@gmail.com?subject=Enigma%202027%20Partnership%20Inquiry"
                    onClick={() => cyberAudio.playClick()}
                    className={`
                      inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide uppercase transition-all
                      ${
                        tier.isFlagship
                          ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110"
                          : "bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/30"
                      }
                    `}
                  >
                    <span>Claim Tier</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. CORPORATE PARTNERSHIP TERMINAL (High-Conversion VIP CTA) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#121826] via-[#0d121c] to-[#070910] border border-amber-400/40 relative overflow-hidden backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        >
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
              <Sparkles size={13} className="text-amber-400" />
              <span>CORPORATE RELATIONS & SPONSOR LIAISON</span>
            </div>

            <h3 className="font-[family-name:var(--font-orbitron)] font-bold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              Ready to Shape the Future with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                Enigma 2027?
              </span>
            </h3>

            <p className="text-gray-300 text-sm sm:text-base font-sans leading-relaxed">
              Tailor a bespoke alliance package with our placement cell. Put your technology and recruitment brand directly in the hands of India&apos;s most promising computer science graduates.
            </p>

            {/* Action Matrix */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              {/* Copy Email Button */}
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 transition-all cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check size={16} />
                    <span>Email Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy Placement Email</span>
                  </>
                )}
              </button>

              {/* Direct Mailto */}
              <a
                href="mailto:placementcell.udcs@gmail.com?subject=Enigma%202027%20Sponsorship%20Proposal"
                onClick={() => cyberAudio.playClick()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                <Mail size={16} className="text-amber-400" />
                <span>placementcell.udcs@gmail.com</span>
              </a>

              {/* Direct WhatsApp Liaison */}
              <a
                href="https://wa.me/919999999999?text=Hi%20Placement%20Cell%20UDCS,%20we%20are%20interested%20in%20partnering%20with%20Enigma%202027"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playClick()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                <Phone size={15} />
                <span>WhatsApp Liaison</span>
              </a>
            </div>

            <p className="text-[11px] font-mono text-gray-500 pt-2">
              Official Placement Cell, Department of Computer Science, University of Mumbai, Kalina, Santacruz (E), Mumbai - 400098.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
