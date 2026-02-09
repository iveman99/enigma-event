"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export default function GlassCard({ children, className, hoverEffect = true }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={hoverEffect ? { y: -5, boxShadow: "0 0 20px -5px var(--neon-blue)" } : {}}
            className={clsx(
                "relative rounded-xl border border-glass-border bg-glass-bg backdrop-blur-md overflow-hidden",
                "transition-all duration-300",
                className
            )}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
