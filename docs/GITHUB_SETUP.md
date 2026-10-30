# GitHub sign-in for Enigma

Create an OAuth App at https://github.com/settings/developers → OAuth Apps → New OAuth App.
This setup uses Supabase's GitHub OAuth provider.

| Field | Value |
| --- | --- |
| Application name | Enigma 2.0 \| UDCS |
| Homepage URL | https://www.enigmaudcs.in |
| Description | Student sign-in for Enigma, the techfest of the Department of Computer Science, University of Mumbai. |
| Authorization callback URL | https://bgesqvxynfsokqyhebyo.supabase.co/auth/v1/callback |

Leave **Enable Device Flow** unchecked. Register the application.
Upload the supplied square UDCS PNG if an app-logo field is available.

Copy the Client ID, then generate a new client secret. Store the secret privately.
In Supabase → Authentication → Sign In / Providers → GitHub:

1. Enable GitHub.
2. Paste the GitHub Client ID and Client secret into their corresponding fields.
3. Save. Never paste the secret into chat, commit it or put it in browser code.

The Google client ID/secret must remain in Google's provider settings. Each provider
has its own credentials, even though both use the same Supabase callback URL.

Supabase's URL configuration should retain:

- Site URL: https://www.enigmaudcs.in
- Allowed return: http://localhost:3000/api/auth/callback
- Allowed return: https://www.enigmaudcs.in/api/auth/callback

The hosted Supabase callback also serves localhost tests. Do not use the website's
/api/auth/callback as GitHub's Authorization callback URL.

No webhook, repository permission or installation on a repository is needed for
this sign-in flow. Complete the consent screen yourself during testing and check
that it requests only the identity/email access needed for login.

After saving, tell us GitHub is configured. We will verify provider readiness and
test sign-in, cancellation, missing profile fields and session persistence.

References:
- https://supabase.com/docs/guides/auth/social-sign-in/auth-github
- https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
