import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function InformationLayout({ title, summary, children }: { title: string; summary: string; children: ReactNode }) {
  return <main className="min-h-screen bg-[#070c15] px-4 py-8 text-slate-200 sm:px-8 sm:py-14">
    <div className="mx-auto max-w-4xl">
      <Link href="/" className="inline-flex rounded text-sm text-cyan-200 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Back to the Enigma website</Link>
      <div className="mt-7 overflow-hidden rounded-t-2xl border border-white/15 bg-[#0c1726]">
        <Image src="/images/enigma-email-header-v3.jpg" alt="Enigma 2.0, Department of Computer Science, University of Mumbai" width={1200} height={252} sizes="(max-width: 896px) 100vw, 896px" className="h-auto w-full" priority />
      </div>
      <article className="rounded-b-2xl border border-t-0 border-white/15 bg-[#0d1421] px-6 py-8 sm:px-12 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Enigma 2.0 | UDCS</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{summary}</p>
        <p className="mt-4 text-xs text-slate-400">Last updated: 30 October 2026</p>
        <div className="mt-10 space-y-9 text-sm leading-7 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_a]:text-cyan-200 [&_a]:underline [&_a]:underline-offset-4">{children}</div>
      </article>
      <nav aria-label="Account information" className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-cyan-200">
        <Link href="/account-information" className="underline underline-offset-4">About student accounts</Link>
        <Link href="/privacy" className="underline underline-offset-4">Privacy policy</Link>
        <Link href="/terms" className="underline underline-offset-4">Terms of use</Link>
        <a href="mailto:info.veman99@gmail.com" className="underline underline-offset-4">Contact the team</a>
      </nav>
      <p className="mt-6 text-xs leading-6 text-slate-500">Enigma organising team · Department of Computer Science · University of Mumbai</p>
    </div>
  </main>;
}
