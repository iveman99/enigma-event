"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Volume2, VolumeX, Menu, X, ArrowUpRight, LogOut, Ticket } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/authContext";
import { cyberAudio } from "@/lib/audio";

interface Enigma2NavbarProps {
  onOpenAuth: () => void;
  onOpenPasses: () => void;
  onOpenRegister: () => void;
}

export default function Enigma2Navbar({
  onOpenAuth,
  onOpenPasses,
  onOpenRegister,
}: Enigma2NavbarProps) {
  const { user, signOut, myRegistrations, openProfile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 80;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "ABOUT", href: "#about", badge: null },
    { name: "COMPETITIONS", href: "#events", badge: "₹44K POOL" },
    { name: "SCHEDULE", href: "#schedule", badge: null },
    { name: "LOCATION", href: "#location", badge: null },
    { name: "TEAM", href: "#team", badge: null },
    { name: "1.0 REWIND", href: "#legacy", badge: "VAULT" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#08090d]/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] py-2.5 sm:py-3"
          : "bg-transparent py-4 sm:py-6"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Compact ENIGMA 2.0 Brand Lockup (Smoothly revealed when scrolled) */}
        <div className="flex items-center">
          <Link
            href="#hero"
            onClick={() => cyberAudio.playClick()}
            className={`flex items-center gap-2.5 sm:gap-3 transition-all duration-300 pointer-events-auto group ${
              scrolled
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            {/* University of Mumbai Logo */}
            <div className="relative aspect-[192/226] h-7 sm:h-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo-mu.png"
                alt="University of Mumbai"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* ENIGMA 2.0 Wordmark */}
            <div className="flex items-baseline leading-none">
              <span className="enigma-broken-font font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wider">
                ENIGMA
              </span>
              <span className="ml-1 font-[family-name:var(--font-orbitron)] font-black text-[10px] sm:text-xs text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]">
                2.0
              </span>
            </div>

            {/* UDCS Logo */}
            <div className="relative aspect-square h-7 sm:h-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo-udcs-clean.png"
                alt="UDCS"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>



        {/* Right: Clean User Capsule (Veman / Sign In) */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openProfile("portfolio")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 transition-all cursor-pointer"
              >
                <Ticket size={13} className="text-amber-400" />
                <span>Passes ({myRegistrations.length})</span>
              </button>

              <button
                onClick={() => openProfile("portfolio")}
                className="px-3.5 py-1.5 rounded-xl bg-[#131722] hover:bg-[#1c2233] border border-cyan-500/30 hover:border-cyan-400 text-white font-sans font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{user.name.split(" ")[0].toUpperCase()}</span>
              </button>

              <button
                onClick={() => signOut()}
                title="Sign out"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openProfile("choice")}
              className="px-6 py-2 rounded-xl bg-[#131722] hover:bg-[#1a2030] border border-cyan-500/30 hover:border-cyan-400 text-white font-sans font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <User size={14} className="text-gray-400" />
              <span>SIGN IN</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0e17]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 mt-3 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => {
                setMobileMenuOpen(false);
                cyberAudio.playClick();
              }}
              className="flex items-center justify-between text-sm font-sans font-bold text-gray-200 tracking-wider uppercase py-2 border-b border-white/5"
            >
              <span>{item.name}</span>
              {item.badge && (
                <span className="text-[10px] font-mono text-techfest-amber bg-techfest-amber/10 px-2 py-0.5 rounded border border-techfest-amber/30">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-sans font-bold text-xs uppercase tracking-wider"
            >
              Register Pass
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
