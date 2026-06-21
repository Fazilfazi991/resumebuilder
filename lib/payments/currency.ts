export type PaymentCurrency = "aed" | "inr";

export const currencyStorageKey = "resumi_currency";

export const currencyLabels: Record<PaymentCurrency, string> = {
  aed: "AED",
  inr: "INR",
};

export function getPaymentCurrency(value: string | null | undefined): PaymentCurrency {
  return value === "inr" ? "inr" : "aed";
}

export function formatPlanAmount(amount: number, currency: PaymentCurrency) {
  const majorAmount = amount / 100;
  return majorAmount.toLocaleString("en-US", {
    maximumFractionDigits: currency === "aed" ? 2 : 0,
    minimumFractionDigits: currency === "aed" ? 2 : 0,
  });
}

export function formatPlanPrice(amount: number, currency: PaymentCurrency) {
  const symbol = currency === "aed" ? "AED" : "\u20B9";
  return `${symbol} ${formatPlanAmount(amount, currency)}`;
}
