import type { ResumeData } from "@/types/resume";

type DraftPayload = {
  title: string;
  templateId: string;
  resumeData: ResumeData;
  sectionOrder: string[];
};

function serializeContent(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(serializeContent).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .sort(([first], [second]) => first.localeCompare(second));
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${serializeContent(entry)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export function hasSameDraftContent(first: DraftPayload, second: DraftPayload) {
  return first.title === second.title &&
    first.templateId === second.templateId &&
    serializeContent(first.resumeData) === serializeContent(second.resumeData) &&
    serializeContent(first.sectionOrder) === serializeContent(second.sectionOrder);
}

export function shouldOfferDraftRecovery(
  draft: DraftPayload & { updatedAt: string },
  cloud: DraftPayload,
  cloudUpdatedAt?: string,
) {
  // A local write can occur after the cloud save without changing the payload.
  // Content takes precedence over timestamps to avoid a false recovery prompt.
  if (hasSameDraftContent(draft, cloud)) return false;

  return !cloudUpdatedAt || new Date(draft.updatedAt).getTime() > new Date(cloudUpdatedAt).getTime();
}
