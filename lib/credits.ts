import type { Model } from "./supabase/types";

export function calcCredits(model: Model, durationSeconds: number): number {
  return model.credits_per_second * durationSeconds;
}

// Rough cost in USD based on observed API pricing (kept conservative)
const COST_PER_CREDIT_USD = 0.002;

export function calcCostUsd(credits: number): number {
  return credits * COST_PER_CREDIT_USD;
}

export const PLAN_MONTHLY_CREDITS: Record<string, number> = {
  free: 10,
  lite: 100,
  pro: 500,
  premium: 2000,
};

export const PLAN_CONCURRENT_LIMIT: Record<string, number> = {
  free: 1,
  lite: 2,
  pro: 3,
  premium: 5,
};
