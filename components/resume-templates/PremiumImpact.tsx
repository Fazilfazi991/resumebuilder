import type { ResumeTemplateProps } from "@/types/resume";
import { Award, BriefcaseBusiness, CalendarDays, Globe, GraduationCap, Languages, Linkedin, Mail, MapPin, Phone, Settings, Star, Trophy, UserRound, Users, Wrench } from "lucide-react";
import { Watermark } from "./Watermark";
import { dateRange, hasItems, hasText } from "./template-utils";

export function PremiumImpact({ data, isWatermarked }: ResumeTemplateProps) {
  const initials = (data.personal.fullName || "RC").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  const contactItems = [
    { icon: Mail, value: data.personal.email },
    { icon: Phone, value: data.personal.phone },
    { icon: MapPin, value: data.personal.location },
    { icon: Globe, value: data.personal.website },
    { icon: Linkedin, value: data.personal.linkedin },
  ].filter((item) => hasText(item.value));
  const stats = [
    { icon: Trophy, value: data.experience.length ? `${data.experience.length}+` : "", label: "Experience Roles" },
    { icon: BriefcaseBusiness, value: data.projects.length ? `${data.projects.length}+` : "", label: "Projects" },
    { icon: Users, value: data.skills.length ? `${data.skills.length}+` : "", label: "Key Skills" },
    { icon: Award, value: data.certificates.length ? `${data.certificates.length}+` : "", label: "Certifications" },
  ].filter((item) => hasText(item.value));

  return (
    <div className="resume-page grid grid-cols-[0.3fr_0.7fr] bg-white font-[Arial] text-[#111827]">
      <Watermark show={isWatermarked} />
      <aside className="bg-[#0b1f2a] px-[8mm] py-[8.5mm] text-white">
        <div className="mb-7 flex justify-center">
          <div className="h-[43mm] w-[43mm] overflow-hidden rounded-full border-[2px] border-[#d6bd7a] bg-white/10">
            {hasText(data.personal.photoUrl) ? (
              <img src={data.personal.photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[22pt] font-bold text-[#d6bd7a]">{initials || "RC"}</div>
            )}
          </div>
        </div>

        <SidebarBlock icon={UserRound} title="Contact">
          <div className="space-y-2.5">
            {contactItems.map(({ icon: Icon, value }) => (
              <div key={value} className="grid grid-cols-[14px_1fr] gap-3 text-[10pt] leading-[1.35] text-white/92">
                <Icon size={12} className="mt-0.5 text-white" aria-hidden="true" />
                <p className="break-words">{value}</p>
              </div>
            ))}
          </div>
        </SidebarBlock>

        {hasItems(data.skills) ? (
          <SidebarBlock icon={Wrench} title="Skills">
            <div className="space-y-2.5">
              {data.skills.filter((skill) => hasText(skill.name)).map((skill) => (
                <div key={skill.id}>
                  <p className="text-[10pt] leading-[1.25] text-white">{skill.name}</p>
                  <div className="mt-1 h-[3.5px] overflow-hidden rounded-full bg-white/14">
                    <div className="h-full rounded-full bg-[#c8a45d]" style={{ width: `${skillProgress(skill.level)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SidebarBlock>
        ) : null}

        {hasItems(data.education) ? (
          <SidebarBlock icon={GraduationCap} title="Education">
            <div className="space-y-3.5">
              {data.education.filter((item) => hasText(item.degree) || hasText(item.institution)).map((item) => (
                <div key={item.id} className="avoid-break text-[10pt] leading-[1.35]">
                  <p className="font-bold text-white">{[item.degree, item.field].filter(hasText).join(" in ")}</p>
                  <p className="mt-1 text-white/82">{item.institution}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-white/78"><CalendarDays size={10} aria-hidden="true" />{[dateRange(item.startDate, item.endDate), item.location].filter(hasText).join(" | ")}</p>
                </div>
              ))}
            </div>
          </SidebarBlock>
        ) : null}

        {hasItems(data.languages) ? (
          <SidebarBlock icon={Languages} title="Languages">
            <div className="space-y-1.5">
              {data.languages.filter((language) => hasText(language.name)).map((language) => (
                <div key={language.id} className="grid grid-cols-[0.72fr_1fr] items-center gap-2 text-[10pt]">
                  <p className="font-bold text-white">{language.name}</p>
                  <DotLevel level={language.level} />
                </div>
              ))}
            </div>
          </SidebarBlock>
        ) : null}

        {hasItems(data.certificates) ? (
          <SidebarBlock icon={Award} title="Certifications">
            <div className="space-y-2.5 text-[10pt] leading-[1.4]">
              {data.certificates.filter((cert) => hasText(cert.name)).map((cert) => (
                <p key={cert.id} className="avoid-break">
                  <span className="font-bold text-white">{cert.name}</span><br />
                  <span className="text-white/78">{[cert.issuer, cert.date].filter(hasText).join(", ")}</span>
                </p>
              ))}
            </div>
          </SidebarBlock>
        ) : null}
      </aside>

      <main className="px-[12mm] py-[10mm]">
        <header className="text-center">
          <h1 className="font-[Georgia] text-[24pt] font-bold uppercase leading-none tracking-[0.11em] text-[#0b1f2a]">{data.personal.fullName || "Your Name"}</h1>
          {hasText(data.personal.jobTitle) ? <p className="mt-3 text-[13pt] font-bold uppercase tracking-[0.28em] text-[#b99245]">{data.personal.jobTitle}</p> : null}
          <div className="mx-auto mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#d6c7a1]" />
            <span className="h-2.5 w-2.5 rotate-45 bg-[#c8a45d]" />
            <div className="h-px flex-1 bg-[#d6c7a1]" />
          </div>
          {stats.length ? (
            <div className="mt-5 grid grid-cols-4 divide-x divide-[#d6c7a1]">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="px-3 text-center">
                  <Icon size={15} className="mx-auto text-[#0b1f2a]" aria-hidden="true" />
                  <p className="mt-1 text-[12pt] font-bold text-[#0b1f2a]">{value}</p>
                  <p className="mt-0.5 text-[10pt] font-bold uppercase leading-[1.25] text-[#111827]">{label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </header>

        {hasText(data.summary) ? (
          <MainBlock icon={UserRound} title="Professional Summary">
            <p className="text-[10.5pt] leading-[1.55] text-[#111827]">{data.summary}</p>
          </MainBlock>
        ) : null}

        {hasItems(data.experience) ? (
          <MainBlock icon={BriefcaseBusiness} title="Experience">
            <Timeline>
              {data.experience.filter((item) => hasText(item.role) || hasText(item.company)).map((item) => (
                <TimelineItem key={item.id}>
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <h3 className="text-[11pt] font-bold text-[#0b1f2a]">{item.role}</h3>
                      <p className="mt-0.5 text-[10pt] font-bold text-[#b99245]">{[item.company, item.location].filter(hasText).join(", ")}</p>
                    </div>
                    <p className="shrink-0 text-right text-[10pt] font-semibold text-[#111827]">{dateRange(item.startDate, item.endDate, item.isCurrent)}</p>
                  </div>
                  {hasText(item.description) ? <p className="mt-1.5 text-[10pt] leading-[1.42] text-[#111827]">{item.description}</p> : null}
                  {item.bullets.some(hasText) ? <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[10pt] leading-[1.42] text-[#111827]">{item.bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                </TimelineItem>
              ))}
            </Timeline>
          </MainBlock>
        ) : null}

        {(hasItems(data.projects) || hasItems(data.achievements)) ? (
          <MainBlock icon={Star} title="Projects & Achievements">
            <Timeline>
              {data.projects.filter((project) => hasText(project.name)).map((project) => (
                <TimelineItem key={project.id}>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[11pt] font-bold text-[#0b1f2a]">{project.name}</h3>
                    {hasText(project.role) ? <span className="rounded-md border border-[#c8a45d] px-2 py-0.5 text-[10pt] font-bold text-[#b99245]">{project.role}</span> : null}
                  </div>
                  {hasText(project.description) ? <p className="mt-1 text-[10pt] leading-[1.42] text-[#111827]">{project.description}</p> : null}
                  {project.bullets.some(hasText) ? <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[10pt] leading-[1.35]">{project.bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                </TimelineItem>
              ))}
              {data.achievements.filter((achievement) => hasText(achievement.title)).map((achievement) => (
                <TimelineItem key={achievement.id}>
                  <h3 className="text-[11pt] font-bold text-[#0b1f2a]">{achievement.title}</h3>
                  {hasText(achievement.description) ? <p className="mt-1 text-[10pt] leading-[1.42] text-[#111827]">{achievement.description}</p> : null}
                </TimelineItem>
              ))}
            </Timeline>
          </MainBlock>
        ) : null}

        {hasItems(data.skills) ? (
          <MainBlock icon={Settings} title="Tools & Technologies">
            <div className="grid grid-cols-4 gap-2">
              {data.skills.filter((skill) => hasText(skill.name)).map((skill) => (
                <span key={skill.id} className="rounded-md border border-slate-300 px-2 py-1.5 text-center text-[10pt] font-semibold text-[#111827]">{skill.name}</span>
              ))}
            </div>
          </MainBlock>
        ) : null}
      </main>
    </div>
  );
}

function SidebarBlock({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section py-4">
      <div className="mb-3 flex items-center gap-2 border-b border-[#c8a45d] pb-1.5">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#c8a45d] text-[#0b1f2a]"><Icon size={12} aria-hidden="true" /></span>
        <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em] text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MainBlock({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section pt-5">
      <div className="mb-3 grid grid-cols-[27px_auto_1fr] items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0b1f2a] text-white"><Icon size={13} aria-hidden="true" /></span>
        <h2 className="text-[12pt] font-bold uppercase tracking-[0.06em] text-[#0b1f2a]">{title}</h2>
        <div className="h-px bg-[#d6c7a1]" />
      </div>
      {children}
    </section>
  );
}

function Timeline({ children }: { children: React.ReactNode }) {
  return <div className="relative space-y-4 pl-7 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-[#d6c7a1]">{children}</div>;
}

function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <article className="avoid-break resume-item relative">
      <span className="absolute -left-[24px] top-1 h-3 w-3 rounded-full bg-[#c8a45d] ring-2 ring-white" />
      {children}
    </article>
  );
}

function DotLevel({ level }: { level: string }) {
  const count = Math.max(2, Math.min(5, Math.round(skillProgress(level) / 18)));
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: 5 }).map((_, index) => <span key={index} className={`h-1.5 w-1.5 rounded-full ${index < count ? "bg-[#c8a45d]" : "bg-white/25"}`} />)}
    </div>
  );
}

function skillProgress(level: string) {
  const normalized = level.toLowerCase();
  if (normalized.includes("beginner")) return 35;
  if (normalized.includes("intermediate") || normalized.includes("conversational")) return 55;
  if (normalized.includes("advanced") || normalized.includes("fluent")) return 75;
  if (normalized.includes("expert") || normalized.includes("native")) return 90;
  return 70;
}
