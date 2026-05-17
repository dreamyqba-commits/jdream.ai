import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatRelativeTime, formatCredits } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/account");

  const service = await createServiceClient();

  const [{ data: userData }, { data: sub }, { data: transactions }] = await Promise.all([
    service.from("users").select("plan, credits_balance").eq("id", user.id).single(),
    service.from("subscriptions").select("plan, status, current_period_end").eq("user_id", user.id).maybeSingle(),
    service
      .from("credits_transactions")
      .select("delta, reason, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const planLabel = (userData?.plan ?? "free").charAt(0).toUpperCase() + (userData?.plan ?? "free").slice(1);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-8">
        Account
      </h1>

      {/* Profile */}
      <section className="mb-8 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="text-[17px] font-medium text-[var(--color-text-primary)] mb-4">Profile</h2>
        <dl className="space-y-3">
          <Row label="Email" value={user.email ?? "—"} />
          <Row label="Plan" value={planLabel} />
          <Row label="Credits" value={`${formatCredits(userData?.credits_balance ?? 0)} remaining`} />
          {sub?.current_period_end && (
            <Row
              label="Renews"
              value={new Date(sub.current_period_end).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            />
          )}
        </dl>
      </section>

      {/* Upgrade */}
      {(!userData?.plan || userData.plan === "free") && (
        <section className="mb-8 rounded-[14px] border border-[var(--color-brand)] bg-blue-50 p-6">
          <h2 className="text-[17px] font-medium text-[var(--color-text-primary)] mb-1">
            Upgrade for more credits
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] mb-4">
            Get 100–2,000 credits per month and higher concurrency limits.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-[10px] bg-[var(--color-brand)] px-4 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            View plans
          </Link>
        </section>
      )}

      {/* Credit history */}
      <section className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-[17px] font-medium text-[var(--color-text-primary)]">Credit history</h2>
        </div>
        {!transactions?.length ? (
          <p className="px-5 py-6 text-[15px] text-[var(--color-text-tertiary)]">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-[14px] text-[var(--color-text-primary)] capitalize">
                    {tx.reason.replace(/_/g, " ")}
                  </p>
                  <p className="text-[12px] text-[var(--color-text-tertiary)] mt-0.5">
                    {formatRelativeTime(tx.created_at)}
                  </p>
                </div>
                <span
                  className={`font-mono text-[14px] font-medium ${
                    tx.delta > 0 ? "text-green-600" : "text-[var(--color-text-primary)]"
                  }`}
                >
                  {tx.delta > 0 ? "+" : ""}{tx.delta}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[14px] text-[var(--color-text-tertiary)]">{label}</dt>
      <dd className="text-[14px] text-[var(--color-text-primary)] font-medium">{value}</dd>
    </div>
  );
}
