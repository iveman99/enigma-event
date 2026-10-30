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
  metadataBase: new URL("https://www.enigmaudcs.in"),
  title: "ENIGMA 2.0 | Official Techfest of UDCS | University of Mumbai",
  description: "ENIGMA 2.0 is the official techfest of the Department of Computer Science, University of Mumbai. Explore coding challenges, esports and campus puzzles on 16 January 2027.",
  keywords: ["ENIGMA 2.0", "ENIGMA 2027", "UDCS Techfest", "University of Mumbai Techfest", "coding competition Mumbai", "tech fest", "ENIGMA UDCS"],
  authors: [{ name: "Department of Computer Science, University of Mumbai" }],
  creator: "Department of Computer Science, University of Mumbai",
  publisher: "University of Mumbai",
  openGraph: {
    title: "ENIGMA 2.0 | Official Techfest of UDCS | University of Mumbai",
    description: "ENIGMA 2.0 is the official techfest of the Department of Computer Science, University of Mumbai. Explore coding competitions, campus puzzles and esports.",
    url: "https://enigmaudcs.in",
    siteName: "ENIGMA 2.0",
    images: [
      {
        url: "/images/enigma2-brand-banner.png",
        width: 1200,
        height: 630,
        alt: "ENIGMA 2.0 Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ENIGMA 2.0 | UDCS Techfest",
    description: "Official techfest of Department of Computer Science, University of Mumbai.",
    images: ["/images/enigma2-brand-banner.png"],
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
    icon: "/images/logo-udcs-clean.png",
    shortcut: "/images/logo-udcs-clean.png",
    apple: "/images/logo-udcs-clean.png",
  },
};




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
        {children}
      </body>
    </html >
  );
}
