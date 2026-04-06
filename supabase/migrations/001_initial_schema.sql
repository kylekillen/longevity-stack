-- The Longevity Agent — Initial Schema
-- Uses 'la' schema to avoid conflicts with other projects on the same Supabase instance
-- Run via Supabase SQL editor at:
-- https://supabase.com/dashboard/project/rrxrfmywhaprjbusmqhv/editor

-- ────────────────────────────────────────
-- Schema
-- ────────────────────────────────────────
create schema if not exists la;

-- ────────────────────────────────────────
-- Users
-- ────────────────────────────────────────
create table if not exists la.user_profiles (
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

alter table la.user_profiles enable row level security;

create policy "la_users_select_own"
  on la.user_profiles for select
  using (auth.uid() = id);

create policy "la_users_update_own"
  on la.user_profiles for update
  using (auth.uid() = id);

-- ────────────────────────────────────────
-- Intake records
-- ────────────────────────────────────────
create table if not exists la.intake_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references la.user_profiles(id) on delete cascade,
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
  reviewed_by text,
  created_at timestamptz default now()
);

alter table la.intake_records enable row level security;

create policy "la_intake_select_own"
  on la.intake_records for select
  using (auth.uid() = user_id);

-- ────────────────────────────────────────
-- Subscriptions
-- ────────────────────────────────────────
create table if not exists la.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references la.user_profiles(id) on delete cascade,
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

alter table la.subscriptions enable row level security;

create policy "la_subscriptions_select_own"
  on la.subscriptions for select
  using (auth.uid() = user_id);

-- ────────────────────────────────────────
-- Physician review queue (service role only)
-- ────────────────────────────────────────
create table if not exists la.physician_queue (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid references la.intake_records(id) on delete cascade,
  user_id uuid references la.user_profiles(id),
  product_slug text not null,
  priority int default 0,
  assigned_to text,
  status text not null default 'queued'
    check (status in ('queued', 'in_review', 'completed')),
  created_at timestamptz default now()
);

-- No RLS — service role only

-- ────────────────────────────────────────
-- Triggers
-- ────────────────────────────────────────
create or replace function la.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger la_user_profiles_updated
  before update on la.user_profiles
  for each row execute function la.handle_updated_at();

create trigger la_subscriptions_updated
  before update on la.subscriptions
  for each row execute function la.handle_updated_at();

-- New auth user → create la.user_profiles entry
-- Note: this coexists with limen's trigger on auth.users for public.user_profiles
create or replace function la.handle_new_user()
returns trigger as $$
begin
  insert into la.user_profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Only create trigger if not already exists
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'la_on_auth_user_created'
  ) then
    create trigger la_on_auth_user_created
      after insert on auth.users
      for each row execute function la.handle_new_user();
  end if;
end;
$$;
