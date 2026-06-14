import { CheckCircle2, GripVertical, Save, SlidersHorizontal } from "lucide-react";
import { ResumePreview } from "./ResumePreview";

export function BuilderMockup() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70 sm:p-4">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <Save size={13} aria-hidden="true" />
          Saved
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          <MockField label="Full name" value="Maya Thomas" />
          <MockField label="Role" value="Senior Product Manager" />
          <MockField label="Professional summary" textarea />
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
        </div>

        <div className="rounded-lg bg-slate-100 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">Live preview</p>
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-700">
              <CheckCircle2 size={14} aria-hidden="true" />
              A4 ready
            </span>
          </div>
          <ResumePreview accent="blue" compact={false} />
        </div>
      </div>
    </div>
  );
}

function MockField({ label, value, textarea = false }: { label: string; value?: string; textarea?: boolean }) {
  return (
    <label className="block rounded-lg border border-slate-200 bg-white p-3">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span
        className={`mt-2 block rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-800 ${
          textarea ? "h-20" : "h-9"
        }`}
      >
        {value}
      </span>
    </label>
  );
}
