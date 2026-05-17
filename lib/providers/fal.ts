import type { GenerateInput, JobResult, JobStatus, VideoProvider } from "./types";

const BASE = "https://queue.fal.run";

async function req(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${process.env.FAL_API_KEY}`,
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`fal ${res.status}: ${await res.text()}`);
  return res.json();
}

export const falProvider: VideoProvider = {
  name: "fal",

  async submit(input: GenerateInput) {
    const data = await req(`${BASE}/${input.modelId}`, {
      method: "POST",
      body: JSON.stringify({
        prompt: input.prompt,
        duration: input.durationSeconds,
        aspect_ratio: input.aspectRatio,
        webhook_url: input.webhookUrl,
      }),
    });
    return { jobId: data.request_id as string };
  },

  async status(jobId: string) {
    const [appId] = jobId.split("/");
    const data = await req(`${BASE}/${appId}/requests/${jobId}/status`);
    const s = data.status as string;
    const statusMap: Record<string, JobStatus> = {
      IN_QUEUE: "pending",
      IN_PROGRESS: "processing",
      COMPLETED: "success",
      FAILED: "failed",
    };
    const result: JobResult = {
      jobId,
      status: statusMap[s] ?? "pending",
    };
    if (s === "COMPLETED" && data.response_url) {
      const output = await req(data.response_url);
      result.assetUrl = output?.video?.url ?? output?.images?.[0]?.url;
    }
    return result;
  },

  parseWebhook(payload: unknown) {
    const p = payload as Record<string, unknown>;
    const s = p.status as string;
    const statusMap: Record<string, JobStatus> = {
      COMPLETED: "success",
      FAILED: "failed",
    };
    const mapped = statusMap[s];
    if (!mapped) return null;
    const output = p.payload as Record<string, unknown> | undefined;
    return {
      jobId: p.request_id as string,
      status: mapped,
      assetUrl: (output?.video as Record<string, unknown>)?.url as string | undefined
        ?? (output?.images as Array<Record<string, unknown>>)?.[0]?.url as string | undefined,
    };
  },
};
