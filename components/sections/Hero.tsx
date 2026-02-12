"use client";

import { motion } from "framer-motion";
import CyberButton from "../ui/CyberButton";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

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
                    <a
                        href="https://www.linkedin.com/company/placement-udcs/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 backdrop-blur-md flex items-center gap-3 shadow-[0_0_15px_-5px_rgba(0,243,255,0.3)] hover:bg-neon-cyan/10 transition-colors cursor-pointer"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                        </span>
                        <span className="text-xs md:text-sm font-mono text-neon-cyan tracking-widest">
                            INITIATED_BY_PLACEMENT_CELL_UDCS
                        </span>
                    </a>
                </motion.div>

                {/* Main Title */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="mb-8 relative"
                >
                    <div className="relative w-full max-w-4xl mx-auto h-32 md:h-48 mb-4">
                        <Image
                            src="/images/enigma-logo.png"
                            alt="ENIGMA"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            priority
                        />
                    </div>
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
                                FEB 26 & 27
                            </span>
                        </div>
                    </motion.div>

                    {/* Prize Pool Display */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.8 }}
                        className="mt-8 mb-4 flex flex-col items-center"
                    >
                        <div className="relative group cursor-default">
                            <div className="absolute -inset-4 bg-neon-magenta/20 blur-xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow"></div>
                            <h2 className="relative text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta via-white to-neon-magenta drop-shadow-[0_0_15px_rgba(255,0,85,0.8)] z-10">
                                ₹44,000+
                            </h2>
                            <div className="absolute top-0 left-0 w-full h-full border-t border-b border-neon-magenta/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </div>
                        <p className="mt-2 text-sm md:text-base text-neon-magenta/80 font-mono tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(255,0,85,0.5)]">
                            Total Prize Pool
                        </p>
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
                    className="flex flex-col md:flex-row gap-8 justify-center items-center"
                >
                    <CyberButton variant="primary" icon={<ArrowRight size={20} />} className="w-56 justify-center">
                        Explore Events
                    </CyberButton>
                    <CyberButton variant="secondary" onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })} className="w-56 justify-center">
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
