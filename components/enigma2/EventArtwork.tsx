import { Code2, EyeOff, Compass, Gamepad2 } from "lucide-react";
const motifs = {
  "compile-vibes": { label: "BUILD / CREATE / SHIP", word: "BUILD", Icon: Code2, color: "#67e8f9", glow: "rgba(34,211,238,.18)" },
  "blind-dates": { label: "SCREEN OFF. LOGIC ON.", word: "CODE", Icon: EyeOff, color: "#f0abfc", glow: "rgba(217,70,239,.18)" },
  "decode-hunt": { label: "FOLLOW THE NEXT CLUE", word: "SEEK", Icon: Compass, color: "#c4b5fd", glow: "rgba(139,92,246,.20)" },
  "fifa-addicts": { label: "ONE MATCH AT A TIME", word: "PLAY", Icon: Gamepad2, color: "#86efac", glow: "rgba(34,197,94,.18)" },
};
export default function EventArtwork({eventId}: {eventId:string}) {
 const m=motifs[eventId as keyof typeof motifs] || motifs["compile-vibes"];
 return <div aria-hidden="true" className="eg-artwork" style={{color:m.color,background:`radial-gradient(ellipse at center,${m.glow},transparent 70%)`}}>
 <div className="eg-orbit eg-orbit-one"/><div className="eg-orbit eg-orbit-two"/>
 <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 520 460" fill="none"><path d="M35 105H170L200 75H455M35 350H150L180 380H455" stroke="currentColor" strokeWidth="1"/><path d="M80 65V395M440 65V395" stroke="currentColor" strokeDasharray="3 12"/><circle cx="80" cy="105" r="5" fill="currentColor"/><circle cx="440" cy="380" r="5" fill="currentColor"/>{eventId==="fifa-addicts"?<><rect x="130" y="130" width="260" height="200" rx="5" stroke="currentColor"/><path d="M260 130V330M130 180H170V280H130M390 180H350V280H390" stroke="currentColor"/><circle cx="260" cy="230" r="45" stroke="currentColor"/></>:eventId==="decode-hunt"?<><path d="M140 300L210 140L320 300L380 170" stroke="currentColor" strokeWidth="2" strokeDasharray="7 8"/>{[[140,300],[210,140],[320,300],[380,170]].map(([x,y])=><circle key={x} cx={x} cy={y} r="13" stroke="currentColor"/>)}</>:<><rect x="120" y="120" width="280" height="210" rx="12" stroke="currentColor"/><path d="M120 160H400M155 195H225M155 225H200M170 255H265M155 285H230" stroke="currentColor" strokeWidth="2"/><circle cx="144" cy="141" r="3" fill="currentColor"/><circle cx="158" cy="141" r="3" fill="currentColor"/></>}</svg>
 <div className="relative z-10 flex flex-col items-center gap-5"><span className="rounded-2xl border border-current/20 bg-[#07121f]/80 p-6 shadow-2xl"><m.Icon size={64} strokeWidth={1}/></span><span className="font-display text-5xl font-black tracking-[.2em] sm:text-6xl">{m.word}</span></div>
 <span className="absolute bottom-7 left-0 right-0 text-center font-mono text-[10px] tracking-[.25em]">{m.label}</span></div>;
}
