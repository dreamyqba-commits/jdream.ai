-- ============================================================
-- Jdream.ai · Initial Schema
-- Run: supabase db push
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── users ────────────────────────────────────────────────────
create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null unique,
  name         text,
  avatar_url   text,
  plan         text not null default 'free' check (plan in ('free','lite','pro','premium')),
  credits_balance integer not null default 0 check (credits_balance >= 0),
  locale       text not null default 'en',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── subscriptions ────────────────────────────────────────────
create table public.subscriptions (
  id                       uuid primary key default uuid_generate_v4(),
  user_id                  uuid not null references public.users(id) on delete cascade,
  plan                     text not null check (plan in ('lite','pro','premium')),
  billing_cycle            text not null check (billing_cycle in ('monthly','yearly')),
  status                   text not null default 'active' check (status in ('active','canceled','past_due','expired')),
  current_period_start     timestamptz not null,
  current_period_end       timestamptz not null,
  creem_subscription_id    text unique,
  dodo_subscription_id     text unique,
  canceled_at              timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ── credits_transactions ─────────────────────────────────────
create table public.credits_transactions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  delta      integer not null,  -- positive = add, negative = deduct
  reason     text not null,     -- 'signup_bonus','subscription','generation_deduct','generation_refund','purchase'
  ref_type   text,              -- 'generation','subscription','purchase'
  ref_id     uuid,
  created_at timestamptz not null default now(),
  unique (user_id, ref_type, ref_id, reason)  -- prevent duplicate credits
);

-- ── models ───────────────────────────────────────────────────
create table public.models (
  id                  uuid primary key default uuid_generate_v4(),
  code                text not null unique,             -- e.g. 'kling-2.5-turbo'
  name                text not null,
  type                text not null check (type in ('video','image')),
  tier                text not null check (tier in ('fast','standard','cinematic')),
  provider            text not null,                   -- 'piapi','fal','grsai'
  provider_model_id   text not null,
  credits_per_second  integer not null default 15,
  default_seconds     integer not null default 5,
  max_seconds         integer not null default 10,
  enabled             boolean not null default true,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now()
);

-- ── generations ──────────────────────────────────────────────
create table public.generations (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.users(id) on delete cascade,
  model_id         uuid not null references public.models(id),
  prompt           text not null,
  duration_seconds integer not null default 5,
  aspect_ratio     text not null default '16:9',
  status           text not null default 'pending'
                   check (status in ('pending','processing','success','failed','deleted')),
  provider_job_id  text,
  asset_url        text,
  r2_key           text,
  credits_spent    integer not null default 0,
  cost_usd         numeric(10,4) not null default 0,
  error_message    text,
  created_at       timestamptz not null default now(),
  completed_at     timestamptz,
  updated_at       timestamptz not null default now()
);

-- ── templates ────────────────────────────────────────────────
create table public.templates (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique,
  title           text not null,
  prompt_template text not null,
  cover_url       text,
  model_id        uuid references public.models(id),
  locale          text not null default 'en',
  enabled         boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ── webhooks_log ─────────────────────────────────────────────
create table public.webhooks_log (
  id           uuid primary key default uuid_generate_v4(),
  event_id     text not null unique,
  source       text not null,   -- 'creem','dodo','piapi','fal'
  payload      jsonb not null,
  processed_at timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────
create index idx_generations_user_id   on public.generations(user_id, created_at desc);
create index idx_generations_status    on public.generations(status) where status = 'pending';
create index idx_credits_user_id       on public.credits_transactions(user_id, created_at desc);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_models_enabled        on public.models(enabled, type, tier);

-- ── updated_at triggers ──────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

create trigger trg_generations_updated_at
  before update on public.generations
  for each row execute function update_updated_at();

create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function update_updated_at();
