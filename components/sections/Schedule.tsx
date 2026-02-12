"use client";

import { useState, useRef } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Clock, Calendar, MapPin } from "lucide-react";

const scheduleData = {
    "Day 1": [
        {
            time: "09:00 AM",
            title: "Inauguration Ceremony",
            category: "General",
            description: "Kickstarting ENIGMA 1.0 with energy and vision.",
            color: "text-neon-cyan"
        },
        {
            time: "10:00 AM",
            title: "Compile The Vibes",
            category: "Coding Competition",
            description: "High-octane coding sprint.",
            color: "text-neon-cyan"
        },
        {
            time: "01:00 PM",
            title: "Blind Dates With Code",
            category: "Coding Competition",
            description: "Coding without a monitor. Pure logic.",
            color: "text-neon-magenta"
        },
        {
            time: "03:00 PM",
            title: "UI-niverse",
            category: "Design Competition",
            description: "Redesigning the digital world.",
            color: "text-neon-blue"
        }
    ],
    "Day 2": [
        {
            time: "09:00 AM",
            title: "FIFA Addicts",
            category: "Gaming Competition",
            description: "The ultimate football showdown.",
            color: "text-neon-cyan"
        },
        {
            time: "11:00 AM",
            title: "Decode The Hunt",
            category: "Problem Solving Competition",
            description: "Campus-wide treasure hunt.",
            color: "text-neon-magenta"
        },
        {
            time: "02:00 PM",
            title: "Data Dash",
            category: "Data Science Competition",
            description: "Unlocking insights from data.",
            color: "text-neon-violet"
        },
        {
            time: "05:00 PM",
            title: "Award Ceremony",
            category: "Celebration",
            description: "Honoring the champions of ENIGMA.",
            color: "text-neon-green"
        }
    ]
};

export default function Schedule() {
    const [activeDay, setActiveDay] = useState<"Day 1" | "Day 2">("Day 1");

    return (
        <SectionWrapper id="schedule">
            <SectionHeader title="Timeline" subtitle="Synchronize Your Watch" />

            {/* Day Toggles */}
            <div className="flex justify-center mb-16">
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm relative">
                    {(["Day 1", "Day 2"] as const).map((day) => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`relative px-8 py-3 rounded-xl text-sm md:text-base font-display uppercase tracking-wider transition-all duration-300 z-10 ${activeDay === day ? "text-black font-bold" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {activeDay === day && (
                                <motion.div
                                    layoutId="activeTimelineTab"
                                    className="absolute inset-0 bg-neon-cyan rounded-xl box-shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex flex-col items-center leading-tight">
                                <span>{day === "Day 1" ? "FEB 26" : "FEB 27"}</span>
                                <span className="text-[10px] opacity-70">{day}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline Container */}
            <div className="relative max-w-4xl mx-auto min-h-[600px]">
                {/* Central Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neon-cyan to-transparent md:-translate-x-1/2 opacity-30" />
                <motion.div
                    className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan via-white to-neon-cyan md:-translate-x-1/2 shadow-[0_0_15px_rgba(0,243,255,0.8)]"
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeDay}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-12"
                    >
                        {scheduleData[activeDay].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Timeline Node */}
                                <div className="absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 bg-black border-2 border-neon-cyan rounded-full z-10 shadow-[0_0_15px_rgba(0,243,255,0.8)]">
                                    <div className="absolute inset-0 bg-neon-cyan rounded-full animate-ping opacity-50" />
                                </div>

                                {/* Content Card */}
                                <div className="w-full md:w-[calc(50%-2rem)] pl-12 md:pl-0">
                                    <GlassCard className={`p-6 border-l-4 ${index % 2 === 0 ? "md:border-l-0 md:border-r-4" : ""} ${item.color.replace('text-', 'border-')}`}>
                                        <div className="flex flex-col gap-2">
                                            {/* Header */}
                                            <div className="flex justify-between items-start">
                                                <span className={`font-mono text-2xl font-bold ${item.color} drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]`}>
                                                    {item.time}
                                                </span>
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
                                                {item.title}
                                            </h3>

                                            <div className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 self-start text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                                                [{item.category}]
                                            </div>

                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </GlassCard>
                                </div>

                                {/* Empty space for alternating layout */}
                                <div className="hidden md:block w-[calc(50%-2rem)]" />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </SectionWrapper>
    );
}
