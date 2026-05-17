import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getSignedDownloadUrl } from "@/lib/r2/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const generationId = searchParams.get("id");

  if (!generationId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = await createServiceClient();
  const { data: gen } = await service
    .from("generations")
    .select("r2_key, status")
    .eq("id", generationId)
    .eq("user_id", user.id)
    .single();

  if (!gen) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (gen.status !== "completed" || !gen.r2_key) {
    return NextResponse.json({ error: "Not ready" }, { status: 409 });
  }

  const url = await getSignedDownloadUrl(gen.r2_key);
  // 1h browser cache — URL itself expires in 24h
  return NextResponse.json({ url }, { headers: { "Cache-Control": "private, max-age=3600" } });
}
