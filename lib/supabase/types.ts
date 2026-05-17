export type Plan = "free" | "lite" | "pro" | "premium";
export type ModelType = "video" | "image";
export type ModelTier = "fast" | "standard" | "cinematic";
export type GenerationStatus = "pending" | "processing" | "success" | "failed" | "deleted";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "expired";

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  plan: Plan;
  credits_balance: number;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: Exclude<Plan, "free">;
  billing_cycle: "monthly" | "yearly";
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  creem_subscription_id: string | null;
  dodo_subscription_id: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditsTransaction {
  id: string;
  user_id: string;
  delta: number;
  reason: string;
  ref_type: string | null;
  ref_id: string | null;
  created_at: string;
}

export interface Model {
  id: string;
  code: string;
  name: string;
  type: ModelType;
  tier: ModelTier;
  provider: string;
  provider_model_id: string;
  credits_per_second: number;
  default_seconds: number;
  max_seconds: number;
  enabled: boolean;
  sort_order: number;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  model_id: string;
  prompt: string;
  duration_seconds: number;
  aspect_ratio: string;
  status: GenerationStatus;
  provider_job_id: string | null;
  asset_url: string | null;
  r2_key: string | null;
  credits_spent: number;
  cost_usd: string;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
  updated_at: string;
  model?: Model;
}

export interface Template {
  id: string;
  slug: string;
  title: string;
  prompt_template: string;
  cover_url: string | null;
  model_id: string | null;
  locale: string;
  enabled: boolean;
  created_at: string;
}

export interface WebhookLog {
  id: string;
  event_id: string;
  source: string;
  payload: Record<string, unknown>;
  processed_at: string;
}
