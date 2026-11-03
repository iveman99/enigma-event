import TechBackground from "@/components/ui/TechBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Events from "@/components/sections/Events";
import TheArcade from "@/components/sections/TheArcade";

import Registration from "@/components/sections/Registration";
import Team from "@/components/sections/Team";

const jsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: "Enigma 2.0 | UDCS", alternateName: "Enigma UDCS", url: "https://www.enigmaudcs.in/" };

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden text-foreground selection:bg-neon-cyan selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-12 text-center">
        <h1 className="text-3xl font-bold">Enigma 2.0 — Official Techfest of UDCS</h1>
        <p className="mt-4">Enigma 2.0 is the official Techfest of the Department of Computer Science, University of Mumbai. Join us on 16 January 2027 for coding challenges, campus puzzles and esports.</p>
        <nav aria-label="Enigma 2.0" className="mt-6 flex flex-wrap justify-center gap-6"><a href="/enigma2">Explore Enigma 2.0</a><a href="/enigma2/about">About</a><a href="/enigma2/events">Events</a><a href="/enigma2/prize-pool">Prize Pool</a></nav>
      </section>
      <div data-nosnippet>
      <TechBackground />
      <Navbar />

      <Hero />
      <About />
      <Events />
      <TheArcade />

      <Registration />
      <Team />

      {/* Visual Spacer */}
      <div className="h-20" />

      <Footer />
      </div>
    </main>
  );
}
