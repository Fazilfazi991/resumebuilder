import Link from "next/link";
import type { ReactNode } from "react";

type AppButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
};

export function AppButton({ children, href, variant = "primary", type = "button", onClick, disabled = false }: AppButtonProps) {
  const className = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]}`;

  if (href) {
    return <Link href={href} className={className}>{children}</Link>;
  }

  return <button type={type} onClick={onClick} disabled={disabled} className={className}>{children}</button>;
}

const styles = {
  primary: "bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700",
  secondary: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  danger: "border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100",
};
