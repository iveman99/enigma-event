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
  title: "ENIGMA 2026 | Official Techfest of UDCS | University of Mumbai",
  description: "ENIGMA 2026 is the official techfest of the Department of Computer Science, University of Mumbai. Participate in coding competitions, tech challenges, and exciting events with amazing prizes.",
  keywords: ["ENIGMA 2026", "UDCS Techfest", "University of Mumbai Techfest", "coding competition Mumbai", "tech fest 2026", "ENIGMA UDCS"],
  authors: [{ name: "Department of Computer Science, University of Mumbai" }],
  creator: "Department of Computer Science, University of Mumbai",
  publisher: "University of Mumbai",
  openGraph: {
    title: "ENIGMA 2026 | Official Techfest of UDCS",
    description: "Official techfest of Department of Computer Science, University of Mumbai. Join exciting coding and tech events.",
    url: "https://enigmaudcs.in",
    siteName: "ENIGMA 2026",
    images: [
      {
        url: "/images/enigma-logo.png",
        width: 1200,
        height: 630,
        alt: "ENIGMA 2026 Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ENIGMA 2026 | UDCS Techfest",
    description: "Official techfest of Department of Computer Science, University of Mumbai.",
    images: ["/images/enigma-logo.png"],
    creator: "@enigmaudcs", // Assuming handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import ScanlineOverlay from "@/components/ui/ScanlineOverlay";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} ${libreBaskerville.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <ScanlineOverlay />
        {children}
      </body>
    </html >
  );
}
