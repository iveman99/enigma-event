import { z } from "zod";

export const COMPETITIONS = [
  { id: "compile-vibes", title: "Compile The Vibes", min: 1, max: 3 },
  { id: "blind-dates", title: "Blind Date with Code", min: 1, max: 1 },
  { id: "decode-hunt", title: "Decode The Hunt", min: 2, max: 3 },
  { id: "fifa-addicts", title: "FIFA Addicts", min: 1, max: 1 },
] as const;
export const registrationSchema = z.object({
  eventId: z.enum(["compile-vibes", "blind-dates", "decode-hunt", "fifa-addicts"]),
  teamName: z.string().trim().max(80),
  members: z.array(z.object({ name: z.string().trim().min(2).max(160), email: z.email().max(254).transform(v => v.toLowerCase()), phone: z.string().trim().regex(/^\+[1-9][0-9]{7,14}$/, "Enter a phone number with country code, such as +919876543210."), college: z.string().trim().min(2).max(200) }).strict()).max(2),
  receiptPath: z.string().max(200),
  transactionReference: z.string().trim().regex(/^[a-zA-Z0-9-]{6,50}$/, "Enter the transaction reference / UTR from your payment app."),
  profileConfirmed: z.literal(true),
}).strict().superRefine((value, ctx) => {
  const event = COMPETITIONS.find(e => e.id === value.eventId)!;
  const size = value.members.length + 1;
  if (size < event.min || size > event.max) ctx.addIssue({ code: "custom", message: `This event needs ${event.min === event.max ? event.min : `${event.min}–${event.max}`} participants, including you.` });
  if (size > 1 && value.teamName.length < 2) ctx.addIssue({ code: "custom", message: "Please enter a team name." });
  if (new Set(value.members.map(m => m.email)).size !== value.members.length) ctx.addIssue({ code: "custom", message: "Each teammate needs a different email." });
});
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type PaymentStatus = "pending" | "approved" | "rejected" | "archived";
export interface EventRegistration {
  id: string; event_id: string; event_title: string; team_name: string; members: Array<{name: string; email: string; phone?: string; college: string}>;
  participant: { name: string; email: string; phone: string; college: string; course: string };
  amount: number; status: PaymentStatus; ticket_code: string | null; review_note: string;
  created_at: string; updated_at: string; version: number; transaction_reference: string;
  receipt_path: string; id_card_path: string;
}
export interface PaymentSettings { enabled: boolean; payee: string; upiId: string; qrUrl: string | null; qrPath?: string; events: string[] }
export const statusLabel = { pending: "Verifying payment", approved: "Registration confirmed", rejected: "Action needed", archived: "Registration cancelled" };
export function entryFee(size: number) { return size > 1 ? 149 : 99; }
export function ownsUpload(path: string, userId: string, kind: "id" | "receipt") {
  return new RegExp(`^${userId}/${kind}/[a-f0-9-]{36}\\.jpg$`).test(path);
}
