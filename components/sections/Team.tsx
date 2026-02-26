"use client";
/* eslint-disable @next/next/no-img-element */

import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { User, Linkedin, Github } from "lucide-react";
import { motion, useInView } from "framer-motion";
import TextDecrypt from "../ui/TextDecrypt";
import { useState, useEffect, useRef } from "react";

const volunteers = [
    { name: "iVeman", role: "Technical Head", linkedin: "https://www.linkedin.com/in/veman-chippa", image: "/images/team/iveman.jpeg" },
    { name: "Adarsh Mishra", role: "Creative & Media Head", linkedin: "https://www.linkedin.com/in/ahadarshx/", image: "/images/team/Adarsh.jpeg" },
    { name: "Hera Khan", role: "Social Media Head", linkedin: "https://www.linkedin.com/in/hera-h-khan/", image: "/images/team/hera.jpg" },
    { name: "Rawket", role: "Logistics Head", linkedin: "https://www.linkedin.com/in/om-mahadik-22208525a/", image: "/images/team/Om.jpeg" },
    { name: "Pranav More", role: "Operations Head", linkedin: "https://www.linkedin.com/in/pranav-more-a66423378", image: "/images/team/Pranav.jpeg" },
    { name: "Mayur Shewale", role: "Finance Head", linkedin: "https://www.linkedin.com/in/mayur-shewale312003/", image: "/images/team/Mayur.jpeg" },
    { name: "Deeksha Singh", role: "Marketing & PR Head", linkedin: "https://www.linkedin.com/in/deeksha-singh-951024376/", image: "/images/team/Deeksha.jpeg" },
    { name: "Priyanshi Dubey", role: "Creative Coordinator", linkedin: "https://www.linkedin.com/in/priyanshi-d-ba759b246/", image: "/images/team/Priyanshi.jpeg" },
    { name: "Kunal Mahale", role: "Volunteer", linkedin: "https://www.linkedin.com/in/kunal11/", image: "/images/team/Kunal.jpeg" },
    { name: "Vansh Lad", role: "Volunteer", linkedin: "https://www.linkedin.com/in/vansh-lad-012b90259/", image: "/images/team/Vansh.jpeg" },
    { name: "Pranay Kokane", role: "Volunteer", linkedin: "https://www.linkedin.com/in/pranay-kokane-20351b261/", image: "/images/team/Pranay.jpeg" },

    { name: "Gaurav Prajapati", role: "Volunteer", linkedin: "https://www.linkedin.com/in/shweta-parmar-4a202a362/", image: "/images/team/Gaurav.jpeg" },
    { name: "Rahul Patel", role: "Volunteer", linkedin: "https://www.linkedin.com/in/rahul-patel-a80480377/", image: "/images/team/Rahul.jpeg" },
    { name: "Aryan Palekar", role: "Volunteer", linkedin: "https://www.linkedin.com/in/aryan-palekar-3ba736285/", image: "/images/team/Aryan.jpeg" },
    { name: "Mahesh Khairnar", role: "Volunteer", linkedin: "https://www.linkedin.com/in/khairnarmahesh11/", image: "/images/team/Mahesh.jpeg" },
    { name: "Utkarsha Patil", role: "Volunteer", linkedin: "https://www.linkedin.com/in/utkarsha-patil-9854412b6/", image: "/images/team/Utkarsha.jpeg" },
    { name: "Ankita Goyal", role: "Decor Head", linkedin: "https://www.linkedin.com/in/ankita-goyal-702881247", image: "/images/team/Ankita.jpeg" },
];

export default function Team() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(scrollRef, { once: true, margin: "-100px" });
    const [startScroll, setStartScroll] = useState(false);

    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => {
                setStartScroll(true);
            }, 2500); // 2.5s delay
            return () => clearTimeout(timer);
        }
    }, [isInView]);

    return (
        <SectionWrapper id="team" className="z-[105]">
            <SectionHeader title="The Team" subtitle="The Force Behind Enigma" />

            <div className="relative w-full max-w-7xl mx-auto">
                {/* Gradient Masks for Scroll Hint */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-hidden relative w-full" ref={scrollRef}>
                    <div className={`flex gap-6 py-8 ${startScroll ? 'animate-scroll' : ''} hover:[animation-play-state:paused]`}>
                        {[...volunteers, ...volunteers].map((member, index) => (
                            <div
                                key={index}
                                className="group relative flex-shrink-0 w-72"
                            >
                                {/* Holographic Border */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl pointer-events-none" />
                                <div className="absolute inset-0 border border-white/5 rounded-xl group-hover:border-neon-cyan/50 transition-colors duration-500" />

                                <div className="p-6 flex flex-col items-center text-center relative z-10 bg-black/40 rounded-xl h-full hover:bg-white/5 transition-colors">
                                    {/* Avatar / Photo Placeholder */}
                                    <div className="w-40 h-40 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-105 group-hover:border-neon-cyan transition-all duration-500 relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] z-[105]">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={48} className="text-gray-400 group-hover:text-neon-cyan transition-colors" />
                                        )}
                                    </div>

                                    <h4 className="text-xl font-display font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                                        <TextDecrypt text={member.name} />
                                    </h4>
                                    <p className="text-sm font-mono text-neon-cyan/80 uppercase tracking-widest mb-6">{member.role}</p>

                                    {/* Social Links */}
                                    <div className="flex gap-4 mt-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-cyan transition-colors transform hover:scale-110 duration-200">
                                            <Linkedin size={24} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
