import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for AI video generation. Start free.",
};

const PLANS = [
  {
    name: "Free",
    price: "0",
    billed: null,
    credits: 10,
    concurrency: 1,
    features: ["10 credits / month", "1 concurrent job", "Access to all models", "MP4 download"],
    cta: "Start for free",
    href: "/app",
    highlight: false,
  },
  {
    name: "Lite",
    price: "9",
    billed: "monthly",
    credits: 100,
    concurrency: 2,
    features: ["100 credits / month", "2 concurrent jobs", "Access to all models", "MP4 download"],
    cta: "Get Lite",
    href: "/app",
    highlight: false,
  },
  {
    name: "Pro",
    price: "29",
    billed: "monthly",
    credits: 500,
    concurrency: 3,
    features: ["500 credits / month", "3 concurrent jobs", "Access to all models", "Priority queue", "MP4 download"],
    cta: "Get Pro",
    href: "/app",
    highlight: true,
  },
  {
    name: "Premium",
    price: "79",
    billed: "monthly",
    credits: 2000,
    concurrency: 5,
    features: ["2,000 credits / month", "5 concurrent jobs", "Access to all models", "Priority queue", "MP4 download"],
    cta: "Get Premium",
    href: "/app",
    highlight: false,
  },
];

const MODEL_CREDITS = [
  { name: "Seedance 2 Fast", credits: "2cr/s", example: "~4cr for 2s" },
  { name: "Kling 2.5 Turbo", credits: "3cr/s", example: "~15cr for 5s" },
  { name: "Runway Gen-3 Alpha", credits: "3cr/s", example: "~15cr for 5s" },
  { name: "Pika 2.0", credits: "3cr/s", example: "~15cr for 5s" },
  { name: "Veo 3.1 Fast", credits: "5cr/s", example: "~25cr for 5s" },
];

const FAQ = [
  {
    q: "What is a credit?",
    a: "Credits are consumed per second of video generated. A 5-second Kling video costs 15 credits (3cr × 5s). Credits reset monthly.",
  },
  {
    q: "Do unused credits roll over?",
    a: "No, credits reset at the start of each billing cycle. Top up plans aren't available yet.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel at any time from your account page. You'll keep access until the end of your billing period.",
  },
  {
    q: "Which payment methods are accepted?",
    a: "We accept all major credit cards via Creem. Invoices available on Pro and Premium.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-3xl px-6 pt-20 pb-16 text-center">
        <h1 className="text-[48px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">
          Simple pricing
        </h1>
        <p className="text-[19px] text-[var(--color-text-secondary)]">
          Start free. Upgrade when you need more.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-[14px] border p-6 ${
                plan.highlight
                  ? "border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]"
                  : "border-[var(--color-border)]"
              } bg-[var(--color-surface)]`}
            >
              {plan.highlight && (
                <span className="mb-4 inline-block rounded-full bg-[var(--color-brand)] px-2.5 py-0.5 text-[11px] font-medium text-white w-fit">
                  Most popular
                </span>
              )}
              <p className="text-[17px] font-semibold text-[var(--color-text-primary)]">{plan.name}</p>
              <div className="mt-2 mb-6">
                <span className="text-[38px] font-semibold tracking-tight text-[var(--color-text-primary)]">
                  ${plan.price}
                </span>
                {plan.billed && (
                  <span className="text-[15px] text-[var(--color-text-tertiary)]">/mo</span>
                )}
              </div>
              <ul className="flex-1 space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[14px] text-[var(--color-text-secondary)]">
                    <span className="mt-0.5 text-[var(--color-brand)] flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`inline-flex items-center justify-center rounded-[10px] py-2.5 text-[15px] font-medium transition-all ${
                  plan.highlight
                    ? "bg-[var(--color-brand)] text-white hover:opacity-90"
                    : "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Credit rates */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-[28px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-3">
            Credit rates by model
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] mb-8">
            Credits are consumed per second of output. Higher-tier models produce better results and cost more.
          </p>
          <div className="divide-y divide-[var(--color-border)] rounded-[14px] border border-[var(--color-border)] overflow-hidden">
            {MODEL_CREDITS.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface)]"
              >
                <span className="text-[15px] text-[var(--color-text-primary)]">{m.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-[13px] text-[var(--color-text-tertiary)]">{m.example}</span>
                  <span className="font-mono text-[14px] text-[var(--color-brand)] font-medium w-16 text-right">
                    {m.credits}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-6 py-20">
        <h2 className="text-[28px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-10">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="py-6">
              <p className="text-[17px] font-medium text-[var(--color-text-primary)] mb-2">{q}</p>
              <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
