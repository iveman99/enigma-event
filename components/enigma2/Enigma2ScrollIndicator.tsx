"use client";

import { useEffect, useRef } from "react";

export default function Enigma2ScrollIndicator() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${progress})`;
          }
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
    /* Ultra-performant GPU-accelerated reading progress bar (0 React re-renders) */
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-white/5 pointer-events-none">
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 origin-left will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
