type ResumePreviewProps = {
  accent?: "blue" | "emerald" | "orange" | "slate" | "purple";
  compact?: boolean;
  name?: string;
};

const accentClasses = {
  blue: "bg-blue-600",
  emerald: "bg-emerald-600",
  orange: "bg-orange-500",
  slate: "bg-slate-800",
  purple: "bg-violet-600",
};

export function ResumePreview({ accent = "blue", compact = false, name = "Maya Thomas" }: ResumePreviewProps) {
  return (
    <div
      className={`resume-paper relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${
        compact ? "aspect-[3/4] p-4" : "aspect-[4/5] p-6"
      }`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`mb-2 h-2 w-14 rounded-full ${accentClasses[accent]}`} />
            <h3 className={`${compact ? "text-sm" : "text-xl"} font-bold text-slate-950`}>{name}</h3>
            <p className="mt-1 text-xs font-medium text-slate-500">Product Marketing Manager</p>
          </div>
          <div className="grid gap-1 text-right">
            <span className="h-1.5 w-16 rounded-full bg-slate-200" />
            <span className="h-1.5 w-12 justify-self-end rounded-full bg-slate-200" />
            <span className="h-1.5 w-14 justify-self-end rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <PreviewSection rows={compact ? 3 : 4} />
          <PreviewSection rows={compact ? 2 : 3} />
          <div className="grid grid-cols-2 gap-3">
            <PreviewSection rows={3} small />
            <PreviewSection rows={3} small />
          </div>
          {!compact ? <PreviewSection rows={3} /> : null}
        </div>
      </div>
    </div>
  );
}

function PreviewSection({ rows, small = false }: { rows: number; small?: boolean }) {
  return (
    <div>
      <div className="mb-2 h-2 w-20 rounded-full bg-slate-900" />
      <div className="space-y-1.5">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full bg-slate-200 ${small || index % 2 ? "w-4/5" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}
