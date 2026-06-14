import { ArrowUpRight } from "lucide-react";
import { ResumePreview } from "./ResumePreview";

type TemplateCardProps = {
  name: string;
  badge: "Free" | "Premium";
  accent: "blue" | "emerald" | "orange" | "slate" | "purple";
};

export function TemplateCard({ name, badge, accent }: TemplateCardProps) {
  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
      <ResumePreview accent={accent} compact name="Alex Morgan" />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{name}</h3>
          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              badge === "Free" ? "bg-emerald-50 text-emerald-700" : "bg-teal-50 text-teal-700"
            }`}
          >
            {badge}
          </span>
        </div>
        <a
          href="#builder"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-700"
          aria-label={`Use ${name} template`}
          title={`Use ${name}`}
        >
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
