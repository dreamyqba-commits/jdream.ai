-- ============================================================
-- Postgres RPC Functions
-- ============================================================

-- ── create_generation_atomic ─────────────────────────────────
-- Atomically: check balance → deduct credits → insert generation row
-- Returns generation id or raises exception
create or replace function create_generation_atomic(
  p_user_id        uuid,
  p_model_id       uuid,
  p_prompt         text,
  p_duration_secs  integer,
  p_aspect_ratio   text,
  p_credits        integer,
  p_cost_usd       numeric
) returns uuid language plpgsql security definer as $$
declare
  v_balance integer;
  v_gen_id  uuid;
begin
  -- Lock the user row for update
  select credits_balance into v_balance
  from public.users
  where id = p_user_id
  for update;

  if v_balance < p_credits then
    raise exception 'INSUFFICIENT_CREDITS' using errcode = 'P0001';
  end if;

  -- Deduct
  update public.users
  set credits_balance = credits_balance - p_credits
  where id = p_user_id;

  -- Log transaction
  insert into public.credits_transactions(user_id, delta, reason, ref_type)
  values (p_user_id, -p_credits, 'generation_deduct', 'generation');

  -- Create generation record
  insert into public.generations(
    user_id, model_id, prompt, duration_seconds, aspect_ratio,
    credits_spent, cost_usd, status
  ) values (
    p_user_id, p_model_id, p_prompt, p_duration_secs, p_aspect_ratio,
    p_credits, p_cost_usd, 'pending'
  ) returning id into v_gen_id;

  -- Update transaction ref_id
  update public.credits_transactions
  set ref_id = v_gen_id
  where user_id = p_user_id and ref_type = 'generation' and ref_id is null
  order by created_at desc limit 1;

  return v_gen_id;
end;
$$;

-- ── refund_generation ────────────────────────────────────────
-- Idempotent refund: unique constraint on (user_id, ref_type, ref_id, reason) prevents double refund
create or replace function refund_generation(
  p_generation_id uuid
) returns void language plpgsql security definer as $$
declare
  v_user_id uuid;
  v_credits integer;
begin
  select user_id, credits_spent into v_user_id, v_credits
  from public.generations
  where id = p_generation_id and status in ('failed','pending');

  if not found then return; end if;

  -- Insert refund (unique index prevents duplicate)
  begin
    insert into public.credits_transactions(user_id, delta, reason, ref_type, ref_id)
    values (v_user_id, v_credits, 'generation_refund', 'generation', p_generation_id);
  exception when unique_violation then
    return; -- already refunded
  end;

  update public.users
  set credits_balance = credits_balance + v_credits
  where id = v_user_id;
end;
$$;

-- ── grant_signup_credits ─────────────────────────────────────
create or replace function grant_signup_credits(
  p_user_id uuid,
  p_credits integer default 50
) returns void language plpgsql security definer as $$
begin
  begin
    insert into public.credits_transactions(user_id, delta, reason)
    values (p_user_id, p_credits, 'signup_bonus');
  exception when unique_violation then
    return;
  end;

  update public.users
  set credits_balance = credits_balance + p_credits
  where id = p_user_id;
end;
$$;
