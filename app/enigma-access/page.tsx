import { permanentRedirect } from "next/navigation";

// Preserve old footer/bookmark links after opening the festival to everyone.
export default function EnigmaAccessPage() {
  permanentRedirect("/enigma2");
}
