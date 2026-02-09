"use client";

import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

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
                    {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
                        <a
                            key={i}
                            href="#"
                            className="text-gray-400 hover:text-neon-cyan transition-colors p-2 border border-transparent hover:border-neon-cyan/30 rounded-full hover:bg-neon-cyan/5"
                        >
                            <Icon size={20} />
                        </a>
                    ))}
                </div>

                <div className="text-xs text-gray-600 font-mono uppercase tracking-widest flex flex-col md:flex-row items-center justify-center gap-4">
                    <p>&copy; 2026 Placement Cell, UDCS. All rights reserved.</p>
                    <div className="h-px w-8 bg-gray-800 md:h-4 md:w-px" />
                    <p>
                        Built with <span className="text-neon-magenta animate-pulse">♥</span> by{" "}
                        <a
                            href="https://www.linkedin.com/in/veman-chippa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neon-cyan hover:text-white transition-colors border-b border-neon-cyan/30 hover:border-white"
                        >
                            iVeman
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
