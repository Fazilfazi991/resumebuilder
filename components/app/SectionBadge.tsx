import type { ReactNode } from "react";

export function SectionBadge({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "slate" | "emerald" }) {
  const styles = {
    teal: "bg-teal-50 text-teal-700",
    slate: "bg-slate-100 text-slate-600",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles[tone]}`}>{children}</span>;
}
