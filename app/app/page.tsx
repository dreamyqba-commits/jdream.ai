"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Model {
  id: string;
  code: string;
  name: string;
  type: string;
  tier: string;
  credits_per_second: number;
  provider: string;
}

type GenerationStatus = "idle" | "pending" | "processing" | "completed" | "failed";

interface GenerationState {
  id: string;
  status: GenerationStatus;
  downloadUrl?: string;
  errorMessage?: string;
}

const ASPECT_RATIOS = ["16:9", "9:16", "1:1", "4:3", "3:4"];
const DURATION_OPTIONS = [3, 5, 8, 10];

export default function GeneratePage() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [generation, setGeneration] = useState<GenerationState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then((data) => {
        const videoModels = (data.models ?? []).filter((m: Model) => m.type === "video");
        setModels(videoModels);
        if (videoModels.length > 0) setSelectedModel(videoModels[0]);
      })
      .catch(() => {});
  }, []);

  // Poll generation status
  useEffect(() => {
    if (!generation || generation.status === "completed" || generation.status === "failed") {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/status/${generation.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setGeneration((prev) =>
        prev ? { ...prev, status: data.status, downloadUrl: data.downloadUrl, errorMessage: data.errorMessage } : prev
      );
    }, 2000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [generation?.id, generation?.status]);

  const credits = selectedModel ? selectedModel.credits_per_second * duration : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedModel || !prompt.trim() || submitting) return;

    setSubmitting(true);
    setGeneration(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelCode: selectedModel.code,
          prompt: prompt.trim(),
          durationSeconds: duration,
          aspectRatio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGeneration({ id: "", status: "failed", errorMessage: data.error ?? "Generation failed" });
        return;
      }

      setGeneration({ id: data.generationId, status: "pending" });
    } catch {
      setGeneration({ id: "", status: "failed", errorMessage: "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-8">
        Generate
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Prompt */}
          <div>
            <label className="block text-[14px] font-medium text-[var(--color-text-primary)] mb-2">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic shot of a mountain lake at sunrise, golden light, mist rising…"
              maxLength={2000}
              rows={4}
              className="w-full resize-none rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus-ring outline-none transition-colors"
            />
            <p className="mt-1 text-right text-[12px] text-[var(--color-text-tertiary)]">
              {prompt.length}/2000
            </p>
          </div>

          {/* Model selector */}
          <div>
            <label className="block text-[14px] font-medium text-[var(--color-text-primary)] mb-2">
              Model
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {models.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModel(m)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-[10px] border p-3 text-left transition-colors",
                    selectedModel?.id === m.id
                      ? "border-[var(--color-brand)] bg-blue-50"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)]"
                  )}
                >
                  <span className="text-[14px] font-medium text-[var(--color-text-primary)]">{m.name}</span>
                  <span className="font-mono text-[12px] text-[var(--color-brand)]">
                    {m.credits_per_second}cr/s
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[14px] font-medium text-[var(--color-text-primary)] mb-2">
              Duration — {duration}s
            </label>
            <div className="flex gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={cn(
                    "rounded-[8px] border px-3 py-1.5 text-[14px] transition-colors",
                    duration === d
                      ? "border-[var(--color-brand)] bg-blue-50 text-[var(--color-brand)] font-medium"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]"
                  )}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio */}
          <div>
            <label className="block text-[14px] font-medium text-[var(--color-text-primary)] mb-2">
              Aspect ratio
            </label>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar}
                  type="button"
                  onClick={() => setAspectRatio(ar)}
                  className={cn(
                    "rounded-[8px] border px-3 py-1.5 font-mono text-[13px] transition-colors",
                    aspectRatio === ar
                      ? "border-[var(--color-brand)] bg-blue-50 text-[var(--color-brand)] font-medium"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]"
                  )}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedModel || !prompt.trim() || submitting}
            className="mt-2 inline-flex items-center justify-center rounded-[10px] bg-[var(--color-brand)] px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting…" : `Generate — ${credits} credits`}
          </button>
        </form>

        {/* Right: Result */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[17px] font-medium text-[var(--color-text-primary)]">Result</h2>
          <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] min-h-[280px] flex items-center justify-center">
            <GenerationResult generation={generation} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GenerationResult({ generation }: { generation: GenerationState | null }) {
  if (!generation) {
    return (
      <p className="text-[15px] text-[var(--color-text-tertiary)] px-6 text-center">
        Your generated video will appear here.
      </p>
    );
  }

  if (generation.status === "pending" || generation.status === "processing") {
    return (
      <div className="flex flex-col items-center gap-3 px-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-brand)]" />
        <p className="text-[15px] text-[var(--color-text-secondary)]">
          {generation.status === "pending" ? "Queued…" : "Generating…"}
        </p>
      </div>
    );
  }

  if (generation.status === "failed") {
    return (
      <div className="px-6 text-center">
        <p className="text-[15px] text-red-600 font-medium">Generation failed</p>
        {generation.errorMessage && (
          <p className="mt-1 text-[13px] text-[var(--color-text-tertiary)]">{generation.errorMessage}</p>
        )}
      </div>
    );
  }

  if (generation.status === "completed" && generation.downloadUrl) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 w-full">
        <video
          src={generation.downloadUrl}
          controls
          className="w-full rounded-[10px]"
          style={{ maxHeight: "360px" }}
        />
        <a
          href={generation.downloadUrl}
          download
          className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--color-border)] px-4 py-2 text-[14px] font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
        >
          Download MP4
        </a>
      </div>
    );
  }

  return null;
}
