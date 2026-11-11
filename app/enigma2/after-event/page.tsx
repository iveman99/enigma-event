import type { Metadata } from "next";
import Link from "next/link";
import { Camera, MessageSquareText } from "lucide-react";
import ExperienceFrame from "@/components/enigma2/ExperienceFrame";

export const metadata: Metadata = {
  title: "After the Event | Enigma 2.0",
  description: "Share feedback and event photos after Enigma 2.0, the official Techfest of the Department of Computer Science, University of Mumbai.",
  alternates: { canonical: "https://www.enigmaudcs.in/enigma2/after-event" },
};

const destinations = [
  { id: "feedback", title: "Event feedback", detail: "The Enigma 2.0 feedback form will be available after the event.", Icon: MessageSquareText },
  { id: "photos", title: "Event photos", detail: "The event photo submission form will be available after the event.", Icon: Camera },
];

export default function AfterEventPage() {
  return <ExperienceFrame><div className="mx-auto max-w-3xl">
    <p className="text-xs uppercase tracking-widest text-cyan-200">Enigma 2.0 · After the event</p>
    <h1 className="mt-8 text-3xl font-bold sm:text-4xl">See you after Enigma.</h1>
    <p className="mt-5 leading-relaxed text-slate-300">These forms will open after the event. Please come back then to share your feedback or event photos.</p>
    <div className="mt-9 grid gap-4 sm:grid-cols-2">
      {destinations.map(({ id, title, detail, Icon }) => <article id={id} key={id} className="scroll-mt-8 rounded-2xl border border-white/10 bg-[#0d2031]/75 p-5">
        <Icon size={21} className="text-cyan-200" />
        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-amber-100"><span className="h-1.5 w-1.5 rounded-full bg-amber-300" />Available after the event</span>
      </article>)}
    </div>
    <Link href="/enigma2" className="mt-9 inline-flex rounded-full border border-cyan-200/30 px-5 py-3 text-sm text-cyan-100 transition hover:bg-cyan-200/10">Back to Enigma 2.0</Link>
  </div></ExperienceFrame>;
}
