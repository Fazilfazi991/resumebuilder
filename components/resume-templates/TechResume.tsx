import type { ResumeTemplateProps } from "@/types/resume";
import { RenderSection, Watermark } from "./TemplateHelpers";
import { contactItems } from "./template-utils";

export function TechResume({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  return (
    <div className="resume-page px-[13mm] py-[12mm] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <header className="bg-slate-900 px-6 py-5 text-white">
        <div className="mb-3 inline-flex border border-cyan-400/50 px-2.5 py-1 font-mono text-[10pt] font-bold uppercase tracking-[0.18em] text-cyan-300">developer.profile</div>
        <h1 className="text-[23pt] font-bold tracking-normal">{data.personal.fullName}</h1>
        <p className="mt-1 font-mono text-[12pt] font-bold text-cyan-300">{data.personal.jobTitle}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10pt] text-slate-300">{contactItems(data).map((item) => <span key={item}>{item}</span>)}</div>
      </header>
      <div className="mt-5 grid grid-cols-[0.34fr_0.66fr] gap-6">
        <aside className="space-y-5"><div className="bg-slate-50 p-4"><RenderSection id="skills" data={data} variant="modern" /></div><RenderSection id="summary" data={data} variant="modern" /><RenderSection id="certificates" data={data} variant="modern" /><RenderSection id="languages" data={data} variant="modern" /></aside>
        <main className="space-y-4.5"><div className="border-l-[3px] border-cyan-500 pl-4"><RenderSection id="projects" data={data} variant="modern" /></div><RenderSection id="experience" data={data} variant="modern" /><RenderSection id="education" data={data} variant="modern" /></main>
      </div>
      {sectionOrder.includes("achievements") ? <div className="mt-4"><RenderSection id="achievements" data={data} variant="modern" /></div> : null}
    </div>
  );
}
