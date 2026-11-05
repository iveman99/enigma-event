"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import qrGenerator from "qrcode-generator";
import { CheckCircle2, QrCode, RefreshCw, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { passCode, type FestivalPass } from "@/lib/festival-pass";
import { useAuth } from "@/lib/authContext";

function qrImage(token: string) {
  const qr = qrGenerator(0, "M");
  qr.addData(passCode(token));
  qr.make();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr.createSvgTag({ cellSize: 5, margin: 4, scalable: true }))}`;
}

export default function FestivalPasses() {
  const { user } = useAuth();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [qrVisible, setQrVisible] = useState<Record<string,boolean>>({});
  const [passes, setPasses] = useState<FestivalPass[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    if (!user) { setPasses([]); setLoading(false); return; }
    try {
      const response = await fetch("/api/passes", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setPasses(result.passes);
      setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Passes couldn't be loaded."); }
    finally { setLoading(false); }
  }, [user]);
  useEffect(() => {
    void Promise.resolve().then(refresh);
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 30000);
    const focus = () => { void refresh(); };
    window.addEventListener("focus", focus);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", focus); };
  }, [refresh]);
  if (loading) return <p role="status" className="py-10 text-center text-sm text-slate-400">Loading your passes…</p>;
  const move = (direction:number) => { const el=track.current; if(el) el.scrollBy({left: direction*el.clientWidth, behavior:"smooth"}); };
  return <section className="space-y-5"><div className="flex items-center justify-between gap-4"><div><h3 className="flex items-center gap-2 font-semibold text-white"><QrCode size={18} className="text-cyan-200"/>Your day passes</h3><p className="mt-1 text-xs text-slate-400">One pass per participant. Swipe to explore.</p></div><button aria-label="Refresh passes" onClick={()=>void refresh()} className="rounded-full border border-white/15 p-3 text-cyan-200"><RefreshCw size={16}/></button></div>
  {error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-200">{error}</p>}
  {!error && !passes.length && <div className="rounded-3xl border border-white/15 bg-white/5 p-8 text-center"><QrCode className="mx-auto text-cyan-200" size={32}/><h4 className="mt-5 text-xl font-semibold">Your next challenge starts here.</h4><p className="mt-3 text-sm leading-6 text-slate-400">Approved registrations unlock your QR pass here.</p><Link href="/enigma2/events" className="mt-5 inline-block rounded-full bg-cyan-200 px-6 py-3 text-sm font-semibold text-slate-950">Explore events →</Link></div>}
  {!!passes.length && <><div ref={track} role="region" aria-label="Participant passes" tabIndex={0} onScroll={e=>{const el=e.currentTarget;setActive(Math.round(el.scrollLeft/el.clientWidth));}} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[28px] [scrollbar-width:none]">
  {passes.map((p,index)=><div key={p.token} className="w-full shrink-0 snap-center p-1"><article aria-label={`Pass ${index+1} for ${p.name}`} className="relative isolate min-h-[480px] overflow-hidden rounded-[26px] border border-cyan-200/35 bg-[#091728] shadow-2xl">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10"><Image src="/images/enigma2-celestial-hero.jpg" alt="" fill sizes="700px" className="object-cover opacity-20"/><div className="absolute inset-0 bg-gradient-to-br from-[#102c43]/70 via-[#091728]/75 to-[#091728]"/><div className="absolute -right-24 top-20 h-72 w-72 rounded-full border border-cyan-200/20 shadow-[0_0_80px_rgba(34,211,238,.1)]"/><div className="absolute -right-16 top-28 h-56 w-56 rounded-full border border-cyan-200/15"/></div>
  <div className="flex items-center justify-between border-b border-dashed border-cyan-100/20 px-6 py-5"><div className="flex items-center gap-2"><Image src="/images/logo-udcs-clean.png" alt="UDCS" width={30} height={30}/><span className="font-display text-sm font-bold tracking-wider">ENIGMA <span className="text-cyan-200">2.0</span></span></div><span className="text-[10px] uppercase tracking-[.2em] text-cyan-100">{p.checkedInAt?"Checked in":"Entry confirmed"}</span></div>
  <div key={String(!!qrVisible[p.token])} className="enigma-pass-reveal px-6 py-7 sm:px-9">{qrVisible[p.token] ? <div className="text-center"><h4 className="text-xl font-semibold">{p.name}</h4><div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-3"><img src={qrImage(p.token)} alt={`Check-in QR for ${p.name}`} width={180} height={180} className="h-[180px] w-[180px]"/></div><p className="mt-4 break-all font-mono text-[10px] text-slate-400">{passCode(p.token)}</p><p className="mt-3 text-xs text-slate-300">Show this QR and your college ID at check-in.</p></div> : <div><p className="text-xs uppercase tracking-[.25em] text-cyan-200">{p.isMine?"Your Enigma day pass":"Team participant"}</p><h4 className="mt-6 break-words text-3xl font-semibold leading-tight sm:text-4xl">{p.name}</h4><p className="mt-3 break-all text-xs text-slate-400">{p.email}</p><div className="mt-7 space-y-2">{p.events.map((event,i)=><p key={`${event.id}-${i}`} className="text-sm text-slate-200">{event.title}{event.team && <span className="ml-2 text-xs text-cyan-200">· {event.team}</span>}</p>)}</div><div className="mt-8 flex gap-8 border-t border-white/10 pt-5 text-sm"><div><p className="text-[10px] uppercase tracking-widest text-slate-500">Date</p><p className="mt-1">16 January 2027</p></div><div><p className="text-[10px] uppercase tracking-widest text-slate-500">Location</p><p className="mt-1">UDCS · Mumbai</p></div></div></div>}
  <button onClick={()=>setQrVisible(current=>({...current,[p.token]:!current[p.token]}))} aria-pressed={!!qrVisible[p.token]} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-200/10 px-5 py-3 text-sm text-cyan-100 transition hover:bg-cyan-200/20"><RotateCw size={15}/>{qrVisible[p.token]?"Back to pass":"Flip to check-in QR"}</button>
  {p.checkedInAt && <p className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-200"><CheckCircle2 size={14}/>Arrived · {new Date(p.checkedInAt).toLocaleString("en-IN",{timeZone:"Asia/Kolkata",dateStyle:"medium",timeStyle:"short"})}</p>}
  </div></article></div>)}
  </div><div className="flex items-center justify-center gap-5"><button aria-label="Previous pass" disabled={active===0} onClick={()=>move(-1)} className="rounded-full border border-white/20 p-3 text-white disabled:opacity-25"><ChevronLeft size={18}/></button><p aria-live="polite" className="text-xs text-slate-400">Pass {Math.min(active+1,passes.length)} of {passes.length}</p><button aria-label="Next pass" disabled={active>=passes.length-1} onClick={()=>move(1)} className="rounded-full border border-white/20 p-3 text-white disabled:opacity-25"><ChevronRight size={18}/></button></div><p className="text-center text-xs text-slate-500">Keep your check-in QR private.</p></>}
  </section>;
}
