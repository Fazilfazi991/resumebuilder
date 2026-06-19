import { ArrowUpRight } from "lucide-react";
import { A4Preview } from "@/components/app/A4Preview";

type TemplateCardProps = {
  id: string;
  name: string;
  badge: "Free" | "Premium";
  category: string;
  bestFor: string;
};

export function TemplateCard({ id, name, badge, category, bestFor }: TemplateCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
      <div className="bg-slate-100 p-3 pb-0">
        <A4Preview templateId={id} />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0 px-4 pb-4">
          <h3 className="font-bold text-slate-950">{name}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{category}</p>
          <p className="mt-2 text-sm leading-5 text-slate-600">{bestFor}</p>
          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              badge === "Free" ? "bg-emerald-50 text-emerald-700" : "bg-teal-50 text-teal-700"
            }`}
          >
            {badge}
          </span>
        </div>
        <a
          href={`/builder/guest?template=${id}`}
          className="mr-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-700"
          aria-label={`Use ${name} template`}
          title={`Use ${name}`}
        >
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
