import type { ResumeTemplateProps } from "@/types/resume";
import { ContactLine, RenderSection, Watermark } from "./TemplateHelpers";

export function SimpleOnePage({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  return (
    <div className="resume-page px-[10mm] py-[9mm] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <header className="grid grid-cols-[0.38fr_0.62fr] items-end gap-7 border-b border-slate-400 pb-2.5"><div><h1 className="text-[23px] font-bold leading-none text-slate-950">{data.personal.fullName}</h1><p className="mt-1 text-[10.5px] font-bold text-slate-700">{data.personal.jobTitle}</p></div><ContactLine data={data} align="right" /></header>
      <div className="mt-3 grid grid-cols-[0.68fr_0.32fr] gap-5"><main className="space-y-2.5"><RenderSection id="summary" data={data} variant="classic" /><RenderSection id="experience" data={data} variant="classic" /><RenderSection id="projects" data={data} variant="classic" /><RenderSection id="education" data={data} variant="classic" /></main><aside className="space-y-3 border-l border-slate-200 pl-4"><RenderSection id="skills" data={data} variant="classic" /><RenderSection id="certificates" data={data} variant="classic" /><RenderSection id="languages" data={data} variant="classic" />{sectionOrder.includes("achievements") ? <RenderSection id="achievements" data={data} variant="classic" /> : null}</aside></div>
    </div>
  );
}
