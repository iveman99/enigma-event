"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Camera, MessageSquareText, QrCode } from "lucide-react";
import Link from "next/link";
import qrGenerator from "qrcode-generator";

const forms = [
  {
    id: "feedback-form",
    type: "feedback",
    title: "Share your feedback",
    description: "Tell us what you thought of Enigma 2.0 and help shape what comes next.",
    icon: MessageSquareText,
    number: "01",
  },
  {
    id: "event-photos",
    type: "photos",
    title: "Share event photos",
    description: "Send us your moments from the day so we can add them to the Enigma memories.",
    icon: Camera,
    number: "02",
  },
] as const;

function makeQr(type: string) {
  const qr = qrGenerator(0, "M");
  qr.addData(`https://www.enigmaudcs.in/enigma2/after-event#${type}`);
  qr.make();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr.createSvgTag({ cellSize: 5, margin: 3, scalable: true }))}`;
}

export default function Enigma2AfterEvent() {
  return (
    <section id="after-event" aria-labelledby="after-event-title" className="relative isolate overflow-hidden border-y border-cyan-200/10 bg-[#070b12] px-4 py-20 text-white sm:px-8 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_25%,rgba(34,211,238,.13),transparent_38%),radial-gradient(ellipse_at_82%_75%,rgba(245,158,11,.08),transparent_36%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[.035] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:54px_54px]" />
      <div className="mx-auto max-w-6xl">
        <motion.header initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-[.2em] text-cyan-100 sm:text-xs"><QrCode size={14} /> After the event</p>
          <h2 id="after-event-title" className="text-3xl font-bold tracking-tight sm:text-4xl">Keep the Enigma memories going.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Two quick ways to share your experience and moments from Enigma 2.0.</p>
        </motion.header>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-7">
          {forms.map(({ id, type, title, description, icon: Icon, number }, index) => {
            const qrSrc = makeQr(type);
            return (
              <motion.article key={id} id={id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .1 }} className="group relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0b1523]/90 p-5 shadow-[0_20px_70px_rgba(0,0,0,.25)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35 hover:shadow-[0_20px_80px_rgba(8,145,178,.12)] sm:min-h-[280px] sm:p-7 md:flex-row md:items-center md:gap-6">
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/[.05] blur-3xl transition group-hover:bg-cyan-300/[.10]" />
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-3 text-cyan-200"><span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-200/20 bg-cyan-200/[.07]"><Icon size={19} /></span><span className="text-[10px] font-semibold tracking-[.2em]">{number} / {type === "feedback" ? "FEEDBACK" : "PHOTOS"}</span></div>
                  <h3 className="mt-5 text-xl font-semibold sm:text-2xl">{title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-200/[.06] px-3 py-1.5 text-xs font-medium text-amber-100"><span className="h-1.5 w-1.5 rounded-full bg-amber-300" />Available after the event</p>
                  <Link href={`/enigma2/after-event#${type}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-100 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Open details <ArrowUpRight size={15} /></Link>
                </div>
                <a href={`/enigma2/after-event#${type}`} aria-label={`Scan QR code for ${title}; form opens after the event`} className="relative z-10 mt-5 flex w-full shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-3 transition group-hover:border-cyan-200/25 md:mt-0 md:w-auto md:flex-col md:gap-2 md:border-0 md:bg-transparent md:p-0">
                  <img src={qrSrc} alt={`QR code for Enigma 2.0 ${type}`} width={128} height={128} className="h-24 w-24 rounded-lg bg-white p-1.5 sm:h-28 sm:w-28 md:h-32 md:w-32" />
                  <span className="text-xs leading-5 text-slate-400 md:text-center">Scan to visit<br className="hidden md:block" /> after the event</span>
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
