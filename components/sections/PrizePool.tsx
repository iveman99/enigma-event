"use client";

import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { Award, Trophy, Medal } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Counter Component
function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {

            const end = value;
            const totalFrames = Math.round(duration * 60);
            let frame = 0;

            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                const currentCount = Math.round(end * progress);

                if (frame === totalFrames) {
                    clearInterval(counter);
                    setCount(end);
                } else {
                    setCount(currentCount);
                }
            }, 1000 / 60);

            return () => clearInterval(counter);
        }
    }, [isInView, value, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function PrizePool() {
    return (
        <SectionWrapper className="bg-gradient-to-b from-transparent to-neon-blue/5">
            <SectionHeader title="Rewards" subtitle="To The Victor Goes The Spoils" />

            <div className="flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="mb-8 relative"
                >
                    <Trophy size={80} className="text-neon-magenta drop-shadow-[0_0_30px_rgba(255,0,85,0.5)]" />
                </motion.div>

                <h3 className="text-5xl md:text-8xl font-display font-bold text-white mb-4">
                    ₹<Counter value={44000} />
                </h3>
                <p className="text-xl text-neon-blue font-mono uppercase tracking-[0.2em] mb-12">
                    Total Prize Pool
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    <div className="p-6 border border-glass-border bg-glass-bg rounded-xl flex flex-col items-center">
                        <Award className="text-neon-cyan mb-4" size={40} />
                        <h4 className="text-2xl font-bold text-white mb-2">₹25,000</h4>
                        <p className="text-sm text-gray-400 uppercase tracking-wider">Major Events</p>
                    </div>

                    <div className="p-6 border border-glass-border bg-glass-bg rounded-xl flex flex-col items-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-neon-magenta/10 animate-pulse-slow" />
                        <Medal className="text-neon-magenta mb-4 relative z-10" size={40} />
                        <h4 className="text-2xl font-bold text-white mb-2 relative z-10">Certificates</h4>
                        <p className="text-sm text-gray-400 uppercase tracking-wider relative z-10">For All Participants</p>
                    </div>

                    <div className="p-6 border border-glass-border bg-glass-bg rounded-xl flex flex-col items-center">
                        <Award className="text-neon-blue mb-4" size={40} />
                        <h4 className="text-2xl font-bold text-white mb-2">₹19,000</h4>
                        <p className="text-sm text-gray-400 uppercase tracking-wider">Minor Events</p>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
