-- The Longevity Agent — Initial Schema
-- Run via: supabase db push (after linking project)
-- Or paste into Supabase SQL editor

-- ────────────────────────────────────────
-- Users (extends Supabase auth.users)
-- ────────────────────────────────────────
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  dob date,
  state char(2),
  gender text check (gender in ('men', 'women')),
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- ────────────────────────────────────────
-- Intake records
-- ────────────────────────────────────────
create table if not exists public.intake_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete cascade,
  product_slug text not null,
  current_meds text,
  conditions text,
  allergies text,
  goals text,
  stripe_session_id text,
  status text not null default 'pending_review'
    check (status in ('pending_review', 'approved', 'declined', 'needs_info')),
  physician_notes text,
  reviewed_at timestamptz,
  reviewed_by text, -- physician ID or name
  created_at timestamptz default now()
);

alter table public.intake_records enable row level security;

create policy "Users can view own intake records"
  on public.intake_records for select
  using (auth.uid() = user_id);

-- Admin/physician can view all (set up via service role key in API)

-- ────────────────────────────────────────
-- Subscriptions
-- ────────────────────────────────────────
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete cascade,
  product_slug text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null default 'active'
    check (status in ('active', 'paused', 'cancelled', 'past_due', 'pending')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ────────────────────────────────────────
-- Physician review queue (admin-only access)
-- ────────────────────────────────────────
create table if not exists public.physician_queue (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid references public.intake_records(id) on delete cascade,
  user_id uuid references public.user_profiles(id),
  product_slug text not null,
  priority int default 0, -- 0=normal, 1=high
  assigned_to text, -- physician email
  status text not null default 'queued'
    check (status in ('queued', 'in_review', 'completed')),
  created_at timestamptz default now()
);

-- No RLS — only accessible via service role key from API routes

-- ────────────────────────────────────────
-- Triggers: auto-update updated_at
-- ────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_user_profiles_updated
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();

create trigger on_subscriptions_updated
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- ────────────────────────────────────────
-- Trigger: new user → create profile
-- ────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
