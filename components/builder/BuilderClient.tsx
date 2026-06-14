"use client";

import { A4Preview } from "@/components/app/A4Preview";
import { AppButton } from "@/components/app/AppButton";
import { TemplatePreviewModal } from "@/components/app/TemplatePreviewModal";
import { defaultResumeData, defaultSectionOrder } from "@/lib/resume/mock-data";
import { resumeTemplates } from "@/lib/resume/template-registry";
import type { ResumeData, ResumeSection } from "@/types/resume";
import {
  ArrowLeft,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Download,
  Eye,
  FileBadge,
  GripVertical,
  Languages,
  LayoutList,
  Link as LinkIcon,
  Plus,
  Save,
  School,
  Sparkles,
  Trash2,
  UserRound,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Tab = "sections" | "edit" | "preview";

const sections: { id: ResumeSection; label: string; icon: typeof UserRound }[] = [
  { id: "personal", label: "Personal Details", icon: UserRound },
  { id: "summary", label: "Summary", icon: LayoutList },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "education", label: "Education", icon: School },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "projects", label: "Projects", icon: LinkIcon },
  { id: "certificates", label: "Certificates", icon: FileBadge },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "references", label: "References", icon: BookOpen },
  { id: "customSections", label: "Custom Sections", icon: Plus },
];

export function BuilderClient() {
  const searchParams = useSearchParams();
  const initialTemplate = searchParams.get("template") ?? "modern-minimal";
  const [resumeTitle, setResumeTitle] = useState("Product Manager Resume");
  const [templateId, setTemplateId] = useState(initialTemplate);
  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [activeSection, setActiveSection] = useState<ResumeSection>("personal");
  const [mobileTab, setMobileTab] = useState<Tab>("edit");
  const [zoom, setZoom] = useState(88);
  const [isTemplatePreviewOpen, setIsTemplatePreviewOpen] = useState(false);
  const sectionOrder = useMemo(() => defaultSectionOrder, []);

  const setPersonal = (field: keyof ResumeData["personal"], value: string) => {
    setData((current) => ({ ...current, personal: { ...current.personal, [field]: value } }));
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="flex min-h-16 flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/dashboard" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600" aria-label="Back to dashboard">
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
            <input
              value={resumeTitle}
              onChange={(event) => setResumeTitle(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-transparent bg-slate-50 px-3 py-2 text-lg font-bold text-slate-950 outline-none focus:border-teal-300 focus:bg-white"
              aria-label="Resume title"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={templateId}
              onChange={(event) => setTemplateId(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-400"
              aria-label="Template selector"
            >
              {resumeTemplates.map((template) => (
                <option key={template.id} value={template.id}>{template.name} - {template.category} - {template.isPremium ? "Premium" : "Free"}</option>
              ))}
            </select>
            <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-sm font-bold text-emerald-700">
              <Save size={16} aria-hidden="true" />
              Saved
            </span>
            <AppButton variant="secondary" onClick={() => setIsTemplatePreviewOpen(true)}><Eye size={16} aria-hidden="true" /> Template Preview</AppButton>
            <AppButton><Download size={16} aria-hidden="true" /> Download PDF</AppButton>
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-slate-200 bg-white lg:hidden">
          {(["sections", "edit", "preview"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`py-3 text-sm font-bold capitalize ${mobileTab === tab ? "text-teal-700" : "text-slate-500"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[260px_minmax(420px,1fr)_minmax(420px,0.95fr)]">
        <aside className={`${mobileTab === "sections" ? "block" : "hidden"} border-r border-slate-200 bg-white p-4 lg:block`}>
          <div className="mb-4 rounded-lg bg-teal-50 p-4">
            <p className="text-sm font-bold text-teal-800">Builder sections</p>
            <p className="mt-1 text-xs leading-5 text-teal-700">Reorder support arrives with backend persistence.</p>
          </div>
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setMobileTab("edit");
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition ${
                    isActive ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <GripVertical size={14} className={isActive ? "text-teal-100" : "text-slate-300"} aria-hidden="true" />
                  <Icon size={17} aria-hidden="true" />
                  <span className="flex-1">{section.label}</span>
                  <Eye size={15} className={isActive ? "text-teal-100" : "text-slate-400"} aria-hidden="true" />
                </button>
              );
            })}
          </nav>
        </aside>

        <section className={`${mobileTab === "edit" ? "block" : "hidden"} overflow-y-auto p-4 lg:block lg:p-6`}>
          <div className="mx-auto max-w-3xl">
            <EditorPanel activeSection={activeSection} data={data} setData={setData} setPersonal={setPersonal} />
          </div>
        </section>

        <aside className={`${mobileTab === "preview" ? "block" : "hidden"} border-l border-slate-200 bg-slate-200/70 p-4 lg:block lg:p-6`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-950">Live resume preview</p>
              <p className="text-xs text-slate-500">Updates as you type</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(Math.max(70, zoom - 5))} className="h-9 w-9 rounded-lg border border-slate-300 bg-white text-sm font-bold">-</button>
              <span className="w-12 text-center text-sm font-bold text-slate-600">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(110, zoom + 5))} className="h-9 w-9 rounded-lg border border-slate-300 bg-white text-sm font-bold">+</button>
            </div>
          </div>
          <div style={{ transform: `scale(${zoom / 88})`, transformOrigin: "top center" }}>
            <A4Preview data={data} sectionOrder={sectionOrder} templateId={templateId} scale="builder" />
          </div>
          {data.experience.length + data.projects.length + data.education.length > 6 ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">Content may overflow one page. Consider a compact template or shorter bullets.</p>
          ) : null}
        </aside>
      </div>
      <TemplatePreviewModal
        template={isTemplatePreviewOpen ? resumeTemplates.find((template) => template.id === templateId) ?? null : null}
        onClose={() => setIsTemplatePreviewOpen(false)}
      />
    </main>
  );
}

function EditorPanel({
  activeSection,
  data,
  setData,
  setPersonal,
}: {
  activeSection: ResumeSection;
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  setPersonal: (field: keyof ResumeData["personal"], value: string) => void;
}) {
  if (activeSection === "personal") {
    return (
      <Panel title="Personal Details" description="This information appears in the resume header.">
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(data.personal).map(([field, value]) => (
            <Field
              key={field}
              label={labelize(field)}
              value={value}
              onChange={(next) => setPersonal(field as keyof ResumeData["personal"], next)}
            />
          ))}
        </div>
      </Panel>
    );
  }

  if (activeSection === "summary") {
    return (
      <Panel title="Summary" description="Write a focused opening summary for your target role.">
        <TextArea label="Professional summary" value={data.summary} onChange={(value) => setData((current) => ({ ...current, summary: value }))} />
        <div className="mt-4"><AppButton variant="secondary"><WandSparkles size={16} aria-hidden="true" /> Improve with AI</AppButton></div>
      </Panel>
    );
  }

  if (activeSection === "experience") {
    return <ExperienceEditor data={data} setData={setData} />;
  }

  if (activeSection === "education") {
    return <EducationEditor data={data} setData={setData} />;
  }

  if (activeSection === "skills") {
    return <SimpleListEditor title="Skills" addLabel="Add Skill" items={data.skills} setItems={(items) => setData((current) => ({ ...current, skills: items }))} fields={["name"]} withLevel />;
  }

  if (activeSection === "languages") {
    return <SimpleListEditor title="Languages" addLabel="Add Language" items={data.languages} setItems={(items) => setData((current) => ({ ...current, languages: items }))} fields={["name"]} withLevel />;
  }

  if (activeSection === "projects") {
    return <ProjectsEditor data={data} setData={setData} />;
  }

  if (activeSection === "certificates") {
    return <CertificatesEditor data={data} setData={setData} />;
  }

  return (
    <Panel title={sections.find((section) => section.id === activeSection)?.label ?? "Section"} description="This section is ready for the next product pass.">
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
        Working form coming next. The shared data model already supports this section.
      </div>
    </Panel>
  );
}

function ExperienceEditor({ data, setData }: { data: ResumeData; setData: React.Dispatch<React.SetStateAction<ResumeData>> }) {
  const update = (id: string, patch: Partial<ResumeData["experience"][number]>) => {
    setData((current) => ({ ...current, experience: current.experience.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  };
  const remove = (id: string) => setData((current) => ({ ...current, experience: current.experience.filter((item) => item.id !== id) }));

  return (
    <Panel title="Experience" description="Add roles, responsibilities, and achievement-focused bullet points.">
      <div className="mb-4"><AppButton onClick={() => setData((current) => ({ ...current, experience: [...current.experience, { id: uid("exp"), company: "", role: "", location: "", startDate: "", endDate: "", isCurrent: false, description: "", bullets: [""] }] }))}><Plus size={16} aria-hidden="true" /> Add Experience</AppButton></div>
      <div className="space-y-4">
        {data.experience.map((item) => (
          <EditorCard key={item.id} onRemove={() => remove(item.id)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Company" value={item.company} onChange={(value) => update(item.id, { company: value })} />
              <Field label="Role" value={item.role} onChange={(value) => update(item.id, { role: value })} />
              <Field label="Location" value={item.location} onChange={(value) => update(item.id, { location: value })} />
              <Field label="Start Date" value={item.startDate} onChange={(value) => update(item.id, { startDate: value })} />
              <Field label="End Date" value={item.endDate} onChange={(value) => update(item.id, { endDate: value })} />
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={item.isCurrent} onChange={(event) => update(item.id, { isCurrent: event.target.checked })} />
                Currently Working
              </label>
            </div>
            <div className="mt-4"><TextArea label="Description" value={item.description} onChange={(value) => update(item.id, { description: value })} /></div>
            <BulletEditor bullets={item.bullets} onChange={(bullets) => update(item.id, { bullets })} />
          </EditorCard>
        ))}
      </div>
    </Panel>
  );
}

function EducationEditor({ data, setData }: { data: ResumeData; setData: React.Dispatch<React.SetStateAction<ResumeData>> }) {
  const update = (id: string, patch: Partial<ResumeData["education"][number]>) => {
    setData((current) => ({ ...current, education: current.education.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  };

  return (
    <Panel title="Education" description="Add degrees, institutions, and academic highlights.">
      <div className="mb-4"><AppButton onClick={() => setData((current) => ({ ...current, education: [...current.education, { id: uid("edu"), institution: "", degree: "", field: "", location: "", startDate: "", endDate: "", grade: "", description: "" }] }))}><Plus size={16} aria-hidden="true" /> Add Education</AppButton></div>
      <div className="space-y-4">
        {data.education.map((item) => (
          <EditorCard key={item.id} onRemove={() => setData((current) => ({ ...current, education: current.education.filter((entry) => entry.id !== item.id) }))}>
            <div className="grid gap-4 md:grid-cols-2">
              {(["institution", "degree", "field", "location", "startDate", "endDate", "grade"] as const).map((field) => (
                <Field key={field} label={labelize(field)} value={item[field]} onChange={(value) => update(item.id, { [field]: value })} />
              ))}
            </div>
            <div className="mt-4"><TextArea label="Description" value={item.description} onChange={(value) => update(item.id, { description: value })} /></div>
          </EditorCard>
        ))}
      </div>
    </Panel>
  );
}

function ProjectsEditor({ data, setData }: { data: ResumeData; setData: React.Dispatch<React.SetStateAction<ResumeData>> }) {
  const update = (id: string, patch: Partial<ResumeData["projects"][number]>) => {
    setData((current) => ({ ...current, projects: current.projects.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  };

  return (
    <Panel title="Projects" description="Showcase relevant work, links, and measurable outcomes.">
      <div className="mb-4"><AppButton onClick={() => setData((current) => ({ ...current, projects: [...current.projects, { id: uid("project"), name: "", role: "", link: "", description: "", bullets: [""] }] }))}><Plus size={16} aria-hidden="true" /> Add Project</AppButton></div>
      <div className="space-y-4">
        {data.projects.map((item) => (
          <EditorCard key={item.id} onRemove={() => setData((current) => ({ ...current, projects: current.projects.filter((entry) => entry.id !== item.id) }))}>
            <div className="grid gap-4 md:grid-cols-2">
              {(["name", "role", "link"] as const).map((field) => (
                <Field key={field} label={labelize(field)} value={item[field]} onChange={(value) => update(item.id, { [field]: value })} />
              ))}
            </div>
            <div className="mt-4"><TextArea label="Description" value={item.description} onChange={(value) => update(item.id, { description: value })} /></div>
            <BulletEditor bullets={item.bullets} onChange={(bullets) => update(item.id, { bullets })} />
          </EditorCard>
        ))}
      </div>
    </Panel>
  );
}

function CertificatesEditor({ data, setData }: { data: ResumeData; setData: React.Dispatch<React.SetStateAction<ResumeData>> }) {
  const update = (id: string, patch: Partial<ResumeData["certificates"][number]>) => {
    setData((current) => ({ ...current, certificates: current.certificates.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  };

  return (
    <Panel title="Certificates" description="Add certificates, issuers, dates, and verification links.">
      <div className="mb-4"><AppButton onClick={() => setData((current) => ({ ...current, certificates: [...current.certificates, { id: uid("cert"), name: "", issuer: "", date: "", link: "" }] }))}><Plus size={16} aria-hidden="true" /> Add Certificate</AppButton></div>
      <div className="space-y-4">
        {data.certificates.map((item) => (
          <EditorCard key={item.id} onRemove={() => setData((current) => ({ ...current, certificates: current.certificates.filter((entry) => entry.id !== item.id) }))}>
            <div className="grid gap-4 md:grid-cols-2">
              {(["name", "issuer", "date", "link"] as const).map((field) => (
                <Field key={field} label={labelize(field)} value={item[field]} onChange={(value) => update(item.id, { [field]: value })} />
              ))}
            </div>
          </EditorCard>
        ))}
      </div>
    </Panel>
  );
}

function SimpleListEditor<T extends { id: string; name: string; level: string }>({
  title,
  addLabel,
  items,
  setItems,
  fields,
  withLevel,
}: {
  title: string;
  addLabel: string;
  items: T[];
  setItems: (items: T[]) => void;
  fields: (keyof T)[];
  withLevel?: boolean;
}) {
  return (
    <Panel title={title} description={`Add ${title.toLowerCase()} that strengthen your profile.`}>
      <div className="mb-4"><AppButton onClick={() => setItems([...items, { id: uid(title), name: "", level: "Intermediate" } as T])}><Plus size={16} aria-hidden="true" /> {addLabel}</AppButton></div>
      <div className="space-y-3">
        {items.map((item) => (
          <EditorCard key={item.id} onRemove={() => setItems(items.filter((entry) => entry.id !== item.id))}>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <Field key={String(field)} label={labelize(String(field))} value={String(item[field])} onChange={(value) => setItems(items.map((entry) => (entry.id === item.id ? { ...entry, [field]: value } : entry)))} />
              ))}
              {withLevel ? (
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Level</span>
                  <select value={item.level} onChange={(event) => setItems(items.map((entry) => (entry.id === item.id ? { ...entry, level: event.target.value } : entry)))} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-400">
                    {["Beginner", "Intermediate", "Advanced", "Expert", "Fluent", "Native"].map((level) => <option key={level}>{level}</option>)}
                  </select>
                </label>
              ) : null}
            </div>
          </EditorCard>
        ))}
      </div>
    </Panel>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

function EditorCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex justify-end">
        <button onClick={onRemove} className="inline-flex items-center gap-2 rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm font-bold text-rose-700">
          <Trash2 size={15} aria-hidden="true" />
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-400" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-teal-400" />
    </label>
  );
}

function BulletEditor({ bullets, onChange }: { bullets: string[]; onChange: (bullets: string[]) => void }) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">Bullet points</span>
        <button onClick={() => onChange([...bullets, ""])} className="text-sm font-bold text-teal-700">Add bullet</button>
      </div>
      <div className="space-y-2">
        {bullets.map((bullet, index) => (
          <input
            key={index}
            value={bullet}
            onChange={(event) => onChange(bullets.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-400"
            placeholder="Achievement-focused bullet"
          />
        ))}
      </div>
    </div>
  );
}

function labelize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function uid(prefix: string) {
  return `${prefix.toLowerCase()}-${Math.random().toString(36).slice(2, 8)}`;
}
