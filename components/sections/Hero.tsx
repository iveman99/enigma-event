"use client";

import { motion } from "framer-motion";
import CyberButton from "../ui/CyberButton";
import { ArrowRight } from "lucide-react";

import EnigmaCore from "../ui/EnigmaCore";
// ... existing imports

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            <EnigmaCore />
            <div className="container mx-auto px-6 text-center relative z-10">


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-2 mb-8"
                >
                    <div className="px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 backdrop-blur-md flex items-center gap-3 shadow-[0_0_15px_-5px_rgba(0,243,255,0.3)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                        </span>
                        <span className="text-xs md:text-sm font-mono text-neon-cyan tracking-widest">
                            INITIATED_BY_PLACEMENT_CELL_UDCS
                        </span>
                    </div>
                </motion.div>

                {/* Main Title */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="mb-8 relative"
                >
                    <h1 className="text-6xl md:text-9xl font-[family-name:var(--font-libre-baskerville)] font-bold tracking-[0.2em] uppercase text-white/90 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        ENIGMA
                    </h1>
                    <h1 className="text-6xl md:text-9xl font-[family-name:var(--font-libre-baskerville)] font-bold tracking-[0.2em] uppercase text-neon-blue absolute top-0 left-0 w-full animate-glitch opacity-30 z-0">
                        ENIGMA
                    </h1>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <span className="h-px w-12 bg-neon-magenta" />
                        <span className="text-4xl md:text-6xl font-display font-bold text-neon-magenta">1.0</span>
                        <span className="h-px w-12 bg-neon-magenta" />
                    </div>

                    {/* Event Dates */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-6 mb-2"
                    >
                        <div className="inline-block px-6 py-2 border border-neon-cyan/50 bg-neon-cyan/10 rounded-full backdrop-blur-sm">
                            <span className="text-xl md:text-2xl font-mono font-bold text-neon-cyan tracking-widest drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                                FEB 27 & 28
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-gray-400 text-lg md:text-xl font-mono tracking-wide mb-12 max-w-2xl mx-auto"
                >
                    DECODE. <span className="text-neon-cyan">BUILD.</span> COMPETE.
                    <br />
                    <span className="text-sm opacity-70">Where ideas turn into execution.</span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center"
                >
                    <CyberButton variant="primary" icon={<ArrowRight size={20} />}>
                        Explore Events
                    </CyberButton>
                    <CyberButton variant="secondary" onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}>
                        Register Now
                    </CyberButton>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-10 hidden md:block">
                <div className="text-xs font-mono text-gray-600 rotate-90 origin-bottom-left">
                    SCROLL_TO_EXPLORE_Unknown_Territory
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-1">
                    <div className="w-1 h-3 bg-neon-cyan rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
