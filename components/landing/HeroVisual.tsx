import { Award, FileCheck2 } from "lucide-react";

export function HeroVisual() {
  const cards = ["Modern Template", "ATS Template", "Executive Template", "Creative Template"];

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="absolute -left-1 top-20 z-20 hidden rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-xl shadow-slate-200/80 xl:-left-8 sm:block">
        ATS Template
      </div>
      <div className="absolute -right-1 top-28 z-20 hidden rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-xl shadow-slate-200/80 xl:-right-8 sm:block">
        Executive Template
      </div>
      <div className="absolute -bottom-4 left-12 z-20 hidden rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-xl shadow-slate-200/80 sm:flex sm:items-center sm:gap-2">
        <Award size={16} aria-hidden="true" />
        Resume Score: 92%
      </div>

      <div className="relative mx-auto flex min-h-[520px] w-full max-w-[520px] items-center justify-center sm:min-h-[620px]">
        <div className="absolute left-6 top-10 h-[76%] w-[70%] rotate-[-5deg] rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-300/30">
          <div className="h-24 rounded-t-lg bg-slate-100" />
          <div className="space-y-3 p-8">
            <div className="h-2 w-20 rounded-full bg-blue-600" />
            <div className="h-2 w-full rounded-full bg-slate-200" />
            <div className="h-2 w-5/6 rounded-full bg-slate-200" />
            <div className="h-2 w-11/12 rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="absolute right-3 top-0 h-[84%] w-[72%] rotate-[4deg] rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-300/30">
          <div className="h-28 rounded-t-lg bg-blue-700" />
          <div className="space-y-3 p-8">
            <div className="h-2 w-24 rounded-full bg-slate-900" />
            <div className="h-2 w-full rounded-full bg-slate-200" />
            <div className="h-2 w-4/5 rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="relative z-10 w-[78%] max-w-[360px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-300/50 sm:w-[72%]">
          <img
            src="/images/hero-resume-photo-template.png"
            alt="Professional resume template preview with profile photo"
            className="block h-auto w-full"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
        {cards.map((card) => (
          <div key={card} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            <FileCheck2 size={14} className="text-blue-700" aria-hidden="true" />
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}
