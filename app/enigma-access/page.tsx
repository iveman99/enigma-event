import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasPreviewAccess, previewToken, PREVIEW_COOKIE } from "@/lib/previewAccess";

export const metadata: Metadata = {
  title: "Enigma | Private Preview",
  robots: { index: false, follow: false },
};

async function unlockPreview(formData: FormData) {
  "use server";
  const token = previewToken(String(formData.get("password") || ""));
  if (!hasPreviewAccess(token)) redirect("/enigma-access?error=1");

  (await cookies()).set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  redirect("/enigma2");
}

export default async function EnigmaAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#07080b] px-6 text-white">
      <section className="w-full max-w-sm rounded-2xl border border-cyan-400/25 bg-white/5 p-8 shadow-xl">
        <h1 className="font-display text-2xl font-bold tracking-wider">ENIGMA</h1>
        <p className="mt-3 text-sm text-gray-400">Enter the password to view this private preview.</p>
        <form action={unlockPreview} className="mt-6 space-y-4">
          <label htmlFor="password" className="block text-sm">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className="w-full rounded-lg border border-white/20 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400" />
          {error && <p role="alert" className="text-sm text-red-300">Incorrect password. Please try again.</p>}
          <button type="submit" className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-black hover:bg-cyan-300">Continue</button>
        </form>
      </section>
    </main>
  );
}
