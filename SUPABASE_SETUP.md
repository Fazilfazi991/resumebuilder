# Supabase Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Add the project URL and anon key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it through a `NEXT_PUBLIC_` variable.

4. Open the Supabase SQL editor and run:

```txt
supabase/migrations/001_initial_schema.sql
```

5. In Supabase Authentication settings:

- Set the site URL to `http://127.0.0.1:3000` for local development.
- Add `http://127.0.0.1:3000/auth/callback` as a redirect URL.
- Enable email/password authentication.

6. Restart the Next.js dev server after creating `.env.local`.

The proxy protects portal routes only when Supabase keys are configured. Without keys, the mock frontend remains accessible for local UI work.
