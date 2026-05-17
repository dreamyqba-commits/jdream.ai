-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.users               enable row level security;
alter table public.subscriptions        enable row level security;
alter table public.credits_transactions enable row level security;
alter table public.generations          enable row level security;
alter table public.models               enable row level security;
alter table public.templates            enable row level security;
alter table public.webhooks_log         enable row level security;

-- users: read/update own row
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- subscriptions: own only
create policy "subs_select_own" on public.subscriptions for select using (auth.uid() = user_id);

-- credits: own only
create policy "credits_select_own" on public.credits_transactions for select using (auth.uid() = user_id);

-- generations: own only
create policy "gen_select_own" on public.generations for select using (auth.uid() = user_id);
create policy "gen_insert_own" on public.generations for insert with check (auth.uid() = user_id);
create policy "gen_update_own" on public.generations for update using (auth.uid() = user_id);

-- models: public read-only
create policy "models_public_read" on public.models for select using (enabled = true);

-- templates: public read-only (enabled only)
create policy "templates_public_read" on public.templates for select using (enabled = true);

-- webhooks_log: service role only (no user-facing policy)
