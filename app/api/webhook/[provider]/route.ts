import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getProvider } from "@/lib/providers";
import { uploadFromUrl, buildR2Key } from "@/lib/r2/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: providerName } = await params;

  let provider;
  try {
    provider = getProvider(providerName);
  } catch {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  const body = await request.json();
  const event = provider.parseWebhook(body);

  // Ignore events we can't map
  if (!event || !event.jobId) {
    return NextResponse.json({ ok: true });
  }

  const service = await createServiceClient();

  // Idempotency: log event, skip if already processed
  const eventId = `${providerName}:${event.jobId}:${event.status}`;
  const { error: logError } = await service
    .from("webhooks_log")
    .insert({ provider: providerName, event_id: eventId, payload: body });

  if (logError?.code === "23505") {
    // Duplicate — already handled
    return NextResponse.json({ ok: true });
  }

  // Look up the generation by provider_job_id
  const { data: gen } = await service
    .from("generations")
    .select("id, user_id, status, r2_key")
    .eq("provider_job_id", event.jobId)
    .single();

  if (!gen) return NextResponse.json({ ok: true });

  // Skip if already in a terminal state
  if (gen.status === "completed" || gen.status === "failed") {
    return NextResponse.json({ ok: true });
  }

  if (event.status === "success" && event.assetUrl) {
    const r2Key = buildR2Key(gen.user_id, gen.id);
    try {
      await uploadFromUrl(event.assetUrl, r2Key);
      await service
        .from("generations")
        .update({ status: "completed", asset_url: event.assetUrl, r2_key: r2Key })
        .eq("id", gen.id);
    } catch {
      await service
        .from("generations")
        .update({ status: "failed", error_message: "Asset upload failed" })
        .eq("id", gen.id);
    }
  } else if (event.status === "failed") {
    await service
      .from("generations")
      .update({ status: "failed", error_message: event.errorMessage ?? "Provider error" })
      .eq("id", gen.id);

    // Refund credits
    await service.rpc("refund_generation", { p_generation_id: gen.id });
  }

  return NextResponse.json({ ok: true });
}
