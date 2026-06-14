import { FileText } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
  footer,
  message,
  error,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  message?: string;
  error?: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
        <Link href="/" className="mb-7 flex items-center justify-center gap-2 text-lg font-bold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white"><FileText size={19} /></span>
          <span>Resume<span className="text-teal-500">Craft</span></span>
        </Link>
        <h1 className="text-center text-3xl font-bold text-slate-950">{title}</h1>
        <p className="mt-2 text-center text-sm leading-6 text-slate-600">{description}</p>
        {message ? <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}
        <div className="mt-6">{children}</div>
        <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
      </section>
    </main>
  );
}

export function AuthField({ label, name, type = "text", autoComplete }: { label: string; name: string; type?: string; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-400" />
    </label>
  );
}
