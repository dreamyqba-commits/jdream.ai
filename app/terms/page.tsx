import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-[34px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-2">
        Terms of Service
      </h1>
      <p className="text-[14px] text-[var(--color-text-tertiary)] mb-10">Last updated: May 1, 2025</p>

      <div className="prose-jdream space-y-8 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
        <Section title="1. Acceptance of terms">
          By accessing or using Jdream.ai you agree to be bound by these Terms. If you do not agree, do not use the service.
        </Section>
        <Section title="2. Description of service">
          Jdream.ai provides access to third-party AI video and image generation models through a unified interface. We act as an aggregator and do not own the underlying models.
        </Section>
        <Section title="3. Accounts and credits">
          You must create an account to use the service. Credits are consumed on generation and are non-refundable except in cases of service failure. Unused monthly credits expire at the end of each billing cycle.
        </Section>
        <Section title="4. Acceptable use">
          You may not use Jdream.ai to generate content that is illegal, harmful, hateful, sexually explicit involving minors, or that infringes third-party intellectual property rights. We reserve the right to suspend accounts that violate these rules.
        </Section>
        <Section title="5. Intellectual property">
          You retain ownership of prompts you submit. Generated outputs are provided as-is; ownership and licensing of AI-generated content may vary by jurisdiction. We make no warranties about your rights to generated content.
        </Section>
        <Section title="6. Disclaimers">
          The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uptime, quality, or fitness for a particular purpose.
        </Section>
        <Section title="7. Limitation of liability">
          To the maximum extent permitted by law, Jdream.ai shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.
        </Section>
        <Section title="8. Changes">
          We may update these terms at any time. Continued use after changes constitutes acceptance.
        </Section>
        <Section title="9. Contact">
          Questions? Email us at support@jdream.ai.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[17px] font-semibold text-[var(--color-text-primary)] mb-2">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
