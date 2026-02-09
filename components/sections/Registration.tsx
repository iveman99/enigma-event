"use client";

import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import CyberButton from "../ui/CyberButton";
import { motion } from "framer-motion";
import { Terminal, Lock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Registration() {
    const [lines, setLines] = useState([
        "> INITIATING_SECURE_CONNECTION...",
        "> VERIFYING_ENCRYPTION_KEYS...",
        "> CONNECTION_ESTABLISHED."
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLines(prev => {
                if (prev.length > 5) return prev.slice(1);
                return [...prev, `> SYNCING_DATA_PACKET_${Math.floor(Math.random() * 999)}...`];
            })
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SectionWrapper id="register">
            <SectionHeader title="Access Protocol" subtitle="Join The Network" />

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="border border-neon-cyan/30 rounded-lg overflow-hidden bg-black/80 backdrop-blur-xl shadow-[0_0_50px_-20px_rgba(0,243,255,0.2)]"
                >
                    {/* Terminal Header */}
                    <div className="bg-white/5 border-b border-white/10 p-3 flex items-center justify-between">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                            <Lock size={12} />
                            SECURE_SHELL_V1.0
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left: Terminal Output */}
                        <div className="p-6 font-mono text-xs md:text-sm text-green-500/80 border-r border-white/10 space-y-2 min-h-[300px]">
                            {lines.map((line, i) => (
                                <div key={i} className="opacity-80">{line}</div>
                            ))}
                            <div className="animate-pulse">_</div>
                        </div>

                        {/* Right: CTA */}
                        <div className="p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-neon-cyan/5 z-0" />

                            <div className="relative z-10">
                                <Terminal size={48} className="text-neon-cyan mb-6 mx-auto" />
                                <h3 className="text-2xl font-display font-bold text-white mb-2">Initialize Registration</h3>
                                <p className="text-gray-400 text-sm mb-8">
                                    Secure your spot in the mainframe. Limited slots available for all modules.
                                </p>

                                <CyberButton variant="primary" className="w-full justify-center group" icon={<ChevronRight size={18} />}>
                                    <span className="group-hover:text-black transition-colors">Execute Registration</span>
                                </CyberButton>

                                <p className="mt-4 text-[10px] font-mono text-gray-600 uppercase">
                                    * Encrypted via SHA-256 Protocol
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </SectionWrapper>
    );
}
