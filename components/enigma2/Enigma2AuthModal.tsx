"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Github, LoaderCircle, LockKeyhole, LogOut, Mail, ShieldCheck, Ticket, X } from "lucide-react";
import { useAuth, type AuthResult, type OtpRequest } from "@/lib/authContext";
import { basicProfileSchema, requestOtpSchema } from "@/lib/auth/validation";
import DocumentUpload from "./DocumentUpload";
import RegistrationList from "./RegistrationList";
import { ACADEMIC_YEARS } from "@/lib/colleges";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMessage?: string;
}

const fieldClass = "w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/15 disabled:opacity-50";
const buttonClass = "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-[#071015] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300";

export default function Enigma2AuthModal({ isOpen, onClose, onSuccess, initialMessage }: AuthModalProps) {
  const { user } = useAuth();
  return isOpen ? <AuthDialog key={user?.id || "guest"} isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} initialMessage={initialMessage} /> : null;
}

function AuthDialog({ isOpen, onClose, onSuccess, initialMessage }: AuthModalProps) {
  const { user, myRegistrations, configured, isLoading, authError, onboardingStep, setOnboardingStep,
    requestEmailOtp, verifyEmailOtp, signInWithGoogle, signInWithGithub, completeOnboarding, updateProfile, signOut, refreshProfile } = useAuth();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [stage, setStage] = useState<"details" | "otp">("details");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [college, setCollege] = useState(user?.college || "");
  const [course, setCourse] = useState(user?.course || "");
  const [year, setYear] = useState(user?.year || "");
  const [otp, setOtp] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sentTo, setSentTo] = useState("");
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const nodes = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]');
      if (!nodes?.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const run = async (action: () => Promise<AuthResult>) => {
    setPending(true); setError(null);
    try {
      const result = await action();
      if (!result.success) setError(result.error || "Please try again.");
      return result;
    } finally { setPending(false); }
  };

  const sendCode = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (pending || cooldown > 0) return;
    const input: OtpRequest = mode === "signup"
      ? { mode, email: email.trim(), firstName, lastName, phone }
      : { mode, email: email.trim() };
    const parsed = requestOtpSchema.safeParse(input);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    const result = await run(() => requestEmailOtp(parsed.data));
    if (result?.success) {
      setSentTo(parsed.data.email); setStage("otp"); setOtp("");
      setCooldown(result.retryAfter || 60);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await run(() => verifyEmailOtp(sentTo, otp));
    if (result?.success) { setStage("details"); setOtp(""); onSuccess?.(); }
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = basicProfileSchema.safeParse({ firstName, lastName, phone });
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    const payload = { ...parsed.data, college, course, year };
    const result = await run(() => onboardingStep === "edit" ? updateProfile(payload) : completeOnboarding(payload));
    if (result?.success) onSuccess?.();
  };

  if (!isOpen) return null;
  const profileView = Boolean(user) && (onboardingStep === "profile" || onboardingStep === "edit");
  const portfolio = Boolean(user) && !profileView;
  const ready = configured === true && !isLoading;
  const title = profileView ? "Make it yours." : portfolio ? "Your Enigma account." : stage === "otp" ? "Check your inbox." : mode === "signup" ? "Your next challenge starts here." : "Good to see you again.";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[#03060c]/90 p-3 backdrop-blur-xl sm:p-6">
      <div aria-hidden="true" className="absolute inset-0" onClick={onClose} />
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="enigma-auth-title" tabIndex={-1}
        className="relative my-auto grid w-full max-w-[920px] overflow-hidden rounded-[28px] border border-white/15 bg-[#0b101b] shadow-[0_30px_100px_rgba(0,0,0,0.7)] outline-none md:grid-cols-[0.8fr_1.2fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-[#0b1624] p-8 md:flex">
          <div aria-hidden="true" className="absolute -left-20 top-12 h-72 w-72 rounded-full border border-cyan-300/25 shadow-[0_0_90px_rgba(34,211,238,0.12)]" />
          <div aria-hidden="true" className="absolute -left-8 top-24 h-48 w-48 rounded-full border border-cyan-300/15" />
          <div className="relative">
            <span className="font-display text-2xl font-bold tracking-wider text-white">ENIGMA <span className="text-amber-300">2.0</span></span>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">Department of Computer Science<br />University of Mumbai</p>
          </div>
          <div className="relative my-16 space-y-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200"><ShieldCheck size={25} /></div>
            <h2 className="text-3xl font-semibold leading-tight text-white">One account.<br />Every possibility.</h2>
            <p className="text-sm leading-relaxed text-slate-300">Your place to discover events, manage your details, and follow your registration journey.</p>
          </div>
          <div className="relative flex items-center gap-2 text-xs text-slate-400"><LockKeyhole size={14} /> Your details stay in your control.</div>
        </aside>
        <section className="max-h-[88dvh] overflow-y-auto p-6 sm:p-9">
          <div className="mb-7 flex items-center justify-between gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-200">{user ? "Student account" : "Welcome to Enigma"}</span>
            <button type="button" onClick={onClose} aria-label="Close sign-in" className="rounded-full border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X size={18} /></button>
          </div>
          <h2 id="enigma-auth-title" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
          {!user && <p className="mt-3 text-sm leading-relaxed text-slate-400">{stage === "otp" ? "Enter the six-digit code sent to " + sentTo + ". Never share your code." : "Continue with an existing account or verify your email. No password to remember."}</p>}
          {initialMessage && <p className="mt-3 text-sm text-slate-300">{initialMessage}</p>}
          {(error || authError) && <p role="alert" className="mt-5 rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-200">{error || authError}</p>}
          {!user && configured === false && <p role="status" className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">Sign-in is being connected. Please check back shortly.</p>}

          {!user && stage === "details" && <>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button disabled={pending || !ready} type="button" onClick={() => void run(signInWithGoogle)} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-3 text-sm text-white hover:bg-white/5 disabled:opacity-50"><span aria-hidden="true" className="font-bold text-cyan-200">G</span> Google</button>
              <button disabled={pending || !ready} type="button" onClick={() => void run(signInWithGithub)} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-3 text-sm text-white hover:bg-white/5 disabled:opacity-50"><Github size={17} /> GitHub</button>
            </div>
            <div className="my-5 flex items-center gap-3 text-xs text-slate-500"><div className="h-px flex-1 bg-white/10" />or continue with email<div className="h-px flex-1 bg-white/10" /></div>
            <div className="mb-5 flex gap-5 border-b border-white/10" role="group" aria-label="Account action">
              {(["signup", "signin"] as const).map((value) => <button key={value} type="button" disabled={pending} aria-pressed={mode === value} onClick={() => { setMode(value); setError(null); }} className={"border-b-2 pb-2 text-sm " + (mode === value ? "border-cyan-300 text-white" : "border-transparent text-slate-400")}>{value === "signup" ? "Create account" : "Sign in"}</button>)}
            </div>
            <form onSubmit={sendCode} className="space-y-4">
              {mode === "signup" && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs text-slate-300"><span>First name</span><input className={fieldClass} autoComplete="given-name" required maxLength={80} value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={pending} /></label>
                <label className="space-y-1.5 text-xs text-slate-300"><span>Last name</span><input className={fieldClass} autoComplete="family-name" required maxLength={80} value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={pending} /></label>
              </div>}
              <label className="block space-y-1.5 text-xs text-slate-300"><span>Email address</span><input className={fieldClass} type="email" autoComplete="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} disabled={pending} /></label>
              {mode === "signup" && <label className="block space-y-1.5 text-xs text-slate-300"><span>Phone number</span><input className={fieldClass} type="tel" autoComplete="tel" required maxLength={30} placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={pending} /><span className="block text-[11px] text-slate-500">For event updates. Verify your email to continue.</span></label>}
              <button className={buttonClass} disabled={pending || !ready || cooldown > 0} type="submit">{pending ? <LoaderCircle size={17} className="animate-spin" /> : <Mail size={17} />}{pending ? "Connecting…" : cooldown > 0 ? "Request another code in " + cooldown + "s" : "Send verification code"}</button>
            </form>
          </>}

          {!user && stage === "otp" && <form onSubmit={verifyCode} className="mt-6 space-y-5">
            <label className="block space-y-2 text-xs text-slate-300"><span>Verification code</span><input className={fieldClass + " text-center text-2xl tracking-[0.35em]"} autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} disabled={pending} /></label>
            <button type="submit" disabled={pending || otp.length !== 6} className={buttonClass}>{pending ? <LoaderCircle className="animate-spin" size={17} /> : <ShieldCheck size={17} />}Verify & continue</button>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <button type="button" disabled={pending} className="flex items-center gap-1 text-slate-300 hover:text-white" onClick={() => { setStage("details"); setOtp(""); setError(null); }}><ArrowLeft size={13} />Change details</button>
              <button type="button" disabled={pending || cooldown > 0} className="text-cyan-200 disabled:text-slate-500" onClick={() => void sendCode()}>{cooldown ? "Resend in " + cooldown + "s" : "Resend code"}</button>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">Check spam or junk too. If you haven’t created an account yet, go back and choose Create account.</p>
          </form>}

          {profileView && <form onSubmit={saveProfile} className="mt-6 space-y-4">
            <p className="text-sm text-slate-400">Complete your profile once. We reuse these details for every event; check that they are accurate.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs text-slate-300"><span>First name</span><input className={fieldClass} required maxLength={80} autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></label>
              <label className="space-y-1.5 text-xs text-slate-300"><span>Last name</span><input className={fieldClass} required maxLength={80} autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} /></label>
            </div>
            <p className="flex items-center gap-2 text-sm text-emerald-200"><CheckCircle2 size={15} />Email verified: {user?.email}</p>
            <label className="block space-y-1.5 text-xs text-slate-300"><span>Phone number</span><input className={fieldClass} required type="tel" autoComplete="tel" maxLength={30} value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            <details open className="rounded-xl border border-white/10 p-3 text-sm text-slate-300">
              <summary className="cursor-pointer">College & course</summary>
              <div className="mt-4 space-y-3">
                <label className="block space-y-1.5 text-xs"><span>College</span><input className={fieldClass} required placeholder="Enter the full name of your college" autoComplete="organization" maxLength={200} value={college} onChange={(e) => setCollege(e.target.value)} /></label>
                <label className="block space-y-1.5 text-xs"><span>Course</span><input className={fieldClass} required placeholder="Enter your course, e.g. B.Sc. Computer Science" maxLength={120} value={course} onChange={(e) => setCourse(e.target.value)} /></label>
                <label className="block space-y-1.5 text-xs"><span>Study year</span><select className={fieldClass} value={year} onChange={(e) => setYear(e.target.value)}><option value="" className="bg-slate-900">Choose your year</option>{ACADEMIC_YEARS.map((item) => <option key={item} value={item} className="bg-slate-900">{item}</option>)}</select></label>
              </div>
            </details>
            <p className="text-xs text-slate-400">Enter your college and course as shown on your college ID. Upload the ID before registering for an event.</p>
            <DocumentUpload kind="id" label={user?.hasIdCard ? "Replace college ID card (optional)" : "Upload college ID card"} onUploaded={async () => { await refreshProfile(); }} />
            <button type="submit" disabled={pending} className={buttonClass}>{pending ? <LoaderCircle className="animate-spin" size={17} /> : <ArrowRight size={17} />}Save profile</button>
            {onboardingStep === "edit" && <button type="button" disabled={pending} className="w-full text-sm text-slate-400" onClick={() => setOnboardingStep("portfolio")}>Cancel</button>}
          </form>}

          {portfolio && user && <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xl font-semibold text-white">{user.name || "Welcome to Enigma"}</p>
              <p className="mt-2 flex items-center gap-2 break-all text-sm text-emerald-200"><CheckCircle2 size={15} className="shrink-0" />{user.email}</p>
              <p className="mt-2 text-sm text-slate-400">{user.phone || "Add your phone number"}</p>
              {user.college && <p className="mt-3 text-sm text-slate-300">{user.college}</p>}
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 p-4 text-sm text-slate-300"><Ticket size={19} className="text-cyan-200" />{myRegistrations.length ? myRegistrations.length + " event registrations" : "No event registrations yet."}</div>
            <p className="text-xs leading-relaxed text-slate-400">{user.isRegistrationReady ? "Your profile is ready for event registration." : "Before registering, add your college, course and college ID in Edit profile."}</p>
            <RegistrationList />
            <button type="button" className={buttonClass} onClick={() => { setError(null); setOnboardingStep("edit"); }}>Edit profile<ArrowRight size={16} /></button>
            <button type="button" disabled={pending} onClick={() => void run(async () => { const result = await signOut(); if (result.success) { setStage("details"); setEmail(""); setPhone(""); setFirstName(""); setLastName(""); } return result; })} className="flex w-full items-center justify-center gap-2 text-sm text-slate-400 hover:text-white"><LogOut size={15} />Sign out</button>
          </div>}
          <div className="mt-7 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-500">Need help? <a href="tel:+918828069553" className="text-slate-300 underline underline-offset-4">Contact the organising team</a>.</div>
        </section>
      </div>
    </div>
  );
}
