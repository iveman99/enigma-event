"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CyberCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleLinkHoverStart = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                setIsHovering(true);
            }
        };

        const handleLinkHoverEnd = () => setIsHovering(false);

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        // Add event listeners to all clickable elements
        document.body.addEventListener("mouseover", handleLinkHoverStart);
        document.body.addEventListener("mouseout", handleLinkHoverEnd);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            document.body.removeEventListener("mouseover", handleLinkHoverStart);
            document.body.removeEventListener("mouseout", handleLinkHoverEnd);
        };
    }, []);

    return (
        <>
            {/* Main Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 bg-neon-cyan/80 rounded-full pointer-events-none z-[9999] mix-blend-screen"
                animate={{
                    x: mousePosition.x - 8,
                    y: mousePosition.y - 8,
                    scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
                }}
                transition={{ type: "spring", stiffness: 1000, damping: 20 }}
            />

            {/* Trailing Ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-neon-cyan/50 rounded-full pointer-events-none z-[9998]"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isClicking ? 1.5 : isHovering ? 2 : 1,
                    opacity: isHovering ? 0.5 : 1
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
        </>
    );
}
