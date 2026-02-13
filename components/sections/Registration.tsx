"use client";

import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import CyberButton from "../ui/CyberButton";
import GlassCard from "../ui/GlassCard";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Terminal, Lock, ChevronRight, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const scheduleData = {
    "Day 1": [
        {
            time: "08:30 AM",
            title: "Reporting & Registration",
            category: "Registration",
            description: "On-spot registration allowed.",
            color: "text-neon-cyan"
        },
        {
            time: "09:00 AM",
            title: "Inauguration Ceremony",
            category: "General",
            description: "Banner Drop, HOD Speech.",
            color: "text-neon-magenta"
        },
        {
            time: "09:30 AM - 12:00 PM",
            title: "Vibe Coding",
            category: "Coding Competition",
            description: "3 Hours Coding Sprint.",
            color: "text-neon-blue"
        },
        {
            time: "12:10 PM - 01:10 PM",
            title: "Guest Session: Agentic AI",
            category: "Guest Session",
            description: "Speaker: Hera Khan.",
            color: "text-neon-violet"
        },
        {
            time: "01:30 PM - 03:00 PM",
            title: "Blind Coding",
            category: "Coding Competition",
            description: "1 Hour Coding Challenge.",
            color: "text-neon-green"
        },
        {
            time: "02:00 PM - 05:00 PM",
            title: "Data Dash",
            category: "Data Science",
            description: "Judges review at 4:30 PM.",
            color: "text-neon-orange" // Assuming neon-orange exists or fallback to something else, checking colors. Let's stick to existing palette: cyan, magenta, blue, violet, green.
        }
    ],
    "Day 2": [
        {
            time: "08:30 AM",
            title: "Reporting & Registration",
            category: "Registration",
            description: "On-spot registration allowed.",
            color: "text-neon-cyan"
        },
        {
            time: "09:00 AM - 10:15 AM",
            title: "Decode The Hunt",
            category: "Treasure Hunt",
            description: "1 Hr 15 Min Campus Hunt.",
            color: "text-neon-magenta"
        },
        {
            time: "10:30 AM - 11:30 AM",
            title: "FIFA Addicts",
            category: "Gaming",
            description: "Gaming Event.",
            color: "text-neon-green"
        },
        {
            time: "11:45 AM - 12:45 PM",
            title: "Guest Session: AI in Data",
            category: "Guest Session",
            description: "Creating Dashboards with AI.",
            color: "text-neon-blue"
        },
        {
            time: "01:15 PM - 03:45 PM",
            title: "UI/UX Re-Design",
            category: "Design Competition",
            description: "2.5 Hours. Judges review at 4:30 PM.",
            color: "text-neon-violet"
        },
        {
            time: "04:00 PM Onwards",
            title: "Award Ceremony",
            category: "Celebration",
            description: "Prize Distribution.",
            color: "text-neon-cyan"
        }
    ]
};

const TimelineView = ({ onBack }: { onBack: () => void }) => {
    const [activeDay, setActiveDay] = useState<"Day 1" | "Day 2">("Day 1");
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="w-full">
            {/* Header / Back Button */}
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-neon-cyan hover:text-white transition-colors text-sm font-mono uppercase tracking-wider"
                >
                    <ArrowLeft size={16} /> Back to Terminal
                </button>
                <h3 className="text-xl font-display font-bold text-white uppercase tracking-widest">
                    Event Timeline
                </h3>
            </div>

            {/* Day Toggles */}
            <div className="flex justify-center mb-12">
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm relative">
                    {(["Day 1", "Day 2"] as const).map((day) => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`relative px-6 py-2 rounded-xl text-xs md:text-sm font-display uppercase tracking-wider transition-all duration-300 z-10 ${activeDay === day ? "text-black font-bold" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {activeDay === day && (
                                <motion.div
                                    layoutId="activeTimelineTab"
                                    className="absolute inset-0 bg-neon-cyan rounded-xl box-shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">
                                {day === "Day 1" ? "FEB 26" : "FEB 27"}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline Container */}
            <div ref={containerRef} className="relative max-w-3xl mx-auto min-h-[500px]">
                {/* Background Line (Faint) */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/5 md:-translate-x-1/2" />

                {/* Scroll Progress Line (Glowing) */}
                <motion.div
                    className="absolute left-4 md:left-1/2 top-0 w-px bg-gradient-to-b from-neon-cyan via-white to-neon-cyan md:-translate-x-1/2 shadow-[0_0_15px_rgba(0,243,255,0.8)] origin-top"
                    style={{ scaleY, height: "100%" }}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeDay}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 pt-4 pb-12"
                    >
                        {scheduleData[activeDay].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row items-center gap-6 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Timeline Node */}
                                <div className="absolute left-4 md:left-1/2 w-3 h-3 -translate-x-1/2 bg-black border border-neon-cyan rounded-full z-10 box-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                                </div>

                                {/* Content Card */}
                                <div className="w-full md:w-[calc(50%-2rem)] pl-12 md:pl-0">
                                    <div className={`p-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon-cyan/30 transition-colors ${item.color.replace('text-', 'border-l-2 ')}`}>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`font-mono text-lg font-bold ${item.color}`}>
                                                    {item.time}
                                                </span>
                                                <div className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-gray-500 uppercase">
                                                    {item.category.split(' ')[0]}
                                                </div>
                                            </div>
                                            <h3 className="text-base font-bold text-white uppercase tracking-wide leading-tight">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Empty space for alternating layout */}
                                <div className="hidden md:block w-[calc(50%-2rem)]" />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default function Registration() {
    const [lines, setLines] = useState([
        "> INITIATING_SECURE_CONNECTION...",
        "> VERIFYING_ENCRYPTION_KEYS...",
        "> CONNECTION_ESTABLISHED."
    ]);
    const [showTimeline, setShowTimeline] = useState(false);

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
            <div id="timeline" className="absolute -top-20" />
            <SectionHeader title="Access Protocol" subtitle="Join The Network" />

            <div className="max-w-4xl mx-auto">
                <motion.div
                    layout
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

                    <AnimatePresence mode="wait">
                        {!showTimeline ? (
                            <motion.div
                                key="terminal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2"
                            >
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

                                    <div className="relative z-10 w-full">
                                        <Terminal size={48} className="text-neon-cyan mb-6 mx-auto" />
                                        <h3 className="text-2xl font-display font-bold text-white mb-2">Event Sequence</h3>
                                        <p className="text-gray-400 text-sm mb-8">
                                            Access the classified timeline. Synchronize your optical sensors with the event schedule.
                                        </p>

                                        <CyberButton
                                            variant="primary"
                                            className="w-full justify-center group"
                                            icon={<ChevronRight size={18} />}
                                            onClick={() => setShowTimeline(true)}
                                        >
                                            <span className="group-hover:text-black transition-colors">View Timeline</span>
                                        </CyberButton>

                                        <p className="mt-4 text-[10px] font-mono text-gray-600 uppercase">
                                            * Encrypted via SHA-256 Protocol
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="timeline"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6 md:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar"
                            >
                                <TimelineView onBack={() => setShowTimeline(false)} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </SectionWrapper>
    );
}
