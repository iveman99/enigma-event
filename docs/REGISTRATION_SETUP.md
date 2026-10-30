# Enigma 2.0 registration and organiser desk

## One-time database setup

Run `supabase/migrations/202610300001_registrations.sql` in your existing project's
Supabase SQL Editor, after the signup migration. Run the whole file once. It creates
private storage, the payment settings, registrations, review audit and organiser roles.
Registrations start CLOSED. No additional Vercel environment variables are needed.

## Add the three organisers when their emails are ready

1. Each organiser must sign in normally on the festival website first, verifying email.
2. In SQL Editor, run `supabase/setup-organisers.sql` after the three named accounts
   have signed in with verified email. Check that all three are returned.
3. Sign in with one of those accounts and open `/enigma2/terminal`.
4. To revoke an organiser, delete only that user's row from `public.organisers`
   in Supabase Table Editor. The next dashboard request will be refused.

Student-editable metadata never grants organiser access. There is no shared admin
password and no role-management button that can accidentally promote a participant.
An organiser cannot approve their own entry. Another organiser must review it.

## Open payment collection when the official QR is ready

In Organiser desk → Payment & events:

- Enter the official payee name and UPI ID.
- Upload the official QR image (JPG, PNG or WebP, maximum 1 MB).
- Select which competitions accept entries.
- Select Open registrations and save. Test that the QR scans to the intended UPI ID
  and that the name displayed by the payment app matches the official payee.
- Close all registrations or individual events with the same controls when needed.

Prices are set by the server/database: ₹99 solo, ₹149 for a whole team.
Compile The Vibes accepts 1–3 people; Decode The Hunt 2–3; the other two are solo.
The Arcade exhibition is not part of this payment workflow.

## Daily review

Review entries shows awaiting payments first. Search by name/email/team/reference
or filter by event/status. Open an entry, view the receipt and college ID, and check
the actual credit in the official UPI/bank account. Verify amount and reference.

- Approve payment: requires the review checkbox. Creates a unique confirmed pass.
- Request correction: requires a clear student-facing reason. The student can
  correct the entry and resubmit without creating another registration.
- A screenshot by itself is not evidence that money arrived.
- A second simultaneous reviewer receives a conflict rather than overwriting a decision.
- Completed decisions are not editable; reconcile exceptional refund/cancellation
  cases with the event owner. No automated refunds or bank integration are implemented.

Students see decisions and review messages in My registrations; the open portal
refreshes every 30 seconds and on focus. This is in-portal confirmation, not an
automatic email notification. Email OTP delivery remains configured in Supabase/Brevo.

Export list downloads the currently filtered entries as CSV. Keep exports private.
Recent activity records submissions, resubmissions, decisions and setting changes.
The list supports up to 2,000 entries (400 students × 4 events is 1,600).

## Files and operations

Images are validated/decoded, stripped of metadata and recompressed as JPEG up to
320 KiB (input limit: 1 MB). The bucket is private, with no student/anonymous storage policies. Reviewers
receive links valid for two minutes. Student profiles contain a path, never a public
ID-card URL. Uploads are limited to 12 attempts per account per day.

Students registering for all four events can upload five files each. At the
320 KiB storage ceiling, 400 students × five images is about 625 MiB before replacements. Monitor Supabase Storage usage, especially
on the free tier. Replaced IDs, abandoned receipts and old review evidence remain
private; review retention and remove unreferenced objects using the Storage API after
the event/dispute period. Do not delete referenced files or remove storage metadata
directly through SQL. Agree a retention/deletion policy before opening registrations.

Operational checks before accepting real payments:

1. Database migration succeeded; all three organiser accounts are assigned.
2. Student cannot load organiser API, another student's entries or private files.
3. A controlled paid entry is reviewed against the bank/UPI record, approved by a
   different organiser and appears confirmed in the student's account after refresh.
4. Correction/resubmission works and reusing an already-used transaction is refused.
5. Official QR, payee, fee, cancellation/refund instructions and storage quota checked.

Automated PostgreSQL tests cover role restrictions, ownership, fee calculation,
duplicates, approval conflicts, self-review, audit and correction/resubmission.
Local tests cannot confirm a real bank credit or substitute for the live payment test.
