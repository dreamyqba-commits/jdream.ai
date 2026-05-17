import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Models",
  description: "Browse the AI video and image models available on Jdream.ai.",
};

type Model = {
  name: string;
  tier: "fast" | "standard" | "cinematic";
  provider: string;
  creditsPerSecond: number;
  defaultSeconds: number;
  maxSeconds: number;
  blurb: string;
};

const VIDEO_MODELS: Model[] = [
  {
    name: "Seedance 2 Fast",
    tier: "fast",
    provider: "PiAPI",
    creditsPerSecond: 5,
    defaultSeconds: 5,
    maxSeconds: 10,
    blurb: "The cheapest way to iterate. Great for quick drafts and social-ready clips.",
  },
  {
    name: "Kling 2.5 Turbo",
    tier: "standard",
    provider: "PiAPI",
    creditsPerSecond: 15,
    defaultSeconds: 5,
    maxSeconds: 10,
    blurb: "Balanced quality and speed. A solid default for product and lifestyle videos.",
  },
  {
    name: "Runway Gen-3 Alpha",
    tier: "standard",
    provider: "FAL",
    creditsPerSecond: 15,
    defaultSeconds: 5,
    maxSeconds: 10,
    blurb: "Strong motion coherence and prompt adherence. Reliable for narrative shots.",
  },
  {
    name: "Pika 2.0",
    tier: "standard",
    provider: "PiAPI",
    creditsPerSecond: 15,
    defaultSeconds: 5,
    maxSeconds: 10,
    blurb: "Expressive style range. Good for stylized and animated looks.",
  },
  {
    name: "Veo 3.1 Fast",
    tier: "cinematic",
    provider: "FAL",
    creditsPerSecond: 25,
    defaultSeconds: 8,
    maxSeconds: 20,
    blurb: "Cinematic detail and longer takes — pick this when quality matters more than cost.",
  },
];

const IMAGE_MODELS: Model[] = [
  {
    name: "Stable Diffusion 3.5",
    tier: "fast",
    provider: "FAL",
    creditsPerSecond: 5,
    defaultSeconds: 1,
    maxSeconds: 1,
    blurb: "Cheapest image option. Great for thumbnails, mood boards, and rapid iteration.",
  },
  {
    name: "FLUX 1.1 Pro",
    tier: "standard",
    provider: "FAL",
    creditsPerSecond: 8,
    defaultSeconds: 1,
    maxSeconds: 1,
    blurb: "Photorealistic detail with strong prompt adherence.",
  },
  {
    name: "Midjourney v7",
    tier: "cinematic",
    provider: "PiAPI",
    creditsPerSecond: 20,
    defaultSeconds: 1,
    maxSeconds: 1,
    blurb: "Signature artistic look — choose this for hero imagery and campaigns.",
  },
];

const TIER_LABEL: Record<Model["tier"], string> = {
  fast: "Fast",
  standard: "Standard",
  cinematic: "Cinematic",
};

function ModelCard({ model, type }: { model: Model; type: "video" | "image" }) {
  const unitCost =
    type === "video"
      ? `${model.creditsPerSecond} credits / sec`
      : `${model.creditsPerSecond} credits / image`;

  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[19px] font-semibold text-[var(--color-text-primary)]">
          {model.name}
        </h3>
        <span className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[12px] uppercase tracking-widest text-[var(--color-brand)]">
          {TIER_LABEL[model.tier]}
        </span>
      </div>
      <p className="flex-1 text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
        {model.blurb}
      </p>
      <dl className="grid grid-cols-2 gap-y-1.5 text-[13px] pt-2 border-t border-[var(--color-border)]">
        <dt className="text-[var(--color-text-tertiary)]">Provider</dt>
        <dd className="text-right text-[var(--color-text-secondary)]">{model.provider}</dd>
        <dt className="text-[var(--color-text-tertiary)]">Cost</dt>
        <dd className="text-right text-[var(--color-text-secondary)]">{unitCost}</dd>
        {type === "video" && (
          <>
            <dt className="text-[var(--color-text-tertiary)]">Length</dt>
            <dd className="text-right text-[var(--color-text-secondary)]">
              {model.defaultSeconds}s default · up to {model.maxSeconds}s
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}

export default function ModelsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-3xl px-6 pt-20 pb-16 text-center">
        <h1 className="text-[48px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">
          Every model, one place.
        </h1>
        <p className="text-[19px] text-[var(--color-text-secondary)]">
          Pick the right model for the job — from fast drafts to cinematic finals.
        </p>
      </section>

      {/* Video models */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-[28px] font-semibold tracking-tight text-[var(--color-text-primary)]">
            Video
          </h2>
          <span className="text-[13px] text-[var(--color-text-tertiary)]">
            {VIDEO_MODELS.length} models
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEO_MODELS.map((m) => (
            <ModelCard key={m.name} model={m} type="video" />
          ))}
        </div>
      </section>

      {/* Image models */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-[28px] font-semibold tracking-tight text-[var(--color-text-primary)]">
            Image
          </h2>
          <span className="text-[13px] text-[var(--color-text-tertiary)]">
            {IMAGE_MODELS.length} models
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IMAGE_MODELS.map((m) => (
            <ModelCard key={m.name} model={m} type="image" />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h2 className="text-[34px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">
            Start generating today
          </h2>
          <p className="text-[17px] text-[var(--color-text-secondary)] mb-8">
            10 free credits. No credit card required.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-[10px] bg-[var(--color-brand)] px-8 py-3.5 text-[17px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Try for free
          </Link>
        </div>
      </section>
    </div>
  );
}
