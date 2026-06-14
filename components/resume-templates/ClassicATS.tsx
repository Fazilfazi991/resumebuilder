import type { ResumeTemplateProps } from "@/types/resume";
import { ContactLine, RenderSection, Watermark } from "./TemplateHelpers";

export function ClassicATS({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  const preferred = ["summary", "experience", "education", "skills", "projects", "certificates", "languages"];
  const ordered = [...preferred, ...sectionOrder.filter((item) => !preferred.includes(item))];
  return (
    <div className="resume-page p-[15mm] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <header className="border-b border-slate-400 pb-3 text-center">
        <h1 className="font-sans text-[28px] font-bold tracking-normal text-slate-950">{data.personal.fullName || "Your Name"}</h1>
        <p className="mt-1 text-[13px] font-semibold text-slate-700">{data.personal.jobTitle}</p>
        <div className="mt-1.5">
          <ContactLine data={data} />
        </div>
      </header>
      <div className="mt-4 space-y-3.5">
        {ordered.map((section) => (
          <RenderSection key={section} id={section} data={data} variant="classic" />
        ))}
      </div>
    </div>
  );
}
