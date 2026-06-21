import type { ResumeTemplateProps } from "@/types/resume";
import { Award, BriefcaseBusiness, CalendarDays, Camera, Folder, Globe, GraduationCap, Heart, Languages, Linkedin, Mail, MapPin, Palette, Phone, Star, UserRound, Wrench } from "lucide-react";
import { Watermark } from "./Watermark";
import { dateRange, hasItems, hasText } from "./template-utils";

export function CreativePortfolio({ data, isWatermarked }: ResumeTemplateProps) {
  const initials = (data.personal.fullName || "RC").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  const contacts = [
    { icon: Mail, value: data.personal.email },
    { icon: Phone, value: data.personal.phone },
    { icon: MapPin, value: data.personal.location },
    { icon: Globe, value: data.personal.website },
    { icon: Linkedin, value: data.personal.linkedin },
    { icon: Palette, value: data.personal.portfolio },
  ].filter((item) => hasText(item.value));
  const [firstName, ...restName] = (data.personal.fullName || "Your Name").split(" ");

  return (
    <div className="resume-page grid grid-cols-[0.3fr_0.7fr] bg-white font-[Arial] text-[#111827]">
      <Watermark show={isWatermarked} />
      <aside className="bg-[#fbf9ff] text-[#111827]">
        <div className="relative mb-7 bg-[#5a3ea6] px-[8mm] pb-[17mm] pt-[7mm]">
          <div className="mx-auto h-[43mm] w-[43mm] overflow-hidden rounded-full border-[2.5px] border-white bg-white/15">
            {hasText(data.personal.photoUrl) ? (
              <img src={data.personal.photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[20pt] font-bold text-white">{initials || "RC"}</div>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-[-1px] h-[18mm] bg-[#fbf9ff]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
        </div>

        <div className="px-[7.5mm] pb-[8mm]">
          {hasItems(data.education) ? (
            <SidebarSection icon={GraduationCap} title="Education">
              <div className="space-y-4">
                {data.education.filter((item) => hasText(item.degree) || hasText(item.institution)).map((item) => (
                  <article key={item.id} className="avoid-break border-b border-[#e8e2fb] pb-3 last:border-b-0 last:pb-0">
                    <h3 className="text-[10pt] font-bold leading-[1.28] text-[#111827]">{[item.degree, item.field].filter(hasText).join(" in ")}</h3>
                    <p className="mt-1 text-[10pt] font-semibold leading-[1.35] text-[#5a3ea6]">{[item.institution, item.location].filter(hasText).join(", ")}</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[10pt] font-semibold text-[#475569]"><CalendarDays size={9} aria-hidden="true" />{dateRange(item.startDate, item.endDate)}</p>
                  </article>
                ))}
              </div>
            </SidebarSection>
          ) : null}

          {hasItems(data.skills) ? (
            <SidebarSection icon={Wrench} title="Skills">
              <div className="space-y-2.1">
                {data.skills.filter((skill) => hasText(skill.name)).map((skill) => (
                  <div key={skill.id} className="avoid-break grid grid-cols-[0.75fr_1fr] items-center gap-2">
                    <p className="text-[10pt] leading-[1.15] text-[#111827]">{skill.name}</p>
                    <div className="relative h-[3.2px] rounded-full bg-[#d7d4dd]">
                      <div className="h-full rounded-full bg-[#5a3ea6]" style={{ width: `${skillProgress(skill.level)}%` }} />
                      <span className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-[#5a3ea6] bg-white" style={{ left: `calc(${skillProgress(skill.level)}% - 4px)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </SidebarSection>
          ) : null}

          {hasItems(data.skills) ? (
            <SidebarSection icon={Palette} title="Tools">
              <div className="grid grid-cols-3 gap-2">
                {data.skills.filter((skill) => hasText(skill.name)).slice(0, 12).map((skill) => (
                  <span key={skill.id} className="rounded-md border border-[#cfc7ec] bg-white px-2 py-1 text-center text-[10pt] font-semibold text-[#111827]">{skill.name}</span>
                ))}
              </div>
            </SidebarSection>
          ) : null}

          {hasItems(data.languages) ? (
            <SidebarSection icon={Languages} title="Languages">
              <div className="space-y-1.8">
                {data.languages.filter((language) => hasText(language.name)).map((language) => (
                  <div key={language.id} className="grid grid-cols-[0.74fr_1fr] items-center gap-2 text-[10pt]">
                    <p className="font-semibold text-[#111827]">{language.name}</p>
                    <DotRating level={language.level} />
                  </div>
                ))}
              </div>
            </SidebarSection>
          ) : null}

          {hasItems(data.certificates) ? (
            <SidebarSection icon={Award} title="Certifications">
              <div className="space-y-2 text-[10pt] leading-[1.38]">
                {data.certificates.filter((cert) => hasText(cert.name)).map((cert) => (
                  <p key={cert.id} className="avoid-break">
                    <span className="font-bold text-[#111827]">- {cert.name}</span><br />
                    <span className="pl-2 text-[#475569]">{[cert.issuer, cert.date].filter(hasText).join(", ")}</span>
                  </p>
                ))}
              </div>
            </SidebarSection>
          ) : null}

          <SidebarSection icon={Heart} title="Interests">
            <div className="grid grid-cols-4 gap-2 text-center text-[10pt] font-semibold text-[#111827]">
              {[
                [Camera, "Portfolio"],
                [Palette, "Design"],
                [Globe, "Research"],
                [Heart, "Reading"],
              ].map(([Icon, label]) => (
                <div key={String(label)} className="space-y-1">
                  <Icon size={15} className="mx-auto text-[#5a3ea6]" aria-hidden="true" />
                  <p>{String(label)}</p>
                </div>
              ))}
            </div>
          </SidebarSection>
        </div>
      </aside>

      <main className="px-[11mm] py-[8.5mm]">
        <header>
          <h1 className="text-[24pt] font-bold uppercase leading-none tracking-[0.02em] text-[#111827]">
            {firstName || "Your"} <span className="text-[#5a3ea6]">{restName.join(" ") || "Name"}</span>
          </h1>
          {hasText(data.personal.jobTitle) ? <p className="mt-3 text-[12pt] font-bold uppercase tracking-[0.24em] text-[#5a3ea6]">{data.personal.jobTitle}</p> : null}
          {hasText(data.summary) ? <p className="mt-4 max-w-[150mm] text-[10.5pt] leading-[1.5] text-[#111827]">{data.summary}</p> : null}
          <div className="mt-5 h-px bg-[#9b86d9]" />
          <div className="mt-4 grid grid-cols-3 gap-x-6 gap-y-3">
            {contacts.map(({ icon: Icon, value }) => (
              <div key={value} className="flex min-w-0 items-center gap-2 text-[10pt] font-semibold text-[#111827]">
                <Icon size={11} className="shrink-0 text-[#5a3ea6]" aria-hidden="true" />
                <span className="break-words">{value}</span>
              </div>
            ))}
          </div>
        </header>

        {hasItems(data.experience) ? (
          <MainSection icon={BriefcaseBusiness} title="Experience">
            <Timeline>
              {data.experience.filter((item) => hasText(item.role) || hasText(item.company)).map((item) => (
                <TimelineItem key={item.id}>
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <h3 className="text-[11pt] font-bold text-[#111827]">{item.role}</h3>
                      {hasText(item.company) ? <p className="mt-1 text-[10pt] font-bold text-[#5a3ea6]">{item.company}</p> : null}
                    </div>
                    <div className="shrink-0 text-right text-[10pt] font-semibold text-[#111827]">
                      <p>{dateRange(item.startDate, item.endDate, item.isCurrent)}</p>
                      {hasText(item.location) ? <p className="mt-1 text-[#5a3ea6]">{item.location}</p> : null}
                    </div>
                  </div>
                  {hasText(item.description) ? <p className="mt-1.5 text-[10pt] leading-[1.38] text-[#111827]">{item.description}</p> : null}
                  {item.bullets.some(hasText) ? <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[10pt] leading-[1.38] text-[#111827]">{item.bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                </TimelineItem>
              ))}
            </Timeline>
          </MainSection>
        ) : null}

        {hasItems(data.projects) ? (
          <MainSection icon={Folder} title="Projects">
            <div className="grid grid-cols-3 gap-3">
              {data.projects.filter((project) => hasText(project.name)).slice(0, 3).map((project, index) => (
                <article key={project.id} className="avoid-break rounded-md border border-[#e0daf5] bg-[#fbf9ff] p-3">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5a3ea6] text-white">{index + 1}</span>
                    {hasText(project.role) ? <span className="text-[10pt] font-bold text-[#5a3ea6]">{project.role}</span> : null}
                  </div>
                  <h3 className="text-[10pt] font-bold text-[#111827]">{project.name}</h3>
                  {hasText(project.description) ? <p className="mt-2 text-[10pt] leading-[1.4] text-[#111827]">{project.description}</p> : null}
                  {project.bullets.some(hasText) ? <p className="mt-3 w-fit rounded-full border border-[#5a3ea6] px-2 py-0.5 text-[10pt] font-bold text-[#5a3ea6]">{project.bullets.filter(hasText)[0]}</p> : null}
                </article>
              ))}
            </div>
          </MainSection>
        ) : null}

        {hasItems(data.achievements) ? (
          <MainSection icon={Star} title="Achievements">
            <div className="grid grid-cols-4 gap-3 text-center">
              {data.achievements.filter((achievement) => hasText(achievement.title)).slice(0, 4).map((achievement, index) => (
                <article key={achievement.id} className="avoid-break border-r border-[#d8cff5] px-2 last:border-r-0">
                  <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#5a3ea6] text-white">
                    {index === 0 ? <Award size={15} /> : index === 1 ? <Star size={15} /> : index === 2 ? <UserRound size={15} /> : <Heart size={15} />}
                  </span>
                  <h3 className="mt-2 text-[10pt] font-bold text-[#111827]">{achievement.title}</h3>
                  {hasText(achievement.description) ? <p className="mt-1 text-[10pt] leading-[1.28] text-[#111827]">{achievement.description}</p> : null}
                </article>
              ))}
            </div>
          </MainSection>
        ) : null}

        {hasItems(data.certificates) ? (
          <MainSection icon={Award} title="Certifications">
            <div className="grid grid-cols-2 gap-2">
              {data.certificates.filter((cert) => hasText(cert.name)).map((cert) => (
                <p key={cert.id} className="avoid-break rounded-md border border-[#e0daf5] px-3 py-2 text-[10pt] leading-[1.35]">
                  <span className="font-bold text-[#111827]">{cert.name}</span><br />
                  <span className="text-[#475569]">{[cert.issuer, cert.date].filter(hasText).join(" | ")}</span>
                </p>
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
    <section className="resume-section py-3.5">
      <div className="mb-3 grid grid-cols-[22px_auto_1fr] items-center gap-2">
        <span className="inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[#5a3ea6] text-white"><Icon size={12} aria-hidden="true" /></span>
        <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em] text-[#5a3ea6]">{title}</h2>
        <div className="h-px bg-[#b8abd9]" />
      </div>
      {children}
    </section>
  );
}

function MainSection({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section pt-5">
      <div className="mb-3 grid grid-cols-[27px_auto_1fr] items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#5a3ea6] text-white"><Icon size={13} aria-hidden="true" /></span>
        <h2 className="text-[12pt] font-bold uppercase tracking-[0.06em] text-[#5a3ea6]">{title}</h2>
        <div className="h-px bg-[#9b86d9]" />
      </div>
      {children}
    </section>
  );
}

function Timeline({ children }: { children: React.ReactNode }) {
  return <div className="relative space-y-4 pl-7 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-[#cfc5ee]">{children}</div>;
}

function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <article className="avoid-break resume-item relative">
      <span className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full bg-[#5a3ea6] ring-2 ring-white" />
      {children}
    </article>
  );
}

function DotRating({ level }: { level: string }) {
  const count = Math.max(2, Math.min(5, Math.round(skillProgress(level) / 18)));
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => <span key={index} className={`h-1.5 w-1.5 rounded-full ${index < count ? "bg-[#5a3ea6]" : "bg-[#d8d4e5]"}`} />)}
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
