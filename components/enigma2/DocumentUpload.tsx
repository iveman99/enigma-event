"use client";
import { useEffect, useState } from "react";
import { UploadCloud, CheckCircle2, Eye, X } from "lucide-react";
interface Props {
  kind: "id" | "receipt" | "qr";
  label: string;
  uploaded?: boolean;
  uploadedPath?: string;
  onBusyChange?: (busy: boolean) => void;
  onUploaded: (path: string) => void | Promise<void>;
}
export default function DocumentUpload({ kind, label, onUploaded, onBusyChange, uploaded = false, uploadedPath = "" }: Props) {
  const [filename, setFilename] = useState("");
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [saved, setSaved] = useState(uploaded);
  const [preview, setPreview] = useState("");
  const [showPreview, setShowPreview] = useState(false), [loadingPreview, setLoadingPreview] = useState(false);
  const [path, setPath] = useState(uploadedPath);
  useEffect(() => () => { if (preview.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);
  const viewImage = async () => {
    if (showPreview) { setShowPreview(false); return; }
    if (preview) { setShowPreview(true); return; }
    setLoadingPreview(true); setError("");
    try {
      const response = await fetch(`/api/documents?${new URLSearchParams({kind, ...(path ? {path} : {})})}`, {cache:"no-store"});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Couldn't open the image.");
      setPreview(data.url); setShowPreview(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't open the image. Please try again."); }
    finally { setLoadingPreview(false); }
  };
  return <div className="space-y-3 rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/[0.04] p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3 text-cyan-200">{saved ? <CheckCircle2 size={26} className="shrink-0" /> : <UploadCloud size={26} className="shrink-0" />}<div className="min-w-0"><p className="text-sm font-medium">{saved ? "Document ready" : "Add a clear image"}</p><p className="mt-1 break-all text-xs text-slate-400">{filename || (saved ? "Your saved image is attached." : "Select a file from your device.")}</p></div></div>
    {saved && kind !== "qr" && <button type="button" disabled={busy || loadingPreview} onClick={() => void viewImage()} aria-expanded={showPreview} className="inline-flex items-center gap-2 rounded-lg border border-cyan-200/30 px-3 py-2 text-xs text-cyan-200 disabled:opacity-40">{showPreview ? <X size={15} /> : <Eye size={15} />}{loadingPreview ? "Opening…" : showPreview ? "Hide image" : "View image"}</button>}</div>
    {showPreview && preview && <div className="rounded-xl border border-white/15 bg-slate-950/60 p-3"><img src={preview} alt={`Uploaded ${kind === "id" ? "college ID card" : "payment screenshot"}`} className="mx-auto max-h-80 max-w-full rounded-lg object-contain" onError={() => { setPreview(""); setShowPreview(false); setError("Preview expired or couldn't load. Select View image to try again."); }} /></div>}
    <label className="block text-sm text-slate-200">{label}<input aria-label={label} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} className="mt-3 block w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-300/15 file:px-3 file:py-2 file:text-cyan-200" onChange={async e => {
      const input = e.currentTarget;
      const file = input.files?.[0]; if (!file) return;
      setError("");
      if (file.size > 1048576) { setError("Choose an image up to 1 MB."); input.value = ""; return; }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Choose a JPG, PNG or WebP image."); input.value = ""; return; }
      setBusy(true); onBusyChange?.(true);
      try {
        const form = new FormData(); form.set("file", file); form.set("kind", kind);
        const response = await fetch("/api/documents", { method: "POST", body: form }); const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        await onUploaded(data.path);
        setPath(data.path); setFilename(file.name); setSaved(true); setPreview(URL.createObjectURL(file)); setShowPreview(false);
      } catch (err) { setError(err instanceof Error ? err.message : "Upload failed. Please try again."); }
      finally { setBusy(false); onBusyChange?.(false); input.value = ""; }
    }} /></label>
    <p className="text-xs text-slate-400">JPG, PNG or WebP · maximum 1 MB.</p>
    {busy && <p role="status" className="text-sm text-cyan-200">Saving image…</p>}
    {saved && !busy && <p role="status" className="text-sm text-emerald-200">Image saved securely.</p>}
    {error && <p role="alert" className="text-sm text-rose-200">{error}</p>}
  </div>;
}
