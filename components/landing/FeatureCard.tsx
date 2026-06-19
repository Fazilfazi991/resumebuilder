import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: string;
};

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
      <div className="mb-5 flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Icon size={22} aria-hidden="true" />
        </span>
        {index ? <span className="text-sm font-bold text-slate-300">{index}</span> : null}
      </div>
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
