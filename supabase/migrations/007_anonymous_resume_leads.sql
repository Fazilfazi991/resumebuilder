create table if not exists public.anonymous_resumes (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  resume_data jsonb not null default '{}'::jsonb,
  template_id text,
  progress integer not null default 0,
  ats_score integer not null default 0,
  source text not null default 'builder',
  status text not null default 'draft',
  user_email text,
  user_phone text,
  user_name text,
  downloaded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  user_agent text,
  device_type text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_country text
);

alter table public.anonymous_resumes enable row level security;

drop policy if exists "admins can read anonymous resumes" on public.anonymous_resumes;
create policy "admins can read anonymous resumes"
  on public.anonymous_resumes
  for select
  using (public.is_admin());

drop policy if exists "admins can delete anonymous resumes" on public.anonymous_resumes;
create policy "admins can delete anonymous resumes"
  on public.anonymous_resumes
  for delete
  using (public.is_admin());

create index if not exists anonymous_resumes_status_idx on public.anonymous_resumes(status);
create index if not exists anonymous_resumes_progress_idx on public.anonymous_resumes(progress);
create index if not exists anonymous_resumes_last_seen_at_idx on public.anonymous_resumes(last_seen_at desc);
