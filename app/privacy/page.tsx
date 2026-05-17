import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-[34px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-2">
        Privacy Policy
      </h1>
      <p className="text-[14px] text-[var(--color-text-tertiary)] mb-10">Last updated: May 1, 2025</p>

      <div className="space-y-8 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
        <Section title="What we collect">
          We collect your email address, name, and profile picture when you sign in with Google. We also collect prompts you submit and metadata about your generations (status, credits consumed, timestamps).
        </Section>
        <Section title="How we use your data">
          We use your data to operate the service, process generations, manage your account, and send transactional emails. We do not sell your data to third parties.
        </Section>
        <Section title="Data storage">
          Account data is stored in Supabase (hosted on AWS). Generated videos are stored in Cloudflare R2. Data is retained as long as your account is active.
        </Section>
        <Section title="Third-party providers">
          Your prompts are forwarded to AI model providers (PiAPI, fal.ai) to generate outputs. These providers have their own privacy policies.
        </Section>
        <Section title="Cookies">
          We use session cookies to keep you signed in. No tracking or advertising cookies are set.
        </Section>
        <Section title="Your rights">
          You may request deletion of your account and associated data by emailing support@jdream.ai. EU residents have additional rights under GDPR.
        </Section>
        <Section title="Contact">
          For privacy questions, contact us at privacy@jdream.ai.
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
