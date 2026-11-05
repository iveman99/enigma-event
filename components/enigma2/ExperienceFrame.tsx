import EnigmaBrand from "./EnigmaBrand";
import Image from "next/image";
import Link from "next/link";
import "./experience.css";
export default function ExperienceFrame({children}: {children: React.ReactNode}) {
 return <div className="relative isolate min-h-screen bg-[#07121f] text-white selection:bg-cyan-300/30">
 <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10"><Image src="/images/enigma2-celestial-hero.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-45"/><div className="absolute inset-0 bg-gradient-to-b from-[#07121f]/20 via-[#07121f]/70 to-[#07121f]"/><div className="eg-stars absolute -inset-20"/></div>
 <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10"><Link href="/enigma2" className="flex items-center gap-3"><EnigmaBrand /></Link><nav className="flex gap-6 text-xs font-medium text-slate-300"><Link href="/enigma2#events" className="hover:text-white">Events</Link><Link href="/enigma2/passes" className="hover:text-white">My account ↗</Link></nav></header>
 <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 sm:px-10 sm:pt-12">{children}</main>
 <footer className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 border-t border-white/10 px-6 py-7 text-[11px] leading-6 text-slate-500"><span>Department of Computer Science · University of Mumbai</span><div className="flex gap-5"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/enigma2#location">Location</Link></div></footer></div>;
}
