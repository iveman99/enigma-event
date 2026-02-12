"use client";

import { Linkedin, Instagram } from "lucide-react";

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
                    <div className="flex items-center gap-2">
                        <span>Built with</span>
                        <span className="text-neon-magenta animate-pulse text-lg">♥</span>
                        <span>by</span>
                        <a
                            href="https://www.linkedin.com/in/veman-chippa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group text-neon-cyan font-bold tracking-wider hover:text-white transition-colors"
                        >
                            <span className="absolute -inset-1 bg-neon-cyan/20 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10 px-2 py-1 border border-transparent group-hover:border-neon-cyan/50 rounded-md bg-transparent group-hover:bg-neon-cyan/10">
                                iVeman
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
