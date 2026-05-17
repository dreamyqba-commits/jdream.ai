"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Generate", href: "/app" },
  { label: "Models", href: "/models" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Pricing", href: "/pricing" },
];

interface HeaderProps {
  user?: { email?: string } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-8 px-6">
        {/* Logo */}
        <Link href="/" className="font-semibold text-[17px] tracking-tight text-[var(--color-text-primary)]">
          Jdream<span className="text-[var(--color-brand)]">.ai</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-md text-[15px] transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-[var(--color-text-primary)] font-medium"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {user ? (
            <>
              <Link
                href="/history"
                className="text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                History
              </Link>
              <Link
                href="/account"
                className="text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Account
              </Link>
              <button
                onClick={signOut}
                className="text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-[10px] bg-[var(--color-brand)] px-4 py-2 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
