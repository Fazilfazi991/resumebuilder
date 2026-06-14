import type { ResumeTemplateProps } from "@/types/resume";
import { RenderSection, Watermark } from "./TemplateHelpers";
import { contactItems, hasText } from "./template-utils";

export function ElegantTwoColumn({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  return (
    <div className="resume-page grid grid-cols-[0.31fr_0.69fr] bg-[#fbfaf7] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <aside className="bg-[#e9e4da] px-[10mm] py-[14mm]">
        {hasText(data.personal.photoUrl) ? (
          <img src={data.personal.photoUrl} alt="" className="mb-5 h-[28mm] w-[28mm] rounded-full border-[3px] border-white object-cover shadow-sm" />
        ) : null}
        <p className="text-[8.5px] font-bold uppercase tracking-[0.25em] text-stone-500">Curriculum Vitae</p>
        <h1 className="mt-4 font-[Georgia] text-[26px] font-bold leading-[1.15] text-[#292b2d]">{data.personal.fullName}</h1>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-600">{data.personal.jobTitle}</p>
        <section className="mt-7"><h2 className="mb-2 border-b border-stone-400 pb-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em]">Contact</h2><div className="space-y-1.5 text-[9px] leading-[1.45] text-stone-700">{contactItems(data).map((item) => <p key={item} className="break-words">{item}</p>)}</div></section>
        <div className="mt-6 space-y-5"><RenderSection id="skills" data={data} variant="classic" /><RenderSection id="languages" data={data} variant="classic" /><RenderSection id="certificates" data={data} variant="classic" /><RenderSection id="references" data={data} variant="classic" /></div>
      </aside>
      <main className="px-[12mm] py-[14mm]">
        <div className="mb-6 flex items-center gap-3"><div className="h-px flex-1 bg-stone-400" /><span className="font-[Georgia] text-[10px] italic text-stone-600">Professional Portfolio</span></div>
        <div className="space-y-5"><RenderSection id="summary" data={data} variant="classic" /><RenderSection id="experience" data={data} variant="classic" /><RenderSection id="education" data={data} variant="classic" /><RenderSection id="projects" data={data} variant="classic" />{sectionOrder.includes("achievements") ? <RenderSection id="achievements" data={data} variant="classic" /> : null}</div>
      </main>
    </div>
  );
}
