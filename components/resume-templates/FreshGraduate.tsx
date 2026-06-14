import type { ResumeTemplateProps } from "@/types/resume";
import { ContactLine, RenderSection, Watermark } from "./TemplateHelpers";
import { hasText } from "./template-utils";

export function FreshGraduate({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  return (
    <div className="resume-page px-[13mm] py-[12mm] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <header className="flex items-center justify-between gap-5 border-l-[6px] border-sky-600 bg-sky-50 px-6 py-5">
        <div className="min-w-0">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-sky-700">Graduate Candidate</p>
          <h1 className="text-[29px] font-bold tracking-normal text-slate-950">{data.personal.fullName}</h1>
          <p className="mt-1 text-[12px] font-bold text-sky-700">{data.personal.jobTitle}</p>
          <div className="mt-2.5"><ContactLine data={data} /></div>
        </div>
        {hasText(data.personal.photoUrl) ? <img src={data.personal.photoUrl} alt="" className="h-[23mm] w-[23mm] shrink-0 rounded-full border-[3px] border-white object-cover shadow-sm" /> : null}
      </header>
      <div className="mt-5 grid grid-cols-[0.68fr_0.32fr] gap-6">
        <main className="space-y-4.5"><RenderSection id="education" data={data} variant="modern" /><RenderSection id="projects" data={data} variant="modern" /><RenderSection id="experience" data={data} variant="modern" /></main>
        <aside className="space-y-5 border-l border-sky-200 pl-5"><RenderSection id="summary" data={data} variant="modern" /><RenderSection id="skills" data={data} variant="modern" /><RenderSection id="certificates" data={data} variant="modern" /><RenderSection id="languages" data={data} variant="modern" /></aside>
      </div>
      {sectionOrder.includes("achievements") ? <div className="mt-4"><RenderSection id="achievements" data={data} variant="modern" /></div> : null}
    </div>
  );
}
