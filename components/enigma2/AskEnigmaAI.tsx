import Image from "next/image";

const prompt = "Read https://enigmaudcs.in and give me a concise overview of Enigma 2.0, the official Techfest of the Department of Computer Science, University of Mumbai. Summarise its events, eligibility, date, venue, entry fees, prize pool and registration process using the latest information available on the website. Link to the official website and do not guess any missing details.";
const query = encodeURIComponent(prompt);
const providers = [
  { name: "ChatGPT", href: `https://chatgpt.com/?q=${query}`, logo: "openai" },
  { name: "Claude", href: `https://claude.ai/new?q=${query}`, logo: "claude" },
  { name: "Perplexity", href: `https://www.perplexity.ai/search?q=${query}`, logo: "perplexity" },
  { name: "Google AI Mode", href: `https://www.google.com/search?udm=50&q=${query}`, logo: "gemini" },
];
export default function AskEnigmaAI() {
  return <section aria-labelledby="ask-enigma-ai" className="mt-5 w-fit min-w-[220px] border-t border-white/15 pt-5">
    <h3 id="ask-enigma-ai" className="text-xs font-normal text-slate-400">Ask AI for a summary of Enigma 2.0</h3>
    <div className="mt-3 flex items-center gap-3">{providers.map(({name,href,logo}) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Ask ${name} about Enigma 2.0 (opens in a new tab)`} title={`Ask ${name}`} className="flex h-9 w-9 items-center justify-center rounded-lg opacity-65 transition hover:bg-white/5 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"><Image src={`/images/ai/${logo}.svg`} width={23} height={23} alt="" aria-hidden="true" className="brightness-0 invert" /></a>)}</div>
  </section>;
}
