import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "History" };

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/history");

  const service = await createServiceClient();
  const { data: generations } = await service
    .from("generations")
    .select("id, status, prompt, credits_spent, created_at, r2_key, model_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!generations?.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-3">
          No generations yet
        </h1>
        <p className="text-[17px] text-[var(--color-text-secondary)] mb-8">
          Head to the Generate page to create your first AI video.
        </p>
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-[10px] bg-[var(--color-brand)] px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Start generating
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-text-primary)]">
          History
        </h1>
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-[10px] bg-[var(--color-brand)] px-4 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          New generation
        </Link>
      </div>

      <div className="divide-y divide-[var(--color-border)] rounded-[14px] border border-[var(--color-border)] overflow-hidden">
        {generations.map((gen) => (
          <div key={gen.id} className="flex items-center gap-4 px-5 py-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] transition-colors">
            {/* Status badge */}
            <StatusBadge status={gen.status} />

            {/* Prompt */}
            <div className="flex-1 min-w-0">
              <p className="text-[15px] text-[var(--color-text-primary)] truncate">{gen.prompt}</p>
              <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">
                {formatRelativeTime(gen.created_at)} · {gen.credits_spent} credits
              </p>
            </div>

            {/* Actions */}
            {gen.status === "completed" && gen.r2_key && (
              <DownloadButton generationId={gen.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-green-50 text-green-700 border-green-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    processing: "bg-blue-50 text-[var(--color-brand)] border-blue-200",
    pending: "bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)] border-[var(--color-border)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-medium capitalize flex-shrink-0 ${styles[status] ?? styles.pending}`}
    >
      {status}
    </span>
  );
}

function DownloadButton({ generationId }: { generationId: string }) {
  return (
    <a
      href={`/api/download?id=${generationId}`}
      className="flex-shrink-0 text-[13px] text-[var(--color-brand)] hover:underline font-medium"
    >
      Download
    </a>
  );
}
