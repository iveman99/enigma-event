"use client";

import { useCallback, useEffect, useState } from "react";
import qrGenerator from "qrcode-generator";
import { CheckCircle2, QrCode, RefreshCw } from "lucide-react";
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
  if (loading) return <p className="text-sm text-slate-400">Loading day passes…</p>;
  return <section className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="flex items-center gap-2 font-semibold text-white"><QrCode size={18} className="text-cyan-200" />Festival day passes</h3><p className="mt-1 text-xs text-slate-400">A separate QR for every approved participant. Show it at the entry desk.</p></div><button aria-label="Refresh passes" onClick={() => void refresh()} className="rounded-lg border border-white/15 p-2 text-cyan-200"><RefreshCw size={15} /></button></div>
    {error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-200">{error}</p>}
    {!error && passes.length === 0 && <p className="rounded-xl border border-white/10 p-4 text-sm text-slate-400">Your QR pass will appear once an organiser approves your payment. Team leaders will also see their teammates’ passes here.</p>}
    {passes.map(p => <article key={p.token} className="overflow-hidden rounded-2xl border border-cyan-300/25 bg-[#101c2c]"><div className="border-b border-white/10 bg-gradient-to-r from-cyan-300/10 to-amber-300/10 px-5 py-4"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-cyan-200">Enigma 2.0 · 16 Jan 2027</p><h4 className="mt-2 text-xl font-bold text-white">{p.name}</h4><p className="text-xs text-slate-400">{p.isMine ? "Your pass" : "Teammate pass"} · {p.email}</p></div><div className="p-5"><div className="mx-auto w-fit rounded-xl bg-white p-3"><img src={qrImage(p.token)} alt={`Check-in QR for ${p.name}`} width={180} height={180} className="h-[180px] w-[180px]" /></div><p className="mt-3 text-center font-mono text-[10px] tracking-wide text-slate-400">{passCode(p.token)}</p><div className="mt-5 space-y-2"><p className="text-xs font-bold uppercase tracking-wider text-cyan-200">Approved events</p>{p.events.map((event,i) => <p key={`${event.id}-${i}`} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white">{event.title}{event.team && <span className="block text-xs text-slate-400">Team: {event.team}</span>}</p>)}</div><p className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${p.checkedInAt ? "bg-emerald-300/10 text-emerald-200" : "bg-amber-300/10 text-amber-100"}`}>{p.checkedInAt ? <><CheckCircle2 size={16} />Checked in on {new Date(p.checkedInAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}</> : "Not checked in yet · Show this QR at the venue"}</p></div></article>)}
    <p className="text-xs text-slate-500">Keep your QR private. Organisers scan it to confirm your arrival; payment approval is handled separately.</p>
  </section>;
}
