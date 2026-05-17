import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = await createServiceClient();
  const { data: gen, error } = await service
    .from("generations")
    .select("id, status, asset_url, r2_key, error_message, credits_spent, created_at, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !gen) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Return presigned download URL only when completed and asset is on R2
  let downloadUrl: string | null = null;
  if (gen.status === "completed" && gen.r2_key) {
    const { getSignedDownloadUrl } = await import("@/lib/r2/client");
    downloadUrl = await getSignedDownloadUrl(gen.r2_key);
  }

  return NextResponse.json({
    id: gen.id,
    status: gen.status,
    downloadUrl,
    errorMessage: gen.error_message,
    creditsSpent: gen.credits_spent,
    createdAt: gen.created_at,
    updatedAt: gen.updated_at,
  });
}
