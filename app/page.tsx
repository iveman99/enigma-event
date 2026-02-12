import TechBackground from "@/components/ui/TechBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Events from "@/components/sections/Events";
import Schedule from "@/components/sections/Schedule";

import Registration from "@/components/sections/Registration";
import Team from "@/components/sections/Team";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden text-foreground selection:bg-neon-cyan selection:text-black">
      <TechBackground />
      <Navbar />

      <Hero />
      <About />
      <Events />
      <Schedule />

      <Registration />
      <Team />

      {/* Visual Spacer */}
      <div className="h-20" />

      <Footer />
    </main>
  );
}
