"use client";

import { Check } from "lucide-react";
import { ButtonLink } from "./ButtonLink";
import { currencyStorageKey, type PaymentCurrency } from "@/lib/payments/currency";
import type { PaidPlanId } from "@/lib/payments/plans";
import { paidPlans } from "@/lib/payments/plans";
import { useEffect, useState } from "react";
import { CurrencyAmount } from "@/components/payments/CurrencyAmount";

type PricingCardProps = {
  name: string;
  price?: string;
  planId?: PaidPlanId;
  features: string[];
  featured?: boolean;
};

export function PricingCard({ name, price, planId, features, featured = false }: PricingCardProps) {
  const [currency, setCurrency] = useState<PaymentCurrency>("aed");
  const plan = planId ? paidPlans[planId] : null;

  useEffect(() => {
    const savedCurrency = localStorage.getItem(currencyStorageKey);
    setCurrency(savedCurrency === "inr" ? "inr" : "aed");

    const syncCurrency = (event: Event) => {
      setCurrency(event instanceof CustomEvent && event.detail === "inr" ? "inr" : "aed");
    };

    window.addEventListener("resumi:currency-change", syncCurrency);
    return () => window.removeEventListener("resumi:currency-change", syncCurrency);
  }, []);

  return (
    <article
      className={`rounded-lg border bg-white p-6 shadow-sm ${
        featured ? "border-blue-600 ring-4 ring-blue-100" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-slate-950">{name}</h3>
        {featured ? <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Popular</span> : null}
      </div>
      <p className="mt-5 text-3xl font-bold text-slate-950">
        {plan ? <CurrencyAmount amount={plan.amounts[currency]} currency={currency} /> : price}
      </p>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm text-slate-600">
            <Check className="mt-0.5 shrink-0 text-blue-700" size={17} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-7">
        <ButtonLink href="/pricing" variant={featured ? "primary" : "secondary"}>
          Start Building
        </ButtonLink>
      </div>
    </article>
  );
}
