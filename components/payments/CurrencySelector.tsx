"use client";

import { currencyLabels, currencyStorageKey, type PaymentCurrency } from "@/lib/payments/currency";
import { useEffect, useState } from "react";

type CurrencySelectorProps = {
  compact?: boolean;
};

export function CurrencySelector({ compact = false }: CurrencySelectorProps) {
  const [currency, setCurrency] = useState<PaymentCurrency>("aed");

  useEffect(() => {
    const savedCurrency = localStorage.getItem(currencyStorageKey);
    if (savedCurrency === "inr") {
      setCurrency("inr");
    }
  }, []);

  const selectCurrency = (nextCurrency: PaymentCurrency) => {
    setCurrency(nextCurrency);
    localStorage.setItem(currencyStorageKey, nextCurrency);
    window.dispatchEvent(new CustomEvent("resumecraft:currency-change", { detail: nextCurrency }));
  };

  return (
    <div className={`inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm ${compact ? "" : "min-h-11"}`} aria-label="Payment currency">
      {(["aed", "inr"] as PaymentCurrency[]).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => selectCurrency(option)}
          className={`rounded-md px-3 py-2 text-sm font-bold transition ${
            currency === option ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          }`}
        >
          {currencyLabels[option]}
        </button>
      ))}
    </div>
  );
}
