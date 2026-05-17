-- Simple helper used by billing webhooks to top-up credits
create or replace function add_credits(
  p_user_id uuid,
  p_delta   integer
) returns void language sql security definer as $$
  update public.users
  set credits_balance = credits_balance + p_delta
  where id = p_user_id;
$$;
