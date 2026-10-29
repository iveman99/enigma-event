"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Maximize2,
  Film,
  Camera,
  Trophy
} from "lucide-react";
import { cyberAudio } from "@/lib/audio";

interface GalleryMedia {
  id: string;
  type: "video" | "image";
  src: string;
  title: string;
  tag: string;
  subtitle: string;
  description: string;
  date: string;
}

// 13 Items: Mixed & Shuffled Videos and Photos
const GALLERY_ITEMS: GalleryMedia[] = [
  {
    id: "v-aftermovie",
    type: "video",
    src: "/enigma1/enigma1-aftermovie.mp4",
    title: "Official Festival Aftermovie",
    tag: "VIDEO",
    subtitle: "Enigma 1.0 Cinema Recap",
    description: "Official aftermovie capturing the inauguration, coding marathons, FIFA arena, and stage ceremonies at UDCS Mumbai.",
    date: "March 11, 2026"
  },
  {
    id: "p-code",
    type: "image",
    src: "/enigma1/5.jpg",
    title: "Blind Date With Code Champions",
    tag: "PHOTO",
    subtitle: "Raza Sayyed, Adnan Irfani & Bhagyalakshmi",
    description: "Celebrating the top coders who conquered blind typing and pure logic in the signature coding circuit.",
    date: "March 11, 2026"
  },
  {
    id: "v-arena",
    type: "video",
    src: "/enigma1/enigma1-arena.mp4",
    title: "Esports Arena Battles",
    tag: "VIDEO",
    subtitle: "FIFA Tournament Action",
    description: "Action-packed gameplay footage and cheering spectators during the FIFA tournament finals.",
    date: "March 11, 2026"
  },
  {
    id: "p-kanojia",
    type: "image",
    src: "/enigma1/4.jpg",
    title: "Dr. Mahendra Kanojia",
    tag: "PHOTO",
    subtitle: "Inaugurating ENIGMA 2026",
    description: "Inaugural address by Dr. Mahendra Kanojia, inspiring university scholars and tech delegates with his visionary keynote.",
    date: "March 11, 2026"
  },
  {
    id: "v-highlights",
    type: "video",
    src: "/enigma1/enigma1-highlights.mp4",
    title: "Stage Ceremony Highlights",
    tag: "VIDEO",
    subtitle: "Awards & Distribution",
    description: "Official award presentations and speech moments honoring victorious delegates on the main auditorium stage.",
    date: "March 11, 2026"
  },
  {
    id: "p-vibes",
    type: "image",
    src: "/enigma1/8.jpg",
    title: "Compile The Vibes Champions",
    tag: "PHOTO",
    subtitle: "Aayan Shaikh, Avaish Khan & Vidhan Gambhir",
    description: "First place victors in the rapid-fire debugging and real-time execution sprint.",
    date: "March 11, 2026"
  },
  {
    id: "p-fifa",
    type: "image",
    src: "/enigma1/6.jpg",
    title: "FIFA Addicts Esports Champions",
    tag: "PHOTO",
    subtitle: "Yash Nikalje, Partik Charya & Om Mahadik",
    description: "Champions of the intense tournament bracket who lifted the Enigma 1.0 esports trophy.",
    date: "March 11, 2026"
  },
  {
    id: "v-preview",
    type: "video",
    src: "/enigma1/enigma1-preview.mp4",
    title: "Fast Showcase Reel",
    tag: "VIDEO",
    subtitle: "High-Paced Festival Cut",
    description: "A fast-cut vertical reel highlighting student crowds, coding intensity, and celebration moments.",
    date: "March 11, 2026"
  },
  {
    id: "p-hunt",
    type: "image",
    src: "/enigma1/7.jpg",
    title: "Decode The Hunt Champions",
    tag: "PHOTO",
    subtitle: "Suthakar Anburaj, Gandhar Bagde & Umair Momin",
    description: "The detective minds who cracked multi-stage cryptographic ciphers across Mumbai University Kalina campus.",
    date: "March 11, 2026"
  },
  {
    id: "v-crowd",
    type: "video",
    src: "/enigma1/enigma1-crowd.mp4",
    title: "Auditorium Crowd Energy",
    tag: "VIDEO",
    subtitle: "Live Delegate Roars",
    description: "The electric atmosphere, chants, and thunderous applause from student delegates inside the UDCS auditorium.",
    date: "March 11, 2026"
  },
  {
    id: "p-saluja",
    type: "image",
    src: "/enigma1/3.jpg",
    title: "Mr. Vipul Saluja",
    tag: "PHOTO",
    subtitle: "Industry Visionary Address",
    description: "Keynote address by Mr. Vipul Saluja on software engineering careers, distributed systems, and modern tech innovation.",
    date: "March 11, 2026"
  },
  {
    id: "p-shinde",
    type: "image",
    src: "/enigma1/1.jpg",
    title: "Event Judge: Mr. Jayesh Shinde",
    tag: "PHOTO",
    subtitle: "Technical Jury & Mentor",
    description: "Critical technical evaluation, mentorship, and project appraisal across student competition circuits.",
    date: "March 11, 2026"
  },
  {
    id: "p-sen",
    type: "image",
    src: "/enigma1/2.jpg",
    title: "Event Judge: Ms. Indrani Sen",
    tag: "PHOTO",
    subtitle: "Academic Jury & Guidance",
    description: "Esteemed judge assessing algorithmic structure, innovative thinking, and student presentation.",
    date: "March 11, 2026"
  },
];

export default function Enigma2LegacyGallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "ArrowRight") {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % GALLERY_ITEMS.length : 0));
      } else if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) => (prev !== null ? (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length : 0));
      } else if (e.key === "Escape") {
        setSelectedIdx(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx]);

  const activeItem = selectedIdx !== null ? GALLERY_ITEMS[selectedIdx] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    cyberAudio.playClick();
    setSelectedIdx((prev) => (prev !== null ? (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length : 0));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    cyberAudio.playClick();
    setSelectedIdx((prev) => (prev !== null ? (prev + 1) % GALLERY_ITEMS.length : 0));
  };

  return (
    <section 
      id="legacy" 
      className="py-10 sm:py-14 relative overflow-hidden bg-[#04060b] select-none text-gray-100 border-t border-white/10"
    >
      {/* Subtle Ambient Backdrops */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 relative z-10">
        
        {/* ============================================================== */}
        {/* CURVISH CONTAINER BOX - CENTERED HEADER & TIGHT PADDING       */}
        {/* ============================================================== */}
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#0c101d]/95 via-[#080b14]/95 to-[#05070f]/95 border-2 border-white/15 p-5 sm:p-7 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">
          
          {/* Subtle Corner Brackets */}
          <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400/40 pointer-events-none" />
          <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/40 pointer-events-none" />
          <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400/40 pointer-events-none" />
          <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400/40 pointer-events-none" />

          {/* CENTERED HEADER (Simple, clear wording - no confusion between last year & current event) */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            {/* Archive Status Pill - No // design */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-[10px] sm:text-xs font-[family-name:var(--font-jetbrains-mono)] font-bold text-amber-300 uppercase shadow-md tracking-wider">
              <Trophy size={13} className="text-amber-400 shrink-0" />
              <span>LAST YEAR&apos;S EVENT • 11 MARCH 2026</span>
            </div>

            {/* Title */}
            <h2 className="font-[family-name:var(--font-orbitron)] font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
              ENIGMA 1.0{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300">
                MEMORIES
              </span>
            </h2>

            {/* Simple, clear wording */}
            <div className="space-y-1.5">
              <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs sm:text-sm text-gray-300 leading-relaxed">
                Photos and videos from our last year&apos;s event held on <span className="text-amber-300 font-bold">11 March 2026</span>.
              </p>
              <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] sm:text-xs text-cyan-300 font-medium">
                Our upcoming event <span className="text-white font-bold">Enigma 2.0</span> is happening on <span className="text-cyan-300 font-bold underline underline-offset-2">16 January 2027</span>.
              </p>
            </div>
          </div>

          {/* 13 SHUFFLED & MIXED BOXES (VIDEOS & PHOTOS RUNNING PARALLELLY) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-3.5 pt-1">
            {GALLERY_ITEMS.map((item, idx) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  cyberAudio.playClick();
                  setSelectedIdx(idx);
                }}
                className={`group relative rounded-2xl overflow-hidden bg-black/80 border cursor-pointer shadow-lg flex flex-col justify-between transition-all ${
                  item.type === "video" 
                    ? "border-cyan-500/40 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    : "border-white/15 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  {item.type === "video" ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video
                        src={item.src}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        muted
                        playsInline
                        loop
                        autoPlay
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-all">
                        <div className="w-8 h-8 rounded-full bg-cyan-400/90 text-black flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Play size={13} className="translate-x-0.5 fill-black" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Top Badge: Type Indicator */}
                  <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase shadow-sm border ${
                    item.type === "video"
                      ? "bg-cyan-950/85 border-cyan-400/50 text-cyan-300"
                      : "bg-amber-950/85 border-amber-400/50 text-amber-300"
                  }`}>
                    {item.tag}
                  </div>

                  {/* Expand icon */}
                  <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={10} />
                  </div>
                </div>

                {/* Bottom title strip */}
                <div className="p-2 sm:p-2.5 bg-[#080b15] border-t border-white/10 space-y-0.5">
                  <h4 className="font-[family-name:var(--font-orbitron)] font-bold text-[10.5px] text-white truncate group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[9.5px] text-gray-400 truncate font-sans">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN LIGHTBOX MODAL                                      */}
      {/* ============================================================== */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl"
          >
            {/* Previous Arrow Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous item"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all z-20 shadow-2xl hover:scale-110 cursor-pointer"
            >
              <ChevronLeft size={26} />
            </button>

            {/* Next Arrow Button */}
            <button
              onClick={handleNext}
              aria-label="Next item"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all z-20 shadow-2xl hover:scale-110 cursor-pointer"
            >
              <ChevronRight size={26} />
            </button>

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[92vh] rounded-3xl bg-[#0c0f1b] border-2 border-white/20 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Top Bar */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/60">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    activeItem.type === "video"
                      ? "bg-cyan-950/80 border-cyan-500/50 text-cyan-300"
                      : "bg-amber-950/80 border-amber-500/50 text-amber-300"
                  }`}>
                    {activeItem.tag} ARCHIVE
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-orbitron)] text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      {activeItem.title}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400">
                      {selectedIdx !== null ? selectedIdx + 1 : 1} of {GALLERY_ITEMS.length} • {activeItem.date}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIdx(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Media Display Viewport */}
              <div className="relative flex-1 min-h-[300px] sm:min-h-[480px] bg-black flex items-center justify-center overflow-hidden">
                {activeItem.type === "video" ? (
                  <video
                    src={activeItem.src}
                    className="max-h-[68vh] w-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <div className="relative w-full h-[65vh]">
                    <Image
                      src={activeItem.src}
                      alt={activeItem.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer Description */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#090b14] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {activeItem.subtitle}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedIdx(null)}
                  className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto cursor-pointer shadow-lg shrink-0 hover:bg-gray-200"
                >
                  Close Viewer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
