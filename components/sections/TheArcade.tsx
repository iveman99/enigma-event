"use client";

import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { Laptop, Palette, Utensils, AlertCircle, Phone } from "lucide-react";

const arcadeItems = [
    {
        title: "Project Showcase",
        icon: Laptop,
        description: "Display your technical projects. From IoT innovations to AI/ML models and software solutions.",
        color: "text-neon-cyan"
    },
    {
        title: "Poster Presentation",
        icon: Palette,
        description: "Present your research or creative ideas visually. A platform to share knowledge and concepts.",
        color: "text-neon-magenta"
    },
    {
        title: "Food & Fun Stalls",
        icon: Utensils,
        description: "Set up your own stall. Delight the crowd with food, engage them with games, or sell merchandise.",
        color: "text-neon-green"
    }
];

const rules = [
    "Setup must be completed 1 hour before the event starts.",
    "Maintain cleanliness at your stall/station.",
    "No prohibited or hazardous items allowed.",
    "Electrical requirements must be conveyed in advance.",
    "Decisions by the organizing committee are final."
];

export default function TheArcade() {
    return (
        <SectionWrapper id="arcade">
            <SectionHeader title="The Arcade" subtitle="Innovation. Creativity. Flavor." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {arcadeItems.map((item, index) => (
                    <GlassCard key={index} className="p-8 text-center group hover:scale-[1.02] transition-transform duration-300">
                        <div className={`mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors`}>
                            <item.icon className={`w-8 h-8 ${item.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">{item.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Rules Section */}
                <GlassCard className="p-8 border-neon-cyan/20">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertCircle className="text-neon-cyan" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider">Guidelines</h3>
                    </div>
                    <ul className="space-y-3">
                        {rules.map((rule, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                                <span className="text-neon-cyan mt-1">▹</span>
                                {rule}
                            </li>
                        ))}
                    </ul>
                </GlassCard>

                {/* Contact Section */}
                <GlassCard className="p-8 border-neon-magenta/20 flex flex-col justify-center items-center text-center">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Interested in participating?</h3>
                    <p className="text-gray-400 text-sm mb-8">Contact us to book your spot in The Arcade.</p>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-neon-magenta/10 flex items-center justify-center mb-2 animate-pulse">
                            <Phone className="text-neon-magenta w-8 h-8" />
                        </div>
                        <p className="text-2xl font-bold text-white">Mayur</p>
                        <a href="tel:+918828069553" className="text-lg font-mono text-neon-magenta hover:text-white transition-colors">
                            +91 88280 69553
                        </a>
                    </div>
                </GlassCard>
            </div>
        </SectionWrapper>
    );
}
