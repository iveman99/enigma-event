"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
}

export default function HolographicCard({ children, className = "" }: HolographicCardProps) {
    return (
        <div className={`relative group overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md ${className}`}>
            {/* Holographic Beam */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:animate-scan-beam" />
            </div>

            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-cyan/50 rounded-tl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-cyan/50 rounded-tr opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-cyan/50 rounded-bl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-cyan/50 rounded-br opacity-50 group-hover:opacity-100 transition-opacity" />

            {children}
        </div>
    );
}
