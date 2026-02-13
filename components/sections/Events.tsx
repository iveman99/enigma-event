"use client";

import { useState } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { Code, Palette, Gamepad, Search, Database, Terminal, Users, Clock, ChevronDown, ChevronUp, User, Filter, X, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const events = [
    // Day 1 - Feb 26
    {
        id: "compile-vibes",
        title: "Vibe Coding",
        day: "Day 1",
        date: "Feb 26",
        category: "Coding",
        badge: "Team",
        icon: Code,
        color: "text-neon-cyan",
        description: "High-Energy Coding Sprint.",
        fullDescription: "Turn ideas into working digital solutions in this fast-paced team coding challenge. Collaborate, brainstorm, and build within a limited timeframe. Creativity and execution will define your success. Build smart. Build fast. Build impactful.",
        rules: [
            "Team Size: 2-3 Members.",
            "Time Limit: 3 Hours.",
            "Internet access allowed.",
            "Plagiarism leads to immediate disqualification."
        ],
        fee: "₹199",
        prizePool: "₹8,000",
        venue: "Department of Computer Science, University of Mumbai",
        venueMapLink: "https://maps.app.goo.gl/q55Dxhdcyq75djwx5",
        registrationLink: "https://forms.gle/QfcskSuJvwsFVUNs6",
        volunteers: [
            { name: "Ankita Goyal", phone: "+91 93233 88342" },
            { name: "Mahesh Khairnar", phone: "+91 75885 52573" }
        ]
    },
    {
        id: "guest-agentic-ai",
        title: "Agentic AI",
        day: "Day 1",
        date: "Feb 26",
        category: "Guest Session",
        badge: "Open For All",
        icon: Mic,
        color: "text-neon-violet",
        description: "Explore the Future of Autonomous AI Agents.",
        fullDescription: "Dive into the world of Agentic AI with an exclusive session by industry leaders. Understand how autonomous agents are reshaping technology and automation. A must-attend for AI enthusiasts.",
        rules: [
            "Open to all students.",
            "No prior registration required for entry.",
            "Seating on first-come-first-serve basis."
        ],
        fee: "Free",
        venue: "Auditorium, Department of Computer Science",
        venueMapLink: "https://maps.app.goo.gl/q55Dxhdcyq75djwx5",
        registrationLink: "#",
        volunteers: []
    },
    {
        id: "blind-dates",
        title: "Blind Coding",
        day: "Day 1",
        date: "Feb 26",
        category: "Coding",
        badge: "Solo",
        icon: Terminal,
        color: "text-neon-magenta",
        description: "Test Your Programming Fundamentals.",
        fullDescription: "A solo coding challenge designed to test your logic and problem-solving skills. Solve curated problems under time pressure. Speed and accuracy will set you apart. Only the sharpest coders will dominate.",
        rules: [
            "Individual Participation.",
            "Monitor will be turned off.",
            "Three rounds of increasing difficulty.",
            "Syntax errors will penalize score."
        ],
        fee: "₹99",
        prizePool: "₹6,000",
        venue: "Department of Computer Science, University of Mumbai",
        venueMapLink: "https://maps.app.goo.gl/q55Dxhdcyq75djwx5",
        registrationLink: "https://forms.gle/SgtEjoAUFM8pU5YEA",
        volunteers: [
            { name: "Volunteer 1", phone: "+91 XXXXX XXXXX" },
            { name: "Volunteer 2", phone: "+91 XXXXX XXXXX" }
        ]
    },
    {
        id: "data-dash",
        title: "Data Dash",
        day: "Day 1",
        date: "Feb 26",
        category: "Data Science",
        badge: "Team",
        icon: Database,
        color: "text-neon-violet",
        description: "Decode Data. Deliver Insights.",
        fullDescription: "Analyze datasets and uncover meaningful insights. Work in teams to solve real-world data problems. Smart interpretation is the key to winning. Turn numbers into impact.",
        rules: [
            "Team Size: 2-3 Members.",
            "Dataset provided on spot.",
            "Submission: Notebook + Presentation."
        ],
        fee: "₹199",
        prizePool: "₹8,000",
        venue: "Department of Computer Science, University of Mumbai",
        venueMapLink: "https://maps.app.goo.gl/q55Dxhdcyq75djwx5",
        registrationLink: "https://forms.gle/LHXVrgQPNkoVc9PGA",
        volunteers: [
            { name: "Priyanshi Dubey", phone: "+91 72194 27357" },
            { name: "Aryan Palekar", phone: "+91 89282 21297" }
        ]
    },

    // Day 2 - Feb 27
    {
        id: "decode-hunt",
        title: "Decode The Hunt",
        day: "Day 2",
        date: "Feb 27",
        category: "Problem Solving",
        badge: "Team",
        icon: Search,
        color: "text-neon-magenta",
        description: "Crack Clues. Race Against Time.",
        fullDescription: "A competitive team-based challenge that tests logic and coordination. Solve clues and progress through elimination rounds. Speed and strategy will define your journey. Only the sharpest team will decode the final stage.",
        rules: [
            "Team Size: 2-3 Members.",
            "Solve riddles to get next location.",
            "Fastest team to finish wins."
        ],
        fee: "₹199",
        prizePool: "₹8,000",
        venue: "Department of Computer Science, University of Mumbai",
        venueMapLink: "https://maps.app.goo.gl/q55Dxhdcyq75djwx5",
        registrationLink: "https://forms.gle/nRRxc185qJu9JvD16",
        volunteers: [
            { name: "Aryan Palekar", phone: "+91 89282 21297" },
            { name: "Utkarsha Patil", phone: "+91 79721 34987" }
        ]
    },
    {
        id: "guest-ai-dashboards",
        title: "AI-Powered Dashboards",
        day: "Day 2",
        date: "Feb 27",
        category: "Guest Session",
        badge: "Open For All",
        icon: Mic,
        color: "text-neon-blue",
        description: "Building Smarter Analytics with AI.",
        fullDescription: "Learn how to integrate AI into data visualization. This session covers the creation of dynamic, AI-powered dashboards that provide deeper insights and predictive analytics.",
        rules: [
            "Open to all students.",
            "No prior registration required for entry.",
            "Seating on first-come-first-serve basis."
        ],
        fee: "Free",
        venue: "Auditorium, Department of Computer Science",
        venueMapLink: "https://maps.app.goo.gl/q55Dxhdcyq75djwx5",
        registrationLink: "#",
        volunteers: []
    },
    {
        id: "fifa-addicts",
        title: "FIFA Addicts",
        day: "Day 2",
        date: "Feb 27",
        category: "Gaming",
        badge: "Solo",
        icon: Gamepad,
        color: "text-neon-cyan",
        description: "Step into the arena and compete in an intense head-to-head FIFA tournament.",
        fullDescription: "Knockout Gaming Showdown. Battle through knockout rounds where every match decides your survival. Show your skills, strategy, and composure under pressure. Only one player will rise as the ultimate champion.",
        rules: [
            "H2H Mode Only.",
            "No back-passing or time wasting.",
            "Disconnection after 15th min = 3–0 loss (unless rematch agreed).",
            "Basic tutorial must be completed.",
            "Tie-breaker: Shots on target > Corners > Possession %."
        ],
        fee: "₹99",
        prizePool: "₹6,000",
        venue: "Department of Computer Science, University of Mumbai",
        venueMapLink: "https://maps.app.goo.gl/q55Dxhdcyq75djwx5",
        registrationLink: "https://forms.gle/Mpt3v86gh4kamQQA6",
        volunteers: [
            { name: "Rawket", phone: "+91 99677 03018" },
            { name: "Vansh Lad", phone: "+91 90282 80757" }
        ]
    },
    {
        id: "ui-niverse",
        title: "UI/UX Re-Design",
        day: "Day 2",
        date: "Feb 27",
        category: "Design",
        badge: "Team",
        icon: Palette,
        color: "text-neon-blue",
        description: "Design Beyond Limits.",
        fullDescription: "Reimagine and redesign digital experiences with creativity and clarity. Work as a team to craft intuitive interfaces. Balance aesthetics with usability. Let your design thinking stand out.",
        rules: [
            "Team Size: 2-3 Members.",
            "Time Limit: 2.5 Hours.",
            "Tools: Figma / Adobe XD.",
            "Design must be original."
        ],
        fee: "₹199",
        prizePool: "₹8,000",
        venue: "Department of Computer Science, University of Mumbai",
        venueMapLink: "https://maps.app.goo.gl/q55Dxhdcyq75djwx5",
        registrationLink: "https://forms.gle/hBxL85dXYb1XsFaX6",
        volunteers: [
            { name: "Mahesh Khairnar", phone: "+91 75885 52573" },
            { name: "Adarsh Mishra", phone: "+91 99751 17332" }
        ]
    }
];

const categories = ["All", "Coding", "Design", "Gaming", "Data Science", "Problem Solving", "Guest Session"];
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
        <>
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
                                {/* Day Header */}
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
                                                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-40 transition-opacity duration-300 z-0`}>
                                                        <event.icon size={120} className={event.color} strokeWidth={0.5} />
                                                    </div>

                                                    <div className="p-6 flex flex-col flex-1 relative z-10">
                                                        {/* Header */}
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div className={`px-3 py-1 rounded bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono uppercase tracking-wider ${event.color}`}>
                                                                {event.category}
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                <div className={`font-bold ${event.color} text-lg px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm`}>{event.fee}</div>
                                                                {(event as any).prizePool && (
                                                                    <div className="flex items-center gap-1 text-xs font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                                                                        <Gamepad size={12} />
                                                                        <span>{(event as any).prizePool}</span>
                                                                    </div>
                                                                )}
                                                            </div>
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

                                                        {/* Actions - New Layout */}
                                                        <div className="flex gap-3">
                                                            {/* Primary Register Button */}
                                                            <a
                                                                href={event.registrationLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex-1 py-2.5 bg-neon-cyan/90 hover:bg-neon-cyan text-black text-center font-bold uppercase text-sm tracking-wider rounded transition-all hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                                                            >
                                                                Register
                                                            </a>

                                                            {/* Secondary Details Toggle */}
                                                            <button
                                                                onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                                                                className="px-3 rounded border border-white/10 hover:bg-white/5 hover:text-white text-gray-400 transition-colors flex items-center justify-center"
                                                                title="View Details"
                                                            >
                                                                {expandedEvent === event.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                            </button>
                                                        </div>
                                                    </div>
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

            {/* Event Details Modal */}
            <AnimatePresence>
                {expandedEvent && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setExpandedEvent(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4"
                        />

                        {/* Modal */}
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
                            {events.filter(e => e.id === expandedEvent).map(event => (
                                <motion.div
                                    key={event.id}
                                    layoutId={`event-card-${event.id}`}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="relative w-full max-w-2xl bg-black/90 border border-neon-cyan/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.15)] pointer-events-auto flex flex-col max-h-[90vh]"
                                >
                                    <button
                                        onClick={() => setExpandedEvent(null)}
                                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-50 cursor-pointer"
                                    >
                                        <X size={24} />
                                    </button>

                                    {/* Modal Header */}
                                    <div className="relative p-6 border-b border-white/10 overflow-hidden shrink-0">
                                        <div className="absolute top-0 right-0 p-4 opacity-20">
                                            <event.icon size={150} className={event.color} strokeWidth={0.5} />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider ${event.color}`}>
                                                    {event.category}
                                                </span>
                                                <span className="text-3xl font-bold text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">{event.fee}</span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h2>
                                            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                                                <span className="flex items-center gap-1"><Clock size={14} className="text-neon-blue" /> {event.day}</span>
                                                <span className="flex items-center gap-1"><Users size={14} className="text-neon-magenta" /> {event.badge}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Scrollable Body */}
                                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                                        {/* Description */}
                                        <div>
                                            <p className="text-lg text-gray-300 leading-relaxed">{event.fullDescription}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Rules */}
                                            <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                                                <h4 className="text-neon-magenta flex items-center gap-2 mb-4 font-mono uppercase text-sm font-bold">
                                                    <Terminal size={16} /> Rules & Format
                                                </h4>
                                                <ul className="space-y-2">
                                                    {event.rules.map((rule, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                                            <span className="text-neon-magenta mt-1">▹</span>
                                                            {rule}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Meta Info: Prize, Venue, Organizers */}
                                            <div className="space-y-4">
                                                {/* Prize Pool */}
                                                {(event as any).prizePool && (
                                                    <div className="bg-gradient-to-br from-neon-cyan/20 to-transparent p-5 rounded-xl border border-neon-cyan/30">
                                                        <h4 className="text-neon-cyan flex items-center gap-2 mb-2 font-mono uppercase text-sm font-bold">
                                                            <Gamepad size={16} /> Prize Pool
                                                        </h4>
                                                        <p className="text-2xl font-bold text-white">{(event as any).prizePool}</p>
                                                    </div>
                                                )}

                                                {/* Venue */}
                                                {(event as any).venue && (
                                                    <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                                                        <h4 className="text-white flex items-center gap-2 mb-2 font-mono uppercase text-sm font-bold">
                                                            <Filter size={16} /> Venue
                                                        </h4>
                                                        <p className="text-sm text-gray-400 mb-2">{(event as any).venue}</p>
                                                        {(event as any).venueMapLink && (
                                                            <a
                                                                href={(event as any).venueMapLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-neon-blue hover:text-white underline decoration-neon-blue/50 flex items-center gap-1"
                                                            >
                                                                View Location <Search size={10} />
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Coordinators */}
                                                <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                                                    <h4 className="text-neon-green flex items-center gap-2 mb-4 font-mono uppercase text-sm font-bold text-gray-300">
                                                        <User size={16} /> Contact
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {event.volunteers.map((vol, i) => (
                                                            <div key={i} className="flex justify-between items-center text-sm">
                                                                <span className="text-gray-400">{vol.name}</span>
                                                                <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded text-xs">{vol.phone}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md shrink-0">
                                        <a
                                            href={event.registrationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full py-4 bg-neon-cyan hover:bg-neon-cyan/90 text-black text-center font-bold uppercase tracking-widest rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transform hover:-translate-y-1"
                                        >
                                            Register Now
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
