import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/app";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { user } = data;

      // Upsert user row
      await supabase.from("users").upsert(
        {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
        },
        { onConflict: "id", ignoreDuplicates: true }
      );

      // Grant signup bonus (idempotent RPC)
      await supabase.rpc("grant_signup_credits", {
        p_user_id: user.id,
        p_credits: 50,
      });

      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth_failed`);
}
