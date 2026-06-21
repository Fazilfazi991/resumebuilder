import { formatPlanAmount, type PaymentCurrency } from "@/lib/payments/currency";

type CurrencyAmountProps = {
  amount: number;
  currency: PaymentCurrency;
  prefix?: string;
  className?: string;
};

export function CurrencyAmount({ amount, currency, prefix, className = "" }: CurrencyAmountProps) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${className}`}>
      {prefix ? <span>{prefix}</span> : null}
      {currency === "aed" ? (
        <span
          className="mr-[0.24em] inline-block h-[0.82em] w-[0.94em] shrink-0 bg-current"
          style={{
            WebkitMask: "url('/brand/aed-symbol.png') center / contain no-repeat",
            mask: "url('/brand/aed-symbol.png') center / contain no-repeat",
          }}
          role="img"
          aria-label="AED"
        />
      ) : (
        <span className="mr-[0.18em]">{"\u20B9"}</span>
      )}
      <span>{formatPlanAmount(amount, currency)}</span>
    </span>
  );
}
