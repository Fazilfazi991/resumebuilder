"use client";

import { AppButton } from "@/components/app/AppButton";
import type { PaidPlanId } from "@/lib/payments/plans";
import { CreditCard } from "lucide-react";
import { useState } from "react";

type CheckoutButtonProps = {
  planId: PaidPlanId;
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function CheckoutButton({ planId, children = "Upgrade", variant = "primary" }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const payload = await response.json();

      if (!response.ok || typeof payload.url !== "string") {
        throw new Error(payload.error ?? "Checkout could not be started.");
      }

      window.location.href = payload.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <AppButton onClick={startCheckout} disabled={isLoading} variant={variant}>
        <CreditCard size={16} aria-hidden="true" />
        {isLoading ? "Opening Checkout" : children}
      </AppButton>
      {error ? <p className="text-xs font-semibold text-rose-700">{error}</p> : null}
    </div>
  );
}
