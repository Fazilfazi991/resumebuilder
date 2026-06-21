export type PaymentCurrency = "aed" | "inr";

export const currencyStorageKey = "resumi_currency";

export const currencyLabels: Record<PaymentCurrency, string> = {
  aed: "AED",
  inr: "INR",
};

const currencySymbols: Record<PaymentCurrency, string> = {
  aed: "\u20C3",
  inr: "\u20B9",
};

export function getPaymentCurrency(value: string | null | undefined): PaymentCurrency {
  return value === "inr" ? "inr" : "aed";
}

export function formatPlanPrice(amount: number, currency: PaymentCurrency) {
  const majorAmount = amount / 100;
  const formattedAmount = majorAmount.toLocaleString("en-US", {
    maximumFractionDigits: currency === "aed" ? 2 : 0,
    minimumFractionDigits: currency === "aed" ? 2 : 0,
  });
  return `${currencySymbols[currency]} ${formattedAmount}`;
}
