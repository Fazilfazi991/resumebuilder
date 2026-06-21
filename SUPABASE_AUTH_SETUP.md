# Resumi Supabase Auth Setup

This app now supports the Supabase `token_hash` confirmation flow at `/auth/confirm`.

## 1. URL Configuration

In Supabase Dashboard:

Authentication -> URL Configuration

Set Site URL:

```txt
https://resumi.live
```

Add Redirect URLs:

```txt
https://resumi.live/auth/confirm
https://resumi.live/auth/callback
https://resumi.live/dashboard
https://resumi.live/login
http://127.0.0.1:3000/auth/confirm
http://127.0.0.1:3000/auth/callback
http://127.0.0.1:3000/dashboard
http://127.0.0.1:3000/login
```

## 2. Environment Variables

Production:

```txt
NEXT_PUBLIC_SITE_URL=https://resumi.live
```

Local:

```txt
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
```

## 3. Confirm Signup Email Template

In Supabase Dashboard:

Authentication -> Email Templates -> Confirm signup

Use this confirmation link format:

```txt
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard
```

Subject:

```txt
Confirm your Resumi account
```

HTML:

```html
<h2>Confirm your Resumi account</h2>
<p>Welcome to Resumi. Click below to confirm your email and start building your resume.</p>
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard">Confirm my account</a>
<p>If you did not create this account, you can ignore this email.</p>
```

## 4. Custom SMTP Branding

To send emails from your own domain:

Authentication -> Settings -> SMTP Settings

Enable Custom SMTP and add your SMTP provider credentials.

Recommended providers:

```txt
Resend
Zoho Mail
Brevo
SendGrid
Postmark
AWS SES
Google Workspace SMTP
```

Set:

```txt
From name: Resumi
From email: noreply@yourdomain.com
```

Example:

```txt
Resumi <noreply@resumi.live>
```

## 5. Testing

Local:

```txt
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
```

Production:

```txt
NEXT_PUBLIC_SITE_URL=https://resumi.live
```

After signup, the confirmation email should point to `/auth/confirm`, verify the account, and redirect to `/dashboard`.
