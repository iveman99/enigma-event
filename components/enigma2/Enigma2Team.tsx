"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { cyberAudio } from "@/lib/audio";

interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
  image: string;
  lead?: boolean;
}

// Exactly 16 Team Members split 8 by 8 into two parallel auto-scrolling rows
const ROW_1_MEMBERS: TeamMember[] = [
  { 
    name: "iVeman", 
    role: "Technical Head", 
    linkedin: "https://www.linkedin.com/in/veman-chippa", 
    image: "/images/team/iveman.jpeg", 
    lead: true 
  },
  { 
    name: "Mayur Shewale", 
    role: "Finance Head", 
    linkedin: "https://www.linkedin.com/in/mayur-shewale312003/", 
    image: "/images/team/mayur-2027.jpg", 
    lead: true 
  },
  { 
    name: "Deeksha Singh", 
    role: "Marketing & PR Head", 
    linkedin: "https://www.linkedin.com/in/deeksha-singh-951024376/", 
    image: "/images/team/Deeksha.jpeg", 
    lead: true 
  },
  { 
    name: "Ankita Goyal", 
    role: "Decor & Aesthetics Head", 
    linkedin: "https://www.linkedin.com/in/ankita-goyal-702881247", 
    image: "/images/team/Ankita.jpeg", 
    lead: true 
  },
  { 
    name: "Aryan Palekar", 
    role: "Operations Lead", 
    linkedin: "https://www.linkedin.com/in/aryan-palekar-3ba736285/", 
    image: "/images/team/Aryan.jpeg" 
  },
  { 
    name: "Kunal", 
    role: "Logistics Lead", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Kunal.jpeg" 
  },
  { 
    name: "Pranav", 
    role: "Media & Production", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Pranav.jpeg" 
  },
  { 
    name: "Om", 
    role: "Esports Arena Lead", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Om.jpeg" 
  },
];

const ROW_2_MEMBERS: TeamMember[] = [
  { 
    name: "Adarsh", 
    role: "Systems & Infrastructure", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Adarsh.jpeg" 
  },
  { 
    name: "Hera", 
    role: "Public Relations Lead", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Hera.jpeg" 
  },
  { 
    name: "Gaurav", 
    role: "Venue Operations", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Gaurav.jpeg" 
  },
  { 
    name: "Mahesh", 
    role: "Arena Management", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Mahesh.jpeg" 
  },
  { 
    name: "Pranay", 
    role: "Creative Direction", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Pranay.jpeg" 
  },
  { 
    name: "Priyanshi", 
    role: "Hospitality Lead", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Priyanshi.jpeg" 
  },
  { 
    name: "Rahul", 
    role: "Web Operations", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Rahul.jpeg" 
  },
  { 
    name: "Shweta", 
    role: "Registration Desk", 
    linkedin: "https://www.linkedin.com/", 
    image: "/images/team/Shweta.jpeg" 
  },
];

export default function Enigma2Team() {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (name: string) => {
    setFailedImages((prev) => ({ ...prev, [name]: true }));
  };

  const renderMemberCard = (member: TeamMember, index: number) => {
    const hasFailedImage = failedImages[member.name];
    const initials = member.name
      .split(" ")
      .map((n) => n[0])
      .join("");

    return (
      <div
        key={`${member.name}-${index}`}
        className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[calc(100vw/8)] p-1 sm:p-1.5 md:p-2"
      >
        <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0f1422] to-[#070912] border border-white/15 hover:border-amber-400/90 shadow-xl transition-all duration-300 group cursor-default hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          {/* Precision Corner Standoff Brackets */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/40 pointer-events-none z-20" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/40 pointer-events-none z-20" />

          {/* Optional Leadership Badge */}
          {member.lead && (
            <div className="absolute top-2 right-2 z-20 pointer-events-none">
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-500/60 text-amber-300 font-mono font-bold text-[8px] tracking-wider uppercase backdrop-blur-md shadow-[0_0_10px_rgba(245,158,11,0.35)]">
                LEAD
              </span>
            </div>
          )}

          {/* Full-Bleed Portrait Photo or Cyber Monogram Avatar */}
          {!hasFailedImage ? (
            <img
              src={member.image}
              alt={member.name}
              onError={() => handleImageError(member.name)}
              className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#121829] via-[#0b101c] to-[#070a12] p-3 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 text-sm sm:text-base font-[family-name:var(--font-orbitron)] font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                {initials}
              </div>
              <span className="text-[8px] font-mono text-gray-500 tracking-wider uppercase mt-1">
                COUNCIL
              </span>
            </div>
          )}

          {/* Cinematic Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none z-10" />

          {/* FLOATING GLASSMORHPIC NAME PILL */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 z-20 p-1.5 sm:p-2 rounded-xl bg-[#090d16]/90 border border-white/15 backdrop-blur-md flex items-center justify-between gap-1 group-hover:border-amber-400/60 group-hover:bg-[#0e1424]/95 transition-all">
            <div className="space-y-0.5 min-w-0 flex-1">
              <h4 className="font-[family-name:var(--font-orbitron)] font-bold text-[10px] sm:text-[11px] lg:text-xs text-white group-hover:text-amber-300 transition-colors truncate leading-tight">
                {member.name}
              </h4>
              <p className="text-[8px] sm:text-[9px] font-mono text-gray-300 tracking-tight truncate leading-tight">
                {member.role}
              </p>
            </div>

            {/* LinkedIn Action Icon */}
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                cyberAudio.playClick();
              }}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-black border border-white/15 hover:border-amber-400 text-gray-300 flex items-center justify-center shrink-0 transition-all shadow-sm group/btn"
              title={`${member.name}'s LinkedIn Profile`}
            >
              <Linkedin size={11} className="group-hover/btn:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="team" className="py-20 sm:py-28 relative overflow-hidden bg-[#07080c] select-none text-gray-100">
      {/* Top Border with Amber Center Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

      {/* Cyber Ambient Lighting Spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Matrix Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 space-y-8 sm:space-y-12">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-3 max-w-3xl mx-auto px-4">
          {/* Monumental Headline */}
          <h2 className="font-[family-name:var(--font-orbitron)] font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            ORGANIZING <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 drop-shadow-[0_0_35px_rgba(245,158,11,0.6)]">TEAM.</span>
          </h2>

          {/* Catchy Subheading */}
          <p className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-xs sm:text-sm md:text-base text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-amber-200 to-amber-400 uppercase tracking-[0.2em] drop-shadow-[0_0_15px_rgba(245,158,11,0.35)]">
            THE MINDS BEHIND THE MACHINE.
          </p>
        </div>

        {/* ============================================================== */}
        {/* TWO PARALLEL AUTO-SCROLLING ROWS (8 BY 8 - ALL VISIBLE ON SCREEN) */}
        {/* ============================================================== */}
        <div className="space-y-2 sm:space-y-3 overflow-hidden w-full">
          
          {/* ROW 1: AUTO-SCROLL LEFT (8 Members visible across screen, looped) */}
          <div className="relative overflow-hidden w-full group/row1">
            {/* Subtle Edge Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#07080c] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#07080c] to-transparent z-20 pointer-events-none" />

            <div className="flex animate-team-marquee hover:[animation-play-state:paused] group-hover/row1:[animation-play-state:paused] w-max">
              {/* Set 1: 8 Members spanning 100vw */}
              {ROW_1_MEMBERS.map((member, i) => renderMemberCard(member, i))}
              {/* Set 2: Duplicate for seamless continuous auto-scroll */}
              {ROW_1_MEMBERS.map((member, i) => renderMemberCard(member, i + 8))}
            </div>
          </div>

          {/* ROW 2: AUTO-SCROLL RIGHT / OPPOSITE DIRECTION (8 Members visible across screen, looped) */}
          <div className="relative overflow-hidden w-full group/row2">
            {/* Subtle Edge Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#07080c] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#07080c] to-transparent z-20 pointer-events-none" />

            <div className="flex animate-team-marquee-reverse hover:[animation-play-state:paused] group-hover/row2:[animation-play-state:paused] w-max">
              {/* Set 1: 8 Members spanning 100vw */}
              {ROW_2_MEMBERS.map((member, i) => renderMemberCard(member, i))}
              {/* Set 2: Duplicate for seamless continuous auto-scroll */}
              {ROW_2_MEMBERS.map((member, i) => renderMemberCard(member, i + 8))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
