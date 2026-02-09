"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
}

export default function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
    return (
        <div className={clsx("flex flex-col items-center justify-center text-center mb-16", className)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                <h2 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue uppercase tracking-widest relative z-10">
                    {title}
                </h2>

                {/* Glitch Shadow */}
                <span className="absolute top-0 left-0 w-full h-full text-4xl md:text-6xl font-display font-bold text-neon-magenta opacity-30 animate-glitch -z-10 translate-x-1 translate-y-1">
                    {title}
                </span>
            </motion.div>

            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mt-4 text-neon-cyan/80 font-mono tracking-widest text-sm uppercase"
                >
          // {subtitle}
                </motion.p>
            )}

            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent mt-6" />
        </div>
    );
}
