"use client";

import { X } from "lucide-react";
import type { TemplateDefinition } from "@/types/template";
import { A4Preview } from "./A4Preview";
import { AppButton } from "./AppButton";
import { GuestTemplateAction } from "./GuestTemplateAction";
import { SectionBadge } from "./SectionBadge";
import { SubmitButton } from "./SubmitButton";
import { sampleTemplateData, sampleTemplateSectionOrder } from "@/lib/resume/sample-template-data";

export function TemplatePreviewModal({ template, onClose, createAction }: { template: TemplateDefinition | null; onClose: () => void; createAction?: (formData: FormData) => void | Promise<void> }) {
  if (!template) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 lg:p-4">
      <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl lg:grid lg:h-auto lg:max-h-[94vh] lg:max-w-6xl lg:grid-cols-[1fr_370px] lg:rounded-lg">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <div className="min-w-0"><p className="truncate font-bold text-slate-950">{template.name}</p><p className="text-xs font-semibold text-slate-500">{template.category} · {template.isPremium ? "Premium" : "Free"}</p></div>
          <button onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-600" aria-label="Close preview"><X size={20} /></button>
        </header>
        <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-3 sm:p-5 lg:p-7">
          <p className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-900">Preview uses sample content to show the full template design.</p>
          <A4Preview templateId={template.id} data={sampleTemplateData} sectionOrder={sampleTemplateSectionOrder} scale="builder" />
        </div>
        <aside className="max-h-[38vh] overflow-y-auto border-t border-slate-200 p-5 pb-24 lg:max-h-none lg:overflow-visible lg:border-l lg:border-t-0 lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SectionBadge>{template.category}</SectionBadge>
              <h2 className="mt-4 text-2xl font-bold text-slate-950">{template.name}</h2>
            </div>
            <button onClick={onClose} className="hidden h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:inline-flex" aria-label="Close preview">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{template.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <SectionBadge tone={template.isPremium ? "teal" : "emerald"}>{template.isPremium ? "Premium" : "Free"}</SectionBadge>
            <SectionBadge tone={template.supportsPhoto ? "teal" : "slate"}>{template.supportsPhoto ? "Photo supported" : "No photo"}</SectionBadge>
          </div>
          <p className="mt-5 text-sm text-slate-600"><span className="font-bold text-slate-950">Best for:</span> {template.bestFor}</p>
          <div className="mt-4 flex flex-wrap gap-2">{template.tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">{tag}</span>)}</div>
          <ul className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
            {template.features.map((feature) => <li key={feature}>{feature}</li>)}
            <li>Print-friendly A4 layout</li>
            <li>Live builder compatible</li>
          </ul>
          <div className="mt-7 hidden gap-3 lg:grid">
            {createAction ? (
              <form action={createAction}>
                <input type="hidden" name="templateId" value={template.id} />
                <SubmitButton className="w-full" pendingText="Creating...">Use Template</SubmitButton>
              </form>
            ) : (
              <GuestTemplateAction templateId={template.id}>Use Template</GuestTemplateAction>
            )}
            <GuestTemplateAction templateId={template.id} variant="secondary">Open in Builder</GuestTemplateAction>
          </div>
        </aside>
        <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
          {createAction ? (
            <form action={createAction}>
              <input type="hidden" name="templateId" value={template.id} />
              <SubmitButton className="w-full" pendingText="Creating...">Use Template</SubmitButton>
            </form>
          ) : (
            <GuestTemplateAction templateId={template.id}>Use Template</GuestTemplateAction>
          )}
          <GuestTemplateAction templateId={template.id} variant="secondary">Open in Builder</GuestTemplateAction>
        </div>
      </div>
    </div>
  );
}
