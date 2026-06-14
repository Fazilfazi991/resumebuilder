import { defaultResumeData, defaultSectionOrder } from "@/lib/resume/mock-data";
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

  return (
    <div className={`relative max-w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${scale === "builder" ? "min-h-[510px] p-3 min-[430px]:min-h-[560px] sm:min-h-[780px] sm:p-5" : "h-[330px]"}`}>
      <div className={`absolute left-1/2 h-[1123px] w-[794px] origin-top -translate-x-1/2 overflow-hidden bg-white shadow-xl ${scale === "builder" ? "top-4" : "top-3"} ${previewScale}`}>
        <ResumeRenderer data={data} sectionOrder={sectionOrder} templateId={templateId} isWatermarked={false} />
      </div>
    </div>
  );
}
