# Enigma signup setup

This phase implements verified signup/sign-in and persistent profiles. Event
uploads, payments, reviewer roles and approved passes are the next phase.
The old JSON registration and backup APIs are deliberately closed: they must
not expose sample/private records or issue confirmed passes to real accounts.

## 1. Supabase project

Create one Free project at https://supabase.com/dashboard, preferably in Mumbai
if available. Save the database password privately. It is not needed by the app.

In **Project Settings → API Keys**, locate the publishable key and secret key;
find the project URL in the project's Connect/API settings. Legacy `anon` and
`service_role` keys can serve the corresponding roles if using a legacy project.

Add these names to `.env.local` without replacing other settings:

```dotenv
APP_URL=http://localhost:3000
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key
```

Use `.env.example` as the reference. Never paste secret keys into chat or commit
them. None of these variables should use a `NEXT_PUBLIC_` prefix. The secret
key is used only by the backend's shared rate-limit function; student data
operations use the publishable client with the verified user's session and RLS.

Open **SQL Editor**, paste the complete contents of
`supabase/migrations/202610290001_signup.sql`, and run it once. It creates profile
tables, an auth-user trigger, ownership policies and atomic OTP rate limits.
An error rolls the migration back. Do not rerun a successfully applied migration.
Alternatively use the Supabase CLI migration workflow against the intended project.

## 2. Authentication settings

Under **Authentication → URL Configuration** set:

- Site URL: `https://www.enigmaudcs.in`
- Additional redirect URLs (exact paths, no broad production wildcard):
  - `https://www.enigmaudcs.in/api/auth/callback`
  - `http://localhost:3000/api/auth/callback`

Under the Email provider settings:

- Enable Email and allow new signups.
- Keep **Confirm email** enabled. Disable anonymous and phone signup for this phase.
- Use a six-digit email OTP and set expiry to **300 seconds / 5 minutes**.
- The template text does not enforce expiry: save **300 seconds** in Supabase's Email OTP expiration setting as well.
- Keep the resend interval at least **60 seconds**.
- Copy `supabase/templates/email-otp.html` into both **Confirm signup** and
  **Magic Link** email templates. Subject: `Your Enigma 2.0 verification code`.
  The `{{ .Token }}` placeholder is essential; do not replace it with a magic link.
  Use the same subject for both templates, without brackets or emoji.
  The branded header uses the public image at
  `https://www.enigmaudcs.in/images/enigma-email-header-v3.jpg`.
  The code remains selectable HTML text; no email font download is required.

Review **Authentication → Rate Limits** after connecting SMTP: custom SMTP
initially has a 30-emails/hour limit, and there are separate per-IP sign-in and
verification limits. Requests originate from the app server in this architecture,
so test campus/shared-IP bursts and tune these controls before public signup.
Do not exceed Brevo's account allowance. The app also enforces persistent
per-email and per-IP controls and rejects cross-origin submissions.

## 3. Brevo email delivery

1. Create a Free account at https://www.brevo.com and finish its sender/account
   approval process. Ensure transactional sending is activated.
2. Add and authenticate a sending domain or subdomain you control, for example
   `mail.enigmaudcs.in`. Add the exact DNS records Brevo provides at your DNS host.
   Do not replace unrelated domain/MX records. Wait for its verification to pass.
3. Create a sender, such as `Enigma` with an address on that authenticated domain.
4. Open **SMTP & API → SMTP** and create an **SMTP key**. This is not the Brevo
   API key and not your Brevo account password.
5. In **Supabase Authentication → Email → SMTP settings** enable custom SMTP:

| Setting | Value |
| --- | --- |
| Host | `smtp-relay.brevo.com` (confirm against your Brevo dashboard) |
| Port | `587` |
| Username | The SMTP login shown in Brevo |
| Password | The generated Brevo SMTP key |
| Sender email | Your verified sender address |
| Sender name | `Enigma 2.0 \| UDCS` |

Brevo credentials belong in Supabase, not in this app's environment variables.
Supabase generates, expires and verifies the OTP; Brevo only delivers the email.
Free Brevo has 300 total emails/day and email branding. Failed delivery, provider
approval or exhausted daily quota is not bypassed by this code. Test actual
inbox/spam delivery before launch. Supabase's default email sender is for testing
team addresses only, not public signup.

## 4. Google

Use https://console.cloud.google.com or Google Auth Platform. Create/select a
project and configure branding/audience with the event name and a real support
address. Create an **OAuth client ID → Web application**.

Use the callback URL shown by **Supabase Authentication → Sign In / Providers →
Google** as the Google client's authorised redirect URI. For a standard project:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

This is the provider callback; it is different from this app's
`/api/auth/callback`. Supabase handles the provider exchange, then returns to
the app's allowed redirect URL using PKCE.

Paste the Google client ID and client secret into the **Supabase Google provider**
and enable it. These credentials do not belong in `.env.local`. Use only the
basic identity/email/profile permissions needed for login. Add test users while
the Google app is in Testing. Before public registration, complete Google's
audience/publishing requirements so applicants are not restricted to test users.
Do not enable options that skip email verification.

## 5. GitHub

At https://github.com/settings/developers create an **OAuth App**, not a GitHub App.

- Application name: `Enigma UDCS`
- Homepage: `https://www.enigmaudcs.in`
- Authorisation callback: the callback shown by Supabase's GitHub provider,
  normally `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`.

Generate a client secret and enter the client ID and secret in **Supabase
Authentication → Sign In / Providers → GitHub**. Enable GitHub. Do not request
repository access. These secrets stay in Supabase, not in the app or chat.

## 6. Vercel and local preview

The new Supabase SDK requires Node 22 or newer. This project standardises on
**Node 24** (`package.json` and `.nvmrc`). Use Node 24 locally and in Vercel.

In Vercel's project settings, add `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SECRET_KEY` and `APP_URL`. For production, APP_URL must be
`https://www.enigmaudcs.in`. Development uses `http://localhost:3000`.
Arbitrary preview domains are intentionally not trusted callback destinations.
Keep provider environments and URL allowlists consistent before testing them.

Restart local development after changing `.env.local`; redeploy when Vercel
production settings change. Enigma 2.0 is public at `/enigma2`; the old
`/enigma-access` address redirects there without a password. The unfinished
organiser terminal is unavailable. Authentication, ownership checks and API
permissions remain enforced independently of access to the festival page.

## 7. Validation before activation

```sh
npm run auth:check
npm test
npm run build
npm run dev
```

The config check reports only missing/configured values, never their contents.
Local automated tests cover validation, OTP failure/success handling, provider
callbacks, session requirements, ownership rules and real PostgreSQL RLS via
PGlite. External Supabase/Google/GitHub/Brevo services are mocked in route tests.

After the accounts are connected, verify these live journeys:

1. Sign up with a real inbox → receive code → wrong code rejected → correct code
   accepted → profile persists after reload → sign out → sign in again.
2. Resend cooldown, expired code, reused code, excessive attempts and email
   delivery failure. Do not send test messages to other people's addresses.
3. Google and GitHub success/cancel flows in separate browser sessions. Confirm
   a verified email exists and missing names/phone are requested, not invented.
4. Two student accounts cannot read/update each other's profiles. Forged old
   `enigma_session` cookies and localStorage profiles do not sign anyone in.
5. Two tabs stay consistent after signout and focus; expired sessions refresh.
6. No unverified account, seed registration or fake confirmed pass is displayed.

Daily signup spikes must stay inside provider quotas. The Free Supabase project
may pause after a week of inactivity; check availability before opening signup.
This phase does not claim that live delivery/OAuth have passed without credentials.

## References

- Supabase SSR: https://supabase.com/docs/guides/auth/server-side/creating-a-client
- Email OTP: https://supabase.com/docs/guides/auth/auth-email-passwordless
- SMTP: https://supabase.com/docs/guides/auth/auth-smtp
- Google: https://supabase.com/docs/guides/auth/social-sign-in/auth-google
- GitHub: https://supabase.com/docs/guides/auth/social-sign-in/auth-github
- Brevo SMTP: https://developers.brevo.com/docs/smtp-integration
