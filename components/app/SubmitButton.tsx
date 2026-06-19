"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

type SubmitButtonProps = {
  children: ReactNode;
  pendingText?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  disabled?: boolean;
};

export function SubmitButton({ children, pendingText = "Please wait...", variant = "primary", className = "", disabled = false }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={`${baseClassName} ${styles[variant]} ${className}`}
    >
      {pending ? (
        <>
          <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

const baseClassName = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition active:scale-[0.98] disabled:cursor-wait disabled:opacity-70";

const styles = {
  primary: "bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700",
  secondary: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  danger: "border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100",
};
