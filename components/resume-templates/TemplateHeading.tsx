import type { ReactNode } from "react";

export function TemplateHeading({ children, tone = "slate", rule = true, className = "" }: { children: ReactNode; tone?: "slate" | "teal" | "navy" | "gold" | "cyan" | "orange" | "purple"; rule?: boolean; className?: string }) {
  const colors = {
    slate: "text-slate-900 border-slate-300",
    teal: "text-teal-700 border-teal-600",
    navy: "text-slate-900 border-slate-800",
    gold: "text-amber-700 border-amber-500",
    cyan: "text-cyan-700 border-cyan-500",
    orange: "text-orange-700 border-orange-500",
    purple: "text-violet-700 border-violet-500",
  };

  return <h2 className={`mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] ${rule ? "border-b pb-1.5" : ""} ${colors[tone]} ${className}`}>{children}</h2>;
}
