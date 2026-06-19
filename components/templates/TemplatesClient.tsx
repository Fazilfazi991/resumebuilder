"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TemplateGalleryCard } from "@/components/app/TemplateGalleryCard";
import { TemplatePreviewModal } from "@/components/app/TemplatePreviewModal";
import { resumeTemplates } from "@/lib/resume/template-registry";
import type { TemplateDefinition } from "@/types/template";

const filters = ["All", "ATS", "Modern", "Executive", "Creative", "Freshers", "UAE", "Tech", "Sales", "Simple"];

export function TemplatesClient() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);
  const [unlockedTemplateId, setUnlockedTemplateId] = useState("");

  useEffect(() => {
    setUnlockedTemplateId(localStorage.getItem("resumi_unlocked_template") ?? "");
  }, []);

  const filtered = useMemo(() => {
    return resumeTemplates.filter((template) => {
      const categoryMatch = activeFilter === "All" || template.category === activeFilter || (activeFilter === "Simple" && template.id.includes("simple"));
      const searchMatch = [template.name, template.category, template.description].join(" ").toLowerCase().includes(query.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [activeFilter, query]);

  return (
    <>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates" className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold outline-none focus:border-blue-600" />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${activeFilter === filter ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <TemplateGalleryCard key={template.id} {...template} isReferralUnlocked={template.id === unlockedTemplateId} onPreview={() => setPreviewTemplate(template)} />
        ))}
      </div>
      <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
    </>
  );
}
