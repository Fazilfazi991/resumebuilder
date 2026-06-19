export type CouponValidationResult = {
  valid: boolean;
  code: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  message: string;
};

export function validateCoupon(code: string, amount: number): CouponValidationResult {
  const normalizedCode = code.trim().toUpperCase();
  const originalAmount = Math.max(0, amount);

  if (normalizedCode !== "THAMEEMAR") {
    return {
      valid: false,
      code: normalizedCode,
      originalAmount,
      discountAmount: 0,
      finalAmount: originalAmount,
      message: "Invalid coupon code.",
    };
  }

  return {
    valid: true,
    code: "THAMEEMAR",
    originalAmount,
    discountAmount: originalAmount,
    finalAmount: 0,
    message: "Coupon applied. Your total is now 0.",
  };
}
