create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null default 'percent',
  discount_value numeric not null default 100,
  is_active boolean default true,
  max_uses integer null,
  used_count integer default 0,
  expires_at timestamptz null,
  created_at timestamptz default now()
);

create table if not exists public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  coupon_code text not null,
  discount_amount numeric default 0,
  original_amount numeric default 0,
  final_amount numeric default 0,
  redeemed_at timestamptz default now()
);

create table if not exists public.cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  resume_id uuid references public.resumes(id) on delete set null,
  title text default 'Untitled Cover Letter',
  company_name text,
  target_job_title text,
  hiring_manager_name text,
  tone text,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.coupons enable row level security;
alter table public.coupon_redemptions enable row level security;
alter table public.cover_letters enable row level security;

drop policy if exists "Coupons are readable" on public.coupons;
drop policy if exists "Users read own coupon redemptions" on public.coupon_redemptions;
drop policy if exists "Users create own coupon redemptions" on public.coupon_redemptions;
drop policy if exists "Users manage own cover letters" on public.cover_letters;

create policy "Coupons are readable" on public.coupons for select using (is_active = true);
create policy "Users read own coupon redemptions" on public.coupon_redemptions for select using (auth.uid() = user_id);
create policy "Users create own coupon redemptions" on public.coupon_redemptions for insert with check (auth.uid() = user_id);
create policy "Users manage own cover letters" on public.cover_letters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.coupons (code, discount_type, discount_value, is_active)
values ('THAMEEMAR', 'percent', 100, true)
on conflict (code) do update set discount_type = excluded.discount_type, discount_value = excluded.discount_value, is_active = excluded.is_active;

create or replace function public.increment_coupon_usage(coupon_code_input text)
returns void
language plpgsql
security definer
as $$
begin
  update public.coupons
  set used_count = used_count + 1
  where upper(code) = upper(coupon_code_input);
end;
$$;
