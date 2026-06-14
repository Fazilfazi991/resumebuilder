import type { ResumeTemplateProps } from "@/types/resume";
import { RenderSection, Watermark } from "./TemplateHelpers";
import { hasText } from "./template-utils";

export function CreativeDesigner({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  const sidebar = ["skills", "languages", "certificates"];
  const main = sectionOrder.filter((item) => !sidebar.includes(item));
  return (
    <div className="resume-page grid grid-cols-[0.35fr_0.65fr] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <aside className="bg-[#251b36] px-[10mm] py-[13mm] text-white">
        {hasText(data.personal.photoUrl) ? (
          <img src={data.personal.photoUrl} alt="" className="mb-5 h-[30mm] w-[30mm] rounded-[10px] border-[3px] border-[#e06f76] object-cover shadow-lg" />
        ) : (
          <div className="mb-6 h-2 w-14 bg-[#e06f76]" />
        )}
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-violet-200">Portfolio Resume</p>
        <h1 className="font-sans text-[25px] font-bold leading-[1.15]">{data.personal.fullName}</h1>
        <p className="mt-2 text-[11px] font-bold text-[#f3a3a8]">{data.personal.jobTitle}</p>
        <div className="mt-6 space-y-1 text-[10px] leading-5 text-slate-200">
          {[data.personal.email, data.personal.phone, data.personal.location, data.personal.portfolio].filter(Boolean).map((item) => <p key={item}>{item}</p>)}
        </div>
        {hasText(data.personal.portfolio) ? <div className="mt-5 rounded-lg border border-white/10 bg-white/10 p-3 text-[9.5px] font-bold text-[#f3a3a8]">{data.personal.portfolio}</div> : null}
        <div className="mt-6 space-y-5">{sidebar.map((section) => <RenderSection key={section} id={section} data={data} variant="uae" />)}</div>
      </aside>
      <main className="px-[12mm] py-[14mm]">
        <div className="mb-6 flex items-center gap-3"><div className="h-px flex-1 bg-violet-300" /><span className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-700">Selected Work</span></div>
        <div className="space-y-4.5">{main.map((section) => <RenderSection key={section} id={section} data={data} variant="modern" />)}</div>
      </main>
    </div>
  );
}
