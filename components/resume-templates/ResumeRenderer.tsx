import { getTemplateById } from "@/lib/resume/template-registry";
import type { ResumeData } from "@/types/resume";

type ResumeRendererProps = {
  data: ResumeData;
  sectionOrder: string[];
  templateId: string;
  isWatermarked?: boolean;
};

export function ResumeRenderer({ data, sectionOrder, templateId, isWatermarked }: ResumeRendererProps) {
  const template = getTemplateById(templateId);
  const Component = template.component ?? getTemplateById("classic-ats").component;

  if (!Component) {
    return null;
  }

  return <Component data={data} sectionOrder={sectionOrder} isWatermarked={isWatermarked} />;
}
