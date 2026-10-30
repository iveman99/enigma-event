"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
export const flowField = "w-full rounded-xl border border-white/15 bg-[#111c2b] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300";
export const flowButton = "inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-40 disabled:cursor-not-allowed";
export default function FlowDialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const nodes = ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]');
      if (!nodes?.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = overflow; previous?.focus(); };
  }, [onClose]);
  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-lg"><div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-300/20 bg-[#0b1220] p-5 text-white shadow-2xl outline-none sm:p-8"><header className="mb-6 flex items-center justify-between gap-4"><div><p className="text-xs tracking-[0.25em] text-cyan-200">ENIGMA 2.0</p><h2 className="mt-2 text-2xl font-semibold">{title}</h2></div><button type="button" onClick={onClose} aria-label="Close" className="rounded-full border border-white/15 p-2"><X size={20} /></button></header>{children}</div></div>;
}
