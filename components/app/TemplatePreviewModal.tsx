"use client";

import { X } from "lucide-react";
import type { TemplateDefinition } from "@/types/template";
import { A4Preview } from "./A4Preview";
import { AppButton } from "./AppButton";
import { SectionBadge } from "./SectionBadge";

export function TemplatePreviewModal({ template, onClose }: { template: TemplateDefinition | null; onClose: () => void }) {
  if (!template) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <div className="grid max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl lg:grid-cols-[1fr_370px]">
        <div className="overflow-auto bg-slate-100 p-7">
          <A4Preview templateId={template.id} scale="builder" />
        </div>
        <aside className="border-l border-slate-200 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SectionBadge>{template.category}</SectionBadge>
              <h2 className="mt-4 text-2xl font-bold text-slate-950">{template.name}</h2>
            </div>
            <button onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600" aria-label="Close preview">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{template.description}</p>
          <div className="mt-4"><SectionBadge tone={template.isPremium ? "teal" : "emerald"}>{template.isPremium ? "Premium" : "Free"}</SectionBadge></div>
          <p className="mt-5 text-sm text-slate-600"><span className="font-bold text-slate-950">Best for:</span> {template.bestFor}</p>
          <div className="mt-4 flex flex-wrap gap-2">{template.tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">{tag}</span>)}</div>
          <ul className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm text-slate-600"><li>Print-friendly A4 layout</li><li>Live builder compatible</li><li>Switch without rewriting content</li></ul>
          <div className="mt-7 grid gap-3">
            <AppButton href={`/builder/sample-resume?template=${template.id}`}>Use Template</AppButton>
            <AppButton href={`/builder/sample-resume?template=${template.id}`} variant="secondary">Open in Builder</AppButton>
          </div>
        </aside>
      </div>
    </div>
  );
}
