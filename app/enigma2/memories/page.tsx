import type { Metadata } from "next";
import Link from "next/link";
import EnigmaBrand from "@/components/enigma2/EnigmaBrand";
import Enigma2LegacyGallery from "@/components/enigma2/Enigma2LegacyGallery";

export const metadata: Metadata = {
  title: "Enigma 1.0 Memories | Photos & Videos | UDCS",
  description: "Explore photos and videos from Enigma 1.0, held on 11 March 2026 by the Department of Computer Science, University of Mumbai.",
  alternates: { canonical: "https://www.enigmaudcs.in/enigma2/memories" },
  openGraph: { title: "Enigma 1.0 Memories", description: "The people, challenges and moments from Enigma 1.0.", url: "https://www.enigmaudcs.in/enigma2/memories", images: ["/enigma1/selected/img_7425.webp"] },
};
export default function MemoriesPage() {
  return <main className="min-h-screen bg-[#04060b] text-white">
    <header className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between gap-5 border-b border-white/10 px-6 py-5 sm:px-10">
      <Link href="/enigma2" className="flex items-center gap-3"><EnigmaBrand /></Link>
      <Link href="/enigma2" className="rounded-full border border-white/15 px-4 py-2 text-xs text-slate-300 transition hover:border-cyan-300/50 hover:text-white">← Back to Techfest</Link>
    </header>
    <h1 className="sr-only">Enigma 1.0 photo and video gallery</h1>
    <Enigma2LegacyGallery fullGallery />
    <footer className="border-t border-white/10 px-6 py-8 text-center text-xs leading-6 text-slate-500">Department of Computer Science · University of Mumbai<br /><Link href="/enigma2" className="text-cyan-200">Discover Enigma 2.0 · 16 January 2027</Link></footer>
  </main>;
}
