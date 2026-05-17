import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const service = await createServiceClient();
  const { data: models } = await service
    .from("models")
    .select("id, code, name, type, tier, credits_per_second, provider")
    .eq("enabled", true)
    .order("credits_per_second", { ascending: true });

  return NextResponse.json(
    { models: models ?? [] },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
