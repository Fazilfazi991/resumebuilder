export type PaymentCurrency = "aed" | "inr";

export const currencyStorageKey = "resumecraft_currency";

export const currencyLabels: Record<PaymentCurrency, string> = {
  aed: "AED",
  inr: "INR",
};

export function getPaymentCurrency(value: string | null | undefined): PaymentCurrency {
  return value === "inr" ? "inr" : "aed";
}

export function formatPlanPrice(amount: number, currency: PaymentCurrency) {
  const majorAmount = amount / 100;
  return `${currencyLabels[currency]} ${majorAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
