import type { ResumeTemplateProps } from "@/types/resume";
import { ContactLine, RenderSection, Watermark } from "./TemplateHelpers";

export function ModernMinimal({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  return (
    <div className="resume-page p-[15mm] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <header className="grid grid-cols-[1fr_0.82fr] items-end gap-8 border-b border-slate-200 pb-5">
        <div>
          <div className="mb-3 h-1 w-14 bg-teal-600" />
          <h1 className="font-sans text-[30px] font-bold tracking-normal text-slate-950">{data.personal.fullName || "Your Name"}</h1>
          <p className="mt-1.5 text-[13px] font-semibold text-teal-700">{data.personal.jobTitle}</p>
        </div>
        <div className="self-end text-right">
          <ContactLine data={data} />
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
