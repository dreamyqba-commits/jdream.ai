import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { PLAN_MONTHLY_CREDITS } from "@/lib/credits";

function verifyCreemSignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signature;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const sig = request.headers.get("creem-signature") ?? "";

  if (!verifyCreemSignature(rawBody, sig, process.env.CREEM_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const service = await createServiceClient();

  // Idempotency via event ID
  const { error: logError } = await service
    .from("webhooks_log")
    .insert({ provider: "creem", event_id: event.id, payload: event });

  if (logError?.code === "23505") {
    return NextResponse.json({ ok: true });
  }

  const { type, data } = event;

  if (type === "subscription.active" || type === "subscription.updated") {
    const { customer_id, product_id, id: subscriptionId, status, billing_cycle } = data;

    // Map product_id to plan
    const planMap: Record<string, string> = {
      [process.env.CREEM_PRODUCT_LITE!]: "lite",
      [process.env.CREEM_PRODUCT_PRO!]: "pro",
      [process.env.CREEM_PRODUCT_PREMIUM!]: "premium",
    };
    const plan = planMap[product_id];
    if (!plan) return NextResponse.json({ ok: true });

    // Find user by creem_customer_id or email
    const { data: sub } = await service
      .from("subscriptions")
      .select("user_id")
      .eq("creem_subscription_id", subscriptionId)
      .single();

    let userId = sub?.user_id;

    if (!userId && data.customer_email) {
      const { data: u } = await service
        .from("users")
        .select("id")
        .eq("email", data.customer_email)
        .single();
      userId = u?.id;
    }

    if (!userId) return NextResponse.json({ ok: true });

    // Upsert subscription
    await service.from("subscriptions").upsert(
      {
        user_id: userId,
        plan,
        billing_cycle: billing_cycle ?? "monthly",
        status: status === "active" ? "active" : "past_due",
        creem_subscription_id: subscriptionId,
        creem_customer_id: customer_id,
        current_period_start: data.current_period_start ?? new Date().toISOString(),
        current_period_end: data.current_period_end ?? null,
      },
      { onConflict: "user_id" }
    );

    // Update user plan
    await service.from("users").update({ plan }).eq("id", userId);
  }

  if (type === "subscription.renewed") {
    const { id: subscriptionId } = data;
    const { data: sub } = await service
      .from("subscriptions")
      .select("user_id, plan")
      .eq("creem_subscription_id", subscriptionId)
      .single();

    if (sub) {
      const monthlyCredits = PLAN_MONTHLY_CREDITS[sub.plan] ?? 0;
      // Top up credits (add monthly allowance — not a refund)
      await service.from("credits_transactions").insert({
        user_id: sub.user_id,
        delta: monthlyCredits,
        reason: "monthly_renewal",
        ref_type: "subscription",
        ref_id: subscriptionId,
      });
      await service.rpc("add_credits", {
        p_user_id: sub.user_id,
        p_delta: monthlyCredits,
      });

      await service
        .from("subscriptions")
        .update({
          current_period_start: data.current_period_start,
          current_period_end: data.current_period_end,
        })
        .eq("creem_subscription_id", subscriptionId);
    }
  }

  if (type === "subscription.cancelled" || type === "subscription.expired") {
    const { id: subscriptionId } = data;
    await service
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("creem_subscription_id", subscriptionId);

    const { data: sub } = await service
      .from("subscriptions")
      .select("user_id")
      .eq("creem_subscription_id", subscriptionId)
      .single();

    if (sub) {
      await service.from("users").update({ plan: "free" }).eq("id", sub.user_id);
    }
  }

  return NextResponse.json({ ok: true });
}
