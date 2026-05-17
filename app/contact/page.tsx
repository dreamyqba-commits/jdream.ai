import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-[34px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-2">
        Contact
      </h1>
      <p className="text-[17px] text-[var(--color-text-secondary)] mb-10">
        We&apos;re a small team. We read every message.
      </p>

      <div className="space-y-6 text-[15px] text-[var(--color-text-secondary)]">
        <ContactRow label="General" email="hello@jdream.ai" />
        <ContactRow label="Support" email="support@jdream.ai" />
        <ContactRow label="Privacy / GDPR" email="privacy@jdream.ai" />
        <ContactRow label="DMCA / Copyright" email="dmca@jdream.ai" />
      </div>

      <p className="mt-10 text-[13px] text-[var(--color-text-tertiary)]">
        We aim to respond within 2 business days.
      </p>
    </div>
  );
}

function ContactRow({ label, email }: { label: string; email: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
      <span className="text-[var(--color-text-primary)] font-medium">{label}</span>
      <a href={`mailto:${email}`} className="text-[var(--color-brand)] hover:underline">
        {email}
      </a>
    </div>
  );
}
