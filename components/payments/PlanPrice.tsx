"use client";

import { currencyStorageKey, formatPlanPrice, type PaymentCurrency } from "@/lib/payments/currency";
import { paidPlans, type PaidPlanId } from "@/lib/payments/plans";
import { useEffect, useState } from "react";

export function PlanPrice({ planId, className = "" }: { planId: PaidPlanId; className?: string }) {
  const [currency, setCurrency] = useState<PaymentCurrency>("aed");

  useEffect(() => {
    const savedCurrency = localStorage.getItem(currencyStorageKey);
    setCurrency(savedCurrency === "inr" ? "inr" : "aed");

    const syncCurrency = (event: Event) => {
      setCurrency(event instanceof CustomEvent && event.detail === "inr" ? "inr" : "aed");
    };

    window.addEventListener("resumecraft:currency-change", syncCurrency);
    return () => window.removeEventListener("resumecraft:currency-change", syncCurrency);
  }, []);

  return <span className={className}>{formatPlanPrice(paidPlans[planId].amounts[currency], currency)}</span>;
}
