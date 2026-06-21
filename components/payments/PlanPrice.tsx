"use client";

import { currencyStorageKey, type PaymentCurrency } from "@/lib/payments/currency";
import { paidPlans, type PaidPlanId } from "@/lib/payments/plans";
import { useEffect, useState } from "react";
import { CurrencyAmount } from "./CurrencyAmount";

export function PlanPrice({ planId, className = "" }: { planId: PaidPlanId; className?: string }) {
  const [currency, setCurrency] = useState<PaymentCurrency>("aed");

  useEffect(() => {
    const savedCurrency = localStorage.getItem(currencyStorageKey);
    setCurrency(savedCurrency === "inr" ? "inr" : "aed");

    const syncCurrency = (event: Event) => {
      setCurrency(event instanceof CustomEvent && event.detail === "inr" ? "inr" : "aed");
    };

    window.addEventListener("resumi:currency-change", syncCurrency);
    return () => window.removeEventListener("resumi:currency-change", syncCurrency);
  }, []);

  return <CurrencyAmount amount={paidPlans[planId].amounts[currency]} currency={currency} className={className} />;
}
