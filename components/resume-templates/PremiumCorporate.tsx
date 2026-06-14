import type { ResumeData, ResumeTemplateProps } from "@/types/resume";
import { Award, BriefcaseBusiness, CheckCircle2, Globe, GraduationCap, Languages, Linkedin, Mail, MapPin, Phone, Star, UserRound, Wrench } from "lucide-react";
import { Watermark } from "./Watermark";
import { dateRange, hasItems, hasText } from "./template-utils";

const accent = "#0b7b7f";

export function PremiumCorporate({ data, isWatermarked }: ResumeTemplateProps) {
  const initials = (data.personal.fullName || "RC").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  const contact = [
    { icon: Mail, value: data.personal.email },
    { icon: Phone, value: data.personal.phone },
    { icon: MapPin, value: data.personal.location },
    { icon: Globe, value: data.personal.website },
    { icon: Linkedin, value: data.personal.linkedin },
  ].filter((item) => hasText(item.value));

  return (
    <div className="resume-page grid grid-cols-[0.315fr_0.685fr] bg-white font-[Arial] text-[#0c1830]">
      <Watermark show={isWatermarked} />
      <aside className="bg-[#002b3d] bg-[linear-gradient(145deg,#01283a_0%,#003d4f_48%,#012538_100%)] px-[8.5mm] py-[9mm] text-white">
        <div className="mb-7 overflow-hidden rounded-[9px] border-[2px] border-white/80 bg-white/10 shadow-sm">
          {hasText(data.personal.photoUrl) ? (
            <img src={data.personal.photoUrl} alt="" className="h-[44mm] w-full object-cover" />
          ) : (
            <div className="flex h-[44mm] items-center justify-center bg-white/10 text-[28px] font-bold tracking-normal text-teal-100">{initials || "RC"}</div>
          )}
        </div>

        <SidebarSection icon={UserRound} title="Contact">
          <div className="space-y-2.5">
            {contact.map(({ icon: Icon, value }) => (
              <div key={value} className="grid grid-cols-[14px_1fr] gap-3 text-[9.5px] leading-[1.35] text-white/90">
                <Icon size={12} className="mt-0.5 text-white" aria-hidden="true" />
                <p className="break-words">{value}</p>
              </div>
            ))}
          </div>
        </SidebarSection>

        {hasItems(data.skills) ? (
          <SidebarSection icon={Wrench} title="Skills">
            <div className="space-y-2.5">
              {data.skills.filter((skill) => hasText(skill.name)).map((skill, index) => (
                <div key={skill.id} className="grid grid-cols-[0.9fr_1fr] items-center gap-3">
                  <p className="break-words text-[9.5px] leading-[1.25] text-white/95">{skill.name}</p>
                  <div className="h-[3.5px] overflow-hidden rounded-full bg-white/25">
                    <div className="h-full rounded-full bg-[#27c5bd]" style={{ width: `${skillWidth(skill.level, index)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SidebarSection>
        ) : null}

        {hasItems(data.education) ? (
          <SidebarSection icon={GraduationCap} title="Education">
            <TimelineList>
              {data.education.filter((item) => hasText(item.degree) || hasText(item.institution)).map((item) => (
                <SidebarTimelineItem key={item.id}>
                  <p className="font-bold text-white">{[item.degree, item.field].filter(hasText).join(" in ")}</p>
                  <p className="mt-1 italic text-white/80">{item.institution}</p>
                  <p className="mt-1 text-white/90">{[dateRange(item.startDate, item.endDate), item.location].filter(hasText).join("  |  ")}</p>
                </SidebarTimelineItem>
              ))}
            </TimelineList>
          </SidebarSection>
        ) : null}

        {hasItems(data.languages) ? (
          <SidebarSection icon={Languages} title="Languages">
            <div className="space-y-1.5">
              {data.languages.filter((language) => hasText(language.name)).map((language) => (
                <p key={language.id} className="flex gap-2 text-[9.5px] leading-[1.35] text-white/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#27c5bd]" />
                  <span className="font-bold text-white">{language.name}</span>
                  {hasText(language.level) ? <span className="text-white/70">- {language.level}</span> : null}
                </p>
              ))}
            </div>
          </SidebarSection>
        ) : null}

        {hasItems(data.certificates) ? (
          <SidebarSection icon={Award} title="Certifications">
            <div className="space-y-2.5">
              {data.certificates.filter((cert) => hasText(cert.name)).map((cert) => (
                <div key={cert.id} className="grid grid-cols-[7px_1fr] gap-3 text-[9.5px] leading-[1.35]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#27c5bd]" />
                  <p><span className="font-bold text-white">{cert.name}</span><br /><span className="italic text-white/78">{[cert.issuer, cert.date].filter(hasText).join("  |  ")}</span></p>
                </div>
              ))}
            </div>
          </SidebarSection>
        ) : null}
      </aside>

      <main className="px-[13mm] py-[10.5mm]">
        <header>
          <h1 className="font-[Georgia] text-[32px] font-bold uppercase leading-none tracking-[0.08em] text-[#07162e]">
            {splitName(data.personal.fullName).first} <span className="text-[#0b7478]">{splitName(data.personal.fullName).last}</span>
          </h1>
          {hasText(data.personal.jobTitle) ? <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#0b7478]">{data.personal.jobTitle}</p> : null}
          <div className="mt-5 grid grid-cols-3 gap-x-5 gap-y-3">
            {contact.map(({ icon: Icon, value }) => (
              <div key={value} className="flex items-center gap-2 text-[9px] font-semibold text-[#26324a]">
                <Icon size={11} className="shrink-0 text-[#0b7478]" aria-hidden="true" />
                <span className="break-words">{value}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="mt-5 h-px bg-[#7b8a9c]" />

        {hasText(data.summary) ? (
          <MainSection icon={UserRound} title="Professional Summary">
            <p className="text-[10.4px] leading-[1.5] text-[#18233a]">{data.summary}</p>
          </MainSection>
        ) : null}

        {hasItems(data.experience) ? (
          <MainSection icon={BriefcaseBusiness} title="Experience">
            <div className="relative space-y-4 pl-7 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-[#0b7478]">
              {data.experience.filter((item) => hasText(item.role) || hasText(item.company)).map((item) => (
                <article key={item.id} className="avoid-break resume-item relative">
                  <span className="absolute -left-[24px] top-1 h-2.5 w-2.5 rounded-full bg-[#0b7478] ring-2 ring-white" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-[11px] font-bold text-[#0c1830]">{item.role}</h3>
                      {hasText(item.company) ? <p className="mt-0.5 text-[9.5px] font-bold text-[#0b7478]">{item.company}</p> : null}
                    </div>
                    <p className="shrink-0 text-right text-[9px] font-semibold text-[#4d5b70]">{dateRange(item.startDate, item.endDate, item.isCurrent)}</p>
                  </div>
                  {hasText(item.description) ? <p className="mt-1.5 text-[9.7px] leading-[1.45] text-[#26324a]">{item.description}</p> : null}
                  {item.bullets.some(hasText) ? <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[9.7px] leading-[1.42] text-[#18233a]">{item.bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                </article>
              ))}
            </div>
          </MainSection>
        ) : null}

        {(hasItems(data.projects) || hasItems(data.achievements)) ? (
          <MainSection icon={Star} title="Projects & Achievements">
            <div className="space-y-3">
              {data.projects.filter((project) => hasText(project.name)).map((project) => (
                <ProjectRow key={project.id} title={project.name} badge={project.role} description={project.description} bullets={project.bullets} />
              ))}
              {data.achievements.filter((achievement) => hasText(achievement.title)).map((achievement) => (
                <ProjectRow key={achievement.id} title={achievement.title} description={achievement.description} />
              ))}
            </div>
          </MainSection>
        ) : null}

        {hasItems(data.certificates) ? (
          <MainSection icon={Award} title="Certifications & Training">
            <div className="grid grid-cols-3 gap-4">
              {data.certificates.filter((cert) => hasText(cert.name)).slice(0, 3).map((cert) => (
                <div key={cert.id} className="avoid-break grid grid-cols-[13px_1fr] gap-2 text-[9px] leading-[1.35]">
                  <CheckCircle2 size={11} className="mt-0.5 text-[#27a9a4]" aria-hidden="true" />
                  <p><span className="font-bold text-[#0c1830]">{cert.name}</span><br /><span className="text-[#4d5b70]">{[cert.issuer, cert.date].filter(hasText).join(" | ")}</span></p>
                </div>
              ))}
            </div>
          </MainSection>
        ) : null}
      </main>
    </div>
  );
}

function SidebarSection({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section border-b border-white/35 py-4 last:border-b-0">
      <div className="mb-3 flex items-center gap-3">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#078180] text-white"><Icon size={12} aria-hidden="true" /></span>
        <h2 className="font-[Georgia] text-[13px] font-bold uppercase tracking-[0.06em] text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MainSection({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section border-b border-[#98a6b5] py-5 last:border-b-0">
      <div className="mb-3 flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#087c7f] text-white"><Icon size={14} aria-hidden="true" /></span>
        <h2 className="font-[Georgia] text-[13.5px] font-bold uppercase tracking-[0.04em] text-[#07162e]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TimelineList({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

function SidebarTimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7px_1fr] gap-3 text-[9.5px] leading-[1.35]">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#27c5bd]" />
      <div>{children}</div>
    </div>
  );
}

function ProjectRow({ title, badge, description, bullets = [] }: { title: string; badge?: string; description: string; bullets?: string[] }) {
  return (
    <article className="avoid-break grid grid-cols-[34px_1fr_auto] gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6f0f1] text-[#0b7478]">
        <Star size={15} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h3 className="text-[10.5px] font-bold text-[#0c1830]">{title}</h3>
        {hasText(description) ? <p className="mt-1 text-[9.5px] leading-[1.4] text-[#26324a]">{description}</p> : null}
        {bullets.some(hasText) ? <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[9.3px] leading-[1.35] text-[#26324a]">{bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
      </div>
      {hasText(badge) ? <span className="h-fit rounded-md bg-[#e6f0f1] px-2 py-1 text-[8.5px] font-bold text-[#26324a]">{badge}</span> : null}
    </article>
  );
}

function skillWidth(level: string, index: number) {
  const normalized = level.toLowerCase();
  if (normalized.includes("expert") || normalized.includes("native")) return 88;
  if (normalized.includes("advanced") || normalized.includes("fluent")) return 78;
  if (normalized.includes("intermediate") || normalized.includes("conversational")) return 68;
  if (normalized.includes("beginner")) return 46;
  return [86, 80, 74, 70, 76, 68][index % 6];
}

function splitName(name: string) {
  const parts = (name || "Your Name").trim().split(/\s+/);
  if (parts.length <= 1) return { first: parts[0] || "Your", last: "Name" };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}
