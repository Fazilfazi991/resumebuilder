import type { ResumeTemplateProps } from "@/types/resume";
import { resumeTypography } from "./resume-typography";
import { ContactLine, RenderSection, Watermark } from "./TemplateHelpers";

export function ModernMinimal({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  return (
    <div className="resume-page p-[15mm] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <header className="grid grid-cols-[1fr_0.82fr] items-end gap-8 border-b border-slate-200 pb-5">
        <div>
          <div className="mb-3 h-1 w-14 bg-teal-600" />
          <h1 className="break-words font-sans font-bold tracking-normal text-slate-950" style={{ fontSize: "24pt" }}>{data.personal.fullName || "Your Name"}</h1>
          <p className="mt-1.5 font-semibold text-teal-700" style={{ fontSize: resumeTypography.sectionHeadingCompact }}>{data.personal.jobTitle}</p>
        </div>
        <div className="self-end text-right">
          <ContactLine data={data} align="right" />
        </div>
      </header>
      <div className="mt-5 space-y-4.5">
        {sectionOrder.map((section) => (
          <RenderSection key={section} id={section} data={data} variant="modern" />
        ))}
      </div>
    </div>
  );
}
