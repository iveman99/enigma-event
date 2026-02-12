"use client";

import { useState, useEffect } from "react";

import { Linkedin, Instagram } from "lucide-react";
import { motion } from "framer-motion";


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

                <div className="text-xs text-gray-600 font-mono uppercase tracking-widest flex flex-col md:flex-row items-center justify-center gap-4">
                    <p>&copy; 2026 Placement Cell, UDCS. All rights reserved.</p>
                    <div className="h-px w-8 bg-gray-800 md:h-4 md:w-px" />

                    {/* Unique Creator Credit */}
                    <motion.div
                        className="relative p-[1px] rounded-full overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                    >
                        {/* Spinning Border */}
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] animate-spin-slow opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="relative flex items-center gap-2.5 px-6 py-3 rounded-full bg-black/90 backdrop-blur-xl">
                            <span className="text-gray-500 text-xs font-mono tracking-widest uppercase">Built with</span>

                            <motion.span
                                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-red-600 drop-shadow-[0_0_10px_rgba(255,69,0,0.8)] text-sm tracking-wider"
                                animate={{
                                    textShadow: ["0 0 10px rgba(255,69,0,0.6)", "0 0 25px rgba(255,69,0,1)", "0 0 10px rgba(255,69,0,0.6)"],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                PASSION
                            </motion.span>

                            <span className="text-gray-500 text-xs font-mono tracking-widest uppercase">by</span>

                            <a
                                href="https://www.linkedin.com/in/veman-chippa"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ScrambleText text="iVeman" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}
