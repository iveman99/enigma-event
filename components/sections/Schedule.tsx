"use client";

import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

const schedule = [
    {
        day: "Day 1",
        date: "November 10",
        events: [
            { time: "09:00 AM", title: "Inauguration", type: "General" },
            { time: "10:00 AM", title: "Vibe Coding", type: "Competition", highlight: true },
            { time: "01:00 PM", title: "Blind Coding", type: "Competition" },
            { time: "03:00 PM", title: "Asphalt 9 Gaming", type: "Fun" },
        ],
    },
    {
        day: "Day 2",
        date: "November 11",
        events: [
            { time: "09:00 AM", title: "UI/UX Redesign", type: "Competition", highlight: true },
            { time: "11:00 AM", title: "Treasure Hunt", type: "Fun" },
            { time: "02:00 PM", title: "Data Science Sprint", type: "Competition", highlight: true },
            { time: "05:00 PM", title: "Award Ceremony", type: "Celebration" },
        ],
    },
];

export default function Schedule() {
    return (
        <SectionWrapper id="schedule">
            <SectionHeader title="Timeline" subtitle="Synchronize Your Watch" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {schedule.map((day, dayIndex) => (
                    <div key={dayIndex}>
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-3xl font-display font-bold text-white">{day.day}</h3>
                            <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-sm font-mono text-neon-cyan">
                                {day.date}
                            </span>
                        </div>

                        <div className="relative space-y-8 pl-8 border-l border-white/10">
                            {day.events.map((event, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative group"
                                >
                                    {/* Timeline Dot */}
                                    <span className={`absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 bg-black transition-colors duration-300 ${event.highlight ? "border-neon-magenta shadow-[0_0_10px_var(--neon-magenta)]" : "border-gray-600 group-hover:border-neon-cyan"
                                        }`} />

                                    <GlassCard className="p-4" hoverEffect={false}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`font-bold text-lg ${event.highlight ? "text-neon-cyan" : "text-white"}`}>
                                                {event.title}
                                            </h4>
                                            <span className="text-xs font-mono text-gray-400">{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs uppercase tracking-wider ${event.type === "Competition" ? "text-neon-magenta" :
                                                    event.type === "Fun" ? "text-neon-blue" : "text-gray-500"
                                                }`}>
                                                [{event.type}]
                                            </span>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
}
