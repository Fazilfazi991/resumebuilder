"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/require-user";
import { validateCoupon } from "@/lib/coupons/validate-coupon";
import { getPaidPlan, type PaidPlanId } from "@/lib/payments/plans";
import { getPaymentCurrency, type PaymentCurrency } from "@/lib/payments/currency";

export async function validateCouponAction(code: string, planId: PaidPlanId, currency: PaymentCurrency) {
  const plan = getPaidPlan(planId);
  if (!plan) {
    return { ok: false, message: "Invalid plan selected." };
  }

  const result = validateCoupon(code, plan.amounts[getPaymentCurrency(currency)]);
  return { ok: result.valid, ...result };
}

export async function applyFreeCouponUpgrade(code: string, planId: PaidPlanId, currency: PaymentCurrency) {
  const plan = getPaidPlan(planId);
  if (!plan) {
    return { ok: false, message: "Invalid plan selected." };
  }

  const result = validateCoupon(code, plan.amounts[getPaymentCurrency(currency)]);
  if (!result.valid || result.finalAmount !== 0) {
    return { ok: false, message: "Invalid coupon code." };
  }

  const { supabase, user } = await requireUser("/billing");
  const upgradePlan = planId === "lifetime" ? "lifetime" : "premium";

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ plan: upgradePlan })
    .eq("user_id", user.id);

  if (profileError) {
    return { ok: false, message: profileError.message };
  }

  await recordCouponRedemption(user.id, result.code, result.discountAmount, result.originalAmount, result.finalAmount);
  return { ok: true, message: "Coupon applied. Your premium access is active.", plan: upgradePlan };
}

async function recordCouponRedemption(userId: string, couponCode: string, discountAmount: number, originalAmount: number, finalAmount: number) {
  try {
    const supabase = await createClient();
    await supabase.from("coupon_redemptions").insert({
      user_id: userId,
      coupon_code: couponCode,
      discount_amount: discountAmount,
      original_amount: originalAmount,
      final_amount: finalAmount,
    });
    await supabase.rpc("increment_coupon_usage", { coupon_code_input: couponCode });
  } catch {
    // Coupon tables are included in the migration; keep upgrades working if they have not been applied yet.
  }
}
