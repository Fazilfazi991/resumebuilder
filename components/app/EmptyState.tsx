import type { LucideIcon } from "lucide-react";
import { AppButton } from "./AppButton";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-5"><AppButton href={actionHref}>{actionLabel}</AppButton></div>
    </div>
  );
}
