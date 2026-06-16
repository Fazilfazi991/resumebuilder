import { CheckCircle2, GripVertical, LayoutTemplate, Save, SlidersHorizontal, Sparkles } from "lucide-react";

export function BuilderMockup() {
  return (
    <div className="builder-mockup-shell scroll-reveal relative overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80 sm:p-4">
      <div className="absolute -right-16 top-20 h-44 w-44 rounded-full bg-teal-100/50 blur-3xl" />
      <div className="absolute -bottom-20 left-28 h-52 w-52 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          <Save size={13} aria-hidden="true" />
          Saved
        </div>
      </div>

      <div className="relative grid gap-4 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-3">
          <MockField label="Full name" value="Maya Thomas" />
          <MockField label="Role" value="Senior Product Manager" />
          <MockField label="Professional summary" value="Product leader building simple, measurable customer experiences." textarea />
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-950">Experience</p>
              <SlidersHorizontal size={16} className="text-slate-400" aria-hidden="true" />
            </div>
            {["Led launch planning", "Improved conversion by 24%", "Managed cross-functional roadmap"].map((item) => (
              <div key={item} className="mb-2 flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <GripVertical size={14} className="text-slate-300" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="ATS score" value="92%" />
            <MiniStat label="Templates" value="50+" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-slate-100 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">Live preview</p>
            <span className="flex items-center gap-1 text-xs font-bold text-teal-700">
              <CheckCircle2 size={14} aria-hidden="true" />
              A4 ready
            </span>
          </div>
          <div className="relative min-h-[430px] sm:min-h-[520px]">
            <div className="builder-float-card absolute right-3 top-5 z-20 hidden items-center gap-2 rounded-lg border border-teal-100 bg-white px-3 py-2 text-xs font-bold text-teal-700 shadow-lg shadow-slate-200/80 sm:flex">
              <Sparkles size={14} aria-hidden="true" />
              AI improved
            </div>
            <div className="builder-float-card builder-float-card-delay absolute bottom-8 left-3 z-20 hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-lg shadow-slate-200/80 sm:flex">
              <LayoutTemplate size={14} aria-hidden="true" />
              Photo template
            </div>
            <div className="absolute left-1/2 top-0 h-full w-[68%] max-w-[300px] -translate-x-1/2 rotate-[-2deg] rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-300/50" />
            <img
              src="/images/hero-resume-photo-template.png"
              alt="Live resume preview with profile photo"
              className="relative z-10 mx-auto block h-auto w-[72%] max-w-[320px] rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-300/60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockField({ label, value, textarea = false }: { label: string; value?: string; textarea?: boolean }) {
  return (
    <label className="block rounded-lg border border-slate-200 bg-white p-3">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className={`mt-2 block rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-800 ${textarea ? "min-h-20 leading-6" : "h-9"}`}>
        {value}
      </span>
    </label>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}
