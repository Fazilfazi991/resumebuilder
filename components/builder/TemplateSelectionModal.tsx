"use client";

import { A4Preview } from "@/components/app/A4Preview";
import { AppButton } from "@/components/app/AppButton";
import { defaultResumeData } from "@/lib/resume/mock-data";
import { resumeTemplates } from "@/lib/resume/template-registry";
import type { ResumeData } from "@/types/resume";
import type { TemplateDefinition } from "@/types/template";
import { CheckCircle2, Eye, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

const filters = ["All", "Free", "Premium", "ATS", "Modern", "Executive", "Creative", "Tech", "UAE", "Freshers"];

type TemplateSelectionModalProps = {
  currentTemplateId: string;
  data: ResumeData;
  sectionOrder: string[];
  onUseTemplate: (template: TemplateDefinition) => void;
  onClose: () => void;
};

export function TemplateSelectionModal({ currentTemplateId, data, sectionOrder, onUseTemplate, onClose }: TemplateSelectionModalProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);
  const previewData = isResumeDataEmpty(data) ? defaultResumeData : data;

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return resumeTemplates.filter((template) => {
      const filterMatch =
        activeFilter === "All" ||
        (activeFilter === "Free" && !template.isPremium) ||
        (activeFilter === "Premium" && template.isPremium) ||
        template.category === activeFilter ||
        template.tags.some((tag) => tag.toLowerCase().includes(activeFilter.toLowerCase()));
      const searchMatch = !normalizedQuery || [template.name, template.category, template.bestFor, template.description, ...template.tags].join(" ").toLowerCase().includes(normalizedQuery);
      return filterMatch && searchMatch;
    });
  }, [activeFilter, query]);

  return (
    <div className="fixed inset-0 z-[95] bg-slate-950/55 backdrop-blur-sm lg:p-5">
      <section className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl lg:mx-auto lg:max-w-7xl lg:rounded-lg">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">Choose a resume template</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Switch templates anytime without losing your resume details.</p>
          </div>
          <button onClick={onClose} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Close template selector">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates by role, style, or category" className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold outline-none focus:border-blue-600" />
          </label>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${activeFilter === filter ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-5 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateChoiceCard
                key={template.id}
                template={template}
                isSelected={template.id === currentTemplateId}
                previewData={previewData}
                sectionOrder={sectionOrder}
                onPreview={() => setPreviewTemplate(template)}
                onUse={() => onUseTemplate(template)}
              />
            ))}
          </div>
        </div>
      </section>

      {previewTemplate ? (
        <TemplateDetailPreview
          template={previewTemplate}
          data={previewData}
          sectionOrder={sectionOrder}
          onUse={() => onUseTemplate(previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
        />
      ) : null}
    </div>
  );
}

function TemplateChoiceCard({
  template,
  isSelected,
  previewData,
  sectionOrder,
  onPreview,
  onUse,
}: {
  template: TemplateDefinition;
  isSelected: boolean;
  previewData: ResumeData;
  sectionOrder: string[];
  onPreview: () => void;
  onUse: () => void;
}) {
  return (
    <article className={`overflow-hidden rounded-lg border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/50 ${isSelected ? "border-blue-600 ring-4 ring-blue-100" : "border-slate-200"}`}>
      <div className="relative bg-slate-100 p-3 pb-0">
        <A4Preview templateId={template.id} data={previewData} sectionOrder={sectionOrder} />
        <div className="pointer-events-none absolute inset-x-3 bottom-0 h-16 bg-gradient-to-t from-slate-100 to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-950">{template.name}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{template.category}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${template.isPremium ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>{template.isPremium ? "Premium" : "Free"}</span>
        </div>
        <p className="mt-3 text-sm leading-5 text-slate-600"><span className="font-bold text-slate-900">Best for:</span> {template.bestFor}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{template.tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{tag}</span>)}</div>
        <div className="mt-4 grid gap-2 min-[380px]:grid-cols-2">
          <AppButton variant="secondary" onClick={onPreview}><Eye size={16} aria-hidden="true" /> Preview</AppButton>
          <AppButton onClick={onUse}>{isSelected ? <CheckCircle2 size={16} aria-hidden="true" /> : null}{isSelected ? "Selected" : "Use Template"}</AppButton>
        </div>
      </div>
    </article>
  );
}

function TemplateDetailPreview({ template, data, sectionOrder, onUse, onClose }: { template: TemplateDefinition; data: ResumeData; sectionOrder: string[]; onUse: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[105] bg-slate-950/65 lg:p-5">
      <section className="ml-auto flex h-full w-full flex-col bg-white shadow-2xl lg:max-w-6xl lg:rounded-lg">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <h3 className="text-xl font-bold text-slate-950">{template.name}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{template.category} · {template.isPremium ? "Premium" : "Free"}</p>
          </div>
          <button onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600" aria-label="Close template preview"><X size={18} /></button>
        </header>
        <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_360px]">
          <div className="min-h-0 overflow-auto bg-slate-100 p-4 sm:p-6">
            <A4Preview templateId={template.id} data={data} sectionOrder={sectionOrder} scale="builder" />
          </div>
          <aside className="min-h-0 overflow-y-auto border-t border-slate-200 p-5 pb-24 lg:border-l lg:border-t-0 lg:pb-5">
            <p className="text-sm leading-6 text-slate-600">{template.description}</p>
            <p className="mt-5 text-sm text-slate-600"><span className="font-bold text-slate-950">Best for:</span> {template.bestFor}</p>
            <div className="mt-4 flex flex-wrap gap-2">{template.tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">{tag}</span>)}</div>
            <ul className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
              {template.features.map((feature) => <li key={feature}>{feature}</li>)}
              <li>Switch without losing resume data</li>
              <li>PDF export compatible</li>
            </ul>
            <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white p-3 lg:static lg:mt-7 lg:border-0 lg:p-0">
              <AppButton onClick={onUse}>Use This Template</AppButton>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function isResumeDataEmpty(data: ResumeData) {
  return !hasText(data);
}

function hasText(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasText);
  if (value && typeof value === "object") return Object.values(value).some(hasText);
  return false;
}
