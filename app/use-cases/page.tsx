import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Use Cases",
  description: "See how creators, marketers, and developers use Jdream.ai to generate AI videos at scale.",
};

const CASES = [
  {
    category: "Marketing",
    title: "Product demo videos in minutes",
    body: "Write a prompt describing your product in action. Get polished demo clips for every channel — social, web, ads — without a film crew.",
    models: ["Kling 2.5 Turbo", "Runway Gen-3"],
  },
  {
    category: "Social Media",
    title: "Scroll-stopping short-form content",
    body: "Generate vertical 9:16 clips optimized for TikTok and Reels. Iterate fast — try three prompts, keep the best one.",
    models: ["Seedance 2 Fast", "Pika 2.0"],
  },
  {
    category: "Film & Animation",
    title: "Pre-visualization and storyboarding",
    body: "Turn shot descriptions into moving previews. Show the whole team the vision before you pick up a camera.",
    models: ["Veo 3.1 Fast", "Runway Gen-3"],
  },
  {
    category: "E-commerce",
    title: "Lifestyle and hero videos at scale",
    body: "Create product lifestyle videos for every SKU. Batch-generate variations across seasons and audiences without reshoots.",
    models: ["Kling 2.5 Turbo", "Pika 2.0"],
  },
  {
    category: "Education",
    title: "Explainer videos from a text description",
    body: "Visualize abstract concepts for students. Generate diagrams in motion — without animation software or a production budget.",
    models: ["Seedance 2 Fast", "Veo 3.1 Fast"],
  },
  {
    category: "Developers",
    title: "AI video in your product",
    body: "Use our API to power video generation inside your own app. Credits-based pricing scales with your usage.",
    models: ["All models"],
  },
];

export default function UseCasesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-3xl px-6 pt-20 pb-16 text-center">
        <h1 className="text-[48px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">
          What will you generate?
        </h1>
        <p className="text-[19px] text-[var(--color-text-secondary)]">
          Creators, marketers, developers — everyone has a use case.
        </p>
      </section>

      {/* Use case grid */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASES.map((c) => (
            <div
              key={c.title}
              className="flex flex-col gap-4 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <span className="text-[12px] font-medium text-[var(--color-brand)] uppercase tracking-widest">
                {c.category}
              </span>
              <h2 className="text-[19px] font-semibold text-[var(--color-text-primary)] leading-snug">
                {c.title}
              </h2>
              <p className="flex-1 text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
                {c.body}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {c.models.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[12px] text-[var(--color-text-tertiary)]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
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
