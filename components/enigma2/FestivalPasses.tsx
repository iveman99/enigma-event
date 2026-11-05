"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ParticipantTicket from "./ParticipantTicket";
import { QrCode, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { type FestivalPass } from "@/lib/festival-pass";
import { useAuth } from "@/lib/authContext";

export default function FestivalPasses() {
  const { user } = useAuth();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
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
  return <section className="space-y-5"><div className="flex items-center justify-between gap-4"><div><h3 className="flex items-center gap-2 font-semibold text-white"><QrCode size={18} className="text-cyan-200"/>Your day passes</h3><p className="mt-1 text-xs text-slate-400">Select a participant to view their pass.</p></div><button aria-label="Refresh passes" onClick={()=>void refresh()} className="rounded-full border border-white/15 p-3 text-cyan-200"><RefreshCw size={16}/></button></div>
  {error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-200">{error}</p>}
  {!error && !passes.length && <div className="rounded-3xl border border-white/15 bg-white/5 p-8 text-center"><QrCode className="mx-auto text-cyan-200" size={32}/><h4 className="mt-5 text-xl font-semibold">Your next challenge starts here.</h4><p className="mt-3 text-sm leading-6 text-slate-400">Approved registrations unlock your QR pass here.</p><Link href="/enigma2#events" className="mt-5 inline-block rounded-full bg-cyan-200 px-6 py-3 text-sm font-semibold text-slate-950">Explore events →</Link></div>}
  {!!passes.length && <><div ref={track} role="region" aria-label="Participant passes" tabIndex={0} onScroll={e=>{const el=e.currentTarget;setActive(Math.round(el.scrollLeft/el.clientWidth));}} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]">
  {passes.map(p=><div key={p.token} className="w-full shrink-0 snap-center px-1 py-4"><ParticipantTicket pass={p}/></div>)}
  </div><div className="flex items-center justify-center gap-5"><button aria-label="Previous pass" disabled={active===0} onClick={()=>move(-1)} className="rounded-full border border-white/20 p-3 text-white disabled:opacity-25"><ChevronLeft size={18}/></button><p aria-live="polite" className="text-xs text-slate-400">Pass {Math.min(active+1,passes.length)} of {passes.length}</p><button aria-label="Next pass" disabled={active>=passes.length-1} onClick={()=>move(1)} className="rounded-full border border-white/20 p-3 text-white disabled:opacity-25"><ChevronRight size={18}/></button></div><p className="text-center text-xs text-slate-500">Keep your check-in QR private.</p></>}
  </section>;
}
