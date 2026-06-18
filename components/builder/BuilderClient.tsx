"use client";

import { A4Preview } from "@/components/app/A4Preview";
import { AppButton } from "@/components/app/AppButton";
import { TemplatePreviewModal } from "@/components/app/TemplatePreviewModal";
import { AtsScorePanel, toneFor } from "@/components/builder/AtsScorePanel";
import { ResumeAssistant } from "@/components/builder/ResumeAssistant";
import { ResumePhotoUpload } from "@/components/builder/ResumePhotoUpload";
import { ResumeRenderer } from "@/components/resume-templates/ResumeRenderer";
import { calculateAtsScore } from "@/lib/ats/score-resume";
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
  MoreHorizontal,
  LayoutTemplate,
  Bot,
  X,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

type Tab = "edit" | "preview" | "templates" | "assistant" | "ats";

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
  const [zoom, setZoom] = useState<"fit" | 75 | 100>("fit");
  const [isTemplatePreviewOpen, setIsTemplatePreviewOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const pdfRef = useRef<HTMLDivElement>(null);
  const [sectionOrder, setSectionOrder] = useState<ResumeSection[]>(defaultSectionOrder as ResumeSection[]);
  const [draggedSection, setDraggedSection] = useState<ResumeSection | null>(null);
  const atsScore = useMemo(() => calculateAtsScore(data), [data]);
  const atsTone = toneFor(atsScore.percentage);

  const setPersonal = (field: keyof ResumeData["personal"], value: string) => {
    setData((current) => ({ ...current, personal: { ...current.personal, [field]: value } }));
  };

  const orderedSections = sections
    .map((section, index) => ({ ...section, fallbackIndex: index }))
    .sort((first, second) => {
      if (first.id === "personal") return -1;
      if (second.id === "personal") return 1;
      const firstIndex = sectionOrder.indexOf(first.id);
      const secondIndex = sectionOrder.indexOf(second.id);
      if (firstIndex === -1 && secondIndex === -1) return first.fallbackIndex - second.fallbackIndex;
      if (firstIndex === -1) return 1;
      if (secondIndex === -1) return -1;
      return firstIndex - secondIndex;
    });

  const moveSection = (sectionId: ResumeSection, direction: -1 | 1) => {
    if (sectionId === "personal") {
      return;
    }

    setSectionOrder((current) => {
      const index = current.indexOf(sectionId);
      if (index === -1) {
        return [...current, sectionId];
      }
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  };

  const dropSection = (targetSection: ResumeSection) => {
    if (!draggedSection || draggedSection === targetSection || draggedSection === "personal" || targetSection === "personal") {
      setDraggedSection(null);
      return;
    }

    setSectionOrder((current) => {
      const normalized = current.includes(targetSection) ? current : [...current, targetSection];
      const next = normalized.filter((section) => section !== draggedSection);
      const targetIndex = next.indexOf(targetSection);
      next.splice(targetIndex < 0 ? next.length : targetIndex, 0, draggedSection);
      return next;
    });
    setDraggedSection(null);
  };

  const openEditorSection = (section: ResumeSection) => {
    setActiveSection(section);
    setMobileTab("edit");
  };

  const downloadPdf = async () => {
    if (!pdfRef.current || isDownloading) {
      return;
    }

    setIsDownloading(true);
    setDownloadError("");
    try {
      await document.fonts?.ready;
      const [{ toPng }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);
      const captureWidth = 794;
      const pagePixelHeight = 1123;
      const captureHeight = Math.max(pagePixelHeight, pdfRef.current.scrollHeight);
      const imageData = await toPng(pdfRef.current, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        pixelRatio: 2,
        width: captureWidth,
        height: captureHeight,
        style: {
          margin: "0",
          transform: "none",
        },
      });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
        compress: true,
      });
      const pdfWidth = 595.28;
      const pdfHeight = 841.89;
      const imageHeight = (captureHeight * pdfWidth) / captureWidth;
      const pageCount = Math.ceil(imageHeight / pdfHeight);

      for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
        if (pageIndex > 0) {
          pdf.addPage();
        }
        pdf.addImage(imageData, "PNG", 0, -pageIndex * pdfHeight, pdfWidth, imageHeight, undefined, "FAST");
      }
      const pdfBlob = pdf.output("blob");
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `${slugify(resumeTitle || "resume")}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (error) {
      console.error(error);
      setDownloadError("PDF export failed. Please try again after switching to Preview.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-100 pb-20 lg:pb-0">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="flex min-h-16 items-center justify-between gap-2 px-3 py-2 lg:px-4 lg:py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/dashboard" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600" aria-label="Back to dashboard">
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
            <input
              value={resumeTitle}
              onChange={(event) => setResumeTitle(event.target.value)}
              className="min-w-0 flex-1 truncate rounded-lg border border-transparent bg-slate-50 px-2 py-2 text-sm font-bold text-slate-950 outline-none focus:border-teal-300 focus:bg-white sm:text-lg"
              aria-label="Resume title"
            />
          </div>
          <span className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-emerald-50 px-2 text-xs font-bold text-emerald-700 sm:px-3 sm:text-sm"><Save size={15} />Saved</span>
          <button onClick={() => setMobileTab("ats")} className={`hidden h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 text-xs font-bold sm:inline-flex sm:px-3 sm:text-sm ${atsTone.badge}`} aria-label="Open ATS score">
            <Target size={15} aria-hidden="true" />
            ATS Score: {atsScore.percentage}%
          </button>
          <button className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden" aria-label="More builder actions"><MoreHorizontal size={20} /></button>
          <div className="hidden flex-wrap items-center gap-2 lg:flex">
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
            <AppButton variant="secondary" onClick={() => setIsTemplatePreviewOpen(true)}><Eye size={16} aria-hidden="true" /> Template Preview</AppButton>
            <AppButton variant="secondary" onClick={() => setIsAssistantOpen(true)}><Bot size={16} aria-hidden="true" /> Assistant</AppButton>
            <AppButton variant="secondary" onClick={() => setMobileTab("ats")}><Target size={16} aria-hidden="true" /> ATS Score</AppButton>
            <AppButton onClick={downloadPdf} disabled={isDownloading}><Download size={16} aria-hidden="true" /> {isDownloading ? "Preparing PDF" : "Download PDF"}</AppButton>
          </div>
        </div>
        <div className="grid grid-cols-5 border-t border-slate-200 bg-white lg:hidden">
          {(["edit", "preview", "templates", "assistant", "ats"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`relative min-h-12 py-3 text-xs font-bold capitalize sm:text-sm ${mobileTab === tab ? "text-teal-700 after:absolute after:inset-x-5 after:bottom-0 after:h-0.5 after:bg-teal-700" : "text-slate-500"}`}
            >
              {tab === "ats" ? "ATS Score" : tab}
            </button>
          ))}
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[260px_minmax(420px,1fr)_minmax(420px,0.95fr)]">
        <aside className="hidden border-r border-slate-200 bg-white p-4 lg:block">
          <div className="mb-4 rounded-lg bg-teal-50 p-4">
            <p className="text-sm font-bold text-teal-800">Builder sections</p>
            <p className="mt-1 text-xs leading-5 text-teal-700">Drag sections or use arrows to reorder the resume preview.</p>
          </div>
          <nav className="space-y-1">
            {orderedSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const canMove = section.id !== "personal";
              return (
                <button
                  key={section.id}
                  draggable={canMove}
                  onDragStart={() => canMove && setDraggedSection(section.id)}
                  onDragOver={(event) => canMove && event.preventDefault()}
                  onDrop={() => dropSection(section.id)}
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
                  {canMove ? (
                    <span className="flex shrink-0 items-center gap-1" onClick={(event) => event.stopPropagation()}>
                      <span role="button" tabIndex={0} onClick={() => moveSection(section.id, -1)} className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${isActive ? "bg-teal-600 text-white" : "bg-slate-50 text-slate-500"}`} aria-label={`Move ${section.label} up`}><ChevronUp size={14} /></span>
                      <span role="button" tabIndex={0} onClick={() => moveSection(section.id, 1)} className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${isActive ? "bg-teal-600 text-white" : "bg-slate-50 text-slate-500"}`} aria-label={`Move ${section.label} down`}><ChevronDown size={14} /></span>
                    </span>
                  ) : (
                    <Eye size={15} className={isActive ? "text-teal-100" : "text-slate-400"} aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className={`${mobileTab === "edit" ? "block" : "hidden"} overflow-y-auto px-3 py-4 ${mobileTab === "ats" ? "lg:hidden" : "lg:block"} lg:p-6`}>
          <div className="mx-auto max-w-3xl">
            <div className="-mx-3 mb-4 overflow-x-auto border-b border-slate-200 bg-white px-3 pb-3 lg:hidden">
              <div className="flex w-max gap-2">{orderedSections.map((section) => <button key={section.id} onClick={() => setActiveSection(section.id)} className={`min-h-11 rounded-full border px-4 text-sm font-bold ${activeSection === section.id ? "border-teal-700 bg-teal-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}>{section.label.replace(" Details", "")}</button>)}</div>
            </div>
            <EditorPanel activeSection={activeSection} data={data} setData={setData} setPersonal={setPersonal} sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} />
          </div>
        </section>

        <section className={`${mobileTab === "ats" ? "block" : "hidden"} overflow-y-auto px-3 py-4 lg:p-6`}>
          <div className="mx-auto max-w-3xl">
            <AtsScorePanel data={data} onFixSection={openEditorSection} />
          </div>
        </section>

        <aside className={`${mobileTab === "preview" ? "block" : "hidden"} min-w-0 border-l border-slate-200 bg-slate-200/70 p-3 ${mobileTab === "ats" ? "lg:hidden" : "lg:block"} lg:p-6`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-950">Live resume preview</p>
              <p className="text-xs text-slate-500">Updates as you type</p>
            </div>
            <div className="flex items-center gap-1.5">
              {(["fit", 75, 100] as const).map((value) => <button key={value} onClick={() => setZoom(value)} className={`min-h-10 rounded-lg border px-3 text-xs font-bold ${zoom === value ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300 bg-white text-slate-600"}`}>{value === "fit" ? "Fit" : `${value}%`}</button>)}
            </div>
          </div>
          <p className="mb-3 rounded-lg bg-white/80 p-3 text-xs leading-5 text-slate-600 lg:hidden">Preview is scaled for mobile. PDF will export in full A4 quality.</p>
          <div className="min-w-0" style={{ transform: zoom === "fit" ? undefined : `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <A4Preview data={data} sectionOrder={sectionOrder} templateId={templateId} scale="builder" />
          </div>
          {data.experience.length + data.projects.length + data.education.length > 6 ? (
            <p className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm font-semibold text-teal-800">Long resumes export across multiple PDF pages automatically.</p>
          ) : null}
          {downloadError ? (
            <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{downloadError}</p>
          ) : null}
        </aside>

        <section className={`${mobileTab === "templates" ? "block" : "hidden"} bg-slate-50 px-3 py-4 lg:hidden`}>
          <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700">Selected template</p><p className="mt-1 font-bold text-slate-950">{resumeTemplates.find((template) => template.id === templateId)?.name}</p></div>
          <div className="space-y-3">{resumeTemplates.map((template) => <article key={template.id} className={`grid grid-cols-[92px_1fr] gap-3 rounded-lg border bg-white p-3 ${template.id === templateId ? "border-teal-600 ring-2 ring-teal-100" : "border-slate-200"}`}><div className="h-28 overflow-hidden rounded-md bg-slate-100"><A4Preview templateId={template.id} /></div><div className="min-w-0"><div className="flex items-start justify-between gap-2"><div><h3 className="font-bold text-slate-950">{template.name}</h3><p className="mt-0.5 text-xs font-semibold text-slate-500">{template.category}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${template.isPremium ? "bg-teal-50 text-teal-700" : "bg-emerald-50 text-emerald-700"}`}>{template.isPremium ? "Premium" : "Free"}</span></div><button onClick={() => { setTemplateId(template.id); setMobileTab("preview"); }} className="mt-4 min-h-11 w-full rounded-lg bg-teal-700 text-sm font-bold text-white">{template.id === templateId ? "Selected" : "Select Template"}</button></div></article>)}</div>
        </section>
        <section className={`${mobileTab === "assistant" ? "block" : "hidden"} bg-slate-50 px-3 py-4 lg:hidden`}>
          <ResumeAssistant data={data} setData={setData} onPreview={() => setMobileTab("preview")} />
        </section>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <button onClick={() => setMobileTab("preview")} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-bold ${mobileTab === "preview" ? "text-teal-700" : "text-slate-500"}`}><Eye size={19} />Preview</button>
        <button onClick={() => setMobileTab("templates")} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-bold ${mobileTab === "templates" ? "text-teal-700" : "text-slate-500"}`}><LayoutTemplate size={19} />Templates</button>
        <button onClick={downloadPdf} disabled={isDownloading} className="flex min-h-16 flex-col items-center justify-center gap-1 bg-teal-700 text-xs font-bold text-white disabled:opacity-70"><Download size={19} />{isDownloading ? "Preparing" : "Download"}</button>
      </nav>
      <div className="pointer-events-none fixed -left-[10000px] top-0 w-[794px] bg-white" aria-hidden="true">
        <div ref={pdfRef} className="min-h-[1123px] w-[794px] bg-white">
          <ResumeRenderer data={data} sectionOrder={sectionOrder} templateId={templateId} isWatermarked={false} />
        </div>
      </div>
      {downloadError ? (
        <div className="fixed inset-x-3 bottom-20 z-[70] rounded-lg border border-rose-200 bg-white p-3 text-sm font-semibold text-rose-700 shadow-xl lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-sm">
          {downloadError}
        </div>
      ) : null}
      <TemplatePreviewModal
        template={isTemplatePreviewOpen ? resumeTemplates.find((template) => template.id === templateId) ?? null : null}
        onClose={() => setIsTemplatePreviewOpen(false)}
      />
      {isAssistantOpen ? (
        <div className="fixed inset-0 z-[65] bg-slate-950/35 lg:block">
          <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex min-h-14 items-center justify-between border-b border-slate-200 px-4">
              <p className="font-bold text-slate-950">Assistant</p>
              <button onClick={() => setIsAssistantOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600" aria-label="Close assistant"><X size={18} /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <ResumeAssistant data={data} setData={setData} onPreview={() => setIsAssistantOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}

function EditorPanel({
  activeSection,
  data,
  setData,
  setPersonal,
  sectionOrder,
  setSectionOrder,
}: {
  activeSection: ResumeSection;
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  setPersonal: (field: keyof ResumeData["personal"], value: string) => void;
  sectionOrder: ResumeSection[];
  setSectionOrder: React.Dispatch<React.SetStateAction<ResumeSection[]>>;
}) {
  if (activeSection === "personal") {
    return (
      <Panel title="Personal Details" description="This information appears in the resume header.">
        <ResumePhotoUpload value={data.personal.photoUrl} onChange={(value) => setPersonal("photoUrl", value)} />
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-bold text-slate-700">Manual image URL</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Advanced option for externally hosted profile photos.</p>
          <div className="mt-3">
            <Field label="Photo URL" value={data.personal.photoUrl} onChange={(next) => setPersonal("photoUrl", next)} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(data.personal).filter(([field]) => field !== "photoUrl").map(([field, value]) => (
            field === "portfolio" ? (
              <PortfolioField
                key={field}
                value={value}
                onChange={(next) => setPersonal("portfolio", next)}
              />
            ) : (
              <Field
                key={field}
                label={labelize(field)}
                value={value}
                onChange={(next) => setPersonal(field as keyof ResumeData["personal"], next)}
              />
            )
          ))}
        </div>
      </Panel>
    );
  }

  if (activeSection === "summary") {
    return (
      <Panel title="Summary" description="Write a focused opening summary for your target role.">
        <TextArea label="Professional summary" value={data.summary} onChange={(value) => setData((current) => ({ ...current, summary: value }))} />
        <div className="mt-4 [&>button]:w-full sm:[&>button]:w-auto"><AppButton variant="secondary"><WandSparkles size={16} aria-hidden="true" /> Improve with AI</AppButton></div>
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

  if (activeSection === "achievements") {
    return <AchievementsEditor data={data} setData={setData} />;
  }

  if (activeSection === "references") {
    return <ReferencesEditor data={data} setData={setData} />;
  }

  if (activeSection === "customSections") {
    return <CustomSectionsEditor data={data} setData={setData} sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} />;
  }

  return (
    <Panel title={sections.find((section) => section.id === activeSection)?.label ?? "Section"} description="This section is ready for the next product pass.">
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm leading-6 text-slate-600">
        Add optional sections from the data model in the next product pass.
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
      <div className="mb-4 [&>button]:w-full sm:[&>button]:w-auto"><AppButton onClick={() => setData((current) => ({ ...current, experience: [...current.experience, { id: uid("exp"), company: "", role: "", location: "", startDate: "", endDate: "", isCurrent: false, description: "", bullets: [""] }] }))}><Plus size={16} aria-hidden="true" /> Add Experience</AppButton></div>
      <div className="space-y-4">
        {data.experience.map((item) => (
          <EditorCard key={item.id} title={[item.role, item.company].filter(Boolean).join(" · ") || "New experience"} onRemove={() => remove(item.id)}>
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
      <div className="mb-4 [&>button]:w-full sm:[&>button]:w-auto"><AppButton onClick={() => setData((current) => ({ ...current, education: [...current.education, { id: uid("edu"), institution: "", degree: "", field: "", location: "", startDate: "", endDate: "", grade: "", description: "" }] }))}><Plus size={16} aria-hidden="true" /> Add Education</AppButton></div>
      <div className="space-y-4">
        {data.education.map((item) => (
          <EditorCard key={item.id} title={[item.degree, item.institution].filter(Boolean).join(" · ") || "New education"} onRemove={() => setData((current) => ({ ...current, education: current.education.filter((entry) => entry.id !== item.id) }))}>
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
      <div className="mb-4 [&>button]:w-full sm:[&>button]:w-auto"><AppButton onClick={() => setData((current) => ({ ...current, projects: [...current.projects, { id: uid("project"), name: "", role: "", link: "", description: "", bullets: [""] }] }))}><Plus size={16} aria-hidden="true" /> Add Project</AppButton></div>
      <div className="space-y-4">
        {data.projects.map((item) => (
          <EditorCard key={item.id} title={item.name || "New project"} onRemove={() => setData((current) => ({ ...current, projects: current.projects.filter((entry) => entry.id !== item.id) }))}>
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
      <div className="mb-4 [&>button]:w-full sm:[&>button]:w-auto"><AppButton onClick={() => setData((current) => ({ ...current, certificates: [...current.certificates, { id: uid("cert"), name: "", issuer: "", date: "", link: "" }] }))}><Plus size={16} aria-hidden="true" /> Add Certificate</AppButton></div>
      <div className="space-y-4">
        {data.certificates.map((item) => (
          <EditorCard key={item.id} title={item.name || "New certificate"} onRemove={() => setData((current) => ({ ...current, certificates: current.certificates.filter((entry) => entry.id !== item.id) }))}>
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

function AchievementsEditor({ data, setData }: { data: ResumeData; setData: React.Dispatch<React.SetStateAction<ResumeData>> }) {
  const update = (id: string, patch: Partial<ResumeData["achievements"][number]>) => {
    setData((current) => ({ ...current, achievements: current.achievements.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  };

  return (
    <Panel title="Achievements" description="Highlight awards, recognition, and measurable wins.">
      <div className="mb-4 [&>button]:w-full sm:[&>button]:w-auto"><AppButton onClick={() => setData((current) => ({ ...current, achievements: [...current.achievements, { id: uid("ach"), title: "", description: "" }] }))}><Plus size={16} aria-hidden="true" /> Add Achievement</AppButton></div>
      <div className="space-y-4">
        {data.achievements.map((item) => (
          <EditorCard key={item.id} title={item.title || "New achievement"} onRemove={() => setData((current) => ({ ...current, achievements: current.achievements.filter((entry) => entry.id !== item.id) }))}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" value={item.title} onChange={(value) => update(item.id, { title: value })} />
              <TextArea label="Description" value={item.description} onChange={(value) => update(item.id, { description: value })} />
            </div>
          </EditorCard>
        ))}
      </div>
    </Panel>
  );
}

function ReferencesEditor({ data, setData }: { data: ResumeData; setData: React.Dispatch<React.SetStateAction<ResumeData>> }) {
  const update = (id: string, patch: Partial<ResumeData["references"][number]>) => {
    setData((current) => ({ ...current, references: current.references.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  };

  return (
    <Panel title="References" description="Add references or leave this section out when not required.">
      <div className="mb-4 [&>button]:w-full sm:[&>button]:w-auto"><AppButton onClick={() => setData((current) => ({ ...current, references: [...current.references, { id: uid("ref"), name: "", role: "", company: "", email: "", phone: "" }] }))}><Plus size={16} aria-hidden="true" /> Add Reference</AppButton></div>
      <div className="space-y-4">
        {data.references.map((item) => (
          <EditorCard key={item.id} title={item.name || "New reference"} onRemove={() => setData((current) => ({ ...current, references: current.references.filter((entry) => entry.id !== item.id) }))}>
            <div className="grid gap-4 md:grid-cols-2">
              {(["name", "role", "company", "email", "phone"] as const).map((field) => (
                <Field key={field} label={labelize(field)} value={item[field]} onChange={(value) => update(item.id, { [field]: value })} />
              ))}
            </div>
          </EditorCard>
        ))}
      </div>
    </Panel>
  );
}

function CustomSectionsEditor({
  data,
  setData,
  sectionOrder,
  setSectionOrder,
}: {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  sectionOrder: ResumeSection[];
  setSectionOrder: React.Dispatch<React.SetStateAction<ResumeSection[]>>;
}) {
  const update = (id: string, patch: Partial<ResumeData["customSections"][number]>) => {
    setData((current) => ({ ...current, customSections: current.customSections.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  };

  const ensureVisible = () => {
    setSectionOrder((current) => current.includes("customSections") ? current : [...current, "customSections"]);
  };

  return (
    <Panel title="Custom Sections" description="Add extra resume sections such as volunteer work, publications, interests, or awards.">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700">
          {sectionOrder.includes("customSections") ? "Visible in resume preview" : "Hidden from preview until enabled"}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <AppButton variant="secondary" onClick={ensureVisible}>Show in Preview</AppButton>
          <AppButton onClick={() => {
            ensureVisible();
            setData((current) => ({ ...current, customSections: [...current.customSections, { id: uid("custom"), title: "", description: "", bullets: [""] }] }));
          }}><Plus size={16} aria-hidden="true" /> Add Custom Section</AppButton>
        </div>
      </div>
      <div className="space-y-4">
        {data.customSections.map((item) => (
          <EditorCard key={item.id} title={item.title || "New custom section"} onRemove={() => setData((current) => ({ ...current, customSections: current.customSections.filter((entry) => entry.id !== item.id) }))}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Section Title" value={item.title} onChange={(value) => update(item.id, { title: value })} />
              <TextArea label="Description" value={item.description} onChange={(value) => update(item.id, { description: value })} />
            </div>
            <BulletEditor bullets={item.bullets} onChange={(bullets) => update(item.id, { bullets })} />
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
      <div className="mb-4 [&>button]:w-full sm:[&>button]:w-auto"><AppButton onClick={() => setItems([...items, { id: uid(title), name: "", level: "Intermediate" } as T])}><Plus size={16} aria-hidden="true" /> {addLabel}</AppButton></div>
      <div className="space-y-3">
        {items.map((item) => (
          <EditorCard key={item.id} title={item.name || `New ${title.toLowerCase().replace(/s$/, "")}`} onRemove={() => setItems(items.filter((entry) => entry.id !== item.id))}>
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
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

function EditorCard({ children, onRemove, title }: { children: React.ReactNode; onRemove: () => void; title: string }) {
  return (
    <details className="group rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
      <summary className="mb-4 flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-bold text-slate-900 marker:hidden"><span className="truncate">{title}</span><span className="text-xs text-slate-500 group-open:hidden">Expand</span><span className="text-xs text-slate-500 group-open:inline">Collapse</span></summary>
      <div className="mb-4 flex justify-end">
        <button onClick={onRemove} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm font-bold text-rose-700">
          <Trash2 size={15} aria-hidden="true" />
          Remove
        </button>
      </div>
      {children}
    </details>
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

function PortfolioField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="grid gap-1 text-sm font-bold text-slate-700 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-3">
        Portfolio
        <a
          href="https://portfoliobuilder-rose.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-7 min-w-0 items-center gap-1.5 rounded-md text-xs font-bold leading-5 text-teal-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          <span className="min-w-0 whitespace-normal">Don't have a portfolio? Create your portfolio</span>
          <LinkIcon size={13} className="shrink-0" aria-hidden="true" />
        </a>
      </span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-400" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-teal-400" />
    </label>
  );
}

function BulletEditor({ bullets, onChange }: { bullets: string[]; onChange: (bullets: string[]) => void }) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">Bullet points</span>
        <button onClick={() => onChange([...bullets, ""])} className="min-h-11 rounded-lg px-3 text-sm font-bold text-teal-700">Add bullet</button>
      </div>
      <div className="space-y-2">
        {bullets.map((bullet, index) => (
          <div key={index} className="grid gap-2">
            <input
              value={bullet}
              onChange={(event) => onChange(bullets.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-400"
              placeholder="Achievement-focused bullet"
            />
          </div>
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "resume";
}
