"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Trophy } from "lucide-react";
import { cyberAudio } from "@/lib/audio";
import Image from "next/image";
import Enigma2PrizeLockup from "@/components/enigma2/Enigma2PrizeLockup";

interface Enigma2HeroProps {
  onOpenRegister?: () => void;
  onOpenAuth?: () => void;
  onOpenPasses?: () => void;
}

export default function Enigma2Hero({
  onOpenRegister,
  onOpenAuth,
  onOpenPasses
}: Enigma2HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  // Techfest signature scroll-driven animation
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Cinematic scroll transforms: background scales and translates, content lifts and fades
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentY = useTransform(scrollYProgress, [0, 0.25], [0, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.96]);
  const darkOverlay = useTransform(scrollYProgress, [0, 0.8], [0.35, 0.95]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-[#07080b] pt-2 sm:pt-4 md:pt-5 pb-8 sm:pb-12"
    >
      {/* Epic Cinematic Background - Pure Monumental Sci-Fi Landscape (No Soldier/Character) */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          scale: bgScale,
          y: bgY,
        }}
      >
        <Image
          src="/images/enigma2-celestial-hero.jpg"
          alt="ENIGMA 2027 - Celestial Horizon Odyssey"
          fill
          className="object-cover object-center"
          priority
          quality={95}
        />
        {/* Soft vignette and smooth bottom gradient transition */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-black/25 to-black/50"
          style={{ opacity: darkOverlay }}
        />
      </motion.div>

      {/* Hero Layout: Top-Left Header + Below-Logo Prize Lockup (Matching Enigma Neon Aesthetic) */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
        className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex-1 flex flex-col justify-start items-start relative z-20 pointer-events-none"
      >
        {/* Top-Left Logos & ENIGMA 2.0 Header */}
        <div className="flex items-start pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative select-none flex items-start gap-2.5 sm:gap-3.5 md:gap-5 lg:gap-6"
          >
            {/* Left Logo: University of Mumbai */}
            <div className="flex flex-col items-center shrink-0 text-center hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-[192/226] h-11 sm:h-14 md:h-16 lg:h-18 drop-shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
                <Image
                  src="/images/logo-mu.png"
                  alt="University of Mumbai"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-[family-name:var(--font-orbitron)] text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold text-gray-200 tracking-wider leading-[1.25] text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] mt-1.5 sm:mt-2 uppercase whitespace-nowrap block">
                University of<br />Mumbai
              </span>
            </div>

            {/* Center: ENIGMA Shifted Down so logos stay up, with 2.0 under right tail of A */}
            <div className="relative mt-4 sm:mt-5 md:mt-7 lg:mt-8 flex items-baseline leading-none">
              <span className="enigma-broken-font font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.8rem] uppercase leading-none">
                ENIGM
              </span>
              <div className="relative inline-flex flex-col items-center">
                <span className="enigma-broken-font font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.8rem] uppercase leading-none tracking-normal">
                  A
                </span>
                {/* 2.0 placed exactly below the right tail of letter A */}
                <span className="absolute top-[82%] sm:top-[85%] right-0 font-[family-name:var(--font-orbitron)] font-black text-xs sm:text-sm md:text-base lg:text-lg tracking-wider text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.65)] whitespace-nowrap">
                  2.0
                </span>
              </div>
            </div>

            {/* Right Logo: Department of Computer Science UDCS */}
            <div className="flex flex-col items-center shrink-0 text-center hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-square h-11 sm:h-14 md:h-16 lg:h-18 drop-shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
                <Image
                  src="/images/logo-udcs-clean.png"
                  alt="Department of Computer Science UDCS"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-[family-name:var(--font-orbitron)] text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold text-gray-200 tracking-wider leading-[1.25] text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] mt-1.5 sm:mt-2 uppercase whitespace-nowrap block">
                Department of<br />Computer Science
              </span>
            </div>
          </motion.div>
        </div>

        {/* Directly Below Our Logo: Enigma 2.0 Neon Synthwave Lockup (Pill + ₹44,000 + Tagline + Register CTA) */}
        <div className="pointer-events-auto mt-4 sm:mt-5 ml-4 sm:ml-8 lg:ml-12 w-full max-w-[420px] sm:max-w-[500px] md:max-w-[560px]">
          <Enigma2PrizeLockup
            eventDate="16 JAN 2027"
            targetAmount={44000}
            tagline="THE FUTURE IS YOURS TO CRACK."
            formatSubtitle="ONE DAY. MULTIPLE CHALLENGES."
            onRegister={onOpenRegister}
          />
        </div>
      </motion.div>

      {/* Techfest SCROLL Indicator - Positioned cleanly at bottom without crowding */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-20 flex flex-col items-center gap-2 cursor-pointer pointer-events-auto mt-2"
      >
        <a
          href="#about"
          onClick={() => cyberAudio.playClick()}
          className="flex flex-col items-center gap-2 group"
        >
          <span className="text-[10px] font-sans font-semibold text-gray-400 tracking-[0.3em] uppercase group-hover:text-white transition-colors">
            SCROLL
          </span>
          <div className="w-[1.5px] h-8 bg-white/20 relative overflow-hidden rounded-full">
            <div className="w-full h-full bg-white [animation:scroll-drop_2s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
          </div>
        </a>
      </motion.div>
    </section>
  );
}
