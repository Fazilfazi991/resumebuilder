create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  plan text not null default 'free' check (plan in ('free', 'premium', 'lifetime', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.templates (
  id text primary key,
  name text not null,
  category text not null,
  description text not null default '',
  preview_image_url text,
  is_premium boolean not null default false,
  is_active boolean not null default true,
  layout_type text not null default 'single-column',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Resume',
  slug text not null,
  template_id text not null references public.templates(id),
  resume_data jsonb not null default '{}'::jsonb,
  section_order jsonb not null default '[]'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid not null references public.resumes(id) on delete cascade,
  template_id text not null references public.templates(id),
  downloaded_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_payment_id text not null unique,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null,
  status text not null,
  plan text not null,
  created_at timestamptz not null default now()
);

create index if not exists resumes_user_id_updated_at_idx on public.resumes(user_id, updated_at desc);
create index if not exists downloads_user_id_downloaded_at_idx on public.downloads(user_id, downloaded_at desc);
create index if not exists payments_user_id_created_at_idx on public.payments(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists resumes_set_updated_at on public.resumes;
create trigger resumes_set_updated_at
before update on public.resumes
for each row execute function public.set_updated_at();

drop trigger if exists templates_set_updated_at on public.templates;
create trigger templates_set_updated_at
before update on public.templates
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid() and plan = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.templates enable row level security;
alter table public.downloads enable row level security;
alter table public.payments enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (user_id = auth.uid() or public.is_admin());

create policy "profiles_update_own" on public.profiles
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "resumes_select_own_or_public" on public.resumes
for select using (user_id = auth.uid() or is_public or public.is_admin());

create policy "resumes_insert_own" on public.resumes
for insert with check (user_id = auth.uid());

create policy "resumes_update_own" on public.resumes
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "resumes_delete_own" on public.resumes
for delete using (user_id = auth.uid() or public.is_admin());

create policy "templates_read_active" on public.templates
for select using (is_active or public.is_admin());

create policy "templates_admin_insert" on public.templates
for insert with check (public.is_admin());

create policy "templates_admin_update" on public.templates
for update using (public.is_admin()) with check (public.is_admin());

create policy "templates_admin_delete" on public.templates
for delete using (public.is_admin());

create policy "downloads_select_own" on public.downloads
for select using (user_id = auth.uid() or public.is_admin());

create policy "downloads_insert_own" on public.downloads
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.resumes
    where id = resume_id and user_id = auth.uid()
  )
);

create policy "payments_select_own" on public.payments
for select using (user_id = auth.uid() or public.is_admin());

insert into public.templates (id, name, category, description, is_premium, is_active, layout_type)
values
  ('classic-ats', 'Classic ATS', 'ATS', 'Simple single-column resume for corporate applications.', false, true, 'single-column'),
  ('modern-minimal', 'Modern Minimal', 'Modern', 'Clean professional layout with a subtle accent color.', false, true, 'single-column'),
  ('uae-professional', 'UAE Professional', 'UAE', 'Two-column profile-friendly resume for UAE hiring standards.', true, true, 'two-column'),
  ('executive-pro', 'Executive Pro', 'Executive', 'Leadership-focused layout for senior professionals.', true, true, 'single-column'),
  ('fresh-graduate', 'Fresh Graduate', 'Freshers', 'Education and projects-first template for new applicants.', false, true, 'single-column'),
  ('tech-resume', 'Tech Resume', 'Tech', 'Skills-heavy template for engineers and technical roles.', true, true, 'single-column'),
  ('sales-resume', 'Sales Resume', 'Sales', 'Metrics-led resume for business development and sales roles.', true, true, 'single-column'),
  ('creative-designer', 'Creative Designer', 'Creative', 'Portfolio-friendly design for creative professionals.', true, true, 'two-column'),
  ('elegant-two-column', 'Elegant Two Column', 'Modern', 'Premium two-column layout with refined spacing.', true, true, 'two-column'),
  ('simple-one-page', 'Simple One Page', 'ATS', 'Compact one-page format optimized for scanning.', false, true, 'single-column')
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  is_premium = excluded.is_premium,
  is_active = excluded.is_active,
  layout_type = excluded.layout_type;
