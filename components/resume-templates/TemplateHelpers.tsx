import type { ResumeData } from "@/types/resume";
import { ContactLine } from "./ContactLine";
import { SkillList } from "./SkillList";
import { TemplateHeading } from "./TemplateHeading";
import { Watermark } from "./Watermark";
import { dateRange, hasItems, hasText } from "./template-utils";

export { ContactLine, Watermark, hasItems, hasText };

export function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-[10.5px] font-bold uppercase tracking-[0.16em] ${className}`}>{children}</h3>;
}

export function DateRange({ start, end, current }: { start: string; end: string; current?: boolean }) {
  return <span>{dateRange(start, end, current)}</span>;
}

export function RenderSection({ id, data, variant }: { id: string; data: ResumeData; variant: "classic" | "modern" | "uae" }) {
  const sidebar = variant === "uae";
  const tone = variant === "classic" ? "slate" : "teal";
  const body = sidebar ? "text-teal-50/90" : "text-slate-700";
  const muted = sidebar ? "text-teal-100/75" : "text-slate-500";
  const heading = (title: string) => sidebar ? <SectionTitle className="mb-2 text-teal-100">{title}</SectionTitle> : <TemplateHeading tone={tone}>{title}</TemplateHeading>;

  if (id === "summary" && hasText(data.summary)) return <section className="resume-section">{heading("Professional Summary")}<p className={`text-[10.25px] leading-[1.55] ${body}`}>{data.summary}</p></section>;

  if (id === "experience" && hasItems(data.experience)) return (
    <section className="resume-section">{heading("Professional Experience")}<div className="space-y-3.5">{data.experience.map((item) => (
      <article key={item.id} className="resume-item">
        <div className="flex items-start justify-between gap-5"><div className="min-w-0"><h4 className={`text-[11px] font-bold ${sidebar ? "text-white" : "text-slate-950"}`}>{item.role}</h4><p className={`text-[9.75px] font-semibold ${muted}`}>{[item.company, item.location].filter(hasText).join(" | ")}</p></div><p className={`shrink-0 text-right text-[9px] font-semibold ${muted}`}>{dateRange(item.startDate, item.endDate, item.isCurrent)}</p></div>
        {hasText(item.description) ? <p className={`mt-1 text-[9.75px] leading-[1.5] ${body}`}>{item.description}</p> : null}
        {item.bullets.some(hasText) ? <ul className={`mt-1.5 list-disc space-y-1 pl-4 text-[9.75px] leading-[1.45] ${body}`}>{item.bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
      </article>
    ))}</div></section>
  );

  if (id === "education" && hasItems(data.education)) return (
    <section className="resume-section">{heading("Education")}<div className="space-y-2.5">{data.education.map((item) => (
      <article key={item.id} className="resume-item"><div className="flex items-start justify-between gap-5"><div><h4 className={`text-[10.75px] font-bold ${sidebar ? "text-white" : "text-slate-950"}`}>{[item.degree, item.field].filter(hasText).join(" in ")}</h4><p className={`text-[9.75px] font-semibold ${muted}`}>{[item.institution, item.location].filter(hasText).join(" | ")}</p></div><p className={`shrink-0 text-[9px] font-semibold ${muted}`}>{dateRange(item.startDate, item.endDate)}</p></div>{hasText(item.grade) ? <p className={`mt-1 text-[9.5px] ${body}`}>{item.grade}</p> : null}{hasText(item.description) ? <p className={`mt-1 text-[9.5px] leading-[1.45] ${body}`}>{item.description}</p> : null}</article>
    ))}</div></section>
  );

  if (id === "skills" && hasItems(data.skills)) return <section className="resume-section">{heading("Core Skills")}<SkillList skills={data.skills} variant={sidebar ? "bars" : variant === "modern" ? "pills" : "plain"} /></section>;

  if (id === "languages" && hasItems(data.languages)) return <section className="resume-section">{heading("Languages")}<div className={`space-y-1.5 text-[9.75px] ${body}`}>{data.languages.map((language) => <p key={language.id} className="flex justify-between gap-3"><span className="font-semibold">{language.name}</span><span className={muted}>{language.level}</span></p>)}</div></section>;

  if (id === "projects" && hasItems(data.projects)) return (
    <section className="resume-section">{heading("Selected Projects")}<div className="space-y-3">{data.projects.map((project) => <article key={project.id} className="resume-item"><div className="flex flex-wrap items-baseline justify-between gap-2"><h4 className={`text-[10.75px] font-bold ${sidebar ? "text-white" : "text-slate-950"}`}>{project.name}</h4>{hasText(project.link) ? <span className={`text-[8.75px] ${muted}`}>{project.link}</span> : null}</div><p className={`text-[9.5px] font-semibold ${muted}`}>{project.role}</p>{hasText(project.description) ? <p className={`mt-1 text-[9.75px] leading-[1.45] ${body}`}>{project.description}</p> : null}{project.bullets.some(hasText) ? <ul className={`mt-1 list-disc space-y-1 pl-4 text-[9.5px] leading-[1.4] ${body}`}>{project.bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}</article>)}</div></section>
  );

  if (id === "certificates" && hasItems(data.certificates)) return <section className="resume-section">{heading("Certifications")}<div className={`space-y-2 text-[9.5px] leading-[1.4] ${body}`}>{data.certificates.map((cert) => <p key={cert.id} className="resume-item"><span className={`font-bold ${sidebar ? "text-white" : "text-slate-900"}`}>{cert.name}</span><br /><span className={muted}>{[cert.issuer, cert.date].filter(hasText).join(" | ")}</span></p>)}</div></section>;

  if (id === "achievements" && hasItems(data.achievements)) return <section className="resume-section">{heading("Key Achievements")}<div className="space-y-2">{data.achievements.map((achievement) => <div key={achievement.id} className={`resume-item border-l-2 pl-3 ${sidebar ? "border-teal-300" : "border-teal-600"}`}><p className={`text-[10px] font-bold ${sidebar ? "text-white" : "text-slate-950"}`}>{achievement.title}</p><p className={`mt-0.5 text-[9.5px] leading-[1.4] ${body}`}>{achievement.description}</p></div>)}</div></section>;

  if (id === "references" && hasItems(data.references)) return <section className="resume-section">{heading("References")}<div className={`space-y-1.5 text-[9.5px] ${body}`}>{data.references.map((reference) => <p key={reference.id} className="resume-item"><span className="font-bold">{reference.name}</span><br />{[reference.role, reference.company].filter(hasText).join(", ")}</p>)}</div></section>;

  return null;
}
