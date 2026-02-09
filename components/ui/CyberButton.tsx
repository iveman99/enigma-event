"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

interface CyberButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    className?: string;
    icon?: React.ReactNode;
}

export default function CyberButton({
    children,
    variant = "primary",
    className,
    icon,
    ...props
}: CyberButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
                "relative group px-8 py-3 font-display font-medium tracking-wider uppercase overflow-hidden transition-all duration-300",
                "clip-path-slant border lg:text-lg",
                variant === "primary"
                    ? "bg-transparent border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                    : "bg-transparent border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10",
                className
            )}
            {...props}
        >
            {/* Glitch Effect Layers */}
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out skew-x-12" />

            <div className="relative flex items-center gap-2 z-10">
                {icon && <span className="text-xl">{icon}</span>}
                {children}
            </div>

            {/* Corner Accents */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-70" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-70" />
        </motion.button>
    );
}
