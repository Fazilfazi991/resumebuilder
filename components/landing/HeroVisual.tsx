import { Award, FileCheck2 } from "lucide-react";
import { ResumePreview } from "./ResumePreview";

export function HeroVisual() {
  const cards = ["Modern Template", "ATS Template", "Executive Template", "Creative Template"];

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="absolute -left-1 top-20 z-10 hidden rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-xl shadow-slate-200/80 xl:-left-8 sm:block">
        Modern Template
      </div>
      <div className="absolute -right-1 top-28 z-10 hidden rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-xl shadow-slate-200/80 xl:-right-8 sm:block">
        Executive Template
      </div>
      <div className="absolute -bottom-4 left-12 z-10 hidden rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-xl shadow-slate-200/80 sm:flex sm:items-center sm:gap-2">
        <Award size={16} aria-hidden="true" />
        Resume Score: 92%
      </div>

      <div className="mx-auto w-full max-w-[520px] rounded-lg border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-300/40">
        <ResumePreview />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
        {cards.map((card) => (
          <div key={card} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            <FileCheck2 size={14} className="text-teal-700" aria-hidden="true" />
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}
