"use client";

import { useState, useEffect } from "react";
import { Home, Calendar, MapPin, Users } from "lucide-react";
import { cyberAudio } from "@/lib/audio";

const navItems = [
  { icon: Home, label: "Home", href: "#hero", id: "hero" },
  { icon: Users, label: "About", href: "#about", id: "about" },
  { icon: Calendar, label: "Events", href: "#events", id: "events" },
  { icon: MapPin, label: "Location", href: "#location", id: "location" },
];

export default function Enigma2SideNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isEventsVisible, setIsEventsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 300;
          for (const item of navItems) {
            const el = document.getElementById(item.id);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPos >= top && scrollPos < top + height) {
                setActiveSection((prev) => (prev !== item.id ? item.id : prev));
                break;
              }
            }
          }

          // Keep sidebars visible for Hero, About, Events, Event Timeline, and Location
          // Hide only starting from Organizing Team section downwards to footer
          const teamEl = document.getElementById("team");
          const legacyEl = document.getElementById("legacy");
          const footerEl = document.querySelector("footer");

          let shouldHide = false;
          if (teamEl && teamEl.getBoundingClientRect().top <= window.innerHeight * 0.85) {
            shouldHide = true;
          }
          if (legacyEl && legacyEl.getBoundingClientRect().top <= window.innerHeight * 0.85) {
            shouldHide = true;
          }
          if (footerEl && footerEl.getBoundingClientRect().top <= window.innerHeight * 0.85) {
            shouldHide = true;
          }
          setIsEventsVisible((prev) => (prev !== shouldHide ? shouldHide : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-3 lg:left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isEventsVisible
          ? "-translate-x-28 opacity-0 pointer-events-none"
          : "translate-x-0 opacity-100 pointer-events-auto"
      }`}
    >
      <div className="techfest-dock rounded-2xl py-3.5 px-1.5 flex flex-col items-center gap-4 w-[58px] shadow-2xl">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                cyberAudio.playClick();
                const target = document.getElementById(item.id);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.pushState(null, "", item.href);
                }
              }}
              onMouseEnter={() => cyberAudio.playHover()}
              className={`
                flex flex-col items-center gap-1 py-1 px-0.5 rounded-xl
                transition-all duration-300 group cursor-pointer w-full text-center
                ${isActive ? "text-white" : "text-gray-400 hover:text-white"}
              `}
            >
              <item.icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={`transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "text-gray-400"
                }`}
              />
              <span
                className={`text-[10px] font-sans font-medium tracking-tight whitespace-nowrap transition-colors ${
                  isActive ? "text-white font-semibold" : "text-gray-400 group-hover:text-gray-200"
                }`}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
