import type { ResumeData } from "@/types/resume";

export const hasText = (value?: string | null) => Boolean(value?.trim());
export const hasItems = <T,>(items?: T[]) => Boolean(items?.length);

export function contactItems(data: ResumeData) {
  return [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.website,
    data.personal.linkedin,
    data.personal.portfolio,
  ].filter(hasText) as string[];
}

export function dateRange(start: string, end: string, isCurrent = false) {
  return [start, isCurrent ? "Present" : end].filter(hasText).join(" - ");
}

export function orderedSections(preferred: string[], sectionOrder: string[]) {
  return [...preferred, ...sectionOrder.filter((section) => !preferred.includes(section))];
}
