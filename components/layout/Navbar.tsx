"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const navLinks = [
    { name: "About", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Schedule", href: "#schedule" },
    { name: "Team", href: "#team" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={clsx(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-black/80 backdrop-blur-md border-neon-cyan/20 py-4" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="#" className="text-2xl font-display font-bold text-white tracking-widest hover:text-neon-cyan transition-colors">
                    ENIGMA<span className="text-neon-cyan">1.0</span>
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-mono uppercase tracking-widest text-gray-300 hover:text-neon-cyan transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan group-hover:w-full transition-all duration-300" />
                        </a>
                    ))}
                    <a
                        href="#register"
                        className="px-6 py-2 border border-neon-cyan text-neon-cyan font-display text-sm uppercase hover:bg-neon-cyan hover:text-black transition-all duration-300"
                    >
                        Register
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white hover:text-neon-cyan transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-b border-neon-cyan/20 overflow-hidden"
                    >
                        <div className="flex flex-col items-center gap-6 py-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-mono uppercase tracking-widest text-gray-300 hover:text-neon-cyan transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="#register"
                                className="px-8 py-3 border border-neon-cyan text-neon-cyan font-display text-lg uppercase hover:bg-neon-cyan hover:text-black transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Register Now
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
