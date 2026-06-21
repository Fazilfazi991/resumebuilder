import type { ResumeTemplateProps } from "@/types/resume";
import { resumeTypography } from "./resume-typography";
import { ContactLine, RenderSection, Watermark } from "./TemplateHelpers";
import { hasText } from "./template-utils";

export function ExecutivePro({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  const remaining = ["experience", "education", "skills", "projects", "certificates", "languages", "references"].filter((id) => sectionOrder.includes(id));
  return (
    <div className="resume-page font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <header className="bg-[#172033] px-[16mm] py-[13mm] text-white">
        <div className="flex items-start justify-between gap-8">
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-3"><span className="h-px w-12 bg-amber-500" /><p className="font-bold uppercase tracking-[0.18em] text-amber-300" style={{ fontSize: resumeTypography.meta }}>Executive Leadership Profile</p></div>
            <h1 className="break-words font-[Georgia] font-bold tracking-normal" style={{ fontSize: "24pt" }}>{data.personal.fullName}</h1>
            <p className="mt-1.5 font-semibold text-slate-200" style={{ fontSize: resumeTypography.sectionHeadingCompact }}>{data.personal.jobTitle}</p>
            <div className="mt-3"><ContactLine data={data} className="text-slate-300" /></div>
          </div>
          {hasText(data.personal.photoUrl) ? <img src={data.personal.photoUrl} alt="" className="h-[24mm] w-[24mm] shrink-0 rounded-full border-[2px] border-amber-300 object-cover" /> : null}
        </div>
      </header>
      <main className="px-[16mm] py-[11mm]">
        {hasText(data.summary) ? <section className="resume-section border-l-[3px] border-amber-500 bg-[#f5f2eb] px-5 py-4"><p className="mb-2 font-bold uppercase tracking-[0.14em] text-amber-800" style={{ fontSize: resumeTypography.sectionHeadingCompact }}>Executive Summary</p><p className="font-[Georgia] text-slate-700" style={{ fontSize: resumeTypography.bodyLarge, lineHeight: "1.6" }}>{data.summary}</p></section> : null}
        {data.achievements.length ? <section className="resume-section mt-5"><p className="mb-3 font-bold uppercase tracking-[0.12em] text-[#172033]" style={{ fontSize: resumeTypography.sectionHeadingCompact }}>Leadership Highlights</p><div className="grid grid-cols-2 gap-3">{data.achievements.map((item) => <article key={item.id} className="resume-item border-t-2 border-amber-500 bg-slate-50 p-3"><h3 className="font-bold text-[#172033]" style={{ fontSize: resumeTypography.body }}>{item.title}</h3><p className="mt-1 text-slate-600" style={{ fontSize: resumeTypography.body, lineHeight: resumeTypography.lineHeightBody }}>{item.description}</p></article>)}</div></section> : null}
        <div className="mt-5 space-y-4.5">{remaining.map((section) => <RenderSection key={section} id={section} data={data} variant="classic" />)}</div>
      </main>
    </div>
  );
}
