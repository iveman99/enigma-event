"use client";
import { AuthProvider } from "@/lib/authContext";

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
