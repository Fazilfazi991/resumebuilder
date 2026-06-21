import type { ResumeData } from "@/types/resume";
import { ResumeContactBlock } from "./ResumeContactBlock";

export function ContactLine({ data, align = "left", separator = " | ", className = "" }: { data: ResumeData; align?: "left" | "center" | "right"; separator?: string; className?: string }) {
  void separator;
  return <ResumeContactBlock personal={data.personal} align={align} className={`text-slate-600 ${className}`} />;
}
