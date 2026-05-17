import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getProvider } from "@/lib/providers";
import { uploadFromUrl, buildR2Key } from "@/lib/r2/client";

// Called by Vercel Cron every 30s; also protects with CRON_SECRET
export async function GET(request: Request) {
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = await createServiceClient();

  // Poll generations stuck in "processing" for more than 10s but less than 20min
  const cutoffOld = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  const cutoffRecent = new Date(Date.now() - 10 * 1000).toISOString();

  const { data: pending } = await service
    .from("generations")
    .select("id, user_id, provider_job_id, model_id, updated_at")
    .eq("status", "processing")
    .gt("updated_at", cutoffOld)
    .lt("updated_at", cutoffRecent)
    .limit(20);

  if (!pending?.length) return NextResponse.json({ polled: 0 });

  // Need provider name per generation — join via models
  const modelIds = [...new Set(pending.map((g) => g.model_id))];
  const { data: models } = await service
    .from("models")
    .select("id, provider")
    .in("id", modelIds);

  const modelMap = Object.fromEntries((models ?? []).map((m) => [m.id, m.provider]));

  let polled = 0;

  await Promise.allSettled(
    pending.map(async (gen) => {
      const providerName = modelMap[gen.model_id];
      if (!providerName || !gen.provider_job_id) return;

      let provider;
      try {
        provider = getProvider(providerName);
      } catch {
        return;
      }

      const jobStatus = await provider.status(gen.provider_job_id);
      polled++;

      if (jobStatus.status === "success" && jobStatus.assetUrl) {
        const r2Key = buildR2Key(gen.user_id, gen.id);
        try {
          await uploadFromUrl(jobStatus.assetUrl, r2Key);
          await service
            .from("generations")
            .update({ status: "completed", asset_url: jobStatus.assetUrl, r2_key: r2Key })
            .eq("id", gen.id);
        } catch {
          await service
            .from("generations")
            .update({ status: "failed", error_message: "Asset upload failed" })
            .eq("id", gen.id);
        }
      } else if (jobStatus.status === "failed") {
        await service
          .from("generations")
          .update({ status: "failed", error_message: jobStatus.errorMessage ?? "Provider error" })
          .eq("id", gen.id);
        await service.rpc("refund_generation", { p_generation_id: gen.id });
      }
    })
  );

  return NextResponse.json({ polled });
}
