"use client";
import { useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
export default function DocumentUpload({ kind, label, onUploaded, onBusyChange, uploaded = false }: { kind: "id" | "receipt" | "qr"; label: string; uploaded?: boolean; onBusyChange?: (busy: boolean) => void; onUploaded: (path: string) => void | Promise<void> }) {
  const [filename, setFilename] = useState("");
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [saved, setSaved] = useState(uploaded);
  return <div className="space-y-3 rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/[0.04] p-6"><div className="flex items-center gap-3 text-cyan-200">{saved ? <CheckCircle2 size={26} /> : <UploadCloud size={26} />}<div><p className="text-sm font-medium">{saved ? "Document ready" : "Add a clear image"}</p><p className="mt-1 text-xs text-slate-400">{filename || (saved ? "Your saved image is attached." : "Select a file from your device.")}</p></div></div><label className="block text-sm text-slate-200">{label}<input aria-label={label} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} className="mt-3 block w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-300/15 file:px-3 file:py-2 file:text-cyan-200" onChange={async e => {
    const file = e.target.files?.[0]; if (!file) return;
    setError(""); setSaved(false);
    if (file.size > 1048576) { setError("Choose an image smaller than 1 MB."); return; }
    setBusy(true); onBusyChange?.(true);
    try { const form = new FormData(); form.set("file", file); form.set("kind", kind); const r = await fetch("/api/documents", { method: "POST", body: form }); const d = await r.json(); if (!r.ok) throw new Error(d.error); await onUploaded(d.path); setFilename(file.name); setSaved(true); }
    catch (err) { setError(err instanceof Error ? err.message : "Upload failed. Please try again."); }
    finally { setBusy(false); onBusyChange?.(false); e.target.value = ""; }
  }} /></label><p className="text-xs text-slate-400">JPG, PNG or WebP · up to 1 MB. Clear and readable, without unrelated personal details.</p>{busy && <p role="status" className="text-sm text-cyan-200">Saving image…</p>}{saved && <p role="status" className="text-sm text-emerald-200">Image saved securely.</p>}{error && <p role="alert" className="text-sm text-rose-200">{error}</p>}</div>;
}
