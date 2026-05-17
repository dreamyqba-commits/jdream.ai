import type { GenerateInput, JobResult, JobStatus, VideoProvider } from "./types";

const BASE = "https://api.piapi.ai/api/v1";

async function req(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.PIAPI_API_KEY!,
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`piapi ${res.status}: ${await res.text()}`);
  return res.json();
}

export const piapiProvider: VideoProvider = {
  name: "piapi",

  async submit(input: GenerateInput) {
    const body = {
      model: input.modelId,
      task_type: "video_generation",
      input: {
        prompt: input.prompt,
        duration: input.durationSeconds,
        aspect_ratio: input.aspectRatio,
      },
      webhook_config: { endpoint: input.webhookUrl },
    };
    const data = await req("/task", { method: "POST", body: JSON.stringify(body) });
    return { jobId: data.data.task_id as string };
  },

  async status(jobId: string) {
    const data = await req(`/task/${jobId}`);
    const s = data.data.status as string;
    const statusMap: Record<string, JobStatus> = {
      pending: "pending",
      processing: "processing",
      completed: "success",
      failed: "failed",
    };
    return {
      jobId,
      status: statusMap[s] ?? "pending",
      assetUrl: data.data.output?.video_url as string | undefined,
      errorMessage: data.data.error?.message as string | undefined,
    };
  },

  parseWebhook(payload: unknown) {
    const p = payload as Record<string, unknown>;
    if (!p?.data) return null;
    const d = p.data as Record<string, unknown>;
    const s = d.status as string;
    const statusMap: Record<string, JobStatus> = {
      completed: "success",
      failed: "failed",
    };
    const mapped = statusMap[s];
    if (!mapped) return null;
    return {
      jobId: d.task_id as string,
      status: mapped,
      assetUrl: (d.output as Record<string, unknown>)?.video_url as string | undefined,
    };
  },
};
