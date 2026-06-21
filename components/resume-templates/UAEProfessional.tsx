import type { ResumeTemplateProps } from "@/types/resume";
import { resumeTypography } from "./resume-typography";
import { hasText, RenderSection, SectionTitle, Watermark } from "./TemplateHelpers";

export function UAEProfessional({ data, sectionOrder, isWatermarked }: ResumeTemplateProps) {
  const sidebarSections = ["skills", "languages", "certificates", "references"];
  const mainSections = sectionOrder.filter((section) => !sidebarSections.includes(section));

  return (
    <div className="resume-page grid grid-cols-[0.32fr_0.68fr] font-[Arial] text-slate-900">
      <Watermark show={isWatermarked} />
      <aside className="bg-[#0b3f4a] px-[9mm] py-[13mm] text-white">
        <div className="mb-5 flex justify-center">
          {hasText(data.personal.photoUrl) ? (
            <img src={data.personal.photoUrl} alt="" className="h-[27mm] w-[27mm] rounded-full border-[3px] border-white object-cover" />
          ) : (
            <div className="flex h-[25mm] w-[25mm] items-center justify-center rounded-full border-2 border-teal-200 bg-teal-700 text-[20pt] font-bold">
              {(data.personal.fullName || "RC").slice(0, 1)}
            </div>
          )}
        </div>
        <h1 className="break-words font-sans font-bold leading-[1.15]" style={{ fontSize: resumeTypography.name }}>{data.personal.fullName || "Your Name"}</h1>
        <p className="mt-2 font-semibold uppercase tracking-[0.1em] text-teal-100" style={{ fontSize: resumeTypography.sectionHeadingCompact }}>{data.personal.jobTitle}</p>
        <section className="mt-6 space-y-2">
          <SectionTitle className="text-teal-100">Contact</SectionTitle>
          {[data.personal.email, data.personal.phone, data.personal.location, data.personal.linkedin, data.personal.portfolio].filter(hasText).map((item) => (
            <p key={item} className="break-words text-teal-50" style={{ fontSize: resumeTypography.contact, lineHeight: resumeTypography.lineHeightBody }}>{item}</p>
          ))}
        </section>
        <div className="mt-6 space-y-5">
          {sidebarSections.map((section) => (
            <RenderSection key={section} id={section} data={data} variant="uae" />
          ))}
        </div>
      </aside>
      <main className="px-[12mm] py-[14mm]">
        <div className="mb-6 flex items-center gap-3"><div className="h-px flex-1 bg-teal-700" /><span className="font-bold uppercase tracking-[0.12em] text-teal-800" style={{ fontSize: resumeTypography.meta }}>Professional Profile</span></div>
        <div className="space-y-4.5">
          {mainSections.map((section) => (
            <RenderSection key={section} id={section} data={data} variant="modern" />
          ))}
        </div>
      </main>
    </div>
  );
}
