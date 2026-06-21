import type { ResumeTemplateProps } from "@/types/resume";
import { resumeTypography } from "./resume-typography";
import { ContactLine, RenderSection, Watermark } from "./TemplateHelpers";

export function SimpleOnePage({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  return (
    <div className="resume-page px-[12mm] py-[10mm] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <header className="grid grid-cols-[0.44fr_0.56fr] items-end gap-5 border-b border-slate-400 pb-3">
        <div className="min-w-0">
          <h1 className="break-words font-bold leading-[1.08] text-slate-950" style={{ fontSize: "20pt" }}>{data.personal.fullName || "Your Name"}</h1>
          <p className="mt-1 break-words font-bold text-slate-700" style={{ fontSize: resumeTypography.contact }}>{data.personal.jobTitle}</p>
        </div>
        <ContactLine data={data} align="right" separator="  |  " className="ml-auto max-w-[96mm] text-[10pt] leading-[1.35]" />
      </header>
      <div className="mt-3 grid grid-cols-[0.66fr_0.34fr] gap-5">
        <main className="min-w-0 space-y-2.5">
          <RenderSection id="summary" data={data} variant="classic" />
          <RenderSection id="experience" data={data} variant="classic" />
          <RenderSection id="projects" data={data} variant="classic" />
          <RenderSection id="education" data={data} variant="classic" />
        </main>
        <aside className="min-w-0 space-y-3 border-l border-slate-200 pl-4">
          <RenderSection id="skills" data={data} variant="classic" />
          <RenderSection id="certificates" data={data} variant="classic" />
          <RenderSection id="languages" data={data} variant="classic" />
          {sectionOrder.includes("achievements") ? <RenderSection id="achievements" data={data} variant="classic" /> : null}
          {sectionOrder.includes("references") ? <RenderSection id="references" data={data} variant="classic" /> : null}
        </aside>
      </div>
    </div>
  );
}
