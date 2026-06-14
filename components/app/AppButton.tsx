import Link from "next/link";
import type { ReactNode } from "react";

type AppButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
};

export function AppButton({ children, href, variant = "primary", type = "button", onClick }: AppButtonProps) {
  const className = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${styles[variant]}`;

  if (href) {
    return <Link href={href} className={className}>{children}</Link>;
  }

  return <button type={type} onClick={onClick} className={className}>{children}</button>;
}

const styles = {
  primary: "bg-teal-700 text-white shadow-sm shadow-teal-700/20 hover:bg-teal-800",
  secondary: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  danger: "border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100",
};
