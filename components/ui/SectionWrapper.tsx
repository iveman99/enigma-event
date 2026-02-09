"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface SectionWrapperProps {
    children: React.ReactNode;
    id?: string;
    className?: string;
}

export default function SectionWrapper({ children, id, className }: SectionWrapperProps) {
    return (
        <section id={id} className={clsx("relative py-20 md:py-32 overflow-hidden", className)}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="container mx-auto px-6 relative z-10"
            >
                {children}
            </motion.div>

            {/* Background Grid/Noise (Optional overlay) */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px] pointer-events-none -z-10" />
        </section>
    );
}
