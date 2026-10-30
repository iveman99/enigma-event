import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "ENIGMA 2.0 | UDCS Techfest 2027 | University of Mumbai";
const description = "Explore Enigma 2.0, the Department of Computer Science techfest at the University of Mumbai on 16 January 2027. Discover coding challenges, puzzles, esports and the festival schedule.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.enigmaudcs.in/enigma2" },
  robots: { index: true, follow: true },
  openGraph: {
    title, description, url: "https://www.enigmaudcs.in/enigma2", siteName: "Enigma 2.0 | UDCS", type: "website",
    images: [{ url: "/images/enigma-email-header-v3.jpg", width: 1200, height: 252, alt: "Enigma 2.0 — University of Mumbai, Department of Computer Science" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/enigma-email-header-v3.jpg"] },
};

const event = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Enigma 2.0 — UDCS Techfest 2027",
  description,
  startDate: "2027-01-16",
  endDate: "2027-01-16",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  url: "https://www.enigmaudcs.in/enigma2",
  image: "https://www.enigmaudcs.in/images/enigma-email-header-v3.jpg",
  location: { "@type": "Place", name: "Department of Computer Science, University of Mumbai", address: { "@type": "PostalAddress", streetAddress: "Vidyanagari, Kalina, Santacruz (East)", addressLocality: "Mumbai", addressRegion: "Maharashtra", postalCode: "400098", addressCountry: "IN" } },
  organizer: { "@type": "Organization", name: "Department of Computer Science, University of Mumbai", url: "https://www.enigmaudcs.in" },
};

export default function Enigma2Layout({ children }: { children: ReactNode }) {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }} />{children}</>;
}
