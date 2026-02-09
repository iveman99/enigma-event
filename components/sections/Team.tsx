"use client";

import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { User, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";
import TextDecrypt from "../ui/TextDecrypt";

const architects = [
    { name: "Adarsh Mishra", role: "Core Member", linkedin: "#", image: "" },
    { name: "Heera Khan", role: "Core Member", linkedin: "#", image: "" },
    { name: "Pranav More", role: "Core Member", linkedin: "#", image: "" },
    { name: "Om Rawket", role: "Core Member", linkedin: "#", image: "" },
    { name: "Kunal Mahale", role: "Core Member", linkedin: "#", image: "" },
    { name: "Deeksha Singh", role: "Core Member", linkedin: "#", image: "" },
    { name: "Tehreen Shaikh", role: "Core Member", linkedin: "#", image: "" },
    { name: "Mayur Shewale", role: "Core Member", linkedin: "#", image: "" },
];

export default function Team() {
    return (
        <SectionWrapper id="team">
            <SectionHeader title="The Architects" subtitle="System Builders" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {architects.map((member, index) => (
                    <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative"
                    >
                        {/* Holographic Border */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl pointer-events-none" />
                        <div className="absolute inset-0 border border-white/5 rounded-xl group-hover:border-neon-cyan/50 transition-colors duration-500" />

                        <div className="p-6 flex flex-col items-center text-center relative z-10 bg-black/40 backdrop-blur-md rounded-xl h-full hover:bg-white/5 transition-colors">
                            {/* Avatar / Photo Placeholder */}
                            <div className="w-24 h-24 mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-neon-cyan transition-all duration-500 relative overflow-hidden">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} className="text-gray-400 group-hover:text-neon-cyan transition-colors" />
                                )}
                            </div>

                            import TextDecrypt from "../ui/TextDecrypt";
                            // ... imports

                            // ... inside map

                            <h4 className="text-lg font-display font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors">
                                <TextDecrypt text={member.name} />
                            </h4>
                            <p className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest mb-4">{member.role}</p>

                            {/* Social Links */}
                            <div className="flex gap-3 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <a href={member.linkedin} className="text-gray-400 hover:text-neon-cyan transition-colors">
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
