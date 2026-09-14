-- Allow an authenticated user to create their own fallback profile row.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert to authenticated
with check (user_id = auth.uid() and plan = 'free');

-- Resume sharing is not part of the current product. Keep reads owner/admin only.
drop policy if exists "resumes_select_own_or_public" on public.resumes;
drop policy if exists "resumes_select_own" on public.resumes;
create policy "resumes_select_own" on public.resumes
for select using (user_id = auth.uid() or public.is_admin());

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
for select using (public.is_admin());

create index if not exists contact_messages_created_at_idx on public.contact_messages(created_at desc);

-- Profile photos contain personal data. Store them privately and enforce owner access.
update storage.buckets set public = false where id = 'resume-photos';
drop policy if exists "resume_photos_public_read" on storage.objects;
drop policy if exists "resume_photos_owner_read" on storage.objects;
create policy "resume_photos_owner_read"
on storage.objects for select to authenticated
using (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
