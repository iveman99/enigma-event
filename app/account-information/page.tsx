import type { Metadata } from "next";
import Link from "next/link";
import InformationLayout from "@/components/legal/InformationLayout";

export const metadata: Metadata = {
  title: "Enigma 2.0 | UDCS — Student Accounts",
  description: "How student accounts, verified sign-in and registration preparation work for Enigma 2.0, the UDCS techfest at the University of Mumbai.",
  alternates: { canonical: "https://www.enigmaudcs.in/account-information" },
};

export default function AccountInformation() {
  return <InformationLayout title="Your Enigma student account" summary="Enigma is the techfest organised by the Department of Computer Science, University of Mumbai. Our student account service supports verified sign-in and preparation for event registration.">
    <section><h2>What this application does</h2><p>Students can create an account, verify their email, save their name and contact number, and add optional college details. The Enigma organising team operates this service to support participation in the festival.</p><p>The account service is currently being developed. Event registration, college ID uploads, payment evidence and organiser approval will be introduced separately. Creating an account does not reserve a place, confirm a payment or issue an event pass.</p></section>
    <section><h2>How you can sign in</h2><ul><li>Email: enter your details and verify a one-time code sent to your inbox.</li><li>Google: use your Google account to verify your identity and email.</li><li>GitHub: use your GitHub account when this option is enabled.</li></ul><p>Social sign-in is provided through Supabase. Google or GitHub may show our Supabase project address during authentication. We do not ask for your Google or GitHub password on the Enigma website.</p></section>
    <section><h2>The information we use</h2><p>We use your verified email for account access and your name and phone number for participation-related contact. Your phone number is not verified by SMS. College, course and study-year details can be added to your profile. There is no profile-photo upload requirement.</p><p>Read our <Link href="/privacy">privacy policy</Link> for the information processed by the website and its service providers, and our <Link href="/terms">terms of use</Link> for account rules.</p></section>
    <section><h2>Contact and account help</h2><p>For sign-in assistance, profile corrections or account deletion requests, contact the organising team at <a href="mailto:info.veman99@gmail.com">info.veman99@gmail.com</a>. Use the email associated with your account where possible. Never send us your password or a verification code.</p><p><Link href="/">Visit the Enigma festival website</Link>.</p></section>
  </InformationLayout>;
}
