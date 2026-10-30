"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { statusLabel } from "@/lib/registration";
import FestivalPasses from "./FestivalPasses";
export default function RegistrationList() {
  const { myRegistrations, registrationsError, refreshMyRegistrations } = useAuth();
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") void refreshMyRegistrations(); };
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    return () => { clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, [refreshMyRegistrations]);
  return <section className="space-y-6"><FestivalPasses /><div className="flex items-center justify-between border-t border-white/10 pt-5"><h3 className="font-semibold text-white">My registrations</h3><button disabled={busy} className="text-xs text-cyan-200" onClick={async () => { setBusy(true); try { await refreshMyRegistrations(); } finally { setBusy(false); } }}>{busy ? "Refreshing…" : "Refresh status"}</button></div>{registrationsError && <p role="alert" className="text-sm text-amber-200">{registrationsError}</p>}{!registrationsError && myRegistrations.length === 0 && <p className="text-sm text-slate-400">Your event entries will appear here after submission.</p>}{myRegistrations.map(r => <article key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-medium text-white">{r.event_title}</h4><span className={`rounded-full px-3 py-1 text-xs ${r.status === "approved" ? "bg-emerald-300/10 text-emerald-200" : r.status === "rejected" ? "bg-rose-300/10 text-rose-200" : "bg-amber-300/10 text-amber-200"}`}>{statusLabel[r.status]}</span></div><p className="mt-2 text-xs text-slate-400">₹{r.amount} · {r.team_name || "Solo entry"}</p>{r.status === "archived" && <p className="mt-3 text-sm text-rose-200">This registration was cancelled. {r.review_note} Contact the organisers for help.</p>}{r.status === "pending" && <p className="mt-3 text-sm text-slate-300">We are verifying your payment. Your status will update here once the organising team finishes the review.</p>}{r.status === "rejected" && <p className="mt-3 text-sm text-rose-200">{r.review_note}<span className="mt-2 block text-slate-400">Open this event’s registration to correct and resubmit. Don’t pay again unless instructed by the organising team.</span></p>}{r.status === "approved" && <div className="mt-3 rounded-lg border border-emerald-300/20 p-3"><p className="text-sm text-emerald-200">Your payment is approved. Your entry is confirmed.</p><p className="mt-2 break-all font-mono text-xs text-white">{r.ticket_code}</p><p className="mt-2 text-xs text-slate-400">Show this confirmation and your college ID at check-in.</p></div>}</article>)}</section>;
}
