"use client";

import { useState } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { Code, Palette, Map, Laptop, Gamepad, Terminal, Trophy, Users, Clock, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const events = [
    // Day 1
    {
        id: "vibe-coding",
        title: "Vibe Coding Sprint",
        day: "Day 1",
        date: "Feb 26",
        category: "Coding",
        icon: Code,
        color: "text-neon-cyan",
        description: "A rapid build challenge where participants convert ideas into working digital products using modern no-code/low-code and AI-assisted development tools.",
        problemStatement: "A simple SaaS PDF reader and AI based summarizer.",
        rules: [
            "AI tools allowed for code generation, UI, and logic.",
            "Pre-built templates allowed but must be customized.",
            "Internet access allowed.",
            "Plagiarism leads to disqualification.",
            "Final submission must be deployable or demo-ready."
        ],
        teamSize: "2–3 per team",
        time: "3:30 hours",
        fee: "₹200 per team",
        tools: "Lovable, Cursor, Replit, Bolt, Vercel, Firebase, Figma, ChatGPT, GitHub"
    },
    {
        id: "ui-ux",
        title: "UI/UX Redesign",
        day: "Day 1",
        date: "Feb 26",
        category: "Design",
        icon: Palette,
        color: "text-neon-magenta",
        description: "A design-first challenge where participants rethink and redesign the user experience of a popular digital product.",
        problemStatement: "UPI app: Improve transaction clarity and trust.",
        rules: [
            "AI tools allowed for ideation and UI generation.",
            "Designs must be original.",
            "Focus on user problems, not aesthetics alone.",
            "Submission must include problem reasoning."
        ],
        teamSize: "1–2 per team",
        time: "2:30 hours",
        fee: "₹100 per team",
        tools: "Figma, FigJam, Adobe XD, Framer"
    },
    {
        id: "blind-coding",
        title: "Blind Coding Challenge",
        day: "Day 1",
        date: "Feb 26",
        category: "Coding",
        icon: Terminal,
        color: "text-neon-cyan",
        description: "A test of true programming fundamentals where participants write code without seeing the screen.",
        problemStatement: "Write a program (e.g., string manipulation, arrays, basic algorithms) with screen hidden.",
        rules: [
            "Screen will remain hidden during coding.",
            "Partial correctness scores apply."
        ],
        teamSize: "Individual",
        time: "1 hour",
        fee: "Free",
        tools: "Any standard programming language IDE"
    },

    // Day 2
    {
        id: "code-quest",
        title: "CodeQuest",
        day: "Day 2",
        date: "Feb 27",
        category: "Coding",
        icon: Map,
        color: "text-neon-blue",
        description: "A multi-round digital treasure hunt where teams solve logic and coding puzzles to unlock the next level.",
        problemStatement: "Logic puzzles, debugging challenges, and short coding tasks to reveal clues.",
        rules: [
            "AI is NOT allowed during the hunt.",
            "Internet restricted to contest platform.",
            "Collaboration between teams = disqualification."
        ],
        teamSize: "4 per team",
        time: "1:30 hours",
        fee: "₹200 per team",
        tools: "Interacty.com, in-browser code editors"
    },
    {
        id: "data-science",
        title: "End-to-End Data Science",
        day: "Day 2",
        date: "Feb 27",
        category: "Data",
        icon: Laptop,
        color: "text-neon-violet",
        description: "Participants execute a complete data science pipeline, from problem understanding to insight communication.",
        problemStatement: "Customer churn prediction for Amazon.",
        rules: [
            "AI allowed for suggestions.",
            "Manual understanding of results is mandatory.",
            "Blind copy-paste penalized."
        ],
        teamSize: "3-4 per team",
        time: "3 hours",
        fee: "₹200 per team",
        tools: "Python, Pandas, Scikit-learn, Google Colab"
    },
    {
        id: "asphalt-9",
        title: "Asphalt 9 Legends",
        day: "Day 2",
        date: "Feb 27",
        category: "Gaming",
        icon: Gamepad,
        color: "text-neon-blue",
        description: "A high-speed competitive racing event where participants race using licensed supercars.",
        rules: [
            "Online real-time races (8 players/race).",
            "Same track and conditions for all.",
            "Points awarded per race."
        ],
        teamSize: "Individual",
        time: "Tournament Style",
        fee: "₹100 per person",
        tools: "Asphalt 9 (Mobile), Headphones"
    }
];

export default function Events() {
    const [activeDay, setActiveDay] = useState("Day 1");
    const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

    const filteredEvents = events.filter((e) => e.day === activeDay);

    return (
        <SectionWrapper id="events">
            <SectionHeader title="Mission Protocols" subtitle="Select Your Operation" />

            {/* Day Toggles */}
            <div className="flex justify-center mb-12 gap-6">
                {["Day 1", "Day 2"].map((day) => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`relative px-8 py-3 rounded-xl font-display uppercase tracking-wider text-xl transition-all duration-300 border overflow-hidden group ${activeDay === day
                            ? "border-neon-cyan text-black"
                            : "border-white/10 text-gray-400 hover:border-white/30"
                            }`}
                    >
                        {activeDay === day && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-neon-cyan"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            {day === "Day 1" ? "Feb 26" : "Feb 27"}
                            <span className="text-xs opacity-60 font-mono">/ {day}</span>
                        </span>
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredEvents.map((event) => (
                        <motion.div
                            key={event.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard className="h-full group relative overflow-hidden flex flex-col">
                                {/* Decor */}
                                <div className={`absolute top-0 left-0 w-1 h-full ${event.color.replace('text-', 'bg-')} opacity-50`} />

                                <div className="p-6 flex flex-col h-full relative z-10">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-lg bg-white/5 border border-white/10 ${event.color}`}>
                                            <event.icon size={28} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">{event.category}</div>
                                            <div className={`font-bold ${event.color} text-sm`}>{event.fee}</div>
                                        </div>
                                    </div>

                                    {/* Title & Desc */}
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-neon-cyan transition-colors">{event.title}</h3>
                                    <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">{event.description}</p>

                                    {/* Meta */}
                                    <div className="mt-auto grid grid-cols-2 gap-4 text-xs font-mono text-gray-500 mb-6 border-t border-white/5 pt-4">
                                        <div className="flex items-center gap-2">
                                            <Users size={14} />
                                            <span>{event.teamSize}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>{event.time}</span>
                                        </div>
                                    </div>

                                    {/* Expand Button */}
                                    <button
                                        onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                                        className={`w-full py-3 rounded border border-white/10 flex items-center justify-center gap-2 text-sm font-mono uppercase transition-all duration-300 ${expandedEvent === event.id ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                                    >
                                        {expandedEvent === event.id ? 'Close Intel' : 'View Intel'}
                                        {expandedEvent === event.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {expandedEvent === event.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="bg-black/40 border-t border-white/10 overflow-hidden"
                                        >
                                            <div className="p-6 space-y-4 text-sm text-gray-300">
                                                <div>
                                                    <strong className="text-neon-cyan block mb-1 font-mono uppercase text-xs">Target Objective</strong>
                                                    <p>{event.problemStatement}</p>
                                                </div>
                                                <div>
                                                    <strong className="text-neon-magenta block mb-1 font-mono uppercase text-xs">Rules of Engagement</strong>
                                                    <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400">
                                                        {event.rules.map((rule, i) => <li key={i}>{rule}</li>)}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong className="text-neon-blue block mb-1 font-mono uppercase text-xs">Arsenal (Tools)</strong>
                                                    <p className="text-xs text-gray-400">{event.tools}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </SectionWrapper>
    );
}
