"use client";

import { useState, useEffect } from "react";
import { Instagram } from "lucide-react";
import { cyberAudio } from "@/lib/audio";

// Custom SVG for WhatsApp
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export default function Enigma2SocialSidebar() {
  const [isEventsVisible, setIsEventsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
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
    <>
      {/* Right Floating Dock - Instagram & WhatsApp Only */}
      <div
        className={`fixed right-3 lg:right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isEventsVisible
            ? "translate-x-28 opacity-0 pointer-events-none"
            : "translate-x-0 opacity-100 pointer-events-auto"
        }`}
      >
        <div className="techfest-dock rounded-2xl py-3 px-1.5 flex flex-col items-center gap-3.5 w-[46px] shadow-2xl">
          <a
            href="https://www.instagram.com/udcs.mumbaiuniversity"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playClick()}
            className="text-white/80 hover:text-white transition-all hover:scale-115 p-1"
            title="Instagram"
          >
            <Instagram size={20} />
          </a>

          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playClick()}
            className="text-white/80 hover:text-white transition-all hover:scale-115 p-1"
            title="WhatsApp"
          >
            <WhatsAppIcon size={20} />
          </a>
        </div>
      </div>
    </>
  );
}
