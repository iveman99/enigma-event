"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/authContext";
import Enigma2AuthModal from "./Enigma2AuthModal";
import Enigma2RegistrationModal from "./Enigma2RegistrationModal";
export default function EventRegistrationEntry({eventId,title}: {eventId:string;title:string}) { return <AuthProvider><Entry eventId={eventId} title={title}/></AuthProvider>; }
function Entry({eventId,title}: {eventId:string;title:string}) {
 const {user,myRegistrations,isLoading,openProfile,showAuthModal,setShowAuthModal,onboardingStep} = useAuth();
 const [register,setRegister] = useState(false);
 useEffect(() => {
  if (!user?.isRegistrationReady || (showAuthModal && ["profile","edit"].includes(onboardingStep))) return;
  const pending=sessionStorage.getItem("enigma-registration-event");
  if(pending!==eventId) return;
  const frame=requestAnimationFrame(() => {sessionStorage.removeItem("enigma-registration-event");setShowAuthModal(false);setRegister(true);});
  return () => cancelAnimationFrame(frame);
 },[user,eventId,showAuthModal,onboardingStep,setShowAuthModal]);
 const existing=myRegistrations.find(entry=>entry.event_id===eventId && entry.status!=="rejected");
 const begin=()=>{if(user?.isRegistrationReady){setRegister(true);return;}sessionStorage.setItem("enigma-registration-event",eventId);openProfile(user?"edit":"choice");};
 if(existing) return <div className="rounded-2xl border border-cyan-200/20 bg-cyan-200/5 p-5"><p className="font-semibold">{existing.status === "approved" ? "Your entry is confirmed" : existing.status === "archived" ? "Registration cancelled" : "Your payment is being reviewed"}</p><Link href="/enigma2/passes" className="mt-3 inline-block text-sm text-cyan-200">View your registration →</Link></div>;
 return <><button disabled={isLoading} onClick={begin} className="w-full rounded-full bg-cyan-200 px-7 py-4 font-semibold text-[#071421] transition hover:bg-white disabled:opacity-50">{isLoading?"Checking your account…": "Register for this event →"}</button><p className="mt-3 text-center text-xs text-slate-400">{user?.isRegistrationReady ? "Your saved profile will be used." : "Sign in, confirm your details, then register."}</p><Enigma2AuthModal isOpen={showAuthModal} initialMessage={`Continue to ${title}.`} onClose={()=>{sessionStorage.removeItem("enigma-registration-event");setShowAuthModal(false);}}/><Enigma2RegistrationModal isOpen={register} preselectedEventId={eventId} onClose={()=>setRegister(false)} onOpenAuth={()=>openProfile("choice")}/></>;
}
