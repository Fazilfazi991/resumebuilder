import type { ResumeTemplateProps } from "@/types/resume";
import { resumeTypography } from "./resume-typography";
import { ContactLine, RenderSection, Watermark } from "./TemplateHelpers";

export function ClassicATS({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  const preferred = ["summary", "experience", "education", "skills", "projects", "certificates", "languages"];
  const ordered = [...preferred, ...sectionOrder.filter((item) => !preferred.includes(item))];
  return (
    <div className="resume-page p-[15mm] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <header className="border-b border-slate-400 pb-3 text-center">
        <h1 className="break-words font-sans font-bold tracking-normal text-slate-950" style={{ fontSize: resumeTypography.name }}>{data.personal.fullName || "Your Name"}</h1>
        <p className="mt-1 font-semibold text-slate-700" style={{ fontSize: resumeTypography.sectionHeadingCompact }}>{data.personal.jobTitle}</p>
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
