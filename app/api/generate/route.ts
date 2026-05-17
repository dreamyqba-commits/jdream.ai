import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getProvider, getFallbackProvider, recordFailure, recordSuccess } from "@/lib/providers";
import { calcCredits, calcCostUsd, PLAN_CONCURRENT_LIMIT } from "@/lib/credits";

const schema = z.object({
  modelCode: z.string(),
  prompt: z.string().min(1).max(2000),
  durationSeconds: z.number().int().min(1).max(20),
  aspectRatio: z.string().default("16:9"),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { modelCode, prompt, durationSeconds, aspectRatio } = parsed.data;
  const service = await createServiceClient();

  // Fetch model
  const { data: model } = await service
    .from("models")
    .select("*")
    .eq("code", modelCode)
    .eq("enabled", true)
    .single();
  if (!model) return NextResponse.json({ error: "Model not found" }, { status: 404 });

  // Fetch user for plan + concurrency check
  const { data: userData } = await service
    .from("users")
    .select("plan, credits_balance")
    .eq("id", user.id)
    .single();
  if (!userData) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Concurrency limit
  const { count } = await service
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .in("status", ["pending", "processing"]);

  const limit = PLAN_CONCURRENT_LIMIT[userData.plan] ?? 1;
  if ((count ?? 0) >= limit) {
    return NextResponse.json({ error: "Too many concurrent generations" }, { status: 429 });
  }

  const credits = calcCredits(model, durationSeconds);
  const costUsd = calcCostUsd(credits);

  // Atomic deduct + create generation
  const { data: genId, error: rpcError } = await service.rpc("create_generation_atomic", {
    p_user_id: user.id,
    p_model_id: model.id,
    p_prompt: prompt,
    p_duration_secs: durationSeconds,
    p_aspect_ratio: aspectRatio,
    p_credits: credits,
    p_cost_usd: costUsd,
  });

  if (rpcError) {
    if (rpcError.message?.includes("INSUFFICIENT_CREDITS")) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }
    return NextResponse.json({ error: "Failed to create generation" }, { status: 500 });
  }

  // Submit to provider
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/${model.provider}`;
  let jobId: string | null = null;

  try {
    let provider = getProvider(model.provider);
    try {
      const result = await provider.submit({
        modelId: model.provider_model_id,
        prompt,
        durationSeconds,
        aspectRatio,
        webhookUrl,
      });
      jobId = result.jobId;
      recordSuccess(model.provider);
    } catch (err) {
      recordFailure(model.provider);
      const fallback = getFallbackProvider(model.provider);
      if (fallback) {
        const result = await fallback.submit({
          modelId: model.provider_model_id,
          prompt,
          durationSeconds,
          aspectRatio,
          webhookUrl,
        });
        jobId = result.jobId;
      } else {
        throw err;
      }
    }
  } catch {
    // Refund on submission failure
    await service.rpc("refund_generation", { p_generation_id: genId });
    await service.from("generations").update({ status: "failed", error_message: "Provider submission failed" }).eq("id", genId);
    return NextResponse.json({ error: "Provider unavailable" }, { status: 503 });
  }

  // Write provider_job_id back
  await service
    .from("generations")
    .update({ provider_job_id: jobId, status: "processing" })
    .eq("id", genId);

  return NextResponse.json({ generationId: genId }, { status: 202 });
}
