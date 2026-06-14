import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ children, href, variant = "primary" }: ButtonLinkProps) {
  const classes =
    variant === "primary"
      ? "bg-teal-700 text-white shadow-lg shadow-teal-700/20 hover:bg-teal-800"
      : "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50";

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${classes}`}
    >
      {children}
      {variant === "primary" ? <ArrowRight size={17} aria-hidden="true" /> : null}
    </a>
  );
}
