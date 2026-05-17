import Link from "next/link";

const LINKS = {
  Product: [
    { label: "Generate", href: "/app" },
    { label: "Models", href: "/models" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "DMCA", href: "/dmca" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <p className="font-semibold text-[17px] text-[var(--color-text-primary)] mb-2">
              Jdream<span className="text-[var(--color-brand)]">.ai</span>
            </p>
            <p className="text-[15px] text-[var(--color-text-secondary)] max-w-xs">
              One prompt. Every AI video model. Generate, compare, and download in seconds.
            </p>
          </div>

          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <p className="text-[13px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-widest mb-3">
                {section}
              </p>
              <ul className="space-y-2">
                {items.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-[13px] text-[var(--color-text-tertiary)]">
            © {new Date().getFullYear()} Jdream.ai. All rights reserved.
          </p>
          <p className="text-[13px] text-[var(--color-text-tertiary)]">
            Made with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
