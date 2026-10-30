import type { Metadata } from "next";
import Link from "next/link";
import InformationLayout from "@/components/legal/InformationLayout";

export const metadata: Metadata = {
  title: "Terms of Use | Enigma 2.0 | UDCS",
  description: "Student account and website usage terms for the Enigma UDCS techfest service.",
  alternates: { canonical: "https://www.enigmaudcs.in/terms" },
};

export default function TermsOfUse() {
  return <InformationLayout title="Terms of use" summary="These terms describe use of the Enigma website and student account service operated by the organising team at the Department of Computer Science, University of Mumbai.">
    <section><h2>Student accounts</h2><p>Provide accurate information, use an email address you control and keep your verification codes private. Do not impersonate another student, share an account to bypass participation rules or attempt to access another person’s information.</p><p>Google and GitHub are optional sign-in services. Your use of those services is also governed by their own terms. We do not ask for your provider password on the Enigma website.</p></section>
    <section><h2>Participation and registration</h2><p>An account alone does not confirm entry to an event, payment, eligibility, team membership or an approved pass. Event registration, document review and payment approval are being developed separately. Follow the event-specific rules and confirmation process when registration becomes available.</p><p>Review any published fee, cancellation and refund information before making a payment. These account terms do not introduce a fee or a refund policy.</p></section>
    <section><h2>Acceptable use</h2><p>Do not submit malicious content, misuse OTP delivery, disrupt the website, automate abusive requests or attempt to bypass access controls. The organising team may restrict account access while investigating misuse. Contact us if you believe access was restricted in error.</p></section>
    <section><h2>Availability and changes</h2><p>The account service is under development and may be interrupted for maintenance, provider outages or updates. Event information may change; consult the organising team’s current notices for confirmed arrangements. Contact the team if a website issue affects your ability to participate.</p></section>
    <section><h2>Privacy and contact</h2><p>Our <Link href="/privacy">privacy policy</Link> explains how information is handled. For support, corrections or account deletion requests, contact <a href="mailto:info.veman99@gmail.com">info.veman99@gmail.com</a>. See <Link href="/account-information">about student accounts</Link> for a description of the service.</p></section>
  </InformationLayout>;
}
