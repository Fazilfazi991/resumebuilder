"use server";

import { createResume } from "@/lib/resume/server";
import type { ResumeData } from "@/types/resume";

export async function saveGuestResume(payload: {
  title: string;
  templateId: string;
  resumeData: ResumeData;
  sectionOrder: string[];
}) {
  const resume = await createResume({
    title: payload.title || "Imported Guest Resume",
    templateId: payload.templateId || "modern-minimal",
    resumeData: payload.resumeData,
    sectionOrder: payload.sectionOrder,
  });

  return resume.id;
}
