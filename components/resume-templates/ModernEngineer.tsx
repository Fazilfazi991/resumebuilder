import type { ResumeTemplateProps } from "@/types/resume";
import { Award, BriefcaseBusiness, CalendarDays, ExternalLink, Folder, Github, Globe, GraduationCap, Heart, Languages, Linkedin, Mail, MapPin, Phone, Star, UserRound, Wrench } from "lucide-react";
import { Watermark } from "./Watermark";
import { dateRange, hasItems, hasText } from "./template-utils";

export function ModernEngineer({ data, isWatermarked }: ResumeTemplateProps) {
  const initials = (data.personal.fullName || "RC").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  const contacts = [
    { icon: Mail, value: data.personal.email },
    { icon: Phone, value: data.personal.phone },
    { icon: MapPin, value: data.personal.location },
    { icon: Globe, value: data.personal.website },
    { icon: Linkedin, value: data.personal.linkedin },
    { icon: Github, value: data.personal.portfolio },
  ].filter((item) => hasText(item.value));

  return (
    <div className="resume-page grid grid-cols-[0.29fr_0.71fr] bg-[#fbfbfa] font-[Arial] text-[#111827]">
      <Watermark show={isWatermarked} />
      <aside className="bg-[#4b5f48] px-[7.8mm] py-[8mm] text-white">
        <div className="mb-7 flex justify-center">
          <div className="h-[42mm] w-[42mm] overflow-hidden rounded-full border-[2px] border-white bg-white/12">
            {hasText(data.personal.photoUrl) ? (
              <img src={data.personal.photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[20pt] font-bold text-white">{initials || "RC"}</div>
            )}
          </div>
        </div>

        <SidebarSection icon={UserRound} title="Contact">
          <div className="space-y-2.5">
            {contacts.map(({ icon: Icon, value }) => (
              <div key={value} className="grid grid-cols-[13px_1fr] gap-3 text-[10pt] leading-[1.35] text-white/92">
                <Icon size={11} className="mt-0.5 text-white" aria-hidden="true" />
                <p className="break-words">{value}</p>
              </div>
            ))}
          </div>
        </SidebarSection>

        {hasItems(data.skills) ? (
          <SidebarSection icon={Wrench} title="Skills">
            <div className="space-y-2.1">
              {data.skills.filter((skill) => hasText(skill.name)).map((skill) => (
                <div key={skill.id} className="avoid-break">
                  <p className="text-[10pt] leading-[1.15] text-white">{skill.name}</p>
                  <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-[#394736]">
                    <div className="h-full rounded-full bg-[#e7ddb8]" style={{ width: `${skillProgress(skill.level)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SidebarSection>
        ) : null}

        {hasItems(data.education) ? (
          <SidebarSection icon={GraduationCap} title="Education">
            <div className="space-y-3">
              {data.education.filter((item) => hasText(item.degree) || hasText(item.institution)).map((item) => (
                <div key={item.id} className="avoid-break border-b border-white/12 pb-2.5 last:border-b-0 last:pb-0">
                  <p className="text-[10pt] font-bold leading-[1.25] text-white">{[item.degree, item.field].filter(hasText).join(" in ")}</p>
                  <p className="mt-1 text-[10pt] leading-[1.3] text-white/86">{item.institution}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[10pt] text-white/78"><CalendarDays size={9} aria-hidden="true" />{[dateRange(item.startDate, item.endDate), item.location].filter(hasText).join(" | ")}</p>
                </div>
              ))}
            </div>
          </SidebarSection>
        ) : null}

        {hasItems(data.languages) ? (
          <SidebarSection icon={Languages} title="Languages">
            <div className="space-y-1.5">
              {data.languages.filter((language) => hasText(language.name)).map((language) => (
                <div key={language.id} className="grid grid-cols-[0.7fr_1fr] items-center gap-2 text-[10pt]">
                  <p className="font-semibold text-white">{language.name}</p>
                  <DotRating level={language.level} />
                </div>
              ))}
            </div>
          </SidebarSection>
        ) : null}

        {hasItems(data.certificates) ? (
          <SidebarSection icon={Award} title="Certifications">
            <div className="space-y-2 text-[10pt] leading-[1.35] text-white/9">
              {data.certificates.filter((cert) => hasText(cert.name)).map((cert) => (
                <p key={cert.id} className="avoid-break">
                  <span className="text-white">- {cert.name}</span><br />
                  <span className="pl-2 text-white/78">{[cert.issuer, cert.date].filter(hasText).join(", ")}</span>
                </p>
              ))}
            </div>
          </SidebarSection>
        ) : null}
      </aside>

      <main className="px-[11mm] py-[9mm]">
        <header>
          <h1 className="font-[Georgia] text-[24pt] font-bold leading-none tracking-normal text-[#20262f]">{data.personal.fullName || "Your Name"}</h1>
          {hasText(data.personal.jobTitle) ? <p className="mt-3 text-[12pt] font-bold uppercase tracking-[0.28em] text-[#5e6f52]">{data.personal.jobTitle}</p> : null}
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#c9d1c3]" />
            <span className="h-2 w-2 rotate-45 bg-[#5e6f52]" />
            <div className="h-px flex-1 bg-[#c9d1c3]" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-x-5 gap-y-3">
            {contacts.map(({ icon: Icon, value }) => (
              <div key={value} className="flex min-w-0 items-center gap-2 text-[10pt] font-semibold text-[#111827]">
                <Icon size={10.5} className="shrink-0 text-[#5e6f52]" aria-hidden="true" />
                <span className="break-words">{value}</span>
              </div>
            ))}
          </div>
        </header>

        {hasText(data.summary) ? (
          <MainSection icon={UserRound} title="Summary">
            <p className="text-[10.5pt] leading-[1.5] text-[#111827]">{data.summary}</p>
          </MainSection>
        ) : null}

        {hasItems(data.experience) ? (
          <MainSection icon={BriefcaseBusiness} title="Experience">
            <Timeline>
              {data.experience.filter((item) => hasText(item.role) || hasText(item.company)).map((item) => (
                <TimelineItem key={item.id}>
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <h3 className="text-[11pt] font-bold text-[#111827]">{item.role}</h3>
                      {hasText(item.company) ? <p className="mt-1 text-[10pt] font-bold text-[#5e6f52]">{item.company}</p> : null}
                    </div>
                    <div className="shrink-0 text-right text-[10pt] font-semibold text-[#111827]">
                      <p>{dateRange(item.startDate, item.endDate, item.isCurrent)}</p>
                      {hasText(item.location) ? <p className="mt-1 text-[#475569]">{item.location}</p> : null}
                    </div>
                  </div>
                  {hasText(item.description) ? <p className="mt-1.5 text-[10pt] leading-[1.4] text-[#111827]">{item.description}</p> : null}
                  {item.bullets.some(hasText) ? <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[10pt] leading-[1.38] text-[#111827]">{item.bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                </TimelineItem>
              ))}
            </Timeline>
          </MainSection>
        ) : null}

        {hasItems(data.projects) ? (
          <MainSection icon={Folder} title="Projects">
            <Timeline>
              {data.projects.filter((project) => hasText(project.name)).map((project) => (
                <TimelineItem key={project.id}>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[11pt] font-bold text-[#111827]">
                      {project.name}
                      {hasText(project.link) ? <ExternalLink size={10} className="ml-1.5 inline text-[#5e6f52]" aria-hidden="true" /> : null}
                    </h3>
                    {hasText(project.role) ? <span className="rounded bg-[#5e6f52] px-2 py-1 text-[10pt] font-bold text-white">{project.role}</span> : null}
                  </div>
                  {hasText(project.description) ? <p className="mt-1 text-[10pt] leading-[1.38] text-[#111827]">{project.description}</p> : null}
                  {project.bullets.some(hasText) ? <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[10pt] leading-[1.35] text-[#111827]">{project.bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                </TimelineItem>
              ))}
            </Timeline>
          </MainSection>
        ) : null}

        {hasItems(data.achievements) ? (
          <MainSection icon={Star} title="Achievements">
            <div className="grid grid-cols-3 gap-3">
              {data.achievements.filter((achievement) => hasText(achievement.title)).slice(0, 3).map((achievement, index) => (
                <article key={achievement.id} className="avoid-break rounded-md border border-[#e2e6de] bg-[#f7f8f5] p-3">
                  <div className="mb-2 text-[#5e6f52]">{index === 0 ? <Award size={20} /> : index === 1 ? <Wrench size={20} /> : <Heart size={20} />}</div>
                  <h3 className="text-[10pt] font-bold text-[#111827]">{achievement.title}</h3>
                  {hasText(achievement.description) ? <p className="mt-1 text-[10pt] leading-[1.35] text-[#111827]">{achievement.description}</p> : null}
                </article>
              ))}
            </div>
          </MainSection>
        ) : null}

        {hasItems(data.skills) ? (
          <MainSection icon={Wrench} title="Tools & Technologies">
            <div className="flex flex-wrap gap-1.5">
              {data.skills.filter((skill) => hasText(skill.name)).map((skill) => (
                <span key={skill.id} className="rounded-md border border-[#d1d5db] px-2.5 py-1 text-[10pt] font-semibold text-[#111827]">{skill.name}</span>
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
    <section className="resume-section border-b border-white/12 py-3.5 last:border-b-0">
      <div className="mb-3 flex items-center gap-2 border-b border-white/65 pb-1.5">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f0ead8] text-[#4b5f48]"><Icon size={11} aria-hidden="true" /></span>
        <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em] text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MainSection({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section pt-5">
      <div className="mb-3 grid grid-cols-[27px_auto_1fr] items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#5e6f52] text-white"><Icon size={13} aria-hidden="true" /></span>
        <h2 className="text-[12pt] font-bold uppercase tracking-[0.06em] text-[#111827]">{title}</h2>
        <div className="h-px bg-[#d1d5db]" />
      </div>
      {children}
    </section>
  );
}

function Timeline({ children }: { children: React.ReactNode }) {
  return <div className="relative space-y-4 pl-7 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-[#c9d1c3]">{children}</div>;
}

function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <article className="avoid-break resume-item relative">
      <span className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full bg-[#5e6f52] ring-2 ring-white" />
      {children}
    </article>
  );
}

function DotRating({ level }: { level: string }) {
  const count = Math.max(2, Math.min(5, Math.round(skillProgress(level) / 18)));
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => <span key={index} className={`h-1.5 w-1.5 rounded-full ${index < count ? "bg-white" : "border border-white/85"}`} />)}
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
