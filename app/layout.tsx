import type { Metadata, Viewport } from "next";
import { Inter, Orbitron, JetBrains_Mono, Libre_Baskerville } from "next/font/google";
import Script from "next/script";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "ENIGMA 2026 | Official Techfest of UDCS | University of Mumbai",
  description: "ENIGMA 2026 is the official techfest of the Department of Computer Science, University of Mumbai. Participate in coding competitions, workshops, and innovative tech challenges.",
  keywords: ["ENIGMA 2026", "UDCS Techfest", "University of Mumbai Techfest", "coding competition Mumbai", "tech fest 2026", "ENIGMA UDCS"],
  authors: [{ name: "Department of Computer Science, University of Mumbai" }],
  creator: "Department of Computer Science, University of Mumbai",
  publisher: "University of Mumbai",
  openGraph: {
    title: "ENIGMA 2026 | Official Techfest of UDCS | University of Mumbai",
    description: "ENIGMA 2026 is the official techfest of the Department of Computer Science, University of Mumbai. Participate in coding competitions, workshops, and exciting technical events.",
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
    creator: "@enigmaudcs",
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
  icons: {
    icon: "/images/enigma-logo.png",
    shortcut: "/images/enigma-logo.png",
    apple: "/images/enigma-logo.png",
  },
};

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZB710FRVCL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZB710FRVCL');
          `}
        </Script>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive" // Load structured data after interactive to prioritize meaningful paint
        />
        <ScanlineOverlay />
        {children}
      </body>
    </html >
  );
}
