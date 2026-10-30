"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/authContext";
import Enigma2Navbar from "@/components/enigma2/Enigma2Navbar";
import Enigma2Hero from "@/components/enigma2/Enigma2Hero";
import Enigma2About from "@/components/enigma2/Enigma2About";
import Enigma2Events from "@/components/enigma2/Enigma2Events";
import Enigma2Schedule from "@/components/enigma2/Enigma2Schedule";
import Enigma2Contact from "@/components/enigma2/Enigma2Contact";
import Enigma2Team from "@/components/enigma2/Enigma2Team";
import Enigma2LegacyGallery from "@/components/enigma2/Enigma2LegacyGallery";
import Enigma2Footer from "@/components/enigma2/Enigma2Footer";
import Enigma2RegistrationModal from "@/components/enigma2/Enigma2RegistrationModal";
import Enigma2AuthModal from "@/components/enigma2/Enigma2AuthModal";
import Enigma2MyPassesModal from "@/components/enigma2/Enigma2MyPassesModal";
import Enigma2SideNav from "@/components/enigma2/Enigma2SideNav";
import Enigma2SocialSidebar from "@/components/enigma2/Enigma2SocialSidebar";
import Enigma2ScrollIndicator from "@/components/enigma2/Enigma2ScrollIndicator";
import { Ticket } from "lucide-react";
import { cyberAudio } from "@/lib/audio";

function Enigma2Content() {
  const { showAuthModal, setShowAuthModal, openProfile, user } = useAuth();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [preselectedEventId, setPreselectedEventId] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPassesOpen, setIsPassesOpen] = useState(false);

  const authModalOpen = isAuthOpen || showAuthModal;
  const handleCloseAuth = () => {
    setIsAuthOpen(false);
    setShowAuthModal(false);
  };

  const handleOpenRegister = (eventId?: string) => {
    setPreselectedEventId(eventId || null);
    setIsRegisterOpen(true);
    cyberAudio.playClick();
  };

  const handleOpenAuth = () => {
    openProfile(user ? "portfolio" : "choice");
    cyberAudio.playClick();
  };

  const handleOpenPasses = () => {
    if (user) setIsPassesOpen(true); else openProfile("choice");
    cyberAudio.playClick();
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-gray-100 selection:bg-amber-500/30 selection:text-white relative">
      {/* Scroll Progress Bar + Scroll Indicator */}
      <Enigma2ScrollIndicator />

      {/* Side Navigation Panel (Left - Techfest style) */}
      <Enigma2SideNav />

      {/* Social Media Sidebar (Right - Techfest style) */}
      <Enigma2SocialSidebar />

      {/* Top Navigation */}
      <Enigma2Navbar
        onOpenAuth={handleOpenAuth}
        onOpenPasses={handleOpenPasses}
        onOpenRegister={() => handleOpenRegister()}
      />

      <main className="relative">
        <Enigma2Hero
          onOpenRegister={() => handleOpenRegister()}
          onOpenAuth={handleOpenAuth}
          onOpenPasses={handleOpenPasses}
        />
        <Enigma2About />
        <Enigma2Events onSelectEventForRegister={(eventId) => handleOpenRegister(eventId)} />
        <Enigma2Schedule />
        {/* Enigma 2.0 Location Slide */}
        <Enigma2Contact />
        {/* Organizing Team */}
        <Enigma2Team />
        {/* Enigma 1.0 Archival Vault */}
        <Enigma2LegacyGallery />
      </main>

      {/* Footer - Final/Last Section of Website */}
      <Enigma2Footer />

      {/* Direct In-Website Registration Modal */}
      <Enigma2RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        preselectedEventId={preselectedEventId}
        onOpenAuth={handleOpenAuth}
      />

      {/* Operative Sign In Modal */}
      <Enigma2AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuth}
      />

      {/* My Passes Modal */}
      <Enigma2MyPassesModal
        isOpen={isPassesOpen}
        onClose={() => setIsPassesOpen(false)}
        onExploreEvents={() => {
          const el = document.getElementById("events");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

export default function Enigma2Page() {
  return (
    <AuthProvider>
      <Enigma2Content />
    </AuthProvider>
  );
}
