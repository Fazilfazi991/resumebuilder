import type { ResumeTemplateProps } from "@/types/resume";
import { ContactLine, RenderSection, Watermark } from "./TemplateHelpers";
import { hasText } from "./template-utils";

export function SalesResume({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  return (
    <div className="resume-page px-[14mm] py-[12mm] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <header className="flex items-end justify-between gap-8 border-b-[3px] border-emerald-700 pb-5">
        <div><p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600">Revenue / Growth / Partnerships</p><h1 className="text-[30px] font-bold text-slate-950">{data.personal.fullName}</h1><p className="mt-1 text-[12px] font-bold text-emerald-700">{data.personal.jobTitle}</p><div className="mt-2"><ContactLine data={data} /></div></div>
        <div className="flex shrink-0 items-center gap-3">
          {hasText(data.personal.photoUrl) ? <img src={data.personal.photoUrl} alt="" className="h-[22mm] w-[22mm] rounded-lg border border-emerald-100 object-cover" /> : null}
          <div className="bg-emerald-50 px-5 py-3 text-center"><p className="text-[25px] font-bold text-emerald-700">92%</p><p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-500">Profile Strength</p></div>
        </div>
      </header>
      {data.achievements.length ? <section className="resume-section mt-5 bg-[#f4f8f4] p-4"><p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-800">Performance Highlights</p><div className="grid grid-cols-3 gap-3">{data.achievements.map((item, index) => <article key={item.id} className="resume-item border-l-2 border-orange-500 pl-3"><p className="text-[20px] font-bold text-emerald-700">{index === 0 ? "#1" : "+"}</p><h3 className="text-[9.5px] font-bold text-slate-950">{item.title}</h3><p className="mt-1 text-[9px] leading-[1.4] text-slate-600">{item.description}</p></article>)}</div></section> : null}
      <div className="mt-5 grid grid-cols-[0.7fr_0.3fr] gap-6"><main className="space-y-4.5"><RenderSection id="experience" data={data} variant="modern" /><RenderSection id="projects" data={data} variant="modern" /></main><aside className="space-y-5 border-l border-emerald-200 pl-5"><RenderSection id="summary" data={data} variant="modern" /><RenderSection id="skills" data={data} variant="modern" /><RenderSection id="education" data={data} variant="modern" /><RenderSection id="certificates" data={data} variant="modern" /></aside></div>
      {sectionOrder.includes("languages") ? <div className="mt-4"><RenderSection id="languages" data={data} variant="modern" /></div> : null}
    </div>
  );
}
