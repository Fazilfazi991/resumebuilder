export type PaidPlanId = "premium" | "lifetime";

export type PaidPlan = {
  id: PaidPlanId;
  name: string;
  amounts: {
    aed: number;
    inr: number;
  };
  description: string;
};

export const paidPlans: Record<PaidPlanId, PaidPlan> = {
  premium: {
    id: "premium",
    name: "Premium",
    amounts: {
      aed: 499,
      inr: 9900,
    },
    description: "Premium templates, no watermark, PDF downloads, and AI writing tools.",
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime",
    amounts: {
      aed: 1999,
      inr: 49900,
    },
    description: "Unlimited resumes, all templates, lifetime access, and priority templates.",
  },
};

export function getPaidPlan(planId: string | null | undefined) {
  if (planId === "premium" || planId === "lifetime") {
    return paidPlans[planId];
  }

  return null;
}
