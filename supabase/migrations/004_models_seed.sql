-- ============================================================
-- Models Seed Data  — 5 video + 3 image
-- ============================================================

insert into public.models
  (code, name, type, tier, provider, provider_model_id, credits_per_second, default_seconds, max_seconds, sort_order)
values
  -- ── Video · Fast ────────────────────────────────────────
  ('seedance-2-fast', 'Seedance 2 Fast', 'video', 'fast',
   'piapi', 'seedance-2-fast', 5, 5, 10, 10),

  -- ── Video · Standard ────────────────────────────────────
  ('kling-2.5-turbo', 'Kling 2.5 Turbo', 'video', 'standard',
   'piapi', 'kling-2.5-turbo', 15, 5, 10, 20),

  ('runway-gen3-alpha', 'Runway Gen-3 Alpha', 'video', 'standard',
   'fal',  'fal-ai/runway-gen3/alpha/turbo', 15, 5, 10, 21),

  ('pika-2.0', 'Pika 2.0', 'video', 'standard',
   'piapi', 'pika-2.0', 15, 5, 10, 22),

  -- ── Video · Cinematic ───────────────────────────────────
  ('veo-3.1-fast', 'Veo 3.1 Fast', 'video', 'cinematic',
   'fal',  'fal-ai/google/veo3', 25, 8, 20, 30),

  -- ── Image ───────────────────────────────────────────────
  ('flux-1.1-pro', 'FLUX 1.1 Pro', 'image', 'standard',
   'fal',  'fal-ai/flux/schnell', 8, 1, 1, 40),

  ('midjourney-v7', 'Midjourney v7', 'image', 'cinematic',
   'piapi', 'midjourney', 20, 1, 1, 41),

  ('stable-diffusion-3.5', 'Stable Diffusion 3.5', 'image', 'fast',
   'fal',  'fal-ai/stable-diffusion-v3-medium', 5, 1, 1, 42);
