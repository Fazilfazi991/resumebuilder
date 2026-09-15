import type { ResumeData } from "@/types/resume";

type DraftPayload = {
  title: string;
  templateId: string;
  resumeData: ResumeData;
  sectionOrder: string[];
};

export function shouldOfferDraftRecovery(
  draft: DraftPayload & { updatedAt: string },
  cloud: DraftPayload,
  cloudUpdatedAt?: string,
) {
  // A local write can occur after the cloud save without changing the payload.
  // Content takes precedence over timestamps to avoid a false recovery prompt.
  if (
    draft.title === cloud.title &&
    draft.templateId === cloud.templateId &&
    JSON.stringify(draft.resumeData) === JSON.stringify(cloud.resumeData) &&
    JSON.stringify(draft.sectionOrder) === JSON.stringify(cloud.sectionOrder)
  ) return false;

  return !cloudUpdatedAt || new Date(draft.updatedAt).getTime() > new Date(cloudUpdatedAt).getTime();
}
