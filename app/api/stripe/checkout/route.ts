import { NextResponse } from "next/server";
import { getPaidPlan } from "@/lib/payments/plans";

const stripeCheckoutUrl = "https://api.stripe.com/v1/checkout/sessions";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const body = await request.json().catch(() => null) as { planId?: string } | null;
  const plan = getPaidPlan(body?.planId);

  if (!plan) {
    return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
  }

  const origin = getSiteOrigin(request);
  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?checkout=canceled`,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": plan.currency,
    "line_items[0][price_data][unit_amount]": String(plan.amount),
    "line_items[0][price_data][product_data][name]": `ResumeCraft ${plan.name}`,
    "line_items[0][price_data][product_data][description]": plan.description,
    "metadata[plan_id]": plan.id,
  });

  const response = await fetch(stripeCheckoutUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
    cache: "no-store",
  });

  const checkoutSession = await response.json();

  if (!response.ok || typeof checkoutSession.url !== "string") {
    return NextResponse.json(
      { error: checkoutSession.error?.message ?? "Unable to create checkout session." },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({ url: checkoutSession.url });
}

function getSiteOrigin(request: Request) {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/$/, "");
  }

  return new URL(request.url).origin;
}
