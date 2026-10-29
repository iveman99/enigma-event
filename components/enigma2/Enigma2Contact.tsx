"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Building, 
  Compass, 
  ChevronLeft, 
  ChevronRight,
  Camera
} from "lucide-react";

const CAMPUS_PHOTOS = [
  { src: "/images/campus/udcs-building-front.jpg", alt: "Department Entrance" },
  { src: "/images/campus/udcs-building-wide.jpg", alt: "Department Academic Wing" },
  { src: "/images/campus/udcs-campus-path.jpg", alt: "Campus Pathway" },
  { src: "/images/campus/udcs-campus-driveway.jpg", alt: "Green Campus Avenue" },
  { src: "/images/campus/udcs-it-park-sign.jpg", alt: "Information Technology Park Sign" },
];

export default function Enigma2Contact() {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const currentPhoto = CAMPUS_PHOTOS[activePhotoIdx];

  // Auto-scroll photos smoothly every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhotoIdx((prev) => (prev + 1) % CAMPUS_PHOTOS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : CAMPUS_PHOTOS.length - 1));
  };

  const handleNext = () => {
    setActivePhotoIdx((prev) => (prev < CAMPUS_PHOTOS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="location" className="py-24 sm:py-32 relative overflow-hidden bg-[#07080c] select-none text-gray-100">
      {/* Top Transition Border with Cyan Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />

      {/* Ambient Lighting Spotlights */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Matrix Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 2xl:px-32 relative z-10 space-y-12 sm:space-y-16">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="font-mono text-[10px] sm:text-xs font-bold text-cyan-300 tracking-[0.25em] uppercase">
              CAMPUS VENUE // MUMBAI UNIVERSITY
            </span>
          </div>

          {/* Monumental Headline */}
          <h2 className="font-[family-name:var(--font-orbitron)] font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            ENIGMA 2.0 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-amber-300 drop-shadow-[0_0_35px_rgba(6,182,212,0.6)]">LOCATION.</span>
          </h2>

          <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed">
            Department of Computer Science (UDCS), Vidyanagari, Kalina, Santacruz (East), Mumbai.
          </p>
        </div>

        {/* 2-COLUMN LOCATION SHOWCASE: REAL CAMPUS PHOTOS (LEFT) & INTERACTIVE MAP (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-8 items-stretch">
          
          {/* LEFT: REAL DEPARTMENT BUILDING PHOTOS GALLERY */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-[#0d1322]/95 via-[#080d18]/95 to-[#050810]/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            {/* Precision Corner Standoff Brackets */}
            <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400/40 pointer-events-none z-20" />
            <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/40 pointer-events-none z-20" />

            {/* TOP BAR / LABEL */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between z-10 bg-black/40">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-cyan-400" />
                <span className="font-mono text-xs font-bold text-gray-200 uppercase tracking-wider">
                  DEPARTMENT BUILDING & CAMPUS
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                0{activePhotoIdx + 1} / 0{CAMPUS_PHOTOS.length}
              </span>
            </div>

            {/* MAIN PHOTO DISPLAY (CLEAN - ZERO TEXT OVERLAY) */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-black/80 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhoto.src}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={currentPhoto.src}
                    alt={currentPhoto.alt}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Clean Navigation Arrows */}
              <button
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all z-10 shadow-lg hover:scale-110"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all z-10 shadow-lg hover:scale-110"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* PHOTO CAPTION & AUTO-CYCLE INDICATOR */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#070b14] flex items-center justify-between gap-3 min-h-[64px]">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                <Building size={14} className="text-cyan-400 shrink-0" />
                <span className="font-semibold text-white tracking-wide">{currentPhoto.alt}</span>
              </div>

              {/* Auto-Scroll Progress Indicators */}
              <div className="flex items-center gap-1.5 shrink-0">
                {CAMPUS_PHOTOS.map((_, pIdx) => {
                  const isSelected = activePhotoIdx === pIdx;
                  return (
                    <div
                      key={pIdx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isSelected
                          ? "w-6 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                          : "w-1.5 bg-white/20"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: INTERACTIVE EMBEDDED GOOGLE MAPS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-gradient-to-br from-[#0d1322]/95 via-[#080d18]/95 to-[#050810]/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            {/* Corner Standoff Brackets */}
            <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400/40 pointer-events-none z-20" />
            <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/40 pointer-events-none z-20" />

            {/* MAP HEADER */}
            <div className="p-4 sm:p-5 bg-black/40 border-b border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">MUMBAI UNIVERSITY KALINA CAMPUS</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">19.0760° N, 72.8553° E</span>
            </div>

            {/* EMBEDDED GOOGLE MAP */}
            <div className="relative w-full flex-1 min-h-[300px] sm:min-h-[360px] bg-[#070b14]">
              <iframe
                title="Department of Computer Science University of Mumbai Location"
                src="https://maps.google.com/maps?q=Department+Of+Computer+Science+Mumbai+University+Kalina&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* MAP FOOTER: JUST NAVIGATE BUTTON */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#070b14] flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=Department+of+Computer+Science+University+of+Mumbai+Kalina"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 text-black font-[family-name:var(--font-orbitron)] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all cursor-pointer"
              >
                <Navigation size={15} />
                <span>Navigate</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
