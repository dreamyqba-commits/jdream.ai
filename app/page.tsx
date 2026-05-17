import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jdream.ai — AI Video Generator",
  description:
    "One prompt. Every AI video model. Generate with Seedance, Kling, Runway, Pika, Veo and more — all from one place.",
};

const MODELS = [
  { name: "Seedance 2 Fast", provider: "ByteDance", credits: "2cr/s" },
  { name: "Kling 2.5 Turbo", provider: "Kuaishou", credits: "3cr/s" },
  { name: "Runway Gen-3", provider: "Runway", credits: "3cr/s" },
  { name: "Pika 2.0", provider: "Pika Labs", credits: "3cr/s" },
  { name: "Veo 3.1 Fast", provider: "Google", credits: "5cr/s" },
];

const STEPS = [
  { n: "01", title: "Write a prompt", body: "Describe your scene in plain English. Add style, mood, camera moves." },
  { n: "02", title: "Pick a model", body: "Choose the AI that fits your budget and quality target — or run all at once." },
  { n: "03", title: "Download your video", body: "Your video is ready in seconds. MP4, no watermark, yours forever." },
];

const PLANS = [
  { name: "Free", price: "0", credits: "10", features: ["10 credits / month", "1 concurrent job", "All models", "MP4 download"] },
  { name: "Lite", price: "9", credits: "100", features: ["100 credits / month", "2 concurrent jobs", "All models", "MP4 download"] },
  {
    name: "Pro",
    price: "29",
    credits: "500",
    highlight: true,
    features: ["500 credits / month", "3 concurrent jobs", "All models", "Priority queue", "MP4 download"],
  },
  { name: "Premium", price: "79", credits: "2000", features: ["2000 credits / month", "5 concurrent jobs", "All models", "Priority queue", "MP4 download"] },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-4xl px-6 pt-24 pb-20 text-center">
        <h1 className="text-[48px] md:text-[64px] font-semibold tracking-tight leading-[1.1] text-[var(--color-text-primary)] mb-6">
          Every AI video model.
          <br />
          <span className="text-[var(--color-brand)]">One prompt.</span>
        </h1>
        <p className="text-[19px] text-[var(--color-text-secondary)] max-w-xl mx-auto mb-10 leading-relaxed">
          Generate with Seedance, Kling, Runway, Pika, Veo and more — compare results, keep what you love.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-[10px] bg-[var(--color-brand)] px-6 py-3 text-[17px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Start generating — it&apos;s free
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-[10px] border border-[var(--color-border)] px-6 py-3 text-[17px] font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-elevated)]"
          >
            View pricing
          </Link>
        </div>
      </section>

      {/* Model Ticker */}
      <section className="border-t border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-10">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-[13px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-widest mb-8">
            Supported models
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {MODELS.map((m) => (
              <div
                key={m.name}
                className="flex flex-col gap-1 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <span className="text-[14px] font-medium text-[var(--color-text-primary)]">{m.name}</span>
                <span className="text-[12px] text-[var(--color-text-tertiary)]">{m.provider}</span>
                <span className="font-mono text-[12px] text-[var(--color-brand)] mt-1">{m.credits}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-6 py-24">
        <h2 className="text-[34px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-16 text-center">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col gap-4">
              <span className="font-mono text-[13px] text-[var(--color-brand)]">{s.n}</span>
              <h3 className="text-[19px] font-semibold text-[var(--color-text-primary)]">{s.title}</h3>
              <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-[var(--color-surface-elevated)] border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="text-[34px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-4 text-center">
            Simple pricing
          </h2>
          <p className="text-[17px] text-[var(--color-text-secondary)] text-center mb-16">
            Pay for what you use. No hidden fees.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-[14px] border p-6 ${
                  plan.highlight
                    ? "border-[var(--color-brand)] bg-[var(--color-surface)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]"
                }`}
              >
                {plan.highlight && (
                  <span className="mb-4 inline-block rounded-full bg-[var(--color-brand)] px-2.5 py-0.5 text-[11px] font-medium text-white w-fit">
                    Most popular
                  </span>
                )}
                <p className="text-[17px] font-semibold text-[var(--color-text-primary)]">{plan.name}</p>
                <p className="mt-1 mb-6">
                  <span className="text-[34px] font-semibold tracking-tight text-[var(--color-text-primary)]">
                    ${plan.price}
                  </span>
                  <span className="text-[15px] text-[var(--color-text-tertiary)]">/mo</span>
                </p>
                <ul className="flex-1 space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[14px] text-[var(--color-text-secondary)]">
                      <span className="mt-0.5 text-[var(--color-brand)]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.price === "0" ? "/app" : "/pricing"}
                  className={`inline-flex items-center justify-center rounded-[10px] py-2.5 text-[15px] font-medium transition-all ${
                    plan.highlight
                      ? "bg-[var(--color-brand)] text-white hover:opacity-90"
                      : "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]"
                  }`}
                >
                  {plan.price === "0" ? "Start free" : "Get started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
        <h2 className="text-[34px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">
          Ready to generate?
        </h2>
        <p className="text-[17px] text-[var(--color-text-secondary)] mb-8">
          Start with 10 free credits. No credit card required.
        </p>
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-[10px] bg-[var(--color-brand)] px-8 py-3.5 text-[17px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Try Jdream for free
        </Link>
      </section>
    </div>
  );
}
