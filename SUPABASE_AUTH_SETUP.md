# Resumi Supabase Auth setup

Canonical production origin: `https://www.resumi.live`

Supabase Authentication → URL Configuration:

```text
Site URL: https://www.resumi.live

Redirect URLs:
https://www.resumi.live/auth/confirm
https://www.resumi.live/auth/callback
http://127.0.0.1:3000/auth/confirm
http://127.0.0.1:3000/auth/callback
http://localhost:3000/auth/confirm
http://localhost:3000/auth/callback
```

Production environment:

```text
NEXT_PUBLIC_SITE_URL=https://www.resumi.live
```

Local development may use `http://127.0.0.1:3000` or `http://localhost:3000`.

For the Google provider, consent-screen branding, the exact Supabase callback, and the browser verification gate, follow [docs/google-auth-configuration.md](docs/google-auth-configuration.md).

Never commit OAuth secrets, the Supabase service-role key, or any other private credential.
