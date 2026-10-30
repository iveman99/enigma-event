"use client";

import { useState, useEffect } from "react";

import { Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";


const ScrambleText = ({ text }: { text: string }) => {
    const [display, setDisplay] = useState(text);
    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~";

    const scramble = () => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iterations) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iterations >= text.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
    };

    return (
        <span
            onMouseEnter={scramble}
            className="relative font-display font-black text-xl italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-magenta hover:from-white hover:to-white transition-all duration-300 drop-shadow-[0_0_15px_rgba(0,243,255,0.6)] cursor-pointer"
        >
            {display}
        </span>
    );
};

export default function Footer() {
    return (
        <footer className="border-t border-glass-border bg-black/50 backdrop-blur-sm py-12 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />

            <div className="container mx-auto px-6 text-center">
                <div className="mb-8">
                    <h2 className="text-3xl font-display font-bold text-white mb-2">ENIGMA<span className="text-neon-magenta">1.0</span></h2>
                    <p className="text-gray-400 font-mono text-sm max-w-md mx-auto">
                        The future is written in code. Join us for the ultimate technical showdown.
                    </p>
                </div>

                <div className="flex justify-center gap-6 mb-8">
                    <a
                        href="https://www.linkedin.com/company/placement-udcs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-neon-cyan transition-colors p-3 border border-transparent hover:border-neon-cyan/30 rounded-full hover:bg-neon-cyan/5 group"
                    >
                        <Linkedin size={24} className="group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                        href="https://www.instagram.com/udcs.mumbaiuniversity"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-neon-magenta transition-colors p-3 border border-transparent hover:border-neon-magenta/30 rounded-full hover:bg-neon-magenta/5 group"
                    >
                        <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                    </a>
                </div>

                <nav aria-label="Account and privacy information" className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-gray-400">
                    <Link href="/account-information" className="underline underline-offset-4 hover:text-white">Student accounts</Link>
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-white">Privacy policy</Link>
                    <Link href="/terms" className="underline underline-offset-4 hover:text-white">Terms of use</Link>
                </nav>
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <p className="text-xs text-gray-500 font-mono">
                            &copy; 2026 Placement Cell, UDCS.<br className="hidden md:block" /> All rights reserved.
                        </p>

                        <Link
                            href="/enigma-access"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black font-mono text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.25)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] group"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan group-hover:bg-black"></span>
                            </span>
                            <span className="font-bold">ENIGMA</span>
                            <span className="text-[10px] opacity-75 group-hover:opacity-100">VISIT</span>
                            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>

                    {/* Creative Credits */}
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <motion.div
                            className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-neon-cyan/30 transition-colors group"
                            whileHover={{ scale: 1.02 }}
                        >
                            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Built with</span>
                            <motion.span
                                className="font-bold text-xs bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-gradient-x"
                            >
                                PASSION
                            </motion.span>
                            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">by</span>
                            <a href="https://www.linkedin.com/in/veman-chippa" target="_blank" rel="noopener noreferrer">
                                <ScrambleText text="iVeman" />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
