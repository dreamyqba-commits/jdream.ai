import type { Metadata } from "next";

export const metadata: Metadata = { title: "DMCA Policy" };

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-[34px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-2">
        DMCA Policy
      </h1>
      <p className="text-[14px] text-[var(--color-text-tertiary)] mb-10">Last updated: May 1, 2025</p>

      <div className="space-y-8 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
        <div>
          <h2 className="text-[17px] font-semibold text-[var(--color-text-primary)] mb-2">
            Reporting infringement
          </h2>
          <p>
            If you believe content generated through Jdream.ai infringes your copyright, please send a DMCA takedown notice to{" "}
            <a href="mailto:dmca@jdream.ai" className="text-[var(--color-brand)] hover:underline">
              dmca@jdream.ai
            </a>{" "}
            with the following information:
          </p>
          <ul className="mt-3 space-y-1.5 list-disc list-inside">
            <li>Your contact information (name, address, phone, email)</li>
            <li>A description of the copyrighted work you claim has been infringed</li>
            <li>A description and URL of the allegedly infringing content</li>
            <li>A statement that you have a good faith belief the use is not authorized</li>
            <li>A statement that the information in the notice is accurate, under penalty of perjury</li>
            <li>Your physical or electronic signature</li>
          </ul>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--color-text-primary)] mb-2">
            Counter-notification
          </h2>
          <p>
            If you believe content was wrongly removed, you may send a counter-notification to{" "}
            <a href="mailto:dmca@jdream.ai" className="text-[var(--color-brand)] hover:underline">
              dmca@jdream.ai
            </a>
            . We will process it in accordance with the DMCA.
          </p>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--color-text-primary)] mb-2">
            Repeat infringers
          </h2>
          <p>
            We will terminate accounts of users who repeatedly infringe third-party copyrights.
          </p>
        </div>
      </div>
    </div>
  );
}
