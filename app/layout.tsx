import type { Metadata } from "next";
import { Inter, Orbitron, JetBrains_Mono, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ENIGMA 1.0 | UDCS Technical Fest",
  description: "The official website for ENIGMA 1.0, a futuristic technical event by the Placement Cell, UDCS.",
};

import ScanlineOverlay from "@/components/ui/ScanlineOverlay";
import CyberCursor from "@/components/ui/CyberCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} ${libreBaskerville.variable} antialiased bg-background text-foreground overflow-x-hidden cursor-none`}
      >
        <ScanlineOverlay />
        <CyberCursor />
        {children}
      </body>
    </html>
  );
}
