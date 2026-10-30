"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Users, Mic, Award, ArrowRight, Sparkles, ChevronsRight, Zap } from "lucide-react";
import Image from "next/image";
import { cyberAudio } from "@/lib/audio";

export default function Enigma2About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sliderUnlocked, setSliderUnlocked] = useState(false);

  // Smooth scroll-driven parallax for the background citadel observation deck
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);

  const infoCards = [
    {
      id: "date",
      icon: Calendar,
      title: "16 Jan 2027",
      subtitle: "One-Day Techfest",
      color: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border border-cyan-500/25",
      borderHover: "hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.18)]",
    },
    {
      id: "eligibility",
      icon: Users,
      title: "Open For",
      subtitle: "Bachelor’s & Master’s Students",
      color: "text-fuchsia-400",
      iconBg: "bg-fuchsia-500/10 border border-fuchsia-500/25",
      borderHover: "hover:border-fuchsia-400/40 hover:shadow-[0_0_20px_rgba(217,70,239,0.18)]",
    },
    {
      id: "interaction",
      icon: Mic,
      title: "Industry Interaction",
      subtitle: "Guest Speakers & Networking",
      color: "text-sky-400",
      iconBg: "bg-sky-500/10 border border-sky-500/25",
      borderHover: "hover:border-sky-400/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.18)]",
    },
    {
      id: "prize",
      icon: Award,
      title: "₹44,000",
      subtitle: "Cash Prize worth",
      color: "text-purple-400",
      iconBg: "bg-purple-500/10 border border-purple-500/25",
      borderHover: "hover:border-purple-400/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.22)]",
      isPrize: true,
    },
  ];

  // Sliding marquee items: 4 events, 1 prize pool, and 1 event date
  const marqueeItems = [
    { label: "COMPILE THE VIBES" },
    { label: "BLIND DATE WITH CODE" },
    { label: "DECODE THE HUNT" },
    { label: "FIFA ADDICTS" },
    { label: "₹44,000 PRIZE POOL" },
    { label: "16 JAN 2027" },
  ];

  const handleExplore = () => {
    cyberAudio.playClick();
    setSliderUnlocked(true);
    const target = document.getElementById("events");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => setSliderUnlocked(false), 1400);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen pt-20 pb-20 sm:pt-24 sm:pb-28 scroll-mt-28 overflow-hidden bg-[#07080b] flex flex-col justify-center select-none"
    >
      {/* 1. Seamless Cinematic Background - Citadel Observation Deck */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none"
      >
        <Image
          src="/images/enigma2-about-citadel.jpg"
          alt="ENIGMA 2.0 Citadel Observation Deck overlooking Celestial City"
          fill
          className="object-cover object-center"
          priority={false}
          quality={95}
        />
        {/* Soft atmospheric gradients that allow the citadel background to clearly show through */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080b] via-[#07080b]/25 to-[#07080b]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080b]/70 via-[#07080b]/15 to-[#07080b]/70" />
        {/* Ambient radial glows */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-amber-500/15 rounded-full blur-[160px] pointer-events-none" />
      </motion.div>

      {/* Top Transition Boundary Line */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#07080b] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none z-10" />

      {/* Fine Horizontal Sci-Fi Scanline Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* 2. Main Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 2xl:px-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Narrative Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-4"
          >
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/35 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="font-[family-name:var(--font-orbitron)] text-[10px] sm:text-xs font-bold text-cyan-300 tracking-[0.25em] uppercase">
                ABOUT ENIGMA 2.0
              </span>
            </div>

            {/* Monumental Headline */}
            <h2 className="font-[family-name:var(--font-orbitron)] font-black text-3xl sm:text-5xl lg:text-5xl text-white tracking-tight leading-[1.1] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
              MORE THAN A{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-cyan-400 to-sky-300 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                COMPETITION.
              </span>
            </h2>

            {/* Subtitle / Core Tagline */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-cyan-400/60" />
              <p className="font-[family-name:var(--font-orbitron)] font-bold text-xs sm:text-sm text-cyan-300 tracking-[0.2em] uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                ONE DAY. MULTIPLE CHALLENGES. ONE BIG EXPERIENCE.
              </p>
            </div>

            {/* Lead Line with Glowing Left Border */}
            <div className="border-l-2 border-cyan-400/80 pl-4 sm:pl-5 py-0.5 mt-2">
              <p className="text-gray-100 font-sans text-base sm:text-lg font-medium leading-relaxed">
                Enigma 2.0 is the official Techfest of the Department of Computer Science, University of Mumbai. A day to code, solve, compete and connect.
              </p>
            </div>

            {/* Narrative Paragraph */}
            <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed pt-1">
              Organized by the Department of Computer Science, University of Mumbai, <span className="text-white font-semibold">ENIGMA 1.0</span> turned that vision into reality with curious minds from <span className="text-cyan-300 font-semibold">9 colleges</span>. Now, <span className="text-white font-semibold">ENIGMA 2.0</span> opens the next chapter — pushing boundaries with creative coding, unexpected programming trials, strategic puzzles, and tech-themed treasure hunts.
            </p>

            {/* Community Ethos & Inclusivity Callout */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm font-mono text-cyan-300">
              <span className="px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-200 font-semibold text-xs">
                Community Driven
              </span>
              <span className="text-gray-300 font-sans text-xs sm:text-sm">
                Open to <strong className="text-white font-semibold">Bachelor’s &amp; Master’s</strong> students across all disciplines and colleges.
              </span>
            </div>
          </motion.div>

          {/* Right Column: 4 Small, Transparent Info Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {infoCards.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  delay: idx * 0.08,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onMouseEnter={() => cyberAudio.playHover()}
                className={`group relative rounded-2xl p-5 sm:p-6 bg-black/30 hover:bg-black/45 border border-white/10 ${card.borderHover} backdrop-blur-md transition-all duration-300 flex flex-col justify-between cursor-default`}
              >
                {/* Icon Badge */}
                <div
                  className={`w-fit p-3 rounded-xl ${card.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.color}`} />
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h4
                    className={`font-[family-name:var(--font-orbitron)] font-bold tracking-tight mb-1 text-white ${
                      card.isPrize
                        ? "text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-fuchsia-300 to-pink-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                        : "text-lg sm:text-xl"
                    }`}
                  >
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 font-mono leading-snug">
                    {card.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Dynamic Interactive Sci-Fi Slide Bar (Replaced Mission Matrix) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-12 sm:mt-16 rounded-2xl bg-black/30 border border-white/10 hover:border-cyan-500/35 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
        >
          {/* Animated Infinite Sliding Marquee Ribbon */}
          <div className="relative overflow-hidden w-full border-b border-white/10 py-2.5 px-2 bg-gradient-to-r from-cyan-950/20 via-black/40 to-cyan-950/20">
            {/* Edge fade masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#07080b]/90 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#07080b]/90 to-transparent z-10" />

            <motion.div
              className="flex items-center gap-3.5 whitespace-nowrap will-change-transform"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 16 }}
            >
              {[...marqueeItems, ...marqueeItems].map((item, idx) => (
                <a
                  key={idx}
                  href="#events"
                  onClick={() => cyberAudio.playClick()}
                  className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.08] transition-all group/chip cursor-pointer"
                >
                  <span className="font-[family-name:var(--font-orbitron)] text-[11px] sm:text-xs font-bold text-gray-200 group-hover/chip:text-white tracking-wider">
                    {item.label}
                  </span>
                </a>
              ))}
            </motion.div>
          </div>

          {/* Main Action Bar Strip with Interactive Draggable/Clickable Slider */}
          <div className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Left: Active Telemetry */}
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 shrink-0">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="font-[family-name:var(--font-orbitron)] text-sm sm:text-base font-black text-white tracking-wider">
                  THE FUTURE IS YOURS TO{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">
                    CRACK.
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-sans mt-0.5">
                  Review challenge formats, register your team, and compete for ₹44,000.
                </div>
              </div>
            </div>

            {/* Right: The Interactive "Slide to Explore" Bar */}
            <div
              onClick={handleExplore}
              onMouseEnter={() => cyberAudio.playHover()}
              className="group/slider relative w-full md:w-80 h-12 rounded-xl bg-black/60 border border-cyan-500/30 hover:border-cyan-400/60 p-1 flex items-center justify-between overflow-hidden cursor-pointer backdrop-blur-md transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] shrink-0 select-none"
            >
              {/* Shimmer laser sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover/slider:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              {/* Guide text inside track */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-8 pr-3">
                <span className="font-[family-name:var(--font-orbitron)] font-bold text-[11px] sm:text-xs tracking-[0.2em] text-cyan-300/85 group-hover/slider:text-cyan-200 uppercase flex items-center gap-1.5 transition-colors">
                  SLIDE TO EXPLORE
                  <ChevronsRight className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                </span>
              </div>

              {/* Draggable Cyber Knob / Thumb */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 200 }}
                dragElastic={0.08}
                dragSnapToOrigin={true}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 80) {
                    handleExplore();
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className={`relative z-10 w-11 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  sliderUnlocked
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_25px_rgba(52,211,153,0.8)]"
                    : "bg-gradient-to-r from-cyan-500 to-sky-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover/slider:shadow-[0_0_25px_rgba(6,182,212,0.9)]"
                }`}
              >
                <ArrowRight className="w-4 h-4 text-black font-black" />
              </motion.div>

              {/* Sparkle icon at track end */}
              <div className="relative z-0 pr-3 pointer-events-none opacity-40 group-hover/slider:opacity-90 transition-opacity">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Transition Line into Events Section */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#07080b] to-transparent pointer-events-none" />
    </section>
  );
}
