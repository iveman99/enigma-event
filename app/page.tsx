import TechBackground from "@/components/ui/TechBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Events from "@/components/sections/Events";
import TheArcade from "@/components/sections/TheArcade";

import Registration from "@/components/sections/Registration";
import Team from "@/components/sections/Team";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "ENIGMA 2026",
  "description": "ENIGMA 2026 is the official techfest of the Department of Computer Science, University of Mumbai featuring coding competitions, workshops, and innovative tech challenges.",
  "startDate": "2026-02-27",
  "endDate": "2026-02-28",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Department of Computer Science, University of Mumbai",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressCountry": "India"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Department of Computer Science, University of Mumbai",
    "url": "https://enigmaudcs.in"
  },
  "image": [
    "https://enigmaudcs.in/images/enigma-logo.png"
  ],
  "url": "https://enigmaudcs.in"
};

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden text-foreground selection:bg-neon-cyan selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
    </main>
  );
}
