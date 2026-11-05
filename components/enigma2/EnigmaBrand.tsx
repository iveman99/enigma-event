import Image from "next/image";
/** Official compact lockup: University of Mumbai · Enigma 2.0 · UDCS. */
export default function EnigmaBrand({ compact = false, badge = false }: { compact?: boolean; badge?: boolean }) {
  return <span className={`eg-brand ${compact ? "eg-brand-compact" : ""} ${badge ? "eg-brand-badge" : ""}`}>
    <Image src="/images/logo-mu.png" alt="University of Mumbai" width={32} height={40} className="eg-brand-mu" />
    <span className="eg-brand-wordmark">ENIGMA<span className="eg-brand-edition">2.0</span></span>
    <Image src="/images/logo-udcs-clean.png" alt="Department of Computer Science" width={35} height={35} className="eg-brand-udcs" />
  </span>;
}
