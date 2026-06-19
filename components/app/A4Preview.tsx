"use client";

import { defaultResumeData, defaultSectionOrder } from "@/lib/resume/mock-data";
import { getTemplateById } from "@/lib/resume/template-registry";
import { ResumeRenderer } from "@/components/resume-templates/ResumeRenderer";
import type { ResumeData } from "@/types/resume";
import { useEffect, useRef, useState } from "react";

type A4PreviewProps = {
  templateId?: string;
  data?: ResumeData;
  sectionOrder?: string[];
  scale?: "card" | "builder";
  zoom?: "fit" | 75 | 100;
};

export function A4Preview({
  templateId = "modern-minimal",
  data = defaultResumeData,
  sectionOrder = defaultSectionOrder,
  scale = "card",
  zoom = "fit",
}: A4PreviewProps) {
  const template = getTemplateById(templateId);
  const previewData = data === defaultResumeData && template.supportsPhoto ? { ...data, personal: { ...data.personal, photoUrl: mockPhotoUrl } } : data;
  const isBuilder = scale === "builder";
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(0.42);
  const pageScale = isBuilder ? (zoom === "fit" ? fitScale : zoom / 100) : 0.35;

  useEffect(() => {
    if (!isBuilder || zoom !== "fit" || !containerRef.current) {
      return;
    }

    const updateScale = () => {
      const width = containerRef.current?.clientWidth ?? 0;
      const nextScale = Math.min(0.6, Math.max(0.36, (width - 40) / 794));
      setFitScale(Number(nextScale.toFixed(3)));
    };
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    updateScale();
    return () => observer.disconnect();
  }, [isBuilder, zoom]);

  return (
    <div ref={containerRef} className={`relative w-full max-w-full rounded-lg border border-slate-200 bg-slate-100 ${isBuilder ? "max-h-[calc(100vh-180px)] min-h-[510px] overflow-y-auto overflow-x-auto p-3 min-[430px]:min-h-[560px] sm:min-h-[780px] sm:p-5" : "h-[330px] overflow-hidden p-3"}`}>
      <div className="flex min-h-full justify-center">
        <div
          className="relative shrink-0"
          style={{
            width: `${794 * pageScale}px`,
            height: `${1123 * pageScale}px`,
          }}
        >
          <div
            className="absolute left-1/2 top-0 min-h-[1123px] w-[794px] origin-top bg-white shadow-xl"
            style={{ transform: `translateX(-50%) scale(${pageScale})` }}
          >
            <ResumeRenderer data={previewData} sectionOrder={sectionOrder} templateId={templateId} isWatermarked={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

const mockPhotoUrl = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <rect width="160" height="160" fill="#d8e7e5"/>
  <circle cx="80" cy="62" r="32" fill="#617d86"/>
  <path d="M28 146c8-34 28-52 52-52s44 18 52 52" fill="#284b55"/>
</svg>
`)}`;
