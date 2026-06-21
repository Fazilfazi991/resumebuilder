import type { ResumeData } from "@/types/resume";
import { resumeTypography } from "./resume-typography";
import { contactItems } from "./template-utils";

export function ContactLine({ data, align = "left", separator = " | ", className = "" }: { data: ResumeData; align?: "left" | "center" | "right"; separator?: string; className?: string }) {
  const items = contactItems(data);
  if (!items.length) return null;

  return (
    <p className={`max-w-full overflow-hidden break-words text-slate-600 ${align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"} ${className}`} style={{ fontSize: resumeTypography.contact, lineHeight: resumeTypography.lineHeightBody }}>
      {items.join(separator)}
    </p>
  );
}
