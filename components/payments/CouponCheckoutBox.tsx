"use client";

import { AppButton } from "@/components/app/AppButton";
import { applyFreeCouponUpgrade, validateCouponAction } from "@/lib/actions/coupons";
import { currencyStorageKey, formatPlanPrice, type PaymentCurrency } from "@/lib/payments/currency";
import { paidPlans, type PaidPlanId } from "@/lib/payments/plans";
import { CheckCircle2, Gift, Tag } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { CheckoutButton } from "./CheckoutButton";

type CouponCheckoutBoxProps = {
  planId: PaidPlanId;
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
};

export function CouponCheckoutBox({ planId, variant = "primary", children = "Choose Plan" }: CouponCheckoutBoxProps) {
  const [currency, setCurrency] = useState<PaymentCurrency>("aed");
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const plan = paidPlans[planId];
  const originalAmount = plan.amounts[currency];
  const finalAmount = isApplied ? 0 : originalAmount;

  const updateCoupon = (value: string) => {
    setCoupon(value.toUpperCase());
    setIsApplied(false);
    setIsActivated(false);
    setMessage("");
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem(currencyStorageKey);
    setCurrency(savedCurrency === "inr" ? "inr" : "aed");

    const syncCurrency = (event: Event) => {
      setCurrency(event instanceof CustomEvent && event.detail === "inr" ? "inr" : "aed");
      setIsApplied(false);
      setIsActivated(false);
      setMessage("");
    };

    window.addEventListener("resumecraft:currency-change", syncCurrency);
    return () => window.removeEventListener("resumecraft:currency-change", syncCurrency);
  }, []);

  const breakdown = useMemo(() => ({
    original: formatPlanPrice(originalAmount, currency),
    discount: `-${formatPlanPrice(originalAmount - finalAmount, currency)}`,
    total: formatPlanPrice(finalAmount, currency),
  }), [currency, finalAmount, originalAmount]);

  const applyCoupon = () => {
    startTransition(async () => {
      const result = await validateCouponAction(coupon, planId, currency);
      setMessage(result.message);
      setIsApplied(Boolean(result.ok && "finalAmount" in result && result.finalAmount === 0));
      setIsActivated(false);
    });
  };

  const activate = () => {
    startTransition(async () => {
      const result = await applyFreeCouponUpgrade(coupon, planId, currency);
      setMessage(result.message);
      setIsActivated(Boolean(result.ok));
    });
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3">
        <label className="block text-xs font-bold text-slate-700">Enter coupon code</label>
        <div className="mt-2 grid gap-2">
          <input
            value={coupon}
            onChange={(event) => updateCoupon(event.target.value)}
            placeholder="Enter coupon code"
            className="h-10 min-w-0 rounded-lg border border-blue-200 bg-white px-3 text-sm font-semibold uppercase tracking-wide text-slate-900 outline-none focus:border-blue-600"
          />
          <button
            type="button"
            onClick={applyCoupon}
            disabled={isPending || !coupon.trim()}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-bold text-white disabled:opacity-60"
          >
            <Tag size={15} aria-hidden="true" />
            Apply Coupon
          </button>
        </div>
        {message ? <p className={`mt-2 text-xs font-bold ${isApplied || isActivated ? "text-green-700" : "text-red-700"}`}>{message}</p> : null}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
        <div className="flex justify-between gap-3 text-slate-600"><span>Original price</span><strong className="text-slate-950">{breakdown.original}</strong></div>
        <div className="mt-1 flex justify-between gap-3 text-slate-600"><span>Discount</span><strong className={isApplied ? "text-green-700" : "text-slate-950"}>{breakdown.discount}</strong></div>
        <div className="mt-2 flex justify-between gap-3 border-t border-slate-100 pt-2 font-bold text-slate-950"><span>Total</span><span>{breakdown.total}</span></div>
      </div>
      {isApplied ? (
        <AppButton onClick={activate} disabled={isPending || isActivated}>
          {isActivated ? <CheckCircle2 size={16} aria-hidden="true" /> : <Gift size={16} aria-hidden="true" />}
          {isActivated ? "Free Access Active" : "Activate Free Access"}
        </AppButton>
      ) : (
        <CheckoutButton planId={planId} variant={variant}>{children}</CheckoutButton>
      )}
    </div>
  );
}
