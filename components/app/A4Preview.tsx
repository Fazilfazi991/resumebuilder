import { defaultResumeData, defaultSectionOrder } from "@/lib/resume/mock-data";
import { getTemplateById } from "@/lib/resume/template-registry";
import { ResumeRenderer } from "@/components/resume-templates/ResumeRenderer";
import type { ResumeData } from "@/types/resume";

type A4PreviewProps = {
  templateId?: string;
  data?: ResumeData;
  sectionOrder?: string[];
  scale?: "card" | "builder";
};

export function A4Preview({
  templateId = "modern-minimal",
  data = defaultResumeData,
  sectionOrder = defaultSectionOrder,
  scale = "card",
}: A4PreviewProps) {
  const previewScale = scale === "builder" ? "scale-[0.42] min-[430px]:scale-[0.46] sm:scale-[0.58] xl:scale-[0.6]" : "scale-[0.35]";
  const template = getTemplateById(templateId);
  const previewData = data === defaultResumeData && template.supportsPhoto ? { ...data, personal: { ...data.personal, photoUrl: mockPhotoUrl } } : data;

  return (
    <div className={`relative max-w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${scale === "builder" ? "min-h-[510px] p-3 min-[430px]:min-h-[560px] sm:min-h-[780px] sm:p-5" : "h-[330px]"}`}>
      <div className={`absolute left-1/2 h-[1123px] w-[794px] origin-top -translate-x-1/2 overflow-hidden bg-white shadow-xl ${scale === "builder" ? "top-4" : "top-3"} ${previewScale}`}>
        <ResumeRenderer data={previewData} sectionOrder={sectionOrder} templateId={templateId} isWatermarked={false} />
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
