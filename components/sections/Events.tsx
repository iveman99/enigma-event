"use client";

import { useState } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { Code, Palette, Gamepad, Search, Database, Terminal, Users, Clock, ChevronDown, ChevronUp, User, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const events = [
    // Day 1 - Feb 26
    {
        id: "compile-vibes",
        title: "Compile The Vibes",
        day: "Day 1",
        date: "Feb 26",
        category: "Coding",
        badge: "Team",
        icon: Code,
        color: "text-neon-cyan",
        description: "Build innovative solutions in a high-energy coding sprint.",
        fullDescription: "A high-octane hackathon where teams must conceptualize and build a working prototype within a limited timeframe. Creativity and efficiency are key.",
        rules: [
            "Team Size: 2-3 Members.",
            "Time Limit: 3 Hours.",
            "Internet access allowed.",
            "Plagiarism leads to immediate disqualification."
        ],
        fee: "₹199",
        volunteers: [
            { name: "John Doe", phone: "+91 98765 43210" },
            { name: "Jane Smith", phone: "+91 98765 43211" }
        ]
    },
    {
        id: "blind-dates",
        title: "Blind Dates With Code",
        day: "Day 1",
        date: "Feb 26",
        category: "Coding",
        badge: "Solo",
        icon: Terminal,
        color: "text-neon-magenta",
        description: "Test your core programming fundamentals under pressure.",
        fullDescription: "A unique coding challenge where you must write code without seeing the screen. Trust your instincts and your syntax knowledge.",
        rules: [
            "Individual Participation.",
            "Monitor will be turned off.",
            "Three rounds of increasing difficulty.",
            "Syntax errors will penalize score."
        ],
        fee: "₹99",
        volunteers: [
            { name: "Alex Johnson", phone: "+91 98765 43212" },
            { name: "Sam Wilson", phone: "+91 98765 43213" }
        ]
    },
    {
        id: "ui-niverse",
        title: "Ui-niverse",
        day: "Day 1",
        date: "Feb 26",
        category: "Design",
        badge: "Team",
        icon: Palette,
        color: "text-neon-blue",
        description: "Redesign and reimagine digital experiences with creativity.",
        fullDescription: "Unleash your creative potential by redesigning a popular app or website interface. Focus on aesthetics, usability, and user experience.",
        rules: [
            "Team Size: 2-3 Members.",
            "Time Limit: 2.5 Hours.",
            "Tools: Figma / Adobe XD.",
            "Design must be original."
        ],
        fee: "₹199",
        volunteers: [
            { name: "Chris Evans", phone: "+91 98765 43214" },
            { name: "Pat Stark", phone: "+91 98765 43215" }
        ]
    },

    // Day 2 - Feb 27
    {
        id: "fifa-addicts",
        title: "FIFA Addicts",
        day: "Day 2",
        date: "Feb 27",
        category: "Gaming",
        badge: "Solo",
        icon: Gamepad,
        color: "text-neon-cyan",
        description: "Compete in an intense FIFA showdown and prove your dominance.",
        fullDescription: "The ultimate virtual football tournament. Battle against the best players and score your way to victory in a knockout format.",
        rules: [
            "Individual Participation.",
            "Knockout Tournament Format.",
            "Standard game settings apply.",
            "Controller support available."
        ],
        fee: "₹99",
        volunteers: [
            { name: "Mike Ross", phone: "+91 98765 43216" },
            { name: "Rachel Zane", phone: "+91 98765 43217" }
        ]
    },
    {
        id: "decode-hunt",
        title: "Decode The Hunt",
        day: "Day 2",
        date: "Feb 27",
        category: "Problem Solving",
        badge: "Team",
        icon: Search,
        color: "text-neon-magenta",
        description: "Crack clues and solve challenges in a competitive tech hunt.",
        fullDescription: "A thrilling treasure hunt across the campus requiring technical knowledge, logic, and teamwork to find the final prize.",
        rules: [
            "Team Size: 2-3 Members.",
            "Solve riddles to get next location.",
            "Fastest team to finish wins."
        ],
        fee: "₹199",
        volunteers: [
            { name: "Harvey Specter", phone: "+91 98765 43218" },
            { name: "Donna Paulsen", phone: "+91 98765 43219" }
        ]
    },
    {
        id: "data-dash",
        title: "Data Dash",
        day: "Day 2",
        date: "Feb 27",
        category: "Data Science",
        badge: "Team",
        icon: Database,
        color: "text-neon-violet",
        description: "Analyze datasets, uncover insights, and build intelligent solutions.",
        fullDescription: "Dive into a real-world dataset, clean the data, find patterns, and present actionable insights. A true test for data enthusiasts.",
        rules: [
            "Team Size: 2-3 Members.",
            "Dataset provided on spot.",
            "Submission: Notebook + Presentation."
        ],
        fee: "₹199",
        volunteers: [
            { name: "Louis Litt", phone: "+91 98765 43220" },
            { name: "Katrina Bennett", phone: "+91 98765 43221" }
        ]
    }
];

const categories = ["All", "Coding", "Design", "Gaming", "Data Science", "Problem Solving"];
const days = ["All Days", "Day 1", "Day 2"];

export default function Events() {
    const [selectedDay, setSelectedDay] = useState("All Days");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

    // Filter Logic
    const filteredEvents = events.filter((event) => {
        const dayMatch = selectedDay === "All Days" || event.day === selectedDay;
        const categoryMatch = selectedCategory === "All" || event.category === selectedCategory;

        return dayMatch && categoryMatch;
    });

    // Grouping for "All Days" view
    const groupedEvents = {
        "Day 1": filteredEvents.filter(e => e.day === "Day 1"),
        "Day 2": filteredEvents.filter(e => e.day === "Day 2")
    };

    const displayGroups = selectedDay === "All Days" ? ["Day 1", "Day 2"] : [selectedDay];

    return (
        <SectionWrapper id="events">
            <SectionHeader title="Explore Events" subtitle="Two Days. Six Challenges. One Stage." />

            {/* Controls Container */}
            <div className="flex flex-col items-center gap-8 mb-16">

                {/* Level 1: Day Toggles */}
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm relative">
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`relative px-6 py-2.5 rounded-xl text-sm font-display uppercase tracking-wider transition-all duration-300 z-10 ${selectedDay === day ? "text-black" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {selectedDay === day && (
                                <motion.div
                                    layoutId="activeDayTab"
                                    className="absolute inset-0 bg-neon-cyan rounded-xl"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">
                                {day === "All Days" ? "All Days" : day === "Day 1" ? "Feb 26" : "Feb 27"}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Level 2: Category Filters */}
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-mono border transition-all duration-300 ${selectedCategory === cat
                                    ? "bg-neon-magenta/20 border-neon-magenta text-neon-magenta shadow-[0_0_10px_rgba(255,0,255,0.3)]"
                                    : "bg-white/5 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="space-y-16">
                {displayGroups.map((dayGroup) => {
                    const groupEvents = groupedEvents[dayGroup as keyof typeof groupedEvents] || [];

                    if (groupEvents.length === 0) return null;

                    return (
                        <div key={dayGroup} className="space-y-8">
                            {/* Day Header (Only visible if 'All Days' is selected or to give context) */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4"
                            >
                                <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent flex-1 opacity-50" />
                                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
                                    {dayGroup === "Day 1" ? "FEB 26 / DAY 1" : "FEB 27 / DAY 2"}
                                </h3>
                                <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent flex-1 opacity-50" />
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {groupEvents.map((event) => (
                                        <motion.div
                                            key={event.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <GlassCard className="h-full group relative overflow-hidden flex flex-col hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] transition-shadow duration-500">
                                                {/* Decor */}
                                                <div className={`absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity duration-300`}>
                                                    <event.icon size={100} className={event.color} strokeWidth={0.5} />
                                                </div>

                                                <div className="p-6 flex flex-col h-full relative z-10">
                                                    {/* Header */}
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className={`px-3 py-1 rounded bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono uppercase tracking-wider ${event.color}`}>
                                                            {event.category}
                                                        </div>
                                                        <div className={`font-bold ${event.color} text-lg`}>{event.fee}</div>
                                                    </div>

                                                    {/* Title & Desc */}
                                                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-neon-cyan transition-colors">{event.title}</h3>
                                                    <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors">{event.description}</p>

                                                    {/* Meta */}
                                                    <div className="mt-auto flex items-center justify-between text-xs font-mono text-gray-500 mb-6 border-t border-white/5 pt-4">
                                                        <div className="flex items-center gap-2">
                                                            <Users size={14} className="text-neon-magenta" />
                                                            <span>{event.badge}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={14} className="text-neon-blue" />
                                                            <span>{event.rules[1]?.split(':')[1]?.trim() || "Check Rules"}</span>
                                                        </div>
                                                    </div>

                                                    {/* Expand Button */}
                                                    <button
                                                        onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                                                        className={`w-full py-3 rounded border border-white/10 flex items-center justify-center gap-2 text-sm font-mono uppercase transition-all duration-300 ${expandedEvent === event.id ? 'bg-neon-cyan text-black border-neon-cyan font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                                    >
                                                        {expandedEvent === event.id ? 'Close Details' : 'View Details'}
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
                                                            className="bg-black/80 border-t border-white/10 overflow-hidden backdrop-blur-xl"
                                                        >
                                                            <div className="p-6 space-y-6 text-sm text-gray-300">
                                                                <p className="text-gray-300 leading-relaxed border-l-2 border-neon-cyan pl-4">{event.fullDescription}</p>

                                                                <div className="grid grid-cols-1 gap-4">
                                                                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                                                        <strong className="text-neon-cyan flex items-center gap-2 mb-2 font-mono uppercase text-xs">
                                                                            <User size={14} /> Event Coordinators
                                                                        </strong>
                                                                        <div className="space-y-2">
                                                                            {event.volunteers.map((vol, i) => (
                                                                                <div key={i} className="flex justify-between items-center text-xs text-gray-400">
                                                                                    <span>{vol.name}</span>
                                                                                    <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{vol.phone}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                                                        <strong className="text-neon-magenta flex items-center gap-2 mb-2 font-mono uppercase text-xs">
                                                                            <Terminal size={14} /> Rules
                                                                        </strong>
                                                                        <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400">
                                                                            {event.rules.map((rule, i) => <li key={i}>{rule}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                </div>

                                                                <button className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold uppercase tracking-widest text-sm rounded hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all transform hover:-translate-y-1">
                                                                    Register Now
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </GlassCard>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}
            </div>
        </SectionWrapper>
    );
}
