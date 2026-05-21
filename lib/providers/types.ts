export type JobStatus = "pending" | "processing" | "success" | "failed";

export interface GenerateInput {
  modelId: string;       // provider_model_id from models table
  prompt: string;
  durationSeconds: number;
  aspectRatio: string;
  webhookUrl: string;
}

export interface JobResult {
  jobId: string;
  status: JobStatus;
  assetUrl?: string;
  errorMessage?: string;
}

export interface VideoProvider {
  name: string;
  submit(input: GenerateInput): Promise<{ jobId: string }>;
  status(jobId: string): Promise<JobResult>;
  parseWebhook(payload: unknown): { jobId: string; status: JobStatus; assetUrl?: string; errorMessage?: string } | null;
}

export interface ImageProvider {
  name: string;
  submit(input: GenerateInput): Promise<{ jobId: string }>;
  status(jobId: string): Promise<JobResult>;
  parseWebhook(payload: unknown): { jobId: string; status: JobStatus; assetUrl?: string; errorMessage?: string } | null;
}
