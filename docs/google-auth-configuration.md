# Resumi Google Sign-In configuration

This checklist covers the external configuration required by the Google OAuth code in Resumi. Do not commit client secrets to this repository or expose them through `NEXT_PUBLIC_*` variables.

## Current production status

The Supabase project is `eudbwabaaszztfywgfvi`. During the September 14, 2026 audit, Google was disabled and the Auth Site URL and redirect allow list still used the bare `https://resumi.live` origin. The application code is ready, but Google Sign-In is not considered verified until the settings below are completed and a real browser round trip succeeds.

## Google Cloud consent screen

- [ ] App name: `Resumi`
- [ ] Homepage: `https://www.resumi.live`
- [ ] Privacy Policy: `https://www.resumi.live/privacy-policy`
- [ ] Terms of Use: `https://www.resumi.live/terms`
- [ ] Authorized domain: `resumi.live`
- [ ] Upload `public/brand/resumi-app-icon.png` as the square app icon where Google requests it.
- [ ] Request only the authentication identity scopes `openid`, `email`, and `profile`.
- [ ] Complete Google verification or publishing requirements that apply to the selected user type.

## Google OAuth client

Create a Web application OAuth client.

- [ ] Authorized JavaScript origin: `https://www.resumi.live`
- [ ] Authorized redirect URI: `https://eudbwabaaszztfywgfvi.supabase.co/auth/v1/callback`

The Google redirect URI above is Supabase's provider callback for the configured Resumi project. Google redirects there first; Supabase then redirects the browser to Resumi's application callback.

For local development, add these only if the local OAuth client and Supabase redirect allow list require them:

- JavaScript origin: `http://127.0.0.1:3000`
- JavaScript origin: `http://localhost:3000`
- Application callback: `http://127.0.0.1:3000/auth/callback`
- Application callback: `http://localhost:3000/auth/callback`

Do not replace the Google authorized redirect URI with a local Resumi callback. Google must use the Supabase `/auth/v1/callback` URI.

## Supabase provider

In Supabase Dashboard, open Authentication → Sign In / Providers → Google.

- [ ] Enable Google.
- [ ] Paste the Google OAuth client ID.
- [ ] Paste the Google OAuth client secret into Supabase only.
- [ ] Save the provider configuration.

In Authentication → URL Configuration:

- [ ] Site URL: `https://www.resumi.live`
- [ ] Add `https://www.resumi.live/auth/callback`.
- [ ] Add `https://www.resumi.live/auth/confirm`.
- [ ] Keep the two local callbacks above for development when needed.
- [ ] Remove stale bare-domain entries after confirming the `www` deployment and email templates are live.

Production environment:

```text
NEXT_PUBLIC_SITE_URL=https://www.resumi.live
```

## Verification gate

- [ ] New Google user reaches the intended safe `next` path and receives one free profile row.
- [ ] Existing Google user does not receive a duplicate profile.
- [ ] Cancelled or failed OAuth returns a friendly Resumi error.
- [ ] Refresh keeps the session.
- [ ] Protected direct navigation redirects to sign-in, then returns to the requested internal path.
- [ ] Logout and Google relogin succeed.
- [ ] An external or backslash-based `next` value never redirects off Resumi.
- [ ] Browser bundles contain no Google client secret or Supabase service-role key.

Google Sign-In remains a release blocker until every runtime item above passes in a real browser.
