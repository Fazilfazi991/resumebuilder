-- Allow an authenticated user to create their own fallback profile row.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert to authenticated
with check (user_id = (select auth.uid()) and plan = 'free');

-- Resume sharing is not part of the current product. Keep reads owner/admin only.
drop policy if exists "resumes_select_own_or_public" on public.resumes;
drop policy if exists "resumes_select_own" on public.resumes;
create policy "resumes_select_own" on public.resumes
for select using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Contact messages are written by the server service role and visible only to admins.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'spam')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

alter table public.contact_messages enable row level security;
drop policy if exists "contact_messages_admin_select" on public.contact_messages;
create policy "contact_messages_admin_select" on public.contact_messages
for select using ((select public.is_admin()));

create index if not exists contact_messages_created_at_idx on public.contact_messages(created_at desc);

-- Keep short-lived, pseudonymous counters so the public contact action can be
-- throttled consistently across serverless instances without storing IP addresses.
create table if not exists public.contact_submission_limits (
  fingerprint_type text not null check (fingerprint_type in ('email', 'network')),
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz not null default now(),
  submission_count integer not null default 0 check (submission_count >= 0),
  last_seen_at timestamptz not null default now(),
  primary key (fingerprint_type, fingerprint)
);

alter table public.contact_submission_limits enable row level security;
create index if not exists contact_submission_limits_last_seen_at_idx
on public.contact_submission_limits(last_seen_at);

-- Only the server-side service role may call this function. SECURITY INVOKER
-- keeps the function at the caller's privilege level; no elevated bypass is
-- needed. The function owns the atomic rate-limit check and message insert so
-- concurrent requests cannot race past the limit.
create or replace function public.submit_contact_message(
  contact_name text,
  contact_email text,
  contact_subject text,
  contact_message text,
  email_fingerprint text,
  network_fingerprint text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_time timestamptz := clock_timestamp();
  email_count integer;
  network_count integer;
begin
  if email_fingerprint !~ '^[a-f0-9]{64}$'
    or network_fingerprint !~ '^[a-f0-9]{64}$' then
    raise exception 'INVALID_CONTACT_FINGERPRINT' using errcode = '22023';
  end if;

  delete from public.contact_submission_limits
  where last_seen_at < current_time - interval '24 hours';

  insert into public.contact_submission_limits as limits (
    fingerprint_type,
    fingerprint,
    window_started_at,
    submission_count,
    last_seen_at
  ) values (
    'email',
    email_fingerprint,
    current_time,
    1,
    current_time
  )
  on conflict (fingerprint_type, fingerprint) do update set
    window_started_at = case
      when limits.window_started_at <= current_time - interval '15 minutes' then current_time
      else limits.window_started_at
    end,
    submission_count = case
      when limits.window_started_at <= current_time - interval '15 minutes' then 1
      else limits.submission_count + 1
    end,
    last_seen_at = current_time
  returning submission_count into email_count;

  insert into public.contact_submission_limits as limits (
    fingerprint_type,
    fingerprint,
    window_started_at,
    submission_count,
    last_seen_at
  ) values (
    'network',
    network_fingerprint,
    current_time,
    1,
    current_time
  )
  on conflict (fingerprint_type, fingerprint) do update set
    window_started_at = case
      when limits.window_started_at <= current_time - interval '15 minutes' then current_time
      else limits.window_started_at
    end,
    submission_count = case
      when limits.window_started_at <= current_time - interval '15 minutes' then 1
      else limits.submission_count + 1
    end,
    last_seen_at = current_time
  returning submission_count into network_count;

  if email_count > 3 or network_count > 5 then
    raise exception 'CONTACT_RATE_LIMITED' using errcode = 'P0001';
  end if;

  insert into public.contact_messages (name, email, subject, message, status)
  values (contact_name, contact_email, contact_subject, contact_message, 'new');
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text, text, text) from public;
revoke all on function public.submit_contact_message(text, text, text, text, text, text) from anon;
revoke all on function public.submit_contact_message(text, text, text, text, text, text) from authenticated;
grant execute on function public.submit_contact_message(text, text, text, text, text, text) to service_role;
