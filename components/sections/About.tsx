"use client";

import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { Calendar, Users, Mic, Award } from "lucide-react";
import { motion } from "framer-motion";

const infoCards = [
    {
        icon: Calendar,
        title: "Feb 26–27",
        subtitle: "Two-Day Techfest",
        color: "text-neon-cyan",
        border: "border-neon-cyan"
    },
    {
        icon: Users,
        title: "Open For",
        subtitle: "Bachelor’s & Master’s Students",
        color: "text-neon-magenta",
        border: "border-neon-magenta"
    },
    {
        icon: Mic,
        title: "Industry Interaction",
        subtitle: "Guest Speakers & Networking",
        color: "text-neon-blue",
        border: "border-neon-blue"
    },
    {
        icon: Award,
        title: "₹44K",
        subtitle: "Cash Prize worth",
        color: "text-neon-violet",
        border: "border-neon-violet"
    }
];

export default function About() {
    return (
        <SectionWrapper id="about">
            <SectionHeader title="About Enigma" subtitle="Event Overview" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Text Content */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <h3 className="text-2xl font-bold text-white mb-4">Code. Create. Conquer.</h3>
                        <p className="text-gray-300 leading-relaxed text-xl">
                            <strong className="text-neon-cyan">ENIGMA 1.0</strong> is the definitive tech fest of the Department of Computer Science, University of Mumbai.
                        </p>

                        <p className="text-gray-400 leading-relaxed text-lg mt-6">
                            A high-octane arena for students to showcase innovation and problem-solving skills. Compete in dynamic challenges, collaborate with peers, and connect with industry leaders to expand your professional horizon.
                        </p>
                    </motion.div>
                </div>

                {/* Right: Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {infoCards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group"
                        >
                            <div className={`p-3 rounded-lg bg-black/30 w-fit mb-4 ${card.color} group-hover:scale-110 transition-transform`}>
                                <card.icon size={24} />
                            </div>
                            <h4 className={`font-display font-bold text-white mb-1 ${card.title === "₹44K" ? "text-4xl drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] leading-none" : "text-xl"}`}>
                                {card.title}
                            </h4>
                            <p className="text-sm text-gray-400 font-mono">{card.subtitle}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </SectionWrapper>
    );
}
