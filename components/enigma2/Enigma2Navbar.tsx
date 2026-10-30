"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Volume2, VolumeX, Menu, X, ArrowUpRight, LogOut, Ticket, ShieldCheck } from "lucide-react";
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
  const [terminalAccess, setTerminalAccess] = useState(false);
  const [terminalPrompt, setTerminalPrompt] = useState(false);

  useEffect(() => {
    let active = true;
    if (!user) return;
    void fetch("/api/organiser/access", { cache: "no-store" }).then(r => r.json()).then(d => { if (active) setTerminalAccess(d.allowed === true); }).catch(() => { if (active) setTerminalAccess(false); });
    return () => { active = false; };
  }, [user?.id]);

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
              {terminalAccess && <button onClick={() => setTerminalPrompt(true)} className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-amber-200 hover:bg-amber-400/20"><span className="hidden sm:inline">Access terminal</span><span className="sm:hidden">Terminal</span></button>}
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
      {terminalPrompt && <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setTerminalPrompt(false); }}><section role="dialog" aria-modal="true" aria-labelledby="terminal-title" className="w-full max-w-md rounded-3xl border border-cyan-300/30 bg-[#0b1523] p-7 text-white shadow-[0_25px_90px_rgba(0,0,0,.8)]"><div className="flex items-start justify-between"><div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-3"><ShieldCheck className="text-cyan-200" /></div><button onClick={() => setTerminalPrompt(false)} aria-label="Close" className="rounded-full border border-white/15 p-2"><X size={18} /></button></div><p className="mt-6 text-xs font-bold uppercase tracking-[.25em] text-cyan-200">Enigma 2.0 · Organiser access</p><h2 id="terminal-title" className="mt-2 text-2xl font-bold">Welcome to the terminal.</h2><p className="mt-3 text-sm leading-6 text-slate-300">This workspace contains private student details and payment records. Review each payment in your bank or UPI app before approval, record clear notes, and use only your own organiser account.</p><div className="mt-6 flex gap-3"><button onClick={() => setTerminalPrompt(false)} className="flex-1 rounded-xl border border-white/20 px-4 py-3 text-sm">Cancel</button><Link href="/enigma2/terminal" onClick={() => setTerminalPrompt(false)} className="flex-1 rounded-xl bg-cyan-300 px-4 py-3 text-center text-sm font-bold text-slate-950">Enter terminal</Link></div></section></div>}

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
