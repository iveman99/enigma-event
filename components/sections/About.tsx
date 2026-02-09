"use client";

import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { Cpu, Zap, Network, Lightbulb, Code2, Database, Globe, Rocket } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const timeline = [
    {
        icon: Lightbulb,
        year: "INIT",
        title: "The Spark",
        description: "Bridging the gap between academic theory and real-world application.",
        color: "text-neon-cyan",
        border: "border-neon-cyan"
    },
    {
        icon: Network,
        year: "EXEC",
        title: "The Collaboration",
        description: "Designers, developers, and strategists connecting to solve complexities.",
        color: "text-neon-magenta",
        border: "border-neon-magenta"
    },
    {
        icon: Rocket,
        year: "DEPLOY",
        title: "The Launch",
        description: "Two days of intense competition, learning, and showcases.",
        color: "text-neon-blue",
        border: "border-neon-blue"
    },
    {
        icon: Globe,
        year: "FUTURE",
        title: "The Goal",
        description: "Empowering students to build the future of technology.",
        color: "text-neon-violet",
        border: "border-neon-violet"
    }
];

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <SectionWrapper id="about">
            <SectionHeader title="System Architecture" subtitle="Declassified Information" />

            <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left: Text Content */}
                <div className="sticky top-32 space-y-8">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-neon-cyan via-neon-magenta to-transparent opacity-50" />
                        <h3 className="text-3xl md:text-5xl font-display font-bold leading-tight pl-6">
                            Constructing The <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue">
                                Future Interface
                            </span>
                        </h3>
                    </div>

                    <p className="text-gray-400 leading-relaxed text-lg font-light">
                        <strong className="text-white">ENIGMA 1.0</strong> is not merely an event; it is a compiled executable designed to test the runtime efficiency of your skills. Hosted by the <span className="text-neon-cyan font-mono">Placement Cell, UDCS</span>, this initiative bridges the latency between academic theory and deployment-ready reality.
                    </p>

                    <p className="text-gray-400 leading-relaxed">
                        We are initializing an environment where students can debug their weaknesses, refactor their thinking, and deploy solutions that matter. Whether you specialize in backend logic, frontend aesthetics, or data algorithms, Enigma is your sandbox.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 border border-white/10 bg-white/5 rounded-lg">
                            <span className="block text-2xl font-display font-bold text-neon-magenta mb-1">Feb 27-28</span>
                            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">System Runtime</span>
                        </div>
                        <div className="p-4 border border-white/10 bg-white/5 rounded-lg">
                            <span className="block text-2xl font-display font-bold text-neon-cyan">6+</span>
                            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Active Modules</span>
                        </div>
                    </div>
                </div>

                {/* Right: Timeline */}
                <div className="relative pl-8 lg:pl-0">
                    {/* Center Line */}
                    <div className="absolute left-0 lg:left-8 top-0 bottom-0 w-px bg-white/10">
                        <motion.div
                            style={{ scaleY, transformOrigin: "top" }}
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-neon-cyan via-neon-magenta to-neon-blue"
                        />
                    </div>

                    <div className="space-y-12">
                        {timeline.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative pl-8 lg:pl-16"
                            >
                                {/* Node */}
                                <div className={`absolute left-[-4px] lg:left-[28px] top-6 w-2 h-2 rounded-full bg-black border-2 border-white ${item.color.replace('text-', 'border-')} z-10 shadow-[0_0_10px_currentColor]`} />

                                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm group hover:border-white/30 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg bg-black/50 border border-white/10 ${item.color} group-hover:scale-110 transition-transform`}>
                                            <item.icon size={24} />
                                        </div>
                                        <span className="font-mono text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">{item.year}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2 font-display group-hover:text-neon-cyan transition-colors">{item.title}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
