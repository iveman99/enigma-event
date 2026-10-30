"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, RotateCcw, Search, Users, X } from "lucide-react";
import { flowField } from "./FlowDialog";

type Attendee = { email: string; name: string; checkedInAt: string | null };
type Preview = { name: string; email: string; phone: string; checkedInAt: string | null; events: Array<{id:string;title:string;team:string}> };
type Detector = { detect(source: HTMLVideoElement): Promise<Array<{ rawValue: string }>> };

export default function AttendanceDesk() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filter, setFilter] = useState("");
  const [code, setCode] = useState("");
  const [person, setPerson] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [camera, setCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrame = useRef(0);
  const scanning = useRef(false);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/organiser/check-in", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAttendees(data.attendees);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Attendance couldn't be loaded."); }
  }, []);
  useEffect(() => { void Promise.resolve().then(refresh); }, [refresh]);
  const stopCamera = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCamera(false);
  }, []);
  useEffect(() => () => stopCamera(), [stopCamera]);
  const request = async (action: "preview" | "checkin" | "reverse", value = code) => {
    if (busy) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/organiser/check-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, code: value, ...(action === "reverse" ? { reason } : {}) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCode(value.trim()); setPerson(data.person);
      if (action === "checkin") setNotice(data.result === "already_checked_in" ? "Already checked in. No duplicate arrival was recorded." : "Arrival recorded successfully.");
      if (action === "reverse") { setNotice("Check-in reversed and recorded in the activity log."); setReason(""); }
      if (action !== "preview") void refresh();
      stopCamera();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The pass couldn't be checked."); }
    finally { setBusy(false); scanning.current = false; }
  };
  const startCamera = async () => {
    setError("");
    const BarcodeDetector = (window as Window & { BarcodeDetector?: new (options: { formats: string[] }) => Detector }).BarcodeDetector;
    if (!BarcodeDetector || !navigator.mediaDevices?.getUserMedia) { setError("Camera scanning is unavailable in this browser. Enter the code printed below the student's QR instead."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) { stream.getTracks().forEach(track => track.stop()); return; }
      video.srcObject = stream;
      setCamera(true);
      await video.play();
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      const loop = async (time: number) => {
        if (!streamRef.current) return;
        if (time - lastFrame.current > 250 && !scanning.current && video.readyState >= 2) {
          lastFrame.current = time;
          try {
            const matches = await detector.detect(video);
            if (matches.length && !scanning.current) { scanning.current = true; await request("preview", matches[0].rawValue); return; }
          } catch { /* Try the next frame; manual entry remains available. */ }
        }
        frameRef.current = requestAnimationFrame(loop);
      };
      frameRef.current = requestAnimationFrame(loop);
    } catch { setError("Camera permission was not granted. You can enter the pass code manually."); stopCamera(); }
  };
  const shown = attendees.filter(a => `${a.name} ${a.email}`.toLowerCase().includes(filter.toLowerCase()));
  return <section className="space-y-6"><div><p className="text-xs uppercase tracking-[.25em] text-cyan-200">Techfest day · 16 January 2027</p><h2 className="mt-2 text-2xl font-semibold">Arrival check-in</h2><p className="mt-2 text-sm text-slate-400">Scan one QR per student. Review their name and approved events, then confirm their arrival.</p></div>
    <div className="grid grid-cols-2 gap-3 sm:max-w-md">{[{label:"Approved pass holders",value:attendees.length,icon:Users},{label:"Checked in",value:attendees.filter(a => a.checkedInAt).length,icon:CheckCircle2}].map(s => <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><s.icon className="text-cyan-200" size={19} /><p className="mt-3 text-3xl font-semibold">{s.value}</p><p className="text-xs text-slate-400">{s.label}</p></div>)}</div>
    <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><div className="space-y-4 rounded-2xl border border-white/10 bg-white/[.03] p-5"><h3 className="font-semibold">Scan a pass</h3><video ref={videoRef} muted playsInline className={`aspect-video w-full rounded-xl bg-black object-cover ${camera ? "block" : "hidden"}`} />{camera ? <button onClick={stopCamera} className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm"><X size={16} />Stop camera</button> : <button onClick={() => void startCamera()} className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950"><Camera size={17} />Open camera scanner</button>}<p className="text-xs text-slate-400">Camera requires permission and a supported browser. Manual entry always works.</p><div className="border-t border-white/10 pt-4"><label className="block text-sm text-slate-300">Code printed under the QR<input className={flowField+" mt-2 font-mono"} value={code} onChange={e => { setCode(e.target.value); setPerson(null); }} placeholder="ENG27:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" /></label><button disabled={busy || !code.trim()} onClick={() => void request("preview")} className="mt-3 rounded-xl border border-cyan-300/30 px-4 py-3 text-sm text-cyan-200 disabled:opacity-40">Look up pass</button></div></div>
    <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">{!person ? <p className="py-16 text-center text-sm text-slate-400">A student’s details and approved events will appear here after a scan.</p> : <div><p className="text-xs uppercase tracking-widest text-cyan-200">Pass verified</p><h3 className="mt-2 text-2xl font-semibold">{person.name}</h3><p className="mt-1 text-sm text-slate-400">{person.email}{person.phone && ` · ${person.phone}`}</p><div className="mt-5 space-y-2"><p className="text-xs uppercase tracking-wider text-slate-400">Approved events</p>{person.events.map((e,i) => <p key={`${e.id}-${i}`} className="rounded-lg border border-white/10 px-3 py-2 text-sm">{e.title}{e.team && ` · ${e.team}`}</p>)}</div>{person.checkedInAt ? <p className="mt-5 rounded-xl bg-emerald-300/10 p-4 text-sm text-emerald-200">Checked in at {new Date(person.checkedInAt).toLocaleString("en-IN", {timeZone:"Asia/Kolkata",dateStyle:"medium",timeStyle:"short"})}</p> : <button disabled={busy} onClick={() => void request("checkin")} className="mt-5 w-full rounded-xl bg-emerald-300 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50">Confirm arrival</button>}{person.checkedInAt && <details className="mt-5 rounded-xl border border-white/10 p-4"><summary className="cursor-pointer text-sm text-slate-300">Correct an accidental check-in</summary><label className="mt-4 block text-xs text-slate-400">Reason for correction<input className={flowField+" mt-2"} maxLength={500} value={reason} onChange={e => setReason(e.target.value)} /></label><button disabled={busy || reason.trim().length < 5} onClick={() => void request("reverse")} className="mt-3 flex items-center gap-2 text-sm text-amber-200 disabled:opacity-40"><RotateCcw size={15} />Reverse check-in</button></details>}</div>}</div></div>
    {error && <p role="alert" className="rounded-xl border border-rose-300/25 bg-rose-300/10 p-4 text-sm text-rose-200">{error}</p>}{notice && <p role="status" className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-200">{notice}</p>}
    <div className="rounded-2xl border border-white/10 p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">Attendance list</h3><label className="relative"><Search size={15} className="absolute left-3 top-3 text-slate-500" /><input aria-label="Search attendees" className={flowField+" pl-9"} value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search students" /></label></div><div className="max-h-96 space-y-2 overflow-y-auto">{shown.map(a => <div key={a.email} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 p-3 text-sm"><span><strong>{a.name}</strong><span className="block text-xs text-slate-400">{a.email}</span></span><span className={a.checkedInAt ? "text-emerald-200" : "text-amber-200"}>{a.checkedInAt ? "Arrived" : "Expected"}</span></div>)}{!shown.length && <p className="py-6 text-sm text-slate-400">No matching pass holders.</p>}</div></div>
  </section>;
}
